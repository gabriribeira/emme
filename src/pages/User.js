import React from 'react';
import Navbar from '../components/Navbar';
import Authorization from '../components/Authorization';
import User from '../components/User';
import ScrollToTop from '../components/utils/ScrollToTop';

const profile = () => {
    return (
        <section className='bg-cinza min-h-screen'>
            <ScrollToTop />
            <Authorization />
            <Navbar />
            <User />
        </section>
    )
}

export default profile