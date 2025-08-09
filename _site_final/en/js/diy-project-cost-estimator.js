document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("diy-cost-form");
  if (!form) return;

  // Project cost database with base costs per square foot
  const projectCosts = {
    flooring: {
      budget: { material: 2, labor: 3, tools: 50 },
      "mid-range": { material: 5, labor: 4, tools: 75 },
      premium: { material: 8, labor: 5, tools: 100 },
      luxury: { material: 15, labor: 7, tools: 150 },
      description: "Hardwood, laminate, or luxury vinyl plank flooring"
    },
    painting: {
      budget: { material: 0.75, labor: 2, tools: 30 },
      "mid-range": { material: 1.25, labor: 2.5, tools: 50 },
      premium: { material: 2, labor: 3, tools: 75 },
      luxury: { material: 3.5, labor: 4, tools: 100 },
      description: "Interior walls, trim, and ceiling painting"
    },
    kitchen: {
      budget: { material: 25, labor: 35, tools: 200 },
      "mid-range": { material: 50, labor: 45, tools: 300 },
      premium: { material: 85, labor: 60, tools: 500 },
      luxury: { material: 150, labor: 80, tools: 750 },
      description: "Cabinet refacing, countertops, backsplash"
    },
    bathroom: {
      budget: { material: 15, labor: 25, tools: 150 },
      "mid-range": { material: 30, labor: 35, tools: 250 },
      premium: { material: 55, labor: 50, tools: 400 },
      luxury: { material: 100, labor: 70, tools: 600 },
      description: "Tile, fixtures, vanity, plumbing updates"
    },
    deck: {
      budget: { material: 8, labor: 12, tools: 200 },
      "mid-range": { material: 15, labor: 18, tools: 350 },
      premium: { material: 25, labor: 25, tools: 500 },
      luxury: { material: 45, labor: 35, tools: 750 },
      description: "Pressure-treated or composite decking"
    },
    fence: {
      budget: { material: 12, labor: 15, tools: 100 },
      "mid-range": { material: 20, labor: 20, tools: 150 },
      premium: { material: 35, labor: 28, tools: 250 },
      luxury: { material: 60, labor: 40, tools: 400 },
      description: "Wood privacy or decorative fencing"
    },
    tile: {
      budget: { material: 3, labor: 5, tools: 75 },
      "mid-range": { material: 6, labor: 7, tools: 125 },
      premium: { material: 12, labor: 10, tools: 200 },
      luxury: { material: 25, labor: 15, tools: 300 },
      description: "Ceramic or porcelain floor/wall tile"
    },
    drywall: {
      budget: { material: 1.5, labor: 2.5, tools: 100 },
      "mid-range": { material: 2, labor: 3, tools: 150 },
      premium: { material: 2.5, labor: 4, tools: 200 },
      luxury: { material: 3.5, labor: 5, tools: 250 },
      description: "Drywall installation, taping, finishing"
    },
    shelving: {
      budget: { material: 8, labor: 12, tools: 75 },
      "mid-range": { material: 15, labor: 18, tools: 125 },
      premium: { material: 25, labor: 25, tools: 200 },
      luxury: { material: 45, labor: 35, tools: 300 },
      description: "Built-in shelving and storage systems"
    },
    custom: {
      budget: { material: 5, labor: 8, tools: 100 },
      "mid-range": { material: 10, labor: 15, tools: 200 },
      premium: { material: 20, labor: 25, tools: 350 },
      luxury: { material: 40, labor: 40, tools: 500 },
      description: "Custom project with variable requirements"
    }
  };

  // Tool cost database
  const toolCosts = {
    basic: {
      own: 0,
      buy: 150,
      rent: 0,
      description: "Hammer, screwdriver, measuring tape, level"
    },
    specialty: {
      simple: { buy: 200, rent: 50 },
      moderate: { buy: 400, rent: 75 },
      complex: { buy: 750, rent: 125 }
    },
    safety: {
      cost: 75,
      description: "Safety glasses, gloves, dust masks, ear protection"
    }
  };

  // Additional cost factors
  const additionalCosts = {
    delivery: 0.05, // 5% of material cost
    permits: 150, // Flat fee
    disposal: 200, // Flat fee
    rush: 0.15 // 15% premium
  };

  // Complexity multipliers
  const complexityMultipliers = {
    simple: 1.0,
    moderate: 1.2,
    complex: 1.5
  };

  // Skill level impact on time and waste
  const skillImpact = {
    beginner: { timeMultiplier: 1.5, wasteMultiplier: 1.3 },
    intermediate: { timeMultiplier: 1.2, wasteMultiplier: 1.1 },
    advanced: { timeMultiplier: 1.0, wasteMultiplier: 1.0 }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const projectType = document.getElementById("projectType").value;
    const projectArea = parseFloat(document.getElementById("projectArea").value);
    const projectComplexity = document.getElementById("projectComplexity").value;
    const skillLevel = document.getElementById("skillLevel").value;
    const materialQuality = document.getElementById("materialQuality").value;
    const wasteBuffer = parseFloat(document.getElementById("wasteBuffer").value) / 100;
    const laborComparison = document.getElementById("laborComparison").value === "yes";
    const localPriceIndex = parseFloat(document.getElementById("localPriceIndex").value);
    const ownBasicTools = document.getElementById("ownBasicTools").value === "yes";
    const toolStrategy = document.getElementById("toolStrategy").value;
    const projectDuration = parseInt(document.getElementById("projectDuration").value);
    const includeSafety = document.getElementById("includeSafety").value === "yes";
    const includeDelivery = document.getElementById("includeDelivery").value === "yes";
    const includePermits = document.getElementById("includePermits").value === "yes";
    const includeDisposal = document.getElementById("includeDisposal").value === "yes";
    const rushJob = document.getElementById("rushJob").value === "yes";

    // Get base project costs
    const baseCosts = projectCosts[projectType];
    if (!baseCosts) return;

    // Calculate base material and tool costs
    let baseMaterialCost = baseCosts[materialQuality].material * projectArea;
    let baseToolCost = baseCosts[materialQuality].tools;
    const laborCostPerSqFt = baseCosts[materialQuality].labor;

    // Apply complexity multiplier
    const complexityMultiplier = complexityMultipliers[projectComplexity];
    baseMaterialCost *= complexityMultiplier;
    baseToolCost *= complexityMultiplier;

    // Apply skill level impacts
    const skillMultiplier = skillImpact[skillLevel];
    const adjustedWasteBuffer = wasteBuffer * skillMultiplier.wasteMultiplier;
    const rawAdjustedDuration = projectDuration * skillMultiplier.timeMultiplier;
    const adjustedDuration = Math.round(rawAdjustedDuration * 10) / 10;

    // Calculate material costs with waste buffer
    const materialWithWaste = baseMaterialCost * (1 + adjustedWasteBuffer);

    // Calculate tool costs based on strategy
    let toolCosts = calculateToolCosts(baseToolCost, ownBasicTools, toolStrategy, projectComplexity, adjustedDuration);

    // Add safety equipment if needed
    if (includeSafety && !ownBasicTools) {
      toolCosts += toolCosts.safety || 75;
    }

    // Apply local price index
    const adjustedMaterialCost = materialWithWaste * localPriceIndex;
    const adjustedToolCost = toolCosts * localPriceIndex;

    // Calculate additional costs
    let additionalCostTotal = 0;
    if (includeDelivery) {
      additionalCostTotal += adjustedMaterialCost * additionalCosts.delivery;
    }
    if (includePermits) {
      additionalCostTotal += additionalCosts.permits;
    }
    if (includeDisposal) {
      additionalCostTotal += additionalCosts.disposal;
    }
    if (rushJob) {
      const rushPremium = (adjustedMaterialCost + adjustedToolCost) * additionalCosts.rush;
      additionalCostTotal += rushPremium;
    }

    // Calculate total DIY cost
    const totalDIYCost = adjustedMaterialCost + adjustedToolCost + additionalCostTotal;

    // Calculate professional labor costs for comparison
    let professionalCost = 0;
    if (laborComparison) {
      professionalCost = (adjustedMaterialCost + (laborCostPerSqFt * projectArea * localPriceIndex * complexityMultiplier)) * 1.2; // 20% markup
    }

    // Calculate cost breakdown
    const costBreakdown = {
      materials: adjustedMaterialCost,
      tools: adjustedToolCost,
      additional: additionalCostTotal,
      total: totalDIYCost,
      professional: professionalCost,
      savings: professionalCost - totalDIYCost,
      savingsPercent: professionalCost > 0 ? ((professionalCost - totalDIYCost) / professionalCost * 100) : 0
    };

    // Generate material list and tips
    const projectDetails = generateProjectDetails(projectType, projectArea, materialQuality, adjustedDuration);

    // Calculate cost per square foot
    const costPerSqFt = totalDIYCost / projectArea;

    // Generate recommendations
    const recommendations = generateRecommendations(costBreakdown, skillLevel, projectComplexity, toolStrategy);

    // Display results
    displayResults({
      projectType,
      projectArea,
      materialQuality,
      projectComplexity,
      skillLevel,
      costBreakdown,
      projectDetails,
      costPerSqFt,
      recommendations,
      adjustedDuration,
      baseCosts
    });

    // Show cost breakdown chart
    showCostChart(costBreakdown);
  });

  function calculateToolCosts(baseToolCost, ownBasicTools, strategy, complexity, duration) {
    let toolCost = 0;

    // Basic tools
    if (!ownBasicTools) {
      toolCost += toolCosts.basic.buy;
    }

    // Specialty tools based on strategy
    const specialtyTools = toolCosts.specialty[complexity];
    
    switch (strategy) {
      case "buy":
        toolCost += specialtyTools.buy;
        break;
      case "rent":
        toolCost += specialtyTools.rent * Math.ceil(duration / 7); // Weekly rental
        break;
      case "borrow":
        toolCost += 0; // Assume no cost for borrowed tools
        break;
      case "mixed":
        toolCost += (specialtyTools.buy * 0.3) + (specialtyTools.rent * Math.ceil(duration / 7) * 0.7);
        break;
    }

    return Math.max(toolCost, baseToolCost * 0.5); // Minimum tool cost
  }

  function generateProjectDetails(projectType, area, quality, duration) {
    const project = projectCosts[projectType];
    const formattedDuration = duration % 1 === 0 ? Math.round(duration) : duration;
    
    return {
      description: project.description,
      estimatedTime: `${formattedDuration} days`,
      difficulty: getDifficultyLevel(projectType),
      keyMaterials: getKeyMaterials(projectType, quality),
      tips: getProjectTips(projectType)
    };
  }

  function getDifficultyLevel(projectType) {
    const difficulty = {
      painting: "Beginner",
      shelving: "Beginner", 
      flooring: "Intermediate",
      tile: "Intermediate",
      drywall: "Intermediate",
      fence: "Intermediate",
      bathroom: "Advanced",
      kitchen: "Advanced",
      deck: "Advanced",
      custom: "Variable"
    };
    return difficulty[projectType] || "Intermediate";
  }

  function getKeyMaterials(projectType, quality) {
    const materials = {
      flooring: ["Flooring planks", "Underlayment", "Trim/molding", "Fasteners", "Transition strips"],
      painting: ["Paint", "Primer", "Brushes/rollers", "Drop cloths", "Painter's tape"],
      kitchen: ["Cabinet hardware", "Countertop material", "Backsplash tile", "Adhesives", "Grout"],
      bathroom: ["Tile", "Grout", "Fixtures", "Plumbing supplies", "Waterproofing"],
      deck: ["Decking boards", "Framing lumber", "Fasteners", "Concrete", "Railing materials"],
      fence: ["Fence panels", "Posts", "Concrete", "Hardware", "Gate materials"],
      tile: ["Tile", "Grout", "Tile adhesive", "Spacers", "Trim pieces"],
      drywall: ["Drywall sheets", "Joint compound", "Tape", "Fasteners", "Primer"],
      shelving: ["Lumber/boards", "Brackets", "Fasteners", "Wood finish", "Hardware"],
      custom: ["Variable materials", "Based on project", "Requirements", "And specifications", ""]
    };
    return materials[projectType] || ["Materials", "vary by", "project type", "", ""];
  }

  function getProjectTips(projectType) {
    const tips = {
      flooring: ["Acclimate flooring materials", "Start in the most visible room", "Leave expansion gaps", "Use proper underlayment"],
      painting: ["Prime all surfaces first", "Use high-quality brushes", "Apply thin, even coats", "Remove tape while paint is wet"],
      kitchen: ["Turn off utilities first", "Measure twice, cut once", "Install heavy items first", "Plan electrical/plumbing changes"],
      bathroom: ["Waterproof all wet areas", "Plan tile layout first", "Use proper ventilation", "Allow extra time for plumbing"],
      deck: ["Check local building codes", "Use galvanized fasteners", "Plan for drainage", "Allow lumber to dry"],
      fence: ["Check property lines", "Call utility locator", "Set posts in concrete", "Plan for gate swing"],
      tile: ["Plan layout from center", "Use tile spacers", "Keep grout lines consistent", "Clean excess grout immediately"],
      drywall: ["Score and snap sheets", "Stagger joint locations", "Apply multiple thin coats", "Sand between coats"],
      shelving: ["Use a level for installation", "Find wall studs", "Pre-drill screw holes", "Plan weight distribution"],
      custom: ["Plan thoroughly", "Research techniques", "Have backup materials", "Take time for quality"]
    };
    return tips[projectType] || ["Plan carefully", "Research techniques", "Buy quality materials", "Take your time"];
  }

  function generateRecommendations(costs, skill, complexity, toolStrategy) {
    const recommendations = [];

    // Cost-based recommendations
    if (costs.savings > 1000) {
      recommendations.push({
        type: "savings",
        message: `Excellent DIY savings potential of $${costs.savings.toLocaleString()}!`
      });
    } else if (costs.savings < 500) {
      recommendations.push({
        type: "warning",
        message: "Consider hiring professionals - DIY savings may not justify the effort."
      });
    }

    // Skill-based recommendations
    if (skill === "beginner" && complexity === "complex") {
      recommendations.push({
        type: "caution",
        message: "This is a complex project for beginners. Consider starting with a simpler project or hiring professionals."
      });
    }

    // Tool strategy recommendations
    if (toolStrategy === "buy" && costs.tools > 500) {
      recommendations.push({
        type: "tip",
        message: "Consider renting tools to reduce upfront costs, especially for one-time projects."
      });
    }

    // General recommendations
    recommendations.push({
      type: "tip",
      message: "Shop around for materials - prices can vary 20-30% between suppliers."
    });

    return recommendations;
  }

  function displayResults(data) {
    const resultBlock = document.getElementById("diy-cost-result");
    const projectName = data.projectType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>💰 Total DIY Cost</h6>
          <div class="big-number">$${data.costBreakdown.total.toLocaleString()}</div>
          <p class="insight-detail">for ${data.projectArea} sq ft</p>
        </div>
        <div class="insight-card warning">
          <h6>📏 Cost per Sq Ft</h6>
          <div class="big-number">$${data.costPerSqFt.toFixed(0)}</div>
          <p class="insight-detail">${data.materialQuality} quality</p>
        </div>
        <div class="insight-card ${data.costBreakdown.savings > 500 ? 'success' : 'warning'}">
          <h6>💾 DIY Savings</h6>
          <div class="big-number">$${Math.abs(data.costBreakdown.savings).toLocaleString()}</div>
          <p class="insight-detail">${data.costBreakdown.savingsPercent.toFixed(0)}% vs. professional</p>
        </div>
        <div class="insight-card info">
          <h6>⏱️ Project Duration</h6>
          <div class="big-number">${data.adjustedDuration % 1 === 0 ? Math.round(data.adjustedDuration) : data.adjustedDuration}</div>
          <p class="insight-detail">days estimated</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">🔨 ${projectName} Project Analysis</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div>
            <h5>📊 Project Overview</h5>
            <p><strong>Project Type:</strong> ${projectName}</p>
            <p><strong>Area:</strong> ${data.projectArea} sq ft</p>
            <p><strong>Quality Level:</strong> ${data.materialQuality}</p>
            <p><strong>Complexity:</strong> ${data.projectComplexity}</p>
            <p><strong>Skill Level:</strong> ${data.skillLevel}</p>
            <p><strong>Difficulty:</strong> ${data.projectDetails.difficulty}</p>
          </div>
          
          <div>
            <h5>💰 Cost Breakdown</h5>
            <p><strong>Materials:</strong> $${data.costBreakdown.materials.toLocaleString()}</p>
            <p><strong>Tools:</strong> $${data.costBreakdown.tools.toLocaleString()}</p>
            <p><strong>Additional Costs:</strong> $${data.costBreakdown.additional.toLocaleString()}</p>
            <p><strong>Total DIY:</strong> $${data.costBreakdown.total.toLocaleString()}</p>
            ${data.costBreakdown.professional > 0 ? `<p><strong>Professional Cost:</strong> $${data.costBreakdown.professional.toLocaleString()}</p>` : ''}
          </div>
          
          <div>
            <h5>⏰ Project Timeline</h5>
            <p><strong>Estimated Duration:</strong> ${data.projectDetails.estimatedTime}</p>
            <p><strong>Project Description:</strong></p>
            <p style="font-size: 0.9rem; color: #666;">${data.projectDetails.description}</p>
          </div>
        </div>

        <h5>📦 Key Materials Needed</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-bottom: 2rem;">
          ${data.projectDetails.keyMaterials.filter(material => material).map(material => `
            <div style="padding: 0.75rem; background: white; border-radius: 8px; border-left: 4px solid #4caf50; font-weight: 500;">
              ✓ ${material}
            </div>
          `).join('')}
        </div>

        <h5>💡 Project Tips & Best Practices</h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem; margin-bottom: 2rem;">
          ${data.projectDetails.tips.map(tip => `
            <div style="padding: 0.75rem; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #1976d2; font-size: 0.9rem;">
              💡 ${tip}
            </div>
          `).join('')}
        </div>

        ${data.recommendations.length > 0 ? `
          <h5>🎯 Recommendations</h5>
          <div style="margin-bottom: 2rem;">
            ${data.recommendations.map(rec => `
              <div style="padding: 1rem; margin-bottom: 0.5rem; background: ${
                rec.type === 'savings' ? '#e8f5e8' : 
                rec.type === 'warning' || rec.type === 'caution' ? '#fff8e1' : '#e3f2fd'
              }; border-radius: 8px; border: 2px solid ${
                rec.type === 'savings' ? '#28a745' :
                rec.type === 'warning' || rec.type === 'caution' ? '#ffc107' : '#1976d2'
              };">
                <p style="margin: 0; font-weight: 500;">
                  ${rec.type === 'savings' ? '💰' : rec.type === 'warning' || rec.type === 'caution' ? '⚠️' : '💡'} ${rec.message}
                </p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; border: 2px solid #28a745;">
            <h6 style="margin-top: 0; color: #28a745;">✅ DIY Advantages</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Significant cost savings</li>
              <li>Complete control over quality</li>
              <li>Flexible timeline</li>
              <li>Learning new skills</li>
              <li>Personal satisfaction</li>
            </ul>
          </div>
          
          <div style="padding: 1rem; background: #fff8e1; border-radius: 8px; border: 2px solid #ffc107;">
            <h6 style="margin-top: 0; color: #f57c00;">⚠️ DIY Considerations</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Time investment required</li>
              <li>Learning curve for new skills</li>
              <li>Tool purchase/rental costs</li>
              <li>Potential for mistakes</li>
              <li>Physical demands</li>
            </ul>
          </div>
          
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
            <h6 style="margin-top: 0; color: #1976d2;">🛠️ Getting Started</h6>
            <ul style="margin: 0; font-size: 0.9rem;">
              <li>Research techniques thoroughly</li>
              <li>Start with a small test area</li>
              <li>Budget extra time and materials</li>
              <li>Have backup plans ready</li>
              <li>Know when to call professionals</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function showCostChart(costBreakdown) {
    const chartBlock = document.getElementById("diy-cost-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("diy-cost-chart").getContext("2d");
      if (window.diyCostChart) window.diyCostChart.destroy();

      const labels = ['Materials', 'Tools', 'Additional Costs'];
      const data = [
        costBreakdown.materials,
        costBreakdown.tools,
        costBreakdown.additional
      ];

      // Add professional comparison if available
      if (costBreakdown.professional > 0) {
        labels.push('Professional Cost');
        data.push(costBreakdown.professional);
      }

      window.diyCostChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              '#4CAF50', // Materials - Green
              '#2196F3', // Tools - Blue  
              '#FF9800', // Additional - Orange
              '#F44336'  // Professional - Red
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Total Project Cost: $${costBreakdown.total.toLocaleString()}`
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