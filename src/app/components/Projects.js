"use client";

const projects = [
  {
    title: "COVID Sentiment Analysis",
    description: "A real-time Python tool for tracking public sentiment on COVID-19 using tweets and news data, with Pandas and Matplotlib for visualization.",
    image: "https://unsplash.it/280/373?image=1041",
    link: "https://github.com/marzoukbaig14"
  },
  {
    title: "AI-Powered Accessibility Extension",
    description: "A Chrome extension that extracts, summarizes, and reads web content aloud for visually impaired users using AI and TTS.",
    image: "/images/vv-b.jpg",
    link: "https://sites.google.com/u.rochester.edu/voicevault/home-accessibility-extension"
  },
  {
    title: "Distributed Version Control System",
    description: "A DVCS built in Rust with modular architecture, supporting commits, branches, and merge conflict resolution.",
    image: "/images/dvcs.png",
    link: "https://github.com/marzoukbaig14"
  },
  {
    title: "Gentrification Research Project",
    description: "Used ML models like logistic regression to study the effects of university proximity on Rochester neighborhoods.",
    image: "/images/analyis-i.png",
    link: "https://www.youtube.com/watch?v=9Nmesz_ZWVw&list=LL&index=36&t=736s&ab_channel=H%C3%A0Nguy%E1%BB%85n"
  }
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative isolate min-h-screen w-full px-4 py-16 sm:py-24 bg-white">
  {/* Background gradient blur */}
  <div
    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
    aria-hidden="true"
  >
    <div
      className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] 
                 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
      style={{
        clipPath:
          'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
      }}
    />
  </div>

  <div className="max-w-5xl mx-auto">
    <h2 className="text-4xl font-bold text-center text-indigo mb-16 font-display">Projects</h2>
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
      {projects.map(({ title, description, image, link }, idx) => (
        <a
  key={idx}
  href={link || '#'}
  target="_blank"
  rel="noopener noreferrer"
  className="block rounded-lg shadow-md overflow-hidden bg-black/30 backdrop-blur-md border border-white/10 
             hover:shadow-xl transition-shadow duration-300 max-w-xs mx-auto"
>
  <img src={image} alt={title} className="w-100 h-45 object-cover" />
  <div className="p-2 bg-black/70 backdrop-blur-sm">
    <h3 className="text-base font-semibold mb-1 text-white">{title}</h3>
    <p className="text-white text-xs">{description}</p>
  </div>
</a>
      ))}
    </div>
  </div>

  {/* Background gradient blur blob (bottom) */}
  <div
    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
    aria-hidden="true"
  >
    <div
      className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 
                 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
      style={{
        clipPath:
          'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
      }}
    />
  </div>
</section>
  );
}
