"use client";
import Image from 'next/image';
import { projects } from '@/data/projects';

const featuredProject = projects.find(p => p.tier === 'featured');
const tier1Projects = projects.filter(p => p.tier === 'tier1');
const tier2Projects = projects.filter(p => p.tier === 'tier2');

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative isolate min-h-screen w-full px-4 py-16 sm:py-24 bg-white">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Projects</h2>

        {/* Featured project */}
        {featuredProject && (
          <div className="mb-12 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-2 block">
                    Featured Research
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{featuredProject.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{featuredProject.subtitle}</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  {featuredProject.github && (
                    <a href={featuredProject.github} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition">
                      GitHub
                    </a>
                  )}
                  {featuredProject.paper && (
                    <a href={featuredProject.paper} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium px-4 py-2 rounded-md border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition">
                      Paper PDF
                    </a>
                  )}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">{featuredProject.description}</p>
              <div className="flex flex-wrap gap-2">
                {featuredProject.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tier 1 projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {tier1Projects.map(project => (
            <div key={project.id} className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
              {project.image && (
                <div className="relative w-full h-40">
                  <Image src={project.image} alt={project.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{project.subtitle}</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
                    View on GitHub →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tier 2 projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {tier2Projects.map(project => (
            <div key={project.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{project.subtitle}</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
                    View on GitHub →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* More on GitHub */}
        <div className="text-center">
          <a href="https://github.com/marzoukbaig14" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
            More projects on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}