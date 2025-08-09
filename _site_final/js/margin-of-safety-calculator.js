// Margin of Safety Calculator JavaScript (Ukrainian Version)
function calculateMarginOfSafety() {
    // Get input values
    const currentPrice = parseFloat(document.getElementById('marketPrice').value) || 100;
    const fairValue = parseFloat(document.getElementById('intrinsicValue').value) || 120;
    const riskTolerance = document.getElementById('riskTolerance').value;
    const sharesQuantity = parseFloat(document.getElementById('sharesQuantity').value) || 100;
    const investmentAmount = currentPrice * sharesQuantity;
    
    // Calculate margin of safety
    const marginOfSafety = ((fairValue - currentPrice) / fairValue * 100);
    const discountFromFairValue = ((fairValue - currentPrice) / currentPrice * 100);
    
    // Determine required margin based on risk tolerance
    const requiredMargins = {
        'conservative': 25,
        'moderate': 15,
        'aggressive': 10
    };
    
    const requiredMargin = requiredMargins[riskTolerance];
    
    // Calculate target purchase price for desired margin
    const targetPrice = fairValue * (1 - requiredMargin / 100);
    
    // Calculate potential scenarios
    const scenarios = calculateScenarios(currentPrice, fairValue, investmentAmount);
    
    // Determine recommendation
    const recommendation = getMarginRecommendation(marginOfSafety, riskTolerance);
    
    // Display results
    displayMarginResults({
        currentPrice,
        fairValue,
        marginOfSafety,
        discountFromFairValue,
        riskTolerance,
        requiredMargin,
        targetPrice,
        investmentAmount,
        scenarios,
        recommendation
    });
    
    // Update chart
    updateMarginChart({
        currentPrice,
        fairValue,
        targetPrice,
        marginOfSafety,
        requiredMargin
    });
}

function calculateScenarios(currentPrice, fairValue, investmentAmount) {
    const shares = investmentAmount / currentPrice;
    
    return {
        conservative: {
            label: 'Консервативний (справедлива вартість)',
            targetPrice: fairValue,
            profit: shares * (fairValue - currentPrice),
            return: ((fairValue - currentPrice) / currentPrice * 100)
        },
        moderate: {
            label: 'Помірний (+20% до справедливої)',
            targetPrice: fairValue * 1.2,
            profit: shares * (fairValue * 1.2 - currentPrice),
            return: ((fairValue * 1.2 - currentPrice) / currentPrice * 100)
        },
        optimistic: {
            label: 'Оптимістичний (+50% до справедливої)',
            targetPrice: fairValue * 1.5,
            profit: shares * (fairValue * 1.5 - currentPrice),
            return: ((fairValue * 1.5 - currentPrice) / currentPrice * 100)
        }
    };
}

function getMarginRecommendation(marginOfSafety, riskTolerance) {
    const requiredMargins = {
        'conservative': 25,
        'moderate': 15,
        'aggressive': 10
    };
    
    const required = requiredMargins[riskTolerance];
    
    if (marginOfSafety >= required + 10) {
        return {
            text: "Сильна покупка",
            description: "Чудова межа безпеки для вашого профілю ризику",
            class: "success"
        };
    } else if (marginOfSafety >= required) {
        return {
            text: "Покупка",
            description: "Достатня межа безпеки для вашої толерантності до ризику",
            class: "success"
        };
    } else if (marginOfSafety >= required - 5) {
        return {
            text: "Розглянути",
            description: "Межа трохи нижче цільової, ретельно контролювати",
            class: "warning"
        };
    } else if (marginOfSafety >= 0) {
        return {
            text: "Очікувати",
            description: "Недостатня межа безпеки для вашого профілю ризику",
            class: "warning"
        };
    } else {
        return {
            text: "Уникати",
            description: "Інвестиція торгується вище справедливої вартості",
            class: "danger"
        };
    }
}

