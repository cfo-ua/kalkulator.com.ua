document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("smart-home-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const homeSize = parseFloat(document.getElementById("homeSize").value);
    const monthlyUtility = parseFloat(document.getElementById("monthlyUtility").value);
    const energyRate = parseFloat(document.getElementById("energyRate").value);
    const thermostatCost = parseFloat(document.getElementById("thermostatCost").value) || 0;
    const lightingCost = parseFloat(document.getElementById("lightingCost").value) || 0;
    const securityCost = parseFloat(document.getElementById("securityCost").value) || 0;
    const plugsCost = parseFloat(document.getElementById("plugsCost").value) || 0;
    const waterCost = parseFloat(document.getElementById("waterCost").value) || 0;
    const energySavingsPercent = parseFloat(document.getElementById("energySavingsPercent").value) / 100;
    const insuranceDiscount = parseFloat(document.getElementById("insuranceDiscount").value) / 100;
    const annualInsurance = parseFloat(document.getElementById("annualInsurance").value);

    // Calculate totals
    const totalDeviceCost = thermostatCost + lightingCost + securityCost + plugsCost + waterCost;
    const annualUtilityCost = monthlyUtility * 12;
    
    // Calculate annual savings
    const annualEnergySavings = annualUtilityCost * energySavingsPercent;
    const annualInsuranceSavings = annualInsurance * insuranceDiscount;
    
    // Estimate additional benefits (adjusted for Ukrainian market)
    const estimatedMaintenanceSavings = homeSize * 25; // 25 UAH per sq meter annually
    const propertyValueIncrease = totalDeviceCost * 0.7; // 70% of device cost added to home value
    
    // Total annual savings
    const totalAnnualSavings = annualEnergySavings + annualInsuranceSavings + estimatedMaintenanceSavings;
    
    // Calculate payback period
    const paybackYears = totalDeviceCost / totalAnnualSavings;
    
    // Calculate 10-year projections
    const tenYearSavings = totalAnnualSavings * 10;
    const netBenefit = tenYearSavings - totalDeviceCost + propertyValueIncrease;
    const roi = ((netBenefit - totalDeviceCost) / totalDeviceCost) * 100;

    // Individual device analysis
    const deviceAnalysis = [];
    
    if (thermostatCost > 0) {
      const thermostatSavings = annualUtilityCost * 0.15; // 15% typical savings
      deviceAnalysis.push({
        name: "Розумний термостат",
        cost: thermostatCost,
        annualSavings: thermostatSavings,
        payback: thermostatCost / thermostatSavings
      });
    }
    
    if (lightingCost > 0) {
      const lightingSavings = annualUtilityCost * 0.08; // 8% typical savings
      deviceAnalysis.push({
        name: "Розумне освітлення",
        cost: lightingCost,
        annualSavings: lightingSavings,
        payback: lightingCost / lightingSavings
      });
    }
    
    if (securityCost > 0) {
      const securitySavings = annualInsuranceSavings + estimatedMaintenanceSavings * 0.3;
      deviceAnalysis.push({
        name: "Система безпеки",
        cost: securityCost,
        annualSavings: securitySavings,
        payback: securityCost / securitySavings
      });
    }

    if (plugsCost > 0) {
      const plugsSavings = annualUtilityCost * 0.05; // 5% typical savings from eliminating phantom loads
      deviceAnalysis.push({
        name: "Розумні розетки/вимикачі",
        cost: plugsCost,
        annualSavings: plugsSavings,
        payback: plugsCost / plugsSavings
      });
    }

    if (waterCost > 0) {
      const waterSavings = estimatedMaintenanceSavings * 0.4; // Water management benefits
      deviceAnalysis.push({
        name: "Управління водою",
        cost: waterCost,
        annualSavings: waterSavings,
        payback: waterCost / waterSavings
      });
    }

    // Sort devices by payback period
    deviceAnalysis.sort((a, b) => a.payback - b.payback);

    // Display results with Ukrainian formatting
    const resultBlock = document.getElementById("smart-home-result");
    resultBlock.innerHTML = `
      <h3>🏠 Аналіз інвестицій у розумний дім</h3>
      
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>💰 Загальні інвестиції</h6>
          <div class="big-number">${Math.round(totalDeviceCost).toLocaleString('uk-UA')} грн</div>
          <p>Початкові витрати на пристрої<br>
          Збільшення вартості: +${Math.round(propertyValueIncrease).toLocaleString('uk-UA')} грн<br>
          ${(Math.round(paybackYears * 10) / 10).toString().replace('.', ',')} років окупності</p>
        </div>
        
        <div class="insight-card success">
          <h6>💡 Річна економія</h6>
          <div class="big-number">${Math.round(totalAnnualSavings).toLocaleString('uk-UA')} грн</div>
          <p>Енергія: ${Math.round(annualEnergySavings).toLocaleString('uk-UA')} грн<br>
          Страхування: ${Math.round(annualInsuranceSavings).toLocaleString('uk-UA')} грн<br>
          Обслуговування: ${Math.round(estimatedMaintenanceSavings).toLocaleString('uk-UA')} грн</p>
        </div>
        
        <div class="insight-card info">
          <h6>📈 10-річна рентабельність</h6>
          <div class="big-number">${Math.round(roi).toString().replace('.', ',')}%</div>
          <p>Чистий прибуток: ${Math.round(netBenefit).toLocaleString('uk-UA')} грн<br>
          Загальна економія: ${Math.round(tenYearSavings).toLocaleString('uk-UA')} грн<br>
          ${roi > 100 ? 'Відмінна' : roi > 50 ? 'Хороша' : roi > 0 ? 'Позитивна' : 'Поганa'} інвестиція</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📊 Аналіз пріоритетності пристроїв</h4>
        
        ${deviceAnalysis.length > 0 ? `
        <div style="display: grid; gap: 1rem; margin-top: 1rem;">
          ${deviceAnalysis.map((device, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid ${index === 0 ? '#28a745' : index === 1 ? '#17a2b8' : '#ffc107'};">
              <div>
                <strong>${index + 1}. ${device.name}</strong><br>
                <small>Вартість: ${Math.round(device.cost).toLocaleString('uk-UA')} грн | Річна економія: ${Math.round(device.annualSavings).toLocaleString('uk-UA')} грн</small>
              </div>
              <div style="text-align: right;">
                <strong>${(Math.round(device.payback * 10) / 10).toString().replace('.', ',')} років</strong><br>
                <small>Період окупності</small>
              </div>
            </div>
          `).join('')}
        </div>
        ` : '<p>Не вибрано пристроїв для аналізу.</p>'}
        
        <div style="margin-top: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px;">
            <strong>💚 Енергетичні переваги:</strong><br>
            • ${(energySavingsPercent * 100).toString().replace('.', ',')}% зниження витрат на комунальні послуги<br>
            • ${Math.round(annualEnergySavings / 12).toLocaleString('uk-UA')} грн щомісячної економії<br>
            • ${Math.round(annualEnergySavings / energyRate).toLocaleString('uk-UA')} кВт·год заощаджується щорічно<br>
            • Зменшення вуглецевого сліду
          </div>
          
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px;">
            <strong>🛡️ Додаткові переваги:</strong><br>
            • Покращена безпека та моніторинг будинку<br>
            • Підвищений комфорт та зручність<br>
            • Дистанційне управління та автоматизація<br>
            • Потенційні знижки на страхування
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${paybackYears <= 3 ? '#d4edda' : paybackYears <= 7 ? '#fff3cd' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${paybackYears <= 3 ? '#28a745' : paybackYears <= 7 ? '#ffc107' : '#dc3545'};">
          <strong>💡 Рекомендація щодо інвестицій:</strong><br>
          ${paybackYears <= 3 ? 
            '🎯 Відмінна інвестиція! Ці пристрої швидко окупляться та забезпечать довгострокову цінність.' :
            paybackYears <= 7 ?
            '✅ Хороша інвестиція з розумним періодом окупності. Розгляньте можливість початку з пристроїв найвищого пріоритету.' :
            '⚠️ Довший період окупності. Зосередьтеся на пристроях з найкращою рентабельністю або розгляньте зменшення витрат.'
          }
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
          <strong>🇺🇦 Особливості для України:</strong><br>
          • Враховано середні українські тарифи на електроенергію<br>
          • Адаптовано для кліматичних умов України<br>
          • Розраховано для типових українських будинків та квартир<br>
          • Врахована економічна ситуація в Україні
        </div>
      </div>
    `;
  });
});