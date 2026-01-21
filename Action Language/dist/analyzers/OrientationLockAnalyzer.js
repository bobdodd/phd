"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrientationLockAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class OrientationLockAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'OrientationLockAnalyzer';
        this.description = 'Detects code that locks screen orientation, preventing users from viewing content in their preferred orientation';
        this.ORIENTATION_LOCK_METHODS = new Set([
            'lock',
            'lockOrientation',
            'mozLockOrientation',
            'msLockOrientation'
        ]);
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const actionNodes = context.actionLanguageModel.nodes;
        issues.push(...this.detectScreenOrientationLock(actionNodes, context));
        issues.push(...this.detectMatchMediaOrientationRestriction(actionNodes, context));
        return issues;
    }
    detectScreenOrientationLock(actionNodes, context) {
        const issues = [];
        for (const node of actionNodes) {
            if (node.metadata?.apiCall || node.metadata?.methodCall) {
                const methodName = node.metadata.methodCall || node.metadata.apiCall;
                if (this.ORIENTATION_LOCK_METHODS.has(methodName)) {
                    const message = `Screen Orientation API lock detected (${methodName}). Locking screen orientation prevents users from viewing content in their preferred orientation (portrait vs landscape). This fails WCAG 1.3.4 unless the orientation is essential to the functionality. Remove orientation lock unless absolutely necessary (e.g., bank check deposit, piano app).`;
                    const fix = {
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
                    issues.push(this.createIssue('screen-orientation-lock', 'error', message, node.location, ['1.3.4'], context, { fix }));
                }
            }
            if (node.metadata?.propertyAccess?.includes('orientation')) {
                const code = node.metadata.sourceCode || '';
                if (/\.lock\s*\(/i.test(code)) {
                    const message = `Screen orientation lock detected. Using screen.orientation.lock() prevents users from viewing content in their preferred orientation. This violates WCAG 1.3.4 (Orientation) Level AA. Content must be viewable in both portrait and landscape unless orientation is essential to the functionality.`;
                    const fix = {
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
                    issues.push(this.createIssue('screen-orientation-lock', 'error', message, node.location, ['1.3.4'], context, { fix }));
                }
            }
        }
        return issues;
    }
    detectMatchMediaOrientationRestriction(actionNodes, context) {
        const issues = [];
        for (const node of actionNodes) {
            const code = node.metadata?.sourceCode || '';
            if (/matchMedia\s*\(\s*['"`]\s*\(\s*orientation\s*:/i.test(code)) {
                const hasContentBlocking = /\.style\.display\s*=\s*['"`]none/i.test(code) ||
                    /\.style\.visibility\s*=\s*['"`]hidden/i.test(code) ||
                    /\.disabled\s*=\s*true/i.test(code) ||
                    /\.setAttribute\s*\(\s*['"`]disabled/i.test(code) ||
                    /return\s+false/i.test(code) ||
                    /preventDefault\s*\(/i.test(code) ||
                    /alert\s*\(/i.test(code) && /rotate|orientation|landscape|portrait/i.test(code);
                if (hasContentBlocking) {
                    const message = `Orientation-based content restriction detected. JavaScript checks screen orientation (matchMedia) and appears to hide content, disable functionality, or prevent user interaction based on orientation. This violates WCAG 1.3.4 (Orientation). Users must be able to access all content in any orientation (portrait or landscape) unless orientation is essential to the functionality.`;
                    const fix = {
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
                    issues.push(this.createIssue('matchmedia-orientation-restriction', 'warning', message, node.location, ['1.3.4'], context, { fix }));
                }
            }
        }
        return issues;
    }
}
exports.OrientationLockAnalyzer = OrientationLockAnalyzer;
