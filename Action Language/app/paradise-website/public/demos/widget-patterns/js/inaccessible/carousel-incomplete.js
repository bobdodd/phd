/**
 * Inaccessible Carousel Implementation
 *
 * This implementation demonstrates common accessibility mistakes:
 * ✗ No role="region" or aria-roledescription="carousel"
 * ✗ No aria-label on carousel container
 * ✗ Slides lack role="group" and aria-roledescription="slide"
 * ✗ No aria-label on slides for position information
 * ✗ Navigation controls are div elements instead of buttons
 * ✗ No Pause/Play button for auto-rotation
 * ✗ Indicators don't use tab panel pattern (role="tab")
 * ✗ No auto-rotation pause on hover or focus
 * ✗ No live region announcements
 * ✗ Images have empty alt attributes
 * ✗ No proper keyboard navigation
 * ✗ Uses inline onclick handlers instead of proper event listeners
 *
 * Paradise detects 8 issues in this implementation.
 */

// Global variables for inaccessible carousels
const inaccessibleCarousels = {};

// Initialize inaccessible carousel
function initInaccessibleCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    inaccessibleCarousels[carouselId] = {
        currentIndex: 0,
        slides: carousel.querySelectorAll('.carousel-slide'),
        indicators: carousel.querySelectorAll('.carousel-indicator'),
        slidesContainer: carousel.querySelector('.carousel-slides'),
        autoRotateInterval: null
    };

    // Start auto-rotation immediately (doesn't pause on hover/focus)
    startAutoRotate(carouselId);

    // Update initial state
    updateCarousel(carouselId);
}

// Move to specific slide
function goToSlide(carouselId, index) {
    const carousel = inaccessibleCarousels[carouselId];
    if (!carousel) return;

    carousel.currentIndex = index;
    updateCarousel(carouselId);

    // Don't reset rotation timer - continues uninterrupted
}

// Move by delta
function moveSlide(carouselId, delta) {
    const carousel = inaccessibleCarousels[carouselId];
    if (!carousel) return;

    const newIndex = carousel.currentIndex + delta;

    // Circular navigation
    if (newIndex < 0) {
        carousel.currentIndex = carousel.slides.length - 1;
    } else if (newIndex >= carousel.slides.length) {
        carousel.currentIndex = 0;
    } else {
        carousel.currentIndex = newIndex;
    }

    updateCarousel(carouselId);

    // Don't reset rotation timer
}

// Update carousel display
function updateCarousel(carouselId) {
    const carousel = inaccessibleCarousels[carouselId];
    if (!carousel) return;

    // Update slides position
    const offset = -carousel.currentIndex * 100;
    carousel.slidesContainer.style.transform = `translateX(${offset}%)`;

    // Update indicators - just visual styling, no ARIA
    carousel.indicators.forEach((indicator, index) => {
        if (index === carousel.currentIndex) {
            // No aria-selected attribute
            indicator.style.background = '#667eea';
            indicator.style.width = '14px';
            indicator.style.height = '14px';
        } else {
            indicator.style.background = '#d0d0d0';
            indicator.style.width = '12px';
            indicator.style.height = '12px';
        }
    });

    // No live region announcements
}

// Auto-rotation (doesn't pause on hover/focus)
function startAutoRotate(carouselId) {
    const carousel = inaccessibleCarousels[carouselId];
    if (!carousel) return;

    // Clear existing interval
    if (carousel.autoRotateInterval) {
        clearInterval(carousel.autoRotateInterval);
    }

    // Start new interval - never pauses
    carousel.autoRotateInterval = setInterval(() => {
        moveSlide(carouselId, 1);
    }, 4000); // 4 seconds
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize inaccessible carousels
    const inaccessibleCarouselElements = document.querySelectorAll('.inaccessible-carousel');

    inaccessibleCarouselElements.forEach(carousel => {
        if (carousel.id) {
            initInaccessibleCarousel(carousel.id);
        }
    });
});

// No cleanup function
// No keyboard navigation support
// No focus management
// No pause on interaction
