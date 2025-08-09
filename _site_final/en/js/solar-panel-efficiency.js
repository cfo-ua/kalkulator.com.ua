document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("efficiency-form");
  if (!form) return;

  // Technology database with typical specifications
  const technologySpecs = {
    monocrystalline: {
      efficiency: { min: 20, max: 22, typical: 21 },
      tempCoeff: -0.38,
      degradation: 0.5,
      description: "Premium efficiency, excellent low-light performance"
    },
    polycrystalline: {
      efficiency: { min: 15, max: 17, typical: 16 },
      tempCoeff: -0.42,
      degradation: 0.7,
      description: "Cost-effective, good performance-to-price ratio"
    },
    "thin-film-cdte": {
      efficiency: { min: 11, max: 13, typical: 12 },
      tempCoeff: -0.25,
      degradation: 0.5,
      description: "Lightweight, better high-temperature performance"
    },
    "thin-film-cigs": {
      efficiency: { min: 13, max: 15, typical: 14 },
      tempCoeff: -0.30,
      degradation: 0.6,
      description: "Flexible, good low-light performance"
    },
    bifacial: {
      efficiency: { min: 18, max: 22, typical: 20 },
      tempCoeff: -0.35,
      degradation: 0.4,
      description: "Captures light from both sides, 10-20% boost"
    },
    perc: {
      efficiency: { min: 19, max: 21, typical: 20 },
      tempCoeff: -0.37,
      degradation: 0.5,
      description: "Improved light capture, excellent efficiency"
    }
  };

  // Update form fields when technology changes
  document.getElementById("panelTechnology").addEventListener("change", function() {
    const tech = this.value;
    const specs = technologySpecs[tech];
    
    if (specs) {
      document.getElementById("panelEfficiency").value = specs.efficiency.typical;
      document.getElementById("tempCoefficient").value = specs.tempCoeff;
      document.getElementById("degradationRate").value = specs.degradation;
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const panelTechnology = document.getElementById("panelTechnology").value;
    const ratedPower = parseFloat(document.getElementById("ratedPower").value);
    const panelEfficiency = parseFloat(document.getElementById("panelEfficiency").value) / 100;
    const panelArea = parseFloat(document.getElementById("panelArea").value);
    const averageIrradiance = parseFloat(document.getElementById("averageIrradiance").value);
    const averageTemperature = parseFloat(document.getElementById("averageTemperature").value);
    const tempCoefficient = parseFloat(document.getElementById("tempCoefficient").value) / 100;
    const peakSunHours = parseFloat(document.getElementById("peakSunHours").value);
    const tiltAngle = parseFloat(document.getElementById("tiltAngle").value);
    const azimuthAngle = parseFloat(document.getElementById("azimuthAngle").value);
    const shadingLoss = parseFloat(document.getElementById("shadingLoss").value) / 100;
    const inverterEfficiency = parseFloat(document.getElementById("inverterEfficiency").value) / 100;
    const systemAge = parseFloat(document.getElementById("systemAge").value);
    const degradationRate = parseFloat(document.getElementById("degradationRate").value) / 100;
    const analysisYears = parseInt(document.getElementById("analysisYears").value);
    const electricityRate = parseFloat(document.getElementById("electricityRate").value);

    // Calculate theoretical maximum efficiency at STC (Standard Test Conditions)
    const stcIrradiance = 1000; // W/m²
    const stcTemperature = 25; // °C
    
    // Calculate temperature-adjusted efficiency
    const tempDerating = 1 + (tempCoefficient * (averageTemperature - stcTemperature));
    const realWorldEfficiency = panelEfficiency * tempDerating;

    // Calculate irradiance factor
    const irradianceFactor = averageIrradiance / stcIrradiance;

    // Calculate orientation and tilt losses
    const orientationLoss = calculateOrientationLoss(tiltAngle, azimuthAngle);
    const orientationFactor = 1 - orientationLoss;

    // Calculate total system efficiency
    const currentDegradation = 1 - (degradationRate * systemAge);
    const systemLosses = (1 - shadingLoss) * inverterEfficiency * orientationFactor;
    const totalSystemEfficiency = realWorldEfficiency * currentDegradation * systemLosses;

    // Calculate power output
    const actualPowerOutput = ratedPower * irradianceFactor * totalSystemEfficiency / panelEfficiency;
    const dailyEnergyProduction = actualPowerOutput * peakSunHours / 1000; // kWh
    const monthlyEnergyProduction = dailyEnergyProduction * 30.44;
    const annualEnergyProduction = dailyEnergyProduction * 365;

    // Calculate financial metrics
    const annualEnergyValue = annualEnergyProduction * electricityRate;
    const monthlyEnergyValue = monthlyEnergyProduction * electricityRate;

    // Calculate capacity factor
    const capacityFactor = (dailyEnergyProduction * 365) / (ratedPower * 8760 / 1000) * 100;

    // Generate performance timeline
    const performanceTimeline = [];
    const energyTimeline = [];
    const valueTimeline = [];
    
    for (let year = 1; year <= analysisYears; year++) {
      const yearlyDegradation = Math.pow(1 - degradationRate, year);
      const yearlyEfficiency = totalSystemEfficiency * yearlyDegradation;
      const yearlyOutput = actualPowerOutput * yearlyDegradation;
      const yearlyEnergy = yearlyOutput * peakSunHours * 365 / 1000;
      const yearlyValue = yearlyEnergy * electricityRate;
      
      performanceTimeline.push({
        year: year,
        efficiency: yearlyEfficiency * 100,
        powerOutput: yearlyOutput,
        energyProduction: yearlyEnergy,
        energyValue: yearlyValue
      });
      
      energyTimeline.push(yearlyEnergy);
      valueTimeline.push(yearlyValue);
    }

    // Calculate lifetime totals
    const lifetimeEnergyProduction = energyTimeline.reduce((sum, energy) => sum + energy, 0);
    const lifetimeEnergyValue = valueTimeline.reduce((sum, value) => sum + value, 0);

    // Performance rating
    const performanceRating = getPerformanceRating(totalSystemEfficiency * 100, capacityFactor);

    // Display results
    displayResults({
      panelTechnology,
      ratedPower,
      panelEfficiency: panelEfficiency * 100,
      realWorldEfficiency: realWorldEfficiency * 100,
      totalSystemEfficiency: totalSystemEfficiency * 100,
      actualPowerOutput,
      dailyEnergyProduction,
      monthlyEnergyProduction,
      annualEnergyProduction,
      monthlyEnergyValue,
      annualEnergyValue,
      capacityFactor,
      performanceRating,
      performanceTimeline,
      lifetimeEnergyProduction,
      lifetimeEnergyValue,
      systemAge,
      analysisYears,
      orientationLoss: orientationLoss * 100,
      tempDerating: (1 - tempDerating) * 100,
      shadingLoss: shadingLoss * 100,
      inverterLoss: (1 - inverterEfficiency) * 100
    });

    // Show performance chart
    showPerformanceChart(performanceTimeline);
  });

  function calculateOrientationLoss(tilt, azimuth) {
    // Simplified calculation for orientation losses
    // Optimal is typically 30-35° tilt, 0° azimuth (south-facing)
    const optimalTilt = 30;
    const tiltLoss = Math.abs(tilt - optimalTilt) * 0.001; // ~0.1% per degree deviation
    const azimuthLoss = Math.abs(azimuth) * 0.002; // ~0.2% per degree deviation
    
    return Math.min(tiltLoss + azimuthLoss, 0.25); // Cap at 25% loss
  }

  function getPerformanceRating(systemEfficiency, capacityFactor) {
    if (systemEfficiency >= 18 && capacityFactor >= 25) {
      return { rating: "Excellent", class: "success", description: "Top-tier performance" };
    } else if (systemEfficiency >= 15 && capacityFactor >= 20) {
      return { rating: "Very Good", class: "success", description: "Above average performance" };
    } else if (systemEfficiency >= 12 && capacityFactor >= 15) {
      return { rating: "Good", class: "warning", description: "Solid performance" };
    } else if (systemEfficiency >= 10 && capacityFactor >= 12) {
      return { rating: "Fair", class: "warning", description: "Below average performance" };
    } else {
      return { rating: "Poor", class: "error", description: "Significant improvements needed" };
    }
  }

  function displayResults(data) {
    const resultBlock = document.getElementById("efficiency-result");
    const tech = technologySpecs[data.panelTechnology];
    
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${data.performanceRating.class}">
          <h6>⭐ Performance Rating</h6>
          <div class="big-number">${data.performanceRating.rating}</div>
          <p class="insight-detail">${data.performanceRating.description}</p>
        </div>
        <div class="insight-card info">
          <h6>⚡ System Efficiency</h6>
          <div class="big-number">${data.totalSystemEfficiency.toFixed(1)}%</div>
          <p class="insight-detail">Real-world performance</p>
        </div>
        <div class="insight-card success">
          <h6>📊 Capacity Factor</h6>
          <div class="big-number">${data.capacityFactor.toFixed(1)}%</div>
          <p class="insight-detail">Annual performance ratio</p>
        </div>
        <div class="insight-card warning">
          <h6>🔋 Power Output</h6>
          <div class="big-number">${data.actualPowerOutput.toFixed(0)}W</div>
          <p class="insight-detail">Under real conditions</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">📈 Performance Analysis Summary</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div>
            <h5>☀️ Panel Technology: ${data.panelTechnology.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
            <p style="margin: 0.5rem 0; color: #666;">${tech.description}</p>
            <p><strong>Rated Power:</strong> ${data.ratedPower}W</p>
            <p><strong>Panel Efficiency:</strong> ${data.panelEfficiency.toFixed(1)}% (STC)</p>
            <p><strong>Real-world Efficiency:</strong> ${data.realWorldEfficiency.toFixed(1)}%</p>
            <p><strong>System Efficiency:</strong> ${data.totalSystemEfficiency.toFixed(1)}%</p>
          </div>
          
          <div>
            <h5>⚡ Energy Production</h5>
            <p><strong>Daily:</strong> ${data.dailyEnergyProduction.toFixed(2)} kWh</p>
            <p><strong>Monthly:</strong> ${data.monthlyEnergyProduction.toFixed(1)} kWh</p>
            <p><strong>Annual:</strong> ${data.annualEnergyProduction.toFixed(0)} kWh</p>
            <p><strong>Lifetime (${data.analysisYears} years):</strong> ${data.lifetimeEnergyProduction.toFixed(0)} kWh</p>
          </div>
          
          <div>
            <h5>💰 Energy Value</h5>
            <p><strong>Monthly Value:</strong> $${data.monthlyEnergyValue.toFixed(2)}</p>
            <p><strong>Annual Value:</strong> $${data.annualEnergyValue.toFixed(0)}</p>
            <p><strong>Lifetime Value:</strong> $${data.lifetimeEnergyValue.toFixed(0)}</p>
            <p><strong>Capacity Factor:</strong> ${data.capacityFactor.toFixed(1)}%</p>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <h5>🔍 Performance Loss Analysis</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #f44336;">
              <p style="margin: 0; font-weight: 600;">Temperature Impact</p>
              <p style="margin: 0.5rem 0 0 0; color: #666;">${data.tempDerating.toFixed(1)}% efficiency loss</p>
            </div>
            <div style="padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #ff9800;">
              <p style="margin: 0; font-weight: 600;">Orientation Loss</p>
              <p style="margin: 0.5rem 0 0 0; color: #666;">${data.orientationLoss.toFixed(1)}% from tilt/azimuth</p>
            </div>
            <div style="padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #9c27b0;">
              <p style="margin: 0; font-weight: 600;">Shading Loss</p>
              <p style="margin: 0.5rem 0 0 0; color: #666;">${data.shadingLoss.toFixed(1)}% from obstacles</p>
            </div>
            <div style="padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #607d8b;">
              <p style="margin: 0; font-weight: 600;">Inverter Loss</p>
              <p style="margin: 0.5rem 0 0 0; color: #666;">${data.inverterLoss.toFixed(1)}% DC to AC conversion</p>
            </div>
          </div>
        </div>

        ${data.systemAge > 0 ? `
          <div style="margin-top: 1.5rem; padding: 1rem; background: #fff3e0; border-radius: 8px; border: 2px solid #f57c00;">
            <p style="margin: 0;"><strong>⏱️ System Age Impact:</strong> Your ${data.systemAge}-year-old system has experienced approximately ${(data.systemAge * parseFloat(document.getElementById("degradationRate").value)).toFixed(1)}% efficiency degradation.</p>
          </div>
        ` : ''}

        <div style="margin-top: 1.5rem; padding: 1rem; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
          <h5 style="margin-top: 0; color: #1976d2;">💡 Optimization Recommendations</h5>
          ${getOptimizationRecommendations(data)}
        </div>
      </div>
    `;
  }

  function getOptimizationRecommendations(data) {
    let recommendations = [];

    if (data.tempDerating > 5) {
      recommendations.push("Consider improving panel ventilation to reduce operating temperature");
    }

    if (data.orientationLoss > 5) {
      recommendations.push("Optimize panel tilt angle and orientation for your latitude");
    }

    if (data.shadingLoss > 10) {
      recommendations.push("Minimize shading with proper site selection or tree trimming");
    }

    if (data.capacityFactor < 15) {
      recommendations.push("Consider upgrading to higher efficiency panels or optimizing system design");
    }

    if (data.totalSystemEfficiency < 15) {
      recommendations.push("System efficiency is below average - review all components for optimization opportunities");
    }

    if (recommendations.length === 0) {
      recommendations.push("Your system is performing well! Maintain regular cleaning and monitoring for optimal performance");
    }

    return `<ul style="margin: 0;">${recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>`;
  }

  function showPerformanceChart(timeline) {
    const chartBlock = document.getElementById("efficiency-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("efficiency-chart").getContext("2d");
      if (window.efficiencyChart) window.efficiencyChart.destroy();

      const years = timeline.map(t => `Year ${t.year}`);
      const efficiencyData = timeline.map(t => t.efficiency);
      const energyData = timeline.map(t => t.energyProduction);

      window.efficiencyChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: years,
          datasets: [{
            label: "System Efficiency (%)",
            data: efficiencyData,
            borderColor: "#1976d2",
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            yAxisID: 'y',
            tension: 0.1
          }, {
            label: "Annual Energy Production (kWh)",
            data: energyData,
            borderColor: "#388e3c",
            backgroundColor: "rgba(56, 142, 60, 0.1)",
            yAxisID: 'y1',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            title: {
              display: true,
              text: 'Solar Panel Performance Degradation Over Time'
            },
            legend: {
              display: true
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Years'
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Efficiency (%)'
              },
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Energy Production (kWh)'
              },
              grid: {
                drawOnChartArea: false,
              },
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