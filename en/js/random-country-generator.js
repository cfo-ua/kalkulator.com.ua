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
        total: parseInt(localStorage.getItem('countryGenerator_total_en') || '0'),
        unique: new Set(JSON.parse(localStorage.getItem('countryGenerator_unique_en') || '[]')),
        continents: JSON.parse(localStorage.getItem('countryGenerator_continents_en') || '{}'),
        history: JSON.parse(localStorage.getItem('countryGenerator_history_en') || '[]')
    };
    
    // Countries database by continent
    const countries = {
        europe: [
            { name: 'Ukraine', capital: 'Kyiv', continent: 'Europe', flag: '🇺🇦', fact: 'largest country entirely in Europe' },
            { name: 'France', capital: 'Paris', continent: 'Europe', flag: '🇫🇷', fact: 'most visited country in the world' },
            { name: 'Germany', capital: 'Berlin', continent: 'Europe', flag: '🇩🇪', fact: 'economic leader of Europe' },
            { name: 'Italy', capital: 'Rome', continent: 'Europe', flag: '🇮🇹', fact: 'birthplace of Renaissance' },
            { name: 'Spain', capital: 'Madrid', continent: 'Europe', flag: '🇪🇸', fact: 'second largest country in EU' },
            { name: 'Poland', capital: 'Warsaw', continent: 'Europe', flag: '🇵🇱', fact: 'homeland of Copernicus' },
            { name: 'Romania', capital: 'Bucharest', continent: 'Europe', flag: '🇷🇴', fact: 'home to Dracula\'s castle' },
            { name: 'Netherlands', capital: 'Amsterdam', continent: 'Europe', flag: '🇳🇱', fact: 'quarter of territory below sea level' },
            { name: 'Greece', capital: 'Athens', continent: 'Europe', flag: '🇬🇷', fact: 'cradle of democracy' },
            { name: 'Portugal', capital: 'Lisbon', continent: 'Europe', flag: '🇵🇹', fact: 'oldest country in Europe' },
            { name: 'Sweden', capital: 'Stockholm', continent: 'Europe', flag: '🇸🇪', fact: 'homeland of Nobel Prize' },
            { name: 'Norway', capital: 'Oslo', continent: 'Europe', flag: '🇳🇴', fact: 'richest country in the world' },
            { name: 'Switzerland', capital: 'Bern', continent: 'Europe', flag: '🇨🇭', fact: 'most neutral country in the world' },
            { name: 'Austria', capital: 'Vienna', continent: 'Europe', flag: '🇦🇹', fact: 'musical capital of the world' },
            { name: 'Czech Republic', capital: 'Prague', continent: 'Europe', flag: '🇨🇿', fact: 'has the most castles in the world' }
        ],
        asia: [
            { name: 'China', capital: 'Beijing', continent: 'Asia', flag: '🇨🇳', fact: 'most populous country' },
            { name: 'India', capital: 'New Delhi', continent: 'Asia', flag: '🇮🇳', fact: 'largest democracy in the world' },
            { name: 'Japan', capital: 'Tokyo', continent: 'Asia', flag: '🇯🇵', fact: 'land of the rising sun' },
            { name: 'South Korea', capital: 'Seoul', continent: 'Asia', flag: '🇰🇷', fact: 'technology leader of the world' },
            { name: 'Thailand', capital: 'Bangkok', continent: 'Asia', flag: '🇹🇭', fact: 'land of a thousand temples' },
            { name: 'Vietnam', capital: 'Hanoi', continent: 'Asia', flag: '🇻🇳', fact: 'largest coffee exporter' },
            { name: 'Indonesia', capital: 'Jakarta', continent: 'Asia', flag: '🇮🇩', fact: 'largest archipelago country' },
            { name: 'Malaysia', capital: 'Kuala Lumpur', continent: 'Asia', flag: '🇲🇾', fact: 'home to tallest twin towers' },
            { name: 'Singapore', capital: 'Singapore', continent: 'Asia', flag: '🇸🇬', fact: 'city-state of the future' },
            { name: 'Philippines', capital: 'Manila', continent: 'Asia', flag: '🇵🇭', fact: 'consists of 7,641 islands' },
            { name: 'Turkey', capital: 'Ankara', continent: 'Asia', flag: '🇹🇷', fact: 'bridge between Europe and Asia' },
            { name: 'Israel', capital: 'Jerusalem', continent: 'Asia', flag: '🇮🇱', fact: 'startup nation of the world' },
            { name: 'UAE', capital: 'Abu Dhabi', continent: 'Asia', flag: '🇦🇪', fact: 'oasis of luxury in the desert' },
            { name: 'Saudi Arabia', capital: 'Riyadh', continent: 'Asia', flag: '🇸🇦', fact: 'largest oil exporter' },
            { name: 'Kazakhstan', capital: 'Nur-Sultan', continent: 'Asia', flag: '🇰🇿', fact: 'largest landlocked country' }
        ],
        'north-america': [
            { name: 'United States', capital: 'Washington D.C.', continent: 'North America', flag: '🇺🇸', fact: 'most powerful country in the world' },
            { name: 'Canada', capital: 'Ottawa', continent: 'North America', flag: '🇨🇦', fact: 'second largest country in the world' },
            { name: 'Mexico', capital: 'Mexico City', continent: 'North America', flag: '🇲🇽', fact: 'birthplace of chocolate' },
            { name: 'Cuba', capital: 'Havana', continent: 'North America', flag: '🇨🇺', fact: 'largest island in the Caribbean' },
            { name: 'Dominican Republic', capital: 'Santo Domingo', continent: 'North America', flag: '🇩🇴', fact: 'first European settlement in America' },
            { name: 'Jamaica', capital: 'Kingston', continent: 'North America', flag: '🇯🇲', fact: 'birthplace of reggae' },
            { name: 'Guatemala', capital: 'Guatemala City', continent: 'North America', flag: '🇬🇹', fact: 'heart of Maya civilization' },
            { name: 'Costa Rica', capital: 'San José', continent: 'North America', flag: '🇨🇷', fact: 'country without an army' },
            { name: 'Panama', capital: 'Panama City', continent: 'North America', flag: '🇵🇦', fact: 'home to Panama Canal' },
            { name: 'Bahamas', capital: 'Nassau', continent: 'North America', flag: '🇧🇸', fact: 'consists of 700 islands' }
        ],
        'south-america': [
            { name: 'Brazil', capital: 'Brasília', continent: 'South America', flag: '🇧🇷', fact: 'largest country in South America' },
            { name: 'Argentina', capital: 'Buenos Aires', continent: 'South America', flag: '🇦🇷', fact: 'birthplace of tango' },
            { name: 'Chile', capital: 'Santiago', continent: 'South America', flag: '🇨🇱', fact: 'longest country in the world' },
            { name: 'Peru', capital: 'Lima', continent: 'South America', flag: '🇵🇪', fact: 'home to Machu Picchu' },
            { name: 'Colombia', capital: 'Bogotá', continent: 'South America', flag: '🇨🇴', fact: 'largest emerald producer' },
            { name: 'Venezuela', capital: 'Caracas', continent: 'South America', flag: '🇻🇪', fact: 'has the world\'s highest waterfall' },
            { name: 'Ecuador', capital: 'Quito', continent: 'South America', flag: '🇪🇨', fact: 'named after the equator' },
            { name: 'Bolivia', capital: 'Sucre', continent: 'South America', flag: '🇧🇴', fact: 'has two capitals' },
            { name: 'Uruguay', capital: 'Montevideo', continent: 'South America', flag: '🇺🇾', fact: 'smallest country on the continent' },
            { name: 'Paraguay', capital: 'Asunción', continent: 'South America', flag: '🇵🇾', fact: 'heart of South America' }
        ],
        africa: [
            { name: 'Nigeria', capital: 'Abuja', continent: 'Africa', flag: '🇳🇬', fact: 'most populous country in Africa' },
            { name: 'Egypt', capital: 'Cairo', continent: 'Africa', flag: '🇪🇬', fact: 'home to the pyramids' },
            { name: 'South Africa', capital: 'Cape Town', continent: 'Africa', flag: '🇿🇦', fact: 'has three capitals' },
            { name: 'Kenya', capital: 'Nairobi', continent: 'Africa', flag: '🇰🇪', fact: 'safari capital of the world' },
            { name: 'Morocco', capital: 'Rabat', continent: 'Africa', flag: '🇲🇦', fact: 'gateway to Africa' },
            { name: 'Ethiopia', capital: 'Addis Ababa', continent: 'Africa', flag: '🇪🇹', fact: 'never been colonized' },
            { name: 'Ghana', capital: 'Accra', continent: 'Africa', flag: '🇬🇭', fact: 'Gold Coast of Africa' },
            { name: 'Tanzania', capital: 'Dodoma', continent: 'Africa', flag: '🇹🇿', fact: 'home to Kilimanjaro' },
            { name: 'Uganda', capital: 'Kampala', continent: 'Africa', flag: '🇺🇬', fact: 'pearl of Africa' },
            { name: 'Senegal', capital: 'Dakar', continent: 'Africa', flag: '🇸🇳', fact: 'westernmost point of Africa' }
        ],
        oceania: [
            { name: 'Australia', capital: 'Canberra', continent: 'Oceania', flag: '🇦🇺', fact: 'largest island continent' },
            { name: 'New Zealand', capital: 'Wellington', continent: 'Oceania', flag: '🇳🇿', fact: 'land of the long white cloud' },
            { name: 'Fiji', capital: 'Suva', continent: 'Oceania', flag: '🇫🇯', fact: 'consists of 333 islands' },
            { name: 'Papua New Guinea', capital: 'Port Moresby', continent: 'Oceania', flag: '🇵🇬', fact: 'has the most linguistic diversity' },
            { name: 'Samoa', capital: 'Apia', continent: 'Oceania', flag: '🇼🇸', fact: 'first country to greet each new day' },
            { name: 'Tonga', capital: 'Nuku\'alofa', continent: 'Oceania', flag: '🇹🇴', fact: 'never been a colony' },
            { name: 'Vanuatu', capital: 'Port Vila', continent: 'Oceania', flag: '🇻🇺', fact: 'happiest nation in the world' },
            { name: 'Solomon Islands', capital: 'Honiara', continent: 'Oceania', flag: '🇸🇧', fact: 'consists of 992 islands' },
            { name: 'Palau', capital: 'Ngerulmud', continent: 'Oceania', flag: '🇵🇼', fact: 'smallest capital in the world' },
            { name: 'Nauru', capital: 'Yaren', continent: 'Oceania', flag: '🇳🇷', fact: 'smallest island country' }
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
            alert('No countries found for this continent');
            return;
        }
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Finding country...</span>';
        
        // Add loading effect
        countryCard.classList.add('loading');
        countryName.textContent = '🔍 Searching...';
        countryFlag.textContent = '🌍';
        continentInfo.textContent = 'Generating random country...';
        
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
            generateBtn.innerHTML = '<span class="button-icon">🎲</span><span class="button-text">Generate Country</span>';
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
                <span class="detail-text">Capital: ${country.capital}</span>
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
        localStorage.setItem('countryGenerator_total_en', stats.total.toString());
        localStorage.setItem('countryGenerator_unique_en', JSON.stringify([...stats.unique]));
        localStorage.setItem('countryGenerator_continents_en', JSON.stringify(stats.continents));
        
        updateStatsDisplay();
    }
    
    function updateStatsDisplay() {
        totalGenerated.textContent = stats.total;
        uniqueCountries.textContent = stats.unique.size;
        
        // Find favorite continent
        let favContinent = '-';
        let maxCount = 0;
        const continentNames = {
            'all': 'Whole World',
            'europe': 'Europe',
            'asia': 'Asia',
            'north-america': 'N. America',
            'south-america': 'S. America',
            'africa': 'Africa',
            'oceania': 'Oceania'
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
            timestamp: new Date().toLocaleString('en-US')
        };
        
        stats.history.unshift(historyItem); // Add to beginning
        if (stats.history.length > 50) { // Keep only last 50
            stats.history = stats.history.slice(0, 50);
        }
        
        localStorage.setItem('countryGenerator_history_en', JSON.stringify(stats.history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        if (stats.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No countries generated yet</p>';
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
        if (confirm('Are you sure you want to reset all statistics?')) {
            stats = {
                total: 0,
                unique: new Set(),
                continents: {},
                history: []
            };
            
            localStorage.removeItem('countryGenerator_total_en');
            localStorage.removeItem('countryGenerator_unique_en');
            localStorage.removeItem('countryGenerator_continents_en');
            localStorage.removeItem('countryGenerator_history_en');
            
            updateStatsDisplay();
            updateHistoryDisplay();
            
            // Reset country card
            countryCard.classList.remove('generated');
            countryName.textContent = 'Click button to generate';
            countryFlag.textContent = '🏳️';
            continentInfo.textContent = 'Select continent and generate country';
            countryDetails.innerHTML = `
                <div class="detail-item">
                    <span class="detail-icon">🌍</span>
                    <span class="detail-text" id="continentInfo">Select continent and generate country</span>
                </div>
            `;
        }
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear the history?')) {
            stats.history = [];
            localStorage.removeItem('countryGenerator_history_en');
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