document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ai-training-form');
  const result = document.getElementById('training-result');

  function formatTime(hours) {
    if (hours < 1) {
      return Math.round(hours * 60) + " minutes";
    } else if (hours < 24) {
      return hours.toFixed(1) + " hours";
    } else if (hours < 24 * 7) {
      return (hours / 24).toFixed(1) + " days";
    } else if (hours < 24 * 30) {
      return (hours / (24 * 7)).toFixed(1) + " weeks";
    } else {
      return (hours / (24 * 30)).toFixed(1) + " months";
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
      recommendations.push("🎮 Consider using GPU for training acceleration");
    }
    
    if (modelType === 'transformer' && hardware === 'gpu-single') {
      recommendations.push("💪 Large transformers train better on multiple GPUs");
    }
    
    if (totalHours > 24 * 7) {
      recommendations.push("📊 Try transfer learning to reduce training time");
      recommendations.push("🔄 Use mixed precision training for speedup");
    }
    
    if (totalHours < 1) {
      recommendations.push("✅ Fast training! You can experiment with hyperparameters");
    }

    return recommendations;
  }

  function getModelTypeDescription(modelType) {
    const descriptions = {
      linear: "Linear models",
      cnn: "Convolutional Neural Networks",
      rnn: "Recurrent Neural Networks",
      transformer: "Transformer architecture",
      gan: "Generative Adversarial Networks",
      diffusion: "Diffusion models"
    };
    return descriptions[modelType] || modelType;
  }

  function getHardwareDescription(hardware) {
    const descriptions = {
      cpu: "CPU (multi-core)",
      'gpu-single': "1x GPU (GTX/RTX)",
      'gpu-multi': "Multiple GPUs",
      'gpu-cluster': "GPU cluster"
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
        result.innerHTML = '<p style="color: red;">Please enter valid values for all fields.</p>';
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
            <h6>⏱️ Total Training Time</h6>
            <div class="big-number">${formatTime(calculations.totalHours)}</div>
            <p>Estimated time to completion</p>
          </div>
          <div class="insight-card success">
            <h6>🔄 Time per Epoch</h6>
            <div class="result-value">${formatTime(calculations.timePerEpoch)}</div>
            <p>Average time per epoch</p>
          </div>
          <div class="insight-card warning">
            <h6>📊 Iterations</h6>
            <div class="result-value">${calculations.totalIterations.toLocaleString()}</div>
            <p>Total training iterations</p>
          </div>
        </div>

        <div style="margin: 2rem 0;">
          <h4 style="color: #157aff; margin-bottom: 1rem;">📋 Calculation Details</h4>
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #157aff;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <strong>Model:</strong> ${getModelTypeDescription(modelType)}<br>
                <strong>Parameters:</strong> ${modelParams.toFixed(1)}M
              </div>
              <div>
                <strong>Hardware:</strong> ${getHardwareDescription(hardware)}<br>
                <strong>Performance:</strong> ${calculations.samplesPerSecond.toFixed(1)} samples/sec
              </div>
              <div>
                <strong>Dataset:</strong> ${datasetSize.toLocaleString()} samples<br>
                <strong>Batch size:</strong> ${batchSize.toLocaleString()}
              </div>
              <div>
                <strong>Epochs:</strong> ${epochs}<br>
                <strong>Total samples:</strong> ${(datasetSize * epochs).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div style="margin: 2rem 0;">
          <h4 style="color: #28a745; margin-bottom: 1rem;">💡 Optimization Recommendations</h4>
          <div style="background: #f8fff9; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #28a745;">
            ${recommendations.map(rec => `<div style="margin-bottom: 0.5rem;">${rec}</div>`).join('')}
          </div>
        </div>
        ` : ''}

        <div style="margin: 2rem 0;">
          <h4 style="color: #ffc107; margin-bottom: 1rem;">⚠️ Important Notes</h4>
          <div style="background: #fffcf5; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #ffc107;">
            <p style="margin: 0;">These are approximate calculations. Actual time may vary based on:</p>
            <ul style="margin: 0.5rem 0 0 1.5rem;">
              <li>Data complexity and task difficulty</li>
              <li>Code efficiency and framework optimization</li>
              <li>Optimization algorithm settings</li>
              <li>Available GPU/RAM memory</li>
              <li>Network I/O for large datasets</li>
            </ul>
          </div>
        </div>
      `;
    });
  }
});