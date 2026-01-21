// Curated learning paths for different goals

import { LearningPath } from './types';

export const learningPaths: LearningPath[] = [
  {
    id: 'quick-start',
    name: 'Quick Start',
    description:
      'Get up to speed fast with the most critical accessibility concepts and immediately improve your work. Perfect for experienced professionals who need practical skills now.',
    estimatedHours: 10,
    goal: 'Immediately improve accessibility in current projects',
    moduleIds: [
      'mod-01', // Understanding Disability Models (15 min)
      'mod-10', // Screen Readers Deep Dive (45 min)
      'mod-26', // Semantic HTML Foundations (30 min)
      'mod-28', // Keyboard Navigation Patterns (30 min)
      'mod-36', // Color and Contrast (30 min)
      'mod-38', // Form Structure and Labels (30 min)
      'mod-39', // Form Validation and Error Handling (30 min)
      'mod-46', // ARIA Authoring Practices Fundamentals (45 min)
      'mod-47', // Accordion Pattern (20 min)
      'mod-48', // Tabs Pattern (20 min)
      'mod-50', // Dialog (Modal) Pattern (30 min)
      'mod-59', // ARIA Live Regions (30 min)
      'mod-64', // Testing Methodologies (45 min)
      'mod-65', // Accessibility in Development Workflow (30 min)
    ],
  },

  {
    id: 'comprehensive',
    name: 'Comprehensive Accessibility',
    description:
      'Master digital accessibility comprehensively. This path covers all WCAG 2.2 guidelines, ARIA patterns, and prepares you for professional accessibility work.',
    estimatedHours: 50,
    goal: 'Master digital accessibility and prepare for certification',
    moduleIds: [
      // All 65 modules in order
      'mod-01',
      'mod-02',
      'mod-03',
      'mod-04',
      'mod-05',
      'mod-06',
      'mod-07',
      'mod-08',
      'mod-09',
      'mod-10',
      'mod-11',
      'mod-12',
      'mod-13',
      'mod-14',
      'mod-15',
      'mod-16',
      'mod-17',
      'mod-18',
      'mod-19',
      'mod-20',
      // Modules 21-65 will be added as we create them
    ],
  },

  {
    id: 'developer-focused',
    name: 'Frontend Developer Path',
    description:
      'Code-focused learning path for developers. Master semantic HTML, ARIA, keyboard patterns, and custom widget implementation.',
    track: 'developer',
    estimatedHours: 25,
    goal: 'Build accessible web applications with confidence',
    moduleIds: [
      'mod-01', // Understanding Disability Models
      'mod-02', // Visual Disabilities
      'mod-04', // Motor Disabilities
      'mod-10', // Screen Readers Deep Dive
      'mod-11', // Switch Access
      'mod-13', // WCAG Overview
      'mod-14', // Perceivable Principle
      'mod-15', // Operable Principle
      'mod-16', // Understandable Principle
      'mod-17', // Robust Principle
      'mod-18', // ARIA Specifications
      'mod-26', // Semantic HTML Foundations
      'mod-27', // Accessible Names and Descriptions
      'mod-28', // Keyboard Navigation Patterns
      'mod-38', // Form Structure and Labels
      'mod-39', // Form Validation and Error Handling
      'mod-46', // ARIA Authoring Practices Fundamentals
      'mod-47', // Accordion Pattern
      'mod-48', // Tabs Pattern
      'mod-49', // Menu and Menubar Patterns
      'mod-50', // Dialog (Modal) Pattern
      'mod-52', // Combobox (Autocomplete) Pattern
      'mod-58', // Single Page Applications (SPAs)
      'mod-59', // ARIA Live Regions
      'mod-64', // Testing Methodologies
      'mod-65', // Accessibility in Development Workflow
    ],
  },

  {
    id: 'designer-focused',
    name: 'Designer Path',
    description:
      'Visual and UX-focused learning for designers. Learn color contrast, layout patterns, design specifications, and inclusive design principles.',
    track: 'designer',
    estimatedHours: 20,
    goal: 'Create accessible designs that developers can implement',
    moduleIds: [
      'mod-01', // Understanding Disability Models
      'mod-02', // Visual Disabilities
      'mod-03', // Auditory Disabilities
      'mod-04', // Motor Disabilities
      'mod-05', // Cognitive Disabilities
      'mod-10', // Screen Readers Deep Dive
      'mod-13', // WCAG Overview
      'mod-14', // Perceivable Principle
      'mod-15', // Operable Principle
      'mod-26', // Semantic HTML Foundations
      'mod-27', // Accessible Names and Descriptions
      'mod-28', // Keyboard Navigation Patterns
      'mod-29', // ARIA Landmarks and Regions
      'mod-33', // Image Accessibility
      'mod-34', // Video Accessibility
      'mod-36', // Color and Contrast
      'mod-37', // Animations and Motion
      'mod-38', // Form Structure and Labels
      'mod-46', // ARIA Authoring Practices Fundamentals
      'mod-47', // Accordion Pattern
      'mod-48', // Tabs Pattern
      'mod-50', // Dialog (Modal) Pattern
      'mod-61', // Responsive Design and Mobile
    ],
  },

  {
    id: 'qa-focused',
    name: 'QA Tester Path',
    description:
      'Testing-focused learning for QA professionals. Master testing tools, validation criteria, bug reporting, and comprehensive accessibility testing strategies.',
    track: 'qa',
    estimatedHours: 30,
    goal: 'Test and validate accessibility comprehensively',
    moduleIds: [
      'mod-01', // Understanding Disability Models
      'mod-02', // Visual Disabilities
      'mod-04', // Motor Disabilities
      'mod-10', // Screen Readers Deep Dive
      'mod-11', // Switch Access
      'mod-13', // WCAG Overview
      'mod-14', // Perceivable Principle
      'mod-15', // Operable Principle
      'mod-16', // Understandable Principle
      'mod-17', // Robust Principle
      'mod-18', // ARIA Specifications
      'mod-26', // Semantic HTML Foundations
      'mod-28', // Keyboard Navigation Patterns
      'mod-33', // Image Accessibility
      'mod-36', // Color and Contrast
      'mod-38', // Form Structure and Labels
      'mod-39', // Form Validation and Error Handling
      'mod-40', // Input Types and Autocomplete
      'mod-41', // Custom Form Controls
      'mod-42', // Buttons and Actions
      'mod-43', // Focus Management in Forms
      'mod-44', // Complex Form Patterns
      'mod-45', // Form Testing Strategies
      'mod-46', // ARIA Authoring Practices Fundamentals
      'mod-47', // Accordion Pattern
      'mod-48', // Tabs Pattern
      'mod-50', // Dialog (Modal) Pattern
      'mod-59', // ARIA Live Regions
      'mod-60', // Tables and Data Grids
      'mod-64', // Testing Methodologies
      'mod-65', // Accessibility in Development Workflow
    ],
  },

  {
    id: 'forms-specialist',
    name: 'Forms Accessibility Specialist',
    description:
      'Deep dive into accessible forms. Master labels, validation, error handling, custom controls, and complex form patterns.',
    estimatedHours: 8,
    goal: 'Build and test fully accessible forms',
    moduleIds: [
      'mod-10', // Screen Readers Deep Dive
      'mod-16', // Understandable Principle
      'mod-27', // Accessible Names and Descriptions
      'mod-28', // Keyboard Navigation Patterns
      'mod-38', // Form Structure and Labels
      'mod-39', // Form Validation and Error Handling
      'mod-40', // Input Types and Autocomplete
      'mod-41', // Custom Form Controls
      'mod-42', // Buttons and Actions
      'mod-43', // Focus Management in Forms
      'mod-44', // Complex Form Patterns
      'mod-45', // Form Testing Strategies
      'mod-59', // ARIA Live Regions
    ],
  },

  {
    id: 'custom-widgets',
    name: 'Custom Widget Patterns',
    description:
      'Master ARIA widget patterns for building accessible accordions, tabs, dialogs, comboboxes, and other interactive components.',
    estimatedHours: 12,
    goal: 'Implement accessible custom widgets',
    moduleIds: [
      'mod-10', // Screen Readers Deep Dive
      'mod-18', // ARIA Specifications
      'mod-28', // Keyboard Navigation Patterns
      'mod-46', // ARIA Authoring Practices Fundamentals
      'mod-47', // Accordion Pattern
      'mod-48', // Tabs Pattern
      'mod-49', // Menu and Menubar Patterns
      'mod-50', // Dialog (Modal) Pattern
      'mod-51', // Disclosure (Expandable) Pattern
      'mod-52', // Combobox (Autocomplete) Pattern
      'mod-53', // Listbox Pattern
      'mod-54', // Tree View Pattern
      'mod-55', // Slider Pattern
      'mod-56', // Toolbar Pattern
      'mod-57', // Tooltip Pattern
    ],
  },
];

export function getLearningPathById(id: string): LearningPath | undefined {
  return learningPaths.find((path) => path.id === id);
}

export function getLearningPathsByTrack(track: 'developer' | 'designer' | 'qa'): LearningPath[] {
  return learningPaths.filter((path) => !path.track || path.track === track);
}

export function getAllLearningPaths(): LearningPath[] {
  return learningPaths;
}
