document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bottleneck-form");
  const result = document.getElementById("bottleneck-result");

  // CPU Performance Database (simplified scoring system)
  const cpuDatabase = {
    // Intel processors
    "i3-12100": 85, "i3-12100f": 85, "i3-13100": 87, "i3-13100f": 87,
    "i5-12400": 95, "i5-12400f": 95, "i5-13400": 98, "i5-13400f": 98,
    "i5-12600": 100, "i5-12600f": 100, "i5-13600": 105, "i5-13600f": 105,
    "i5-14600": 108, "i5-14600f": 108,
    "i7-12700": 115, "i7-12700f": 115, "i7-13700": 120, "i7-13700f": 120,
    "i7-14700": 125, "i7-14700f": 125,
    "i9-12900": 130, "i9-12900f": 130, "i9-13900": 140, "i9-13900f": 140,
    "i9-14900": 145, "i9-14900f": 145,
    
    // AMD processors
    "ryzen 5 5600": 90, "ryzen 5 5600x": 95, "ryzen 5 7600": 100, "ryzen 5 7600x": 105,
    "ryzen 7 5700x": 105, "ryzen 7 5800x": 110, "ryzen 7 7700": 115, "ryzen 7 7700x": 120,
    "ryzen 9 5900x": 125, "ryzen 9 5950x": 135, "ryzen 9 7900x": 130, "ryzen 9 7950x": 145,
    
    // Older processors
    "i5-10400": 75, "i5-11400": 85, "i7-10700": 85, "i7-11700": 95,
    "ryzen 5 3600": 80, "ryzen 7 3700x": 90, "ryzen 9 3900x": 100
  };

  // GPU Performance Database (simplified scoring system)
  const gpuDatabase = {
    // NVIDIA RTX 40 series
    "rtx 4060": 85, "rtx 4060 ti": 95, "rtx 4070": 110, "rtx 4070 super": 120,
    "rtx 4070 ti": 125, "rtx 4070 ti super": 130, "rtx 4080": 140, "rtx 4080 super": 145,
    "rtx 4090": 160,
    
    // NVIDIA RTX 30 series
    "rtx 3060": 75, "rtx 3060 ti": 85, "rtx 3070": 95, "rtx 3070 ti": 100,
    "rtx 3080": 115, "rtx 3080 ti": 120, "rtx 3090": 130, "rtx 3090 ti": 135,
    
    // AMD RX 7000 series
    "rx 7600": 80, "rx 7600 xt": 85, "rx 7700 xt": 95, "rx 7800 xt": 105,
    "rx 7900 gre": 115, "rx 7900 xt": 125, "rx 7900 xtx": 135,
    
    // AMD RX 6000 series
    "rx 6600": 70, "rx 6600 xt": 75, "rx 6700 xt": 85, "rx 6750 xt": 90,
    "rx 6800": 95, "rx 6800 xt": 105, "rx 6900 xt": 115, "rx 6950 xt": 120,
    
    // Older GPUs
    "gtx 1660": 55, "gtx 1660 super": 60, "gtx 1660 ti": 62,
    "rtx 2060": 65, "rtx 2060 super": 70, "rtx 2070": 75, "rtx 2070 super": 80,
    "rtx 2080": 85, "rtx 2080 super": 90, "rtx 2080 ti": 95
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const cpuModel = document.getElementById("cpu-model").value.toLowerCase().trim();
    const gpuModel = document.getElementById("gpu-model").value.toLowerCase().trim();
    const ramAmount = parseInt(document.getElementById("ram-amount").value);
    const resolution = document.getElementById("resolution").value;
    const useCase = document.getElementById("use-case").value;
    const settingsLevel = document.getElementById("settings-level").value;
    const targetFps = parseInt(document.getElementById("target-fps").value);

    if (!cpuModel || !gpuModel || !ramAmount || !resolution || !useCase || !settingsLevel || !targetFps) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Error</h6>
        <p>Please fill in all form fields.</p>
      </div>`;
      return;
    }

    // Find CPU and GPU scores
    const cpuScore = findComponentScore(cpuModel, cpuDatabase);
    const gpuScore = findComponentScore(gpuModel, gpuDatabase);

    if (!cpuScore || !gpuScore) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Component Not Found</h6>
        <p>Could not find one or both components in the database. Try entering a more specific model name.</p>
        <p><small>Example: "Intel i5-12400F" or "RTX 4060"</small></p>
      </div>`;
      return;
    }

    // Calculate bottleneck
    const analysis = calculateBottleneck(cpuScore, gpuScore, ramAmount, resolution, useCase, settingsLevel, targetFps);
    
    // Generate recommendations
    const recommendations = generateRecommendations(analysis, useCase, resolution, settingsLevel);

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${analysis.severity.class}">
          <h6>${analysis.severity.icon} Bottleneck</h6>
          <div class="big-number">${analysis.bottleneckPercent}%</div>
          <p>${analysis.bottleneckType}</p>
        </div>
        
        <div class="insight-card info">
          <h6>🔥 CPU Score</h6>
          <div class="big-number">${cpuScore}</div>
          <p>Processor performance</p>
        </div>
        
        <div class="insight-card info">
          <h6>🎮 GPU Score</h6>
          <div class="big-number">${gpuScore}</div>
          <p>Graphics card performance</p>
        </div>
      </div>

      <div class="insight-card">
        <h6>📊 Detailed Analysis</h6>
        <div style="text-align: left;">
          <div class="component-analysis">
            <div class="component-bar">
              <span><strong>🔥 CPU:</strong> ${cpuModel.toUpperCase()}</span>
              <div class="progress-bar">
                <div class="progress cpu-progress" style="width: ${(cpuScore / Math.max(cpuScore, gpuScore)) * 100}%"></div>
              </div>
              <span>${cpuScore} points</span>
            </div>
            <div class="component-bar">
              <span><strong>🎮 GPU:</strong> ${gpuModel.toUpperCase()}</span>
              <div class="progress-bar">
                <div class="progress gpu-progress" style="width: ${(gpuScore / Math.max(cpuScore, gpuScore)) * 100}%"></div>
              </div>
              <span>${gpuScore} points</span>
            </div>
          </div>
          
          <div style="margin-top: 1rem;">
            <p><strong>💾 RAM:</strong> ${ramAmount} GB ${analysis.ramStatus}</p>
            <p><strong>🖥️ Resolution:</strong> ${getResolutionName(resolution)}</p>
            <p><strong>🎯 Use Case:</strong> ${getUseCaseName(useCase)}</p>
            <p><strong>⚖️ System Balance:</strong> ${analysis.balanceDescription}</p>
          </div>
        </div>
      </div>

      ${recommendations}

      <div class="insight-card">
        <h6>🎯 Performance Forecast</h6>
        ${generatePerformanceForecast(analysis, useCase, targetFps, resolution, settingsLevel)}
      </div>

      <div class="insight-card info">
        <h6>💡 General Tips</h6>
        <ul style="text-align: left; margin: 1rem 0;">
          <li>📊 Use MSI Afterburner to monitor component utilization</li>
          <li>🎛️ Experiment with settings to optimize balance</li>
          <li>❄️ Ensure adequate system cooling</li>
          <li>⚡ Verify power supply has sufficient capacity</li>
          <li>🔧 Consider upgrading the weakest component first</li>
          <li>💾 Make sure RAM is running at rated speeds</li>
        </ul>
      </div>
    `;

    // Add CSS for component analysis if not already added
    if (!document.getElementById('bottleneck-styles')) {
      const style = document.createElement('style');
      style.id = 'bottleneck-styles';
      style.textContent = `
        .component-analysis {
          margin: 1rem 0;
        }
        .component-bar {
          margin: 0.8rem 0;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .component-bar span:first-child {
          min-width: 200px;
          font-size: 0.9rem;
        }
        .component-bar span:last-child {
          min-width: 80px;
          text-align: right;
          font-weight: bold;
        }
        .progress-bar {
          flex: 1;
          height: 24px;
          background: #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          border-radius: 12px;
          transition: width 0.5s ease;
        }
        .cpu-progress {
          background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%);
        }
        .gpu-progress {
          background: linear-gradient(90deg, #4834d4 0%, #686de0 100%);
        }
      `;
      document.head.appendChild(style);
    }
  });

  function findComponentScore(model, database) {
    // Clean the model name for matching
    const cleanModel = model.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
    
    // Try exact match first
    if (database[cleanModel]) {
      return database[cleanModel];
    }
    
    // Try partial matches
    for (const [key, score] of Object.entries(database)) {
      if (cleanModel.includes(key) || key.includes(cleanModel)) {
        return score;
      }
    }
    
    // Try more fuzzy matching
    const modelTokens = cleanModel.split(' ');
    for (const [key, score] of Object.entries(database)) {
      const keyTokens = key.split(' ');
      let matches = 0;
      
      for (const token of modelTokens) {
        if (keyTokens.some(keyToken => keyToken.includes(token) || token.includes(keyToken))) {
          matches++;
        }
      }
      
      if (matches >= Math.min(modelTokens.length, keyTokens.length) * 0.7) {
        return score;
      }
    }
    
    return null;
  }

  function calculateBottleneck(cpuScore, gpuScore, ramAmount, resolution, useCase, settingsLevel, targetFps) {
    let adjustedCpuScore = cpuScore;
    let adjustedGpuScore = gpuScore;

    // Resolution adjustments
    const resolutionMultipliers = {
      "1080p": { cpu: 1.0, gpu: 1.0 },
      "1440p": { cpu: 0.9, gpu: 1.3 },
      "4k": { cpu: 0.8, gpu: 1.6 },
      "1080p-ultrawide": { cpu: 0.95, gpu: 1.1 },
      "4k-ultrawide": { cpu: 0.85, gpu: 1.4 }
    };

    // Settings adjustments
    const settingsMultipliers = {
      "low": { cpu: 1.1, gpu: 0.8 },
      "medium": { cpu: 1.0, gpu: 1.0 },
      "high": { cpu: 0.9, gpu: 1.2 },
      "ultra": { cpu: 0.8, gpu: 1.4 }
    };

    // Use case adjustments
    const useCaseMultipliers = {
      "gaming": { cpu: 0.9, gpu: 1.1 },
      "content-creation": { cpu: 1.3, gpu: 0.9 },
      "3d-modeling": { cpu: 1.1, gpu: 1.1 },
      "office-work": { cpu: 1.0, gpu: 0.7 },
      "programming": { cpu: 1.2, gpu: 0.8 },
      "mixed": { cpu: 1.0, gpu: 1.0 }
    };

    // Target FPS adjustments
    if (targetFps >= 144) {
      adjustedCpuScore *= 1.2;
    } else if (targetFps >= 120) {
      adjustedCpuScore *= 1.1;
    }

    // Apply multipliers
    adjustedCpuScore *= resolutionMultipliers[resolution].cpu;
    adjustedCpuScore *= settingsMultipliers[settingsLevel].cpu;
    adjustedCpuScore *= useCaseMultipliers[useCase].cpu;

    adjustedGpuScore *= resolutionMultipliers[resolution].gpu;
    adjustedGpuScore *= settingsMultipliers[settingsLevel].gpu;
    adjustedGpuScore *= useCaseMultipliers[useCase].gpu;

    // Calculate bottleneck percentage
    const difference = Math.abs(adjustedCpuScore - adjustedGpuScore);
    const maxScore = Math.max(adjustedCpuScore, adjustedGpuScore);
    const bottleneckPercent = Math.round((difference / maxScore) * 100);

    // Determine bottleneck type
    let bottleneckType;
    if (adjustedCpuScore < adjustedGpuScore) {
      bottleneckType = "CPU Bottleneck";
    } else if (adjustedGpuScore < adjustedCpuScore) {
      bottleneckType = "GPU Bottleneck";
    } else {
      bottleneckType = "Balanced System";
    }

    // RAM analysis
    let ramStatus = "";
    const requiredRam = {
      "gaming": 16,
      "content-creation": 32,
      "3d-modeling": 32,
      "office-work": 8,
      "programming": 16,
      "mixed": 16
    };

    if (ramAmount < requiredRam[useCase]) {
      ramStatus = "(⚠️ Insufficient for tasks)";
    } else {
      ramStatus = "(✅ Adequate)";
    }

    // Severity assessment
    let severity;
    if (bottleneckPercent <= 10) {
      severity = { class: "success", icon: "🟢", level: "Excellent" };
    } else if (bottleneckPercent <= 20) {
      severity = { class: "success", icon: "🟡", level: "Good" };
    } else if (bottleneckPercent <= 30) {
      severity = { class: "warning", icon: "🟠", level: "Moderate" };
    } else {
      severity = { class: "warning", icon: "🔴", level: "Critical" };
    }

    let balanceDescription;
    if (bottleneckPercent <= 5) {
      balanceDescription = "Perfectly balanced system";
    } else if (bottleneckPercent <= 15) {
      balanceDescription = "Well-balanced system";
    } else if (bottleneckPercent <= 25) {
      balanceDescription = "Moderate component imbalance";
    } else {
      balanceDescription = "Significant component imbalance";
    }

    return {
      bottleneckPercent,
      bottleneckType,
      severity,
      balanceDescription,
      ramStatus,
      adjustedCpuScore: Math.round(adjustedCpuScore),
      adjustedGpuScore: Math.round(adjustedGpuScore)
    };
  }

  function generateRecommendations(analysis, useCase, resolution, settingsLevel) {
    let recommendations = "<ul style='text-align: left; margin: 1rem 0;'>";

    if (analysis.bottleneckType === "CPU Bottleneck") {
      recommendations += "<li><strong>🔥 CPU Bottleneck detected:</strong><br>";
      recommendations += "• Lower CPU-intensive settings (physics, NPCs, draw distance)<br>";
      recommendations += "• Increase resolution or graphics settings<br>";
      recommendations += "• Consider upgrading your processor</li>";
    } else if (analysis.bottleneckType === "GPU Bottleneck") {
      recommendations += "<li><strong>🎮 GPU Bottleneck detected:</strong><br>";
      recommendations += "• Lower graphics settings (textures, shadows, anti-aliasing)<br>";
      recommendations += "• Reduce screen resolution<br>";
      recommendations += "• Consider upgrading your graphics card</li>";
    } else {
      recommendations += "<li><strong>⚖️ System is well balanced:</strong><br>";
      recommendations += "• Your configuration is working optimally<br>";
      recommendations += "• You can increase graphics settings if needed</li>";
    }

    // RAM recommendations
    if (analysis.ramStatus.includes("⚠️")) {
      recommendations += "<li><strong>💾 RAM Recommendations:</strong><br>";
      recommendations += "• Increase memory capacity<br>";
      recommendations += "• Ensure RAM runs in dual-channel mode</li>";
    }

    // Use case specific recommendations
    if (useCase === "gaming" && analysis.bottleneckPercent > 20) {
      recommendations += "<li><strong>🎮 For Gaming:</strong><br>";
      recommendations += "• Experiment with V-Sync and FPS limit settings<br>";
      recommendations += "• Use DLSS/FSR technologies if available</li>";
    }

    if (useCase === "content-creation" && analysis.bottleneckType === "CPU Bottleneck") {
      recommendations += "<li><strong>🎬 For Content Creation:</strong><br>";
      recommendations += "• Use hardware-accelerated rendering<br>";
      recommendations += "• Consider processors with more cores</li>";
    }

    recommendations += "</ul>";

    const cardClass = analysis.bottleneckPercent > 20 ? "warning" : "success";
    
    return `
      <div class="insight-card ${cardClass}">
        <h6>🔧 Recommendations</h6>
        ${recommendations}
      </div>
    `;
  }

  function generatePerformanceForecast(analysis, useCase, targetFps, resolution, settingsLevel) {
    let forecast = "<div style='text-align: left;'>";
    
    // Performance prediction based on bottleneck
    let performanceLevel;
    let fpsEstimate;
    
    if (analysis.bottleneckPercent <= 10) {
      performanceLevel = "Excellent";
      fpsEstimate = Math.round(targetFps * 0.95);
    } else if (analysis.bottleneckPercent <= 20) {
      performanceLevel = "Good";
      fpsEstimate = Math.round(targetFps * 0.85);
    } else if (analysis.bottleneckPercent <= 30) {
      performanceLevel = "Moderate";
      fpsEstimate = Math.round(targetFps * 0.7);
    } else {
      performanceLevel = "Limited";
      fpsEstimate = Math.round(targetFps * 0.5);
    }

    forecast += `<div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">`;
    forecast += `<strong>📈 Expected Performance:</strong> ${performanceLevel}<br>`;
    forecast += `<strong>🎯 FPS Forecast:</strong> ~${fpsEstimate} FPS (target: ${targetFps} FPS)<br>`;
    forecast += `<strong>🎮 For ${getUseCaseName(useCase)}:</strong> `;
    
    if (analysis.bottleneckPercent <= 15) {
      forecast += "System will handle it excellently ✅";
    } else if (analysis.bottleneckPercent <= 25) {
      forecast += "Settings compromises needed ⚠️";
    } else {
      forecast += "Upgrade recommended 🔴";
    }
    forecast += `</div>`;
    
    forecast += "</div>";
    return forecast;
  }

  function getResolutionName(resolution) {
    const names = {
      "1080p": "Full HD (1920×1080)",
      "1440p": "QHD (2560×1440)",
      "4k": "4K UHD (3840×2160)",
      "1080p-ultrawide": "Ultrawide QHD (3440×1440)",
      "4k-ultrawide": "Ultrawide 4K (5120×1440)"
    };
    return names[resolution] || resolution;
  }

  function getUseCaseName(useCase) {
    const names = {
      "gaming": "Gaming",
      "content-creation": "Content Creation",
      "3d-modeling": "3D Modeling",
      "office-work": "Office Work",
      "programming": "Programming",
      "mixed": "Mixed Usage"
    };
    return names[useCase] || useCase;
  }
});