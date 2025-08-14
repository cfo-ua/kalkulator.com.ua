document.addEventListener('DOMContentLoaded', function() {
    const zipCountrySelect = document.getElementById('zipCountry');
    const zipCountInput = document.getElementById('zipCount');
    const generateBtn = document.getElementById('generateZipCodes');
    const copyAllBtn = document.getElementById('copyAllZips');
    const clearHistoryBtn = document.getElementById('clearZipHistory');
    const resultSection = document.getElementById('zipResult');
    const generatedCodes = document.getElementById('generatedZipCodes');
    const generationInfo = document.getElementById('zipGenerationInfo');
    const historySection = document.getElementById('zipHistorySection');
    const historyList = document.getElementById('zipHistoryList');
    
    // Load history from localStorage
    let history = JSON.parse(localStorage.getItem('zipCodeHistory_en') || '[]');
    
    // Event listeners
    generateBtn.addEventListener('click', generateZipCodes);
    copyAllBtn.addEventListener('click', copyAllCodes);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Initialize display
    updateHistoryDisplay();
    
    // ZIP code formats and generators
    const zipFormats = {
        ukraine: {
            name: 'Ukraine',
            pattern: '01001',
            generator: () => String(Math.floor(Math.random() * 90000) + 10000)
        },
        usa: {
            name: 'USA',
            pattern: '12345',
            generator: () => String(Math.floor(Math.random() * 90000) + 10000)
        },
        'usa-plus4': {
            name: 'USA ZIP+4',
            pattern: '12345-6789',
            generator: () => {
                const zip = String(Math.floor(Math.random() * 90000) + 10000);
                const plus4 = String(Math.floor(Math.random() * 9000) + 1000);
                return `${zip}-${plus4}`;
            }
        },
        canada: {
            name: 'Canada',
            pattern: 'A1A 1A1',
            generator: () => {
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const numbers = '0123456789';
                return `${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * 10)]}${letters[Math.floor(Math.random() * letters.length)]} ${numbers[Math.floor(Math.random() * 10)]}${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * 10)]}`;
            }
        },
        uk: {
            name: 'United Kingdom',
            pattern: 'SW1A 1AA',
            generator: () => {
                const areas = ['SW', 'W', 'WC', 'E', 'EC', 'N', 'NW', 'SE', 'S', 'CR', 'BR', 'DA', 'UB', 'HA', 'TW'];
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const numbers = '0123456789';
                const area = areas[Math.floor(Math.random() * areas.length)];
                const district = Math.floor(Math.random() * 20) + 1;
                const sector = Math.floor(Math.random() * 10);
                const unit = letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)];
                return `${area}${district}${sector} ${sector}${unit}`;
            }
        },
        germany: {
            name: 'Germany',
            pattern: '12345',
            generator: () => String(Math.floor(Math.random() * 90000) + 10000)
        },
        france: {
            name: 'France',
            pattern: '12345',
            generator: () => String(Math.floor(Math.random() * 90000) + 10000)
        }
    };
    
    function generateZipCodes() {
        const country = zipCountrySelect.value;
        const count = parseInt(zipCountInput.value);
        
        if (count < 1 || count > 50) {
            alert('Number of codes must be between 1 and 50');
            return;
        }
        
        const codes = [];
        const timestamp = new Date().toLocaleString('en-US');
        
        if (country === 'mixed') {
            // Generate mixed formats
            const formatKeys = Object.keys(zipFormats);
            for (let i = 0; i < count; i++) {
                const randomFormat = formatKeys[Math.floor(Math.random() * formatKeys.length)];
                const code = zipFormats[randomFormat].generator();
                codes.push({
                    code: code,
                    format: zipFormats[randomFormat].name,
                    country: randomFormat
                });
            }
        } else {
            // Generate specific format
            const format = zipFormats[country];
            for (let i = 0; i < count; i++) {
                codes.push({
                    code: format.generator(),
                    format: format.name,
                    country: country
                });
            }
        }
        
        // Display results
        displayResults(codes, timestamp);
        
        // Add to history
        addToHistory(codes, timestamp);
        
        // Show result section
        resultSection.style.display = 'block';
    }
    
    function displayResults(codes, timestamp) {
        const codesList = codes.map(item => 
            `<div class="code-item">
                <span class="code-value">${item.code}</span>
                <span class="code-format">${item.format}</span>
                <button class="copy-btn" onclick="copyToClipboard('${item.code}')">📋</button>
            </div>`
        ).join('');
        
        generatedCodes.innerHTML = `
            <div class="codes-grid">
                ${codesList}
            </div>
        `;
        
        generationInfo.innerHTML = `
            <div class="info-row">
                <span>📊 Generated: <strong>${codes.length}</strong> postal codes</span>
                <span>🕒 Time: <strong>${timestamp}</strong></span>
            </div>
        `;
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied: ' + text);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Copied: ' + text);
        });
    }
    
    function copyAllCodes() {
        const codeElements = document.querySelectorAll('.code-value');
        if (codeElements.length === 0) {
            alert('Generate postal codes first');
            return;
        }
        
        const allCodes = Array.from(codeElements).map(el => el.textContent).join('\n');
        copyToClipboard(allCodes);
    }
    
    function addToHistory(codes, timestamp) {
        const historyEntry = {
            codes: codes,
            timestamp: timestamp,
            count: codes.length
        };
        
        history.unshift(historyEntry);
        
        // Keep only last 20 entries
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        localStorage.setItem('zipCodeHistory_en', JSON.stringify(history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }
        
        historySection.style.display = 'block';
        
        const historyHTML = history.map((entry, index) => `
            <div class="history-entry">
                <div class="history-header">
                    <span class="entry-info">${entry.count} codes</span>
                    <span class="entry-time">${entry.timestamp}</span>
                </div>
                <div class="history-codes">
                    ${entry.codes.slice(0, 5).map(item => 
                        `<span class="history-code" onclick="copyToClipboard('${item.code}')" title="Click to copy">${item.code}</span>`
                    ).join('')}
                    ${entry.codes.length > 5 ? `<span class="more-codes">+${entry.codes.length - 5} more</span>` : ''}
                </div>
            </div>
        `).join('');
        
        historyList.innerHTML = historyHTML;
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear the history?')) {
            history = [];
            localStorage.removeItem('zipCodeHistory_en');
            updateHistoryDisplay();
            showNotification('History cleared');
        }
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.style.opacity = '1', 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    // Global function for inline onclick handlers
    window.copyToClipboard = copyToClipboard;
});