import { BaseAnalyzer, AnalyzerContext, Issue, IssueFix } from './BaseAnalyzer';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

/**
 * OrientationLockAnalyzer
 *
 * Detects code that locks screen orientation, preventing users from viewing content
 * in their preferred orientation (portrait vs landscape).
 *
 * Issue Types (3):
 * 1. screen-orientation-lock - Uses Screen Orientation API to lock orientation
 * 2. css-orientation-lock - CSS media query restricts content to one orientation
 * 3. matchmedia-orientation-restriction - JavaScript checks orientation and blocks content
 *
 * WCAG: 1.3.4 (Orientation) Level AA
 *
 * Key Concepts:
 * - Users must be able to view content in any orientation (portrait/landscape)
 * - Locking orientation is a failure unless essential (e.g., piano app, bank check deposit)
 * - CSS that hides content in one orientation is a violation
 * - JavaScript that prevents interaction based on orientation fails WCAG
 *
 * Essential Exceptions:
 * - Bank check deposit (must be landscape for camera alignment)
 * - Piano/musical instrument apps (needs specific layout)
 * - Virtual reality applications
 * - Signature capture (may require landscape for sufficient width)
 *
 * Priority: MEDIUM IMPACT
 * Target: Ensures content is accessible in both portrait and landscape orientations
 */
export class OrientationLockAnalyzer extends BaseAnalyzer {
  readonly name = 'OrientationLockAnalyzer';
  readonly description = 'Detects code that locks screen orientation, preventing users from viewing content in their preferred orientation';

  // Screen Orientation API methods that lock orientation
  private readonly ORIENTATION_LOCK_METHODS = new Set([
    'lock',
    'lockOrientation',
    'mozLockOrientation',
    'msLockOrientation'
  ]);

  // Note: Orientation values (portrait, landscape, etc.) are detected in error messages
  // rather than validated against a list

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    const actionNodes = context.actionLanguageModel.nodes;

    // Detect Screen Orientation API usage
    issues.push(...this.detectScreenOrientationLock(actionNodes, context));

    // Detect orientation-based restrictions in JavaScript
    issues.push(...this.detectMatchMediaOrientationRestriction(actionNodes, context));

    // Note: CSS orientation locks would be detected by CSSModel if we had it
    // For now, we detect JavaScript-based orientation restrictions

