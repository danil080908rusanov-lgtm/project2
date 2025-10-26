var burger_open = false;

// Хэдер
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100 && !document.querySelector('.header__nav--open')){
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});


// Хиро банер - фон
function initHeroBackgroundRotation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const images = [
        'images/hero1.png',
        'images/hero2.png',
        'images/hero3.png',
        'images/hero4.png'
    ];
    
    let currentIndex = 0;
    
    // Кроссфейд
    const bg1 = document.createElement('div');
    const bg2 = document.createElement('div');
    
    const bgStyles = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        transition: opacity 1.5s ease-in-out;
        z-index: -2;
    `;
    
    bg1.style.cssText = bgStyles;
    bg2.style.cssText = bgStyles + 'opacity: 0;';
    
    bg1.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${images[0]}")`;
    bg2.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${images[1]}")`;
    
    hero.appendChild(bg1);
    hero.appendChild(bg2);
    
    hero.style.backgroundImage = 'none';
    hero.style.position = 'relative';
    
    // Загрузка картинок
    function preloadImages() {
        for (let i = 2; i < images.length; i++) {
            const img = new Image();
            img.src = images[i];
        }
    }
    
    function changeBackground() {
        const nextIndex = (currentIndex + 1) % images.length;
        
        const visibleBg = bg1.style.opacity !== '0' ? bg1 : bg2;
        const hiddenBg = visibleBg === bg1 ? bg2 : bg1;
        
        hiddenBg.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${images[nextIndex]}")`;
        
        visibleBg.style.opacity = '0';
        hiddenBg.style.opacity = '1';
        
        currentIndex = nextIndex;
    }
    
    preloadImages();
    setInterval(changeBackground, 6000);
}

// Бургер
const mobileToggle = document.querySelector('.header__mobile-toggle');
const nav = document.querySelector('.header__nav');
if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('header__nav--open');
        if (document.querySelector('.header--scrolled')){
            header.classList.toggle('header--scrolled');
        }
    });
}


// Кнопка "Наверх"
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('scroll-top--visible');
        } else {
            scrollTopBtn.classList.remove('scroll-top--visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Счетчики
const statNumbers = document.querySelectorAll('.stat__number');
let hasCounted = false;

function animateCounter() {
    if (hasCounted || statNumbers.length === 0) return;
    
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    
    const sectionTop = statsSection.offsetTop;
    const sectionHeight = statsSection.offsetHeight;
    const scrollPosition = window.scrollY + window.innerHeight;
    
    if (scrollPosition > sectionTop + sectionHeight / 2) {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let count = 0;
            const duration = 2000;
            const startTime = Date.now();
            
            const updateCount = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                
                count = Math.floor(target * easeOutQuart);
                stat.textContent = count;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCount();
        });
        
        hasCounted = true;
    }
}

// Анимация появления карточек
const featureCards = document.querySelectorAll('.feature__card');
const aboutImage = document.querySelector('.about__image');
const statItems = document.querySelectorAll('.stat__item');

function animateOnScroll() {
    featureCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (cardTop < windowHeight * 0.85) {
            card.classList.add('feature__card--visible');
        }
    });
    
    if (aboutImage) {
        const imageTop = aboutImage.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (imageTop < windowHeight * 0.85) {
            aboutImage.classList.add('about__image--visible');
        }
    }
    
    statItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (itemTop < windowHeight * 0.85) {
            item.classList.add('stat__item--visible');
        }
    });
    
    animateCounter();
}

// Модалька
const contactForm = document.querySelector('.contact__form');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalButton = document.querySelector('.modal__button');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            input.classList.remove('error', 'shake');
            
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                
                setTimeout(() => {
                    input.classList.add('shake');
                }, 10);
            }
        });

        if (!isValid) {
            return;
        }
        
        const submitBtn = this.querySelector('.form__button');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
            
            showModal();
            contactForm.reset();
        }, 1500);
    });
}

// Показать модальку
function showModal() {
    if (modal) {
        modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
    }
}

// Скрыть модальку
function hideModal() {
    if (modal) {
        modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }
}

// События для закрытия модальки
if (modalClose) {
    modalClose.addEventListener('click', hideModal);
}

if (modalButton) {
    modalButton.addEventListener('click', hideModal);
}

if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
}

// Закрытие модальки при нажатии на esc
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('modal--active')) {
        hideModal();
    }
});

// Инициировать анимации
window.addEventListener('load', () => {
    if (document.querySelector('.hero__animation')) {
        animateHero();
    }
    
    animateOnScroll();
    
    if (document.querySelector('.hero')) {
        initHeroBackgroundRotation();
    }
});


// Замедлить проверки на скролл
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            animateOnScroll();
            scrollTimeout = null;
        }, 10);
    }
});