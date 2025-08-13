document.addEventListener('DOMContentLoaded', function() {
    const participantsList = document.getElementById('participantsList');
    const participantsCount = document.getElementById('participantsCount');
    const byGroupsRadio = document.getElementById('byGroups');
    const bySizeRadio = document.getElementById('bySize');
    const numGroups = document.getElementById('numGroups');
    const groupSize = document.getElementById('groupSize');
    const generateBtn = document.getElementById('generateBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resultSection = document.getElementById('resultSection');
    const groupsContainer = document.getElementById('groupsContainer');
    const copyResult = document.getElementById('copyResult');
    const printResult = document.getElementById('printResult');
    const totalGenerations = document.getElementById('totalGenerations');
    const totalParticipants = document.getElementById('totalParticipants');
    const avgGroupSize = document.getElementById('avgGroupSize');
    const resetStats = document.getElementById('resetStats');
    const historyList = document.getElementById('historyList');
    const clearHistory = document.getElementById('clearHistory');
    
    let currentGroups = [];
    let currentParticipants = [];
    
    // Load statistics and history from localStorage
    let stats = {
        generations: parseInt(localStorage.getItem('groupStats_generations_ua') || '0'),
        totalParticipants: parseInt(localStorage.getItem('groupStats_totalParticipants_ua') || '0'),
        totalGroups: parseInt(localStorage.getItem('groupStats_totalGroups_ua') || '0')
    };
    
    let history = JSON.parse(localStorage.getItem('groupHistory_ua') || '[]');
    
    updateStatsDisplay();
    updateHistoryDisplay();
    
    // Event listeners
    participantsList.addEventListener('input', updateParticipantsCount);
    byGroupsRadio.addEventListener('change', updateInputState);
    bySizeRadio.addEventListener('change', updateInputState);
    generateBtn.addEventListener('click', generateGroups);
    shuffleBtn.addEventListener('click', reshuffleGroups);
    copyResult.addEventListener('click', copyResultToClipboard);
    printResult.addEventListener('click', printResults);
    resetStats.addEventListener('click', resetStatistics);
    clearHistory.addEventListener('click', clearHistoryData);
    
    // Initial setup
    updateInputState();
    updateParticipantsCount();
    
    function updateParticipantsCount() {
        const participants = getParticipantsList();
        participantsCount.textContent = participants.length;
        
        if (participants.length >= 2) {
            generateBtn.disabled = false;
        } else {
            generateBtn.disabled = true;
        }
    }
    
    function updateInputState() {
        if (byGroupsRadio.checked) {
            numGroups.disabled = false;
            groupSize.disabled = true;
        } else {
            numGroups.disabled = true;
            groupSize.disabled = false;
        }
    }
    
    function getParticipantsList() {
        return participantsList.value
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
    }
    
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    function generateGroups() {
        const participants = getParticipantsList();
        
        if (participants.length < 2) {
            alert('Будь ласка, додайте принаймні 2 учасників');
            return;
        }
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Створюю групи...</span>';
        
        setTimeout(() => {
            currentParticipants = shuffleArray(participants);
            currentGroups = createGroups(currentParticipants);
            
            displayGroups(currentGroups);
            
            // Update statistics
            stats.generations++;
            stats.totalParticipants += participants.length;
            stats.totalGroups += currentGroups.length;
            
            // Add to history
            const historyItem = {
                timestamp: new Date().toLocaleString('uk-UA'),
                participantsCount: participants.length,
                groupsCount: currentGroups.length,
                method: byGroupsRadio.checked ? `${numGroups.value} груп` : `по ${groupSize.value} осіб`,
                groups: currentGroups.map((group, index) => ({
                    name: `Група ${index + 1}`,
                    members: group
                }))
            };
            
            history.unshift(historyItem);
            if (history.length > 20) {
                history = history.slice(0, 20); // Keep only last 20
            }
            
            saveData();
            updateStatsDisplay();
            updateHistoryDisplay();
            
            // Show result section and shuffle button
            resultSection.style.display = 'block';
            shuffleBtn.style.display = 'inline-flex';
            
            // Restore button
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="button-icon">🎲</span><span class="button-text">Розподілити на групи</span>';
            
            // Scroll to results
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        }, 800);
    }
    
    function createGroups(participants) {
        let groups = [];
        
        if (byGroupsRadio.checked) {
            // Split by number of groups
            const numGroupsVal = parseInt(numGroups.value);
            const baseSize = Math.floor(participants.length / numGroupsVal);
            const remainder = participants.length % numGroupsVal;
            
            let index = 0;
            for (let i = 0; i < numGroupsVal; i++) {
                const groupSizeVal = baseSize + (i < remainder ? 1 : 0);
                groups.push(participants.slice(index, index + groupSizeVal));
                index += groupSizeVal;
            }
        } else {
            // Split by group size
            const sizeVal = parseInt(groupSize.value);
            for (let i = 0; i < participants.length; i += sizeVal) {
                groups.push(participants.slice(i, i + sizeVal));
            }
        }
        
        return groups;
    }
    
    function reshuffleGroups() {
        if (currentParticipants.length === 0) return;
        
        shuffleBtn.disabled = true;
        shuffleBtn.innerHTML = '<span class="shuffle-icon">⏳</span><span>Перемішую...</span>';
        
        setTimeout(() => {
            currentParticipants = shuffleArray(currentParticipants);
            currentGroups = createGroups(currentParticipants);
            displayGroups(currentGroups);
            
            shuffleBtn.disabled = false;
            shuffleBtn.innerHTML = '<span class="shuffle-icon">🔄</span><span>Перемішати знову</span>';
        }, 500);
    }
    
    function displayGroups(groups) {
        const groupColors = ['group-1', 'group-2', 'group-3', 'group-4', 'group-5', 'group-6', 'group-7', 'group-8'];
        const memberIcons = ['👤', '👥', '🧑', '👩', '👨', '🧒', '👦', '👧'];
        
        groupsContainer.innerHTML = groups.map((group, index) => `
            <div class="group-card ${groupColors[index % groupColors.length]}">
                <div class="group-title">
                    <span>📋</span>
                    Група ${index + 1} (${group.length} ${getPersonWord(group.length)})
                </div>
                <ul class="group-members">
                    ${group.map((member, memberIndex) => `
                        <li>
                            <span class="member-icon">${memberIcons[memberIndex % memberIcons.length]}</span>
                            ${member}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    }
    
    function getPersonWord(count) {
        if (count === 1) return 'особа';
        if (count >= 2 && count <= 4) return 'особи';
        return 'осіб';
    }
    
    function copyResultToClipboard() {
        let resultText = '📋 РЕЗУЛЬТАТ РОЗПОДІЛУ НА ГРУПИ\n';
        resultText += '═'.repeat(40) + '\n\n';
        
        currentGroups.forEach((group, index) => {
            resultText += `📋 Група ${index + 1} (${group.length} ${getPersonWord(group.length)}):\n`;
            group.forEach((member, memberIndex) => {
                resultText += `${memberIndex + 1}. ${member}\n`;
            });
            resultText += '\n';
        });
        
        resultText += `Всього учасників: ${currentParticipants.length}\n`;
        resultText += `Всього груп: ${currentGroups.length}\n`;
        resultText += `Згенеровано: ${new Date().toLocaleString('uk-UA')}\n`;
        
        navigator.clipboard.writeText(resultText).then(() => {
            copyResult.innerHTML = '<span class="action-icon">✅</span><span>Скопійовано!</span>';
            setTimeout(() => {
                copyResult.innerHTML = '<span class="action-icon">📋</span><span>Копіювати результат</span>';
            }, 2000);
        }).catch(() => {
            alert('Не вдалося скопіювати. Спробуйте ще раз.');
        });
    }
    
    function printResults() {
        const printWindow = window.open('', '_blank');
        let printContent = `
            <html>
            <head>
                <title>Розподіл на групи</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; text-align: center; }
                    .group { margin: 20px 0; padding: 15px; border: 2px solid #ddd; border-radius: 8px; }
                    .group-title { font-weight: bold; font-size: 18px; margin-bottom: 10px; }
                    .member { margin: 5px 0; }
                    .summary { margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                </style>
            </head>
            <body>
                <h1>📋 Результат розподілу на групи</h1>
        `;
        
        currentGroups.forEach((group, index) => {
            printContent += `
                <div class="group">
                    <div class="group-title">Група ${index + 1} (${group.length} ${getPersonWord(group.length)})</div>
                    ${group.map((member, memberIndex) => `
                        <div class="member">${memberIndex + 1}. ${member}</div>
                    `).join('')}
                </div>
            `;
        });
        
        printContent += `
                <div class="summary">
                    <strong>Підсумок:</strong><br>
                    Всього учасників: ${currentParticipants.length}<br>
                    Всього груп: ${currentGroups.length}<br>
                    Згенеровано: ${new Date().toLocaleString('uk-UA')}
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }
    
    function updateStatsDisplay() {
        totalGenerations.textContent = stats.generations;
        totalParticipants.textContent = stats.totalParticipants;
        
        const avgSize = stats.totalGroups > 0 ? 
            Math.round(stats.totalParticipants / stats.totalGroups * 10) / 10 : 0;
        avgGroupSize.textContent = avgSize;
    }
    
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historyList.innerHTML = '<p>Історія порожня. Створіть перший розподіл!</p>';
            return;
        }
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-header">
                    <div class="history-title">
                        ${item.participantsCount} учасників → ${item.groupsCount} груп
                    </div>
                    <div class="history-time">${item.timestamp}</div>
                </div>
                <div class="history-summary">
                    Метод: ${item.method} | 
                    Середній розмір: ${Math.round(item.participantsCount / item.groupsCount * 10) / 10}
                </div>
            </div>
        `).join('');
    }
    
    function saveData() {
        localStorage.setItem('groupStats_generations_ua', stats.generations.toString());
        localStorage.setItem('groupStats_totalParticipants_ua', stats.totalParticipants.toString());
        localStorage.setItem('groupStats_totalGroups_ua', stats.totalGroups.toString());
        localStorage.setItem('groupHistory_ua', JSON.stringify(history));
    }
    
    function resetStatistics() {
        if (confirm('Ви впевнені, що хочете скинути всю статистику?')) {
            stats = { generations: 0, totalParticipants: 0, totalGroups: 0 };
            saveData();
            updateStatsDisplay();
        }
    }
    
    function clearHistoryData() {
        if (confirm('Ви впевнені, що хочете очистити історію?')) {
            history = [];
            localStorage.setItem('groupHistory_ua', JSON.stringify(history));
            updateHistoryDisplay();
        }
    }
    
    // Auto-focus on participants list
    participantsList.focus();
});