'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Paradise Playground Home"
            >
              <span className="sr-only">Paradise Playground - </span>
              <span aria-hidden="true">🏝️ </span>
              Paradise Playground
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive('/')
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Playground
            </Link>
            <Link
              href="/learn"
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                pathname?.startsWith('/learn')
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-current={pathname?.startsWith('/learn') ? 'page' : undefined}
            >
              Learn
            </Link>
            <Link
              href="/about/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive('/about/') || isActive('/about')
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-current={isActive('/about/') || isActive('/about') ? 'page' : undefined}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
