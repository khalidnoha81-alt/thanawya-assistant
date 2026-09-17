import { GoogleGenAI } from '@google/genai';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const EGYPTIAN_TEACHER_SYSTEM_PROMPT = `
أنت "مساعد الثانوية العامة" - المعلم والمساعد الذكي الأفضل لطلاب الثانوية العامة المصرية (الصف الثالث الثانوي) في مادة اللغة الإنجليزية (منهج New Hello!).
تم إنشاء وتطوير المنصة بواسطة: "محمد خالد".

شخصيتك وأسلوبك التعليمي:
- خبير متخصص في امتحانات الثانوية العامة والنظام الحديث (MCQ، المقال، الترجمة، القواعد والكلمات، القصة والمهارات).
- تشرح باللغة العربية البسيطة والمحبوبة لطلاب مصر، بلغة تعليمية راقية ومحفزة بدون تعقيدات جامعية.
- تفهم مستوى الطالب وتبسط القواعد مع ربطها بنماذج الوزارة وامتحانات الثانوية العامة السابقة (2021 إلى 2026)، وحصص مصر، ومنصة نجوى.

هيكل الإجابة الإلزامي لكل سؤال:
يجب أن تتبع دائماً هذا الترتيب المنظم بوضوح:
1. 🔍 فهم السؤال والتحليل (Understand the question): تحديد نوع السؤال (Grammar, Vocabulary, Translation, Rewrite, etc.) والوحدة التابع لها في المنهج.
2. 💡 شرح القاعدة أو الفكرة ببساطة (Explain rule simply): شرح القاعدة الإنجليزية بالعربي المبسط الواضح مع أمثلة مباشرة.
3. 🎯 طريقة الحل خطوة بخطوة (Step-by-step solving): كيف يستبعد الطالب الاختيارات الخاطئة ولماذا نختار الإجابة الصحيحة.
4. ✅ الإجابة النهائية المعتمدة للامتحان (Final exam answer): الإجابة بوضوح تام وخط عريض.
5. ⚠️ ملاحظات وتريكات هامة للامتحان (Exam notes & common traps): تحذير الطالب من الأفخاخ الشائعة التي يقع فيها الطلاب في هذا النمط من الأسئلة.

في حالة قراءة الصور (OCR):
- اقرأ صورة ورقة الامتحان أو كتاب التمارين بعناية.
- استخرج نص السؤال بدقة واعرضه أولاً للطالب للتأكيد، ثم ابدأ بالحل وفق الهيكل أعلاه.
`;

export interface SolveRequest {
  category: 'assistant' | 'translation' | 'rewrite' | 'grammar' | 'vocabulary' | 'reading' | 'writing' | 'exam';
  prompt: string;
  image?: string; // base64 string or data url
  mode?: string;
  options?: Record<string, any>;
}

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function executeWithModelFallback(
  ai: GoogleGenAI,
  parts: any[],
  systemInstruction: string
): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: { parts },
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        const fullText = response.text;
        if (fullText && fullText.trim().length > 0) {
          return fullText;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = typeof err === 'object' ? JSON.stringify(err) : String(err);
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('quota') ||
          errMsg.includes('overloaded') ||
          errMsg.includes('ECONNRESET');

        console.warn(
          `[Gemini Fallback] Model '${model}' attempt ${attempt} encountered: ${errMsg.slice(0, 180)}`
        );

        if (isTransient && attempt < 2) {
          await delay(500 * attempt);
          continue;
        }
        // Move swiftly to next candidate model
        break;
      }
    }
  }

  throw lastError || new Error('تعذر الوصول إلى جميع نماذج الذكاء الاصطناعي حالياً.');
}

