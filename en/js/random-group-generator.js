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
        generations: parseInt(localStorage.getItem('groupStats_generations_en') || '0'),
        totalParticipants: parseInt(localStorage.getItem('groupStats_totalParticipants_en') || '0'),
        totalGroups: parseInt(localStorage.getItem('groupStats_totalGroups_en') || '0')
    };
    
    let history = JSON.parse(localStorage.getItem('groupHistory_en') || '[]');
    
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
            alert('Please add at least 2 participants');
            return;
        }
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Creating groups...</span>';
        
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
                timestamp: new Date().toLocaleString('en-US'),
                participantsCount: participants.length,
                groupsCount: currentGroups.length,
                method: byGroupsRadio.checked ? `${numGroups.value} groups` : `${groupSize.value} per group`,
                groups: currentGroups.map((group, index) => ({
                    name: `Group ${index + 1}`,
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
            generateBtn.innerHTML = '<span class="button-icon">🎲</span><span class="button-text">Divide into Groups</span>';
            
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
        shuffleBtn.innerHTML = '<span class="shuffle-icon">⏳</span><span>Shuffling...</span>';
        
        setTimeout(() => {
            currentParticipants = shuffleArray(currentParticipants);
            currentGroups = createGroups(currentParticipants);
            displayGroups(currentGroups);
            
            shuffleBtn.disabled = false;
            shuffleBtn.innerHTML = '<span class="shuffle-icon">🔄</span><span>Shuffle Again</span>';
        }, 500);
    }
    
    function displayGroups(groups) {
        const groupColors = ['group-1', 'group-2', 'group-3', 'group-4', 'group-5', 'group-6', 'group-7', 'group-8'];
        const memberIcons = ['👤', '👥', '🧑', '👩', '👨', '🧒', '👦', '👧'];
        
        groupsContainer.innerHTML = groups.map((group, index) => `
            <div class="group-card ${groupColors[index % groupColors.length]}">
                <div class="group-title">
                    <span>📋</span>
                    Group ${index + 1} (${group.length} ${getPersonWord(group.length)})
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
        return count === 1 ? 'person' : 'people';
    }
    
    function copyResultToClipboard() {
        let resultText = '📋 GROUP DIVISION RESULT\n';
        resultText += '═'.repeat(40) + '\n\n';
        
        currentGroups.forEach((group, index) => {
            resultText += `📋 Group ${index + 1} (${group.length} ${getPersonWord(group.length)}):\n`;
            group.forEach((member, memberIndex) => {
                resultText += `${memberIndex + 1}. ${member}\n`;
            });
            resultText += '\n';
        });
        
        resultText += `Total participants: ${currentParticipants.length}\n`;
        resultText += `Total groups: ${currentGroups.length}\n`;
        resultText += `Generated: ${new Date().toLocaleString('en-US')}\n`;
        
        navigator.clipboard.writeText(resultText).then(() => {
            copyResult.innerHTML = '<span class="action-icon">✅</span><span>Copied!</span>';
            setTimeout(() => {
                copyResult.innerHTML = '<span class="action-icon">📋</span><span>Copy Result</span>';
            }, 2000);
        }).catch(() => {
            alert('Failed to copy. Please try again.');
        });
    }
    
    function printResults() {
        const printWindow = window.open('', '_blank');
        let printContent = `
            <html>
            <head>
                <title>Group Division</title>
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
                <h1>📋 Group Division Result</h1>
        `;
        
        currentGroups.forEach((group, index) => {
            printContent += `
                <div class="group">
                    <div class="group-title">Group ${index + 1} (${group.length} ${getPersonWord(group.length)})</div>
                    ${group.map((member, memberIndex) => `
                        <div class="member">${memberIndex + 1}. ${member}</div>
                    `).join('')}
                </div>
            `;
        });
        
        printContent += `
                <div class="summary">
                    <strong>Summary:</strong><br>
                    Total participants: ${currentParticipants.length}<br>
                    Total groups: ${currentGroups.length}<br>
                    Generated: ${new Date().toLocaleString('en-US')}
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
            historyList.innerHTML = '<p>History is empty. Create your first division!</p>';
            return;
        }
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-header">
                    <div class="history-title">
                        ${item.participantsCount} participants → ${item.groupsCount} groups
                    </div>
                    <div class="history-time">${item.timestamp}</div>
                </div>
                <div class="history-summary">
                    Method: ${item.method} | 
                    Average size: ${Math.round(item.participantsCount / item.groupsCount * 10) / 10}
                </div>
            </div>
        `).join('');
    }
    
    function saveData() {
        localStorage.setItem('groupStats_generations_en', stats.generations.toString());
        localStorage.setItem('groupStats_totalParticipants_en', stats.totalParticipants.toString());
        localStorage.setItem('groupStats_totalGroups_en', stats.totalGroups.toString());
        localStorage.setItem('groupHistory_en', JSON.stringify(history));
    }
    
    function resetStatistics() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            stats = { generations: 0, totalParticipants: 0, totalGroups: 0 };
            saveData();
            updateStatsDisplay();
        }
    }
    
    function clearHistoryData() {
        if (confirm('Are you sure you want to clear the history?')) {
            history = [];
            localStorage.setItem('groupHistory_en', JSON.stringify(history));
            updateHistoryDisplay();
        }
    }
    
    // Auto-focus on participants list
    participantsList.focus();
});