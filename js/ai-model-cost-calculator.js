document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ai-cost-form');
  const result = document.getElementById('cost-result');

  function formatUA(val) {
    return val.toLocaleString('uk-UA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  function formatCurrency(val) {
    return '$' + val.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  // Pricing data per hour (USD)
  const instancePricing = {
    aws: {
      'gpu-basic': 0.526,    // p3.2xlarge (Tesla V100)
      'gpu-mid': 3.06,       // p3.8xlarge
      'gpu-high': 32.77,     // p4d.24xlarge (A100)
      'gpu-cluster': 130.0   // Multiple p4d instances
    },
    gcp: {
      'gpu-basic': 0.45,     // n1-standard-4 + Tesla T4
      'gpu-mid': 2.48,       // n1-standard-8 + Tesla V100
      'gpu-high': 28.50,     // a2-highgpu-1g + A100
      'gpu-cluster': 114.0   // Multiple A100 instances
    },
    azure: {
      'gpu-basic': 0.60,     // NC6s v3 (Tesla V100)
      'gpu-mid': 3.24,       // NC24s v3
      'gpu-high': 35.20,     // ND96asr v4 (A100)
      'gpu-cluster': 140.8   // Multiple NC instances
    },
    paperspace: {
      'gpu-basic': 0.40,     // RTX 4000
      'gpu-mid': 0.78,       // RTX 5000
      'gpu-high': 2.30,      // A100
      'gpu-cluster': 9.20    // Multiple A100
    }
  };

  // Storage pricing per GB per month
  const storagePricing = {
    aws: 0.023,     // S3 Standard
    gcp: 0.020,     // Cloud Storage Standard
    azure: 0.0184,  // Blob Storage Hot
    paperspace: 0.029 // Persistent Storage
  };

  // Network pricing per GB
  const networkPricing = {
    aws: 0.09,      // Data Transfer Out
    gcp: 0.12,      // Network Egress
    azure: 0.087,   // Bandwidth
    paperspace: 0.10 // Data Transfer
  };

  function calculateCosts({
    provider,
    instanceType,
    trainingHours,
    datasetSizeGB,
    networkTraffic,
    additionalServices,
    spotInstances,
    reservedInstances,
    autoShutdown
  }) {
    // Base compute cost
    let computeCost = instancePricing[provider][instanceType] * trainingHours;
    
    // Apply discounts
    if (spotInstances) computeCost *= 0.3; // 70% discount
    else if (reservedInstances) computeCost *= 0.6; // 40% discount
    
    if (autoShutdown) computeCost *= 0.8; // 20% savings
    
    // Storage cost (assuming 1 month storage)
    const storageCost = datasetSizeGB * storagePricing[provider];
    
    // Network cost
    const networkCost = networkTraffic * networkPricing[provider];
    
    // Total cost
    const totalCost = computeCost + storageCost + networkCost + additionalServices;
    
    return {
      computeCost,
      storageCost,
      networkCost,
      additionalServices,
      totalCost,
      hourlyRate: instancePricing[provider][instanceType]
    };
  }

  function getProviderInfo(provider) {
    const providers = {
      aws: {
        name: "Amazon Web Services",
        icon: "🟠",
        strengths: ["Найбільший вибір інстансів", "Глобальна інфраструктура", "Зрілі ML сервіси"]
      },
      gcp: {
        name: "Google Cloud Platform", 
        icon: "🔵",
        strengths: ["Кращі ціни на TPU", "TensorFlow інтеграція", "AutoML сервіси"]
      },
      azure: {
        name: "Microsoft Azure",
        icon: "🔷", 
        strengths: ["Гібридні рішення", "Office 365 інтеграція", "Корпоративна безпека"]
      },
      paperspace: {
        name: "Paperspace",
        icon: "🚀",
        strengths: ["Простота використання", "ML-орієнтований", "Конкурентні ціни"]
      }
    };
    return providers[provider];
  }

  function getInstanceInfo(instanceType) {
    const instances = {
      'gpu-basic': {
        name: "Базовий GPU",
        description: "T4/RTX серія - підходить для малих та середніх моделей",
        memory: "16-24 ГБ GPU пам'яті"
      },
      'gpu-mid': {
        name: "Середній GPU", 
        description: "V100/RTX 3090 - для більших моделей та швидшого навчання",
        memory: "32-48 ГБ GPU пам'яті"
      },
      'gpu-high': {
        name: "Потужний GPU",
        description: "A100/H100 - для великих трансформерів та дослідницьких проектів", 
        memory: "80+ ГБ GPU пам'яті"
      },
      'gpu-cluster': {
        name: "Multi-GPU кластер",
        description: "Кілька GPU для розподіленого навчання великих моделей",
        memory: "256+ ГБ сумарної GPU пам'яті"
      }
    };
    return instances[instanceType];
  }

  function generateSavingsRecommendations(costs, options) {
    const recommendations = [];
    
    if (!options.spotInstances && costs.computeCost > 100) {
      const savings = costs.computeCost * 0.7;
      recommendations.push({
        icon: "💰",
        text: `Spot інстанси можуть заощадити ${formatCurrency(savings)}`,
        type: "savings"
      });
    }
    
    if (!options.autoShutdown) {
      const savings = costs.computeCost * 0.2;
      recommendations.push({
        icon: "⏰", 
        text: `Автовимкнення заощадить ${formatCurrency(savings)}`,
        type: "optimization"
      });
    }
    
    if (costs.storageCost > 50) {
      recommendations.push({
        icon: "💾",
        text: "Розгляньте cold storage для економії на зберіганні",
        type: "storage"
      });
    }
    
    return recommendations;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const trainingHours = Number(document.getElementById('training-hours').value);
      const datasetSizeGB = Number(document.getElementById('dataset-size-gb').value);
      const networkTraffic = Number(document.getElementById('network-traffic').value);
      const additionalServices = Number(document.getElementById('additional-services').value);
      
      const provider = form.querySelector('input[name="provider"]:checked').value;
      const instanceType = form.querySelector('input[name="instance-type"]:checked').value;
      
      const spotInstances = document.getElementById('spot-instances').checked;
      const reservedInstances = document.getElementById('reserved-instances').checked;
      const autoShutdown = document.getElementById('auto-shutdown').checked;

      if (trainingHours < 0.1 || datasetSizeGB < 0.1) {
        result.innerHTML = '<p style="color: red;">Будь ласка, введіть коректні значення для всіх полів.</p>';
        return;
      }

      const costs = calculateCosts({
        provider,
        instanceType,
        trainingHours,
        datasetSizeGB,
        networkTraffic,
        additionalServices,
        spotInstances,
        reservedInstances,
        autoShutdown
      });

      const providerInfo = getProviderInfo(provider);
      const instanceInfo = getInstanceInfo(instanceType);
      const recommendations = generateSavingsRecommendations(costs, {
        spotInstances,
        reservedInstances,
        autoShutdown
      });

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>💳 Загальна вартість</h6>
            <div class="big-number">${formatCurrency(costs.totalCost)}</div>
            <p>Повна вартість навчання</p>
          </div>
          <div class="insight-card success">
            <h6>⚡ Обчислення</h6>
            <div class="result-value">${formatCurrency(costs.computeCost)}</div>
            <p>${formatCurrency(costs.hourlyRate)}/година</p>
          </div>
          <div class="insight-card warning">
            <h6>💾 Зберігання + Мережа</h6>
            <div class="result-value">${formatCurrency(costs.storageCost + costs.networkCost)}</div>
            <p>Дані та трафік</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #157aff; margin-bottom: 1rem;">📊 Деталізація витрат</h4>
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #157aff;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
              <span>💻 Обчислювальні ресурси:</span>
              <strong>${formatCurrency(costs.computeCost)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
              <span>💾 Зберігання даних (${formatUA(datasetSizeGB)} ГБ):</span>
              <strong>${formatCurrency(costs.storageCost)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
              <span>🌐 Мережевий трафік (${formatUA(networkTraffic)} ГБ):</span>
              <strong>${formatCurrency(costs.networkCost)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
              <span>🔧 Додаткові сервіси:</span>
              <strong>${formatCurrency(additionalServices)}</strong>
            </div>
            <hr style="border: none; border-top: 2px solid #157aff; margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; font-size: 1.1em;">
              <span><strong>Загальна вартість:</strong></span>
              <strong style="color: #157aff;">${formatCurrency(costs.totalCost)}</strong>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #6c757d; margin-bottom: 1rem;">ℹ️ Інформація про конфігурацію</h4>
          <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px;">
            <div style="margin-bottom: 1rem;">
              <strong>${providerInfo.icon} ${providerInfo.name}</strong><br>
              <small>${providerInfo.strengths.join(' • ')}</small>
            </div>
            <div>
              <strong>💻 ${instanceInfo.name}</strong><br>
              <small>${instanceInfo.description}</small><br>
              <small>📋 ${instanceInfo.memory}</small>
            </div>
            ${(spotInstances || reservedInstances || autoShutdown) ? `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #dee2e6;">
              <strong>💰 Активні знижки:</strong><br>
              ${spotInstances ? '<span style="background: #d4edda; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9em;">Spot інстанси (-70%)</span> ' : ''}
              ${reservedInstances ? '<span style="background: #cce7ff; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9em;">Резервовані (-40%)</span> ' : ''}
              ${autoShutdown ? '<span style="background: #fff3cd; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9em;">Автовимкнення (-20%)</span>' : ''}
            </div>
            ` : ''}
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="margin: 2rem 0;">
          <h4 style="color: #28a745; margin-bottom: 1rem;">💡 Рекомендації з економії</h4>
          <div style="background: #f8fff9; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #28a745;">
            ${recommendations.map(rec => `
              <div style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2em;">${rec.icon}</span>
                <span>${rec.text}</span>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div style="margin: 2rem 0;">
          <h4 style="color: #ffc107; margin-bottom: 1rem;">⚠️ Важливі зауваження</h4>
          <div style="background: #fffcf5; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #ffc107;">
            <ul style="margin: 0; padding-left: 1.5rem;">
              <li>Ціни можуть змінюватися та відрізнятися за регіонами</li>
              <li>Spot інстанси можуть бути перервані без попередження</li>
              <li>Додаткові витрати можуть включати backup, моніторинг, логування</li>
              <li>Враховуйте час на setup та debugging</li>
              <li>Перевірте actual pricing на сайті провайдера</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});