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
      {/* top slant */}
      

      {/* bottom slant */}
      <div className="relative">
  <svg
    className="absolute top-0 w-full -mt-1"
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
  >
    <path fill="#fff" d="M0,0L1440,100L1440,0L0,0Z" />
  </svg>
</div>
      <About />
      <Experience />
      
      <div className="relative">
  <svg
    className="absolute top-0 w-full -mt-1"
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
  >
    <path fill="#fff" d="M0,0L1440,100L1440,0L0,0Z" />
  </svg>
</div>
      <Projects />
      <div className="my-12 border-t border-white w-full" />
      <Contact />
    </main>
    </>
  );
}