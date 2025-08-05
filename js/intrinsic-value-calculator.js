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
    const isUkrainian = !window.location.pathname.includes('/en/');
    
    const resultsHTML = `
        <div class="results-container">
            <h3>📊 ${isUkrainian ? 'Результати оцінки' : 'Valuation Results'}</h3>
            
            <div class="insight-cards">
                <div class="insight-card ${data.recommendation.class}">
                    <h4>📈 ${isUkrainian ? 'Інвестиційна рекомендація' : 'Investment Recommendation'}</h4>
                    <div class="value-large">${data.recommendation.text}</div>
                    <p>${data.recommendation.description}</p>
                </div>
                
                <div class="insight-card info">
                    <h4>💰 ${isUkrainian ? 'Середня справедлива вартість' : 'Average Fair Value'}</h4>
                    <div class="value-large">$${data.averageValue.toFixed(2)}</div>
                    <p>${isUkrainian ? 'Середнє значення всіх методів оцінки' : 'Average of all valuation methods'}</p>
                </div>
                
                <div class="insight-card ${data.marginOfSafety >= 0 ? 'success' : 'warning'}">
                    <h4>🛡️ ${isUkrainian ? 'Межа безпеки' : 'Margin of Safety'}</h4>
                    <div class="value-large">${data.marginOfSafety.toFixed(1)}%</div>
                    <p>${isUkrainian ? 'Різниця між справедливою та ринковою ціною' : 'Difference between fair and market price'}</p>
                </div>
            </div>

            <div class="detailed-results">
                <h4>🔍 ${isUkrainian ? 'Детальний аналіз методів оцінки' : 'Detailed Valuation Analysis'}</h4>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>${isUkrainian ? 'Метод оцінки' : 'Valuation Method'}</th>
                            <th>${isUkrainian ? 'Справедлива вартість' : 'Fair Value'}</th>
                            <th>${isUkrainian ? 'Відхилення від ринку' : 'Market Deviation'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>📊 DCF ${isUkrainian ? 'модель' : 'Model'}</td>
                            <td>$${data.dcfValue.toFixed(2)}</td>
                            <td>${((data.dcfValue - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>📈 P/E ${isUkrainian ? 'оцінка' : 'Valuation'}</td>
                            <td>$${data.peValue.toFixed(2)}</td>
                            <td>${((data.peValue - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>💵 ${isUkrainian ? 'Дивідендна модель' : 'Dividend Model'}</td>
                            <td>$${data.dividendValue.toFixed(2)}</td>
                            <td>${((data.dividendValue - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%</td>
                        </tr>
                    </tbody>
                </table>

                <div class="metrics-grid">
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Поточна P/E' : 'Current P/E'}:</strong> ${data.currentPE.toFixed(1)}x
                    </div>
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Галузева P/E' : 'Industry P/E'}:</strong> ${data.peIndustry.toFixed(1)}x
                    </div>
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Балансова вартість' : 'Book Value'}:</strong> $${data.bookValue.toFixed(2)}
                    </div>
                    <div class="metric-item">
                        <strong>P/B ${isUkrainian ? 'коефіцієнт' : 'Ratio'}:</strong> ${(data.currentPrice / data.bookValue).toFixed(2)}x
                    </div>
                </div>

                <div class="interpretation">
                    <h5>💡 ${isUkrainian ? 'Інтерпретація результатів' : 'Results Interpretation'}</h5>
                    <ul>
                        ${data.marginOfSafety >= 25 ? 
                            `<li>✅ ${isUkrainian ? 'Висока межа безпеки свідчить про привабливу інвестиційну можливість' : 'High margin of safety indicates attractive investment opportunity'}</li>` : ''}
                        ${data.currentPE < data.peIndustry ? 
                            `<li>📊 ${isUkrainian ? 'P/E коефіцієнт нижче галузевого - можлива недооцінка' : 'P/E ratio below industry average - possible undervaluation'}</li>` : 
                            `<li>📊 ${isUkrainian ? 'P/E коефіцієнт вище галузевого - можлива переоцінка' : 'P/E ratio above industry average - possible overvaluation'}</li>`}
                        ${(data.currentPrice / data.bookValue) < 1.5 ? 
                            `<li>📚 ${isUkrainian ? 'Помірний P/B коефіцієнт вказує на розумну оцінку активів' : 'Moderate P/B ratio indicates reasonable asset valuation'}</li>` : ''}
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
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart data
    const values = [
        { label: 'Current Price', value: data.currentPrice, color: '#157aff' },
        { label: 'DCF Value', value: data.dcfValue, color: '#28a745' },
        { label: 'P/E Value', value: data.peValue, color: '#17a2b8' },
        { label: 'Dividend Value', value: data.dividendValue, color: '#ffc107' },
        { label: 'Average Value', value: data.averageValue, color: '#dc3545' }
    ];

    const maxValue = Math.max(...values.map(v => v.value)) * 1.1;
    const barWidth = width / values.length * 0.8;
    const barSpacing = width / values.length * 0.2;

    // Draw bars
    values.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 60);
        const x = index * (barWidth + barSpacing) + barSpacing / 2;
        const y = height - barHeight - 30;

        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw value on top
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('$' + item.value.toFixed(0), x + barWidth/2, y - 5);

        // Draw label
        ctx.fillText(item.label, x + barWidth/2, height - 10);
    });
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set initial calculation if elements exist
    if (document.getElementById('currentPrice')) {
        calculateIntrinsicValue();
    }
});