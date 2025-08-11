document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ai-prompt-form');
  const result = document.getElementById('prompt-result');
  const modelSelection = document.getElementById('model-selection');

  function formatUA(val) {
    return val.toLocaleString('uk-UA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  function formatCurrency(val) {
    return '$' + val.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  // Pricing data per 1K tokens (USD) - based on 2024 prices
  const modelPricing = {
    openai: {
      'gpt-3.5-turbo': { 
        name: 'GPT-3.5 Turbo', 
        input: 0.0015, 
        output: 0.002,
        context: '4K токенів'
      },
      'gpt-4': { 
        name: 'GPT-4', 
        input: 0.03, 
        output: 0.06,
        context: '8K токенів'
      },
      'gpt-4-turbo': { 
        name: 'GPT-4 Turbo', 
        input: 0.01, 
        output: 0.03,
        context: '128K токенів'
      },
      'gpt-4o': { 
        name: 'GPT-4o', 
        input: 0.005, 
        output: 0.015,
        context: '128K токенів'
      }
    },
    anthropic: {
      'claude-3-haiku': { 
        name: 'Claude 3 Haiku', 
        input: 0.00025, 
        output: 0.00125,
        context: '200K токенів'
      },
      'claude-3-sonnet': { 
        name: 'Claude 3 Sonnet', 
        input: 0.003, 
        output: 0.015,
        context: '200K токенів'
      },
      'claude-3-opus': { 
        name: 'Claude 3 Opus', 
        input: 0.015, 
        output: 0.075,
        context: '200K токенів'
      }
    },
    google: {
      'gemini-pro': { 
        name: 'Gemini Pro', 
        input: 0.00025, 
        output: 0.0005,
        context: '30K токенів'
      },
      'gemini-ultra': { 
        name: 'Gemini Ultra', 
        input: 0.002, 
        output: 0.006,
        context: '30K токенів'
      }
    },
    cohere: {
      'command': { 
        name: 'Command', 
        input: 0.0015, 
        output: 0.002,
        context: '4K токенів'
      },
      'command-light': { 
        name: 'Command Light', 
        input: 0.0003, 
        output: 0.0006,
        context: '4K токенів'
      }
    }
  };

  function updateModelOptions() {
    const provider = form.querySelector('input[name="provider"]:checked').value;
    const models = modelPricing[provider];
    
    modelSelection.innerHTML = `
      <fieldset style="border: none; padding: 0; margin: 1em 0;">
        <legend style="font-size:1em;font-weight:600;margin-bottom:0.5em;">Модель</legend>
        <div style="display: flex; flex-direction: column; gap: 0.5em;">
          ${Object.entries(models).map(([key, model], index) => `
            <label style="display:flex; align-items:center; gap:0.4em;">
              <input type="radio" name="model" value="${key}" ${index === 0 ? 'checked' : ''}>
              <span style="font-weight: 500;">${model.name}</span>
              <span style="color: #666; font-size: 0.9em;">(${model.context})</span>
            </label>
          `).join('')}
        </div>
      </fieldset>
    `;
  }

  function calculateCosts({
    provider,
    model,
    inputTokens,
    outputTokens,
    requestsPerDay,
    daysPerMonth
  }) {
    const modelData = modelPricing[provider][model];
    
    // Daily costs
    const dailyInputCost = (inputTokens * requestsPerDay * modelData.input) / 1000;
    const dailyOutputCost = (outputTokens * requestsPerDay * modelData.output) / 1000;
    const dailyTotalCost = dailyInputCost + dailyOutputCost;
    
    // Monthly costs
    const monthlyCost = dailyTotalCost * daysPerMonth;
    
    // Yearly costs
    const yearlyCost = monthlyCost * 12;
    
    // Total tokens per month
    const monthlyTokens = (inputTokens + outputTokens) * requestsPerDay * daysPerMonth;
    
    // Cost per conversation (assuming 10 back-and-forth messages)
    const costPerConversation = dailyTotalCost * 10 / requestsPerDay;
    
    return {
      dailyCost: dailyTotalCost,
      monthlyCost,
      yearlyCost,
      monthlyTokens,
      costPerConversation,
      inputCostPerDay: dailyInputCost,
      outputCostPerDay: dailyOutputCost,
      modelData
    };
  }

  function getUsageTypeRecommendations(usageType, costs) {
    const recommendations = {
      chatbot: [
        "💡 Розгляньте caching для популярних запитів",
        "🔄 Використовуйте streaming для кращого UX",
        "📝 Скоротіть системні промпти до мінімуму"
      ],
      content: [
        "📊 Використовуйте batch обробку для економії", 
        "✂️ Оптимізуйте промпти для коротших відповідей",
        "🎯 Розбийте великі завдання на менші частини"
      ],
      analysis: [
        "🗂️ Обробляйте документи частинами",
        "📋 Використовуйте structured output для точності",
        "🔍 Налаштуйте промпти для конкретного аналізу"
      ],
      coding: [
        "💻 Комбінуйте з локальними IDE для економії",
        "📚 Використовуйте code completion замість генерації",
        "🔧 Налаштуйте температуру для детермінованих результатів"
      ]
    };
    
    return recommendations[usageType] || [];
  }

  function getCostCategory(monthlyCost) {
    if (monthlyCost < 10) return { level: "💚 Низька", color: "#28a745" };
    if (monthlyCost < 100) return { level: "💛 Помірна", color: "#ffc107" };
    if (monthlyCost < 500) return { level: "🧡 Висока", color: "#fd7e14" };
    return { level: "🔴 Дуже висока", color: "#dc3545" };
  }

  // Initialize model options
  updateModelOptions();

  // Update model options when provider changes
  form.addEventListener('change', function(e) {
    if (e.target.name === 'provider') {
      updateModelOptions();
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const inputTokens = Number(document.getElementById('input-tokens').value);
      const outputTokens = Number(document.getElementById('output-tokens').value);
      const requestsPerDay = Number(document.getElementById('requests-per-day').value);
      const daysPerMonth = Number(document.getElementById('days-per-month').value);
      
      const provider = form.querySelector('input[name="provider"]:checked').value;
      const model = form.querySelector('input[name="model"]:checked').value;
      const usageType = form.querySelector('input[name="usage-type"]:checked').value;

      if (inputTokens < 1 || outputTokens < 1 || requestsPerDay < 1) {
        result.innerHTML = '<p style="color: red;">Будь ласка, введіть коректні значення для всіх полів.</p>';
        return;
      }

      const costs = calculateCosts({
        provider,
        model,
        inputTokens,
        outputTokens,
        requestsPerDay,
        daysPerMonth
      });

      const costCategory = getCostCategory(costs.monthlyCost);
      const recommendations = getUsageTypeRecommendations(usageType, costs);

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>💳 Місячна вартість</h6>
            <div class="big-number">${formatCurrency(costs.monthlyCost)}</div>
            <p style="color: ${costCategory.color}; font-weight: 600;">${costCategory.level}</p>
          </div>
          <div class="insight-card success">
            <h6>📅 Денна вартість</h6>
            <div class="result-value">${formatCurrency(costs.dailyCost)}</div>
            <p>${formatUA(requestsPerDay)} запитів</p>
          </div>
          <div class="insight-card warning">
            <h6>💬 Вартість розмови</h6>
            <div class="result-value">${formatCurrency(costs.costPerConversation)}</div>
            <p>~10 повідомлень</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #157aff; margin-bottom: 1rem;">📊 Деталізація витрат</h4>
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #157aff;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
              <span>📥 Input токени (${formatUA(inputTokens)} × ${formatUA(requestsPerDay * daysPerMonth)}):</span>
              <strong>${formatCurrency(costs.inputCostPerDay * daysPerMonth)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
              <span>📤 Output токени (${formatUA(outputTokens)} × ${formatUA(requestsPerDay * daysPerMonth)}):</span>
              <strong>${formatCurrency(costs.outputCostPerDay * daysPerMonth)}</strong>
            </div>
            <hr style="border: none; border-top: 2px solid #157aff; margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; font-size: 1.1em;">
              <span><strong>Загальна місячна вартість:</strong></span>
              <strong style="color: #157aff;">${formatCurrency(costs.monthlyCost)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-top: 0.5rem;">
              <span>Річна вартість:</span>
              <strong>${formatCurrency(costs.yearlyCost)}</strong>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #6c757d; margin-bottom: 1rem;">ℹ️ Інформація про модель</h4>
          <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px;">
            <div style="margin-bottom: 1rem;">
              <strong>🤖 ${costs.modelData.name}</strong><br>
              <small>Контекст: ${costs.modelData.context}</small>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>📥 Input:</strong><br>
                <small>${formatCurrency(costs.modelData.input)} за 1K токенів</small>
              </div>
              <div>
                <strong>📤 Output:</strong><br>
                <small>${formatCurrency(costs.modelData.output)} за 1K токенів</small>
              </div>
              <div>
                <strong>📊 Загальна кількість токенів:</strong><br>
                <small>${formatUA(costs.monthlyTokens / 1000)}K на місяць</small>
              </div>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="margin: 2rem 0;">
          <h4 style="color: #28a745; margin-bottom: 1rem;">💡 Рекомендації з оптимізації</h4>
          <div style="background: #f8fff9; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #28a745;">
            ${recommendations.map(rec => `<div style="margin-bottom: 0.5rem;">${rec}</div>`).join('')}
          </div>
        </div>
        ` : ''}

        <div style="margin: 2rem 0;">
          <h4 style="color: #17a2b8; margin-bottom: 1rem;">📈 Порівняння за обсягами</h4>
          <div style="background: #f8fdfe; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #17a2b8;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; text-align: center;">
              <div>
                <strong>100 запитів/день</strong><br>
                <span style="color: #28a745;">${formatCurrency(costs.monthlyCost * (100 / requestsPerDay))}</span>
              </div>
              <div>
                <strong>500 запитів/день</strong><br>
                <span style="color: #ffc107;">${formatCurrency(costs.monthlyCost * (500 / requestsPerDay))}</span>
              </div>
              <div>
                <strong>1000 запитів/день</strong><br>
                <span style="color: #fd7e14;">${formatCurrency(costs.monthlyCost * (1000 / requestsPerDay))}</span>
              </div>
              <div>
                <strong>5000 запитів/день</strong><br>
                <span style="color: #dc3545;">${formatCurrency(costs.monthlyCost * (5000 / requestsPerDay))}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #ffc107; margin-bottom: 1rem;">⚠️ Важливі зауваження</h4>
          <div style="background: #fffcf5; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #ffc107;">
            <ul style="margin: 0; padding-left: 1.5rem;">
              <li>Ціни можуть змінюватися та відрізнятися за регіонами</li>
              <li>Враховуйте rate limits та можливі затримки</li>
              <li>Для production використання налаштуйте billing alerts</li>
              <li>Тестуйте різні моделі для оптимального співвідношення ціна/якість</li>
              <li>Розгляньте enterprise плани для великих обсягів</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});