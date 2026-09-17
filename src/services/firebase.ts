import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  signInAnonymously
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDocFromServer,
  onSnapshot,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must supply firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard test connection as mandated by Firebase skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, local cache will be used.');
    }
    return false;
  }
}

// Error handling helper conforming to FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// User Profile Types
export interface StudentProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  studySection: 'علمي علوم' | 'علمي رياضة' | 'أدبي';
  targetCollege: string;
  targetEnglishScore: number;
  joinedAt: string;
  totalQuestionsSolved: number;
  streakDays: number;
  accuracyRate: number;
}

// Question History Log
export interface SolvedQuestion {
  id?: string;
  userId: string;
  category: 'translation' | 'rewrite' | 'grammar' | 'vocabulary' | 'reading' | 'writing' | 'assistant' | 'exam';
  prompt: string;
  imageThumbnail?: string;
  solution: string;
  createdAt: string;
  isBookmarked?: boolean;
}

// Saved / Bookmarked items
export interface SavedItem {
  id?: string;
  userId: string;
  title: string;
  category: 'vocab' | 'rule' | 'translation' | 'exam_tip';
  content: string;
  createdAt: string;
}

// Exam Attempt
export interface ExamAttemptRecord {
  id?: string;
  userId: string;
  examTitle: string;
  score: number;
  totalScore: number;
  percentage: number;
  timeSpentSeconds: number;
  breakdown: {
    grammarScore: number;
    vocabScore: number;
    translationScore: number;
    readingScore: number;
    writingScore: number;
  };
  feedback: string;
  createdAt: string;
}

// Helper: Sync / Fetch user profile
export async function getOrCreateStudentProfile(user: User): Promise<StudentProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as StudentProfile;
    } else {
      const newProfile: StudentProfile = {
        uid: user.uid,
        email: user.email || 'student@thanaweya.edu',
        displayName: user.displayName || 'طالب ثانوية عامة متميز',
        photoURL: user.photoURL || '',
        studySection: 'علمي علوم',
        targetCollege: 'كلية الطب البشري',
        targetEnglishScore: 50,
        joinedAt: new Date().toLocaleDateString('ar-EG'),
        totalQuestionsSolved: 0,
        streakDays: 1,
        accuracyRate: 94,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    // Return fallback profile if local fallback
    return {
      uid: user.uid,
      email: user.email || 'student@thanaweya.edu',
      displayName: user.displayName || 'طالب ثانوية عامة',
      studySection: 'علمي علوم',
      targetCollege: 'كلية الهندسة',
      targetEnglishScore: 50,
      joinedAt: new Date().toLocaleDateString('ar-EG'),
      totalQuestionsSolved: 0,
      streakDays: 1,
      accuracyRate: 94,
    };
  }
}

// Helper to strip undefined values so Firestore doesn't throw unsupported field error
function sanitizeFirestoreData<T extends Record<string, any>>(data: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        clean[key] = sanitizeFirestoreData(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

// Helper: Save solved question
export async function logSolvedQuestion(question: Omit<SolvedQuestion, 'id'>): Promise<string> {
  // If user is guest/not authenticated with Firebase Auth, keep it local
  if (!auth.currentUser || auth.currentUser.uid !== question.userId) {
    return 'guest-' + Date.now();
  }

  const path = `users/${question.userId}/history`;
  try {
    const payload = sanitizeFirestoreData({
      ...question,
      createdAt: new Date().toISOString(),
    });
    const docRef = await addDoc(collection(db, path), payload);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return 'local-' + Date.now();
  }
}

// Helper: Save exam attempt
export async function saveExamAttempt(attempt: Omit<ExamAttemptRecord, 'id'>): Promise<string> {
  // If user is guest/not authenticated with Firebase Auth, keep it local
  if (!auth.currentUser || auth.currentUser.uid !== attempt.userId) {
    return 'guest-exam-' + Date.now();
  }

  const path = `users/${attempt.userId}/exams`;
  try {
    const payload = sanitizeFirestoreData({
      ...attempt,
      createdAt: new Date().toISOString(),
    });
    const docRef = await addDoc(collection(db, path), payload);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return 'exam-' + Date.now();
  }
}
