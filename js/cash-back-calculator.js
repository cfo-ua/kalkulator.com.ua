// Cash Back Calculator JavaScript
function calculateCashback() {
    // Get input values
    const monthlySpending = parseFloat(document.getElementById('monthlySpending').value) || 3000;
    const annualFee = parseFloat(document.getElementById('annualFee').value) || 0;

    // Get category data
    const categories = [
        {
            name: 'Groceries',
            nameUa: 'Продукти',
            amount: parseFloat(document.getElementById('groceryAmount').value) || 800,
            cashback: parseFloat(document.getElementById('groceryCashback').value) || 2.0,
            emoji: '🛒'
        },
        {
            name: 'Gas',
            nameUa: 'Паливо',
            amount: parseFloat(document.getElementById('fuelAmount').value) || 400,
            cashback: parseFloat(document.getElementById('fuelCashback').value) || 5.0,
            emoji: '⛽'
        },
        {
            name: 'Restaurants',
            nameUa: 'Ресторани',
            amount: parseFloat(document.getElementById('restaurantAmount').value) || 600,
            cashback: parseFloat(document.getElementById('restaurantCashback').value) || 3.0,
            emoji: '🍽️'
        },
        {
            name: 'Online',
            nameUa: 'Онлайн',
            amount: parseFloat(document.getElementById('onlineAmount').value) || 700,
            cashback: parseFloat(document.getElementById('onlineCashback').value) || 1.5,
            emoji: '🛍️'
        },
        {
            name: 'Utilities',
            nameUa: 'Комунальні',
            amount: parseFloat(document.getElementById('utilitiesAmount').value) || 500,
            cashback: parseFloat(document.getElementById('utilitiesCashback').value) || 1.0,
            emoji: '🏠'
        }
    ];

    // Calculate cashback for each category
    const results = categories.map(category => {
        const monthlyCashback = (category.amount * category.cashback) / 100;
        const annualCashback = monthlyCashback * 12;
        return {
            ...category,
            monthlyCashback,
            annualCashback
        };
    });

    // Calculate totals
    const totalCategorySpending = results.reduce((sum, cat) => sum + cat.amount, 0);
    const otherSpending = Math.max(0, monthlySpending - totalCategorySpending);
    const totalMonthlyCashback = results.reduce((sum, cat) => sum + cat.monthlyCashback, 0);
    const totalAnnualCashback = totalMonthlyCashback * 12;
    const netAnnualCashback = totalAnnualCashback - annualFee;
    
    // Calculate effective cashback rate
    const effectiveRate = (totalMonthlyCashback / monthlySpending) * 100;
    
    // Calculate break-even analysis
    const monthsToBreakEven = annualFee > 0 ? Math.ceil(annualFee / totalMonthlyCashback) : 0;
    
    // Generate recommendations
    const recommendations = generateRecommendations(results, effectiveRate, netAnnualCashback);

    // Display results
    displayResults({
        results,
        totalCategorySpending,
        otherSpending,
        monthlySpending,
        totalMonthlyCashback,
        totalAnnualCashback,
        netAnnualCashback,
        annualFee,
        effectiveRate,
        monthsToBreakEven,
        recommendations
    });

    // Update chart
    updateCashbackChart(results);
}

function generateRecommendations(results, effectiveRate, netCashback) {
    const recommendations = [];
    const isUkrainian = !window.location.pathname.includes('/en/');

    // Check for low cashback rates
    const lowCashbackCategories = results.filter(cat => cat.cashback < 2.0 && cat.amount > 200);
    if (lowCashbackCategories.length > 0) {
        recommendations.push({
            type: 'improvement',
            text: isUkrainian ? 
                `Розгляньте карти з вищим кешбеком для категорій: ${lowCashbackCategories.map(c => c.nameUa).join(', ')}` :
                `Consider cards with higher cashback for: ${lowCashbackCategories.map(c => c.name).join(', ')}`,
            priority: 'high'
        });
    }

    // Check for high annual fee vs cashback
    if (netCashback < 0) {
        recommendations.push({
            type: 'warning',
            text: isUkrainian ? 
                'Річна плата перевищує кешбек. Розгляньте безплатні карти' :
                'Annual fee exceeds cashback. Consider no-fee cards',
            priority: 'high'
        });
    }

    // Check for good optimization opportunities
    const highSpendingCategories = results.filter(cat => cat.amount > 500);
    if (highSpendingCategories.length > 0) {
        recommendations.push({
            type: 'optimization',
            text: isUkrainian ? 
                'Фокусуйтеся на максимізації кешбеку в категоріях з найбільшими витратами' :
                'Focus on maximizing cashback in your highest spending categories',
            priority: 'medium'
        });
    }

    // Overall performance assessment
    if (effectiveRate >= 3.0) {
        recommendations.push({
            type: 'success',
            text: isUkrainian ? 
                'Відмінна стратегія кешбеку! Ваша ефективна ставка вище середньої' :
                'Excellent cashback strategy! Your effective rate is above average',
            priority: 'low'
        });
    } else if (effectiveRate < 1.5) {
        recommendations.push({
            type: 'improvement',
            text: isUkrainian ? 
                'Є можливості для покращення. Розгляньте спеціалізовані карти для кожної категорії' :
                'Room for improvement. Consider specialized cards for each category',
            priority: 'medium'
        });
    }

    return recommendations;
}

