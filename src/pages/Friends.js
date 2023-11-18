import React from 'react';
import Navbar from '../components/Navbar';
import Authorization from '../components/Authorization';
import Friends from '../components/Friends';
import ScrollToTop from '../components/utils/ScrollToTop'

const friends = () => {
    return (
        <section className='bg-cinza min-h-[102vh]'>
            <ScrollToTop />
            <Authorization />
            <Navbar />
            <Friends />
        </section>
    )
}

export default friends