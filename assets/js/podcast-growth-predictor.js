document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("podcast-growth-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentListeners = parseFloat(document.getElementById("currentListeners").value);
    const monthsActive = parseInt(document.getElementById("monthsActive").value);
    const episodesPublished = parseInt(document.getElementById("episodesPublished").value);
    const publishingFrequency = document.getElementById("publishingFrequency").value;
    const contentQuality = document.getElementById("contentQuality").value;
    const episodeLength = document.getElementById("episodeLength").value;
    const marketingBudget = parseFloat(document.getElementById("marketingBudget").value) || 0;
    const socialMediaEffort = document.getElementById("socialMediaEffort").value;
    const hostExperience = document.getElementById("hostExperience").value;
    const nicheCompetition = document.getElementById("nicheCompetition").value;
    const projectionMonths = parseInt(document.getElementById("projectionMonths").value);

    // Base growth rate calculation (monthly multiplier)
    let baseGrowthRate = 1.15; // 15% monthly growth baseline

    // Publishing frequency multiplier
    const frequencyMultipliers = {
      'daily': 1.4,
      'frequent': 1.25,
      'weekly': 1.0,
      'biweekly': 0.85,
      'monthly': 0.6
    };

    // Content quality multiplier
    const qualityMultipliers = {
      'basic': 0.8,
      'good': 1.0,
      'professional': 1.3,
      'exceptional': 1.6
    };

    // Episode length impact (sweet spot is medium)
    const lengthMultipliers = {
      'short': 0.9,
      'medium': 1.0,
      'long': 1.1,
      'extended': 0.95
    };

    // Marketing budget impact (diminishing returns)
    let marketingMultiplier = 1.0;
    if (marketingBudget > 0) {
      marketingMultiplier = 1.0 + Math.min(marketingBudget / 1000, 0.5); // Max 50% boost
    }

    // Social media effort multiplier
    const socialMultipliers = {
      'minimal': 0.9,
      'moderate': 1.0,
      'active': 1.2,
      'intensive': 1.4
    };

    // Host experience multiplier
    const experienceMultipliers = {
      'new': 0.8,
      'some': 1.0,
      'experienced': 1.3,
      'influencer': 1.8
    };

    // Niche competition impact (inverse relationship)
    const competitionMultipliers = {
      'low': 1.3,
      'medium': 1.0,
      'high': 0.8,
      'extreme': 0.6
    };

    // Calculate total multiplier
    const totalMultiplier = frequencyMultipliers[publishingFrequency] *
                            qualityMultipliers[contentQuality] *
                            lengthMultipliers[episodeLength] *
                            marketingMultiplier *
                            socialMultipliers[socialMediaEffort] *
                            experienceMultipliers[hostExperience] *
                            competitionMultipliers[nicheCompetition];

    // Apply growth decay (growth slows as audience grows)
    const adjustedGrowthRate = baseGrowthRate * totalMultiplier;
    const finalGrowthRate = Math.max(adjustedGrowthRate, 1.01); // Minimum 1% growth

    // Calculate projected listeners month by month
    let projectedListeners = currentListeners;
    const growthData = [];
    
    for (let month = 1; month <= projectionMonths; month++) {
      // Apply growth decay as audience grows
      const growthDecay = Math.max(0.85, 1 - (projectedListeners / 50000) * 0.3);
      const monthlyGrowthRate = 1 + ((finalGrowthRate - 1) * growthDecay);
      
      projectedListeners *= monthlyGrowthRate;
      
      growthData.push({
        month: month,
        listeners: Math.round(projectedListeners)
      });
    }

    const finalListeners = projectedListeners;
    const totalGrowth = ((finalListeners - currentListeners) / currentListeners) * 100;

    // Calculate monetization potential
    const currentDownloads = currentListeners * (episodesPublished / Math.max(monthsActive, 1)) * 1.3; // Downloads per episode
    const projectedDownloads = finalListeners * 1.3;

    // Revenue projections (very rough estimates)
    const sponsorRevenue = finalListeners > 1000 ? (finalListeners / 1000) * 25 : 0; // $25 CPM estimate
    const affiliateRevenue = finalListeners * 0.02; // $0.02 per listener estimate
    const productRevenue = finalListeners > 500 ? finalListeners * 0.05 : 0; // Product sales estimate

    const totalMonthlyRevenue = sponsorRevenue + affiliateRevenue + productRevenue;

    // Growth phase assessment
    let growthPhase = "";
    let phaseClass = "";
    if (finalListeners < 1000) {
      growthPhase = "🌱 Фаза побудови фундаменту";
      phaseClass = "warning";
    } else if (finalListeners < 5000) {
      growthPhase = "📈 Фаза зростання";
      phaseClass = "info";
    } else if (finalListeners < 25000) {
      growthPhase = "🚀 Фаза масштабування";
      phaseClass = "success";
    } else {
      growthPhase = "⭐ Встановлене шоу";
      phaseClass = "success";
    }

    // Translate frequency labels
    const frequencyLabels = {
      'daily': 'щодня',
      'frequent': 'часто', 
      'weekly': 'щотижня',
      'biweekly': 'двічі на місяць',
      'monthly': 'щомісяця'
    };

    const qualityLabels = {
      'basic': 'базовий',
      'good': 'хороший',
      'professional': 'професійний',
      'exceptional': 'виняткова'
    };

    const socialLabels = {
      'minimal': 'мінімальні',
      'moderate': 'помірні',
      'active': 'активні',
      'intensive': 'інтенсивні'
    };

    const experienceLabels = {
      'new': 'новачок',
      'some': 'деякий досвід',
      'experienced': 'досвідчений',
      'influencer': 'інфлюенсер'
    };

    const competitionLabels = {
      'low': 'низький',
      'medium': 'середній',
      'high': 'високий',
      'extreme': 'екстремальний'
    };

    // Display results
    const resultBlock = document.getElementById("podcast-growth-result");
    resultBlock.innerHTML = `
      <h3>🎙️ Прогноз зростання вашого подкасту</h3>
      
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>👥 Поточний статус</h6>
          <div class="big-number">${currentListeners.toLocaleString()}</div>
          <p>Щомісячних слухачів<br>
          ${episodesPublished} епізодів опубліковано<br>
          Активний протягом ${monthsActive} місяців</p>
        </div>
        
        <div class="insight-card ${phaseClass}">
          <h6>📊 Прогнозоване зростання (${projectionMonths} міс.)</h6>
          <div class="big-number">${Math.round(finalListeners).toLocaleString()}</div>
          <p>Щомісячних слухачів<br>
          ${totalGrowth > 0 ? '+' : ''}${Math.round(totalGrowth)}% загального зростання<br>
          ${growthPhase}</p>
        </div>
        
        <div class="insight-card success">
          <h6>💰 Потенціал доходу</h6>
          <div class="big-number">$${Math.round(totalMonthlyRevenue).toLocaleString()}</div>
          <p>Орієнтовний щомісячний дохід<br>
          Спонсори: $${Math.round(sponsorRevenue).toLocaleString()}<br>
          Продукти/Партнерські: $${Math.round(affiliateRevenue + productRevenue).toLocaleString()}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📈 Аналіз стратегії зростання</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <div>
            <strong>🎯 Фактори стратегії:</strong><br>
            Публікація: ${frequencyLabels[publishingFrequency]} (${(frequencyMultipliers[publishingFrequency] * 100).toFixed(0)}%)<br>
            Якість контенту: ${qualityLabels[contentQuality]} (${(qualityMultipliers[contentQuality] * 100).toFixed(0)}%)<br>
            Маркетинговий бюджет: $${marketingBudget}/міс. (${(marketingMultiplier * 100).toFixed(0)}%)<br>
            Соціальні мережі: ${socialLabels[socialMediaEffort]} (${(socialMultipliers[socialMediaEffort] * 100).toFixed(0)}%)<br>
            Досвід ведучого: ${experienceLabels[hostExperience]} (${(experienceMultipliers[hostExperience] * 100).toFixed(0)}%)<br>
            Конкуренція: ${competitionLabels[nicheCompetition]} (${(competitionMultipliers[nicheCompetition] * 100).toFixed(0)}%)
          </div>
          
          <div>
            <strong>📊 Метрики зростання:</strong><br>
            Базова швидкість зростання: ${((baseGrowthRate - 1) * 100).toFixed(1)}%/міс.<br>
            Мультиплікатор стратегії: ${totalMultiplier.toFixed(2)}x<br>
            Скореговане зростання: ${((finalGrowthRate - 1) * 100).toFixed(1)}%/міс.<br>
            Завантажень/епізод: ${Math.round(projectedDownloads).toLocaleString()}<br>
            Готовність до монетизації: ${finalListeners >= 1000 ? 'Так' : 'Через ' + Math.ceil((1000 - finalListeners) / (finalListeners - currentListeners) * projectionMonths) + ' місяців'}
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px;">
          <strong>📅 Щомісячний план зростання:</strong><br>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem; margin-top: 0.5rem; font-size: 0.9em;">
            ${growthData.slice(0, 12).map((data, index) => `
              <div style="text-align: center; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                М${data.month}<br>
                <strong>${data.listeners.toLocaleString()}</strong>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: ${finalListeners >= 5000 ? '#d4edda' : finalListeners >= 1000 ? '#fff3cd' : '#f8d7da'}; border-radius: 8px; border-left: 4px solid ${finalListeners >= 5000 ? '#28a745' : finalListeners >= 1000 ? '#ffc107' : '#dc3545'};">
          <strong>💡 Рекомендації щодо зростання:</strong><br>
          ${finalListeners >= 5000 ?
            '🎉 Відмінна траєкторія зростання! Зосередьтеся на монетизації, преміум-контенті та побудові спільноти. Розгляньте розширення до кількох шоу або форматів.' :
            finalListeners >= 1000 ?
            '✅ Хороший потенціал зростання! Продовжуйте послідовність, покращуйте якість контенту та починайте досліджувати можливості спонсорства. Будуйте email-список та соціальну аудиторію.' :
            '📈 Будування фундаменту. Зосередьтеся на послідовності, залученні аудиторії та якості контенту. Збільште маркетингові зусилля та розгляньте можливості співпраці.'
          }<br><br>
          
          <strong>🚀 Наступні кроки:</strong> ${
            adjustedGrowthRate < 1.1 ?
            'Збільште частоту публікації, покращте якість контенту або посильте маркетингові зусилля для прискорення зростання.' :
            'Підтримуйте поточну стратегію, зосереджуючись на утриманні аудиторії та якості залучення.'
          }
        </div>
      </div>
    `;
  });
});