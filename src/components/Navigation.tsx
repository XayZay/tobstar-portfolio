import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { profile } from '@/data/portfolio';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Now', href: '#about' },
  { name: 'Work', href: '#projects' },
  { name: 'Projects', href: '#projects' },
  { name: 'Uses', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#d8d3c5]/70 bg-[#f7f5ef]/90 backdrop-blur">
      <div className="mx-auto max-w-[980px] px-5">
        <div className="flex items-center justify-between py-5">
          <button
            onClick={() => scrollToSection('#home')}
            className="font-serif text-lg text-[#1f1f1d] transition hover:text-[#0f766e]"
          >
            {profile.handle}
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`border-b text-sm transition-colors duration-200 hover:border-[#1f1f1d] hover:text-[#1f1f1d] ${
                  activeSection === item.href.substring(1)
                    ? 'border-[#1f1f1d] text-[#1f1f1d]'
                    : 'border-transparent text-[#77736a]'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md border border-[#d8d3c5] p-2 text-[#1f1f1d] md:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="mb-4 rounded-md border border-[#d8d3c5] bg-[#fbfaf6] p-3 md:hidden">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full rounded-md px-3 py-2 text-left text-[#605c54] transition-colors duration-200 hover:bg-[#eee9dd] hover:text-[#1f1f1d]"
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
