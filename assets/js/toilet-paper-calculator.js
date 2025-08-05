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
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    const totalPeople = adults + teenagers + children + toddlers;
    if (totalPeople === 0) {
      result.innerHTML = '<p style="color:red;">Повинна бути хоча б одна людина у домогосподарстві.</p>';
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
    const formatMoney = (amount) => `${amount.toFixed(0)} грн`;
    const formatNumber = (num) => num.toFixed(1);
    const formatInteger = (num) => Math.ceil(num);

    // Generate recommendations
    let recommendations = [];
    if (pricePerSheet > 0.5) {
      recommendations.push("💰 Розгляньте більш економний туалетний папір - поточна ціна за лист висока");
    }
    if (packageType === 'small') {
      recommendations.push("📦 Купуйте більші упаковки для економії 10-30%");
    }
    if (usageIntensity === 'very-high') {
      recommendations.push("📏 Спробуйте обмежити кількість листів за одне використання");
    }
    if (paperType === '1-layer') {
      recommendations.push("🧻 2-шаровий папір може бути економнішим у довгостроковій перспективі");
    }
    if (yearlyRolls > 300 * totalPeople) {
      recommendations.push("🔍 Перевірте, чи немає надмірного використання - витрати вищі за норму");
    }

    // Generate tips
    let tips = [];
    tips.push("🏪 Купуйте під час акцій - туалетний папір зберігається довго");
    tips.push("📊 Порівнюйте ціну за лист, а не за рулон");
    tips.push("🏠 Зберігайте у сухому місці, захищеному від гризунів");
    if (sewageType === 'septic') {
      tips.push("🚽 Для септиків обирайте швидкорозчинний папір");
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Аналіз споживання туалетного паперу</h3>
        
        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">👥 Склад домогосподарства</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;background:#e3f2fd;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#1976d2;">
                ${totalPeople}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Всього людей</p>
            </div>
            <div style="text-align:center;background:#e8f5e8;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#388e3c;">
                ${formatInteger(totalDailySheets)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Листів на день</p>
            </div>
            <div style="text-align:center;background:#fff3e0;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#f57c00;">
                ${formatNumber(dailyRolls)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Рулонів на день</p>
            </div>
          </div>
          <div style="background:#f8f9fa;padding:10px;border-radius:6px;font-size:0.9em;">
            Дорослі: ${adults}, Підлітки: ${teenagers}, Діти: ${children}, Малюки: ${toddlers}
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">📊 Споживання по періодах</h4>
          <div style="background:white;padding:15px;border-radius:6px;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8f9fa;">
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Період</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Рулони</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Упаковки</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Вартість</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Тиждень</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatInteger(weeklyRolls)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatNumber(weeklyPackages)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatMoney(weeklyCost)}</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Місяць</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatInteger(monthlyRolls)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatNumber(monthlyPackages)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatMoney(monthlyCost)}</td>
                </tr>
                <tr style="background:#e8f5e8;">
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;"><strong>Рік</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatInteger(yearlyRolls)}</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatInteger(yearlyPackages)}</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatMoney(yearlyCost)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">💰 Економічний аналіз</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#fff3cd;padding:15px;border-radius:6px;">
              <strong>Ціни:</strong><br>
              За рулон: ${formatMoney(pricePerRoll)}<br>
              За лист: ${pricePerSheet.toFixed(3)} грн<br>
              За упаковку: ${formatMoney(packagePrice)}
            </div>
            <div style="background:#d1ecf1;padding:15px;border-radius:6px;">
              <strong>Потенційна економія:</strong><br>
              Річна: ${formatMoney(potentialSavings)}<br>
              Оптимізована вартість: ${formatMoney(optimizedYearlyCost)}<br>
              Економія: ${(bulkSavings[packageType] * 100).toFixed(0)}%
            </div>
            <div style="background:#f8d7da;padding:15px;border-radius:6px;">
              <strong>На особу на рік:</strong><br>
              Рулони: ${formatInteger(yearlyRolls / totalPeople)}<br>
              Вартість: ${formatMoney(yearlyCost / totalPeople)}<br>
              Листи: ${formatInteger(totalDailySheets * 365 / totalPeople)}
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">📦 Планування запасів</h4>
          <div style="background:white;padding:15px;border-radius:6px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
              <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
                <strong>Запас на 3 місяці:</strong><br>
                Рулони: ${formatInteger(rollsFor3Months)}<br>
                Упаковки: ${formatInteger(rollsFor3Months / rollsPerPackage)}<br>
                Місце: ~${storageSpace3Months} літрів<br>
                Вартість: ${formatMoney(monthlyCost * 3)}
              </div>
              <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
                <strong>Запас на 6 місяців:</strong><br>
                Рулони: ${formatInteger(rollsFor6Months)}<br>
                Упаковки: ${formatInteger(rollsFor6Months / rollsPerPackage)}<br>
                Місце: ~${storageSpace6Months} літрів<br>
                Вартість: ${formatMoney(monthlyCost * 6)}
              </div>
            </div>
            <p style="color:#666;margin-top:10px;font-size:0.9em;">
              💡 Оптимальний запас: 3-6 місяців. Туалетний папір зберігається до 5 років.
            </p>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#17a2b8;">🧻 Характеристики паперу</h4>
          <div style="background:#d1ecf1;padding:15px;border-radius:6px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
              <div style="color:#0c5460;">
                <strong>Тип:</strong> ${getPaperTypeText(paperType)}<br>
                <strong>Якість:</strong> ${getQualityText(paperQuality)}
              </div>
              <div style="color:#0c5460;">
                <strong>Листів у рулоні:</strong> ${sheetsPerRoll}<br>
                <strong>Розмір листа:</strong> ${getSheetSizeText(sheetSize)}
              </div>
              <div style="color:#0c5460;">
                <strong>Інтенсивність:</strong> ${getIntensityText(usageIntensity)}<br>
                <strong>Особливості:</strong> ${getSpecialNeedsText(specialNeeds)}
              </div>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">💡 Рекомендації з економії</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;">
            <ul style="margin:0;color:#155724;">
              ${recommendations.map(rec => `<li style="margin:8px 0;">${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
        ` : ''}

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">📋 Корисні поради</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="color:#383d41;">
              <strong>🛒 Покупки:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>💡 Економія:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Купуйте упаковки від 16 рулонів</li>
                <li>Стежте за акціями у супермаркетах</li>
                <li>Розгляньте підписку на доставку</li>
                <li>Порівнюйте ціну за 100 листів</li>
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
      '1-layer': '1-шаровий',
      '2-layer': '2-шаровий',
      '3-layer': '3-шаровий',
      '4-layer': '4+ шарів',
      'bamboo': 'Бамбуковий',
      'recycled': 'Переробний'
    };
    return texts[type] || type;
  }

  function getQualityText(quality) {
    const texts = {
      'basic': 'Базова',
      'good': 'Хороша',
      'premium': 'Преміум',
      'luxury': 'Розкішна'
    };
    return texts[quality] || quality;
  }

  function getSheetSizeText(size) {
    const texts = {
      'small': 'Маленький',
      'standard': 'Стандартний',
      'large': 'Великий',
      'extra-large': 'Дуже великий'
    };
    return texts[size] || size;
  }

  function getIntensityText(intensity) {
    const texts = {
      'low': 'Низька',
      'moderate': 'Помірна',
      'high': 'Висока',
      'very-high': 'Дуже висока'
    };
    return texts[intensity] || intensity;
  }

  function getSpecialNeedsText(needs) {
    const texts = {
      'none': 'Немає',
      'sensitive': 'Чутлива шкіра',
      'medical': 'Медичні показання',
      'elderly': 'Похилий вік',
      'guests': 'Часті гості'
    };
    return texts[needs] || needs;
  }
});