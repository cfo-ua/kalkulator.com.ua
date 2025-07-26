document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('amortization-calculator-form');
    const resultsDiv = document.getElementById('amortization-results');
    
    // Set default start date to next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    document.getElementById('start-date').value = nextMonth.toISOString().split('T')[0];

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateAmortization();
    });

    // Export functions
    document.getElementById('export-csv').addEventListener('click', exportToCSV);
    document.getElementById('print-table').addEventListener('click', printTable);
    document.getElementById('show-rows').addEventListener('change', updateTableDisplay);

    function calculateAmortization() {
        // Get form values
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const annualRate = parseFloat(document.getElementById('annual-rate').value) / 100;
        const loanTermYears = parseInt(document.getElementById('loan-term').value);
        const paymentType = document.getElementById('payment-type').value;
        const startDate = new Date(document.getElementById('start-date').value);
        
        const extraPayment = parseFloat(document.getElementById('extra-payment').value) || 0;
        const oneTimePayment = parseFloat(document.getElementById('one-time-payment').value) || 0;
        const oneTimePaymentMonth = parseInt(document.getElementById('one-time-payment-month').value) || 12;
        const paymentFrequency = document.getElementById('payment-frequency').value;
        
        const insuranceRate = parseFloat(document.getElementById('insurance-rate').value) / 100;
        const processingFee = parseFloat(document.getElementById('processing-fee').value) || 0;
        const monthlyFee = parseFloat(document.getElementById('monthly-fee').value) || 0;

        // Calculate based on payment frequency
        const paymentsPerYear = getPaymentsPerYear(paymentFrequency);
        const periodRate = annualRate / paymentsPerYear;
        const totalPayments = loanTermYears * paymentsPerYear;
        
        // Calculate base payment schedules
        const baseSchedule = calculatePaymentSchedule(
            loanAmount, periodRate, totalPayments, paymentType, startDate, 
            paymentFrequency, 0, 0, 0, insuranceRate, monthlyFee
        );
        
        const optimizedSchedule = calculatePaymentSchedule(
            loanAmount, periodRate, totalPayments, paymentType, startDate, 
            paymentFrequency, extraPayment, oneTimePayment, oneTimePaymentMonth, 
            insuranceRate, monthlyFee
        );

        // Update results display
        updateResults(baseSchedule, optimizedSchedule, processingFee);
        createCharts(optimizedSchedule);
        createAmortizationTable(optimizedSchedule);

        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function getPaymentsPerYear(frequency) {
        switch (frequency) {
            case 'weekly': return 52;
            case 'biweekly': return 26;
            case 'monthly':
            default: return 12;
        }
    }

    function calculatePaymentSchedule(loanAmount, periodRate, totalPayments, paymentType, 
                                    startDate, frequency, extraPayment, oneTimePayment, 
                                    oneTimePaymentMonth, insuranceRate, monthlyFee) {
        const schedule = [];
        let balance = loanAmount;
        let totalInterest = 0;
        let totalPrincipal = 0;
        let paymentNumber = 0;
        
        // Calculate base payment
        let basePayment;
        if (paymentType === 'annuity') {
            if (periodRate > 0) {
                basePayment = loanAmount * (periodRate * Math.pow(1 + periodRate, totalPayments)) / 
                            (Math.pow(1 + periodRate, totalPayments) - 1);
            } else {
                basePayment = loanAmount / totalPayments;
            }
        }

        const paymentInterval = getPaymentInterval(frequency);
        let currentDate = new Date(startDate);

        while (balance > 0.01 && paymentNumber < totalPayments * 2) { // Safety limit
            paymentNumber++;
            
            let interestPayment = balance * periodRate;
            let principalPayment;
            let payment;
            
            if (paymentType === 'annuity') {
                payment = Math.min(basePayment, balance + interestPayment);
                principalPayment = payment - interestPayment;
            } else { // differentiated
                principalPayment = loanAmount / totalPayments;
                payment = principalPayment + interestPayment;
            }
            
            // Add extra payments
            let currentExtraPayment = 0;
            if (extraPayment > 0) {
                currentExtraPayment += extraPayment;
            }
            
            if (paymentNumber === oneTimePaymentMonth && oneTimePayment > 0) {
                currentExtraPayment += oneTimePayment;
            }
            
            // Apply extra payment to principal
            principalPayment += currentExtraPayment;
            payment += currentExtraPayment;
            
            // Don't overpay
            if (principalPayment > balance) {
                principalPayment = balance;
                payment = principalPayment + interestPayment;
                currentExtraPayment = principalPayment - (payment - interestPayment - currentExtraPayment);
            }
            
            // Add insurance and fees (convert to payment frequency)
            const periodInsurance = (loanAmount * insuranceRate) / getPaymentsPerYear(frequency);
            const periodFee = frequency === 'monthly' ? monthlyFee : 
                            monthlyFee * (12 / getPaymentsPerYear(frequency));
            
            const totalPayment = payment + periodInsurance + periodFee;
            
            balance -= principalPayment;
            totalInterest += interestPayment;
            totalPrincipal += principalPayment;
            
            schedule.push({
                paymentNumber: paymentNumber,
                date: new Date(currentDate),
                payment: payment,
                principal: principalPayment,
                interest: interestPayment,
                extraPayment: currentExtraPayment,
                insurance: periodInsurance,
                fee: periodFee,
                totalPayment: totalPayment,
                balance: balance
            });
            
            // Update date
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + paymentInterval);
        }

        return {
            schedule: schedule,
            totalInterest: totalInterest,
            totalPrincipal: totalPrincipal,
            totalPayments: schedule.length,
            totalInsurance: schedule.reduce((sum, p) => sum + p.insurance, 0),
            totalFees: schedule.reduce((sum, p) => sum + p.fee, 0),
            basePayment: paymentType === 'annuity' ? basePayment : schedule[0]?.payment || 0
        };
    }

    function getPaymentInterval(frequency) {
        switch (frequency) {
            case 'weekly': return 7;
            case 'biweekly': return 14;
            case 'monthly':
            default: return 30; // Approximate
        }
    }

    function updateResults(baseSchedule, optimizedSchedule, processingFee) {
        // Basic metrics
        document.getElementById('monthly-payment').textContent = 
            '₴' + baseSchedule.basePayment.toLocaleString('uk-UA', { maximumFractionDigits: 0 });
        
        document.getElementById('total-interest').textContent = 
            '₴' + optimizedSchedule.totalInterest.toLocaleString('uk-UA', { maximumFractionDigits: 0 });
        
        const totalAmount = optimizedSchedule.totalPrincipal + optimizedSchedule.totalInterest + 
                           optimizedSchedule.totalInsurance + optimizedSchedule.totalFees + processingFee;
        document.getElementById('total-amount').textContent = 
            '₴' + totalAmount.toLocaleString('uk-UA', { maximumFractionDigits: 0 });
        
        const termYears = Math.ceil(optimizedSchedule.totalPayments / 12);
        const termMonths = optimizedSchedule.totalPayments % 12;
        document.getElementById('payoff-time').textContent = 
            termYears + (termMonths > 0 ? `.${termMonths}` : '') + ' років';

        // Extra payment benefits
        if (optimizedSchedule.totalPayments < baseSchedule.totalPayments) {
            const interestSavings = baseSchedule.totalInterest - optimizedSchedule.totalInterest;
            const timeSavings = baseSchedule.totalPayments - optimizedSchedule.totalPayments;
            
            document.getElementById('interest-savings').textContent = 
                '₴' + interestSavings.toLocaleString('uk-UA', { maximumFractionDigits: 0 });
            document.getElementById('time-savings').textContent = 
                timeSavings + ' міс.';
            document.getElementById('extra-payment-benefits').style.display = 'block';
        }

        // Comparison scenarios
        document.getElementById('base-term').textContent = baseSchedule.totalPayments + ' місяців';
        document.getElementById('base-overpayment').textContent = 
            '₴' + baseSchedule.totalInterest.toLocaleString('uk-UA', { maximumFractionDigits: 0 });
        document.getElementById('base-total').textContent = 
            '₴' + (baseSchedule.totalPrincipal + baseSchedule.totalInterest).toLocaleString('uk-UA', { maximumFractionDigits: 0 });

        document.getElementById('optimized-term').textContent = optimizedSchedule.totalPayments + ' місяців';
        document.getElementById('optimized-overpayment').textContent = 
            '₴' + optimizedSchedule.totalInterest.toLocaleString('uk-UA', { maximumFractionDigits: 0 });
        document.getElementById('optimized-total').textContent = 
            '₴' + (optimizedSchedule.totalPrincipal + optimizedSchedule.totalInterest).toLocaleString('uk-UA', { maximumFractionDigits: 0 });
    }

    function createCharts(schedule) {
        // Wait for Chart.js to load before creating charts
        if (typeof Chart === 'undefined') {
            // Keep track of how long we've been waiting
            if (!createCharts.attemptCount) {
                createCharts.attemptCount = 0;
            }
            createCharts.attemptCount++;
            
            // Stop trying after 50 attempts (5 seconds)
            if (createCharts.attemptCount < 50) {
                setTimeout(() => createCharts(schedule), 100);
                return;
            } else {
                // Show error message if Chart.js couldn't load
                showChartLoadingError();
                return;
            }
        }
        
        // Reset attempt count for future calls
        createCharts.attemptCount = 0;
        
        try {
            createPaymentsChart(schedule);
            createBalanceChart(schedule);
        } catch (error) {
            console.error('Error creating charts:', error);
            showChartLoadingError();
        }
    }

    function showChartLoadingError() {
        // Show user-friendly message when charts can't be displayed
        const paymentsChartContainer = document.getElementById('payment-chart');
        const balanceChartContainer = document.getElementById('balance-chart');
        
        if (paymentsChartContainer) {
            paymentsChartContainer.innerHTML = `
                <h3>📈 Структура платежів по часу</h3>
                <div style="padding: 20px; text-align: center; color: #666; border: 1px dashed #ccc; border-radius: 5px;">
                    📊 Графік тимчасово недоступний. Усі розрахунки виконані коректно і показані в таблиці нижче.
                </div>
            `;
        }
        
        if (balanceChartContainer) {
            balanceChartContainer.innerHTML = `
                <h3>📉 Зменшення залишку боргу</h3>
                <div style="padding: 20px; text-align: center; color: #666; border: 1px dashed #ccc; border-radius: 5px;">
                    📊 Графік тимчасово недоступний. Усі розрахунки виконані коректно і показані в таблиці нижче.
                </div>
            `;
        }
    }

    function createPaymentsChart(schedule) {
        const ctx = document.getElementById('paymentsChart').getContext('2d');
        
        // Sample data (every 6th payment to keep chart readable)
        const step = Math.max(1, Math.floor(schedule.schedule.length / 50));
        const labels = [];
        const principalData = [];
        const interestData = [];
        
        for (let i = 0; i < schedule.schedule.length; i += step) {
            const payment = schedule.schedule[i];
            labels.push(`${payment.paymentNumber}`);
            principalData.push(payment.principal);
            interestData.push(payment.interest);
        }

        if (window.paymentsChart && typeof window.paymentsChart.destroy === 'function') {
            window.paymentsChart.destroy();
        }

        window.paymentsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Основний борг',
                        data: principalData,
                        backgroundColor: '#157aff',
                        stack: 'payments'
                    },
                    {
                        label: 'Відсотки',
                        data: interestData,
                        backgroundColor: '#ffc107',
                        stack: 'payments'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Номер платежу'
                        }
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Сума (₴)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₴' + (value / 1000).toFixed(0) + 'K';
                            }
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

    function createBalanceChart(schedule) {
        const ctx = document.getElementById('balanceChart').getContext('2d');
        
        const step = Math.max(1, Math.floor(schedule.schedule.length / 100));
        const labels = [];
        const balanceData = [];
        
        for (let i = 0; i < schedule.schedule.length; i += step) {
            const payment = schedule.schedule[i];
            labels.push(payment.date.toLocaleDateString('uk-UA', { month: 'short', year: 'numeric' }));
            balanceData.push(payment.balance);
        }

        if (window.balanceChart && typeof window.balanceChart.destroy === 'function') {
            window.balanceChart.destroy();
        }

        window.balanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Залишок боргу',
                    data: balanceData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Дата'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Залишок (₴)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₴' + (value / 1000).toFixed(0) + 'K';
                            }
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
                                return 'Залишок: ₴' + 
                                    context.parsed.y.toLocaleString('uk-UA', { maximumFractionDigits: 0 });
                            }
                        }
                    }
                }
            }
        });
    }

    function createAmortizationTable(schedule) {
        const tbody = document.getElementById('payment-schedule');
        tbody.innerHTML = '';

        schedule.schedule.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.paymentNumber}</td>
                <td>${payment.date.toLocaleDateString('uk-UA')}</td>
                <td>₴${payment.totalPayment.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}</td>
                <td>₴${payment.principal.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}</td>
                <td>₴${payment.interest.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}</td>
                <td class="${payment.extraPayment > 0 ? 'extra-payment' : ''}">
                    ₴${payment.extraPayment.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}
                </td>
                <td>₴${payment.balance.toLocaleString('uk-UA', { maximumFractionDigits: 0 })}</td>
            `;
            tbody.appendChild(row);
        });

        updateTableDisplay();
    }

    function updateTableDisplay() {
        const showRows = document.getElementById('show-rows').value;
        const rows = document.querySelectorAll('#payment-schedule tr');
        
        rows.forEach((row, index) => {
            if (showRows === 'all' || index < parseInt(showRows)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function exportToCSV() {
        const table = document.getElementById('amortization-table');
        const rows = table.querySelectorAll('tr');
        let csv = '';
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            const rowData = Array.from(cells).map(cell => 
                '"' + cell.textContent.replace(/"/g, '""') + '"'
            );
            csv += rowData.join(',') + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'amortization_schedule.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function printTable() {
        const printWindow = window.open('', '_blank');
        const table = document.getElementById('amortization-table').outerHTML;
        const styles = `
            <style>
                table { border-collapse: collapse; width: 100%; font-size: 12px; }
                th, td { border: 1px solid #ddd; padding: 4px; text-align: right; }
                th { background-color: #f2f2f2; }
                .extra-payment { background-color: #d4edda; }
            </style>
        `;
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Графік амортизації кредиту</title>
                    ${styles}
                </head>
                <body>
                    <h2>Графік амортизації кредиту</h2>
                    ${table}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    // Load Chart.js if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.async = false; // Load synchronously to avoid timing issues
        script.onload = function() {
            console.log('Chart.js loaded successfully');
        };
        script.onerror = function() {
            console.error('Failed to load Chart.js from jsdelivr, trying unpkg fallback');
            // Try alternative CDN
            const fallbackScript = document.createElement('script');
            fallbackScript.src = 'https://unpkg.com/chart.js/dist/chart.min.js';
            fallbackScript.async = false;
            fallbackScript.onload = function() {
                console.log('Chart.js loaded successfully from unpkg fallback');
            };
            fallbackScript.onerror = function() {
                console.error('Failed to load Chart.js from all CDNs. Charts will not be displayed.');
            };
            document.head.appendChild(fallbackScript);
        };
        document.head.appendChild(script);
    }
});