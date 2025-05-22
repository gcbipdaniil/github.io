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
            }, 300); 
        }
        if (appsGridSection) {
            appsGridSection.style.display = 'block'; 
            appsGridSection.classList.remove('section-fade-out'); 
            requestAnimationFrame(() => { 
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
            }, 300); 
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
                appDetailsSection.classList.remove('section-fade-out'); 
                requestAnimationFrame(() => {
                    appDetailsSection.classList.add('section-fade-in');
                });

                const itemsToAnimate = appDetailsContent.querySelectorAll('.hero-section-app-detail, .features-section-app-detail .feature-item, .download-section-app-detail .container > *');
                itemsToAnimate.forEach((item, index) => {
                    item.classList.add('detail-item-fade-in'); 
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, (index + 1) * 150); 
                });
            }
            window.location.hash = appId;
        } catch (error) {
            console.error("Error loading app details:", error);
            if (appDetailsContent) appDetailsContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
            if (appDetailsSection) { 
                appDetailsSection.style.display = 'block';
                appDetailsSection.classList.remove('section-fade-out');
                requestAnimationFrame(() => {
                    appDetailsSection.classList.add('section-fade-in');
                });
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

    setTimeout(() => {
        const initialAppId = window.location.hash.substring(1);
        if (initialAppId && appDetailsData[initialAppId]) {
            if(appsGridSection) appsGridSection.style.display = 'none';
            if(appDetailsSection) {
                appDetailsSection.classList.remove('section-fade-out'); 
                appDetailsSection.classList.add('section-fade-in'); 
                appDetailsSection.style.display = 'block'; 
            }
            showAppDetails(initialAppId); 
        } else {
            if(appDetailsSection) appDetailsSection.style.display = 'none';
            if(appsGridSection) {
                 appsGridSection.classList.remove('section-fade-out'); 
                 appsGridSection.classList.add('section-fade-in'); 
                 appsGridSection.style.display = 'block'; 
            }
            showAppGrid(); 
        }
    }, 100); 

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const animatedElements = document.querySelectorAll('.feature-item, .hero-title, .hero-subtitle, .hero-cta'); 
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); 
            } 
        });
    }, {
        threshold: 0.1 
    });

    animatedElements.forEach(el => {
        const delay = el.dataset.animationDelay || '0s'; 
        el.style.transitionDelay = delay;
        observer.observe(el);
    });

    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { 
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

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.classList.contains('app-card-link')) return; 
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith("#") && appDetailsData[targetId.substring(1)]) {
                window.location.hash = targetId;
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const heroAppIcon = document.querySelector('.hero-app-icon');
    if(heroAppIcon){ 
        setTimeout(() => {
            heroAppIcon.style.opacity = '1';
            heroAppIcon.style.transform = 'translateY(0) scale(1)';
        }, 100); 
    }
    if(heroAppIcon){
        heroAppIcon.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        heroAppIcon.style.opacity = '0';
        heroAppIcon.style.transform = 'translateY(30px) scale(0.9)';
    }

    // APK Download Button Animation Logic (REFINED)
    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.download-apk-button');

        if (button && !button.classList.contains('is-loading')) {
            event.preventDefault();

            const buttonTextSpan = button.querySelector('.button-text');
            // If buttonTextSpan is not found, this indicates an HTML structure issue.
            // For robustness, we could proceed, but the CSS relies on .button-text for hiding text.
            if (!buttonTextSpan) {
                console.error('.button-text span not found within .download-apk-button. Cannot apply loading animation correctly.');
                // Directly trigger download without animation if structure is broken
                window.location.href = button.href; 
                return;
            }
            
            // Store original HTML content of the span (e.g., icon + text)
            const originalButtonSpanHTML = buttonTextSpan.innerHTML; 
            
            button.classList.add('is-loading');
            // CSS will hide .button-text and show .button-loader-spinner
            // if spinner is part of HTML or if CSS uses ::after.
            // Since CSS positions spinner absolutely, we need to add it.

            // Dynamically create and append spinner
            let spinner = button.querySelector('.button-loader-spinner'); // Check if already there
            if (!spinner) {
                spinner = document.createElement('span');
                spinner.className = 'button-loader-spinner';
                button.appendChild(spinner); // Append to the button itself
            }
            
            setTimeout(() => {
                const downloadUrl = button.href;
                const link = document.createElement('a');
                link.href = downloadUrl;
                let filename = downloadUrl.substring(downloadUrl.lastIndexOf('/') + 1);
                if (!filename || filename.indexOf('.') === -1) { 
                    filename = 'download.apk'; 
                }
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Restore button state
                button.classList.remove('is-loading');
                // Remove the spinner
                const spinnerToRemove = button.querySelector('.button-loader-spinner');
                if (spinnerToRemove) {
                    spinnerToRemove.remove();
                }
                // Restore original text (CSS will make it visible again)
                // buttonTextSpan.innerHTML = originalButtonSpanHTML; // This line is actually not needed if text is hidden via opacity
            }, 1500); 
        }
    });

    // About Me Section Logic
    const aboutMeContentEl = document.getElementById('about-me-content');
    const langSwitcherEl = document.getElementById('lang-switcher-about-me');

    if (aboutMeContentEl && langSwitcherEl) {
        const aboutMeTranslations = {
            'EN': "Hello! I'm a passionate developer creating innovative solutions. This section is ready for your personal introduction in English. My projects reflect my dedication to clean code and user-friendly experiences. I'm always eager to learn new technologies and take on challenging tasks. Let's build something amazing together!",
            'RU': "Привет! Я увлеченный разработчик, создающий инновационные решения. Этот раздел готов для вашего личного представления на русском языке. Мои проекты отражают мою приверженность чистому коду и удобным пользовательским интерфейсам. Я всегда готов изучать новые технологии и браться за сложные задачи. Давайте вместе создавать что-то потрясающее!",
            'BY': "Вітаю! Я захоплены распрацоўшчык, які стварае інавацыйныя рашэнні. Гэты раздзел гатовы для вашага асабістага прадстаўлення на беларускай мове. Мае праекты адлюстроўваюць маю адданасць чыстаму коду і зручным карыстальніцкім інтэрфейсам. Я заўсёды гатовы вывучаць новыя тэхналогіі і брацца за складаныя задачы. Давайце разам ствараць нешта дзіўнае!",
            'PL': "Cześć! Jestem pasjonatem programowania, tworzącym innowacyjne rozwiązania. Ta sekcja jest gotowa na Twoje osobiste wprowadzenie w języku polskim. Moje projekty odzwierciedlają moje zaangażowanie w czysty kod i przyjazne dla użytkownika interfejsy. Zawsze chętnie uczę się nowych technologii i podejmuję ambitne zadania. Zbudujmy razem coś niesamowitego!"
        };

        function updateAboutMeContent(lang) {
            if (aboutMeTranslations[lang]) {
                aboutMeContentEl.textContent = aboutMeTranslations[lang];
                
                langSwitcherEl.querySelectorAll('.lang-button').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.lang === lang) {
                        btn.classList.add('active');
                    }
                });
                localStorage.setItem('preferredLang', lang);
            } else {
                console.warn('Language not found in aboutMeTranslations:', lang);
            }
        }

        langSwitcherEl.addEventListener('click', (event) => {
            const targetButton = event.target.closest('.lang-button');
            if (targetButton && targetButton.dataset.lang) {
                updateAboutMeContent(targetButton.dataset.lang);
            }
        });

        const savedLang = localStorage.getItem('preferredLang');
        const defaultLang = 'EN'; // Default to English
        updateAboutMeContent(savedLang || defaultLang);

    } else {
        if (!aboutMeContentEl) console.warn("Element with ID 'about-me-content' not found.");
        if (!langSwitcherEl) console.warn("Element with ID 'lang-switcher-about-me' not found.");
    }
});
