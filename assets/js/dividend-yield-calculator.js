document.getElementById("dividend-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const stockPrice = parseFloat(document.getElementById("stock-price").value) || 0;
  const annualDividend = parseFloat(document.getElementById("annual-dividend").value) || 0;
  const sharesCount = parseFloat(document.getElementById("shares-count").value) || 0;
  const investmentAmount = parseFloat(document.getElementById("investment-amount").value) || 0;
  const dividendGrowth = parseFloat(document.getElementById("dividend-growth").value) || 0;
  const reinvestment = document.getElementById("reinvestment").value === "true";
  const forecastYears = parseInt(document.getElementById("forecast-years").value) || 1;

  if (stockPrice === 0) {
    alert("Вкажіть ціну акції");
    return;
  }

  // Calculate dividend yield
  const dividendYield = (annualDividend / stockPrice) * 100;
  const annualDividendIncome = annualDividend * sharesCount;
  const monthlyDividendIncome = annualDividendIncome / 12;

  // Calculate forecast
  let projectionData = [];
  let cumulativeIncome = 0;
  let currentShares = sharesCount;
  let currentDividend = annualDividend;

  for (let year = 1; year <= forecastYears; year++) {
    // Grow dividend
    if (year > 1) {
      currentDividend *= (1 + dividendGrowth / 100);
    }

    const yearlyIncome = currentDividend * currentShares;
    cumulativeIncome += yearlyIncome;

    // If reinvesting, buy more shares
    if (reinvestment) {
      const newShares = yearlyIncome / stockPrice; // Simplified - assumes same stock price
      currentShares += newShares;
    }

    projectionData.push({
      year: year,
      shares: currentShares,
      dividend: currentDividend,
      yearlyIncome: yearlyIncome,
      cumulativeIncome: cumulativeIncome
    });
  }

  const finalYearData = projectionData[projectionData.length - 1];
  const totalReturn = (cumulativeIncome / investmentAmount) * 100;
  const annualizedReturn = Math.pow(1 + totalReturn / 100, 1 / forecastYears) - 1;

  // Dividend growth assessment
  let yieldAssessment = "";
  let yieldColor = "#007bff";
  if (dividendYield < 2) {
    yieldAssessment = "Низька дохідність";
    yieldColor = "#dc3545";
  } else if (dividendYield < 4) {
    yieldAssessment = "Помірна дохідність";
    yieldColor = "#ffc107";
  } else if (dividendYield < 7) {
    yieldAssessment = "Гарна дохідність";
    yieldColor = "#28a745";
  } else if (dividendYield < 10) {
    yieldAssessment = "Висока дохідність";
    yieldColor = "#fd7e14";
  } else {
    yieldAssessment = "Дуже висока (ризик!)";
    yieldColor = "#dc3545";
  }

  document.getElementById("dividend-result").innerHTML = `
    <div class="insight-card success">
      <h6>📊 Дивідендна дохідність</h6>
      <div style="font-size: 2.2em; font-weight: bold; color: ${yieldColor}; margin: 0.5em 0;">
        ${dividendYield.toFixed(2)}%
      </div>
      <p style="margin: 0; color: #666;">
        ${yieldAssessment}
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
      <div class="insight-card">
        <h6>💰 Річний дохід</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #007bff;">
          ${annualDividendIncome.toLocaleString()} грн
        </div>
        <small>З дивідендів</small>
      </div>
      
      <div class="insight-card warning">
        <h6>📅 Місячний дохід</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #856404;">
          ${monthlyDividendIncome.toLocaleString()} грн
        </div>
        <small>У середньому</small>
      </div>
      
      <div class="insight-card">
        <h6>📈 Прогноз (${forecastYears} років)</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #6c757d;">
          ${finalYearData.cumulativeIncome.toLocaleString()} грн
        </div>
        <small>Сукупний дохід</small>
      </div>
    </div>

    <div class="insight-card info">
      <h6>📋 Деталі інвестиції</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9em;">
          <div><strong>Сума інвестицій:</strong></div>
          <div>${investmentAmount.toLocaleString()} грн</div>
          
          <div><strong>Кількість акцій:</strong></div>
          <div>${sharesCount.toLocaleString()}</div>
          
          <div><strong>Ціна за акцію:</strong></div>
          <div>${stockPrice.toLocaleString()} грн</div>
          
          <div><strong>Дивіденд на акцію:</strong></div>
          <div>${annualDividend.toFixed(2)} грн</div>
          
          <div><strong>Зростання дивідендів:</strong></div>
          <div>${dividendGrowth}% на рік</div>
          
          <div><strong>Реінвестування:</strong></div>
          <div>${reinvestment ? "Так" : "Ні"}</div>
        </div>
      </div>
    </div>

    ${reinvestment ? `
    <div class="insight-card">
      <h6>🔄 Ефект реінвестування</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9em;">
          <div><strong>Акцій через ${forecastYears} років:</strong></div>
          <div>${finalYearData.shares.toFixed(0)}</div>
          
          <div><strong>Збільшення портфеля:</strong></div>
          <div>+${((finalYearData.shares - sharesCount) / sharesCount * 100).toFixed(1)}%</div>
          
          <div><strong>Дивіденд через ${forecastYears} років:</strong></div>
          <div>${finalYearData.dividend.toFixed(2)} грн за акцію</div>
          
          <div><strong>Річний дохід через ${forecastYears} років:</strong></div>
          <div>${finalYearData.yearlyIncome.toLocaleString()} грн</div>
        </div>
      </div>
    </div>` : ''}

    <div class="insight-card">
      <h6>💡 Рекомендації</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <ul style="margin: 0; padding-left: 1.5rem;">
          ${generateRecommendations(dividendYield, dividendGrowth, reinvestment, investmentAmount)}
        </ul>
      </div>
    </div>
  `;

  // Show chart
  document.getElementById("dividend-chart-block").style.display = "block";
  ensureChartJs(() => renderDividendChart(projectionData));
});

function generateRecommendations(yield_, growth, reinvest, amount) {
  let recommendations = [];

  if (yield_ < 2) {
    recommendations.push("Низька дохідність може вказувати на потенціал зростання ціни акції");
  } else if (yield_ > 8) {
    recommendations.push("Висока дохідність може сигналізувати про ризики - перевірте фінансовий стан компанії");
  }

  if (growth < 3) {
    recommendations.push("Низьке зростання дивідендів - розгляньте компанії з історією збільшення виплат");
  }

  if (!reinvest) {
    recommendations.push("Реінвестування дивідендів значно збільшує довгострокову дохідність");
  }

  if (amount < 50000) {
    recommendations.push("Для диверсифікації розгляньте ETF дивідендних акцій замість окремих компаній");
  }

  recommendations.push("Регулярно переглядайте фінансовий стан компаній у портфелі");
  recommendations.push("Диверсифікуйте інвестиції між різними секторами економіки");

  return recommendations.map(rec => `<li>${rec}</li>`).join("");
}

let dividendChart;
function renderDividendChart(data) {
  const ctx = document.getElementById('dividend-chart').getContext('2d');
  
  if (dividendChart) {
    dividendChart.destroy();
  }

  const years = data.map(d => d.year);
  const cumulativeIncome = data.map(d => d.cumulativeIncome);
  const yearlyIncome = data.map(d => d.yearlyIncome);

  dividendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Сукупний дохід (грн)',
        data: cumulativeIncome,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true,
        tension: 0.4
      }, {
        label: 'Річний дохід (грн)',
        data: yearlyIncome,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toLocaleString() + ' грн';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Роки'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' грн';
            }
          }
        }
      }
    }
  });
}