function displayResults(data) {
    const isUkrainian = !window.location.pathname.includes('/en/');
    const currency = isUkrainian ? 'грн' : '$';
    
    const resultsHTML = `
        <div class="results-container">
            <h3>💰 ${isUkrainian ? 'Результати розрахунку кешбеку' : 'Cashback Calculation Results'}</h3>
            
            <div class="insight-cards">
                <div class="insight-card ${data.netAnnualCashback > 0 ? 'success' : 'warning'}">
                    <h4>📈 ${isUkrainian ? 'Річний кешбек' : 'Annual Cashback'}</h4>
                    <div class="value-large">${data.netAnnualCashback.toFixed(0)} ${currency}</div>
                    <p>${isUkrainian ? 'Після вирахування річної плати' : 'After deducting annual fee'}</p>
                </div>
                
                <div class="insight-card info">
                    <h4>📊 ${isUkrainian ? 'Ефективна ставка' : 'Effective Rate'}</h4>
                    <div class="value-large">${data.effectiveRate.toFixed(2)}%</div>
                    <p>${isUkrainian ? 'Середній кешбек з усіх покупок' : 'Average cashback on all purchases'}</p>
                </div>
                
                <div class="insight-card ${data.totalMonthlyCashback >= 100 ? 'success' : 'info'}">
                    <h4>💳 ${isUkrainian ? 'Місячний кешбек' : 'Monthly Cashback'}</h4>
                    <div class="value-large">${data.totalMonthlyCashback.toFixed(0)} ${currency}</div>
                    <p>${isUkrainian ? 'Щомісячне повернення коштів' : 'Monthly cash return'}</p>
                </div>
            </div>

            <div class="detailed-results">
                <h4>📋 ${isUkrainian ? 'Детальний розподіл по категоріях' : 'Detailed Category Breakdown'}</h4>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>${isUkrainian ? 'Категорія' : 'Category'}</th>
                            <th>${isUkrainian ? 'Місячні витрати' : 'Monthly Spending'}</th>
                            <th>${isUkrainian ? '% кешбеку' : 'Cashback %'}</th>
                            <th>${isUkrainian ? 'Місячний кешбек' : 'Monthly Cashback'}</th>
                            <th>${isUkrainian ? 'Річний кешбек' : 'Annual Cashback'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.results.map(category => `
                            <tr>
                                <td>${category.emoji} ${isUkrainian ? category.nameUa : category.name}</td>
                                <td>${category.amount.toFixed(0)} ${currency}</td>
                                <td>${category.cashback.toFixed(1)}%</td>
                                <td>${category.monthlyCashback.toFixed(0)} ${currency}</td>
                                <td>${category.annualCashback.toFixed(0)} ${currency}</td>
                            </tr>
                        `).join('')}
                        ${data.otherSpending > 0 ? `
                            <tr class="other-spending">
                                <td>💼 ${isUkrainian ? 'Інші витрати' : 'Other Expenses'}</td>
                                <td>${data.otherSpending.toFixed(0)} ${currency}</td>
                                <td>0%</td>
                                <td>0 ${currency}</td>
                                <td>0 ${currency}</td>
                            </tr>
                        ` : ''}
                        <tr class="totals-row">
                            <td><strong>${isUkrainian ? 'Всього' : 'Total'}</strong></td>
                            <td><strong>${data.monthlySpending.toFixed(0)} ${currency}</strong></td>
                            <td><strong>${data.effectiveRate.toFixed(2)}%</strong></td>
                            <td><strong>${data.totalMonthlyCashback.toFixed(0)} ${currency}</strong></td>
                            <td><strong>${data.totalAnnualCashback.toFixed(0)} ${currency}</strong></td>
                        </tr>
                    </tbody>
                </table>

                <div class="metrics-grid">
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Загальні річні витрати' : 'Total Annual Spending'}:</strong> 
                        ${(data.monthlySpending * 12).toLocaleString()} ${currency}
                    </div>
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Річна плата за картку' : 'Annual Card Fee'}:</strong> 
                        ${data.annualFee.toFixed(0)} ${currency}
                    </div>
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Валовий річний кешбек' : 'Gross Annual Cashback'}:</strong> 
                        ${data.totalAnnualCashback.toFixed(0)} ${currency}
                    </div>
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Чистий річний кешбек' : 'Net Annual Cashback'}:</strong> 
                        ${data.netAnnualCashback.toFixed(0)} ${currency}
                    </div>
                </div>

                ${data.monthsToBreakEven > 0 ? `
                    <div class="break-even-analysis">
                        <h5>⏱️ ${isUkrainian ? 'Аналіз окупності' : 'Break-even Analysis'}</h5>
                        <p>${isUkrainian ? 
                            `Картка окупиться через ${data.monthsToBreakEven} ${data.monthsToBreakEven === 1 ? 'місяць' : 'місяців'}` :
                            `Card will pay for itself in ${data.monthsToBreakEven} month${data.monthsToBreakEven !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                ` : ''}

                ${data.recommendations.length > 0 ? `
                    <div class="recommendations">
                        <h5>💡 ${isUkrainian ? 'Рекомендації для оптимізації' : 'Optimization Recommendations'}</h5>
                        <ul>
                            ${data.recommendations.map(rec => `
                                <li class="recommendation ${rec.type}">
                                    ${rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : '💡'} 
                                    ${rec.text}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="annual-projection">
                    <h5>📈 ${isUkrainian ? 'Річна проекція' : 'Annual Projection'}</h5>
                    <div class="projection-grid">
                        <div class="projection-item positive">
                            <span class="label">${isUkrainian ? 'Заощадження від кешбеку' : 'Cashback Savings'}</span>
                            <span class="value">+${data.netAnnualCashback.toFixed(0)} ${currency}</span>
                        </div>
                        <div class="projection-item">
                            <span class="label">${isUkrainian ? 'Ефективна знижка' : 'Effective Discount'}</span>
                            <span class="value">${((data.netAnnualCashback / (data.monthlySpending * 12)) * 100).toFixed(2)}%</span>
                        </div>
                        <div class="projection-item">
                            <span class="label">${isUkrainian ? 'Можлива додаткова вигода' : 'Potential Additional Benefit'}</span>
                            <span class="value">${isUkrainian ? 'Інвестування кешбеку' : 'Investing cashback'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}

function updateCashbackChart(categories) {
    const canvas = document.getElementById('cashbackChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart configuration
    const margin = 40;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    
    // Colors for categories
    const colors = ['#157aff', '#28a745', '#ffc107', '#17a2b8', '#dc3545'];
    
    // Calculate total cashback for pie chart
    const totalCashback = categories.reduce((sum, cat) => sum + cat.monthlyCashback, 0);
    
    if (totalCashback === 0) return;

    // Draw pie chart
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(chartWidth, chartHeight) / 2 - 20;
    
    let currentAngle = -Math.PI / 2; // Start from top
    
    categories.forEach((category, index) => {
        if (category.monthlyCashback > 0) {
            const sliceAngle = (category.monthlyCashback / totalCashback) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 15);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 15);
            
            ctx.fillStyle = '#333';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(category.emoji, labelX, labelY);
            ctx.fillText(`${category.monthlyCashback.toFixed(0)}`, labelX, labelY + 12);
            
            currentAngle += sliceAngle;
        }
    });

    // Draw legend
    let legendY = 20;
    categories.forEach((category, index) => {
        if (category.monthlyCashback > 0) {
            // Color box
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(10, legendY, 12, 12);
            
            // Text
            ctx.fillStyle = '#333';
            ctx.font = '11px Arial';
            ctx.textAlign = 'left';
            const isUkrainian = !window.location.pathname.includes('/en/');
            ctx.fillText(`${isUkrainian ? category.nameUa : category.name}: ${category.cashback}%`, 25, legendY + 9);
            
            legendY += 16;
        }
    });
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Auto-calculate total spending when category amounts change
    const categoryInputs = ['groceryAmount', 'fuelAmount', 'restaurantAmount', 'onlineAmount', 'utilitiesAmount'];
    
    categoryInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateTotalSpending);
        }
    });
    
    // Set initial calculation if elements exist
    if (document.getElementById('monthlySpending')) {
        calculateCashback();
    }
});

function updateTotalSpending() {
    const categoryInputs = ['groceryAmount', 'fuelAmount', 'restaurantAmount', 'onlineAmount', 'utilitiesAmount'];
    let total = 0;
    
    categoryInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            total += parseFloat(input.value) || 0;
        }
    });
    
    const monthlySpendingInput = document.getElementById('monthlySpending');
    if (monthlySpendingInput && total > 0) {
        monthlySpendingInput.value = Math.max(total, parseFloat(monthlySpendingInput.value) || 0);
    }
}