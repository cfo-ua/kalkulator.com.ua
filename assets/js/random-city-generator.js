document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateCityBtn');
    const regionFilter = document.getElementById('regionFilter');
    const cityCard = document.getElementById('cityCard');
    const cityName = document.getElementById('cityName');
    const cityDetails = document.getElementById('cityDetails');
    const continentInfo = document.getElementById('continentInfo');
    const totalGenerated = document.getElementById('totalGenerated');
    const uniqueCities = document.getElementById('uniqueCities');
    const favoriteRegion = document.getElementById('favoriteRegion');
    const resetStatsBtn = document.getElementById('resetCityStats');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    // Load statistics from localStorage
    let stats = {
        total: parseInt(localStorage.getItem('cityGenerator_total') || '0'),
        unique: new Set(JSON.parse(localStorage.getItem('cityGenerator_unique') || '[]')),
        regions: JSON.parse(localStorage.getItem('cityGenerator_regions') || '{}'),
        history: JSON.parse(localStorage.getItem('cityGenerator_history') || '[]')
    };
    
    // Cities database by region
    const cities = {
        ukraine: [
            { name: 'Київ', country: 'Україна', continent: 'Європа', info: 'столиця України' },
            { name: 'Львів', country: 'Україна', continent: 'Європа', info: 'культурна столиця' },
            { name: 'Одеса', country: 'Україна', continent: 'Європа', info: 'перлина біля моря' },
            { name: 'Харків', country: 'Україна', continent: 'Європа', info: 'студентська столиця' },
            { name: 'Дніпро', country: 'Україна', continent: 'Європа', info: 'індустріальний центр' },
            { name: 'Запоріжжя', country: 'Україна', continent: 'Європа', info: 'козацька столиця' },
            { name: 'Кривий Ріг', country: 'Україна', continent: 'Європа', info: 'місто металургів' },
            { name: 'Миколаїв', country: 'Україна', continent: 'Європа', info: 'місто корабелів' },
            { name: 'Маріуполь', country: 'Україна', continent: 'Європа', info: 'промисловий центр' },
            { name: 'Вінниця', country: 'Україна', continent: 'Європа', info: 'місто фонтанів' }
        ],
        europe: [
            { name: 'Париж', country: 'Франція', continent: 'Європа', info: 'місто кохання' },
            { name: 'Лондон', country: 'Великобританія', continent: 'Європа', info: 'туманний Альбіон' },
            { name: 'Рим', country: 'Італія', continent: 'Європа', info: 'вічне місто' },
            { name: 'Берлін', country: 'Німеччина', continent: 'Європа', info: 'історичний центр' },
            { name: 'Мадрид', country: 'Іспанія', continent: 'Європа', info: 'королівська резиденція' },
            { name: 'Амстердам', country: 'Нідерланди', continent: 'Європа', info: 'місто каналів' },
            { name: 'Відень', country: 'Австрія', continent: 'Європа', info: 'музична столиця' },
            { name: 'Прага', country: 'Чехія', continent: 'Європа', info: 'золоте місто' },
            { name: 'Стокгольм', country: 'Швеція', continent: 'Європа', info: 'північна Венеція' },
            { name: 'Будапешт', country: 'Угорщина', continent: 'Європа', info: 'перлина Дунаю' }
        ],
        asia: [
            { name: 'Токіо', country: 'Японія', continent: 'Азія', info: 'найбільший мегаполіс' },
            { name: 'Пекін', country: 'Китай', continent: 'Азія', info: 'забороненне місто' },
            { name: 'Мумбаї', country: 'Індія', continent: 'Азія', info: 'Боллівуд столиця' },
            { name: 'Сеул', country: 'Південна Корея', continent: 'Азія', info: 'технологічний хаб' },
            { name: 'Бангкок', country: 'Таїланд', continent: 'Азія', info: 'місто храмів' },
            { name: 'Сінгапур', country: 'Сінгапур', continent: 'Азія', info: 'місто майбутнього' },
            { name: 'Дубай', country: 'ОАЕ', continent: 'Азія', info: 'оазис розкоші' },
            { name: 'Стамбул', country: 'Туреччина', continent: 'Азія', info: 'міст між світами' },
            { name: 'Тель-Авів', country: 'Ізраїль', continent: 'Азія', info: 'стартап нація' },
            { name: 'Катманду', country: 'Непал', continent: 'Азія', info: 'ворота Гімалаїв' }
        ],
        'north-america': [
            { name: 'Нью-Йорк', country: 'США', continent: 'Північна Америка', info: 'місто, що ніколи не спить' },
            { name: 'Торонто', country: 'Канада', continent: 'Північна Америка', info: 'найбільший канадський мегаполіс' },
            { name: 'Лос-Анджелес', country: 'США', continent: 'Північна Америка', info: 'місто янголів' },
            { name: 'Чикаго', country: 'США', continent: 'Північна Америка', info: 'вітряне місто' },
            { name: 'Ванкувер', country: 'Канада', continent: 'Північна Америка', info: 'найкрасивіше місто Канади' },
            { name: 'Сан-Франциско', country: 'США', continent: 'Північна Америка', info: 'місто туманів' },
            { name: 'Монреаль', country: 'Канада', continent: 'Північна Америка', info: 'французька Америка' },
            { name: 'Лас-Вегас', country: 'США', continent: 'Північна Америка', info: 'місто гріхів' },
            { name: 'Мехіко', country: 'Мексика', continent: 'Північна Америка', info: 'ацтекська столиця' },
            { name: 'Гавана', country: 'Куба', continent: 'Північна Америка', info: 'карибська перлина' }
        ],
        'south-america': [
            { name: 'Ріо-де-Жанейро', country: 'Бразилія', continent: 'Південна Америка', info: 'чудове місто' },
            { name: 'Буенос-Айрес', country: 'Аргентина', continent: 'Південна Америка', info: 'париж Південної Америки' },
            { name: 'Лімa', country: 'Перу', continent: 'Південна Америка', info: 'місто королів' },
            { name: 'Богота', country: 'Колумбія', continent: 'Південна Америка', info: 'столиця смарагдів' },
            { name: 'Сантьяго', country: 'Чилі', continent: 'Південна Америка', info: 'андська столиця' },
            { name: 'Каракас', country: 'Венесуела', continent: 'Південна Америка', info: 'місто вічної весни' },
            { name: 'Кіто', country: 'Еквадор', continent: 'Південна Америка', info: 'найближче до неба' },
            { name: 'Ла-Пас', country: 'Болівія', continent: 'Південна Америка', info: 'найвища столиця світу' },
            { name: 'Монтевідео', country: 'Уругвай', continent: 'Південна Америка', info: 'найпівденніша столиця' },
            { name: 'Сан-Паулу', country: 'Бразилія', continent: 'Південна Америка', info: 'мегаполіс континенту' }
        ],
        africa: [
            { name: 'Кейптаун', country: 'ПАР', continent: 'Африка', info: 'найкрасивіше місто Африки' },
            { name: 'Каїр', country: 'Єгипет', continent: 'Африка', info: 'місто тисячі мінаретів' },
            { name: 'Касабланка', country: 'Марокко', continent: 'Африка', info: 'біла перлина' },
            { name: 'Найробі', country: 'Кенія', continent: 'Африка', info: 'зелене місто під сонцем' },
            { name: 'Лагос', country: 'Нігерія', continent: 'Африка', info: 'найбільше місто Африки' },
            { name: 'Йоганнесбург', country: 'ПАР', continent: 'Африка', info: 'місто золота' },
            { name: 'Аддис-Абеба', country: 'Ефіопія', continent: 'Африка', info: 'столиця Африки' },
            { name: 'Туніс', country: 'Туніс', continent: 'Африка', info: 'зелена перлина' },
            { name: 'Дакар', country: 'Сенегал', continent: 'Африка', info: 'західна точка Африки' },
            { name: 'Луанда', country: 'Ангола', continent: 'Африка', info: 'африканський Париж' }
        ],
        oceania: [
            { name: 'Сідней', country: 'Австралія', continent: 'Океанія', info: 'місто опери' },
            { name: 'Мельбурн', country: 'Австралія', continent: 'Океанія', info: 'культурна столиця' },
            { name: 'Окленд', country: 'Нова Зеландія', continent: 'Океанія', info: 'місто вітрил' },
            { name: 'Веллінгтон', country: 'Нова Зеландія', continent: 'Океанія', info: 'найвітряніша столиця' },
            { name: 'Перт', country: 'Австралія', continent: 'Океанія', info: 'ізольоване місто' },
            { name: 'Брисбен', country: 'Австралія', continent: 'Океанія', info: 'сонячна столиця' },
            { name: 'Аделаїда', country: 'Австралія', continent: 'Океанія', info: 'місто церков' },
            { name: 'Канберра', country: 'Австралія', continent: 'Океанія', info: 'столиця кущів' },
            { name: 'Хобарт', country: 'Австралія', continent: 'Океанія', info: 'тасманійська перлина' },
            { name: 'Крайстчерч', country: 'Нова Зеландія', continent: 'Океанія', info: 'садове місто' }
        ]
    };
    
    // Get all cities for "all" filter
    function getAllCities() {
        let allCities = [];
        Object.values(cities).forEach(region => {
            allCities = allCities.concat(region);
        });
        return allCities;
    }
    
    updateStatsDisplay();
    updateHistoryDisplay();
    
    generateBtn.addEventListener('click', generateCity);
    resetStatsBtn.addEventListener('click', resetStatistics);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    function generateCity() {
        const selectedRegion = regionFilter.value;
        let cityList;
        
        if (selectedRegion === 'all') {
            cityList = getAllCities();
        } else {
            cityList = cities[selectedRegion] || [];
        }
        
        if (cityList.length === 0) {
            alert('Міста для цього регіону не знайдено');
            return;
        }
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Шукаю місто...</span>';
        
        // Add loading effect
        cityCard.classList.add('loading');
        cityName.textContent = '🔍 Пошук...';
        continentInfo.textContent = 'Генерую випадкове місто...';
        
        // Generate random city after animation
        setTimeout(() => {
            const randomCity = cityList[Math.floor(Math.random() * cityList.length)];
            
            // Update UI with city info
            displayCity(randomCity);
            
            // Update statistics
            updateStatistics(randomCity, selectedRegion);
            
            // Add to history
            addToHistory(randomCity);
            
            // Re-enable button
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="button-icon">🎲</span><span class="button-text">Згенерувати місто</span>';
            cityCard.classList.remove('loading');
            cityCard.classList.add('generated');
            
        }, 1200);
    }
    
    function displayCity(city) {
        cityName.textContent = city.name;
        
        cityDetails.innerHTML = `
            <div class="detail-item">
                <span class="detail-icon">🏳️</span>
                <span class="detail-text">${city.country}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">🌍</span>
                <span class="detail-text">${city.continent}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">ℹ️</span>
                <span class="detail-text">${city.info}</span>
            </div>
        `;
        
        // Add city icon based on continent
        const cityIcon = document.querySelector('.city-icon');
        const continentIcons = {
            'Європа': '🏰',
            'Азія': '🏯',
            'Північна Америка': '🗽',
            'Південна Америка': '🌴',
            'Африка': '🦁',
            'Океанія': '🏄'
        };
        cityIcon.textContent = continentIcons[city.continent] || '🏙️';
    }
    
    function updateStatistics(city, region) {
        stats.total += 1;
        stats.unique.add(city.name);
        
        if (!stats.regions[region]) {
            stats.regions[region] = 0;
        }
        stats.regions[region] += 1;
        
        // Save to localStorage
        localStorage.setItem('cityGenerator_total', stats.total.toString());
        localStorage.setItem('cityGenerator_unique', JSON.stringify([...stats.unique]));
        localStorage.setItem('cityGenerator_regions', JSON.stringify(stats.regions));
        
        updateStatsDisplay();
    }
    
    function updateStatsDisplay() {
        totalGenerated.textContent = stats.total;
        uniqueCities.textContent = stats.unique.size;
        
        // Find favorite region
        let favoriteReg = '-';
        let maxCount = 0;
        const regionNames = {
            'all': 'Весь світ',
            'europe': 'Європа',
            'asia': 'Азія',
            'north-america': 'Північна Америка',
            'south-america': 'Південна Америка',
            'africa': 'Африка',
            'oceania': 'Океанія',
            'ukraine': 'Україна'
        };
        
        for (const [region, count] of Object.entries(stats.regions)) {
            if (count > maxCount) {
                maxCount = count;
                favoriteReg = regionNames[region] || region;
            }
        }
        
        favoriteRegion.textContent = favoriteReg;
    }
    
    function addToHistory(city) {
        const historyItem = {
            city: city.name,
            country: city.country,
            continent: city.continent,
            info: city.info,
            timestamp: new Date().toLocaleString('uk-UA')
        };
        
        stats.history.unshift(historyItem); // Add to beginning
        if (stats.history.length > 50) { // Keep only last 50
            stats.history = stats.history.slice(0, 50);
        }
        
        localStorage.setItem('cityGenerator_history', JSON.stringify(stats.history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        if (stats.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">Поки що міст не згенеровано</p>';
            clearHistoryBtn.style.display = 'none';
            return;
        }
        
        clearHistoryBtn.style.display = 'inline-flex';
        
        const historyHTML = stats.history.map(item => `
            <div class="history-item">
                <div>
                    <div class="history-city">${item.city}</div>
                    <div class="history-details">${item.country}, ${item.continent}</div>
                </div>
                <div class="history-details">${item.timestamp}</div>
            </div>
        `).join('');
        
        historyList.innerHTML = historyHTML;
    }
    
    function resetStatistics() {
        if (confirm('Ви впевнені, що хочете скинути всю статистику?')) {
            stats = {
                total: 0,
                unique: new Set(),
                regions: {},
                history: []
            };
            
            localStorage.removeItem('cityGenerator_total');
            localStorage.removeItem('cityGenerator_unique');
            localStorage.removeItem('cityGenerator_regions');
            localStorage.removeItem('cityGenerator_history');
            
            updateStatsDisplay();
            updateHistoryDisplay();
            
            // Reset city card
            cityCard.classList.remove('generated');
            cityName.textContent = 'Натисніть кнопку для генерації';
            continentInfo.textContent = 'Виберіть регіон та згенеруйте місто';
            cityDetails.innerHTML = `
                <div class="detail-item">
                    <span class="detail-icon">🌍</span>
                    <span class="detail-text" id="continentInfo">Виберіть регіон та згенеруйте місто</span>
                </div>
            `;
            document.querySelector('.city-icon').textContent = '🏙️';
        }
    }
    
    function clearHistory() {
        if (confirm('Ви впевнені, що хочете очистити історію?')) {
            stats.history = [];
            localStorage.removeItem('cityGenerator_history');
            updateHistoryDisplay();
        }
    }
    
    // Add loading animation
    const style = document.createElement('style');
    style.textContent = `
        .city-card.loading {
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
});