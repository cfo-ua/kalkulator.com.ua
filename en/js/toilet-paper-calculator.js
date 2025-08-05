document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('toilet-paper-form');
  const result = document.getElementById('toilet-paper-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const adults = +form.adults.value || 0;
    const teenagers = +form.teenagers.value || 0;
    const children = +form.children.value || 0;
    const toddlers = +form.toddlers.value || 0;
    const paperType = form['paper-type'].value;
    const sheetsPerRoll = +form['sheets-per-roll'].value;
    const sheetSize = form['sheet-size'].value;
    const paperQuality = form['paper-quality'].value;
    const packagePrice = +form['package-price'].value;
    const rollsPerPackage = +form['rolls-per-package'].value;
    const packageType = form['package-type'].value;
    const usageIntensity = form['usage-intensity'].value;
    const specialNeeds = form['special-needs'].value;
    const restockingFrequency = form['restocking-frequency'].value;
    const homeTime = form['home-time'].value;
    const toiletCount = +form['toilet-count'].value;
    const sewageType = form['sewage-type'].value;

    // Validation
    if (adults < 1 || !paperType || !sheetsPerRoll || !sheetSize || !paperQuality || 
        !packagePrice || !rollsPerPackage || !packageType || !usageIntensity || 
        !specialNeeds || !restockingFrequency || !homeTime || !toiletCount || !sewageType) {
      result.innerHTML = '<p style="color:red;">Please fill in all required fields.</p>';
      return;
    }

    const totalPeople = adults + teenagers + children + toddlers;
    if (totalPeople === 0) {
      result.innerHTML = '<p style="color:red;">There must be at least one person in the household.</p>';
      return;
    }

    // Base usage calculation (sheets per person per day)
    let dailyUsagePerPerson = {
      adults: 25,      // average sheets per day for adults
      teenagers: 30,   // teenagers use more
      children: 35,    // children use more per visit
      toddlers: 20     // toddlers use less but more frequently
    };

    // Paper type efficiency factor
    const paperTypeFactors = {
      '1-layer': 1.5,    // need more sheets
      '2-layer': 1.0,    // baseline
      '3-layer': 0.8,    // need fewer sheets
      '4-layer': 0.7,    // premium efficiency
      'bamboo': 0.85,    // good efficiency
      'recycled': 1.1    // slightly more needed
    };

    // Sheet size factor
    const sheetSizeFactors = {
      'small': 1.3,
      'standard': 1.0,
      'large': 0.85,
      'extra-large': 0.75
    };

    // Quality factor
    const qualityFactors = {
      'basic': 1.4,      // more sheets needed due to poor quality
      'good': 1.0,       // baseline
      'premium': 0.8,    // less needed due to strength
      'luxury': 0.7      // minimal sheets needed
    };

    // Usage intensity factor
    const intensityFactors = {
      'low': 0.7,
      'moderate': 1.0,
      'high': 1.4,
      'very-high': 1.8
    };

    // Special needs factor
    const specialNeedsFactors = {
      'none': 1.0,
      'sensitive': 1.1,   // may use more due to gentleness needed
      'medical': 1.5,     // medical conditions require more
      'elderly': 1.3,     // elderly may use more
      'guests': 1.2       // additional usage from guests
    };

    // Home time factor
    const homeTimeFactors = {
      'minimal': 0.6,     // mostly away from home
      'standard': 1.0,    // baseline
      'high': 1.3,        // work from home
      'constant': 1.5     // always home
    };

    // Calculate daily sheets usage per person
    const adultDailySheets = dailyUsagePerPerson.adults * paperTypeFactors[paperType] * 
                           sheetSizeFactors[sheetSize] * qualityFactors[paperQuality] * 
                           intensityFactors[usageIntensity] * specialNeedsFactors[specialNeeds] * 
                           homeTimeFactors[homeTime];
    
    const teenagerDailySheets = dailyUsagePerPerson.teenagers * paperTypeFactors[paperType] * 
                              sheetSizeFactors[sheetSize] * qualityFactors[paperQuality] * 
                              intensityFactors[usageIntensity] * specialNeedsFactors[specialNeeds] * 
                              homeTimeFactors[homeTime];
    
    const childDailySheets = dailyUsagePerPerson.children * paperTypeFactors[paperType] * 
                           sheetSizeFactors[sheetSize] * qualityFactors[paperQuality] * 
                           intensityFactors[usageIntensity] * specialNeedsFactors[specialNeeds] * 
                           homeTimeFactors[homeTime];
    
    const toddlerDailySheets = dailyUsagePerPerson.toddlers * paperTypeFactors[paperType] * 
                             sheetSizeFactors[sheetSize] * qualityFactors[paperQuality] * 
                             intensityFactors[usageIntensity] * specialNeedsFactors[specialNeeds] * 
                             homeTimeFactors[homeTime];

    // Total daily usage
    const totalDailySheets = (adultDailySheets * adults) + (teenagerDailySheets * teenagers) + 
                           (childDailySheets * children) + (toddlerDailySheets * toddlers);

    // Calculate consumption periods
    const dailyRolls = totalDailySheets / sheetsPerRoll;
    const weeklyRolls = dailyRolls * 7;
    const monthlyRolls = dailyRolls * 30.44; // average month
    const yearlyRolls = dailyRolls * 365;

    // Calculate costs
    const pricePerRoll = packagePrice / rollsPerPackage;
    const pricePerSheet = pricePerRoll / sheetsPerRoll;
    
    const dailyCost = totalDailySheets * pricePerSheet;
    const weeklyCost = dailyCost * 7;
    const monthlyCost = dailyCost * 30.44;
    const yearlyCost = dailyCost * 365;

    // Calculate packages needed
    const weeklyPackages = weeklyRolls / rollsPerPackage;
    const monthlyPackages = monthlyRolls / rollsPerPackage;
    const yearlyPackages = yearlyRolls / rollsPerPackage;

    // Bulk buying calculations
    const bulkSavings = {
      'small': 0,      // no savings
      'standard': 0.1, // 10% savings
      'large': 0.2,    // 20% savings
      'bulk': 0.3      // 30% savings
    };

    const potentialSavings = yearlyCost * bulkSavings[packageType];
    const optimizedYearlyCost = yearlyCost - potentialSavings;

    // Storage requirements
    const rollsFor3Months = monthlyRolls * 3;
    const rollsFor6Months = monthlyRolls * 6;
    const storageSpace3Months = Math.ceil(rollsFor3Months * 0.5); // liters approx
    const storageSpace6Months = Math.ceil(rollsFor6Months * 0.5);

    // Format helper functions
    const formatMoney = (amount) => `$${amount.toFixed(0)}`;
    const formatNumber = (num) => num.toFixed(1);
    const formatInteger = (num) => Math.ceil(num);

    // Generate recommendations
    let recommendations = [];
    if (pricePerSheet > 0.02) {
      recommendations.push("💰 Consider more economical toilet paper - current price per sheet is high");
    }
    if (packageType === 'small') {
      recommendations.push("📦 Buy larger packages for 10-30% savings");
    }
    if (usageIntensity === 'very-high') {
      recommendations.push("📏 Try to limit the number of sheets per use");
    }
    if (paperType === '1-layer') {
      recommendations.push("🧻 2-ply paper may be more economical in the long run");
    }
    if (yearlyRolls > 300 * totalPeople) {
      recommendations.push("🔍 Check for excessive usage - expenses are above normal");
    }

    // Generate tips
    let tips = [];
    tips.push("🏪 Buy during sales - toilet paper stores for long periods");
    tips.push("📊 Compare price per sheet, not per roll");
    tips.push("🏠 Store in dry place, protected from pests");
    if (sewageType === 'septic') {
      tips.push("🚽 For septic systems choose quick-dissolving paper");
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Toilet Paper Consumption Analysis</h3>
        
        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">👥 Household Composition</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;background:#e3f2fd;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#1976d2;">
                ${totalPeople}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Total people</p>
            </div>
            <div style="text-align:center;background:#e8f5e8;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#388e3c;">
                ${formatInteger(totalDailySheets)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Sheets per day</p>
            </div>
            <div style="text-align:center;background:#fff3e0;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#f57c00;">
                ${formatNumber(dailyRolls)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Rolls per day</p>
            </div>
          </div>
          <div style="background:#f8f9fa;padding:10px;border-radius:6px;font-size:0.9em;">
            Adults: ${adults}, Teenagers: ${teenagers}, Children: ${children}, Toddlers: ${toddlers}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">📊 Consumption by Period</h4>
          <div style="background:white;padding:15px;border-radius:6px;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8f9fa;">
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Period</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Rolls</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Packages</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Week</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatInteger(weeklyRolls)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatNumber(weeklyPackages)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatMoney(weeklyCost)}</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Month</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatInteger(monthlyRolls)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatNumber(monthlyPackages)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatMoney(monthlyCost)}</td>
                </tr>
                <tr style="background:#e8f5e8;">
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;"><strong>Year</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatInteger(yearlyRolls)}</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatInteger(yearlyPackages)}</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatMoney(yearlyCost)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">💰 Economic Analysis</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#fff3cd;padding:15px;border-radius:6px;">
              <strong>Prices:</strong><br>
              Per roll: ${formatMoney(pricePerRoll)}<br>
              Per sheet: ${pricePerSheet.toFixed(4)}<br>
              Per package: ${formatMoney(packagePrice)}
            </div>
            <div style="background:#d1ecf1;padding:15px;border-radius:6px;">
              <strong>Potential savings:</strong><br>
              Annual: ${formatMoney(potentialSavings)}<br>
              Optimized cost: ${formatMoney(optimizedYearlyCost)}<br>
              Savings: ${(bulkSavings[packageType] * 100).toFixed(0)}%
            </div>
            <div style="background:#f8d7da;padding:15px;border-radius:6px;">
              <strong>Per person per year:</strong><br>
              Rolls: ${formatInteger(yearlyRolls / totalPeople)}<br>
              Cost: ${formatMoney(yearlyCost / totalPeople)}<br>
              Sheets: ${formatInteger(totalDailySheets * 365 / totalPeople)}
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">📦 Stock Planning</h4>
          <div style="background:white;padding:15px;border-radius:6px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
              <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
                <strong>3-month supply:</strong><br>
                Rolls: ${formatInteger(rollsFor3Months)}<br>
                Packages: ${formatInteger(rollsFor3Months / rollsPerPackage)}<br>
                Space: ~${storageSpace3Months} liters<br>
                Cost: ${formatMoney(monthlyCost * 3)}
              </div>
              <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
                <strong>6-month supply:</strong><br>
                Rolls: ${formatInteger(rollsFor6Months)}<br>
                Packages: ${formatInteger(rollsFor6Months / rollsPerPackage)}<br>
                Space: ~${storageSpace6Months} liters<br>
                Cost: ${formatMoney(monthlyCost * 6)}
              </div>
            </div>
            <p style="color:#666;margin-top:10px;font-size:0.9em;">
              💡 Optimal stock: 3-6 months. Toilet paper stores for up to 5 years.
            </p>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#17a2b8;">🧻 Paper Characteristics</h4>
          <div style="background:#d1ecf1;padding:15px;border-radius:6px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
              <div style="color:#0c5460;">
                <strong>Type:</strong> ${getPaperTypeText(paperType)}<br>
                <strong>Quality:</strong> ${getQualityText(paperQuality)}
              </div>
              <div style="color:#0c5460;">
                <strong>Sheets per roll:</strong> ${sheetsPerRoll}<br>
                <strong>Sheet size:</strong> ${getSheetSizeText(sheetSize)}
              </div>
              <div style="color:#0c5460;">
                <strong>Intensity:</strong> ${getIntensityText(usageIntensity)}<br>
                <strong>Special needs:</strong> ${getSpecialNeedsText(specialNeeds)}
              </div>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">💡 Savings Recommendations</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;">
            <ul style="margin:0;color:#155724;">
              ${recommendations.map(rec => `<li style="margin:8px 0;">${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
        ` : ''}

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">📋 Useful Tips</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="color:#383d41;">
              <strong>🛒 Shopping:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>💡 Savings:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Buy packages of 16+ rolls</li>
                <li>Watch for supermarket sales</li>
                <li>Consider subscription delivery</li>
                <li>Compare price per 100 sheets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  // Helper functions for text conversion
  function getPaperTypeText(type) {
    const texts = {
      '1-layer': '1-ply',
      '2-layer': '2-ply',
      '3-layer': '3-ply',
      '4-layer': '4+ ply',
      'bamboo': 'Bamboo',
      'recycled': 'Recycled'
    };
    return texts[type] || type;
  }

  function getQualityText(quality) {
    const texts = {
      'basic': 'Basic',
      'good': 'Good',
      'premium': 'Premium',
      'luxury': 'Luxury'
    };
    return texts[quality] || quality;
  }

  function getSheetSizeText(size) {
    const texts = {
      'small': 'Small',
      'standard': 'Standard',
      'large': 'Large',
      'extra-large': 'Extra large'
    };
    return texts[size] || size;
  }

  function getIntensityText(intensity) {
    const texts = {
      'low': 'Low',
      'moderate': 'Moderate',
      'high': 'High',
      'very-high': 'Very high'
    };
    return texts[intensity] || intensity;
  }

  function getSpecialNeedsText(needs) {
    const texts = {
      'none': 'None',
      'sensitive': 'Sensitive skin',
      'medical': 'Medical conditions',
      'elderly': 'Elderly',
      'guests': 'Frequent guests'
    };
    return texts[needs] || needs;
  }
});