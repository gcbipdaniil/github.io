document.addEventListener('DOMContentLoaded', () => {
    // Установка текущего года в футере
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Плавное появление элементов при прокрутке
    const animatedElements = document.querySelectorAll('.feature-item, .hero-title, .hero-subtitle, .hero-cta'); // Добавьте другие классы, если нужно

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // Добавляем is-visible
                 // observer.unobserve(entry.target); // Если анимация нужна только раз
            } else {
                // entry.target.classList.remove('is-visible'); // Если анимация должна повторяться
            }
        });
    }, {
        threshold: 0.1 // Порог видимости 10%
    });

    animatedElements.forEach(el => {
        // Добавляем задержку анимации на основе индекса для "каскадного" эффекта
        const delay = el.dataset.animationDelay || '0s'; // Можно добавить data-animation-delay="0.Xs" в HTML
        el.style.transitionDelay = delay;
        observer.observe(el);
    });


    // Кнопка "Наверх"
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Показать кнопку после прокрутки на 300px
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Плавная прокрутка для якорных ссылок (например, в навбаре)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

     // Анимация для .hero-app-icon при загрузке
    const heroAppIcon = document.querySelector('.hero-app-icon');
    if(heroAppIcon){
        setTimeout(() => {
            heroAppIcon.style.opacity = '1';
            heroAppIcon.style.transform = 'translateY(0) scale(1)';
        }, 100); // Небольшая задержка для срабатывания transition
    }
    // Добавление стилей для .hero-app-icon, если не через CSS @keyframes
    if(heroAppIcon){
        heroAppIcon.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        heroAppIcon.style.opacity = '0';
        heroAppIcon.style.transform = 'translateY(30px) scale(0.9)';
    }


});