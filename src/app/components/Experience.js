"use client";
import { experience } from '@/data/experience';

export default function Experience() {
  return (
    <section
      id="experience"
      className="min-h-screen py-20 bg-gradient-to-b from-[#1f1c2c] to-[#928dab] text-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">
          Experience
        </h2>

        <div className="relative border-l border-white/20 pl-12 space-y-12">
          {experience.map((job) => (
            <div key={job.id} className="relative group">
              <div className="absolute -left-8 top-2 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full shadow-md group-hover:scale-110 transition" />
              <div>
                <h3 className="text-lg font-semibold">
                  {job.role} @ {job.company}
                </h3>
                <p className="text-xs text-indigo-200 mt-1">{job.period}</p>
                <ul className="list-disc list-inside mt-2 text-white/80 space-y-1 text-sm">
                  {job.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}