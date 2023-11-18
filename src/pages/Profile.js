import React from 'react';
import Navbar from '../components/Navbar';
import Authorization from '../components/Authorization';
import Profile from '../components/Profile';
import ScrollToTop from '../components/utils/ScrollToTop'

const profile = () => {
    return (
        <section className='bg-cinza min-h-screen'>
            <ScrollToTop />
            <Authorization />
            <Navbar />
            <Profile />
        </section>
    )
}

export default profile