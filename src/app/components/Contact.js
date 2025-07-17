'use client';

import { useForm, ValidationError } from '@formspree/react';
import { FaLinkedin, FaGithub, FaFacebook } from 'react-icons/fa';

export default function Contact() {
  const [state, handleSubmit] = useForm("xjkokyaa");

  if (state.succeeded) {
    return <p className="text-green-500 text-center mt-4">Thank you! Your message has been sent.</p>;
  }

  return (
    <section id="contact" className="bg-black text-white py-10 px-4 md:px-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Me</h2>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4">
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="bg-black border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <ValidationError prefix="Name" field="name" errors={state.errors} />

        <input
          id="email"
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="bg-black border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />

        <textarea
          id="message"
          name="message"
          placeholder="Your Message"
          required
          rows="4"
          className="bg-black border border-gray-600 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />

        <button
          type="submit"
          disabled={state.submitting}
          className="bg-blue-600 text-white text-sm font-medium rounded px-4 py-2 hover:bg-purple-700 transition"
        >
          Send Message
        </button>
      </form>

      {/* Social Icons */}
      <div className="mt-10 flex justify-center gap-8 text-2xl">
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          <FaGithub className="hover:text-purple-500 transition" />
        </a>
        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="hover:text-purple-500 transition" />
        </a>
        <a href="https://facebook.com/yourusername" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="hover:text-purple-500 transition" />
        </a>
      </div>
    </section>
  );
}
