import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import Experience from './components/Experience'
import CommandPalette from './components/CommandPalette'
import ScrollProgress from './components/ScrollProgress'
import NeuralBackground from './components/NeuralBackground'

export default function Home() {
  return (
    <>
      <NeuralBackground />
      <ScrollProgress />
      <Navbar />
      <CommandPalette />
      <main className="flex flex-col mt-16">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  );
}