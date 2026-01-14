'use client';

import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="hidden md:flex items-center gap-8">
            <a href="/learn-actionlanguage" className="text-gray-700 hover:text-paradise-blue font-medium transition-colors">
              Learn
            </a>
            <a href="/theory" className="text-gray-700 hover:text-paradise-blue font-medium transition-colors">
              Theory
            </a>
            <a href="/playground" className="text-gray-700 hover:text-paradise-blue font-medium transition-colors">
              Playground
            </a>
            <a href="/extension" className="text-gray-700 hover:text-paradise-blue font-medium transition-colors">
              Extension
            </a>
            <a href="/api" className="text-gray-700 hover:text-paradise-blue font-medium transition-colors">
              API
            </a>
            <a href="/faq" className="text-gray-700 hover:text-paradise-blue font-medium transition-colors">
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
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
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
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <a
                href="/learn-actionlanguage"
                className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Learn
              </a>
              <a
                href="/theory"
                className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Theory
              </a>
              <a
                href="/playground"
                className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Playground
              </a>
              <a
                href="/extension"
                className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Extension
              </a>
              <a
                href="/api"
                className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                API
              </a>
              <a
                href="/faq"
                className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </a>
              <a
                href="https://github.com/bobdodd/phd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-paradise-blue font-medium transition-colors"
                onClick={() => setIsOpen(false)}
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
