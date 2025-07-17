"use client";

const projects = [
  {
    title: 'Project One',
    description: 'A web app for organizing tasks and improving productivity.',
    image: 'https://via.placeholder.com/280x373.png?text=Project+1',
    link: 'https://github.com/your-repo-1'
  },
  {
    title: 'Project Two',
    description: 'An AI-powered chatbot for customer service.',
    image: 'https://via.placeholder.com/280x373.png?text=Project+2',
    link: 'https://github.com/your-repo-2'
  },
  {
    title: 'Project Three',
    description: 'A fitness tracking app with social features.',
    image: 'https://via.placeholder.com/280x373.png?text=Project+3',
    link: 'https://github.com/your-repo-3'
  },
  {
    title: 'Project Four',
    description: 'A weather forecasting dashboard using real-time APIs.',
    image: 'https://via.placeholder.com/280x373.png?text=Project+4',
    link: 'https://github.com/your-repo-4'
  },
];

export default function ProjectsSection() {
  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-blue-200 to-blue-400 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map(({ title, description, image, link }, idx) => (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg shadow-md overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <img src={image} alt={title} className="w-full h-auto" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-700 text-sm">{description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
