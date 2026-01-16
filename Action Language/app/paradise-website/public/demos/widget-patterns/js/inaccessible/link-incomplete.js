/**
 * Incomplete/Inaccessible Link Implementation
 * Demonstrates common link accessibility mistakes
 *
 * Issues Demonstrated:
 * 1. Fake links using div/span with onclick (not keyboard accessible)
 * 2. Non-descriptive link text ("click here")
 * 3. Icon-only links without aria-label
 * 4. Links without href attribute
 * 5. External links without warning (target="_blank" without notification)
 *
 * Paradise detects 5 issues in this implementation
 */

(function() {
  'use strict';

  // Get the bad links container
  const badContainer = document.querySelector('.bad-links');
  if (!badContainer) return;

  /**
   * Issue 1: Fake link using span with onclick
   * Problem: Not keyboard accessible, no semantic meaning, screen reader doesn't announce as link
   */
  const fakeLink = badContainer.querySelector('.fake-link');
  if (fakeLink) {
    fakeLink.addEventListener('click', () => {
      console.log('❌ Issue 1: Fake link clicked (span with onclick)');
      console.log('  Problems:');
      console.log('  - Not keyboard accessible (no tabindex)');
      console.log('  - No semantic link element');
      console.log('  - Screen reader announces as text, not link');
      console.log('  - Missing role="link"');
      alert('Fake link clicked!\n\nProblems:\n- Not keyboard accessible\n- Not announced as link by screen readers');
    });
  }

  /**
   * Issue 2: Non-descriptive link text ("click here")
   * Problem: Meaningless out of context, fails WCAG 2.4.9
   */
  const clickHereLinks = badContainer.querySelectorAll('a[href="#download"]');
  clickHereLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('❌ Issue 2: Non-descriptive link text');
      console.log('  Link text: "click here"');
      console.log('  Problems:');
      console.log('  - Meaningless out of context');
      console.log('  - Screen reader users navigating by links can\'t understand purpose');
      console.log('  - Fails WCAG 2.4.9 (Link Purpose - Link Only)');
      alert('Non-descriptive link!\n\nProblem: "Click here" doesn\'t describe where the link goes.\n\nBetter: "Download the 2026 Annual Report"');
    });
  });

  /**
   * Issue 3: Icon-only link without aria-label
   * Problem: Screen reader announces "link" with no context
   */
  const iconOnlyLinks = badContainer.querySelectorAll('a.icon-link:not([aria-label])');
  iconOnlyLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('❌ Issue 3: Icon-only link without aria-label');
      console.log('  Problems:');
      console.log('  - Screen reader announces "link" with no purpose');
      console.log('  - Users can\'t determine link destination');
      console.log('  - Fails WCAG 4.1.2 (Name, Role, Value)');
      alert('Icon-only link without label!\n\nProblem: Screen reader can\'t identify the link purpose.\n\nFix: Add aria-label="Follow us on Twitter"');
    });
  });

  /**
   * Issue 4: Link without href attribute
   * Problem: Not keyboard accessible, not focusable
   */
  const noHrefLinks = badContainer.querySelectorAll('a.no-href:not([href])');
  noHrefLinks.forEach(link => {
    link.addEventListener('click', () => {
      console.log('❌ Issue 4: Link without href attribute');
      console.log('  Problems:');
      console.log('  - Not keyboard accessible (can\'t Tab to it)');
      console.log('  - Not focusable');
      console.log('  - Fails WCAG 2.1.1 (Keyboard)');
      alert('Link without href!\n\nProblem: Not keyboard accessible.\n\nFix: Add href attribute or use tabindex="0" with keydown handler');
    });
  });

  /**
   * Issue 5: External link without warning (target="_blank")
   * Problem: Opens new window unexpectedly, disorients users
   */
  const externalLinksNoWarning = badContainer.querySelectorAll('a[target="_blank"]:not([aria-label*="new window"])');
  externalLinksNoWarning.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('❌ Issue 5: External link without warning');
      console.log('  Problems:');
      console.log('  - Opens new window without warning');
      console.log('  - Disorients users, especially screen reader users');
      console.log('  - Missing rel="noopener noreferrer" (security)');
      console.log('  - Fails WCAG 3.2.5 (Change on Request)');
      alert('External link opened unexpectedly!\n\nProblem: Users weren\'t warned about new window.\n\nFix: Add aria-label="... (opens in new window)" or visible text indicator');
    });
  });

  /**
   * Log all detected issues
   */
  console.log('❌ Inaccessible Links - Issues Found:');
  console.log('');
  console.log('Issue 1: Fake link (span with onclick)');
  console.log('  - Element: span.fake-link');
  console.log('  - Missing: <a> element, href, keyboard access');
  console.log('');
  console.log('Issue 2: Non-descriptive link text');
  console.log('  - Text: "click here"');
  console.log('  - Missing: Descriptive link purpose');
  console.log('');
  console.log('Issue 3: Icon-only link without label');
  console.log('  - Element: <a> with SVG but no text');
  console.log('  - Missing: aria-label');
  console.log('');
  console.log('Issue 4: Link without href');
  console.log('  - Element: <a> with onclick only');
  console.log('  - Missing: href attribute');
  console.log('');
  console.log('Issue 5: External link without warning');
  console.log('  - Attribute: target="_blank"');
  console.log('  - Missing: Warning text/aria-label, rel="noopener noreferrer"');
  console.log('');
  console.log('Total Issues: 5');
  console.log('WCAG Failures: 2.1.1, 2.4.4, 2.4.9, 3.2.5, 4.1.2');

})();
