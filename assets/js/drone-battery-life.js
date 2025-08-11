document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("drone-form");
  const result = document.getElementById("drone-result");

  // Set default values
  const defaultValues = {
    batteryCapacity: 5000,
    batteryVoltage: 14.8,
    droneWeight: 1500,
    payload: 400,
    flightConditions: 'moderate',
    flightStyle: 'normal',
    temperature: 20,
    batteryCondition: 'new'
  };

  // Initialize form with defaults
  Object.keys(defaultValues).forEach(key => {
    const element = document.getElementById(key);
    if (element && element.tagName === 'INPUT') {
      element.value = defaultValues[key];
    } else if (element && element.tagName === 'SELECT') {
      element.value = defaultValues[key];
    }
  });

  // Calculate on form submission and input changes
  form.addEventListener("submit", calculateFlightTime);
  form.addEventListener("input", calculateFlightTime);
  form.addEventListener("change", calculateFlightTime);

  // Calculate initial values
  calculateFlightTime({ preventDefault: () => {} });

  function calculateFlightTime(e) {
    e.preventDefault();

    const batteryCapacity = parseFloat(document.getElementById("batteryCapacity").value) || 5000;
    const batteryVoltage = parseFloat(document.getElementById("batteryVoltage").value) || 14.8;
    const droneWeight = parseFloat(document.getElementById("droneWeight").value) || 1500;
    const payload = parseFloat(document.getElementById("payload").value) || 0;
    const flightConditions = document.getElementById("flightConditions").value || 'moderate';
    const flightStyle = document.getElementById("flightStyle").value || 'normal';
    const temperature = parseFloat(document.getElementById("temperature").value) || 20;
    const batteryCondition = document.getElementById("batteryCondition").value || 'new';

    // Calculate total weight
    const totalWeight = droneWeight + payload;

    // Battery energy in Wh (Watt-hours)
    let batteryEnergyWh = (batteryCapacity * batteryVoltage) / 1000;

    // Apply temperature coefficient
    let tempCoeff = 1.0;
    if (temperature < 0) tempCoeff = 0.7;
    else if (temperature < 10) tempCoeff = 0.85;
    else if (temperature < 20) tempCoeff = 0.95;
    else if (temperature > 40) tempCoeff = 0.9;

    // Apply battery condition coefficient
    const batteryCondCoeff = {
      'new': 1.0,
      'good': 0.9,
      'moderate': 0.75,
      'poor': 0.6
    };

    batteryEnergyWh *= tempCoeff * batteryCondCoeff[batteryCondition];

    // Base power consumption calculation (simplified model)
    // Formula based on weight, aerodynamics, and hover efficiency
    let basePowerW = Math.max(50, (totalWeight * 0.15)); // Base consumption in Watts

    // Flight style multiplier
    const flightStyleMultiplier = {
      'smooth': 0.8,
      'normal': 1.0,
      'aggressive': 1.4,
      'hover': 1.2
    };

    // Weather conditions multiplier
    const weatherMultiplier = {
      'calm': 1.0,
      'moderate': 1.25,
      'windy': 1.6,
      'extreme': 2.2
    };

    const totalPowerW = basePowerW * flightStyleMultiplier[flightStyle] * weatherMultiplier[flightConditions];

    // Flight time in hours
    const flightTimeHours = batteryEnergyWh / totalPowerW;
    const flightTimeMinutes = flightTimeHours * 60;

    // Safety margin (reserve 25% for safe return)
    const safeFlightTime = flightTimeMinutes * 0.75;

    // Calculate additional metrics
    const totalRange = calculateRange(safeFlightTime, flightStyle);
    const recommendedBatteries = Math.ceil(60 / safeFlightTime); // For 1 hour of operation
    const powerEfficiency = batteryEnergyWh / totalPowerW;

    // Generate insights based on results
    let efficiencyStatus = "info";
    let efficiencyText = "Нормальна";
    if (safeFlightTime > 25) {
      efficiencyStatus = "success";
      efficiencyText = "Відмінна";
    } else if (safeFlightTime < 10) {
      efficiencyStatus = "warning";
      efficiencyText = "Низька";
    }

    // Display results
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${efficiencyStatus}">
          <h6>🕐 Час польоту</h6>
          <div class="big-number">${safeFlightTime.toFixed(1)}</div>
          <div class="result-value">хвилин (з резервом)</div>
        </div>

        <div class="insight-card info">
          <h6>📏 Орієнтовна дальність</h6>
          <div class="big-number">${totalRange.toFixed(1)}</div>
          <div class="result-value">км (туди-назад)</div>
        </div>

        <div class="insight-card">
          <h6>⚡ Споживання енергії</h6>
          <div class="big-number">${totalPowerW.toFixed(0)}</div>
          <div class="result-value">Вт</div>
        </div>

        <div class="insight-card">
          <h6>🔋 Ефективність</h6>
          <div class="result-value">${efficiencyText}</div>
          <div>${powerEfficiency.toFixed(2)} год/Вт</div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📊 Детальний аналіз</h4>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>🔍 Параметри розрахунку</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div>• <strong>Загальна вага:</strong> ${totalWeight.toFixed(0)} г</div>
            <div>• <strong>Енергія батареї:</strong> ${batteryEnergyWh.toFixed(1)} Вт·год</div>
            <div>• <strong>Теоретичний час:</strong> ${flightTimeMinutes.toFixed(1)} хв</div>
            <div>• <strong>Резерв батареї:</strong> 25% (безпека)</div>
          </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>⚠️ Рекомендації</h5>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            ${generateRecommendations(safeFlightTime, totalWeight, flightConditions, temperature)}
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>📈 Додаткова інформація</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div><strong>Батарей для години роботи:</strong> ${recommendedBatteries}</div>
            <div><strong>Максимальна дальність:</strong> ${(totalRange * 1.33).toFixed(1)} км</div>
            <div><strong>Час зарядки (1C):</strong> ${(batteryCapacity / 1000).toFixed(1)} год</div>
            <div><strong>Енергоефективність:</strong> ${(safeFlightTime / totalWeight * 1000).toFixed(2)} хв/кг</div>
          </div>
        </div>
      </div>
    `;
  }

  function calculateRange(flightTimeMinutes, flightStyle) {
    // Average speed based on flight style (km/h)
    const speeds = {
      'smooth': 25,
      'normal': 35,
      'aggressive': 45,
      'hover': 15
    };
    
    const speed = speeds[flightStyle] || 35;
    // Return trip calculation (60% of time for forward flight)
    return (flightTimeMinutes / 60) * speed * 0.6;
  }

  function generateRecommendations(flightTime, weight, conditions, temperature) {
    let recommendations = [];

    if (flightTime < 10) {
      recommendations.push('<li>🔋 <strong>Критично короткий час!</strong> Розгляньте батарею більшої ємності або зменшіть вагу</li>');
    }

    if (weight > 2000) {
      recommendations.push('<li>🏋️ Занадто велика вага може знижувати ефективність - перевірте необхідність всього обладнання</li>');
    }

    if (conditions === 'windy' || conditions === 'extreme') {
      recommendations.push('<li>💨 В умовах сильного вітру розгляньте перенесення польоту або зменшення навантаження</li>');
    }

    if (temperature < 10) {
      recommendations.push('<li>🌡️ Низька температура - прогрійте батарею перед польотом та тримайте запасні</li>');
    }

    if (flightTime > 20) {
      recommendations.push('<li>✅ Відмінна ефективність! Ваша конфігурація оптимально збалансована</li>');
    }

    recommendations.push('<li>📏 Завжди плануйте маршрут з урахуванням точки повернення при 30% заряду</li>');
    recommendations.push('<li>🔧 Регулярно калібруйте компас та перевіряйте стан пропелерів для максимальної ефективності</li>');

    return recommendations.join('\n            ');
  }
});