document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('toothpaste-form');
  const result = document.getElementById('toothpaste-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const tubeVolume = +form['tube-volume'].value;
    const tubePrice = +form['tube-price'].value;
    const usersCount = +form['users-count'].value;
    const adults = +form.adults.value || 0;
    const teenagers = +form.teenagers.value || 0;
    const children = +form.children.value || 0;
    const toddlers = +form.toddlers.value || 0;
    const brushingFrequency = +form['brushing-frequency'].value;
    const pasteAmount = +form['paste-amount'].value;
    const brushType = form['brush-type'].value;
    const brushingTechnique = form['brushing-technique'].value;
    const pasteType = form['paste-type'].value;
    const pasteConsistency = form['paste-consistency'].value;
    const pasteDensity = form['paste-density'].value;
    const specialNeeds = form['special-needs'].value;
    const lifestyle = form.lifestyle.value;
    const diet = form.diet.value;
    const storage = form.storage.value;
    const squeezingMethod = form['squeezing-method'].value;
    const sharing = form.sharing.value;

    // Validation
    if (!tubeVolume || !tubePrice || !usersCount || !brushingFrequency || !pasteAmount || 
        !brushType || !brushingTechnique || !pasteType || !pasteConsistency || 
        !pasteDensity || !specialNeeds || !lifestyle || !diet || !storage || 
        !squeezingMethod || !sharing) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі обов\'язкові поля.</p>';
      return;
    }

    const totalUsers = adults + teenagers + children + toddlers;
    if (totalUsers !== usersCount) {
      result.innerHTML = '<p style="color:red;">Кількість людей не збігається з розкладом по віковим групам.</p>';
      return;
    }

    // Base paste consumption factors
    let baseUsagePerBrushing = pasteAmount; // grams

    // Age-specific factors
    const ageFactors = {
      adults: 1.0,
      teenagers: 0.9,
      children: 0.6,
      toddlers: 0.3
    };

    // Brush type factor
    const brushTypeFactors = {
      'manual': 1.0,
      'electric': 0.8,    // more efficient, needs less paste
      'sonic': 0.75,      // most efficient
      'mixed': 0.9
    };

    // Brushing technique factor
    const techniqueFactors = {
      'basic': 1.2,       // wastes more paste
      'standard': 1.0,
      'thorough': 1.1,    // uses slightly more due to longer brushing
      'professional': 0.9  // most efficient technique
    };

    // Paste type factor
    const pasteTypeFactors = {
      'fluoride': 1.0,
      'whitening': 1.1,    // often used more liberally
      'sensitive': 0.9,    // users tend to be more careful
      'natural': 1.0,
      'therapeutic': 0.9,  // expensive, used carefully
      'children': 0.8      // specifically designed for small amounts
    };

    // Consistency factor
    const consistencyFactors = {
      'gel': 1.1,         // tends to flow more, waste more
      'paste': 1.0,
      'thick': 0.9,       // less likely to waste
      'powder': 0.7       // very concentrated
    };

    // Density factor
    const densityFactors = {
      'light': 1.2,       // more volume needed
      'medium': 1.0,
      'dense': 0.8        // concentrated formula
    };

    // Special needs factor
    const specialNeedsFactors = {
      'none': 1.0,
      'braces': 1.3,      // need more thorough cleaning
      'gum-disease': 1.2, // longer brushing time
      'sensitive-teeth': 0.9, // careful usage
      'smoker': 1.4,      // need more cleaning
      'coffee-tea': 1.1   // stain removal
    };

    // Lifestyle factor
    const lifestyleFactors = {
      'sedentary': 1.0,
      'active': 1.1,      // more frequent brushing after sports
      'travel': 0.9,      // sometimes skip brushing
      'irregular': 0.8    // inconsistent habits
    };

    // Diet factor
    const dietFactors = {
      'balanced': 1.0,
      'sweet': 1.2,       // need more frequent cleaning
      'acidic': 1.1,      // need gentle but thorough cleaning
      'coffee-wine': 1.15, // staining foods
      'healthy': 0.95     // less plaque formation
    };

    // Storage factor (affects waste)
    const storageFactors = {
      'careful': 1.0,
      'normal': 1.1,      // some waste from drying
      'careless': 1.3     // significant waste
    };

    // Squeezing method factor
    const squeezingFactors = {
      'end': 1.0,         // efficient
      'middle': 1.2,      // wasteful
      'random': 1.4,      // very wasteful
      'tool': 0.95       // most efficient
    };

    // Sharing factor
    const sharingFactors = {
      'individual': 1.0,
      'family': 1.1,      // coordination issues
      'couples': 1.05,    // minor coordination issues
      'mixed': 0.95       // optimized per person
    };

    // Calculate weighted daily usage
    let weightedDailyUsage = 0;
    
    if (adults > 0) {
      weightedDailyUsage += adults * baseUsagePerBrushing * brushingFrequency * ageFactors.adults;
    }
    if (teenagers > 0) {
      weightedDailyUsage += teenagers * baseUsagePerBrushing * brushingFrequency * ageFactors.teenagers;
    }
    if (children > 0) {
      weightedDailyUsage += children * baseUsagePerBrushing * brushingFrequency * ageFactors.children;
    }
    if (toddlers > 0) {
      weightedDailyUsage += toddlers * baseUsagePerBrushing * brushingFrequency * ageFactors.toddlers;
    }

    // Apply all modifying factors
    weightedDailyUsage *= brushTypeFactors[brushType] *
                          techniqueFactors[brushingTechnique] *
                          pasteTypeFactors[pasteType] *
                          consistencyFactors[pasteConsistency] *
                          densityFactors[pasteDensity] *
                          specialNeedsFactors[specialNeeds] *
                          lifestyleFactors[lifestyle] *
                          dietFactors[diet] *
                          storageFactors[storage] *
                          squeezingFactors[squeezingMethod] *
                          sharingFactors[sharing];

    // Convert tube volume to grams (approximate density: 1ml ≈ 1.3g for toothpaste)
    const tubeWeightGrams = tubeVolume * 1.3;
    
    // Calculate usable amount (accounting for waste at end of tube)
    const usableAmount = tubeWeightGrams * 0.92; // 8% typically remains unusable

    // Calculate duration
    const durationDays = usableAmount / weightedDailyUsage;
    const durationWeeks = durationDays / 7;
    const durationMonths = durationDays / 30.44;

    // Calculate costs
    const costPerDay = tubePrice / durationDays;
    const costPerWeek = costPerDay * 7;
    const costPerMonth = costPerDay * 30.44;
    const costPerYear = costPerDay * 365;
    const costPerPerson = costPerYear / totalUsers;

    // Calculate efficiency metrics
    const gramsPerPerson = weightedDailyUsage / totalUsers;
    const brushesPerTube = usableAmount / (weightedDailyUsage / brushingFrequency);
    const costPerBrush = tubePrice / brushesPerTube;

    // Calculate bulk buying scenarios
    const tubesPerYear = 365 / durationDays;
    const annualCost = tubesPerYear * tubePrice;
    const bulkDiscount = 0.15; // 15% bulk discount
    const bulkAnnualCost = annualCost * (1 - bulkDiscount);
    const annualSavings = annualCost - bulkAnnualCost;

    // Format helper functions
    const formatMoney = (amount) => `${amount.toFixed(0)} грн`;
    const formatDays = (days) => {
      if (days < 7) {
        return `${days.toFixed(1)} днів`;
      } else if (days < 30) {
        return `${(days/7).toFixed(1)} тижнів`;
      } else if (days < 365) {
        return `${(days/30.44).toFixed(1)} місяців`;
      } else {
        return `${(days/365).toFixed(1)} років`;
      }
    };

    // Generate recommendations
    let recommendations = [];
    if (weightedDailyUsage > 3) {
      recommendations.push("📏 Спробуйте використовувати менше пасти - горошина розміром з рисинку достатньо");
    }
    if (squeezingMethod === 'random' || squeezingMethod === 'middle') {
      recommendations.push("💡 Витискайте пасту з кінця тюбика для економії");
    }
    if (storage === 'careless') {
      recommendations.push("🔒 Завжди закривайте тюбик після використання");
    }
    if (pasteAmount > 1.0) {
      recommendations.push("⚖️ Зменшіть кількість пасти - великі порції не покращують чищення");
    }
    if (costPerYear > 1500) {
      recommendations.push("💰 Розгляньте більш економний бренд або купуйте оптом");
    }
    if (sharing === 'family' && totalUsers > 3) {
      recommendations.push("👨‍👩‍👧‍👦 Для великої сім'ї економніше купувати великі тюбики");
    }

    // Generate tips
    let tips = [];
    tips.push("🦷 Якість чищення залежить від техніки, а не від кількості пасти");
    tips.push("⏰ Чистіть зуби мінімум 2 хвилини для ефективного видалення нальоту");
    tips.push("🔄 Міняйте зубну щітку кожні 3-4 місяці");
    if (specialNeeds !== 'none') {
      tips.push("👨‍⚕️ Консультуйтесь зі стоматологом щодо спеціальних потреб");
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Аналіз споживання зубної пасти</h3>
        
        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">📊 Основні показники</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;background:#e3f2fd;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#1976d2;">
                ${formatDays(durationDays)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Тривалість тюбика</p>
            </div>
            <div style="text-align:center;background:#e8f5e8;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#388e3c;">
                ${formatMoney(costPerDay)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Вартість на день</p>
            </div>
            <div style="text-align:center;background:#fff3e0;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#f57c00;">
                ${weightedDailyUsage.toFixed(1)} г
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Споживання на день</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">📅 Деталізація споживання</h4>
          <div style="background:white;padding:15px;border-radius:6px;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8f9fa;">
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Показник</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Значення</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Вартість</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Чищень із тюбика</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${Math.round(brushesPerTube)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${costPerBrush.toFixed(2)} грн/чищення</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Споживання на особу</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${gramsPerPerson.toFixed(2)} г/день</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatMoney(costPerPerson)}/рік</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Тижневе споживання</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${(weightedDailyUsage * 7).toFixed(1)} г</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatMoney(costPerWeek)}</td>
                </tr>
                <tr style="background:#e8f5e8;">
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;"><strong>Річне споживання</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${tubesPerYear.toFixed(1)} тюбиків</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatMoney(costPerYear)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">💰 Економічний аналіз</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#fff3cd;padding:15px;border-radius:6px;">
              <strong>Поточні витрати:</strong><br>
              На місяць: ${formatMoney(costPerMonth)}<br>
              На рік: ${formatMoney(annualCost)}<br>
              Тюбиків на рік: ${tubesPerYear.toFixed(1)}
            </div>
            <div style="background:#d1ecf1;padding:15px;border-radius:6px;">
              <strong>Оптові закупівлі:</strong><br>
              Річна економія: ${formatMoney(annualSavings)}<br>
              Оптимізована вартість: ${formatMoney(bulkAnnualCost)}<br>
              Знижка: ${(bulkDiscount * 100).toFixed(0)}%
            </div>
            <div style="background:#f8d7da;padding:15px;border-radius:6px;">
              <strong>Ефективність:</strong><br>
              Грам на особу: ${gramsPerPerson.toFixed(2)}<br>
              Використання тюбика: ${((usableAmount/tubeWeightGrams)*100).toFixed(0)}%<br>
              Втрати: ${(((tubeWeightGrams-usableAmount)/tubeWeightGrams)*100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">👥 Розподіл по віковим групам</h4>
          <div style="background:white;padding:15px;border-radius:6px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;">
              ${adults > 0 ? `
              <div style="background:#f8f9fa;padding:10px;border-radius:6px;">
                <strong>Дорослі (${adults}):</strong><br>
                ${(adults * baseUsagePerBrushing * brushingFrequency * ageFactors.adults).toFixed(1)} г/день
              </div>` : ''}
              ${teenagers > 0 ? `
              <div style="background:#f8f9fa;padding:10px;border-radius:6px;">
                <strong>Підлітки (${teenagers}):</strong><br>
                ${(teenagers * baseUsagePerBrushing * brushingFrequency * ageFactors.teenagers).toFixed(1)} г/день
              </div>` : ''}
              ${children > 0 ? `
              <div style="background:#f8f9fa;padding:10px;border-radius:6px;">
                <strong>Діти (${children}):</strong><br>
                ${(children * baseUsagePerBrushing * brushingFrequency * ageFactors.children).toFixed(1)} г/день
              </div>` : ''}
              ${toddlers > 0 ? `
              <div style="background:#f8f9fa;padding:10px;border-radius:6px;">
                <strong>Малюки (${toddlers}):</strong><br>
                ${(toddlers * baseUsagePerBrushing * brushingFrequency * ageFactors.toddlers).toFixed(1)} г/день
              </div>` : ''}
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#17a2b8;">🧪 Характеристики пасти</h4>
          <div style="background:#d1ecf1;padding:15px;border-radius:6px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
              <div style="color:#0c5460;">
                <strong>Тип пасти:</strong> ${getPasteTypeText(pasteType)}<br>
                <strong>Консистенція:</strong> ${getConsistencyText(pasteConsistency)}<br>
                <strong>Щільність:</strong> ${getDensityText(pasteDensity)}
              </div>
              <div style="color:#0c5460;">
                <strong>Об'єм тюбика:</strong> ${tubeVolume} мл<br>
                <strong>Вага пасти:</strong> ~${tubeWeightGrams.toFixed(0)} г<br>
                <strong>Використовується:</strong> ${usableAmount.toFixed(0)} г
              </div>
              <div style="color:#0c5460;">
                <strong>Щітка:</strong> ${getBrushTypeText(brushType)}<br>
                <strong>Техніка:</strong> ${getTechniqueText(brushingTechnique)}<br>
                <strong>Частота:</strong> ${brushingFrequency} раз/день
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
          <h4 style="margin-top:0;color:#383d41;">📋 Поради для здоров'я зубів</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="color:#383d41;">
              <strong>🦷 Правильне чищення:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>💰 Економні поради:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Купуйте великі тюбики для економії</li>
                <li>Використовуйте пасту розміром з горошину</li>
                <li>Витискайте з кінця тюбика</li>
                <li>Розрізайте тюбик для повного використання</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });

  // Helper functions for text conversion
  function getPasteTypeText(type) {
    const texts = {
      'fluoride': 'Фторидна',
      'whitening': 'Відбілююча',
      'sensitive': 'Для чутливих зубів',
      'natural': 'Натуральна',
      'therapeutic': 'Лікувальна',
      'children': 'Дитяча'
    };
    return texts[type] || type;
  }

  function getConsistencyText(consistency) {
    const texts = {
      'gel': 'Гель',
      'paste': 'Паста',
      'thick': 'Густа',
      'powder': 'Порошок'
    };
    return texts[consistency] || consistency;
  }

  function getDensityText(density) {
    const texts = {
      'light': 'Легка',
      'medium': 'Середня',
      'dense': 'Щільна'
    };
    return texts[density] || density;
  }

  function getBrushTypeText(type) {
    const texts = {
      'manual': 'Мануальна',
      'electric': 'Електрична',
      'sonic': 'Звукова',
      'mixed': 'Змішано'
    };
    return texts[type] || type;
  }

  function getTechniqueText(technique) {
    const texts = {
      'basic': 'Базова',
      'standard': 'Стандартна',
      'thorough': 'Ретельна',
      'professional': 'Професійна'
    };
    return texts[technique] || technique;
  }
});