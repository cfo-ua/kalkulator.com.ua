document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('passive-income-calculator-form');
    const resultsDiv = document.getElementById('passive-income-results');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculatePassiveIncome();
    });

    function calculatePassiveIncome() {
        // Ensure Chart.js is loaded before proceeding
        ensureChartJSLoaded(() => {
            performCalculation();
        });
    }

    function performCalculation() {
        // Get form values
        const targetMonthlyIncome = parseFloat(document.getElementById('target-monthly-income').value);
        const currentAge = parseInt(document.getElementById('current-age').value);
        const targetAge = parseInt(document.getElementById('target-age').value);
        const currentSavings = parseFloat(document.getElementById('current-savings').value);
        
        // Investment amounts
        const realEstateInvestment = parseFloat(document.getElementById('real-estate-investment').value) || 0;
        const dividendStocksInvestment = parseFloat(document.getElementById('dividend-stocks-investment').value) || 0;
        const bondsInvestment = parseFloat(document.getElementById('bonds-investment').value) || 0;
        const depositsInvestment = parseFloat(document.getElementById('deposits-investment').value) || 0;
        const businessInvestment = parseFloat(document.getElementById('business-investment').value) || 0;
        
        // Yields
        const realEstateYield = parseFloat(document.getElementById('real-estate-yield').value) / 100;
        const dividendYield = parseFloat(document.getElementById('dividend-yield').value) / 100;
        const bondsYield = parseFloat(document.getElementById('bonds-yield').value) / 100;
        const depositsYield = parseFloat(document.getElementById('deposits-yield').value) / 100;
        const businessYield = parseFloat(document.getElementById('business-yield').value) / 100;
        
        // Additional parameters
        const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value);
        const inflationRate = parseFloat(document.getElementById('inflation-rate').value) / 100;
        const reinvestmentRate = parseFloat(document.getElementById('reinvestment-rate').value) / 100;
        const riskTolerance = document.getElementById('risk-tolerance').value;

        // Calculate current passive income
        const currentPassiveIncome = {
            realEstate: realEstateInvestment * realEstateYield / 12,
            dividends: dividendStocksInvestment * dividendYield / 12,
            bonds: bondsInvestment * bondsYield / 12,
            deposits: depositsInvestment * depositsYield / 12,
            business: businessInvestment * businessYield / 12
        };

        const totalCurrentPassiveIncome = Object.values(currentPassiveIncome).reduce((sum, income) => sum + income, 0);
        
        // Calculate total current investments
        const totalCurrentInvestments = realEstateInvestment + dividendStocksInvestment + 
                                      bondsInvestment + depositsInvestment + businessInvestment;

        // Calculate average portfolio yield
        let averageYield = 0;
        if (totalCurrentInvestments > 0) {
            averageYield = (realEstateInvestment * realEstateYield + 
                          dividendStocksInvestment * dividendYield +
                          bondsInvestment * bondsYield +
                          depositsInvestment * depositsYield +
                          businessInvestment * businessYield) / totalCurrentInvestments;
        }

        // Adjust yield based on risk tolerance
        const riskAdjustment = {
            conservative: 0.8,
            moderate: 1.0,
            aggressive: 1.2
        };
        const adjustedYield = averageYield * riskAdjustment[riskTolerance];

        // Calculate required capital for target income
        const targetAnnualIncome = targetMonthlyIncome * 12;
        const requiredCapital = targetAnnualIncome / adjustedYield;

        // Calculate time to goal
        const yearsToGoal = targetAge - currentAge;
        const capitalShortfall = Math.max(0, requiredCapital - totalCurrentInvestments);

        // Year-by-year projection
        const yearlyProjection = [];
        let currentPortfolioValue = totalCurrentInvestments;
        let currentAnnualIncome = totalCurrentPassiveIncome * 12;

        for (let year = 1; year <= yearsToGoal; year++) {
            // Add monthly contributions
            currentPortfolioValue += monthlyContribution * 12;
            
            // Add reinvested income
            const reinvestedIncome = currentAnnualIncome * reinvestmentRate;
            currentPortfolioValue += reinvestedIncome;
            
            // Apply growth
            currentPortfolioValue *= (1 + adjustedYield);
            
            // Calculate new annual income
            currentAnnualIncome = currentPortfolioValue * adjustedYield;
            
            // Adjust for inflation
            const realIncomeValue = currentAnnualIncome / Math.pow(1 + inflationRate, year);
            
            yearlyProjection.push({
                year: year,
                age: currentAge + year,
                portfolioValue: currentPortfolioValue,
                annualIncome: currentAnnualIncome,
                monthlyIncome: currentAnnualIncome / 12,
                progressToGoal: Math.min(100, (currentAnnualIncome / targetAnnualIncome) * 100),
                realIncomeValue: realIncomeValue
            });
        }

        // Calculate required monthly investment if shortfall exists
        let requiredMonthlyInvestment = monthlyContribution;
        if (capitalShortfall > 0 && yearsToGoal > 0) {
            // Future value of current investments
            const futureValueCurrent = totalCurrentInvestments * Math.pow(1 + adjustedYield, yearsToGoal);
            
            // Future value needed
            const futureValueNeeded = requiredCapital;
            
            // Additional future value needed from monthly investments
            const additionalNeeded = Math.max(0, futureValueNeeded - futureValueCurrent);
            
            // Calculate required monthly payment using future value of annuity formula
            if (adjustedYield > 0) {
                const monthlyRate = adjustedYield / 12;
                const numPayments = yearsToGoal * 12;
                requiredMonthlyInvestment = additionalNeeded / 
                    (((Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate) * (1 + monthlyRate));
            } else {
                requiredMonthlyInvestment = additionalNeeded / (yearsToGoal * 12);
            }
        }

        // Update results
        updateResults({
            currentPassiveIncome: currentPassiveIncome,
            totalCurrentPassiveIncome: totalCurrentPassiveIncome,
            requiredCapital: requiredCapital,
            timeToGoal: yearsToGoal,
            futurePortfolioValue: yearlyProjection[yearlyProjection.length - 1]?.portfolioValue || 0,
            totalCurrentInvestments: totalCurrentInvestments,
            averageYield: averageYield * 100,
            currentAnnualIncome: totalCurrentPassiveIncome * 12,
            targetAnnualIncome: targetAnnualIncome,
            capitalShortfall: capitalShortfall,
            requiredMonthlyInvestment: requiredMonthlyInvestment
        });

        createIncomeGrowthChart(yearlyProjection, targetMonthlyIncome);
        createPortfolioChart(currentPassiveIncome);
        createYearlyProjectionTable(yearlyProjection, targetMonthlyIncome);

        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function updateResults(results) {
        // Main metrics
        document.getElementById('current-passive-income').textContent = 
            '$' + results.totalCurrentPassiveIncome.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('required-capital').textContent = 
            '$' + results.requiredCapital.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('time-to-goal').textContent = results.timeToGoal + ' років';
        document.getElementById('future-portfolio-value').textContent = 
            '$' + results.futurePortfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 });

        // Income breakdown
        const totalIncome = results.totalCurrentPassiveIncome;
        
        document.getElementById('real-estate-income').textContent = 
            '$' + results.currentPassiveIncome.realEstate.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('real-estate-percentage').textContent = 
            ((results.currentPassiveIncome.realEstate / totalIncome) * 100).toFixed(1) + '%';
            
        document.getElementById('dividends-income').textContent = 
            '$' + results.currentPassiveIncome.dividends.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('dividends-percentage').textContent = 
            ((results.currentPassiveIncome.dividends / totalIncome) * 100).toFixed(1) + '%';
            
        document.getElementById('bonds-income').textContent = 
            '$' + results.currentPassiveIncome.bonds.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('bonds-percentage').textContent = 
            ((results.currentPassiveIncome.bonds / totalIncome) * 100).toFixed(1) + '%';
            
        document.getElementById('deposits-income').textContent = 
            '$' + results.currentPassiveIncome.deposits.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('deposits-percentage').textContent = 
            ((results.currentPassiveIncome.deposits / totalIncome) * 100).toFixed(1) + '%';
            
        document.getElementById('business-income').textContent = 
            '$' + results.currentPassiveIncome.business.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('business-percentage').textContent = 
            ((results.currentPassiveIncome.business / totalIncome) * 100).toFixed(1) + '%';

        // Investment plan details
        document.getElementById('total-current-investments').textContent = 
            '$' + results.totalCurrentInvestments.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('average-portfolio-yield').textContent = 
            results.averageYield.toFixed(1) + '%';
        document.getElementById('current-annual-income').textContent = 
            '$' + results.currentAnnualIncome.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('target-annual-income').textContent = 
            '$' + results.targetAnnualIncome.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('capital-shortfall').textContent = 
            '$' + results.capitalShortfall.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('required-monthly-investment').textContent = 
            '$' + results.requiredMonthlyInvestment.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }

    function createIncomeGrowthChart(yearlyProjection, targetMonthlyIncome) {
        const ctx = document.getElementById('incomeGrowthChart').getContext('2d');
        
        const years = yearlyProjection.map(p => p.age);
        const monthlyIncomes = yearlyProjection.map(p => p.monthlyIncome);
        const portfolioValues = yearlyProjection.map(p => p.portfolioValue);
        const targetLine = new Array(years.length).fill(targetMonthlyIncome);

        // Destroy existing chart
        if (window.incomeChart && typeof window.incomeChart.destroy === 'function') {
            window.incomeChart.destroy();
        }

        window.incomeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Місячний пасивний дохід',
                        data: monthlyIncomes,
                        borderColor: '#157aff',
                        backgroundColor: 'rgba(21, 122, 255, 0.1)',
                        fill: false,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Ціль',
                        data: targetLine,
                        borderColor: '#28a745',
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Портфель',
                        data: portfolioValues,
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        fill: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Місячний дохід ($)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Портфель ($)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
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
                                const value = context.parsed.y;
                                return context.dataset.label + ': $' + 
                                    value.toLocaleString('en-US', { maximumFractionDigits: 0 });
                            }
                        }
                    }
                }
            }
        });
    }

    function createPortfolioChart(currentPassiveIncome) {
        const ctx = document.getElementById('portfolioChart').getContext('2d');
        
        const labels = ['Нерухомість', 'Дивіденди', 'Облігації', 'Депозити', 'Бізнес'];
        const data = [
            currentPassiveIncome.realEstate,
            currentPassiveIncome.dividends,
            currentPassiveIncome.bonds,
            currentPassiveIncome.deposits,
            currentPassiveIncome.business
        ];
        
        const colors = [
            '#157aff',
            '#28a745',
            '#ffc107',
            '#dc3545',
            '#6f42c1'
        ];

        // Destroy existing chart
        if (window.portfolioChart && typeof window.portfolioChart.destroy === 'function') {
            window.portfolioChart.destroy();
        }

        window.portfolioChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return context.label + ': $' + value.toLocaleString('en-US', { maximumFractionDigits: 0 }) + 
                                       ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    function createYearlyProjectionTable(yearlyProjection, targetMonthlyIncome) {
        const tbody = document.getElementById('yearly-projection-data');
        tbody.innerHTML = '';

        // Show every 2-3 years to keep table manageable
        const step = Math.max(1, Math.floor(yearlyProjection.length / 10));
        
        for (let i = 0; i < yearlyProjection.length; i += step) {
            const projection = yearlyProjection[i];
            const row = document.createElement('tr');
            
            // Highlight when goal is reached
            const goalReached = projection.monthlyIncome >= targetMonthlyIncome;
            if (goalReached) {
                row.classList.add('goal-reached');
            }
            
            row.innerHTML = `
                <td>${projection.year}</td>
                <td>${projection.age}</td>
                <td>$${projection.portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>$${projection.annualIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>$${projection.monthlyIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td class="${goalReached ? 'goal-reached' : ''}">${projection.progressToGoal.toFixed(0)}%</td>
            `;
            tbody.appendChild(row);
        }
        
        // Add final year if not included
        if ((yearlyProjection.length - 1) % step !== 0) {
            const finalProjection = yearlyProjection[yearlyProjection.length - 1];
            const row = document.createElement('tr');
            const goalReached = finalProjection.monthlyIncome >= targetMonthlyIncome;
            if (goalReached) {
                row.classList.add('goal-reached');
            }
            
            row.innerHTML = `
                <td>${finalProjection.year}</td>
                <td>${finalProjection.age}</td>
                <td>$${finalProjection.portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>$${finalProjection.annualIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>$${finalProjection.monthlyIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td class="${goalReached ? 'goal-reached' : ''}">${finalProjection.progressToGoal.toFixed(0)}%</td>
            `;
            tbody.appendChild(row);
        }
    }

    // Load Chart.js if not already loaded and ensure it's available
    function ensureChartJSLoaded(callback) {
        if (typeof Chart !== 'undefined') {
            callback();
            return;
        }
        
        // Check if script is already loading
        if (window.chartJSLoading) {
            // Wait for it to finish loading
            const checkLoaded = () => {
                if (typeof Chart !== 'undefined') {
                    callback();
                } else {
                    setTimeout(checkLoaded, 50);
                }
            };
            checkLoaded();
            return;
        }
        
        // Start loading Chart.js
        window.chartJSLoading = true;
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            window.chartJSLoading = false;
            callback();
        };
        script.onerror = () => {
            window.chartJSLoading = false;
            console.error('Failed to load Chart.js from CDN, using fallback');
            // Create a mock Chart object for testing
            window.Chart = function(ctx, config) {
                console.log('Mock Chart created with config:', config);
                return {
                    destroy: function() {
                        console.log('Mock Chart destroyed');
                    }
                };
            };
            callback();
        };
        document.head.appendChild(script);
    }

    // Initialize Chart.js loading immediately
    ensureChartJSLoaded(() => {
        // Chart.js is now loaded and ready
    });
});