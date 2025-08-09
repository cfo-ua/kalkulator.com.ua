document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("solar-calculator-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const monthlyUsage = parseFloat(document.getElementById("monthlyUsage").value);
    const electricityRate = parseFloat(document.getElementById("electricityRate").value);
    const systemSize = parseFloat(document.getElementById("systemSize").value);
    const installationCost = parseFloat(document.getElementById("installationCost").value);
    const peakSunHours = parseFloat(document.getElementById("peakSunHours").value);
    const systemEfficiency = parseFloat(document.getElementById("systemEfficiency").value) / 100;

    // Розрахунок щомісячного виробництва сонячної енергії
    const dailyGeneration = systemSize * peakSunHours * systemEfficiency;
    const monthlyGeneration = dailyGeneration * 30.44; // середня кількість днів на місяць
    const annualGeneration = dailyGeneration * 365;

    // Розрахунок економії
    const monthlyBillBefore = monthlyUsage * electricityRate;
    const monthlySolarValue = monthlyGeneration * electricityRate;
    const netMonthlyUsage = Math.max(0, monthlyUsage - monthlyGeneration);
    const monthlyBillAfter = netMonthlyUsage * electricityRate;
    const monthlySavings = monthlyBillBefore - monthlyBillAfter;
    const annualSavings = monthlySavings * 12;

    // Розрахунок періоду окупності
    const paybackYears = installationCost / annualSavings;
    const paybackMonths = Math.round(paybackYears * 12);

    // Розрахунок 25-річних показників
    const totalSavings25Years = annualSavings * 25;
    const netProfit25Years = totalSavings25Years - installationCost;
    const roi = (netProfit25Years / installationCost) * 100;

    // Генерація даних часової шкали для графіка
    const timelineData = [];
    const years = [];
    let cumulativeSavings = 0;
    
    for (let year = 1; year <= 25; year++) {
      cumulativeSavings += annualSavings;
      const netValue = cumulativeSavings - installationCost;
      timelineData.push(netValue);
      years.push(`Рік ${year}`);
    }

    // Відображення результатів
    const resultBlock = document.getElementById("solar-result");
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🔋 Щомісячне виробництво</h6>
          <div class="big-number">${monthlyGeneration.toFixed(0)}</div>
          <p class="insight-detail">кВт⋅год виробляється на місяць</p>
        </div>
        <div class="insight-card success">
          <h6>💰 Щомісячна економія</h6>
          <div class="big-number">₴${monthlySavings.toFixed(0)}</div>
          <p class="insight-detail">${((monthlySavings/monthlyBillBefore)*100).toFixed(0)}% зниження рахунків</p>
        </div>
        <div class="insight-card warning">
          <h6>⏱️ Період окупності</h6>
          <div class="big-number">${paybackYears.toFixed(1)}</div>
          <p class="insight-detail">років (${paybackMonths} місяців)</p>
        </div>
        <div class="insight-card success">
          <h6>📈 25-річна віддача</h6>
          <div class="big-number">${roi.toFixed(0)}%</div>
          <p class="insight-detail">₴${netProfit25Years.toLocaleString()} прибуток</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">📊 Фінансовий звіт</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <div>
            <p><strong>До встановлення сонячних панелей:</strong></p>
            <p>Щомісячний рахунок: ₴${monthlyBillBefore.toFixed(2)}</p>
            <p>Річні витрати: ₴${(monthlyBillBefore * 12).toFixed(0)}</p>
          </div>
          <div>
            <p><strong>Після встановлення сонячних панелей:</strong></p>
            <p>Щомісячний рахунок: ₴${monthlyBillAfter.toFixed(2)}</p>
            <p>Річні витрати: ₴${(monthlyBillAfter * 12).toFixed(0)}</p>
          </div>
          <div>
            <p><strong>Продуктивність системи:</strong></p>
            <p>Покриття: ${((monthlyGeneration/monthlyUsage)*100).toFixed(0)}% споживання</p>
            <p>Щоденне виробництво: ${dailyGeneration.toFixed(1)} кВт⋅год</p>
          </div>
          <div>
            <p><strong>Аналіз інвестицій:</strong></p>
            <p>Загальні інвестиції: ₴${installationCost.toLocaleString()}</p>
            <p>25-річна економія: ₴${totalSavings25Years.toLocaleString()}</p>
          </div>
        </div>
        ${monthlyGeneration > monthlyUsage ? 
          `<div style="margin-top: 1rem; padding: 1rem; background: #e8f8e8; border-radius: 8px; border: 2px solid #28a745;">
            <p><strong>✅ Відмінне покриття!</strong> Ваша сонячна система виробляє ${((monthlyGeneration/monthlyUsage)*100).toFixed(0)}% вашого споживання електроенергії. 
            У вас може бути надлишкова енергія для продажу назад до мережі через програми чистого обліку.</p>
          </div>` : 
          monthlyGeneration > monthlyUsage * 0.8 ? 
          `<div style="margin-top: 1rem; padding: 1rem; background: #fff8e1; border-radius: 8px; border: 2px solid #ffc107;">
            <p><strong>⚡ Хороше покриття!</strong> Ваша сонячна система покриває ${((monthlyGeneration/monthlyUsage)*100).toFixed(0)}% вашого споживання електроенергії. 
            Розгляньте додавання більше панелей для досягнення повної енергетичної незалежності.</p>
          </div>` :
          `<div style="margin-top: 1rem; padding: 1rem; background: #ffe8e8; border-radius: 8px; border: 2px solid #dc3545;">
            <p><strong>⚠️ Часткове покриття</strong> Ваша сонячна система покриває лише ${((monthlyGeneration/monthlyUsage)*100).toFixed(0)}% вашого споживання електроенергії. 
            Розгляньте збільшення розміру системи для кращої економії.</p>
          </div>`
        }
      </div>
    `;

    // Показати графік
    const chartBlock = document.getElementById("solar-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("solar-chart").getContext("2d");
      if (window.solarChart) window.solarChart.destroy();

      window.solarChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: years,
          datasets: [{
            label: "Чиста економія (Накопичена - Вартість інвестицій)",
            data: timelineData,
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            fill: true,
            tension: 0.1
          }, {
            label: "Лінія беззбитковості",
            data: new Array(25).fill(0),
            borderColor: "#FF5722",
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Часова шкала інвестицій у сонячні панелі"
            },
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Чиста економія (₴)"
              },
              ticks: {
                callback: function(value) {
                  return '₴' + value.toLocaleString();
                }
              }
            },
            x: {
              title: {
                display: true,
                text: "Роки"
              }
            }
          },
          elements: {
            point: {
              radius: 3,
              hoverRadius: 6
            }
          }
        }
      });
    });
  });
});

// Забезпечити завантаження Chart.js
function ensureChartJs(callback) {
  if (typeof Chart !== 'undefined') {
    callback();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
}