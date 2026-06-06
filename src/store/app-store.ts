import { create } from 'zustand'

export type ViewType = 'home' | 'subjects' | 'chapters' | 'quiz' | 'result' | 'scoreboard'

export interface StudentInfo {
  name: string
  className: string
  schoolName: string
}

export interface QuizResult {
  score: number
  totalPoints: number
  answers: Record<string, string>
  quizId: string
  timeTaken: number
}

interface AppStore {
  currentView: ViewType
  selectedGrade: number | null
  selectedSubject: string | null
  selectedQuizId: string | null
  studentInfo: StudentInfo | null
  quizResult: QuizResult | null
  previousView: ViewType | null

  // Actions
  setView: (view: ViewType) => void
  selectGrade: (grade: number) => void
  selectSubject: (subject: string) => void
  startQuiz: (quizId: string, studentInfo: StudentInfo) => void
  setQuizResult: (result: QuizResult) => void
  goBack: () => void
  goHome: () => void
}

const viewHistory: ViewType[] = []

export const useAppStore = create<AppStore>((set, get) => ({
  currentView: 'home',
  selectedGrade: null,
  selectedSubject: null,
  selectedQuizId: null,
  studentInfo: null,
  quizResult: null,
  previousView: null,

  setView: (view: ViewType) => {
    const currentView = get().currentView
    viewHistory.push(currentView)
    set({ currentView: view, previousView: currentView })
  },

  selectGrade: (grade: number) => {
    const currentView = get().currentView
    viewHistory.push(currentView)
    set({ selectedGrade: grade, currentView: 'subjects', previousView: currentView })
  },

  selectSubject: (subject: string) => {
    const currentView = get().currentView
    viewHistory.push(currentView)
    set({ selectedSubject: subject, currentView: 'chapters', previousView: currentView })
  },

  startQuiz: (quizId: string, studentInfo: StudentInfo) => {
    const currentView = get().currentView
    viewHistory.push(currentView)
    set({
      selectedQuizId: quizId,
      studentInfo,
      currentView: 'quiz',
      previousView: currentView,
      quizResult: null,
    })
  },

  setQuizResult: (result: QuizResult) => {
    const currentView = get().currentView
    viewHistory.push(currentView)
    set({
      quizResult: result,
      currentView: 'result',
      previousView: currentView,
    })
  },

  goBack: () => {
    const prevView = viewHistory.pop() || 'home'
    set({ currentView: prevView })
  },

  goHome: () => {
    viewHistory.length = 0
    set({
      currentView: 'home',
      selectedGrade: null,
      selectedSubject: null,
      selectedQuizId: null,
      studentInfo: null,
      quizResult: null,
      previousView: null,
    })
  },
}))
