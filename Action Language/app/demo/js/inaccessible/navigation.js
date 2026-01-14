/**
 * Inaccessible Navigation Implementation
 * INTENTIONAL VIOLATIONS
 *
 * Issues:
 * - No semantic <nav> element (using divs instead)
 * - No skip links for keyboard users
 * - Click-only dropdown menu (hover only)
 * - No keyboard navigation support
 * - No ARIA roles or labels
 * - No aria-current for active page
 * - Mouse-dependent interaction
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const container = document.querySelector('.example.bad .demo-container');
    if (!container) return;

    // ISSUE: No skip link
    // ISSUE: Using div instead of semantic nav element
    // ISSUE: No role="navigation" or aria-label
    container.innerHTML = `
      <div class="nav-div" style="background: #f3f4f6; padding: 10px;">
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; gap: 20px;">
          <li>
            <span id="bad-nav-home" style="cursor: pointer; font-weight: bold;">Home</span>
          </li>
          <li style="position: relative;">
            <span id="bad-products-trigger" style="cursor: pointer;">
              Products ▾
            </span>
            <div id="bad-products-menu" class="dropdown-menu" style="display: none; position: absolute; background: white; border: 1px solid #ccc; padding: 10px; margin-top: 5px;">
              <div class="menu-item" style="padding: 5px; cursor: pointer;">Widgets</div>
              <div class="menu-item" style="padding: 5px; cursor: pointer;">Gadgets</div>
              <div class="menu-item" style="padding: 5px; cursor: pointer;">Services</div>
            </div>
          </li>
          <li>
            <span id="bad-nav-about" style="cursor: pointer;">About</span>
          </li>
          <li>
            <span id="bad-nav-contact" style="cursor: pointer;">Contact</span>
          </li>
        </ul>
      </div>

      <div id="bad-main-content" style="margin-top: 20px; padding: 15px; border: 1px solid #e5e5e5;">
        <h3>Main Content Area</h3>
        <p>No skip link available. Keyboard users must tab through entire navigation.</p>
      </div>
    `;

    const productsTrigger = document.getElementById('bad-products-trigger');
    const productsMenu = document.getElementById('bad-products-menu');
    const navHome = document.getElementById('bad-nav-home');
    const navAbout = document.getElementById('bad-nav-about');
    const navContact = document.getElementById('bad-nav-contact');

    // ISSUE: Click-only navigation items without keyboard support
    navHome.addEventListener('click', function() {
      console.log('Navigate to home');
      alert('Home clicked (no keyboard support!)');
    });

    navAbout.addEventListener('click', function() {
      console.log('Navigate to about');
      alert('About clicked (no keyboard support!)');
    });

    navContact.addEventListener('click', function() {
      console.log('Navigate to contact');
      alert('Contact clicked (no keyboard support!)');
    });

    // ISSUE: Hover-only dropdown menu
    // No click handler, only hover
    productsTrigger.addEventListener('mouseenter', function() {
      productsMenu.style.display = 'block';
    });

    productsTrigger.addEventListener('mouseleave', function() {
      // Delay hiding to allow moving to menu
      setTimeout(function() {
        if (!productsMenu.matches(':hover')) {
          productsMenu.style.display = 'none';
        }
      }, 100);
    });

    productsMenu.addEventListener('mouseleave', function() {
      productsMenu.style.display = 'none';
    });

    // ISSUE: Menu items are click-only divs
    const menuItems = productsMenu.querySelectorAll('.menu-item');
    menuItems.forEach(function(item) {
      item.addEventListener('click', function() {
        productsMenu.style.display = 'none';
        alert(item.textContent + ' clicked (no keyboard support!)');
      });

      // Visual feedback on hover only
      item.addEventListener('mouseenter', function() {
        item.style.backgroundColor = '#e5e7eb';
      });

      item.addEventListener('mouseleave', function() {
        item.style.backgroundColor = '';
      });
    });

    // ISSUE: No keyboard handlers at all
    // - No Enter/Space support for navigation items
    // - No Arrow key navigation
    // - No Escape to close menu
    // - No Tab key handling
    // - No focus management

    // ISSUE: No ARIA attributes
    // - No aria-haspopup
    // - No aria-expanded
    // - No aria-current
    // - No role="menubar" or role="menu"
    // - No aria-label

    // ISSUE: Using non-focusable elements (span, div)
    // These can't receive keyboard focus without tabindex
    // But no tabindex added, so completely inaccessible via keyboard
  }
})();
