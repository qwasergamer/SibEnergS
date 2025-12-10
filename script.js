// Основной JavaScript файл для СибЭнергоСети (полная версия с debug для geography.html)

// Глобальная переменная для данных регионов
let regionData = {};

// ===== СЛАЙДЕР (для index.html) =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DEBUG: DOMContentLoaded сработал! (script.js полностью загружен) ===');
    
    // Обнови год в футере (для всех страниц)
    const currentYear = document.querySelectorAll('.current-year');
    currentYear.forEach(el => el.textContent = new Date().getFullYear());
    
    // Слайдер (если на главной)
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let autoPlayInterval;

    if (slides.length > 0) {
        function showSlide(index) {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            currentSlide = index;
        }

        function nextSlide() { const next = (currentSlide + 1) % slides.length; showSlide(next); }
        function prevSlide() { const prev = (currentSlide - 1 + slides.length) % slides.length; showSlide(prev); }

        function startAutoPlay() { autoPlayInterval = setInterval(nextSlide, 5000); }
        function stopAutoPlay() { clearInterval(autoPlayInterval); }

        if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });
        dots.forEach((dot, index) => dot.addEventListener('click', () => { stopAutoPlay(); showSlide(index); startAutoPlay(); }));

        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoPlay);
            sliderContainer.addEventListener('mouseleave', startAutoPlay);
            startAutoPlay();
        }
    }

    // Мобильное меню (для всех страниц)
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
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // Форма контактов (для contacts.html)
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    if (contactForm && successModal) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phone = document.getElementById('phone').value;
            const phoneRegex = /^(\+7|8)[\s(]?\d{3}[)\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                alert('Введите корректный телефон');
                return;
            }
            successModal.style.display = 'block';
        });
        document.querySelectorAll('#closeSuccessModal, #closeSuccessBtn').forEach(btn => {
            btn.addEventListener('click', () => successModal.style.display = 'none');
        });
    }

    // ===== ГЕОГРАФИЯ: Загрузка регионов (только для geography.html) =====
    if (document.querySelector('.geography-page')) {
        console.log('DEBUG: Это geography.html — загружаю регионы');
        loadRegionsFromJson();
    } else {
        console.log('DEBUG: Не geography.html — пропускаю JSON');
    }
});

// Функция загрузки JSON
function loadRegionsFromJson() {
    console.log('=== DEBUG: loadRegionsFromJson вызвана! ===');
    // Alert для теста (убери после: закомментируй alert)
    alert('DEBUG: script.js работает! Fetch regions.json...');
    
    fetch('regions.json')
        .then(response => {
            console.log('DEBUG: Fetch response, status:', response.status);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('DEBUG: JSON спарсен:', data);
            regionData = data.regions.reduce((acc, region) => {
                acc[region.name] = region;
                return acc;
            }, {});
            console.log('DEBUG: regionData ключи:', Object.keys(regionData));
            attachRegionClicks();
        })
        .catch(error => {
            console.error('DEBUG: Fetch ошибка:', error);
            // Fallback: hardcoded из твоего JSON
            regionData = {
                "Алтайский край": { id: 1, connected_year: 2024, potential_gw: 12.00, substations: 5000, lines_km: 15000, status: "connected", description: "Полностью подключён к сети. Основные объекты: промышленные зоны Барнаула." },
                "Красноярский край": { id: 2, connected_year: 2023, potential_gw: 45.00, substations: 12000, lines_km: 80000, status: "connected", description: "Крупнейший регион по мощности. Фокус на гидроэнергетике и ЛЭП в тайге." },
                "Иркутская область": { id: 3, connected_year: 2022, potential_gw: 35.00, substations: 8000, lines_km: 60000, status: "connected", description: "Энергия от Байкала. 200 тыс. подстанций в эксплуатации." },
                "Новосибирская область": { id: 4, connected_year: 2024, potential_gw: 18.00, substations: 6000, lines_km: 25000, status: "connected", description: "Транспортный хаб Сибири с фокусом на городские сети." },
                "Не подключённая зона 1 (Тыва)": { id: 5, connected_year: null, potential_gw: 5.00, substations: null, lines_km: null, status: "planned", description: "Планируется в 2026. Потенциал для возобновляемых источников." },
                "Не подключённая зона 2 (Хакасия)": { id: 6, connected_year: null, potential_gw: 3.00, substations: null, lines_km: null, status: "in_development", description: "В разработке. Ожидается запуск в 2025." }
            };
            console.log('DEBUG: Fallback загружен');
            attachRegionClicks();
        });
}

