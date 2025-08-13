document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("helmet-size-form");
  const result = document.getElementById("helmet-size-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const headCircumference = parseFloat(document.getElementById("head-circumference").value);
    const headLength = parseFloat(document.getElementById("head-length").value);
    const headWidth = parseFloat(document.getElementById("head-width").value);

    if ([headCircumference, headLength, headWidth].some(val => isNaN(val) || val <= 0)) {
      result.innerHTML = "<p>Будь ласка, введіть коректні виміри.</p>";
      return;
    }

    // Basic validation
    if (headCircumference < 50 || headCircumference > 70) {
      result.innerHTML = "<p>Обхват голови має бути між 50 та 70 см.</p>";
      return;
    }

    if (headLength < 15 || headLength > 25) {
      result.innerHTML = "<p>Довжина голови має бути між 15 та 25 см.</p>";
      return;
    }

    if (headWidth < 12 || headWidth > 20) {
      result.innerHTML = "<p>Ширина голови має бути між 12 та 20 см.</p>";
      return;
    }

    // Calculate helmet size
    const helmetSize = calculateHelmetSize(headCircumference, headLength, headWidth);

    if (helmetSize) {
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>🪖 Ваш розмір шолома</h6>
            <div class="big-number">${helmetSize.eu} см</div>
            <p>Європейський розмір</p>
          </div>
          
          <div class="insight-card info">
            <h6>🌍 Міжнародний розмір</h6>
            <div class="big-number">${helmetSize.us}</div>
            <p>US/Міжнародний</p>
          </div>
          
          <div class="insight-card info">
            <h6>🇬🇧 Британський розмір</h6>
            <div class="big-number">${helmetSize.uk}</div>
            <p>UK Hat Size</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h3>📊 Повна таблиця розмірів</h3>
          
          <table style="width: 100%; margin-bottom: 1.5rem; border-collapse: collapse;">
            <tr>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">EU (см)</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">US</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">UK</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">Обхват голови</th>
            </tr>
            <tr style="background: #fff8e1;">
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${helmetSize.eu}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${helmetSize.us}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${helmetSize.uk}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);">${helmetSize.circumferenceRange}</td>
            </tr>
          </table>
          
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem;">
            <h4>📏 Ваші виміри:</h4>
            <ul style="list-style: none; padding: 0;">
              <li>🔸 Обхват голови: <strong>${headCircumference} см</strong></li>
              <li>🔸 Довжина голови: <strong>${headLength} см</strong></li>
              <li>🔸 Ширина голови: <strong>${headWidth} см</strong></li>
            </ul>
          </div>
          
          <div style="background: #f0f8ff; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid var(--accent);">
            <h4>🎯 Рекомендації за типами шоломів:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>🚴 Велосипедний шолом</h5>
                <p><strong>Розмір: ${helmetSize.eu} см</strong></p>
                <p>Щільна посадка для безпеки</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>🏍️ Мотоциклетний шолом</h5>
                <p><strong>Розмір: ${getMotorcycleHelmetSize(helmetSize.eu)}</strong></p>
                <p>Врахування подушок комфорту</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>👷 Будівельна каска</h5>
                <p><strong>Розмір: ${getConstructionHelmetSize(helmetSize.eu)}</strong></p>
                <p>Комфорт при тривалому носінні</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>⛷️ Спортивний шолом</h5>
                <p><strong>Розмір: ${helmetSize.eu} см</strong></p>
                <p>Точна посадка для захисту</p>
              </div>
            </div>
          </div>
          
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid var(--accent);">
            <h4>🛡️ Поради щодо безпеки:</h4>
            <ul>
              <li><strong>Посадка:</strong> Шолом повинен щільно прилягати, але не тиснути</li>
              <li><strong>Рух:</strong> При рухах головою шолом не повинен зміщуватися</li>
              <li><strong>Комфорт:</strong> Шкіра не повинна зморщуватися під ремінцями</li>
              <li><strong>Волосся:</strong> Враховуйте товщину волосся при виборі розміру</li>
              <li><strong>Примірка:</strong> Завжди примірюйте шолом перед покупкою</li>
              <li><strong>Стандарти:</strong> Перевіряйте сертифікати безпеки (CE, DOT, SNELL)</li>
            </ul>
          </div>
          
          <div style="background: #fff5f5; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid #dc3545;">
            <h4>⚠️ Важливі зауваження:</h4>
            <ul>
              <li>Шолом має замінюватися після будь-якого удару</li>
              <li>Термін служби шолома зазвичай 3-5 років</li>
              <li>Різні бренди можуть мати відмінності в розмірах</li>
              <li>Для мотоциклетних шоломів обов'язкова примірка</li>
              <li>Дитячі шоломи потребують окремого підбору</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      result.innerHTML = `
        <div class="insight-card warning">
          <h6>⚠️ Нестандартні розміри</h6>
          <p>Ваші виміри виходять за межі стандартних розмірів шоломів. Рекомендуємо:</p>
          <ul style="text-align: left; margin-top: 1rem;">
            <li>Звернутися до спеціалізованих виробників шоломів</li>
            <li>Розглянути виготовлення на замовлення</li>
            <li>Перевірити виміри ще раз</li>
            <li>Проконсультуватися з фахівцем</li>
          </ul>
        </div>
      `;
    }
  });

  function calculateHelmetSize(headCircumference, headLength, headWidth) {
    // Helmet sizing chart based on head circumference (primary measurement)
    const sizeChart = [
      { 
        eu: "52", us: "XS", uk: "6½", 
        circumferenceMin: 50.0, circumferenceMax: 52.5,
        circumferenceRange: "50-52.5 см"
      },
      { 
        eu: "53", us: "XS", uk: "6⅝", 
        circumferenceMin: 52.5, circumferenceMax: 53.5,
        circumferenceRange: "52.5-53.5 см"
      },
      { 
        eu: "54", us: "S", uk: "6¾", 
        circumferenceMin: 53.5, circumferenceMax: 54.5,
        circumferenceRange: "53.5-54.5 см"
      },
      { 
        eu: "55", us: "S", uk: "6⅞", 
        circumferenceMin: 54.5, circumferenceMax: 55.5,
        circumferenceRange: "54.5-55.5 см"
      },
      { 
        eu: "56", us: "M", uk: "7", 
        circumferenceMin: 55.5, circumferenceMax: 56.5,
        circumferenceRange: "55.5-56.5 см"
      },
      { 
        eu: "57", us: "M", uk: "7⅛", 
        circumferenceMin: 56.5, circumferenceMax: 57.5,
        circumferenceRange: "56.5-57.5 см"
      },
      { 
        eu: "58", us: "L", uk: "7¼", 
        circumferenceMin: 57.5, circumferenceMax: 58.5,
        circumferenceRange: "57.5-58.5 см"
      },
      { 
        eu: "59", us: "L", uk: "7⅜", 
        circumferenceMin: 58.5, circumferenceMax: 59.5,
        circumferenceRange: "58.5-59.5 см"
      },
      { 
        eu: "60", us: "XL", uk: "7½", 
        circumferenceMin: 59.5, circumferenceMax: 60.5,
        circumferenceRange: "59.5-60.5 см"
      },
      { 
        eu: "61", us: "XL", uk: "7⅝", 
        circumferenceMin: 60.5, circumferenceMax: 61.5,
        circumferenceRange: "60.5-61.5 см"
      },
      { 
        eu: "62", us: "XXL", uk: "7¾", 
        circumferenceMin: 61.5, circumferenceMax: 63.0,
        circumferenceRange: "61.5-63 см"
      },
      { 
        eu: "63", us: "XXL", uk: "7⅞", 
        circumferenceMin: 63.0, circumferenceMax: 65.0,
        circumferenceRange: "63-65 см"
      }
    ];

    // Find best match based on head circumference (primary measurement for helmets)
    for (const size of sizeChart) {
      if (headCircumference >= size.circumferenceMin && headCircumference <= size.circumferenceMax) {
        return size;
      }
    }

    // If no exact match, find closest by circumference
    let closestSize = null;
    let smallestDiff = Infinity;

    for (const size of sizeChart) {
      const midCircumference = (size.circumferenceMin + size.circumferenceMax) / 2;
      const diff = Math.abs(headCircumference - midCircumference);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestSize = size;
      }
    }

    return closestSize;
  }

  function getMotorcycleHelmetSize(euSize) {
    // Motorcycle helmets often run slightly smaller due to comfort padding
    const numSize = parseFloat(euSize);
    const motorcycleSize = Math.max(52, numSize - 0.5);
    return motorcycleSize.toString() + " см (можливо -0.5 см)";
  }

  function getConstructionHelmetSize(euSize) {
    // Construction helmets can be slightly larger for comfort during long wear
    const numSize = parseFloat(euSize);
    const constructionSize = numSize + 0.5;
    return constructionSize.toString() + " см (можливо +0.5 см)";
  }
});