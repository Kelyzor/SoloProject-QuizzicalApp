import { nanoid } from "nanoid"
import { useEffect, useState, useRef } from "react"
import clsx from "clsx"
import he from "he"
import { Loader } from "lucide-react";

export default function Quiz(props) {
    const [questions, setQuestions] = useState([])
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [isQuizOver, setIsQuizOver] = useState(false)
    const didFetch = useRef(false)

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
                    const preparedQuestions = data.results.map(question => {
                        const sectionId = nanoid()
                        const allAnswers = [...question.incorrect_answers, question.correct_answer].map(a => ({ id: nanoid(), text: he.decode(a), isCorrect: question.correct_answer === a ? true : false })).sort(() => Math.random() - 0.5)

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


    function checkAnswers() {
        isQuizOver ? props.toggleQuiz() : setIsQuizOver(true)
    }

    function selectAnswer(sectionId, buttonId, isCorrect) {
        setSelectedAnswers(prev => {
            const isExisting = prev.find(answer => answer.sectionId === sectionId)

            if (isExisting) {
                return prev.map(answer => answer.sectionId === sectionId ? { ...answer, buttonId, isCorrect } : answer)
            } else {
                return [...prev, { sectionId, buttonId, isCorrect }]
            }
        })
    }

    function getButtonStatus({ isCorrect, isQuizOver, isSelected }) {
        if (isCorrect && isQuizOver) return "bg-[#94D7A2]";
        if (isCorrect && !isQuizOver && isSelected) return "bg-[#D6DBF5]";
        if (!isCorrect && isQuizOver && isSelected) return "bg-[#F8BCBC] opacity-50";
        if (!isCorrect && isQuizOver && !isSelected) return "border-[#4D5B9E] border opacity-50";
        if (!isCorrect && !isQuizOver && isSelected) return "bg-[#D6DBF5]";
        return "border-[#4D5B9E] border";
    }

    const renderQuestions = questions.map(question => {
        return (
            <section key={question.sectionId} className="mt-3.5 w-full">
                <h2 className="font-bold">{question.question}</h2>
                <ul className="mt-3 flex gap-3 mb-[15px]">{
                    question.answers.map(a => {
                        const isCorrect = a.isCorrect
                        const isSelected = selectedAnswers.some(sA => sA.buttonId === a.id)
                        const buttonStyle = clsx("active:scale-95 active:duration-50 rounded-lg pt-1 pb-1 pr-4 pl-4 font-medium font-inter text-[0.625rem]", getButtonStatus({ isCorrect, isQuizOver, isSelected }), isQuizOver ? "cursor-not-allowed" : "cursor-pointer")
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
                <main className="min-h-screen pt-10 pb-10 pr-20 pl-20 flex flex-col items-center justify-between bg">

                    {renderQuestions}

                    <section className="mt-9 flex items-center gap-5">

                        {isQuizOver && <p className="font-bold text-xs">You scored {selectedAnswers.filter(a => a.isCorrect).length}/{questions.length} correct answers</p>}

                        <button onClick={checkAnswers} className="font-inter bg-[#4D5B9E] hover:bg-[#414d8a] active:scale-95 active:duration-100 cursor-pointer text-[#F5F7FB] pt-2.5 pb-2.5 pr-5 pl-5 rounded-[10px] font-semibold text-[0.625rem]">
                            {isQuizOver ? "Play again" : "Check answers"}
                        </button>

                    </section>

                </main >
                :
                <div className="min-h-screen bg flex justify-center items-center"><Loader className="animate-spin w-20 h-20" /></div>}
        </>
    )
}