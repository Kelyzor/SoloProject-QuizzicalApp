import { useState, useEffect } from 'react'
import StartMenu from './StartMenu'
import Quiz from './Quiz'

export default function App() {
  const [isQuizStarted, setIsQuizStarted] = useState(false)

  function toggleQuiz() {
    setIsQuizStarted(prev => !prev)
  }

  return (
    <>
      {isQuizStarted ? 
        <Quiz toggleQuiz={toggleQuiz} /> : 
        <StartMenu toggleQuiz={toggleQuiz} />}
    </>
  )
}

