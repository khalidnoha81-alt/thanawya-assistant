import { Flashcard, QuizQuestion } from '../types';

export const THANAWEYA_VOCAB_CARDS: Flashcard[] = [
  {
    id: '1',
    word: 'Pioneer',
    phonetic: '/ˌpaɪəˈnɪər/',
    partOfSpeech: 'noun / verb',
    arabicMeaning: 'رائد / يبتكر أو يقود طريقاً',
    definition: 'A person who is among the first to explore or settle a new area or develop a new technique.',
    example: 'Dr. Magdi Yacoub is a famous pioneer in heart surgery.',
    collocations: ['medical pioneer', 'pioneer of modern literature', 'pioneer a new technique'],
    synonyms: ['innovator', 'trailblazer', 'founder'],
    antonyms: ['follower', 'imitator'],
    examNote: 'انتبه: تأتي كاسم (noun) بمعنى رائد، وتأتي كفعل (verb) بمعنى يبتكر أو يمهد الطريق لشيء جديد.',
    unit: 'Unit 1: Cultural Identity'
  },
  {
    id: '2',
    word: 'Perseverance',
    phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
    partOfSpeech: 'noun',
    arabicMeaning: 'المثابرة والمواظبة على الهدف',
    definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
    example: 'Her perseverance paid off when she got 98% in Thanaweya Amma.',
    collocations: ['show perseverance', 'perseverance and determination', 'through sheer perseverance'],
    synonyms: ['persistence', 'tenacity', 'determination'],
    antonyms: ['laziness', 'quitting', 'apathy'],
    examNote: 'الفعل منها persevere وحرف الجر معها in أو with. مثال: persevere in studying.',
    unit: 'Unit 2: Life Stories'
  },
  {
    id: '3',
    word: 'Sustainable',
    phonetic: '/səˈsteɪ.nə.bəl/',
    partOfSpeech: 'adjective',
    arabicMeaning: 'مستدام / صديق للبيئة وطويل الأمد',
    definition: 'Able to be maintained at a certain rate or level; conserving ecological balance.',
    example: 'Egypt has inaugurated many sustainable energy projects like Benban Solar Park.',
    collocations: ['sustainable development', 'sustainable energy', 'sustainable future'],
    synonyms: ['renewable', 'eco-friendly', 'viable'],
    antonyms: ['unsustainable', 'depleting', 'temporary'],
    examNote: 'تتكرر كثيراً في موضوعات التعبير والترجمة (التنمية المستدامة = Sustainable Development).',
    unit: 'Unit 5: The Future of Energy'
  },
  {
    id: '4',
    word: 'Procrastinate',
    phonetic: '/prəʊˈkræs.tɪ.neɪt/',
    partOfSpeech: 'verb',
    arabicMeaning: 'يسوّف / يؤجل عمل اليوم للغد',
    definition: 'Delay or postpone action; put off doing something.',
    example: 'Successful Thanaweya Amma students never procrastinate when doing their daily tasks.',
    collocations: ['tend to procrastinate', 'stop procrastinating', 'chronic procrastination'],
    synonyms: ['delay', 'postpone', 'put off'],
    antonyms: ['expedite', 'advance', 'take action'],
    examNote: 'الاسم منها Procrastination (التسويف)، ويساوي في المعنى تعبير "put off".',
    unit: 'Unit 7: Time Management'
  },
  {
    id: '5',
    word: 'Distinguish',
    phonetic: '/dɪˈstɪŋ.ɡwɪʃ/',
    partOfSpeech: 'verb',
    arabicMeaning: 'يميز بين شيئين / يفرق',
    definition: 'Recognize or treat someone or something as different.',
    example: 'It is essential to distinguish between fake news and reliable scientific facts.',
    collocations: ['distinguish between A and B', 'distinguish A from B', 'distinguish oneself'],
    synonyms: ['differentiate', 'discriminate', 'tell apart'],
    antonyms: ['confuse', 'mix up'],
    examNote: 'الصفة المشتقة منها Distinguished تعني (متميز أو مرموق)، مثل: a distinguished scientist.',
    unit: 'Unit 8: Critical Thinking'
  },
  {
    id: '6',
    word: 'Prejudice',
    phonetic: '/ˈpredʒ.ə.dɪs/',
    partOfSpeech: 'noun / verb',
    arabicMeaning: 'التعصب / التحيز غير العادل',
    definition: 'Preconceived opinion that is not based on reason or actual experience.',
    example: 'Education plays a vital role in overcoming racial and gender prejudice.',
    collocations: ['racial prejudice', 'deep-rooted prejudice', 'overcome prejudice'],
    synonyms: ['bias', 'discrimination', 'bigotry'],
    antonyms: ['fairness', 'impartiality', 'tolerance'],
    examNote: 'تتطابق مع كلمة Bias في أسئلة القراءة والمهارات (Bias by omission, bias by placement, bias by spin).',
    unit: 'Unit 3: Writing & Media Bias'
  }
];

