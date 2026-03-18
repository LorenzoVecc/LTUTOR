document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation class when elements come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature, .pricing-option');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

        // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    // Apri la lightbox quando si clicca su un'immagine
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden'; // Disabilita lo scroll della pagina
        });
    });

    // Chiudi la lightbox
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = ''; // Riabilita lo scroll della pagina
    });

    // Navigazione tra le immagini
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightboxImage();
    });

    // Chiudi cliccando fuori dall'immagine
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
            document.body.style.overflow = ''; // Riabilita lo scroll della pagina
        }
    });

    // Navigazione con tastiera
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxImage();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateLightboxImage();
        }
    });

    function updateLightboxImage() {
        const imgSrc = galleryItems[currentIndex].querySelector('img').src;
        lightboxImg.src = imgSrc;
    }

    // Update copyright year
    const year = new Date().getFullYear();
    const copyrightElement = document.querySelector('footer p');
    if (copyrightElement) {
        copyrightElement.innerHTML = `&copy; ${year} Ripetizioni di Matematica e Informatica. Tutti i diritti riservati.`;
    }

    // Team picker — animazione entrata card
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(entry.target.dataset.delay) || 0);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.tutor-card').forEach((card, i) => {
        card.dataset.delay = i * 100;
        cardObserver.observe(card);
    });

    // Team picker — tooltip TBD al click
    document.querySelectorAll('.tutor-card.tbd').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
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
});
