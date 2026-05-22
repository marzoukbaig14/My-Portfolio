'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { profile } from '@/data/profile';

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 py-16 sm:py-20 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100"
    >
      <motion.div
        className="md:w-1/2 flex flex-col items-start text-center md:text-left space-y-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h2
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-indigo-500 tracking-tight mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          About Me
        </motion.h2>

        {profile.about.map((text, i) => (
          <motion.p
            key={i}
            className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.3 + i * 0.3, duration: 1, ease: "easeOut" }}
          >
            {text}
          </motion.p>
        ))}
      </motion.div>

      <motion.div
        className="md:w-1/2 flex justify-center mt-12 md:mt-0"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ delay: 1.8, duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src="/images/my-profile-picture.jpg"
          alt={profile.name}
          width={288}
          height={432}
          className="rounded-2xl shadow-2xl object-cover border-4 border-indigo-300"
        />
      </motion.div>
    </section>
  );
}