/* ================================================================
   LTUTOR — script.js
   Script condiviso per tutte le pagine del brand
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------
       1. ANNO NEL FOOTER
    ------------------------------------------------------- */
    document.querySelectorAll('#footer-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    /* -------------------------------------------------------
       2. SMOOTH SCROLL (ancora interna)
    ------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 70; // altezza navbar
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* -------------------------------------------------------
       3. FADE IN SCROLL — elementi con classe .fade-in
    ------------------------------------------------------- */
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        fadeEls.forEach(el => fadeObserver.observe(el));
    }

    /* -------------------------------------------------------
       4. TEAM CARDS — animazione entrata a cascata
    ------------------------------------------------------- */
    const tutorCards = document.querySelectorAll('.tutor-card');
    if (tutorCards.length) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(entry.target.dataset.delay) || 0);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        tutorCards.forEach((card, i) => {
            card.dataset.delay = i * 90;
            cardObserver.observe(card);
        });
    }

    /* -------------------------------------------------------
       5. TOOLTIP "PROSSIMAMENTE" — card TBD
    ------------------------------------------------------- */
    document.querySelectorAll('.tutor-card.tbd').forEach(card => {
        card.addEventListener('click', e => {
            // Se la card è un link a una pagina placeholder, lascia andare
            // (non bloccare la navigazione)
            card.classList.add('shake');
            let tip = card.querySelector('.tbd-tooltip');
            if (!tip) {
                tip = document.createElement('div');
                tip.className = 'tbd-tooltip';
                tip.textContent = 'Tutor prossimamente disponibile!';
                card.appendChild(tip);
            }
            tip.classList.add('show');
            setTimeout(() => {
                tip.classList.remove('show');
                card.classList.remove('shake');
            }, 2000);
        });
    });

    /* -------------------------------------------------------
       6. LIGHTBOX — per le pagine con galleria
    ------------------------------------------------------- */
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lb-img');
    const lbClose   = document.getElementById('lb-close');
    const lbPrev    = document.getElementById('lb-prev');
    const lbNext    = document.getElementById('lb-next');

    if (lightbox && lbImg) {
        const items = document.querySelectorAll('.gallery-item');
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            const imgEl = items[currentIndex].querySelector('img');
            if (imgEl) lbImg.src = imgEl.src;
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % items.length;
            const imgEl = items[currentIndex].querySelector('img');
            if (imgEl) lbImg.src = imgEl.src;
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            const imgEl = items[currentIndex].querySelector('img');
            if (imgEl) lbImg.src = imgEl.src;
        };

        items.forEach((item, i) => {
            item.addEventListener('click', () => openLightbox(i));
        });

        lbClose.addEventListener('click', closeLightbox);

        lbNext.addEventListener('click', e => { e.stopPropagation(); showNext(); });
        lbPrev.addEventListener('click', e => { e.stopPropagation(); showPrev(); });

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape')      closeLightbox();
            if (e.key === 'ArrowRight')  showNext();
            if (e.key === 'ArrowLeft')   showPrev();
        });
    }

    /* -------------------------------------------------------
       8. PARTICLES AI — Hero Background
    ------------------------------------------------------- */
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx             = canvas.getContext('2d');
        let particles         = [];
        const particleCount   = 55;
        const connectionDist  = 140;

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 1.5 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(58, 141, 141, 0.4)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                p1.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDist) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(58, 141, 141, ${0.15 * (1 - dist / connectionDist)})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    /* -------------------------------------------------------
       9. MAGNETIC BUTTONS (Elite Micro-interaction)
    ------------------------------------------------------- */
    if (window.innerWidth > 1024) { 
        const magneticElements = document.querySelectorAll('.btn, .nav-cta, .tutor-card, .subject-card');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Se è una card, usa le variabili CSS per non sovrascrivere l'hover
                if (el.classList.contains('tutor-card') || el.classList.contains('subject-card')) {
                    el.style.setProperty('--mag-x', `${x * 0.1}px`);
                    el.style.setProperty('--mag-y', `${y * 0.1}px`);
                } else {
                    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
                }
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.setProperty('--mag-x', '0px');
                el.style.setProperty('--mag-y', '0px');
            });
        });
    }

    /* -------------------------------------------------------
       7. NAVBAR — evidenzia link attivo in base alla pagina
    ------------------------------------------------------- */
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.ltutor-nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith(path)) {
            link.classList.add('active-page');
        }
    });

});
