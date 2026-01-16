/**
 * Accessible Carousel Implementation
 *
 * This implementation follows WCAG 2.1 Level AA guidelines and WAI-ARIA best practices:
 * - role="region" with aria-roledescription="carousel" on container
 * - aria-label on carousel region
 * - role="group" with aria-roledescription="slide" on each slide
 * - aria-label on each slide indicating position
 * - Proper keyboard navigation with Previous/Next buttons
 * - Pause/Play button for auto-rotation control
 * - Tab panel pattern for slide indicators
 * - Arrow key navigation between indicators
 * - Auto-rotation pauses on hover and focus
 * - Live region announcements for slide changes
 */

class AccessibleCarousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.slides = Array.from(this.carousel.querySelectorAll('.carousel-slide'));
        this.slidesContainer = this.carousel.querySelector('.carousel-slides');
        this.indicators = Array.from(this.carousel.querySelectorAll('.carousel-indicator'));
        this.prevButton = this.carousel.querySelector('.carousel-nav-button.prev');
        this.nextButton = this.carousel.querySelector('.carousel-nav-button.next');
        this.playPauseButton = this.carousel.querySelector('.carousel-play-pause');

        this.currentIndex = 0;
        this.isPlaying = true;
        this.rotationInterval = null;
        this.rotationDelay = 5000; // 5 seconds per slide
        this.isPaused = false; // For hover/focus pause

        // Get live region from document
        this.liveRegion = document.getElementById('carousel-live-region');

        this.init();
    }

    init() {
        // Set up event listeners
        this.setupNavigationButtons();
        this.setupIndicators();
        this.setupPlayPauseButton();
        this.setupHoverPause();
        this.setupFocusPause();
        this.setupKeyboardNavigation();

        // Initialize first slide
        this.goToSlide(0, false);

        // Start auto-rotation if play button exists
        if (this.playPauseButton) {
            this.startRotation();
        }
    }

    setupNavigationButtons() {
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                this.previousSlide();
                this.resetRotation();
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.nextSlide();
                this.resetRotation();
            });
        }
    }

    setupIndicators() {
        this.indicators.forEach((indicator, index) => {
            // Click handler
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetRotation();
            });

            // Keyboard navigation for tab panel pattern
            indicator.addEventListener('keydown', (e) => {
                this.handleIndicatorKeydown(e, index);
            });
        });
    }

    handleIndicatorKeydown(event, currentIndex) {
        let newIndex = currentIndex;
        let preventDefaultFlag = false;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                newIndex = currentIndex > 0 ? currentIndex - 1 : this.indicators.length - 1;
                preventDefaultFlag = true;
                break;

            case 'ArrowRight':
            case 'ArrowDown':
                newIndex = currentIndex < this.indicators.length - 1 ? currentIndex + 1 : 0;
                preventDefaultFlag = true;
                break;

            case 'Home':
                newIndex = 0;
                preventDefaultFlag = true;
                break;

            case 'End':
                newIndex = this.indicators.length - 1;
                preventDefaultFlag = true;
                break;
        }

        if (preventDefaultFlag) {
            event.preventDefault();
            this.goToSlide(newIndex);
            this.indicators[newIndex].focus();
            this.resetRotation();
        }
    }

    setupPlayPauseButton() {
        if (!this.playPauseButton) return;

        this.playPauseButton.addEventListener('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });
    }

    setupHoverPause() {
        // Pause rotation when mouse hovers over carousel
        this.carousel.addEventListener('mouseenter', () => {
            if (this.isPlaying) {
                this.isPaused = true;
                this.stopRotation();
            }
        });

        this.carousel.addEventListener('mouseleave', () => {
            if (this.isPlaying && this.isPaused) {
                this.isPaused = false;
                this.startRotation();
            }
        });
    }

    setupFocusPause() {
        // Pause rotation when any element inside carousel receives focus
        const focusableElements = this.carousel.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                if (this.isPlaying) {
                    this.isPaused = true;
                    this.stopRotation();
                }
            });

            element.addEventListener('blur', () => {
                // Check if focus moved outside the carousel
                setTimeout(() => {
                    if (!this.carousel.contains(document.activeElement)) {
                        if (this.isPlaying && this.isPaused) {
                            this.isPaused = false;
                            this.startRotation();
                        }
                    }
                }, 10);
            });
        });
    }

    setupKeyboardNavigation() {
        // Additional keyboard shortcuts for carousel navigation
        this.carousel.addEventListener('keydown', (e) => {
            // Only handle if focus is on the carousel itself, not on controls
            if (e.target === this.carousel) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousSlide();
                    this.resetRotation();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                    this.resetRotation();
                }
            }
        });
    }

    goToSlide(index, announce = true) {
        if (index < 0 || index >= this.slides.length) return;

        this.currentIndex = index;

        // Update slides position
        const offset = -index * 100;
        this.slidesContainer.style.transform = `translateX(${offset}%)`;

        // Update indicators
        this.updateIndicators();

        // Update navigation buttons
        this.updateNavigationButtons();

        // Announce slide change to screen readers
        if (announce && this.liveRegion) {
            this.announceSlideChange();
        }
    }

    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            const isSelected = index === this.currentIndex;
            indicator.setAttribute('aria-selected', isSelected.toString());
            indicator.setAttribute('tabindex', isSelected ? '0' : '-1');
        });
    }

    updateNavigationButtons() {
        // Optional: Disable buttons at boundaries
        // For circular navigation, keep them always enabled
        if (this.prevButton) {
            this.prevButton.disabled = false; // Always enabled for circular
        }
        if (this.nextButton) {
            this.nextButton.disabled = false; // Always enabled for circular
        }
    }

    announceSlideChange() {
        const slideNumber = this.currentIndex + 1;
        const totalSlides = this.slides.length;

        // Get slide content for announcement
        const currentSlide = this.slides[this.currentIndex];
        const heading = currentSlide.querySelector('h3');
        const slideName = heading ? heading.textContent : '';

        const announcement = `Slide ${slideNumber} of ${totalSlides}${slideName ? ': ' + slideName : ''}`;

        if (this.liveRegion) {
            this.liveRegion.textContent = announcement;
        }
    }

    previousSlide() {
        const newIndex = this.currentIndex > 0
            ? this.currentIndex - 1
            : this.slides.length - 1; // Circular navigation
        this.goToSlide(newIndex);
    }

    nextSlide() {
        const newIndex = this.currentIndex < this.slides.length - 1
            ? this.currentIndex + 1
            : 0; // Circular navigation
        this.goToSlide(newIndex);
    }

    startRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }

        this.rotationInterval = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, this.rotationDelay);
    }

    stopRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }

    resetRotation() {
        if (this.isPlaying && !this.isPaused) {
            this.stopRotation();
            this.startRotation();
        }
    }

    pause() {
        this.isPlaying = false;
        this.isPaused = false;
        this.stopRotation();
        this.updatePlayPauseButton();
        this.carousel.classList.add('paused');
    }

    play() {
        this.isPlaying = true;
        this.startRotation();
        this.updatePlayPauseButton();
        this.carousel.classList.remove('paused');
    }

    updatePlayPauseButton() {
        if (!this.playPauseButton) return;

        const icon = this.playPauseButton.querySelector('span[aria-hidden="true"]');
        const text = this.playPauseButton.querySelector('span:not([aria-hidden])');

        if (this.isPlaying) {
            this.playPauseButton.setAttribute('aria-label', 'Pause automatic slide rotation');
            this.playPauseButton.setAttribute('data-playing', 'true');
            if (icon) icon.textContent = '⏸';
            if (text) text.textContent = 'Pause';
        } else {
            this.playPauseButton.setAttribute('aria-label', 'Start automatic slide rotation');
            this.playPauseButton.setAttribute('data-playing', 'false');
            if (icon) icon.textContent = '▶';
            if (text) text.textContent = 'Play';
        }
    }

    destroy() {
        this.stopRotation();
        // Remove event listeners if needed
    }
}

// Initialize all accessible carousels
document.addEventListener('DOMContentLoaded', () => {
    const accessibleCarousels = document.querySelectorAll('.accessible-carousel');

    accessibleCarousels.forEach(carouselElement => {
        new AccessibleCarousel(carouselElement);
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibleCarousel;
}
