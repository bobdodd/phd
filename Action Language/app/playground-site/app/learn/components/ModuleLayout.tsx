'use client';

import Link from 'next/link';
import { Module } from '../data/types';
import { getPrerequisiteModules, getRelatedModules } from '../data/modules';

interface ModuleLayoutProps {
  module: Module;
  track: 'developer' | 'designer' | 'qa';
  children: React.ReactNode;
  previousModule?: Module;
  nextModule?: Module;
}

export default function ModuleLayout({
  module,
  track,
  children,
  previousModule,
  nextModule,
}: ModuleLayoutProps) {
  const prerequisites = getPrerequisiteModules(module.id);
  const relatedModules = getRelatedModules(module.id);

  const trackColors = {
    developer: {
      bg: 'bg-blue-700',
      border: 'border-blue-600',
      text: 'text-blue-700',
      hover: 'hover:bg-blue-800',
    },
    designer: {
      bg: 'bg-purple-700',
      border: 'border-purple-600',
      text: 'text-purple-700',
      hover: 'hover:bg-purple-800',
    },
    qa: {
      bg: 'bg-green-700',
      border: 'border-green-600',
      text: 'text-green-700',
      hover: 'hover:bg-green-800',
    },
  };

  const colors = trackColors[track];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link href="/learn" className="text-gray-600 hover:text-gray-900">
              Learn
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/learn/${track}s`} className={`${colors.text} hover:underline capitalize`}>
              {track}s
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Module {module.moduleNumber}</span>
          </nav>
        </div>
      </div>

      {/* Module Header */}
      <div className={`${colors.bg} text-white py-8`}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
              Module {module.moduleNumber}
            </span>
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
              Domain {module.domain}
            </span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {module.estimatedMinutes} min
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-3">{module.title}</h1>
          <p className="text-xl text-white/90">{module.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Prerequisites Warning */}
        {prerequisites.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Prerequisites</h3>
            <p className="text-yellow-800 mb-3">
              This module builds on concepts from previous modules. We recommend completing these first:
            </p>
            <ul className="space-y-2">
              {prerequisites.map((prereq) => (
                <li key={prereq.id}>
                  <Link
                    href={`/learn/${track}s/modules/${prereq.slug}`}
                    className="text-yellow-700 hover:text-yellow-900 underline font-medium"
                  >
                    Module {prereq.moduleNumber}: {prereq.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">{children}</div>

        {/* WCAG Criteria */}
        {module.wcagCriteria.length > 0 && (
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">Related WCAG Success Criteria</h2>
            <div className="space-y-3">
              {module.wcagCriteria.map((criterion) => (
                <div key={criterion.number} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        criterion.level === 'A'
                          ? 'bg-green-600 text-white'
                          : criterion.level === 'AA'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      {criterion.level}
                    </span>
                  </div>
                  <div className="flex-1">
                    <a
                      href={criterion.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-indigo-700 hover:text-indigo-900 hover:underline"
                    >
                      {criterion.number}: {criterion.name} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Modules */}
        {relatedModules.length > 0 && (
          <div className="bg-gray-100 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Modules</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedModules.map((related) => (
                <Link
                  key={related.id}
                  href={`/learn/${track}s/modules/${related.slug}`}
                  className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="text-sm text-gray-600 mb-1">Module {related.moduleNumber}</div>
                  <div className="font-semibold text-gray-900">{related.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Previous/Next Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <div>
            {previousModule ? (
              <Link
                href={`/learn/${track}s/modules/${previousModule.slug}`}
                className={`inline-flex items-center gap-2 ${colors.text} hover:underline font-semibold`}
              >
                <span>←</span>
                <div>
                  <div className="text-sm text-gray-600">Previous</div>
                  <div>Module {previousModule.moduleNumber}: {previousModule.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="text-right">
            {nextModule ? (
              <Link
                href={`/learn/${track}s/modules/${nextModule.slug}`}
                className={`inline-flex items-center gap-2 ${colors.text} hover:underline font-semibold`}
              >
                <div>
                  <div className="text-sm text-gray-600">Next</div>
                  <div>Module {nextModule.moduleNumber}: {nextModule.title}</div>
                </div>
                <span>→</span>
              </Link>
            ) : (
              <Link
                href={`/learn/${track}s`}
                className={`inline-flex items-center gap-2 ${colors.text} hover:underline font-semibold`}
              >
                Back to {track} track →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
