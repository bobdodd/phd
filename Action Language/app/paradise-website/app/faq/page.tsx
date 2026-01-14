'use client';

import { useState } from 'react';

type FAQ = {
  question: string;
  answer: string | React.ReactNode;
  category: 'general' | 'technical' | 'actionlanguage' | 'extension';
};

const faqs: FAQ[] = [
  // General Questions
  {
    category: 'general',
    question: 'What is Paradise?',
    answer: 'Paradise is a universal accessibility analysis system that detects and fixes accessibility issues in UI code across multiple programming languages. It uses an intermediate representation called ActionLanguage and CRUD operations to provide deterministic, real-time accessibility feedback.'
  },
  {
    category: 'general',
    question: 'Does Paradise use AI or machine learning?',
    answer: 'No. Paradise uses deterministic pattern matching on ActionLanguage trees. Accessibility issues are structural patterns in code, not semantic mysteries. Paradise detects these patterns through tree traversal and rule-based analysis—no AI, no machine learning, no training data required.'
  },
  {
    category: 'general',
    question: 'Which programming languages does Paradise support?',
    answer: 'Currently Paradise supports JavaScript, TypeScript, and React. Support for Objective-C and Kotlin is in development. Because Paradise uses ActionLanguage as an intermediate representation, adding support for a new language only requires writing a parser (CREATE function)—all analyzers and fix generators work universally.'
  },
  {
    category: 'general',
    question: 'Is Paradise open source?',
    answer: (
      <span>
        Paradise is currently in active development. The educational website, documentation, and theoretical foundations are publicly available. Check the{' '}
        <a href="https://github.com/bobdodd/phd" target="_blank" rel="noopener noreferrer" className="text-paradise-blue underline hover:text-paradise-purple">
          GitHub repository
        </a>{' '}
        for updates on open source releases.
      </span>
    )
  },
  {
    category: 'general',
    question: 'What WCAG criteria does Paradise cover?',
    answer: 'Paradise currently detects issues across 19+ WCAG 2.1 success criteria, including keyboard accessibility (2.1.1), focus management (2.4.3, 2.4.7), ARIA usage (4.1.2), context changes (3.2.1, 3.2.2), and more. The system is designed to be extensible—new analyzers can be added to cover additional criteria.'
  },

  // Technical Questions
  {
    category: 'technical',
    question: 'What are CRUD operations in Paradise?',
    answer: (
      <div>
        <p className="mb-3">CRUD operations are the four fundamental transformations that Paradise performs on code:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>CREATE:</strong> Parse source code into ActionLanguage (language-specific)</li>
          <li><strong>READ:</strong> Analyze ActionLanguage tree to detect accessibility patterns (universal)</li>
          <li><strong>UPDATE:</strong> Generate fixes by modifying ActionLanguage nodes (universal)</li>
          <li><strong>DELETE:</strong> Remove unnecessary code and optimize before code generation (universal)</li>
        </ul>
        <p className="mt-3">Only CREATE is language-specific. Everything else works on ActionLanguage and is universal.</p>
      </div>
    )
  },
  {
    category: 'technical',
    question: 'How fast is Paradise analysis?',
    answer: 'Paradise analysis runs in real-time as you type, typically completing in milliseconds. Because it uses deterministic tree traversal instead of AI inference, it requires minimal computational resources and can run on any laptop without GPUs or cloud services.'
  },
  {
    category: 'technical',
    question: 'Can Paradise detect all accessibility issues?',
    answer: 'No tool can detect all accessibility issues because some require human judgment (color contrast with context, appropriate alt text content, logical reading order). Paradise focuses on structural and behavioral patterns that can be deterministically detected: keyboard accessibility, focus management, ARIA usage, event handlers, and context changes.'
  },
  {
    category: 'technical',
    question: 'Does Paradise produce false positives?',
    answer: 'Paradise is designed to minimize false positives through careful pattern design and context awareness. Every detection includes explicit reasoning about why it\'s flagged. If you encounter a false positive, it indicates the pattern needs refinement—not a limitation of the deterministic approach.'
  },
  {
    category: 'technical',
    question: 'How does Paradise compare to automated testing tools like axe or Lighthouse?',
    answer: (
      <div>
        <p className="mb-3">Different tools, different purposes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>axe/Lighthouse:</strong> Analyze rendered DOM at runtime—great for catching HTML/CSS issues</li>
          <li><strong>Paradise:</strong> Analyzes source code before runtime—catches behavioral patterns in event handlers, state management, and dynamic interactions that don\'t exist in static HTML</li>
        </ul>
        <p className="mt-3">Paradise catches issues like mouse-only click handlers, static ARIA states, and focus traps that runtime tools miss. Use both for comprehensive coverage.</p>
      </div>
    )
  },

  // ActionLanguage Questions
  {
    category: 'actionlanguage',
    question: 'What is ActionLanguage?',
    answer: 'ActionLanguage is an intermediate representation that captures UI interactions uniformly across programming languages. It represents events, DOM manipulation, focus changes, ARIA updates, and navigation as a structured tree. By transforming all languages to ActionLanguage, Paradise enables universal analysis—write analyzers once, support every language.'
  },
  {
    category: 'actionlanguage',
    question: 'Why create a new intermediate representation?',
    answer: 'Existing IRs (ASTs, bytecode) preserve language-specific details. ActionLanguage abstracts away syntax differences to capture only UI interaction semantics. A click handler in JavaScript, Objective-C, and Kotlin all map to the same ActionLanguage structure, making pattern detection universal.'
  },
  {
    category: 'actionlanguage',
    question: 'How is ActionLanguage different from an AST?',
    answer: (
      <div>
        <p className="mb-3">Key differences:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>AST:</strong> Language-specific syntax tree—button.addEventListener vs [button addTarget:] are completely different</li>
          <li><strong>ActionLanguage:</strong> Semantic representation—both become {`{ actionType: "eventHandler", event: "click" }`}</li>
        </ul>
        <p className="mt-3">ActionLanguage discards irrelevant syntax and focuses on interaction semantics, making universal analysis possible.</p>
      </div>
    )
  },
  {
    category: 'actionlanguage',
    question: 'Can I write custom analyzers?',
    answer: (
      <span>
        Yes! Module 5 of the learning path teaches you how to write custom analyzers. Analyzers traverse the ActionLanguage tree looking for patterns. Because they operate on ActionLanguage, your custom analyzer automatically works across all supported languages. See{' '}
        <a href="/learn-actionlanguage/module-5" className="text-paradise-blue underline hover:text-paradise-purple">
          Module 5
        </a>{' '}
        for examples and a complete guide.
      </span>
    )
  },
  {
    category: 'actionlanguage',
    question: 'What metadata does ActionLanguage preserve?',
    answer: 'ActionLanguage nodes include: element bindings (variable/object references), event types, handler bodies, timing information, ARIA attributes, focus state, navigation targets, and source code locations. This metadata enables context-aware analysis and precise fix generation.'
  },

  // VS Code Extension Questions
  {
    category: 'extension',
    question: 'How do I install the VS Code extension?',
    answer: (
      <span>
        The Paradise VS Code extension is feature-complete and ready for use. Installation instructions and marketplace listing are coming soon. Visit the{' '}
        <a href="/extension" className="text-paradise-blue underline hover:text-paradise-purple">
          Extension page
        </a>{' '}
        for updates.
      </span>
    )
  },
  {
    category: 'extension',
    question: 'Does the extension work with TypeScript and React?',
    answer: 'Yes! The extension fully supports JavaScript, TypeScript, JSX, and TSX files. It analyzes React components, hooks, event handlers, and state management for accessibility issues.'
  },
  {
    category: 'extension',
    question: 'Can I customize which issues are flagged?',
    answer: 'Currently Paradise includes 9 core analyzers covering 19+ WCAG criteria. Customization options for severity levels and analyzer selection are planned for future releases. All current analyzers follow WCAG standards and minimize false positives.'
  },
  {
    category: 'extension',
    question: 'How do one-click fixes work?',
    answer: 'When Paradise detects an issue, it generates a context-aware fix in ActionLanguage. The fix is then transformed back to your source language and presented as a code action. Click "Apply Fix" in VS Code and the extension updates your code automatically—preserving formatting, comments, and style.'
  },
  {
    category: 'extension',
    question: 'Does the extension send my code to a server?',
    answer: 'No. All analysis happens locally in your VS Code instance. Your code never leaves your machine. Paradise parses, analyzes, and generates fixes entirely client-side with no network calls.'
  },
  {
    category: 'extension',
    question: 'Will Paradise work in my CI/CD pipeline?',
    answer: 'CLI tooling for CI/CD integration is planned. The core analysis engine is designed to be embeddable—it can run in VS Code, CLI tools, build systems, and custom integrations. Stay tuned for command-line tools and GitHub Actions support.'
  }
];

