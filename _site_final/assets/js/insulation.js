document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('insulation-form');
  const result = document.getElementById('insulation-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('insulation-length').value);
      const width = parseFloat(document.getElementById('insulation-width').value);
      const application = document.getElementById('insulation-application').value;
      const [atticR, wallR, floorR] = document.getElementById('insulation-climate').value.split(',');
      const existingR = parseFloat(document.getElementById('insulation-existing').value);
      const [rPerCm, costPerSqM] = document.getElementById('insulation-type').value.split(',').map(Number);
      const cavityDepth = parseFloat(document.getElementById('insulation-depth').value);
      
      if (length <= 0 || width <= 0) {
        result.textContent = "Будь ласка, введіть правильні розміри.";
        return;
      }
      
      // Calculate area
      const area = length * width;
      
      // Determine target R-value based on application
      let targetR;
      switch(application) {
        case 'attic':
          targetR = parseInt(atticR.substring(1));
          break;
        case 'wall':
          targetR = parseInt(wallR.substring(1));
          break;
        case 'floor':
        case 'ceiling':
        case 'basement':
          targetR = parseInt(floorR.substring(1));
          break;
        default:
          targetR = parseInt(wallR.substring(1));
      }
      
      // Calculate needed R-value
      const neededR = Math.max(0, targetR - existingR);
      
      // Calculate thickness needed (in cm)
      const thicknessNeeded = neededR / rPerCm;
      
      // Check if it fits in cavity
      const fitsInCavity = thicknessNeeded <= cavityDepth;
      const maxRInCavity = cavityDepth * rPerCm;
      
      // Calculate materials
      let materialCost = area * costPerSqM;
      let installationArea = area;
      
      // Adjust for stud/joist spacing (typically 60cm OC = ~7% area loss)
      if (application === 'wall' || application === 'ceiling') {
        installationArea = area * 0.93; // Account for framing
      }
      
      // Calculate energy savings (rough estimates)
      const currentPerformance = existingR / targetR;
      const newPerformance = (existingR + neededR) / targetR;
      const improvementFactor = (newPerformance - currentPerformance) / (1 - currentPerformance);
      
      // Estimate annual savings based on application (in UAH)
      let baseAnnualSavings;
      switch(application) {
        case 'attic':
          baseAnnualSavings = 15000; // Attic has highest impact
          break;
        case 'wall':
          baseAnnualSavings = 9000;
          break;
        case 'floor':
        case 'basement':
          baseAnnualSavings = 6000;
          break;
        case 'ceiling':
          baseAnnualSavings = 7500;
          break;
        default:
          baseAnnualSavings = 9000;
      }
      
      const estimatedAnnualSavings = baseAnnualSavings * improvementFactor * (area / 100);
      const paybackYears = materialCost / Math.max(estimatedAnnualSavings, 1);
      
      // Calculate bags/packages needed for blown-in
      let packagingInfo = '';
      if (rPerCm <= 3.6) { // Blown-in types
        const bagsNeeded = Math.ceil(area * thicknessNeeded / 3); // ~3 sq m per bag at 1cm
        packagingInfo = `<p>Потрібно мішків: ${bagsNeeded} (покриття задувним способом)</p>`;
      } else { // Batt or foam types
        const battsNeeded = Math.ceil(installationArea / 4); // ~4 sq m per batt package
        packagingInfo = `<p>Потрібно упаковок: ${battsNeeded} (упаковки матів/плит)</p>`;
      }
      
      // Application names in Ukrainian
      const applicationNames = {
        'attic': 'Горище',
        'wall': 'Стіна',
        'floor': 'Підлога',
        'ceiling': 'Стеля',
        'basement': 'Підвал'
      };
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Специфікації проекту:</h4>
          <p>Площа: ${length} м × ${width} м = ${area} м²</p>
          <p>Застосування: ${applicationNames[application]}</p>
          <p>Цільове R-значення: R-${targetR}</p>
          <p>Існуюче R-значення: R-${existingR}</p>
          <p><strong>Додаткове R-значення потрібно: R-${neededR}</strong></p>
        </div>
        
        <div class="result-thickness">
          <h4>Товщина утеплення:</h4>
          <p><strong>Потрібна товщина: ${thicknessNeeded.toFixed(1)} см</strong></p>
          <p>Доступна глибина порожнини: ${cavityDepth} см</p>
          <p>Використання порожнини: ${fitsInCavity ? '✅ Підходить ідеально' : '⚠️ Перевищує глибину порожнини'}</p>
          ${!fitsInCavity ? `
          <p><strong>Максимальне R-значення в порожнині: R-${maxRInCavity.toFixed(0)}</strong></p>
          <p><em>Розгляньте суцільне утеплення або товщі конструкції</em></p>
          ` : ''}
        </div>
        
        <div class="result-materials">
          <h4>Потреби в матеріалах:</h4>
          <p>Площа покриття: ${installationArea.toFixed(0)} м²</p>
          ${packagingInfo}
          <p><strong>Вартість матеріалів: ${materialCost.toFixed(0)} грн</strong></p>
          <p>Вартість за м²: ${costPerSqM.toFixed(2)} грн</p>
        </div>
        
        <div class="result-performance">
          <h4>Енергетична ефективність:</h4>
          <p>Поточний рівень утеплення: ${(currentPerformance * 100).toFixed(0)}% від цільового</p>
          <p>Після модернізації: ${(newPerformance * 100).toFixed(0)}% від цільового</p>
          <p>Покращення ефективності: ${(improvementFactor * 100).toFixed(0)}%</p>
          <p>R-значення на см: R-${rPerCm}</p>
        </div>
        
        <div class="result-savings">
          <h4>Очікувана економія енергії:</h4>
          <p><strong>Річна економія: ${estimatedAnnualSavings.toFixed(0)} грн</strong></p>
          <p>Період окупності: ${paybackYears.toFixed(1)} років</p>
          <p>10-річна економія: ${(estimatedAnnualSavings * 10).toFixed(0)} грн</p>
          <p><em>Економія варіюється залежно від вартості енергії та моделей використання</em></p>
        </div>
        
        <div class="result-installation">
          <h4>Вимоги до монтажу:</h4>
          ${application === 'wall' ? `
          <p>🔧 Реконструкція: задування через невеликі отвори</p>
          <p>🏗️ Нове будівництво: мати між стійками</p>
          ` : ''}
          ${application === 'attic' ? `
          <p>🏠 Доступ: через люк горища або вентиляційні отвори</p>
          <p>🌡️ Герметизація: заклейте щілини перед утепленням</p>
          ` : ''}
          <p>🧤 Безпека: носіть захисне обладнання</p>
          <p>📏 Вимірюйте двічі: перевірте розміри порожнини</p>
          <p>💨 Вентиляція: підтримуйте належний повітряний потік</p>
        </div>
        
        <div class="result-alternatives">
          <h4>Альтернативні рішення:</h4>
          ${!fitsInCavity ? `
          <p>🔧 Суцільне утеплення поверх обшивки</p>
          <p>🏗️ Контррейки для додаткової глибини</p>
          <p>🌡️ Матеріали з вищим R-значенням на см</p>
          ` : ''}
          <p>💰 Знижки: перевірте програми знижок комунальних послуг</p>
          <p>📋 Податкові пільги: доступні державні стимули</p>
        </div>
        
        <div class="result-tips">
          <h4>Професійні рекомендації:</h4>
          <p>🔍 Енергетичний аудит перед великими модернізаціями</p>
          <p>💨 Герметизуйте перед додаванням утеплення</p>
          <p>🌡️ Підтримуйте належні паробар'єри</p>
          <p>📞 Розгляньте професійний монтаж для напилювальної піни</p>
          <p>📋 Перевірте вимоги будівельних норм</p>
        </div>
        
        <div class="result-comfort">
          <h4>Додаткові переваги:</h4>
          <p>🌡️ Покращений контроль температури</p>
          <p>🔇 Зменшена передача шуму</p>
          <p>💧 Кращий контроль вологи</p>
          <p>🏠 Підвищена вартість житла</p>
          <p>🌱 Зменшений вуглецевий слід</p>
        </div>
      `;
    });
  }
});