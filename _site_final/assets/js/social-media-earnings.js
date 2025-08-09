document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("social-media-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Отримання значень форми
    const instagramFollowers = parseFloat(document.getElementById("instagramFollowers").value) || 0;
    const instagramEngagement = parseFloat(document.getElementById("instagramEngagement").value) / 100 || 0;
    const tiktokFollowers = parseFloat(document.getElementById("tiktokFollowers").value) || 0;
    const tiktokEngagement = parseFloat(document.getElementById("tiktokEngagement").value) / 100 || 0;
    const telegramSubscribers = parseFloat(document.getElementById("telegramSubscribers").value) || 0;
    const contentNiche = document.getElementById("contentNiche").value;
    const audienceLocation = document.getElementById("audienceLocation").value;
    const audienceAge = document.getElementById("audienceAge").value;
    const monthlyPosts = parseInt(document.getElementById("monthlyPosts").value) || 0;
    const affiliateActive = document.getElementById("affiliateActive").value === 'true';
    const ownProducts = document.getElementById("ownProducts").value === 'true';
    const contentQuality = document.getElementById("contentQuality").value;

    // Множники за нішею для українського ринку
    const nicheMultipliers = {
      'lifestyle': 1.0,
      'beauty': 1.3,
      'tech': 1.5,
      'business': 1.8,
      'food': 1.1,
      'travel': 1.2,
      'fitness': 1.4,
      'education': 1.6,
      'entertainment': 0.9
    };

    // Множники за локацією аудиторії
    const locationMultipliers = {
      'ukraine': 1.0,
      'europe': 2.2,
      'usa': 3.5,
      'global': 1.8
    };

    // Множники за віковою групою
    const ageMultipliers = {
      '18-24': 0.8,
      '25-34': 1.2,
      '35-44': 1.4,
      '45+': 1.1
    };

    // Множники за якістю контенту
    const qualityMultipliers = {
      'basic': 0.7,
      'good': 1.0,
      'premium': 1.5
    };

    const nicheMultiplier = nicheMultipliers[contentNiche];
    const locationMultiplier = locationMultipliers[audienceLocation];
    const ageMultiplier = ageMultipliers[audienceAge];
    const qualityMultiplier = qualityMultipliers[contentQuality];

    // Розрахунок доходу Instagram
    let instagramRevenue = 0;
    if (instagramFollowers > 0) {
      // Базова ставка: $0.01-0.05 за підписника за пост
      const baseInstagramRate = 0.02;
      const engagementBonus = Math.min(instagramEngagement * 10, 2); // Макс 2x множник
      const followerTier = instagramFollowers < 10000 ? 0.5 : 
                          instagramFollowers < 100000 ? 1.0 : 
                          instagramFollowers < 500000 ? 1.3 : 1.6;
      
      const pricePerPost = instagramFollowers * baseInstagramRate * engagementBonus * 
                          followerTier * nicheMultiplier * locationMultiplier * 
                          ageMultiplier * qualityMultiplier;
      
      instagramRevenue = pricePerPost * monthlyPosts;
    }

    // Розрахунок доходу TikTok
    let tiktokRevenue = 0;
    if (tiktokFollowers > 0) {
      // TikTok має нижчі ставки але вищу залученість
      const baseTiktokRate = 0.015;
      const engagementBonus = Math.min(tiktokEngagement * 8, 3); // Макс 3x множник
      const followerTier = tiktokFollowers < 10000 ? 0.4 : 
                          tiktokFollowers < 100000 ? 0.8 : 
                          tiktokFollowers < 500000 ? 1.1 : 1.4;
      
      const pricePerPost = tiktokFollowers * baseTiktokRate * engagementBonus * 
                          followerTier * nicheMultiplier * locationMultiplier * 
                          ageMultiplier * qualityMultiplier;
      
      // TikTok Creator Fund (якщо є право)
      let creatorFund = 0;
      if (tiktokFollowers >= 10000) {
        // Орієнтовно $20-40 за мільйон переглядів
        const estimatedViews = tiktokFollowers * tiktokEngagement * 30; // оцінка місячних переглядів
        creatorFund = (estimatedViews / 1000000) * 30 * locationMultiplier * 0.5; // 50% для України
      }
      
      tiktokRevenue = pricePerPost * monthlyPosts + creatorFund;
    }

    // Розрахунок доходу Telegram
    let telegramRevenue = 0;
    if (telegramSubscribers > 0) {
      // Telegram має специфічні можливості для України
      const baseTelegramRate = 0.03; // Вища ставка для цільової аудиторії
      const pricePerPost = telegramSubscribers * baseTelegramRate * nicheMultiplier * 
                          ageMultiplier * qualityMultiplier;
      
      // Платні підписки (якщо канал має більше 1000 підписників)
      let subscriptionRevenue = 0;
      if (telegramSubscribers >= 1000) {
        const subscriptionRate = Math.min(telegramSubscribers * 0.02, telegramSubscribers * 0.1); // 2-10% конверсія
        subscriptionRevenue = subscriptionRate * 5; // $5 середня ціна підписки
      }
      
      telegramRevenue = pricePerPost * monthlyPosts * 0.5 + subscriptionRevenue; // Менше постів в Telegram
    }

    // Афілійний маркетинг
    let affiliateRevenue = 0;
    if (affiliateActive) {
      const totalFollowers = instagramFollowers + tiktokFollowers + telegramSubscribers;
      const averageEngagement = (instagramEngagement + tiktokEngagement) / 2;
      
      // Оцінка доходу від афілійного маркетингу
      affiliateRevenue = totalFollowers * 0.001 * averageEngagement * 50 * nicheMultiplier * locationMultiplier;
    }

    // Власні продукти/послуги
    let ownProductRevenue = 0;
    if (ownProducts) {
      const totalFollowers = instagramFollowers + tiktokFollowers + telegramSubscribers;
      const conversionRate = contentNiche === 'business' || contentNiche === 'education' ? 0.005 : 0.002;
      
      ownProductRevenue = totalFollowers * conversionRate * 100 * locationMultiplier; // $100 середній чек
    }

    // Загальний місячний дохід
    const totalMonthlyRevenue = instagramRevenue + tiktokRevenue + telegramRevenue + affiliateRevenue + ownProductRevenue;
    const totalAnnualRevenue = totalMonthlyRevenue * 12;

    // Розрахунок ціни за підписника
    const totalFollowers = instagramFollowers + tiktokFollowers + telegramSubscribers;
    const revenuePerFollower = totalFollowers > 0 ? totalMonthlyRevenue / totalFollowers : 0;

    // Статус монетизації
    let monetizationStatus = "";
    let statusClass = "";
    if (totalMonthlyRevenue < 100) {
      monetizationStatus = "🌱 Початкова стадія монетизації";
      statusClass = "warning";
    } else if (totalMonthlyRevenue < 1000) {
      monetizationStatus = "📈 Розвиваюча монетизація";
      statusClass = "info";
    } else {
      monetizationStatus = "💰 Ефективна монетизація";
      statusClass = "success";
    }

    // Форматування валюти
    const formatCurrency = (amount) => {
      return '$' + Math.round(amount).toLocaleString('uk-UA');
    };

    // Функції для перекладу значень
    const getNicheName = (niche) => {
      const names = {
        'lifestyle': 'Lifestyle',
        'beauty': 'Краса та мода',
        'tech': 'Технології',
        'business': 'Бізнес та фінанси',
        'food': 'Їжа та кулінарія',
        'travel': 'Подорожі',
        'fitness': 'Фітнес та здоров\'я',
        'education': 'Освіта',
        'entertainment': 'Розваги'
      };
      return names[niche] || niche;
    };

    const getLocationName = (location) => {
      const names = {
        'ukraine': 'Україна',
        'europe': 'Європа',
        'usa': 'США/Канада',
        'global': 'Глобальна'
      };
      return names[location] || location;
    };

    // Відображення результатів
    const resultBlock = document.getElementById("social-media-result");
    resultBlock.innerHTML = `
      <h3>📱 Аналіз доходів у соціальних мережах</h3>
      
      <div class="insight-cards">
        <div class="insight-card ${statusClass}">
          <h6>💰 Місячний дохід</h6>
          <div class="big-number">${formatCurrency(totalMonthlyRevenue)}</div>
          <p>${monetizationStatus}<br>
          Річний: ${formatCurrency(totalAnnualRevenue)}<br>
          На підписника: ${formatCurrency(revenuePerFollower)}</p>
        </div>
        
        <div class="insight-card info">
          <h6>👥 Загальна аудиторія</h6>
          <div class="big-number">${totalFollowers.toLocaleString('uk-UA')}</div>
          <p>Підписників загалом<br>
          Instagram: ${instagramFollowers.toLocaleString('uk-UA')}<br>
          TikTok: ${tiktokFollowers.toLocaleString('uk-UA')}</p>
        </div>
        
        <div class="insight-card success">
          <h6>📊 Ефективність</h6>
          <div class="big-number">${((instagramEngagement + tiktokEngagement) / 2 * 100).toFixed(1)}%</div>
          <p>Середня залученість<br>
          Ніша: ${getNicheName(contentNiche)}<br>
          Аудиторія: ${getLocationName(audienceLocation)}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>💸 Розбивка доходів за джерелами</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>📱 Доходи за платформами:</strong><br>
            Instagram: ${formatCurrency(instagramRevenue)} (${((instagramRevenue / Math.max(totalMonthlyRevenue, 1)) * 100).toFixed(1)}%)<br>
            TikTok: ${formatCurrency(tiktokRevenue)} (${((tiktokRevenue / Math.max(totalMonthlyRevenue, 1)) * 100).toFixed(1)}%)<br>
            Telegram: ${formatCurrency(telegramRevenue)} (${((telegramRevenue / Math.max(totalMonthlyRevenue, 1)) * 100).toFixed(1)}%)<br>
            Афілійний маркетинг: ${formatCurrency(affiliateRevenue)} (${((affiliateRevenue / Math.max(totalMonthlyRevenue, 1)) * 100).toFixed(1)}%)<br>
            Власні продукти: ${formatCurrency(ownProductRevenue)} (${((ownProductRevenue / Math.max(totalMonthlyRevenue, 1)) * 100).toFixed(1)}%)
          </div>
          
          <div>
            <strong>🎯 Параметри впливу:</strong><br>
            Ніша: ${(nicheMultiplier * 100).toFixed(0)}% множник<br>
            Локація: ${(locationMultiplier * 100).toFixed(0)}% множник<br>
            Вік аудиторії: ${(ageMultiplier * 100).toFixed(0)}% множник<br>
            Якість контенту: ${(qualityMultiplier * 100).toFixed(0)}% множник<br>
            Рекламних постів: ${monthlyPosts}/місяць
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          ${instagramFollowers < 10000 ? `
          <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; text-align: center;">
            <strong>📈 Instagram</strong><br>
            ${10000 - instagramFollowers} підписників до 10К<br>
            для кращих ставок
          </div>
          ` : ''}
          
          ${tiktokFollowers < 10000 ? `
          <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; text-align: center;">
            <strong>🎵 TikTok</strong><br>
            ${10000 - tiktokFollowers} підписників до Creator Fund
          </div>
          ` : ''}
          
          <div style="padding: 1rem; background: #e8f5e8; border-radius: 8px; text-align: center;">
            <strong>💡 Оптимізація</strong><br>
            ${instagramEngagement < 0.03 ? 'Покращити залученість Instagram' : 
              tiktokEngagement < 0.05 ? 'Покращити залученість TikTok' : 
              'Диверсифікувати джерела доходу'}
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${totalMonthlyRevenue >= 1000 ? '#d4edda' : totalMonthlyRevenue >= 100 ? '#fff3cd' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${totalMonthlyRevenue >= 1000 ? '#28a745' : totalMonthlyRevenue >= 100 ? '#ffc107' : '#dc3545'};">
          <strong>💡 Стратегічні рекомендації:</strong><br>
          ${totalMonthlyRevenue >= 1000 ?
            '🎉 Відмінний результат! Фокусуйтеся на диверсифікації доходів, створенні власних продуктів та розвитку довгострокових партнерств з брендами.' :
            totalMonthlyRevenue >= 100 ?
            '✅ Хороший потенціал! Оптимізуйте залученість, розширюйте аудиторію та додавайте нові джерела доходу як афілійний маркетинг.' :
            '📈 Зосередьтеся на зростанні аудиторії та покращенні залученості. Експериментуйте з форматами контенту та активно взаємодійте з підписниками.'
          }<br><br>
          
          <strong>🚀 Поради для зростання доходу:</strong><br>
          • ${instagramEngagement < 0.03 ? 'Покращуйте залученість Instagram через Stories та Reels' : 'Використовуйте високу залученість для переговорів з брендами'}<br>
          • ${monthlyPosts < 2 ? 'Збільште частоту рекламних постів (оптимально 2-4/місяць)' : 'Балансуйте рекламний та органічний контент'}<br>
          • ${!affiliateActive ? 'Починайте афілійний маркетинг з продуктів, якими користуєтесь' : 'Диверсифікуйте афілійні програми'}
          
          <div style="margin-top: 1rem; padding: 0.8rem; background: rgba(255,255,255,0.8); border-radius: 6px;">
            <strong>🇺🇦 Українські особливості:</strong><br>
            • Працюйте з локальними брендами та українськими компаніями<br>
            • Використовуйте Telegram для прямої комунікації з аудиторією<br>
            • Розгляньте створення курсів або консультацій українською мовою<br>
            • Співпрацюйте з іншими українськими блогерами для взаємного розвитку
          </div>
        </div>
      </div>
    `;
  });
});