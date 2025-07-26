document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fire-calculator-form');
    const resultsDiv = document.getElementById('fire-results');

    // Investment return rates based on strategy
    const investmentReturns = {
        conservative: 0.06,
        balanced: 0.085,
        aggressive: 0.11
    };

    // FIRE multipliers based on type
    const fireMultipliers = {
        lean: 0.7,
        regular: 1.0,
        fat: 1.5,
        barista: 0.8
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateFire();
    });

    function calculateFire() {
        // Get form values
        const currentAge = parseInt(document.getElementById('current-age').value);
        const currentSavings = parseFloat(document.getElementById('current-savings').value);
        const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
        const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value);
        const fireType = document.getElementById('fire-type').value;
        const retirementExpenses = parseFloat(document.getElementById('retirement-expenses').value);
        const targetAge = parseInt(document.getElementById('target-age').value);
        const investmentStrategy = document.getElementById('investment-strategy').value;
        const withdrawalRate = parseFloat(document.getElementById('withdrawal-rate').value) / 100;
        const inflationRate = parseFloat(document.getElementById('inflation-rate').value) / 100;
        const incomeGrowth = parseFloat(document.getElementById('income-growth').value) / 100;
        const savingsRate = parseFloat(document.getElementById('savings-rate').value) / 100;
        const pensionAge = parseInt(document.getElementById('pension-age').value);
        const expectedPension = parseFloat(document.getElementById('expected-pension').value);

        // Calculate key metrics
        const yearsToFire = targetAge - currentAge;
        const annualRetirementExpenses = retirementExpenses * 12 * fireMultipliers[fireType];
        const nominalReturn = investmentReturns[investmentStrategy];
        const realReturn = (1 + nominalReturn) / (1 + inflationRate) - 1;
        const monthlySavings = monthlyIncome * savingsRate;

        // Calculate FIRE target amount (adjusted for inflation)
        const fireTargetAmount = annualRetirementExpenses / withdrawalRate;
        const inflationAdjustedTarget = fireTargetAmount * Math.pow(1 + inflationRate, yearsToFire);

        // Calculate future value of current savings
        const futureValueCurrentSavings = currentSavings * Math.pow(1 + nominalReturn, yearsToFire);

        // Calculate future value of monthly investments
        const monthlyRate = nominalReturn / 12;
        const numPayments = yearsToFire * 12;
        let futureValueMonthlySavings = 0;
        
        if (monthlyRate > 0) {
            futureValueMonthlySavings = monthlySavings * (Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate;
        } else {
            futureValueMonthlySavings = monthlySavings * numPayments;
        }

        // Account for income growth
        let futureValueGrowingSavings = 0;
        const monthlyIncomeGrowth = incomeGrowth / 12;
        
        for (let month = 1; month <= numPayments; month++) {
            const growthFactor = Math.pow(1 + monthlyIncomeGrowth, month - 1);
            const monthlySavingsGrowing = monthlySavings * growthFactor;
            const monthsRemaining = numPayments - month + 1;
            futureValueGrowingSavings += monthlySavingsGrowing * Math.pow(1 + monthlyRate, monthsRemaining - 1);
        }

        const totalFutureValue = futureValueCurrentSavings + futureValueGrowingSavings;

        // Calculate required monthly investment if current plan is insufficient
        const shortfall = Math.max(0, inflationAdjustedTarget - totalFutureValue);
        let requiredMonthlyInvestment = monthlySavings;
        
        if (shortfall > 0 && monthlyRate > 0) {
            requiredMonthlyInvestment = shortfall / ((Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate);
            requiredMonthlyInvestment += monthlySavings;
        }

        // Update display
        updateResults({
            fireTargetAmount: inflationAdjustedTarget,
            yearsToFire: yearsToFire,
            monthlyInvestment: requiredMonthlyInvestment,
            futureValue: totalFutureValue,
            currentAge: currentAge,
            targetAge: targetAge,
            annualExpenses: annualRetirementExpenses,
            withdrawalRate: withdrawalRate * 100,
            expectedReturn: nominalReturn * 100,
            currentSavings: currentSavings,
            shortfall: shortfall
        });

        // Create chart data
        createProgressChart(currentAge, targetAge, currentSavings, monthlySavings, nominalReturn, incomeGrowth, inflationAdjustedTarget);

        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function updateResults(results) {
        document.getElementById('fire-target-amount').textContent = 
            '$' + results.fireTargetAmount.toLocaleString('en-US', { maximumFractionDigits: 0 });
        
        document.getElementById('years-to-fire').textContent = 
            results.yearsToFire + ' років';
        
        document.getElementById('monthly-investment').textContent = 
            '$' + results.monthlyInvestment.toLocaleString('en-US', { maximumFractionDigits: 0 });
        
        document.getElementById('future-value').textContent = 
            '$' + results.futureValue.toLocaleString('en-US', { maximumFractionDigits: 0 });

        // Update breakdown
        document.getElementById('current-age-display').textContent = results.currentAge + ' років';
        document.getElementById('target-age-display').textContent = results.targetAge + ' років';
        document.getElementById('annual-expenses-display').textContent = 
            '$' + results.annualExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('withdrawal-rate-display').textContent = results.withdrawalRate.toFixed(1) + '%';
        document.getElementById('expected-return-display').textContent = results.expectedReturn.toFixed(1) + '%';
        document.getElementById('current-savings-display').textContent = 
            '$' + results.currentSavings.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }

    function createProgressChart(currentAge, targetAge, currentSavings, monthlySavings, annualReturn, incomeGrowth, targetAmount) {
        const ctx = document.getElementById('progressChart').getContext('2d');
        
        // Generate data points
        const years = [];
        const portfolioValues = [];
        const targetLine = [];
        
        let currentValue = currentSavings;
        let currentMonthlySavings = monthlySavings;
        
        for (let year = 0; year <= (targetAge - currentAge); year++) {
            years.push(currentAge + year);
            portfolioValues.push(currentValue);
            targetLine.push(targetAmount);
            
            if (year < (targetAge - currentAge)) {
                // Growth from existing savings
                currentValue *= (1 + annualReturn);
                
                // Add monthly savings for the year (with income growth)
                const yearlyContribution = currentMonthlySavings * 12;
                currentValue += yearlyContribution;
                
                // Increase monthly savings due to income growth
                currentMonthlySavings *= (1 + incomeGrowth);
            }
        }

        // Destroy existing chart if it exists
        if (window.fireChart) {
            window.fireChart.destroy();
        }

        window.fireChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Портфель',
                        data: portfolioValues,
                        borderColor: '#157aff',
                        backgroundColor: 'rgba(21, 122, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Ціль FIRE',
                        data: targetLine,
                        borderColor: '#28a745',
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
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
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Вік'
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
                                return context.dataset.label + ': $' + 
                                    context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
                            }
                        }
                    }
                }
            }
        });
    }

    // Auto-calculate retirement expenses based on FIRE type
    document.getElementById('fire-type').addEventListener('change', function() {
        const fireType = this.value;
        const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value) || 1200;
        const multiplier = fireMultipliers[fireType];
        const suggestedExpenses = Math.round(monthlyExpenses * multiplier);
        
        document.getElementById('retirement-expenses').value = suggestedExpenses;
    });

    // Auto-update savings rate when income/expenses change
    function updateSavingsRate() {
        const income = parseFloat(document.getElementById('monthly-income').value) || 0;
        const expenses = parseFloat(document.getElementById('monthly-expenses').value) || 0;
        
        if (income > expenses) {
            const savingsRate = Math.round(((income - expenses) / income) * 100);
            document.getElementById('savings-rate').value = Math.min(savingsRate, 80);
        }
    }

    document.getElementById('monthly-income').addEventListener('input', updateSavingsRate);
    document.getElementById('monthly-expenses').addEventListener('input', updateSavingsRate);

    // Load Chart.js if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(script);
    }
});