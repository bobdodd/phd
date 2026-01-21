// Type definitions for Learn Accessibility platform

export type Track = 'developer' | 'designer' | 'qa';
export type Domain = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type WCAGLevel = 'A' | 'AA' | 'AAA';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Module {
  id: string;
  slug: string;
  domain: Domain;
  moduleNumber: number; // 1-65
  title: string;
  description: string;
  estimatedMinutes: number;
  prerequisites: string[]; // Module IDs
  relatedModules: string[]; // Module IDs
  wcagCriteria: WCAGCriterion[];
  disabilityTypes: DisabilityType[];
  tags: string[];
}

export interface WCAGCriterion {
  number: string; // e.g., "1.3.1"
  name: string; // e.g., "Info and Relationships"
  level: WCAGLevel;
  url: string;
}

export type DisabilityType =
  | 'visual'
  | 'auditory'
  | 'motor'
  | 'cognitive'
  | 'speech'
  | 'seizure'
  | 'multiple';

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'tsx';
  code: string;
  type: 'good' | 'bad' | 'before' | 'after';
  framework?: 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla';
  annotations?: CodeAnnotation[];
}

export interface CodeAnnotation {
  line: number;
  message: string;
  type: 'info' | 'tip' | 'warning' | 'success';
}

export interface PlaygroundExample {
  id: string;
  title: string;
  description: string;
  type: 'golden' | 'broken' | 'challenge' | 'real-world';
  difficulty: Difficulty;
  htmlFile: string; // Path to sample file
  expectedIssues?: number; // For broken/challenge examples
  hints?: string[];
  solution?: string; // Explanation of the fix
}

export interface VisualExample {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  caption: string;
  type: 'good' | 'bad' | 'comparison';
  figmaUrl?: string;
  sketchUrl?: string;
}

export interface DesignSpec {
  id: string;
  title: string;
  description: string;
  specifications: {
    property: string;
    value: string;
    reason: string;
  }[];
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
  wcagCriteria: string[];
  tools?: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface TestingProcedure {
  id: string;
  title: string;
  description: string;
  tool: string;
  steps: string[];
  expectedOutcome: string;
}

export interface UserStory {
  id: string;
  personaName: string;
  disabilityType: DisabilityType;
  assistiveTech: string;
  scenario: string;
  impact: string; // What happens when accessibility is missing
  successStory?: string; // What happens when it's done right
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'documentation' | 'video' | 'tool' | 'course';
  description: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  track?: Track; // If undefined, applicable to all tracks
  moduleIds: string[];
  estimatedHours: number;
  goal: string;
}

export interface UserProgress {
  track: Track;
  completedModules: string[];
  bookmarkedModules: string[];
  startedAt: string; // ISO date
  lastAccessedAt: string; // ISO date
  currentModule?: string;
  notes: Record<string, string>; // moduleId -> note
}
