import { create } from "zustand"
import { QuizState } from "@/app/types"

export const useQuizStore = create<QuizState>()((set) => ({
    questions: [],
    selectedAnswers: [],
    isQuizOver: false,
    setQuestions: (newQuestions) => set({ questions: newQuestions }),
    selectAnswer: (sectionId, buttonId, isCorrect) => {
        set((state) => {
            const isExisting = state.selectedAnswers.find(answer => answer.sectionId === sectionId)

            if (isExisting) {
                return {
                    selectedAnswers: state.selectedAnswers.map(answer => answer.sectionId === sectionId ? { ...answer, buttonId, isCorrect } : answer)
                }
            } else {
                return {
                    selectedAnswers: [...state.selectedAnswers, { sectionId, buttonId, isCorrect }]
                }
            }
        })
    },
    resetGame: () => set({ 
        selectedAnswers: [],
        questions: [],
        isQuizOver: false
    }),
    setIsQuizOver: (newIsQuizOver) => set({ isQuizOver: newIsQuizOver })
}))