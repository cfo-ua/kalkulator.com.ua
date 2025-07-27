document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("car-valuation-form");
  const resultDiv = document.getElementById("car-valuation-result");

  // Initialize year dropdown
  initializeYearDropdown();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateCarValue();
  });

  function initializeYearDropdown() {
    const yearSelect = document.getElementById("car-year");
    const currentYear = new Date().getFullYear();
    
    // Add years from current year to 1980
    for (let year = currentYear; year >= 1980; year--) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      if (year === 2018) option.selected = true; // Default to 2018
      yearSelect.appendChild(option);
    }
  }

  function calculateCarValue() {
    // Get form data
    const brand = document.getElementById("car-brand").value;
    const model = document.getElementById("car-model").value;
    const year = parseInt(document.getElementById("car-year").value);
    const engineVolume = parseFloat(document.getElementById("engine-volume").value);
    const fuelType = document.getElementById("fuel-type").value;
    const transmission = document.getElementById("transmission").value;
    const drivetrain = document.getElementById("drivetrain").value;
    const bodyType = document.getElementById("body-type").value;
    const mileage = parseFloat(document.getElementById("mileage").value);
    const condition = document.getElementById("condition").value;
    const accidentHistory = document.getElementById("accident-history").value;
    const serviceHistory = document.getElementById("service-history").value;
    const legalStatus = document.getElementById("legal-status").value;
    const ownersCount = document.getElementById("owners-count").value;
    const region = document.getElementById("region").value;
    
    const winterTires = document.getElementById("winter-tires").checked;
    const spareKeys = document.getElementById("spare-keys").checked;
    const serviceBook = document.getElementById("service-book").checked;
    const warranty = document.getElementById("warranty").checked;

    if (!brand || !model || !year) {
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    // Calculate base value
    const baseValue = calculateBaseValue(brand, year, engineVolume, bodyType, fuelType);
    
    // Apply adjustments
    const adjustments = calculateAdjustments({
      year,
      mileage,
      condition,
      accidentHistory,
      serviceHistory,
      legalStatus,
      ownersCount,
      region,
      transmission,
      drivetrain,
      fuelType,
      winterTires,
      spareKeys,
      serviceBook,
      warranty
    });

    const finalValue = Math.round(baseValue * adjustments.totalMultiplier);
    
    const valuation = {
      brand,
      model,
      year,
      engineVolume,
      fuelType,
      mileage,
      baseValue,
      finalValue,
      adjustments,
      depreciation: calculateDepreciation(year, mileage),
      marketFactors: getMarketFactors(brand, fuelType, bodyType)
    };

    displayResults(valuation);
  }

  function calculateBaseValue(brand, year, engineVolume, bodyType, fuelType) {
    // Base values for popular Ukrainian brands (in USD, will convert to UAH)
    const brandMultipliers = {
      'Toyota': 1.3,
      'BMW': 1.4,
      'Mercedes-Benz': 1.5,
      'Audi': 1.35,
      'Volkswagen': 1.2,
      'Lexus': 1.45,
      'Tesla': 1.6,
      'Ford': 1.0,
      'Skoda': 1.1,
      'Hyundai': 1.05,
      'Kia': 1.0,
      'Renault': 0.95,
      'Nissan': 1.15,
      'Mazda': 1.1,
      'Honda': 1.25,
      'Peugeot': 0.9,
      'Citroen': 0.85,
      'Opel': 0.8,
      'Chevrolet': 0.85,
      'Mitsubishi': 0.95,
      'Subaru': 1.2,
      'Infiniti': 1.3,
      'Acura': 1.25,
      'Volvo': 1.15,
      'Saab': 0.7,
      'Other': 0.8
    };

    const bodyTypeMultipliers = {
      'sedan': 1.0,
      'hatchback': 0.95,
      'wagon': 1.05,
      'suv': 1.3,
      'crossover': 1.25,
      'coupe': 1.1,
      'convertible': 1.2,
      'minivan': 0.9,
      'pickup': 1.15
    };

    const fuelTypeMultipliers = {
      'petrol': 1.0,
      'diesel': 1.1,
      'gas': 0.85,
      'hybrid': 1.2,
      'electric': 1.4,
      'petrol-gas': 0.9
    };

    // Base calculation: engine volume is a major factor
    let basePrice = engineVolume * 8000; // Base price per liter in USD
    
    // Apply brand premium
    basePrice *= (brandMultipliers[brand] || 1.0);
    
    // Apply body type factor
    basePrice *= bodyTypeMultipliers[bodyType];
    
    // Apply fuel type factor
    basePrice *= fuelTypeMultipliers[fuelType];
    
    // Age depreciation (exponential decay)
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    const ageDepreciation = Math.pow(0.85, age); // 15% depreciation per year
    basePrice *= ageDepreciation;

    // Convert to UAH (approximate exchange rate)
    const usdToUahRate = 37;
    return Math.round(basePrice * usdToUahRate);
  }

  function calculateAdjustments(params) {
    let multiplier = 1.0;
    const factors = [];

    // Mileage adjustment
    const expectedMileage = (new Date().getFullYear() - params.year) * 18; // 18k km per year average
    const mileageRatio = params.mileage / expectedMileage;
    
    if (mileageRatio < 0.5) {
      // Very low mileage might be suspicious or beneficial
      multiplier *= 1.05;
      factors.push({ name: 'Малий пробіг', impact: '+5%' });
    } else if (mileageRatio < 0.8) {
      multiplier *= 1.1;
      factors.push({ name: 'Нижче середнього пробіг', impact: '+10%' });
    } else if (mileageRatio > 1.5) {
      multiplier *= 0.85;
      factors.push({ name: 'Високий пробіг', impact: '-15%' });
    } else if (mileageRatio > 1.2) {
      multiplier *= 0.9;
      factors.push({ name: 'Вище середнього пробіг', impact: '-10%' });
    }

    // Condition adjustment
    const conditionAdjustments = {
      'excellent': 1.1,
      'very-good': 1.0,
      'good': 0.9,
      'fair': 0.8,
      'poor': 0.6
    };
    const conditionImpact = conditionAdjustments[params.condition];
    multiplier *= conditionImpact;
    factors.push({ 
      name: 'Технічний стан', 
      impact: conditionImpact === 1.0 ? 'Базова ціна' : 
              conditionImpact > 1.0 ? `+${Math.round((conditionImpact - 1) * 100)}%` :
              `${Math.round((conditionImpact - 1) * 100)}%`
    });

    // Accident history adjustment
    const accidentAdjustments = {
      'none': 1.0,
      'minor': 0.9,
      'moderate': 0.75,
      'major': 0.5
    };
    const accidentImpact = accidentAdjustments[params.accidentHistory];
    multiplier *= accidentImpact;
    if (accidentImpact < 1.0) {
      factors.push({ name: 'Історія ДТП', impact: `${Math.round((accidentImpact - 1) * 100)}%` });
    }

    // Service history adjustment
    const serviceAdjustments = {
      'full': 1.05,
      'partial': 1.0,
      'none': 0.95
    };
    const serviceImpact = serviceAdjustments[params.serviceHistory];
    multiplier *= serviceImpact;
    if (serviceImpact !== 1.0) {
      factors.push({ 
        name: 'Сервісна історія', 
        impact: serviceImpact > 1.0 ? `+${Math.round((serviceImpact - 1) * 100)}%` :
                `${Math.round((serviceImpact - 1) * 100)}%`
      });
    }

    // Legal status adjustment
    const legalAdjustments = {
      'ua-cleared': 1.0,
      'europlates': 0.7,
      'temp-import': 0.75,
      'credit-encumbered': 0.85
    };
    const legalImpact = legalAdjustments[params.legalStatus];
    multiplier *= legalImpact;
    if (legalImpact < 1.0) {
      factors.push({ name: 'Юридичний статус', impact: `${Math.round((legalImpact - 1) * 100)}%` });
    }

    // Owners count adjustment
    const ownersAdjustments = {
      '1': 1.05,
      '2': 1.0,
      '3': 0.95,
      '4+': 0.9
    };
    const ownersImpact = ownersAdjustments[params.ownersCount];
    multiplier *= ownersImpact;
    if (ownersImpact !== 1.0) {
      factors.push({ 
        name: 'Кількість власників', 
        impact: ownersImpact > 1.0 ? `+${Math.round((ownersImpact - 1) * 100)}%` :
                `${Math.round((ownersImpact - 1) * 100)}%`
      });
    }

    // Region adjustment
    const regionAdjustments = {
      'kyiv': 1.0,
      'kyiv-oblast': 0.95,
      'kharkiv': 0.9,
      'dnipro': 0.9,
      'odesa': 0.92,
      'lviv': 0.92,
      'other-regional': 0.85,
      'small-cities': 0.8
    };
    const regionImpact = regionAdjustments[params.region];
    multiplier *= regionImpact;
    if (regionImpact < 1.0) {
      factors.push({ name: 'Регіон продажу', impact: `${Math.round((regionImpact - 1) * 100)}%` });
    }

    // Transmission preference (Ukrainians prefer automatic)
    if (params.transmission === 'automatic') {
      multiplier *= 1.05;
      factors.push({ name: 'Автоматична КПП', impact: '+5%' });
    } else if (params.transmission === 'robot') {
      multiplier *= 0.95;
      factors.push({ name: 'Роботизована КПП', impact: '-5%' });
    }

    // Fuel type preferences
    if (params.fuelType === 'electric') {
      multiplier *= 1.1; // Growing popularity of electric cars
      factors.push({ name: 'Електродвигун', impact: '+10%' });
    } else if (params.fuelType === 'gas') {
      multiplier *= 0.95; // Gas cars less popular for resale
      factors.push({ name: 'Газове паливо', impact: '-5%' });
    }

    // Additional equipment bonuses
    let equipmentBonus = 0;
    if (params.winterTires) equipmentBonus += 0.02;
    if (params.spareKeys) equipmentBonus += 0.01;
    if (params.serviceBook) equipmentBonus += 0.02;
    if (params.warranty) equipmentBonus += 0.03;

    if (equipmentBonus > 0) {
      multiplier *= (1 + equipmentBonus);
      factors.push({ name: 'Додаткове обладнання', impact: `+${Math.round(equipmentBonus * 100)}%` });
    }

    return {
      totalMultiplier: multiplier,
      factors: factors
    };
  }

  function calculateDepreciation(year, mileage) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    // Standard depreciation: 15% first year, then 10% per year
    let depreciationPercent = 15;
    if (age > 1) {
      depreciationPercent += (age - 1) * 10;
    }
    
    // Additional depreciation for high mileage
    const averageMileagePerYear = 18;
    const expectedMileage = age * averageMileagePerYear;
    if (mileage > expectedMileage * 1.2) {
      depreciationPercent += 5;
    }

    return {
      age: age,
      depreciationPercent: Math.min(depreciationPercent, 80), // Cap at 80%
      mileageImpact: mileage > expectedMileage * 1.2 ? 'Високий пробіг' : 'Нормальний пробіг'
    };
  }

  function getMarketFactors(brand, fuelType, bodyType) {
    const factors = [];
    
    // Popular brands in Ukraine
    if (['Toyota', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'].includes(brand)) {
      factors.push('Популярна марка в Україні');
    }
    
    // Growing segments
    if (fuelType === 'electric') {
      factors.push('Зростаючий сегмент електромобілів');
    }
    
    if (bodyType === 'suv' || bodyType === 'crossover') {
      factors.push('Високий попит на позашляховики');
    }
    
    // Market trends
    factors.push('Стабільний ринок вживаних авто');
    
    return factors;
  }

  function displayResults(valuation) {
    const valueRange = {
      min: Math.round(valuation.finalValue * 0.9),
      max: Math.round(valuation.finalValue * 1.1)
    };

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🚗 Оцінка вартості автомобіля</h3>
        
        <div class="car-summary">
          <h4>${valuation.brand} ${valuation.model} ${valuation.year}</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Об'єм двигуна:</span>
              <span class="value">${valuation.engineVolume} л</span>
            </div>
            <div class="summary-item">
              <span class="label">Пробіг:</span>
              <span class="value">${valuation.mileage} тис. км</span>
            </div>
            <div class="summary-item">
              <span class="label">Тип палива:</span>
              <span class="value">${getFuelTypeName(valuation.fuelType)}</span>
            </div>
            <div class="summary-item">
              <span class="label">Базова вартість:</span>
              <span class="value">${valuation.baseValue.toLocaleString()} грн</span>
            </div>
            <div class="summary-item main-value">
              <span class="label">Оцінена вартість:</span>
              <span class="value">${valuation.finalValue.toLocaleString()} грн</span>
            </div>
            <div class="summary-item">
              <span class="label">Діапазон цін:</span>
              <span class="value">${valueRange.min.toLocaleString()} - ${valueRange.max.toLocaleString()} грн</span>
            </div>
          </div>
        </div>

        <div class="insights-section">
          <h4>💡 Ключові показники</h4>
          <div class="insight-cards">
            <div class="insight-card">
              <h6>📅 Вік автомобіля</h6>
              <div class="big-number">${valuation.depreciation.age}</div>
              <p class="insight-detail">років</p>
            </div>
            <div class="insight-card ${valuation.depreciation.depreciationPercent < 40 ? 'success' : valuation.depreciation.depreciationPercent < 60 ? 'info' : 'warning'}">
              <h6>📉 Знос</h6>
              <div class="big-number">${valuation.depreciation.depreciationPercent}%</div>
              <p class="insight-detail">від первинної вартості</p>
            </div>
            <div class="insight-card">
              <h6>🔄 Загальна корекція</h6>
              <div class="big-number">${Math.round((valuation.adjustments.totalMultiplier - 1) * 100) > 0 ? '+' : ''}${Math.round((valuation.adjustments.totalMultiplier - 1) * 100)}%</div>
              <p class="insight-detail">до базової ціни</p>
            </div>
          </div>
        </div>

        ${createAdjustmentsSection(valuation.adjustments)}
        ${createMarketAnalysisSection(valuation)}
        ${createRecommendationsSection(valuation)}
      </div>
    `;

    createValuationChart(valuation);
  }

  function createAdjustmentsSection(adjustments) {
    return `
      <div class="adjustments-section">
        <h4>⚖️ Фактори корекції вартості</h4>
        <div class="adjustments-list">
          ${adjustments.factors.map(factor => `
            <div class="adjustment-item">
              <span class="factor-name">${factor.name}:</span>
              <span class="factor-impact ${factor.impact.includes('-') ? 'negative' : factor.impact.includes('+') ? 'positive' : 'neutral'}">${factor.impact}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function createMarketAnalysisSection(valuation) {
    return `
      <div class="market-analysis-section">
        <h4>📊 Аналіз ринку</h4>
        <div class="market-factors">
          <h6>Ринкові фактори:</h6>
          <ul>
            ${valuation.marketFactors.map(factor => `<li>${factor}</li>`).join('')}
          </ul>
        </div>
        <div class="market-trends">
          <h6>💹 Прогноз вартості:</h6>
          <p>Автомобілі віком ${valuation.depreciation.age} років зазвичай ${valuation.depreciation.age < 5 ? 'стабільно втрачають' : valuation.depreciation.age < 10 ? 'помірно знецінюються' : 'повільно втрачають'} в ціні.</p>
          ${valuation.fuelType === 'electric' ? '<p class="highlight">🔋 Електромобілі мають хороші перспективи через розвиток інфраструктури та пільги.</p>' : ''}
          ${valuation.depreciation.mileageImpact === 'Високий пробіг' ? '<p class="warning">⚠️ Високий пробіг може ускладнити продаж та знизити ліквідність.</p>' : ''}
        </div>
      </div>
    `;
  }

  function createRecommendationsSection(valuation) {
    const recommendations = [];
    
    if (valuation.adjustments.totalMultiplier < 0.8) {
      recommendations.push('🔧 Інвестуйте в поліпшення технічного стану перед продажем');
    }
    
    if (valuation.depreciation.age > 10) {
      recommendations.push('📋 Підготуйте всі документи та сервісну історію для підвищення довіри');
    }
    
    if (valuation.fuelType === 'petrol' && valuation.depreciation.age < 5) {
      recommendations.push('⛽ Розгляньте можливість продажу до подальшого здорожчання альтернативних палив');
    }
    
    recommendations.push('📱 Розмістіть оголошення на AUTO.RIA, RST та OLX для максимального охоплення');
    recommendations.push('🔍 Проведіть професійну діагностику для виявлення прихованих дефектів');
    recommendations.push('📸 Зробіть якісні фотографії з усіх ракурсів та салону');

    return `
      <div class="recommendations-section">
        <h4>💡 Рекомендації</h4>
        <ul class="recommendations-list">
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
        <div class="price-strategy">
          <h6>💰 Стратегія ціноутворення:</h6>
          <p><strong>Стартова ціна:</strong> ${Math.round(valuation.finalValue * 1.1).toLocaleString()} грн (для торгів)</p>
          <p><strong>Мінімальна ціна:</strong> ${Math.round(valuation.finalValue * 0.9).toLocaleString()} грн (нижня межа)</p>
          <p><strong>Швидкий продаж:</strong> ${Math.round(valuation.finalValue * 0.85).toLocaleString()} грн (термінова реалізація)</p>
        </div>
      </div>
    `;
  }

  function getFuelTypeName(fuelType) {
    const names = {
      'petrol': 'Бензин',
      'diesel': 'Дизель',
      'gas': 'Газ',
      'hybrid': 'Гібрид',
      'electric': 'Електро',
      'petrol-gas': 'Бензин+газ'
    };
    return names[fuelType] || fuelType;
  }

  function createValuationChart(valuation) {
    const chartBlock = document.getElementById('valuation-chart-block');
    if (!chartBlock) return;

    chartBlock.style.display = 'block';
    
    const ctx = document.getElementById('valuation-chart').getContext('2d');
    
    // Clear any existing chart
    if (window.valuationChart instanceof Chart) {
      window.valuationChart.destroy();
    }

    // Prepare data for factors impact chart
    const factors = valuation.adjustments.factors.filter(f => f.impact !== 'Базова ціна');
    const factorNames = factors.map(f => f.name);
    const factorImpacts = factors.map(f => {
      const impact = f.impact.replace('%', '').replace('+', '');
      return parseFloat(impact) || 0;
    });

    window.valuationChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: factorNames,
        datasets: [{
          label: 'Вплив на ціну (%)',
          data: factorImpacts,
          backgroundColor: factorImpacts.map(impact => 
            impact > 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
          ),
          borderColor: factorImpacts.map(impact => 
            impact > 0 ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'
          ),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Фактори впливу на вартість автомобіля'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Вплив на ціну (%)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Фактори'
            },
            ticks: {
              maxRotation: 45
            }
          }
        }
      }
    });
  }
});