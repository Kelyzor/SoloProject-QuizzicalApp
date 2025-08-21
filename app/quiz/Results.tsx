import { useRouter } from "next/navigation"
import { useQuizStore } from "@/app/store/useQuizStore"
import { JSX } from "react"

export default function Results():JSX.Element {
    const router = useRouter()
    const { isQuizOver, setIsQuizOver, selectedAnswers, questions, resetGame } = useQuizStore()

    // If the game is over, then it resets the states and returns to the main menu,
    // otherwise sets the game status to over
    function checkAnswers(): void {
        if (isQuizOver) {
            resetGame()
            router.push("/")
        } else {
            setIsQuizOver(true)
        }
    }

    // Counts the number of correct answers out of the total number of answers
    const correctAnswersCount = `${selectedAnswers.filter(a => a.isCorrect).length}/${questions.length}`

    return (
        <section className="mt-9 flex flex-wrap items-center justify-center gap-5 text-center">

            {isQuizOver && <p className="font-bold text-[0.75em]">You scored {correctAnswersCount} correct answers</p>}

            <button onClick={checkAnswers} className="font-inter bg-button-bg hover:bg-button-bg-hover active:scale-95 active:duration-100 cursor-pointer text-button-text pt-2.5 pb-2.5 pr-6 pl-6 rounded-[10px] font-semibold text-[0.75em] lg:text-[0.625em]">
                {isQuizOver ? "Play again" : "Check answers"}
            </button>

        </section>
    )
}