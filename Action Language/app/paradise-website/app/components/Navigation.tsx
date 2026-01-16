'use client';

import { useState } from 'react';

interface DropdownProps {
  title: string;
  links: { href: string; label: string }[];
}

function Dropdown({ title, links }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      // Focus first link in dropdown
      const firstLink = e.currentTarget.parentElement?.querySelector('a');
      if (firstLink) (firstLink as HTMLElement).focus();
    }
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      // Return focus to button
      const button = e.currentTarget.parentElement?.parentElement?.parentElement?.querySelector('button');
      if (button) (button as HTMLElement).focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // Focus next link
      const nextLink = (e.currentTarget as HTMLElement).parentElement?.nextElementSibling?.querySelector('a');
      if (nextLink) (nextLink as HTMLElement).focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        // Return to button
        const button = e.currentTarget.parentElement?.parentElement?.parentElement?.querySelector('button');
        if (button) (button as HTMLElement).focus();
      } else {
        // Focus previous link
        const prevLink = (e.currentTarget as HTMLElement).parentElement?.previousElementSibling?.querySelector('a');
        if (prevLink) (prevLink as HTMLElement).focus();
      }
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="text-gray-700 hover:text-paradise-blue font-medium transition-colors flex items-center gap-1 py-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 w-48 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-gray-700 hover:bg-paradise-blue/10 hover:text-paradise-blue transition-colors focus:bg-paradise-blue/10 focus:text-paradise-blue focus:outline-none"
                onKeyDown={(e) => handleLinkKeyDown(e, index)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({
    learn: false,
    develop: false,
  });

  const toggleMobileDropdown = (key: string) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-paradise-blue to-paradise-purple bg-clip-text text-transparent">
              Paradise
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Learn Dropdown */}
            <Dropdown
              title="Learn"
              links={[
                { href: '/learn-actionlanguage', label: 'ActionLanguage' },
                { href: '/theory', label: 'Theory' },
                { href: '/examples', label: 'Examples' },
                { href: '/background', label: 'Background' },
              ]}
            />

            {/* Develop Dropdown */}
            <Dropdown
              title="Develop"
              links={[
                { href: '/architecture', label: 'Architecture' },
                { href: '/frameworks', label: 'Frameworks' },
                { href: '/analyzers', label: 'Analyzers' },
                { href: '/patterns', label: 'Widget Patterns' },
                { href: '/api', label: 'API Reference' },
              ]}
            />

            {/* Playground - Featured */}
            <a
              href="/playground"
              className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-paradise-blue to-paradise-purple hover:from-paradise-blue/90 hover:to-paradise-purple/90 transition-all shadow-sm hover:shadow-md"
            >
              Playground
            </a>

            {/* Standalone Links */}
            <a
              href="/extension"
              className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
            >
              Extension
            </a>
            <a
              href="/faq"
              className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
            >
              FAQ
            </a>
            <a
              href="https://github.com/bobdodd/phd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {/* Learn Section */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('learn')}
                  className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                  aria-expanded={mobileDropdowns.learn}
                >
                  Learn
                  <svg
                    className={`w-4 h-4 transition-transform ${mobileDropdowns.learn ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileDropdowns.learn && (
                  <div className="pl-8 flex flex-col gap-2 mt-2">
                    <a
                      href="/learn-actionlanguage"
                      className="text-gray-600 hover:text-paradise-blue transition-colors py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      ActionLanguage
                    </a>
                    <a
                      href="/theory"
                      className="text-gray-600 hover:text-paradise-blue transition-colors py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Theory
                    </a>
                    <a
                      href="/examples"
                      className="text-gray-600 hover:text-paradise-blue transition-colors py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Examples
                    </a>
                    <a
                      href="/background"
                      className="text-gray-600 hover:text-paradise-blue transition-colors py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Background
                    </a>
                  </div>
                )}
              </div>

              {/* Develop Section */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('develop')}
                  className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                  aria-expanded={mobileDropdowns.develop}
                >
                  Develop
                  <svg
                    className={`w-4 h-4 transition-transform ${mobileDropdowns.develop ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileDropdowns.develop && (
                  <div className="pl-8 flex flex-col gap-2 mt-2">
                    <a
                      href="/architecture"
                      className="text-gray-600 hover:text-paradise-blue transition-colors py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Architecture
                    </a>
                    <a
                      href="/frameworks"
                      className="text-gray-600 hover:text-paradise-blue transition-colors py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Frameworks
                    </a>
                    <a
                      href="/analyzers"
                      className="text-gray-600 hover:text-paradise-blue transition-colors py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Analyzers
                    </a>
                    <a
                      href="/patterns"
                      className="text-gray-600 hover:text-paradise-blue transition-colors py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Widget Patterns
                    </a>
                    <a
                      href="/api"
                      className="text-gray-600 hover:text-paradise-blue transition-colors py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      API Reference
                    </a>
                  </div>
                )}
              </div>

              {/* Playground - Featured */}
              <a
                href="/playground"
                className="mx-4 my-2 px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-paradise-blue to-paradise-purple text-center shadow-sm"
                onClick={() => setIsMobileOpen(false)}
              >
                🎮 Try Playground
              </a>

              {/* Standalone Links */}
              <a
                href="/extension"
                className="px-4 py-2 text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                Extension
              </a>
              <a
                href="/faq"
                className="px-4 py-2 text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                FAQ
              </a>
              <a
                href="https://github.com/bobdodd/phd"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
