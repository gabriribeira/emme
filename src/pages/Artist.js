import React from 'react'
import Navbar from '../components/Navbar';
import ArtistHeader from '../components/Artist';
import Authorization from '../components/Authorization';
import ScrollToTop from '../components/utils/ScrollToTop'

const Artist = () => {
  return (
    <section className='bg-cinza'>
      <ScrollToTop />
      <Authorization />
      <Navbar />
      <ArtistHeader />
    </section>
  )
}

export default Artist