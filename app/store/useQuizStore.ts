import { create } from "zustand"
import { QuizState } from "@/app/types"

export const useQuizStore = create<QuizState>()((set) => ({
    // Array of questions
    questions: [],

    // Array of selected answers
    selectedAnswers: [],

    // Boolean game over or not
    isQuizOver: false,

    // Puts new questions
    setQuestions: (newQuestions) => set({ questions: newQuestions }),
    
    // Puts the new selected answer in a separate object if it is not in the list, 
    // otherwise changes the existing one to the values of the new one
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

    // Reset all values
    resetGame: () => set({
        selectedAnswers: [],
        questions: [],
        isQuizOver: false
    }),

    // Changing the game status to a new one
    setIsQuizOver: (newIsQuizOver) => set({ isQuizOver: newIsQuizOver })
}))