"use client";

export default function Experience() {
  return (
    <section id="experience" className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Professional Experience</h2>

        <div className="space-y-8">
          {/* Example Experience Item */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-600">Software Engineer @ Acme Corp</h3>
            <p className="text-sm text-gray-500 mb-2">June 2021 – Present</p>
            <p className="text-gray-700">
              - Led development of internal tools using React and Node.js.<br/>
              - Improved performance by 30% via code optimizations.<br/>
              - Collaborated with cross-functional teams to deliver features on time.
            </p>
          </div>

          {/* Another Example */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-600">Intern @ Tech Startup</h3>
            <p className="text-sm text-gray-500 mb-2">Jan 2020 – May 2021</p>
            <p className="text-gray-700">
              - Built and deployed a marketing website with Next.js.<br/>
              - Integrated analytics and improved SEO.<br/>
              - Worked closely with designers to implement UI components.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
