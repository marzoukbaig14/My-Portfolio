export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col md:flex-row items-center justify-center px-8 py-20
                 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100"
    >
      <div className="md:w-1/2 flex flex-col items-start text-center md:text-left">
        <h2 className="text-6xl md:text-7xl font-bold text-indigo-500 tracking-tight mb-8">
          About Me
        </h2>
        <p className="text-lg md:text-xl leading-relaxed text-gray-800 max-w-2xl">
          Hi, I&apos;m Muhammad Marzouk Baig. I&apos;m a Computer Science graduate (University of Rochester, Dec 2024)
          with a strong foundation in data structures, algorithms, and practical software engineering.
          <br /><br />
          I&apos;ve worked across the stack: developing Python Modules, working with API&apos;s, Mobile Apps, Web Apps, and various Databases.
          I enjoy solving challenging technical problems and designing robust solutions while following programming best practices and maintaining proper documentation.
          <br /><br />
          I&apos;m passionate about writing clean, maintainable code, collaborating on meaningful projects, and learning new technologies.
          When I&apos;m not coding, I like exploring the evolving tech landscape, playing cricket and reading history.
        </p>
      </div>

      <div className="md:w-1/2 flex justify-center mt-12 md:mt-0">
        <img
          src="/images/my-profile-picture.jpg"
          alt="Muhammad Marzouk Baig"
          className="w-72 h-[27rem] rounded-2xl shadow-2xl object-cover border-4 border-indigo-300"
        />
      </div>
    </section>
  );
}

// console.log('motion:', motion);
// 'use client';
// import { motion } from 'framer-motion';
// import Image from 'next/image';

// export default function About() {
//   return (
//     <section
//       id="about"
//       className="min-h-screen flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 py-16 sm:py-20 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100"
//     >
//       <motion.div
//         className="md:w-1/2 flex flex-col items-start text-center md:text-left space-y-6 bg-white/80 p-6 sm:p-8 rounded-2xl shadow-lg"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: 'easeOut' }}
//       >
//         <motion.h2
//           className="text-5xl sm:text-6xl md:text-7xl font-bold text-indigo-500 tracking-tight mb-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: 'easeOut' }}
//         >
//           About Me
//         </motion.h2>
//         <motion.p
//           className="text-xl sm:text-2xl font-semibold text-gray-900 max-w-2xl"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
//         >
//           Hi, I&apos;m Muhammad Marzouk Baig.
//         </motion.p>
//         <motion.p
//           className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 max-w-2xl"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
//         >
//           I&apos;m a Computer Science graduate (University of Rochester, Dec 2024) with expertise in data structures, algorithms, and software engineering.
//         </motion.p>
//         <motion.p
//           className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 max-w-2xl"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
//         >
//           I&apos;ve built <span className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Python modules</span>, worked with <span className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">APIs</span>, and developed mobile and web applications. I thrive on solving complex technical challenges and designing robust solutions while maintaining proper documentation.
//         </motion.p>
//         <motion.p
//           className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 max-w-2xl"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
//         >
//           I&apos;m passionate about writing clean, maintainable code, collaborating on meaningful projects, and learning new technologies.
//         </motion.p>
//         <motion.p
//           className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 italic max-w-2xl"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }}
//         >
//           When I&apos;m not coding, I enjoy exploring the evolving tech landscape, playing cricket, and reading history.
//         </motion.p>
//       </motion.div>

//       <motion.div
//         className="md:w-1/2 flex justify-center mt-12 md:mt-0"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 1.3, duration: 0.8, ease: 'easeOut' }}
//       >
//         <Image
//           src="/images/my-profile-picture.jpg"
//           alt="Muhammad Marzouk Baig"
//           width={288}
//           height={432}
//           className="rounded-2xl shadow-2xl object-cover border-4 border-indigo-300"
//         />
//       </motion.div>
//     </section>
//   );
// }
