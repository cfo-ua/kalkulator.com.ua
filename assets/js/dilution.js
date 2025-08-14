document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('dilution-form');
  const result = document.getElementById('dilution-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const c1 = parseFloat(document.getElementById('dil-c1').value);
      const v1 = parseFloat(document.getElementById('dil-v1').value);
      const c2 = parseFloat(document.getElementById('dil-c2').value);
      const v2 = parseFloat(document.getElementById('dil-v2').value);
      
      let filled = [!isNaN(c1), !isNaN(v1), !isNaN(c2), !isNaN(v2)].filter(Boolean).length;
      
      if (filled !== 3) {
        result.innerHTML = `
          <div style="background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; color: #721c24;">
            <strong>Помилка:</strong> Введіть рівно три параметри з чотирьох можливих.
          </div>
        `;
        return;
      }
      
      let calculatedValue, calculatedParam, explanation, waterToAdd = null;
      
      if (isNaN(c1)) {
        calculatedValue = (c2 * v2 / v1).toFixed(4);
        calculatedParam = 'C₁';
        explanation = `Початкова концентрація розчину, який потрібен для отримання кінцевого розчину з концентрацією ${c2} моль/л та об'ємом ${v2} л.`;
      } else if (isNaN(v1)) {
        calculatedValue = (c2 * v2 / c1).toFixed(4);
        calculatedParam = 'V₁';
        explanation = `Об'єм початкового розчину з концентрацією ${c1} моль/л, необхідний для приготування ${v2} л розчину з концентрацією ${c2} моль/л.`;
        if (v2 > parseFloat(calculatedValue)) {
          waterToAdd = (v2 - parseFloat(calculatedValue)).toFixed(4);
        }
      } else if (isNaN(c2)) {
        calculatedValue = (c1 * v1 / v2).toFixed(4);
        calculatedParam = 'C₂';
        explanation = `Кінцева концентрація після розведення ${v1} л розчину з концентрацією ${c1} моль/л до об'єму ${v2} л.`;
      } else if (isNaN(v2)) {
        calculatedValue = (c1 * v1 / c2).toFixed(4);
        calculatedParam = 'V₂';
        explanation = `Кінцевий об'єм після розведення ${v1} л розчину з концентрацією ${c1} моль/л до концентрації ${c2} моль/л.`;
        if (parseFloat(calculatedValue) > v1) {
          waterToAdd = (parseFloat(calculatedValue) - v1).toFixed(4);
        }
      }
      
      let unit = calculatedParam.includes('C') ? ' моль/л' : ' л';
      
      result.innerHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Результат розрахунку</h3>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #28a745; margin: 15px 0; text-align: center;">
            <div style="font-size: 2.5em; font-weight: bold; color: #28a745; margin-bottom: 10px;">
              ${calculatedParam} = ${calculatedValue}${unit}
            </div>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; border-left: 4px solid #1976d2; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #1976d2;">Пояснення</h4>
            <p style="margin: 5px 0; color: #495057;">${explanation}</p>
          </div>
          
          ${waterToAdd ? `
          <div style="background: #fff3e0; padding: 15px; border-radius: 6px; border-left: 4px solid #f57c00; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #f57c00;">💧 Практичні поради</h4>
            <p style="margin: 5px 0; color: #495057;">
              <strong>Додайте ${waterToAdd} л води</strong> до початкового розчину для отримання потрібної концентрації.
            </p>
          </div>
          ` : ''}
          
          <div style="background: #f3e5f5; padding: 15px; border-radius: 6px; border-left: 4px solid #8e24aa; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #8e24aa;">📝 Формула розрахунку</h4>
            <div style="text-align: center; margin: 10px 0;">
              <span style="background: white; padding: 10px 20px; border-radius: 20px; border: 2px solid #8e24aa; font-weight: bold; font-size: 1.1em;">
                C₁ × V₁ = C₂ × V₂
              </span>
            </div>
            <p style="margin: 10px 0 5px 0; color: #495057; font-size: 0.9em;">
              де C₁ і V₁ — початкова концентрація та об'єм, C₂ і V₂ — кінцева концентрація та об'єм
            </p>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; border-left: 4px solid #2e7d32; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #2e7d32;">🔬 Застосування</h4>
            <ul style="margin: 5px 0; color: #495057; font-size: 0.9em;">
              <li>Приготування розчинів у хімічній лабораторії</li>
              <li>Розведення ліків та дезінфікуючих засобів</li>
              <li>Підготовка розчинів для аналізів</li>
              <li>Навчальні завдання з хімії та біології</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});
