/**
 * Simple Responsive Handler for Exercise Game
 */

class ResponsiveHandler {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isLandscape = window.innerWidth > window.innerHeight;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupViewportMeta();
        this.setupTouchOptimizations();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    setupEventListeners() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupViewportMeta() {
        // Ensure proper viewport meta tag
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        if (this.isMobile) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        } else {
            viewport.content = 'width=device-width, initial-scale=1.0';
        }
    }

    setupTouchOptimizations() {
        if (this.isMobile) {
            // Prevent zoom on double tap
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (event) => {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);

            // Prevent pull-to-refresh
            document.body.style.overscrollBehavior = 'none';
        }
    }

    handleOrientationChange() {
        this.isLandscape = window.innerWidth > window.innerHeight;
        
        // Update camera aspect ratio for better mobile experience
        const cameraContainer = document.querySelector('.camera-container');
        if (cameraContainer && this.isMobile) {
            if (this.isLandscape) {
                cameraContainer.style.aspectRatio = '16/9';
            } else {
                cameraContainer.style.aspectRatio = '4/3';
            }
        }

        // Trigger resize event to update layout
        window.dispatchEvent(new Event('resize'));
    }

    handleResize() {
        const newIsMobile = this.detectMobile();
        
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            this.setupViewportMeta();
        }

        // Update game container layout
        this.updateGameLayout();
    }

    updateGameLayout() {
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) return;

        if (this.isMobile && !this.isLandscape) {
            // Mobile portrait: stack vertically
            gameContainer.style.flexDirection = 'column';
        } else {
            // Desktop/tablet or mobile landscape: side by side
            gameContainer.style.flexDirection = 'row';
        }
    }

    // Utility methods
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    getScreenSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
}

// Initialize responsive handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveHandler = new ResponsiveHandler();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveHandler;
} 