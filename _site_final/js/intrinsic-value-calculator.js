// Intrinsic Value Calculator JavaScript
function calculateIntrinsicValue() {
    // Get input values
    const currentPrice = parseFloat(document.getElementById('currentPrice').value) || 100;
    const annualEarnings = parseFloat(document.getElementById('annualEarnings').value) || 5;
    const growthRate = parseFloat(document.getElementById('growthRate').value) || 8;
    const discountRate = parseFloat(document.getElementById('discountRate').value) || 10;
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) || 3;
    const bookValue = parseFloat(document.getElementById('bookValue').value) || 50;
    const peIndustry = parseFloat(document.getElementById('peIndustry').value) || 15;

    // Validate inputs
    if (discountRate <= growthRate) {
        alert('⚠️ Ставка дисконтування повинна бути більшою за темп зростання!');
        return;
    }

    // Calculate different intrinsic values
    const dcfValue = calculateDCF(annualEarnings, growthRate, discountRate);
    const peValue = calculatePEValue(annualEarnings, peIndustry);
    const dividendValue = calculateDividendValue(currentPrice, dividendYield, growthRate, discountRate);
    const averageValue = (dcfValue + peValue + dividendValue) / 3;

    // Calculate metrics
    const currentPE = currentPrice / annualEarnings;
    const marginOfSafety = ((averageValue - currentPrice) / averageValue * 100);
    
    // Determine recommendation
    const recommendation = getRecommendation(marginOfSafety);

    // Display results
    displayResults({
        currentPrice,
        dcfValue,
        peValue,
        dividendValue,
        averageValue,
        bookValue,
        currentPE,
        peIndustry,
        marginOfSafety,
        recommendation
    });

    // Update chart if available
    updateValuationChart({
        currentPrice,
        dcfValue,
        peValue,
        dividendValue,
        averageValue
    });
}

function calculateDCF(eps, growthRate, discountRate) {
    // Simplified DCF calculation using earnings as proxy for FCF
    // DCF = EPS × (1 + g) / (r - g)
    const g = growthRate / 100;
    const r = discountRate / 100;
    
    return eps * (1 + g) / (r - g);
}

function calculatePEValue(eps, peRatio) {
    // Fair value based on industry P/E ratio
    return eps * peRatio;
}

function calculateDividendValue(price, dividendYield, growthRate, discountRate) {
    // Gordon Growth Model for dividend-paying stocks
    // V = D1 / (r - g)
    const currentDividend = price * (dividendYield / 100);
    const nextDividend = currentDividend * (1 + growthRate / 100);
    const g = growthRate / 100;
    const r = discountRate / 100;
    
    if (r <= g) return price; // Return current price if invalid inputs
    
    return nextDividend / (r - g);
}

function getRecommendation(marginOfSafety) {
    if (marginOfSafety >= 25) {
        return {
            text: 'Сильна Покупка 🟢',
            class: 'success',
            description: 'Акція значно недооцінена, висока межа безпеки'
        };
    } else if (marginOfSafety >= 10) {
        return {
            text: 'Покупка 🟡',
            class: 'warning', 
            description: 'Акція недооцінена з помірною межею безпеки'
        };
    } else if (marginOfSafety >= -10) {
        return {
            text: 'Утримання ⚪',
            class: 'info',
            description: 'Акція справедливо оцінена'
        };
    } else {
        return {
            text: 'Продаж 🔴',
            class: 'warning',
            description: 'Акція переоцінена, рекомендується продаж'
        };
    }
}

