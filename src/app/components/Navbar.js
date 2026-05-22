"use client";
import { useEffect, useState } from "react";
import { profile } from '@/data/profile';

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = isScrolled ? "bg-white shadow text-gray-800" : "bg-gradient-to-r from-[#475569] via-[#4f46e5] to-[#334155] text-white";
  const mobileBg = isScrolled ? "bg-white text-gray-800" : "bg-[#2d2b47] text-white";

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#hero" className="font-bold text-xl">Marzouk</a>

        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="text-sm font-medium hover:text-indigo-400 transition">{link.label}</a>
          ))}
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm font-semibold px-4 py-1.5 rounded-md border border-current hover:bg-white/10 transition">Resume</a>
        </div>

        <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className={`md:hidden px-6 pb-6 flex flex-col gap-4 ${mobileBg}`}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="text-sm font-medium hover:text-indigo-400 transition" onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold" onClick={() => setMenuOpen(false)}>Resume</a>
        </div>
      )}
    </nav>
  );
}