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
          I&apos;ve worked across the stack: developing Python SDKs, worked with API&apos;s, Mobile Apps, Web Apps, and Database Management.
          I enjoy solving challenging technical problems and designing robust solutions while mainitng proper documentation.
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
