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
        total: parseInt(localStorage.getItem('cityGenerator_total_en') || '0'),
        unique: new Set(JSON.parse(localStorage.getItem('cityGenerator_unique_en') || '[]')),
        regions: JSON.parse(localStorage.getItem('cityGenerator_regions_en') || '{}'),
        history: JSON.parse(localStorage.getItem('cityGenerator_history_en') || '[]')
    };
    
    // Cities database by region
    const cities = {
        ukraine: [
            { name: 'Kyiv', country: 'Ukraine', continent: 'Europe', info: 'capital of Ukraine' },
            { name: 'Lviv', country: 'Ukraine', continent: 'Europe', info: 'cultural capital' },
            { name: 'Odesa', country: 'Ukraine', continent: 'Europe', info: 'pearl by the sea' },
            { name: 'Kharkiv', country: 'Ukraine', continent: 'Europe', info: 'student capital' },
            { name: 'Dnipro', country: 'Ukraine', continent: 'Europe', info: 'industrial center' },
            { name: 'Zaporizhzhia', country: 'Ukraine', continent: 'Europe', info: 'Cossack capital' },
            { name: 'Kryvyi Rih', country: 'Ukraine', continent: 'Europe', info: 'city of metallurgists' },
            { name: 'Mykolaiv', country: 'Ukraine', continent: 'Europe', info: 'city of shipbuilders' },
            { name: 'Mariupol', country: 'Ukraine', continent: 'Europe', info: 'industrial center' },
            { name: 'Vinnytsia', country: 'Ukraine', continent: 'Europe', info: 'city of fountains' }
        ],
        europe: [
            { name: 'Paris', country: 'France', continent: 'Europe', info: 'city of love' },
            { name: 'London', country: 'United Kingdom', continent: 'Europe', info: 'foggy Albion' },
            { name: 'Rome', country: 'Italy', continent: 'Europe', info: 'eternal city' },
            { name: 'Berlin', country: 'Germany', continent: 'Europe', info: 'historical center' },
            { name: 'Madrid', country: 'Spain', continent: 'Europe', info: 'royal residence' },
            { name: 'Amsterdam', country: 'Netherlands', continent: 'Europe', info: 'city of canals' },
            { name: 'Vienna', country: 'Austria', continent: 'Europe', info: 'musical capital' },
            { name: 'Prague', country: 'Czech Republic', continent: 'Europe', info: 'golden city' },
            { name: 'Stockholm', country: 'Sweden', continent: 'Europe', info: 'northern Venice' },
            { name: 'Budapest', country: 'Hungary', continent: 'Europe', info: 'pearl of the Danube' }
        ],
        asia: [
            { name: 'Tokyo', country: 'Japan', continent: 'Asia', info: 'largest metropolis' },
            { name: 'Beijing', country: 'China', continent: 'Asia', info: 'forbidden city' },
            { name: 'Mumbai', country: 'India', continent: 'Asia', info: 'Bollywood capital' },
            { name: 'Seoul', country: 'South Korea', continent: 'Asia', info: 'technology hub' },
            { name: 'Bangkok', country: 'Thailand', continent: 'Asia', info: 'city of temples' },
            { name: 'Singapore', country: 'Singapore', continent: 'Asia', info: 'city of the future' },
            { name: 'Dubai', country: 'UAE', continent: 'Asia', info: 'oasis of luxury' },
            { name: 'Istanbul', country: 'Turkey', continent: 'Asia', info: 'bridge between worlds' },
            { name: 'Tel Aviv', country: 'Israel', continent: 'Asia', info: 'startup nation' },
            { name: 'Kathmandu', country: 'Nepal', continent: 'Asia', info: 'gateway to Himalayas' }
        ],
        'north-america': [
            { name: 'New York', country: 'USA', continent: 'North America', info: 'city that never sleeps' },
            { name: 'Toronto', country: 'Canada', continent: 'North America', info: 'largest Canadian metropolis' },
            { name: 'Los Angeles', country: 'USA', continent: 'North America', info: 'city of angels' },
            { name: 'Chicago', country: 'USA', continent: 'North America', info: 'windy city' },
            { name: 'Vancouver', country: 'Canada', continent: 'North America', info: 'most beautiful Canadian city' },
            { name: 'San Francisco', country: 'USA', continent: 'North America', info: 'city of fog' },
            { name: 'Montreal', country: 'Canada', continent: 'North America', info: 'French America' },
            { name: 'Las Vegas', country: 'USA', continent: 'North America', info: 'sin city' },
            { name: 'Mexico City', country: 'Mexico', continent: 'North America', info: 'Aztec capital' },
            { name: 'Havana', country: 'Cuba', continent: 'North America', info: 'Caribbean pearl' }
        ],
        'south-america': [
            { name: 'Rio de Janeiro', country: 'Brazil', continent: 'South America', info: 'wonderful city' },
            { name: 'Buenos Aires', country: 'Argentina', continent: 'South America', info: 'Paris of South America' },
            { name: 'Lima', country: 'Peru', continent: 'South America', info: 'city of kings' },
            { name: 'Bogotá', country: 'Colombia', continent: 'South America', info: 'emerald capital' },
            { name: 'Santiago', country: 'Chile', continent: 'South America', info: 'Andean capital' },
            { name: 'Caracas', country: 'Venezuela', continent: 'South America', info: 'city of eternal spring' },
            { name: 'Quito', country: 'Ecuador', continent: 'South America', info: 'closest to heaven' },
            { name: 'La Paz', country: 'Bolivia', continent: 'South America', info: 'highest capital in the world' },
            { name: 'Montevideo', country: 'Uruguay', continent: 'South America', info: 'southernmost capital' },
            { name: 'São Paulo', country: 'Brazil', continent: 'South America', info: 'continent megacity' }
        ],
        africa: [
            { name: 'Cape Town', country: 'South Africa', continent: 'Africa', info: 'most beautiful city in Africa' },
            { name: 'Cairo', country: 'Egypt', continent: 'Africa', info: 'city of a thousand minarets' },
            { name: 'Casablanca', country: 'Morocco', continent: 'Africa', info: 'white pearl' },
            { name: 'Nairobi', country: 'Kenya', continent: 'Africa', info: 'green city in the sun' },
            { name: 'Lagos', country: 'Nigeria', continent: 'Africa', info: 'largest city in Africa' },
            { name: 'Johannesburg', country: 'South Africa', continent: 'Africa', info: 'city of gold' },
            { name: 'Addis Ababa', country: 'Ethiopia', continent: 'Africa', info: 'capital of Africa' },
            { name: 'Tunis', country: 'Tunisia', continent: 'Africa', info: 'green pearl' },
            { name: 'Dakar', country: 'Senegal', continent: 'Africa', info: 'westernmost point of Africa' },
            { name: 'Luanda', country: 'Angola', continent: 'Africa', info: 'African Paris' }
        ],
        oceania: [
            { name: 'Sydney', country: 'Australia', continent: 'Oceania', info: 'opera house city' },
            { name: 'Melbourne', country: 'Australia', continent: 'Oceania', info: 'cultural capital' },
            { name: 'Auckland', country: 'New Zealand', continent: 'Oceania', info: 'city of sails' },
            { name: 'Wellington', country: 'New Zealand', continent: 'Oceania', info: 'windiest capital' },
            { name: 'Perth', country: 'Australia', continent: 'Oceania', info: 'isolated city' },
            { name: 'Brisbane', country: 'Australia', continent: 'Oceania', info: 'sunshine capital' },
            { name: 'Adelaide', country: 'Australia', continent: 'Oceania', info: 'city of churches' },
            { name: 'Canberra', country: 'Australia', continent: 'Oceania', info: 'bush capital' },
            { name: 'Hobart', country: 'Australia', continent: 'Oceania', info: 'Tasmanian pearl' },
            { name: 'Christchurch', country: 'New Zealand', continent: 'Oceania', info: 'garden city' }
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
            alert('No cities found for this region');
            return;
        }
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Finding city...</span>';
        
        // Add loading effect
        cityCard.classList.add('loading');
        cityName.textContent = '🔍 Searching...';
        continentInfo.textContent = 'Generating random city...';
        
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
            generateBtn.innerHTML = '<span class="button-icon">🎲</span><span class="button-text">Generate City</span>';
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
            'Europe': '🏰',
            'Asia': '🏯',
            'North America': '🗽',
            'South America': '🌴',
            'Africa': '🦁',
            'Oceania': '🏄'
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
        localStorage.setItem('cityGenerator_total_en', stats.total.toString());
        localStorage.setItem('cityGenerator_unique_en', JSON.stringify([...stats.unique]));
        localStorage.setItem('cityGenerator_regions_en', JSON.stringify(stats.regions));
        
        updateStatsDisplay();
    }
    
    function updateStatsDisplay() {
        totalGenerated.textContent = stats.total;
        uniqueCities.textContent = stats.unique.size;
        
        // Find favorite region
        let favoriteReg = '-';
        let maxCount = 0;
        const regionNames = {
            'all': 'Whole World',
            'europe': 'Europe',
            'asia': 'Asia',
            'north-america': 'North America',
            'south-america': 'South America',
            'africa': 'Africa',
            'oceania': 'Oceania',
            'ukraine': 'Ukraine'
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
            timestamp: new Date().toLocaleString('en-US')
        };
        
        stats.history.unshift(historyItem); // Add to beginning
        if (stats.history.length > 50) { // Keep only last 50
            stats.history = stats.history.slice(0, 50);
        }
        
        localStorage.setItem('cityGenerator_history_en', JSON.stringify(stats.history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        if (stats.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No cities generated yet</p>';
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
        if (confirm('Are you sure you want to reset all statistics?')) {
            stats = {
                total: 0,
                unique: new Set(),
                regions: {},
                history: []
            };
            
            localStorage.removeItem('cityGenerator_total_en');
            localStorage.removeItem('cityGenerator_unique_en');
            localStorage.removeItem('cityGenerator_regions_en');
            localStorage.removeItem('cityGenerator_history_en');
            
            updateStatsDisplay();
            updateHistoryDisplay();
            
            // Reset city card
            cityCard.classList.remove('generated');
            cityName.textContent = 'Click button to generate';
            continentInfo.textContent = 'Select region and generate city';
            cityDetails.innerHTML = `
                <div class="detail-item">
                    <span class="detail-icon">🌍</span>
                    <span class="detail-text" id="continentInfo">Select region and generate city</span>
                </div>
            `;
            document.querySelector('.city-icon').textContent = '🏙️';
        }
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear the history?')) {
            stats.history = [];
            localStorage.removeItem('cityGenerator_history_en');
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