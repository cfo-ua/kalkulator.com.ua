document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ai-dataset-form");
  const result = document.getElementById("ai-dataset-result");

  // Set default values
  const defaultValues = {
    taskType: 'image_classification',
    targetAccuracy: 85,
    numClasses: 10,
    modelArchitecture: 'deep_nn',
    dataComplexity: 'medium',
    transferLearning: 'features',
    dataAugmentation: 'basic',
    dataQuality: 'good'
  };

  // Initialize form with defaults
  Object.keys(defaultValues).forEach(key => {
    const element = document.getElementById(key);
    if (element && element.tagName === 'INPUT') {
      element.value = defaultValues[key];
    } else if (element && element.tagName === 'SELECT') {
      element.value = defaultValues[key];
    }
  });

  // Calculate on form submission and input changes
  form.addEventListener("submit", calculateDatasetSize);
  form.addEventListener("input", calculateDatasetSize);
  form.addEventListener("change", calculateDatasetSize);

  // Calculate initial values
  calculateDatasetSize({ preventDefault: () => {} });

  function calculateDatasetSize(e) {
    e.preventDefault();

    const taskType = document.getElementById("taskType").value;
    const targetAccuracy = parseFloat(document.getElementById("targetAccuracy").value) || 85;
    const numClasses = parseInt(document.getElementById("numClasses").value) || 10;
    const modelArchitecture = document.getElementById("modelArchitecture").value;
    const dataComplexity = document.getElementById("dataComplexity").value;
    const transferLearning = document.getElementById("transferLearning").value;
    const dataAugmentation = document.getElementById("dataAugmentation").value;
    const dataQuality = document.getElementById("dataQuality").value;

    // Base dataset size calculation
    let baseSamplesPerClass = getBaseSamplesPerClass(taskType, modelArchitecture);
    
    // Apply accuracy multiplier (exponential growth for high accuracy)
    const accuracyMultiplier = Math.pow(2, (targetAccuracy - 80) / 10);
    
    // Apply complexity multiplier
    const complexityMultipliers = {
      'low': 0.5,
      'medium': 1.0,
      'high': 2.0,
      'very_high': 4.0
    };

    // Apply transfer learning reduction
    const transferMultipliers = {
      'none': 1.0,
      'features': 0.3,
      'fine_tuning': 0.2,
      'foundation': 0.1
    };

    // Apply data augmentation reduction
    const augmentationMultipliers = {
      'none': 1.0,
      'basic': 0.6,
      'advanced': 0.4,
      'generative': 0.3
    };

    // Apply data quality multiplier
    const qualityMultipliers = {
      'poor': 2.0,
      'average': 1.3,
      'good': 1.0,
      'excellent': 0.8
    };

    // Calculate samples per class
    let samplesPerClass = baseSamplesPerClass * accuracyMultiplier * 
                         complexityMultipliers[dataComplexity] *
                         transferMultipliers[transferLearning] *
                         augmentationMultipliers[dataAugmentation] *
                         qualityMultipliers[dataQuality];

    // For regression, treat as single "class"
    const actualClasses = taskType === 'regression' ? 1 : numClasses;
    
    // Calculate total dataset size
    const totalSamples = Math.ceil(samplesPerClass * actualClasses);
    
    // Calculate splits
    const trainSamples = Math.ceil(totalSamples * 0.7);
    const valSamples = Math.ceil(totalSamples * 0.15);
    const testSamples = Math.ceil(totalSamples * 0.15);

    // Calculate additional metrics
    const estimatedCost = calculateAnnotationCost(totalSamples, taskType);
    const estimatedTime = calculateCollectionTime(totalSamples, taskType);
    const storageNeeds = calculateStorageNeeds(totalSamples, taskType);

    // Generate recommendations
    const efficiencyStatus = getEfficiencyStatus(totalSamples, taskType);
    const recommendations = generateRecommendations(totalSamples, taskType, transferLearning, dataAugmentation);

    // Display results
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${efficiencyStatus.status}">
          <h6>📊 Total Size</h6>
          <div class="big-number">${formatNumber(totalSamples)}</div>
          <div class="result-value">samples</div>
        </div>

        <div class="insight-card info">
          <h6>🎯 Per Class</h6>
          <div class="big-number">${formatNumber(Math.ceil(samplesPerClass))}</div>
          <div class="result-value">samples/class</div>
        </div>

        <div class="insight-card">
          <h6>💰 Est. Cost</h6>
          <div class="big-number">$${formatNumber(estimatedCost)}</div>
          <div class="result-value">annotation</div>
        </div>

        <div class="insight-card">
          <h6>⏱️ Collection Time</h6>
          <div class="big-number">${estimatedTime.value}</div>
          <div class="result-value">${estimatedTime.unit}</div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📊 Dataset Split Distribution</h4>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
              <div style="font-size: 1.5rem; font-weight: bold; color: var(--accent);">${formatNumber(trainSamples)}</div>
              <div style="color: var(--main-color); margin-top: 0.5rem;">🏋️ Training (70%)</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
              <div style="font-size: 1.5rem; font-weight: bold; color: #28a745;">${formatNumber(valSamples)}</div>
              <div style="color: var(--main-color); margin-top: 0.5rem;">✅ Validation (15%)</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
              <div style="font-size: 1.5rem; font-weight: bold; color: #ffc107;">${formatNumber(testSamples)}</div>
              <div style="color: var(--main-color); margin-top: 0.5rem;">🧪 Testing (15%)</div>
            </div>
          </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>💡 Optimization Recommendations</h5>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            ${recommendations}
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>📈 Additional Information</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div><strong>Storage Requirements:</strong> ${storageNeeds}</div>
            <div><strong>Minimum Dataset:</strong> ${formatNumber(Math.ceil(totalSamples * 0.3))}</div>
            <div><strong>Optimal Size:</strong> ${formatNumber(totalSamples)}</div>
            <div><strong>Diminishing Returns:</strong> ${formatNumber(Math.ceil(totalSamples * 2))}</div>
          </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>🎯 Project Status: <span style="color: ${getStatusColor(efficiencyStatus.status)};">${efficiencyStatus.text}</span></h5>
          <p style="margin-top: 1rem;">${efficiencyStatus.description}</p>
        </div>
      </div>
    `;
  }

  function getBaseSamplesPerClass(taskType, architecture) {
    const baseSizes = {
      'image_classification': {
        'simple': 50,
        'traditional_ml': 100,
        'shallow_nn': 200,
        'deep_nn': 500,
        'cnn': 1000,
        'transformer': 2000,
        'large_model': 5000
      },
      'nlp_classification': {
        'simple': 100,
        'traditional_ml': 200,
        'shallow_nn': 500,
        'deep_nn': 1000,
        'rnn_lstm': 2000,
        'transformer': 5000,
        'large_model': 10000
      },
      'object_detection': {
        'simple': 100,
        'cnn': 500,
        'deep_nn': 1000,
        'transformer': 2000,
        'large_model': 5000
      },
      'regression': {
        'simple': 100,
        'traditional_ml': 500,
        'shallow_nn': 1000,
        'deep_nn': 2000,
        'large_model': 5000
      },
      'segmentation': {
        'cnn': 200,
        'deep_nn': 500,
        'transformer': 1000,
        'large_model': 2000
      }
    };

    return baseSizes[taskType]?.[architecture] || 1000;
  }

  function calculateAnnotationCost(samples, taskType) {
    const costPerSample = {
      'image_classification': 0.1,
      'nlp_classification': 0.05,
      'object_detection': 2.0,
      'regression': 0.5,
      'segmentation': 5.0,
      'recommendation': 0.02,
      'time_series': 0.3,
      'generative': 1.0
    };
    
    return Math.ceil(samples * (costPerSample[taskType] || 0.5));
  }

  function calculateCollectionTime(samples, taskType) {
    const hoursFor1000 = {
      'image_classification': 40,
      'nlp_classification': 20,
      'object_detection': 100,
      'regression': 60,
      'segmentation': 200,
      'recommendation': 10,
      'time_series': 80,
      'generative': 150
    };
    
    const totalHours = (samples / 1000) * (hoursFor1000[taskType] || 50);
    
    if (totalHours < 24) {
      return { value: Math.ceil(totalHours), unit: 'hours' };
    } else if (totalHours < 168) {
      return { value: Math.ceil(totalHours / 24), unit: 'days' };
    } else if (totalHours < 720) {
      return { value: Math.ceil(totalHours / 168), unit: 'weeks' };
    } else {
      return { value: Math.ceil(totalHours / 720), unit: 'months' };
    }
  }

  function calculateStorageNeeds(samples, taskType) {
    const mbPerSample = {
      'image_classification': 0.5,
      'nlp_classification': 0.001,
      'object_detection': 2.0,
      'regression': 0.01,
      'segmentation': 10,
      'recommendation': 0.001,
      'time_series': 0.1,
      'generative': 5.0
    };
    
    const totalMB = samples * (mbPerSample[taskType] || 1);
    
    if (totalMB < 1024) {
      return `${Math.ceil(totalMB)} MB`;
    } else if (totalMB < 1024 * 1024) {
      return `${(totalMB / 1024).toFixed(1)} GB`;
    } else {
      return `${(totalMB / (1024 * 1024)).toFixed(1)} TB`;
    }
  }

  function getEfficiencyStatus(totalSamples, taskType) {
    const thresholds = {
      'image_classification': { low: 5000, high: 50000 },
      'nlp_classification': { low: 10000, high: 100000 },
      'object_detection': { low: 2000, high: 20000 },
      'regression': { low: 1000, high: 10000 },
      'segmentation': { low: 500, high: 5000 }
    };
    
    const threshold = thresholds[taskType] || { low: 5000, high: 50000 };
    
    if (totalSamples < threshold.low) {
      return {
        status: 'warning',
        text: 'Small Dataset',
        description: 'Dataset may be too small to achieve target accuracy. Consider using transfer learning or data augmentation strategies.'
      };
    } else if (totalSamples > threshold.high) {
      return {
        status: 'info',
        text: 'Large Dataset',
        description: 'Large dataset will provide high accuracy but requires significant resources. Ensure you have adequate time and budget.'
      };
    } else {
      return {
        status: 'success',
        text: 'Optimal Size',
        description: 'Dataset size is optimally balanced to achieve target accuracy with reasonable resource investment.'
      };
    }
  }

  function generateRecommendations(totalSamples, taskType, transferLearning, dataAugmentation) {
    let recommendations = [];
    
    if (totalSamples > 100000) {
      recommendations.push('<li>📚 Large dataset - consider phased collection and incremental training</li>');
    }
    
    if (transferLearning === 'none') {
      recommendations.push('<li>🚀 Use transfer learning to significantly reduce required dataset size</li>');
    }
    
    if (dataAugmentation === 'none') {
      recommendations.push('<li>🔄 Data augmentation can reduce real data needs by 2-3x</li>');
    }
    
    if (taskType === 'image_classification') {
      recommendations.push('<li>🖼️ For images, recommend ImageNet pre-trained models</li>');
    }
    
    if (taskType === 'nlp_classification') {
      recommendations.push('<li>📝 Use BERT or similar pre-trained language models</li>');
    }
    
    recommendations.push('<li>🎯 Start with smaller dataset and gradually increase size</li>');
    recommendations.push('<li>📊 Monitor validation metrics regularly during training</li>');
    recommendations.push('<li>🔍 Focus on annotation quality - this is critically important</li>');
    
    return recommendations.join('\n            ');
  }

  function getStatusColor(status) {
    const colors = {
      'success': '#28a745',
      'warning': '#ffc107',
      'info': '#17a2b8'
    };
    return colors[status] || '#6c757d';
  }

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
});