document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("tree-form");
  if (!form) return;

  // Tree species data with growth characteristics
  const treeData = {
    oak: {
      name: "Common Oak",
      peakYears: [20, 60],
      maxAnnualSeq: 22, // kg CO2 per tree per year at peak
      matureSeq: 18,
      woodDensity: 0.65,
      lifespanYears: 200,
      climateMod: { temperate: 1.0, continental: 0.85, mediterranean: 0.7, subtropical: 0.6, boreal: 0.4 }
    },
    beech: {
      name: "European Beech", 
      peakYears: [15, 50],
      maxAnnualSeq: 25,
      matureSeq: 20,
      woodDensity: 0.68,
      lifespanYears: 180,
      climateMod: { temperate: 1.0, continental: 0.8, mediterranean: 0.5, subtropical: 0.4, boreal: 0.7 }
    },
    maple: {
      name: "Norway Maple",
      peakYears: [12, 40],
      maxAnnualSeq: 20,
      matureSeq: 16,
      woodDensity: 0.62,
      lifespanYears: 150,
      climateMod: { temperate: 1.0, continental: 0.9, mediterranean: 0.6, subtropical: 0.5, boreal: 0.8 }
    },
    pine: {
      name: "Scots Pine",
      peakYears: [10, 35],
      maxAnnualSeq: 18,
      matureSeq: 15,
      woodDensity: 0.45,
      lifespanYears: 120,
      climateMod: { temperate: 0.9, continental: 1.0, mediterranean: 0.7, subtropical: 0.6, boreal: 1.1 }
    },
    spruce: {
      name: "Norway Spruce",
      peakYears: [8, 30],
      maxAnnualSeq: 16,
      matureSeq: 14,
      woodDensity: 0.43,
      lifespanYears: 100,
      climateMod: { temperate: 0.8, continental: 0.9, mediterranean: 0.4, subtropical: 0.3, boreal: 1.0 }
    },
    birch: {
      name: "Silver Birch",
      peakYears: [6, 25],
      maxAnnualSeq: 14,
      matureSeq: 12,
      woodDensity: 0.55,
      lifespanYears: 80,
      climateMod: { temperate: 0.9, continental: 1.0, mediterranean: 0.5, subtropical: 0.4, boreal: 1.1 }
    },
    linden: {
      name: "Small-leaved Lime",
      peakYears: [10, 35],
      maxAnnualSeq: 17,
      matureSeq: 14,
      woodDensity: 0.48,
      lifespanYears: 140,
      climateMod: { temperate: 1.0, continental: 0.85, mediterranean: 0.6, subtropical: 0.5, boreal: 0.7 }
    },
    ash: {
      name: "Common Ash",
      peakYears: [8, 30],
      maxAnnualSeq: 19,
      matureSeq: 16,
      woodDensity: 0.66,
      lifespanYears: 160,
      climateMod: { temperate: 1.0, continental: 0.9, mediterranean: 0.7, subtropical: 0.6, boreal: 0.6 }
    },
    mixed: {
      name: "Mixed Forest",
      peakYears: [12, 40],
      maxAnnualSeq: 19,
      matureSeq: 16,
      woodDensity: 0.55,
      lifespanYears: 150,
      climateMod: { temperate: 1.0, continental: 0.9, mediterranean: 0.7, subtropical: 0.6, boreal: 0.9 }
    }
  };

  // Soil quality multipliers
  const soilMultipliers = {
    poor: 0.7,
    average: 1.0,
    good: 1.3,
    excellent: 1.6
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const species = document.getElementById("treeSpecies").value;
    const numberOfTrees = parseInt(document.getElementById("numberOfTrees").value);
    const plantingArea = parseFloat(document.getElementById("plantingArea").value);
    const treeSpacing = parseFloat(document.getElementById("treeSpacing").value);
    const climateZone = document.getElementById("climateZone").value;
    const soilQuality = document.getElementById("soilQuality").value;
    const survivalRate = parseFloat(document.getElementById("survivalRate").value) / 100;
    const maintenanceYears = parseInt(document.getElementById("maintenanceYears").value);
    const plantingCostPerTree = parseFloat(document.getElementById("plantingCostPerTree").value);
    const maintenanceCostPerYear = parseFloat(document.getElementById("maintenanceCostPerYear").value);
    const carbonPrice = parseFloat(document.getElementById("carbonPrice").value);
    const discountRate = parseFloat(document.getElementById("discountRate").value) / 100;
    const projectionYears = parseInt(document.getElementById("projectionYears").value);
    const harvestAge = parseInt(document.getElementById("harvestAge").value);
    const reforestationCycles = parseInt(document.getElementById("reforestationCycles").value);

    const treeInfo = treeData[species];
    const climateMultiplier = treeInfo.climateMod[climateZone];
    const soilMultiplier = soilMultipliers[soilQuality];
    const survivingTrees = Math.round(numberOfTrees * survivalRate);

    // Calculate tree density and competition factor
    const treesPerHectare = numberOfTrees / plantingArea;
    const optimalDensity = 10000 / (treeSpacing * treeSpacing); // trees per hectare at given spacing
    const densityFactor = Math.min(1.2, optimalDensity / Math.max(treesPerHectare, optimalDensity * 0.5));

    // Calculate yearly carbon sequestration
    let yearlyData = [];
    let cumulativeCarbon = 0;
    let totalCosts = 0;
    let totalRevenue = 0;

    // Initial costs
    const initialPlantingCost = numberOfTrees * plantingCostPerTree;
    totalCosts += initialPlantingCost;

    for (let year = 1; year <= projectionYears; year++) {
      let yearlySequestration = 0;
      let currentTrees = survivingTrees;

      // Check for harvest cycles
      if (harvestAge > 0 && year % harvestAge === 0 && year > 0) {
        // Harvest cycle - reset trees if reforestation cycles allow
        const cycleNumber = Math.floor(year / harvestAge);
        if (cycleNumber < reforestationCycles) {
          currentTrees = Math.round(numberOfTrees * survivalRate);
          totalCosts += initialPlantingCost; // Re-planting costs
        } else {
          currentTrees = 0; // No more reforestation
        }
      }

      if (currentTrees > 0) {
        // Calculate tree age in current cycle
        const treeAge = harvestAge > 0 ? ((year - 1) % harvestAge) + 1 : year;
        
        // Growth curve calculation
        let growthFactor;
        if (treeAge <= treeInfo.peakYears[0]) {
          // Early growth phase
          growthFactor = (treeAge / treeInfo.peakYears[0]) * 0.7;
        } else if (treeAge <= treeInfo.peakYears[1]) {
          // Peak growth phase
          growthFactor = 0.7 + ((treeAge - treeInfo.peakYears[0]) / (treeInfo.peakYears[1] - treeInfo.peakYears[0])) * 0.3;
        } else {
          // Mature phase
          const maturityFactor = Math.max(0.8, 1 - ((treeAge - treeInfo.peakYears[1]) / (treeInfo.lifespanYears - treeInfo.peakYears[1])) * 0.2);
          growthFactor = maturityFactor;
        }

        // Apply all multipliers
        const annualSeqPerTree = treeInfo.maxAnnualSeq * growthFactor * climateMultiplier * soilMultiplier * densityFactor;
        yearlySequestration = currentTrees * annualSeqPerTree;
      }

      cumulativeCarbon += yearlySequestration;

      // Calculate costs
      if (year <= maintenanceYears) {
        const yearlyMaintenanceCost = plantingArea * maintenanceCostPerYear;
        totalCosts += yearlyMaintenanceCost;
      }

      // Calculate revenue from carbon credits
      const yearlyRevenue = yearlySequestration / 1000 * carbonPrice; // Convert kg to tons
      totalRevenue += yearlyRevenue / Math.pow(1 + discountRate, year - 1); // Present value

      yearlyData.push({
        year: year,
        yearlySequestration: yearlySequestration / 1000, // Convert to tons
        cumulativeSequestration: cumulativeCarbon / 1000,
        trees: currentTrees
      });
    }

    // Calculate key metrics
    const totalCarbonTons = cumulativeCarbon / 1000;
    const carbonPerTree = totalCarbonTons / survivingTrees;
    const carbonPerHectare = totalCarbonTons / plantingArea;
    const costPerTonCO2 = totalCosts / totalCarbonTons;
    const netPresentValue = totalRevenue - totalCosts;
    const paybackPeriod = calculatePaybackPeriod(yearlyData, totalCosts, carbonPrice);
    
    // Peak sequestration year
    const peakYear = yearlyData.reduce((max, current) => 
      current.yearlySequestration > max.yearlySequestration ? current : max, yearlyData[0]);

    displayResults({
      species: treeInfo.name,
      numberOfTrees: numberOfTrees,
      survivingTrees: survivingTrees,
      plantingArea: plantingArea,
      totalCarbonTons: totalCarbonTons,
      carbonPerTree: carbonPerTree,
      carbonPerHectare: carbonPerHectare,
      costPerTonCO2: costPerTonCO2,
      totalCosts: totalCosts,
      totalRevenue: totalRevenue,
      netPresentValue: netPresentValue,
      paybackPeriod: paybackPeriod,
      peakYear: peakYear,
      projectionYears: projectionYears,
      climateZone: climateZone,
      soilQuality: soilQuality
    });

    createChart(yearlyData);
  });

  function calculatePaybackPeriod(yearlyData, totalCosts, carbonPrice) {
    let cumulativeRevenue = 0;
    for (let i = 0; i < yearlyData.length; i++) {
      cumulativeRevenue += yearlyData[i].yearlySequestration * carbonPrice;
      if (cumulativeRevenue >= totalCosts) {
        return i + 1;
      }
    }
    return yearlyData.length; // Return max years if payback not achieved
  }

  function displayResults(data) {
    const resultDiv = document.getElementById("tree-result");
    
    resultDiv.innerHTML = `
      <div class="insight-card">
        <h3>🌳 Carbon Sequestration Results</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
          
          <div style="background: linear-gradient(135deg, #2E7D32, #43A047); color: white; padding: 1.5rem; border-radius: 12px;">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 2rem; margin-right: 0.5rem;">🌱</span>
              <h4 style="margin: 0; font-size: 1.1rem;">Total Carbon Sequestration</h4>
            </div>
            <div style="font-size: 2.2rem; font-weight: bold; margin-bottom: 0.5rem;">
              ${data.totalCarbonTons.toFixed(1)} tons CO₂
            </div>
            <div style="opacity: 0.9;">
              Over ${data.projectionYears} years from ${data.numberOfTrees.toLocaleString()} trees (${data.species})
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #1565C0, #1976D2); color: white; padding: 1.5rem; border-radius: 12px;">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 2rem; margin-right: 0.5rem;">📊</span>
              <h4 style="margin: 0; font-size: 1.1rem;">Sequestration Efficiency</h4>
            </div>
            <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 0.3rem;">
              ${data.carbonPerTree.toFixed(2)} tons CO₂/tree
            </div>
            <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 0.5rem;">
              ${data.carbonPerHectare.toFixed(1)} tons CO₂/hectare
            </div>
            <div style="opacity: 0.9;">
              Survival rate: ${((data.survivingTrees/data.numberOfTrees)*100).toFixed(1)}%
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #E65100, #FF9800); color: white; padding: 1.5rem; border-radius: 12px;">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 2rem; margin-right: 0.5rem;">💰</span>
              <h4 style="margin: 0; font-size: 1.1rem;">Project Economics</h4>
            </div>
            <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 0.3rem;">
              $${data.costPerTonCO2.toFixed(0)}/ton CO₂
            </div>
            <div style="font-size: 1.2rem; margin-bottom: 0.3rem;">
              NPV: ${data.netPresentValue >= 0 ? '+' : ''}$${data.netPresentValue.toFixed(0)}
            </div>
            <div style="opacity: 0.9;">
              Payback: ${data.paybackPeriod} years
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #6A1B9A, #8E24AA); color: white; padding: 1.5rem; border-radius: 12px;">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 2rem; margin-right: 0.5rem;">⏰</span>
              <h4 style="margin: 0; font-size: 1.1rem;">Peak Sequestration</h4>
            </div>
            <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 0.3rem;">
              ${data.peakYear.yearlySequestration.toFixed(1)} tons CO₂/year
            </div>
            <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">
              In year ${data.peakYear.year}
            </div>
            <div style="opacity: 0.9;">
              ${data.peakYear.trees.toLocaleString()} active trees
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #2E7D32; margin-bottom: 1rem;">📋 Project Details</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; background: #f8f9fa; padding: 1.5rem; border-radius: 8px;">
            <div><strong>Planting area:</strong> ${data.plantingArea} hectares</div>
            <div><strong>Climate zone:</strong> ${getClimateZoneName(data.climateZone)}</div>
            <div><strong>Soil quality:</strong> ${getSoilQualityName(data.soilQuality)}</div>
            <div><strong>Total costs:</strong> $${data.totalCosts.toLocaleString()}</div>
            <div><strong>Potential revenue:</strong> $${data.totalRevenue.toFixed(0)}</div>
            <div><strong>Projection period:</strong> ${data.projectionYears} years</div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #2E7D32; margin-bottom: 1rem;">🌍 Environmental Impact</h4>
          <div style="background: linear-gradient(135deg, #E8F5E8, #C8E6C8); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #4CAF50;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
              <div>
                <strong>🚗 Car emission equivalent:</strong><br>
                <span style="font-size: 1.1rem;">${(data.totalCarbonTons * 2824).toFixed(0)} miles of driving</span>
              </div>
              <div>
                <strong>🏠 Household emission equivalent:</strong><br>
                <span style="font-size: 1.1rem;">${(data.totalCarbonTons / 16).toFixed(1)} years of emissions</span>
              </div>
              <div>
                <strong>⚡ Clean energy equivalent:</strong><br>
                <span style="font-size: 1.1rem;">${(data.totalCarbonTons * 2396).toFixed(0)} kWh</span>
              </div>
              <div>
                <strong>🌳 Additional benefits:</strong><br>
                <span style="font-size: 1.1rem;">Biodiversity, air purification, soil conservation</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #2E7D32; margin-bottom: 1rem;">💡 Optimization Recommendations</h4>
          <div style="background: #fff3cd; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #ffc107;">
            ${generateRecommendations(data)}
          </div>
        </div>
      </div>
    `;
  }

  function generateRecommendations(data) {
    let recommendations = [];
    
    if (data.costPerTonCO2 > 40) {
      recommendations.push("• Consider increasing planting density to reduce cost per ton CO₂");
    }
    
    if (data.netPresentValue < 0) {
      recommendations.push("• Project may need additional funding or higher carbon credit prices");
    }
    
    if (data.paybackPeriod > 20) {
      recommendations.push("• Consider faster-growing tree species to reduce payback period");
    }
    
    if (data.carbonPerHectare < 100) {
      recommendations.push("• Soil quality improvement could significantly enhance carbon sequestration");
    }
    
    recommendations.push("• Regular monitoring and care will improve tree survival rates");
    recommendations.push("• Consider project certification for access to carbon credit markets");
    
    return recommendations.join("<br>");
  }

  function getClimateZoneName(zone) {
    const names = {
      temperate: "Temperate",
      continental: "Continental", 
      mediterranean: "Mediterranean",
      subtropical: "Subtropical",
      boreal: "Boreal"
    };
    return names[zone] || zone;
  }

  function getSoilQualityName(quality) {
    const names = {
      poor: "Poor",
      average: "Average",
      good: "Good", 
      excellent: "Excellent"
    };
    return names[quality] || quality;
  }

  function createChart(yearlyData) {
    const chartBlock = document.getElementById("tree-chart-block");
    const canvas = document.getElementById("tree-chart");
    
    if (!canvas || !window.Chart) return;
    
    chartBlock.style.display = "block";
    
    // Destroy existing chart if it exists
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    
    const ctx = canvas.getContext("2d");
    
    canvas.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: yearlyData.map(d => d.year),
        datasets: [
          {
            label: 'Annual Sequestration (tons CO₂)',
            data: yearlyData.map(d => d.yearlySequestration),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Cumulative Sequestration (tons CO₂)',
            data: yearlyData.map(d => d.cumulativeSequestration),
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            fill: false,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              afterBody: function(context) {
                const dataIndex = context[0].dataIndex;
                const trees = yearlyData[dataIndex].trees;
                return `Active trees: ${trees.toLocaleString()}`;
              }
            }
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
              text: 'Annual Sequestration (tons CO₂)'
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Cumulative Sequestration (tons CO₂)'
            },
            grid: {
              drawOnChartArea: true,
            },
          },
        },
      },
    });
  }
});