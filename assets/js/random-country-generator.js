document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateCountryBtn');
    const continentFilter = document.getElementById('continentFilter');
    const countryCard = document.getElementById('countryCard');
    const countryFlag = document.getElementById('countryFlag');
    const countryName = document.getElementById('countryName');
    const countryDetails = document.getElementById('countryDetails');
    const continentInfo = document.getElementById('continentInfo');
    const totalGenerated = document.getElementById('totalGenerated');
    const uniqueCountries = document.getElementById('uniqueCountries');
    const favoriteContinent = document.getElementById('favoriteContinent');
    const resetStatsBtn = document.getElementById('resetCountryStats');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    // Load statistics from localStorage
    let stats = {
        total: parseInt(localStorage.getItem('countryGenerator_total') || '0'),
        unique: new Set(JSON.parse(localStorage.getItem('countryGenerator_unique') || '[]')),
        continents: JSON.parse(localStorage.getItem('countryGenerator_continents') || '{}'),
        history: JSON.parse(localStorage.getItem('countryGenerator_history') || '[]')
    };
    
    // Countries database by continent
    const countries = {
        europe: [
            { name: 'Україна', capital: 'Київ', continent: 'Європа', flag: '🇺🇦', fact: 'найбільша країна повністю в Європі' },
            { name: 'Франція', capital: 'Париж', continent: 'Європа', flag: '🇫🇷', fact: 'найвідвідувана країна світу' },
            { name: 'Німеччина', capital: 'Берлін', continent: 'Європа', flag: '🇩🇪', fact: 'економічний лідер Європи' },
            { name: 'Італія', capital: 'Рим', continent: 'Європа', flag: '🇮🇹', fact: 'батьківщина Ренесансу' },
            { name: 'Іспанія', capital: 'Мадрид', continent: 'Європа', flag: '🇪🇸', fact: 'друга за площею країна ЄС' },
            { name: 'Польща', capital: 'Варшава', continent: 'Європа', flag: '🇵🇱', fact: 'батьківщина Коперника' },
            { name: 'Румунія', capital: 'Бухарест', continent: 'Європа', flag: '🇷🇴', fact: 'дім для замку Дракули' },
            { name: 'Нідерланди', capital: 'Амстердам', continent: 'Європа', flag: '🇳🇱', fact: 'четверть території нижче рівня моря' },
            { name: 'Греція', capital: 'Афіни', continent: 'Європа', flag: '🇬🇷', fact: 'колиска демократії' },
            { name: 'Португалія', capital: 'Лісабон', continent: 'Європа', flag: '🇵🇹', fact: 'найстаріша країна Європи' },
            { name: 'Швеція', capital: 'Стокгольм', continent: 'Європа', flag: '🇸🇪', fact: 'батьківщина Нобелівської премії' },
            { name: 'Норвегія', capital: 'Осло', continent: 'Європа', flag: '🇳🇴', fact: 'найбагатша країна світу' },
            { name: 'Швейцарія', capital: 'Берн', continent: 'Європа', flag: '🇨🇭', fact: 'найнейтральніша країна світу' },
            { name: 'Австрія', capital: 'Відень', continent: 'Європа', flag: '🇦🇹', fact: 'музична столиця світу' },
            { name: 'Чехія', capital: 'Прага', continent: 'Європа', flag: '🇨🇿', fact: 'має найбільше замків у світі' }
        ],
        asia: [
            { name: 'Китай', capital: 'Пекін', continent: 'Азія', flag: '🇨🇳', fact: 'найбільша країна за населенням' },
            { name: 'Індія', capital: 'Нью-Делі', continent: 'Азія', flag: '🇮🇳', fact: 'найбільша демократія світу' },
            { name: 'Японія', capital: 'Токіо', continent: 'Азія', flag: '🇯🇵', fact: 'країна висхідного сонця' },
            { name: 'Південна Корея', capital: 'Сеул', continent: 'Азія', flag: '🇰🇷', fact: 'технологічний лідер світу' },
            { name: 'Таїланд', capital: 'Бангкок', continent: 'Азія', flag: '🇹🇭', fact: 'країна тисячі храмів' },
            { name: 'В\'єтнам', capital: 'Ханой', continent: 'Азія', flag: '🇻🇳', fact: 'найбільший експортер кави' },
            { name: 'Індонезія', capital: 'Джакарта', continent: 'Азія', flag: '🇮🇩', fact: 'найбільша країна-архіпелаг' },
            { name: 'Малайзія', capital: 'Куала-Лумпур', continent: 'Азія', flag: '🇲🇾', fact: 'дім для найвищих веж-близнюків' },
            { name: 'Сінгапур', capital: 'Сінгапур', continent: 'Азія', flag: '🇸🇬', fact: 'місто-держава майбутнього' },
            { name: 'Філіппіни', capital: 'Маніла', continent: 'Азія', flag: '🇵🇭', fact: 'складається з 7641 острова' },
            { name: 'Туреччина', capital: 'Анкара', continent: 'Азія', flag: '🇹🇷', fact: 'міст між Європою та Азією' },
            { name: 'Ізраїль', capital: 'Єрусалим', continent: 'Азія', flag: '🇮🇱', fact: 'стартап-нація світу' },
            { name: 'ОАЕ', capital: 'Абу-Дабі', continent: 'Азія', flag: '🇦🇪', fact: 'оазис розкоші в пустелі' },
            { name: 'Саудівська Аравія', capital: 'Ер-Ріяд', continent: 'Азія', flag: '🇸🇦', fact: 'найбільший експортер нафти' },
            { name: 'Казахстан', capital: 'Нур-Султан', continent: 'Азія', flag: '🇰🇿', fact: 'найбільша країна без виходу до моря' }
        ],
        'north-america': [
            { name: 'США', capital: 'Вашингтон', continent: 'Північна Америка', flag: '🇺🇸', fact: 'наймогутніша країна світу' },
            { name: 'Канада', capital: 'Оттава', continent: 'Північна Америка', flag: '🇨🇦', fact: 'друга за площею країна світу' },
            { name: 'Мексика', capital: 'Мехіко', continent: 'Північна Америка', flag: '🇲🇽', fact: 'батьківщина шоколаду' },
            { name: 'Куба', capital: 'Гавана', continent: 'Північна Америка', flag: '🇨🇺', fact: 'найбільший острів Карибського моря' },
            { name: 'Домініканська Республіка', capital: 'Санто-Домінго', continent: 'Північна Америка', flag: '🇩🇴', fact: 'перше європейське поселення в Америці' },
            { name: 'Ямайка', capital: 'Кінгстон', continent: 'Північна Америка', flag: '🇯🇲', fact: 'батьківщина регі' },
            { name: 'Гватемала', capital: 'Гватемала', continent: 'Північна Америка', flag: '🇬🇹', fact: 'серце цивілізації майя' },
            { name: 'Коста-Ріка', capital: 'Сан-Хосе', continent: 'Північна Америка', flag: '🇨🇷', fact: 'країна без армії' },
            { name: 'Панама', capital: 'Панама', continent: 'Північна Америка', flag: '🇵🇦', fact: 'дім для Панамського каналу' },
            { name: 'Багамські острови', capital: 'Нассау', continent: 'Північна Америка', flag: '🇧🇸', fact: 'складається з 700 островів' }
        ],
        'south-america': [
            { name: 'Бразилія', capital: 'Бразиліа', continent: 'Південна Америка', flag: '🇧🇷', fact: 'найбільша країна Південної Америки' },
            { name: 'Аргентина', capital: 'Буенос-Айрес', continent: 'Південна Америка', flag: '🇦🇷', fact: 'батьківщина танго' },
            { name: 'Чилі', capital: 'Сантьяго', continent: 'Південна Америка', flag: '🇨🇱', fact: 'найдовша країна світу' },
            { name: 'Перу', capital: 'Ліма', continent: 'Південна Америка', flag: '🇵🇪', fact: 'дім для Мачу-Пікчу' },
            { name: 'Колумбія', capital: 'Богота', continent: 'Південна Америка', flag: '🇨🇴', fact: 'найбільший виробник смарагдів' },
            { name: 'Венесуела', capital: 'Каракас', continent: 'Південна Америка', flag: '🇻🇪', fact: 'має найвищий водоспад світу' },
            { name: 'Еквадор', capital: 'Кіто', continent: 'Південна Америка', flag: '🇪🇨', fact: 'названа на честь екватора' },
            { name: 'Болівія', capital: 'Сукре', continent: 'Південна Америка', flag: '🇧🇴', fact: 'має дві столиці' },
            { name: 'Уругвай', capital: 'Монтевідео', continent: 'Південна Америка', flag: '🇺🇾', fact: 'найменша країна континенту' },
            { name: 'Парагвай', capital: 'Асунсьйон', continent: 'Південна Америка', flag: '🇵🇾', fact: 'серце Південної Америки' }
        ],
        africa: [
            { name: 'Нігерія', capital: 'Абуджа', continent: 'Африка', flag: '🇳🇬', fact: 'найбільша країна за населенням в Африці' },
            { name: 'Єгипет', capital: 'Каїр', continent: 'Африка', flag: '🇪🇬', fact: 'дім для піramід' },
            { name: 'ПАР', capital: 'Кейптаун', continent: 'Африка', flag: '🇿🇦', fact: 'має три столиці' },
            { name: 'Кенія', capital: 'Найробі', continent: 'Африка', flag: '🇰🇪', fact: 'сафарі столиця світу' },
            { name: 'Марокко', capital: 'Рабат', continent: 'Африка', flag: '🇲🇦', fact: 'ворота до Африки' },
            { name: 'Ефіопія', capital: 'Аддис-Абеба', continent: 'Африка', flag: '🇪🇹', fact: 'ніколи не була колонізована' },
            { name: 'Гана', capital: 'Аккра', continent: 'Африка', flag: '🇬🇭', fact: 'золотий берег Африки' },
            { name: 'Танзанія', capital: 'Додома', continent: 'Африка', flag: '🇹🇿', fact: 'дім для Кіліманджаро' },
            { name: 'Уганда', capital: 'Кампала', continent: 'Африка', flag: '🇺🇬', fact: 'перлина Африки' },
            { name: 'Сенегал', capital: 'Дакар', continent: 'Африка', flag: '🇸🇳', fact: 'найзахідніша точка Африки' }
        ],
        oceania: [
            { name: 'Австралія', capital: 'Канберра', continent: 'Океанія', flag: '🇦🇺', fact: 'найбільший острів-континент' },
            { name: 'Нова Зеландія', capital: 'Веллінгтон', continent: 'Океанія', flag: '🇳🇿', fact: 'країна довгої білої хмари' },
            { name: 'Фіджі', capital: 'Сува', continent: 'Океанія', flag: '🇫🇯', fact: 'складається з 333 островів' },
            { name: 'Папуа Нова Гвінея', capital: 'Порт-Морсбі', continent: 'Океанія', flag: '🇵🇬', fact: 'має найбільше мовне різноманіття' },
            { name: 'Самоа', capital: 'Апіа', continent: 'Океанія', flag: '🇼🇸', fact: 'перша країна, що зустрічає новий день' },
            { name: 'Тонга', capital: 'Нуку\'алофа', continent: 'Океанія', flag: '🇹🇴', fact: 'ніколи не була колонією' },
            { name: 'Вануату', capital: 'Порт-Віла', continent: 'Океанія', flag: '🇻🇺', fact: 'найщасливіша нація світу' },
            { name: 'Соломонові острови', capital: 'Хоніара', continent: 'Океанія', flag: '🇸🇧', fact: 'складається з 992 островів' },
            { name: 'Палау', capital: 'Нгерулмуд', continent: 'Океанія', flag: '🇵🇼', fact: 'найменша столиця світу' },
            { name: 'Науру', capital: 'Ярен', continent: 'Океанія', flag: '🇳🇷', fact: 'найменша острівна країна' }
        ]
    };
    
    // Get all countries for "all" filter
    function getAllCountries() {
        let allCountries = [];
        Object.values(countries).forEach(continent => {
            allCountries = allCountries.concat(continent);
        });
        return allCountries;
    }
    
    updateStatsDisplay();
    updateHistoryDisplay();
    
    generateBtn.addEventListener('click', generateCountry);
    resetStatsBtn.addEventListener('click', resetStatistics);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    function generateCountry() {
        const selectedContinent = continentFilter.value;
        let countryList;
        
        if (selectedContinent === 'all') {
            countryList = getAllCountries();
        } else {
            countryList = countries[selectedContinent] || [];
        }
        
        if (countryList.length === 0) {
            alert('Країни для цього континенту не знайдено');
            return;
        }
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Шукаю країну...</span>';
        
        // Add loading effect
        countryCard.classList.add('loading');
        countryName.textContent = '🔍 Пошук...';
        countryFlag.textContent = '🌍';
        continentInfo.textContent = 'Генерую випадкову країну...';
        
        // Generate random country after animation
        setTimeout(() => {
            const randomCountry = countryList[Math.floor(Math.random() * countryList.length)];
            
            // Update UI with country info
            displayCountry(randomCountry);
            
            // Update statistics
            updateStatistics(randomCountry, selectedContinent);
            
            // Add to history
            addToHistory(randomCountry);
            
            // Re-enable button
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="button-icon">🎲</span><span class="button-text">Згенерувати країну</span>';
            countryCard.classList.remove('loading');
            countryCard.classList.add('generated');
            
        }, 1200);
    }
    
    function displayCountry(country) {
        countryName.textContent = country.name;
        countryFlag.textContent = country.flag;
        
        countryDetails.innerHTML = `
            <div class="detail-item">
                <span class="detail-icon">🏛️</span>
                <span class="detail-text">Столиця: ${country.capital}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">🌍</span>
                <span class="detail-text">${country.continent}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">💡</span>
                <span class="detail-text">${country.fact}</span>
            </div>
        `;
    }
    
    function updateStatistics(country, continent) {
        stats.total += 1;
        stats.unique.add(country.name);
        
        if (!stats.continents[continent]) {
            stats.continents[continent] = 0;
        }
        stats.continents[continent] += 1;
        
        // Save to localStorage
        localStorage.setItem('countryGenerator_total', stats.total.toString());
        localStorage.setItem('countryGenerator_unique', JSON.stringify([...stats.unique]));
        localStorage.setItem('countryGenerator_continents', JSON.stringify(stats.continents));
        
        updateStatsDisplay();
    }
    
    function updateStatsDisplay() {
        totalGenerated.textContent = stats.total;
        uniqueCountries.textContent = stats.unique.size;
        
        // Find favorite continent
        let favContinent = '-';
        let maxCount = 0;
        const continentNames = {
            'all': 'Весь світ',
            'europe': 'Європа',
            'asia': 'Азія',
            'north-america': 'Пн. Америка',
            'south-america': 'Пд. Америка',
            'africa': 'Африка',
            'oceania': 'Океанія'
        };
        
        for (const [continent, count] of Object.entries(stats.continents)) {
            if (count > maxCount) {
                maxCount = count;
                favContinent = continentNames[continent] || continent;
            }
        }
        
        favoriteContinent.textContent = favContinent;
    }
    
    function addToHistory(country) {
        const historyItem = {
            country: country.name,
            capital: country.capital,
            continent: country.continent,
            flag: country.flag,
            fact: country.fact,
            timestamp: new Date().toLocaleString('uk-UA')
        };
        
        stats.history.unshift(historyItem); // Add to beginning
        if (stats.history.length > 50) { // Keep only last 50
            stats.history = stats.history.slice(0, 50);
        }
        
        localStorage.setItem('countryGenerator_history', JSON.stringify(stats.history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        if (stats.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">Поки що країн не згенеровано</p>';
            clearHistoryBtn.style.display = 'none';
            return;
        }
        
        clearHistoryBtn.style.display = 'inline-flex';
        
        const historyHTML = stats.history.map(item => `
            <div class="history-item">
                <div>
                    <div class="history-country">${item.flag} ${item.country}</div>
                    <div class="history-details">${item.capital}, ${item.continent}</div>
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
                continents: {},
                history: []
            };
            
            localStorage.removeItem('countryGenerator_total');
            localStorage.removeItem('countryGenerator_unique');
            localStorage.removeItem('countryGenerator_continents');
            localStorage.removeItem('countryGenerator_history');
            
            updateStatsDisplay();
            updateHistoryDisplay();
            
            // Reset country card
            countryCard.classList.remove('generated');
            countryName.textContent = 'Натисніть кнопку для генерації';
            countryFlag.textContent = '🏳️';
            continentInfo.textContent = 'Виберіть континент та згенеруйте країну';
            countryDetails.innerHTML = `
                <div class="detail-item">
                    <span class="detail-icon">🌍</span>
                    <span class="detail-text" id="continentInfo">Виберіть континент та згенеруйте країну</span>
                </div>
            `;
        }
    }
    
    function clearHistory() {
        if (confirm('Ви впевнені, що хочете очистити історію?')) {
            stats.history = [];
            localStorage.removeItem('countryGenerator_history');
            updateHistoryDisplay();
        }
    }
    
    // Add loading animation
    const style = document.createElement('style');
    style.textContent = `
        .country-card.loading {
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
});