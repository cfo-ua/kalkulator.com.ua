document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('mean-form');
  const result = document.getElementById('mean-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const input = document.getElementById('mean-input').value;
      const numbers = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      
      if (numbers.length === 0) {
        result.innerHTML = `
          <div style="background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; color: #721c24;">
            <strong>Помилка:</strong> Введіть хоча б одне число через кому.
          </div>
        `;
        return;
      }
      
      // Calculate statistics
      const sum = numbers.reduce((s, n) => s + n, 0);
      const mean = sum / numbers.length;
      const sortedNumbers = [...numbers].sort((a, b) => a - b);
      
      // Median calculation
      let median;
      if (sortedNumbers.length % 2 === 0) {
        median = (sortedNumbers[sortedNumbers.length / 2 - 1] + sortedNumbers[sortedNumbers.length / 2]) / 2;
      } else {
        median = sortedNumbers[Math.floor(sortedNumbers.length / 2)];
      }
      
      // Mode calculation
      const frequency = {};
      numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
      });
      const maxFreq = Math.max(...Object.values(frequency));
      const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq);
      const mode = modes.length === numbers.length ? "Немає моди" : modes.join(', ');
      
      // Range and other statistics
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      const range = max - min;
      
      // Standard deviation
      const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length;
      const stdDev = Math.sqrt(variance);
      
      result.innerHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Статистичний аналіз</h3>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #28a745; margin: 15px 0; text-align: center;">
            <div style="font-size: 2.5em; font-weight: bold; color: #28a745; margin-bottom: 10px;">
              ${mean.toFixed(4)}
            </div>
            <div style="color: #28a745; font-weight: bold; font-size: 1.2em;">Середнє арифметичне</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 1.5em; font-weight: bold; color: #1976d2;">${median}</div>
              <div style="color: #1976d2; font-weight: bold;">Медіана</div>
              <div style="color: #666; font-size: 0.9em;">Середнє значення</div>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 1.3em; font-weight: bold; color: #f57c00;">${mode}</div>
              <div style="color: #f57c00; font-weight: bold;">Мода</div>
              <div style="color: #666; font-size: 0.9em;">Найчастіше значення</div>
            </div>
            <div style="background: #fce4ec; padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 1.5em; font-weight: bold; color: #c2185b;">${range}</div>
              <div style="color: #c2185b; font-weight: bold;">Розмах</div>
              <div style="color: #666; font-size: 0.9em;">Макс - Мін</div>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #6f42c1; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #6f42c1;">📊 Додаткова статистика</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div>
                <strong>Кількість значень:</strong> ${numbers.length}<br>
                <strong>Сума:</strong> ${sum.toFixed(4)}<br>
                <strong>Мінімум:</strong> ${min}<br>
                <strong>Максимум:</strong> ${max}
              </div>
              <div>
                <strong>Стандартне відхилення:</strong> ${stdDev.toFixed(4)}<br>
                <strong>Дисперсія:</strong> ${variance.toFixed(4)}<br>
                <strong>Коефіцієнт варіації:</strong> ${((stdDev / Math.abs(mean)) * 100).toFixed(2)}%
              </div>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #007bff;">📈 Ваші дані</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 4px;">
              <strong>Вхідні числа:</strong> ${numbers.join(', ')}<br>
              <strong>Відсортовані:</strong> ${sortedNumbers.join(', ')}
            </div>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; border-left: 4px solid #2e7d32; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #2e7d32;">🧮 Формула та пояснення</h4>
            <p style="margin: 5px 0; color: #495057; font-size: 0.9em;">
              <strong>Середнє арифметичне:</strong> (${numbers.join(' + ')}) ÷ ${numbers.length} = ${mean.toFixed(4)}<br>
              <strong>Медіана:</strong> ${numbers.length % 2 === 0 ? 
                `(${sortedNumbers[numbers.length / 2 - 1]} + ${sortedNumbers[numbers.length / 2]}) ÷ 2 = ${median}` : 
                `Середній елемент = ${median}`}<br>
              <strong>Розмах:</strong> ${max} - ${min} = ${range}
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 15px;">
            <h4 style="margin-top: 0; color: #856404;">💡 Коли використовувати</h4>
            <ul style="margin: 5px 0; color: #856404; font-size: 0.9em;">
              <li><strong>Середнє арифметичне:</strong> для загальної оцінки результатів</li>
              <li><strong>Медіана:</strong> коли є викиди (дуже великі або малі значення)</li>
              <li><strong>Мода:</strong> для визначення найпопулярнішого значення</li>
              <li><strong>Стандартне відхилення:</strong> для оцінки розкиду даних</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});
