document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateColorBtn');
    const colorTypeFilter = document.getElementById('colorTypeFilter');
    const colorCard = document.getElementById('colorCard');
    const colorSwatch = document.getElementById('colorSwatch');
    const colorName = document.getElementById('colorName');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const totalGenerated = document.getElementById('totalGenerated');
    const uniqueColors = document.getElementById('uniqueColors');
    const favoriteType = document.getElementById('favoriteType');
    const resetStatsBtn = document.getElementById('resetColorStats');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    // Load statistics from localStorage
    let stats = {
        total: parseInt(localStorage.getItem('colorGenerator_total_en') || '0'),
        unique: new Set(JSON.parse(localStorage.getItem('colorGenerator_unique_en') || '[]')),
        types: JSON.parse(localStorage.getItem('colorGenerator_types_en') || '{}'),
        history: JSON.parse(localStorage.getItem('colorGenerator_history_en') || '[]')
    };
    
    // Color names database
    const colorNames = [
        'Crimson Sunset', 'Ocean Depth', 'Forest Green', 'Sunshine Yellow',
        'Lavender Mist', 'Coral Reef', 'Sky Blue', 'Golden Autumn',
        'Purple Twilight', 'Mint Fresh', 'Chocolate Brown', 'Rose Dawn',
        'Turquoise Wave', 'Cream White', 'Graphite Gray', 'Emerald Green',
        'Fire Red', 'Ice Blue', 'Honey Amber', 'Platinum Silver',
        'Royal Purple', 'Olive Branch', 'Peach Soft', 'Aquamarine Clear',
        'Carmine Red', 'Indigo Deep', 'Lemon Bright', 'Pink Powder',
        'Sea Green', 'Burgundy Deep', 'Almond Warm', 'Sapphire Blue',
        'Apricot Soft', 'Cherry Juicy', 'Wheat Golden', 'Lilac Tender',
        'Tomato Red', 'Khaki Natural', 'Ivory White', 'Marsala Wine',
        'Tiffany Blue', 'Fern Green', 'Vanilla Cream', 'Ruby Red',
        'Pine Green', 'Cappuccino Brown', 'Beige Sand', 'Orchid Purple',
        'Citron Yellow', 'Salmon Pink', 'Slate Blue', 'Chestnut Warm'
    ];
    
    updateStatsDisplay();
    updateHistoryDisplay();
    
    generateBtn.addEventListener('click', generateColor);
    resetStatsBtn.addEventListener('click', resetStatistics);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Add copy functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn')) {
            const targetId = e.target.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const textToCopy = targetElement.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                e.target.textContent = '✓';
                e.target.classList.add('copied');
                setTimeout(() => {
                    e.target.textContent = '📋';
                    e.target.classList.remove('copied');
                }, 1000);
            });
        }
    });
    
    function generateColor() {
        const selectedType = colorTypeFilter.value;
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Generating color...</span>';
        
        // Add loading effect
        colorCard.classList.add('loading');
        colorName.textContent = '🎨 Creating...';
        colorSwatch.style.background = 'linear-gradient(45deg, #f0f0f0, #e0e0e0)';
        
        // Generate random color after animation
        setTimeout(() => {
            const color = generateRandomColor(selectedType);
            
            // Update UI with color info
            displayColor(color);
            
            // Update statistics
            updateStatistics(color, selectedType);
            
            // Add to history
            addToHistory(color);
            
            // Re-enable button
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="button-icon">🎲</span><span class="button-text">Generate Color</span>';
            colorCard.classList.remove('loading');
            colorCard.classList.add('generated');
            
        }, 800);
    }
    
    function generateRandomColor(type) {
        let h, s, l;
        
        switch (type) {
            case 'bright':
                h = Math.floor(Math.random() * 360);
                s = 70 + Math.floor(Math.random() * 30); // 70-100%
                l = 45 + Math.floor(Math.random() * 25); // 45-70%
                break;
            case 'pastel':
                h = Math.floor(Math.random() * 360);
                s = 25 + Math.floor(Math.random() * 40); // 25-65%
                l = 70 + Math.floor(Math.random() * 25); // 70-95%
                break;
            case 'dark':
                h = Math.floor(Math.random() * 360);
                s = 30 + Math.floor(Math.random() * 70); // 30-100%
                l = 10 + Math.floor(Math.random() * 30); // 10-40%
                break;
            case 'light':
                h = Math.floor(Math.random() * 360);
                s = 20 + Math.floor(Math.random() * 40); // 20-60%
                l = 80 + Math.floor(Math.random() * 20); // 80-100%
                break;
            case 'warm':
                h = Math.random() < 0.5 ? 
                    Math.floor(Math.random() * 60) : // 0-60 (red-yellow)
                    300 + Math.floor(Math.random() * 60); // 300-360 (magenta-red)
                s = 40 + Math.floor(Math.random() * 60); // 40-100%
                l = 35 + Math.floor(Math.random() * 50); // 35-85%
                break;
            case 'cool':
                h = 120 + Math.floor(Math.random() * 180); // 120-300 (green-blue-purple)
                s = 40 + Math.floor(Math.random() * 60); // 40-100%
                l = 35 + Math.floor(Math.random() * 50); // 35-85%
                break;
            default: // 'all'
                h = Math.floor(Math.random() * 360);
                s = Math.floor(Math.random() * 100);
                l = 15 + Math.floor(Math.random() * 80); // 15-95%
                break;
        }
        
        const rgb = hslToRgb(h, s, l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        const name = colorNames[Math.floor(Math.random() * colorNames.length)];
        
        return {
            name: name,
            hex: hex,
            rgb: rgb,
            hsl: { h, s, l },
            type: type
        };
    }
    
    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h * 12) % 12;
            return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        };
        
        return {
            r: Math.round(f(0) * 255),
            g: Math.round(f(8) * 255),
            b: Math.round(f(4) * 255)
        };
    }
    
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }
    
    function displayColor(color) {
        colorName.textContent = color.name;
        colorSwatch.style.background = color.hex;
        
        hexValue.textContent = color.hex;
        rgbValue.textContent = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
        hslValue.textContent = `hsl(${color.hsl.h}°, ${color.hsl.s}%, ${color.hsl.l}%)`;
        
        // Update swatch border color for better visibility
        const brightness = (color.rgb.r * 299 + color.rgb.g * 587 + color.rgb.b * 114) / 1000;
        colorSwatch.style.borderColor = brightness > 128 ? '#ddd' : '#fff';
    }
    
    function updateStatistics(color, type) {
        stats.total += 1;
        stats.unique.add(color.hex);
        
        if (!stats.types[type]) {
            stats.types[type] = 0;
        }
        stats.types[type] += 1;
        
        // Save to localStorage
        localStorage.setItem('colorGenerator_total_en', stats.total.toString());
        localStorage.setItem('colorGenerator_unique_en', JSON.stringify([...stats.unique]));
        localStorage.setItem('colorGenerator_types_en', JSON.stringify(stats.types));
        
        updateStatsDisplay();
    }
    
    function updateStatsDisplay() {
        totalGenerated.textContent = stats.total;
        uniqueColors.textContent = stats.unique.size;
        
        // Find favorite type
        let favType = '-';
        let maxCount = 0;
        const typeNames = {
            'all': 'All',
            'bright': 'Bright',
            'pastel': 'Pastel',
            'dark': 'Dark',
            'light': 'Light',
            'warm': 'Warm',
            'cool': 'Cool'
        };
        
        for (const [type, count] of Object.entries(stats.types)) {
            if (count > maxCount) {
                maxCount = count;
                favType = typeNames[type] || type;
            }
        }
        
        favoriteType.textContent = favType;
    }
    
    function addToHistory(color) {
        const historyItem = {
            name: color.name,
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl,
            type: color.type,
            timestamp: new Date().toLocaleString('en-US')
        };
        
        stats.history.unshift(historyItem); // Add to beginning
        if (stats.history.length > 50) { // Keep only last 50
            stats.history = stats.history.slice(0, 50);
        }
        
        localStorage.setItem('colorGenerator_history_en', JSON.stringify(stats.history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        if (stats.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No colors generated yet</p>';
            clearHistoryBtn.style.display = 'none';
            return;
        }
        
        clearHistoryBtn.style.display = 'inline-flex';
        
        const historyHTML = stats.history.map(item => `
            <div class="history-item">
                <div class="history-color">
                    <div class="history-swatch" style="background: ${item.hex}"></div>
                    <div>
                        <div class="history-name">${item.name}</div>
                        <div class="history-details">${item.hex}</div>
                    </div>
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
                types: {},
                history: []
            };
            
            localStorage.removeItem('colorGenerator_total_en');
            localStorage.removeItem('colorGenerator_unique_en');
            localStorage.removeItem('colorGenerator_types_en');
            localStorage.removeItem('colorGenerator_history_en');
            
            updateStatsDisplay();
            updateHistoryDisplay();
            
            // Reset color card
            colorCard.classList.remove('generated');
            colorName.textContent = 'Click button to generate';
            colorSwatch.style.background = '#f0f0f0';
            colorSwatch.style.borderColor = '#ddd';
            hexValue.textContent = '-';
            rgbValue.textContent = '-';
            hslValue.textContent = '-';
        }
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear the history?')) {
            stats.history = [];
            localStorage.removeItem('colorGenerator_history_en');
            updateHistoryDisplay();
        }
    }
    
    // Add loading animation
    const style = document.createElement('style');
    style.textContent = `
        .color-card.loading {
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .color-swatch.loading {
            animation: shimmer 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        @keyframes shimmer {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});