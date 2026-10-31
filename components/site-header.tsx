'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { WhatsAppCta } from './whatsapp-cta';

const links = [
  ['/services', 'How we help'],
  ['/research', 'Our approach'],
  ['/insights', 'Insights'],
  ['/about', 'About'],
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.body.classList.add('menu-open');
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" className="wordmark" aria-label="CapitalSense home">
          <span>Capital</span><b>Sense</b><i>.</i>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined}>{label}</Link>
          ))}
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <WhatsAppCta className="nav-cta">WhatsApp us</WhatsAppCta>
          <button
            className="mobile-menu icon-button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined}>{label}</Link>
          ))}
          <WhatsAppCta className="mobile-whatsapp">Chat on WhatsApp</WhatsAppCta>
        </nav>
      )}
    </header>
  );
}
