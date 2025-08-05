// Intrinsic Value Calculator JavaScript (English Version)
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
        alert('⚠️ Discount rate must be higher than growth rate!');
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

function calculateDCF(earnings, growthRate, discountRate) {
    // Simple DCF calculation (5-year projection)
    let dcfValue = 0;
    const gr = growthRate / 100;
    const dr = discountRate / 100;
    
    for (let year = 1; year <= 5; year++) {
        const futureEarnings = earnings * Math.pow(1 + gr, year);
        const presentValue = futureEarnings / Math.pow(1 + dr, year);
        dcfValue += presentValue;
    }
    
    // Terminal value (simplified)
    const terminalValue = (earnings * Math.pow(1 + gr, 5) * (1 + 0.02)) / (dr - 0.02);
    dcfValue += terminalValue / Math.pow(1 + dr, 5);
    
    return dcfValue;
}

function calculatePEValue(earnings, peRatio) {
    return earnings * peRatio;
}

function calculateDividendValue(currentPrice, dividendYield, growthRate, discountRate) {
    if (dividendYield === 0) return currentPrice;
    
    const dividend = currentPrice * (dividendYield / 100);
    const requiredReturn = discountRate / 100;
    const dividendGrowthRate = Math.min(growthRate / 100, 0.06); // Cap at 6% for dividends
    
    if (requiredReturn <= dividendGrowthRate) {
        return currentPrice; // Invalid calculation, return current price
    }
    
    return dividend * (1 + dividendGrowthRate) / (requiredReturn - dividendGrowthRate);
}

function getRecommendation(marginOfSafety) {
    if (marginOfSafety >= 25) {
        return {
            text: "Strong Buy",
            description: "High margin of safety indicates excellent value opportunity",
            class: "success"
        };
    } else if (marginOfSafety >= 15) {
        return {
            text: "Buy",
            description: "Good margin of safety suggests attractive investment",
            class: "success"
        };
    } else if (marginOfSafety >= 0) {
        return {
            text: "Hold",
            description: "Fair value, monitor for better entry point",
            class: "info"
        };
    } else if (marginOfSafety >= -15) {
        return {
            text: "Caution",
            description: "Slightly overvalued, consider waiting",
            class: "warning"
        };
    } else {
        return {
            text: "Avoid",
            description: "Significantly overvalued, high risk",
            class: "danger"
        };
    }
}

function displayResults(data) {
    const resultsHTML = `
        <div class="results-container">
            <h3>📊 Valuation Results</h3>
            
            <div class="insight-cards">
                <div class="insight-card ${data.recommendation.class}">
                    <h4>📈 Investment Recommendation</h4>
                    <div class="value-large">${data.recommendation.text}</div>
                    <p>${data.recommendation.description}</p>
                </div>
                
                <div class="insight-card info">
                    <h4>💰 Average Fair Value</h4>
                    <div class="value-large">$${data.averageValue.toFixed(2)}</div>
                    <p>Average of all valuation methods</p>
                </div>
                
                <div class="insight-card ${data.marginOfSafety >= 0 ? 'success' : 'warning'}">
                    <h4>🛡️ Margin of Safety</h4>
                    <div class="value-large">${data.marginOfSafety.toFixed(1)}%</div>
                    <p>Difference between fair and market price</p>
                </div>
            </div>

            <div class="detailed-results">
                <h4>🔍 Detailed Valuation Analysis</h4>
                
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Valuation Method</th>
                            <th>Fair Value</th>
                            <th>Market Deviation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>📊 DCF Model</td>
                            <td>$${data.dcfValue.toFixed(2)}</td>
                            <td>${((data.dcfValue - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>📈 P/E Valuation</td>
                            <td>$${data.peValue.toFixed(2)}</td>
                            <td>${((data.peValue - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>💵 Dividend Model</td>
                            <td>$${data.dividendValue.toFixed(2)}</td>
                            <td>${((data.dividendValue - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%</td>
                        </tr>
                    </tbody>
                </table>

                <div class="metrics-grid">
                    <div class="metric-item">
                        <strong>Current P/E:</strong> ${data.currentPE.toFixed(1)}x
                    </div>
                    <div class="metric-item">
                        <strong>Industry P/E:</strong> ${data.peIndustry.toFixed(1)}x
                    </div>
                    <div class="metric-item">
                        <strong>Book Value:</strong> $${data.bookValue.toFixed(2)}
                    </div>
                    <div class="metric-item">
                        <strong>P/B Ratio:</strong> ${(data.currentPrice / data.bookValue).toFixed(2)}x
                    </div>
                </div>

                <div class="interpretation">
                    <h5>💡 Results Interpretation</h5>
                    <ul>
                        ${data.marginOfSafety >= 25 ? 
                            `<li>✅ High margin of safety indicates attractive investment opportunity</li>` : ''}
                        ${data.currentPE < data.peIndustry ? 
                            `<li>📊 P/E ratio below industry average - possible undervaluation</li>` : 
                            `<li>📊 P/E ratio above industry average - possible overvaluation</li>`}
                        ${(data.currentPrice / data.bookValue) < 1.5 ? 
                            `<li>📚 Moderate P/B ratio indicates reasonable asset valuation</li>` : ''}
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
    
    // Chart data
    const values = [
        { label: 'Current Price', value: data.currentPrice, color: '#e74c3c' },
        { label: 'DCF Value', value: data.dcfValue, color: '#3498db' },
        { label: 'P/E Value', value: data.peValue, color: '#2ecc71' },
        { label: 'Dividend Value', value: data.dividendValue, color: '#f39c12' },
        { label: 'Average Value', value: data.averageValue, color: '#9b59b6' }
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
    ctx.fillText('Valuation Methods Comparison', width/2, 30);
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#intrinsic-value-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateIntrinsicValue();
        });
    }
});