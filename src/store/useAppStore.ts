import { create } from 'zustand';

export type UserType = 'student' | 'guardian';
export type Medium = 'bangla' | 'english';
export type Group = 'science' | 'business' | 'humanities';
export type ExamPlace = 'school' | 'tuition' | 'coaching' | 'practice';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type QuestionPattern = 'MCQ' | 'SQ' | 'CQ';
export type ExamStatus = 'upcoming' | 'completed' | 'missed';
export type AppScreen =
  | 'onboarding'
  | 'profile-setup'
  | 'dashboard';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  tuitionName?: string;
  location?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
}

export interface Exam {
  id: string;
  subject: string;
  subjectId: string;
  date: string;
  time: string;
  duration?: number;
  place: ExamPlace;
  teacherId?: string;
  teacherName?: string;
  chapters: string[];
  questionPatterns: QuestionPattern[];
  fullMarks: number;
  passMarks?: number;
  priority: Priority;
  status: ExamStatus;
  obtainedMarks?: number;
  notes?: string;
  reminders: string[];
  createdAt: string;
}

export interface UserProfile {
  userType: UserType;
  studentName: string;
  className: number;
  medium: Medium;
  group?: Group;
  schoolName: string;
  subjects: Subject[];
  teachers: Teacher[];
}

export interface AppState {
  theme: 'light' | 'dark';
  screen: AppScreen;
  activeTab: 'exams' | 'stats' | 'home' | 'notifications' | 'profile';
  profile: UserProfile | null;
  exams: Exam[];
  onboardingComplete: boolean;
  profileSetupComplete: boolean;

  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setScreen: (screen: AppScreen) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setProfile: (profile: UserProfile) => void;
  addExam: (exam: Exam) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  completeOnboarding: () => void;
  completeProfileSetup: () => void;
  addTeacher: (teacher: Teacher) => void;
  removeTeacher: (id: string) => void;
  addSubject: (subject: Subject) => void;
  removeSubject: (id: string) => void;
}

const NCTB_SUBJECTS: Record<string, Record<string, Subject[]>> = {
  '1-5': {
    common: [
      { id: 'bangla', name: 'Bangla' },
      { id: 'english', name: 'English' },
      { id: 'math', name: 'Mathematics' },
      { id: 'bangladesh', name: 'Bangladesh & World' },
      { id: 'islam', name: 'Islam & Moral Education' },
      { id: 'science', name: 'Science' },
    ],
  },
  '6-8': {
    common: [
      { id: 'bangla1', name: 'Bangla 1st' },
      { id: 'bangla2', name: 'Bangla 2nd' },
      { id: 'english1', name: 'English 1st' },
      { id: 'english2', name: 'English 2nd' },
      { id: 'math', name: 'General Mathematics' },
      { id: 'science', name: 'Science' },
      { id: 'bgst', name: 'Bangladesh & Global Studies' },
      { id: 'islam', name: 'Islam & Moral Education' },
      { id: 'ict', name: 'ICT' },
      { id: 'arts', name: 'Arts & Culture' },
      { id: 'pe', name: 'Physical Education' },
    ],
  },
  '9-10': {
    science: [
      { id: 'bangla1', name: 'Bangla 1st' },
      { id: 'bangla2', name: 'Bangla 2nd' },
      { id: 'english1', name: 'English 1st' },
      { id: 'english2', name: 'English 2nd' },
      { id: 'genmath', name: 'General Mathematics' },
      { id: 'highermath', name: 'Higher Mathematics' },
      { id: 'physics', name: 'Physics' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'biology', name: 'Biology' },
      { id: 'ict', name: 'ICT' },
      { id: 'bgst', name: 'Bangladesh & Global Studies' },
      { id: 'religion', name: 'Religion' },
    ],
    business: [
      { id: 'bangla1', name: 'Bangla 1st' },
      { id: 'bangla2', name: 'Bangla 2nd' },
      { id: 'english1', name: 'English 1st' },
      { id: 'english2', name: 'English 2nd' },
      { id: 'genmath', name: 'General Mathematics' },
      { id: 'accounting', name: 'Accounting' },
      { id: 'business', name: 'Business Studies' },
      { id: 'finance', name: 'Finance & Banking' },
      { id: 'economics', name: 'Economics' },
      { id: 'ict', name: 'ICT' },
      { id: 'bgst', name: 'Bangladesh & Global Studies' },
      { id: 'religion', name: 'Religion' },
    ],
    humanities: [
      { id: 'bangla1', name: 'Bangla 1st' },
      { id: 'bangla2', name: 'Bangla 2nd' },
      { id: 'english1', name: 'English 1st' },
      { id: 'english2', name: 'English 2nd' },
      { id: 'genmath', name: 'General Mathematics' },
      { id: 'history', name: 'History of Bangladesh' },
      { id: 'civics', name: 'Civics & Citizenship' },
      { id: 'geography', name: 'Geography & Environment' },
      { id: 'sociology', name: 'Sociology' },
      { id: 'ict', name: 'ICT' },
      { id: 'bgst', name: 'Bangladesh & Global Studies' },
      { id: 'religion', name: 'Religion' },
    ],
  },
};

