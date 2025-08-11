document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ai-prompt-form');
  const result = document.getElementById('prompt-result');
  const modelSelection = document.getElementById('model-selection');

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
        context: '4K tokens'
      },
      'gpt-4': { 
        name: 'GPT-4', 
        input: 0.03, 
        output: 0.06,
        context: '8K tokens'
      },
      'gpt-4-turbo': { 
        name: 'GPT-4 Turbo', 
        input: 0.01, 
        output: 0.03,
        context: '128K tokens'
      },
      'gpt-4o': { 
        name: 'GPT-4o', 
        input: 0.005, 
        output: 0.015,
        context: '128K tokens'
      }
    },
    anthropic: {
      'claude-3-haiku': { 
        name: 'Claude 3 Haiku', 
        input: 0.00025, 
        output: 0.00125,
        context: '200K tokens'
      },
      'claude-3-sonnet': { 
        name: 'Claude 3 Sonnet', 
        input: 0.003, 
        output: 0.015,
        context: '200K tokens'
      },
      'claude-3-opus': { 
        name: 'Claude 3 Opus', 
        input: 0.015, 
        output: 0.075,
        context: '200K tokens'
      }
    },
    google: {
      'gemini-pro': { 
        name: 'Gemini Pro', 
        input: 0.00025, 
        output: 0.0005,
        context: '30K tokens'
      },
      'gemini-ultra': { 
        name: 'Gemini Ultra', 
        input: 0.002, 
        output: 0.006,
        context: '30K tokens'
      }
    },
    cohere: {
      'command': { 
        name: 'Command', 
        input: 0.0015, 
        output: 0.002,
        context: '4K tokens'
      },
      'command-light': { 
        name: 'Command Light', 
        input: 0.0003, 
        output: 0.0006,
        context: '4K tokens'
      }
    }
  };

  function updateModelOptions() {
    const provider = form.querySelector('input[name="provider"]:checked').value;
    const models = modelPricing[provider];
    
    modelSelection.innerHTML = `
      <fieldset style="border: none; padding: 0; margin: 1em 0;">
        <legend style="font-size:1em;font-weight:600;margin-bottom:0.5em;">Model</legend>
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
        "💡 Consider caching for popular queries",
        "🔄 Use streaming for better UX",
        "📝 Minimize system prompts length"
      ],
      content: [
        "📊 Use batch processing for cost savings", 
        "✂️ Optimize prompts for shorter responses",
        "🎯 Break large tasks into smaller parts"
      ],
      analysis: [
        "🗂️ Process documents in chunks",
        "📋 Use structured output for accuracy",
        "🔍 Fine-tune prompts for specific analysis"
      ],
      coding: [
        "💻 Combine with local IDE for cost savings",
        "📚 Use code completion instead of generation",
        "🔧 Set temperature low for deterministic results"
      ]
    };
    
    return recommendations[usageType] || [];
  }

  function getCostCategory(monthlyCost) {
    if (monthlyCost < 10) return { level: "💚 Low", color: "#28a745" };
    if (monthlyCost < 100) return { level: "💛 Moderate", color: "#ffc107" };
    if (monthlyCost < 500) return { level: "🧡 High", color: "#fd7e14" };
    return { level: "🔴 Very High", color: "#dc3545" };
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
        result.innerHTML = '<p style="color: red;">Please enter valid values for all fields.</p>';
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
            <h6>💳 Monthly Cost</h6>
            <div class="big-number">${formatCurrency(costs.monthlyCost)}</div>
            <p style="color: ${costCategory.color}; font-weight: 600;">${costCategory.level}</p>
          </div>
          <div class="insight-card success">
            <h6>📅 Daily Cost</h6>
            <div class="result-value">${formatCurrency(costs.dailyCost)}</div>
            <p>${requestsPerDay.toLocaleString()} requests</p>
          </div>
          <div class="insight-card warning">
            <h6>💬 Cost per Conversation</h6>
            <div class="result-value">${formatCurrency(costs.costPerConversation)}</div>
            <p>~10 messages</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #157aff; margin-bottom: 1rem;">📊 Cost Breakdown</h4>
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #157aff;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
              <span>📥 Input tokens (${inputTokens.toLocaleString()} × ${(requestsPerDay * daysPerMonth).toLocaleString()}):</span>
              <strong>${formatCurrency(costs.inputCostPerDay * daysPerMonth)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
              <span>📤 Output tokens (${outputTokens.toLocaleString()} × ${(requestsPerDay * daysPerMonth).toLocaleString()}):</span>
              <strong>${formatCurrency(costs.outputCostPerDay * daysPerMonth)}</strong>
            </div>
            <hr style="border: none; border-top: 2px solid #157aff; margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; font-size: 1.1em;">
              <span><strong>Total monthly cost:</strong></span>
              <strong style="color: #157aff;">${formatCurrency(costs.monthlyCost)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-top: 0.5rem;">
              <span>Annual cost:</span>
              <strong>${formatCurrency(costs.yearlyCost)}</strong>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #6c757d; margin-bottom: 1rem;">ℹ️ Model Information</h4>
          <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px;">
            <div style="margin-bottom: 1rem;">
              <strong>🤖 ${costs.modelData.name}</strong><br>
              <small>Context: ${costs.modelData.context}</small>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>📥 Input:</strong><br>
                <small>${formatCurrency(costs.modelData.input)} per 1K tokens</small>
              </div>
              <div>
                <strong>📤 Output:</strong><br>
                <small>${formatCurrency(costs.modelData.output)} per 1K tokens</small>
              </div>
              <div>
                <strong>📊 Total monthly tokens:</strong><br>
                <small>${(costs.monthlyTokens / 1000).toFixed(1)}K tokens</small>
              </div>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="margin: 2rem 0;">
          <h4 style="color: #28a745; margin-bottom: 1rem;">💡 Optimization Recommendations</h4>
          <div style="background: #f8fff9; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #28a745;">
            ${recommendations.map(rec => `<div style="margin-bottom: 0.5rem;">${rec}</div>`).join('')}
          </div>
        </div>
        ` : ''}

        <div style="margin: 2rem 0;">
          <h4 style="color: #17a2b8; margin-bottom: 1rem;">📈 Volume Comparison</h4>
          <div style="background: #f8fdfe; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #17a2b8;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; text-align: center;">
              <div>
                <strong>100 requests/day</strong><br>
                <span style="color: #28a745;">${formatCurrency(costs.monthlyCost * (100 / requestsPerDay))}</span>
              </div>
              <div>
                <strong>500 requests/day</strong><br>
                <span style="color: #ffc107;">${formatCurrency(costs.monthlyCost * (500 / requestsPerDay))}</span>
              </div>
              <div>
                <strong>1000 requests/day</strong><br>
                <span style="color: #fd7e14;">${formatCurrency(costs.monthlyCost * (1000 / requestsPerDay))}</span>
              </div>
              <div>
                <strong>5000 requests/day</strong><br>
                <span style="color: #dc3545;">${formatCurrency(costs.monthlyCost * (5000 / requestsPerDay))}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #ffc107; margin-bottom: 1rem;">⚠️ Important Notes</h4>
          <div style="background: #fffcf5; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #ffc107;">
            <ul style="margin: 0; padding-left: 1.5rem;">
              <li>Prices may vary by region and change over time</li>
              <li>Consider rate limits and potential delays</li>
              <li>Set up billing alerts for production usage</li>
              <li>Test different models for optimal price/quality ratio</li>
              <li>Consider enterprise plans for high volumes</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});