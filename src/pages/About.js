import React from 'react';
import Navbar from '../components/Navbar';
import AboutComp from '../components/About';
import ScrollToTop from '../components/utils/ScrollToTop'

const About = () => {
  return (
    <section className='bg-preto min-h-screen'>
        <ScrollToTop />
        <Navbar />
        <AboutComp />
    </section>
  )
}

export default About