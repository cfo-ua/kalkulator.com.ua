document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bc-ad-form");
  const result = document.getElementById("bc-ad-result");

  // Historical periods and events in Ukrainian
  const historicalPeriods = {
    getInfo: function(year, isBC) {
      const actualYear = isBC ? -year : year;
      
      if (isBC) {
        if (year >= 3000) return { period: "Бронзова доба", icon: "⚔️", description: "Епоха розвитку металургії та ранніх цивілізацій" };
        if (year >= 1200) return { period: "Пізня бронзова доба", icon: "🏺", description: "Розквіт микенської та хетської цивілізацій" };
        if (year >= 800) return { period: "Залізна доба", icon: "⚡", description: "Початок залізної доби, формування грецьких полісів" };
        if (year >= 500) return { period: "Класична античність", icon: "🏛️", description: "Розквіт Греції, Перська імперія" };
        if (year >= 300) return { period: "Елліністична епоха", icon: "🗿", description: "Македонська імперія, поширення грецької культури" };
        if (year >= 100) return { period: "Пізня республіка Риму", icon: "🦅", description: "Розширення Римської республіки" };
        if (year >= 1) return { period: "Рання імперія Риму", icon: "👑", description: "Становлення Римської імперії" };
      } else {
        if (year <= 476) return { period: "Римська імперія", icon: "🏛️", description: "Розквіт і занепад Римської імперії" };
        if (year <= 1000) return { period: "Раннє середньовіччя", icon: "⚔️", description: "Формування феодалізму, хрещення Русі" };
        if (year <= 1300) return { period: "Високе середньовіччя", icon: "🏰", description: "Хрестові походи, розквіт міст" };
        if (year <= 1500) return { period: "Пізнє середньовіччя", icon: "📚", description: "Відродження, Велика чума" };
        if (year <= 1800) return { period: "Новий час", icon: "🚢", description: "Великі географічні відкриття, Просвітництво" };
        if (year <= 1900) return { period: "Індустріальна епоха", icon: "🏭", description: "Промислова революція, формування націй" };
        if (year <= 2000) return { period: "ХХ століття", icon: "🌍", description: "Світові війни, технологічний прогрес" };
        return { period: "Сучасність", icon: "💻", description: "Інформаційна епоха, глобалізація" };
      }
    }
  };

  const famousEvents = {
    getEvent: function(year, isBC) {
      if (isBC) {
        if (year === 753) return "Заснування Риму";
        if (year === 776) return "Перші Олімпійські ігри";
        if (year === 356) return "Народження Олександра Македонського";
        if (year === 221) return "Об'єднання Китаю";
        if (year === 44) return "Вбивство Юлія Цезаря";
        if (year >= 800 && year <= 700) return "Формування грецьких полісів";
        if (year >= 600 && year <= 500) return "Епоха великих філософів";
        if (year >= 300 && year <= 200) return "Розквіт елліністичних держав";
      } else {
        if (year === 476) return "Падіння Західної Римської імперії";
        if (year === 988) return "Хрещення Київської Русі";
        if (year === 1066) return "Нормандське завоювання Англії";
        if (year === 1453) return "Падіння Константинополя";
        if (year === 1492) return "Відкриття Америки";
        if (year === 1789) return "Французька революція";
        if (year === 1917) return "Українська та Російська революції";
        if (year === 1991) return "Незалежність України";
      }
      return null;
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const yearInput = parseInt(document.getElementById("year-input").value);
    const era = document.getElementById("era-select").value;

    if (!yearInput || yearInput < 1) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Будь ласка, введіть коректний рік (більше 0).</div>';
      return;
    }

    const isBC = era === "BC";
    const currentYear = new Date().getFullYear();
    
    // Calculate conversion
    let convertedYear, convertedEra;
    if (isBC) {
      convertedYear = yearInput;
      convertedEra = "н.е.";
    } else {
      convertedYear = yearInput;
      convertedEra = "до н.е.";
    }

    // Calculate years ago
    let yearsAgo;
    if (isBC) {
      yearsAgo = currentYear + yearInput - 1; // -1 because there's no year 0
    } else {
      yearsAgo = currentYear - yearInput;
    }

    // Get historical info
    const periodInfo = historicalPeriods.getInfo(yearInput, isBC);
    const famousEvent = famousEvents.getEvent(yearInput, isBC);

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>📅 Вихідна дата</h6>
          <div class="big-number">${yearInput} ${era}</div>
          <p>${isBC ? 'До нашої ери' : 'Нашої ери'}</p>
        </div>
        
        <div class="insight-card info">
          <h6>⏰ Років тому</h6>
          <div class="big-number">${yearsAgo.toLocaleString()}</div>
          <p>від сьогоднішнього дня</p>
        </div>
        
        <div class="insight-card warning">
          <h6>${periodInfo.icon} Історична епоха</h6>
          <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">${periodInfo.period}</div>
          <p style="font-size: 0.9rem;">${periodInfo.description}</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h4>📚 Історичний контекст ${yearInput} ${era === 'BC' ? 'до н.е.' : 'н.е.'}:</h4>
        
        ${famousEvent ? `
        <div style="background: linear-gradient(135deg, #fff8e1 0%, #f5f5dc 100%); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #ffc107;">
          <h5>⭐ Знакова подія:</h5>
          <p style="margin: 0; font-size: 1.1rem; font-weight: 500;">${famousEvent}</p>
        </div>
        ` : ''}
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--accent); margin-bottom: 1rem;">
          <h5>🕰️ Хронологічні розрахунки:</h5>
          <div style="display: grid; gap: 0.5rem;">
            <div><strong>Вихідна дата:</strong> ${yearInput} ${era === 'BC' ? 'до н.е.' : 'н.е.'}</div>
            <div><strong>Років від події до сьогодні:</strong> ${yearsAgo.toLocaleString()} років</div>
            <div><strong>Століття:</strong> ${Math.ceil(yearInput / 100)} ${era === 'BC' ? 'до н.е.' : 'н.е.'}</div>
            <div><strong>Тисячоліття:</strong> ${Math.ceil(yearInput / 1000)} ${era === 'BC' ? 'до н.е.' : 'н.е.'}</div>
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #e8f8fc 0%, #f8fdff 100%); border-radius: 8px;">
          <h5>💡 Цікаві факти про хронологію:</h5>
          <ul style="margin: 0.5rem 0;">
            <li>📅 Між 1 до н.е. та 1 н.е. немає нульового року</li>
            <li>🏛️ Система до н.е./н.е. була створена в VI столітті н.е.</li>
            <li>🌍 Це найпоширеніша система датування у світі</li>
            <li>📜 У стародавніх цивілізацій були власні календарі</li>
            <li>🔬 Археологи використовують радіовуглецевий аналіз для точного датування</li>
          </ul>
        </div>
        
        ${yearsAgo > 2000 ? `
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%); border-radius: 8px;">
          <h5>🏺 Стародавня історія:</h5>
          <p>Ця дата належить до стародавньої історії. Події цього періоду відомі переважно завдяки археологічним знахідкам, стародавнім хронікам та історичним дослідженням.</p>
        </div>
        ` : ''}
      </div>
    `;
  });
});