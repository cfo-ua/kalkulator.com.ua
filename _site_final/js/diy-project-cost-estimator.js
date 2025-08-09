document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("diy-cost-form");
  if (!form) return;

  // Project cost database with base costs per square meter (in UAH)
  const projectCosts = {
    flooring: {
      budget: { material: 800, labor: 400, tools: 2000 },
      "mid-range": { material: 1500, labor: 600, tools: 3000 },
      premium: { material: 2500, labor: 800, tools: 4000 },
      luxury: { material: 5000, labor: 1200, tools: 6000 },
      description: "Ламінат, паркет або вінілова дошка люкс"
    },
    painting: {
      budget: { material: 150, labor: 200, tools: 1000 },
      "mid-range": { material: 250, labor: 300, tools: 1500 },
      premium: { material: 400, labor: 400, tools: 2500 },
      luxury: { material: 700, labor: 600, tools: 3500 },
      description: "Фарбування внутрішніх стін, плінтусів та стелі"
    },
    kitchen: {
      budget: { material: 8000, labor: 5000, tools: 5000 },
      "mid-range": { material: 15000, labor: 7000, tools: 8000 },
      premium: { material: 25000, labor: 10000, tools: 12000 },
      luxury: { material: 45000, labor: 15000, tools: 18000 },
      description: "Оновлення шаф, стільниць, фартуха"
    },
    bathroom: {
      budget: { material: 5000, labor: 4000, tools: 4000 },
      "mid-range": { material: 10000, labor: 6000, tools: 6000 },
      premium: { material: 18000, labor: 8000, tools: 10000 },
      luxury: { material: 35000, labor: 12000, tools: 15000 },
      description: "Плитка, сантехніка, тумба, сантехнічні оновлення"
    },
    deck: {
      budget: { material: 2500, labor: 1500, tools: 5000 },
      "mid-range": { material: 4500, labor: 2500, tools: 8000 },
      premium: { material: 7500, labor: 3500, tools: 12000 },
      luxury: { material: 15000, labor: 5000, tools: 18000 },
      description: "Настил з обробленої деревини або композиту"
    },
    fence: {
      budget: { material: 1200, labor: 800, tools: 3000 },
      "mid-range": { material: 2000, labor: 1200, tools: 4000 },
      premium: { material: 3500, labor: 1800, tools: 6000 },
      luxury: { material: 6000, labor: 2500, tools: 10000 },
      description: "Дерев'яна або декоративна огорожа"
    },
    tile: {
      budget: { material: 600, labor: 800, tools: 2500 },
      "mid-range": { material: 1200, labor: 1200, tools: 4000 },
      premium: { material: 2500, labor: 1800, tools: 6000 },
      luxury: { material: 5000, labor: 2500, tools: 8000 },
      description: "Керамічна або порцелянова плитка для підлоги/стін"
    },
    drywall: {
      budget: { material: 300, labor: 400, tools: 2500 },
      "mid-range": { material: 400, labor: 500, tools: 3500 },
      premium: { material: 500, labor: 700, tools: 4500 },
      luxury: { material: 700, labor: 900, tools: 6000 },
      description: "Встановлення гіпсокартону, стрічка, оздоблення"
    },
    shelving: {
      budget: { material: 1500, labor: 1200, tools: 2000 },
      "mid-range": { material: 3000, labor: 2000, tools: 3000 },
      premium: { material: 5000, labor: 3000, tools: 5000 },
      luxury: { material: 9000, labor: 4500, tools: 8000 },
      description: "Вбудовані полиці та системи зберігання"
    },
    custom: {
      budget: { material: 1000, labor: 800, tools: 2500 },
      "mid-range": { material: 2000, labor: 1500, tools: 4000 },
      premium: { material: 4000, labor: 2500, tools: 7000 },
      luxury: { material: 8000, labor: 4000, tools: 12000 },
      description: "Спеціальний проект з варіативними вимогами"
    }
  };

  // Tool cost database (in UAH)
  const toolCosts = {
    basic: {
      own: 0,
      buy: 3000,
      rent: 0,
      description: "Молоток, викрутка, рулетка, рівень"
    },
    specialty: {
      simple: { buy: 4000, rent: 500 },
      moderate: { buy: 8000, rent: 800 },
      complex: { buy: 15000, rent: 1200 }
    },
    safety: {
      cost: 1500,
      description: "Захисні окуляри, рукавички, респіратори, захист слуху"
    }
  };

  // Additional cost factors
  const additionalCosts = {
    delivery: 0.05, // 5% від вартості матеріалів
    permits: 3000, // Фіксована плата
    disposal: 2000, // Фіксована плата
    rush: 0.15 // 15% премія
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
    const laborCostPerSqM = baseCosts[materialQuality].labor;

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
      toolCosts += toolCosts.safety || 1500;
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
      professionalCost = (adjustedMaterialCost + (laborCostPerSqM * projectArea * localPriceIndex * complexityMultiplier)) * 1.2; // 20% markup
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

    // Calculate cost per square meter
    const costPerSqM = totalDIYCost / projectArea;

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
      costPerSqM,
      recommendations,
      adjustedDuration,
      baseCosts
    });
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
      estimatedTime: `${formattedDuration} днів`,
      difficulty: getDifficultyLevel(projectType),
      keyMaterials: getKeyMaterials(projectType, quality),
      tips: getProjectTips(projectType)
    };
  }

  function getDifficultyLevel(projectType) {
    const difficulty = {
      painting: "Новачок",
      shelving: "Новачок", 
      flooring: "Середній",
      tile: "Середній",
      drywall: "Середній",
      fence: "Середній",
      bathroom: "Досвідчений",
      kitchen: "Досвідчений",
      deck: "Досвідчений",
      custom: "Варіативна"
    };
    return difficulty[projectType] || "Середній";
  }

  function getKeyMaterials(projectType, quality) {
    const materials = {
      flooring: ["Напільне покриття", "Підкладка", "Плінтуси", "Кріплення", "Перехідні смужки"],
      painting: ["Фарба", "Грунтовка", "Пензлі/валики", "Захисна плівка", "Малярна стрічка"],
      kitchen: ["Шафи", "Стільниці", "Фартух", "Сантехніка", "Електрика"],
      bathroom: ["Плитка", "Сантехніка", "Тумба", "Дзеркало", "Аксесуари"],
      deck: ["Настилові дошки", "Каркас", "Кріплення", "Гідроізоляція", "Балясини"],
      fence: ["Дошки/панелі", "Стовпи", "Кріплення", "Ворота", "Фундамент"],
      tile: ["Плитка", "Клей", "Затирка", "Хрестики", "Підрізка"],
      drywall: ["Гіпсокартон", "Профілі", "Шурупи", "Стрічка", "Шпаклівка"],
      shelving: ["Полиці", "Кронштейни", "Кріплення", "Фурнітура", "Оздоблення"],
      custom: ["Варіативні матеріали", "Спеціальні інструменти", "Кріплення", "Оздоблення"]
    };
    return materials[projectType] || ["Основні матеріали", "Кріплення", "Інструменти"];
  }

  function getProjectTips(projectType) {
    const tips = {
      flooring: ["Акліматизуйте матеріали", "Перевірте рівність підлоги", "Почніть з найдовшої стіни"],
      painting: ["Використовуйте якісну грунтовку", "Два тонкі шари краще одного товстого", "Знімайте стрічку поки фарба вологи"],
      kitchen: ["Виміряйте тричі, ріжте один раз", "Перекрийте воду та електрику", "Встановіть шафи перед стільницею"],
      bathroom: ["Використовуйте гідроізоляцію", "Перевірте вентиляцію", "Почніть з плитки знизу вгору"],
      deck: ["Використовуйте оцинковані кріплення", "Передбачте дренаж", "Обробіть деревину антисептиком"],
      fence: ["Розміткуйте межі точно", "Встановіть стовпи на бетон", "Перевірте комунальні мережі"],
      tile: ["Зробіть сухе викладання", "Використовуйте хрестики для рівності", "Очищайте затирку одразу"],
      drywall: ["Перевірте каркас", "Використовуйте спеціальні шурупи", "Шпаклюйте в кілька проходів"],
      shelving: ["Знайдіть стійки в стіні", "Використовуйте рівень", "Попередньо засвердліть отвори"],
      custom: ["Плануйте детально", "Мірьте точно", "Використовуйте якісні матеріали"]
    };
    return tips[projectType] || ["Плануйте уважно", "Використовуйте якісні матеріали", "Не поспішайте"];
  }

  function generateRecommendations(costBreakdown, skillLevel, complexity, toolStrategy) {
    const recommendations = [];

    if (costBreakdown.savingsPercent > 50) {
      recommendations.push("💰 Відмінна економія! DIY економить понад 50% від професійної роботи.");
    } else if (costBreakdown.savingsPercent > 25) {
      recommendations.push("💵 Хороша економія! DIY економить чверть від професійної роботи.");
    }

    if (skillLevel === "beginner" && complexity === "complex") {
      recommendations.push("⚠️ Складний проект для новачка. Розгляньте курси або допомогу досвідченого друга.");
    }

    if (toolStrategy === "buy" && costBreakdown.tools > costBreakdown.materials * 0.5) {
      recommendations.push("🔨 Витрати на інструменти високі. Розгляньте оренду спеціальних інструментів.");
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ Проект виглядає добре планованим та здійсненним!");
    }

    return recommendations;
  }

  function displayResults(data) {
    const {
      projectType,
      projectArea,
      materialQuality,
      projectComplexity,
      skillLevel,
      costBreakdown,
      projectDetails,
      costPerSqM,
      recommendations,
      adjustedDuration,
      baseCosts
    } = data;

    const projectTypeNames = {
      flooring: "Укладання підлоги",
      painting: "Внутрішнє фарбування", 
      kitchen: "Оновлення кухні",
      bathroom: "Ремонт ванної кімнати",
      deck: "Будівництво настилу",
      fence: "Встановлення огорожі",
      tile: "Укладання плитки",
      drywall: "Встановлення гіпсокартону",
      shelving: "Вбудовані полиці",
      custom: "Спеціальний проект"
    };

    const qualityNames = {
      budget: "Бюджетна",
      "mid-range": "Середня",
      premium: "Преміум",
      luxury: "Люкс"
    };

    const complexityNames = {
      simple: "Проста",
      moderate: "Помірна",
      complex: "Складна"
    };

    const formatCurrency = (amount) => {
      return Math.round(amount).toLocaleString('uk-UA') + ' грн';
    };

    const resultDiv = document.getElementById("diy-cost-result");
    if (!resultDiv) return;

    resultDiv.innerHTML = `
      <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #2196f3;">
        <h3 style="color: #1565c0; margin-top: 0; text-align: center;">🏠 Оцінка вартості DIY проекту</h3>
        
        <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0;">
          <h4 style="margin: 0 0 10px 0; color: #1976d2;">Деталі проекту</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <p><strong>Тип:</strong> ${projectTypeNames[projectType]}</p>
            <p><strong>Площа:</strong> ${projectArea} м²</p>
            <p><strong>Якість:</strong> ${qualityNames[materialQuality]}</p>
            <p><strong>Складність:</strong> ${complexityNames[projectComplexity]}</p>
            <p><strong>Рівень навичок:</strong> ${skillLevel === 'beginner' ? 'Новачок' : skillLevel === 'intermediate' ? 'Середній' : 'Досвідчений'}</p>
            <p><strong>Оцінений час:</strong> ${projectDetails.estimatedTime}</p>
          </div>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>💰 Матеріали</h6>
            <div class="big-number">${formatCurrency(costBreakdown.materials)}</div>
            <p>${Math.round(costBreakdown.materials / projectArea)} грн/м²</p>
          </div>
          
          <div class="insight-card warning">
            <h6>🔨 Інструменти</h6>
            <div class="big-number">${formatCurrency(costBreakdown.tools)}</div>
            <p>Спеціальні та базові</p>
          </div>
          
          <div class="insight-card" style="border-color: #ff5722; background: linear-gradient(135deg, #fff3e0 0%, #ffe0d1 100%);">
            <h6>📦 Додаткові витрати</h6>
            <div class="big-number" style="color: #ff5722;">${formatCurrency(costBreakdown.additional)}</div>
            <p>Доставка, дозволи, утилізація</p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #4caf50;">
          <h4 style="color: #2e7d32; margin-top: 0; text-align: center;">💎 Загальна вартість проекту</h4>
          
          <div style="text-align: center; margin: 20px 0;">
            <div style="font-size: 2.5rem; font-weight: bold; color: #2e7d32; margin-bottom: 10px;">
              ${formatCurrency(costBreakdown.total)}
            </div>
            <p style="margin: 0; color: #666; font-size: 1.1rem;">
              ${formatCurrency(costPerSqM)} за м²
            </p>
          </div>

          ${costBreakdown.professional > 0 ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
              <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                <h6 style="color: #d32f2f; margin: 0 0 10px 0;">DIY вартість</h6>
                <div style="font-size: 1.5rem; font-weight: bold; color: #2e7d32;">${formatCurrency(costBreakdown.total)}</div>
              </div>
              
              <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                <h6 style="color: #d32f2f; margin: 0 0 10px 0;">Професійна робота</h6>
                <div style="font-size: 1.5rem; font-weight: bold; color: #d32f2f;">${formatCurrency(costBreakdown.professional)}</div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px;">
              <p style="margin: 0; font-weight: bold; color: #2e7d32; font-size: 1.1rem;">
                💰 Ваша економія: ${formatCurrency(costBreakdown.savings)} (${Math.round(costBreakdown.savingsPercent)}%)
              </p>
            </div>
          ` : ''}
        </div>

        <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ff9800;">
          <h4 style="color: #ef6c00; margin-top: 0; text-align: center;">📋 Деталі проекту</h4>
          
          <div style="margin-bottom: 15px;">
            <h5 style="color: #e65100; margin-bottom: 10px;">Основні матеріали:</h5>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${projectDetails.keyMaterials.map(material => 
                `<span style="background: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem;">${material}</span>`
              ).join('')}
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <h5 style="color: #e65100; margin-bottom: 10px;">Поради для проекту:</h5>
            <ul style="margin: 0; padding-left: 20px;">
              ${projectDetails.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h5 style="color: #e65100; margin-bottom: 10px;">Рекомендації:</h5>
            <ul style="margin: 0; padding-left: 20px;">
              ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div style="background: #fff; padding: 20px; border-radius: 10px; border: 2px solid #2196f3;">
          <h4 style="color: #1976d2; margin-top: 0; text-align: center;">🛠️ Планування та поради</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div>
              <h6 style="color: #1976d2;">Планування закупівель</h6>
              <ul style="margin: 0; padding-left: 15px; font-size: 0.9rem;">
                <li>Купуйте матеріали з 10-15% запасом</li>
                <li>Перевіряйте сезонні знижки</li>
                <li>Порівнюйте ціни в різних магазинах</li>
              </ul>
            </div>
            
            <div>
              <h6 style="color: #1976d2;">Безпека проекту</h6>
              <ul style="margin: 0; padding-left: 15px; font-size: 0.9rem;">
                <li>Використовуйте засоби захисту</li>
                <li>Перевірте електрику та воду</li>
                <li>Майте аптечку під рукою</li>
              </ul>
            </div>
            
            <div>
              <h6 style="color: #1976d2;">Економія коштів</h6>
              <ul style="margin: 0; padding-left: 15px; font-size: 0.9rem;">
                <li>Орендуйте дорогі інструменти</li>
                <li>Купуйте матеріали оптом</li>
                <li>Використовуйте залишки матеріалів</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            🏗️ <strong>Пам'ятайте:</strong> Точне планування та якісні матеріали — запорука успішного DIY проекту!
          </p>
        </div>
      </div>
    `;
  }
});