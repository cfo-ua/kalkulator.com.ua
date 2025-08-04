document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bikini-size-form");
  const result = document.getElementById("bikini-size-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const bust = parseFloat(document.getElementById("bust").value);
    const underbust = parseFloat(document.getElementById("underbust").value);
    const waist = parseFloat(document.getElementById("waist").value);
    const hips = parseFloat(document.getElementById("hips").value);

    if ([bust, underbust, waist, hips].some(val => isNaN(val) || val <= 0)) {
      result.innerHTML = "<p>Будь ласка, введіть коректні параметри.</p>";
      return;
    }

    if (bust <= underbust) {
      result.innerHTML = "<p>Обхват грудей має бути більшим за обхват під грудьми.</p>";
      return;
    }

    // Calculate bra size for bikini top
    const bikiniTopSize = calculateBikiniTopSize(bust, underbust);
    
    // Calculate bikini bottom size
    const bikiniBottomSize = calculateBikiniBottomSize(waist, hips);

    if (bikiniTopSize && bikiniBottomSize) {
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>👙 Розмір ліфчика купальника</h6>
            <div class="big-number">${bikiniTopSize.size}</div>
            <p>Чашка: ${bikiniTopSize.cup}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🩱 Розмір низу купальника</h6>
            <div class="big-number">${bikiniBottomSize.int}</div>
            <p>Міжнародний розмір</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h3>📐 Детальна таблиця розмірів</h3>
          
          <h4>Ліфчик купальника:</h4>
          <table style="width: 100%; margin-bottom: 1.5rem; border-collapse: collapse;">
            <tr>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">Розмір</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">UA/EU</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">US</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">UK</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">AU</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${bikiniTopSize.size}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);">${bikiniTopSize.eu}</td>
              <td style="padding: 8px; border: 1px solid var(--border);">${bikiniTopSize.us}</td>
              <td style="padding: 8px; border: 1px solid var(--border);">${bikiniTopSize.uk}</td>
              <td style="padding: 8px; border: 1px solid var(--border);">${bikiniTopSize.au}</td>
            </tr>
          </table>
          
          <h4>Низ купальника (плавки):</h4>
          <table style="width: 100%; margin-bottom: 1.5rem; border-collapse: collapse;">
            <tr>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">INT</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">UA/EU</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">US</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">UK</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">AU</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${bikiniBottomSize.int}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);">${bikiniBottomSize.eu}</td>
              <td style="padding: 8px; border: 1px solid var(--border);">${bikiniBottomSize.us}</td>
              <td style="padding: 8px; border: 1px solid var(--border);">${bikiniBottomSize.uk}</td>
              <td style="padding: 8px; border: 1px solid var(--border);">${bikiniBottomSize.au}</td>
            </tr>
          </table>
          
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem;">
            <h4>📏 Ваші виміри:</h4>
            <ul style="list-style: none; padding: 0;">
              <li>🔸 Обхват грудей: <strong>${bust} см</strong></li>
              <li>🔸 Обхват під грудьми: <strong>${underbust} см</strong></li>
              <li>🔸 Обхват талії: <strong>${waist} см</strong></li>
              <li>🔸 Обхват стегон: <strong>${hips} см</strong></li>
            </ul>
          </div>
          
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid var(--accent);">
            <h4>💡 Поради щодо купальника:</h4>
            <ul>
              <li><strong>Для активного плавання:</strong> оберіть ліфчик на розмір менше для кращої підтримки</li>
              <li><strong>Для засмаги:</strong> можна обрати більш вільну посадку</li>
              <li><strong>Матеріал:</strong> враховуйте, що мокрий купальник може розтягуватися</li>
              <li><strong>Фасон:</strong> бандо, халтер та треугольники мають різну підтримку</li>
              <li><strong>Перевірка:</strong> завжди дивіться на таблицю розмірів конкретного бренду</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      result.innerHTML = `
        <div class="insight-card warning">
          <h6>⚠️ Нестандартні розміри</h6>
          <p>Ваші виміри виходять за межі стандартних розмірів. Рекомендуємо:</p>
          <ul style="text-align: left; margin-top: 1rem;">
            <li>Шукати бренди з розширеною розмірною сіткою</li>
            <li>Розглянути купальники на замовлення</li>
            <li>Обрати моделі з регулюванням (зав'язки, гачки)</li>
          </ul>
        </div>
      `;
    }
  });

  function calculateBikiniTopSize(bust, underbust) {
    // Calculate band size (round to nearest 5)
    const bandSize = Math.round(underbust / 5) * 5;
    
    // Calculate cup size
    const difference = bust - underbust;
    let cupSize = '';
    
    if (difference < 10) cupSize = 'AA';
    else if (difference >= 10 && difference < 12.5) cupSize = 'A';
    else if (difference >= 12.5 && difference < 15) cupSize = 'B';
    else if (difference >= 15 && difference < 17.5) cupSize = 'C';
    else if (difference >= 17.5 && difference < 20) cupSize = 'D';
    else if (difference >= 20 && difference < 22.5) cupSize = 'DD';
    else if (difference >= 22.5 && difference < 25) cupSize = 'E';
    else if (difference >= 25 && difference < 27.5) cupSize = 'F';
    else if (difference >= 27.5 && difference < 30) cupSize = 'FF';
    else cupSize = 'G';
    
    // International conversions for bikini tops
    const sizeMap = {
      70: { eu: '70', us: '32', uk: '32', au: '10' },
      75: { eu: '75', us: '34', uk: '34', au: '12' },
      80: { eu: '80', us: '36', uk: '36', au: '14' },
      85: { eu: '85', us: '38', uk: '38', au: '16' },
      90: { eu: '90', us: '40', uk: '40', au: '18' },
      95: { eu: '95', us: '42', uk: '42', au: '20' },
      100: { eu: '100', us: '44', uk: '44', au: '22' },
      105: { eu: '105', us: '46', uk: '46', au: '24' }
    };
    
    const mapping = sizeMap[bandSize] || sizeMap[100];
    
    return {
      size: `${bandSize}${cupSize}`,
      cup: cupSize,
      eu: `${mapping.eu}${cupSize}`,
      us: `${mapping.us}${cupSize}`,
      uk: `${mapping.uk}${cupSize}`,
      au: `${mapping.au}${cupSize}`
    };
  }

  function calculateBikiniBottomSize(waist, hips) {
    // Use the larger measurement for bikini bottom sizing
    const keyMeasurement = Math.max(waist, hips);
    
    const sizeChart = [
      { int: "XS", eu: "34", us: "2", uk: "6", au: "6", measurement: 86 },
      { int: "S", eu: "36", us: "4", uk: "8", au: "8", measurement: 90 },
      { int: "M", eu: "38", us: "6", uk: "10", au: "10", measurement: 94 },
      { int: "L", eu: "40", us: "8", uk: "12", au: "12", measurement: 98 },
      { int: "XL", eu: "42", us: "10", uk: "14", au: "14", measurement: 102 },
      { int: "XXL", eu: "44", us: "12", uk: "16", au: "16", measurement: 106 },
      { int: "3XL", eu: "46", us: "14", uk: "18", au: "18", measurement: 110 }
    ];

    // Find best match with tolerance
    const tolerance = 4;
    for (const size of sizeChart) {
      if (keyMeasurement <= size.measurement + tolerance) {
        return size;
      }
    }
    
    // Return largest size if no match
    return sizeChart[sizeChart.length - 1];
  }
});