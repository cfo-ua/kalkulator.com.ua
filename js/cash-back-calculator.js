// Cash Back Calculator JavaScript (Ukrainian Version)
function calculateCashBack() {
    // Get input values
    const cardAnnualFee = parseFloat(document.getElementById('cardAnnualFee').value) || 0;
    const totalSpending = parseFloat(document.getElementById('totalSpending').value) || 720000; // 60,000 UAH/month default
    
    // Category spending amounts
    const categories = {
        groceries: parseFloat(document.getElementById('groceriesSpending').value) || 108000,
        gas: parseFloat(document.getElementById('gasSpending').value) || 72000,
        dining: parseFloat(document.getElementById('diningSpending').value) || 72000,
        travel: parseFloat(document.getElementById('travelSpending').value) || 36000,
        online: parseFloat(document.getElementById('onlineSpending').value) || 54000,
        other: 0 // Will be calculated
    };
    
    // Category cash back rates (%)
    const rates = {
        groceries: parseFloat(document.getElementById('groceriesRate').value) || 3,
        gas: parseFloat(document.getElementById('gasRate').value) || 3,
        dining: parseFloat(document.getElementById('diningRate').value) || 2,
        travel: parseFloat(document.getElementById('travelRate').value) || 2,
        online: parseFloat(document.getElementById('onlineRate').value) || 1.5,
        other: parseFloat(document.getElementById('otherRate').value) || 1
    };
    
    // Calculate other spending
    const categorizedSpending = categories.groceries + categories.gas + categories.dining + 
                               categories.travel + categories.online;
    categories.other = Math.max(0, totalSpending - categorizedSpending);
    
    // Calculate cash back for each category
    const cashBack = {};
    let totalCashBack = 0;
    
    Object.keys(categories).forEach(category => {
        cashBack[category] = (categories[category] * rates[category]) / 100;
        totalCashBack += cashBack[category];
    });
    
    // Calculate net benefit
    const netAnnualBenefit = totalCashBack - cardAnnualFee;
    const effectiveRate = (totalCashBack / totalSpending) * 100;
    const monthlyBenefit = netAnnualBenefit / 12;
    
    // Break-even analysis
    const breakEvenSpending = cardAnnualFee / (effectiveRate / 100);
    
    // Optimization recommendations
    const optimization = generateOptimization(categories, rates, totalSpending);
    
    // Display results
    displayCashBackResults({
        categories,
        rates,
        cashBack,
        totalSpending,
        totalCashBack,
        cardAnnualFee,
        netAnnualBenefit,
        effectiveRate,
        monthlyBenefit,
        breakEvenSpending,
        optimization
    });
    
    // Update chart
    updateCashBackChart(cashBack, categories);
}

function generateOptimization(categories, rates, totalSpending) {
    const recommendations = [];
    
    // Check for high-rate categories with low spending
    if (categories.groceries < 90000 && rates.groceries >= 3) {
        recommendations.push({
            type: 'increase',
            category: 'Продукти',
            message: 'Розгляньте можливість більшого використання цієї картки для покупки продуктів, щоб максимізувати винагороди 3%+',
            potential: ((90000 - categories.groceries) * rates.groceries / 100).toFixed(0)
        });
    }
    
    if (categories.gas < 60000 && rates.gas >= 3) {
        recommendations.push({
            type: 'increase',
            category: 'Паливо',
            message: 'Максимізуйте покупки палива на цій картці для більших винагород',
            potential: ((60000 - categories.gas) * rates.gas / 100).toFixed(0)
        });
    }
    
    // Check for low-rate categories with high spending
    if (categories.other > 90000 && rates.other <= 1) {
        recommendations.push({
            type: 'alternative',
            category: 'Інші покупки',
            message: 'Розгляньте іншу картку для загальних покупок для збільшення винагород',
            potential: (categories.other * 0.015).toFixed(0) // Potential with 1.5% card
        });
    }
    
    // Effective rate assessment
    const effectiveRate = ((categories.groceries * rates.groceries + 
                           categories.gas * rates.gas + 
                           categories.dining * rates.dining + 
                           categories.travel * rates.travel + 
                           categories.online * rates.online + 
                           categories.other * rates.other) / 100) / totalSpending * 100;
    
    if (effectiveRate < 1.5) {
        recommendations.push({
            type: 'strategy',
            category: 'Загальна стратегія',
            message: 'Ваша ефективна ставка нижче 1.5%. Розгляньте оптимізацію витрат за категоріями',
            potential: (totalSpending * 0.02 - totalSpending * effectiveRate / 100).toFixed(0)
        });
    }
    
    return recommendations;
}

