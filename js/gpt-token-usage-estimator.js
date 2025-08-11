document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('gpt-project-form');
  const result = document.getElementById('project-result');

  // Detect language from URL
  const isEnglish = window.location.pathname.includes('/en/');

  function formatCurrency(val) {
    return '$' + val.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  function formatNumber(val) {
    return val.toLocaleString(isEnglish ? 'en-US' : 'uk-UA');
  }

  // AI Model pricing per 1K tokens (USD) - 2024 rates
  const modelPricing = {
    'gpt-4o': { 
      name: 'GPT-4o', 
      input: 0.005, 
      output: 0.015,
      maxContext: 128000
    },
    'gpt-4-turbo': { 
      name: 'GPT-4 Turbo', 
      input: 0.01, 
      output: 0.03,
      maxContext: 128000
    },
    'gpt-3.5-turbo': { 
      name: 'GPT-3.5 Turbo', 
      input: 0.0015, 
      output: 0.002,
      maxContext: 16000
    },
    'claude-3-sonnet': { 
      name: 'Claude 3 Sonnet', 
      input: 0.003, 
      output: 0.015,
      maxContext: 200000
    },
    'claude-3-haiku': { 
      name: 'Claude 3 Haiku', 
      input: 0.00025, 
      output: 0.00125,
      maxContext: 200000
    }
  };

  // Language-specific token multipliers (tokens per line of code)
  const languageMultipliers = {
    javascript: 3.5,
    python: 4.0,
    java: 5.0,
    csharp: 4.8,
    cpp: 4.2,
    go: 3.8,
    rust: 4.5,
    php: 3.9,
    ruby: 4.1,
    other: 4.0
  };

  // Complexity multipliers
  const complexityMultipliers = {
    simple: 1.0,
    medium: 1.3,
    complex: 1.8,
    'very-complex': 2.5
  };

  // Task type factors (input:output ratio and complexity)
  const taskFactors = {
    'code-review': { 
      inputRatio: 1.0, 
      outputRatio: 0.3, 
      complexityBonus: 1.2,
      name: isEnglish ? 'Code Review' : 'Code Review'
    },
    'documentation': { 
      inputRatio: 1.0, 
      outputRatio: 0.8, 
      complexityBonus: 1.0,
      name: isEnglish ? 'Documentation' : 'Документація'
    },
    'refactoring': { 
      inputRatio: 1.0, 
      outputRatio: 1.2, 
      complexityBonus: 1.5,
      name: isEnglish ? 'Refactoring' : 'Рефакторинг'
    },
    'testing': { 
      inputRatio: 1.0, 
      outputRatio: 0.6, 
      complexityBonus: 1.1,
      name: isEnglish ? 'Testing' : 'Тестування'
    },
    'bug-hunting': { 
      inputRatio: 1.0, 
      outputRatio: 0.4, 
      complexityBonus: 1.4,
      name: isEnglish ? 'Bug Hunting' : 'Пошук багів'
    },
    'optimization': { 
      inputRatio: 1.0, 
      outputRatio: 0.5, 
      complexityBonus: 1.6,
      name: isEnglish ? 'Optimization' : 'Оптимізація'
    }
  };

  function calculateProjectTokens({
    projectSize,
    avgFileSize,
    codeComplexity,
    languageType,
    taskType,
    contextPercentage,
    iterations
  }) {
    // Base tokens per file
    const tokensPerLine = languageMultipliers[languageType];
    const baseTokensPerFile = avgFileSize * tokensPerLine;
    
    // Apply complexity multiplier
    const complexityFactor = complexityMultipliers[codeComplexity];
    const adjustedTokensPerFile = baseTokensPerFile * complexityFactor;
    
    // Calculate total input tokens (code to analyze)
    const totalCodeTokens = projectSize * adjustedTokensPerFile;
    
    // Add context tokens
    const contextTokens = totalCodeTokens * (contextPercentage / 100);
    const totalInputTokens = totalCodeTokens + contextTokens;
    
    // Apply task-specific factors
    const taskFactor = taskFactors[taskType];
    const finalInputTokens = totalInputTokens * taskFactor.inputRatio * taskFactor.complexityBonus;
    const outputTokens = finalInputTokens * taskFactor.outputRatio;
    
    // Multiply by iterations
    const totalInputTokensWithIterations = finalInputTokens * iterations;
    const totalOutputTokensWithIterations = outputTokens * iterations;
    
    return {
      inputTokens: totalInputTokensWithIterations,
      outputTokens: totalOutputTokensWithIterations,
      baseTokensPerFile: Math.round(adjustedTokensPerFile),
      taskDetails: taskFactor
    };
  }

  function calculateCosts(tokens, model) {
    const modelData = modelPricing[model];
    
    const inputCost = (tokens.inputTokens * modelData.input) / 1000;
    const outputCost = (tokens.outputTokens * modelData.output) / 1000;
    const totalCost = inputCost + outputCost;
    
    return {
      inputCost,
      outputCost,
      totalCost,
      modelData
    };
  }

  function getOptimizationTips(tokens, costs, taskType, model) {
    const tips = [];
    
    // Language-specific tips
    if (isEnglish) {
      if (costs.totalCost > 100) {
        tips.push("💡 Consider using GPT-3.5 for simple analysis tasks");
        tips.push("📦 Process files in batches to reduce context overhead");
      }
      if (tokens.inputTokens > 50000) {
        tips.push("🎯 Focus on critical files first, then expand");
        tips.push("🗂️ Exclude test files, build artifacts, and dependencies");
      }
      if (taskType === 'documentation') {
        tips.push("📝 Generate docs incrementally rather than all at once");
      }
      if (model === 'gpt-4o' && costs.totalCost > 200) {
        tips.push("⚡ Use GPT-4 Turbo for similar quality at lower cost");
      }
      tips.push("💾 Cache results to avoid re-processing unchanged files");
    } else {
      if (costs.totalCost > 100) {
        tips.push("💡 Розгляньте GPT-3.5 для простих завдань аналізу");
        tips.push("📦 Обробляйте файли батчами для зменшення overhead");
      }
      if (tokens.inputTokens > 50000) {
        tips.push("🎯 Спочатку критичні файли, потім розширюйте");
        tips.push("🗂️ Виключіть тестові файли, build artifacts та залежності");
      }
      if (taskType === 'documentation') {
        tips.push("📝 Генеруйте документацію поступово, а не всю відразу");
      }
      if (model === 'gpt-4o' && costs.totalCost > 200) {
        tips.push("⚡ Використовуйте GPT-4 Turbo для схожої якості за меншу ціну");
      }
      tips.push("💾 Кешуйте результати, щоб уникнути повторної обробки");
    }
    
    return tips;
  }

  function getCostCategory(totalCost) {
    if (totalCost < 10) return { 
      level: isEnglish ? "💚 Low" : "💚 Низька", 
      color: "#28a745" 
    };
    if (totalCost < 50) return { 
      level: isEnglish ? "💛 Moderate" : "💛 Помірна", 
      color: "#ffc107" 
    };
    if (totalCost < 200) return { 
      level: isEnglish ? "🧡 High" : "🧡 Висока", 
      color: "#fd7e14" 
    };
    return { 
      level: isEnglish ? "🔴 Very High" : "🔴 Дуже висока", 
      color: "#dc3545" 
    };
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const projectSize = Number(document.getElementById('project-size').value);
      const avgFileSize = Number(document.getElementById('avg-file-size').value);
      const codeComplexity = document.getElementById('code-complexity').value;
      const languageType = document.getElementById('language-type').value;
      const taskType = document.querySelector('input[name="task-type"]:checked').value;
      const aiModel = document.querySelector('input[name="ai-model"]:checked').value;
      const contextPercentage = Number(document.getElementById('context-percentage').value);
      const iterations = Number(document.getElementById('iterations').value);

      const tokens = calculateProjectTokens({
        projectSize,
        avgFileSize,
        codeComplexity,
        languageType,
        taskType,
        contextPercentage,
        iterations
      });

      const costs = calculateCosts(tokens, aiModel);
      const costCategory = getCostCategory(costs.totalCost);
      const optimizationTips = getOptimizationTips(tokens, costs, taskType, aiModel);

      // Check for context limits
      const modelData = modelPricing[aiModel];
      const contextWarning = tokens.inputTokens > modelData.maxContext;

      const resultHTML = `
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>📊 ${isEnglish ? 'Token Estimation' : 'Оцінка токенів'}</h6>
            <div class="big-number">${formatNumber(Math.round(tokens.inputTokens + tokens.outputTokens))}</div>
            <div>${isEnglish ? 'Total tokens' : 'Загалом токенів'}</div>
          </div>
          
          <div class="insight-card success">
            <h6>💰 ${isEnglish ? 'Total Cost' : 'Загальна вартість'}</h6>
            <div class="big-number">${formatCurrency(costs.totalCost)}</div>
            <div style="color: ${costCategory.color}; font-weight: 600;">${costCategory.level}</div>
          </div>
          
          <div class="insight-card">
            <h6>📄 ${isEnglish ? 'Per File Average' : 'В середньому на файл'}</h6>
            <div class="result-value">${formatNumber(tokens.baseTokensPerFile)} ${isEnglish ? 'tokens' : 'токенів'}</div>
            <div>${formatCurrency((costs.totalCost / projectSize))}</div>
          </div>
          
          <div class="insight-card">
            <h6>🎯 ${isEnglish ? 'Task Type' : 'Тип завдання'}</h6>
            <div class="result-value">${tokens.taskDetails.name}</div>
            <div>${costs.modelData.name}</div>
          </div>
        </div>

        ${contextWarning ? `
          <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
            <h6 style="color: #856404; margin: 0 0 0.5rem 0;">
              ⚠️ ${isEnglish ? 'Context Limit Warning' : 'Попередження про ліміт контексту'}
            </h6>
            <p style="margin: 0; color: #856404;">
              ${isEnglish 
                ? `Input tokens (${formatNumber(Math.round(tokens.inputTokens))}) exceed model context limit (${formatNumber(modelData.maxContext)}). Consider processing in smaller batches.`
                : `Вхідні токени (${formatNumber(Math.round(tokens.inputTokens))}) перевищують ліміт контексту моделі (${formatNumber(modelData.maxContext)}). Розгляньте обробку меншими батчами.`
              }
            </p>
          </div>
        ` : ''}

        <div style="background: white; border: 1px solid #e5e5e5; border-radius: 12px; padding: 1.5rem; margin: 1rem 0;">
          <h6 style="margin: 0 0 1rem 0; color: #333;">
            💡 ${isEnglish ? 'Cost Breakdown' : 'Деталізація витрат'}
          </h6>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <strong>${isEnglish ? 'Input Cost:' : 'Вхідні токени:'}</strong><br>
              <span style="color: #666;">${formatNumber(Math.round(tokens.inputTokens))} ${isEnglish ? 'tokens' : 'токенів'}</span><br>
              <span style="color: #157aff; font-weight: 600;">${formatCurrency(costs.inputCost)}</span>
            </div>
            <div>
              <strong>${isEnglish ? 'Output Cost:' : 'Вихідні токени:'}</strong><br>
              <span style="color: #666;">${formatNumber(Math.round(tokens.outputTokens))} ${isEnglish ? 'tokens' : 'токенів'}</span><br>
              <span style="color: #157aff; font-weight: 600;">${formatCurrency(costs.outputCost)}</span>
            </div>
          </div>
          <hr style="margin: 1rem 0; border: none; border-top: 1px solid #eee;">
          <div style="text-align: center;">
            <strong style="font-size: 1.1em; color: #333;">
              ${isEnglish ? 'Total Project Cost:' : 'Загальна вартість проекту:'} 
              <span style="color: #157aff;">${formatCurrency(costs.totalCost)}</span>
            </strong>
          </div>
        </div>

        <div style="background: #f8fdff; border: 1px solid #157aff; border-radius: 12px; padding: 1.5rem; margin: 1rem 0;">
          <h6 style="margin: 0 0 1rem 0; color: #157aff;">
            🚀 ${isEnglish ? 'Optimization Tips' : 'Поради з оптимізації'}
          </h6>
          <ul style="margin: 0; padding-left: 1.2rem;">
            ${optimizationTips.map(tip => `<li style="margin: 0.5rem 0;">${tip}</li>`).join('')}
          </ul>
        </div>

        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 12px; padding: 1.5rem; margin: 1rem 0;">
          <h6 style="margin: 0 0 1rem 0; color: #0ea5e9;">
            📈 ${isEnglish ? 'Project Scaling' : 'Масштабування проекту'}
          </h6>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
            <div style="text-align: center; padding: 0.5rem;">
              <div style="font-weight: 600; color: #0ea5e9;">×0.5</div>
              <div style="font-size: 0.9rem; color: #666;">${formatCurrency(costs.totalCost * 0.5)}</div>
            </div>
            <div style="text-align: center; padding: 0.5rem;">
              <div style="font-weight: 600; color: #0ea5e9;">×2</div>
              <div style="font-size: 0.9rem; color: #666;">${formatCurrency(costs.totalCost * 2)}</div>
            </div>
            <div style="text-align: center; padding: 0.5rem;">
              <div style="font-weight: 600; color: #0ea5e9;">×5</div>
              <div style="font-size: 0.9rem; color: #666;">${formatCurrency(costs.totalCost * 5)}</div>
            </div>
            <div style="text-align: center; padding: 0.5rem;">
              <div style="font-weight: 600; color: #0ea5e9;">×10</div>
              <div style="font-size: 0.9rem; color: #666;">${formatCurrency(costs.totalCost * 10)}</div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
            ${isEnglish ? 'Cost for different project sizes' : 'Вартість для різних розмірів проекту'}
          </div>
        </div>
      `;

      result.innerHTML = resultHTML;
      result.scrollIntoView({ behavior: 'smooth' });
    });
  }
});