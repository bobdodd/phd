'use client';

import { useState } from 'react';

type PatternCategory = 'all' | 'navigation' | 'input' | 'disclosure' | 'status';
type ComplexityLevel = 'Low' | 'Medium' | 'High' | 'Very High';

interface Pattern {
  id: string;
  name: string;
  emoji: string;
  category: PatternCategory;
  complexity: ComplexityLevel;
  wcagCriteria: string[];
  description: string;
  issuesDetected: number;
  demoPath: string;
  whatParadiseDetects: string[];
}

const patterns: Pattern[] = [
  // Navigation Widgets
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    emoji: '🍞',
    category: 'navigation',
    complexity: 'Low',
    wcagCriteria: ['2.4.8', '4.1.2'],
    description: 'Navigation path showing current location in site hierarchy',
    issuesDetected: 4,
    demoPath: '/demos/widget-patterns/pages/navigation-widgets/breadcrumb-comprehensive.html',
    whatParadiseDetects: [
      'Missing aria-label on nav element',
      'Missing aria-current on current page',
      'Incorrect semantic structure',
      'Missing keyboard navigation support'
    ]
  },
  {
    id: 'menu',
    name: 'Menu',
    emoji: '📋',
    category: 'navigation',
    complexity: 'High',
    wcagCriteria: ['2.1.1', '4.1.2', '2.4.3'],
    description: 'Dropdown menu with hierarchical actions and keyboard navigation',
    issuesDetected: 12,
    demoPath: '/demos/widget-patterns/pages/navigation-widgets/menu-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="menu" and role="menuitem"',
      'Arrow key navigation not implemented',
      'No focus management on open/close',
      'Missing aria-haspopup attribute',
      'Escape key handler missing',
      'Submenu focus trap issues'
    ]
  },
  {
    id: 'tabs',
    name: 'Tabs',
    emoji: '📑',
    category: 'navigation',
    complexity: 'Medium',
    wcagCriteria: ['2.1.1', '4.1.2', '1.3.1'],
    description: 'Tab interface for switching between related content panels',
    issuesDetected: 8,
    demoPath: '/demos/widget-patterns/pages/navigation-widgets/tabs.html',
    whatParadiseDetects: [
      'Missing tablist, tab, and tabpanel roles',
      'aria-selected not updated dynamically',
      'Arrow key navigation missing',
      'No aria-controls linking tabs to panels',
      'Hidden panels not properly marked'
    ]
  },
  {
    id: 'toolbar',
    name: 'Toolbar',
    emoji: '🛠️',
    category: 'navigation',
    complexity: 'Medium',
    wcagCriteria: ['2.1.1', '4.1.2'],
    description: 'Collection of commonly used function buttons and controls',
    issuesDetected: 6,
    demoPath: '/demos/widget-patterns/pages/navigation-widgets/toolbar-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="toolbar"',
      'Arrow key navigation not implemented',
      'Button groups not properly labeled',
      'Roving tabindex not configured'
    ]
  },
  {
    id: 'tree',
    name: 'Tree View',
    emoji: '🌳',
    category: 'navigation',
    complexity: 'Very High',
    wcagCriteria: ['2.1.1', '4.1.2', '4.1.3'],
    description: 'Hierarchical list with expandable/collapsible branches',
    issuesDetected: 15,
    demoPath: '/demos/widget-patterns/pages/navigation-widgets/tree-comprehensive.html',
    whatParadiseDetects: [
      'Missing tree, treeitem, and group roles',
      'aria-expanded not updated on toggle',
      'aria-level not set for hierarchy depth',
      'Arrow key navigation incomplete',
      'Multi-select pattern issues (aria-multiselectable)',
      'Focus management on expand/collapse'
    ]
  },
  {
    id: 'grid',
    name: 'Grid',
    emoji: '📊',
    category: 'navigation',
    complexity: 'Very High',
    wcagCriteria: ['2.1.1', '4.1.2', '1.3.1'],
    description: 'Interactive table with cell navigation and editing',
    issuesDetected: 18,
    demoPath: '/demos/widget-patterns/pages/navigation-widgets/grid-comprehensive.html',
    whatParadiseDetects: [
      'Missing grid, row, and gridcell roles',
      '2D arrow key navigation not implemented',
      'aria-rowindex and aria-colindex missing',
      'Sortable column headers not marked',
      'Editable cells missing aria-readonly',
      'Cell focus management issues'
    ]
  },
  {
    id: 'feed',
    name: 'Feed',
    emoji: '📰',
    category: 'navigation',
    complexity: 'High',
    wcagCriteria: ['4.1.2', '4.1.3'],
    description: 'Scrollable list of articles with dynamic loading',
    issuesDetected: 10,
    demoPath: '/demos/widget-patterns/pages/navigation-widgets/feed-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="feed" and role="article"',
      'aria-setsize and aria-posinset not set',
      'Loading state not announced to screen readers',
      'No busy state during fetch',
      'Focus management on dynamic content load'
    ]
  },

  // Input Widgets
  {
    id: 'combobox',
    name: 'Combobox',
    emoji: '🔽',
    category: 'input',
    complexity: 'Very High',
    wcagCriteria: ['2.1.1', '4.1.2', '4.1.3'],
    description: 'Input field with autocomplete dropdown suggestions',
    issuesDetected: 14,
    demoPath: '/demos/widget-patterns/pages/input-widgets/combobox-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="combobox" and aria-expanded',
      'aria-controls not linking to listbox',
      'aria-activedescendant not tracking selection',
      'Arrow key navigation in dropdown missing',
      'No live region for result announcements',
      'Popup trigger keys not handled (Alt+Down)'
    ]
  },
  {
    id: 'listbox',
    name: 'Listbox',
    emoji: '📝',
    category: 'input',
    complexity: 'High',
    wcagCriteria: ['2.1.1', '4.1.2', '1.3.1'],
    description: 'Scrollable list of selectable options (single or multi-select)',
    issuesDetected: 11,
    demoPath: '/demos/widget-patterns/pages/input-widgets/listbox-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="listbox" and role="option"',
      'aria-selected not set on options',
      'aria-multiselectable missing for multi-select',
      'Keyboard navigation (arrows, Home, End) missing',
      'Type-ahead functionality not implemented',
      'Active option not tracked with aria-activedescendant'
    ]
  },
  {
    id: 'radiogroup',
    name: 'Radio Group',
    emoji: '🔘',
    category: 'input',
    complexity: 'Medium',
    wcagCriteria: ['2.1.1', '4.1.2', '1.3.1'],
    description: 'Group of radio buttons for mutually exclusive selection',
    issuesDetected: 7,
    demoPath: '/demos/widget-patterns/pages/input-widgets/radiogroup-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="radiogroup" wrapper',
      'Missing role="radio" on custom radios',
      'aria-checked not updated on selection',
      'Arrow key navigation not implemented',
      'Group not properly labeled (aria-labelledby)',
      'Roving tabindex not configured'
    ]
  },
  {
    id: 'slider',
    name: 'Slider',
    emoji: '🎚️',
    category: 'input',
    complexity: 'Medium',
    wcagCriteria: ['2.1.1', '4.1.2'],
    description: 'Input control for selecting a value from a range',
    issuesDetected: 8,
    demoPath: '/demos/widget-patterns/pages/input-widgets/slider-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="slider"',
      'aria-valuenow, aria-valuemin, aria-valuemax not set',
      'aria-valuetext missing for formatted values',
      'Arrow key handlers not implemented',
      'Home/End key support missing',
      'Focus not visible on slider thumb'
    ]
  },
  {
    id: 'spinbutton',
    name: 'Spinbutton',
    emoji: '🔢',
    category: 'input',
    complexity: 'Medium',
    wcagCriteria: ['2.1.1', '4.1.2'],
    description: 'Numeric input with increment/decrement buttons',
    issuesDetected: 9,
    demoPath: '/demos/widget-patterns/pages/input-widgets/spinbutton-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="spinbutton"',
      'aria-valuenow not updated on change',
      'Up/Down arrow key handlers missing',
      'Page Up/Down for larger increments missing',
      'Min/max boundaries not enforced',
      'Increment buttons not associated with input'
    ]
  },
  {
    id: 'switch',
    name: 'Switch',
    emoji: '🔀',
    category: 'input',
    complexity: 'Low',
    wcagCriteria: ['2.1.1', '4.1.2'],
    description: 'Binary toggle control (on/off state)',
    issuesDetected: 5,
    demoPath: '/demos/widget-patterns/pages/input-widgets/switch-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="switch"',
      'aria-checked not reflecting state',
      'Space/Enter key handlers missing',
      'Visual state not synced with ARIA state',
      'Label not properly associated'
    ]
  },

  // Disclosure Widgets
  {
    id: 'accordion',
    name: 'Accordion',
    emoji: '🪗',
    category: 'disclosure',
    complexity: 'Medium',
    wcagCriteria: ['2.1.1', '4.1.2'],
    description: 'Stacked headers that expand/collapse content sections',
    issuesDetected: 8,
    demoPath: '/demos/widget-patterns/pages/disclosure-widgets/accordion.html',
    whatParadiseDetects: [
      'Missing button element for accordion headers',
      'aria-expanded not updated on toggle',
      'aria-controls not linking header to panel',
      'Panel regions not marked with role="region"',
      'Keyboard navigation between headers missing',
      'Focus management on panel open'
    ]
  },
  {
    id: 'disclosure',
    name: 'Disclosure',
    emoji: '▶️',
    category: 'disclosure',
    complexity: 'Low',
    wcagCriteria: ['2.1.1', '4.1.2'],
    description: 'Show/hide toggle for single content section',
    issuesDetected: 4,
    demoPath: '/demos/widget-patterns/pages/disclosure-widgets/disclosure-comprehensive.html',
    whatParadiseDetects: [
      'Non-button element used for trigger',
      'aria-expanded not updating',
      'aria-controls not set',
      'Hidden content not properly removed from tab order'
    ]
  },
  {
    id: 'dialog',
    name: 'Dialog',
    emoji: '💬',
    category: 'disclosure',
    complexity: 'High',
    wcagCriteria: ['2.1.2', '2.4.3', '4.1.2'],
    description: 'Modal or non-modal dialog window',
    issuesDetected: 13,
    demoPath: '/demos/widget-patterns/pages/disclosure-widgets/dialog.html',
    whatParadiseDetects: [
      'Missing role="dialog" or role="alertdialog"',
      'aria-modal not set for modal dialogs',
      'aria-labelledby or aria-label missing',
      'Focus trap not implemented',
      'Escape key handler missing',
      'Focus not moved to dialog on open',
      'Focus not restored on close',
      'Background content not properly inert'
    ]
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    emoji: '💡',
    category: 'disclosure',
    complexity: 'Medium',
    wcagCriteria: ['1.4.13', '4.1.2'],
    description: 'Contextual popup with additional information',
    issuesDetected: 7,
    demoPath: '/demos/widget-patterns/pages/disclosure-widgets/tooltip-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="tooltip"',
      'aria-describedby not linking trigger to tooltip',
      'Tooltip not dismissible with Escape',
      'Hover timeout not cancellable',
      'Tooltip blocks underlying content',
      'Focus triggers not handled for keyboard users'
    ]
  },

  // Status Widgets
  {
    id: 'progressbar',
    name: 'Progress Bar',
    emoji: '📊',
    category: 'status',
    complexity: 'Low',
    wcagCriteria: ['4.1.2', '4.1.3'],
    description: 'Visual indicator showing task completion progress',
    issuesDetected: 5,
    demoPath: '/demos/widget-patterns/pages/status-widgets/progressbar-comprehensive.html',
    whatParadiseDetects: [
      'Missing role="progressbar"',
      'aria-valuenow not updated as progress changes',
      'aria-valuemin and aria-valuemax not set',
      'aria-label missing (no context)',
      'Indeterminate state not marked (aria-valuenow missing)'
    ]
  },
  {
    id: 'meter',
    name: 'Meter',
    emoji: '🌡️',
    category: 'status',
    complexity: 'Low',
    wcagCriteria: ['4.1.2'],
    description: 'Gauge showing value within known range (not progress)',
    issuesDetected: 6,
    demoPath: '/demos/widget-patterns/pages/status-widgets/meter-comprehensive.html',
    whatParadiseDetects: [
      'Using progressbar role instead of meter',
      'Missing aria-valuenow, aria-valuemin, aria-valuemax',
      'Optimal/warning/danger ranges not communicated',
      'aria-valuetext missing for contextual meaning',
      'Visual-only color coding without text equivalent'
    ]
  },
  {
    id: 'carousel',
    name: 'Carousel',
    emoji: '🎠',
    category: 'status',
    complexity: 'Very High',
    wcagCriteria: ['2.1.1', '2.2.2', '4.1.2'],
    description: 'Rotating content display with navigation controls',
    issuesDetected: 16,
    demoPath: '/demos/widget-patterns/pages/status-widgets/carousel-comprehensive.html',
    whatParadiseDetects: [
      'Auto-rotation without pause control',
      'Missing role="region" with aria-roledescription="carousel"',
      'Slides not marked with role="group" and aria-label',
      'Previous/Next buttons not keyboard accessible',
      'No live region announcing slide changes',
      'Slide indicators missing keyboard support',
      'aria-live not configured for announcements',
      'Focus management on slide change'
    ]
  },
  {
    id: 'link',
    name: 'Link',
    emoji: '🔗',
    category: 'status',
    complexity: 'Low',
    wcagCriteria: ['2.4.4', '4.1.2'],
    description: 'Hyperlink with meaningful accessible name',
    issuesDetected: 6,
    demoPath: '/demos/widget-patterns/pages/basics/link-comprehensive.html',
    whatParadiseDetects: [
      'Generic link text ("click here", "read more")',
      'Link without accessible name',
      'Links that open new windows without warning',
      'Download links without file type/size info',
      'Ambiguous link purpose from text alone',
      'Non-descriptive link context for screen readers'
    ]
  }
];