function displayCashBackResults(data) {
    const categoryLabels = {
        groceries: 'Продукти',
        gas: 'Паливо',
        dining: 'Ресторани',
        travel: 'Подорожі',
        online: 'Онлайн покупки',
        other: 'Інші покупки'
    };
    
    // Generate category breakdown table
    let categoryRows = '';
    Object.keys(data.categories).forEach(category => {
        const spending = data.categories[category];
        const rate = data.rates[category];
        const cashback = data.cashBack[category];
        const percentage = (spending / data.totalSpending * 100);
        
        categoryRows += `
            <tr class="${category === 'other' ? 'other-spending' : ''}">
                <td>${categoryLabels[category]}</td>
                <td>₴${spending.toFixed(0)}</td>
                <td>${rate.toFixed(1)}%</td>
                <td>₴${cashback.toFixed(0)}</td>
                <td>${percentage.toFixed(1)}%</td>
            </tr>
        `;
    });
    
    const resultsHTML = `
        <div class="results-container">
            <h3>💳 Аналіз повернення коштів</h3>
            
            <div class="insight-cards">
                <div class="insight-card ${data.netAnnualBenefit >= 0 ? 'success' : 'warning'}">
                    <h4>💰 Чиста річна вигода</h4>
                    <div class="value-large">₴${data.netAnnualBenefit.toFixed(0)}</div>
                    <p>Після ₴${data.cardAnnualFee} річної плати</p>
                </div>
                
                <div class="insight-card info">
                    <h4>📊 Ефективна ставка повернення</h4>
                    <div class="value-large">${data.effectiveRate.toFixed(2)}%</div>
                    <p>Зважене середнє по всіх витратах</p>
                </div>
                
                <div class="insight-card success">
                    <h4>📅 Місячна вигода</h4>
                    <div class="value-large">₴${data.monthlyBenefit.toFixed(0)}</div>
                    <p>Середня місячна вартість повернення коштів</p>
                </div>
            </div>

            <div class="detailed-results">
                <h4>🔍 Розбивка за категоріями</h4>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Категорія</th>
                            <th>Річні витрати</th>
                            <th>Ставка повернення</th>
                            <th>Річні винагороди</th>
                            <th>% від загальних</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${categoryRows}
                        <tr class="totals-row">
                            <td><strong>Всього</strong></td>
                            <td><strong>₴${data.totalSpending.toFixed(0)}</strong></td>
                            <td><strong>${data.effectiveRate.toFixed(2)}%</strong></td>
                            <td><strong>₴${data.totalCashBack.toFixed(0)}</strong></td>
                            <td><strong>100.0%</strong></td>
                        </tr>
                    </tbody>
                </table>

                <div class="annual-projection">
                    <h5>📈 Річний прогноз</h5>
                    <div class="projection-grid">
                        <div class="projection-item">
                            <div class="label">Загальне повернення</div>
                            <div class="value">₴${data.totalCashBack.toFixed(0)}</div>
                        </div>
                        <div class="projection-item">
                            <div class="label">Річна плата</div>
                            <div class="value">-₴${data.cardAnnualFee.toFixed(0)}</div>
                        </div>
                        <div class="projection-item positive">
                            <div class="label">Чиста вигода</div>
                            <div class="value">₴${data.netAnnualBenefit.toFixed(0)}</div>
                        </div>
                        <div class="projection-item">
                            <div class="label">Точка беззбитковості</div>
                            <div class="value">₴${data.breakEvenSpending.toFixed(0)}</div>
                        </div>
                    </div>
                </div>

                ${data.optimization.length > 0 ? `
                <div class="recommendations">
                    <h5>🎯 Рекомендації з оптимізації</h5>
                    <ul>
                        ${data.optimization.map(rec => `
                            <li class="recommendation ${rec.type === 'increase' ? 'success' : rec.type === 'alternative' ? 'improvement' : 'warning'}">
                                <strong>${rec.category}:</strong> ${rec.message}
                                ${rec.potential ? ` (Потенціал: +₴${rec.potential} річно)` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="interpretation">
                    <h5>💡 Аналітичні висновки</h5>
                    <ul>
                        <li>💳 <strong>Цінність картки:</strong> ${data.netAnnualBenefit >= 3000 ? 'Відмінна цінність для вашої моделі витрат' : 
                            data.netAnnualBenefit >= 0 ? 'Хороша цінність, покриває річну плату' : 
                            'Розгляньте, чи виправдана річна плата'}</li>
                        <li>📊 <strong>Ефективна ставка:</strong> ${data.effectiveRate >= 2 ? 'Відмінна' : 
                            data.effectiveRate >= 1.5 ? 'Хороша' : 'Нижче середньої'} загальна дохідність</li>
                        <li>🎯 <strong>Оптимізація:</strong> Зосередьте витрати на ${data.effectiveRate >= 2 ? 'підтриманні поточних' : 'вищих ставок'} категоріях</li>
                        <li>💰 <strong>Місячна цінність:</strong> Ця картка забезпечує приблизно ₴${data.monthlyBenefit.toFixed(0)} місячних переваг</li>
                        ${data.effectiveRate >= 2.5 ? 
                            '<li>⭐ <strong>Відмінний вибір:</strong> Ця картка добре підходить до ваших витратних звичок</li>' : 
                            data.effectiveRate < 1 ? 
                            '<li>⚠️ <strong>Розгляньте альтернативи:</strong> Інша картка може запропонувати кращі винагороди</li>' : 
                            '<li>✅ <strong>Прийнятна цінність:</strong> Картка забезпечує розумні винагороди за ваші витрати</li>'}
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.getElementById('cash-back-result').innerHTML = resultsHTML;
}

function updateCashBackChart(cashBack, categories) {
    const canvas = document.getElementById('cashBackChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 500;
    const height = canvas.height = 400;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate total for percentages
    const total = Object.values(cashBack).reduce((sum, value) => sum + value, 0);
    
    // Colors for each category
    const colors = {
        groceries: '#e74c3c',
        gas: '#3498db',
        dining: '#2ecc71',
        travel: '#f39c12',
        online: '#9b59b6',
        other: '#95a5a6'
    };
    
    // Category labels in Ukrainian
    const labels = {
        groceries: 'Продукти',
        gas: 'Паливо',
        dining: 'Ресторани',
        travel: 'Подорожі',
        online: 'Онлайн',
        other: 'Інше'
    };
    
    // Draw pie chart
    const centerX = width / 2;
    const centerY = height / 2 - 20;
    const radius = 120;
    
    let currentAngle = -Math.PI / 2; // Start at top
    
    Object.keys(cashBack).forEach(category => {
        if (cashBack[category] > 0) {
            const sliceAngle = (cashBack[category] / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.fillStyle = colors[category];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
            
            const percentage = (cashBack[category] / total * 100).toFixed(1);
            
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${labels[category]}`, labelX, labelY);
            ctx.fillText(`₴${cashBack[category].toFixed(0)} (${percentage}%)`, labelX, labelY + 15);
            
            currentAngle += sliceAngle;
        }
    });
    
    // Draw title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Розподіл річного повернення коштів', centerX, 30);
    ctx.fillText(`Всього: ₴${total.toFixed(0)}`, centerX, height - 20);
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#cash-back-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateCashBack();
        });
    }
});