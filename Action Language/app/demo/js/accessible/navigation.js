/**
 * Accessible Navigation Implementation
 * GOOD EXAMPLE
 *
 * Best Practices:
 * - Use semantic <nav> element with aria-label
 * - Provide skip links for keyboard users
 * - Use aria-current for active page
 * - Keyboard accessible dropdown menus
 * - Arrow key navigation within menus
 * - Escape key to close menus
 * - Proper focus management
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const container = document.querySelector('.example.good .demo-container');
    if (!container) return;

    // Create accessible navigation with dropdown
    container.innerHTML = `
      <a href="#good-main-content" class="skip-link">Skip to main content</a>

      <nav aria-label="Main navigation" role="navigation">
        <ul role="menubar" aria-label="Main Menu">
          <li role="none">
            <a href="#home" role="menuitem" aria-current="page">Home</a>
          </li>
          <li role="none">
            <button
              id="good-products-btn"
              role="menuitem"
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls="good-products-menu">
              Products
            </button>
            <ul id="good-products-menu" role="menu" aria-label="Products submenu" hidden>
              <li role="none">
                <a href="#widgets" role="menuitem">Widgets</a>
              </li>
              <li role="none">
                <a href="#gadgets" role="menuitem">Gadgets</a>
              </li>
              <li role="none">
                <a href="#services" role="menuitem">Services</a>
              </li>
            </ul>
          </li>
          <li role="none">
            <a href="#about" role="menuitem">About</a>
          </li>
          <li role="none">
            <a href="#contact" role="menuitem">Contact</a>
          </li>
        </ul>
      </nav>

      <div id="good-main-content" tabindex="-1" style="margin-top: 20px; padding: 15px; border: 1px solid #e5e5e5;">
        <h3>Main Content Area</h3>
        <p>Skip link will jump here. Navigation is fully keyboard accessible.</p>
      </div>
    `;

    const productsBtn = document.getElementById('good-products-btn');
    const productsMenu = document.getElementById('good-products-menu');
    const menuItems = productsMenu.querySelectorAll('[role="menuitem"]');

    let isMenuOpen = false;

    // Toggle dropdown with click
    productsBtn.addEventListener('click', function() {
      toggleMenu();
    });

    // GOOD: Keyboard support for dropdown
    productsBtn.addEventListener('keydown', function(event) {
      switch(event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          toggleMenu();
          if (isMenuOpen) {
            // Focus first menu item
            menuItems[0].focus();
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          openMenu();
          menuItems[0].focus();
          break;

        case 'Escape':
          event.preventDefault();
          closeMenu();
          break;
      }
    });

    // GOOD: Arrow key navigation within menu
    menuItems.forEach((item, index) => {
      item.addEventListener('keydown', function(event) {
        switch(event.key) {
          case 'ArrowDown':
            event.preventDefault();
            // Focus next item (wrap to first)
            const nextIndex = (index + 1) % menuItems.length;
            menuItems[nextIndex].focus();
            break;

          case 'ArrowUp':
            event.preventDefault();
            // Focus previous item (wrap to last)
            const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
            menuItems[prevIndex].focus();
            break;

          case 'Home':
            event.preventDefault();
            menuItems[0].focus();
            break;

          case 'End':
            event.preventDefault();
            menuItems[menuItems.length - 1].focus();
            break;

          case 'Escape':
            event.preventDefault();
            closeMenu();
            productsBtn.focus();
            break;

          case 'Tab':
            // Allow normal Tab behavior but close menu
            closeMenu();
            break;
        }
      });

      // Close menu on link click
      item.addEventListener('click', function(event) {
        event.preventDefault();
        closeMenu();
        // Simulate navigation
        const target = item.getAttribute('href');
        console.log('Navigate to:', target);
      });
    });

    // GOOD: Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!productsBtn.contains(event.target) && !productsMenu.contains(event.target)) {
        closeMenu();
      }
    });

    function toggleMenu() {
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      isMenuOpen = true;
      productsMenu.hidden = false;
      productsBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      isMenuOpen = false;
      productsMenu.hidden = true;
      productsBtn.setAttribute('aria-expanded', 'false');
    }

    // Handle skip link
    const skipLink = container.querySelector('.skip-link');
    skipLink.addEventListener('click', function(event) {
      event.preventDefault();
      const mainContent = document.getElementById('good-main-content');
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }
})();
