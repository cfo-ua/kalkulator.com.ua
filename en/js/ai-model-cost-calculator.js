document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ai-cost-form');
  const result = document.getElementById('cost-result');

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
        strengths: ["Largest instance selection", "Global infrastructure", "Mature ML services"]
      },
      gcp: {
        name: "Google Cloud Platform", 
        icon: "🔵",
        strengths: ["Best TPU pricing", "TensorFlow integration", "AutoML services"]
      },
      azure: {
        name: "Microsoft Azure",
        icon: "🔷", 
        strengths: ["Hybrid solutions", "Office 365 integration", "Enterprise security"]
      },
      paperspace: {
        name: "Paperspace",
        icon: "🚀",
        strengths: ["Ease of use", "ML-focused platform", "Competitive pricing"]
      }
    };
    return providers[provider];
  }

  function getInstanceInfo(instanceType) {
    const instances = {
      'gpu-basic': {
        name: "Basic GPU",
        description: "T4/RTX series - suitable for small to medium models",
        memory: "16-24 GB GPU memory"
      },
      'gpu-mid': {
        name: "Mid-range GPU", 
        description: "V100/RTX 3090 - for larger models and faster training",
        memory: "32-48 GB GPU memory"
      },
      'gpu-high': {
        name: "High-end GPU",
        description: "A100/H100 - for large transformers and research projects", 
        memory: "80+ GB GPU memory"
      },
      'gpu-cluster': {
        name: "Multi-GPU cluster",
        description: "Multiple GPUs for distributed training of large models",
        memory: "256+ GB total GPU memory"
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
        text: `Spot instances could save ${formatCurrency(savings)}`,
        type: "savings"
      });
    }
    
    if (!options.autoShutdown) {
      const savings = costs.computeCost * 0.2;
      recommendations.push({
        icon: "⏰", 
        text: `Auto-shutdown would save ${formatCurrency(savings)}`,
        type: "optimization"
      });
    }
    
    if (costs.storageCost > 50) {
      recommendations.push({
        icon: "💾",
        text: "Consider cold storage for archival data savings",
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
        result.innerHTML = '<p style="color: red;">Please enter valid values for all fields.</p>';
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
            <h6>💳 Total Cost</h6>
            <div class="big-number">${formatCurrency(costs.totalCost)}</div>
            <p>Complete training cost</p>
          </div>
          <div class="insight-card success">
            <h6>⚡ Compute</h6>
            <div class="result-value">${formatCurrency(costs.computeCost)}</div>
            <p>${formatCurrency(costs.hourlyRate)}/hour</p>
          </div>
          <div class="insight-card warning">
            <h6>💾 Storage + Network</h6>
            <div class="result-value">${formatCurrency(costs.storageCost + costs.networkCost)}</div>
            <p>Data and traffic</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #157aff; margin-bottom: 1rem;">📊 Cost Breakdown</h4>
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #157aff;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
              <span>💻 Compute resources:</span>
              <strong>${formatCurrency(costs.computeCost)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
              <span>💾 Data storage (${datasetSizeGB.toFixed(1)} GB):</span>
              <strong>${formatCurrency(costs.storageCost)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
              <span>🌐 Network traffic (${networkTraffic.toFixed(1)} GB):</span>
              <strong>${formatCurrency(costs.networkCost)}</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
              <span>🔧 Additional services:</span>
              <strong>${formatCurrency(additionalServices)}</strong>
            </div>
            <hr style="border: none; border-top: 2px solid #157aff; margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; font-size: 1.1em;">
              <span><strong>Total cost:</strong></span>
              <strong style="color: #157aff;">${formatCurrency(costs.totalCost)}</strong>
            </div>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #6c757d; margin-bottom: 1rem;">ℹ️ Configuration Information</h4>
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
              <strong>💰 Active discounts:</strong><br>
              ${spotInstances ? '<span style="background: #d4edda; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9em;">Spot instances (-70%)</span> ' : ''}
              ${reservedInstances ? '<span style="background: #cce7ff; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9em;">Reserved (-40%)</span> ' : ''}
              ${autoShutdown ? '<span style="background: #fff3cd; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9em;">Auto-shutdown (-20%)</span>' : ''}
            </div>
            ` : ''}
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="margin: 2rem 0;">
          <h4 style="color: #28a745; margin-bottom: 1rem;">💡 Cost Optimization Recommendations</h4>
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
          <h4 style="color: #ffc107; margin-bottom: 1rem;">⚠️ Important Notes</h4>
          <div style="background: #fffcf5; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #ffc107;">
            <ul style="margin: 0; padding-left: 1.5rem;">
              <li>Prices may vary by region and change over time</li>
              <li>Spot instances can be interrupted without warning</li>
              <li>Additional costs may include backup, monitoring, logging</li>
              <li>Factor in setup and debugging time</li>
              <li>Check actual pricing on provider websites</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});