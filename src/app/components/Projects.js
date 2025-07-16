const projects = [
  {
    title: 'Portfolio Website',
    description: 'My personal portfolio built with Next.js and Tailwind CSS.',
    link: '#',
  },
  {
    title: 'Chat App',
    description: 'A realtime chat app using React and Firebase.',
    link: '#',
  },
  {
    title: 'E-commerce Store',
    description: 'Online store built with React and Stripe integration.',
    link: '#',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen bg-gray-100 text-gray-900 py-20 px-6 md:px-20">
      <h2 className="text-4xl font-bold mb-12 text-center">Projects</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {projects.map(({ title, description, link }, idx) => (
          <a
            key={idx}
            href={link}
            className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p>{description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}