export const THANAWEYA_GRAMMAR_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'While I ________ my English homework yesterday evening, the lights suddenly went out.',
    options: ['was doing', 'did', 'have done', 'had done'],
    correctIndex: 0,
    explanation: 'قاعدة While: يأتي بعدها ماضي مستمر (was/were + v-ing) للتعبير عن حدث كان مستمراً وقطعه حدث آخر في الماضي البسيط (went out).',
    category: 'Past Continuous & Past Simple',
    unit: 'Unit 1'
  },
  {
    id: 2,
    question: 'Mr. Mohamed ________ in this secondary school since 2015, and he still loves teaching there.',
    options: ['is working', 'has worked', 'had worked', 'worked'],
    correctIndex: 1,
    explanation: 'وجود كلمة "since 2015" مع عبارة "and he still..." يدل على أن الفعل بدأ في الماضي وما زال مستمراً حتى الآن، لذا نستخدم المضارع التام (Present Perfect: has worked).',
    category: 'Present Perfect',
    unit: 'Unit 2'
  },
  {
    id: 3,
    question: 'If you had revised the vocabulary carefully, you ________ the exam with flying colours.',
    options: ['would pass', 'will pass', 'would have passed', 'had passed'],
    correctIndex: 2,
    explanation: 'هذه الحالة الشرطية الثالثة (Third Conditional): جملة الشرط ماضي تام (had revised)، فيكون جواب الشرط (would have + p.p) للتعبير عن ندم أو موقف مستحيل تغييره في الماضي.',
    category: 'Conditionals (If-clauses)',
    unit: 'Unit 6'
  },
  {
    id: 4,
    question: 'The new Cairo monorail ________ by thousands of commuters every single day.',
    options: ['uses', 'is used', 'has used', 'was using'],
    correctIndex: 1,
    explanation: 'الجملة مبنية للمجهول في المضارع البسيط (Passive in Present Simple): الفاعل الحقيقي غير موجود في البداية بل المفعول (The monorail)، والقاعدة هي (am/is/are + p.p).',
    category: 'Passive Voice',
    unit: 'Unit 4'
  },
  {
    id: 5,
    question: 'Hardly ________ the summary when the bell rang for the final period.',
    options: ['he had finished', 'did he finish', 'had he finished', 'he finished'],
    correctIndex: 2,
    explanation: 'قاعدة الانقلاب (Inversion): عند بدء الجملة بكلمات مثل (Hardly / Scarcely / No sooner)، نضع الفعل المساعد قبل الفاعل كصيغة سؤال (Had + Subject + P.P).',
    category: 'Inversion & Negative Adverbs',
    unit: 'Unit 7'
  }
];

