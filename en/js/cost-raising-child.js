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
      resultDiv.innerHTML = '<p style="color: red;">Please enter valid household income and number of children.</p>';
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
        oneTime: 1000, // School supplies, sports equipment
        education: costs.educationSavings
      },
      ages13to17: {
        years: 5,
        childcare: costs.privateSchool,
        monthlyExpenses: (costs.food * 1.3 + costs.clothing * 1.2 + costs.healthcare + 
                         costs.activities * 1.4 + costs.housing + costs.transportation * 1.5) * costs.generalMultiplier,
        oneTime: 3000, // Technology, car-related expenses
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
    if (income < 50000) return "Lower Income";
    if (income < 100000) return "Middle Income";
    if (income < 200000) return "Upper Middle Income";
    return "High Income";
  }

  function getAffordabilityAnalysis(percentage, category) {
    if (percentage > 40) {
      return {
        status: "Very Challenging",
        color: "red",
        advice: "Child costs would consume a large portion of income. Consider cost-saving strategies and delayed family planning."
      };
    } else if (percentage > 25) {
      return {
        status: "Challenging",
        color: "orange",
        advice: "Child costs are significant but manageable with careful budgeting and cost-saving measures."
      };
    } else if (percentage > 15) {
      return {
        status: "Manageable",
        color: "yellow",
        advice: "Child costs are reasonable for your income level with good financial planning."
      };
    } else {
      return {
        status: "Comfortable",
        color: "green",
        advice: "Child costs are well within your means, allowing for savings and flexibility."
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

    const childWord = numberOfChildren === 1 ? 'child' : 'children';
    const locationLabel = locationType.replace('-', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>👶 Cost of Raising ${numberOfChildren} ${childWord.charAt(0).toUpperCase() + childWord.slice(1)}</h3>
        
        <div class="affordability-status" style="border-left: 4px solid ${affordabilityAnalysis.color};">
          <h4>Financial Impact: ${affordabilityAnalysis.status}</h4>
          <p>${affordabilityAnalysis.advice}</p>
          <p><strong>${costAsPercentageOfIncome.toFixed(1)}%</strong> of your household income</p>
        </div>

        <div class="cost-overview">
          <div class="overview-grid">
            <div class="overview-item highlight">
              <span class="label">Total Cost (birth to 18):</span>
              <span class="value">$${grandTotal.toLocaleString()}</span>
            </div>
            <div class="overview-item">
              <span class="label">Cost per Child:</span>
              <span class="value">$${totalCostPerChild.toLocaleString()}</span>
            </div>
            <div class="overview-item">
              <span class="label">Annual Cost:</span>
              <span class="value">$${annualCost.toLocaleString()}</span>
            </div>
            <div class="overview-item">
              <span class="label">Monthly Budget Needed:</span>
              <span class="value">$${monthlyBudgetNeeded.toLocaleString()}</span>
            </div>
            <div class="overview-item">
              <span class="label">Location Type:</span>
              <span class="value">${locationLabel}</span>
            </div>
            <div class="overview-item">
              <span class="label">Income Category:</span>
              <span class="value">${incomeCategory}</span>
            </div>
          </div>
        </div>

        <div class="age-breakdown">
          <h4>📊 Costs by Age Group (per child)</h4>
          <div class="age-groups">
            <div class="age-group">
              <h5>Ages 0-2 (Infants/Toddlers)</h5>
              <div class="age-details">
                <p><strong>Total for 3 years:</strong> $${ageGroupCosts.breakdown.ages0to2.totalForPeriod.toLocaleString()}</p>
                <p><strong>Average per year:</strong> $${ageGroupCosts.breakdown.ages0to2.averagePerYear.toLocaleString()}</p>
                <ul>
                  <li>Childcare: $${ageGroupCosts.breakdown.ages0to2.yearlyChildcare.toLocaleString()}/year</li>
                  <li>Living expenses: $${ageGroupCosts.breakdown.ages0to2.yearlyMonthlyExpenses.toLocaleString()}/year</li>
                  <li>Education savings: $${ageGroupCosts.breakdown.ages0to2.yearlyEducationSavings.toLocaleString()}/year</li>
                  <li>One-time costs: $${ageGroupCosts.breakdown.ages0to2.oneTimeExpenses.toLocaleString()}</li>
                </ul>
              </div>
            </div>

            <div class="age-group">
              <h5>Ages 3-5 (Preschoolers)</h5>
              <div class="age-details">
                <p><strong>Total for 3 years:</strong> $${ageGroupCosts.breakdown.ages3to5.totalForPeriod.toLocaleString()}</p>
                <p><strong>Average per year:</strong> $${ageGroupCosts.breakdown.ages3to5.averagePerYear.toLocaleString()}</p>
                <ul>
                  <li>Childcare: $${ageGroupCosts.breakdown.ages3to5.yearlyChildcare.toLocaleString()}/year</li>
                  <li>Living expenses: $${ageGroupCosts.breakdown.ages3to5.yearlyMonthlyExpenses.toLocaleString()}/year</li>
                  <li>Education savings: $${ageGroupCosts.breakdown.ages3to5.yearlyEducationSavings.toLocaleString()}/year</li>
                </ul>
              </div>
            </div>

            <div class="age-group">
              <h5>Ages 6-12 (School Age)</h5>
              <div class="age-details">
                <p><strong>Total for 7 years:</strong> $${ageGroupCosts.breakdown.ages6to12.totalForPeriod.toLocaleString()}</p>
                <p><strong>Average per year:</strong> $${ageGroupCosts.breakdown.ages6to12.averagePerYear.toLocaleString()}</p>
                <ul>
                  <li>Childcare/School: $${ageGroupCosts.breakdown.ages6to12.yearlyChildcare.toLocaleString()}/year</li>
                  <li>Living expenses: $${ageGroupCosts.breakdown.ages6to12.yearlyMonthlyExpenses.toLocaleString()}/year</li>
                  <li>Education savings: $${ageGroupCosts.breakdown.ages6to12.yearlyEducationSavings.toLocaleString()}/year</li>
                  <li>School supplies/equipment: $${ageGroupCosts.breakdown.ages6to12.oneTimeExpenses.toLocaleString()}</li>
                </ul>
              </div>
            </div>

            <div class="age-group">
              <h5>Ages 13-17 (Teenagers)</h5>
              <div class="age-details">
                <p><strong>Total for 5 years:</strong> $${ageGroupCosts.breakdown.ages13to17.totalForPeriod.toLocaleString()}</p>
                <p><strong>Average per year:</strong> $${ageGroupCosts.breakdown.ages13to17.averagePerYear.toLocaleString()}</p>
                <ul>
                  <li>School costs: $${ageGroupCosts.breakdown.ages13to17.yearlyChildcare.toLocaleString()}/year</li>
                  <li>Living expenses: $${ageGroupCosts.breakdown.ages13to17.yearlyMonthlyExpenses.toLocaleString()}/year</li>
                  <li>Education savings: $${ageGroupCosts.breakdown.ages13to17.yearlyEducationSavings.toLocaleString()}/year</li>
                  <li>Technology/car expenses: $${ageGroupCosts.breakdown.ages13to17.oneTimeExpenses.toLocaleString()}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        ${Object.values(costSavings).some(saving => saving) ? `
          <div class="cost-savings-applied">
            <h4>💰 Cost Savings Applied</h4>
            <ul>
              ${costSavings.handMeDowns ? '<li>✅ Hand-me-downs: 20% clothing savings</li>' : ''}
              ${costSavings.genericBrands ? '<li>✅ Generic brands: 10% food savings</li>' : ''}
              ${costSavings.freeActivities ? '<li>✅ Free activities: 30% activity savings</li>' : ''}
              ${costSavings.familyChildcare ? '<li>✅ Family childcare: 25% childcare savings</li>' : ''}
            </ul>
          </div>
        ` : ''}

        <div class="budgeting-tips">
          <h4>💡 Smart Budgeting Tips</h4>
          <ul>
            <li><strong>Start Early:</strong> Begin saving before pregnancy to spread costs over time</li>
            <li><strong>529 Plan:</strong> Use tax-advantaged education savings accounts</li>
            <li><strong>Buy in Bulk:</strong> Diapers, formula, and baby food when on sale</li>
            <li><strong>Community Resources:</strong> Library programs, parks, free activities</li>
            <li><strong>Hand-me-downs:</strong> Kids outgrow clothes quickly - accept donations</li>
            <li><strong>Generic Brands:</strong> Baby products and food often identical to name brands</li>
            <li><strong>Preventive Care:</strong> Regular checkups prevent costly health issues</li>
          </ul>
        </div>

        <div class="financial-planning">
          <h4>📋 Financial Planning Recommendations</h4>
          <ul>
            <li><strong>Emergency Fund:</strong> Build 6-12 months expenses before children arrive</li>
            <li><strong>Life Insurance:</strong> Increase coverage to protect your family's future</li>
            <li><strong>Healthcare:</strong> Review insurance plans during open enrollment</li>
            <li><strong>Tax Planning:</strong> Understand child tax credits and dependent care FSA</li>
            <li><strong>Wills & Trusts:</strong> Update estate planning documents</li>
            <li><strong>College Savings:</strong> Start 529 plans early for compound growth</li>
          </ul>
        </div>

        <div class="next-steps">
          <h4>🎯 Next Steps</h4>
          <ul>
            <li>Review your current budget and identify areas to optimize</li>
            <li>Research childcare options and costs in your area</li>
            <li>Open a dedicated savings account for child-related expenses</li>
            <li>Consider increasing your income or reducing other expenses</li>
            <li>Consult with a financial advisor about family planning</li>
            <li>Look into employer benefits like dependent care assistance</li>
          </ul>
        </div>

        <div class="important-note">
          <h4>📝 Important Notes</h4>
          <p><strong>College Not Included:</strong> These estimates cover birth to age 18. College costs can add $40,000-$200,000+ per child.</p>
          <p><strong>Individual Variation:</strong> Actual costs vary based on location, lifestyle, special needs, and family circumstances.</p>
          <p><strong>Inflation Impact:</strong> Costs will increase over time - plan for 2-3% annual inflation on expenses.</p>
        </div>
      </div>
    `;
  }
});