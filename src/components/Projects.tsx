
import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Projects = () => {
  const projects = [
    {
      title: 'Advanced Python Keylogger',
      description: 'A sophisticated keylogger with log encryption, Telegram bot integration, screenshot capture on window changes, and precise keystroke tracking per application window.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
      technologies: ['Python', 'Encryption', 'Telegram API', 'Windows API'],
      github: 'https://github.com/XayZay',
      live: null,
    },
    {
      title: 'Credentials Breach Checker',
      description: 'Online tool utilizing Have I Been Pwned API to check if user credentials have been compromised in data breaches, built entirely in Python.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
      technologies: ['Python', 'Have I Been Pwned API', 'Cybersecurity', 'Data Breach Analysis'],
      github: 'https://github.com/XayZay',
      live: null,
    },
    {
      title: 'Windows 11 VM Penetration Test',
      description: 'Successfully penetrated a Windows 11 virtual machine environment, demonstrating advanced cybersecurity skills and vulnerability assessment techniques.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      technologies: ['Penetration Testing', 'Windows 11', 'VM Security', 'Vulnerability Assessment'],
      github: null,
      live: null,
    },
    {
      title: 'Smart Home Automation System',
      description: 'Collaborative project with Cisco NetAcad and Covenant University focusing on IoT-based smart home automation and network configuration.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      technologies: ['IoT', 'Cisco', 'Hardware', 'Microcontrollers', 'Home Automation'],
      github: null,
      live: null,
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 bg-slate-800/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Here are some of my cybersecurity and IT projects that showcase my technical skills and passion for information security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-slate-700/50"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  {project.github && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github size={16} className="mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.live && (
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} className="mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {!project.github && !project.live && (
                    <div className="flex-1 text-center text-gray-500 py-2">
                      Project Details Available on Request
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
