document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('quantum-estimator-form');
  const result = document.getElementById('quantum-estimator-result');

  // Setup range sliders
  setupRangeSlider('success-probability', 'success-display', '%');
  setupRangeSlider('uncertainty-buffer', 'uncertainty-display', '%');

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateQuantumResources();
    });
  }

  function setupRangeSlider(sliderId, displayId, suffix = '') {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (slider && display) {
      slider.addEventListener('input', function() {
        display.textContent = this.value + suffix;
      });
    }
  }

  function calculateQuantumResources() {
    // Get form values
    const algorithmType = document.getElementById('algorithm-type').value;
    const problemSize = parseInt(document.getElementById('problem-size').value);
    const precision = document.getElementById('precision').value;
    const successProbability = parseInt(document.getElementById('success-probability').value);
    const hardwareType = document.getElementById('hardware-type').value;
    const gateFidelity = document.getElementById('gate-fidelity').value;
    const coherenceTime = document.getElementById('coherence-time').value;
    const connectivity = document.getElementById('connectivity').value;
    const errorCorrection = document.getElementById('error-correction').value;
    const logicalErrorRate = document.getElementById('logical-error-rate').value;
    const parallelism = document.getElementById('parallelism').value;
    const circuitOptimization = document.getElementById('circuit-optimization').checked;
    const includeMeasurements = document.getElementById('include-measurements').checked;
    const futureTech = document.getElementById('future-tech').checked;
    const uncertaintyBuffer = parseInt(document.getElementById('uncertainty-buffer').value) / 100;

    // Validate required fields
    if (!algorithmType || !problemSize || !precision || !hardwareType || !errorCorrection) {
      result.innerHTML = '<div class="error">Будь ласка, заповніть всі обов\'язкові поля.</div>';
      return;
    }

    // Calculate base algorithm requirements
    const baseRequirements = calculateBaseRequirements(algorithmType, problemSize, precision, successProbability);
    
    // Apply hardware and optimization adjustments
    const hardwareAdjustments = applyHardwareAdjustments(baseRequirements, hardwareType, gateFidelity, coherenceTime, connectivity, parallelism);
    
    // Calculate error correction overhead
    const errorCorrectionOverhead = calculateErrorCorrection(hardwareAdjustments, errorCorrection, logicalErrorRate, gateFidelity);
    
    // Apply optimizations and future tech adjustments
    const optimizedRequirements = applyOptimizations(errorCorrectionOverhead, circuitOptimization, futureTech);
    
    // Calculate final resource estimates with uncertainty buffer
    const finalEstimates = applyUncertaintyBuffer(optimizedRequirements, uncertaintyBuffer);
    
    // Calculate execution metrics
    const executionMetrics = calculateExecutionMetrics(finalEstimates, hardwareType, coherenceTime, includeMeasurements);
    
    // Display results
    displayResults({
      algorithmType,
      problemSize,
      precision,
      hardwareType,
      errorCorrection,
      baseRequirements,
      finalEstimates,
      executionMetrics,
      errorCorrectionOverhead,
      successProbability,
      circuitOptimization,
      futureTech
    });
  }

  function calculateBaseRequirements(algorithmType, problemSize, precision, successProbability) {
    let logicalQubits, gateCount, circuitDepth, classicalOps = 0;

    // Precision multiplier
    const precisionMultipliers = {
      'low': 1.0,
      'medium': 1.5,
      'high': 2.0,
      'very-high': 3.0
    };
    const precisionMult = precisionMultipliers[precision] || 1.0;

    // Success probability adjustments (repeat algorithm if needed)
    const successAdjustment = Math.max(1, Math.log(100 / successProbability) / Math.log(2));

    // Base calculations for different algorithms
    switch (algorithmType) {
      case 'shors':
        // Shor's algorithm for integer factorization
        logicalQubits = Math.ceil(3 * Math.log2(problemSize)); // 3n qubits for n-bit number
        gateCount = Math.pow(Math.log2(problemSize), 3) * 1000; // O(n³) gates
        circuitDepth = Math.pow(Math.log2(problemSize), 2) * 100; // O(n²) depth
        classicalOps = Math.pow(problemSize, 0.25) * 1000; // Classical post-processing
        break;
        
      case 'grovers':
        // Grover's search algorithm
        logicalQubits = Math.ceil(Math.log2(problemSize));
        const iterations = Math.ceil(Math.sqrt(problemSize) * Math.PI / 4);
        gateCount = iterations * logicalQubits * 20; // ~20 gates per iteration per qubit
        circuitDepth = iterations * 10; // Serial iterations
        classicalOps = problemSize * 10; // Classical oracle calls
        break;
        
      case 'qaoa':
        // Quantum Approximate Optimization Algorithm
        logicalQubits = problemSize; // One qubit per variable
        const layers = 10; // Typical QAOA layers
        gateCount = logicalQubits * layers * 5; // Gates per layer
        circuitDepth = layers * 20; // Sequential layers
        classicalOps = layers * 1000; // Classical optimization
        break;
        
      case 'vqe':
        // Variational Quantum Eigensolver
        logicalQubits = Math.ceil(Math.log2(problemSize) * 2); // System representation
        gateCount = Math.pow(logicalQubits, 2) * 100; // Ansatz circuit
        circuitDepth = logicalQubits * 10; // Circuit depth
        classicalOps = 10000; // Variational optimization
        break;
        
      case 'simulation':
        // Quantum simulation
        logicalQubits = Math.ceil(Math.log2(problemSize));
        gateCount = Math.pow(logicalQubits, 2) * problemSize; // Trotter steps
        circuitDepth = problemSize * 5; // Time evolution
        classicalOps = 1000; // State preparation
        break;
        
      case 'ml':
        // Quantum Machine Learning
        logicalQubits = Math.ceil(Math.log2(problemSize));
        gateCount = Math.pow(logicalQubits, 2) * 50; // Feature encoding + processing
        circuitDepth = logicalQubits * 20; // Deep quantum circuit
        classicalOps = problemSize * 100; // Data preprocessing
        break;
        
      case 'simon':
        // Simon's algorithm
        logicalQubits = Math.ceil(Math.log2(problemSize)) * 2; // Input + output registers
        gateCount = logicalQubits * 100; // Linear gates
        circuitDepth = logicalQubits * 5; // Shallow circuit
        classicalOps = Math.pow(logicalQubits, 2); // Period finding
        break;
        
      default:
        // Custom algorithm - conservative estimates
        logicalQubits = Math.ceil(Math.log2(problemSize));
        gateCount = Math.pow(logicalQubits, 2) * 100;
        circuitDepth = logicalQubits * 10;
        classicalOps = problemSize;
    }

    // Apply precision and success probability adjustments
    gateCount = Math.round(gateCount * precisionMult * successAdjustment);
    circuitDepth = Math.round(circuitDepth * precisionMult);
    logicalQubits = Math.round(logicalQubits * Math.sqrt(precisionMult));
    classicalOps = Math.round(classicalOps * successAdjustment);

    return {
      logicalQubits,
      gateCount,
      circuitDepth,
      classicalOps
    };
  }

  function applyHardwareAdjustments(baseReq, hardwareType, gateFidelity, coherenceTime, connectivity, parallelism) {
    // Hardware-specific adjustments
    const hardwareFactors = {
      'superconducting': { speedFactor: 1.0, overheadFactor: 1.2 },
      'trapped-ion': { speedFactor: 0.1, overheadFactor: 1.0 },
      'photonic': { speedFactor: 2.0, overheadFactor: 1.5 },
      'neutral-atom': { speedFactor: 0.5, overheadFactor: 1.1 },
      'topological': { speedFactor: 0.8, overheadFactor: 0.8 }
    };

    const hwFactor = hardwareFactors[hardwareType] || hardwareFactors['superconducting'];

    // Gate fidelity adjustments
    const fidelityFactors = {
      'low': 2.0,     // More gates needed for error mitigation
      'medium': 1.5,
      'high': 1.2,
      'very-high': 1.0
    };
    const fidelityMult = fidelityFactors[gateFidelity] || 1.5;

    // Coherence time affects circuit depth
    const coherenceFactors = {
      'short': 2.0,   // Need shorter circuits
      'medium': 1.5,
      'long': 1.2,
      'very-long': 1.0
    };
    const coherenceMult = coherenceFactors[coherenceTime] || 1.5;

    // Connectivity affects gate count (SWAP gates needed)
    const connectivityFactors = {
      'linear': 3.0,      // Many SWAP gates needed
      'grid': 2.0,
      'limited': 1.5,
      'all-to-all': 1.0
    };
    const connectivityMult = connectivityFactors[connectivity] || 2.0;

    // Parallelism affects execution time
    const parallelismFactors = {
      'none': 1.0,
      'limited': 0.8,
      'moderate': 0.6,
      'high': 0.4
    };
    const parallelismMult = parallelismFactors[parallelism] || 1.0;

    return {
      logicalQubits: Math.round(baseReq.logicalQubits * hwFactor.overheadFactor),
      gateCount: Math.round(baseReq.gateCount * fidelityMult * connectivityMult),
      circuitDepth: Math.round(baseReq.circuitDepth * coherenceMult * parallelismMult),
      classicalOps: baseReq.classicalOps,
      hardwareFactor: hwFactor
    };
  }

  function calculateErrorCorrection(adjustedReq, errorCorrection, logicalErrorRate, gateFidelity) {
    const physicalQubitOverhead = {
      'none': 1,          // No error correction (NISQ)
      'surface': 1000,    // Surface code
      'color': 1500,      // Color code
      'concatenated': 800, // Concatenated codes
      'future': 100       // Future improved codes
    };

    const overhead = physicalQubitOverhead[errorCorrection] || 1;

    // Error rate affects overhead
    const errorRateFactors = {
      'high': 0.5,        // Less stringent requirements
      'medium': 1.0,
      'low': 2.0,         // More overhead needed
      'very-low': 5.0
    };
    const errorMult = errorRateFactors[logicalErrorRate] || 1.0;

    const physicalQubits = Math.round(adjustedReq.logicalQubits * overhead * errorMult);
    const errorCorrectionGates = errorCorrection === 'none' ? 0 : physicalQubits * 10;

    return {
      ...adjustedReq,
      physicalQubits,
      errorCorrectionGates,
      totalGates: adjustedReq.gateCount + errorCorrectionGates
    };
  }

  function applyOptimizations(errorCorrectedReq, circuitOptimization, futureTech) {
    let optimizationFactor = 1.0;
    let futureFactor = 1.0;

    if (circuitOptimization) {
      optimizationFactor = 0.7; // 30% reduction from optimization
    }

    if (futureTech) {
      futureFactor = 0.5; // 50% improvement from future tech
    }

    return {
      ...errorCorrectedReq,
      totalGates: Math.round(errorCorrectedReq.totalGates * optimizationFactor * futureFactor),
      circuitDepth: Math.round(errorCorrectedReq.circuitDepth * optimizationFactor * futureFactor),
      optimizationFactor,
      futureFactor
    };
  }

  function applyUncertaintyBuffer(optimizedReq, uncertaintyBuffer) {
    const bufferMult = 1 + uncertaintyBuffer;

    return {
      ...optimizedReq,
      physicalQubits: Math.round(optimizedReq.physicalQubits * bufferMult),
      totalGates: Math.round(optimizedReq.totalGates * bufferMult),
      circuitDepth: Math.round(optimizedReq.circuitDepth * bufferMult),
      uncertaintyBuffer
    };
  }

  function calculateExecutionMetrics(finalEstimates, hardwareType, coherenceTime, includeMeasurements) {
    // Gate times by hardware type (microseconds)
    const gateTimes = {
      'superconducting': 0.05,    // 50 ns
      'trapped-ion': 10,          // 10 μs
      'photonic': 0.001,          // 1 ns
      'neutral-atom': 1,          // 1 μs
      'topological': 0.1          // 100 ns
    };

    const gateTime = gateTimes[hardwareType] || 1;
    
    // Execution time calculation
    const gateExecutionTime = finalEstimates.totalGates * gateTime; // microseconds
    const measurementTime = includeMeasurements ? finalEstimates.logicalQubits * 10 : 0; // 10 μs per measurement
    
    const totalExecutionTime = gateExecutionTime + measurementTime;

    // Coherence time limits (microseconds)
    const coherenceLimits = {
      'short': 10,
      'medium': 100,
      'long': 1000,
      'very-long': 10000
    };

    const coherenceLimit = coherenceLimits[coherenceTime] || 100;
    const coherenceRatio = totalExecutionTime / coherenceLimit;

    // Memory requirements (classical)
    const classicalMemory = finalEstimates.physicalQubits * 0.1; // MB per qubit for control
    const quantumStateSize = Math.pow(2, Math.min(finalEstimates.logicalQubits, 40)) / 1024 / 1024; // MB for simulation

    return {
      totalExecutionTime, // microseconds
      gateExecutionTime,
      measurementTime,
      coherenceRatio,
      classicalMemory, // MB
      quantumStateSize, // MB
      feasible: coherenceRatio < 1.0
    };
  }

  function displayResults(data) {
    const html = `
      <div class="result-section">
        <h3>🔬 Розрахунок ресурсів квантових обчислень</h3>
        
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>🎯 Логічні кубіти</h6>
            <div class="big-number">${data.finalEstimates.logicalQubits.toLocaleString()}</div>
            <div>кубітів алгоритму</div>
          </div>
          <div class="insight-card warning">
            <h6>⚛️ Фізичні кубіти</h6>
            <div class="big-number">${data.finalEstimates.physicalQubits.toLocaleString()}</div>
            <div>з корекцією помилок</div>
          </div>
          <div class="insight-card success">
            <h6>⚡ Квантові вентилі</h6>
            <div class="big-number">${data.finalEstimates.totalGates.toLocaleString()}</div>
            <div>загальна кількість</div>
          </div>
          <div class="insight-card">
            <h6>📏 Глибина схеми</h6>
            <div class="big-number">${data.finalEstimates.circuitDepth.toLocaleString()}</div>
            <div>послідовних шарів</div>
          </div>
        </div>

        <h4>📊 Деталізація ресурсів</h4>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            
            <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px;">
              <h5 style="margin-top: 0;">🧮 Базові вимоги алгоритму</h5>
              <ul style="margin: 0.5rem 0; list-style: none; padding: 0;">
                <li>Логічні кубіти: <strong>${data.baseRequirements.logicalQubits}</strong></li>
                <li>Квантові вентилі: <strong>${data.baseRequirements.gateCount.toLocaleString()}</strong></li>
                <li>Глибина схеми: <strong>${data.baseRequirements.circuitDepth}</strong></li>
                <li>Класичні операції: <strong>${data.baseRequirements.classicalOps.toLocaleString()}</strong></li>
              </ul>
            </div>

            <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px;">
              <h5 style="margin-top: 0;">🔧 Корекція помилок</h5>
              <ul style="margin: 0.5rem 0; list-style: none; padding: 0;">
                <li>Схема: <strong>${getErrorCorrectionName(data.errorCorrection)}</strong></li>
                <li>Накладні вентилі: <strong>${data.errorCorrectionOverhead.errorCorrectionGates?.toLocaleString() || 0}</strong></li>
                <li>Фізичні кубіти: <strong>${data.finalEstimates.physicalQubits.toLocaleString()}</strong></li>
                <li>Коефіцієнт накладних: <strong>${Math.round(data.finalEstimates.physicalQubits / data.finalEstimates.logicalQubits)}x</strong></li>
              </ul>
            </div>

            <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px;">
              <h5 style="margin-top: 0;">⏱️ Виконання</h5>
              <ul style="margin: 0.5rem 0; list-style: none; padding: 0;">
                <li>Час виконання: <strong>${formatExecutionTime(data.executionMetrics.totalExecutionTime)}</strong></li>
                <li>Апаратне забезпечення: <strong>${getHardwareName(data.hardwareType)}</strong></li>
                <li>Можливість: <strong style="color: ${data.executionMetrics.feasible ? 'green' : 'red'}">${data.executionMetrics.feasible ? 'Можливо' : 'Потребує покращень'}</strong></li>
                <li>Коефіцієнт когерентності: <strong>${data.executionMetrics.coherenceRatio.toFixed(2)}x</strong></li>
              </ul>
            </div>

          </div>

          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Базові вентилі алгоритму:</span>
            <strong>${data.baseRequirements.gateCount.toLocaleString()}</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Вентилі корекції помилок:</span>
            <strong>${(data.errorCorrectionOverhead.errorCorrectionGates || 0).toLocaleString()}</strong>
          </div>
          ${data.circuitOptimization ? `
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Оптимізація схеми (-30%):</span>
            <strong>Застосовано</strong>
          </div>` : ''}
          ${data.futureTech ? `
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Майбутні технології (-50%):</span>
            <strong>Застосовано</strong>
          </div>` : ''}
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <span>Резерв невизначеності (+${(data.finalEstimates.uncertaintyBuffer * 100).toFixed(0)}%):</span>
            <strong>Включено</strong>
          </div>
          <hr style="margin: 1rem 0; border: none; border-top: 3px solid var(--accent);">
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; font-size: 1.2rem;">
            <span><strong>Загальна кількість вентилів:</strong></span>
            <strong style="color: var(--accent);">${data.finalEstimates.totalGates.toLocaleString()}</strong>
          </div>
        </div>

        <h4>📈 Деталі алгоритму</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
          
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
            <h5 style="margin-top: 0;">🧮 Алгоритм</h5>
            <ul style="margin: 0.5rem 0; list-style: none; padding: 0;">
              <li><strong>Тип:</strong> ${getAlgorithmName(data.algorithmType)}</li>
              <li><strong>Розмір задачі:</strong> ${data.problemSize}</li>
              <li><strong>Точність:</strong> ${getPrecisionName(data.precision)}</li>
              <li><strong>Ймовірність успіху:</strong> ${data.successProbability}%</li>
            </ul>
          </div>

          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
            <h5 style="margin-top: 0;">🖥️ Апаратне забезпечення</h5>
            <ul style="margin: 0.5rem 0; list-style: none; padding: 0;">
              <li><strong>Платформа:</strong> ${getHardwareName(data.hardwareType)}</li>
              <li><strong>Корекція помилок:</strong> ${getErrorCorrectionName(data.errorCorrection)}</li>
              <li><strong>Класична пам'ять:</strong> ${data.executionMetrics.classicalMemory.toFixed(1)} МБ</li>
              <li><strong>Розмір квантового стану:</strong> ${formatMemory(data.executionMetrics.quantumStateSize)}</li>
            </ul>
          </div>

        </div>

        ${getQuantumAdviceSection(data)}
      </div>
    `;

    result.innerHTML = html;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getAlgorithmName(algorithm) {
    const names = {
      'shors': 'Алгоритм Шора',
      'grovers': 'Пошук Гровера',
      'qaoa': 'QAOA',
      'vqe': 'VQE',
      'simulation': 'Квантова симуляція',
      'ml': 'Квантове МН',
      'simon': 'Алгоритм Саймона',
      'custom': 'Індивідуальний'
    };
    return names[algorithm] || algorithm;
  }

  function getPrecisionName(precision) {
    const names = {
      'low': 'Низька (90%)',
      'medium': 'Середня (99%)',
      'high': 'Висока (99.9%)',
      'very-high': 'Дуже висока (99.99%)'
    };
    return names[precision] || precision;
  }

  function getHardwareName(hardware) {
    const names = {
      'superconducting': 'Надпровідні кубіти',
      'trapped-ion': 'Захоплені іони',
      'photonic': 'Фотонічні кубіти',
      'neutral-atom': 'Нейтральні атоми',
      'topological': 'Топологічні кубіти'
    };
    return names[hardware] || hardware;
  }

  function getErrorCorrectionName(errorCorrection) {
    const names = {
      'none': 'Без корекції (NISQ)',
      'surface': 'Поверхневий код',
      'color': 'Кольоровий код',
      'concatenated': 'Конкатенаційний',
      'future': 'Майбутні схеми'
    };
    return names[errorCorrection] || errorCorrection;
  }

  function formatExecutionTime(timeUs) {
    if (timeUs < 1000) {
      return timeUs.toFixed(1) + ' μс';
    } else if (timeUs < 1000000) {
      return (timeUs / 1000).toFixed(1) + ' мс';
    } else if (timeUs < 1000000000) {
      return (timeUs / 1000000).toFixed(1) + ' с';
    } else {
      return (timeUs / 1000000000).toFixed(1) + ' кс';
    }
  }

  function formatMemory(sizeMB) {
    if (sizeMB < 1024) {
      return sizeMB.toFixed(1) + ' МБ';
    } else if (sizeMB < 1024 * 1024) {
      return (sizeMB / 1024).toFixed(1) + ' ГБ';
    } else {
      return (sizeMB / 1024 / 1024).toFixed(1) + ' ТБ';
    }
  }

  function getQuantumAdviceSection(data) {
    const advice = [];
    
    if (!data.executionMetrics.feasible) {
      advice.push('⚠️ <strong>Проблема когерентності:</strong> Час виконання перевищує час когерентності. Розгляньте коротші схеми або кращі апаратні платформи');
    }
    
    if (data.finalEstimates.physicalQubits > 1000000) {
      advice.push('🔮 <strong>Великі ресурси:</strong> Потрібна велика кількість фізичних кубітів. Це може потребувати майбутніх технологій');
    }
    
    if (data.errorCorrection === 'none' && data.finalEstimates.totalGates > 10000) {
      advice.push('🎛️ <strong>Рекомендація корекції помилок:</strong> Для такої кількості вентилів рекомендується корекція помилок');
    }
    
    if (data.executionMetrics.coherenceRatio < 0.1) {
      advice.push('✅ <strong>Відмінна когерентність:</strong> Алгоритм легко виконується в межах часу когерентності');
    }

    advice.push('🚀 <strong>NISQ ера:</strong> Розгляньте можливість використання поточних квантових пристроїв для малих версій задачі');
    advice.push('📊 <strong>Класичне порівняння:</strong> Порівняйте з класичними алгоритмами для визначення квантової переваги');

    return `
      <div style="margin-top: 2rem;">
        <h3>💡 Рекомендації та аналіз</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <ul style="margin: 0.5rem 0;">
            ${advice.map(tip => `<li style="margin: 0.5rem 0;">${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
});