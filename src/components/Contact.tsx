import { profile } from '@/data/portfolio';

const links = [
  { label: 'GitHub', href: 'github' },
  { label: 'LinkedIn', href: 'linkedin' },
  { label: 'Resume', href: 'resumeUrl' },
  { label: 'Email', href: 'email' },
] as const;

export const Contact = () => {
  const resolveHref = (key: (typeof links)[number]['href']) => {
    if (key === 'email') return `mailto:${profile.email}`;
    return profile[key];
  };

  return (
    <footer id="contact" className="mx-auto max-w-[980px] px-5 pb-16 pt-24">
      <div className="border-t border-[#d8d3c5] pt-10">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="font-serif text-2xl text-[#1f1f1d]">{profile.name}</h2>
            <a href={`mailto:${profile.email}`} className="mt-2 block text-sm text-[#605c54] transition hover:text-[#1f1f1d]">
              {profile.email}
            </a>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#77736a]">
              {profile.location}. Cloud Engineer and Network Engineer portfolio. Last updated July 2026.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#605c54]">
            {links.map((link, index) => (
              <span key={link.label} className="inline-flex gap-5">
                <a
                  href={resolveHref(link.href)}
                  target={link.href === 'email' ? '_self' : '_blank'}
                  rel={link.href === 'email' ? '' : 'noopener noreferrer'}
                  className="transition hover:text-[#1f1f1d]"
                >
                  {link.label}
                </a>
                {index < links.length - 1 && <span className="text-[#b4ad9f]">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