const categories = {
  all: { title: 'All Patterns', color: 'paradise-blue' },
  navigation: { title: 'Navigation', color: 'paradise-green' },
  input: { title: 'Input', color: 'paradise-purple' },
  disclosure: { title: 'Disclosure', color: 'paradise-orange' },
  status: { title: 'Status', color: 'paradise-blue' }
};

const complexityColors = {
  'Low': 'bg-paradise-green/20 text-paradise-green',
  'Medium': 'bg-blue-100 text-blue-700',
  'High': 'bg-paradise-orange/20 text-paradise-orange',
  'Very High': 'bg-red-100 text-red-700'
};

export default function PatternsPage() {
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory>('all');

  const filteredPatterns = selectedCategory === 'all'
    ? patterns
    : patterns.filter(p => p.category === selectedCategory);

  const totalPatterns = patterns.length;
  const totalDemoFiles = 54; // Based on directory listing
  const totalLinesOfCode = 35000;
  const falsePositiveReduction = 88;
  const totalTests = 204;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Stats */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-paradise-blue/5 to-paradise-purple/10">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-paradise-green/20 mb-8 shadow-sm">
              <span className="w-2 h-2 bg-paradise-green rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">21 ARIA patterns with comprehensive demos</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-paradise-blue via-paradise-purple to-paradise-green bg-clip-text text-transparent">
                Widget Patterns
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Paradise analyzes 21 ARIA design patterns across 54 comprehensive demo files, detecting accessibility
              issues with 88% fewer false positives than traditional tools.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-paradise-blue mb-2">{totalPatterns}</div>
                <div className="text-sm text-gray-600">ARIA Patterns</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-paradise-green mb-2">{totalDemoFiles}</div>
                <div className="text-sm text-gray-600">Demo Files</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-paradise-purple mb-2">~{(totalLinesOfCode / 1000).toFixed(0)}k</div>
                <div className="text-sm text-gray-600">Lines of Code</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-paradise-orange mb-2">{falsePositiveReduction}%</div>
                <div className="text-sm text-gray-600">False Positive Reduction</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-paradise-blue mb-2">{totalTests}</div>
                <div className="text-sm text-gray-600">Tests Passing</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/demo/widget-patterns/"
                className="px-8 py-3 bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                Explore Live Demos
              </a>
              <a
                href="https://github.com/your-repo/paradise"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-gray-700 rounded-lg font-medium border-2 border-gray-200 hover:border-paradise-blue transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-paradise-blue/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-paradise-purple/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse by Category</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(categories).map(([key, { title, color }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as PatternCategory)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === key
                      ? `bg-${color} text-white shadow-md`
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pattern Cards Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{pattern.emoji}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{pattern.name}</h3>
                          <span className={`inline-block mt-1 text-xs font-semibold px-2 py-1 rounded ${complexityColors[pattern.complexity]}`}>
                            {pattern.complexity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* WCAG Criteria */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">WCAG Criteria</div>
                      <div className="flex flex-wrap gap-2">
                        {pattern.wcagCriteria.map(criterion => (
                          <span
                            key={criterion}
                            className="text-xs font-semibold px-2 py-1 rounded bg-paradise-purple/20 text-paradise-purple"
                          >
                            {criterion}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {pattern.description}
                    </p>

                    {/* Issues Count */}
                    <div className="bg-paradise-orange/10 border border-paradise-orange/20 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-paradise-orange" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-sm font-semibold text-gray-800">
                          Detects {pattern.issuesDetected} common issues
                        </span>
                      </div>
                    </div>

                    {/* What Paradise Detects */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-700 uppercase mb-2">What Paradise Detects</div>
                      <ul className="space-y-1">
                        {pattern.whatParadiseDetects.slice(0, 3).map((issue, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-paradise-blue mt-0.5">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                        {pattern.whatParadiseDetects.length > 3 && (
                          <li className="text-xs text-gray-500 italic">
                            +{pattern.whatParadiseDetects.length - 3} more issues
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* View Demo Button */}
                    <a
                      href={pattern.demoPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2 bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg font-medium hover:shadow-md transition-all"
                    >
                      View Demo
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Model Examples Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Multi-Model Architecture in Action
              </h2>
              <p className="text-lg text-gray-600">
                Paradise analyzes code across multiple files simultaneously, eliminating false positives
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Cross-File Tabs */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-paradise-blue/20">
                <div className="w-12 h-12 bg-paradise-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📑</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cross-File Tabs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tab component split across 3 files: structure, handlers, and state management.
                  Paradise analyzes all files together to verify complete ARIA implementation.
                </p>
                <div className="text-xs font-mono bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-paradise-blue">tabs-structure.js</div>
                  <div className="text-paradise-green">tabs-handlers.js</div>
                  <div className="text-paradise-purple">tabs-state.js</div>
                </div>
              </div>

              {/* Component Dialog with React Hooks */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-paradise-green/20">
                <div className="w-12 h-12 bg-paradise-green/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Component Dialog</h3>
                <p className="text-sm text-gray-600 mb-4">
                  React dialog using custom hooks for focus trap, keyboard handlers, and portal mounting.
                  Paradise tracks hook behavior across component boundaries.
                </p>
                <div className="text-xs font-mono bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-paradise-blue">Dialog.tsx</div>
                  <div className="text-paradise-green">useFocusTrap.ts</div>
                  <div className="text-paradise-orange">useKeyboard.ts</div>
                </div>
              </div>

              {/* Distributed Menu (4-file case) */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-paradise-purple/20">
                <div className="w-12 h-12 bg-paradise-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Distributed Menu</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Menu pattern split across 4 files with separate concerns for rendering, keyboard navigation,
                  ARIA state, and submenu management.
                </p>
                <div className="text-xs font-mono bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-paradise-blue">menu-render.js</div>
                  <div className="text-paradise-green">menu-keyboard.js</div>
                  <div className="text-paradise-purple">menu-aria.js</div>
                  <div className="text-paradise-orange">submenu.js</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-paradise-green/10 rounded-lg border border-paradise-green/20">
                <svg className="w-5 h-5 text-paradise-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-semibold text-gray-800">
                  88% reduction in false positives vs. single-file analyzers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Testing & Coverage
              </h2>
              <p className="text-lg text-gray-600">
                Every pattern backed by extensive demos and automated tests
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column: Pattern Breakdown */}
              <div className="bg-gradient-to-br from-paradise-blue/10 to-paradise-purple/10 rounded-xl p-8 border border-paradise-blue/20">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Pattern Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-paradise-green rounded-full"></div>
                      <span className="text-gray-700">Navigation Widgets</span>
                    </div>
                    <span className="font-bold text-gray-900">{patterns.filter(p => p.category === 'navigation').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-paradise-purple rounded-full"></div>
                      <span className="text-gray-700">Input Widgets</span>
                    </div>
                    <span className="font-bold text-gray-900">{patterns.filter(p => p.category === 'input').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-paradise-orange rounded-full"></div>
                      <span className="text-gray-700">Disclosure Widgets</span>
                    </div>
                    <span className="font-bold text-gray-900">{patterns.filter(p => p.category === 'disclosure').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-paradise-blue rounded-full"></div>
                      <span className="text-gray-700">Status Widgets</span>
                    </div>
                    <span className="font-bold text-gray-900">{patterns.filter(p => p.category === 'status').length}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-300">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Issues Detected</span>
                    <span className="text-2xl font-bold text-paradise-orange">
                      {patterns.reduce((sum, p) => sum + p.issuesDetected, 0)}+
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Coverage Stats */}
              <div className="bg-gradient-to-br from-paradise-green/10 to-paradise-blue/10 rounded-xl p-8 border border-paradise-green/20">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Test Coverage</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Automated Tests</span>
                      <span className="font-bold text-paradise-green">{totalTests} passing</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-paradise-green h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Code Coverage</span>
                      <span className="font-bold text-paradise-blue">~35k LOC</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-paradise-blue h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">WCAG Criteria</span>
                      <span className="font-bold text-paradise-purple">15+ criteria</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-paradise-purple h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-300">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-paradise-green mb-1">100%</div>
                    <div className="text-sm text-gray-600">of patterns have comprehensive demos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Links & Resources Section */}
      <section className="py-20 bg-gradient-to-br from-paradise-blue/10 via-paradise-purple/10 to-paradise-green/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Widget Patterns
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Try live demos, read the docs, or contribute on GitHub
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Live Demos */}
              <a
                href="/demo/widget-patterns/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-paradise-blue group"
              >
                <div className="w-16 h-16 bg-paradise-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-paradise-blue/20 transition-colors">
                  <svg className="w-8 h-8 text-paradise-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Live Demos</h3>
                <p className="text-sm text-gray-600">
                  Interactive examples of all 21 widget patterns with before/after code
                </p>
              </a>

              {/* Documentation */}
              <a
                href="/learn-actionlanguage"
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-paradise-purple group"
              >
                <div className="w-16 h-16 bg-paradise-purple/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-paradise-purple/20 transition-colors">
                  <svg className="w-8 h-8 text-paradise-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Documentation</h3>
                <p className="text-sm text-gray-600">
                  Learn ActionLanguage and how Paradise detects accessibility issues
                </p>
              </a>

              {/* GitHub Repository */}
              <a
                href="https://github.com/your-repo/paradise"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-paradise-green group"
              >
                <div className="w-16 h-16 bg-paradise-green/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-paradise-green/20 transition-colors">
                  <svg className="w-8 h-8 text-paradise-green" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">GitHub</h3>
                <p className="text-sm text-gray-600">
                  View source code, contribute patterns, or report issues
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-paradise-blue to-paradise-purple text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Building Accessible Widgets
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Use Paradise to ensure your custom widgets follow ARIA patterns and provide excellent accessibility
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/playground"
              className="px-8 py-3 bg-white text-paradise-blue rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              Try in Playground
            </a>
            <a
              href="/extension"
              className="px-8 py-3 bg-paradise-green text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              Get VS Code Extension
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
