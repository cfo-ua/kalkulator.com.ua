// Margin of Safety Calculator JavaScript
function calculateMarginOfSafety() {
    // Get input values
    const intrinsicValue = parseFloat(document.getElementById('intrinsicValue').value) || 150;
    const marketPrice = parseFloat(document.getElementById('marketPrice').value) || 100;
    const sharesQuantity = parseInt(document.getElementById('sharesQuantity').value) || 100;
    const targetMargin = parseFloat(document.getElementById('targetMargin').value) || 25;
    const riskTolerance = document.getElementById('riskTolerance').value;

    // Calculate margin of safety
    const marginOfSafety = ((intrinsicValue - marketPrice) / intrinsicValue) * 100;
    const marginInDollars = intrinsicValue - marketPrice;
    
    // Calculate investment amounts
    const totalInvestment = marketPrice * sharesQuantity;
    const totalIntrinsicValue = intrinsicValue * sharesQuantity;
    const totalMarginDollars = marginInDollars * sharesQuantity;

    // Calculate target price based on desired margin
    const targetPrice = intrinsicValue * (1 - targetMargin / 100);
    
    // Determine risk level and recommendation
    const riskAssessment = getRiskAssessment(marginOfSafety, riskTolerance);
    const recommendation = getInvestmentRecommendation(marginOfSafety, targetMargin);

    // Calculate downside protection
    const downsideProtection = Math.max(0, marginOfSafety);
    
    // Display results
    displayResults({
        intrinsicValue,
        marketPrice,
        sharesQuantity,
        marginOfSafety,
        marginInDollars,
        totalInvestment,
        totalIntrinsicValue,
        totalMarginDollars,
        targetPrice,
        targetMargin,
        riskAssessment,
        recommendation,
        downsideProtection
    });

    // Update chart
    updateMarginChart({
        intrinsicValue,
        marketPrice,
        targetPrice,
        marginOfSafety
    });
}

function getRiskAssessment(margin, tolerance) {
    let thresholds = {
        conservative: { safe: 30, moderate: 20, risky: 10 },
        moderate: { safe: 25, moderate: 15, risky: 5 },
        aggressive: { safe: 20, moderate: 10, risky: 0 }
    };

    const levels = thresholds[tolerance];
    
    if (margin >= levels.safe) {
        return {
            level: 'Low Risk',
            class: 'success',
            description: 'Високий рівень безпеки інвестиції',
            descriptionEn: 'High level of investment safety'
        };
    } else if (margin >= levels.moderate) {
        return {
            level: 'Moderate Risk',
            class: 'warning',
            description: 'Помірний рівень ризику',
            descriptionEn: 'Moderate risk level'
        };
    } else if (margin >= levels.risky) {
        return {
            level: 'High Risk',
            class: 'warning',
            description: 'Підвищений рівень ризику',
            descriptionEn: 'Elevated risk level'
        };
    } else {
        return {
            level: 'Very High Risk',
            class: 'danger',
            description: 'Дуже високий ризик, акція переоцінена',
            descriptionEn: 'Very high risk, stock is overvalued'
        };
    }
}

function getInvestmentRecommendation(margin, target) {
    if (margin >= target) {
        return {
            action: 'Купувати',
            actionEn: 'Buy',
            class: 'success',
            emoji: '✅',
            description: 'Межа безпеки відповідає вашим вимогам',
            descriptionEn: 'Margin of safety meets your requirements'
        };
    } else if (margin >= target * 0.7) {
        return {
            action: 'Розглянути',
            actionEn: 'Consider',
            class: 'warning',
            emoji: '⚠️',
            description: 'Межа безпеки близька до цільової',
            descriptionEn: 'Margin of safety is close to target'
        };
    } else if (margin > 0) {
        return {
            action: 'Чекати',
            actionEn: 'Wait',
            class: 'info',
            emoji: '⏳',
            description: 'Межа безпеки недостатня, чекайте кращої ціни',
            descriptionEn: 'Insufficient margin of safety, wait for better price'
        };
    } else {
        return {
            action: 'Уникати',
            actionEn: 'Avoid',
            class: 'danger',
            emoji: '🚫',
            description: 'Акція переоцінена, уникайте покупки',
            descriptionEn: 'Stock is overvalued, avoid purchase'
        };
    }
}