function displayMarginResults(data) {
    const riskLabels = {
        'conservative': 'Консервативний',
        'moderate': 'Помірний', 
        'aggressive': 'Агресивний'
    };
    
    const resultsHTML = `
        <div class="results-container">
            <h3>🛡️ Аналіз межі безпеки</h3>
            
            <div class="insight-cards">
                <div class="insight-card ${data.recommendation.class}">
                    <h4>📊 Інвестиційна рекомендація</h4>
                    <div class="value-large">${data.recommendation.text}</div>
                    <p>${data.recommendation.description}</p>
                </div>
                
                <div class="insight-card ${data.marginOfSafety >= 0 ? 'success' : 'danger'}">
                    <h4>🛡️ Поточна межа безпеки</h4>
                    <div class="value-large">${data.marginOfSafety.toFixed(1)}%</div>
                    <p>Захист від втрат у разі помилки оцінки справедливої вартості</p>
                </div>
                
                <div class="insight-card info">
                    <h4>🎯 Цільова ціна покупки</h4>
                    <div class="value-large">$${data.targetPrice.toFixed(2)}</div>
                    <p>Для ${data.requiredMargin}% межі (${riskLabels[data.riskTolerance]} стратегія)</p>
                </div>
            </div>

            <div class="detailed-results">
                <h4>🔍 Детальний аналіз</h4>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Показник</th>
                            <th>Значення</th>
                            <th>Оцінка</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Поточна ринкова ціна</td>
                            <td>$${data.currentPrice.toFixed(2)}</td>
                            <td>Поточний рівень торгівлі</td>
                        </tr>
                        <tr>
                            <td>Оціночна справедлива вартість</td>
                            <td>$${data.fairValue.toFixed(2)}</td>
                            <td>Ваша оцінка внутрішньої вартості</td>
                        </tr>
                        <tr>
                            <td>Межа безпеки</td>
                            <td>${data.marginOfSafety.toFixed(1)}%</td>
                            <td class="${data.marginOfSafety >= data.requiredMargin ? 'profit' : 'loss'}">
                                ${data.marginOfSafety >= data.requiredMargin ? 'Достатня' : 'Недостатня'}
                            </td>
                        </tr>
                        <tr>
                            <td>Необхідна межа (${riskLabels[data.riskTolerance]})</td>
                            <td>${data.requiredMargin}%</td>
                            <td>Ваш поріг толерантності до ризику</td>
                        </tr>
                        <tr>
                            <td>Знижка від справедливої вартості</td>
                            <td>${data.discountFromFairValue.toFixed(1)}%</td>
                            <td>${data.discountFromFairValue > 0 ? 'Торгується з дисконтом' : 'Торгується з премією'}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="break-even-analysis">
                    <h5>💰 Інвестиційні сценарії (${(data.investmentAmount / data.currentPrice).toFixed(0)} акцій)</h5>
                    
                    <div class="scenario-grid">
                        <div class="scenario ${data.scenarios.conservative.profit >= 0 ? 'success' : 'neutral'}">
                            <h6>${data.scenarios.conservative.label}</h6>
                            <p><strong>Ціль:</strong> $${data.scenarios.conservative.targetPrice.toFixed(2)}</p>
                            <p><strong>Дохідність:</strong> <span class="${data.scenarios.conservative.profit >= 0 ? 'profit' : 'loss'}">${data.scenarios.conservative.return.toFixed(1)}%</span></p>
                            <p><strong>Прибуток:</strong> <span class="${data.scenarios.conservative.profit >= 0 ? 'profit' : 'loss'}">$${data.scenarios.conservative.profit.toFixed(0)}</span></p>
                        </div>
                        
                        <div class="scenario ${data.scenarios.moderate.profit >= 0 ? 'success' : 'neutral'}">
                            <h6>${data.scenarios.moderate.label}</h6>
                            <p><strong>Ціль:</strong> $${data.scenarios.moderate.targetPrice.toFixed(2)}</p>
                            <p><strong>Дохідність:</strong> <span class="profit">${data.scenarios.moderate.return.toFixed(1)}%</span></p>
                            <p><strong>Прибуток:</strong> <span class="profit">$${data.scenarios.moderate.profit.toFixed(0)}</span></p>
                        </div>
                        
                        <div class="scenario ${data.scenarios.optimistic.profit >= 0 ? 'success' : 'neutral'}">
                            <h6>${data.scenarios.optimistic.label}</h6>
                            <p><strong>Ціль:</strong> $${data.scenarios.optimistic.targetPrice.toFixed(2)}</p>
                            <p><strong>Дохідність:</strong> <span class="profit">${data.scenarios.optimistic.return.toFixed(1)}%</span></p>
                            <p><strong>Прибуток:</strong> <span class="profit">$${data.scenarios.optimistic.profit.toFixed(0)}</span></p>
                        </div>
                    </div>
                </div>

                <div class="interpretation">
                    <h5>💡 Принципи Бенджаміна Грема</h5>
                    <ul>
                        <li>🎯 <strong>Межа безпеки:</strong> Купуйте лише коли ринкова ціна значно нижче внутрішньої вартості</li>
                        <li>📊 <strong>Консервативний підхід:</strong> Вимагає 25%+ межі для максимальної безпеки</li>
                        <li>⚖️ <strong>Управління ризиками:</strong> Межа захищає від помилок оцінки та ринкової волатильності</li>
                        <li>🕰️ <strong>Довгостроковий фокус:</strong> Ринкові ціни врешті-решт наближаються до внутрішньої вартості</li>
                        ${data.marginOfSafety >= 25 ? 
                            '<li>✅ <strong>Чудова можливість:</strong> Висока межа забезпечує міцний захист від зниження</li>' : ''}
                        ${data.marginOfSafety < 0 ? 
                            '<li>❌ <strong>Уникати інвестиції:</strong> Торгування вище справедливої вартості не дає межі безпеки</li>' : ''}
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
    const width = canvas.width = 600;
    const height = canvas.height = 300;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Chart parameters
    const chartWidth = 500;
    const chartHeight = 200;
    const chartX = 50;
    const chartY = 50;
    
    // Price range
    const minPrice = Math.min(data.currentPrice, data.targetPrice, data.fairValue) * 0.8;
    const maxPrice = Math.max(data.currentPrice, data.targetPrice, data.fairValue) * 1.2;
    const priceRange = maxPrice - minPrice;
    
    // Draw price scale
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartX, chartY);
    ctx.lineTo(chartX + chartWidth, chartY);
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
    ctx.lineTo(chartX, chartY + chartHeight);
    ctx.lineTo(chartX, chartY);
    ctx.stroke();
    
    // Draw price markers with Ukrainian labels
    const prices = [
        { label: 'Поточна', value: data.currentPrice, color: '#e74c3c' },
        { label: 'Цільова', value: data.targetPrice, color: '#f39c12' },
        { label: 'Справедлива', value: data.fairValue, color: '#2ecc71' }
    ];
    
    prices.forEach((price, index) => {
        const x = chartX + ((price.value - minPrice) / priceRange) * chartWidth;
        
        // Draw line
        ctx.strokeStyle = price.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, chartY);
        ctx.lineTo(x, chartY + chartHeight);
        ctx.stroke();
        
        // Draw label
        ctx.fillStyle = price.color;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(price.label, x, chartY + chartHeight + 15);
        ctx.fillText(`$${price.value.toFixed(0)}`, x, chartY + chartHeight + 30);
    });
    
    // Draw margin area
    const currentX = chartX + ((data.currentPrice - minPrice) / priceRange) * chartWidth;
    const fairX = chartX + ((data.fairValue - minPrice) / priceRange) * chartWidth;
    
    if (data.marginOfSafety > 0) {
        ctx.fillStyle = 'rgba(46, 204, 113, 0.2)';
        ctx.fillRect(currentX, chartY, fairX - currentX, chartHeight);
    }
    
    // Title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Межа безпеки: ${data.marginOfSafety.toFixed(1)}%`, width/2, 30);
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#margin-safety-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateMarginOfSafety();
        });
    }
});