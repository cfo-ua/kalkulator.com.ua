document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ph-form');
  const result = document.getElementById('ph-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const h = parseFloat(document.getElementById('ph-h').value);
      const oh = parseFloat(document.getElementById('ph-oh').value);
      
      let pH, pOH, calculation;
      
      if (!isNaN(h) && h > 0) {
        pH = -Math.log10(h);
        pOH = 14 - pH;
        calculation = `pH = -log₁₀[H⁺] = -log₁₀(${h}) = ${pH.toFixed(3)}`;
      } else if (!isNaN(oh) && oh > 0) {
        pOH = -Math.log10(oh);
        pH = 14 - pOH;
        calculation = `pOH = -log₁₀[OH⁻] = -log₁₀(${oh}) = ${pOH.toFixed(3)}
        pH = 14 - pOH = 14 - ${pOH.toFixed(3)} = ${pH.toFixed(3)}`;
      } else {
        result.innerHTML = `
          <div style="background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; color: #721c24;">
            <strong>Помилка:</strong> Введіть концентрацію H⁺ або OH⁻ (моль/л).
          </div>
        `;
        return;
      }
      
      let type, typeColor, typeDescription;
      if (pH < 7) {
        type = "Кислий";
        typeColor = "#dc3545";
        typeDescription = "Переважають іони H⁺, має кислі властивості";
      } else if (pH > 7) {
        type = "Лужний (основний)";
        typeColor = "#007bff";
        typeDescription = "Переважають іони OH⁻, має лужні властивості";
      } else {
        type = "Нейтральний";
        typeColor = "#28a745";
        typeDescription = "Рівні концентрації H⁺ та OH⁻";
      }
      
      // Generate pH scale visualization
      const phScale = generatePHScale(pH);
      
      // Get real-world examples
      const examples = getPHExamples(pH);
      
      result.innerHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Результат розрахунку pH</h3>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid ${typeColor}; margin: 15px 0; text-align: center;">
            <div style="font-size: 2.5em; font-weight: bold; color: ${typeColor}; margin-bottom: 10px;">
              pH = ${pH.toFixed(3)}
            </div>
            <div style="font-size: 1.2em; font-weight: bold; color: ${typeColor}; margin-bottom: 5px;">
              ${type}
            </div>
            <div style="color: #666; font-size: 0.9em;">${typeDescription}</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 1.5em; font-weight: bold; color: #1976d2;">pH = ${pH.toFixed(3)}</div>
              <div style="color: #1976d2; font-weight: bold;">Водневий показник</div>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 1.5em; font-weight: bold; color: #f57c00;">pOH = ${pOH.toFixed(3)}</div>
              <div style="color: #f57c00; font-weight: bold;">Гідроксидний показник</div>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #6f42c1; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #6f42c1;">📊 Шкала pH</h4>
            ${phScale}
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #007bff;">🧮 Розрахунок</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; white-space: pre-line;">
              ${calculation}
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #28a745; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #28a745;">🌍 Приклади з реального життя</h4>
            ${examples}
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 15px;">
            <h4 style="margin-top: 0; color: #856404;">💡 Важливо знати</h4>
            <ul style="margin: 5px 0; color: #856404; font-size: 0.9em;">
              <li><strong>pH шкала:</strong> логарифмічна, тому pH 6 в 10 разів кисліший за pH 7</li>
              <li><strong>Температура:</strong> pH води змінюється з температурою</li>
              <li><strong>Буферні розчини:</strong> зберігають pH при додаванні кислот/основ</li>
              <li><strong>Біологія:</strong> pH крові людини ~7.4, відхилення небезпечні</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
  
  function generatePHScale(currentPH) {
    const scale = [];
    for (let i = 0; i <= 14; i++) {
      let color, label;
      if (i < 7) {
        color = `hsl(${0 + i * 10}, 70%, 85%)`;
        label = i === 0 ? 'дуже кисло' : 'кисло';
      } else if (i === 7) {
        color = '#e8f5e8';
        label = 'нейтрально';
      } else {
        color = `hsl(${200 + (i - 7) * 15}, 70%, 85%)`;
        label = i === 14 ? 'дуже лужно' : 'лужно';
      }
      
      const isCurrent = Math.abs(i - currentPH) < 0.5;
      const style = isCurrent ? 
        `background: ${color}; border: 3px solid #333; padding: 8px; text-align: center; border-radius: 4px; font-weight: bold;` :
        `background: ${color}; border: 1px solid #ddd; padding: 8px; text-align: center; border-radius: 4px;`;
      
      scale.push(`<div style="${style}">${i}</div>`);
    }
    
    return `
      <div style="display: grid; grid-template-columns: repeat(15, 1fr); gap: 2px; margin: 10px 0;">
        ${scale.join('')}
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.8em; color: #666; margin-top: 5px;">
        <span>Кисло</span>
        <span>Нейтрально</span>
        <span>Лужно</span>
      </div>
    `;
  }
  
  function getPHExamples(pH) {
    const examples = [
      { ph: 0, name: "Акумуляторна кислота", range: [0, 1] },
      { ph: 1, name: "Шлунковий сік", range: [1, 2] },
      { ph: 2, name: "Лимонний сік", range: [2, 2.5] },
      { ph: 3, name: "Оцет", range: [2.5, 3.5] },
      { ph: 4, name: "Томатний сік", range: [4, 4.5] },
      { ph: 5, name: "Чорна кава", range: [5, 5.5] },
      { ph: 6, name: "Молоко", range: [6, 6.8] },
      { ph: 7, name: "Чиста вода", range: [7, 7] },
      { ph: 8, name: "Морська вода", range: [7.5, 8.5] },
      { ph: 9, name: "Пищова сода", range: [9, 9.5] },
      { ph: 10, name: "Мило", range: [9.5, 10.5] },
      { ph: 11, name: "Аміак", range: [11, 11.5] },
      { ph: 12, name: "Вапняна вода", range: [12, 12.5] },
      { ph: 13, name: "Побутовий відбілювач", range: [12.5, 13.5] },
      { ph: 14, name: "Гідроксид натрію", range: [13.5, 14] }
    ];
    
    const closeExamples = examples.filter(ex => 
      pH >= ex.range[0] && pH <= ex.range[1]
    );
    
    if (closeExamples.length > 0) {
      return `<p style="color: #495057;">Ваш розчин має схожий pH з: <strong>${closeExamples.map(ex => ex.name).join(', ')}</strong></p>`;
    } else {
      const closest = examples.reduce((prev, curr) => 
        Math.abs(curr.ph - pH) < Math.abs(prev.ph - pH) ? curr : prev
      );
      return `<p style="color: #495057;">Найближчий приклад: <strong>${closest.name}</strong> (pH ≈ ${closest.ph})</p>`;
    }
  }
});
