document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("glove-size-form");
  const result = document.getElementById("glove-size-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const handLength = parseFloat(document.getElementById("hand-length").value);
    const palmCircumference = parseFloat(document.getElementById("palm-circumference").value);
    const palmLength = parseFloat(document.getElementById("palm-length").value);

    if ([handLength, palmCircumference, palmLength].some(val => isNaN(val) || val <= 0)) {
      result.innerHTML = "<p>Будь ласка, введіть коректні виміри.</p>";
      return;
    }

    // Basic validation
    if (handLength < 15 || handLength > 25) {
      result.innerHTML = "<p>Довжина руки має бути між 15 та 25 см.</p>";
      return;
    }

    if (palmCircumference < 15 || palmCircumference > 30) {
      result.innerHTML = "<p>Обхват долоні має бути між 15 та 30 см.</p>";
      return;
    }

    // Calculate glove size
    const gloveSize = calculateGloveSize(handLength, palmCircumference, palmLength);

    if (gloveSize) {
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>🧤 Ваш розмір рукавичок</h6>
            <div class="big-number">${gloveSize.eu}</div>
            <p>Європейський розмір</p>
          </div>
          
          <div class="insight-card info">
            <h6>🌍 Міжнародний розмір</h6>
            <div class="big-number">${gloveSize.us}</div>
            <p>US/Міжнародний</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h3>📐 Повна таблиця розмірів</h3>
          
          <table style="width: 100%; margin-bottom: 1.5rem; border-collapse: collapse;">
            <tr>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">EU</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">US</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">UK</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">Довжина руки</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">Обхват долоні</th>
            </tr>
            <tr style="background: #fff8e1;">
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${gloveSize.eu}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${gloveSize.us}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${gloveSize.uk}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);">${gloveSize.handLengthRange}</td>
              <td style="padding: 8px; border: 1px solid var(--border);">${gloveSize.circumferenceRange}</td>
            </tr>
          </table>
          
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem;">
            <h4>📏 Ваші виміри:</h4>
            <ul style="list-style: none; padding: 0;">
              <li>🔸 Довжина руки: <strong>${handLength} см</strong></li>
              <li>🔸 Обхват долоні: <strong>${palmCircumference} см</strong></li>
              <li>🔸 Довжина долоні: <strong>${palmLength} см</strong></li>
            </ul>
          </div>
          
          <div style="background: #f0f8ff; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid var(--accent);">
            <h4>🎯 Рекомендації за типами рукавичок:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>🥶 Зимові рукавички</h5>
                <p><strong>Розмір: ${getWinterGloveSize(gloveSize.eu)}</strong></p>
                <p>На 0.5-1 розмір більше для утеплювача</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>🔧 Робочі рукавички</h5>
                <p><strong>Розмір: ${gloveSize.eu}</strong></p>
                <p>Точна посадка для безпеки</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>🏃 Спортивні рукавички</h5>
                <p><strong>Розмір: ${gloveSize.eu}</strong></p>
                <p>Щільна посадка для захвату</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>🩺 Медичні рукавички</h5>
                <p><strong>Розмір: ${getMedicalGloveSize(gloveSize.us)}</strong></p>
                <p>Особлива розмірна сітка</p>
              </div>
            </div>
          </div>
          
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid var(--accent);">
            <h4>💡 Поради щодо рукавичок:</h4>
            <ul>
              <li><strong>Матеріал:</strong> Шкіряні рукавички можуть розтягуватися після носіння</li>
              <li><strong>Сезонність:</strong> Зимові рукавички беріть трохи більше для комфорту</li>
              <li><strong>Призначення:</strong> Робочі рукавички мають відповідати точно для безпеки</li>
              <li><strong>Бренди:</strong> Перевіряйте таблицю розмірів кожного виробника</li>
              <li><strong>Примірка:</strong> При можливості завжди міряйте перед покупкою</li>
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
            <li>Звернутися до спеціалізованих виробників рукавичок</li>
            <li>Розглянути виготовлення на замовлення</li>
            <li>Перевірити виміри ще раз</li>
          </ul>
        </div>
      `;
    }
  });

  function calculateGloveSize(handLength, palmCircumference, palmLength) {
    // Glove sizing chart based on hand measurements
    const sizeChart = [
      { 
        eu: "6", us: "XS", uk: "6", 
        handLengthMin: 15.0, handLengthMax: 16.5,
        circumferenceMin: 15.0, circumferenceMax: 17.5,
        handLengthRange: "15-16.5 см", circumferenceRange: "15-17.5 см"
      },
      { 
        eu: "6.5", us: "XS", uk: "6.5", 
        handLengthMin: 16.5, handLengthMax: 17.0,
        circumferenceMin: 17.5, circumferenceMax: 18.0,
        handLengthRange: "16.5-17 см", circumferenceRange: "17.5-18 см"
      },
      { 
        eu: "7", us: "S", uk: "7", 
        handLengthMin: 17.0, handLengthMax: 17.5,
        circumferenceMin: 18.0, circumferenceMax: 19.0,
        handLengthRange: "17-17.5 см", circumferenceRange: "18-19 см"
      },
      { 
        eu: "7.5", us: "S", uk: "7.5", 
        handLengthMin: 17.5, handLengthMax: 18.0,
        circumferenceMin: 19.0, circumferenceMax: 20.0,
        handLengthRange: "17.5-18 см", circumferenceRange: "19-20 см"
      },
      { 
        eu: "8", us: "M", uk: "8", 
        handLengthMin: 18.0, handLengthMax: 18.5,
        circumferenceMin: 20.0, circumferenceMax: 21.0,
        handLengthRange: "18-18.5 см", circumferenceRange: "20-21 см"
      },
      { 
        eu: "8.5", us: "M", uk: "8.5", 
        handLengthMin: 18.5, handLengthMax: 19.0,
        circumferenceMin: 21.0, circumferenceMax: 22.0,
        handLengthRange: "18.5-19 см", circumferenceRange: "21-22 см"
      },
      { 
        eu: "9", us: "L", uk: "9", 
        handLengthMin: 19.0, handLengthMax: 19.5,
        circumferenceMin: 22.0, circumferenceMax: 23.0,
        handLengthRange: "19-19.5 см", circumferenceRange: "22-23 см"
      },
      { 
        eu: "9.5", us: "L", uk: "9.5", 
        handLengthMin: 19.5, handLengthMax: 20.0,
        circumferenceMin: 23.0, circumferenceMax: 24.0,
        handLengthRange: "19.5-20 см", circumferenceRange: "23-24 см"
      },
      { 
        eu: "10", us: "XL", uk: "10", 
        handLengthMin: 20.0, handLengthMax: 20.5,
        circumferenceMin: 24.0, circumferenceMax: 25.0,
        handLengthRange: "20-20.5 см", circumferenceRange: "24-25 см"
      },
      { 
        eu: "10.5", us: "XL", uk: "10.5", 
        handLengthMin: 20.5, handLengthMax: 21.0,
        circumferenceMin: 25.0, circumferenceMax: 26.0,
        handLengthRange: "20.5-21 см", circumferenceRange: "25-26 см"
      },
      { 
        eu: "11", us: "XXL", uk: "11", 
        handLengthMin: 21.0, handLengthMax: 22.0,
        circumferenceMin: 26.0, circumferenceMax: 27.0,
        handLengthRange: "21-22 см", circumferenceRange: "26-27 см"
      },
      { 
        eu: "12", us: "XXL", uk: "12", 
        handLengthMin: 22.0, handLengthMax: 25.0,
        circumferenceMin: 27.0, circumferenceMax: 30.0,
        handLengthRange: "22-25 см", circumferenceRange: "27-30 см"
      }
    ];

    // Find best match based on both hand length and palm circumference
    for (const size of sizeChart) {
      if (handLength >= size.handLengthMin && handLength <= size.handLengthMax &&
          palmCircumference >= size.circumferenceMin && palmCircumference <= size.circumferenceMax) {
        return size;
      }
    }

    // If no exact match, find closest by hand length (primary measurement)
    let closestSize = null;
    let smallestDiff = Infinity;

    for (const size of sizeChart) {
      const midLength = (size.handLengthMin + size.handLengthMax) / 2;
      const diff = Math.abs(handLength - midLength);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestSize = size;
      }
    }

    return closestSize;
  }

  function getWinterGloveSize(euSize) {
    const numSize = parseFloat(euSize);
    const winterSize = numSize + 0.5;
    return winterSize.toString();
  }

  function getMedicalGloveSize(usSize) {
    const medicalMap = {
      "XS": "XS (6-6.5)",
      "S": "S (7-7.5)",
      "M": "M (8-8.5)",
      "L": "L (9-9.5)",
      "XL": "XL (10-10.5)",
      "XXL": "XXL (11-12)"
    };
    return medicalMap[usSize] || usSize;
  }
});