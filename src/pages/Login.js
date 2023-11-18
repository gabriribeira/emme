import React from 'react';
import Navbar from '../components/Navbar';
import Authentication from '../components/Authentication';
import ScrollToTop from '../components/utils/ScrollToTop'

const Login = () => {
    return (
        <section className='bg-cinza min-h-screen'>
            <ScrollToTop />
            <Navbar />
            <div className='flex justify-between'>
                <Authentication />
            </div>
        </section>
    )
}

export default Login