const categories = {
  general: { title: 'General', color: 'paradise-blue' },
  technical: { title: 'Technical', color: 'paradise-green' },
  actionlanguage: { title: 'ActionLanguage', color: 'paradise-purple' },
  extension: { title: 'VS Code Extension', color: 'paradise-orange' }
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-paradise-green to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            Everything you need to know about Paradise, ActionLanguage, and universal accessibility analysis
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeCategory === 'all'
                  ? 'bg-paradise-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Questions
            </button>
            {Object.entries(categories).map(([key, { title, color }]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  activeCategory === key
                    ? `bg-${color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {title}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const categoryColor = categories[faq.category].color;

              return (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-sm border-l-4 border-${categoryColor} overflow-hidden transition-all`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className={`text-xs font-semibold text-${categoryColor} uppercase mb-1`}>
                        {categories[faq.category].title}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
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
                    <div className="px-6 pb-6">
                      <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
            <p className="text-lg mb-6">
              Can't find what you're looking for? Explore our comprehensive learning modules or reach out on GitHub.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/learn-actionlanguage" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Learning
              </a>
              <a href="/playground" className="bg-paradise-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors">
                Try Playground
              </a>
              <a
                href="https://github.com/bobdodd/phd/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-paradise-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-purple/90 transition-colors border-2 border-white"
              >
                Ask on GitHub
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
