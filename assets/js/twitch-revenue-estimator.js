document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("streaming-revenue-form");
  const result = document.getElementById("streaming-revenue-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateStreamingRevenue();
  });

  function calculateStreamingRevenue() {
    // Get form values
    const platform = document.getElementById("platform").value;
    const followers = parseInt(document.getElementById("followers").value) || 0;
    const avgViewers = parseInt(document.getElementById("avg-viewers").value) || 0;
    const hoursPerStream = parseFloat(document.getElementById("hours-per-stream").value) || 0;
    const streamsPerWeek = parseInt(document.getElementById("streams-per-week").value) || 0;
    const subscribers = parseInt(document.getElementById("subscribers").value) || 0;
    const avgDonation = parseFloat(document.getElementById("avg-donation").value) || 0;
    const donationsPerStream = parseInt(document.getElementById("donations-per-stream").value) || 0;
    const sponsorshipMonthly = parseFloat(document.getElementById("sponsorship-monthly").value) || 0;
    const adRevenuePerHour = parseFloat(document.getElementById("ad-revenue-per-hour").value) || 0;

    if (!platform || followers < 0 || avgViewers < 0) {
      result.innerHTML = '<div class="error">Будь ласка, заповніть всі обов\'язкові поля коректними значеннями.</div>';
      return;
    }

    // Calculate various revenue streams
    const revenues = calculateRevenueStreams(
      platform, followers, avgViewers, hoursPerStream, streamsPerWeek,
      subscribers, avgDonation, donationsPerStream, sponsorshipMonthly, adRevenuePerHour
    );

    // Get streamer tier and recommendations
    const streamerTier = getStreamerTier(followers, avgViewers);
    const recommendations = getRecommendations(streamerTier, platform);

    displayResults(revenues, streamerTier, recommendations, platform);
  }

  function calculateRevenueStreams(platform, followers, avgViewers, hoursPerStream, streamsPerWeek, 
                                   subscribers, avgDonation, donationsPerStream, sponsorshipMonthly, adRevenuePerHour) {
    
    // Platform commission rates
    const commissionRates = {
      twitch: { subs: 0.5, donations: 0.05 },
      youtube: { subs: 0.3, donations: 0.05 },
      tiktok: { subs: 0.3, donations: 0.05 },
      facebook: { subs: 0.3, donations: 0.05 }
    };

    const rate = commissionRates[platform] || commissionRates.twitch;

    // Monthly calculations
    const weeksPerMonth = 4.33;
    const totalStreamsPerMonth = streamsPerWeek * weeksPerMonth;
    const totalHoursPerMonth = totalStreamsPerMonth * hoursPerStream;

    // Subscription revenue (monthly)
    const subPrice = 4.99; // Tier 1 subscription price
    const subscriptionRevenue = subscribers * subPrice * (1 - rate.subs);

    // Donation revenue (monthly)
    const totalDonationsPerMonth = donationsPerStream * totalStreamsPerMonth;
    const donationRevenue = totalDonationsPerMonth * avgDonation * (1 - rate.donations);

    // Ad revenue (monthly)
    const adRevenue = totalHoursPerMonth * adRevenuePerHour;

    // Sponsorship revenue (already monthly)
    const sponsorshipRevenue = sponsorshipMonthly;

    // Total monthly revenue
    const totalMonthly = subscriptionRevenue + donationRevenue + adRevenue + sponsorshipRevenue;

    return {
      subscriptions: subscriptionRevenue,
      donations: donationRevenue,
      ads: adRevenue,
      sponsorships: sponsorshipRevenue,
      total: totalMonthly,
      yearly: totalMonthly * 12,
      totalStreamsPerMonth: Math.round(totalStreamsPerMonth),
      totalHoursPerMonth: Math.round(totalHoursPerMonth * 10) / 10
    };
  }

  function getStreamerTier(followers, avgViewers) {
    if (followers < 100 || avgViewers < 10) {
      return {
        name: "Початківець",
        description: "Фокус на створення контенту та пошук аудиторії",
        color: "info"
      };
    } else if (followers < 1000 || avgViewers < 50) {
      return {
        name: "Зростання",
        description: "Розвиток аудиторії та перші доходи",
        color: "warning"
      };
    } else if (followers < 10000 || avgViewers < 200) {
      return {
        name: "Партнер",
        description: "Стабільна монетизація та регулярні доходи",
        color: "success"
      };
    } else {
      return {
        name: "Топ-стрімер",
        description: "Повноцінна кар'єра у стрімінгу",
        color: "success"
      };
    }
  }

  function getRecommendations(tier, platform) {
    const baseRecommendations = {
      "Початківець": [
        "Встановіть регулярний розклад стрімів (мінімум 3 рази на тиждень)",
        "Фокусуйтеся на якості контенту, а не на кількості глядачів", 
        "Активно взаємодійте з кожним глядачем у чаті",
        "Створіть профілі в соцмережах та діліться моментами зі стрімів",
        "Вивчайте успішних стрімерів у вашій ніші"
      ],
      "Зростання": [
        "Починайте експериментувати з різними типами контенту",
        "Налаштуйте донати та підписки через сторонні сервіси",
        "Розвивайте особистий бренд та унікальний стиль",
        "Співпрацюйте з іншими стрімерами схожого рівня",
        "Початок роботи з невеликими спонсорськими угодами"
      ],
      "Партнер": [
        "Диверсифікуйте джерела доходу (мерч, курси, афіліат)",
        "Почніть працювати зі спонсорами та брендами",
        "Розгляньте можливість найму модераторів та помічників",
        "Створюйте додатковий контент для соцмереж",
        "Інвестуйте в покращення обладнання та налаштувань"
      ],
      "Топ-стрімер": [
        "Розгляньте створення власної команди чи організації",
        "Інвестуйте в довготривалі партнерства з великими брендами",
        "Створюйте освітній контент та менторські програми",
        "Розширюйтеся на інші платформи та медіа",
        "Розгляньте інвестиції в інші напрямки бізнесу"
      ]
    };

    return baseRecommendations[tier.name] || baseRecommendations["Початківець"];
  }

  function displayResults(revenues, tier, recommendations, platform) {
    const platformEmojis = {
      twitch: "📺",
      youtube: "🎥", 
      tiktok: "🎵",
      facebook: "📘"
    };

    const platformNames = {
      twitch: "Twitch",
      youtube: "YouTube",
      tiktok: "TikTok Live",
      facebook: "Facebook Gaming"
    };

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>💰 Місячний дохід</h6>
          <div class="big-number">$${revenues.total.toFixed(0)}</div>
          <p>Загальний потенційний дохід</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Річний дохід</h6>
          <div class="big-number">$${revenues.yearly.toFixed(0)}</div>
          <p>Екстраполяція на рік</p>
        </div>

        <div class="insight-card ${tier.color}">
          <h6>🎯 Рівень стрімера</h6>
          <div class="big-number">${tier.name}</div>
          <p>${tier.description}</p>
        </div>
      </div>

      <div class="revenue-breakdown">
        <h4>📊 Розподіл доходів</h4>
        <div class="revenue-chart">
          <div class="revenue-item">
            <span class="revenue-label">💰 Підписки:</span>
            <span class="revenue-amount">$${revenues.subscriptions.toFixed(2)}/міс</span>
            <div class="revenue-bar">
              <div class="revenue-fill" style="width: ${(revenues.subscriptions / revenues.total * 100)}%"></div>
            </div>
          </div>
          
          <div class="revenue-item">
            <span class="revenue-label">🎁 Донати:</span>
            <span class="revenue-amount">$${revenues.donations.toFixed(2)}/міс</span>
            <div class="revenue-bar">
              <div class="revenue-fill" style="width: ${(revenues.donations / revenues.total * 100)}%"></div>
            </div>
          </div>
          
          <div class="revenue-item">
            <span class="revenue-label">📊 Реклама:</span>
            <span class="revenue-amount">$${revenues.ads.toFixed(2)}/міс</span>
            <div class="revenue-bar">
              <div class="revenue-fill" style="width: ${(revenues.ads / revenues.total * 100)}%"></div>
            </div>
          </div>
          
          <div class="revenue-item">
            <span class="revenue-label">🤝 Спонсорство:</span>
            <span class="revenue-amount">$${revenues.sponsorships.toFixed(2)}/міс</span>
            <div class="revenue-bar">
              <div class="revenue-fill" style="width: ${(revenues.sponsorships / revenues.total * 100)}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="streaming-stats">
        <h4>📈 Статистика стрімінгу</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <strong>Платформа:</strong> ${platformEmojis[platform]} ${platformNames[platform]}
          </div>
          <div class="stat-item">
            <strong>Стрімів на місяць:</strong> ${revenues.totalStreamsPerMonth}
          </div>
          <div class="stat-item">
            <strong>Годин на місяць:</strong> ${revenues.totalHoursPerMonth}
          </div>
          <div class="stat-item">
            <strong>Дохід за годину:</strong> $${(revenues.total / revenues.totalHoursPerMonth).toFixed(2)}
          </div>
        </div>
      </div>

      <div class="recommendations">
        <h4>💡 Рекомендації для росту</h4>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>

      <div class="disclaimer">
        <h4>⚠️ Важливі зауваження</h4>
        <ul>
          <li>Розрахунки базуються на середніх показниках та можуть відрізнятися</li>
          <li>Доходи можуть значно варіюватися залежно від контенту та аудиторії</li>
          <li>Враховуйте комісії платформ та податки у своїх розрахунках</li>
          <li>Стабільні доходи потребують часу та постійних зусиль</li>
        </ul>
      </div>
    `;
  }
});