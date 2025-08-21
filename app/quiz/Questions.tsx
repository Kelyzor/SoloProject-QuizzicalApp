import type { JSX } from "react"
import clsx from "clsx"
import { useQuizStore } from "@/app/store/useQuizStore";
import { PreparedQuestion, Answer } from "@/app/types";
import { nanoid } from "nanoid";

export default function Questions(): JSX.Element[] {
    const { questions, selectedAnswers, selectAnswer, isQuizOver } = useQuizStore()

    function getMidGameStyle(isSelected: boolean): string {
        return isSelected ? "bg-answer-selected" : "border border-answer-border"
    }

    function getEndGameStyle(isCorrect: boolean, isSelected: boolean): string {
        if (isCorrect) {
            return "bg-answer-correct-over"
        } else {
            if (isSelected) {
                return "bg-answer-wrong-selected opacity-50"
            } else {
                return "border-answer-border border opacity-50"
            }
        }
    }

    function getButtonStatus(isCorrect: boolean, isSelected: boolean): string {
        return isQuizOver
            ? getEndGameStyle(isCorrect, isSelected)
            : getMidGameStyle(isSelected)
    }

    return questions.map((question: PreparedQuestion): JSX.Element => {
        return (
            <section key={question.sectionId} className="mt-3.5 lg:mt-6 w-full">
                <h2 className="font-bold text-[1em] leading-[120%] lg:text-[0.75em]">{question.question}</h2>
                <ul className="mt-3 lg:mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3 lg:mb-6">{
                    question.answers.map((a: Answer): JSX.Element => {
                        const isCorrect: boolean = a.isCorrect
                        const isSelected: boolean = selectedAnswers.some(sA => sA.buttonId === a.id)
                        const buttonStyle: string = clsx("active:scale-95 w-full h-full active:duration-50 rounded-lg pt-2 pb-2 pr-4 pl-4 font-medium font-inter text-[0.75em] lg:text-[0.5em]", getButtonStatus(isCorrect, isSelected), isQuizOver ? "cursor-not-allowed" : "cursor-pointer")
                        return <li key={nanoid()}>
                            <button
                                onClick={() => selectAnswer(question.sectionId, a.id, isCorrect)}
                                disabled={isQuizOver} key={a.id} className={buttonStyle}
                            >
                                {a.text}
                            </button>
                        </li>
                    })}
                </ul>
                <hr />
            </section>
        )
    })
}