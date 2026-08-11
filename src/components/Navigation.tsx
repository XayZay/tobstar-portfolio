import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { profile } from '@/data/portfolio';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Now', href: '/now' },
  { name: 'Work', href: '/work' },
  { name: 'Projects', href: '/projects' },
  { name: 'Uses', href: '/uses' },
  { name: 'Contact', href: '/contact' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const activePath = window.location.pathname.replace(/\/+$/, '') || '/';

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#d8d3c5]/70 bg-[#f7f5ef]/90 backdrop-blur">
      <div className="mx-auto max-w-[980px] px-5">
        <div className="flex items-center justify-between py-5">
          <a
            href="/"
            className="font-serif text-lg text-[#1f1f1d] transition hover:text-[#0f766e]"
          >
            {profile.handle}
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`border-b text-sm transition-colors duration-200 hover:border-[#1f1f1d] hover:text-[#1f1f1d] ${
                  activePath === item.href
                    ? 'border-[#1f1f1d] text-[#1f1f1d]'
                    : 'border-transparent text-[#77736a]'
                }`}
              >
                {item.name}
              </a>
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
              <a
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="block w-full rounded-md px-3 py-2 text-left text-[#605c54] transition-colors duration-200 hover:bg-[#eee9dd] hover:text-[#1f1f1d]"
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
