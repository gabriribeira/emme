import React from 'react';
import Navbar from '../components/Navbar';
import SuggestionsComp from '../components/Suggestions';
import Authorization from '../components/Authorization';
import ScrollToTop from '../components/utils/ScrollToTop';

const Suggestions = () => {
  return (
    <section className='bg-rosa min-h-screen'>
      <ScrollToTop />
      <Authorization />
      <Navbar />
      <SuggestionsComp />
    </section>
  )
}

export default Suggestions