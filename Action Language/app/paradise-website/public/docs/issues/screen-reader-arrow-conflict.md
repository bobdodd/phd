# Screen Reader Arrow Conflict

**Issue Type:** `screen-reader-arrow-conflict`
**Severity:** Info
**WCAG:** 2.1.1 (Keyboard)

## Description

Arrow key handlers can interfere with screen reader browse mode navigation. Screen readers use arrow keys to read content line-by-line (Up/Down) or character-by-character (Left/Right) when in browse mode. If your application intercepts arrow keys globally or in reading contexts, it breaks screen reader users' ability to navigate and consume content, creating a significant accessibility barrier.

## The Problem

```javascript
// ❌ Bad: Global arrow key handler interferes with browse mode
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    scrollToNextSection();
    // Screen reader users can't read line-by-line!
  }
});

// ❌ Bad: Arrow keys in text content area
const article = document.querySelector('article');
article.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    navigateSections(event.key);
    // Breaks character-by-character reading!
  }
});

// ❌ Bad: Arrow keys without checking focus context
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    previousPage();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    nextPage();
  }
  // Intercepts arrows everywhere, including text inputs!
});

// ❌ Bad: Vim-style navigation without disable option
document.addEventListener('keydown', (event) => {
  if (event.key === 'j') {
    scrollDown();
  } else if (event.key === 'k') {
    scrollUp();
  }
  // Conflicts with screen reader AND browse mode navigation
});
```

**Why this is a problem:**
- Screen readers use arrows for line-by-line reading (Up/Down)
- Screen readers use arrows for character navigation (Left/Right)
- Blind users cannot read text content with intercepted arrows
- Creates severe usability issues for screen reader users
- May violate WCAG 2.1.1 (Keyboard)

**Screen reader browse mode arrow keys:**
- **ArrowDown**: Next line
- **ArrowUp**: Previous line
- **ArrowRight**: Next character
- **ArrowLeft**: Previous character
- Also used in virtual cursor navigation mode

## The Solution

Only use arrow keys in **focused interactive widgets**, not in static content areas.

```javascript
// ✅ Good: Arrow keys only in interactive widget
const slider = document.querySelector('[role="slider"]');
slider.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    increaseValue();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    decreaseValue();
  }
});

// ✅ Good: Arrow keys scoped to specific widget
const carousel = document.querySelector('.carousel');
carousel.addEventListener('keydown', (event) => {
  // Only handle arrows when carousel button has focus
  if (event.target.matches('.carousel-button')) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previousSlide();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextSlide();
    }
  }
});

// ✅ Good: Check focus context before intercepting
document.addEventListener('keydown', (event) => {
  const activeElement = document.activeElement;

  // Don't intercept if user is in text input or reading content
  if (
    activeElement.matches('input, textarea, select, [contenteditable]') ||
    activeElement.closest('article, [role="article"], [role="document"]')
  ) {
    return; // Let arrow keys work naturally
  }

  // Only intercept in navigation context
  if (activeElement.matches('.nav-item, .menu-item')) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusNextNavItem();
    }
  }
});

// ✅ Good: Provide keyboard shortcuts toggle
const settings = {
  keyboardShortcutsEnabled: false  // Disabled by default
};

document.addEventListener('keydown', (event) => {
  if (!settings.keyboardShortcutsEnabled) return;

  // Only if explicitly enabled by user
  if (event.key === 'j') {
    scrollDown();
  }
});
```

## Safe Contexts for Arrow Keys

### ✅ Safe: ARIA Widgets

```javascript
// Arrow keys are EXPECTED and REQUIRED in these roles:
const safeRoles = [
  'listbox',      // Arrow up/down for options
  'menu',         // Arrow up/down for items
  'menubar',      // Arrow left/right for menus
  'radiogroup',   // Arrow keys for radio buttons
  'slider',       // Arrow left/right to adjust
  'spinbutton',   // Arrow up/down to change value
  'tablist',      // Arrow left/right for tabs
  'tree',         // Arrow keys for navigation
  'treegrid',     // 2D arrow navigation
  'grid'          // 2D arrow navigation
];

// Implementation
listbox.addEventListener('keydown', (event) => {
  // SAFE: Listbox role expects arrow keys
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    selectNextOption();
  }
});
```

### ⚠️ Unsafe: Static Content

```javascript
// DON'T use arrow keys in these contexts:
const unsafeContexts = [
  'article',          // Text content users need to read
  '[role="article"]', // Text content
  'main',             // Main content area
  'p',                // Paragraphs
  'div'               // Generic containers (unless interactive widget)
];

// ❌ Bad: Arrow keys in article
const article = document.querySelector('article');
article.addEventListener('keydown', (event) => {
  // DON'T DO THIS - breaks screen reader reading
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    nextSection();
  }
});
```

