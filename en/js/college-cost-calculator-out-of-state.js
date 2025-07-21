document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('college-cost-form');
  const result = document.getElementById('college-cost-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const universityType = document.getElementById('university-type').value;
      const location = document.getElementById('location').value;
      const duration = document.getElementById('duration').value;
      const housing = document.getElementById('housing').value;
      const mealPlan = document.getElementById('meal-plan').value;
      const transportation = document.getElementById('transportation').value;
      const homeDistance = document.getElementById('home-distance').value;
      const homeVisits = document.getElementById('home-visits').value;
      const lifestyle = document.getElementById('lifestyle').value;
      const technology = document.getElementById('technology').value;
      const financialAid = document.getElementById('financial-aid').value;
      const work = document.getElementById('work').value;
      
      // Check additional factors
      const needsHealthInsurance = document.getElementById('health-insurance').checked;
      const isInternational = document.getElementById('international').checked;
      const hasLabFees = document.getElementById('lab-fees').checked;
      
      // Validation
      if (!universityType || !location || !duration || !housing || !mealPlan || !transportation || !homeDistance || !homeVisits || !lifestyle || !technology || !financialAid || !work) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Base tuition costs by university type
      const tuitionCosts = {
        'public': 28000,
        'private': 55000,
        'community': 12000,
        'elite': 65000,
        'professional': 60000
      };
      
      // Location multipliers for cost of living
      const locationMultipliers = {
        'major-city': 1.4,
        'medium-city': 1.2,
        'college-town': 1.0,
        'suburban': 0.9,
        'rural': 0.8
      };
      
      // Calculate base costs
      let annualTuition = tuitionCosts[universityType] || 35000;
      
      // Professional school adjustments
      if (universityType === 'professional') {
        if (duration === '4-med') {
          annualTuition = 70000; // Medical school
        } else if (duration === '3-grad') {
          annualTuition = 65000; // Law school
        } else if (duration === '2-grad') {
          annualTuition = 55000; // MBA
        }
      }
      
      // International student fee
      if (isInternational) {
        annualTuition += 2000;
      }
      
      // Housing costs
      const housingCosts = {
        'dorm-standard': 12000,
        'dorm-suite': 15000,
        'off-campus-shared': 8000,
        'off-campus-studio': 15000,
        'homestay': 10000,
        'commute': 2000
      };
      
      let annualHousing = (housingCosts[housing] || 12000) * locationMultipliers[location];
      
      // Meal plan costs
      const mealCosts = {
        'unlimited': 5500,
        '14-meals': 4500,
        '10-meals': 3500,
        'partial-cook': 3000,
        'self-cook': 2500
      };
      
      let annualMeals = (mealCosts[mealPlan] || 4000) * locationMultipliers[location];
      
      // Books and supplies
      let annualBooks = 1200;
      if (universityType === 'professional') {
        annualBooks = 2000;
      }
      if (hasLabFees) {
        annualBooks += 800;
      }
      
      // Transportation costs
      const transportationCosts = {
        'none': 200,
        'public': 1000,
        'car': 3000,
        'car-payments': 6000
      };
      
      let annualTransportation = transportationCosts[transportation] || 1000;
      
      // Home visit costs
      const visitCosts = {
        'local': { 'none': 0, 'semester': 200, 'holidays': 400, 'monthly': 800 },
        'regional': { 'none': 0, 'semester': 600, 'holidays': 1200, 'monthly': 3000 },
        'national': { 'none': 0, 'semester': 1200, 'holidays': 2400, 'monthly': 6000 },
        'international': { 'none': 0, 'semester': 2000, 'holidays': 4000, 'monthly': 10000 }
      };
      
      let annualVisits = visitCosts[homeDistance]?.[homeVisits] || 0;
      
      // Personal expenses by lifestyle
      const lifestyleCosts = {
        'minimal': 2000,
        'modest': 3500,
        'moderate': 5000,
        'comfortable': 7500,
        'high': 12000
      };
      
      let annualPersonal = (lifestyleCosts[lifestyle] || 4000) * locationMultipliers[location];
      
      // Technology costs
      const techCosts = {
        'basic': 200,
        'laptop': 1500,
        'premium': 3000,
        'specialized': 5000
      };
      
      let annualTechnology = techCosts[technology] || 1000;
      
      // Health insurance
      let annualHealthInsurance = 0;
      if (needsHealthInsurance) {
        annualHealthInsurance = 2500;
      }
      
      // Calculate total annual cost
      let totalAnnual = annualTuition + annualHousing + annualMeals + annualBooks + 
                      annualTransportation + annualVisits + annualPersonal + 
                      annualTechnology + annualHealthInsurance;
      
      // Apply financial aid reductions
      const aidReductions = {
        'none': 0,
        'merit': 0.15,
        'need': 0.25,
        'significant': 0.4
      };
      
      let aidReduction = totalAnnual * (aidReductions[financialAid] || 0);
      
      // Work income
      const workIncome = {
        'none': 0,
        'work-study': 2000,
        'part-time': 5000,
        'internship': 8000
      };
      
      let annualIncome = workIncome[work] || 0;
      
      // Net annual cost after aid and income
      let netAnnual = totalAnnual - aidReduction - annualIncome;
      netAnnual = Math.max(netAnnual, 0);
      
      // Calculate total program cost
      let programYears = 4;
      if (duration.includes('-')) {
        programYears = parseInt(duration.split('-')[0]);
      } else {
        programYears = parseInt(duration);
      }
      
      let totalProgramCost = netAnnual * programYears;
      
      // Cost breakdown
      const breakdown = {
        tuition: annualTuition,
        housing: annualHousing,
        meals: annualMeals,
        books: annualBooks,
        transportation: annualTransportation,
        visits: annualVisits,
        personal: annualPersonal,
        technology: annualTechnology,
        insurance: annualHealthInsurance
      };
      
      // Generate recommendations
      let tips = [];
      let warnings = [];
      
      if (totalAnnual > 70000) {
        warnings.push("💸 High annual costs - consider more affordable alternatives");
        tips.push("Look into community college for first 2 years to reduce costs");
      }
      
      if (annualHousing > 15000) {
        tips.push("🏠 Consider shared off-campus housing to reduce accommodation costs");
      }
      
      if (aidReduction === 0) {
        tips.push("💰 Apply for scholarships and financial aid to reduce costs");
      }
      
      if (annualIncome === 0) {
        tips.push("💼 Consider work-study or part-time employment to offset expenses");
      }
      
      if (location === 'major-city') {
        tips.push("🏙️ Major cities are expensive - budget carefully for higher living costs");
      }
      
      if (totalProgramCost > 200000) {
        warnings.push("⚠️ Very high total program cost - ensure career prospects justify investment");
      }
      
      // Determine affordability level
      let affordabilityLevel = '';
      let cardClass = '';
      let recommendation = '';
      
      if (netAnnual < 30000) {
        affordabilityLevel = 'Affordable';
        cardClass = 'success';
        recommendation = 'This appears to be within a reasonable cost range for most families.';
      } else if (netAnnual < 50000) {
        affordabilityLevel = 'Moderate';
        cardClass = 'info';
        recommendation = 'Costs are moderate. Consider financial planning and aid options.';
      } else if (netAnnual < 70000) {
        affordabilityLevel = 'Expensive';
        cardClass = 'warning';
        recommendation = 'High costs require careful financial planning and aid seeking.';
      } else {
        affordabilityLevel = 'Very Expensive';
        cardClass = 'warning';
        recommendation = 'Very high costs. Consider alternatives or ensure strong ROI potential.';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>💰 Annual Cost</h6>
            <div class="big-number">$${netAnnual.toLocaleString()}</div>
            <p class="insight-detail">${affordabilityLevel}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🎓 Total Program</h6>
            <div class="big-number">$${totalProgramCost.toLocaleString()}</div>
            <p class="insight-detail">${programYears} Years</p>
          </div>
          
          <div class="insight-card info">
            <h6>💸 Before Aid</h6>
            <div class="big-number">$${totalAnnual.toLocaleString()}</div>
            <p class="insight-detail">Gross Annual Cost</p>
          </div>
          
          <div class="insight-card success">
            <h6>💝 Savings</h6>
            <div class="big-number">$${(aidReduction + annualIncome).toLocaleString()}</div>
            <p class="insight-detail">Aid + Income</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>📊 Cost Assessment</h4>
          <p><strong>${recommendation}</strong></p>
        </div>`;
      
      // Add detailed breakdown
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📋 Annual Cost Breakdown</h4>
          <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
            <tr style="background: var(--card-bg); font-weight: bold;">
              <td style="padding: 0.5rem; border: 1px solid var(--border);">Category</td>
              <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: right;">Annual Cost</td>
            </tr>`;
      
      const categoryNames = {
        tuition: '🎓 Tuition & Fees',
        housing: '🏠 Housing',
        meals: '🍽️ Meals',
        books: '📚 Books & Supplies',
        transportation: '🚗 Transportation',
        visits: '✈️ Home Visits',
        personal: '💳 Personal Expenses',
        technology: '💻 Technology',
        insurance: '🏥 Health Insurance'
      };
      
      Object.entries(breakdown).forEach(([key, value]) => {
        if (value > 0) {
          resultHTML += `
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--border);">${categoryNames[key]}</td>
              <td style="padding: 0.5rem; border: 1px solid var(--border); text-align: right;">$${value.toLocaleString()}</td>
            </tr>`;
        }
      });
      
      resultHTML += `</table></div>`;
      
      // Add warnings if any
      if (warnings.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⚠️ Cost Concerns</h4>
            <ul>`;
        warnings.forEach(warning => {
          resultHTML += `<li>${warning}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add tips if any
      if (tips.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Money-Saving Tips</h4>
            <ul>`;
        tips.forEach(tip => {
          resultHTML += `<li>${tip}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add planning timeline
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📅 Financial Planning Timeline</h4>
          <ul>
            <li><strong>2+ years before:</strong> Start saving, research scholarships</li>
            <li><strong>1 year before:</strong> Apply for financial aid, FAFSA</li>
            <li><strong>6 months before:</strong> Finalize housing, meal plans</li>
            <li><strong>3 months before:</strong> Budget for books, technology needs</li>
            <li><strong>1 month before:</strong> Set up bank accounts, payment plans</li>
          </ul>
        </div>`;
      
      // Add comparison note
      resultHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 8px;">
          <h4>💭 Financial Planning Notes</h4>
          <p><strong>Monthly budget:</strong> $${Math.round(netAnnual/12).toLocaleString()}/month during school</p>
          <p><strong>Debt consideration:</strong> If borrowing, aim for total debt less than expected first-year salary</p>
          <p><strong>ROI planning:</strong> Research typical starting salaries in your field to assess value</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
});