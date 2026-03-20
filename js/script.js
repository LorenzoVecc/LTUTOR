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
