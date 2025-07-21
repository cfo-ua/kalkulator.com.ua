document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("carbon-form");
  if (!form) return;

  // Emission factors (kg CO2e per unit)
  const emissionFactors = {
    electricity: 0.429, // kg CO2e per kWh (US average)
    naturalGas: 5.3, // kg CO2e per therm
    heatingOil: 10.15, // kg CO2e per gallon
    gasoline: 8.887, // kg CO2e per gallon
    businessTravel: 0.0005, // kg CO2e per dollar spent
    commuting: 0.404, // kg CO2e per mile (average vehicle)
    waste: 0.98, // metric tons CO2e per ton waste
    supplyChain: 0.0003 // kg CO2e per dollar spent (average)
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

    // Total emissions
    const totalEmissions = scope1Emissions.total + scope2Emissions.total + scope3Emissions.total;
    const emissionsPerEmployee = totalEmissions / employees;
    const emissionsPerSqFt = totalEmissions / facilitySize;

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
    
    // Generate reduction timeline
    const timeline = generateReductionTimeline(totalEmissions, reductionTarget, timeframe, annualOffsetCost);

    // Display results
    displayResults({
      scope1Emissions,
      scope2Emissions, 
      scope3Emissions,
      totalEmissions,
      emissionsPerEmployee,
      emissionsPerSqFt,
      performanceRating,
      benchmark,
      targetEmissions,
      emissionsToOffset,
      annualOffsetCost,
      totalOffsetCost,
      reductionPotential,
      timeline,
      employees,
      businessType,
      companySize,
      timeframe
    });

    // Show emissions breakdown chart
    showEmissionsChart({
      scope1: scope1Emissions,
      scope2: scope2Emissions,
      scope3: scope3Emissions
    });
  });

  function calculateScope1(fleetMileage, naturalGasUsage, heatingOilUsage) {
    // Assume average fleet fuel efficiency of 25 MPG
    const fleetFuelConsumption = fleetMileage / 25; // gallons
    const fleetEmissions = fleetFuelConsumption * emissionFactors.gasoline;
    const naturalGasEmissions = naturalGasUsage * emissionFactors.naturalGas;
    const heatingOilEmissions = heatingOilUsage * emissionFactors.heatingOil;
    
    return {
      fleet: fleetEmissions / 1000, // Convert to metric tons
      naturalGas: naturalGasEmissions / 1000,
      heatingOil: heatingOilEmissions / 1000,
      total: (fleetEmissions + naturalGasEmissions + heatingOilEmissions) / 1000
    };
  }

  function calculateScope2(electricityUsage, renewablePercent) {
    const gridElectricity = electricityUsage * (1 - renewablePercent);
    const electricityEmissions = gridElectricity * emissionFactors.electricity;
    
    return {
      electricity: electricityEmissions / 1000, // Convert to metric tons
      total: electricityEmissions / 1000
    };
  }

  function calculateScope3(businessTravel, employeeCommuting, employees, wasteGeneration, recyclingRate, supplychainSpend, businessType) {
    const travelEmissions = businessTravel * emissionFactors.businessTravel;
    
    // Assume 250 working days per year
    const annualCommutingMiles = employeeCommuting * employees * 250 * 2; // Round trip
    const commutingEmissions = annualCommutingMiles * emissionFactors.commuting;
    
    const wasteEmissions = wasteGeneration * (1 - recyclingRate) * emissionFactors.waste * 1000; // Convert to kg
    
    const supplyChainMultiplier = businessMultipliers[businessType] || 1;
    const supplyChainEmissions = supplychainSpend * emissionFactors.supplyChain * supplyChainMultiplier;
    
    return {
      businessTravel: travelEmissions / 1000,
      commuting: commutingEmissions / 1000,
      waste: wasteEmissions / 1000,
      supplyChain: supplyChainEmissions / 1000,
      total: (travelEmissions + commutingEmissions + wasteEmissions + supplyChainEmissions) / 1000
    };
  }

  function getBenchmark(businessType, companySize) {
    // Industry benchmarks (metric tons CO2e per employee per year)
    const benchmarks = {
      office: { small: 8, medium: 12, large: 15, enterprise: 18 },
      retail: { small: 10, medium: 14, large: 17, enterprise: 20 },
      manufacturing: { small: 25, medium: 35, large: 45, enterprise: 55 },
      technology: { small: 6, medium: 9, large: 12, enterprise: 15 },
      healthcare: { small: 15, medium: 20, large: 25, enterprise: 30 },
      education: { small: 5, medium: 8, large: 10, enterprise: 12 },
      hospitality: { small: 12, medium: 18, large: 22, enterprise: 28 }
    };
    
    return benchmarks[businessType]?.[companySize] || 15;
  }

  function getPerformanceRating(emissionsPerEmployee, benchmark) {
    const ratio = emissionsPerEmployee / benchmark;
    
    if (ratio <= 0.7) {
      return { rating: "Excellent", class: "success", description: "Well below industry average" };
    } else if (ratio <= 0.9) {
      return { rating: "Good", class: "success", description: "Below industry average" };
    } else if (ratio <= 1.1) {
      return { rating: "Average", class: "warning", description: "Near industry average" };
    } else if (ratio <= 1.3) {
      return { rating: "Below Average", class: "warning", description: "Above industry average" };
    } else {
      return { rating: "Poor", class: "error", description: "Significantly above average" };
    }
  }

  function calculateReductionPotential(scope1, scope2, scope3) {
    return {
      energyEfficiency: {
        potential: scope2.total * 0.3, // 30% reduction potential
        cost: scope2.total * 0.3 * 15, // $15/ton for efficiency improvements
        description: "LED lighting, HVAC optimization, building automation"
      },
      renewableEnergy: {
        potential: scope2.total * 0.7, // 70% reduction potential
        cost: scope2.total * 0.7 * 20, // $20/ton for renewable energy
        description: "Solar panels, renewable energy certificates, power purchase agreements"
      },
      transportation: {
        potential: (scope1.fleet + scope3.commuting) * 0.4, // 40% reduction potential
        cost: (scope1.fleet + scope3.commuting) * 0.4 * 25, // $25/ton for fleet improvements
        description: "Electric vehicles, remote work, public transit incentives"
      },
      supplyChain: {
        potential: scope3.supplyChain * 0.2, // 20% reduction potential
        cost: scope3.supplyChain * 0.2 * 30, // $30/ton for supply chain improvements
        description: "Sustainable procurement, supplier engagement, local sourcing"
      }
    };
  }

  function generateReductionTimeline(totalEmissions, reductionTarget, timeframe, offsetCost) {
    const timeline = [];
    const annualReduction = reductionTarget / timeframe;
    
    for (let year = 1; year <= timeframe; year++) {
      const cumulativeReduction = annualReduction * year;
      const remainingEmissions = totalEmissions * (1 - cumulativeReduction);
      const yearlyOffsetCost = remainingEmissions * document.getElementById("offsetPrice").value;
      
      timeline.push({
        year: year,
        emissions: remainingEmissions,
        reduction: cumulativeReduction * 100,
        offsetCost: yearlyOffsetCost
      });
    }
    
    return timeline;
  }

  function displayResults(data) {
    const resultBlock = document.getElementById("carbon-result");
    
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🌍 Total Footprint</h6>
          <div class="big-number">${data.totalEmissions.toFixed(0)}</div>
          <p class="insight-detail">metric tons CO2e annually</p>
        </div>
        <div class="insight-card ${data.performanceRating.class}">
          <h6>📊 Performance</h6>
          <div class="big-number">${data.performanceRating.rating}</div>
          <p class="insight-detail">${data.performanceRating.description}</p>
        </div>
        <div class="insight-card warning">
          <h6>👥 Per Employee</h6>
          <div class="big-number">${data.emissionsPerEmployee.toFixed(1)}</div>
          <p class="insight-detail">tons CO2e per employee</p>
        </div>
        <div class="insight-card success">
          <h6>💰 Offset Cost</h6>
          <div class="big-number">$${(data.annualOffsetCost/1000).toFixed(0)}K</div>
          <p class="insight-detail">annually for net-zero</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">📈 Carbon Footprint Analysis</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div>
            <h5>🎯 Emission Scopes Breakdown</h5>
            <p><strong>Scope 1 (Direct):</strong> ${data.scope1Emissions.total.toFixed(1)} tons CO2e</p>
            <p><strong>Scope 2 (Energy):</strong> ${data.scope2Emissions.total.toFixed(1)} tons CO2e</p>
            <p><strong>Scope 3 (Indirect):</strong> ${data.scope3Emissions.total.toFixed(1)} tons CO2e</p>
            <p><strong>Industry Benchmark:</strong> ${data.benchmark} tons CO2e per employee</p>
          </div>
          
          <div>
            <h5>🏢 Business Profile</h5>
            <p><strong>Company Size:</strong> ${data.companySize} (${data.employees} employees)</p>
            <p><strong>Business Type:</strong> ${data.businessType}</p>
            <p><strong>Emissions per Employee:</strong> ${data.emissionsPerEmployee.toFixed(1)} tons CO2e</p>
            <p><strong>Emissions per Sq Ft:</strong> ${(data.emissionsPerSqFt * 1000).toFixed(1)} kg CO2e</p>
          </div>
          
          <div>
            <h5>💡 Reduction Planning</h5>
            <p><strong>Target Reduction:</strong> ${((1 - data.targetEmissions/data.totalEmissions) * 100).toFixed(0)}%</p>
            <p><strong>Target Emissions:</strong> ${data.targetEmissions.toFixed(0)} tons CO2e</p>
            <p><strong>Annual Offset Cost:</strong> $${data.annualOffsetCost.toLocaleString()}</p>
            <p><strong>${data.timeframe}-Year Total:</strong> $${data.totalOffsetCost.toLocaleString()}</p>
          </div>
        </div>

        <h5>🔍 Detailed Emissions Sources</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #f44336;">
            <h6>🚗 Scope 1 - Direct Emissions</h6>
            <p>Fleet Vehicles: ${data.scope1Emissions.fleet.toFixed(1)} tons</p>
            <p>Natural Gas: ${data.scope1Emissions.naturalGas.toFixed(1)} tons</p>
            <p>Heating Oil: ${data.scope1Emissions.heatingOil.toFixed(1)} tons</p>
          </div>
          
          <div style="padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #ff9800;">
            <h6>⚡ Scope 2 - Energy Indirect</h6>
            <p>Grid Electricity: ${data.scope2Emissions.electricity.toFixed(1)} tons</p>
            <p>Steam/Heating: Included in electricity</p>
            <p>Cooling: Included in electricity</p>
          </div>
          
          <div style="padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #9c27b0;">
            <h6>🌐 Scope 3 - Other Indirect</h6>
            <p>Business Travel: ${data.scope3Emissions.businessTravel.toFixed(1)} tons</p>
            <p>Employee Commuting: ${data.scope3Emissions.commuting.toFixed(1)} tons</p>
            <p>Waste: ${data.scope3Emissions.waste.toFixed(1)} tons</p>
            <p>Supply Chain: ${data.scope3Emissions.supplyChain.toFixed(1)} tons</p>
          </div>
        </div>

        <h5>💡 Reduction Opportunities</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          ${Object.entries(data.reductionPotential).map(([key, opportunity]) => `
            <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; border: 2px solid #4caf50;">
              <h6>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h6>
              <p><strong>Potential:</strong> ${opportunity.potential.toFixed(1)} tons CO2e</p>
              <p><strong>Est. Cost:</strong> $${opportunity.cost.toLocaleString()}</p>
              <p style="font-size: 0.9rem; margin: 0;">${opportunity.description}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 2rem; padding: 1rem; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
          <h5 style="margin-top: 0; color: #1976d2;">🎯 Sustainability Roadmap</h5>
          <ol style="margin: 0;">
            <li><strong>Year 1-2:</strong> Energy efficiency improvements and renewable energy transition</li>
            <li><strong>Year 3-5:</strong> Transportation electrification and remote work policies</li>
            <li><strong>Year 6-8:</strong> Supply chain engagement and sustainable procurement</li>
            <li><strong>Year 9-${data.timeframe}:</strong> Advanced technologies and high-quality offsets for residual emissions</li>
          </ol>
        </div>
      </div>
    `;
  }

  function showEmissionsChart(data) {
    const chartBlock = document.getElementById("carbon-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("carbon-chart").getContext("2d");
      if (window.carbonChart) window.carbonChart.destroy();

      // Create detailed breakdown data
      const chartData = {
        labels: [
          'Fleet Vehicles', 'Natural Gas', 'Heating Oil', // Scope 1
          'Electricity', // Scope 2
          'Business Travel', 'Employee Commuting', 'Waste', 'Supply Chain' // Scope 3
        ],
        datasets: [{
          data: [
            data.scope1.fleet,
            data.scope1.naturalGas,
            data.scope1.heatingOil,
            data.scope2.electricity,
            data.scope3.businessTravel,
            data.scope3.commuting,
            data.scope3.waste,
            data.scope3.supplyChain
          ],
          backgroundColor: [
            '#f44336', '#e53935', '#d32f2f', // Scope 1 - Red tones
            '#ff9800', // Scope 2 - Orange
            '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a' // Scope 3 - Purple tones
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      };

      window.carbonChart = new Chart(ctx, {
        type: "doughnut",
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Total Emissions: ${(data.scope1.total + data.scope2.total + data.scope3.total).toFixed(0)} metric tons CO2e`
            },
            legend: {
              display: true,
              position: 'bottom'
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
    document.head.appendChild(script);
  }
}