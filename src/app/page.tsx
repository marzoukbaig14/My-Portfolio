import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import Experience from './components/Experience'
import CommandPalette from './components/CommandPalette'
import ScrollProgress from './components/ScrollProgress'
import SmoothScroll from './components/SmoothScroll'
import NeuralBackground from './components/NeuralBackground'

export default function Home() {
  return (
    <>
      <NeuralBackground />
      <SmoothScroll />
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