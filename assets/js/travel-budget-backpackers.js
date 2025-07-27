document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("travel-budget-form");
  const resultDiv = document.getElementById("travel-budget-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateTravelBudget();
  });

  // Auto-calculate when inputs change for better UX
  const inputs = form.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener("input", function () {
      if (validateInputs()) {
        calculateTravelBudget();
      }
    });
  });

  function validateInputs() {
    const duration = parseFloat(document.getElementById("trip-duration").value);
    const travelers = parseFloat(document.getElementById("travelers").value);
    return duration > 0 && travelers > 0;
  }

  function calculateTravelBudget() {
    // Get inputs
    const duration = parseFloat(document.getElementById("trip-duration").value) || 0;
    const travelers = parseFloat(document.getElementById("travelers").value) || 1;
    
    // Daily costs per person (in UAH)
    const accommodation = parseFloat(document.getElementById("accommodation").value) || 0;
    const food = parseFloat(document.getElementById("food").value) || 0;
    const transport = parseFloat(document.getElementById("transport").value) || 0;
    const activities = parseFloat(document.getElementById("activities").value) || 0;
    const miscellaneous = parseFloat(document.getElementById("miscellaneous").value) || 0;
    
    // One-time costs (in UAH)
    const flights = parseFloat(document.getElementById("flights").value) || 0;
    const visas = parseFloat(document.getElementById("visas").value) || 0;
    const gear = parseFloat(document.getElementById("gear").value) || 0;
    const emergencyBuffer = parseFloat(document.getElementById("emergency-buffer").value) || 0;

    if (duration <= 0 || travelers <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, введіть коректну тривалість поїздки та кількість мандрівників.</p>';
      return;
    }

    // Calculate daily costs
    const dailyPerPerson = accommodation + food + transport + activities + miscellaneous;
    const dailyTotal = dailyPerPerson * travelers;
    
    // Calculate trip totals
    const totalDailyCosts = dailyTotal * duration;
    const totalOneTimeCosts = (flights + visas + gear) * travelers;
    const subtotal = totalDailyCosts + totalOneTimeCosts;
    const emergencyAmount = subtotal * (emergencyBuffer / 100);
    const grandTotal = subtotal + emergencyAmount;

    // Per person totals
    const totalPerPerson = grandTotal / travelers;
    const dailyBudgetPerPerson = dailyPerPerson;

    // Budget category classification (converted to UAH, assuming ~30 UAH per $1)
    let budgetCategory, budgetDescription, budgetTips;
    if (dailyBudgetPerPerson <= 750) { // ~$25
      budgetCategory = "Ультра бюджетний бекпекер";
      budgetDescription = "Хостели, вулична їжа, безкоштовні активності";
      budgetTips = ["Зупинятися у спільних кімнатах хостелів", "Готувати самостійно", "Користуватися громадським транспортом", "Безкоштовні пішохідні тури"];
    } else if (dailyBudgetPerPerson <= 1500) { // ~$50
      budgetCategory = "Бюджетний бекпекер";
      budgetDescription = "Мікс хостелів/бюджетних готелів, місцева їжа";
      budgetTips = ["Мікс спільних та приватних кімнат", "Їсти в місцевих ресторанах", "Користуватися місцевим транспортом", "Деякі платні активності"];
    } else if (dailyBudgetPerPerson <= 3000) { // ~$100
      budgetCategory = "Бекпекер середнього рівня";
      budgetDescription = "Приватні кімнати, ресторани, платні активності";
      budgetTips = ["Приватні кімнати в хостелах", "Харчування в ресторанах", "Таксі при необхідності", "Популярні тури"];
    } else {
      budgetCategory = "Комфортний бекпекер";
      budgetDescription = "Готелі, харчування поза домом, тури";
      budgetTips = ["Бюджетні готелі", "Все харчування в ресторанах", "Зручний транспорт", "Множинні тури"];
    }

    // Regional cost comparison (in UAH per day)
    const regionalComparison = [
      { region: "Південно-Східна Азія", cost: "450-900 грн/день", suitable: dailyBudgetPerPerson >= 450 && dailyBudgetPerPerson <= 1800 },
      { region: "Центральна Америка", cost: "600-1200 грн/день", suitable: dailyBudgetPerPerson >= 600 && dailyBudgetPerPerson <= 2100 },
      { region: "Східна Європа", cost: "750-1500 грн/день", suitable: dailyBudgetPerPerson >= 750 && dailyBudgetPerPerson <= 2400 },
      { region: "Південна Америка", cost: "750-1800 грн/день", suitable: dailyBudgetPerPerson >= 750 && dailyBudgetPerPerson <= 2700 },
      { region: "Західна Європа", cost: "1500-3000 грн/день", suitable: dailyBudgetPerPerson >= 1500 },
      { region: "Австралія/Нова Зеландія", cost: "1800-3600 грн/день", suitable: dailyBudgetPerPerson >= 1800 }
    ];

    displayResults({
      duration,
      travelers,
      dailyPerPerson: dailyBudgetPerPerson,
      dailyTotal,
      totalDailyCosts,
      totalOneTimeCosts,
      emergencyAmount,
      grandTotal,
      totalPerPerson,
      budgetCategory,
      budgetDescription,
      budgetTips,
      regionalComparison,
      breakdown: {
        accommodation,
        food,
        transport,
        activities,
        miscellaneous,
        flights: flights * travelers,
        visas: visas * travelers,
        gear: gear * travelers
      }
    });
  }

  function displayResults(data) {
    const {
      duration,
      travelers,
      dailyPerPerson,
      dailyTotal,
      totalDailyCosts,
      totalOneTimeCosts,
      emergencyAmount,
      grandTotal,
      totalPerPerson,
      budgetCategory,
      budgetDescription,
      budgetTips,
      regionalComparison,
      breakdown
    } = data;

    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🎒 Ваш бюджет бекпекінгу</h3>
        
        <div class="budget-overview">
          <div class="budget-category">
            <h4>${budgetCategory}</h4>
            <p>${budgetDescription}</p>
            <div class="daily-budget">${dailyPerPerson.toFixed(2)} грн на особу на день</div>
          </div>
        </div>

        <div class="budget-insights">
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>💰 Загальна вартість</h6>
              <p class="big-number">${grandTotal.toFixed(0)} грн</p>
              <p class="insight-detail">повний бюджет поїздки</p>
            </div>
            
            <div class="insight-card info">
              <h6>👤 На особу</h6>
              <p class="big-number">${totalPerPerson.toFixed(0)} грн</p>
              <p class="insight-detail">індивідуальна вартість</p>
            </div>
            
            <div class="insight-card ${dailyPerPerson <= 1500 ? 'success' : dailyPerPerson <= 3000 ? 'warning' : 'info'}">
              <h6>📅 Щоденний бюджет</h6>
              <p class="big-number">${dailyPerPerson.toFixed(0)} грн</p>
              <p class="insight-detail">на особу на день</p>
            </div>
            
            <div class="insight-card info">
              <h6>⏰ Тривалість</h6>
              <p class="big-number">${duration}</p>
              <p class="insight-detail">дн${duration > 1 ? 'ів' : 'ь'} загалом</p>
            </div>
            
            <div class="insight-card info">
              <h6>👥 Мандрівники</h6>
              <p class="big-number">${travelers}</p>
              <p class="insight-detail">осіб їде</p>
            </div>
            
            <div class="insight-card warning">
              <h6>🚨 Аварійний фонд</h6>
              <p class="big-number">${emergencyAmount.toFixed(0)} грн</p>
              <p class="insight-detail">буфер безпеки</p>
            </div>
          </div>
        </div>

        <div class="result-grid">

        <div class="cost-breakdown">
          <h4>📊 Розбивка витрат</h4>
          <div class="breakdown-grid">
            <div class="breakdown-item">
              <span class="category">Щоденні витрати (${duration} днів):</span>
              <span class="amount">${totalDailyCosts.toFixed(2)} грн</span>
            </div>
            <div class="breakdown-sub">
              <span>• Проживання: ${(breakdown.accommodation * travelers * duration).toFixed(2)} грн</span>
            </div>
            <div class="breakdown-sub">
              <span>• Їжа та напої: ${(breakdown.food * travelers * duration).toFixed(2)} грн</span>
            </div>
            <div class="breakdown-sub">
              <span>• Транспорт: ${(breakdown.transport * travelers * duration).toFixed(2)} грн</span>
            </div>
            <div class="breakdown-sub">
              <span>• Активності: ${(breakdown.activities * travelers * duration).toFixed(2)} грн</span>
            </div>
            <div class="breakdown-sub">
              <span>• Різне: ${(breakdown.miscellaneous * travelers * duration).toFixed(2)} грн</span>
            </div>
            
            <div class="breakdown-item">
              <span class="category">Одноразові витрати:</span>
              <span class="amount">${totalOneTimeCosts.toFixed(2)} грн</span>
            </div>
            <div class="breakdown-sub">
              <span>• Авіаквитки: ${breakdown.flights.toFixed(2)} грн</span>
            </div>
            <div class="breakdown-sub">
              <span>• Візи та страховка: ${breakdown.visas.toFixed(2)} грн</span>
            </div>
            <div class="breakdown-sub">
              <span>• Спорядження та обладнання: ${breakdown.gear.toFixed(2)} грн</span>
            </div>
          </div>
        </div>

        <div class="regional-comparison">
          <h4>🌍 Ваш бюджет проти популярних бекпекерських регіонів</h4>
          <div class="regions-grid">
            ${regionalComparison.map(region => `
              <div class="region ${region.suitable ? 'suitable' : 'challenging'}">
                <strong>${region.region}</strong>
                <span class="region-cost">${region.cost}</span>
                <span class="suitability">${region.suitable ? '✅ Підходить' : '⚠️ Може бути напружено'}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="budget-tips">
          <h4>💡 Поради для вашого бюджетного рівня</h4>
          <ul>
            ${budgetTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>

        <div class="savings-suggestions">
          <h4>💰 Способи зменшити витрати</h4>
          <ul>
            <li><strong>Проживання:</strong> Обирайте спільні кімнати хостелів замість приватних</li>
            <li><strong>Їжа:</strong> Готуйте в кухнях хостелів, їжте вуличну їжу</li>
            <li><strong>Транспорт:</strong> Користуйтесь нічними автобусами/поїздами, більше ходіть пішки</li>
            <li><strong>Активності:</strong> Шукайте безкоштовні пішохідні тури та піші походи</li>
            <li><strong>Загальне:</strong> Подорожуйте повільніше, уникайте туристичних пасток</li>
          </ul>
        </div>

        <div class="packing-reminder">
          <h4>🎯 Не забудьте</h4>
          <ul>
            <li>Тримайте аварійні кошти окремо від щоденних витрат</li>
            <li>Повідомте банки про свої туристичні плани</li>
            <li>Досліджуйте візові вимоги заздалегідь</li>
            <li>Розгляньте ліміти покриття туристичної страховки</li>
            <li>Завантажте офлайн карти та додатки для перекладу</li>
          </ul>
        </div>
      </div>
    `;
  }
});