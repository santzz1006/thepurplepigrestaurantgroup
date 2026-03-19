/**
 * The Purple Pig - Main JavaScript
 * Architecture: Modular, Event-driven, Vanilla JS (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. DYNAMIC NAVBAR SCROLL EFFECT
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        const handleScroll = () => {
            // Check if we are on the homepage (which uses transparent-nav initially)
            const isTransparent = navbar.classList.contains('transparent-nav');
            
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                if (isTransparent) {
                    navbar.classList.remove('transparent-nav');
                    navbar.classList.add('solid-nav');
                }
            } else {
                navbar.classList.remove('scrolled');
                if (isTransparent) {
                    navbar.classList.add('transparent-nav');
                    navbar.classList.remove('solid-nav');
                }
            }
        };

        // Initialize and listen
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /* ==========================================================================
       2. MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const toggleIcon = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            
            // Switch between hamburger and close icon
            if (toggleIcon) {
                if (isActive) {
                    toggleIcon.classList.remove('fa-bars');
                    toggleIcon.classList.add('fa-times');
                } else {
                    toggleIcon.classList.remove('fa-times');
                    toggleIcon.classList.add('fa-bars');
                }
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                if (toggleIcon) {
                    toggleIcon.classList.remove('fa-times');
                    toggleIcon.classList.add('fa-bars');
                }
            }
        });
    }

    /* ==========================================================================
       3. INTERSECTION OBSERVER (SCROLL ANIMATIONS)
       ========================================================================== */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Configure observer settings
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before the element hits the bottom
        threshold: 0.1 // 10% of the element must be visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('is-visible');
                // Stop observing once animated (run once)
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Attach observer to all target elements
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    /* ==========================================================================
       4. PREMIUM BUTTON RIPPLE EFFECT
       ========================================================================== */
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function(e) {
            // Calculate coordinates
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            // Style and position ripple dynamically based on click
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.marginTop = '-50px';
            ripple.style.marginLeft = '-50px';

            this.appendChild(ripple);

            // Cleanup the span after the CSS animation completes (600ms)
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    /* ==========================================================================
       5. DYNAMIC GALLERY LIGHTBOX (For gallery.html & index.html)
       ========================================================================== */
    const galleryImages = document.querySelectorAll('.zoom-on-hover');
    
    if (galleryImages.length > 0) {
        // Create lightbox container dynamically
        const lightbox = document.createElement('div');
        lightbox.id = 'dynamic-lightbox';
        
        // Style the lightbox overlay via JS to avoid cluttering CSS unnecessarily
        Object.assign(lightbox.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '3000',
            opacity: '0',
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            cursor: 'zoom-out'
        });

        // Create the image element inside lightbox
        const lightboxImg = document.createElement('img');
        Object.assign(lightboxImg.style, {
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            transform: 'scale(0.95)',
            transition: 'transform 0.3s ease'
        });

        // Create close button
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '20px',
            right: '30px',
            color: '#fff',
            fontSize: '2rem',
            cursor: 'pointer'
        });

        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);

        // Open Lightbox Event
        galleryImages.forEach(img => {
            // Ignore images that might be inside buttons or shop cards if they share the class
            if(!img.closest('.shop-card') && !img.closest('.dish-card')) {
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    lightboxImg.src = img.src;
                    lightbox.style.pointerEvents = 'auto';
                    lightbox.style.opacity = '1';
                    lightboxImg.style.transform = 'scale(1)';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                });
            }
        });

        // Close Lightbox Event
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            lightbox.style.pointerEvents = 'none';
            lightboxImg.style.transform = 'scale(0.95)';
            document.body.style.overflow = 'auto'; // Restore scrolling
            setTimeout(() => { lightboxImg.src = ''; }, 300); // Clear source after fade out
        };

        lightbox.addEventListener('click', closeLightbox);
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.opacity === '1') {
                closeLightbox();
            }
        });
    }

    /* ==========================================================================
       6. ACTIVE LINK HIGHLIGHTING
       ========================================================================== */
    // Ensure the correct nav link is highlighted based on current URL path
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(link => {
        const linkPath = link.getAttribute('href');
        // If the href matches the current path, or if we are at root and href is index.html
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            navItems.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        }
    });
});