// Margin of Safety Calculator JavaScript (English Version)
function calculateMarginOfSafety() {
    // Get input values
    const currentPrice = parseFloat(document.getElementById('currentPrice').value) || 100;
    const fairValue = parseFloat(document.getElementById('fairValue').value) || 120;
    const riskTolerance = document.getElementById('riskTolerance').value;
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value) || 10000;
    
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
            label: 'Conservative (Fair Value)',
            targetPrice: fairValue,
            profit: shares * (fairValue - currentPrice),
            return: ((fairValue - currentPrice) / currentPrice * 100)
        },
        moderate: {
            label: 'Moderate (+20% above fair)',
            targetPrice: fairValue * 1.2,
            profit: shares * (fairValue * 1.2 - currentPrice),
            return: ((fairValue * 1.2 - currentPrice) / currentPrice * 100)
        },
        optimistic: {
            label: 'Optimistic (+50% above fair)',
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
            text: "Strong Buy",
            description: "Excellent margin of safety for your risk profile",
            class: "success"
        };
    } else if (marginOfSafety >= required) {
        return {
            text: "Buy",
            description: "Adequate margin of safety for your risk tolerance",
            class: "success"
        };
    } else if (marginOfSafety >= required - 5) {
        return {
            text: "Consider",
            description: "Margin slightly below your target, monitor closely",
            class: "warning"
        };
    } else if (marginOfSafety >= 0) {
        return {
            text: "Wait",
            description: "Insufficient margin of safety for your risk profile",
            class: "warning"
        };
    } else {
        return {
            text: "Avoid",
            description: "Investment trading above fair value",
            class: "danger"
        };
    }
}

function displayMarginResults(data) {
    const riskLabels = {
        'conservative': 'Conservative',
        'moderate': 'Moderate', 
        'aggressive': 'Aggressive'
    };
    
    const resultsHTML = `
        <div class="results-container">
            <h3>🛡️ Margin of Safety Analysis</h3>
            
            <div class="insight-cards">
                <div class="insight-card ${data.recommendation.class}">
                    <h4>📊 Investment Recommendation</h4>
                    <div class="value-large">${data.recommendation.text}</div>
                    <p>${data.recommendation.description}</p>
                </div>
                
                <div class="insight-card ${data.marginOfSafety >= 0 ? 'success' : 'danger'}">
                    <h4>🛡️ Current Margin of Safety</h4>
                    <div class="value-large">${data.marginOfSafety.toFixed(1)}%</div>
                    <p>Protection against losses if fair value is wrong</p>
                </div>
                
                <div class="insight-card info">
                    <h4>🎯 Target Purchase Price</h4>
                    <div class="value-large">$${data.targetPrice.toFixed(2)}</div>
                    <p>For ${data.requiredMargin}% margin (${riskLabels[data.riskTolerance]} strategy)</p>
                </div>
            </div>

            <div class="detailed-results">
                <h4>🔍 Detailed Analysis</h4>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Assessment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Current Market Price</td>
                            <td>$${data.currentPrice.toFixed(2)}</td>
                            <td>Current trading level</td>
                        </tr>
                        <tr>
                            <td>Estimated Fair Value</td>
                            <td>$${data.fairValue.toFixed(2)}</td>
                            <td>Your intrinsic value estimate</td>
                        </tr>
                        <tr>
                            <td>Margin of Safety</td>
                            <td>${data.marginOfSafety.toFixed(1)}%</td>
                            <td class="${data.marginOfSafety >= data.requiredMargin ? 'profit' : 'loss'}">
                                ${data.marginOfSafety >= data.requiredMargin ? 'Adequate' : 'Insufficient'}
                            </td>
                        </tr>
                        <tr>
                            <td>Required Margin (${riskLabels[data.riskTolerance]})</td>
                            <td>${data.requiredMargin}%</td>
                            <td>Your risk tolerance threshold</td>
                        </tr>
                        <tr>
                            <td>Discount from Fair Value</td>
                            <td>${data.discountFromFairValue.toFixed(1)}%</td>
                            <td>${data.discountFromFairValue > 0 ? 'Trading at discount' : 'Trading at premium'}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="break-even-analysis">
                    <h5>💰 Investment Scenarios (${(data.investmentAmount / data.currentPrice).toFixed(0)} shares)</h5>
                    
                    <div class="scenario-grid">
                        <div class="scenario ${data.scenarios.conservative.profit >= 0 ? 'success' : 'neutral'}">
                            <h6>${data.scenarios.conservative.label}</h6>
                            <p><strong>Target:</strong> $${data.scenarios.conservative.targetPrice.toFixed(2)}</p>
                            <p><strong>Return:</strong> <span class="${data.scenarios.conservative.profit >= 0 ? 'profit' : 'loss'}">${data.scenarios.conservative.return.toFixed(1)}%</span></p>
                            <p><strong>Profit:</strong> <span class="${data.scenarios.conservative.profit >= 0 ? 'profit' : 'loss'}">$${data.scenarios.conservative.profit.toFixed(0)}</span></p>
                        </div>
                        
                        <div class="scenario ${data.scenarios.moderate.profit >= 0 ? 'success' : 'neutral'}">
                            <h6>${data.scenarios.moderate.label}</h6>
                            <p><strong>Target:</strong> $${data.scenarios.moderate.targetPrice.toFixed(2)}</p>
                            <p><strong>Return:</strong> <span class="profit">${data.scenarios.moderate.return.toFixed(1)}%</span></p>
                            <p><strong>Profit:</strong> <span class="profit">$${data.scenarios.moderate.profit.toFixed(0)}</span></p>
                        </div>
                        
                        <div class="scenario ${data.scenarios.optimistic.profit >= 0 ? 'success' : 'neutral'}">
                            <h6>${data.scenarios.optimistic.label}</h6>
                            <p><strong>Target:</strong> $${data.scenarios.optimistic.targetPrice.toFixed(2)}</p>
                            <p><strong>Return:</strong> <span class="profit">${data.scenarios.optimistic.return.toFixed(1)}%</span></p>
                            <p><strong>Profit:</strong> <span class="profit">$${data.scenarios.optimistic.profit.toFixed(0)}</span></p>
                        </div>
                    </div>
                </div>

                <div class="interpretation">
                    <h5>💡 Benjamin Graham Principles</h5>
                    <ul>
                        <li>🎯 <strong>Margin of Safety:</strong> Buy only when market price is significantly below intrinsic value</li>
                        <li>📊 <strong>Conservative Approach:</strong> Requires 25%+ margin for maximum safety</li>
                        <li>⚖️ <strong>Risk Management:</strong> Margin protects against estimation errors and market volatility</li>
                        <li>🕰️ <strong>Long-term Focus:</strong> Market prices eventually converge to intrinsic values</li>
                        ${data.marginOfSafety >= 25 ? 
                            '<li>✅ <strong>Excellent Opportunity:</strong> High margin provides strong downside protection</li>' : ''}
                        ${data.marginOfSafety < 0 ? 
                            '<li>❌ <strong>Avoid Investment:</strong> Trading above fair value offers no margin of safety</li>' : ''}
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
    
    // Draw price markers
    const prices = [
        { label: 'Current', value: data.currentPrice, color: '#e74c3c' },
        { label: 'Target', value: data.targetPrice, color: '#f39c12' },
        { label: 'Fair Value', value: data.fairValue, color: '#2ecc71' }
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
    ctx.fillText(`Margin of Safety: ${data.marginOfSafety.toFixed(1)}%`, width/2, 30);
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