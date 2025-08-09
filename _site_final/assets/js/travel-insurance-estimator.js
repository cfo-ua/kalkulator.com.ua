document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("travel-insurance-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const destination = document.getElementById("destination").value;
    const duration = parseInt(document.getElementById("duration").value);
    const age = parseInt(document.getElementById("age").value);
    const tripValue = parseFloat(document.getElementById("tripValue").value);
    const coverage = document.getElementById("coverage").value;
    const activities = document.getElementById("activities").value;
    const travelers = parseInt(document.getElementById("travelers").value);

    // Base rate per day per person in UAH
    let baseRatePerDay = 240; // Starting rate for low risk, young traveler, basic coverage (about $8 converted to UAH)

    // Destination risk multiplier
    const destinationMultiplier = {
      'low': 1.0,
      'medium': 1.4,
      'high': 2.2
    };

    // Age multiplier
    let ageMultiplier = 1.0;
    if (age >= 65) ageMultiplier = 2.5;
    else if (age >= 55) ageMultiplier = 1.8;
    else if (age >= 45) ageMultiplier = 1.4;
    else if (age >= 35) ageMultiplier = 1.1;

    // Coverage level multiplier
    const coverageMultiplier = {
      'basic': 1.0,
      'standard': 1.6,
      'comprehensive': 2.4
    };

    // Activities multiplier
    const activitiesMultiplier = {
      'none': 1.0,
      'moderate': 1.3,
      'extreme': 2.0
    };

    // Duration discounts (longer trips get better daily rates)
    let durationMultiplier = 1.0;
    if (duration >= 30) durationMultiplier = 0.8;
    else if (duration >= 14) durationMultiplier = 0.9;
    else if (duration >= 7) durationMultiplier = 0.95;

    // Group discount
    let groupDiscount = 1.0;
    if (travelers >= 4) groupDiscount = 0.85;
    else if (travelers >= 2) groupDiscount = 0.95;

    // Calculate premium per person per day
    const dailyRate = baseRatePerDay * 
                     destinationMultiplier[destination] * 
                     ageMultiplier * 
                     coverageMultiplier[coverage] * 
                     activitiesMultiplier[activities] * 
                     durationMultiplier * 
                     groupDiscount;

    // Total costs
    const totalPerPerson = dailyRate * duration;
    const totalForGroup = totalPerPerson * travelers;

    // Coverage limits based on level (converted to UAH from USD)
    const coverageLimits = {
      'basic': {
        medical: 3000000, // $100k
        evacuation: 15000000, // $500k
        cancellation: 0,
        baggage: 0
      },
      'standard': {
        medical: 7500000, // $250k
        evacuation: 30000000, // $1M
        cancellation: tripValue,
        baggage: 75000 // $2.5k
      },
      'comprehensive': {
        medical: 15000000, // $500k
        evacuation: 45000000, // $1.5M
        cancellation: tripValue,
        baggage: 150000 // $5k
      }
    };

    const limits = coverageLimits[coverage];

    // Calculate percentage of trip value
    const percentageOfTrip = (totalForGroup / (tripValue * travelers)) * 100;

    // Get destination name and risk description
    const destinationInfo = {
      'low': { name: 'Напрямок низького ризику', risk: 'Відмінна охорона здоров\'я, стабільні умови' },
      'medium': { name: 'Напрямок середнього ризику', risk: 'Хороша охорона здоров\'я, деякі регіональні проблеми' },
      'high': { name: 'Напрямок високого ризику', risk: 'Обмежена охорона здоров\'я, підвищені ризики' }
    };

    const coverageDescriptions = {
      'basic': 'Основне медичне покриття та евакуація',
      'standard': 'Медичне, евакуація та захист поїздки',
      'comprehensive': 'Повний захист з розширеними перевагами'
    };

    // Display results
    const resultBlock = document.getElementById("travel-insurance-result");
    resultBlock.innerHTML = `
      <h3>✈️ Ваша оцінка туристичної страховки</h3>
      
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>💰 Загальна премія</h6>
          <div class="big-number">${Math.round(totalForGroup).toLocaleString()} грн</div>
          <p>${travelers} мандрівник(и) на ${duration} днів<br>
          ${Math.round(totalPerPerson).toLocaleString()} грн на особу<br>
          ${percentageOfTrip.toFixed(1)}% від вартості поїздки</p>
        </div>
        
        <div class="insight-card success">
          <h6>🏥 Медичне покриття</h6>
          <div class="big-number">${limits.medical.toLocaleString()} грн</div>
          <p>Екстрені медичні витрати<br>
          Евакуація: ${limits.evacuation.toLocaleString()} грн<br>
          ${destinationInfo[destination].name}</p>
        </div>
        
        <div class="insight-card ${coverage === 'basic' ? 'warning' : 'info'}">
          <h6>🛡️ Захист поїздки</h6>
          <div class="big-number">${limits.cancellation > 0 ? limits.cancellation.toLocaleString() + ' грн' : 'Не покривається'}</div>
          <p>Скасування/Переривання<br>
          Багаж: ${limits.baggage > 0 ? limits.baggage.toLocaleString() + ' грн' : 'Не покривається'}<br>
          ${coverageDescriptions[coverage]}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📋 Деталі покриття</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>📍 Деталі поїздки:</strong><br>
            Напрямок: ${destinationInfo[destination].name}<br>
            Тривалість: ${duration} днів<br>
            Мандрівники: ${travelers} особ(а)<br>
            Вікова група: ${age < 35 ? 'Молодий дорослий' : age < 55 ? 'Середній вік' : age < 65 ? 'Зрілий' : 'Похилий'}<br>
            Активності: ${activities === 'none' ? 'Немає' : activities === 'moderate' ? 'Помірний' : 'Екстремальний'} ризик
          </div>
          
          <div>
            <strong>💵 Аналіз вартості:</strong><br>
            Денна ставка: ${dailyRate.toFixed(2)} грн на особу<br>
            Базова ставка: ${baseRatePerDay} грн/день<br>
            Коригування ризику: ${(destinationMultiplier[destination] * ageMultiplier * activitiesMultiplier[activities]).toFixed(1)}x<br>
            Рівень покриття: ${coverageMultiplier[coverage]}x<br>
            Застосовані знижки: ${((1 - durationMultiplier) * 100 + (1 - groupDiscount) * 100).toFixed(0)}%
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px; border-left: 4px solid #2196f3;">
          <strong>✅ Що покривається:</strong><br>
          ${coverage === 'basic' ? 
            '• Екстрене медичне лікування та госпіталізація<br>• Медична евакуація та репатріація<br>• Цілодобова екстрена допомога' :
            coverage === 'standard' ?
            '• Всі переваги базового покриття<br>• Скасування та переривання поїздки<br>• Захист втрати та затримки багажу<br>• Компенсація затримок подорожі' :
            '• Всі переваги стандартного покриття<br>• Розширені ліміти покриття<br>• Додатковий захист багажу<br>• Покриття орендованого автомобіля<br>• Захист особистої відповідальності'
          }
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
          <strong>⚠️ Важливі примітки:</strong><br>
          • ${destinationInfo[destination].risk}<br>
          • Попередні медичні стани можуть вимагати додаткового покриття<br>
          • ${activities !== 'none' ? 'Високоризикові активності збільшують премію та можуть мати виключення' : 'Стандартні активності покриваються'}<br>
          • Купуйте до першого невідшкодовуваного платежу за поїздку для повних переваг
        </div>
      </div>
    `;
  });
});