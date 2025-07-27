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
      costUnit.selectedIndex = 0; // kg for filament
      document.getElementById('printer-power').value = 200;
      document.getElementById('setup-time').value = 30;
      document.getElementById('postprocess-time').value = 45;
    } else if (technology === 'sla' || technology === 'dlp') {
      costUnit.selectedIndex = 1; // L for resin
      document.getElementById('printer-power').value = 80;
      document.getElementById('setup-time').value = 20;
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
      result.innerHTML = '<div class="error">Будь ласка, заповніть всі обов\'язкові поля.</div>';
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
      unit: technology === 'fdm' ? 'кг' : 'л'
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
    const costWithOverhead = baseCost * (1 + overheadRate);
    
    // Apply failure rate
    const costWithFailure = costWithOverhead * (1 + failureRate);
    
    // Apply premium service multiplier
    let costWithPremium = costWithFailure;
    if (premiumService) {
      costWithPremium = costWithFailure * 1.15; // 15% premium
    }
    
    // Apply profit margin
    const costWithProfit = costWithPremium * (1 + profitMargin);
    
    // Apply rush multiplier
    return costWithProfit * rushMultiplier;
  }

  function calculateCostAnalysis(materialCost, energyCost, timeCosts, equipmentCost, baseCost, finalCost, partCount) {
    const materialPercentage = (materialCost / baseCost) * 100;
    const energyPercentage = (energyCost / baseCost) * 100;
    const laborPercentage = (timeCosts / baseCost) * 100;
    const equipmentPercentage = (equipmentCost / baseCost) * 100;
    
    const costPerPart = finalCost / partCount;
    const baseCostPerPart = baseCost / partCount;
    
    return {
      materialPercentage,
      energyPercentage,
      laborPercentage,
      equipmentPercentage,
      costPerPart,
      baseCostPerPart,
      markupPercentage: ((finalCost - baseCost) / baseCost) * 100
    };
  }

  function displayResults(data) {
    const html = `
      <div class="result-section">
        <h3>🖨️ Розрахунок вартості 3D друку</h3>
        
        <div class="overview-grid">
          <div class="overview-item highlight">
            <div class="label">Загальна вартість</div>
            <div class="value">$${data.finalCost.toFixed(2)}</div>
          </div>
          <div class="overview-item">
            <div class="label">Вартість за деталь</div>
            <div class="value">$${data.costAnalysis.costPerPart.toFixed(2)}</div>
          </div>
          <div class="overview-item">
            <div class="label">Технологія</div>
            <div class="value">${getTechnologyName(data.technology)}</div>
          </div>
          <div class="overview-item">
            <div class="label">Матеріал</div>
            <div class="value">${getMaterialName(data.materialType)}</div>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>🧵 Матеріали</h6>
            <div class="big-number">$${data.materialCostTotal.toFixed(2)}</div>
            <div>${data.costAnalysis.materialPercentage.toFixed(1)}% від базової вартості</div>
          </div>
          <div class="insight-card warning">
            <h6>⏱️ Праця</h6>
            <div class="big-number">$${data.timeCosts.toFixed(2)}</div>
            <div>${data.costAnalysis.laborPercentage.toFixed(1)}% від базової вартості</div>
          </div>
          <div class="insight-card success">
            <h6>⚡ Енергія</h6>
            <div class="big-number">$${data.energyCost.toFixed(2)}</div>
            <div>${data.costAnalysis.energyPercentage.toFixed(1)}% від базової вартості</div>
          </div>
          <div class="insight-card">
            <h6>🔧 Обладнання</h6>
            <div class="big-number">$${data.equipmentCost.toFixed(2)}</div>
            <div>${data.costAnalysis.equipmentPercentage.toFixed(1)}% від базової вартості</div>
          </div>
        </div>

        <h4>📊 Деталізація витрат</h4>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Матеріали (${data.materialUsage.finalUsage.toFixed(3)} ${data.materialUsage.unit}):</span>
            <strong>$${data.materialCostTotal.toFixed(2)}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Енергія:</span>
            <strong>$${data.energyCost.toFixed(2)}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Праця:</span>
            <strong>$${data.timeCosts.toFixed(2)}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Обладнання:</span>
            <strong>$${data.equipmentCost.toFixed(2)}</strong>
          </div>
          <hr style="margin: 1rem 0; border: none; border-top: 2px solid var(--border);">
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span><strong>Базова вартість:</strong></span>
            <strong>$${data.baseCost.toFixed(2)}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Накладні, невдачі, прибуток (+${data.costAnalysis.markupPercentage.toFixed(1)}%):</span>
            <strong>$${(data.finalCost - data.baseCost).toFixed(2)}</strong>
          </div>
          <hr style="margin: 1rem 0; border: none; border-top: 3px solid var(--accent);">
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; font-size: 1.2rem;">
            <span><strong>Кінцева вартість:</strong></span>
            <strong style="color: var(--accent);">$${data.finalCost.toFixed(2)}</strong>
          </div>
        </div>

        ${getOptimizationSuggestions(data)}
        ${getCostComparisonTable(data)}
      </div>
    `;

    result.innerHTML = html;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getTechnologyName(tech) {
    const names = {
      'fdm': 'FDM/FFF (Філамент)',
      'sla': 'SLA (Смола)',
      'dlp': 'DLP (Смола)',
      'sls': 'SLS (Порошок)',
      'mjf': 'MJF (Порошок)'
    };
    return names[tech] || tech;
  }

  function getMaterialName(material) {
    const names = {
      'pla': 'PLA Філамент',
      'abs': 'ABS Філамент',
      'petg': 'PETG Філамент',
      'tpu': 'TPU Гнучкий',
      'nylon': 'Нейлон (PA)',
      'pc': 'Полікарбонат',
      'wood': 'PLA з деревиною',
      'metal': 'З металом',
      'carbon': 'Карбоновий',
      'standard-resin': 'Стандартна смола',
      'tough-resin': 'Міцна смола',
      'flexible-resin': 'Гнучка смола',
      'dental-resin': 'Стоматологічна смола',
      'castable-resin': 'Лиярна смола'
    };
    return names[material] || material;
  }

  function getPrinterClassName(type) {
    const names = {
      'hobby': 'Хобі/Настільний',
      'prosumer': 'Професумер',
      'professional': 'Професійний',
      'industrial': 'Промисловий'
    };
    return names[type] || type;
  }

  function getOptimizationSuggestions(data) {
    const suggestions = [];
    
    if (data.costAnalysis.materialPercentage < 30) {
      suggestions.push('💰 <strong>Високі немат
еріальні витрати:</strong> Розгляньте пакетний друк або швидші налаштування друку для зменшення витрат часу');
    }
    
    if (data.costAnalysis.laborPercentage > 40) {
      suggestions.push('⏱️ <strong>Високі витрати на працю:</strong> Автоматизуйте постобробку або зменште складність налаштування');
    }
    
    if (data.materialUsage.finalUsage > 0.5) {
      suggestions.push('🧵 <strong>Високе використання матеріалу:</strong> Розгляньте порожні конструкції або менше заповнення для неструктурних деталей');
    }
    
    if (data.printTime > 10) {
      suggestions.push('🚀 <strong>Тривалий час друку:</strong> Оптимізуйте висоту шару, заповнення або розгляньте розділення на кілька частин');
    }
    
    if (data.partCount > 1) {
      suggestions.push('📦 <strong>Кілька деталей:</strong> Пакетний друк може значно зменшити вартість за деталь');
    }

    suggestions.push('🔄 <strong>Якість проти швидкості:</strong> Збалансуйте якість друку з витратами часу для вашого застосування');
    suggestions.push('📊 <strong>Дослідження ринку:</strong> Порівняйте ваше ціноутворення з місцевими та онлайн-сервісами 3D друку');

    return `
      <div style="margin-top: 2rem;">
        <h3>💡 Пропозиції оптимізації витрат</h3>
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
      { quantity: 1, name: 'Одна деталь' },
      { quantity: 5, name: 'Мала партія' },
      { quantity: 10, name: 'Середня партія' },
      { quantity: 25, name: 'Велика партія' }
    ];

    const baseCostPerPart = data.baseCost / data.partCount;
    
    let html = `
      <div style="margin-top: 2rem;">
        <h3>📊 Порівняння витрат за кількістю</h3>
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
          <div style="font-size: 0.9rem;">за деталь</div>
          <div style="font-size: 0.8rem; margin-top: 0.5rem;">Загалом: $${totalCost.toFixed(2)}</div>
        </div>
      `;
    });

    html += `
          </div>
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
            * Пакетний друк зменшує витрати на налаштування на деталь
          </p>
        </div>
      </div>
    `;

    return html;
  }
});