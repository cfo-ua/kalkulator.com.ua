document.addEventListener('DOMContentLoaded', function() {
    const charLengthInput = document.getElementById('charLength');
    const charCountInput = document.getElementById('charCount');
    const includeUppercaseCheck = document.getElementById('includeUppercase');
    const includeLowercaseCheck = document.getElementById('includeLowercase');
    const includeNumbersCheck = document.getElementById('includeNumbers');
    const includeSpecialCheck = document.getElementById('includeSpecial');
    const includeUkrainianCheck = document.getElementById('includeUkrainian');
    const includeMathCheck = document.getElementById('includeMath');
    const excludeSimilarCheck = document.getElementById('excludeSimilar');
    const noRepeatsCheck = document.getElementById('noRepeats');
    const hexOnlyCheck = document.getElementById('hexOnly');
    const base64OnlyCheck = document.getElementById('base64Only');
    const customCharsInput = document.getElementById('customChars');
    const generateBtn = document.getElementById('generateChars');
    const copyAllBtn = document.getElementById('copyAllChars');
    const clearHistoryBtn = document.getElementById('clearCharHistory');
    const resultSection = document.getElementById('charResult');
    const generatedChars = document.getElementById('generatedChars');
    const generationInfo = document.getElementById('charGenerationInfo');
    const historySection = document.getElementById('charHistorySection');
    const historyList = document.getElementById('charHistoryList');
    
    // Load history from localStorage
    let history = JSON.parse(localStorage.getItem('charHistory_en') || '[]');
    
    // Character sets
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        ukrainian: 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя',
        math: '±×÷√∞∑∆∇∈∉∅∪∩⊂⊃⊆⊇∝∧∨¬⊕⊗∀∃≡≢≠≤≥≈≅∼≃≺≻⊥∥∠∝∫∬∭ℵℶℷℸ',
        hex: '0123456789ABCDEF',
        base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        similar: '0O1lI|'
    };
    
    // Event listeners
    generateBtn.addEventListener('click', generateCharacters);
    copyAllBtn.addEventListener('click', copyAllCharacters);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Exclusive options handlers
    hexOnlyCheck.addEventListener('change', function() {
        if (this.checked) {
            base64OnlyCheck.checked = false;
            updateCharTypeCheckboxes(false);
        }
    });
    
    base64OnlyCheck.addEventListener('change', function() {
        if (this.checked) {
            hexOnlyCheck.checked = false;
            updateCharTypeCheckboxes(false);
        }
    });
    
    // Initialize display
    updateHistoryDisplay();
    
    function updateCharTypeCheckboxes(enabled) {
        includeUppercaseCheck.disabled = !enabled;
        includeLowercaseCheck.disabled = !enabled;
        includeNumbersCheck.disabled = !enabled;
        includeSpecialCheck.disabled = !enabled;
        includeUkrainianCheck.disabled = !enabled;
        includeMathCheck.disabled = !enabled;
    }
    
    function buildCharacterSet() {
        let charset = '';
        
        // Check for exclusive modes
        if (hexOnlyCheck.checked) {
            return charSets.hex;
        }
        
        if (base64OnlyCheck.checked) {
            return charSets.base64;
        }
        
        // Custom character set takes precedence
        if (customCharsInput.value.trim()) {
            charset = customCharsInput.value.trim();
        } else {
            // Build from selected character types
            if (includeUppercaseCheck.checked) charset += charSets.uppercase;
            if (includeLowercaseCheck.checked) charset += charSets.lowercase;
            if (includeNumbersCheck.checked) charset += charSets.numbers;
            if (includeSpecialCheck.checked) charset += charSets.special;
            if (includeUkrainianCheck.checked) charset += charSets.ukrainian;
            if (includeMathCheck.checked) charset += charSets.math;
        }
        
        // Remove similar characters if requested
        if (excludeSimilarCheck.checked) {
            charset = charset.split('').filter(char => !charSets.similar.includes(char)).join('');
        }
        
        // Remove duplicates
        charset = [...new Set(charset)].join('');
        
        return charset;
    }
    
    function generateRandomCharacters(charset, length, allowRepeats = true) {
        if (!charset) return '';
        
        let result = '';
        let availableChars = charset;
        
        for (let i = 0; i < length; i++) {
            if (availableChars.length === 0) {
                if (allowRepeats) {
                    availableChars = charset;
                } else {
                    break; // Can't generate more unique characters
                }
            }
            
            const randomIndex = Math.floor(Math.random() * availableChars.length);
            const selectedChar = availableChars[randomIndex];
            result += selectedChar;
            
            if (!allowRepeats) {
                availableChars = availableChars.replace(selectedChar, '');
            }
        }
        
        return result;
    }
    
    function generateCharacters() {
        const length = parseInt(charLengthInput.value);
        const count = parseInt(charCountInput.value);
        const allowRepeats = !noRepeatsCheck.checked;
        
        if (length < 1 || length > 1000) {
            alert('Length must be between 1 and 1000 characters');
            return;
        }
        
        if (count < 1 || count > 50) {
            alert('Count must be between 1 and 50');
            return;
        }
        
        const charset = buildCharacterSet();
        
        if (!charset) {
            alert('Select at least one character type or enter a custom set');
            return;
        }
        
        if (!allowRepeats && length > charset.length) {
            alert(`Cannot create ${length} unique characters from a set of ${charset.length} characters`);
            return;
        }
        
        const sequences = [];
        const timestamp = new Date().toLocaleString('en-US');
        
        for (let i = 0; i < count; i++) {
            const sequence = generateRandomCharacters(charset, length, allowRepeats);
            sequences.push({
                sequence: sequence,
                length: sequence.length,
                charset: charset.length
            });
        }
        
        // Display results
        displayResults(sequences, timestamp);
        
        // Add to history
        addToHistory(sequences, timestamp, length);
        
        // Show result section
        resultSection.style.display = 'block';
    }
    
    function displayResults(sequences, timestamp) {
        const sequencesList = sequences.map((item, index) => 
            `<div class="code-item">
                <span class="code-value">${item.sequence}</span>
                <span class="code-format">${item.length} characters</span>
                <button class="copy-btn" onclick="copyToClipboard('${item.sequence}')">📋</button>
            </div>`
        ).join('');
        
        generatedChars.innerHTML = `
            <div class="codes-grid">
                ${sequencesList}
            </div>
        `;
        
        const charsetSize = sequences.length > 0 ? sequences[0].charset : 0;
        generationInfo.innerHTML = `
            <div class="info-row">
                <span>📊 Generated: <strong>${sequences.length}</strong> sequences</span>
                <span>🎭 Set: <strong>${charsetSize}</strong> characters</span>
                <span>🕒 Time: <strong>${timestamp}</strong></span>
            </div>
        `;
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied: ' + text.substring(0, 20) + (text.length > 20 ? '...' : ''));
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Copied: ' + text.substring(0, 20) + (text.length > 20 ? '...' : ''));
        });
    }
    
    function copyAllCharacters() {
        const charElements = document.querySelectorAll('.code-value');
        if (charElements.length === 0) {
            alert('Generate characters first');
            return;
        }
        
        const allChars = Array.from(charElements).map(el => el.textContent).join('\n');
        copyToClipboard(allChars);
    }
    
    function addToHistory(sequences, timestamp, length) {
        const historyEntry = {
            sequences: sequences.slice(0, 5), // Store only first 5 for display
            timestamp: timestamp,
            count: sequences.length,
            length: length
        };
        
        history.unshift(historyEntry);
        
        // Keep only last 30 entries
        if (history.length > 30) {
            history = history.slice(0, 30);
        }
        
        localStorage.setItem('charHistory_en', JSON.stringify(history));
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
                    <span class="entry-info">${entry.count} × ${entry.length} characters</span>
                    <span class="entry-time">${entry.timestamp}</span>
                </div>
                <div class="history-codes">
                    ${entry.sequences.slice(0, 3).map(item => 
                        `<span class="history-code" onclick="copyToClipboard('${item.sequence}')" title="Click to copy">${item.sequence.substring(0, 15)}${item.sequence.length > 15 ? '...' : ''}</span>`
                    ).join('')}
                    ${entry.sequences.length > 3 ? `<span class="more-codes">+${entry.sequences.length - 3} more</span>` : ''}
                </div>
            </div>
        `).join('');
        
        historyList.innerHTML = historyHTML;
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear the history?')) {
            history = [];
            localStorage.removeItem('charHistory_en');
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