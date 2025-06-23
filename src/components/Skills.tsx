import React from 'react';

export const Skills = () => {
  const skillCategories = [
    // ...existing code...
  ];

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Skills & Technologies
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Expertise in cybersecurity, system administration, and IT automation. 
            Constantly learning and improving my skills in the ever-evolving IT landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
            >
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 font-medium text-sm">{skill.name}</span>
                      <span className="text-purple-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 w-full max-w-2xl mx-auto">
            <div className="text-center flex-1 min-w-[120px]">
              <div className="text-3xl font-bold text-purple-400">5+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-600"></div>
            <div className="text-center flex-1 min-w-[120px]">
              <div className="text-3xl font-bold text-purple-400">15+</div>
              <div className="text-gray-300">Projects Completed</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-600"></div>
            <div className="text-center flex-1 min-w-[120px]">
              <div className="text-3xl font-bold text-purple-400">95%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};