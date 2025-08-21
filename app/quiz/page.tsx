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
    // Flag to prevent re-request when re-rendering
    const didFetch = useRef<boolean>(false)

    // Select only the necessary variables from the repository, 
    // so that the component does not re-render when other parts of the state change
    const { questions, setQuestions, resetGame } = useQuizStore()

    const router = useRouter()

    // Effect for loading questions when mounting components
    useEffect((): void => {
        // If the data has already been loaded or has been loaded, exit
        if (didFetch.current) return
        didFetch.current = true // We set the flag that we started loading

        // Getting questions from the public API with error 429 (Too many requests)
        // @param retries - Number of remaining retries
        function fetchData(retries: number = 5): void {
            fetch("https://opentdb.com/api.php?amount=5&type=multiple")
                .then(res => {
                    if (res.status === 429) { // If the server asks you to wait (too many requests)
                        if (retries > 0) {
                            // We'll try again in 1 second
                            setTimeout(() => fetchData(retries - 1), 1000)
                            return 
                        } else {
                            // If you run out of retries, reset the game and go to the main menu
                            console.error("Too many requests, give up")
                            resetGame() // Reset the state
                            router.push("/") // Redirect
                            // Throw an error to prevent the then chain and go to catch
                            return Promise.reject("Too many requests, giving up")
                        }
                    }
                    return res.json()
                })
                .then(data => {
                    // We check that the data exists
                    if (!data) return

                    // Prepares questions for convenient code operation, going through each of them
                    const preparedQuestions: PreparedQuestion[] = data.results.map((question: Question): PreparedQuestion => {

                        // Generates an identifier for the question
                        const sectionId: string = nanoid()

                        // Performs the following actions: 
                        // 1. Takes all the answer options and goes through each of them 
                        // 2. Each answer turns into an object and assigns its identifier, decoded text, whether the answer is correct or not
                        // 3. Randomly places questions in the array
                        const allAnswers: Answer[] = shuffleArray([...question.incorrect_answers, question.correct_answer].map((a: string): Answer => ({ id: nanoid(), text: he.decode(a), isCorrect: question.correct_answer === a ? true : false })))

                        // Returns the past data of the question, decoding HTML elements
                        // and adding a sectionId and an AllAnswers array to each
                        return {
                            ...question,
                            question: he.decode(question.question),
                            sectionId,
                            answers: allAnswers
                        }
                    })

                    // Stores prepared questions in the repository
                    setQuestions(preparedQuestions)
                })
                .catch(err => {
                    // When an error is received, it is output to the console
                    console.error(err)
                })
        }
        fetchData()
    }, [setQuestions, resetGame, router])

    // Shuffles the array using the Fisher-Yates (Knut) algorithm
    function shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Checks if there are any questions, if not, the functionality is displayed, otherwise the Loader is displayed
    return questions.length > 0 ?
        <main className="min-h-screen text-[1.25em] pt-4 pb-10 pr-6 pl-6 sm:pt-10 sm:pb-10 sm:pr-20 sm:pl-20 flex flex-col items-center justify-between bg">
            <Questions />
            <Results />
        </main>
        :
        <Loader />
}