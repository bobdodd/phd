/**
 * Complete Accessible Breadcrumb Implementation
 * Follows WAI-ARIA Authoring Practices Guide for Breadcrumb
 *
 * Key Features:
 * - Semantic navigation structure (nav > ol > li)
 * - aria-label="Breadcrumb" for identification
 * - aria-current="page" on current page
 * - aria-hidden="true" on separators
 * - Naturally keyboard accessible (native links)
 *
 * Note: Breadcrumb is primarily a structural pattern.
 * The JavaScript here is minimal - just for demo purposes to prevent navigation.
 */

(function() {
  'use strict';

  const breadcrumbNav = document.querySelector('nav[aria-label="Breadcrumb"]');
  if (!breadcrumbNav) return;

  const links = Array.from(breadcrumbNav.querySelectorAll('a'));
  const currentItem = breadcrumbNav.querySelector('[aria-current="page"]');

  /**
   * Prevent actual navigation in demo (show alert instead)
   */
  links.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const label = link.textContent.trim();
      console.log('✅ Breadcrumb link activated:', {
        index,
        label,
        href: link.getAttribute('href')
      });
      alert(`Navigate to: ${label}\n(In real app, would navigate to: ${link.getAttribute('href')})`);
    });
  });

  console.log('✅ Accessible breadcrumb initialized:', {
    navigation: breadcrumbNav.getAttribute('aria-label'),
    totalItems: breadcrumbNav.querySelectorAll('li').length,
    links: links.length,
    currentPage: currentItem?.textContent.trim() || 'none',
    features: [
      '<nav> landmark with aria-label="Breadcrumb"',
      '<ol> for semantic hierarchy',
      '<li> for each breadcrumb item',
      '<a> elements naturally keyboard accessible',
      'aria-current="page" on current item',
      'Separators hidden from screen readers (aria-hidden="true")',
      'Screen readers announce: "Breadcrumb navigation, list, N items"',
      'Screen readers announce: "current page" for last item'
    ]
  });
})();
