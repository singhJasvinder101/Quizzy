import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Line } from 'rc-progress';
import { alphanumeric } from '../utils/alphabeticNumerals';

export default function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  const limit = searchParams.get('limit')
  const [currQues, setcurrQues] = useState(1)
  const [selectedAns, setselectedAns] = useState("")
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [progress, setProgress] = useState(0)
  const [score, setScore] = useState(0)

  const savedState = localStorage.getItem('quizState');
  const questionsSaved = localStorage.getItem('quiz_questions');
  useEffect(() => {
    const parsedState = JSON.parse(savedState);
    if (parsedState) {
      setcurrQues(parsedState.currQues);
      setselectedAns(parsedState.selectedAns);
      setTotalAnswered(parsedState.totalAnswered);
      setProgress(parsedState.progress);
      setScore(parsedState.score);
      setQuestions(JSON.parse(questionsSaved) || [])
    }
  }, []);

  useEffect(() => {
    const quizState = {
      currQues,
      selectedAns,
      totalAnswered,
      progress,
      score,
    };
    localStorage.setItem('quizState', JSON.stringify(quizState));
  }, [currQues, selectedAns, score]);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&difficulty=${difficulty}&limit=${limit}`)
        const data = await res.json();
        setQuestions(data)
        localStorage.setItem('quiz_questions', JSON.stringify(data));
      } catch (error) {
        console.log(error)
      }
    }
    if (!questionsSaved) {
      fetchQuestions();
    }
  }, [category, difficulty, limit])

  const handleShuffle = async (correctAns, incorrectAns) => {
    const shuffledAnswers = [...incorrectAns]
    shuffledAnswers.push(correctAns)
    shuffledAnswers.sort(() => Math.random() - 0.5)
    setAnswers(shuffledAnswers)
  }


  useEffect(() => {
    if (questions.length > 0) {
      setProgress((currQues / questions.length) * 100)
      handleShuffle(questions[currQues - 1]?.correctAnswer, questions[currQues - 1]?.incorrectAnswers)
    }
  }, [currQues, questions])


  const handleQuit = () => {
    // remove from storage 
    localStorage.removeItem('quiz_questions')
    localStorage.removeItem('quizState')
    setTimeout(() => {
      navigate('/')
    }, 100);
  }

  const handleCheck = (answer) => {
    // console.log(questions[currQues - 1], answer)
    setselectedAns(answer)
    if (answer === questions[currQues - 1].correctAnswer) {
      setScore(prev => prev + 1)
    }
    setTotalAnswered(prev => prev + 1)
  }

  const handleSelect = (i) => {
    if (selectedAns === i && selectedAns === questions[currQues - 1].correctAnswer)
      return "correct";
    else if (selectedAns === i && selectedAns !== questions[currQues - 1].correctAnswer)
      return "incorrect";
    else if (i === questions[currQues - 1].correctAnswer) return "correct";
  }

  const handleNext = () => {
    if (currQues <= questions.length) {
      setcurrQues(prev => prev + 1)
      setselectedAns("")
    }
    setProgress(prev => prev + (totalAnswered / questions.length) * 100)
  }

  const handleShowResult = () => {
    navigate('/results')
  }

  return (
    <div className="wrapper">
      <div className="bg-white p-4 shadow-md w-full md:w-[80%] lg:w-[70%] max-w-5xl rounded-md">
        <h1 className="heading">All The Best !!</h1>
        {/* <Separator className="mb-3" /> */}
        <Line percent={progress} strokeWidth={1} strokeColor="#F97316" />
        <div className="flex justify-between py-5 px-2 font-bold text-md">
          <p>Category: {category}</p>
          <p>Score: {score}</p>
        </div>
        <div className="flex flex-col  min-h-[70vh] p-10 gap-4 w-full">
          {questions.length > 0 && (
            <>
              <h2 className="text-2xl text-center font-medium">{`Q${currQues
                }. ${questions[currQues - 1]?.question}`}</h2>

              {answers?.map((answer, i) => (
                <button
                  key={i}
                  className={`option inline hover:bg-orange-400 cursor-pointer transition duration-550 ${selectedAns && 'hover:cursor-not-allowed' && handleSelect(answer)}`}
                  disabled={!!selectedAns}
                  onClick={() => handleCheck(answer)}
                >
                  {alphanumeric(i)}
                  {answer}
                </button>
              ))}

              <div className="flex mt-5 md:justify-between md:flex-row flex-col gap-4 md:gap-0 mx-auto max-w-xs w-full">
                <button className='bg-orange-500 text-white font-bold px-3 py-2 rounded-md'
                  disabled={!selectedAns}
                  onClick={() =>
                    questions.length === currQues
                      ? handleShowResult()
                      : handleNext()
                  }
                >
                  {questions.length != currQues
                    ? "Next Question"
                    : "Show Results"}
                </button>
                <button className='bg-red-500 text-white font-bold px-3 py-2 rounded-md' onClick={handleQuit}>
                  Quit Quiz
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