### ✅ Safe: Focused Buttons/Controls

```javascript
// Arrow keys on focused controls are acceptable
const imageGallery = document.querySelector('.gallery');
const prevButton = imageGallery.querySelector('.prev');
const nextButton = imageGallery.querySelector('.next');

// Arrow keys work when buttons have focus
imageGallery.addEventListener('keydown', (event) => {
  const activeElement = document.activeElement;

  if (activeElement === prevButton || activeElement === nextButton) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previousImage();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextImage();
    }
  }
});
```

## Common Patterns

### 1. Image Carousel (Safe Implementation)

```javascript
// ✅ Carousel with arrow keys only on control buttons
class Carousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.slides = Array.from(carouselElement.querySelectorAll('.slide'));
    this.currentIndex = 0;
    this.prevButton = carouselElement.querySelector('.prev');
    this.nextButton = carouselElement.querySelector('.next');

    this.setupKeyboard();
  }

  setupKeyboard() {
    // Arrow keys ONLY when carousel controls have focus
    [this.prevButton, this.nextButton].forEach(button => {
      button.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.previousSlide();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.nextSlide();
        }
      });
    });

    // DON'T add global arrow handler to carousel element
    // This would break screen reader reading of slide content
  }

  previousSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlide();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlide();
  }

  updateSlide() {
    this.slides.forEach((slide, index) => {
      slide.hidden = index !== this.currentIndex;
    });

    // Announce slide change
    const announcer = document.getElementById('carousel-announcer');
    announcer.textContent = `Slide ${this.currentIndex + 1} of ${this.slides.length}`;
  }
}
```

### 2. Pagination (Safe Implementation)

```javascript
// ✅ Pagination with arrow keys on focused buttons only
class Pagination {
  constructor(paginationElement) {
    this.pagination = paginationElement;
    this.setupKeyboard();
  }

  setupKeyboard() {
    // Arrow keys work when pagination has focus
    this.pagination.addEventListener('keydown', (event) => {
      // Only if a pagination button has focus
      if (!event.target.matches('[data-page]')) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.previousPage();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.nextPage();
      } else if (event.key === 'Home') {
        event.preventDefault();
        this.firstPage();
      } else if (event.key === 'End') {
        event.preventDefault();
        this.lastPage();
      }
    });
  }

  previousPage() {
    // Implementation
  }

  nextPage() {
    // Implementation
  }

  firstPage() {
    // Implementation
  }

  lastPage() {
    // Implementation
  }
}
```

### 3. Split View (Safe Implementation)

```javascript
// ✅ Split view with arrow keys only on splitter handle
class SplitView {
  constructor(containerElement) {
    this.container = containerElement;
    this.splitter = containerElement.querySelector('.splitter');
    this.leftPane = containerElement.querySelector('.left-pane');
    this.rightPane = containerElement.querySelector('.right-pane');

    this.setupKeyboard();
  }

  setupKeyboard() {
    // Arrow keys ONLY when splitter handle has focus
    this.splitter.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.adjustSplit(-10);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.adjustSplit(10);
      }
    });

    // DON'T intercept arrows in left/right panes
    // Users need to read content with screen readers
  }

  adjustSplit(pixels) {
    // Implementation
  }
}
```

### 4. Reading Mode vs Navigation Mode

```javascript
// ✅ Explicit modes with clear toggle
class ArticleReader {
  constructor(articleElement) {
    this.article = articleElement;
    this.navigationMode = false; // Default: reading mode

    this.setupModeToggle();
    this.setupKeyboard();
  }

  setupModeToggle() {
    // Ctrl+N to toggle navigation mode
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        this.navigationMode = !this.navigationMode;
        this.announceMode();
      }
    });
  }

  setupKeyboard() {
    this.article.addEventListener('keydown', (event) => {
      // Only intercept if navigation mode is enabled
      if (!this.navigationMode) {
        return; // Let screen reader use arrows normally
      }

      // Navigation mode: arrow keys jump sections
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.nextSection();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.previousSection();
      }
    });
  }

  announceMode() {
    const announcer = document.getElementById('mode-announcer');
    announcer.textContent = this.navigationMode
      ? 'Navigation mode enabled. Arrow keys navigate sections. Press Ctrl+N to disable.'
      : 'Reading mode enabled. Arrow keys work normally. Press Ctrl+N for navigation mode.';
  }

  nextSection() {
    // Implementation
  }

  previousSection() {
    // Implementation
  }
}
```

### 5. Game Controls (Alternative Approach)

