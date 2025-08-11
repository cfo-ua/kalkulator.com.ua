document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ai-training-form');
  const result = document.getElementById('training-result');

  function formatUA(val) {
    return val.toLocaleString('uk-UA', {minimumFractionDigits: 1, maximumFractionDigits: 1});
  }

  function formatTime(hours) {
    if (hours < 1) {
      return Math.round(hours * 60) + " хвилин";
    } else if (hours < 24) {
      return formatUA(hours) + " годин";
    } else if (hours < 24 * 7) {
      return formatUA(hours / 24) + " днів";
    } else if (hours < 24 * 30) {
      return formatUA(hours / (24 * 7)) + " тижнів";
    } else {
      return formatUA(hours / (24 * 30)) + " місяців";
    }
  }

  // Model complexity multipliers (operations per sample)
  const modelComplexity = {
    linear: 1,
    cnn: 10,
    rnn: 25,
    transformer: 100,
    gan: 150,
    diffusion: 200
  };

  // Hardware performance multipliers (samples per second baseline)
  const hardwarePerformance = {
    cpu: 10,
    'gpu-single': 200,
    'gpu-multi': 800,
    'gpu-cluster': 5000
  };

  function calculateTrainingTime({
    datasetSize,
    epochs,
    batchSize,
    modelParams,
    modelType,
    hardware
  }) {
    // Base calculation: samples per second based on hardware
    const baseSamplesPerSecond = hardwarePerformance[hardware];
    
    // Adjust for model complexity
    const complexityMultiplier = modelComplexity[modelType];
    const samplesPerSecond = baseSamplesPerSecond / complexityMultiplier;
    
    // Adjust for model size (larger models are slower)
    const sizeMultiplier = Math.pow(modelParams / 10, 0.3); // Sublinear scaling
    const effectiveSamplesPerSecond = samplesPerSecond / sizeMultiplier;
    
    // Total samples to process
    const totalSamples = datasetSize * epochs;
    
    // Calculate time
    const totalSeconds = totalSamples / effectiveSamplesPerSecond;
    const totalHours = totalSeconds / 3600;
    
    // Calculate iterations
    const totalIterations = Math.ceil(datasetSize / batchSize) * epochs;
    
    return {
      totalHours,
      totalIterations,
      samplesPerSecond: effectiveSamplesPerSecond,
      timePerEpoch: totalHours / epochs
    };
  }

  function getRecommendations(modelType, hardware, totalHours) {
    const recommendations = [];
    
    if (hardware === 'cpu' && totalHours > 24) {
      recommendations.push("🎮 Розгляньте використання GPU для пришвидшення навчання");
    }
    
    if (modelType === 'transformer' && hardware === 'gpu-single') {
      recommendations.push("💪 Великі трансформери краще навчати на кількох GPU");
    }
    
    if (totalHours > 24 * 7) {
      recommendations.push("📊 Спробуйте transfer learning для скорочення часу");
      recommendations.push("🔄 Використайте mixed precision training");
    }
    
    if (totalHours < 1) {
      recommendations.push("✅ Швидке навчання! Можна експериментувати з гіперпараметрами");
    }

    return recommendations;
  }

  function getModelTypeDescription(modelType) {
    const descriptions = {
      linear: "Лінійні моделі",
      cnn: "Згорткові нейронні мережі",
      rnn: "Рекурентні нейронні мережі",
      transformer: "Архітектура Transformer",
      gan: "Генеративні змагальні мережі",
      diffusion: "Дифузійні моделі"
    };
    return descriptions[modelType] || modelType;
  }

  function getHardwareDescription(hardware) {
    const descriptions = {
      cpu: "CPU (багатоядерний)",
      'gpu-single': "1x GPU (GTX/RTX)",
      'gpu-multi': "Кілька GPU",
      'gpu-cluster': "GPU кластер"
    };
    return descriptions[hardware] || hardware;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const datasetSize = Number(document.getElementById('dataset-size').value);
      const epochs = Number(document.getElementById('epochs').value);
      const batchSize = Number(document.getElementById('batch-size').value);
      const modelParams = Number(document.getElementById('model-params').value);
      const modelType = form.querySelector('input[name="model-type"]:checked').value;
      const hardware = form.querySelector('input[name="hardware"]:checked').value;

      if (datasetSize < 100 || epochs < 1 || batchSize < 1 || modelParams < 0.1) {
        result.innerHTML = '<p style="color: red;">Будь ласка, введіть коректні значення для всіх полів.</p>';
        return;
      }

      const calculations = calculateTrainingTime({
        datasetSize,
        epochs,
        batchSize,
        modelParams,
        modelType,
        hardware
      });

      const recommendations = getRecommendations(modelType, hardware, calculations.totalHours);

      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>⏱️ Загальний час навчання</h6>
            <div class="big-number">${formatTime(calculations.totalHours)}</div>
            <p>Орієнтовний час для завершення</p>
          </div>
          <div class="insight-card success">
            <h6>🔄 Час на епоху</h6>
            <div class="result-value">${formatTime(calculations.timePerEpoch)}</div>
            <p>Середній час на одну епоху</p>
          </div>
          <div class="insight-card warning">
            <h6>📊 Ітерацій</h6>
            <div class="result-value">${formatUA(calculations.totalIterations)}</div>
            <p>Загальна кількість ітерацій</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #157aff; margin-bottom: 1rem;">📋 Деталі розрахунку</h4>
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #157aff;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>Модель:</strong> ${getModelTypeDescription(modelType)}<br>
                <strong>Параметри:</strong> ${formatUA(modelParams)} млн
              </div>
              <div>
                <strong>Обладнання:</strong> ${getHardwareDescription(hardware)}<br>
                <strong>Продуктивність:</strong> ${formatUA(calculations.samplesPerSecond)} зразків/сек
              </div>
              <div>
                <strong>Датасет:</strong> ${formatUA(datasetSize)} зразків<br>
                <strong>Batch size:</strong> ${formatUA(batchSize)}
              </div>
              <div>
                <strong>Епохи:</strong> ${epochs}<br>
                <strong>Всього зразків:</strong> ${formatUA(datasetSize * epochs)}
              </div>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="margin: 2rem 0;">
          <h4 style="color: #28a745; margin-bottom: 1rem;">💡 Рекомендації з оптимізації</h4>
          <div style="background: #f8fff9; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #28a745;">
            ${recommendations.map(rec => `<div style="margin-bottom: 0.5rem;">${rec}</div>`).join('')}
          </div>
        </div>
        ` : ''}

        <div style="margin: 2rem 0;">
          <h4 style="color: #ffc107; margin-bottom: 1rem;">⚠️ Зауваження</h4>
          <div style="background: #fffcf5; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #ffc107;">
            <p style="margin: 0;">Це орієнтовні розрахунки. Реальний час може відрізнятися залежно від:</p>
            <ul style="margin: 0.5rem 0 0 1.5rem;">
              <li>Складності даних та завдання</li>
              <li>Ефективності коду та фреймворку</li>
              <li>Настройок оптимізації</li>
              <li>Доступної пам'яті GPU/RAM</li>
              <li>Мережевого вводу-виводу для великих датасетів</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});