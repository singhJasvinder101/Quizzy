import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Results() {
    const navigate = useNavigate()
    const handleSubmit = () => {
        localStorage.removeItem('quiz_questions')
        localStorage.removeItem('quizState')
        navigate('/')
    }
    const score = JSON.parse(localStorage.getItem('quizState')).score

    const getCompliment = (score) => {
        if (score < 3) {
            return "You can do better"
        } else if (score < 6) {
            return "Good Job"
        } else if (score < 8) {
            return "Great Job"
        } else {
            return "You are a genius"
        }
    }

    return (
        <div className="wrapper">
            <div className="bg-white p-4 shadow-md w-full md:w-[80%] lg:w-[70%] max-w-5xl rounded-md">
                <h1 className="heading">Results</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 p-5 md:p-10 gap-4">
                    <div className="relative h-full">
                        <img
                            src={"/results.webp"}
                            alt="results"
                            width={500}
                            height={500}
                            className="object-cover object-center"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl my-4 font-bold">You scored {score} out of 10</h2>
                        <p className="text-lg">{getCompliment(score)}</p>

                        <button className='bg-orange-500 my-3 text-white font-bold px-3 py-2 rounded-md' onClick={handleSubmit}>
                            Let's Play Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
