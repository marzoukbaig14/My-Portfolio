'use client';

import { useState } from 'react';
import { FaLinkedin, FaGithub, FaFacebook } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thank you! Your message has been sent.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="bg-black text-white py-10 px-4 md:px-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Me</h2>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="bg-black border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="bg-black border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows="4"
          value={formData.message}
          onChange={handleChange}
          className="bg-black border border-gray-600 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white text-sm font-medium rounded px-4 py-2 hover:bg-purple-700 transition"
        >
          Send Message
        </button>
      </form>

      {status && <p className="mt-4 text-center text-green-500 text-sm">{status}</p>}

      <div className="mt-10 flex justify-center gap-8">
        <a
          href="https://linkedin.com/in/YOUR_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition"
        >
          <FaLinkedin size={32} />
        </a>
        <a
          href="https://github.com/YOUR_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition"
        >
          <FaGithub size={32} />
        </a>
        <a
          href="https://facebook.com/YOUR_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition"
        >
          <FaFacebook size={32} />
        </a>
      </div>
    </section>
  );
}
