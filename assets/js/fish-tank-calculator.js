document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('fish-tank-form');
  const result = document.getElementById('fish-tank-result');
  const tankSizeSelect = document.getElementById('tank-size');
  const customSizeDiv = document.getElementById('custom-size');

  // Show/hide custom size inputs
  tankSizeSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
      customSizeDiv.style.display = 'block';
    } else {
      customSizeDiv.style.display = 'none';
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const tankType = document.getElementById('tank-type').value;
      const tankSize = document.getElementById('tank-size').value;
      const experience = document.getElementById('experience-level').value;
      const budget = document.getElementById('budget-range').value;

      if (!tankType || !tankSize || !experience || !budget) {
        result.innerHTML = '<div class="error">❌ Будь ласка, заповніть всі поля</div>';
        return;
      }

      let volumeGallons, volumeLiters;
      
      if (tankSize === 'custom') {
        const length = parseFloat(document.getElementById('tank-length').value);
        const width = parseFloat(document.getElementById('tank-width').value);
        const height = parseFloat(document.getElementById('tank-height').value);
        
        if (!length || !width || !height) {
          result.innerHTML = '<div class="error">❌ Вкажіть всі розміри для користувацького акваріума</div>';
          return;
        }
        
        volumeLiters = (length * width * height) / 1000;
        volumeGallons = volumeLiters / 3.78541;
      } else {
        volumeGallons = parseFloat(tankSize);
        volumeLiters = volumeGallons * 3.78541;
      }

      const calculations = calculateTankRequirements(tankType, volumeGallons, volumeLiters, experience, budget);
      displayResults(calculations);
    });
  }

  function calculateTankRequirements(tankType, gallons, liters, experience, budget) {
    const calc = {
      volume: { gallons: gallons, liters: liters },
      tankType: tankType,
      experience: experience,
      budget: budget
    };

    // Equipment calculations
    calc.equipment = calculateEquipment(tankType, liters, budget);
    
    // Fish capacity
    calc.fishCapacity = calculateFishCapacity(tankType, liters, experience);
    
    // Maintenance schedule
    calc.maintenance = calculateMaintenance(tankType, liters);
    
    // Costs
    calc.costs = calculateCosts(tankType, liters, budget);
    
    // Recommendations
    calc.recommendations = getRecommendations(tankType, gallons, experience);

    return calc;
  }

  function calculateEquipment(tankType, liters, budget) {
    const equipment = {};
    
    // Filter calculation (4-10x tank volume per hour)
    const filterFlowMin = liters * 4;
    const filterFlowMax = liters * 8;
    equipment.filter = {
      flowRate: `${Math.round(filterFlowMin)}-${Math.round(filterFlowMax)} л/год`,
      type: tankType === 'saltwater' ? 'Каністровий + скімер' : liters > 150 ? 'Каністровий' : 'Внутрішній'
    };

    // Heater calculation (5W per 4 liters for tropical)
    if (tankType !== 'coldwater') {
      const heaterWatts = Math.round((liters / 4) * 5);
      equipment.heater = {
        watts: heaterWatts,
        type: heaterWatts > 150 ? '2 нагрівача по ' + Math.round(heaterWatts/2) + 'Вт' : heaterWatts + 'Вт'
      };
    }

    // Lighting (LED 0.5-1W per liter)
    const lightingWatts = tankType === 'planted' ? 
      Math.round(liters * 1) : Math.round(liters * 0.6);
    equipment.lighting = {
      watts: lightingWatts,
      type: tankType === 'planted' ? 'LED повний спектр' : 'LED базовий'
    };

    // Air pump for certain setups
    if (tankType === 'betta' || liters < 40) {
      equipment.airPump = {
        required: true,
        type: 'Мембранний насос 2-5 Вт'
      };
    }

    return equipment;
  }

  function calculateFishCapacity(tankType, liters, experience) {
    let baseCapacity;
    
    switch (tankType) {
      case 'betta':
        baseCapacity = { count: 1, description: '1 бетта + можливо креветки' };
        break;
      case 'saltwater':
        baseCapacity = { 
          count: Math.floor(liters / 20), 
          description: 'Морські риби потребують більше простору' 
        };
        break;
      case 'cichlid':
        baseCapacity = { 
          count: Math.floor(liters / 15), 
          description: 'Цихліди територіальні, потрібно простір' 
        };
        break;
      default:
        baseCapacity = { 
          count: Math.floor(liters / 5), 
          description: 'Дрібні риби: 1 см риби = 1 л води' 
        };
    }

    // Adjust for experience
    if (experience === 'beginner') {
      baseCapacity.count = Math.floor(baseCapacity.count * 0.7);
      baseCapacity.description += ' (зменшено для початківців)';
    }

    return baseCapacity;
  }

  function calculateMaintenance(tankType, liters) {
    const waterChangePercent = tankType === 'saltwater' ? 20 : 25;
    const waterChangeAmount = Math.round(liters * waterChangePercent / 100);
    
    return {
      waterChange: {
        frequency: 'Щотижня',
        amount: `${waterChangeAmount} л (${waterChangePercent}%)`
      },
      cleaning: {
        substrate: 'Кожні 2 тижні',
        glass: 'Щотижня',
        filter: tankType === 'saltwater' ? 'Щомісяця' : 'Кожні 2-4 тижні'
      },
      testing: {
        frequency: tankType === 'saltwater' ? 'Щотижня' : 'Кожні 2 тижні',
        parameters: tankType === 'saltwater' ? 
          'pH, амоній, нітрити, нітрати, солоність' : 
          'pH, амоній, нітрити, нітрати'
      }
    };
  }

  function calculateCosts(tankType, liters, budget) {
    let baseCostPerLiter;
    
    switch (budget) {
      case 'low': baseCostPerLiter = 80; break;
      case 'medium': baseCostPerLiter = 150; break;
      case 'high': baseCostPerLiter = 250; break;
    }

    // Saltwater multiplier
    if (tankType === 'saltwater') {
      baseCostPerLiter *= 1.8;
    }

    const initialCost = Math.round(liters * baseCostPerLiter);
    
    // Monthly costs
    const monthlyCosts = {
      food: Math.round(liters * 2),
      electricity: Math.round(liters * 3),
      chemicals: tankType === 'saltwater' ? Math.round(liters * 8) : Math.round(liters * 2),
      maintenance: Math.round(liters * 1.5)
    };

    const totalMonthly = Object.values(monthlyCosts).reduce((a, b) => a + b, 0);

    return {
      initial: initialCost,
      monthly: {
        breakdown: monthlyCosts,
        total: totalMonthly
      },
      yearly: totalMonthly * 12
    };
  }

  function getRecommendations(tankType, gallons, experience) {
    const recommendations = [];

    if (gallons < 10 && tankType !== 'betta') {
      recommendations.push('⚠️ Акваріуми менше 40л складні в утриманні для початківців');
    }

    if (tankType === 'saltwater' && experience === 'beginner') {
      recommendations.push('💡 Рекомендуємо почати з прісноводного акваріума');
    }

    if (gallons >= 55) {
      recommendations.push('✅ Відмінний розмір для стабільної екосистеми');
    }

    if (tankType === 'betta') {
      recommendations.push('🐠 Бетта потребує теплої води (24-26°C) та лабіринтової поверхні');
    }

    if (tankType === 'planted') {
      recommendations.push('🌱 Рослинному акваріуму потрібен CO2 та спеціальне освітлення');
    }

    return recommendations;
  }

  function displayResults(calc) {
    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>📏 Об'єм акваріума</h6>
          <div class="big-number">${Math.round(calc.volume.liters)} л</div>
          <div>${Math.round(calc.volume.gallons)} галонів</div>
        </div>
        
        <div class="insight-card success">
          <h6>🐠 Кількість риби</h6>
          <div class="big-number">${calc.fishCapacity.count}</div>
          <div>${calc.fishCapacity.description}</div>
        </div>
        
        <div class="insight-card warning">
          <h6>💰 Початкова вартість</h6>
          <div class="big-number">${calc.costs.initial.toLocaleString()}</div>
          <div>грн (з обладнанням)</div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>⚙️ Необхідне обладнання</h4>
        <div class="equipment-list">
          <div><strong>Фільтр:</strong> ${calc.equipment.filter.type}, ${calc.equipment.filter.flowRate}</div>
          ${calc.equipment.heater ? `<div><strong>Нагрівач:</strong> ${calc.equipment.heater.type}</div>` : ''}
          <div><strong>Освітлення:</strong> ${calc.equipment.lighting.type}, ${calc.equipment.lighting.watts}Вт</div>
          ${calc.equipment.airPump ? `<div><strong>Аератор:</strong> ${calc.equipment.airPump.type}</div>` : ''}
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>🗓️ Графік догляду</h4>
        <div class="maintenance-schedule">
          <div><strong>Заміна води:</strong> ${calc.maintenance.waterChange.frequency} - ${calc.maintenance.waterChange.amount}</div>
          <div><strong>Чищення скла:</strong> ${calc.maintenance.cleaning.glass}</div>
          <div><strong>Чищення грунту:</strong> ${calc.maintenance.cleaning.substrate}</div>
          <div><strong>Обслуговування фільтра:</strong> ${calc.maintenance.cleaning.filter}</div>
          <div><strong>Тестування води:</strong> ${calc.maintenance.testing.frequency} (${calc.maintenance.testing.parameters})</div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>💸 Щомісячні витрати</h4>
        <div class="cost-breakdown">
          <div>Корм: ${calc.costs.monthly.breakdown.food} грн</div>
          <div>Електроенергія: ${calc.costs.monthly.breakdown.electricity} грн</div>
          <div>Хімія/препарати: ${calc.costs.monthly.breakdown.chemicals} грн</div>
          <div>Обслуговування: ${calc.costs.monthly.breakdown.maintenance} грн</div>
          <div style="border-top: 1px solid #ddd; padding-top: 0.5rem; margin-top: 0.5rem;">
            <strong>Всього: ${calc.costs.monthly.total} грн/місяць</strong>
          </div>
          <div style="color: #666; font-size: 0.9rem;">Річні витрати: ${calc.costs.yearly.toLocaleString()} грн</div>
        </div>
      </div>

      ${calc.recommendations.length > 0 ? `
        <div style="margin-top: 2rem;">
          <h4>💡 Рекомендації</h4>
          <div class="recommendations">
            ${calc.recommendations.map(rec => `<div>${rec}</div>`).join('')}
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
        <p><strong>📝 Примітка:</strong> Розрахунки є орієнтовними та можуть варіюватися залежно від конкретних умов, обраних риб та обладнання. Для морських акваріумів рекомендується консультація з досвідченими акваріумістами.</p>
      </div>
    `;

    result.innerHTML = html;
  }
});