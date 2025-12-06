// Основной JavaScript файл для EnergiSync Pro

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== СЛАЙДЕР =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let autoPlayInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Автоплей
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // События
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(index);
            startAutoPlay();
        });
    });

    // Пауза при hover
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);

    // Запуск
    startAutoPlay();

    // ===== МОБИЛЬНОЕ МЕНЮ =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });
    }
    
    // ===== ФОРМА ОБРАТНОЙ СВЯЗИ =====
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            const company = document.getElementById('company').value;
            
            // Простая валидация телефона
            const phoneRegex = /^(\+7|8)[\s(]?\d{3}[)\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            // Простая валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Пожалуйста, введите корректный email адрес');
                return;
            }
            
            if (!name.trim() || !company.trim()) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // В реальном проекте здесь был бы AJAX запрос к серверу
            // Для демонстрации просто показываем модальное окно
            
            // Сохраняем данные в localStorage (для демо)
            const formData = {
                name: name,
                company: company,
                phone: phone,
                email: email,
                position: document.getElementById('position') ? document.getElementById('position').value : '',
                users: document.getElementById('users') ? document.getElementById('users').value : '',
                system: document.getElementById('system') ? document.getElementById('system').value : '',
                message: document.getElementById('message') ? document.getElementById('message').value : '',
            };
            localStorage.setItem('contactFormData', JSON.stringify(formData));
            
            // Показываем модальное окно успеха
            if (successModal) {
                successModal.style.display = 'flex';
            }
            
            // Очищаем форму
            contactForm.reset();
        });
    }
    
    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }
    
    // ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми карточками
    document.querySelectorAll('.feature-card, .stat-item, .client-logo').forEach(element => {
        observer.observe(element);
    });
    
    // ===== ТАБЛИЦА ТРЕБОВАНИЙ (для requirements.html) =====
    const requirementsTable = document.querySelector('.requirements-table');
    if (requirementsTable) {
        // Добавляем эффект при наведении
        requirementsTable.addEventListener('mouseover', function(e) {
            if (e.target.tagName === 'TD') {
                e.target.parentNode.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
            }
        });
        
        requirementsTable.addEventListener('mouseout', function(e) {
            if (e.target.tagName === 'TD') {
                const row = e.target.parentNode;
                if (row.rowIndex % 2 === 0) {
                    row.style.backgroundColor = 'var(--energy-light)';
                } else {
                    row.style.backgroundColor = 'transparent';
                }
            }
        });
    }
    
    // ===== ОБРАБОТКА МОДАЛЬНЫХ ОКОН =====
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            contactModal.style.display = 'none';
        });
    }
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (e) => {
        if (contactModal && e.target === contactModal) {
            contactModal.style.display = 'none';
        }
    });
    
    // ===== ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ ГОДА В ПОДВАЛЕ =====
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
    
    // ===== ПОДСВЕТКА АКТИВНОЙ СТРАНИЦЫ В НАВИГАЦИИ =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref === 'index.html' && currentPage === '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // ===== КНОПКА "НАВЕРХ" =====
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-yellow);
        color: var(--energy-dark);
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('mouseover', () => {
        scrollToTopBtn.style.transform = 'translateY(-5px)';
        scrollToTopBtn.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
    });
    
    scrollToTopBtn.addEventListener('mouseout', () => {
        scrollToTopBtn.style.transform = 'translateY(0)';
        scrollToTopBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // ===== ДОПОЛНИТЕЛЬНЫЕ CSS АНИМАЦИИ =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .feature-card, .stat-item, .client-logo {
            opacity: 0;
        }
        
        .feature-card.animate-in {
            opacity: 1;
        }
        
        .stat-item.animate-in {
            opacity: 1;
        }
        
        .client-logo.animate-in {
            opacity: 1;
        }
        
        .modal {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    if (document.querySelector('.map-section')) { // Только на geography
    const regions = document.querySelectorAll('.region-default, .region-highlighted'); // Все регионы
    const tooltip = document.getElementById('tooltip'); // Убедитесь, что <div id="tooltip"></div> в <body> (добавьте если нет)
    
    // Данные регионов (расширьте из вашего truncated)
    const regionData = {
        'Алтайский край': 'Подключена: 2024, Потенциал: 12 ГВт, Подстанций: 5000, ЛЭП: 15 тыс. км',
        'Красноярский край': 'Подключена: 2023, Потенциал: 45 ГВт, Подстанций: 12000, ЛЭП: 80 тыс. км',
        // ... добавьте все из вашего JS
        'Не подключённая зона 1': 'Не подключена: планируется в 2026, Потенциал: 5 ГВт',
        'Не подключённая зона 2': 'Не подключена: в разработке, Потенциал: 3 ГВт'
    };
    
    let hoverTimeout;
    let clickedRegion = null; // Для клика
    
    regions.forEach(region => {
        const regionName = region.dataset.region;
        
        // Hover (существующий + улучшенный)
        region.addEventListener('mouseenter', (e) => {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                if (tooltip && regionData[regionName]) {
                    tooltip.innerHTML = `<strong>${regionName}</strong><br>${regionData[regionName]}`;
                    tooltip.style.display = 'block';
                    tooltip.style.left = e.pageX + 10 + 'px';
                    tooltip.style.top = e.pageY - 10 + 'px';
                }
                region.classList.add('region-highlighted-hover');
            }, 200);
        });
        
        region.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            tooltip.style.display = 'none';
            region.classList.remove('region-highlighted-hover');
        });
        
        region.addEventListener('mousemove', (e) => {
            if (tooltip.style.display === 'block') {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY - 10 + 'px';
            }
        });
        
        // Добавляем клик (опционально: показывает/скрывает tooltip фиксировано)
        region.addEventListener('click', (e) => {
            e.preventDefault();
            if (clickedRegion === regionName) {
                // Если кликнули снова — скрыть
                tooltip.style.display = 'none';
                clickedRegion = null;
                region.classList.remove('region-highlighted');
            } else {
                // Показать фиксировано у центра экрана
                if (tooltip && regionData[regionName]) {
                    tooltip.innerHTML = `<strong>${regionName}</strong><br>${regionData[regionName]}<br><small>Кликните снова для закрытия</small>`;
                    tooltip.style.display = 'block';
                    tooltip.style.left = '50%';
                    tooltip.style.top = '50%';
                    tooltip.style.transform = 'translate(-50%, -50%)';
                }
                clickedRegion = regionName;
                region.classList.add('region-highlighted');
            }
        });
    });
    
    // Скрытие tooltip при клике вне (добавьте в body click)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.map-svg') && clickedRegion) {
            tooltip.style.display = 'none';
            clickedRegion = null;
            regions.forEach(r => r.classList.remove('region-highlighted'));
        }
    });
}

// Скрытие красного креста глобально (если модал не нужен)
document.addEventListener('DOMContentLoaded', () => {
    const closeModals = document.querySelectorAll('.close-modal');
    closeModals.forEach(modal => modal.style.display = 'none');
});
});