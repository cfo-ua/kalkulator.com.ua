document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('ideal-weight-form');
  const result = document.getElementById('ideal-weight-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const gender = form['gender'].value;
    const heightCm = +form['height-cm'].value;
    const currentWeightInput = +form['current-weight'].value || 0;
    const weightUnit = form['weight-unit'].value;
    const age = +form['age'].value || 0;
    const frameSize = form['frame-size'].value;

    // Validation
    if (!gender || !heightCm) {
      result.innerHTML = '<p style="color:red;">Будь ласка, вкажіть стать та зріст.</p>';
      return;
    }

    if (heightCm < 120 || heightCm > 220) {
      result.innerHTML = '<p style="color:red;">Будь ласка, вкажіть реалістичний зріст (120-220 см).</p>';
      return;
    }

    // Convert height to inches for formulas
    const totalInches = heightCm / 2.54;

    // Validate current weight if provided
    if (currentWeightInput > 0) {
      if (weightUnit === 'kg') {
        if (currentWeightInput < 30 || currentWeightInput > 300) {
          result.innerHTML = '<p style="color:red;">Будь ласка, вкажіть реалістичну вагу (30-300 кг).</p>';
          return;
        }
      } else {
        if (currentWeightInput < 70 || currentWeightInput > 660) {
          result.innerHTML = '<p style="color:red;">Будь ласка, вкажіть реалістичну вагу (70-660 фунтів).</p>';
          return;
        }
      }
    }

    // Convert current weight to kg for calculations
    const currentWeightKg = weightUnit === 'lbs' ? currentWeightInput / 2.20462 : currentWeightInput;

    // Calculate ideal weights using different formulas
    const results = {};

    // 1. BMI Method (healthy range)
    const heightMeters = heightCm / 100;
    const bmiLowWeight = 18.5 * heightMeters * heightMeters;
    const bmiHighWeight = 24.9 * heightMeters * heightMeters;
    results.bmi = { low: bmiLowWeight, high: bmiHighWeight };

    // 2. Devine Formula
    // Men: 50 kg + 2.3 kg × (height in inches - 60)
    // Women: 45.5 kg + 2.3 kg × (height in inches - 60)
    const devineBase = gender === 'male' ? 50 : 45.5;
    const devineKg = devineBase + 2.3 * (totalInches - 60);
    results.devine = devineKg;

    // 3. Hamwi Formula
    // Men: 48 kg + 2.7 kg × (height in inches - 60)
    // Women: 45.5 kg + 2.2 kg × (height in inches - 60)
    const hamwiBase = gender === 'male' ? 48 : 45.5;
    const hamwiMultiplier = gender === 'male' ? 2.7 : 2.2;
    const hamwiKg = hamwiBase + hamwiMultiplier * (totalInches - 60);
    results.hamwi = hamwiKg;

    // 4. Robinson Formula
    // Men: 52 kg + 1.9 kg × (height in inches - 60)
    // Women: 49 kg + 1.7 kg × (height in inches - 60)
    const robinsonBase = gender === 'male' ? 52 : 49;
    const robinsonMultiplier = gender === 'male' ? 1.9 : 1.7;
    const robinsonKg = robinsonBase + robinsonMultiplier * (totalInches - 60);
    results.robinson = robinsonKg;

    // 5. Miller Formula
    // Men: 56.2 kg + 1.41 kg × (height in inches - 60)
    // Women: 53.1 kg + 1.36 kg × (height in inches - 60)
    const millerBase = gender === 'male' ? 56.2 : 53.1;
    const millerMultiplier = gender === 'male' ? 1.41 : 1.36;
    const millerKg = millerBase + millerMultiplier * (totalInches - 60);
    results.miller = millerKg;

    // Frame size adjustments (±10% for small/large frames)
    const frameAdjustment = frameSize === 'small' ? 0.9 : frameSize === 'large' ? 1.1 : 1.0;

    // Calculate averages and ranges
    const formulaWeights = [results.devine, results.hamwi, results.robinson, results.miller];
    const adjustedWeights = formulaWeights.map(weight => weight * frameAdjustment);
    const averageWeight = adjustedWeights.reduce((sum, weight) => sum + weight, 0) / adjustedWeights.length;
    const minFormulaWeight = Math.min(...adjustedWeights);
    const maxFormulaWeight = Math.max(...adjustedWeights);

    // Current BMI calculation
    let currentBMI = 0;
    let bmiCategory = '';
    let bmiColor = '#666';
    
    if (currentWeightKg > 0) {
      currentBMI = currentWeightKg / (heightMeters * heightMeters);
      
      if (currentBMI < 18.5) {
        bmiCategory = 'Недостатня вага';
        bmiColor = '#2196f3';
      } else if (currentBMI < 25) {
        bmiCategory = 'Нормальна вага';
        bmiColor = '#4caf50';
      } else if (currentBMI < 30) {
        bmiCategory = 'Надмірна вага';
        bmiColor = '#ff9800';
      } else {
        bmiCategory = 'Ожиріння';
        bmiColor = '#f44336';
      }
    }

    // Weight difference calculation
    let weightDifference = 0;
    let differenceText = '';
    let differenceColor = '#666';
    
    if (currentWeightKg > 0) {
      weightDifference = currentWeightKg - averageWeight;
      if (Math.abs(weightDifference) < 2.5) {
        differenceText = 'В діапазоні ідеальної ваги';
        differenceColor = '#4caf50';
      } else if (weightDifference > 0) {
        differenceText = `${Math.abs(weightDifference).toFixed(1)} кг вище ідеальної`;
        differenceColor = '#ff9800';
      } else {
        differenceText = `${Math.abs(weightDifference).toFixed(1)} кг нижче ідеальної`;
        differenceColor = '#2196f3';
      }
    }

    // Format numbers
    const formatWeight = (weight) => Math.round(weight);
    const formatWeightLbs = (weight) => Math.round(weight * 2.20462);

    // Age-related adjustment note
    const ageAdjustment = age > 40 ? Math.floor((age - 40) / 10) * 2.5 : 0;

    const frameText = frameSize === 'small' ? 'малий' : frameSize === 'large' ? 'великий' : 'середній';
    const genderText = gender === 'male' ? 'Чоловік' : 'Жінка';

    result.innerHTML = `
      <div class="mental-health-results">
        <h3 style="color: #2e7d32; margin-top: 0; text-align: center;">⚖️ Аналіз вашої ідеальної ваги</h3>
        
        <div class="insight-card info" style="text-align: center; margin: 15px 0;">
          <p style="margin: 5px 0; color: #666;">
            <strong>Профіль:</strong> ${genderText}, ${heightCm} см, ${frameText} тип тілобудови
          </p>
        </div>

        <div class="insight-cards">
          <div class="insight-card success">
            <h6>🎯 Середня ідеальна вага</h6>
            <div class="big-number">${formatWeight(averageWeight)} кг</div>
            <p>${formatWeightLbs(averageWeight)} фунтів</p>
          </div>
          
          <div class="insight-card info">
            <h6>📊 Здоровий діапазон ІМТ</h6>
            <div class="big-number">${formatWeight(bmiLowWeight)}-${formatWeight(bmiHighWeight)}</div>
            <p>кг (ІМТ 18,5-24,9)</p>
          </div>
          
          ${currentWeightKg > 0 ? `
          <div class="insight-card" style="border-color: ${bmiColor};">
            <h6>📈 Поточний статус</h6>
            <div class="big-number" style="color: ${bmiColor};">${bmiCategory}</div>
            <p>ІМТ: ${currentBMI.toFixed(1)}</p>
          </div>
          ` : `
          <div class="insight-card warning">
            <h6>📝 Діапазон формул</h6>
            <div class="big-number">${formatWeight(minFormulaWeight)}-${formatWeight(maxFormulaWeight)}</div>
            <p>кг варіація</p>
          </div>
          `}
        </div>

        ${currentWeightKg > 0 ? `
        <div class="insight-card ${weightDifference < 2.5 ? 'success' : 'warning'}" style="margin: 20px 0;">
          <h4 style="color: ${differenceColor}; margin-top: 0; text-align: center;">📊 Аналіз ваги</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; text-align: center;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #333;">Поточна вага</div>
              <div style="font-size: 1.3rem; margin: 5px 0;">${formatWeight(currentWeightKg)} кг</div>
              <div style="font-size: 0.9rem; color: #666;">${formatWeightLbs(currentWeightKg)} фунтів</div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #333;">Різниця</div>
              <div style="font-size: 1.3rem; margin: 5px 0; color: ${differenceColor};">${differenceText}</div>
              <div style="font-size: 0.9rem; color: #666;">Від середньої ідеальної</div>
            </div>
          </div>
        </div>
        ` : ''}

        <div class="insight-card info" style="margin: 20px 0;">
          <h4 style="color: #1565c0; margin-top: 0; text-align: center;">🔬 Розбивка за формулами</h4>
          
          <div style="display: grid; gap: 12px;">
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🏥 Метод ІМТ (діапазон):</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(bmiLowWeight)}-${formatWeight(bmiHighWeight)} кг</span>
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>⚕️ Формула Девіна:</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(results.devine * frameAdjustment)} кг</span>
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🔬 Формула Хамві:</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(results.hamwi * frameAdjustment)} кг</span>
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>📈 Формула Робінсона:</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(results.robinson * frameAdjustment)} кг</span>
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🧮 Формула Міллера:</strong></span>
              <span style="color: #1565c0; font-weight: bold;">${formatWeight(results.miller * frameAdjustment)} кг</span>
            </div>
          </div>
          
          ${frameAdjustment !== 1.0 ? `
          <div style="background: rgba(255,255,255,0.8); padding: 12px; border-radius: 6px; margin-top: 15px;">
            <p style="margin: 0; font-style: italic; color: #1565c0;">
              <strong>Примітка:</strong> Ваги скореговані ${frameAdjustment > 1 ? 'вгору' : 'вниз'} на 10% для ${frameText} типу тілобудови.
            </p>
          </div>
          ` : ''}
        </div>

        <div class="insight-card warning" style="margin: 20px 0;">
          <h4 style="color: #e65100; margin-top: 0; text-align: center;">💡 Рекомендації</h4>
          
          <div style="display: grid; gap: 10px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">🎯 Цільовий діапазон:</strong> Прагніть до ${formatWeight(averageWeight - 5)}-${formatWeight(averageWeight + 5)} кг для гнучкості та сталості.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">⚖️ Здоровий підхід:</strong> Зосередьтеся на поступових змінах, максимум 0,5-1 кг втрати ваги на тиждень.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">🏋️ Більше ніж вага:</strong> Враховуйте склад тіла, рівень фітнесу та загальні показники здоров'я.
            </div>
            
            ${ageAdjustment > 0 ? `
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">📅 Віковий фактор:</strong> У віці ${age} років додавання ${ageAdjustment} кг до ідеальної ваги часто є прийнятним.
            </div>
            ` : ''}
          </div>
        </div>

        <div class="insight-card" style="margin: 20px 0; border-color: #9c27b0;">
          <h4 style="color: #6a1b9a; margin-top: 0; text-align: center;">📋 Рекомендації для здоров'я</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #6a1b9a; margin-top: 0;">🥗 Харчування</h6>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                <li>Збалансовані макронутрієнти</li>
                <li>Контроль порцій</li>
                <li>Цільні продукти</li>
                <li>Достатня гідратація</li>
              </ul>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #6a1b9a; margin-top: 0;">🏃 Фізичні вправи</h6>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                <li>150 хв кардіо/тиждень</li>
                <li>Силові тренування 2-3р</li>
                <li>Щоденний рух</li>
                <li>Поступові виклики</li>
              </ul>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #6a1b9a; margin-top: 0;">😴 Спосіб життя</h6>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                <li>7-9 годин сну</li>
                <li>Управління стресом</li>
                <li>Регулярні огляди</li>
                <li>Постійний режим</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="disclaimer" style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            ⚖️ <strong>Пам'ятайте:</strong> Це загальні рекомендації. Індивідуальна оптимальна вага варіюється залежно від генетики, м'язової маси, стану здоров'я та особистих факторів. Консультуйтеся з медичними працівниками для персональних порад.
          </p>
        </div>
      </div>
    `;

    // Scroll to results
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});