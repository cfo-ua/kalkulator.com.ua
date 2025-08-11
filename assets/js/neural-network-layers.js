document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("neural-network-form");
  const result = document.getElementById("neural-network-result");

  // Set default values
  const defaultValues = {
    networkType: 'feedforward',
    taskType: 'classification',
    inputSize: 784,
    outputSize: 10,
    datasetSize: 'medium',
    taskComplexity: 'moderate',
    memoryLimit: 8,
    optimizationPriority: 'accuracy',
    batchSize: 32
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
  form.addEventListener("submit", calculateArchitecture);
  form.addEventListener("input", calculateArchitecture);
  form.addEventListener("change", calculateArchitecture);

  // Calculate initial values
  calculateArchitecture({ preventDefault: () => {} });

  function calculateArchitecture(e) {
    e.preventDefault();

    const networkType = document.getElementById("networkType").value;
    const taskType = document.getElementById("taskType").value;
    const inputSize = parseInt(document.getElementById("inputSize").value) || 784;
    const outputSize = parseInt(document.getElementById("outputSize").value) || 10;
    const datasetSize = document.getElementById("datasetSize").value;
    const taskComplexity = document.getElementById("taskComplexity").value;
    const memoryLimit = parseInt(document.getElementById("memoryLimit").value) || 8;
    const optimizationPriority = document.getElementById("optimizationPriority").value;
    const batchSize = parseInt(document.getElementById("batchSize").value) || 32;

    // Calculate optimal architecture based on inputs
    const architecture = calculateOptimalArchitecture(
      networkType, taskType, inputSize, outputSize, 
      datasetSize, taskComplexity, optimizationPriority
    );

    // Calculate memory and computational requirements
    const memoryReqs = calculateMemoryRequirements(architecture, batchSize);
    const computationalReqs = calculateComputationalRequirements(architecture, batchSize);
    const trainingTime = estimateTrainingTime(architecture, datasetSize, memoryReqs.totalParams);

    // Generate recommendations
    const recommendations = generateRecommendations(
      architecture, memoryReqs, memoryLimit, networkType, taskComplexity
    );

    // Get status based on memory fit
    const memoryStatus = getMemoryStatus(memoryReqs.memoryGB, memoryLimit);

    // Display results
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🏗️ Шарі мережі</h6>
          <div class="big-number">${architecture.hiddenLayers.length}</div>
          <div class="result-value">прихованих шарів</div>
        </div>

        <div class="insight-card">
          <h6>🧠 Всього нейронів</h6>
          <div class="big-number">${formatNumber(architecture.totalNeurons)}</div>
          <div class="result-value">нейронів</div>
        </div>

        <div class="insight-card ${memoryStatus.status}">
          <h6>⚙️ Параметри</h6>
          <div class="big-number">${formatNumber(memoryReqs.totalParams)}</div>
          <div class="result-value">параметрів</div>
        </div>

        <div class="insight-card ${memoryStatus.status}">
          <h6>💾 Пам'ять GPU</h6>
          <div class="big-number">${memoryReqs.memoryGB.toFixed(1)}</div>
          <div class="result-value">GB (з ${memoryLimit} GB)</div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>🏗️ Рекомендована архітектура</h4>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>📊 Структура мережі</h5>
          <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0; overflow-x: auto; padding: 1rem 0;">
            <div style="min-width: 80px; text-align: center; background: white; padding: 1rem; border-radius: 8px; border: 2px solid var(--accent);">
              <div style="font-weight: bold; color: var(--accent);">Вхід</div>
              <div style="font-size: 0.9rem; margin-top: 0.5rem;">${inputSize}</div>
            </div>
            ${architecture.hiddenLayers.map((size, index) => `
              <div style="font-size: 1.5rem; color: #ccc;">→</div>
              <div style="min-width: 80px; text-align: center; background: white; padding: 1rem; border-radius: 8px; border: 2px solid #28a745;">
                <div style="font-weight: bold; color: #28a745;">Шар ${index + 1}</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">${size}</div>
              </div>
            `).join('')}
            <div style="font-size: 1.5rem; color: #ccc;">→</div>
            <div style="min-width: 80px; text-align: center; background: white; padding: 1rem; border-radius: 8px; border: 2px solid #ffc107;">
              <div style="font-weight: bold; color: #ffc107;">Вихід</div>
              <div style="font-size: 0.9rem; margin-top: 0.5rem;">${outputSize}</div>
            </div>
          </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>⚡ Обчислювальні характеристики</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div><strong>FLOPS на forward pass:</strong> ${formatNumber(computationalReqs.forwardFLOPs)}</div>
            <div><strong>FLOPS на backward pass:</strong> ${formatNumber(computationalReqs.backwardFLOPs)}</div>
            <div><strong>Розмір моделі:</strong> ${memoryReqs.modelSizeMB.toFixed(1)} MB</div>
            <div><strong>Пам'ять на активації:</strong> ${memoryReqs.activationMemoryMB.toFixed(1)} MB</div>
          </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>⏱️ Оцінка часу навчання</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div><strong>За епоху:</strong> ${trainingTime.perEpoch}</div>
            <div><strong>До конвергенції:</strong> ${trainingTime.toConvergence}</div>
            <div><strong>Рекомендовані епохи:</strong> ${trainingTime.recommendedEpochs}</div>
          </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>💡 Рекомендації по оптимізації</h5>
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            ${recommendations}
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>🎛️ Рекомендовані гіперпараметри</h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div><strong>Learning Rate:</strong> ${architecture.hyperparams.learningRate}</div>
            <div><strong>Optimizer:</strong> ${architecture.hyperparams.optimizer}</div>
            <div><strong>Dropout:</strong> ${architecture.hyperparams.dropout}</div>
            <div><strong>Batch Normalization:</strong> ${architecture.hyperparams.batchNorm ? 'Так' : 'Ні'}</div>
            <div><strong>Activation:</strong> ${architecture.hyperparams.activation}</div>
            <div><strong>Regularization:</strong> ${architecture.hyperparams.regularization}</div>
          </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h5>🎯 Статус проекту: <span style="color: ${getStatusColor(memoryStatus.status)};">${memoryStatus.text}</span></h5>
          <p style="margin-top: 1rem;">${memoryStatus.description}</p>
        </div>
      </div>
    `;
  }

  function calculateOptimalArchitecture(networkType, taskType, inputSize, outputSize, datasetSize, taskComplexity, optimizationPriority) {
    // Base architecture parameters
    let hiddenLayers = [];
    let hyperparams = {
      learningRate: '0.001',
      optimizer: 'Adam',
      dropout: '0.2',
      batchNorm: true,
      activation: 'ReLU',
      regularization: 'L2'
    };

    // Dataset size multipliers
    const datasetMultipliers = {
      'small': 0.5,
      'medium': 1.0,
      'large': 1.5,
      'very_large': 2.0
    };

    // Complexity multipliers
    const complexityMultipliers = {
      'simple': 0.5,
      'moderate': 1.0,
      'complex': 1.5,
      'very_complex': 2.0
    };

    const datasetMult = datasetMultipliers[datasetSize];
    const complexityMult = complexityMultipliers[taskComplexity];

    // Calculate optimal width based on input/output sizes
    const optimalWidth = Math.max(
      Math.ceil((inputSize + outputSize) / 2),
      Math.min(512, Math.ceil(inputSize * 0.66))
    );

    // Adjust for optimization priority
    let priorityMult = 1.0;
    if (optimizationPriority === 'speed' || optimizationPriority === 'memory') {
      priorityMult = 0.7;
    } else if (optimizationPriority === 'accuracy') {
      priorityMult = 1.3;
    }

    const adjustedWidth = Math.ceil(optimalWidth * datasetMult * complexityMult * priorityMult);

    // Network type specific architectures
    switch (networkType) {
      case 'feedforward':
        if (taskComplexity === 'simple') {
          hiddenLayers = [Math.min(adjustedWidth, 128)];
        } else if (taskComplexity === 'moderate') {
          hiddenLayers = [adjustedWidth, Math.ceil(adjustedWidth * 0.7)];
        } else {
          hiddenLayers = [adjustedWidth, Math.ceil(adjustedWidth * 0.8), Math.ceil(adjustedWidth * 0.6)];
        }
        break;

      case 'cnn':
        // CNN layers (simplified representation)
        hiddenLayers = [64, 128, 256, 512, adjustedWidth];
        hyperparams.activation = 'ReLU';
        hyperparams.batchNorm = true;
        break;

      case 'rnn':
        hiddenLayers = [adjustedWidth, Math.ceil(adjustedWidth * 0.8)];
        hyperparams.dropout = '0.3';
        hyperparams.learningRate = '0.0005';
        break;

      case 'transformer':
        // Simplified transformer representation
        hiddenLayers = [512, 2048, 512];
        hyperparams.learningRate = '0.0001';
        hyperparams.optimizer = 'AdamW';
        break;

      case 'autoencoder':
        // Encoder-decoder architecture
        const bottleneck = Math.ceil(adjustedWidth * 0.1);
        hiddenLayers = [adjustedWidth, Math.ceil(adjustedWidth * 0.5), bottleneck, Math.ceil(adjustedWidth * 0.5), adjustedWidth];
        break;

      case 'gan':
        // Generator architecture
        hiddenLayers = [adjustedWidth, adjustedWidth * 2, adjustedWidth];
        hyperparams.learningRate = '0.0002';
        hyperparams.optimizer = 'Adam';
        break;
    }

    // Ensure output layer is correctly sized
    if (hiddenLayers.length === 0) {
      hiddenLayers = [adjustedWidth];
    }

    const totalNeurons = hiddenLayers.reduce((sum, size) => sum + size, 0) + inputSize + outputSize;

    return {
      hiddenLayers,
      totalNeurons,
      hyperparams
    };
  }

  function calculateMemoryRequirements(architecture, batchSize) {
    const { hiddenLayers } = architecture;
    const inputSize = parseInt(document.getElementById("inputSize").value) || 784;
    const outputSize = parseInt(document.getElementById("outputSize").value) || 10;

    // Calculate total parameters
    let totalParams = 0;
    let prevSize = inputSize;

    hiddenLayers.forEach(size => {
      totalParams += (prevSize + 1) * size; // weights + biases
      prevSize = size;
    });
    totalParams += (prevSize + 1) * outputSize; // output layer

    // Memory calculations (in bytes)
    const bytesPerParam = 4; // float32
    const modelSizeBytes = totalParams * bytesPerParam;

    // Activation memory (forward + backward)
    let activationMemory = 0;
    prevSize = inputSize;
    hiddenLayers.forEach(size => {
      activationMemory += size * batchSize * bytesPerParam * 2; // forward + backward
      prevSize = size;
    });
    activationMemory += outputSize * batchSize * bytesPerParam * 2;

    // Optimizer memory (Adam: momentum + velocity)
    const optimizerMemory = totalParams * bytesPerParam * 2;

    // Total GPU memory
    const totalMemoryBytes = modelSizeBytes + activationMemory + optimizerMemory;
    const totalMemoryGB = totalMemoryBytes / (1024 ** 3);

    return {
      totalParams,
      modelSizeMB: modelSizeBytes / (1024 ** 2),
      activationMemoryMB: activationMemory / (1024 ** 2),
      memoryGB: totalMemoryGB
    };
  }

  function calculateComputationalRequirements(architecture, batchSize) {
    const { hiddenLayers } = architecture;
    const inputSize = parseInt(document.getElementById("inputSize").value) || 784;
    const outputSize = parseInt(document.getElementById("outputSize").value) || 10;

    let forwardFLOPs = 0;
    let prevSize = inputSize;

    hiddenLayers.forEach(size => {
      forwardFLOPs += prevSize * size * batchSize; // matrix multiplication
      forwardFLOPs += size * batchSize; // activation
      prevSize = size;
    });
    forwardFLOPs += prevSize * outputSize * batchSize; // output layer

    // Backward pass is approximately 2x forward pass
    const backwardFLOPs = forwardFLOPs * 2;

    return {
      forwardFLOPs,
      backwardFLOPs
    };
  }

  function estimateTrainingTime(architecture, datasetSize, totalParams) {
    const datasetSizes = {
      'small': 5000,
      'medium': 50000,
      'large': 500000,
      'very_large': 5000000
    };

    const samples = datasetSizes[datasetSize];
    const batchSize = parseInt(document.getElementById("batchSize").value) || 32;
    const batchesPerEpoch = Math.ceil(samples / batchSize);

    // Rough estimation: milliseconds per batch based on model size
    const msPerBatch = Math.max(50, totalParams / 10000);
    const secondsPerEpoch = (batchesPerEpoch * msPerBatch) / 1000;

    // Recommended epochs based on dataset size and complexity
    const recommendedEpochs = datasetSize === 'small' ? 50 : 
                            datasetSize === 'medium' ? 30 : 
                            datasetSize === 'large' ? 20 : 10;

    const totalTrainingSeconds = secondsPerEpoch * recommendedEpochs;

    return {
      perEpoch: formatTime(secondsPerEpoch),
      toConvergence: formatTime(totalTrainingSeconds),
      recommendedEpochs: recommendedEpochs
    };
  }

  function generateRecommendations(architecture, memoryReqs, memoryLimit, networkType, taskComplexity) {
    let recommendations = [];

    if (memoryReqs.memoryGB > memoryLimit) {
      recommendations.push('<li>⚠️ <strong>Перевищення пам\'яті!</strong> Зменшіть batch size, кількість нейронів або використайте gradient checkpointing</li>');
    }

    if (architecture.hiddenLayers.length > 5 && taskComplexity === 'simple') {
      recommendations.push('<li>🎯 Мережа може бути занадто глибокою для простого завдання - розгляньте зменшення кількості шарів</li>');
    }

    if (architecture.totalNeurons < 1000 && taskComplexity === 'very_complex') {
      recommendations.push('<li>🧠 Для складного завдання мережа може бути занадто простою - збільште кількість нейронів</li>');
    }

    if (networkType === 'feedforward' && architecture.hiddenLayers.some(layer => layer > 1000)) {
      recommendations.push('<li>🔧 Великі шари можуть призвести до overfitting - додайте Dropout або регуляризацію</li>');
    }

    recommendations.push('<li>📊 Почніть з baseline моделі та поступово збільшуйте складність</li>');
    recommendations.push('<li>📈 Використовуйте Early Stopping для запобігання overfitting</li>');
    recommendations.push('<li>🔄 Експериментуйте з learning rate scheduling</li>');
    recommendations.push('<li>🎯 Моніторте метрики на валідаційному наборі</li>');

    return recommendations.join('\n            ');
  }

  function getMemoryStatus(requiredGB, limitGB) {
    if (requiredGB > limitGB) {
      return {
        status: 'warning',
        text: 'Перевищення пам\'яті',
        description: 'Модель потребує більше пам\'яті, ніж доступно. Зменшіть batch size або розмір моделі.'
      };
    } else if (requiredGB > limitGB * 0.8) {
      return {
        status: 'info',
        text: 'Високе використання',
        description: 'Модель використовує більшість доступної пам\'яті. Залиште резерв для системних процесів.'
      };
    } else {
      return {
        status: 'success',
        text: 'Оптимальне використання',
        description: 'Пам\'ять використовується ефективно з достатнім резервом для стабільного навчання.'
      };
    }
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
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  function formatTime(seconds) {
    if (seconds < 60) {
      return `${Math.ceil(seconds)} сек`;
    } else if (seconds < 3600) {
      return `${Math.ceil(seconds / 60)} хв`;
    } else if (seconds < 86400) {
      return `${(seconds / 3600).toFixed(1)} год`;
    } else {
      return `${(seconds / 86400).toFixed(1)} днів`;
    }
  }
});