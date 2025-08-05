// Cash Back Calculator JavaScript (Ukrainian Version)
function calculateCashback() {
    // Get input values
    const monthlySpending = parseFloat(document.getElementById('monthlySpending').value) || 15000;
    const totalSpending = monthlySpending * 12;
    const cardAnnualFee = parseFloat(document.getElementById('annualFee').value) || 0;
    
    // Category spending amounts
    const categories = {
        groceries: parseFloat(document.getElementById('groceryAmount').value) || 6000,
        gas: parseFloat(document.getElementById('fuelAmount').value) || 3000,
        dining: parseFloat(document.getElementById('restaurantAmount').value) || 2000,
        online: parseFloat(document.getElementById('onlineAmount').value) || 2500,
        utilities: parseFloat(document.getElementById('utilitiesAmount').value) || 1500,
        other: 0 // Will be calculated
    };
    
    // Category cash back rates (%)
    const rates = {
        groceries: parseFloat(document.getElementById('groceryCashback').value) || 2.0,
        gas: parseFloat(document.getElementById('fuelCashback').value) || 5.0,
        dining: parseFloat(document.getElementById('restaurantCashback').value) || 10.0,
        online: parseFloat(document.getElementById('onlineCashback').value) || 3.0,
        utilities: parseFloat(document.getElementById('utilitiesCashback').value) || 1.0,
        other: 1.0
    };
    
    // Calculate other spending (convert monthly amounts to annual)
    const annualCategories = {
        groceries: categories.groceries * 12,
        gas: categories.gas * 12,
        dining: categories.dining * 12,
        online: categories.online * 12,
        utilities: categories.utilities * 12,
        other: 0
    };
    
    const categorizedSpending = annualCategories.groceries + annualCategories.gas + annualCategories.dining + 
                               annualCategories.online + annualCategories.utilities;
    annualCategories.other = Math.max(0, totalSpending - categorizedSpending);
    
    // Calculate cash back for each category
    const cashBack = {};
    let totalCashBack = 0;
    
    Object.keys(annualCategories).forEach(category => {
        cashBack[category] = (annualCategories[category] * rates[category]) / 100;
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
        categories: annualCategories,
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
    updateCashBackChart(cashBack, annualCategories);
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
                           categories.online * rates.online +
                           categories.utilities * rates.utilities + 
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
        online: 'Онлайн покупки',
        utilities: 'Комунальні послуги',
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

    document.getElementById('results').innerHTML = resultsHTML;
}

function updateCashBackChart(cashBack, categories) {
    const canvas = document.getElementById('cashbackChart');
    if (!canvas) {
        console.error('Canvas element with id "cashbackChart" not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container while maintaining aspect ratio
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const aspectRatio = 500 / 400;
    
    let width = Math.min(containerWidth, 500);
    let height = width / aspectRatio;
    
    // Ensure minimum size for mobile
    if (width < 300) {
        width = 300;
        height = width / aspectRatio;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate total for percentages
    const total = Object.values(cashBack).reduce((sum, value) => sum + value, 0);
    
    // If no cash back, show a message
    if (total === 0) {
        ctx.fillStyle = '#666666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Немає даних для відображення', width / 2, height / 2);
        return;
    }
    
    // Colors for each category
    const colors = {
        groceries: '#e74c3c',
        gas: '#3498db',
        dining: '#2ecc71',
        online: '#9b59b6',
        utilities: '#f39c12',
        other: '#95a5a6'
    };
    
    // Category labels in Ukrainian
    const labels = {
        groceries: 'Продукти',
        gas: 'Паливо',
        dining: 'Ресторани',
        online: 'Онлайн',
        utilities: 'Комунальні',
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
    // Calculate with default values on page load
    calculateCashback();
    
    // Add event listeners to inputs for real-time updates
    const inputs = document.querySelectorAll('#monthlySpending, #groceryAmount, #groceryCashback, #fuelAmount, #fuelCashback, #restaurantAmount, #restaurantCashback, #onlineAmount, #onlineCashback, #utilitiesAmount, #utilitiesCashback, #annualFee');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Debounce the calculation to avoid too frequent updates
            clearTimeout(this.calcTimeout);
            this.calcTimeout = setTimeout(calculateCashback, 500);
        });
    });
    
    const form = document.querySelector('#cash-back-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateCashback();
        });
    }
});