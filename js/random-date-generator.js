document.addEventListener('DOMContentLoaded', function() {
    const dateFormatSelect = document.getElementById('dateFormat');
    const dateCountInput = document.getElementById('dateCount');
    const startYearInput = document.getElementById('startYear');
    const endYearInput = document.getElementById('endYear');
    const dateFilterSelect = document.getElementById('dateFilter');
    const includeTimeCheckbox = document.getElementById('includeTime');
    const generateBtn = document.getElementById('generateDates');
    const copyAllBtn = document.getElementById('copyAllDates');
    const clearHistoryBtn = document.getElementById('clearDateHistory');
    const resultSection = document.getElementById('dateResult');
    const generatedDates = document.getElementById('generatedDates');
    const generationInfo = document.getElementById('dateGenerationInfo');
    const historySection = document.getElementById('dateHistorySection');
    const historyList = document.getElementById('dateHistoryList');
    
    // Load history from localStorage
    let history = JSON.parse(localStorage.getItem('dateHistory_ua') || '[]');
    
    // Ukrainian month names
    const monthNames = [
        'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
        'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];
    
    // Event listeners
    generateBtn.addEventListener('click', generateDates);
    copyAllBtn.addEventListener('click', copyAllDates);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Validation event listeners
    startYearInput.addEventListener('change', validateYears);
    endYearInput.addEventListener('change', validateYears);
    dateFormatSelect.addEventListener('change', updateTimeCheckbox);
    
    // Initialize display
    updateHistoryDisplay();
    updateTimeCheckbox();
    
    function validateYears() {
        const startYear = parseInt(startYearInput.value);
        const endYear = parseInt(endYearInput.value);
        
        if (startYear > endYear) {
            endYearInput.value = startYear;
        }
    }
    
    function updateTimeCheckbox() {
        const format = dateFormatSelect.value;
        if (format === 'with-time') {
            includeTimeCheckbox.checked = true;
            includeTimeCheckbox.disabled = true;
        } else {
            includeTimeCheckbox.disabled = false;
        }
    }
    
    function generateRandomDate(startYear, endYear) {
        const start = new Date(startYear, 0, 1);
        const end = new Date(endYear, 11, 31);
        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(randomTime);
    }
    
    function isWeekday(date) {
        const day = date.getDay();
        return day >= 1 && day <= 5; // Monday to Friday
    }
    
    function isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    }
    
    function formatDate(date, format, includeTime = false) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        let formattedDate = '';
        
        switch (format) {
            case 'dd.mm.yyyy':
                formattedDate = `${day}.${month}.${year}`;
                break;
            case 'dd/mm/yyyy':
                formattedDate = `${day}/${month}/${year}`;
                break;
            case 'mm/dd/yyyy':
                formattedDate = `${month}/${day}/${year}`;
                break;
            case 'yyyy-mm-dd':
                formattedDate = `${year}-${month}-${day}`;
                break;
            case 'full-text':
                formattedDate = `${parseInt(day)} ${monthNames[date.getMonth()]} ${year} року`;
                break;
            case 'with-time':
                formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
                break;
        }
        
        if (includeTime && format !== 'with-time' && format !== 'full-text') {
            formattedDate += ` ${hours}:${minutes}:${seconds}`;
        }
        
        return formattedDate;
    }
    
    function generateDates() {
        const format = dateFormatSelect.value;
        const count = parseInt(dateCountInput.value);
        const startYear = parseInt(startYearInput.value);
        const endYear = parseInt(endYearInput.value);
        const filter = dateFilterSelect.value;
        const includeTime = includeTimeCheckbox.checked;
        
        if (count < 1 || count > 100) {
            alert('Кількість дат повинна бути від 1 до 100');
            return;
        }
        
        if (startYear > endYear) {
            alert('Початковий рік не може бути більшим за кінцевий');
            return;
        }
        
        const dates = [];
        const timestamp = new Date().toLocaleString('uk-UA');
        const today = new Date();
        
        // Generate dates with retry logic for filters
        let attempts = 0;
        while (dates.length < count && attempts < count * 10) {
            const randomDate = generateRandomDate(startYear, endYear);
            let isValid = true;
            
            // Apply filters
            switch (filter) {
                case 'weekdays':
                    isValid = isWeekday(randomDate);
                    break;
                case 'weekends':
                    isValid = isWeekend(randomDate);
                    break;
                case 'past':
                    isValid = randomDate < today;
                    break;
                case 'future':
                    isValid = randomDate > today;
                    break;
            }
            
            if (isValid) {
                const formattedDate = formatDate(randomDate, format, includeTime);
                dates.push({
                    formatted: formattedDate,
                    original: randomDate,
                    format: format
                });
            }
            
            attempts++;
        }
        
        if (dates.length === 0) {
            alert('Не вдалося згенерувати дати з обраними фільтрами. Спробуйте розширити діапазон.');
            return;
        }
        
        // Display results
        displayResults(dates, timestamp);
        
        // Add to history
        addToHistory(dates, timestamp, format);
        
        // Show result section
        resultSection.style.display = 'block';
    }
    
    function displayResults(dates, timestamp) {
        const datesList = dates.map(item => 
            `<div class="code-item">
                <span class="code-value">${item.formatted}</span>
                <span class="code-format">${getFormatName(item.format)}</span>
                <button class="copy-btn" onclick="copyToClipboard('${item.formatted}')">📋</button>
            </div>`
        ).join('');
        
        generatedDates.innerHTML = `
            <div class="codes-grid">
                ${datesList}
            </div>
        `;
        
        generationInfo.innerHTML = `
            <div class="info-row">
                <span>📊 Згенеровано: <strong>${dates.length}</strong> дат</span>
                <span>🕒 Час: <strong>${timestamp}</strong></span>
            </div>
        `;
    }
    
    function getFormatName(format) {
        const formatNames = {
            'dd.mm.yyyy': 'Український',
            'dd/mm/yyyy': 'Європейський',
            'mm/dd/yyyy': 'Американський',
            'yyyy-mm-dd': 'ISO 8601',
            'full-text': 'Повний текст',
            'with-time': 'З часом'
        };
        return formatNames[format] || format;
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Скопійовано: ' + text);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Скопійовано: ' + text);
        });
    }
    
    function copyAllDates() {
        const dateElements = document.querySelectorAll('.code-value');
        if (dateElements.length === 0) {
            alert('Спочатку згенеруйте дати');
            return;
        }
        
        const allDates = Array.from(dateElements).map(el => el.textContent).join('\n');
        copyToClipboard(allDates);
    }
    
    function addToHistory(dates, timestamp, format) {
        const historyEntry = {
            dates: dates.slice(0, 10), // Store only first 10 for display
            timestamp: timestamp,
            count: dates.length,
            format: getFormatName(format)
        };
        
        history.unshift(historyEntry);
        
        // Keep only last 20 entries
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        localStorage.setItem('dateHistory_ua', JSON.stringify(history));
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
                    <span class="entry-info">${entry.count} дат (${entry.format})</span>
                    <span class="entry-time">${entry.timestamp}</span>
                </div>
                <div class="history-codes">
                    ${entry.dates.slice(0, 5).map(item => 
                        `<span class="history-code" onclick="copyToClipboard('${item.formatted}')" title="Клікніть для копіювання">${item.formatted}</span>`
                    ).join('')}
                    ${entry.dates.length > 5 ? `<span class="more-codes">+${entry.dates.length - 5} ще</span>` : ''}
                </div>
            </div>
        `).join('');
        
        historyList.innerHTML = historyHTML;
    }
    
    function clearHistory() {
        if (confirm('Ви впевнені, що хочете очистити історію?')) {
            history = [];
            localStorage.removeItem('dateHistory_ua');
            updateHistoryDisplay();
            showNotification('Історію очищено');
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