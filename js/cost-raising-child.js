document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("child-cost-form");
  const resultDiv = document.getElementById("child-cost-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateChildCosts();
  });

  // Auto-calculate when key inputs change
  const keyInputs = ['household-income', 'number-of-children', 'infant-childcare', 'food-expenses'];
  keyInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (validateInputs()) {
        calculateChildCosts();
      }
    });
  });

  function validateInputs() {
    const income = parseFloat(document.getElementById("household-income").value);
    const numChildren = parseFloat(document.getElementById("number-of-children").value);
    return income > 0 && numChildren > 0;
  }

  function calculateChildCosts() {
    // Get inputs
    const locationType = document.getElementById("location-type").value;
    const householdIncome = parseFloat(document.getElementById("household-income").value) || 0;
    const numberOfChildren = parseFloat(document.getElementById("number-of-children").value) || 1;
    
    // Childcare costs
    const infantChildcare = parseFloat(document.getElementById("infant-childcare").value) || 0;
    const preschool = parseFloat(document.getElementById("preschool").value) || 0;
    const schoolAgeCare = parseFloat(document.getElementById("school-age-care").value) || 0;
    const privateSchool = parseFloat(document.getElementById("private-school").value) || 0;
    
    // Monthly expenses
    const foodExpenses = parseFloat(document.getElementById("food-expenses").value) || 0;
    const clothing = parseFloat(document.getElementById("clothing").value) || 0;
    const healthcare = parseFloat(document.getElementById("healthcare").value) || 0;
    const activities = parseFloat(document.getElementById("activities").value) || 0;
    const housingIncrease = parseFloat(document.getElementById("housing-increase").value) || 0;
    const transportation = parseFloat(document.getElementById("transportation").value) || 0;
    
    // One-time expenses
    const babyGear = parseFloat(document.getElementById("baby-gear").value) || 0;
    const educationSavings = parseFloat(document.getElementById("education-savings").value) || 0;
    const emergencyBuffer = parseFloat(document.getElementById("emergency-buffer").value) / 100 || 0;
    
    // Cost-saving options
    const handMeDowns = document.getElementById("hand-me-downs").checked;
    const genericBrands = document.getElementById("generic-brands").checked;
    const freeActivities = document.getElementById("free-activities").checked;
    const familyChildcare = document.getElementById("family-childcare").checked;

    if (householdIncome <= 0 || numberOfChildren <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, введіть дійсний дохід сім\'ї та кількість дітей.</p>';
      return;
    }

    // Apply cost-saving adjustments
    let adjustedClothing = clothing * (handMeDowns ? 0.8 : 1);
    let adjustedFood = foodExpenses * (genericBrands ? 0.9 : 1);
    let adjustedActivities = activities * (freeActivities ? 0.7 : 1);
    let adjustedInfantChildcare = infantChildcare * (familyChildcare ? 0.75 : 1);
    let adjustedPreschool = preschool * (familyChildcare ? 0.75 : 1);

    // Location adjustments
    const locationMultipliers = {
      'high-cost': { childcare: 1.4, housing: 1.3, general: 1.2 },
      'medium-cost': { childcare: 1.0, housing: 1.0, general: 1.0 },
      'low-cost': { childcare: 0.7, housing: 0.8, general: 0.9 }
    };
    
    const multiplier = locationMultipliers[locationType];
    
    // Adjust costs by location
    adjustedInfantChildcare *= multiplier.childcare;
    adjustedPreschool *= multiplier.childcare;
    const adjustedSchoolAgeCare = schoolAgeCare * multiplier.childcare;
    const adjustedHousingIncrease = housingIncrease * multiplier.housing;
    
    // Calculate costs by age group for one child
    const ageGroupCosts = calculateAgeGroupCosts({
      infantChildcare: adjustedInfantChildcare,
      preschool: adjustedPreschool,
      schoolAgeCare: adjustedSchoolAgeCare,
      privateSchool: privateSchool,
      food: adjustedFood,
      clothing: adjustedClothing,
      healthcare: healthcare,
      activities: adjustedActivities,
      housing: adjustedHousingIncrease,
      transportation: transportation,
      babyGear: babyGear,
      educationSavings: educationSavings,
      generalMultiplier: multiplier.general
    });

    // Calculate total costs
    const totalCostPerChild = ageGroupCosts.total;
    const totalCostAllChildren = totalCostPerChild * numberOfChildren;
    const emergencyAmount = totalCostAllChildren * emergencyBuffer;
    const grandTotal = totalCostAllChildren + emergencyAmount;

    // Calculate cost as percentage of income
    const annualCost = (totalCostPerChild / 18) * numberOfChildren;
    const costAsPercentageOfIncome = (annualCost / householdIncome) * 100;

    // Calculate monthly budget needed
    const monthlyBudgetNeeded = annualCost / 12;

    // Income-based analysis
    const incomeCategory = getIncomeCategory(householdIncome);
    const affordabilityAnalysis = getAffordabilityAnalysis(costAsPercentageOfIncome, incomeCategory);

    displayResults({
      numberOfChildren,
      locationType,
      householdIncome,
      totalCostPerChild,
      totalCostAllChildren,
      grandTotal,
      emergencyAmount,
      annualCost,
      monthlyBudgetNeeded,
      costAsPercentageOfIncome,
      ageGroupCosts,
      incomeCategory,
      affordabilityAnalysis,
      costSavings: {
        handMeDowns,
        genericBrands, 
        freeActivities,
        familyChildcare
      }
    });
  }

  function calculateAgeGroupCosts(costs) {
    const ageGroups = {
      ages0to2: {
        years: 3,
        childcare: costs.infantChildcare,
        monthlyExpenses: (costs.food * 0.7 + costs.clothing * 1.2 + costs.healthcare * 1.1 + 
                         costs.activities * 0.5 + costs.housing + costs.transportation) * costs.generalMultiplier,
        oneTime: costs.babyGear,
        education: costs.educationSavings
      },
      ages3to5: {
        years: 3,
        childcare: costs.preschool,
        monthlyExpenses: (costs.food * 0.8 + costs.clothing * 1.1 + costs.healthcare + 
                         costs.activities * 0.8 + costs.housing + costs.transportation) * costs.generalMultiplier,
        oneTime: 0,
        education: costs.educationSavings
      },
      ages6to12: {
        years: 7,
        childcare: costs.schoolAgeCare + costs.privateSchool,
        monthlyExpenses: (costs.food + costs.clothing + costs.healthcare + 
                         costs.activities + costs.housing + costs.transportation) * costs.generalMultiplier,
        oneTime: 20000, // Шкільне приладдя, спортивне обладнання
        education: costs.educationSavings
      },
      ages13to17: {
        years: 5,
        childcare: costs.privateSchool,
        monthlyExpenses: (costs.food * 1.3 + costs.clothing * 1.2 + costs.healthcare + 
                         costs.activities * 1.4 + costs.housing + costs.transportation * 1.5) * costs.generalMultiplier,
        oneTime: 60000, // Технології, витрати пов'язані з транспортом
        education: costs.educationSavings
      }
    };

    let totalCost = 0;
    const breakdown = {};

    Object.keys(ageGroups).forEach(ageGroup => {
      const group = ageGroups[ageGroup];
      const yearlyChildcare = group.childcare;
      const yearlyMonthlyExpenses = group.monthlyExpenses * 12;
      const totalYearlyExpenses = yearlyChildcare + yearlyMonthlyExpenses + group.education;
      const totalForAgeGroup = (totalYearlyExpenses * group.years) + group.oneTime;
      
      breakdown[ageGroup] = {
        years: group.years,
        yearlyChildcare: yearlyChildcare,
        yearlyMonthlyExpenses: yearlyMonthlyExpenses,
        yearlyEducationSavings: group.education,
        oneTimeExpenses: group.oneTime,
        totalForPeriod: totalForAgeGroup,
        averagePerYear: totalForAgeGroup / group.years
      };
      
      totalCost += totalForAgeGroup;
    });

    return {
      breakdown: breakdown,
      total: totalCost,
      averagePerYear: totalCost / 18
    };
  }

  function getIncomeCategory(income) {
    if (income < 300000) return "Низький дохід";
    if (income < 600000) return "Середній дохід";
    if (income < 1200000) return "Вищий середній дохід";
    return "Високий дохід";
  }

  function getAffordabilityAnalysis(percentage, category) {
    if (percentage > 40) {
      return {
        status: "Дуже складно",
        color: "red",
        advice: "Витрати на дітей споживатимуть велику частину доходу. Розгляньте стратегії економії та відкладене планування сім'ї."
      };
    } else if (percentage > 25) {
      return {
        status: "Складно",
        color: "orange",
        advice: "Витрати на дітей значні, але керовані за умови ретельного планування бюджету та заходів економії."
      };
    } else if (percentage > 15) {
      return {
        status: "Керовано",
        color: "yellow",
        advice: "Витрати на дітей розумні для вашого рівня доходу за умови хорошого фінансового планування."
      };
    } else {
      return {
        status: "Комфортно",
        color: "green",
        advice: "Витрати на дітей цілком у ваших силах, що дозволяє заощаджувати та мати гнучкість."
      };
    }
  }

  function displayResults(data) {
    const {
      numberOfChildren,
      locationType,
      householdIncome,
      totalCostPerChild,
      totalCostAllChildren,
      grandTotal,
      emergencyAmount,
      annualCost,
      monthlyBudgetNeeded,
      costAsPercentageOfIncome,
      ageGroupCosts,
      incomeCategory,
      affordabilityAnalysis,
      costSavings
    } = data;

    const childWord = numberOfChildren === 1 ? 'дитини' : numberOfChildren < 5 ? 'дітей' : 'дітей';
    const locationLabels = {
      'high-cost': 'Високовартісний',
      'medium-cost': 'Середньовартісний', 
      'low-cost': 'Низьковартісний'
    };

    const formatCurrency = (amount) => amount.toLocaleString('uk-UA') + ' грн';

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>👶 Вартість виховання ${numberOfChildren} ${childWord}</h3>
        
        <div class="affordability-status" style="border-left: 4px solid ${affordabilityAnalysis.color};">
          <h4>Фінансовий вплив: ${affordabilityAnalysis.status}</h4>
          <p>${affordabilityAnalysis.advice}</p>
          <p><strong>${costAsPercentageOfIncome.toFixed(1)}%</strong> від вашого сімейного доходу</p>
        </div>

        <div class="cost-overview">
          <div class="overview-grid">
            <div class="overview-item highlight">
              <span class="label">Загальна вартість (від народження до 18 років):</span>
              <span class="value">${formatCurrency(grandTotal)}</span>
            </div>
            <div class="overview-item">
              <span class="label">Вартість на дитину:</span>
              <span class="value">${formatCurrency(totalCostPerChild)}</span>
            </div>
            <div class="overview-item">
              <span class="label">Річна вартість:</span>
              <span class="value">${formatCurrency(annualCost)}</span>
            </div>
            <div class="overview-item">
              <span class="label">Потрібний місячний бюджет:</span>
              <span class="value">${formatCurrency(monthlyBudgetNeeded)}</span>
            </div>
            <div class="overview-item">
              <span class="label">Тип регіону:</span>
              <span class="value">${locationLabels[locationType]}</span>
            </div>
            <div class="overview-item">
              <span class="label">Категорія доходу:</span>
              <span class="value">${incomeCategory}</span>
            </div>
          </div>
        </div>

        <div class="age-breakdown">
          <h4>📊 Витрати за віковими групами (на дитину)</h4>
          <div class="age-groups">
            <div class="age-group">
              <h5>0-2 роки (Немовлята/Малюки)</h5>
              <div class="age-details">
                <p><strong>Всього за 3 роки:</strong> ${formatCurrency(ageGroupCosts.breakdown.ages0to2.totalForPeriod)}</p>
                <p><strong>Середньорічно:</strong> ${formatCurrency(ageGroupCosts.breakdown.ages0to2.averagePerYear)}</p>
                <ul>
                  <li>Догляд: ${formatCurrency(ageGroupCosts.breakdown.ages0to2.yearlyChildcare)}/рік</li>
                  <li>Витрати на життя: ${formatCurrency(ageGroupCosts.breakdown.ages0to2.yearlyMonthlyExpenses)}/рік</li>
                  <li>Освітні накопичення: ${formatCurrency(ageGroupCosts.breakdown.ages0to2.yearlyEducationSavings)}/рік</li>
                  <li>Одноразові витрати: ${formatCurrency(ageGroupCosts.breakdown.ages0to2.oneTimeExpenses)}</li>
                </ul>
              </div>
            </div>

            <div class="age-group">
              <h5>3-5 років (Дошкільнята)</h5>
              <div class="age-details">
                <p><strong>Всього за 3 роки:</strong> ${formatCurrency(ageGroupCosts.breakdown.ages3to5.totalForPeriod)}</p>
                <p><strong>Середньорічно:</strong> ${formatCurrency(ageGroupCosts.breakdown.ages3to5.averagePerYear)}</p>
                <ul>
                  <li>Догляд: ${formatCurrency(ageGroupCosts.breakdown.ages3to5.yearlyChildcare)}/рік</li>
                  <li>Витрати на життя: ${formatCurrency(ageGroupCosts.breakdown.ages3to5.yearlyMonthlyExpenses)}/рік</li>
                  <li>Освітні накопичення: ${formatCurrency(ageGroupCosts.breakdown.ages3to5.yearlyEducationSavings)}/рік</li>
                </ul>
              </div>
            </div>

            <div class="age-group">
              <h5>6-12 років (Шкільний вік)</h5>
              <div class="age-details">
                <p><strong>Всього за 7 років:</strong> ${formatCurrency(ageGroupCosts.breakdown.ages6to12.totalForPeriod)}</p>
                <p><strong>Середньорічно:</strong> ${formatCurrency(ageGroupCosts.breakdown.ages6to12.averagePerYear)}</p>
                <ul>
                  <li>Догляд/Школа: ${formatCurrency(ageGroupCosts.breakdown.ages6to12.yearlyChildcare)}/рік</li>
                  <li>Витрати на життя: ${formatCurrency(ageGroupCosts.breakdown.ages6to12.yearlyMonthlyExpenses)}/рік</li>
                  <li>Освітні накопичення: ${formatCurrency(ageGroupCosts.breakdown.ages6to12.yearlyEducationSavings)}/рік</li>
                  <li>Шкільне приладдя/обладнання: ${formatCurrency(ageGroupCosts.breakdown.ages6to12.oneTimeExpenses)}</li>
                </ul>
              </div>
            </div>

            <div class="age-group">
              <h5>13-17 років (Підлітки)</h5>
              <div class="age-details">
                <p><strong>Всього за 5 років:</strong> ${formatCurrency(ageGroupCosts.breakdown.ages13to17.totalForPeriod)}</p>
                <p><strong>Середньорічно:</strong> ${formatCurrency(ageGroupCosts.breakdown.ages13to17.averagePerYear)}</p>
                <ul>
                  <li>Шкільні витрати: ${formatCurrency(ageGroupCosts.breakdown.ages13to17.yearlyChildcare)}/рік</li>
                  <li>Витрати на життя: ${formatCurrency(ageGroupCosts.breakdown.ages13to17.yearlyMonthlyExpenses)}/рік</li>
                  <li>Освітні накопичення: ${formatCurrency(ageGroupCosts.breakdown.ages13to17.yearlyEducationSavings)}/рік</li>
                  <li>Технології/транспортні витрати: ${formatCurrency(ageGroupCosts.breakdown.ages13to17.oneTimeExpenses)}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        ${Object.values(costSavings).some(saving => saving) ? `
          <div class="cost-savings-applied">
            <h4>💰 Застосована економія</h4>
            <ul>
              ${costSavings.handMeDowns ? '<li>✅ Речі від старших дітей: 20% економії на одязі</li>' : ''}
              ${costSavings.genericBrands ? '<li>✅ Загальні марки: 10% економії на їжі</li>' : ''}
              ${costSavings.freeActivities ? '<li>✅ Безкоштовні активності: 30% економії на розвагах</li>' : ''}
              ${costSavings.familyChildcare ? '<li>✅ Сімейний догляд: 25% економії на догляді</li>' : ''}
            </ul>
          </div>
        ` : ''}

        <div class="budgeting-tips">
          <h4>💡 Розумні поради з планування бюджету</h4>
          <ul>
            <li><strong>Почніть рано:</strong> Почніть заощаджувати до вагітності, щоб розподілити витрати в часі</li>
            <li><strong>Освітні накопичення:</strong> Використовуйте спеціальні накопичувальні рахунки для освіти</li>
            <li><strong>Купуйте оптом:</strong> Підгузки, суміші та дитяче харчування під час акцій</li>
            <li><strong>Громадські ресурси:</strong> Бібліотечні програми, парки, безкоштовні активності</li>
            <li><strong>Речі від старших дітей:</strong> Діти швидко виростають з одягу - приймайте подарунки</li>
            <li><strong>Загальні марки:</strong> Дитячі товари та їжа часто ідентичні брендовим</li>
            <li><strong>Профілактичний догляд:</strong> Регулярні огляди запобігають дорогим проблемам зі здоров'ям</li>
          </ul>
        </div>

        <div class="financial-planning">
          <h4>📋 Рекомендації з фінансового планування</h4>
          <ul>
            <li><strong>Резервний фонд:</strong> Створіть резерв на 6-12 місяців витрат до народження дітей</li>
            <li><strong>Страхування життя:</strong> Збільшіть покриття для захисту майбутнього вашої сім'ї</li>
            <li><strong>Медицина:</strong> Перегляньте страхові плани під час відкритої реєстрації</li>
            <li><strong>Податкове планування:</strong> Розберіться з податковими пільгами та FSA на догляд за дітьми</li>
            <li><strong>Заповіти та трасти:</strong> Оновіть документи з планування майна</li>
            <li><strong>Накопичення на освіту:</strong> Рано почніть освітні плани для складного зростання</li>
          </ul>
        </div>

        <div class="ukraine-specific">
          <h4>🇺🇦 Українські особливості</h4>
          <ul>
            <li><strong>Державна підтримка:</strong> Допомога при народженні, щомісячна допомога до 3 років</li>
            <li><strong>Безкоштовна освіта:</strong> Державні школи та дитячі садки</li>
            <li><strong>Медицина:</strong> Державна медицина безкоштовна, приватна — за доплату</li>
            <li><strong>Пільги:</strong> Багатодітні сім'ї мають додаткові пільги</li>
            <li><strong>Родинна підтримка:</strong> Традиційна допомога бабусь і дідусів</li>
          </ul>
        </div>

        <div class="next-steps">
          <h4>🎯 Наступні кроки</h4>
          <ul>
            <li>Перегляньте ваш поточний бюджет та визначте області для оптимізації</li>
            <li>Дослідіть варіанти догляду за дітьми та витрати у вашому регіоні</li>
            <li>Відкрийте спеціальний накопичувальний рахунок для витрат, пов'язаних з дітьми</li>
            <li>Розгляньте збільшення доходу або зменшення інших витрат</li>
            <li>Проконсультуйтеся з фінансовим консультантом щодо планування сім'ї</li>
            <li>Вивчіть роботодавські пільги, такі як допомога з догляду за дітьми</li>
          </ul>
        </div>

        <div class="important-note">
          <h4>📝 Важливі зауваження</h4>
          <p><strong>Університет не включено:</strong> Ці оцінки покривають період від народження до 18 років. Витрати на університет можуть додати 200 000-1 000 000+ грн на дитину.</p>
          <p><strong>Індивідуальні варіації:</strong> Фактичні витрати варіюються залежно від місцезнаходження, способу життя, особливих потреб та сімейних обставин.</p>
          <p><strong>Вплив інфляції:</strong> Витрати зростатимуть з часом - плануйте 10-15% річну інфляцію на витрати.</p>
        </div>
      </div>
    `;
  }
});