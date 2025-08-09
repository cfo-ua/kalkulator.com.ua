document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('real-estate-calculator-form');
    const resultsDiv = document.getElementById('real-estate-results');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateRealEstateReturns();
    });

    // Auto-calculate loan amount when down payment changes
    document.getElementById('down-payment').addEventListener('input', updateLoanAmount);
    document.getElementById('purchase-price').addEventListener('input', updateLoanAmount);

    function updateLoanAmount() {
        const purchasePrice = parseFloat(document.getElementById('purchase-price').value) || 0;
        const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
        const loanAmount = Math.max(0, purchasePrice - downPayment);
        document.getElementById('loan-amount').value = loanAmount;
    }

    function calculateRealEstateReturns() {
        // Get form values
        const propertyType = document.getElementById('property-type').value;
        const purchasePrice = parseFloat(document.getElementById('purchase-price').value);
        const downPayment = parseFloat(document.getElementById('down-payment').value);
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        
        const monthlyRent = parseFloat(document.getElementById('monthly-rent').value);
        const annualRentIncrease = parseFloat(document.getElementById('annual-rent-increase').value) / 100;
        const vacancyRate = parseFloat(document.getElementById('vacancy-rate').value) / 100;
        const otherIncome = parseFloat(document.getElementById('other-income').value) * 12;
        
        const propertyTax = parseFloat(document.getElementById('property-tax').value);
        const insurance = parseFloat(document.getElementById('insurance').value);
        const maintenance = parseFloat(document.getElementById('maintenance').value);
        const managementFee = parseFloat(document.getElementById('management-fee').value);
        const utilities = parseFloat(document.getElementById('utilities').value);
        const otherExpenses = parseFloat(document.getElementById('other-expenses').value);
        
        const appreciationRate = parseFloat(document.getElementById('appreciation-rate').value) / 100;
        const analysisPeriod = parseInt(document.getElementById('analysis-period').value);
        const closingCosts = parseFloat(document.getElementById('closing-costs').value);
        const renovationCosts = parseFloat(document.getElementById('renovation-costs').value);
        const sellingCosts = parseFloat(document.getElementById('selling-costs').value) / 100;

        // Calculate initial investment
        const initialInvestment = downPayment + closingCosts + renovationCosts;

        // Calculate monthly loan payment
        const monthlyInterestRate = interestRate / 12;
        const numPayments = loanTerm * 12;
        let monthlyLoanPayment = 0;
        
        if (loanAmount > 0 && interestRate > 0) {
            monthlyLoanPayment = loanAmount * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numPayments)) /
                (Math.pow(1 + monthlyInterestRate, numPayments) - 1);
        }

        // Calculate annual debt service
        const annualDebtService = monthlyLoanPayment * 12;

        // Calculate first year metrics
        const grossRentalIncome = monthlyRent * 12;
        const vacancyLoss = grossRentalIncome * vacancyRate;
        const effectiveGrossIncome = grossRentalIncome - vacancyLoss + otherIncome;
        
        // Calculate management fee (either percentage of rent or fixed amount)
        let annualManagementFee;
        if (managementFee <= 100) { // Assume percentage if <= 100
            annualManagementFee = effectiveGrossIncome * (managementFee / 100);
        } else {
            annualManagementFee = managementFee; // Fixed amount
        }
        
        const operatingExpenses = propertyTax + insurance + maintenance + 
                                annualManagementFee + utilities + otherExpenses;
        const netOperatingIncome = effectiveGrossIncome - operatingExpenses;
        const beforeTaxCashFlow = netOperatingIncome - annualDebtService;

        // Calculate metrics
        const capRate = (netOperatingIncome / purchasePrice) * 100;
        const cashOnCashReturn = (beforeTaxCashFlow / initialInvestment) * 100;
        const annualROI = ((netOperatingIncome - annualDebtService + purchasePrice * appreciationRate) / initialInvestment) * 100;

        // Year-by-year analysis
        const yearlyData = [];
        let currentRent = monthlyRent * 12;
        let currentPropertyValue = purchasePrice;
        let loanBalance = loanAmount;
        let totalCashFlow = 0;
        let totalAppreciation = 0;

        for (let year = 1; year <= analysisPeriod; year++) {
            // Update rent and property value
            if (year > 1) {
                currentRent *= (1 + annualRentIncrease);
                currentPropertyValue *= (1 + appreciationRate);
            }

            const yearGrossIncome = currentRent;
            const yearVacancyLoss = yearGrossIncome * vacancyRate;
            const yearEffectiveIncome = yearGrossIncome - yearVacancyLoss + otherIncome;
            
            let yearManagementFee;
            if (managementFee <= 100) {
                yearManagementFee = yearEffectiveIncome * (managementFee / 100);
            } else {
                yearManagementFee = managementFee;
            }
            
            const yearOperatingExpenses = propertyTax + insurance + maintenance + 
                                        yearManagementFee + utilities + otherExpenses;
            const yearNOI = yearEffectiveIncome - yearOperatingExpenses;
            const yearCashFlow = yearNOI - annualDebtService;
            
            // Calculate loan balance reduction
            let principalPayment = 0;
            if (loanBalance > 0) {
                const yearlyInterest = loanBalance * interestRate;
                principalPayment = Math.min(annualDebtService - yearlyInterest, loanBalance);
                loanBalance = Math.max(0, loanBalance - principalPayment);
            }
            
            const equity = currentPropertyValue - loanBalance;
            
            totalCashFlow += yearCashFlow;
            
            yearlyData.push({
                year: year,
                rent: yearGrossIncome,
                expenses: yearOperatingExpenses,
                noi: yearNOI,
                cashFlow: yearCashFlow,
                propertyValue: currentPropertyValue,
                equity: equity,
                loanBalance: loanBalance
            });
        }

        // Calculate final sale
        const finalPropertyValue = currentPropertyValue;
        const saleExpenses = finalPropertyValue * sellingCosts;
        const netSaleProceeds = finalPropertyValue - loanBalance - saleExpenses;
        const totalReturn = totalCashFlow + netSaleProceeds - initialInvestment;
        
        // Calculate IRR (simplified approximation)
        const irr = calculateIRR(initialInvestment, yearlyData, netSaleProceeds);
        
        // Calculate break-even
        const breakEvenTime = calculateBreakEven(initialInvestment, yearlyData);

        // Update display
        updateResults({
            annualROI: annualROI,
            irr: irr,
            monthlyCashFlow: beforeTaxCashFlow / 12,
            capRate: capRate,
            cashOnCash: cashOnCashReturn,
            futureValue: finalPropertyValue,
            totalReturn: totalReturn,
            breakEven: breakEvenTime,
            analysisPeriod: analysisPeriod,
            initialInvestment: initialInvestment,
            downPayment: downPayment,
            closingCosts: closingCosts,
            renovationCosts: renovationCosts,
            grossRentalIncome: grossRentalIncome,
            vacancyLoss: vacancyLoss,
            effectiveGrossIncome: effectiveGrossIncome,
            operatingExpenses: operatingExpenses,
            netOperatingIncome: netOperatingIncome,
            annualDebtService: annualDebtService,
            beforeTaxCashFlow: beforeTaxCashFlow
        });

        createCashFlowChart(yearlyData);
        createYearlyTable(yearlyData);

        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function calculateIRR(initialInvestment, yearlyData, finalSaleProceeds) {
        // Simplified IRR calculation using Newton-Raphson method
        let rate = 0.1; // Initial guess
        
        for (let i = 0; i < 20; i++) {
            let npv = -initialInvestment;
            let npvDerivative = 0;
            
            yearlyData.forEach((year, index) => {
                const period = index + 1;
                const cashFlow = year.cashFlow + (period === yearlyData.length ? finalSaleProceeds : 0);
                npv += cashFlow / Math.pow(1 + rate, period);
                npvDerivative -= period * cashFlow / Math.pow(1 + rate, period + 1);
            });
            
            if (Math.abs(npv) < 0.01) break;
            if (npvDerivative === 0) break;
            
            rate = rate - npv / npvDerivative;
        }
        
        return Math.max(-50, Math.min(50, rate * 100)); // Cap between -50% and 50%
    }

    function calculateBreakEven(initialInvestment, yearlyData) {
        let cumulativeCashFlow = 0;
        
        for (let i = 0; i < yearlyData.length; i++) {
            cumulativeCashFlow += yearlyData[i].cashFlow;
            if (cumulativeCashFlow >= initialInvestment) {
                return i + 1;
            }
        }
        
        return yearlyData.length + 1; // Beyond analysis period
    }

    function updateResults(results) {
        document.getElementById('annual-roi').textContent = results.annualROI.toFixed(1) + '%';
        document.getElementById('irr-value').textContent = results.irr.toFixed(1) + '%';
        document.getElementById('monthly-cash-flow').textContent = 
            '$' + results.monthlyCashFlow.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('cap-rate').textContent = results.capRate.toFixed(1) + '%';
        document.getElementById('cash-on-cash').textContent = results.cashOnCash.toFixed(1) + '%';
        document.getElementById('future-property-value').textContent = 
            '$' + results.futureValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('total-return').textContent = 
            '$' + results.totalReturn.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('break-even-time').textContent = results.breakEven + ' років';
        document.getElementById('analysis-years').textContent = results.analysisPeriod;

        // Update detailed analysis
        document.getElementById('initial-down-payment').textContent = 
            '$' + results.downPayment.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('initial-closing-costs').textContent = 
            '$' + results.closingCosts.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('initial-renovation').textContent = 
            '$' + results.renovationCosts.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('total-initial-investment').textContent = 
            '$' + results.initialInvestment.toLocaleString('en-US', { maximumFractionDigits: 0 });

        document.getElementById('gross-rental-income').textContent = 
            '$' + results.grossRentalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('vacancy-losses').textContent = 
            '-$' + results.vacancyLoss.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('effective-gross-income').textContent = 
            '$' + results.effectiveGrossIncome.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('operating-expenses').textContent = 
            '-$' + results.operatingExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('net-operating-income').textContent = 
            '$' + results.netOperatingIncome.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('debt-service').textContent = 
            '-$' + results.annualDebtService.toLocaleString('en-US', { maximumFractionDigits: 0 });
        document.getElementById('before-tax-cash-flow').textContent = 
            '$' + results.beforeTaxCashFlow.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }

    function createCashFlowChart(yearlyData) {
        const ctx = document.getElementById('cashFlowChart').getContext('2d');
        
        const years = yearlyData.map(d => d.year);
        const cashFlows = yearlyData.map(d => d.cashFlow);
        const propertyValues = yearlyData.map(d => d.propertyValue);
        const equity = yearlyData.map(d => d.equity);

        // Destroy existing chart
        if (window.realEstateChart) {
            window.realEstateChart.destroy();
        }

        window.realEstateChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Річний Cash Flow',
                        data: cashFlows,
                        borderColor: '#157aff',
                        backgroundColor: 'rgba(21, 122, 255, 0.1)',
                        fill: false,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Вартість нерухомості',
                        data: propertyValues,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        fill: false,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Власний капітал',
                        data: equity,
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
                            text: 'Cash Flow ($)'
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
                            text: 'Вартість ($)'
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
                            text: 'Рік'
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

    function createYearlyTable(yearlyData) {
        const tbody = document.getElementById('yearly-data');
        tbody.innerHTML = '';

        yearlyData.forEach(year => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${year.year}</td>
                <td>$${year.rent.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>$${year.expenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>$${year.noi.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td class="${year.cashFlow >= 0 ? 'positive' : 'negative'}">
                    $${year.cashFlow.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </td>
                <td>$${year.propertyValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>$${year.equity.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Load Chart.js if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(script);
    }
});