import React from 'react';
import Authorization from '../components/Authorization';
import QuizComp from '../components/Testes/Quiz/index';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/utils/ScrollToTop'

const Quiz = () => {
    return (
        <div className='bg-rosa h-screen'>
            <ScrollToTop />
            <Authorization />
            <Navbar />
            <QuizComp />
        </div>
    )
}

export default Quiz