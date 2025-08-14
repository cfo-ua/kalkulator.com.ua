document.addEventListener('DOMContentLoaded', function() {
    const macFormatSelect = document.getElementById('macFormat');
    const macCountInput = document.getElementById('macCount');
    const addressTypeSelect = document.getElementById('addressType');
    const vendorSelect = document.getElementById('vendorSelect');
    const caseFormatSelect = document.getElementById('caseFormat');
    const includeInfoCheckbox = document.getElementById('includeInfo');
    const generateBtn = document.getElementById('generateMACs');
    const quickGenerateBtn = document.getElementById('quickGenerate');
    const exportBtn = document.getElementById('exportMACs');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const result = document.getElementById('result');
    const generatedMACs = document.getElementById('generatedMACs');
    const generationInfo = document.getElementById('generationInfo');
    const validationSection = document.getElementById('validationSection');
    const validationResults = document.getElementById('validationResults');
    const vendorSection = document.getElementById('vendorSection');
    const vendorInfo = document.getElementById('vendorInfo');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    
    // Load history from localStorage
    let history = JSON.parse(localStorage.getItem('randomMACHistory_ua') || '[]');
    let currentMACs = [];
    
    // Vendor OUI database
    const vendorOUIs = {
        cisco: [
            { oui: '00:1B:0D', name: 'Cisco Systems, Inc.' },
            { oui: '00:26:CA', name: 'Cisco Systems, Inc.' },
            { oui: '24:B6:57', name: 'Cisco Systems, Inc.' },
            { oui: '00:1E:F7', name: 'Cisco Systems, Inc.' },
            { oui: '00:23:04', name: 'Cisco Systems, Inc.' }
        ],
        intel: [
            { oui: '00:15:17', name: 'Intel Corporation' },
            { oui: '00:1E:67', name: 'Intel Corporation' },
            { oui: 'AC:2B:6E', name: 'Intel Corporation' },
            { oui: '00:21:5D', name: 'Intel Corporation' },
            { oui: '00:22:FB', name: 'Intel Corporation' }
        ],
        apple: [
            { oui: '00:1F:F3', name: 'Apple, Inc.' },
            { oui: '00:25:BC', name: 'Apple, Inc.' },
            { oui: '28:CF:E9', name: 'Apple, Inc.' },
            { oui: '3C:07:54', name: 'Apple, Inc.' },
            { oui: '40:A6:D9', name: 'Apple, Inc.' }
        ],
        dell: [
            { oui: '00:14:22', name: 'Dell Inc.' },
            { oui: 'B8:2A:72', name: 'Dell Inc.' },
            { oui: 'B4:B5:2F', name: 'Dell Inc.' },
            { oui: '00:1A:A0', name: 'Dell Inc.' },
            { oui: '00:21:70', name: 'Dell Inc.' }
        ],
        hp: [
            { oui: '00:1A:4B', name: 'Hewlett Packard' },
            { oui: '00:26:55', name: 'Hewlett Packard' },
            { oui: '70:10:6F', name: 'Hewlett Packard' },
            { oui: '00:1F:29', name: 'Hewlett Packard' },
            { oui: '00:23:7D', name: 'Hewlett Packard' }
        ],
        microsoft: [
            { oui: '00:15:5D', name: 'Microsoft Corporation' },
            { oui: '00:17:FA', name: 'Microsoft Corporation' },
            { oui: '7C:1E:52', name: 'Microsoft Corporation' }
        ],
        samsung: [
            { oui: '00:15:99', name: 'Samsung Electronics' },
            { oui: '00:1D:25', name: 'Samsung Electronics' },
            { oui: '34:BE:00', name: 'Samsung Electronics' },
            { oui: '78:59:5E', name: 'Samsung Electronics' }
        ],
        vmware: [
            { oui: '00:50:56', name: 'VMware, Inc.' },
            { oui: '00:0C:29', name: 'VMware, Inc.' },
            { oui: '00:05:69', name: 'VMware, Inc.' }
        ]
    };
    
    // Event listeners
    generateBtn.addEventListener('click', generateMACs);
    quickGenerateBtn.addEventListener('click', quickGenerate);
    exportBtn.addEventListener('click', exportMACs);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Initialize display
    updateHistoryDisplay();
    validateInputs();
    
    function validateInputs() {
        const count = parseInt(macCountInput.value);
        const isValid = count >= 1 && count <= 100;
        
        generateBtn.disabled = !isValid;
        quickGenerateBtn.disabled = !isValid;
        
        if (!isValid) {
            showError('Кількість адрес повинна бути від 1 до 100');
        } else {
            hideError();
        }
    }
    
    function generateMACs() {
        const format = macFormatSelect.value;
        const count = parseInt(macCountInput.value);
        const addressType = addressTypeSelect.value;
        const vendor = vendorSelect.value;
        const caseFormat = caseFormatSelect.value;
        
        if (!validateInputs()) return;
        
        const macs = [];
        for (let i = 0; i < count; i++) {
            const macData = generateSingleMAC(addressType, vendor);
            const formattedMAC = formatMAC(macData.address, format, caseFormat);
            
            macs.push({
                original: macData.address,
                formatted: formattedMAC,
                vendor: macData.vendor,
                oui: macData.oui,
                type: macData.type,
                isLocal: macData.isLocal,
                isMulticast: macData.isMulticast,
                timestamp: new Date().toISOString()
            });
        }
        
        currentMACs = macs;
        displayResults(macs);
        addToHistory(macs);
        validateMACs(macs);
        if (includeInfoCheckbox.checked) {
            showVendorInfo(macs);
        }
        exportBtn.style.display = 'inline-block';
    }
    
    function quickGenerate() {
        // Швидка генерація з популярними налаштуваннями
        macFormatSelect.value = 'colon';
        macCountInput.value = 5;
        addressTypeSelect.value = 'unicast';
        vendorSelect.value = 'random';
        caseFormatSelect.value = 'uppercase';
        includeInfoCheckbox.checked = true;
        
        generateMACs();
    }
    
    function generateSingleMAC(addressType, vendor) {
        let oui, vendorInfo;
        
        // Генеруємо OUI (перші 3 байти)
        if (vendor === 'random') {
            oui = generateRandomOUI(addressType);
            vendorInfo = { name: 'Випадковий виробник', oui: oui };
        } else if (vendor === 'local') {
            // Локально адмініструвана адреса (2-й біт = 1)
            oui = generateLocalOUI();
            vendorInfo = { name: 'Локально адмініструвана', oui: oui };
        } else if (vendorOUIs[vendor]) {
            const vendorData = vendorOUIs[vendor][Math.floor(Math.random() * vendorOUIs[vendor].length)];
            oui = vendorData.oui.replace(/[:-]/g, '').toLowerCase();
            vendorInfo = vendorData;
        } else {
            oui = generateRandomOUI(addressType);
            vendorInfo = { name: 'Невідомий виробник', oui: oui };
        }
        
        // Генеруємо останні 3 байти
        const nic = generateRandomBytes(3);
        
        const fullMAC = oui + nic;
        
        // Аналіз типу адреси
        const firstByte = parseInt(fullMAC.substring(0, 2), 16);
        const isMulticast = (firstByte & 0x01) === 1;
        const isLocal = (firstByte & 0x02) === 2;
        
        let type = 'Unicast';
        if (isMulticast) type = 'Multicast';
        if (isLocal) type = 'Локальна';
        
        return {
            address: fullMAC,
            vendor: vendorInfo,
            oui: oui,
            type: type,
            isLocal: isLocal,
            isMulticast: isMulticast
        };
    }
    
    function generateRandomOUI(addressType) {
        let firstByte = Math.floor(Math.random() * 256);
        
        // Налаштування типу адреси
        if (addressType === 'unicast') {
            firstByte = firstByte & 0xFE; // Очищаємо multicast біт
        } else if (addressType === 'multicast') {
            firstByte = firstByte | 0x01; // Встановлюємо multicast біт
        } else if (addressType === 'local') {
            firstByte = firstByte | 0x02; // Встановлюємо local біт
            firstByte = firstByte & 0xFE; // Очищаємо multicast біт
        }
        
        const secondByte = Math.floor(Math.random() * 256);
        const thirdByte = Math.floor(Math.random() * 256);
        
        return [firstByte, secondByte, thirdByte]
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    function generateLocalOUI() {
        // Генеруємо локально адмініструвану адресу
        let firstByte = Math.floor(Math.random() * 256);
        firstByte = firstByte | 0x02; // Встановлюємо local біт
        firstByte = firstByte & 0xFE; // Очищаємо multicast біт
        
        const secondByte = Math.floor(Math.random() * 256);
        const thirdByte = Math.floor(Math.random() * 256);
        
        return [firstByte, secondByte, thirdByte]
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    function generateRandomBytes(count) {
        const array = new Uint8Array(count);
        crypto.getRandomValues(array);
        return Array.from(array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    function formatMAC(mac, format, caseFormat) {
        let formatted = mac;
        
        // Застосовуємо регістр
        if (caseFormat === 'uppercase') {
            formatted = formatted.toUpperCase();
        } else if (caseFormat === 'lowercase') {
            formatted = formatted.toLowerCase();
        } else if (caseFormat === 'mixed') {
            formatted = formatted.split('').map(c => 
                Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()
            ).join('');
        }
        
        // Застосовуємо формат
        switch (format) {
            case 'colon':
                return formatted.match(/.{2}/g).join(':');
            case 'dash':
                return formatted.match(/.{2}/g).join('-');
            case 'dot':
                return formatted.match(/.{4}/g).join('.');
            case 'bare':
                return formatted;
            case 'array':
                const bytes = formatted.match(/.{2}/g);
                return '{' + bytes.map(b => '0x' + b).join(', ') + '}';
            default:
                return formatted;
        }
    }
    
    function displayResults(macs) {
        generatedMACs.innerHTML = macs.map((macObj, index) => `
            <div class="mac-item" data-mac="${macObj.formatted}">
                <div class="mac-header">
                    <span>MAC адреса ${index + 1}</span>
                    <div>
                        <span class="vendor-badge">${macObj.vendor.name}</span>
                        <span class="address-type-badge address-type-${macObj.type.toLowerCase()}">${macObj.type}</span>
                    </div>
                </div>
                <div class="mac-value">${macObj.formatted}</div>
                ${includeInfoCheckbox.checked ? `
                    <div class="mac-details">
                        <div class="oui-breakdown">
                            OUI: ${formatMAC(macObj.oui, macFormatSelect.value, caseFormatSelect.value)} 
                            (${macObj.vendor.name})
                        </div>
                        <div>
                            • ${macObj.isMulticast ? 'Multicast' : 'Unicast'} адреса
                            • ${macObj.isLocal ? 'Локально адмініструвана' : 'Глобально унікальна'}
                        </div>
                    </div>
                ` : ''}
                <div class="mac-actions">
                    <button class="mac-btn" onclick="copyMAC('${macObj.formatted}')">📋 Копіювати</button>
                    <button class="mac-btn" onclick="validateSingleMAC('${macObj.formatted}')">✅ Валідувати</button>
                    <button class="mac-btn" onclick="analyzeMAC('${macObj.original}')">🔍 Аналіз</button>
                </div>
                <div class="copy-notification">Скопійовано!</div>
            </div>
        `).join('');
        
        generationInfo.textContent = `Згенеровано ${macs.length} MAC адрес у форматі ${macFormatSelect.value}. ` +
            `Типи: ${getTypeSummary(macs)}.`;
        
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth' });
    }
    
    function getTypeSummary(macs) {
        const types = {};
        macs.forEach(mac => {
            types[mac.type] = (types[mac.type] || 0) + 1;
        });
        
        return Object.entries(types)
            .map(([type, count]) => `${count} ${type}`)
            .join(', ');
    }
    
    function validateMACs(macs) {
        const results = macs.map((macObj, index) => {
            const isValid = validateMACFormat(macObj.formatted);
            return {
                index: index + 1,
                mac: macObj.formatted,
                original: macObj.original,
                isValid: isValid,
                vendor: macObj.vendor.name,
                type: macObj.type
            };
        });
        
        validationResults.innerHTML = results.map(result => `
            <div class="vendor-info-card">
                <div style="font-weight: bold; margin-bottom: 0.25rem;">
                    ${result.isValid ? '✅' : '❌'} MAC адреса ${result.index}
                </div>
                <div style="font-family: 'Courier New', monospace; font-size: 1rem; margin: 0.5rem 0;">
                    ${result.mac}
                </div>
                <div style="font-size: 0.9rem; color: #666;">
                    Вендор: ${result.vendor} • Тип: ${result.type}
                    ${result.isValid ? ' • Формат правильний' : ' • Помилка формату'}
                </div>
            </div>
        `).join('');
        
        validationSection.style.display = 'block';
    }
    
    function validateMACFormat(mac) {
        // Різні формати MAC адрес
        const patterns = [
            /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, // xx:xx:xx:xx:xx:xx або xx-xx-xx-xx-xx-xx
            /^([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$/, // xxxx.xxxx.xxxx
            /^[0-9A-Fa-f]{12}$/, // xxxxxxxxxxxx
            /^{(0x[0-9A-Fa-f]{2},\s*){5}0x[0-9A-Fa-f]{2}}$/ // {0xxx, 0xxx, ...}
        ];
        
        return patterns.some(pattern => pattern.test(mac));
    }
    
    function showVendorInfo(macs) {
        const vendorCounts = {};
        const ouiInfo = {};
        
        macs.forEach(mac => {
            const vendor = mac.vendor.name;
            vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
            
            if (!ouiInfo[mac.oui]) {
                ouiInfo[mac.oui] = {
                    vendor: vendor,
                    count: 0
                };
            }
            ouiInfo[mac.oui].count++;
        });
        
        vendorInfo.innerHTML = `
            <div class="vendor-info-card">
                <h6>📊 Статистика вендорів</h6>
                ${Object.entries(vendorCounts).map(([vendor, count]) => 
                    `<div>${vendor}: <strong>${count}</strong> адрес</div>`
                ).join('')}
            </div>
            
            <div class="vendor-info-card">
                <h6>🔧 OUI інформація</h6>
                ${Object.entries(ouiInfo).map(([oui, info]) => `
                    <div style="margin: 0.5rem 0;">
                        <strong>${formatMAC(oui, 'colon', 'uppercase')}</strong> — ${info.vendor}
                        <div style="font-size: 0.8rem; color: #666;">Використано: ${info.count} раз</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        vendorSection.style.display = 'block';
    }
    
    function exportMACs() {
        if (currentMACs.length === 0) return;
        
        const exportData = currentMACs.map(mac => ({
            address: mac.formatted,
            vendor: mac.vendor.name,
            oui: mac.oui,
            type: mac.type,
            isLocal: mac.isLocal,
            isMulticast: mac.isMulticast,
            timestamp: mac.timestamp
        }));
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mac-addresses-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function addToHistory(macs) {
        const entry = {
            timestamp: new Date().toLocaleString('uk-UA'),
            format: macFormatSelect.value,
            count: macs.length,
            vendor: vendorSelect.value,
            addressType: addressTypeSelect.value,
            macs: macs.slice(0, 3) // Зберігаємо тільки перші 3 для економії місця
        };
        
        history.unshift(entry);
        history = history.slice(0, 50); // Зберігаємо останні 50 записів
        localStorage.setItem('randomMACHistory_ua', JSON.stringify(history));
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }
        
        historyList.innerHTML = history.slice(0, 10).map((entry, index) => `
            <div class="vendor-info-card">
                <div style="font-weight: bold; margin-bottom: 0.25rem;">
                    ${entry.timestamp} - ${entry.count} адрес
                </div>
                <div style="font-family: 'Courier New', monospace; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    ${entry.macs[0].formatted}${entry.count > 1 ? ` (+${entry.count - 1} більше)` : ''}
                </div>
                <div style="font-size: 0.8rem; color: #666;">
                    Формат: ${entry.format} • Вендор: ${entry.vendor} • Тип: ${entry.addressType}
                </div>
            </div>
        `).join('');
        
        historySection.style.display = 'block';
    }
    
    function clearHistory() {
        if (confirm('Ви впевнені, що хочете очистити всю історію?')) {
            history = [];
            localStorage.removeItem('randomMACHistory_ua');
            updateHistoryDisplay();
        }
    }
    
    function showError(message) {
        // Показати помилку
    }
    
    function hideError() {
        // Приховати помилку
    }
    
    // Глобальні функції для кнопок
    window.copyMAC = function(mac) {
        navigator.clipboard.writeText(mac).then(() => {
            const notification = event.target.closest('.mac-item').querySelector('.copy-notification');
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 2000);
        });
    };
    
    window.validateSingleMAC = function(mac) {
        const isValid = validateMACFormat(mac);
        alert(isValid ? 'MAC адреса має правильний формат!' : 'MAC адреса має неправильний формат!');
    };
    
    window.analyzeMAC = function(mac) {
        const bytes = mac.match(/.{2}/g) || [];
        const firstByte = parseInt(bytes[0], 16);
        
        const isMulticast = (firstByte & 0x01) === 1;
        const isLocal = (firstByte & 0x02) === 2;
        
        const oui = bytes.slice(0, 3).join(':').toUpperCase();
        const nic = bytes.slice(3, 6).join(':').toUpperCase();
        
        alert(`Аналіз MAC адреси:\n\n` +
              `OUI (Виробник): ${oui}\n` +
              `NIC (Інтерфейс): ${nic}\n\n` +
              `Тип адреси: ${isMulticast ? 'Multicast' : 'Unicast'}\n` +
              `Адміністрування: ${isLocal ? 'Локальне' : 'Глобальне'}\n\n` +
              `Перший байт: 0x${bytes[0].toUpperCase()} (${firstByte})\n` +
              `Біт 0 (U/L): ${isMulticast ? '1 (Multicast)' : '0 (Unicast)'}\n` +
              `Біт 1 (G/L): ${isLocal ? '1 (Local)' : '0 (Global)'}`);
    };
    
    // Валідація в реальному часі
    macCountInput.addEventListener('input', validateInputs);
    macCountInput.addEventListener('change', validateInputs);
});