export const MOCK_EXAM_DATA = {
  title: 'امتحان تجريبي شامل - لغة إنجليزية ثانوية عامة (نظام حديث)',
  durationMinutes: 60,
  totalMarks: 50,
  mcqQuestions: [
    {
      id: 101,
      section: 'Vocabulary & Collocations',
      text: 'Dr. Zewail made great contributions to science that ________ the way for nanotechnology.',
      options: ['paved', 'walked', 'built', 'blocked'],
      correct: 0,
      tip: 'التعبير الشهير (pave the way for) يعني يمهد الطريق لـ.',
    },
    {
      id: 102,
      section: 'Grammar',
      text: 'I haven\'t seen Tamer since the last time we ________ at the sports club in Alexandria.',
      options: ['have met', 'met', 'had met', 'were meeting'],
      correct: 1,
      tip: 'بعد since عندما تتبع بجملة كاملة يكون زمنها ماضي بسيط (Past Simple: met).',
    },
    {
      id: 103,
      section: 'Vocabulary',
      text: 'Journalists must adhere to professional ethics and avoid any media ________ when reporting delicate news.',
      options: ['fairness', 'bias', 'objectivity', 'accuracy'],
      correct: 1,
      tip: 'كلمة bias تعني التحيز أو الانحياز وهي عكس objectivity.',
    },
    {
      id: 104,
      section: 'Grammar & Causative',
      text: 'The teacher got the students ________ the challenging essay before the end of the class.',
      options: ['write', 'to write', 'written', 'wrote'],
      correct: 1,
      tip: 'قاعدة السببية مع get: (get + person + to + infinitive). أما have فيأتي بعدها المصدر بدون to.',
    },
    {
      id: 105,
      section: 'Writing Skills & Punctuation',
      text: 'Which of the following sentences is correctly punctuated?',
      options: [
        'Although he was exhausted he continued studying for Thanaweya Amma.',
        'Although he was exhausted, he continued studying for Thanaweya Amma.',
        'Although he was exhausted; he continued studying for Thanaweya Amma.',
        'Although, he was exhausted he continued studying for Thanaweya Amma.'
      ],
      correct: 1,
      tip: 'عندما تبدأ الجملة برابط تناقض مثل Although في بداية الجملة المركبة، يجب وضع فاصلة (comma) بين الجملتين.',
    }
  ],
  readingPassage: {
    title: 'The Rise of Artificial Intelligence in Egyptian Modern Education',
    text: `Artificial intelligence (AI) is no longer a futuristic concept; it is transforming classrooms and study halls across the world, including Egypt. With Egypt's Vision 2030 emphasizing technological innovation and high-standard educational reforms, students are finding innovative digital companions that cater directly to individual learning curves.\n\nUnlike traditional lecture formats where a single teacher must attend to the disparate needs of over forty students, adaptive AI tools diagnose personal weaknesses instantly. For instance, a student struggling with relative clauses or phrasal verbs receives targeted remedial drills rather than redundant lectures. Moreover, instant optical character recognition (OCR) enables students to snap photos of complex exam papers and receive pedagogical breakdowns step by step.\n\nNevertheless, experts emphasize that artificial intelligence does not supplant the irreplaceable human teacher. Instead, it acts as a tireless tutor that empowers students with self-discipline, curiosity, and around-the-clock guidance. As Thanaweya Amma students prepare for high-stakes examinations, leveraging such intelligent technology fosters deeper cognitive mastery rather than rote memorization.`,
    questions: [
      {
        q: 'According to the passage, what is the primary advantage of AI in education compared to traditional lectures?',
        options: [
          'It replaces human teachers entirely.',
          'It diagnoses individual student weaknesses and tailors remedial drills.',
          'It makes exams substantially easier to pass.',
          'It eliminates the need for textbooks.'
        ],
        correct: 1,
        explanation: 'الفقرة الثانية تذكر صراحة: "adaptive AI tools diagnose personal weaknesses instantly... receives targeted remedial drills".'
      },
      {
        q: 'The underlined word "supplant" in the third paragraph is closest in meaning to:',
        options: ['replace', 'encourage', 'punish', 'neglect'],
        correct: 0,
        explanation: 'كلمة supplant تعني يستبدل أو يحل محل (replace)، وسياق الجملة: AI does not supplant the human teacher.'
      }
    ]
  },
  translationQuestions: [
    {
      id: 'tr-1',
      direction: 'ar_to_en',
      sourceText: 'يجب على الشباب استغلال أوقات فراغهم في اكتساب مهارات جديدة تساعدهم في المنافسة في سوق العمل المستقبلي.',
      modelAnswer: 'Youth must invest their leisure time in acquiring new skills that help them compete in the future job market.',
    },
    {
      id: 'tr-2',
      direction: 'en_to_ar',
      sourceText: 'Great achievements require unwavering determination, continuous hard work, and the ability to learn from failures.',
      modelAnswer: 'الإنجازات العظيمة تتطلب عزيمة لا تلين، وعملاً جاداً مستمراً، والقدرة على التعلم من الإخفاقات.',
    }
  ],
  writingPrompt: 'Write a persuasive essay of about 150-200 words on: "How time management and daily consistency lead to excellence in Thanaweya Amma examinations."'
};
