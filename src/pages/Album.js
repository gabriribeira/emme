import React from 'react'
import Navbar from '../components/Navbar';
import Album_content from '../components/Album';
import Authorization from '../components/Authorization';
import ScrollToTop from '../components/utils/ScrollToTop'

const Album = () => {
  return (
    <>
      <section className='bg-cinza min-h-screen'>
        <ScrollToTop />
        <Authorization />
        <Navbar />
        <Album_content />
      </section>

    </>
  )
}

export default Album