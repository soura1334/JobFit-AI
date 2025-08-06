import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
import HeroAbout from "../Components/AboutPage/HeroAbout";
import Mission from "../Components/AboutPage/Mission";
import Features from "../Components/AboutPage/Features";
import Testimonials from "../Components/AboutPage/Testimonials";
import CTA from "../Components/AboutPage/CTA";

function About() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 w-full">
        <Navbar />
        <HeroAbout />
        <Mission />
        <Features />
        <Testimonials />
        <CTA />
        <Footer />
    </div>
  )
}

export default About;