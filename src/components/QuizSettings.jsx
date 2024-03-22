import React from 'react'
import { useState } from 'react'
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { difficultyOptions, categoryOptions } from '../constants';


const customStyles = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        borderColor: state.isFocused ? 'orange-500' : 'orange-500',
    })
};
export default function QuizSettings() {
    const [category, setCategory] = useState("")
    const [difficulty, setDifficulty] = useState([])
    const [limit, setLimit] = useState(10)
    const [type, setType] = useState("")
    const navigate = useNavigate();


    // const options = [
    //     { value: 'Arts & Literature', label: 'Arts & Literature' },
    //     { value: 'easy', label: 'easy' },
    //     { value: 'vanilla', label: 'Vanilla' },
    // ];
    const handleSubmit = (e) => {
        e.preventDefault()
        navigate(`/quiz?category=${category}&difficulty=${difficulty}&limit=${limit}`)
    }

    const handleSelectCategory = (selectedValue) => {
        setCategory(selectedValue.value);
    };
    const handleSelectDifficulty = (selectedValue) => {
        setDifficulty(selectedValue.value);
    };
    const handleRangeChange = (e) => {
        setLimit(e.target.value);
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 md:gap-6">
            <h2 className="text-center tracking-wide text-lg md:text-xl lg:text-2xl font-bold">
                Quiz Settings
            </h2>
            <Select
                key={category.value}
                className='w-full lg:w-3/4 border-orange-500 outline-orange-500'
                defaultValue={category.value}
                onChange={handleSelectCategory}
                options={categoryOptions}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        primary25: '#F79B48',
                        primary: '#F97316',
                    },
                })}
                styles={{
                    borderRadius: '2rem'
                }}
            />
            <Select
                className='w-full lg:w-3/4 border-orange-500 outline-orange-500'
                defaultValue={difficulty}
                onChange={handleSelectDifficulty}
                options={difficultyOptions}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        primary25: '#F79B48',
                        primary: '#F97316',
                    },
                })}
                styles={{
                    borderRadius: '2rem'
                }}
            />
            <p className="text-xs lg:text-sm font-semibold">
                Total Questions: {limit}
            </p>
            <input
                type="range"
                min="1"
                max="100"
                value={limit}
                onChange={handleRangeChange}
            />

            <button onClick={handleSubmit} className='bg-orange-500 text-white px-3 py-2 rounded-md'>
                Start Quiz
            </button>

        </div>
    )
}
