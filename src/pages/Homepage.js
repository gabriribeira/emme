import React from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Homepage/Carousel';
import Authorization from '../components/Authorization';
import Footer from '../components/Footer';
import ScrollToTop from '../components/utils/ScrollToTop'

const Homepage = () => {
  return (
    <section className='bg-cinza min-h-screen'>
      <ScrollToTop />
      <Authorization />
      <Navbar />
      <Carousel />
      <Footer />
    </section>
  )
}

export default Homepage