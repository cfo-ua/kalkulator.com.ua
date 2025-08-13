document.addEventListener('DOMContentLoaded', function() {
    const minValueInput = document.getElementById('minValue');
    const maxValueInput = document.getElementById('maxValue');
    const countValueInput = document.getElementById('countValue');
    const uniqueNumbersCheckbox = document.getElementById('uniqueNumbers');
    const generateBtn = document.getElementById('generateNumbers');
    const quickGenerateBtn = document.getElementById('quickGenerate');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const result = document.getElementById('result');
    const generatedNumbers = document.getElementById('generatedNumbers');
    const generationInfo = document.getElementById('generationInfo');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const statisticsSection = document.getElementById('statisticsSection');
    const statisticsChart = document.getElementById('statisticsChart');
    
    // Load history and statistics from localStorage
    let history = JSON.parse(localStorage.getItem('randomNumberHistory_en') || '[]');
    let statistics = JSON.parse(localStorage.getItem('randomNumberStats_en') || '{}');
    
    // Event listeners
    generateBtn.addEventListener('click', generateNumbers);
    quickGenerateBtn.addEventListener('click', quickGenerate);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Validation event listeners
    minValueInput.addEventListener('change', validateInputs);
    maxValueInput.addEventListener('change', validateInputs);
    countValueInput.addEventListener('change', validateInputs);
    uniqueNumbersCheckbox.addEventListener('change', validateInputs);
    
    // Initialize display
    updateHistoryDisplay();
    updateStatisticsDisplay();
    validateInputs();
    
    function validateInputs() {
        const min = parseInt(minValueInput.value);
        const max = parseInt(maxValueInput.value);
        const count = parseInt(countValueInput.value);
        const unique = uniqueNumbersCheckbox.checked;
        
        let isValid = true;
        let errorMessage = '';
        
        if (min >= max) {
            errorMessage = 'Minimum must be less than maximum';
            isValid = false;
        } else if (unique && count > (max - min + 1)) {
            errorMessage = `Cannot generate ${count} unique numbers in range ${min}-${max}`;
            isValid = false;
        } else if (count < 1 || count > 100) {
            errorMessage = 'Count must be between 1 and 100';
            isValid = false;
        }
        
        generateBtn.disabled = !isValid;
        quickGenerateBtn.disabled = !isValid;
        
        if (!isValid) {
            generateBtn.textContent = `❌ ${errorMessage}`;
        } else {
            generateBtn.textContent = '🎲 Generate Numbers';
        }
    }
    
    function generateSecureRandom() {
        // Use crypto.getRandomValues for cryptographically secure random numbers
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0] / (0xFFFFFFFF + 1);
    }
    
    function generateRandomNumber(min, max) {
        return Math.floor(generateSecureRandom() * (max - min + 1)) + min;
    }
    
    function generateNumbers() {
        const min = parseInt(minValueInput.value);
        const max = parseInt(maxValueInput.value);
        const count = parseInt(countValueInput.value);
        const unique = uniqueNumbersCheckbox.checked;
        
        if (!validateRange(min, max, count, unique)) return;
        
        // Generate numbers
        const numbers = [];
        const availableNumbers = [];
        
        if (unique) {
            // Create array of all possible numbers
            for (let i = min; i <= max; i++) {
                availableNumbers.push(i);
            }
            
            // Select random numbers without replacement
            for (let i = 0; i < count; i++) {
                const randomIndex = Math.floor(generateSecureRandom() * availableNumbers.length);
                numbers.push(availableNumbers.splice(randomIndex, 1)[0]);
            }
        } else {
            // Generate with possible repeats
            for (let i = 0; i < count; i++) {
                numbers.push(generateRandomNumber(min, max));
            }
        }
        
        // Sort numbers for better display
        numbers.sort((a, b) => a - b);
        
        // Update statistics
        numbers.forEach(num => {
            statistics[num] = (statistics[num] || 0) + 1;
        });
        
        // Add to history
        const historyEntry = {
            numbers: numbers,
            timestamp: new Date().toLocaleString('en-US'),
            range: `${min} - ${max}`,
            count: count,
            unique: unique
        };
        
        history.unshift(historyEntry);
        if (history.length > 50) history.pop(); // Keep only last 50 entries
        
        // Save to localStorage
        localStorage.setItem('randomNumberHistory_en', JSON.stringify(history));
        localStorage.setItem('randomNumberStats_en', JSON.stringify(statistics));
        
        // Display results
        displayResults(numbers, historyEntry);
        updateHistoryDisplay();
        updateStatisticsDisplay();
    }
    
    function quickGenerate() {
        // Quick generate with preset common ranges
        const presets = [
            {min: 1, max: 6, count: 1},    // Dice
            {min: 1, max: 100, count: 1},  // Percentage
            {min: 1, max: 49, count: 6},   // Lottery
            {min: 0, max: 36, count: 1},   // Roulette
        ];
        
        const preset = presets[Math.floor(generateSecureRandom() * presets.length)];
        
        minValueInput.value = preset.min;
        maxValueInput.value = preset.max;
        countValueInput.value = preset.count;
        uniqueNumbersCheckbox.checked = preset.count > 1;
        
        validateInputs();
        generateNumbers();
    }
    
    function validateRange(min, max, count, unique) {
        if (min >= max) {
            alert('Minimum value must be less than maximum value');
            return false;
        }
        
        if (unique && count > (max - min + 1)) {
            alert(`Cannot generate ${count} unique numbers in range ${min}-${max}`);
            return false;
        }
        
        return true;
    }
    
    function displayResults(numbers, historyEntry) {
        // Display generated numbers
        generatedNumbers.innerHTML = numbers.map(num => 
            `<span class="number-chip">${num}</span>`
        ).join('');
        
        // Display generation info
        const uniqueText = historyEntry.unique ? 'unique' : 'with possible repeats';
        generationInfo.textContent = `Generated ${historyEntry.count} numbers in range ${historyEntry.range} (${uniqueText})`;
        
        // Show result section
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }
        
        historySection.style.display = 'block';
        
        historyList.innerHTML = history.slice(0, 10).map(entry => `
            <div class="history-item">
                <div>
                    <strong>${entry.numbers.join(', ')}</strong>
                    <div style="font-size: 0.9rem; color: #6b7280;">
                        Range: ${entry.range} | Count: ${entry.count} | ${entry.unique ? 'Unique' : 'With repeats'}
                    </div>
                </div>
                <div style="font-size: 0.8rem; color: #9ca3af;">
                    ${entry.timestamp}
                </div>
            </div>
        `).join('');
    }
    
    function updateStatisticsDisplay() {
        if (Object.keys(statistics).length === 0) {
            statisticsSection.style.display = 'none';
            return;
        }
        
        statisticsSection.style.display = 'block';
        
        // Sort numbers by frequency
        const sortedStats = Object.entries(statistics)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20); // Show top 20
        
        const maxCount = Math.max(...sortedStats.map(([num, count]) => count));
        
        statisticsChart.innerHTML = sortedStats.map(([num, count]) => {
            const percentage = (count / maxCount) * 100;
            return `
                <div class="statistics-bar">
                    <div class="stat-number">${num}</div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="stat-count">${count}</div>
                </div>
            `;
        }).join('');
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear all history and statistics?')) {
            history = [];
            statistics = {};
            localStorage.removeItem('randomNumberHistory_en');
            localStorage.removeItem('randomNumberStats_en');
            
            updateHistoryDisplay();
            updateStatisticsDisplay();
            
            alert('History and statistics cleared');
        }
    }
});