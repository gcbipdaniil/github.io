document.addEventListener('DOMContentLoaded', () => {
    // Loading screen logic
    const loaderWrapper = document.getElementById('loader-wrapper');
    if (loaderWrapper) {
        setTimeout(() => {
            loaderWrapper.classList.add('loader-hidden');
        }, 3000); // 3 seconds
    }

    // SPA Navigation Logic
    const appsGridSection = document.getElementById('apps-grid-section');
    const appDetailsSection = document.getElementById('app-details-section');
    const appDetailsContent = document.getElementById('app-details-content');
    const backToGridButton = document.getElementById('back-to-grid-button');

    const appDetailsData = {
        "schoolsupdaterby": {
            title: "SchoolsUpdaterBY",
            contentPath: "schoolsupdaterby_content.html"
        }
        // Future apps can be added here
    };

    function showAppGrid() {
        if (appDetailsSection) {
            appDetailsSection.classList.remove('section-fade-in');
            appDetailsSection.classList.add('section-fade-out');
            setTimeout(() => {
                appDetailsSection.style.display = 'none';
                // No need to remove section-fade-out if it only defines the 'out' state
            }, 300); // Match CSS transition time (0.3s)
        }
        if (appsGridSection) {
            appsGridSection.style.display = 'block'; // Or 'grid'
            appsGridSection.classList.remove('section-fade-out'); // Remove if present
            // Ensure display is block before adding class for animation to trigger
            requestAnimationFrame(() => { // Or setTimeout(() => {...}, 20)
                appsGridSection.classList.add('section-fade-in');
            });
        }
        if (window.location.hash) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
        window.scrollTo(0, 0);
    }

    async function showAppDetails(appId) {
        if (!appDetailsData[appId]) {
            console.error("App details not found for:", appId);
            showAppGrid();
            return;
        }

        if (appsGridSection) {
            appsGridSection.classList.remove('section-fade-in');
            appsGridSection.classList.add('section-fade-out');
            setTimeout(() => {
                appsGridSection.style.display = 'none';
            }, 300); // Match CSS transition time
        }
        
        try {
            const response = await fetch(appDetailsData[appId].contentPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch content: ${response.statusText}`);
            }
            const content = await response.text();
            if (appDetailsContent) appDetailsContent.innerHTML = content;
            
            if (appDetailsSection) {
                appDetailsSection.style.display = 'block';
                appDetailsSection.classList.remove('section-fade-out'); // Remove if present
                requestAnimationFrame(() => {
                    appDetailsSection.classList.add('section-fade-in');
                });

                // Animate items within the loaded content
                const itemsToAnimate = appDetailsContent.querySelectorAll('.hero-section-app-detail, .features-section-app-detail .feature-item, .download-section-app-detail .container > *');
                itemsToAnimate.forEach((item, index) => {
                    item.classList.add('detail-item-fade-in'); // Set initial state
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, (index + 1) * 150); // Staggered delay
                });
            }
            window.location.hash = appId;
        } catch (error) {
            console.error("Error loading app details:", error);
            if (appDetailsContent) appDetailsContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
            if (appDetailsSection) { // Still show the section with the error
                appDetailsSection.style.display = 'block';
                appDetailsSection.classList.remove('section-fade-out');
                requestAnimationFrame(() => {
                    appDetailsSection.classList.add('section-fade-in');
                });
                // Also apply entry animation to error message if needed
                const errorPara = appDetailsContent.querySelector('p');
                if (errorPara) {
                    errorPara.classList.add('detail-item-fade-in');
                    setTimeout(() => errorPara.classList.add('is-visible'), 150);
                }
            }
        }
        window.scrollTo(0, 0);
    }

    document.querySelectorAll('.app-card-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const appId = e.currentTarget.dataset.appId;
            if (appId) {
                showAppDetails(appId);
            }
        });
    });

    if (backToGridButton) {
        backToGridButton.addEventListener('click', (e) => {
            e.preventDefault();
            showAppGrid();
        });
    }

    window.addEventListener('hashchange', () => {
        const appId = window.location.hash.substring(1);
        if (appId && appDetailsData[appId]) {
            showAppDetails(appId);
        } else if (!appId) {
            showAppGrid();
        }
    });

    // Initial Page Load Check - defer this slightly to ensure all elements are ready
    // and allow initial loader to be seen if desired.
    setTimeout(() => {
        const initialAppId = window.location.hash.substring(1);
        if (initialAppId && appDetailsData[initialAppId]) {
            // Ensure grid is hidden and details section is prepared for fade-in
            if(appsGridSection) appsGridSection.style.display = 'none';
            if(appDetailsSection) {
                appDetailsSection.classList.remove('section-fade-out'); // Clear any lingering out state
                appDetailsSection.classList.add('section-fade-in'); // Start with fade-in
                appDetailsSection.style.display = 'block'; // Make sure it's display block
            }
            showAppDetails(initialAppId); // This will handle content loading and ensure fade-in
        } else {
            // Ensure details is hidden and grid section is prepared for fade-in
            if(appDetailsSection) appDetailsSection.style.display = 'none';
            if(appsGridSection) {
                 appsGridSection.classList.remove('section-fade-out'); // Clear any lingering out state
                 appsGridSection.classList.add('section-fade-in'); // Start with fade-in
                 appsGridSection.style.display = 'block'; // Make sure it's display block
            }
            showAppGrid(); // Default to grid view.
        }
    }, 100); // Small delay for initial setup

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