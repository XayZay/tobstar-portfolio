
import React from 'react';
import { Shield, Server, Cloud } from 'lucide-react';

export const About = () => {
  const features = [
    {
      icon: <Shield size={32} />,
      title: 'Cybersecurity & Networking',
      description: 'Protecting systems with network monitoring, firewalls, and cybersecurity tools.',
    },
    {
      icon: <Server size={32} />,
      title: 'System Administration',
      description: 'Managing endpoints, IT assets, and Windows server environments with expertise.',
    },
    {
      icon: <Cloud size={32} />,
      title: 'IT Automation & Cloud',
      description: 'Implementing cloud solutions and automating IT processes for efficiency.',
    },
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Me
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            I'm a computer science student who loves tech as a whole, with massive interests 
            in computer hardware, microcontrollers, system administration, networking and cybersecurity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">My Journey</h3>
            <p className="text-gray-300 leading-relaxed">
              My interest in technology started in high school, driven by curiosity and a love for figuring out how things work. 
              I spent a lot of time exploring computer hardware and gaining hands-on experience with system administration.
            </p>
            <p className="text-gray-300 leading-relaxed"> 
              As a Computer Science student, I've discovered a strong passion for networking, cybersecurity and IT automation. 
              With solid experience in Windows environments and a practical approach to learning I'm confident in my capabilities, and eager to expand my skill set and contribute meaningfully in the IT field.
            </p>
          </div>
          <div className="relative">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <div className="w-56 h-56 bg-slate-900 rounded-full flex items-center justify-center">
                <Shield size={64} className="text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300 border border-slate-700/50"
            >
              <div className="text-purple-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
