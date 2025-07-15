export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">Hi, I'm Muhammad Marzouk Baig</h1>
      <p className="text-xl md:text-2xl max-w-2xl">I am an aspiring Full Stack Engineer</p>
      <a
        href="#projects"
        className="mt-8 px-6 py-3 bg-white text-black rounded shadow hover:bg-gray-200 transition"
      >
        View My Work
      </a>
    </section>
  );
}