export const getSubjectsForClass = (className: number, group?: Group): Subject[] => {
  if (className <= 5) return NCTB_SUBJECTS['1-5'].common;
  if (className <= 8) return NCTB_SUBJECTS['6-8'].common;
  if (className <= 10) {
    const groupKey = group || 'science';
    return NCTB_SUBJECTS['9-10'][groupKey] || NCTB_SUBJECTS['9-10'].science;
  }
  return [];
};

const sampleExams: Exam[] = [
  {
    id: '1',
    subject: 'Physics',
    subjectId: 'physics',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    place: 'school',
    chapters: ['Chapter 1: Physical World', 'Chapter 2: Units & Measurement'],
    questionPatterns: ['MCQ', 'CQ'],
    fullMarks: 100,
    passMarks: 33,
    priority: 'high',
    status: 'upcoming',
    reminders: ['1 day before', '1 hour before'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    subject: 'Chemistry',
    subjectId: 'chemistry',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '09:00',
    place: 'tuition',
    teacherName: 'Mr. Rahman',
    chapters: ['Chapter 3: States of Matter'],
    questionPatterns: ['MCQ', 'SQ'],
    fullMarks: 50,
    passMarks: 17,
    priority: 'medium',
    status: 'upcoming',
    reminders: ['1 day before'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    subject: 'Mathematics',
    subjectId: 'genmath',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:00',
    place: 'school',
    chapters: ['Chapter 1: Sets', 'Chapter 2: Algebra'],
    questionPatterns: ['CQ'],
    fullMarks: 100,
    passMarks: 33,
    priority: 'high',
    status: 'completed',
    obtainedMarks: 82,
    reminders: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    subject: 'Biology',
    subjectId: 'biology',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:00',
    place: 'school',
    chapters: ['Chapter 2: Cell Biology'],
    questionPatterns: ['MCQ', 'SQ', 'CQ'],
    fullMarks: 100,
    passMarks: 33,
    priority: 'critical',
    status: 'upcoming',
    reminders: ['1 day before', '1 hour before'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    subject: 'English 1st',
    subjectId: 'english1',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    place: 'school',
    chapters: ['Unit 1', 'Unit 2'],
    questionPatterns: ['SQ', 'CQ'],
    fullMarks: 100,
    passMarks: 33,
    priority: 'medium',
    status: 'completed',
    obtainedMarks: 91,
    reminders: [],
    createdAt: new Date().toISOString(),
  },
];

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  screen: 'onboarding',
  activeTab: 'home',
  profile: null,
  exams: sampleExams,
  onboardingComplete: false,
  profileSetupComplete: false,

  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setScreen: (screen) => set({ screen }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setProfile: (profile) => set({ profile }),
  addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
  updateExam: (id, updates) =>
    set((state) => ({
      exams: state.exams.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),
  deleteExam: (id) => set((state) => ({ exams: state.exams.filter((e) => e.id !== id) })),
  completeOnboarding: () => set({ onboardingComplete: true, screen: 'profile-setup' }),
  completeProfileSetup: () => set({ profileSetupComplete: true, screen: 'dashboard' }),
  addTeacher: (teacher) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, teachers: [...state.profile.teachers, teacher] }
        : null,
    })),
  removeTeacher: (id) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, teachers: state.profile.teachers.filter((t) => t.id !== id) }
        : null,
    })),
  addSubject: (subject) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, subjects: [...state.profile.subjects, subject] }
        : null,
    })),
  removeSubject: (id) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, subjects: state.profile.subjects.filter((s) => s.id !== id) }
        : null,
    })),
}));
