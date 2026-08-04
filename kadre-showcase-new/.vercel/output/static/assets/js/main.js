/**
 * KADRE, BY VOUH DIGITAL — MAIN JAVASCRIPT
 * FAQ Accordion & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initFaqAccordion();
    initScrollAnimations();
});

/* ─── SCROLL REVEAL ANIMATIONS ─── */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger cards within
                const cards = entry.target.querySelectorAll('.template-card, .feature-card');
                if (cards.length > 0) {
                    cards.forEach((card, i) => {
                        setTimeout(() => card.classList.add('visible'), i * 100);
                    });
                } else {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, { threshold: 0.1 });

    // Observe template grid, feature grid, and any .fade-in-up
    document.querySelectorAll('.templates-grid, .template-grid, .features-grid, .fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isOpen = item.classList.contains('active');

            // Fermer tous les éléments
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Ouvrir l'élément actuel s'il n'était pas ouvert
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
}