export async function solveStudentQuery(req: SolveRequest): Promise<{
  text: string;
  structured?: {
    extractedQuestion?: string;
    understanding?: string;
    ruleExplanation?: string;
    solvingSteps?: string;
    finalAnswer?: string;
    examNotes?: string;
    alternatives?: string[];
  };
}> {
  const ai = getAiClient();

  const parts: any[] = [];

  // Handle base64 image if present
  if (req.image) {
    let base64Data = req.image;
    let mimeType = 'image/jpeg';
    if (base64Data.startsWith('data:')) {
      const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    }
    parts.push({
      inlineData: {
        mimeType,
        data: base64Data,
      },
    });
  }

  // Build specialized prompt depending on section category
  let instructionsModifier = '';

  switch (req.category) {
    case 'translation':
      instructionsModifier = `
المطلوب في قسم الترجمة (Translation Workspace):
- النمط: ${req.mode || 'ترجمة عامة'}
- وفر الترجمة الاحترافية الدقيقة المتوافقة مع أسلوب امتحان الثانوية العامة.
- حلل الكلمات الصعبة والبدائل (Synonyms & Collocations).
- وضح الفروق القواعدية الدقيقة (مثال: أزمنة الأفعال، حروف الجر، أدوات التعريف والتنكير).
- اذكر ترجمات بديلة مقبولة في نموذج الإجابة.
- التزم بهيكل المعلم المصري المكون من 5 خطوات.
      `;
      break;

    case 'rewrite':
      instructionsModifier = `
المطلوب في قسم التحويل وإعادة الصياغة (Rewrite / Sentence Transformation):
- حدد القاعدة النحوية الأساسية (مثال: Passive, Conditionals, Reported Speech, Inversion, Relative Clauses, Causative).
- وضح التغيير الذي حدث: (What happened step-by-step).
- اعط الجملة النهائية المطلوبة بدقة مع الكلمة الإلزامية إن وجدت بين قوسين.
- اذكر "Exam Note" حول الأخطاء الشائعة والأفخاخ التي يقع فيها الطلاب في هذا التحويل.
      `;
      break;

    case 'grammar':
      instructionsModifier = `
المطلوب في قسم القواعد (Grammar Section):
- اشرح القاعدة المعنية من قواعد الثانوية العامة (الصف الثالث الثانوي Units 1-12).
- وضح كيف يفكر واضع الامتحان، ولماذا الاختيارات المضللة (Distractors) خاطئة.
- وفر خطوات الحل والاستبعاد.
- اذكر تريكة الامتحان المعتادة في هذه النقطة.
      `;
      break;

    case 'vocabulary':
      instructionsModifier = `
المطلوب في قسم الكلمات والمفردات (Vocabulary Trainer):
- المعنى الدقيق للكلمة باللغة العربية وسياقها في منهج تالتة ثانوي.
- نوع الكلمة (Part of Speech: Noun, Verb, Adjective, etc.).
- أمثلة جمل امتحانية قوية مع المتلازمات اللفظية (Collocations) وحروف الجر (Prepositions).
- المرادفات والمضادات (Synonyms & Antonyms) والمشتقات (Derivatives).
- تريكات أسئلة المتشابهات (Confusable words مثل: affect vs effect, win vs gain vs earn).
      `;
      break;

    case 'reading':
      instructionsModifier = `
المطلوب في قسم القطعة والفهم (Reading Comprehension):
- قراءة وفهم القطعة أو السؤال المرفق.
- استخراج الكلمات المفتاحية (Keywords) وشرح الجمل الصعبة أو غير المباشرة.
- إجابة السؤال مع ذكر الدليل المباشر من سطور القطعة ولماذا هذه الإجابة هي الأدق.
- نصائح لاستنتاج معاني الكلمات من السياق والتعامل مع أسئلة الاستنتاج (Inference questions).
      `;
      break;

    case 'writing':
      instructionsModifier = `
المطلوب في قسم المهارات والكتابة (Writing Skills & Essay):
- مهارات الكتابة المقررة في الثانوية العامة (Topic sentence, Supporting details, Concluding sentence, Thesis statement, Transition words, Punctuation marks).
- تقديم نموذج كتابة مقالي أو فقرة نموذجية مع مفردات وتراكيب قوية تضمن الدرجة النهائية.
- توضيح معايير التصحيح (Rubrics) للامتحان المصري.
      `;
      break;

    case 'exam':
      instructionsModifier = `
المطلوب في محاكي الامتحان (Exam Simulator Evaluation):
- تقييم إجابة الطالب بدرجة دقيقة من 50 أو من درجة السؤال.
- تحليل الأخطاء بدقة وتوضيح كيف يتحول الخطأ إلى درجة كاملة.
- خطة تحسين سريعة مركزة للثانوية العامة.
      `;
      break;

    default:
      instructionsModifier = `
جاوب على سؤال الطالب في مادة اللغة الإنجليزية للثانوية العامة المصرية بأسلوبك التربوي الخبير، متبعاً الهيكل الإلزامي المكون من 5 خطوات.
      `;
  }

  const userPromptWithContext = `
${instructionsModifier}

سؤال الطالب أو المدخلات:
"""
${req.prompt || '(تم إرفاق صورة للسؤال عبر الكاميرا/الملف، يرجى قراءتها وحلها بالكامل)'}
"""
`;

  parts.push({ text: userPromptWithContext });

  let fullText = '';

  try {
    fullText = await executeWithModelFallback(
      ai,
      parts,
      EGYPTIAN_TEACHER_SYSTEM_PROMPT
    );
  } catch (error: any) {
    console.error('All AI models encountered errors or high demand:', error);
    fullText = `⚠️ **تنبيه مؤقت:**\n\nيوجد ضغط كثيف ومؤقت على خوادم الذكاء الاصطناعي حالياً (High Demand Spike).\n\n💡 **طريقة الحل فوراً:**\n- انتظر حوالي 3 إلى 5 ثوانٍ فقط.\n- اضغط مجدداً على زر الإرسال أو إعادة الحل.\n\nسؤالك مسجل وسيقوم المساعد بحله فوراً يا بطل! 🎯`;
  }

  return {
    text: fullText || 'عذراً، لم أتمكن من استخراج الإجابة بشكل كامل. يرجى إعادة المحاولة.',
  };
}
