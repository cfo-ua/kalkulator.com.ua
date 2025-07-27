document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("carbon-form");
  if (!form) return;

  // Emission factors (kg CO2e per unit) adapted for Ukraine
  const emissionFactors = {
    electricity: 0.57, // kg CO2e per kWh (Ukraine grid)
    naturalGas: 1.988, // kg CO2e per cubic meter
    heatingOil: 2.67, // kg CO2e per liter
    gasoline: 2.35, // kg CO2e per liter
    businessTravel: 0.000015, // kg CO2e per UAH spent
    commuting: 0.251, // kg CO2e per km (average vehicle)
    waste: 0.98, // metric tons CO2e per ton waste
    supplyChain: 0.000009 // kg CO2e per UAH spent (average)
  };

  // Business type multipliers for supply chain emissions
  const businessMultipliers = {
    office: 0.8,
    retail: 1.1,
    manufacturing: 1.5,
    technology: 0.9,
    healthcare: 1.2,
    education: 0.7,
    hospitality: 1.3
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const companySize = document.getElementById("companySize").value;
    const businessType = document.getElementById("businessType").value;
    const employees = parseInt(document.getElementById("employees").value);
    const electricityUsage = parseFloat(document.getElementById("electricityUsage").value);
    const naturalGasUsage = parseFloat(document.getElementById("naturalGasUsage").value);
    const heatingOilUsage = parseFloat(document.getElementById("heatingOilUsage").value);
    const renewablePercent = parseFloat(document.getElementById("renewablePercent").value) / 100;
    const fleetVehicles = parseInt(document.getElementById("fleetVehicles").value);
    const fleetMileage = parseFloat(document.getElementById("fleetMileage").value);
    const businessTravel = parseFloat(document.getElementById("businessTravel").value);
    const employeeCommuting = parseFloat(document.getElementById("employeeCommuting").value);
    const facilitySize = parseFloat(document.getElementById("facilitySize").value);
    const wasteGeneration = parseFloat(document.getElementById("wasteGeneration").value);
    const recyclingRate = parseFloat(document.getElementById("recyclingRate").value) / 100;
    const supplychainSpend = parseFloat(document.getElementById("supplychainSpend").value);
    const offsetPrice = parseFloat(document.getElementById("offsetPrice").value);
    const reductionTarget = parseFloat(document.getElementById("reductionTarget").value) / 100;
    const timeframe = parseInt(document.getElementById("timeframe").value);

    // Calculate Scope 1 emissions (Direct)
    const scope1Emissions = calculateScope1(fleetMileage, naturalGasUsage, heatingOilUsage);
    
    // Calculate Scope 2 emissions (Energy indirect)
    const scope2Emissions = calculateScope2(electricityUsage, renewablePercent);
    
    // Calculate Scope 3 emissions (Other indirect)
    const scope3Emissions = calculateScope3(
      businessTravel, employeeCommuting, employees, wasteGeneration, 
      recyclingRate, supplychainSpend, businessType
    );

    // Total emissions (convert to metric tons)
    const totalEmissions = (scope1Emissions.total + scope2Emissions.total + scope3Emissions.total) / 1000;
    const emissionsPerEmployee = totalEmissions / employees;
    const emissionsPerSqM = totalEmissions / facilitySize;

    // Benchmark comparisons
    const benchmark = getBenchmark(businessType, companySize);
    const performanceRating = getPerformanceRating(emissionsPerEmployee, benchmark);

    // Calculate reduction and offset costs
    const targetEmissions = totalEmissions * (1 - reductionTarget);
    const emissionsToOffset = targetEmissions;
    const annualOffsetCost = emissionsToOffset * offsetPrice;
    const totalOffsetCost = annualOffsetCost * timeframe;

    // Calculate reduction potential
    const reductionPotential = calculateReductionPotential(scope1Emissions, scope2Emissions, scope3Emissions);

    // Display results
    displayResults({
      scope1Emissions,
      scope2Emissions, 
      scope3Emissions,
      totalEmissions,
      emissionsPerEmployee,
      emissionsPerSqM,
      performanceRating,
      benchmark,
      targetEmissions,
      emissionsToOffset,
      annualOffsetCost,
      totalOffsetCost,
      reductionPotential,
      employees,
      businessType,
      companySize,
      reductionTarget,
      timeframe
    });

    // Create chart if Chart.js is available
    if (typeof Chart !== 'undefined') {
      createEmissionsChart(scope1Emissions, scope2Emissions, scope3Emissions);
    }
  });

  function calculateScope1(fleetMileage, naturalGas, heatingOil) {
    const fleetEmissions = (fleetMileage / 100) * 6.8 * 1000; // Assuming 6.8L/100km fuel consumption
    const gasEmissions = naturalGas * emissionFactors.naturalGas;
    const oilEmissions = heatingOil * emissionFactors.heatingOil;
    
    return {
      fleet: fleetEmissions,
      naturalGas: gasEmissions,
      heatingOil: oilEmissions,
      total: fleetEmissions + gasEmissions + oilEmissions
    };
  }

  function calculateScope2(electricity, renewablePercent) {
    const gridElectricity = electricity * (1 - renewablePercent);
    const emissions = gridElectricity * emissionFactors.electricity;
    
    return {
      electricity: emissions,
      renewable: electricity * renewablePercent * emissionFactors.electricity * 0.1, // 10% emissions for renewable
      total: emissions + (electricity * renewablePercent * emissionFactors.electricity * 0.1)
    };
  }

  function calculateScope3(businessTravel, commuting, employees, waste, recyclingRate, supplyChain, businessType) {
    const travelEmissions = businessTravel * emissionFactors.businessTravel;
    const commutingEmissions = commuting * employees * 250 * emissionFactors.commuting; // 250 working days
    const wasteEmissions = waste * (1 - recyclingRate) * emissionFactors.waste * 1000; // Convert to kg
    const supplyChainEmissions = supplyChain * emissionFactors.supplyChain * businessMultipliers[businessType];
    
    return {
      businessTravel: travelEmissions,
      commuting: commutingEmissions,
      waste: wasteEmissions,
      supplyChain: supplyChainEmissions,
      total: travelEmissions + commutingEmissions + wasteEmissions + supplyChainEmissions
    };
  }

  function getBenchmark(businessType, companySize) {
    const benchmarks = {
      office: { small: 2.5, medium: 4.0, large: 5.5, enterprise: 7.0 },
      retail: { small: 3.0, medium: 4.5, large: 6.0, enterprise: 8.0 },
      manufacturing: { small: 8.0, medium: 12.0, large: 15.0, enterprise: 20.0 },
      technology: { small: 2.0, medium: 3.5, large: 5.0, enterprise: 6.5 },
      healthcare: { small: 4.0, medium: 6.0, large: 8.0, enterprise: 10.0 },
      education: { small: 2.0, medium: 3.0, large: 4.0, enterprise: 5.0 },
      hospitality: { small: 5.0, medium: 7.0, large: 9.0, enterprise: 12.0 }
    };
    
    return benchmarks[businessType][companySize] || 5.0;
  }

  function getPerformanceRating(emissions, benchmark) {
    const ratio = emissions / benchmark;
    if (ratio <= 0.7) return { rating: "Відмінно", color: "#2ecc71", description: "Значно нижче середнього по галузі" };
    if (ratio <= 1.0) return { rating: "Добре", color: "#f39c12", description: "Нижче середнього по галузі" };
    if (ratio <= 1.3) return { rating: "Середньо", color: "#e67e22", description: "Близько до середнього по галузі" };
    return { rating: "Потребує покращення", color: "#e74c3c", description: "Вище середнього по галузі" };
  }

  function calculateReductionPotential(scope1, scope2, scope3) {
    return {
      energyEfficiency: scope2.total * 0.3, // 30% potential reduction
      renewableEnergy: scope2.total * 0.5, // 50% potential reduction
      fleetOptimization: scope1.fleet * 0.25, // 25% potential reduction
      wasteReduction: scope3.waste * 0.4, // 40% potential reduction
      supplyChainOptimization: scope3.supplyChain * 0.2, // 20% potential reduction
      digitalTransformation: (scope1.total + scope2.total + scope3.total) * 0.1 // 10% potential reduction
    };
  }

  function displayResults(data) {
    const result = document.getElementById("carbon-result");
    
    result.innerHTML = `
      <div class="insight-card">
        <h4>🌍 Загальний вуглецевий слід</h4>
        <p><strong>Загальні викиди: ${data.totalEmissions.toFixed(1)} тонн CO2e/рік</strong></p>
        <p>На співробітника: ${data.emissionsPerEmployee.toFixed(2)} тонн CO2e/рік</p>
        <p>На кв. м: ${data.emissionsPerSqM.toFixed(3)} тонн CO2e/рік</p>
        <p>Рейтинг ефективності: <span style="color: ${data.performanceRating.color}"><strong>${data.performanceRating.rating}</strong></span></p>
        <p><small>${data.performanceRating.description} (галузевий еталон: ${data.benchmark.toFixed(1)} тонн/співробітник)</small></p>
      </div>

      <div class="insight-card">
        <h4>📊 Розподіл викидів за областями</h4>
        <p><strong>Область 1 (Прямі викиди): ${(data.scope1Emissions.total / 1000).toFixed(1)} тонн CO2e</strong></p>
        <p>• Автопарк: ${(data.scope1Emissions.fleet / 1000).toFixed(1)} тонн</p>
        <p>• Природний газ: ${(data.scope1Emissions.naturalGas / 1000).toFixed(1)} тонн</p>
        <p>• Мазут: ${(data.scope1Emissions.heatingOil / 1000).toFixed(1)} тонн</p>
        
        <p><strong>Область 2 (Енергетичні непрямі): ${(data.scope2Emissions.total / 1000).toFixed(1)} тонн CO2e</strong></p>
        <p>• Електроенергія з мережі: ${(data.scope2Emissions.electricity / 1000).toFixed(1)} тонн</p>
        <p>• Відновлювана енергія: ${(data.scope2Emissions.renewable / 1000).toFixed(1)} тонн</p>
        
        <p><strong>Область 3 (Інші непрямі): ${(data.scope3Emissions.total / 1000).toFixed(1)} тонн CO2e</strong></p>
        <p>• Ділові поїздки: ${(data.scope3Emissions.businessTravel / 1000).toFixed(1)} тонн</p>
        <p>• Комунальні переміщення: ${(data.scope3Emissions.commuting / 1000).toFixed(1)} тонн</p>
        <p>• Відходи: ${(data.scope3Emissions.waste / 1000).toFixed(1)} тонн</p>
        <p>• Ланцюг постачання: ${(data.scope3Emissions.supplyChain / 1000).toFixed(1)} тонн</p>
      </div>

      <div class="insight-card">
        <h4>💰 Планування компенсацій</h4>
        <p><strong>Ціль скорочення: ${(data.reductionTarget * 100).toFixed(0)}% за ${data.timeframe} років</strong></p>
        <p>Цільові викиди: ${data.targetEmissions.toFixed(1)} тонн CO2e/рік</p>
        <p>Викиди для компенсації: ${data.emissionsToOffset.toFixed(1)} тонн CO2e/рік</p>
        <p><strong>Річна вартість компенсацій: ${data.annualOffsetCost.toFixed(0)} грн</strong></p>
        <p>Загальна вартість за ${data.timeframe} років: ${data.totalOffsetCost.toFixed(0)} грн</p>
        <p>Вартість на співробітника: ${(data.annualOffsetCost / data.employees).toFixed(0)} грн/рік</p>
      </div>

      <div class="insight-card">
        <h4>📈 Потенціал скорочення викидів</h4>
        <p><strong>Енергоефективність:</strong> ${(data.reductionPotential.energyEfficiency / 1000).toFixed(1)} тонн CO2e (30% потенціал)</p>
        <p><strong>Відновлювана енергія:</strong> ${(data.reductionPotential.renewableEnergy / 1000).toFixed(1)} тонн CO2e (50% потенціал)</p>
        <p><strong>Оптимізація автопарку:</strong> ${(data.reductionPotential.fleetOptimization / 1000).toFixed(1)} тонн CO2e (25% потенціал)</p>
        <p><strong>Зменшення відходів:</strong> ${(data.reductionPotential.wasteReduction / 1000).toFixed(1)} тонн CO2e (40% потенціал)</p>
        <p><strong>Оптимізація ланцюга постачання:</strong> ${(data.reductionPotential.supplyChainOptimization / 1000).toFixed(1)} тонн CO2e (20% потенціал)</p>
        <p><strong>Цифрова трансформація:</strong> ${(data.reductionPotential.digitalTransformation / 1000).toFixed(1)} тонн CO2e (10% потенціал)</p>
      </div>

      <div class="insight-card">
        <h4>🎯 Рекомендації з скорочення</h4>
        ${getReductionRecommendations(data).map(rec => `<p>${rec}</p>`).join('')}
      </div>

      <div class="insight-card">
        <h4>🌱 Стратегії компенсації</h4>
        ${getOffsetStrategies(data.emissionsToOffset).map(strategy => `<p>${strategy}</p>`).join('')}
      </div>

      <div class="insight-card">
        <h4>📋 План дій</h4>
        ${getActionPlan(data).map(action => `<p>${action}</p>`).join('')}
      </div>

      <div class="insight-card">
        <h4>🏆 Переваги досягнення вуглецевої нейтральності</h4>
        <p>🛡️ <strong>Зменшення ризиків:</strong> Підготовка до вуглецевого ціноутворення та регулювання</p>
        <p>💰 <strong>Економія витрат:</strong> Покращення енергоефективності зменшує витрати</p>
        <p>🏅 <strong>Конкурентна перевага:</strong> Відповідність вимогам клієнтів та інвесторів</p>
        <p>👥 <strong>Залучення персоналу:</strong> Залучення талантів, орієнтованих на сталість</p>
        <p>🔗 <strong>Стійкість ланцюга постачання:</strong> Зменшення залежності від вуглецевомістких ресурсів</p>
        <p>💡 <strong>Інноваційний каталізатор:</strong> Стимулювання розвитку сталих продуктів та послуг</p>
      </div>
    `;
  }

  function getReductionRecommendations(data) {
    const recommendations = [];
    
    if (data.scope2Emissions.total > data.scope1Emissions.total) {
      recommendations.push("⚡ Пріоритет: Перехід на відновлювану енергію може значно зменшити ваш вуглецевий слід");
    }
    
    if (data.scope3Emissions.commuting > 10000) {
      recommendations.push("🚗 Впровадьте програми віддаленої роботи для зменшення комунальних переміщень");
    }
    
    if (data.scope3Emissions.waste > 5000) {
      recommendations.push("♻️ Покращте програми переробки та зменшення відходів");
    }
    
    if (data.scope1Emissions.fleet > 15000) {
      recommendations.push("🔋 Розгляньте електрифікацію автопарку або гібридні транспортні засоби");
    }
    
    recommendations.push("📊 Встановіть системи моніторингу енергії для відстеження прогресу в реальному часі");
    recommendations.push("🎓 Проведіть навчання співробітників з екологічної свідомості");
    
    return recommendations;
  }

  function getOffsetStrategies(emissions) {
    const strategies = [];
    const annualEmissions = emissions;
    
    strategies.push(`🌲 Лісовідновлення: ${(annualEmissions * 0.4).toFixed(0)} тонн CO2e (посадіть ${Math.ceil(annualEmissions * 0.4 * 40)} дерев)`);
    strategies.push(`⚡ Відновлювана енергія: ${(annualEmissions * 0.3).toFixed(0)} тонн CO2e (підтримайте вітрові/сонячні проекти)`);
    strategies.push(`🏭 Захоплення метану: ${(annualEmissions * 0.2).toFixed(0)} тонн CO2e (проекти звалищ та ферм)`);
    strategies.push(`🌊 Природні рішення: ${(annualEmissions * 0.1).toFixed(0)} тонн CO2e (відновлення водно-болотних угідь)`);
    
    return strategies;
  }

  function getActionPlan(data) {
    const actions = [];
    
    actions.push("📅 <strong>Рік 1:</strong> Провести детальний енергетичний аудит, встановити цілі скорочення");
    actions.push("📅 <strong>Рік 2-3:</strong> Впровадити заходи з енергоефективності, розпочати перехід на відновлювану енергію");
    actions.push("📅 <strong>Рік 4-5:</strong> Оптимізувати ланцюг постачання, впровадити програми зеленого транспорту");
    actions.push("📅 <strong>Рік 6-10:</strong> Досягти цільового скорочення, компенсувати залишкові викиди");
    actions.push("🔄 <strong>Постійно:</strong> Моніторити прогрес, звітувати зацікавленим сторонам, покращувати практики");
    
    return actions;
  }

  function createEmissionsChart(scope1, scope2, scope3) {
    const ctx = document.getElementById('carbon-chart');
    if (!ctx) return;

    const chartBlock = document.getElementById('carbon-chart-block');
    if (chartBlock) chartBlock.style.display = 'block';

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Область 1 (Прямі)', 'Область 2 (Енергія)', 'Область 3 (Інші)'],
        datasets: [{
          data: [
            scope1.total / 1000,
            scope2.total / 1000,
            scope3.total / 1000
          ],
          backgroundColor: ['#e74c3c', '#f39c12', '#3498db'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const percentage = ((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                return `${label}: ${value.toFixed(1)} тонн CO2e (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
});