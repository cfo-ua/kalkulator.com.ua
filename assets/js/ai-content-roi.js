document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ai-content-roi-form");
  if (!form) return;

  // Content type multipliers for time savings effectiveness
  const CONTENT_TYPE_MULTIPLIERS = {
    blog: 1.0,        // Blog articles - baseline
    social: 1.3,      // Social media - higher automation potential
    product: 1.5,     // Product descriptions - very repetitive
    email: 1.2,       // Email marketing - good templates
    mixed: 1.0        // Mixed content - average
  };

  // Training cost as percentage of annual AI cost
  const TRAINING_COST_PERCENTAGE = 0.10; // 10%
  
  // Management overhead as percentage of saved time
  const MANAGEMENT_OVERHEAD = 0.15; // 15%

  function calculateAIContentROI() {
    // Get form values
    const monthlyHours = parseFloat(document.getElementById("monthly-content-hours").value);
    const hourlyRate = parseFloat(document.getElementById("hourly-rate").value);
    const contentPieces = parseInt(document.getElementById("content-pieces").value);
    const currentPerformance = parseFloat(document.getElementById("current-performance").value) / 100;
    
    const aiMonthlyCost = parseFloat(document.getElementById("ai-monthly-cost").value);
    const implementationCost = parseFloat(document.getElementById("implementation-cost").value) || 0;
    const timeSavingsPercent = parseFloat(document.getElementById("time-savings").value) / 100;
    const qualityImprovement = parseFloat(document.getElementById("quality-improvement").value) / 100;
    
    const contentType = document.getElementById("content-types").value;
    const scalingFactor = parseFloat(document.getElementById("scaling-factor").value) / 100;
    
    const includeTraining = document.getElementById("include-training").checked;
    const includeManagement = document.getElementById("include-management").checked;
    const revenueTracking = document.getElementById("revenue-tracking").checked;

    // Calculate current monthly costs
    const currentMonthlyCost = monthlyHours * hourlyRate;
    
    // Apply content type multiplier to time savings
    const effectiveTimeSavings = timeSavingsPercent * CONTENT_TYPE_MULTIPLIERS[contentType];
    const actualTimeSavings = Math.min(effectiveTimeSavings, 0.9); // Cap at 90%
    
    // Calculate time saved and new time required
    const timeSavedHours = monthlyHours * actualTimeSavings;
    const newTimeRequired = monthlyHours * (1 - actualTimeSavings);
    
    // Calculate management overhead if included
    const managementTime = includeManagement ? (timeSavedHours * MANAGEMENT_OVERHEAD) : 0;
    const netTimeSaved = timeSavedHours - managementTime;
    
    // Calculate monthly savings from time reduction
    const monthlySavings = netTimeSaved * hourlyRate;
    
    // Calculate scaling benefits - additional content possible with saved time
    const additionalContentPossible = Math.floor(netTimeSaved / (monthlyHours / contentPieces));
    const scaledContentIncrease = contentPieces * scalingFactor;
    
    // Calculate quality improvement impact on revenue (estimated)
    // Assuming current content generates some baseline revenue
    const estimatedMonthlyRevenue = currentMonthlyCost * 3; // Rough 3:1 revenue to cost ratio
    const qualityRevenueIncrease = revenueTracking ? (estimatedMonthlyRevenue * qualityImprovement) : 0;
    
    // Calculate total monthly AI costs
    let totalAIMonthlyCost = aiMonthlyCost;
    
    // Add training costs (spread over 12 months)
    if (includeTraining) {
      const annualTrainingCost = aiMonthlyCost * 12 * TRAINING_COST_PERCENTAGE;
      totalAIMonthlyCost += annualTrainingCost / 12;
    }
    
    // Calculate net monthly benefit
    const monthlyBenefit = monthlySavings + qualityRevenueIncrease - totalAIMonthlyCost;
    
    // Calculate payback period (including implementation costs)
    const paybackMonths = implementationCost > 0 ? implementationCost / Math.max(monthlyBenefit, 1) : 0;
    
    // Calculate 12-month ROI
    const totalInvestment = implementationCost + (totalAIMonthlyCost * 12);
    const totalBenefits = (monthlySavings * 12) + (qualityRevenueIncrease * 12);
    const roi = totalInvestment > 0 ? ((totalBenefits - totalInvestment) / totalInvestment) * 100 : 0;
    
    // Calculate productivity metrics
    const productivityIncrease = (actualTimeSavings / (1 - actualTimeSavings)) * 100;
    const costReductionPercent = (monthlySavings / currentMonthlyCost) * 100;
    
    return {
      currentMonthlyCost,
      totalAIMonthlyCost,
      monthlySavings,
      qualityRevenueIncrease,
      monthlyBenefit,
      paybackMonths,
      roi,
      productivityIncrease,
      costReductionPercent,
      timeSavedHours,
      newTimeRequired,
      managementTime,
      additionalContentPossible,
      totalInvestment,
      totalBenefits,
      actualTimeSavings: actualTimeSavings * 100
    };
  }

  function formatCurrency(amount, isEnglish = false) {
    if (isEnglish) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(Math.round(amount));
    } else {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(Math.round(amount));
    }
  }

  function getROIEmoji(roi) {
    if (roi >= 200) return '🚀';
    if (roi >= 100) return '💎';
    if (roi >= 50) return '💰';
    if (roi >= 0) return '📈';
    return '📉';
  }

  function getPaybackEmoji(months) {
    if (months <= 3) return '⚡';
    if (months <= 6) return '🎯';
    if (months <= 12) return '📅';
    return '⏰';
  }

  function displayResults(results) {
    const isEnglish = window.location.pathname.includes('/en/');
    
    const contentType = document.getElementById("content-types").value;
    const contentTypeLabels = isEnglish ? {
      blog: 'Blog Articles',
      social: 'Social Media',
      product: 'Product Descriptions',
      email: 'Email Marketing',
      mixed: 'Mixed Content'
    } : {
      blog: 'Блог статті',
      social: 'Соціальні мережі',
      product: 'Описи товарів',
      email: 'Email маркетинг',
      mixed: 'Змішаний контент'
    };

    const resultHTML = `
      <div class="insight-cards">
        <div class="insight-card ${results.roi >= 50 ? 'success' : results.roi >= 0 ? 'info' : 'warning'}">
          <h6>${getROIEmoji(results.roi)} ${isEnglish ? 'ROI (12 months)' : 'ROI (12 місяців)'}</h6>
          <div class="big-number">${results.roi.toFixed(0)}%</div>
          <p>${isEnglish ? `${results.roi >= 0 ? 'Profitable' : 'Not profitable'} investment` : `${results.roi >= 0 ? 'Прибуткова' : 'Збиткова'} інвестиція`}</p>
        </div>
        
        <div class="insight-card success">
          <h6>💰 ${isEnglish ? 'Monthly Savings' : 'Місячна економія'}</h6>
          <div class="big-number">${formatCurrency(results.monthlySavings, isEnglish)}</div>
          <p>${isEnglish ? 'Cost reduction' : 'Зниження витрат'}</p>
        </div>
        
        <div class="insight-card info">
          <h6>${getPaybackEmoji(results.paybackMonths)} ${isEnglish ? 'Payback Period' : 'Період окупності'}</h6>
          <div class="big-number">${results.paybackMonths > 0 ? results.paybackMonths.toFixed(1) : '0'}</div>
          <p>${isEnglish ? 'months' : 'місяців'}</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📊 ${isEnglish ? 'Financial Analysis' : 'Фінансовий аналіз'}</h4>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius); margin: 1rem 0;">
          <div style="display: grid; gap: 0.8rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
              <span><strong>💸 ${isEnglish ? 'Current Monthly Cost' : 'Поточні місячні витрати'}</strong></span>
              <span><strong>${formatCurrency(results.currentMonthlyCost, isEnglish)}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>🤖 ${isEnglish ? 'AI Tools Cost' : 'Вартість AI інструментів'}</span>
              <span>${formatCurrency(results.totalAIMonthlyCost, isEnglish)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>⏱️ ${isEnglish ? 'Time Savings Value' : 'Цінність економії часу'}</span>
              <span>${formatCurrency(results.monthlySavings, isEnglish)}</span>
            </div>
            ${results.qualityRevenueIncrease > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>📈 ${isEnglish ? 'Quality Revenue Boost' : 'Додатковий дохід від якості'}</span>
              <span>${formatCurrency(results.qualityRevenueIncrease, isEnglish)}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 2px solid var(--accent); font-weight: bold; color: var(--accent);">
              <span>${isEnglish ? 'Net Monthly Benefit' : 'Чиста місячна вигода'}</span>
              <span>${formatCurrency(results.monthlyBenefit, isEnglish)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 1.5rem;">
        <h4>⚡ ${isEnglish ? 'Productivity Metrics' : 'Показники продуктивності'}</h4>
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>🚀 ${isEnglish ? 'Time Savings' : 'Економія часу'}</h6>
            <div class="big-number">${results.actualTimeSavings.toFixed(0)}%</div>
            <p>${results.timeSavedHours.toFixed(1)} ${isEnglish ? 'hours/month' : 'год/місяць'}</p>
          </div>
          
          <div class="insight-card success">
            <h6>📈 ${isEnglish ? 'Productivity Gain' : 'Приріст продуктивності'}</h6>
            <div class="big-number">${results.productivityIncrease.toFixed(0)}%</div>
            <p>${isEnglish ? 'Output increase' : 'Збільшення виходу'}</p>
          </div>
          
          <div class="insight-card warning">
            <h6>📝 ${isEnglish ? 'Extra Content Capacity' : 'Додаткова потужність'}</h6>
            <div class="big-number">+${results.additionalContentPossible}</div>
            <p>${isEnglish ? 'pieces/month' : 'матеріалів/місяць'}</p>
          </div>
        </div>
      </div>

      ${results.managementTime > 0 ? `
      <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #fff8e1 0%, #f5f5dc 100%); border-radius: var(--radius); border: 1px solid #ffc107;">
        <h5>⚠️ ${isEnglish ? 'Management Overhead' : 'Управлінські витрати'}</h5>
        <p>${isEnglish ? `${results.managementTime.toFixed(1)} hours/month allocated for AI process management` : `${results.managementTime.toFixed(1)} год/місяць виділено на управління AI процесами`}</p>
      </div>
      ` : ''}

      <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #f8fdff 0%, #e8f8fc 100%); border-radius: var(--radius); border: 1px solid var(--accent);">
        <h5>💡 ${isEnglish ? 'Key Insights' : 'Ключові висновки'}</h5>
        <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
          ${results.roi > 100 ? `<li>🚀 ${isEnglish ? 'Excellent ROI - strong business case for AI adoption' : 'Відмінний ROI - сильний бізнес-кейс для впровадження AI'}</li>` : ''}
          ${results.paybackMonths <= 6 ? `<li>⚡ ${isEnglish ? 'Quick payback period - low risk investment' : 'Швидка окупність - низькоризикова інвестиція'}</li>` : ''}
          ${results.productivityIncrease > 100 ? `<li>📈 ${isEnglish ? 'Major productivity boost - consider scaling up' : 'Значний приріст продуктивності - розгляньте масштабування'}</li>` : ''}
          <li>🎯 ${isEnglish ? `Best for: ${contentTypeLabels[contentType]}` : `Найкраще для: ${contentTypeLabels[contentType]}`}</li>
          ${results.costReductionPercent > 30 ? `<li>💰 ${isEnglish ? `${results.costReductionPercent.toFixed(0)}% cost reduction in content operations` : `${results.costReductionPercent.toFixed(0)}% зниження витрат на контент`}</li>` : ''}
        </ul>
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: var(--radius);">
        <h5>📋 ${isEnglish ? 'Implementation Recommendations' : 'Рекомендації щодо впровадження'}</h5>
        <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
          ${results.roi > 50 ? `<li>✅ ${isEnglish ? 'Strong business case - proceed with implementation' : 'Сильний бізнес-кейс - розпочинайте впровадження'}</li>` : `<li>⚠️ ${isEnglish ? 'Consider optimizing parameters or starting with a pilot' : 'Розгляньте оптимізацію параметрів або початок з пілота'}</li>`}
          <li>📚 ${isEnglish ? 'Invest in team training for maximum ROI' : 'Інвестуйте в навчання команди для максимального ROI'}</li>
          <li>📊 ${isEnglish ? 'Track metrics monthly to validate projections' : 'Відстежуйте метрики щомісяця для підтвердження прогнозів'}</li>
          <li>🔄 ${isEnglish ? 'Start with high-volume, repetitive content types' : 'Почніть з високо-об\'ємних, повторюваних типів контенту'}</li>
        </ul>
      </div>
    `;

    document.getElementById("ai-roi-result").innerHTML = resultHTML;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const results = calculateAIContentROI();
    displayResults(results);
    
    // Scroll to results
    document.getElementById("ai-roi-result").scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  });
});