// Функция кликов по регионам (обновлённая для фикса hover: меньший scale, анти-заморозка — замени в script.js)
function attachRegionClicks() {
    console.log('DEBUG: attachRegionClicks стартовала. Ищем в 27+ path...');
    
    // Лог ВСЕХ path (для debug: класс + data-region)
    const allPaths = document.querySelectorAll('path');
    console.log(`DEBUG: Всего path в SVG: ${allPaths.length} (ожидаемо 27+)`);
    allPaths.forEach((path, idx) => {
        console.log(`DEBUG: Path ${idx}: class="${path.className.baseVal}", data-region="${path.dataset.region || 'ОТСУТСТВУЕТ'}"`);
    });
    
    // Селектор только для интерактивных (class с "region-", ~6+)
    const regions = document.querySelectorAll('path[class*="region-"]');
    console.log('DEBUG: Интерактивных регионов (с class region-*):', regions.length);
    
    let clickedRegionName = null;
    
    regions.forEach((region, index) => {
        const regionName = region.dataset.region;
        console.log(`DEBUG: Обрабатываем интерактивный ${index}: "${regionName}" (class: ${region.className.baseVal})`);
        
        if (!regionName) {
            console.warn(`DEBUG: Пропуск интерактивного path ${index}: нет data-region! (class: ${region.className.baseVal})`);
            return;
        }
        
        // Флаг для hover (чтобы избежать race-condition при быстром движении мыши)
        let isHovered = false;
        
        // Cursor и transition для всех интерактивных
        region.style.cursor = 'pointer';
        region.style.transition = 'fill 0.2s ease, transform 0.2s ease';  // Плавно для hover/клик
        
        // КЛИК: Только на интерактивных, независимо от hover
        region.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();  // Блокируем bubble на родителях (для деталей)
            console.log('DEBUG: Клик на:', regionName);
            
            if (clickedRegionName === regionName) {
                closeRegionModal();
                clickedRegionName = null;
                region.classList.remove('region-highlighted');
                console.log('DEBUG: Закрытие модала, highlighted снят');
            } else {
                // Сброс предыдущего
                if (clickedRegionName) {
                    const prev = Array.from(regions).find(r => r.dataset.region === clickedRegionName);
                    if (prev) prev.classList.remove('region-highlighted');
                }
                // Новый модал
                if (regionData[regionName]) {
                    showRegionModal(regionData[regionName], regionName);
                    clickedRegionName = regionName;
                    region.classList.add('region-highlighted');  // Жёлтый из CSS
                    console.log('DEBUG: Модал открыт, highlighted добавлен');
                } else {
                    console.warn('DEBUG: Нет данных в JSON для:', regionName, '(добавь в regions.json)');
                }
            }
        });
        
        // HOVER ENTER: Независимый для ВСЕХ интерактивных, меньший scale
        region.addEventListener('mouseenter', (e) => {
            isHovered = true;
            console.log('DEBUG: Hover enter на:', regionName);
            if (regionData[regionName]) {
                const tooltip = document.getElementById('tooltip');
                if (tooltip) {
                    tooltip.innerHTML = `
                        <strong>${regionName}</strong><br>
                        Статус: ${regionData[regionName].status}<br>
                        ГВт: ${regionData[regionName].potential_gw || 'N/A'}
                    `;
                    tooltip.style.display = 'block';
                    tooltip.style.left = (e.pageX + 10) + 'px';
                    tooltip.style.top = (e.pageY - 10) + 'px';
                }
                // Меньший эффект: scale 1.015 (лёгкий подъём, не дёргает)
                region.style.transform = 'scale(1.015)';
                region.style.fill = '#b2dfdb';  // Светло-зелёный hover (не влияет на highlighted жёлтый)
            }
        });
        
        // HOVER LEAVE: Force-сброс стилей + флаг для анти-заморозки
        region.addEventListener('mouseleave', (e) => {
            isHovered = false;
            console.log('DEBUG: Hover leave с:', regionName);
            const tooltip = document.getElementById('tooltip');
            if (tooltip) tooltip.style.display = 'none';
            
            // Сброс стилей: force removeProperty, если НЕ highlighted (чтобы избежать заморозки)
            if (!region.classList.contains('region-highlighted')) {
                region.style.removeProperty('transform');  // Полностью убрать inline scale
                region.style.removeProperty('fill');  // Вернуть к CSS default
                console.log('DEBUG: Стили сброшены для:', regionName);
            }
            
            // Дополнительная проверка: через 100ms force-сброс, если флаг false (анти-заморозка)
            setTimeout(() => {
                if (!isHovered && !region.classList.contains('region-highlighted')) {
                    region.style.removeProperty('transform');
                    region.style.removeProperty('fill');
                    console.log('DEBUG: Force-сброс стилей для:', regionName);
                }
            }, 100);
        });
    });
    
    if (regions.length === 0) {
        console.error('DEBUG: Нет интерактивных регионов! Добавь class="region-default" на path в SVG.');
    } else {
        console.log(`DEBUG: Готово! Обработано ${regions.length} интерактивных регионов из ${allPaths.length} path.`);
    }
}

// Модалы регионов
function showRegionModal(region, name) {
    const modal = document.getElementById('regionModal');
    const modalContent = document.getElementById('modalContent');
    if (modal && modalContent) {
        modalContent.innerHTML = `
            <h2>${name}</h2>
            <p><strong>Год подключения:</strong> ${region.connected_year || 'N/A'}</p>
            <p><strong>Потенциал (ГВт):</strong> ${region.potential_gw || 'N/A'}</p>
            <p><strong>Подстанций:</strong> ${region.substations || 'N/A'}</p>
            <p><strong>ЛЭП (км):</strong> ${region.lines_km || 'N/A'}</p>
            <p><strong>Статус:</strong> ${region.status}</p>
            <p><strong>Описание:</strong> ${region.description}</p>
            <button onclick="closeRegionModal()" style="background: var(--energy-blue); color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
        `;
        modal.style.display = 'block';
        console.log('DEBUG: Модал показан для:', name);
    } else {
        console.error('DEBUG: Модал не найден!');
    }
}

function closeRegionModal() {
    const modal = document.getElementById('regionModal');
    if (modal) modal.style.display = 'none';
    console.log('DEBUG: Модал закрыт');
}

window.onclick = function(event) {
    const modal = document.getElementById('regionModal');
    if (event.target === modal) closeRegionModal();
};



