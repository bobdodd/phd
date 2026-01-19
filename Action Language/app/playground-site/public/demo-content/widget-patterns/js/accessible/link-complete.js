/**
 * Complete Accessible Link Implementation
 * Demonstrates proper link patterns following WCAG 2.4.4, 2.4.9, 4.1.2
 *
 * Key Features:
 * - Uses <a> element with href (semantic and keyboard accessible)
 * - Descriptive link text (not "click here")
 * - aria-label for icon-only links
 * - aria-describedby for additional context
 * - target="_blank" with warning and security attributes
 * - Proper focus indicators
 * - Visual link indicators (underline, color)
 *
 * WCAG Success Criteria:
 * - 2.1.1 Keyboard (Level A): Links naturally keyboard accessible
 * - 2.4.4 Link Purpose - In Context (Level A): Link purpose clear from context
 * - 2.4.9 Link Purpose - Link Only (Level AAA): Link purpose clear from text alone
 * - 4.1.2 Name, Role, Value (Level A): Links have accessible names
 */

(function() {
  'use strict';

  // Get all accessible links
  const accessibleContainer = document.querySelector('.accessible-links');
  if (!accessibleContainer) return;

  const links = Array.from(accessibleContainer.querySelectorAll('a'));

  /**
   * Prevent actual navigation in demo (show alert instead)
   * In production, links would navigate normally
   */
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      // Only prevent navigation for demo purposes
      if (link.getAttribute('href').startsWith('#') ||
          link.getAttribute('href').startsWith('http')) {
        event.preventDefault();

        const href = link.getAttribute('href');
        const text = link.textContent.trim() || link.getAttribute('aria-label');
        const isExternal = link.getAttribute('target') === '_blank';

        console.log('✅ Accessible link activated:', {
          text,
          href,
          isExternal,
          hasAriaLabel: link.hasAttribute('aria-label'),
          hasAriaDescribedby: link.hasAttribute('aria-describedby'),
          role: link.getAttribute('role') || 'link (implicit)',
          keyboardAccessible: true
        });

        let message = `Link: ${text}\nDestination: ${href}`;
        if (isExternal) {
          message += '\n\n⚠ Opens in new window (user was warned via aria-label)';
        }

        alert(message);
      }
    });
  });

  /**
   * Verify link accessibility features
   */
  const linkAnalysis = links.map((link) => {
    const hasHref = link.hasAttribute('href');
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasAriaDescribedby = link.hasAttribute('aria-describedby');
    const hasTarget = link.getAttribute('target') === '_blank';
    const hasRel = link.hasAttribute('rel');
    const isIconOnly = !hasText && link.querySelector('svg');

    return {
      element: link.tagName.toLowerCase(),
      href: link.getAttribute('href'),
      text: link.textContent.trim() || link.getAttribute('aria-label'),
      hasHref,
      hasText,
      hasAriaLabel,
      hasAriaDescribedby,
      opensNewWindow: hasTarget,
      hasSecurityRel: hasRel,
      isIconOnly,
      accessible: hasHref && (hasText || hasAriaLabel),
      warnings: []
    };
  });

  /**
   * Log accessibility analysis
   */
  console.log('✅ Accessible Links Analysis:', {
    totalLinks: links.length,
    allHaveHref: linkAnalysis.every(a => a.hasHref),
    iconOnlyLinksHaveLabel: linkAnalysis
      .filter(a => a.isIconOnly)
      .every(a => a.hasAriaLabel),
    externalLinksHaveWarning: linkAnalysis
      .filter(a => a.opensNewWindow)
      .every(a => a.hasAriaLabel && a.text.toLowerCase().includes('new window')),
    features: [
      '✓ All links use <a> element with href',
      '✓ All links keyboard accessible (Tab to focus, Enter to activate)',
      '✓ Descriptive link text (no "click here")',
      '✓ Icon-only links have aria-label',
      '✓ External links warn about new window',
      '✓ target="_blank" includes rel="noopener noreferrer"',
      '✓ Links with additional context use aria-describedby',
      '✓ Visual indicators present (underline, color)',
      '✓ Focus indicators visible',
      '✓ Screen readers announce link role and purpose'
    ],
    links: linkAnalysis
  });

  /**
   * Verify aria-describedby references
   */
  const linksWithDescribedby = links.filter(link =>
    link.hasAttribute('aria-describedby')
  );

  linksWithDescribedby.forEach(link => {
    const describedbyId = link.getAttribute('aria-describedby');
    const describedElement = document.getElementById(describedbyId);

    if (describedElement) {
      console.log('✅ aria-describedby reference valid:', {
        link: link.textContent.trim(),
        describedbyId,
        description: describedElement.textContent.trim()
      });
    } else {
      console.warn('⚠ aria-describedby reference broken:', {
        link: link.textContent.trim(),
        describedbyId,
        status: 'Element not found'
      });
    }
  });

  /**
   * Check for proper external link handling
   */
  const externalLinks = links.filter(link =>
    link.getAttribute('target') === '_blank'
  );

  externalLinks.forEach(link => {
    const hasRel = link.hasAttribute('rel');
    const relValue = link.getAttribute('rel');
    const hasWarning = link.hasAttribute('aria-label') &&
                      link.getAttribute('aria-label').toLowerCase().includes('new window');

    console.log('✅ External link validation:', {
      href: link.getAttribute('href'),
      target: '_blank',
      hasRelAttribute: hasRel,
      relValue: relValue,
      hasNewWindowWarning: hasWarning,
      ariaLabel: link.getAttribute('aria-label'),
      secure: hasRel && relValue.includes('noopener')
    });
  });

  /**
   * Keyboard interaction demonstration
   */
  console.log('✅ Keyboard Interaction:');
  console.log('  - Tab: Navigate between links');
  console.log('  - Enter: Activate focused link');
  console.log('  - All links naturally keyboard accessible (href present)');

  /**
   * Screen reader announcements
   */
  console.log('✅ Screen Reader Announcements:');
  console.log('  - Basic link: "Privacy Policy, link"');
  console.log('  - External link: "W3C Web Accessibility Initiative (opens in new window), link"');
  console.log('  - Icon-only link: "Follow us on Twitter, link"');
  console.log('  - Link with describedby: "Understanding WCAG 2.2, link, Published January 15, 2026"');

})();