function displayResults(data) {
    const isUkrainian = !window.location.pathname.includes('/en/');
    
    const resultsHTML = `
        <div class="results-container">
            <h3>🛡️ ${isUkrainian ? 'Аналіз межі безпеки' : 'Margin of Safety Analysis'}</h3>
            
            <div class="insight-cards">
                <div class="insight-card ${data.recommendation.class}">
                    <h4>${data.recommendation.emoji} ${isUkrainian ? 'Рекомендація' : 'Recommendation'}</h4>
                    <div class="value-large">${isUkrainian ? data.recommendation.action : data.recommendation.actionEn}</div>
                    <p>${isUkrainian ? data.recommendation.description : data.recommendation.descriptionEn}</p>
                </div>
                
                <div class="insight-card ${data.marginOfSafety >= 0 ? 'success' : 'danger'}">
                    <h4>📊 ${isUkrainian ? 'Межа безпеки' : 'Margin of Safety'}</h4>
                    <div class="value-large">${data.marginOfSafety.toFixed(1)}%</div>
                    <p>${isUkrainian ? 'Захист від зниження ціни' : 'Protection from price decline'}</p>
                </div>
                
                <div class="insight-card ${data.riskAssessment.class}">
                    <h4>⚠️ ${isUkrainian ? 'Рівень ризику' : 'Risk Level'}</h4>
                    <div class="value-medium">${data.riskAssessment.level}</div>
                    <p>${isUkrainian ? data.riskAssessment.description : data.riskAssessment.descriptionEn}</p>
                </div>
            </div>

            <div class="detailed-results">
                <h4>💰 ${isUkrainian ? 'Фінансові показники' : 'Financial Metrics'}</h4>
                
                <div class="metrics-grid">
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Внутрішня вартість' : 'Intrinsic Value'}:</strong> $${data.intrinsicValue.toFixed(2)}
                    </div>
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Ринкова ціна' : 'Market Price'}:</strong> $${data.marketPrice.toFixed(2)}
                    </div>
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Межа в доларах' : 'Margin in Dollars'}:</strong> $${data.marginInDollars.toFixed(2)}
                    </div>
                    <div class="metric-item">
                        <strong>${isUkrainian ? 'Цільова ціна' : 'Target Price'}:</strong> $${data.targetPrice.toFixed(2)}
                    </div>
                </div>

                <h4>📈 ${isUkrainian ? 'Розрахунок інвестиції' : 'Investment Calculation'}</h4>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>${isUkrainian ? 'Показник' : 'Metric'}</th>
                            <th>${isUkrainian ? 'Значення' : 'Value'}</th>
                            <th>${isUkrainian ? 'Опис' : 'Description'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${isUkrainian ? 'Кількість акцій' : 'Number of Shares'}</td>
                            <td>${data.sharesQuantity}</td>
                            <td>${isUkrainian ? 'Планована покупка' : 'Planned purchase'}</td>
                        </tr>
                        <tr>
                            <td>${isUkrainian ? 'Загальна інвестиція' : 'Total Investment'}</td>
                            <td>$${data.totalInvestment.toLocaleString()}</td>
                            <td>${isUkrainian ? 'За поточною ціною' : 'At current price'}</td>
                        </tr>
                        <tr>
                            <td>${isUkrainian ? 'Внутрішня вартість портфеля' : 'Portfolio Intrinsic Value'}</td>
                            <td>$${data.totalIntrinsicValue.toLocaleString()}</td>
                            <td>${isUkrainian ? 'Справедлива вартість' : 'Fair value'}</td>
                        </tr>
                        <tr>
                            <td>${isUkrainian ? 'Потенційний прибуток' : 'Potential Profit'}</td>
                            <td>$${data.totalMarginDollars.toLocaleString()}</td>
                            <td>${isUkrainian ? 'При досягненні справедливої ціни' : 'Upon reaching fair price'}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="price-scenarios">
                    <h5>📊 ${isUkrainian ? 'Сценарії розвитку' : 'Price Scenarios'}</h5>
                    <div class="scenario-grid">
                        <div class="scenario ${data.marginOfSafety >= 30 ? 'success' : 'neutral'}">
                            <strong>${isUkrainian ? 'Оптимістичний' : 'Optimistic'}</strong><br>
                            ${isUkrainian ? 'Ціна досягне внутрішньої вартості' : 'Price reaches intrinsic value'}<br>
                            <span class="profit">+${((data.intrinsicValue - data.marketPrice) / data.marketPrice * 100).toFixed(1)}%</span>
                        </div>
                        <div class="scenario ${data.marginOfSafety >= 15 ? 'warning' : 'neutral'}">
                            <strong>${isUkrainian ? 'Реалістичний' : 'Realistic'}</strong><br>
                            ${isUkrainian ? 'Ціна залишиться стабільною' : 'Price remains stable'}<br>
                            <span class="neutral">0%</span>
                        </div>
                        <div class="scenario ${data.marginOfSafety < 0 ? 'danger' : 'neutral'}">
                            <strong>${isUkrainian ? 'Песимістичний' : 'Pessimistic'}</strong><br>
                            ${isUkrainian ? 'Зниження на 20%' : '20% decline'}<br>
                            <span class="loss">-20%</span>
                        </div>
                    </div>
                </div>

                <div class="interpretation">
                    <h5>💡 ${isUkrainian ? 'Інтерпретація та поради' : 'Interpretation and Tips'}</h5>
                    <ul>
                        ${data.marginOfSafety >= 25 ? 
                            `<li>✅ ${isUkrainian ? 'Відмінна межа безпеки - ідеальна можливість для покупки' : 'Excellent margin of safety - ideal buying opportunity'}</li>` : ''}
                        ${data.marginOfSafety >= 15 && data.marginOfSafety < 25 ? 
                            `<li>⚠️ ${isUkrainian ? 'Прийнятна межа безпеки - можна розглянути покупку' : 'Acceptable margin of safety - consider buying'}</li>` : ''}
                        ${data.marginOfSafety < 15 && data.marginOfSafety > 0 ? 
                            `<li>🔶 ${isUkrainian ? 'Низька межа безпеки - висока обережність' : 'Low margin of safety - high caution required'}</li>` : ''}
                        ${data.marginOfSafety < 0 ? 
                            `<li>🚫 ${isUkrainian ? 'Негативна межа - акція переоцінена' : 'Negative margin - stock is overvalued'}</li>` : ''}
                        <li>📋 ${isUkrainian ? 
                            `Для досягнення ${data.targetMargin}% межі безпеки, чекайте ціни $${data.targetPrice.toFixed(2)}` : 
                            `To achieve ${data.targetMargin}% margin of safety, wait for price $${data.targetPrice.toFixed(2)}`}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}

function updateMarginChart(data) {
    const canvas = document.getElementById('marginChart');
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

    // Data points
    const maxValue = Math.max(data.intrinsicValue, data.marketPrice) * 1.1;
    const minValue = Math.min(data.intrinsicValue, data.marketPrice, data.targetPrice) * 0.9;
    const range = maxValue - minValue;

    // Helper function to get Y position
    function getY(value) {
        return height - margin - ((value - minValue) / range) * chartHeight;
    }

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = margin + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
    }

    // Draw intrinsic value line
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, getY(data.intrinsicValue));
    ctx.lineTo(width - margin, getY(data.intrinsicValue));
    ctx.stroke();

    // Draw market price line
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, getY(data.marketPrice));
    ctx.lineTo(width - margin, getY(data.marketPrice));
    ctx.stroke();

    // Draw target price line
    ctx.strokeStyle = '#ffc107';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(margin, getY(data.targetPrice));
    ctx.lineTo(width - margin, getY(data.targetPrice));
    ctx.stroke();
    ctx.setLineDash([]);

    // Fill margin area
    if (data.marginOfSafety > 0) {
        ctx.fillStyle = 'rgba(40, 167, 69, 0.2)';
        ctx.fillRect(margin, getY(data.intrinsicValue), chartWidth, getY(data.marketPrice) - getY(data.intrinsicValue));
    }

    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    
    // Intrinsic value label
    ctx.fillText(`Intrinsic: $${data.intrinsicValue.toFixed(0)}`, margin + 10, getY(data.intrinsicValue) - 5);
    
    // Market price label
    ctx.fillText(`Market: $${data.marketPrice.toFixed(0)}`, margin + 10, getY(data.marketPrice) + 15);
    
    // Target price label
    ctx.fillText(`Target: $${data.targetPrice.toFixed(0)}`, margin + 10, getY(data.targetPrice) - 5);

    // Add margin percentage
    const centerY = (getY(data.intrinsicValue) + getY(data.marketPrice)) / 2;
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = data.marginOfSafety >= 0 ? '#28a745' : '#dc3545';
    ctx.fillText(`${data.marginOfSafety.toFixed(1)}%`, width - margin - 60, centerY);
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set initial calculation if elements exist
    if (document.getElementById('intrinsicValue')) {
        calculateMarginOfSafety();
    }
});