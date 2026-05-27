import Hero from './components/Hero.js'
import About from './components/About.js'
import Projects from './components/Projects.js'
import Contact from './components/Contact.js'
import Navbar from './components/Navbar.js'
import Experience from './components/Experience.js'
import CommandPalette from './components/CommandPalette.js'
import ScrollProgress from './components/ScrollProgress.js'
import Cursor from './components/Cursor.js'
import SmoothScroll from './components/SmoothScroll.js'
import NeuralBackground from './components/NeuralBackground.js'

export default function Home() {
  return (
    <>
      <NeuralBackground />
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <CommandPalette />
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