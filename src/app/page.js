import Hero from './components/Hero.js'
import About from './components/About.js'
import Projects from './components/Projects.js'
import Contact from './components/Contact.js'
import Navbar from './components/Navbar.js'
import Experience from './components/Experience.js'

export default function Home() {
  return (
    <>
    <Navbar />
    <main className="flex flex-col mt-16">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </main>
    </>
  );
}