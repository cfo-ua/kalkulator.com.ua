document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('debt-calculator-form');
    const resultsDiv = document.getElementById('debt-results');
    const addDebtBtn = document.getElementById('add-debt-btn');
    const removeDebtBtn = document.getElementById('remove-debt-btn');
    const debtInputs = document.getElementById('debt-inputs');
    
    let debtCount = 1;

    // Add debt functionality
    addDebtBtn.addEventListener('click', function() {
        if (debtCount < 10) { // Limit to 10 debts
            debtCount++;
            addDebtInput(debtCount);
            updateRemoveButton();
        }
    });

    removeDebtBtn.addEventListener('click', function() {
        if (debtCount > 1) {
            const lastDebt = document.querySelector(`#debt-inputs .debt-input-group:last-child`);
            lastDebt.remove();
            debtCount--;
            updateRemoveButton();
        }
    });

    function updateRemoveButton() {
        removeDebtBtn.style.display = debtCount > 1 ? 'inline-block' : 'none';
    }

    function addDebtInput(number) {
        const debtGroup = document.createElement('div');
        debtGroup.className = 'debt-input-group';
        debtGroup.innerHTML = `
            <h4>Борг #${number}</h4>
            <label for="debt-name-${number}">Назва боргу:</label>
            <input type="text" id="debt-name-${number}" placeholder="Кредитна картка" required>
            
            <label for="debt-balance-${number}">Поточний баланс (грн):</label>
            <input type="number" id="debt-balance-${number}" min="0" step="100" placeholder="25000" required>
            
            <label for="debt-rate-${number}">Процентна ставка (% річних):</label>
            <input type="number" id="debt-rate-${number}" min="0" max="100" step="0.1" placeholder="35" required>
            
            <label for="debt-minimum-${number}">Мінімальний платіж (грн):</label>
            <input type="number" id="debt-minimum-${number}" min="0" step="50" placeholder="1250" required>
        `;
        debtInputs.appendChild(debtGroup);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateDebtPayoff();
    });

    function calculateDebtPayoff() {
        // Collect debt data
        const debts = [];
        for (let i = 1; i <= debtCount; i++) {
            const name = document.getElementById(`debt-name-${i}`).value;
            const balance = parseFloat(document.getElementById(`debt-balance-${i}`).value);
            const rate = parseFloat(document.getElementById(`debt-rate-${i}`).value) / 100 / 12; // Monthly rate
            const minimum = parseFloat(document.getElementById(`debt-minimum-${i}`).value);
            
            if (name && balance && rate >= 0 && minimum) {
                debts.push({
                    id: i,
                    name: name,
                    balance: balance,
                    originalBalance: balance,
                    rate: rate,
                    annualRate: rate * 12 * 100,
                    minimum: minimum
                });
            }
        }

        if (debts.length === 0) {
            alert('Будь ласка, додайте хоча б один борг');
            return;
        }

        const extraPayment = parseFloat(document.getElementById('extra-payment').value) || 0;

        // Calculate both strategies
        const snowballResult = calculateStrategy('snowball', debts, extraPayment);
        const avalancheResult = calculateStrategy('avalanche', debts, extraPayment);

        // Update results
        updateResults(snowballResult, avalancheResult);
        createPayoffChart(snowballResult, avalancheResult);
        createDetailedSchedule(snowballResult, avalancheResult);

        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function calculateStrategy(strategy, debts, extraPayment) {
        // Make a copy of debts
        let debtsCopy = debts.map(debt => ({...debt}));
        
        // Sort debts based on strategy
        if (strategy === 'snowball') {
            debtsCopy.sort((a, b) => a.balance - b.balance);
        } else {
            debtsCopy.sort((a, b) => b.rate - a.rate);
        }

        const payoffOrder = [];
        const monthlyDetails = [];
        let month = 0;
        let totalInterest = 0;
        let totalPaid = 0;

        while (debtsCopy.some(debt => debt.balance > 0)) {
            month++;
            let monthlyInterest = 0;
            let monthlyPrincipal = 0;
            let remainingExtra = extraPayment;

            // Apply minimum payments and interest
            debtsCopy.forEach(debt => {
                if (debt.balance > 0) {
                    const interest = debt.balance * debt.rate;
                    const principal = Math.min(debt.minimum - interest, debt.balance);
                    
                    debt.balance -= principal;
                    monthlyInterest += interest;
                    monthlyPrincipal += principal;
                    totalPaid += debt.minimum;
                }
            });

            // Apply extra payment to target debt (first active debt in sorted order)
            const targetDebt = debtsCopy.find(debt => debt.balance > 0);
            if (targetDebt && remainingExtra > 0) {
                const extraPrincipal = Math.min(remainingExtra, targetDebt.balance);
                targetDebt.balance -= extraPrincipal;
                monthlyPrincipal += extraPrincipal;
                totalPaid += extraPrincipal;
            }

            totalInterest += monthlyInterest;

            // Check for paid off debts
            debtsCopy.forEach(debt => {
                if (debt.balance <= 0 && !payoffOrder.find(p => p.id === debt.id)) {
                    payoffOrder.push({
                        id: debt.id,
                        name: debt.name,
                        month: month,
                        originalBalance: debt.originalBalance
                    });
                }
            });

            monthlyDetails.push({
                month: month,
                totalBalance: debtsCopy.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0),
                monthlyInterest: monthlyInterest,
                monthlyPrincipal: monthlyPrincipal,
                totalInterest: totalInterest
            });

            // Safety check
            if (month > 600) { // Max 50 years
                break;
            }
        }

        return {
            strategy: strategy,
            months: month,
            totalInterest: totalInterest,
            totalPaid: totalPaid,
            payoffOrder: payoffOrder,
            monthlyDetails: monthlyDetails
        };
    }

    function updateResults(snowball, avalanche) {
        // Snowball results
        document.getElementById('snowball-time').textContent = `${snowball.months} місяців`;
        document.getElementById('snowball-total').textContent = `₴${snowball.totalPaid.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}`;
        document.getElementById('snowball-interest').textContent = `₴${snowball.totalInterest.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}`;

        // Avalanche results
        document.getElementById('avalanche-time').textContent = `${avalanche.months} місяців`;
        document.getElementById('avalanche-total').textContent = `₴${avalanche.totalPaid.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}`;
        document.getElementById('avalanche-interest').textContent = `₴${avalanche.totalInterest.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}`;

        // Comparison
        const interestSavings = snowball.totalInterest - avalanche.totalInterest;
        const timeSavings = snowball.months - avalanche.months;
        
        document.getElementById('savings-amount').textContent = `₴${interestSavings.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}`;
        document.getElementById('time-savings').textContent = `${timeSavings} міс.`;

        // Recommendation
        let recommendation, recommendationText;
        if (interestSavings > 5000 || timeSavings > 6) {
            recommendation = "🏔️";
            recommendationText = "Лавина (більша економія)";
        } else if (interestSavings < 1000 && timeSavings < 3) {
            recommendation = "❄️";
            recommendationText = "Сніжний ком (мотивація)";
        } else {
            recommendation = "🎯";
            recommendationText = "Обидва методи подібні";
        }
        
        document.getElementById('recommendation').textContent = recommendation;
        document.getElementById('recommendation-text').textContent = recommendationText;

        // Update payoff orders
        updatePayoffOrder('snowball', snowball.payoffOrder);
        updatePayoffOrder('avalanche', avalanche.payoffOrder);
    }

    function updatePayoffOrder(strategy, payoffOrder) {
        const container = document.getElementById(`${strategy}-order`);
        container.innerHTML = '<h4>📋 Порядок погашення:</h4>';
        
        payoffOrder.forEach((debt, index) => {
            const orderItem = document.createElement('div');
            orderItem.className = 'payoff-order-item';
            orderItem.innerHTML = `
                <span class="order-number">${index + 1}</span>
                <span class="debt-name">${debt.name}</span>
                <span class="debt-month">Місяць ${debt.month}</span>
            `;
            container.appendChild(orderItem);
        });
    }

    function createPayoffChart(snowball, avalanche) {
        const ctx = document.getElementById('payoffChart').getContext('2d');
        
        // Prepare data
        const maxMonths = Math.max(snowball.months, avalanche.months);
        const months = Array.from({length: maxMonths}, (_, i) => i + 1);
        
        const snowballBalances = [];
        const avalancheBalances = [];
        
        // Fill balance data
        for (let i = 0; i < maxMonths; i++) {
            snowballBalances.push(snowball.monthlyDetails[i]?.totalBalance || 0);
            avalancheBalances.push(avalanche.monthlyDetails[i]?.totalBalance || 0);
        }

        // Destroy existing chart
        if (window.payoffChart) {
            window.payoffChart.destroy();
        }

        window.payoffChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: '❄️ Сніжний ком',
                        data: snowballBalances,
                        borderColor: '#17a2b8',
                        backgroundColor: 'rgba(23, 162, 184, 0.1)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: '🏔️ Лавина',
                        data: avalancheBalances,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₴' + (value / 1000).toFixed(0) + 'К';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Місяці'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₴' + 
                                    context.parsed.y.toLocaleString('uk-UA', { maximumFractionDigits: 0 });
                            }
                        }
                    }
                }
            }
        });
    }

    function createDetailedSchedule(snowball, avalanche) {
        const scheduleContent = document.getElementById('schedule-content');
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        // Tab functionality
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const strategy = this.dataset.strategy;
                showSchedule(strategy === 'snowball' ? snowball : avalanche);
            });
        });

        // Show initial schedule
        showSchedule(snowball);

        function showSchedule(result) {
            const details = result.monthlyDetails.slice(0, 24); // Show first 24 months
            
            let html = `
                <div class="schedule-table">
                    <div class="schedule-header">
                        <span>Місяць</span>
                        <span>Залишок боргу</span>
                        <span>Відсотки</span>
                        <span>Основний борг</span>
                        <span>Загальні відсотки</span>
                    </div>
            `;
            
            details.forEach(detail => {
                html += `
                    <div class="schedule-row">
                        <span>${detail.month}</span>
                        <span>₴${detail.totalBalance.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}</span>
                        <span>₴${detail.monthlyInterest.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}</span>
                        <span>₴${detail.monthlyPrincipal.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}</span>
                        <span>₴${detail.totalInterest.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}</span>
                    </div>
                `;
            });
            
            html += '</div>';
            
            if (result.months > 24) {
                html += `<p><em>Показано перші 24 місяці з ${result.months}</em></p>`;
            }
            
            scheduleContent.innerHTML = html;
        }
    }

    // Load Chart.js if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(script);
    }
});