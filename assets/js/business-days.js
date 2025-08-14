document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("business-days-form");
  const result = document.getElementById("business-days-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const start = new Date(document.getElementById("start-date").value);
    const end = new Date(document.getElementById("end-date").value);

    if (!start || !end || start > end) {
      result.innerHTML = `
        <div style="background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; color: #721c24;">
          <strong>Помилка:</strong> Будь ласка, введіть коректні дати (початкова дата має бути до кінцевої).
        </div>
      `;
      return;
    }

    let totalDays = 0;
    let businessDays = 0;
    let weekendDays = 0;
    const monthlyBreakdown = {};

    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
      
      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = {
          month: current.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long' }),
          business: 0,
          weekend: 0,
          total: 0
        };
      }
      
      if (day === 0 || day === 6) {
        weekendDays++;
        monthlyBreakdown[monthKey].weekend++;
      } else {
        businessDays++;
        monthlyBreakdown[monthKey].business++;
      }
      totalDays++;
      monthlyBreakdown[monthKey].total++;
      current.setDate(current.getDate() + 1);
    }

    // Calculate working hours and weeks
    const workingHours = businessDays * 8;
    const workingWeeks = (businessDays / 5).toFixed(1);
    const weekendPercent = ((weekendDays / totalDays) * 100).toFixed(1);
    const businessPercent = ((businessDays / totalDays) * 100).toFixed(1);
    
    // Generate monthly breakdown if spanning multiple months
    let monthlyHtml = '';
    const months = Object.keys(monthlyBreakdown);
    if (months.length > 1) {
      monthlyHtml = `
        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #6f42c1; margin: 15px 0;">
          <h4 style="margin-top: 0; color: #6f42c1;">📅 Розподіл по місяцях</h4>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Місяць</th>
                  <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Робочі</th>
                  <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Вихідні</th>
                  <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Усього</th>
                </tr>
              </thead>
              <tbody>
                ${months.map(key => {
                  const month = monthlyBreakdown[key];
                  return `
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #eee;">${month.month}</td>
                      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${month.business}</td>
                      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${month.weekend}</td>
                      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${month.total}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    result.innerHTML = `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #28a745; margin-top: 0;">Результат підрахунку днів</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0;">
          <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 2em; font-weight: bold; color: #1976d2;">${totalDays}</div>
            <div style="color: #1976d2; font-weight: bold;">Календарних днів</div>
            <div style="color: #666; font-size: 0.9em;">Усього в періоді</div>
          </div>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 2em; font-weight: bold; color: #2e7d32;">${businessDays}</div>
            <div style="color: #2e7d32; font-weight: bold;">Робочих днів</div>
            <div style="color: #666; font-size: 0.9em;">${businessPercent}% від усіх днів</div>
          </div>
          <div style="background: #fce4ec; padding: 15px; border-radius: 6px; text-align: center;">
            <div style="font-size: 2em; font-weight: bold; color: #c2185b;">${weekendDays}</div>
            <div style="color: #c2185b; font-weight: bold;">Вихідних днів</div>
            <div style="color: #666; font-size: 0.9em;">${weekendPercent}% від усіх днів</div>
          </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff; margin: 15px 0;">
          <h4 style="margin-top: 0; color: #007bff;">⏰ Додаткові розрахунки</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="text-align: center; padding: 10px;">
              <div style="font-size: 1.3em; font-weight: bold; color: #007bff;">${workingHours}</div>
              <div style="color: #666;">робочих годин (8 год/день)</div>
            </div>
            <div style="text-align: center; padding: 10px;">
              <div style="font-size: 1.3em; font-weight: bold; color: #007bff;">${workingWeeks}</div>
              <div style="color: #666;">робочих тижнів</div>
            </div>
          </div>
        </div>
        
        ${monthlyHtml}
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 15px;">
          <h4 style="margin-top: 0; color: #856404;">💡 Корисна інформація</h4>
          <ul style="margin: 5px 0; color: #856404; font-size: 0.9em;">
            <li><strong>Планування проєктів:</strong> Враховуйте, що в кожному місяці ~21-23 робочі дні</li>
            <li><strong>Звітність:</strong> Ці дані корисні для табелів обліку робочого часу</li>
            <li><strong>Відпустки:</strong> Календарні дні включають вихідні, робочі - тільки будні</li>
            <li><strong>Застереження:</strong> Державні свята не враховуються в розрахунку</li>
          </ul>
        </div>
      </div>
    `;
  });
});
