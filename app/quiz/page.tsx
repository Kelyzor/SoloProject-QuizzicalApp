"use client"

import { nanoid } from "nanoid"
import { useEffect, useRef } from "react"
import type { JSX } from "react"
import * as he from "he"
import Loader from "@/app/quiz/LoaderEl"
import Results from "@/app/quiz/Results"
import Questions from "@/app/quiz/Questions"
import { useQuizStore } from "@/app/store/useQuizStore"
import { Answer, Question, PreparedQuestion } from "@/app/types"
import { useRouter } from "next/navigation"

export default function Quiz(): JSX.Element {
    const didFetch = useRef<boolean>(false)
    const { questions, setQuestions, resetGame } = useQuizStore()
    const router = useRouter()

    useEffect((): void => {
        if (didFetch.current) return
        didFetch.current = true

        function fetchData(retries: number = 5): void {
            fetch("https://opentdb.com/api.php?amount=5&type=multiple")
                .then(res => {
                    if (res.status === 429) {
                        if (retries > 0) {
                            setTimeout(() => fetchData(retries - 1), 1000)
                        } else {
                            console.error("Too many requests, give up")
                        }
                        return Promise.reject("Too many requests")
                    }
                    return res.json()
                })
                .then(data => {
                    const preparedQuestions: PreparedQuestion[] = data.results.map((question: Question): PreparedQuestion => {
                        const sectionId: string = nanoid()
                        const allAnswers: Answer[] = shuffleArray([...question.incorrect_answers, question.correct_answer].map((a: string): Answer => ({ id: nanoid(), text: he.decode(a), isCorrect: question.correct_answer === a ? true : false })))

                        return {
                            ...question,
                            question: he.decode(question.question),
                            sectionId,
                            answers: allAnswers
                        }
                    })
                    setQuestions(preparedQuestions)
                })
                .catch(err => {
                    console.error(err)
                    if (retries === 0) {
                        resetGame()
                        router.push("/")
                    }
                })
        }
        fetchData()
    }, [setQuestions])

    function shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    return questions.length > 0 ?
        <main className="min-h-screen text-[1.25em] pt-4 pb-10 pr-6 pl-6 sm:pt-10 sm:pb-10 sm:pr-20 sm:pl-20 flex flex-col items-center justify-between bg">
            <Questions />
            <Results />
        </main>
        :
        <Loader />
}