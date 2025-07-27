document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("youtube-monetization-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const subscribers = parseFloat(document.getElementById("subscribers").value);
    const monthlyViews = parseFloat(document.getElementById("monthlyViews").value);
    const avgViewDuration = parseFloat(document.getElementById("avgViewDuration").value) / 100;
    const videosPerMonth = parseInt(document.getElementById("videosPerMonth").value);
    const contentCategory = document.getElementById("contentCategory").value;
    const audienceLocation = document.getElementById("audienceLocation").value;
    const engagementRate = parseFloat(document.getElementById("engagementRate").value) / 100;
    const monetizationEnabled = document.getElementById("monetizationEnabled").value === 'true';
    const membershipsEnabled = document.getElementById("membershipsEnabled").value === 'true';
    const sponsorshipRate = parseInt(document.getElementById("sponsorshipRate").value) || 0;
    const merchandiseEnabled = document.getElementById("merchandiseEnabled").value === 'true';
    const monthlyGrowthRate = parseFloat(document.getElementById("monthlyGrowthRate").value) / 100;
    const projectionMonths = parseInt(document.getElementById("projectionMonths").value);

    // Ставки CPM за категорією та локацією
    const cpmRates = {
      'gaming': { tier1: 2.5, tier2: 1.8, tier3: 1.2, tier4: 0.8 },
      'tech': { tier1: 4.0, tier2: 2.8, tier3: 1.8, tier4: 1.2 },
      'lifestyle': { tier1: 2.0, tier2: 1.4, tier3: 0.9, tier4: 0.6 },
      'entertainment': { tier1: 1.8, tier2: 1.3, tier3: 0.8, tier4: 0.5 },
      'business': { tier1: 5.0, tier2: 3.5, tier3: 2.2, tier4: 1.5 },
      'health': { tier1: 3.2, tier2: 2.2, tier3: 1.4, tier4: 0.9 },
      'music': { tier1: 1.5, tier2: 1.1, tier3: 0.7, tier4: 0.4 },
      'comedy': { tier1: 1.8, tier2: 1.3, tier3: 0.8, tier4: 0.5 }
    };

    const baseCPM = cpmRates[contentCategory][audienceLocation];

    // Розрахунок поточного місячного доходу від реклами
    let currentAdRevenue = 0;
    if (monetizationEnabled) {
      // RPM зазвичай становить 60-80% від CPM після частки YouTube
      const rpm = baseCPM * 0.7;
      currentAdRevenue = (monthlyViews / 1000) * rpm;
    }

    // Дохід від членства каналу (якщо увімкнено)
    let membershipRevenue = 0;
    if (membershipsEnabled && subscribers >= 1000) {
      // Типовий коефіцієнт конверсії: 0.1-1% підписників стають членами за середню ціну $4.99/місяць
      const membershipConversionRate = Math.min(engagementRate / 2, 0.01); // Макс 1%
      const avgMembershipPrice = 4.99;
      membershipRevenue = subscribers * membershipConversionRate * avgMembershipPrice;
    }

    // Дохід від спонсорства
    let sponsorshipRevenue = 0;
    if (sponsorshipRate > 0 && subscribers >= 10000) {
      // Ставки спонсорства: $1-5 за 1000 переглядів, варіюється за нішею
      const sponsorshipMultiplier = {
        'gaming': 2,
        'tech': 4,
        'lifestyle': 2.5,
        'entertainment': 1.5,
        'business': 5,
        'health': 3,
        'music': 1.5,
        'comedy': 1.5
      };
      
      const avgSponsorshipRate = sponsorshipMultiplier[contentCategory];
      sponsorshipRevenue = sponsorshipRate * (monthlyViews / 1000) * avgSponsorshipRate;
    }

    // Дохід від Super Chat/Thanks (оцінка)
    let superChatRevenue = 0;
    if (monetizationEnabled) {
      // Дуже варіативний, оцінка на основі залученості
      superChatRevenue = subscribers * engagementRate * 0.02; // Дуже груба оцінка
    }

    // Дохід від мерчу (якщо увімкнено)
    let merchandiseRevenue = 0;
    if (merchandiseEnabled && subscribers >= 1000) {
      // Дуже груба оцінка: 0.5-2% підписників купують щось щомісяця
      const merchConversionRate = Math.min(engagementRate, 0.02);
      const avgOrderValue = 25;
      merchandiseRevenue = subscribers * merchConversionRate * avgOrderValue;
    }

    // Загальний поточний місячний дохід
    const totalCurrentRevenue = currentAdRevenue + membershipRevenue + sponsorshipRevenue + superChatRevenue + merchandiseRevenue;

    // Прогнозування зростання з часом
    let projectedSubscribers = subscribers;
    let projectedViews = monthlyViews;
    
    for (let month = 1; month <= projectionMonths; month++) {
      projectedSubscribers *= (1 + monthlyGrowthRate);
      projectedViews *= (1 + monthlyGrowthRate);
    }

    // Розрахунок майбутнього доходу зі зростанням
    let futureAdRevenue = 0;
    if (monetizationEnabled || (projectedSubscribers >= 1000 && projectedViews >= 4000 * 12 / 12)) {
      const rpm = baseCPM * 0.7;
      futureAdRevenue = (projectedViews / 1000) * rpm;
    }

    let futureMembershipRevenue = 0;
    if (membershipsEnabled || projectedSubscribers >= 1000) {
      const membershipConversionRate = Math.min(engagementRate / 2, 0.01);
      futureMembershipRevenue = projectedSubscribers * membershipConversionRate * 4.99;
    }

    let futureSponsorshipRevenue = 0;
    if (projectedSubscribers >= 10000) {
      const sponsorshipMultiplier = {
        'gaming': 2, 'tech': 4, 'lifestyle': 2.5, 'entertainment': 1.5,
        'business': 5, 'health': 3, 'music': 1.5, 'comedy': 1.5
      };
      const avgSponsorshipRate = sponsorshipMultiplier[contentCategory];
      const futureOpportunities = Math.min(sponsorshipRate + Math.floor(projectedSubscribers / 50000), 8);
      futureSponsorshipRevenue = futureOpportunities * (projectedViews / 1000) * avgSponsorshipRate;
    }

    let futureSuperChatRevenue = projectedSubscribers * engagementRate * 0.02;
    
    let futureMerchandiseRevenue = 0;
    if (merchandiseEnabled || projectedSubscribers >= 5000) {
      const merchConversionRate = Math.min(engagementRate, 0.02);
      futureMerchandiseRevenue = projectedSubscribers * merchConversionRate * 25;
    }

    const totalFutureRevenue = futureAdRevenue + futureMembershipRevenue + futureSponsorshipRevenue + futureSuperChatRevenue + futureMerchandiseRevenue;

    // Річні прогнози
    const currentAnnualRevenue = totalCurrentRevenue * 12;
    const futureAnnualRevenue = totalFutureRevenue * 12;

    // Статус монетизації
    let monetizationStatus = "";
    let statusClass = "";
    if (!monetizationEnabled && (subscribers < 1000 || monthlyViews < 4000)) {
      monetizationStatus = "🔄 Працюємо над відповідністю Partner Program";
      statusClass = "warning";
    } else if (totalCurrentRevenue < 100) {
      monetizationStatus = "🌱 Ранній етап монетизації";
      statusClass = "info";
    } else if (totalCurrentRevenue < 1000) {
      monetizationStatus = "📈 Зростаючі джерела доходу";
      statusClass = "info";
    } else {
      monetizationStatus = "💰 Сильна монетизація";
      statusClass = "success";
    }

    // Функція форматування валюти
    const formatCurrency = (amount) => {
      return '$' + Math.round(amount).toLocaleString('uk-UA');
    };

    // Функції для перекладу значень
    const getCategoryName = (category) => {
      const names = {
        'gaming': 'Геймінг',
        'tech': 'Техніка/Освіта',
        'lifestyle': 'Lifestyle/Влог',
        'entertainment': 'Розваги',
        'business': 'Бізнес/Фінанси',
        'health': 'Здоров\'я/Фітнес',
        'music': 'Музика',
        'comedy': 'Комедія'
      };
      return names[category] || category;
    };

    const getTierName = (tier) => {
      const names = {
        'tier1': 'Рівень 1',
        'tier2': 'Рівень 2', 
        'tier3': 'Рівень 3',
        'tier4': 'Рівень 4'
      };
      return names[tier] || tier;
    };

    // Відображення результатів
    const resultBlock = document.getElementById("youtube-monetization-result");
    resultBlock.innerHTML = `
      <h3>📺 Аналіз монетизації YouTube</h3>
      
      <div class="insight-cards">
        <div class="insight-card ${statusClass}">
          <h6>💰 Поточний місячний дохід</h6>
          <div class="big-number">${formatCurrency(totalCurrentRevenue)}</div>
          <p>${monetizationStatus}<br>
          Річний: ${formatCurrency(currentAnnualRevenue)}<br>
          RPM: ${formatCurrency(monetizationEnabled ? (currentAdRevenue / monthlyViews * 1000) : 0)}</p>
        </div>
        
        <div class="insight-card success">
          <h6>🚀 Прогнозований дохід (${projectionMonths}М)</h6>
          <div class="big-number">${formatCurrency(totalFutureRevenue)}</div>
          <p>Місячний з ${(monthlyGrowthRate * 100).toFixed(1)}% зростанням<br>
          Річний: ${formatCurrency(futureAnnualRevenue)}<br>
          ${Math.round(((totalFutureRevenue - totalCurrentRevenue) / Math.max(totalCurrentRevenue, 1)) * 100)}% збільшення</p>
        </div>
        
        <div class="insight-card info">
          <h6>👥 Зростання каналу</h6>
          <div class="big-number">${Math.round(projectedSubscribers).toLocaleString('uk-UA')}</div>
          <p>Прогнозовані підписники<br>
          Перегляди: ${Math.round(projectedViews / 1000)}К/місяць<br>
          Зростання: +${Math.round(((projectedSubscribers - subscribers) / subscribers) * 100)}%</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>💸 Аналіз розбивки доходу</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>📊 Поточні джерела доходу:</strong><br>
            Дохід від реклами: ${formatCurrency(currentAdRevenue)} (${((currentAdRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)<br>
            Спонсорство: ${formatCurrency(sponsorshipRevenue)} (${((sponsorshipRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)<br>
            Членство: ${formatCurrency(membershipRevenue)} (${((membershipRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)<br>
            Мерч: ${formatCurrency(merchandiseRevenue)} (${((merchandiseRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)<br>
            Super Chat/Thanks: ${formatCurrency(superChatRevenue)} (${((superChatRevenue / Math.max(totalCurrentRevenue, 1)) * 100).toFixed(1)}%)
          </div>
          
          <div>
            <strong>🎯 Метрики каналу:</strong><br>
            Підписники: ${subscribers.toLocaleString('uk-UA')}<br>
            Місячні перегляди: ${(monthlyViews / 1000).toFixed(0)}К<br>
            Сер. тривалість перегляду: ${(avgViewDuration * 100).toFixed(1)}%<br>
            Рівень залученості: ${(engagementRate * 100).toFixed(1)}%<br>
            Категорія контенту: ${getCategoryName(contentCategory)}<br>
            Аудиторія: ${getTierName(audienceLocation)} країни
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
          ${!monetizationEnabled && subscribers < 1000 ? `
          <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; text-align: center;">
            <strong>🎯 Наступна віха</strong><br>
            Ще ${1000 - subscribers} підписників<br>
            для Partner Program
          </div>
          ` : ''}
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; text-align: center;">
            <strong>💡 Оптимізація</strong><br>
            Зосередитися на ${avgViewDuration < 0.4 ? 'часі перегляду' : engagementRate < 0.03 ? 'залученості' : 'послідовності'}
          </div>
          
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; text-align: center;">
            <strong>📈 Темп зростання</strong><br>
            ${(monthlyGrowthRate * 100).toFixed(1)}% щомісяця<br>
            ${((Math.pow(1 + monthlyGrowthRate, 12) - 1) * 100).toFixed(0)}% річний
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${totalFutureRevenue >= 1000 ? '#d4edda' : totalFutureRevenue >= 100 ? '#fff3cd' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${totalFutureRevenue >= 1000 ? '#28a745' : totalFutureRevenue >= 100 ? '#ffc107' : '#dc3545'};">
          <strong>💡 Стратегія монетизації:</strong><br>
          ${totalFutureRevenue >= 1000 ?
            '🎉 Відмінний потенціал заробітку! Диверсифікуйте джерела доходу, розгляньте преміум-контент та досліджуйте брендові партнерства. Зосередьтеся на утриманні аудиторії та побудові спільноти.' :
            totalFutureRevenue >= 100 ?
            '✅ Хороша основа для зростання! Оптимізуйте розміщення реклами, покращуйте залученість та почніть будувати email-список. Розгляньте афілійний маркетинг та створення продуктів.' :
            '📈 Зосередьтеся на основах зростання: послідовні завантаження, SEO-оптимізація, залученість аудиторії та якість контенту. Монетизація прийде слідом за зростанням аудиторії.'
          }<br><br>
          
          <strong>🚀 Поради з оптимізації доходу:</strong><br>
          • ${avgViewDuration < 0.4 ? 'Покращуйте утримання відео з кращими хуками та темпом' : 'Створюйте довші відео (8+ хв) для mid-roll реклами'}<br>
          • ${engagementRate < 0.03 ? 'Підвищуйте залученість з CTA та постами спільноти' : 'Використовуйте високу залученість для брендових партнерств'}<br>
          • ${sponsorshipRevenue === 0 && subscribers >= 10000 ? 'Починайте звертатися до брендів для угод спонсорства' : 'Продовжуйте будувати аудиторію для привабливості спонсорів'}
          
          <div style="margin-top: 1rem; padding: 0.8rem; background: rgba(255,255,255,0.8); border-radius: 6px;">
            <strong>🇺🇦 Українські особливості:</strong><br>
            • Розгляньте створення двомовного контенту для ширшого охоплення<br>
            • Використовуйте українські тренди та актуальні теми<br>
            • Взаємодійте з українською YouTube-спільнотою<br>
            • При роботі з брендами враховуйте український ринок
          </div>
        </div>
      </div>
    `;
  });
});