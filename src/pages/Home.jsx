import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import TechStack from '../components/TechStack'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import ScrollToTop from '../components/ScrollToTop'

export default function Home() {
  return (
    <div>
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <TechStack />
      <Contact />
      <ScrollToTop />
    </div>
  )
}
