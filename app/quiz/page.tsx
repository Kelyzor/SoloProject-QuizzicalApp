"use client"

import { nanoid } from "nanoid"
import { useEffect, useState, useRef } from "react"
import type { JSX } from "react"
import clsx from "clsx"
import * as he from "he"
import { Loader } from "lucide-react";
import Link from "next/link"
import { useRouter } from "next/navigation"

type Answer = {
    id: string
    text: string
    isCorrect: boolean
}

type SelectedAnswer = {
    sectionId: string
    buttonId: string
    isCorrect: boolean
}

type Question = {
    type: string
    difficulty: string
    category: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

type PreparedQuestion = {
    type: string
    difficulty: string
    category: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
    sectionId: string
    answers: Answer[]
}

export default function Quiz(): JSX.Element {
    const [questions, setQuestions] = useState<PreparedQuestion[]>([])
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([])
    const [isQuizOver, setIsQuizOver] = useState<boolean>(false)
    const didFetch = useRef<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        if (didFetch.current) return
        didFetch.current = true

        function fetchData(retries = 5) {
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
                        const allAnswers: Answer[] = [...question.incorrect_answers, question.correct_answer].map((a: string): Answer => ({ id: nanoid(), text: he.decode(a), isCorrect: question.correct_answer === a ? true : false })).sort(() => Math.random() - 0.5)

                        return {
                            ...question,
                            question: he.decode(question.question),
                            sectionId,
                            answers: allAnswers
                        }
                    })
                    setQuestions(preparedQuestions)
                })
                .catch(err => console.error(err))
        }
        fetchData()
    }, [])


    function checkAnswers(): void {
        isQuizOver ? router.push("/") : setIsQuizOver(true)
    }

    function selectAnswer(sectionId: string, buttonId: string, isCorrect: boolean): void {
        setSelectedAnswers(prev => {
            const isExisting = prev.find(answer => answer.sectionId === sectionId)

            if (isExisting) {
                return prev.map(answer => answer.sectionId === sectionId ? { ...answer, buttonId, isCorrect } : answer)
            } else {
                return [...prev, { sectionId, buttonId, isCorrect }]
            }
        })
    }

    function getButtonStatus(isCorrect: boolean, isQuizOver: boolean, isSelected: boolean): string {
        if (isCorrect && isQuizOver) return "bg-[#94D7A2]";
        if (isCorrect && !isQuizOver && isSelected) return "bg-[#D6DBF5]";
        if (!isCorrect && isQuizOver && isSelected) return "bg-[#F8BCBC] opacity-50";
        if (!isCorrect && isQuizOver && !isSelected) return "border-[#4D5B9E] border opacity-50";
        if (!isCorrect && !isQuizOver && isSelected) return "bg-[#D6DBF5]";
        return "border-[#4D5B9E] border";
    }

    const renderQuestions: JSX.Element[] = questions.map((question: PreparedQuestion): JSX.Element => {
        return (
            <section key={question.sectionId} className="mt-3.5 lg:mt-6 w-full">
                <h2 className="font-bold text-[1em] leading-[120%] lg:text-[0.75em]">{question.question}</h2>
                <ul className="mt-3 lg:mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3 lg:mb-6">{
                    question.answers.map((a: Answer): JSX.Element => {
                        const isCorrect: boolean = a.isCorrect
                        const isSelected: boolean = selectedAnswers.some(sA => sA.buttonId === a.id)
                        const buttonStyle: string = clsx("active:scale-95 active:duration-50 rounded-lg pt-2 pb-2 pr-4 pl-4 font-medium font-inter text-[0.75em] lg:text-[0.5em]", getButtonStatus(isCorrect, isQuizOver, isSelected), isQuizOver ? "cursor-not-allowed" : "cursor-pointer")
                        return <button onClick={() => selectAnswer(question.sectionId, a.id, isCorrect)} disabled={isQuizOver} key={a.id} className={buttonStyle}>{a.text}</button>
                    })}
                </ul>
                <hr />
            </section>
        )
    })

    return (
        <>
            {questions.length !== 0 ?
                <main className="min-h-screen text-[1.25em] pt-4 pb-10 pr-6 pl-6 sm:pt-10 sm:pb-10 sm:pr-20 sm:pl-20 flex flex-col items-center justify-between bg">

                    {renderQuestions}

                    <section className="mt-9 flex flex-wrap items-center justify-center gap-5 text-center">

                        {isQuizOver && <p className="font-bold text-[0.75em]">You scored {selectedAnswers.filter(a => a.isCorrect).length}/{questions.length} correct answers</p>}

                        <button onClick={checkAnswers} className="font-inter bg-[#4D5B9E] hover:bg-[#414d8a] active:scale-95 active:duration-100 cursor-pointer text-[#F5F7FB] pt-2.5 pb-2.5 pr-6 pl-6 rounded-[10px] font-semibold text-[0.75em] lg:text-[0.625em]">
                            {isQuizOver ? "Play again" : "Check answers"}
                        </button>

                    </section>

                </main >
                :
                <div className="min-h-screen bg flex justify-center items-center"><Loader className="animate-spin w-20 h-20" /></div>}
        </>
    )
}