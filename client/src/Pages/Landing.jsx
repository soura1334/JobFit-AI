import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import Footer from '../Components/Footer'
import AboutIt from '../Components/LandingPageParts/AboutIt'

const Landing = () => {
  return (
      <div className=''>
        <Navbar/>
        <Hero/>
        <AboutIt/>
        <Footer/>
    </div>
  )
}

export default Landing
