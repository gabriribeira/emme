import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Authorization from '../components/Authorization';
import Notifications from '../components/Notifications';
import ScrollToTop from '../components/utils/ScrollToTop'

const NotificationsComp = () => {
  return (
    <section className='bg-cinza min-h-screen'>
      <ScrollToTop />
      <Authorization />
      <Navbar />
      <Notifications />
      <Footer />
    </section>
  )
}

export default NotificationsComp