```javascript
// ✅ Game with WASD instead of arrows, or explicit game mode
class Game {
  constructor() {
    this.setupKeyboard();
  }

  setupKeyboard() {
    // Use WASD instead of arrows (doesn't conflict)
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyW':
          this.moveUp();
          break;
        case 'KeyA':
          this.moveLeft();
          break;
        case 'KeyS':
          this.moveDown();
          break;
        case 'KeyD':
          this.moveRight();
          break;
      }
    });

    // Alternatively: require Enter to start game mode
    // (disables screen reader, shows clear UI indication)
  }
}
```

## React Example

```typescript
// ✅ React component with safe arrow key usage
import { useState, KeyboardEvent } from 'react';

function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Arrow keys only on carousel controls, not globally
  const handleControlKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setCurrentIndex(prev => (prev + 1) % images.length);
    }
  };

  return (
    <div className="carousel" role="group" aria-label="Image carousel">
      <button
        onClick={() => setCurrentIndex(prev => prev - 1)}
        onKeyDown={handleControlKeyDown}  // Arrow keys only here
        aria-label="Previous image"
      >
        Previous
      </button>

      <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />

      <button
        onClick={() => setCurrentIndex(prev => prev + 1)}
        onKeyDown={handleControlKeyDown}  // Arrow keys only here
        aria-label="Next image"
      >
        Next
      </button>

      <div aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {images.length}
      </div>
    </div>
  );
}
```

## Testing

### Manual Testing with Screen Reader

1. **Enable Screen Reader:**
   - Windows: NVDA (Ctrl+Alt+N) or JAWS
   - Mac: VoiceOver (Cmd+F5)
   - Linux: Orca

2. **Test Browse Mode:**
   - Navigate to page
   - Use ArrowDown to read line-by-line
   - Verify arrow keys work for reading
   - Verify no interference from custom handlers

3. **Test in Interactive Widgets:**
   - Tab to listbox/menu/slider
   - Use arrow keys for widget navigation
   - Verify arrows work as expected

4. **Test Mode Switching:**
   - Enter forms mode (Tab to input)
   - Verify arrow keys work in inputs
   - Exit forms mode
   - Verify browse mode arrows work

### Automated Testing

```javascript
describe('Arrow key conflicts', () => {
  it('should not intercept arrows in content areas', () => {
    const article = document.createElement('article');
    article.innerHTML = '<p>Some text to read</p>';
    document.body.appendChild(article);

    const handler = jest.fn();
    document.addEventListener('keydown', handler);

    // Arrow down should NOT be prevented in article
    const arrowEvent = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true
    });

    const defaultPrevented = !article.dispatchEvent(arrowEvent);
    expect(defaultPrevented).toBe(false);
  });

  it('should allow arrows in interactive widgets', () => {
    const slider = document.createElement('div');
    slider.setAttribute('role', 'slider');

    slider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
      }
    });

    const arrowEvent = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true
    });

    const defaultPrevented = !slider.dispatchEvent(arrowEvent);
    expect(defaultPrevented).toBe(true);  // Should prevent
  });
});
```

## Best Practices

1. **Scope Arrow Keys to Widgets:** Only use in role="listbox", role="slider", etc.
2. **Check Focus Context:** Don't intercept if user is reading content
3. **Provide Alternatives:** Use WASD or other keys for non-widget navigation
4. **Document Modes:** Clearly announce navigation vs reading mode
5. **Test with Screen Readers:** Always verify with NVDA, JAWS, VoiceOver
6. **Respect Text Inputs:** Never intercept arrows in input, textarea
7. **Provide Disable Option:** Let users turn off custom arrow behavior

## When Arrow Keys Are Acceptable

✅ **Acceptable contexts:**
- ARIA widgets (listbox, menu, slider, tabs, tree, grid)
- Focused control buttons (carousel prev/next)
- Game mode (with clear UI indication)
- Explicit navigation mode (with toggle and announcement)

❌ **Unacceptable contexts:**
- Global document handlers
- Article/text content areas
- Reading contexts
- Anywhere screen readers need arrows for browsing

## Related Issues

- [screen-reader-conflict](./screen-reader-conflict.md) - Single-character shortcuts
- [missing-arrow-navigation](./missing-arrow-navigation.md) - ARIA widgets need arrows
- [potential-keyboard-trap](./potential-keyboard-trap.md) - Keyboard traps

## Additional Resources

- [WCAG 2.1.1: Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)
- [Screen Reader Keyboard Navigation](https://webaim.org/articles/keyboard/)
- [NVDA Browse Mode](https://www.nvaccess.org/files/nvda/documentation/userGuide.html#BrowseMode)
- [JAWS Cursor](https://www.freedomscientific.com/training/jaws/cursor/)
- [VoiceOver Navigation](https://www.apple.com/voiceover/info/guide/)
