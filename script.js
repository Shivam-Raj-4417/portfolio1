/* ==========================================================================
   SHIVAM RAJ - PORTFOLIO INTERACTIVITY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. PARTICLE CANVAS ANIMATION
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const TOTAL_PARTICLES = Math.min(window.innerWidth < 768 ? 25 : 45, 50);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.8;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.alpha = Math.random() * 0.4 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.fillStyle = `rgba(59, 130, 246, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < TOTAL_PARTICLES; i++) {
                particles.push(new Particle());
            }
        }

        function renderParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw subtle connecting lines for nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        ctx.strokeStyle = `rgba(34, 211, 238, ${0.15 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            for (const p of particles) {
                p.update();
                p.draw();
            }

            requestAnimationFrame(renderParticles);
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        initParticles();
        renderParticles();
    }

    // --------------------------------------------------------------------------
    // 2. TYPING EFFECT
    // --------------------------------------------------------------------------
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) {
        const phrases = [
            'Full Stack Developer',
            'Scalable Systems Builder',
            'React & Node.js Engineer',
            'Clean Architecture Enthusiast'
        ];

        let phraseIdx = 0;
        let charIdx = 0;
        let deleting = false;

        function typeEffect() {
            const currentPhrase = phrases[phraseIdx];

            if (deleting) {
                typingEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typingEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = deleting ? 40 : 80;

            if (!deleting && charIdx === currentPhrase.length) {
                typeSpeed = 2200; // Pause at end of phrase
                deleting = true;
            } else if (deleting && charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 400; // Pause before new phrase
            }

            setTimeout(typeEffect, typeSpeed);
        }

        typeEffect();
    }

    // --------------------------------------------------------------------------
    // 3. NAVBAR SCROLL & ACTIVE SECTION HIGHLIGHTING
    // --------------------------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function updateNavState() {
        const scrollY = window.scrollY;

        // Scrolled background shift
        if (navbar) {
            if (scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active link detection
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNavState);
    updateNavState();

    // --------------------------------------------------------------------------
    // 4. MOBILE MENU TOGGLE
    // --------------------------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        // Close mobile menu when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });
    }

    // --------------------------------------------------------------------------
    // 5. SMOOTH SCROLL FOR INTERNAL LINKS
    // --------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --------------------------------------------------------------------------
    // 6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll(
        '.about-main-card, .info-metric-card, .skill-category-card, .experience-card, .project-card, .edu-card, .cert-card, .github-card, .contact-form-wrapper, .info-card'
    );

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --------------------------------------------------------------------------
    // 7. CONTACT FORM SIMULATION
    // --------------------------------------------------------------------------
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            if (!submitBtn) return;

            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending Message...</span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Message Sent Successfully!</span>';
                submitBtn.style.background = '#10B981';

                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1200);
        });
    }
});
