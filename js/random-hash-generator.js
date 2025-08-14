document.addEventListener('DOMContentLoaded', function() {
    const hashAlgorithmSelect = document.getElementById('hashAlgorithm');
    const hashCountInput = document.getElementById('hashCount');
    const hashFormatSelect = document.getElementById('hashFormat');
    const includePrefixesCheckbox = document.getElementById('includePrefixes');
    const exportFormatSelect = document.getElementById('exportFormat');
    const includeTimestampsCheckbox = document.getElementById('includeTimestamps');
    const generateBtn = document.getElementById('generateHashes');
    const quickGenerateBtn = document.getElementById('quickGenerate');
    const exportBtn = document.getElementById('exportHashes');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const result = document.getElementById('result');
    const generatedHashes = document.getElementById('generatedHashes');
    const generationInfo = document.getElementById('generationInfo');
    const validationSection = document.getElementById('validationSection');
    const validationResults = document.getElementById('validationResults');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const statisticsSection = document.getElementById('statisticsSection');
    const statisticsChart = document.getElementById('statisticsChart');
    
    // Load history and statistics from localStorage
    let history = JSON.parse(localStorage.getItem('randomHashHistory_ua') || '[]');
    let statistics = JSON.parse(localStorage.getItem('randomHashStats_ua') || '{}');
    let currentHashes = [];
    
    // Hash length configurations
    const hashLengths = {
        md5: 32,
        sha1: 40,
        sha256: 64,
        sha512: 128,
        crc32: 8,
        uuid: 36
    };
    
    // Hash prefixes
    const hashPrefixes = {
        md5: 'md5:',
        sha1: 'sha1:',
        sha256: 'sha256:',
        sha512: 'sha512:',
        crc32: '0x',
        uuid: ''
    };
    
    // Event listeners
    generateBtn.addEventListener('click', generateHashes);
    quickGenerateBtn.addEventListener('click', quickGenerate);
    exportBtn.addEventListener('click', exportHashes);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Initialize display
    updateHistoryDisplay();
    updateStatisticsDisplay();
    validateInputs();
    
    function validateInputs() {
        const count = parseInt(hashCountInput.value);
        const isValid = count >= 1 && count <= 100;
        
        generateBtn.disabled = !isValid;
        quickGenerateBtn.disabled = !isValid;
        
        if (!isValid) {
            showError('Кількість хешів повинна бути від 1 до 100');
        } else {
            hideError();
        }
    }
    
    function generateHashes() {
        const algorithm = hashAlgorithmSelect.value;
        const count = parseInt(hashCountInput.value);
        const format = hashFormatSelect.value;
        const includePrefixes = includePrefixesCheckbox.checked;
        
        if (!validateInputs()) return;
        
        const hashes = [];
        for (let i = 0; i < count; i++) {
            let hash = generateSingleHash(algorithm);
            
            // Apply format
            if (format === 'uppercase') {
                hash = hash.toUpperCase();
            } else if (format === 'lowercase') {
                hash = hash.toLowerCase();
            } else if (format === 'mixed') {
                hash = applyMixedCase(hash);
            }
            
            // Add prefix if needed
            if (includePrefixes && hashPrefixes[algorithm]) {
                hash = hashPrefixes[algorithm] + hash;
            }
            
            hashes.push({
                value: hash,
                algorithm: algorithm,
                timestamp: new Date().toISOString(),
                length: hash.length
            });
        }
        
        currentHashes = hashes;
        displayResults(hashes);
        addToHistory(hashes);
        validateHashes(hashes);
        updateStatistics(algorithm, count);
        exportBtn.style.display = 'inline-block';
    }
    
    function quickGenerate() {
        // Швидка генерація з популярними налаштуваннями
        hashAlgorithmSelect.value = 'sha256';
        hashCountInput.value = 5;
        hashFormatSelect.value = 'lowercase';
        includePrefixesCheckbox.checked = false;
        includeTimestampsCheckbox.checked = false;
        exportFormatSelect.value = 'text';
        
        generateHashes();
    }
    
    function generateSingleHash(algorithm) {
        const length = hashLengths[algorithm];
        
        if (algorithm === 'uuid') {
            return generateUUID();
        }
        
        const chars = '0123456789abcdef';
        let hash = '';
        
        // Використовуємо crypto.getRandomValues для якісної рандомізації
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            hash += chars[array[i] % 16];
        }
        
        return hash;
    }
    
    function generateUUID() {
        const chars = '0123456789abcdef';
        const sections = [8, 4, 4, 4, 12];
        
        return sections.map(length => {
            let section = '';
            const array = new Uint8Array(length);
            crypto.getRandomValues(array);
            
            for (let i = 0; i < length; i++) {
                section += chars[array[i] % 16];
            }
            return section;
        }).join('-');
    }
    
    function applyMixedCase(hash) {
        return hash.split('').map((char, index) => {
            if (/[a-f]/.test(char)) {
                return Math.random() > 0.5 ? char.toUpperCase() : char;
            }
            return char;
        }).join('');
    }
    
    function displayResults(hashes) {
        generatedHashes.innerHTML = hashes.map((hashObj, index) => `
            <div class="hash-item" data-hash="${hashObj.value}">
                <div class="hash-meta">
                    <span class="algorithm-badge">${hashObj.algorithm.toUpperCase()}</span>
                    Хеш ${index + 1} • ${hashObj.length} символів
                    ${includeTimestampsCheckbox.checked ? ` • ${new Date(hashObj.timestamp).toLocaleString('uk-UA')}` : ''}
                </div>
                <div class="hash-value">${hashObj.value}</div>
                <div class="hash-actions">
                    <button class="hash-btn" onclick="copyHash('${hashObj.value}')">📋 Копіювати</button>
                    <button class="hash-btn" onclick="validateSingleHash('${hashObj.value}', '${hashObj.algorithm}')">✅ Валідувати</button>
                    <button class="hash-btn" onclick="analyzeHash('${hashObj.value}', '${hashObj.algorithm}')">🔍 Аналіз</button>
                </div>
                <div class="copy-notification">Скопійовано!</div>
            </div>
        `).join('');
        
        generationInfo.textContent = `Згенеровано ${hashes.length} хешів алгоритмом ${hashAlgorithmSelect.value.toUpperCase()}. ` +
            `Середня довжина: ${Math.round(hashes.reduce((sum, h) => sum + h.length, 0) / hashes.length)} символів.`;
        
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth' });
    }
    
    function validateHashes(hashes) {
        const results = hashes.map((hashObj, index) => {
            const isValid = validateHashFormat(hashObj.value, hashObj.algorithm);
            return {
                index: index + 1,
                value: hashObj.value,
                algorithm: hashObj.algorithm,
                isValid: isValid,
                expectedLength: hashLengths[hashObj.algorithm],
                actualLength: hashObj.value.replace(/^(md5:|sha1:|sha256:|sha512:|0x)/, '').length
            };
        });
        
        validationResults.innerHTML = results.map(result => `
            <div class="validation-item ${result.isValid ? '' : 'validation-error'}">
                <div style="font-weight: bold; margin-bottom: 0.25rem;">
                    ${result.isValid ? '✅' : '❌'} Хеш ${result.index} (${result.algorithm.toUpperCase()})
                </div>
                <div style="font-family: 'Courier New', monospace; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    ${result.value}
                </div>
                <div style="font-size: 0.8rem; color: #666;">
                    Довжина: ${result.actualLength}/${result.expectedLength} символів
                    ${result.isValid ? ' • Формат правильний' : ' • Помилка формату'}
                </div>
            </div>
        `).join('');
        
        validationSection.style.display = 'block';
    }
    
    function validateHashFormat(hash, algorithm) {
        // Видаляємо префікси для валідації
        const cleanHash = hash.replace(/^(md5:|sha1:|sha256:|sha512:|0x)/, '');
        const expectedLength = hashLengths[algorithm];
        
        if (algorithm === 'uuid') {
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanHash);
        }
        
        return cleanHash.length === expectedLength && /^[0-9a-f]+$/i.test(cleanHash);
    }
    
    function exportHashes() {
        if (currentHashes.length === 0) return;
        
        const format = exportFormatSelect.value;
        let exportData = '';
        
        switch (format) {
            case 'text':
                exportData = currentHashes.map(h => h.value).join('\n');
                break;
            case 'json':
                exportData = JSON.stringify(currentHashes, null, 2);
                break;
            case 'csv':
                const headers = 'Algorithm,Hash,Length,Timestamp\n';
                const rows = currentHashes.map(h => 
                    `${h.algorithm},${h.value},${h.length},${h.timestamp}`
                ).join('\n');
                exportData = headers + rows;
                break;
            case 'custom':
                exportData = currentHashes.map(h => 
                    `${h.algorithm.toUpperCase()}: ${h.value} (${h.length} chars)`
                ).join('\n');
                break;
        }
        
        // Створюємо і завантажуємо файл
        const blob = new Blob([exportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `random-hashes-${Date.now()}.${format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function addToHistory(hashes) {
        const entry = {
            timestamp: new Date().toLocaleString('uk-UA'),
            algorithm: hashAlgorithmSelect.value,
            count: hashes.length,
            format: hashFormatSelect.value,
            hashes: hashes.slice(0, 3) // Зберігаємо тільки перші 3 для економії місця
        };
        
        history.unshift(entry);
        history = history.slice(0, 50); // Зберігаємо останні 50 записів
        localStorage.setItem('randomHashHistory_ua', JSON.stringify(history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }
        
        historyList.innerHTML = history.slice(0, 10).map((entry, index) => `
            <div class="validation-item">
                <div style="font-weight: bold; margin-bottom: 0.25rem;">
                    ${entry.timestamp} - ${entry.algorithm.toUpperCase()} (${entry.count} хешів)
                </div>
                <div style="font-family: 'Courier New', monospace; font-size: 0.85rem; margin-bottom: 0.5rem;">
                    ${entry.hashes[0].value}${entry.count > 1 ? ` (+${entry.count - 1} більше)` : ''}
                </div>
                <div style="font-size: 0.8rem; color: #666;">
                    Формат: ${entry.format}
                </div>
            </div>
        `).join('');
        
        historySection.style.display = 'block';
    }
    
    function updateStatistics(algorithm, count) {
        if (!statistics[algorithm]) {
            statistics[algorithm] = { count: 0, totalGenerated: 0 };
        }
        
        statistics[algorithm].count += 1;
        statistics[algorithm].totalGenerated += count;
        
        localStorage.setItem('randomHashStats_ua', JSON.stringify(statistics));
        updateStatisticsDisplay();
    }
    
    function updateStatisticsDisplay() {
        if (Object.keys(statistics).length === 0) {
            statisticsSection.style.display = 'none';
            return;
        }
        
        const totalSessions = Object.values(statistics).reduce((sum, stat) => sum + stat.count, 0);
        const totalHashes = Object.values(statistics).reduce((sum, stat) => sum + stat.totalGenerated, 0);
        
        statisticsChart.innerHTML = `
            <div class="statistics-card">
                <h6>📊 Загальна статистика</h6>
                <div>Всього сесій: <strong>${totalSessions}</strong></div>
                <div>Всього хешів: <strong>${totalHashes}</strong></div>
            </div>
            ${Object.entries(statistics).map(([algorithm, stat]) => `
                <div class="statistics-card">
                    <h6>${algorithm.toUpperCase()}</h6>
                    <div>Сесій: ${stat.count}</div>
                    <div>Хешів: ${stat.totalGenerated}</div>
                    <div>Середньо: ${Math.round(stat.totalGenerated / stat.count)}</div>
                </div>
            `).join('')}
        `;
        
        statisticsSection.style.display = 'block';
    }
    
    function clearHistory() {
        if (confirm('Ви впевнені, що хочете очистити всю історію та статистику?')) {
            history = [];
            statistics = {};
            localStorage.removeItem('randomHashHistory_ua');
            localStorage.removeItem('randomHashStats_ua');
            updateHistoryDisplay();
            updateStatisticsDisplay();
        }
    }
    
    function showError(message) {
        // Показати помилку
    }
    
    function hideError() {
        // Приховати помилку
    }
    
    // Глобальні функції для кнопок
    window.copyHash = function(hash) {
        navigator.clipboard.writeText(hash).then(() => {
            const notification = event.target.closest('.hash-item').querySelector('.copy-notification');
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 2000);
        });
    };
    
    window.validateSingleHash = function(hash, algorithm) {
        const isValid = validateHashFormat(hash, algorithm);
        alert(isValid ? 'Хеш має правильний формат!' : 'Хеш має неправильний формат!');
    };
    
    window.analyzeHash = function(hash, algorithm) {
        const cleanHash = hash.replace(/^(md5:|sha1:|sha256:|sha512:|0x)/, '');
        const charFrequency = {};
        
        for (let char of cleanHash) {
            charFrequency[char] = (charFrequency[char] || 0) + 1;
        }
        
        const entropy = calculateEntropy(cleanHash);
        const uniqueChars = Object.keys(charFrequency).length;
        
        alert(`Аналіз хешу ${algorithm.toUpperCase()}:\n` +
              `Довжина: ${cleanHash.length} символів\n` +
              `Унікальних символів: ${uniqueChars}/16\n` +
              `Ентропія: ${entropy.toFixed(2)} біт\n` +
              `Найчастіший символ: ${Object.entries(charFrequency).sort((a,b) => b[1] - a[1])[0][0]} (${Object.entries(charFrequency).sort((a,b) => b[1] - a[1])[0][1]} разів)`);
    };
    
    function calculateEntropy(str) {
        const len = str.length;
        const frequency = {};
        
        for (let char of str) {
            frequency[char] = (frequency[char] || 0) + 1;
        }
        
        let entropy = 0;
        for (let count of Object.values(frequency)) {
            const p = count / len;
            entropy -= p * Math.log2(p);
        }
        
        return entropy * len;
    }
    
    // Валідація в реальному часі
    hashCountInput.addEventListener('input', validateInputs);
    hashCountInput.addEventListener('change', validateInputs);
});