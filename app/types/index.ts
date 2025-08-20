export interface Answer {
    id: string
    text: string
    isCorrect: boolean
}

export interface SelectedAnswer {
    sectionId: string
    buttonId: string
    isCorrect: boolean
}

export interface Question {
    type: string
    difficulty: string
    category: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

export interface PreparedQuestion {
    type: string
    difficulty: string
    category: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
    sectionId: string
    answers: Answer[]
}

export interface QuizState {
    questions: PreparedQuestion[]
    selectedAnswers: SelectedAnswer[]
    isQuizOver: boolean
    setQuestions: (questions: PreparedQuestion[]) => void
    selectAnswer: (sectionId: string, buttonId: string, isCorrect: boolean) => void
    resetGame: () => void
    setIsQuizOver: (isQuizOver: boolean) => void
}