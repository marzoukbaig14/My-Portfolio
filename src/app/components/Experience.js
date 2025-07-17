"use client";

export default function Experience() {
  return (
    <section
      id="experience"
      className="min-h-screen py-20 bg-gradient-to-b from-[#1f1c2c] to-[#928dab] text-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 font-display">
          Experience
        </h2>

        <div className="relative border-l border-white/20 pl-12 space-y-12">
          {/* Experience 1 */}
          <div className="relative group">
            <div className="absolute -left-8 top-2 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full shadow-md group-hover:scale-110 transition" />
            <div>
              <h3 className="text-lg font-semibold">IT Support Consultant @ Simon Business School</h3>
              <p className="text-xs text-indigo-200 mt-1">Jul 2023 – Dec 2024</p>
              <ul className="list-disc list-inside mt-2 text-white/80 space-y-1 text-sm">
                <li>Delivered technical support to faculty, staff, and students, resolving 100+ hardware and software issues monthly</li>
                <li>Designed and developed application widgets to automate network-based workflows like printing software</li>
                <li>Digitized IT documentation platform, boosting knowledge sharing by 30% and reducing training time for new employees.</li>
              </ul>
            </div>
          </div>

          {/* Experience 2 */}
          <div className="relative group">
            <div className="absolute -left-8 top-2 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full shadow-md group-hover:scale-110 transition" />
            <div>
              <h3 className="text-lg font-semibold">Software Engineering Intern @ 1010data</h3>
              <p className="text-xs text-indigo-200 mt-1">Jun 2022 – Aug 2022</p>
              <ul className="list-disc list-inside mt-2 text-white/80 space-y-1 text-sm">
                <li> Developed a Python SDK for the Client Interfacing Team, allowing access to 1010data tables</li>
                <li> SDK allowed graphical query visualizations via Python-to-XML 
translation for real-time integration in 1010's GUI</li>
                <li>Worked with existing API endpoints, enhancing usability, streamlining operations, and reducing code size </li>
                <li>Collaborated with Product and Client Interfacing Teams to develop Tech Demos for various teams within the company </li>
                <li>Wrote detailed documentation, incorporating examples, visualizations, and tailored use-cases, for developers and users</li>
              </ul>
            </div>
          </div>

          {/* Experience 3 */}
          <div className="relative group">
            <div className="absolute -left-8 top-2 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full shadow-md group-hover:scale-110 transition" />
            <div>
              <h3 className="text-lg font-semibold">Full Stack Engineer @ Cronus</h3>
              <p className="text-xs text-indigo-200 mt-1">Feb 2022 - Aug 2021</p>
              <ul className="list-disc list-inside mt-2 text-white/80 space-y-1 text-sm">
                <li>Integrated Google Places API into the Cronus Mobile Application, implementing auto-fill functionality for address fields etc. </li>
                <li>Developed a two-step user sign-up process using React-Native components and Firestore Database</li>
                <li>Assisted in prototyping the Vendor Profile screen using Figma templates, contributing to 10+ pages across the application </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