function displayResults(data) {
    const resultsHTML = `
        <div class="results-container">
            <h3>📊 Результати оцінки</h3>
            
            <div class="insight-cards">
                <div class="insight-card ${data.recommendation.class}">
                    <h4>📈 Інвестиційна рекомендація</h4>
                    <div class="value-large">${data.recommendation.text}</div>
                    <p>${data.recommendation.description}</p>
                </div>
                
                <div class="insight-card info">
                    <h4>💰 Середня справедлива вартість</h4>
                    <div class="value-large">$${data.averageValue.toFixed(2)}</div>
                    <p>Середнє значення всіх методів оцінки</p>
                </div>
                
                <div class="insight-card ${data.marginOfSafety >= 0 ? 'success' : 'warning'}">
                    <h4>🛡️ Межа безпеки</h4>
                    <div class="value-large">${data.marginOfSafety.toFixed(1)}%</div>
                    <p>Різниця між справедливою та ринковою ціною</p>
                </div>
            </div>

            <div class="detailed-results">
                <h4>🔍 Детальний аналіз методів оцінки</h4>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Метод оцінки</th>
                            <th>Справедлива вартість</th>
                            <th>Відхилення від ринку</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>📊 DCF модель</td>
                            <td>$${data.dcfValue.toFixed(2)}</td>
                            <td>${((data.dcfValue - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>📈 P/E оцінка</td>
                            <td>$${data.peValue.toFixed(2)}</td>
                            <td>${((data.peValue - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>💵 Дивідендна модель</td>
                            <td>$${data.dividendValue.toFixed(2)}</td>
                            <td>${((data.dividendValue - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%</td>
                        </tr>
                    </tbody>
                </table>

                <div class="metrics-grid">
                    <div class="metric-item">
                        <strong>Поточна P/E:</strong> ${data.currentPE.toFixed(1)}x
                    </div>
                    <div class="metric-item">
                        <strong>Галузева P/E:</strong> ${data.peIndustry.toFixed(1)}x
                    </div>
                    <div class="metric-item">
                        <strong>Балансова вартість:</strong> $${data.bookValue.toFixed(2)}
                    </div>
                    <div class="metric-item">
                        <strong>P/B коефіцієнт:</strong> ${(data.currentPrice / data.bookValue).toFixed(2)}x
                    </div>
                </div>

                <div class="interpretation">
                    <h5>💡 Інтерпретація результатів</h5>
                    <ul>
                        ${data.marginOfSafety >= 25 ? 
                            `<li>✅ Висока межа безпеки свідчить про привабливу інвестиційну можливість</li>` : ''}
                        ${data.currentPE < data.peIndustry ? 
                            `<li>📊 P/E коефіцієнт нижче галузевого - можлива недооцінка</li>` : 
                            `<li>📊 P/E коефіцієнт вище галузевого - можлива переоцінка</li>`}
                        ${(data.currentPrice / data.bookValue) < 1.5 ? 
                            `<li>📚 Помірний P/B коефіцієнт вказує на розумну оцінку активів</li>` : ''}
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}

function updateValuationChart(data) {
    const canvas = document.getElementById('valuationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 600;
    const height = canvas.height = 400;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Chart data with Ukrainian labels
    const values = [
        { label: 'Поточна ціна', value: data.currentPrice, color: '#e74c3c' },
        { label: 'DCF вартість', value: data.dcfValue, color: '#3498db' },
        { label: 'P/E вартість', value: data.peValue, color: '#2ecc71' },
        { label: 'Дивідендна вартість', value: data.dividendValue, color: '#f39c12' },
        { label: 'Середня вартість', value: data.averageValue, color: '#9b59b6' }
    ];

    const maxValue = Math.max(...values.map(v => v.value)) * 1.1;
    const barWidth = 80;
    const barSpacing = 100;
    const chartHeight = 300;
    const chartTop = 50;

    // Draw bars
    values.forEach((item, index) => {
        const x = 50 + index * barSpacing;
        const barHeight = (item.value / maxValue) * chartHeight;
        const y = chartTop + chartHeight - barHeight;

        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw value label
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`$${item.value.toFixed(0)}`, x + barWidth/2, y - 10);

        // Draw method label
        ctx.fillText(item.label, x + barWidth/2, chartTop + chartHeight + 20);
    });

    // Draw title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Порівняння методів оцінки', width/2, 30);
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set initial calculation if elements exist
    if (document.getElementById('currentPrice')) {
        calculateIntrinsicValue();
    }
});