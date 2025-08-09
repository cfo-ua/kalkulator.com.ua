document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('printing-cost-form');
  const result = document.getElementById('printing-cost-result');

  // Setup range sliders
  setupRangeSlider('infill-percentage', 'infill-display', '%');
  setupRangeSlider('support-percentage', 'support-display', '%');
  setupRangeSlider('waste-factor', 'waste-display', '%');
  setupRangeSlider('overhead-rate', 'overhead-display', '%');
  setupRangeSlider('profit-margin', 'profit-display', '%');
  setupRangeSlider('failure-rate', 'failure-display', '%');

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculate3DPrintingCosts();
    });

    // Auto-fill values when technology or material changes
    document.getElementById('print-technology').addEventListener('change', autoFillTechnologyValues);
    document.getElementById('material-type').addEventListener('change', autoFillMaterialValues);
    document.getElementById('printer-type').addEventListener('change', autoFillPrinterValues);
  }

  function setupRangeSlider(sliderId, displayId, suffix = '') {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (slider && display) {
      slider.addEventListener('input', function() {
        display.textContent = this.value + suffix;
      });
    }
  }

  function autoFillTechnologyValues() {
    const technology = document.getElementById('print-technology').value;
    const costUnit = document.getElementById('cost-unit');
    
    if (technology === 'fdm') {
      costUnit.value = 'kg';
      document.getElementById('printer-power').value = 200;
      document.getElementById('postprocess-time').value = 30;
    } else if (technology === 'sla' || technology === 'dlp') {
      costUnit.value = 'liter';
      document.getElementById('printer-power').value = 50;
      document.getElementById('postprocess-time').value = 60;
    } else if (technology === 'sls' || technology === 'mjf') {
      costUnit.value = 'kg';
      document.getElementById('printer-power').value = 1000;
      document.getElementById('postprocess-time').value = 90;
    }
  }

  function autoFillMaterialValues() {
    const material = document.getElementById('material-type').value;
    const materialCostInput = document.getElementById('material-cost');
    
    const materialCosts = {
      'pla': 25,
      'abs': 30,
      'petg': 35,
      'tpu': 50,
      'nylon': 65,
      'pc': 80,
      'wood': 42,
      'metal': 120,
      'carbon': 150,
      'standard-resin': 65,
      'tough-resin': 100,
      'flexible-resin': 125,
      'dental-resin': 300,
      'castable-resin': 200
    };
    
    if (materialCosts[material]) {
      materialCostInput.value = materialCosts[material];
    }
  }

  function autoFillPrinterValues() {
    const printerType = document.getElementById('printer-type').value;
    
    const printerSpecs = {
      'hobby': { power: 150, machineDepreciation: 0.5, setupTime: 45 },
      'prosumer': { power: 300, machineDepreciation: 2, setupTime: 30 },
      'professional': { power: 500, machineDepreciation: 8, setupTime: 20 },
      'industrial': { power: 1200, machineDepreciation: 25, setupTime: 15 }
    };
    
    const specs = printerSpecs[printerType];
    if (specs) {
      document.getElementById('printer-power').value = specs.power;
      document.getElementById('machine-cost').value = specs.machineDepreciation;
      document.getElementById('setup-time').value = specs.setupTime;
    }
  }

  function calculate3DPrintingCosts() {
    // Get form values
    const technology = document.getElementById('print-technology').value;
    const printerType = document.getElementById('printer-type').value;
    const materialType = document.getElementById('material-type').value;
    const materialCost = parseFloat(document.getElementById('material-cost').value);
    const costUnit = document.getElementById('cost-unit').value;
    const partVolume = parseFloat(document.getElementById('part-volume').value);
    const infillPercentage = parseFloat(document.getElementById('infill-percentage').value) / 100;
    const supportPercentage = parseFloat(document.getElementById('support-percentage').value) / 100;
    const partCount = parseInt(document.getElementById('part-count').value);
    const wasteFactor = parseFloat(document.getElementById('waste-factor').value) / 100;
    const printTime = parseFloat(document.getElementById('print-time').value);
    const printerPower = parseFloat(document.getElementById('printer-power').value);
    const electricityRate = parseFloat(document.getElementById('electricity-rate').value);
    const setupTime = parseFloat(document.getElementById('setup-time').value) / 60; // Convert to hours
    const postprocessTime = parseFloat(document.getElementById('postprocess-time').value) / 60; // Convert to hours
    const laborRate = parseFloat(document.getElementById('labor-rate').value);
    const machineCost = parseFloat(document.getElementById('machine-cost').value);
    const overheadRate = parseFloat(document.getElementById('overhead-rate').value) / 100;
    const profitMargin = parseFloat(document.getElementById('profit-margin').value) / 100;
    const failureRate = parseFloat(document.getElementById('failure-rate').value) / 100;
    const includeSupports = document.getElementById('include-supports').checked;
    const hollowOptimization = document.getElementById('hollow-optimization').checked;
    const batchPrinting = document.getElementById('batch-printing').checked;
    const premiumService = document.getElementById('premium-service').checked;
    const rushMultiplier = parseFloat(document.getElementById('rush-multiplier').value);

    // Validate required fields
    if (!technology || !materialType || !materialCost || !partVolume || !printTime) {
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    // Calculate material usage
    const materialUsage = calculateMaterialUsage(
      technology, partVolume, infillPercentage, supportPercentage, 
      partCount, wasteFactor, hollowOptimization, materialType
    );

    // Calculate material costs
    const materialCostTotal = calculateMaterialCosts(
      materialUsage, materialCost, costUnit, includeSupports, supportPercentage
    );

    // Calculate energy costs
    const energyCost = calculateEnergyCosts(
      printTime, printerPower, electricityRate, setupTime, partCount, batchPrinting
    );

    // Calculate time and labor costs
    const timeCosts = calculateTimeCosts(
      printTime, setupTime, postprocessTime, laborRate, partCount, batchPrinting
    );

    // Calculate equipment costs
    const equipmentCost = calculateEquipmentCosts(
      printTime, setupTime, postprocessTime, machineCost, partCount, batchPrinting
    );

    // Calculate base costs
    const baseCost = materialCostTotal + energyCost + timeCosts + equipmentCost;

    // Apply overhead, failure rate, and profit
    const finalCost = calculateFinalCost(
      baseCost, overheadRate, failureRate, profitMargin, premiumService, rushMultiplier
    );

    // Calculate cost breakdown and analysis
    const costAnalysis = calculateCostAnalysis(
      materialCostTotal, energyCost, timeCosts, equipmentCost, 
      baseCost, finalCost, partCount
    );

    // Display results
    displayResults({
      technology,
      materialType,
      materialUsage,
      materialCostTotal,
      energyCost,
      timeCosts,
      equipmentCost,
      baseCost,
      finalCost,
      costAnalysis,
      partCount,
      printTime,
      laborRate,
      printerType,
      rushMultiplier
    });
  }

  function calculateMaterialUsage(technology, partVolume, infillPercentage, supportPercentage, partCount, wasteFactor, hollowOptimization, materialType) {
    let effectiveVolume = partVolume;

    // Adjust for hollow optimization (mainly for SLA/DLP)
    if (hollowOptimization && (technology === 'sla' || technology === 'dlp')) {
      effectiveVolume = partVolume * 0.2; // 80% reduction for hollow parts
    }

    // FDM infill adjustment
    if (technology === 'fdm') {
      effectiveVolume = partVolume * infillPercentage;
    }

    // Support material
    const supportVolume = effectiveVolume * supportPercentage;
    const totalVolume = effectiveVolume + supportVolume;

    // Apply waste factor
    const volumeWithWaste = totalVolume * (1 + wasteFactor);

    // Convert to weight/volume based on material
    const materialDensities = {
      'pla': 1.24, 'abs': 1.04, 'petg': 1.27, 'tpu': 1.2, 'nylon': 1.14,
      'pc': 1.2, 'wood': 1.15, 'metal': 2.5, 'carbon': 1.3
    };

    let finalUsage;
    if (technology === 'fdm') {
      const density = materialDensities[materialType] || 1.2;
      finalUsage = (volumeWithWaste * density * partCount) / 1000; // Convert g to kg
    } else {
      // Resin usage in liters
      finalUsage = (volumeWithWaste * partCount) / 1000; // Convert cm³ to liters
    }

    return {
      partVolume: partVolume,
      effectiveVolume: effectiveVolume,
      supportVolume: supportVolume,
      totalVolume: totalVolume,
      volumeWithWaste: volumeWithWaste,
      finalUsage: finalUsage,
      unit: technology === 'fdm' ? 'kg' : 'L'
    };
  }

  function calculateMaterialCosts(materialUsage, materialCost, costUnit, includeSupports, supportPercentage) {
    const baseMaterialCost = materialUsage.finalUsage * materialCost;
    
    // Additional cost for support material if different material
    let supportMaterialCost = 0;
    if (includeSupports && supportPercentage > 0) {
      // Assume support material costs 80% of main material
      const supportCost = materialCost * 0.8;
      const supportUsage = materialUsage.supportVolume * materialUsage.finalUsage / materialUsage.volumeWithWaste;
      supportMaterialCost = supportUsage * supportCost;
    }

    return baseMaterialCost + supportMaterialCost;
  }

  function calculateEnergyCosts(printTime, printerPower, electricityRate, setupTime, partCount, batchPrinting) {
    let totalTime = printTime;
    
    if (batchPrinting && partCount > 1) {
      // Batch printing: one setup for all parts
      totalTime = printTime + setupTime;
    } else {
      // Individual printing: setup time per part
      totalTime = (printTime + setupTime) * partCount;
    }

    const energyConsumption = (printerPower / 1000) * totalTime; // kWh
    return energyConsumption * electricityRate;
  }

  function calculateTimeCosts(printTime, setupTime, postprocessTime, laborRate, partCount, batchPrinting) {
    let totalLaborTime;
    
    if (batchPrinting && partCount > 1) {
      // Batch: one setup, individual post-processing
      totalLaborTime = setupTime + (postprocessTime * partCount);
    } else {
      // Individual: setup and post-processing per part
      totalLaborTime = (setupTime + postprocessTime) * partCount;
    }

    // Add monitoring time (10% of print time)
    const monitoringTime = printTime * 0.1;
    if (batchPrinting) {
      totalLaborTime += monitoringTime;
    } else {
      totalLaborTime += monitoringTime * partCount;
    }

    return totalLaborTime * laborRate;
  }

  function calculateEquipmentCosts(printTime, setupTime, postprocessTime, machineCost, partCount, batchPrinting) {
    let totalMachineTime;
    
    if (batchPrinting && partCount > 1) {
      totalMachineTime = printTime + setupTime;
    } else {
      totalMachineTime = (printTime + setupTime) * partCount;
    }

    return totalMachineTime * machineCost;
  }

  function calculateFinalCost(baseCost, overheadRate, failureRate, profitMargin, premiumService, rushMultiplier) {
    // Apply overhead
    let costWithOverhead = baseCost * (1 + overheadRate);

    // Apply failure rate (cost of failed prints)
    let costWithFailures = costWithOverhead * (1 + failureRate);

    // Apply premium service markup
    if (premiumService) {
      costWithFailures *= 1.25; // 25% premium
    }

    // Apply rush order multiplier
    costWithFailures *= rushMultiplier;

    // Apply profit margin
    const finalCost = costWithFailures * (1 + profitMargin);

    return {
      costWithOverhead: costWithOverhead,
      costWithFailures: costWithFailures,
      finalCost: finalCost
    };
  }

  function calculateCostAnalysis(materialCost, energyCost, timeCosts, equipmentCost, baseCost, finalCost, partCount) {
    const totalCost = finalCost.finalCost;
    const costPerPart = totalCost / partCount;

    return {
      totalCost: totalCost,
      costPerPart: costPerPart,
      materialPercentage: (materialCost / baseCost) * 100,
      energyPercentage: (energyCost / baseCost) * 100,
      laborPercentage: (timeCosts / baseCost) * 100,
      equipmentPercentage: (equipmentCost / baseCost) * 100,
      markupPercentage: ((totalCost - baseCost) / baseCost) * 100
    };
  }

  function displayResults(data) {
    const { costAnalysis, finalCost } = data;

    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>💰 Total Cost</h6>
          <div class="big-number">$${finalCost.finalCost.toFixed(2)}</div>
          <p class="insight-detail">${data.partCount} part(s)</p>
        </div>
        <div class="insight-card success">
          <h6>📦 Cost per Part</h6>
          <div class="big-number">$${costAnalysis.costPerPart.toFixed(2)}</div>
          <p class="insight-detail">Individual part cost</p>
        </div>
        <div class="insight-card warning">
          <h6>🧵 Material Cost</h6>
          <div class="big-number">$${data.materialCostTotal.toFixed(2)}</div>
          <p class="insight-detail">${costAnalysis.materialPercentage.toFixed(1)}% of base cost</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Cost Breakdown</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            
            <div>
              <h4>🧵 Material Costs</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Usage:</strong> ${data.materialUsage.finalUsage.toFixed(3)} ${data.materialUsage.unit}</li>
                <li><strong>Part Volume:</strong> ${data.materialUsage.partVolume.toFixed(1)} cm³</li>
                <li><strong>With Supports:</strong> ${data.materialUsage.totalVolume.toFixed(1)} cm³</li>
                <li><strong>Total Cost:</strong> $${data.materialCostTotal.toFixed(2)}</li>
              </ul>
            </div>

            <div>
              <h4>⚡ Energy & Time</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Print Time:</strong> ${data.printTime} hours</li>
                <li><strong>Energy Cost:</strong> $${data.energyCost.toFixed(2)}</li>
                <li><strong>Labor Cost:</strong> $${data.timeCosts.toFixed(2)}</li>
                <li><strong>Equipment:</strong> $${data.equipmentCost.toFixed(2)}</li>
              </ul>
            </div>

            <div>
              <h4>💼 Business Costs</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Base Cost:</strong> $${data.baseCost.toFixed(2)}</li>
                <li><strong>With Overhead:</strong> $${finalCost.costWithOverhead.toFixed(2)}</li>
                <li><strong>With Risk:</strong> $${finalCost.costWithFailures.toFixed(2)}</li>
                <li><strong>Final Price:</strong> $${finalCost.finalCost.toFixed(2)}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📈 Cost Distribution</h3>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          ${generateCostDistributionChart(data)}
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>🎯 Project Analysis</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">📋 Project Details</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Technology:</strong> ${getTechnologyName(data.technology)}</li>
              <li><strong>Material:</strong> ${getMaterialName(data.materialType)}</li>
              <li><strong>Printer Class:</strong> ${getPrinterClassName(data.printerType)}</li>
              <li><strong>Parts:</strong> ${data.partCount}</li>
            </ul>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">⏱️ Time Analysis</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Print Time:</strong> ${data.printTime} hours</li>
              <li><strong>Labor Rate:</strong> $${data.laborRate}/hour</li>
              <li><strong>Rush Factor:</strong> ${data.rushMultiplier}x</li>
              <li><strong>Time per Part:</strong> ${(data.printTime / data.partCount).toFixed(1)} hours</li>
            </ul>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">💡 Efficiency Metrics</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Cost per cm³:</strong> $${(costAnalysis.costPerPart / data.materialUsage.partVolume).toFixed(3)}</li>
              <li><strong>Cost per Hour:</strong> $${(costAnalysis.totalCost / data.printTime).toFixed(2)}</li>
              <li><strong>Material Efficiency:</strong> ${(100 - costAnalysis.markupPercentage).toFixed(0)}%</li>
              <li><strong>Markup:</strong> ${costAnalysis.markupPercentage.toFixed(1)}%</li>
            </ul>
          </div>
        </div>
      </div>

      ${getOptimizationSuggestions(data)}
      ${getCostComparisonTable(data)}

      <div style="margin-top: 1.5rem; padding: 1rem; background: #d1ecf1; border-radius: 8px; border-left: 4px solid #17a2b8;">
        <strong>💡 Pro Tip:</strong> Material costs typically represent 20-40% of total printing costs for professional services. 
        Labor, equipment depreciation, and overhead often exceed material costs. For competitive pricing, focus on optimizing 
        print time and batch processing multiple parts together.
      </div>
    `;

    result.innerHTML = html;
  }

  function generateCostDistributionChart(data) {
    const costs = [
      { label: 'Material', value: data.materialCostTotal, color: '#28a745' },
      { label: 'Energy', value: data.energyCost, color: '#ffc107' },
      { label: 'Labor', value: data.timeCosts, color: '#17a2b8' },
      { label: 'Equipment', value: data.equipmentCost, color: '#6c757d' },
      { label: 'Overhead & Profit', value: data.finalCost.finalCost - data.baseCost, color: '#dc3545' }
    ];

    const maxValue = Math.max(...costs.map(c => c.value));
    
    let html = '<div style="display: grid; gap: 1rem;">';
    
    costs.forEach(cost => {
      const percentage = (cost.value / data.finalCost.finalCost * 100).toFixed(1);
      const barWidth = (cost.value / maxValue * 100).toFixed(1);
      
      html += `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span><strong>${cost.label}:</strong> $${cost.value.toFixed(2)}</span>
            <span>${percentage}%</span>
          </div>
          <div style="background: var(--card-bg); height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: ${cost.color}; height: 100%; width: ${barWidth}%; border-radius: 4px;"></div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }

  function getTechnologyName(tech) {
    const names = {
      'fdm': 'FDM/FFF (Filament)',
      'sla': 'SLA (Resin)',
      'dlp': 'DLP (Resin)',
      'sls': 'SLS (Powder)',
      'mjf': 'MJF (Powder)'
    };
    return names[tech] || tech;
  }

  function getMaterialName(material) {
    const names = {
      'pla': 'PLA Filament',
      'abs': 'ABS Filament',
      'petg': 'PETG Filament',
      'tpu': 'TPU Flexible',
      'nylon': 'Nylon (PA)',
      'pc': 'Polycarbonate',
      'wood': 'Wood-filled PLA',
      'metal': 'Metal-filled',
      'carbon': 'Carbon Fiber',
      'standard-resin': 'Standard Resin',
      'tough-resin': 'Tough Resin',
      'flexible-resin': 'Flexible Resin',
      'dental-resin': 'Dental Resin',
      'castable-resin': 'Castable Resin'
    };
    return names[material] || material;
  }

  function getPrinterClassName(type) {
    const names = {
      'hobby': 'Hobby/Desktop',
      'prosumer': 'Prosumer',
      'professional': 'Professional',
      'industrial': 'Industrial'
    };
    return names[type] || type;
  }

  function getOptimizationSuggestions(data) {
    const suggestions = [];
    
    if (data.costAnalysis.materialPercentage < 30) {
      suggestions.push('💰 <strong>High Non-Material Costs:</strong> Consider batch printing or faster print settings to reduce time costs');
    }
    
    if (data.costAnalysis.laborPercentage > 40) {
      suggestions.push('⏱️ <strong>High Labor Costs:</strong> Automate post-processing or reduce setup complexity');
    }
    
    if (data.materialUsage.finalUsage > 0.5) {
      suggestions.push('🧵 <strong>High Material Usage:</strong> Consider hollow designs or lower infill for non-structural parts');
    }
    
    if (data.printTime > 10) {
      suggestions.push('🚀 <strong>Long Print Time:</strong> Optimize layer height, infill, or consider splitting into multiple parts');
    }
    
    if (data.partCount > 1) {
      suggestions.push('📦 <strong>Multiple Parts:</strong> Batch printing can significantly reduce per-part costs');
    }

    suggestions.push('🔄 <strong>Quality vs Speed:</strong> Balance print quality with time costs for your application');
    suggestions.push('📊 <strong>Market Research:</strong> Compare your pricing with local and online 3D printing services');

    return `
      <div style="margin-top: 2rem;">
        <h3>💡 Cost Optimization Suggestions</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <ul style="margin: 0.5rem 0;">
            ${suggestions.map(suggestion => `<li style="margin: 0.5rem 0;">${suggestion}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  function getCostComparisonTable(data) {
    const alternatives = [
      { quantity: 1, name: 'Single Part' },
      { quantity: 5, name: 'Small Batch' },
      { quantity: 10, name: 'Medium Batch' },
      { quantity: 25, name: 'Large Batch' }
    ];

    const baseCostPerPart = data.baseCost / data.partCount;
    
    let html = `
      <div style="margin-top: 2rem;">
        <h3>📊 Quantity Cost Comparison</h3>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
    `;

    alternatives.forEach(alt => {
      // Batch printing reduces setup costs per part
      const setupReduction = alt.quantity > 1 ? 0.7 : 1.0; // 30% setup reduction for batches
      const adjustedCost = baseCostPerPart * setupReduction;
      const totalCost = adjustedCost * alt.quantity;
      
      html += `
        <div style="text-align: center; padding: 1rem; border-radius: 8px; ${alt.quantity === data.partCount ? 'background: var(--accent); color: white;' : 'background: var(--card-bg);'}">
          <div style="font-weight: bold; margin-bottom: 0.5rem;">${alt.name}</div>
          <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">$${adjustedCost.toFixed(2)}</div>
          <div style="font-size: 0.9rem;">per part</div>
          <div style="font-size: 0.8rem; margin-top: 0.5rem;">Total: $${totalCost.toFixed(2)}</div>
        </div>
      `;
    });
    
    html += '</div></div></div>';
    return html;
  }
});