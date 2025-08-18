import { useState } from 'react'
import StartMenu from './StartMenu'
import Quiz from './Quiz'

export default function App() {
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false)

  function toggleQuiz():void {
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

