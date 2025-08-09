document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("energy-audit-form");
  if (!form) return;

  // Energy efficiency factors and improvement opportunities
  const efficiencyFactors = {
    heating: {
      "gas-furnace": { efficiency: 0.85, cost: 1.0 },
      "electric-heat-pump": { efficiency: 2.5, cost: 0.9 },
      "electric-resistance": { efficiency: 1.0, cost: 1.5 },
      "oil-furnace": { efficiency: 0.82, cost: 1.2 },
      "boiler": { efficiency: 0.88, cost: 1.1 }
    },
    cooling: {
      "central-ac": { efficiency: 3.0, cost: 1.0 },
      "heat-pump": { efficiency: 3.2, cost: 0.9 },
      "window-units": { efficiency: 2.5, cost: 1.2 },
      "none": { efficiency: 0, cost: 0 }
    },
    insulation: {
      poor: { rValue: 10, heatLoss: 1.4 },
      fair: { rValue: 20, heatLoss: 1.2 },
      good: { rValue: 35, heatLoss: 1.0 },
      excellent: { rValue: 50, heatLoss: 0.8 }
    },
    windows: {
      single: { uValue: 1.1, cost: 1.3 },
      double: { uValue: 0.6, cost: 1.0 },
      triple: { uValue: 0.3, cost: 0.8 },
      storm: { uValue: 0.5, cost: 0.9 }
    },
    airLeakage: {
      high: { infiltration: 1.5 },
      moderate: { infiltration: 1.2 },
      low: { infiltration: 1.0 }
    }
  };

  // Improvement recommendations database (Ukrainian translations and UAH pricing)
  const improvements = {
    airSealing: {
      name: "Герметизація повітря",
      cost: 20000, // 800 USD * 25 UAH/USD
      savings: 0.15,
      payback: 2,
      description: "Заклейте витоки повітря навколо вікон, дверей та отворів"
    },
    atticInsulation: {
      name: "Утеплення горища",
      cost: 37500, // 1500 USD * 25
      savings: 0.12,
      payback: 3,
      description: "Покращте утеплення горища до R-38 до R-50"
    },
    wallInsulation: {
      name: "Утеплення стін",
      cost: 87500, // 3500 USD * 25
      savings: 0.08,
      payback: 8,
      description: "Додайте утеплення до зовнішніх стін"
    },
    windowUpgrade: {
      name: "Модернізація вікон",
      cost: 200000, // 8000 USD * 25
      savings: 0.10,
      payback: 15,
      description: "Замініть на сертифіковані Energy Star вікна"
    },
    hvacUpgrade: {
      name: "Модернізація HVAC",
      cost: 150000, // 6000 USD * 25
      savings: 0.20,
      payback: 8,
      description: "Замініть на високоефективну систему опалення/охолодження"
    },
    smartThermostat: {
      name: "Розумний термостат",
      cost: 6250, // 250 USD * 25
      savings: 0.08,
      payback: 1.5,
      description: "Встановіть програмований або розумний термостат"
    },
    waterHeaterUpgrade: {
      name: "Модернізація водонагрівача",
      cost: 30000, // 1200 USD * 25
      savings: 0.06,
      payback: 8,
      description: "Замініть на високоефективний агрегат"
    },
    ledLighting: {
      name: "Перехід на LED освітлення",
      cost: 7500, // 300 USD * 25
      savings: 0.04,
      payback: 1,
      description: "Замініть всі лампи на LED освітлення"
    },
    ductSealing: {
      name: "Герметизація повітроводів",
      cost: 15000, // 600 USD * 25
      savings: 0.10,
      payback: 3,
      description: "Загерметизуйте та утепліть повітроводи HVAC"
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect form data
    const homeSize = parseFloat(document.getElementById("homeSize").value);
    const homeAge = parseInt(document.getElementById("homeAge").value);
    const homeType = document.getElementById("homeType").value;
    const stories = document.getElementById("stories").value;
    const monthlyElectric = parseFloat(document.getElementById("monthlyElectric").value);
    const monthlyGas = parseFloat(document.getElementById("monthlyGas").value);
    const electricRate = parseFloat(document.getElementById("electricRate").value);
    const gasRate = parseFloat(document.getElementById("gasRate").value);
    const heatingType = document.getElementById("heatingType").value;
    const heatingAge = parseInt(document.getElementById("heatingAge").value);
    const coolingType = document.getElementById("coolingType").value;
    const programmableThermostat = document.getElementById("programmableThermostat").value;
    const insulationLevel = document.getElementById("insulationLevel").value;
    const windowType = document.getElementById("windowType").value;
    const airLeakage = document.getElementById("airLeakage").value;
    const waterHeaterType = document.getElementById("waterHeaterType").value;
    const waterHeaterAge = parseInt(document.getElementById("waterHeaterAge").value);
    const waterHeaterInsulation = document.getElementById("waterHeaterInsulation").value;
    const lightingType = document.getElementById("lightingType").value;
    const applianceAge = document.getElementById("applianceAge").value;
    const energyStarAppliances = document.getElementById("energyStarAppliances").value;
    const climateZone = document.getElementById("climateZone").value;
    const heatingDegreeDays = parseInt(document.getElementById("heatingDegreeeDays").value);
    const coolingDegreeDays = parseInt(document.getElementById("coolingDegreeDays").value);

    // Calculate current energy usage breakdown
    const currentUsage = calculateCurrentUsage({
      homeSize, monthlyElectric, monthlyGas, electricRate, gasRate,
      heatingType, coolingType, heatingDegreeDays, coolingDegreeDays
    });

    // Calculate energy efficiency score
    const efficiencyScore = calculateEfficiencyScore({
      homeAge, heatingType, heatingAge, coolingType, insulationLevel,
      windowType, airLeakage, waterHeaterType, waterHeaterAge,
      lightingType, applianceAge, programmableThermostat
    });

    // Generate improvement recommendations
    const recommendations = generateRecommendations({
      homeSize, homeAge, currentUsage, efficiencyScore,
      heatingType, heatingAge, coolingType, insulationLevel,
      windowType, airLeakage, programmableThermostat, lightingType,
      waterHeaterType, waterHeaterAge
    });

    // Calculate potential savings
    const savingsAnalysis = calculateSavingsAnalysis(currentUsage, recommendations);

    // Generate priority improvement plan
    const improvementPlan = generateImprovementPlan(recommendations, currentUsage.total);

    // Display results
    displayResults({
      currentUsage,
      efficiencyScore,
      recommendations,
      savingsAnalysis,
      improvementPlan,
      homeSize,
      homeAge,
      climateZone
    });

    // Show energy breakdown chart
    showEnergyChart(currentUsage, savingsAnalysis);
  });



  function calculateCurrentUsage(data) {
    const electricUsage = data.monthlyElectric / data.electricRate; // kWh
    const gasUsage = data.monthlyGas / data.gasRate; // m³
    
    // Estimate breakdown based on typical home patterns
    const heatingPercent = Math.min(0.6, data.heatingDegreeDays / 8000);
    const coolingPercent = Math.min(0.3, data.coolingDegreeDays / 3000);
    const basePercent = 1 - heatingPercent - coolingPercent;

    const breakdown = {
      heating: data.monthlyGas * heatingPercent + data.monthlyElectric * 0.1,
      cooling: data.monthlyElectric * coolingPercent,
      waterHeating: data.monthlyGas * 0.3 + data.monthlyElectric * 0.15,
      lighting: data.monthlyElectric * 0.12,
      appliances: data.monthlyElectric * 0.35,
      other: data.monthlyElectric * basePercent + data.monthlyGas * 0.1
    };

    breakdown.total = data.monthlyElectric + data.monthlyGas;
    breakdown.annual = breakdown.total * 12;
    breakdown.perSqM = breakdown.total / data.homeSize;

    return breakdown;
  }

  function calculateEfficiencyScore(data) {
    let score = 50; // Base score

    // Heating system efficiency
    const heatingFactor = efficiencyFactors.heating[data.heatingType];
    if (heatingFactor) {
      score += (heatingFactor.efficiency - 1) * 10;
      score -= Math.max(0, (data.heatingAge - 10) * 2); // Age penalty
    }

    // Insulation quality
    const insulationFactor = efficiencyFactors.insulation[data.insulationLevel];
    if (insulationFactor) {
      score += (insulationFactor.rValue - 20) / 2;
    }

    // Window efficiency
    const windowFactor = efficiencyFactors.windows[data.windowType];
    if (windowFactor) {
      score += (0.6 - windowFactor.uValue) * 20;
    }

    // Air sealing
    const airFactor = efficiencyFactors.airLeakage[data.airLeakage];
    if (airFactor) {
      score += (1.5 - airFactor.infiltration) * 15;
    }

    // Thermostat control
    if (data.programmableThermostat === "smart") score += 8;
    else if (data.programmableThermostat === "basic") score += 4;

    // Lighting efficiency
    if (data.lightingType === "led") score += 8;
    else if (data.lightingType === "cfl") score += 4;
    else if (data.lightingType === "incandescent") score -= 5;

    // Water heater age
    score -= Math.max(0, (data.waterHeaterAge - 8) * 1.5);

    // Home age factor
    score -= Math.max(0, (data.homeAge - 20) * 0.5);

    return {
      score: Math.max(0, Math.min(100, score)),
      rating: getEfficiencyRating(score)
    };
  }

  function getEfficiencyRating(score) {
    if (score >= 85) return { level: "Відмінно", class: "success", description: "Високоефективний дім" };
    if (score >= 70) return { level: "Добре", class: "success", description: "Ефективність вище середнього" };
    if (score >= 55) return { level: "Задовільно", class: "warning", description: "Середня ефективність" };
    if (score >= 40) return { level: "Погано", class: "warning", description: "Ефективність нижче середнього" };
    return { level: "Дуже погано", class: "error", description: "Потрібні значні покращення" };
  }

  function generateRecommendations(data) {
    const recs = [];

    // Air sealing (almost always recommended)
    if (data.airLeakage !== "low") {
      recs.push({
        ...improvements.airSealing,
        priority: 1,
        applicable: true
      });
    }

    // Insulation upgrades
    if (data.insulationLevel === "poor" || data.insulationLevel === "fair") {
      recs.push({
        ...improvements.atticInsulation,
        priority: data.insulationLevel === "poor" ? 1 : 2,
        applicable: true
      });

      if (data.insulationLevel === "poor") {
        recs.push({
          ...improvements.wallInsulation,
          priority: 3,
          applicable: true
        });
      }
    }

    // HVAC system upgrade
    if (data.heatingAge > 15 || data.heatingType === "electric-resistance") {
      recs.push({
        ...improvements.hvacUpgrade,
        priority: data.heatingAge > 20 ? 2 : 3,
        applicable: true
      });
    }

    // Smart thermostat
    if (data.programmableThermostat === "no") {
      recs.push({
        ...improvements.smartThermostat,
        priority: 1,
        applicable: true
      });
    }

    // Window upgrades
    if (data.windowType === "single") {
      recs.push({
        ...improvements.windowUpgrade,
        priority: 4,
        applicable: true
      });
    }

    // Water heater upgrade
    if (data.waterHeaterAge > 12 || data.waterHeaterType === "electric-tank") {
      recs.push({
        ...improvements.waterHeaterUpgrade,
        priority: 3,
        applicable: true
      });
    }

    // LED lighting
    if (data.lightingType !== "led") {
      recs.push({
        ...improvements.ledLighting,
        priority: 1,
        applicable: true
      });
    }

    // Duct sealing (for older homes with central systems)
    if (data.homeAge > 10 && data.heatingType.includes("furnace")) {
      recs.push({
        ...improvements.ductSealing,
        priority: 2,
        applicable: true
      });
    }

    // Sort by priority and payback period
    return recs.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.payback - b.payback;
    });
  }

  function calculateSavingsAnalysis(currentUsage, recommendations) {
    let totalInvestment = 0;
    let totalAnnualSavings = 0;
    let cumulativeSavings = 0;

    const implementedSavings = recommendations.map(rec => {
      if (rec.applicable) {
        const annualSaving = currentUsage.annual * rec.savings;
        totalInvestment += rec.cost;
        totalAnnualSavings += annualSaving;
        cumulativeSavings += annualSaving;

        return {
          ...rec,
          annualSaving: annualSaving,
          lifetimeSaving: annualSaving * 15, // 15-year analysis
          actualPayback: rec.cost / annualSaving
        };
      }
      return rec;
    });

    return {
      totalInvestment,
      totalAnnualSavings,
      totalLifetimeSavings: totalAnnualSavings * 15,
      averagePayback: totalInvestment / totalAnnualSavings,
      roi: (totalAnnualSavings * 15 - totalInvestment) / totalInvestment * 100,
      recommendations: implementedSavings
    };
  }

  function generateImprovementPlan(recommendations, currentAnnualCost) {
    const phases = [
      {
        phase: "Фаза 1: Швидкі покращення (Рік 1)",
        budget: 50000,
        items: [],
        totalCost: 0,
        totalSavings: 0
      },
      {
        phase: "Фаза 2: Великі покращення (Роки 2-3)", 
        budget: 200000,
        items: [],
        totalCost: 0,
        totalSavings: 0
      },
      {
        phase: "Фаза 3: Модернізація систем (Роки 4-5)",
        budget: 375000,
        items: [],
        totalCost: 0,
        totalSavings: 0
      }
    ];

    let remainingRecs = [...recommendations];

    // Phase 1: Low-cost, high-impact improvements
    phases[0].items = remainingRecs.filter(rec => 
      rec.applicable && rec.cost <= 25000 && rec.payback <= 3
    );

    // Phase 2: Medium-cost improvements
    const phase1Items = phases[0].items.map(item => item.name);
    remainingRecs = remainingRecs.filter(rec => !phase1Items.includes(rec.name));
    
    phases[1].items = remainingRecs.filter(rec =>
      rec.applicable && rec.cost <= 125000
    );

    // Phase 3: Major system upgrades
    const phase2Items = phases[1].items.map(item => item.name);
    remainingRecs = remainingRecs.filter(rec => !phase2Items.includes(rec.name));
    
    phases[2].items = remainingRecs.filter(rec => rec.applicable);

    // Calculate phase totals
    phases.forEach(phase => {
      phase.totalCost = phase.items.reduce((sum, item) => sum + item.cost, 0);
      phase.totalSavings = phase.items.reduce((sum, item) => 
        sum + (currentAnnualCost * item.savings), 0
      );
      phase.payback = phase.totalCost / (phase.totalSavings || 1);
    });

    return phases;
  }

  function displayResults(data) {
    const resultBlock = document.getElementById("energy-audit-result");
    
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${data.efficiencyScore.rating.class}">
          <h6>⭐ Рейтинг ефективності</h6>
          <div class="big-number">${data.efficiencyScore.score}</div>
          <p class="insight-detail">${data.efficiencyScore.rating.level}</p>
        </div>
        <div class="insight-card warning">
          <h6>💰 Річні витрати на енергію</h6>
          <div class="big-number">${data.currentUsage.annual.toLocaleString()} грн</div>
          <p class="insight-detail">поточні витрати</p>
        </div>
        <div class="insight-card success">
          <h6>📉 Потенційна економія</h6>
          <div class="big-number">${data.savingsAnalysis.totalAnnualSavings.toFixed(0)} грн</div>
          <p class="insight-detail">річна з покращеннями</p>
        </div>
        <div class="insight-card info">
          <h6>⏱️ Період окупності</h6>
          <div class="big-number">${data.savingsAnalysis.averagePayback.toFixed(1)}</div>
          <p class="insight-detail">років в середньому</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">🏠 Аналіз енергетичної ефективності дому</h4>
        
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: ${data.efficiencyScore.rating.class === 'success' ? '#e8f8e8' : data.efficiencyScore.rating.class === 'warning' ? '#fff8e1' : '#ffe8e8'}; 
                    border-radius: 8px; border: 2px solid ${data.efficiencyScore.rating.class === 'success' ? '#28a745' : data.efficiencyScore.rating.class === 'warning' ? '#ffc107' : '#dc3545'};">
          <p style="margin: 0;"><strong>📊 Загальна оцінка:</strong> Ваш дім має ${data.efficiencyScore.score}/100 балів (${data.efficiencyScore.rating.description})</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div>
            <h5>🏠 Профіль дому</h5>
            <p><strong>Площа:</strong> ${data.homeSize} м²</p>
            <p><strong>Вік:</strong> ${data.homeAge} років</p>
            <p><strong>Кліматична зона:</strong> ${data.climateZone}</p>
            <p><strong>Витрати на енергію за м²:</strong> ${data.currentUsage.perSqM.toFixed(2)} грн/місяць</p>
          </div>
          
          <div>
            <h5>💡 Поточне споживання енергії</h5>
            <p><strong>Щомісячно загалом:</strong> ${data.currentUsage.total.toFixed(0)} грн</p>
            <p><strong>Щорічно загалом:</strong> ${data.currentUsage.annual.toLocaleString()} грн</p>
            <p><strong>Опалення:</strong> ${data.currentUsage.heating.toFixed(0)} грн</p>
            <p><strong>Охолодження:</strong> ${data.currentUsage.cooling.toFixed(0)} грн</p>
            <p><strong>Нагрівання води:</strong> ${data.currentUsage.waterHeating.toFixed(0)} грн</p>
          </div>
          
          <div>
            <h5>📈 Потенціал покращення</h5>
            <p><strong>Загальні інвестиції:</strong> ${data.savingsAnalysis.totalInvestment.toLocaleString()} грн</p>
            <p><strong>Річна економія:</strong> ${data.savingsAnalysis.totalAnnualSavings.toFixed(0)} грн</p>
            <p><strong>15-річна економія:</strong> ${data.savingsAnalysis.totalLifetimeSavings.toLocaleString()} грн</p>
            <p><strong>ROI:</strong> ${data.savingsAnalysis.roi.toFixed(0)}%</p>
          </div>
        </div>

        <h5>🎯 Пріоритетні рекомендації з покращення</h5>
        <div style="margin-bottom: 2rem;">
          ${data.recommendations.filter(rec => rec.applicable).map((rec, index) => `
            <div style="display: grid; grid-template-columns: auto 1fr auto auto auto; gap: 1rem; align-items: center; 
                        padding: 1rem; margin-bottom: 0.5rem; background: white; border-radius: 8px; 
                        border-left: 4px solid ${rec.priority === 1 ? '#f44336' : rec.priority === 2 ? '#ff9800' : '#4caf50'};">
              <span style="font-weight: 600; color: ${rec.priority === 1 ? '#f44336' : rec.priority === 2 ? '#ff9800' : '#4caf50'};">
                #${index + 1}
              </span>
              <div>
                <p style="margin: 0; font-weight: 600;">${rec.name}</p>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; color: #666;">${rec.description}</p>
              </div>
              <span style="font-weight: 600;">${rec.cost.toLocaleString()} грн</span>
              <span style="color: #28a745;">${(data.currentUsage.annual * rec.savings).toFixed(0)} грн/рік</span>
              <span style="color: #1976d2;">${rec.payback.toFixed(1)} років</span>
            </div>
          `).join('')}
        </div>

        <h5>📅 Поетапний план впровадження</h5>
        <div style="display: grid; gap: 1.5rem; margin-bottom: 2rem;">
          ${data.improvementPlan.map(phase => `
            <div style="padding: 1rem; background: white; border-radius: 8px; border: 2px solid #e0e0e0;">
              <h6 style="margin-top: 0; color: var(--accent);">${phase.phase}</h6>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                <p><strong>Загальна вартість:</strong> ${phase.totalCost.toLocaleString()} грн</p>
                <p><strong>Річна економія:</strong> ${phase.totalSavings.toFixed(0)} грн</p>
                <p><strong>Окупність:</strong> ${phase.payback.toFixed(1)} років</p>
                <p><strong>Елементи:</strong> ${phase.items.length}</p>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem;">
                ${phase.items.map(item => `
                  <div style="padding: 0.5rem; background: #f8f9fa; border-radius: 4px; font-size: 0.9rem;">
                    ✓ ${item.name} (${item.cost.toLocaleString()} грн)
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
            <h6 style="margin-top: 0; color: #1976d2;">💡 Поради з енергозбереження</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Встановлюйте термостат на 18°C взимку, 25°C влітку</li>
              <li>Використовуйте стельові вентилятори для покращення комфорту</li>
              <li>Відключайте електроніку коли не користуєтесь</li>
              <li>Запускайте посудомийку та пральну машину при повному завантаженні</li>
            </ul>
          </div>
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; border: 2px solid #28a745;">
            <h6 style="margin-top: 0; color: #28a745;">🎯 Наступні кроки</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Почніть з швидких покращень Фази 1</li>
              <li>Отримайте професійний енергоаудит для детального аналізу</li>
              <li>Дослідіть комунальні знижки та податкові пільги</li>
              <li>Розгляньте варіанти фінансування для великих покращень</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function showEnergyChart(currentUsage, savingsAnalysis) {
    const chartBlock = document.getElementById("energy-audit-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("energy-audit-chart").getContext("2d");
      if (window.energyAuditChart) window.energyAuditChart.destroy();

      const labels = ['Опалення', 'Охолодження', 'Нагрівання води', 'Освітлення', 'Побутова техніка', 'Інше'];
      const currentData = [
        currentUsage.heating,
        currentUsage.cooling,
        currentUsage.waterHeating,
        currentUsage.lighting,
        currentUsage.appliances,
        currentUsage.other
      ];

      const improvedData = currentData.map(value => 
        value * (1 - savingsAnalysis.totalAnnualSavings / currentUsage.annual)
      );

      window.energyAuditChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Поточні щомісячні витрати",
            data: currentData,
            backgroundColor: '#ff9800',
            borderWidth: 2,
            borderColor: '#fff'
          }, {
            label: "Після покращень",
            data: improvedData,
            backgroundColor: '#4caf50',
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Розподіл витрат на енергію: поточний vs покращений'
            },
            legend: {
              display: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Щомісячні витрати (грн)'
              },
              ticks: {
                callback: function(value) {
                  return value.toFixed(0) + ' грн';
                }
              }
            }
          }
        }
      });
    });
  }
});

// Ensure Chart.js is loaded
function ensureChartJs(callback) {
  if (typeof Chart !== 'undefined') {
    callback();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
    script.onload = callback;
    script.onerror = function() {
      // Fallback: try alternative CDN or show message
      console.warn('Failed to load Chart.js from CDN, chart will not be displayed');
    };
    document.head.appendChild(script);
  }
}