// Module registry for all 65 modules across 8 domains

import { Module, Domain } from './types';

export const modules: Module[] = [
  // ========================================
  // DOMAIN 1: Disabilities & Assistive Technologies (40% of CPACC)
  // ========================================

  {
    id: 'mod-01',
    slug: 'understanding-disability-models',
    domain: 1,
    moduleNumber: 1,
    title: 'Understanding Disability Models',
    description: 'Learn about the medical vs. social models of disability, identity-first vs. person-first language, and how disability represents human diversity.',
    estimatedMinutes: 15,
    prerequisites: [],
    relatedModules: ['mod-02', 'mod-03', 'mod-04'],
    wcagCriteria: [],
    disabilityTypes: ['visual', 'auditory', 'motor', 'cognitive', 'speech', 'multiple'],
    tags: ['foundations', 'disability', 'language', 'empathy'],
  },

  {
    id: 'mod-02',
    slug: 'visual-disabilities',
    domain: 1,
    moduleNumber: 2,
    title: 'Visual Disabilities',
    description: 'Explore the spectrum of visual disabilities including blindness, low vision, and color blindness. Learn about screen readers, magnifiers, and Braille displays.',
    estimatedMinutes: 25,
    prerequisites: ['mod-01'],
    relatedModules: ['mod-10', 'mod-33', 'mod-36'],
    wcagCriteria: [
      {
        number: '1.1.1',
        name: 'Non-text Content',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
      },
      {
        number: '1.4.3',
        name: 'Contrast (Minimum)',
        level: 'AA',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
      },
    ],
    disabilityTypes: ['visual'],
    tags: ['screen-readers', 'color-blindness', 'low-vision', 'assistive-tech'],
  },

  {
    id: 'mod-03',
    slug: 'auditory-disabilities',
    domain: 1,
    moduleNumber: 3,
    title: 'Auditory Disabilities',
    description: 'Understand the deaf and hard of hearing community, auditory processing disorders, and the importance of captions, transcripts, and visual alternatives.',
    estimatedMinutes: 20,
    prerequisites: ['mod-01'],
    relatedModules: ['mod-34', 'mod-35'],
    wcagCriteria: [
      {
        number: '1.2.2',
        name: 'Captions (Prerecorded)',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html',
      },
      {
        number: '1.2.4',
        name: 'Captions (Live)',
        level: 'AA',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html',
      },
    ],
    disabilityTypes: ['auditory'],
    tags: ['captions', 'transcripts', 'sign-language', 'deaf'],
  },

  {
    id: 'mod-04',
    slug: 'motor-disabilities',
    domain: 1,
    moduleNumber: 4,
    title: 'Motor Disabilities',
    description: 'Learn about motor control limitations, tremors, paralysis, and limb differences. Explore switch access, voice control, eye tracking, and adaptive input devices.',
    estimatedMinutes: 25,
    prerequisites: ['mod-01'],
    relatedModules: ['mod-11', 'mod-28', 'mod-42'],
    wcagCriteria: [
      {
        number: '2.1.1',
        name: 'Keyboard',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html',
      },
      {
        number: '2.5.1',
        name: 'Pointer Gestures',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html',
      },
    ],
    disabilityTypes: ['motor'],
    tags: ['keyboard', 'switch-access', 'voice-control', 'eye-tracking'],
  },

  {
    id: 'mod-05',
    slug: 'cognitive-disabilities',
    domain: 1,
    moduleNumber: 5,
    title: 'Cognitive Disabilities',
    description: 'Understand learning disabilities, attention disorders, memory limitations, autism spectrum, and intellectual disabilities. Learn design strategies for cognitive accessibility.',
    estimatedMinutes: 25,
    prerequisites: ['mod-01'],
    relatedModules: ['mod-16', 'mod-32', 'mod-37'],
    wcagCriteria: [
      {
        number: '3.2.4',
        name: 'Consistent Identification',
        level: 'AA',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html',
      },
      {
        number: '3.3.2',
        name: 'Labels or Instructions',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html',
      },
    ],
    disabilityTypes: ['cognitive'],
    tags: ['cognitive', 'dyslexia', 'adhd', 'autism', 'simplicity'],
  },

  {
    id: 'mod-06',
    slug: 'speech-disabilities',
    domain: 1,
    moduleNumber: 6,
    title: 'Speech Disabilities',
    description: 'Learn about non-verbal communication, speech impairments, and AAC (Augmentative and Alternative Communication) devices.',
    estimatedMinutes: 15,
    prerequisites: ['mod-01'],
    relatedModules: ['mod-04', 'mod-12'],
    wcagCriteria: [],
    disabilityTypes: ['speech'],
    tags: ['speech', 'aac', 'communication', 'voice-input'],
  },

  {
    id: 'mod-07',
    slug: 'seizure-disorders',
    domain: 1,
    moduleNumber: 7,
    title: 'Seizure Disorders',
    description: 'Understand photosensitive epilepsy, seizure triggers in web content, and the critical importance of avoiding flashing content.',
    estimatedMinutes: 15,
    prerequisites: ['mod-01'],
    relatedModules: ['mod-37'],
    wcagCriteria: [
      {
        number: '2.3.1',
        name: 'Three Flashes or Below Threshold',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html',
      },
    ],
    disabilityTypes: ['seizure'],
    tags: ['seizures', 'epilepsy', 'flashing', 'animation'],
  },

  {
    id: 'mod-08',
    slug: 'temporary-situational-disabilities',
    domain: 1,
    moduleNumber: 8,
    title: 'Temporary and Situational Disabilities',
    description: 'Explore how injuries, environmental factors, and equipment limitations create temporary accessibility needs that affect everyone.',
    estimatedMinutes: 12,
    prerequisites: ['mod-01'],
    relatedModules: ['mod-61'],
    wcagCriteria: [],
    disabilityTypes: ['visual', 'auditory', 'motor', 'cognitive'],
    tags: ['temporary', 'situational', 'universal-design'],
  },

  {
    id: 'mod-09',
    slug: 'multiple-disabilities',
    domain: 1,
    moduleNumber: 9,
    title: 'Multiple and Compound Disabilities',
    description: 'Learn about deafblindness and complex disability combinations that require specialized assistive technology and careful design consideration.',
    estimatedMinutes: 15,
    prerequisites: ['mod-01', 'mod-02', 'mod-03'],
    relatedModules: ['mod-12'],
    wcagCriteria: [],
    disabilityTypes: ['multiple'],
    tags: ['deafblind', 'multiple-disabilities', 'complex-needs'],
  },

  {
    id: 'mod-10',
    slug: 'screen-readers-deep-dive',
    domain: 1,
    moduleNumber: 10,
    title: 'Screen Readers Deep Dive',
    description: 'Master how screen readers work, including navigation modes, keyboard shortcuts, the accessibility tree, and accessible name computation.',
    estimatedMinutes: 45,
    prerequisites: ['mod-02'],
    relatedModules: ['mod-27', 'mod-28', 'mod-46'],
    wcagCriteria: [
      {
        number: '4.1.2',
        name: 'Name, Role, Value',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
      },
    ],
    disabilityTypes: ['visual'],
    tags: ['screen-readers', 'jaws', 'nvda', 'voiceover', 'talkback', 'critical'],
  },

  {
    id: 'mod-11',
    slug: 'switch-access-scanning',
    domain: 1,
    moduleNumber: 11,
    title: 'Switch Access and Scanning',
    description: 'Understand single vs. dual switch operation, scanning patterns, and how switch users navigate digital interfaces.',
    estimatedMinutes: 30,
    prerequisites: ['mod-04'],
    relatedModules: ['mod-28', 'mod-42'],
    wcagCriteria: [
      {
        number: '2.1.1',
        name: 'Keyboard',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html',
      },
    ],
    disabilityTypes: ['motor'],
    tags: ['switch-access', 'scanning', 'motor', 'critical'],
  },

  {
    id: 'mod-12',
    slug: 'alternative-input-output',
    domain: 1,
    moduleNumber: 12,
    title: 'Alternative Input and Output Devices',
    description: 'Explore voice control, eye tracking, refreshable Braille displays, alternative keyboards, and other adaptive hardware.',
    estimatedMinutes: 25,
    prerequisites: ['mod-02', 'mod-04'],
    relatedModules: ['mod-10', 'mod-11'],
    wcagCriteria: [],
    disabilityTypes: ['visual', 'motor', 'multiple'],
    tags: ['voice-control', 'eye-tracking', 'braille', 'adaptive-hardware'],
  },

  // ========================================
  // DOMAIN 2: Standards and Guidelines (15% of CPACC)
  // ========================================

  {
    id: 'mod-13',
    slug: 'wcag-overview',
    domain: 2,
    moduleNumber: 13,
    title: 'WCAG 2.2 Overview',
    description: 'Master the four POUR principles, three conformance levels, and the structure of WCAG success criteria.',
    estimatedMinutes: 30,
    prerequisites: [],
    relatedModules: ['mod-14', 'mod-15', 'mod-16', 'mod-17'],
    wcagCriteria: [],
    disabilityTypes: ['visual', 'auditory', 'motor', 'cognitive'],
    tags: ['wcag', 'standards', 'pour', 'foundations', 'critical'],
  },

  {
    id: 'mod-14',
    slug: 'perceivable-principle',
    domain: 2,
    moduleNumber: 14,
    title: 'Perceivable Principle (WCAG 1.x)',
    description: 'Learn about text alternatives, time-based media, adaptable content, and distinguishable content requirements.',
    estimatedMinutes: 35,
    prerequisites: ['mod-13'],
    relatedModules: ['mod-33', 'mod-34', 'mod-36'],
    wcagCriteria: [
      {
        number: '1.1.1',
        name: 'Non-text Content',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
      },
      {
        number: '1.3.1',
        name: 'Info and Relationships',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
      },
      {
        number: '1.4.3',
        name: 'Contrast (Minimum)',
        level: 'AA',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
      },
    ],
    disabilityTypes: ['visual', 'auditory', 'cognitive'],
    tags: ['wcag', 'perceivable', 'alt-text', 'contrast', 'critical'],
  },

  {
    id: 'mod-15',
    slug: 'operable-principle',
    domain: 2,
    moduleNumber: 15,
    title: 'Operable Principle (WCAG 2.x)',
    description: 'Master keyboard accessibility, sufficient time, seizure prevention, navigation, and input modality requirements.',
    estimatedMinutes: 40,
    prerequisites: ['mod-13'],
    relatedModules: ['mod-28', 'mod-37', 'mod-42'],
    wcagCriteria: [
      {
        number: '2.1.1',
        name: 'Keyboard',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html',
      },
      {
        number: '2.4.3',
        name: 'Focus Order',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html',
      },
      {
        number: '2.5.5',
        name: 'Target Size (Enhanced)',
        level: 'AAA',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html',
      },
    ],
    disabilityTypes: ['motor', 'visual', 'seizure'],
    tags: ['wcag', 'operable', 'keyboard', 'navigation', 'critical'],
  },

  {
    id: 'mod-16',
    slug: 'understandable-principle',
    domain: 2,
    moduleNumber: 16,
    title: 'Understandable Principle (WCAG 3.x)',
    description: 'Learn about readable content, predictable interfaces, and input assistance for user comprehension.',
    estimatedMinutes: 30,
    prerequisites: ['mod-13'],
    relatedModules: ['mod-39', 'mod-44'],
    wcagCriteria: [
      {
        number: '3.2.4',
        name: 'Consistent Identification',
        level: 'AA',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html',
      },
      {
        number: '3.3.1',
        name: 'Error Identification',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html',
      },
      {
        number: '3.3.3',
        name: 'Error Suggestion',
        level: 'AA',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html',
      },
    ],
    disabilityTypes: ['cognitive', 'visual'],
    tags: ['wcag', 'understandable', 'forms', 'errors', 'critical'],
  },

  {
    id: 'mod-17',
    slug: 'robust-principle',
    domain: 2,
    moduleNumber: 17,
    title: 'Robust Principle (WCAG 4.x)',
    description: 'Understand compatibility with assistive technologies and the importance of valid, semantic code.',
    estimatedMinutes: 25,
    prerequisites: ['mod-13'],
    relatedModules: ['mod-26', 'mod-27'],
    wcagCriteria: [
      {
        number: '4.1.2',
        name: 'Name, Role, Value',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
      },
    ],
    disabilityTypes: ['visual', 'motor'],
    tags: ['wcag', 'robust', 'compatibility', 'aria', 'critical'],
  },

  {
    id: 'mod-18',
    slug: 'aria-specifications',
    domain: 2,
    moduleNumber: 18,
    title: 'ARIA Specifications',
    description: 'Master WAI-ARIA roles, states, and properties. Learn when to use ARIA vs. native HTML and avoid common anti-patterns.',
    estimatedMinutes: 40,
    prerequisites: ['mod-13', 'mod-17'],
    relatedModules: ['mod-27', 'mod-46', 'mod-47'],
    wcagCriteria: [
      {
        number: '4.1.2',
        name: 'Name, Role, Value',
        level: 'A',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
      },
    ],
    disabilityTypes: ['visual', 'motor'],
    tags: ['aria', 'wai-aria', 'roles', 'states', 'properties', 'critical'],
  },

  {
    id: 'mod-19',
    slug: 'other-standards',
    domain: 2,
    moduleNumber: 19,
    title: 'Other Accessibility Standards',
    description: 'Explore Section 508, EN 301 549, ADA, CVAA, AODA, PDF/UA, and EPUB accessibility standards.',
    estimatedMinutes: 30,
    prerequisites: ['mod-13'],
    relatedModules: ['mod-21', 'mod-63'],
    wcagCriteria: [],
    disabilityTypes: ['visual', 'auditory', 'motor', 'cognitive'],
    tags: ['section-508', 'en-301-549', 'ada', 'standards', 'compliance'],
  },

  {
    id: 'mod-20',
    slug: 'mobile-accessibility-standards',
    domain: 2,
    moduleNumber: 20,
    title: 'Mobile Accessibility Standards',
    description: 'Learn iOS and Android accessibility guidelines, touch target sizes, and gesture alternatives.',
    estimatedMinutes: 30,
    prerequisites: ['mod-13'],
    relatedModules: ['mod-61'],
    wcagCriteria: [
      {
        number: '2.5.5',
        name: 'Target Size (Enhanced)',
        level: 'AAA',
        url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html',
      },
    ],
    disabilityTypes: ['motor', 'visual'],
    tags: ['mobile', 'ios', 'android', 'touch-targets', 'gestures'],
  },

  // We'll add the remaining domains (3-8) in subsequent files
  // This gives us the first 20 modules to work with
];

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function getModuleBySlug(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getModulesByDomain(domain: Domain): Module[] {
  return modules.filter((m) => m.domain === domain).sort((a, b) => a.moduleNumber - b.moduleNumber);
}

export function getModulesByTrack(track: 'developer' | 'designer' | 'qa'): Module[] {
  // All tracks see all modules, but with profession-specific content
  return modules;
}

export function getPrerequisiteModules(moduleId: string): Module[] {
  const module = getModuleById(moduleId);
  if (!module) return [];
  return module.prerequisites.map((id) => getModuleById(id)).filter((m): m is Module => m !== undefined);
}

export function getRelatedModules(moduleId: string): Module[] {
  const module = getModuleById(moduleId);
  if (!module) return [];
  return module.relatedModules.map((id) => getModuleById(id)).filter((m): m is Module => m !== undefined);
}