    return issues;
  }

  /**
   * Detect Screen Orientation API lock() calls.
   *
   * Pattern: screen.orientation.lock('portrait') or screen.lockOrientation()
   * Problem: Prevents users from rotating device to preferred orientation
   * WCAG: 1.3.4 (Orientation)
   */
  private detectScreenOrientationLock(
    actionNodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    for (const node of actionNodes) {
      // Check for domManipulation or other action types that might contain orientation locks
      if (node.metadata?.apiCall || node.metadata?.methodCall) {
        const methodName = node.metadata.methodCall || node.metadata.apiCall;

        // Check if this is an orientation lock method
        if (this.ORIENTATION_LOCK_METHODS.has(methodName)) {
          const message = `Screen Orientation API lock detected (${methodName}). Locking screen orientation prevents users from viewing content in their preferred orientation (portrait vs landscape). This fails WCAG 1.3.4 unless the orientation is essential to the functionality. Remove orientation lock unless absolutely necessary (e.g., bank check deposit, piano app).`;

          const fix: IssueFix = {
            description: 'Remove orientation lock or document essential use case',
            code: `// ❌ DON'T lock orientation (fails WCAG 1.3.4)
// screen.orientation.lock('portrait');
// screen.lockOrientation('landscape');

// ✅ DO allow users to choose orientation
// Content should adapt to both portrait and landscape

// ✅ IF orientation is truly essential (rare cases):
// Document WHY it's essential and provide alternatives
/*
 * Orientation lock required for: Bank check deposit
 * Reason: Camera must align with check in landscape orientation
 * Alternative: Provide web-based deposit option that works in any orientation
 */
// await screen.orientation.lock('landscape');

// Examples of essential use cases:
// - Bank check deposit (camera alignment)
// - Piano/music apps (keyboard layout)
// - VR applications
// - Signature capture (needs width)

// For most apps: Use responsive design instead of locking
@media (orientation: portrait) {
  /* Adapt layout for portrait */
}

@media (orientation: landscape) {
  /* Adapt layout for landscape */
}`,
            location: node.location
          };

          issues.push(
            this.createIssue(
              'screen-orientation-lock',
              'error',
              message,
              node.location,
              ['1.3.4'],
              context,
              { fix }
            )
          );
        }
      }

      // Check for screen.orientation property access
      if (node.metadata?.propertyAccess?.includes('orientation')) {
        const code = node.metadata.sourceCode || '';

        // Check for .lock( patterns
        if (/\.lock\s*\(/i.test(code)) {
          const message = `Screen orientation lock detected. Using screen.orientation.lock() prevents users from viewing content in their preferred orientation. This violates WCAG 1.3.4 (Orientation) Level AA. Content must be viewable in both portrait and landscape unless orientation is essential to the functionality.`;

          const fix: IssueFix = {
            description: 'Remove orientation lock',
            code: `// Remove orientation lock
// Instead, use responsive CSS to adapt to both orientations

// ❌ Don't do this:
// await screen.orientation.lock('portrait');

// ✅ Do this instead:
// Use CSS media queries to adapt layout
@media (orientation: portrait) {
  .container { flex-direction: column; }
}

@media (orientation: landscape) {
  .container { flex-direction: row; }
}`,
            location: node.location
          };

          issues.push(
            this.createIssue(
              'screen-orientation-lock',
              'error',
              message,
              node.location,
              ['1.3.4'],
              context,
              { fix }
            )
          );
        }
      }
    }

    return issues;
  }

  /**
   * Detect matchMedia orientation checks that restrict functionality.
   *
   * Pattern: window.matchMedia('(orientation: portrait)') then hide/disable content
   * Problem: Blocking content based on orientation violates WCAG
   * WCAG: 1.3.4 (Orientation)
   */
  private detectMatchMediaOrientationRestriction(
    actionNodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    for (const node of actionNodes) {
      const code = node.metadata?.sourceCode || '';

      // Check for matchMedia with orientation query
      if (/matchMedia\s*\(\s*['"`]\s*\(\s*orientation\s*:/i.test(code)) {
        // This could be either:
        // 1. Responsive design (OK) - adapting layout
        // 2. Content restriction (BAD) - hiding/blocking content

        // Look for suspicious patterns that suggest content blocking
        const hasContentBlocking =
          /\.style\.display\s*=\s*['"`]none/i.test(code) ||
          /\.style\.visibility\s*=\s*['"`]hidden/i.test(code) ||
          /\.disabled\s*=\s*true/i.test(code) ||
          /\.setAttribute\s*\(\s*['"`]disabled/i.test(code) ||
          /return\s+false/i.test(code) ||
          /preventDefault\s*\(/i.test(code) ||
          /alert\s*\(/i.test(code) && /rotate|orientation|landscape|portrait/i.test(code);

        if (hasContentBlocking) {
          const message = `Orientation-based content restriction detected. JavaScript checks screen orientation (matchMedia) and appears to hide content, disable functionality, or prevent user interaction based on orientation. This violates WCAG 1.3.4 (Orientation). Users must be able to access all content in any orientation (portrait or landscape) unless orientation is essential to the functionality.`;

          const fix: IssueFix = {
            description: 'Allow content in all orientations',
            code: `// ❌ DON'T restrict content based on orientation
// if (window.matchMedia('(orientation: portrait)').matches) {
//   element.style.display = 'none'; // Blocks content
//   button.disabled = true; // Disables functionality
//   alert('Please rotate to landscape'); // Prevents use
// }

// ✅ DO adapt layout for different orientations
if (window.matchMedia('(orientation: portrait)').matches) {
  // Adapt layout, but keep all content accessible
  container.classList.add('portrait-layout');
  container.classList.remove('landscape-layout');
} else {
  container.classList.add('landscape-layout');
  container.classList.remove('portrait-layout');
}

// ✅ Both orientations have access to all content
// Use CSS for layout differences:
@media (orientation: portrait) {
  .container { flex-direction: column; }
  .sidebar { width: 100%; }
}

@media (orientation: landscape) {
  .container { flex-direction: row; }
  .sidebar { width: 250px; }
}

// Only restrict if truly essential (document why):
// - Bank check deposit (camera alignment)
// - Piano app (keyboard must be horizontal)
// - VR application (requires specific orientation)`,
            location: node.location
          };

          issues.push(
            this.createIssue(
              'matchmedia-orientation-restriction',
              'warning',
              message,
              node.location,
              ['1.3.4'],
              context,
              { fix }
            )
          );
        }
      }
    }

    return issues;
  }
}
