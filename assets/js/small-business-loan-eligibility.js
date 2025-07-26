document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loan-eligibility-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Отримання даних з форми
    const businessAge = parseInt(document.getElementById("businessAge").value) || 0;
    const monthlyRevenue = parseFloat(document.getElementById("monthlyRevenue").value) || 0;
    const industryType = document.getElementById("industryType").value;
    const businessStructure = document.getElementById("businessStructure").value;
    
    const cashFlow = parseFloat(document.getElementById("cashFlow").value) || 0;
    const existingDebt = parseFloat(document.getElementById("existingDebt").value) || 0;
    const bankBalance = parseFloat(document.getElementById("bankBalance").value) || 0;
    
    const personalCreditScore = document.getElementById("personalCreditScore").value;
    const businessCreditScore = document.getElementById("businessCreditScore").value;
    const paymentHistory = parseFloat(document.getElementById("paymentHistory").value) || 0;
    
    const loanAmount = parseFloat(document.getElementById("loanAmount").value) || 0;
    const loanPurpose = document.getElementById("loanPurpose").value;
    const collateralValue = parseFloat(document.getElementById("collateralValue").value) || 0;

    // Розрахунок показників
    const debtToIncomeRatio = monthlyRevenue > 0 ? (existingDebt / monthlyRevenue * 100) : 0;
    const cashFlowCoverage = cashFlow > 0 ? (cashFlow / (existingDebt + (loanAmount / 60))) : 0;
    const loanToRevenue = monthlyRevenue > 0 ? (loanAmount / (monthlyRevenue * 12)) : 0;
    const collateralCoverage = collateralValue / loanAmount;

    // Оцінка балів за різними критеріями
    let scoreBreakdown = {
      businessAge: calculateBusinessAgeScore(businessAge),
      revenue: calculateRevenueScore(monthlyRevenue),
      industry: calculateIndustryScore(industryType),
      cashFlow: calculateCashFlowScore(cashFlow, monthlyRevenue),
      debtRatio: calculateDebtRatioScore(debtToIncomeRatio),
      personalCredit: calculatePersonalCreditScore(personalCreditScore),
      businessCredit: calculateBusinessCreditScore(businessCreditScore),
      paymentHistory: calculatePaymentHistoryScore(paymentHistory),
      collateral: calculateCollateralScore(collateralCoverage),
      loanPurpose: calculateLoanPurposeScore(loanPurpose)
    };

    // Загальний рейтинг кредитоспроможності
    const totalScore = Object.values(scoreBreakdown).reduce((a, b) => a + b.score, 0);
    const maxScore = Object.values(scoreBreakdown).reduce((a, b) => a + b.maxScore, 0);
    const eligibilityPercentage = (totalScore / maxScore) * 100;

    // Визначення рівня кредитоспроможності
    let eligibilityLevel, eligibilityColor, approvalChance;
    if (eligibilityPercentage >= 80) {
      eligibilityLevel = "Відмінна";
      eligibilityColor = "success";
      approvalChance = "Дуже висока (85-95%)";
    } else if (eligibilityPercentage >= 65) {
      eligibilityLevel = "Хороша";
      eligibilityColor = "info";
      approvalChance = "Висока (70-85%)";
    } else if (eligibilityPercentage >= 50) {
      eligibilityLevel = "Задовільна";
      eligibilityColor = "warning";
      approvalChance = "Середня (40-70%)";
    } else {
      eligibilityLevel = "Низька";
      eligibilityColor = "warning";
      approvalChance = "Низька (10-40%)";
    }

    // Рекомендовані типи кредитів
    const recommendedLoanTypes = getRecommendedLoanTypes(scoreBreakdown, loanPurpose, eligibilityPercentage);

    // Форматування валюти
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    const formatPercent = (percent) => {
      return new Intl.NumberFormat('uk-UA', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(percent / 100);
    };

    // Відображення результатів
    document.getElementById("loan-eligibility-result").innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${eligibilityColor}">
          <h6>🎯 Кредитоспроможність</h6>
          <div class="big-number">${eligibilityPercentage.toFixed(0)}%</div>
          <p>${eligibilityLevel}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📊 Шанси схвалення</h6>
          <div class="big-number">${approvalChance.split('(')[1].split(')')[0]}</div>
          <p>${approvalChance.split('(')[0]}</p>
        </div>
        
        <div class="insight-card ${debtToIncomeRatio < 30 ? 'success' : 'warning'}">
          <h6>💳 Співвідношення боргу</h6>
          <div class="big-number">${debtToIncomeRatio.toFixed(1)}%</div>
          <p>до доходу</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📋 Детальний аналіз кредитоспроможності</h4>
        
        <div class="insight-cards">
          <div class="insight-card">
            <h6>🏢 Фактори бізнесу</h6>
            <small>
              • Час роботи: ${scoreBreakdown.businessAge.score}/${scoreBreakdown.businessAge.maxScore} балів<br>
              • Дохід: ${scoreBreakdown.revenue.score}/${scoreBreakdown.revenue.maxScore} балів<br>
              • Галузь: ${scoreBreakdown.industry.score}/${scoreBreakdown.industry.maxScore} балів<br>
              • Грошовий потік: ${scoreBreakdown.cashFlow.score}/${scoreBreakdown.cashFlow.maxScore} балів
            </small>
          </div>
          
          <div class="insight-card">
            <h6>💳 Кредитний профіль</h6>
            <small>
              • Особистий рейтинг: ${scoreBreakdown.personalCredit.score}/${scoreBreakdown.personalCredit.maxScore} балів<br>
              • Бізнес рейтинг: ${scoreBreakdown.businessCredit.score}/${scoreBreakdown.businessCredit.maxScore} балів<br>
              • Історія платежів: ${scoreBreakdown.paymentHistory.score}/${scoreBreakdown.paymentHistory.maxScore} балів<br>
              • Співвідношення боргу: ${scoreBreakdown.debtRatio.score}/${scoreBreakdown.debtRatio.maxScore} балів
            </small>
          </div>
          
          <div class="insight-card">
            <h6>🛡️ Застава та ризики</h6>
            <small>
              • Покриття заставою: ${formatPercent(collateralCoverage * 100)}<br>
              • Мета кредиту: ${scoreBreakdown.loanPurpose.score}/${scoreBreakdown.loanPurpose.maxScore} балів<br>
              • Співвідношення кредит/дохід: ${loanToRevenue.toFixed(1)}x<br>
              • Покриття грошовим потоком: ${cashFlowCoverage.toFixed(1)}x
            </small>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <h4>🏦 Рекомендовані типи кредитів</h4>
          <div class="insight-cards">
            ${recommendedLoanTypes.map(loan => `
              <div class="insight-card ${loan.suitability}">
                <h6>${loan.icon} ${loan.name}</h6>
                <div class="result-value">${loan.approvalChance}</div>
                <small>${loan.description}</small>
              </div>
            `).join('')}
          </div>
        </div>

        ${generateImprovementRecommendations(scoreBreakdown, eligibilityPercentage)}
      </div>
    `;

    // Показати графік
    const chartBlock = document.getElementById("eligibility-chart-block");
    if (chartBlock) {
      chartBlock.style.display = "block";
      createEligibilityChart(scoreBreakdown);
    }
  });

  // Функції розрахунку балів
  function calculateBusinessAgeScore(months) {
    if (months >= 24) return { score: 20, maxScore: 20, comment: "Встановлений бізнес" };
    if (months >= 12) return { score: 15, maxScore: 20, comment: "Досвідчений бізнес" };
    if (months >= 6) return { score: 10, maxScore: 20, comment: "Молодий бізнес" };
    return { score: 5, maxScore: 20, comment: "Новий бізнес" };
  }

  function calculateRevenueScore(revenue) {
    if (revenue >= 1000000) return { score: 20, maxScore: 20, comment: "Високий дохід" };
    if (revenue >= 500000) return { score: 15, maxScore: 20, comment: "Середній дохід" };
    if (revenue >= 200000) return { score: 10, maxScore: 20, comment: "Помірний дохід" };
    return { score: 5, maxScore: 20, comment: "Низький дохід" };
  }

  function calculateIndustryScore(industry) {
    const scores = {
      'low-risk': { score: 15, maxScore: 15, comment: "Низький ризик" },
      'medium-risk': { score: 10, maxScore: 15, comment: "Середній ризик" },
      'high-risk': { score: 5, maxScore: 15, comment: "Високий ризик" }
    };
    return scores[industry] || scores['medium-risk'];
  }

  function calculateCashFlowScore(cashFlow, revenue) {
    const ratio = revenue > 0 ? (cashFlow / revenue) : 0;
    if (ratio >= 0.3) return { score: 15, maxScore: 15, comment: "Відмінний грошовий потік" };
    if (ratio >= 0.2) return { score: 12, maxScore: 15, comment: "Хороший грошовий потік" };
    if (ratio >= 0.1) return { score: 8, maxScore: 15, comment: "Задовільний грошовий потік" };
    if (ratio >= 0) return { score: 5, maxScore: 15, comment: "Слабкий грошовий потік" };
    return { score: 0, maxScore: 15, comment: "Негативний грошовий потік" };
  }

  function calculateDebtRatioScore(debtRatio) {
    if (debtRatio <= 20) return { score: 15, maxScore: 15, comment: "Відмінне співвідношення" };
    if (debtRatio <= 30) return { score: 12, maxScore: 15, comment: "Хороше співвідношення" };
    if (debtRatio <= 40) return { score: 8, maxScore: 15, comment: "Прийнятне співвідношення" };
    if (debtRatio <= 50) return { score: 5, maxScore: 15, comment: "Високе співвідношення" };
    return { score: 2, maxScore: 15, comment: "Критичне співвідношення" };
  }

  function calculatePersonalCreditScore(creditScore) {
    const scores = {
      'excellent': { score: 20, maxScore: 20, comment: "Відмінний рейтинг" },
      'good': { score: 15, maxScore: 20, comment: "Хороший рейтинг" },
      'fair': { score: 10, maxScore: 20, comment: "Задовільний рейтинг" },
      'poor': { score: 5, maxScore: 20, comment: "Поганий рейтинг" },
      'bad': { score: 2, maxScore: 20, comment: "Дуже поганий рейтинг" }
    };
    return scores[creditScore] || scores['fair'];
  }

  function calculateBusinessCreditScore(creditScore) {
    const scores = {
      'excellent': { score: 15, maxScore: 15, comment: "Відмінний бізнес рейтинг" },
      'good': { score: 12, maxScore: 15, comment: "Хороший бізнес рейтинг" },
      'fair': { score: 8, maxScore: 15, comment: "Задовільний бізнес рейтинг" },
      'poor': { score: 5, maxScore: 15, comment: "Поганий бізнес рейтинг" },
      'none': { score: 10, maxScore: 15, comment: "Немає бізнес рейтингу" }
    };
    return scores[creditScore] || scores['fair'];
  }

  function calculatePaymentHistoryScore(percentage) {
    if (percentage >= 95) return { score: 10, maxScore: 10, comment: "Відмінна історія" };
    if (percentage >= 90) return { score: 8, maxScore: 10, comment: "Хороша історія" };
    if (percentage >= 80) return { score: 6, maxScore: 10, comment: "Задовільна історія" };
    if (percentage >= 70) return { score: 4, maxScore: 10, comment: "Погана історія" };
    return { score: 2, maxScore: 10, comment: "Дуже погана історія" };
  }

  function calculateCollateralScore(coverage) {
    if (coverage >= 1.5) return { score: 10, maxScore: 10, comment: "Відмінне покриття" };
    if (coverage >= 1.0) return { score: 8, maxScore: 10, comment: "Повне покриття" };
    if (coverage >= 0.5) return { score: 6, maxScore: 10, comment: "Часткове покриття" };
    if (coverage > 0) return { score: 3, maxScore: 10, comment: "Мінімальне покриття" };
    return { score: 0, maxScore: 10, comment: "Без застави" };
  }

  function calculateLoanPurposeScore(purpose) {
    const scores = {
      'equipment': { score: 10, maxScore: 10, comment: "Продуктивна інвестиція" },
      'expansion': { score: 9, maxScore: 10, comment: "Розвиток бізнесу" },
      'working-capital': { score: 8, maxScore: 10, comment: "Операційні потреби" },
      'inventory': { score: 8, maxScore: 10, comment: "Товарні запаси" },
      'real-estate': { score: 7, maxScore: 10, comment: "Нерухомість" },
      'debt-consolidation': { score: 6, maxScore: 10, comment: "Консолідація боргів" }
    };
    return scores[purpose] || scores['working-capital'];
  }

  function getRecommendedLoanTypes(scoreBreakdown, purpose, eligibilityPercentage) {
    const loans = [
      {
        name: "Банківський кредит",
        icon: "🏦",
        approvalChance: eligibilityPercentage >= 70 ? "Висока" : eligibilityPercentage >= 50 ? "Середня" : "Низька",
        suitability: eligibilityPercentage >= 70 ? "success" : eligibilityPercentage >= 50 ? "info" : "warning",
        description: "Традиційний банківський кредит з конкурентними ставками"
      },
      {
        name: "Кредитна лінія",
        icon: "💳",
        approvalChance: eligibilityPercentage >= 65 ? "Висока" : eligibilityPercentage >= 45 ? "Середня" : "Низька",
        suitability: eligibilityPercentage >= 65 ? "success" : eligibilityPercentage >= 45 ? "info" : "warning",
        description: "Гнучкий доступ до коштів для оборотного капіталу"
      },
      {
        name: "Мікрокредит",
        icon: "🏪",
        approvalChance: eligibilityPercentage >= 40 ? "Висока" : "Середня",
        suitability: eligibilityPercentage >= 40 ? "success" : "info",
        description: "Швидкі малі позики з простішими вимогами"
      }
    ];

    if (purpose === 'equipment') {
      loans.push({
        name: "Лізинг обладнання",
        icon: "⚙️",
        approvalChance: eligibilityPercentage >= 50 ? "Висока" : "Середня",
        suitability: eligibilityPercentage >= 50 ? "success" : "info",
        description: "Фінансування під заставу обладнання"
      });
    }

    return loans.slice(0, 3);
  }

  function generateImprovementRecommendations(scoreBreakdown, eligibilityPercentage) {
    const recommendations = [];

    if (scoreBreakdown.personalCredit.score < scoreBreakdown.personalCredit.maxScore * 0.7) {
      recommendations.push("🎯 Покращіть особистий кредитний рейтинг");
    }
    
    if (scoreBreakdown.businessAge.score < 15) {
      recommendations.push("⏰ Дайте бізнесу більше часу для розвитку кредитної історії");
    }
    
    if (scoreBreakdown.cashFlow.score < 10) {
      recommendations.push("💰 Покращіть грошові потоки та прибутковість");
    }
    
    if (scoreBreakdown.debtRatio.score < 10) {
      recommendations.push("📉 Зменшіть існуючі борги для покращення співвідношення");
    }
    
    if (scoreBreakdown.businessCredit.score < 10) {
      recommendations.push("🏢 Будуйте кредитну історію бізнесу");
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ Ваш профіль виглядає добре для отримання кредиту!");
    }

    return `
      <div style="margin-top: 1.5rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid var(--accent);">
        <h5>💡 Рекомендації для покращення:</h5>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          <li>📋 Підготуйте всі необхідні документи заздалегідь</li>
          <li>🎯 Подавайте заявки в кілька установ одночасно</li>
          <li>🤝 Розгляньте можливість залучення поручителя</li>
        </ul>
      </div>
    `;
  }

  function createEligibilityChart(scoreBreakdown) {
    const canvas = document.getElementById("eligibility-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Налаштування canvas - responsive height from container
    const width = canvas.offsetWidth;
    const container = canvas.parentElement;
    const height = container ? container.offsetHeight - 40 : Math.min(340, Math.max(168, width * 0.4));
    canvas.width = width;
    canvas.height = height;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    const categories = Object.keys(scoreBreakdown);
    const angleStep = (Math.PI * 2) / categories.length;
    
    // Малювання сітки
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Лінії до кожної категорії
    categories.forEach((category, index) => {
      const angle = index * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.stroke();
    });
    
    // Малювання фактичних показників
    ctx.strokeStyle = '#157aff';
    ctx.fillStyle = 'rgba(21, 122, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    categories.forEach((category, index) => {
      const score = scoreBreakdown[category];
      const percentage = score.score / score.maxScore;
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius * percentage;
      const y = centerY + Math.sin(angle) * radius * percentage;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Підписи категорій
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    const labels = {
      businessAge: 'Вік бізнесу',
      revenue: 'Дохід',
      industry: 'Галузь',
      cashFlow: 'Грош. потік',
      debtRatio: 'Співвідн. боргу',
      personalCredit: 'Особ. рейтинг',
      businessCredit: 'Бізнес рейтинг',
      paymentHistory: 'Історія платежів',
      collateral: 'Застава',
      loanPurpose: 'Мета кредиту'
    };
    
    categories.forEach((category, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const labelRadius = radius + 30;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      ctx.fillText(labels[category] || category, x, y);
      
      // Показати бали
      ctx.font = '10px Arial';
      ctx.fillText(
        `${scoreBreakdown[category].score}/${scoreBreakdown[category].maxScore}`,
        x, y + 15
      );
      ctx.font = '12px Arial';
    });
  }
});