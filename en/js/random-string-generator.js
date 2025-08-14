document.addEventListener('DOMContentLoaded', function() {
    const stringLengthInput = document.getElementById('stringLength');
    const stringCountInput = document.getElementById('stringCount');
    const includeUppercaseCheckbox = document.getElementById('includeUppercase');
    const includeLowercaseCheckbox = document.getElementById('includeLowercase');
    const includeNumbersCheckbox = document.getElementById('includeNumbers');
    const includeSpecialCheckbox = document.getElementById('includeSpecial');
    const includeExtendedSpecialCheckbox = document.getElementById('includeExtendedSpecial');
    const stringTemplateSelect = document.getElementById('stringTemplate');
    const excludeSimilarCheckbox = document.getElementById('excludeSimilar');
    const generateBtn = document.getElementById('generateStrings');
    const quickGenerateBtn = document.getElementById('quickGenerate');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const result = document.getElementById('result');
    const generatedStrings = document.getElementById('generatedStrings');
    const generationInfo = document.getElementById('generationInfo');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesList = document.getElementById('favoritesList');
    const strengthSection = document.getElementById('strengthSection');
    const strengthAnalysis = document.getElementById('strengthAnalysis');
    
    // Character sets
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*',
        extendedSpecial: '+=-_[]{}|;:,.<>?',
        similar: '0oO1lI'
    };
    
    // Load history and favorites from localStorage
    let history = JSON.parse(localStorage.getItem('randomStringHistory_en') || '[]');
    let favorites = JSON.parse(localStorage.getItem('randomStringFavorites_en') || '[]');
    
    // Templates
    const templates = {
        password: {
            length: 16,
            uppercase: true,
            lowercase: true,
            numbers: true,
            special: true,
            extendedSpecial: false,
            excludeSimilar: true
        },
        pin: {
            length: 4,
            uppercase: false,
            lowercase: false,
            numbers: true,
            special: false,
            extendedSpecial: false,
            excludeSimilar: false
        },
        username: {
            length: 8,
            uppercase: false,
            lowercase: true,
            numbers: true,
            special: false,
            extendedSpecial: false,
            excludeSimilar: true
        },
        apikey: {
            length: 32,
            uppercase: false,
            lowercase: true,
            numbers: true,
            special: false,
            extendedSpecial: false,
            excludeSimilar: false
        },
        uuid: {
            length: 36,
            uppercase: false,
            lowercase: true,
            numbers: true,
            special: false,
            extendedSpecial: false,
            excludeSimilar: false
        },
        simple: {
            length: 10,
            uppercase: true,
            lowercase: true,
            numbers: true,
            special: false,
            extendedSpecial: false,
            excludeSimilar: true
        }
    };
    
    // Event listeners
    generateBtn.addEventListener('click', generateStrings);
    quickGenerateBtn.addEventListener('click', quickGenerate);
    clearHistoryBtn.addEventListener('click', clearHistory);
    stringTemplateSelect.addEventListener('change', applyTemplate);
    
    // Initialize display
    updateHistoryDisplay();
    updateFavoritesDisplay();
    validateInputs();
    
    function validateInputs() {
        const length = parseInt(stringLengthInput.value);
        const count = parseInt(stringCountInput.value);
        const hasCharSet = includeUppercaseCheckbox.checked || 
                          includeLowercaseCheckbox.checked || 
                          includeNumbersCheckbox.checked || 
                          includeSpecialCheckbox.checked ||
                          includeExtendedSpecialCheckbox.checked;
        
        const isValid = length >= 1 && length <= 1000 && count >= 1 && count <= 50 && hasCharSet;
        generateBtn.disabled = !isValid;
        quickGenerateBtn.disabled = !isValid;
        
        if (!hasCharSet) {
            showError('Please select at least one character set');
        } else {
            hideError();
        }
        
        return isValid;
    }
    
    function applyTemplate() {
        const template = stringTemplateSelect.value;
        if (template === 'custom') return;
        
        const config = templates[template];
        stringLengthInput.value = config.length;
        includeUppercaseCheckbox.checked = config.uppercase;
        includeLowercaseCheckbox.checked = config.lowercase;
        includeNumbersCheckbox.checked = config.numbers;
        includeSpecialCheckbox.checked = config.special;
        includeExtendedSpecialCheckbox.checked = config.extendedSpecial;
        excludeSimilarCheckbox.checked = config.excludeSimilar;
        
        validateInputs();
    }
    
    function generateStrings() {
        const length = parseInt(stringLengthInput.value);
        const count = parseInt(stringCountInput.value);
        
        if (!validateInputs()) return;
        
        const characterSet = buildCharacterSet();
        if (characterSet.length === 0) return;
        
        const strings = [];
        for (let i = 0; i < count; i++) {
            let string = '';
            if (stringTemplateSelect.value === 'uuid') {
                string = generateUUID();
            } else {
                string = generateRandomString(length, characterSet);
            }
            strings.push(string);
        }
        
        displayResults(strings);
        addToHistory(strings);
        analyzeStrength(strings[0]); // Analyze first string
    }
    
    function quickGenerate() {
        // Quick generation with popular settings
        stringLengthInput.value = 12;
        stringCountInput.value = 1;
        includeUppercaseCheckbox.checked = true;
        includeLowercaseCheckbox.checked = true;
        includeNumbersCheckbox.checked = true;
        includeSpecialCheckbox.checked = false;
        includeExtendedSpecialCheckbox.checked = false;
        excludeSimilarCheckbox.checked = true;
        stringTemplateSelect.value = 'custom';
        
        generateStrings();
    }
    
    function buildCharacterSet() {
        let chars = '';
        
        if (includeUppercaseCheckbox.checked) chars += charSets.uppercase;
        if (includeLowercaseCheckbox.checked) chars += charSets.lowercase;
        if (includeNumbersCheckbox.checked) chars += charSets.numbers;
        if (includeSpecialCheckbox.checked) chars += charSets.special;
        if (includeExtendedSpecialCheckbox.checked) chars += charSets.extendedSpecial;
        
        if (excludeSimilarCheckbox.checked) {
            chars = chars.split('').filter(char => !charSets.similar.includes(char)).join('');
        }
        
        return chars;
    }
    
    function generateRandomString(length, characterSet) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characterSet[array[i] % characterSet.length];
        }
        
        return result;
    }
    
    function generateUUID() {
        const chars = charSets.lowercase + charSets.numbers;
        const sections = [8, 4, 4, 4, 12];
        
        return sections.map(length => {
            return generateRandomString(length, chars);
        }).join('-');
    }
    
    function displayResults(strings) {
        generatedStrings.innerHTML = strings.map((string, index) => `
            <div class="string-item" data-string="${string}">
                <div style="font-weight: bold; margin-bottom: 0.5rem;">
                    String ${index + 1}: <span style="font-size: 0.9rem; opacity: 0.8;">(${string.length} characters)</span>
                </div>
                <div style="font-size: 1.2rem; margin: 0.5rem 0;">${string}</div>
                <div class="string-actions">
                    <button class="string-btn" onclick="copyString('${string}')">📋 Copy</button>
                    <button class="string-btn" onclick="addToFavorites('${string}')">⭐ Favorite</button>
                    <button class="string-btn" onclick="analyzeString('${string}')">🔍 Analyze</button>
                </div>
                <div class="copy-notification">Copied!</div>
            </div>
        `).join('');
        
        generationInfo.textContent = `Generated ${strings.length} strings. ` +
            `Total length: ${strings.reduce((sum, str) => sum + str.length, 0)} characters.`;
        
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth' });
    }
    
    function analyzeStrength(string) {
        const analysis = {
            length: string.length,
            hasUppercase: /[A-Z]/.test(string),
            hasLowercase: /[a-z]/.test(string),
            hasNumbers: /[0-9]/.test(string),
            hasSpecial: /[!@#$%^&*]/.test(string),
            hasExtendedSpecial: /[+\-=_\[\]{}|;:,.<>?]/.test(string),
            uniqueChars: new Set(string).size
        };
        
        let score = 0;
        let feedback = [];
        
        // Length
        if (analysis.length >= 12) score += 25;
        else if (analysis.length >= 8) score += 15;
        else feedback.push('Increase length to 12+ characters');
        
        // Character variety
        if (analysis.hasUppercase) score += 15;
        else feedback.push('Add uppercase letters');
        
        if (analysis.hasLowercase) score += 15;
        else feedback.push('Add lowercase letters');
        
        if (analysis.hasNumbers) score += 15;
        else feedback.push('Add numbers');
        
        if (analysis.hasSpecial || analysis.hasExtendedSpecial) score += 20;
        else feedback.push('Add special characters');
        
        // Uniqueness
        if (analysis.uniqueChars / analysis.length > 0.8) score += 10;
        else feedback.push('Increase character variety');
        
        let strengthLevel = 'weak';
        let strengthText = 'Weak';
        let strengthColor = 'strength-weak';
        
        if (score >= 80) {
            strengthLevel = 'strong';
            strengthText = 'Strong';
            strengthColor = 'strength-strong';
        } else if (score >= 60) {
            strengthLevel = 'good';
            strengthText = 'Good';
            strengthColor = 'strength-good';
        } else if (score >= 40) {
            strengthLevel = 'fair';
            strengthText = 'Fair';
            strengthColor = 'strength-fair';
        }
        
        strengthAnalysis.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span><strong>Strength Level:</strong> ${strengthText}</span>
                    <span><strong>Score:</strong> ${score}/100</span>
                </div>
                <div class="strength-meter">
                    <div class="strength-bar ${strengthColor}" style="width: ${score}%"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <div><strong>📊 Characteristics:</strong></div>
                <ul style="margin: 0.5rem 0;">
                    <li>Length: ${analysis.length} characters</li>
                    <li>Unique characters: ${analysis.uniqueChars}</li>
                    <li>Uppercase letters: ${analysis.hasUppercase ? '✅' : '❌'}</li>
                    <li>Lowercase letters: ${analysis.hasLowercase ? '✅' : '❌'}</li>
                    <li>Numbers: ${analysis.hasNumbers ? '✅' : '❌'}</li>
                    <li>Special characters: ${analysis.hasSpecial || analysis.hasExtendedSpecial ? '✅' : '❌'}</li>
                </ul>
            </div>
            
            ${feedback.length > 0 ? `
                <div>
                    <div><strong>💡 Recommendations:</strong></div>
                    <ul style="margin: 0.5rem 0;">
                        ${feedback.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            ` : '<div style="color: #10b981;"><strong>✅ Excellent strength!</strong></div>'}
        `;
        
        strengthSection.style.display = 'block';
    }
    
    function addToHistory(strings) {
        const entry = {
            timestamp: new Date().toLocaleString('en-US'),
            strings: strings,
            settings: {
                length: stringLengthInput.value,
                template: stringTemplateSelect.value,
                charSets: {
                    uppercase: includeUppercaseCheckbox.checked,
                    lowercase: includeLowercaseCheckbox.checked,
                    numbers: includeNumbersCheckbox.checked,
                    special: includeSpecialCheckbox.checked,
                    extendedSpecial: includeExtendedSpecialCheckbox.checked,
                    excludeSimilar: excludeSimilarCheckbox.checked
                }
            }
        };
        
        history.unshift(entry);
        history = history.slice(0, 50); // Keep last 50 entries
        localStorage.setItem('randomStringHistory_en', JSON.stringify(history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }
        
        historyList.innerHTML = history.slice(0, 10).map((entry, index) => `
            <div class="history-item">
                <div style="font-weight: bold; margin-bottom: 0.25rem;">
                    ${entry.timestamp} - ${entry.strings.length} strings
                </div>
                <div style="font-family: 'Courier New', monospace; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    ${entry.strings[0]}${entry.strings.length > 1 ? ` (+${entry.strings.length - 1} more)` : ''}
                </div>
                <div style="font-size: 0.8rem; color: #666;">
                    Length: ${entry.settings.length}, Template: ${entry.settings.template}
                </div>
            </div>
        `).join('');
        
        historySection.style.display = 'block';
    }
    
    function updateFavoritesDisplay() {
        if (favorites.length === 0) {
            favoritesSection.style.display = 'none';
            return;
        }
        
        favoritesList.innerHTML = favorites.map((fav, index) => `
            <div class="favorite-item">
                <span style="font-family: 'Courier New', monospace;">${fav.string}</span>
                <button class="string-btn" onclick="removeFromFavorites(${index})" style="background: rgba(255,255,255,0.3);">
                    🗑️
                </button>
            </div>
        `).join('');
        
        favoritesSection.style.display = 'block';
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            history = [];
            localStorage.removeItem('randomStringHistory_en');
            updateHistoryDisplay();
        }
    }
    
    function showError(message) {
        // Show error
    }
    
    function hideError() {
        // Hide error
    }
    
    // Global functions for buttons
    window.copyString = function(string) {
        navigator.clipboard.writeText(string).then(() => {
            const notification = event.target.closest('.string-item').querySelector('.copy-notification');
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 2000);
        });
    };
    
    window.addToFavorites = function(string) {
        if (!favorites.find(fav => fav.string === string)) {
            favorites.push({
                string: string,
                timestamp: new Date().toLocaleString('en-US')
            });
            localStorage.setItem('randomStringFavorites_en', JSON.stringify(favorites));
            updateFavoritesDisplay();
        }
    };
    
    window.removeFromFavorites = function(index) {
        favorites.splice(index, 1);
        localStorage.setItem('randomStringFavorites_en', JSON.stringify(favorites));
        updateFavoritesDisplay();
    };
    
    window.analyzeString = function(string) {
        analyzeStrength(string);
        strengthSection.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Real-time validation
    [stringLengthInput, stringCountInput, includeUppercaseCheckbox, includeLowercaseCheckbox, 
     includeNumbersCheckbox, includeSpecialCheckbox, includeExtendedSpecialCheckbox].forEach(element => {
        element.addEventListener('change', validateInputs);
        element.addEventListener('input', validateInputs);
    });
});