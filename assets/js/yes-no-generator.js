document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const questionInput = document.getElementById('questionInput');
    const magicBall = document.querySelector('.ball-surface');
    const ballAnswer = document.getElementById('ballAnswer');
    const resultText = document.getElementById('resultText');
    const yesCount = document.getElementById('yesCount');
    const noCount = document.getElementById('noCount');
    const totalCount = document.getElementById('totalCount');
    const resetStats = document.getElementById('resetStats');
    
    // Load statistics from localStorage
    let stats = {
        yes: parseInt(localStorage.getItem('yesNoStats_yes') || '0'),
        no: parseInt(localStorage.getItem('yesNoStats_no') || '0'),
        total: parseInt(localStorage.getItem('yesNoStats_total') || '0')
    };
    
    updateStatsDisplay();
    
    generateBtn.addEventListener('click', generateAnswer);
    resetStats.addEventListener('click', resetStatistics);
    questionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateAnswer();
        }
    });
    
    function generateAnswer() {
        const question = questionInput.value.trim();
        
        if (!question) {
            alert('Будь ласка, введіть питання перед генерацією відповіді');
            questionInput.focus();
            return;
        }
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Думаю...</span>';
        
        // Add shaking animation
        magicBall.classList.add('shaking');
        ballAnswer.textContent = '...';
        
        // Generate random answer after animation
        setTimeout(() => {
            const isYes = Math.random() < 0.5;
            const answer = isYes ? 'ТАК' : 'НІ';
            const answerClass = isYes ? 'yes' : 'no';
            
            // Update ball answer
            ballAnswer.textContent = answer;
            
            // Update result text
            resultText.className = `result-text ${answerClass}`;
            resultText.innerHTML = `
                <p><strong>Питання:</strong> ${question}</p>
                <p><strong>Відповідь:</strong> <span style="font-size: 1.5em; ${isYes ? 'color: #28a745;' : 'color: #dc3545;'}">${answer}</span></p>
            `;
            
            // Update statistics
            stats.total++;
            if (isYes) {
                stats.yes++;
            } else {
                stats.no++;
            }
            
            saveStats();
            updateStatsDisplay();
            
            // Remove animation and restore button
            magicBall.classList.remove('shaking');
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="button-icon">🎯</span><span class="button-text">Отримати відповідь</span>';
            
            // Scroll to result
            resultText.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        }, 1000);
    }
    
    function updateStatsDisplay() {
        yesCount.textContent = stats.yes;
        noCount.textContent = stats.no;
        totalCount.textContent = stats.total;
    }
    
    function saveStats() {
        localStorage.setItem('yesNoStats_yes', stats.yes.toString());
        localStorage.setItem('yesNoStats_no', stats.no.toString());
        localStorage.setItem('yesNoStats_total', stats.total.toString());
    }
    
    function resetStatistics() {
        if (confirm('Ви впевнені, що хочете скинути статистику?')) {
            stats = { yes: 0, no: 0, total: 0 };
            saveStats();
            updateStatsDisplay();
            
            // Reset ball and result
            ballAnswer.textContent = '?';
            resultText.className = 'result-text';
            resultText.innerHTML = '<p>Задайте питання та натисніть кнопку!</p>';
        }
    }
    
    // Add some fun interactions
    magicBall.addEventListener('click', function() {
        if (!generateBtn.disabled && questionInput.value.trim()) {
            generateAnswer();
        }
    });
    
    // Auto-focus on question input
    questionInput.focus();
});