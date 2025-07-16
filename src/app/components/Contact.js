'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just simulate submission
    setStatus('Thank you! Your message has been sent.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="min-h-screen bg-white text-gray-900 py-20 px-6 md:px-20">
      <h2 className="text-4xl font-bold mb-8 text-center">Contact Me</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col gap-6">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows="5"
          value={formData.message}
          onChange={handleChange}
          className="border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold rounded px-6 py-3 hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
      {status && <p className="mt-6 text-center text-green-600">{status}</p>}
    </section>
  );
}
