document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('quantum-estimator-form');
  const result = document.getElementById('quantum-result');
  const successSlider = document.getElementById('success-probability');
  const successDisplay = document.getElementById('success-display');

  // Update success probability display
  if (successSlider && successDisplay) {
    successSlider.addEventListener('input', function() {
      successDisplay.textContent = this.value + '%';
    });
  }

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateQuantumResources();
    });
  }

  function calculateQuantumResources() {
    // Get form values
    const algorithmType = document.getElementById('algorithm-type').value;
    const problemSize = parseInt(document.getElementById('problem-size').value);
    const precision = document.getElementById('precision').value;
    const successProbability = parseInt(document.getElementById('success-probability').value);
    const hardwareType = document.getElementById('hardware-type').value;
    const gateFidelity = parseFloat(document.getElementById('gate-fidelity').value) / 100;
    const coherenceTime = parseInt(document.getElementById('coherence-time').value);
    const gateTime = parseInt(document.getElementById('gate-time').value);
    const errorCorrection = document.getElementById('error-correction').value;
    const logicalErrorRate = document.getElementById('logical-error-rate').value;
    const faultTolerant = document.getElementById('fault-tolerant').checked;
    const distributed = document.getElementById('distributed').checked;
    const optimizationLevel = document.getElementById('optimization-level').value;
    const connectivity = document.getElementById('connectivity').value;
    const includeClassical = document.getElementById('include-classical').checked;
    const executionEnvironment = document.getElementById('execution-environment').value;

    // Validate required fields
    if (!algorithmType || !problemSize || !precision || !hardwareType || !errorCorrection) {
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    // Calculate base algorithm requirements
    const baseRequirements = calculateBaseRequirements(algorithmType, problemSize, precision, successProbability);
    
    // Apply hardware and optimization adjustments
    const hardwareAdjustments = applyHardwareAdjustments(baseRequirements, hardwareType, gateFidelity, coherenceTime, gateTime, connectivity, optimizationLevel);
    
    // Calculate error correction overhead
    const errorCorrectionOverhead = calculateErrorCorrection(hardwareAdjustments, errorCorrection, logicalErrorRate, gateFidelity);
    
    // Calculate final resource estimates
    const finalEstimates = calculateFinalEstimates(hardwareAdjustments, errorCorrectionOverhead, faultTolerant, distributed);
    
    // Calculate execution metrics
    const executionMetrics = calculateExecutionMetrics(finalEstimates, hardwareType, gateTime, coherenceTime, executionEnvironment);
    
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
      includeClassical
    });
  }

  function calculateBaseRequirements(algorithmType, problemSize, precision, successProbability) {
    let logicalQubits, gateCount, circuitDepth, classicalOps = 0;

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
        const layers = Math.ceil(Math.log2(problemSize)); // QAOA layers
        gateCount = layers * problemSize * 15; // Gates per layer
        circuitDepth = layers * 5; // Layer depth
        classicalOps = layers * problemSize * 100; // Classical optimization
        break;
        
      case 'vqe':
        // Variational Quantum Eigensolver
        logicalQubits = problemSize; // Problem-dependent
        const measurements = Math.pow(problemSize, 1.5) * 100;
        gateCount = measurements * problemSize * 10;
        circuitDepth = problemSize * 2; // Parameterized circuit depth
        classicalOps = measurements * 1000; // Classical optimization
        break;
        
      case 'simulation':
        // Quantum system simulation
        logicalQubits = problemSize; // One per simulated particle/site
        const timeSteps = problemSize * 10;
        gateCount = timeSteps * problemSize * problemSize * 5; // Hamiltonian evolution
        circuitDepth = timeSteps * problemSize; // Time evolution depth
        classicalOps = timeSteps * 100; // Classical control
        break;
        
      case 'ml':
        // Quantum Machine Learning
        logicalQubits = Math.ceil(Math.log2(problemSize)) + 5; // Feature encoding + ancilla
        const epochs = 100;
        gateCount = epochs * problemSize * 50;
        circuitDepth = Math.log2(problemSize) * 10;
        classicalOps = epochs * problemSize * 1000; // Classical ML processing
        break;
        
      case 'simon':
        // Simon's algorithm
        logicalQubits = 2 * Math.ceil(Math.log2(problemSize));
        gateCount = logicalQubits * 50; // Relatively simple circuit
        circuitDepth = logicalQubits * 2;
        classicalOps = logicalQubits * 1000; // Classical linear algebra
        break;
        
      default: // custom
        logicalQubits = Math.ceil(Math.log2(problemSize));
        gateCount = problemSize * 100;
        circuitDepth = Math.log2(problemSize) * 10;
        classicalOps = problemSize * 100;
    }

    // Adjust for precision requirements
    const precisionMultipliers = {
      'low': 1.0,
      'medium': 1.5,
      'high': 2.0,
      'very-high': 3.0
    };
    const precisionMultiplier = precisionMultipliers[precision] || 1.0;
    
    // Adjust for success probability
    const successMultiplier = Math.log(1 / (1 - successProbability / 100)) / Math.log(2);
    
    return {
      logicalQubits: Math.ceil(logicalQubits * precisionMultiplier),
      gateCount: Math.ceil(gateCount * precisionMultiplier * successMultiplier),
      circuitDepth: Math.ceil(circuitDepth * precisionMultiplier),
      classicalOps: Math.ceil(classicalOps * successMultiplier)
    };
  }

  function applyHardwareAdjustments(baseReq, hardwareType, gateFidelity, coherenceTime, gateTime, connectivity, optimization) {
    let adjusted = { ...baseReq };

    // Hardware-specific adjustments
    const hardwareFactors = {
      'superconducting': { gateMultiplier: 1.0, connectivityPenalty: 1.2 },
      'trapped-ion': { gateMultiplier: 1.1, connectivityPenalty: 1.0 }, // Better connectivity
      'photonic': { gateMultiplier: 1.5, connectivityPenalty: 1.0 }, // More gates for photonic ops
      'neutral-atom': { gateMultiplier: 1.2, connectivityPenalty: 1.1 },
      'topological': { gateMultiplier: 0.8, connectivityPenalty: 1.0 } // Future tech
    };
    
    const hwFactor = hardwareFactors[hardwareType] || hardwareFactors['superconducting'];
    
    // Connectivity adjustments
    const connectivityFactors = {
      'all-to-all': 1.0,
      'nearest-neighbor': 1.5,
      'limited': 2.0,
      'custom': 1.3
    };
    
    // Optimization adjustments
    const optimizationFactors = {
      'none': 1.0,
      'basic': 0.8,
      'advanced': 0.6,
      'cutting-edge': 0.4
    };
    
    const connectivityFactor = connectivityFactors[connectivity] || 1.0;
    const optimizationFactor = optimizationFactors[optimization] || 1.0;
    
    // Apply adjustments
    adjusted.gateCount = Math.ceil(adjusted.gateCount * hwFactor.gateMultiplier * connectivityFactor * optimizationFactor);
    adjusted.circuitDepth = Math.ceil(adjusted.circuitDepth * hwFactor.connectivityPenalty * connectivityFactor * optimizationFactor);
    
    // Coherence time constraints
    const totalExecutionTime = adjusted.circuitDepth * gateTime / 1000; // Convert to microseconds
    if (totalExecutionTime > coherenceTime) {
      const coherencePenalty = Math.ceil(totalExecutionTime / coherenceTime);
      adjusted.logicalQubits += coherencePenalty; // Need more qubits for error correction
    }
    
    return adjusted;
  }

  function calculateErrorCorrection(requirements, errorCorrectionScheme, targetErrorRate, gateFidelity) {
    if (errorCorrectionScheme === 'none') {
      return {
        physicalQubits: requirements.logicalQubits,
        overhead: 1,
        scheme: 'No Error Correction (NISQ)',
        codeDistance: 0
      };
    }

    // Calculate required code distance for target error rate
    const physicalErrorRate = 1 - gateFidelity;
    const targetError = parseFloat(targetErrorRate) || 1e-6;
    
    let codeDistance, overhead;
    
    switch (errorCorrectionScheme) {
      case 'surface':
        // Surface code: overhead scales as d²
        codeDistance = Math.ceil(Math.log(targetError / physicalErrorRate) / Math.log(physicalErrorRate));
        if (codeDistance < 3) codeDistance = 3; // Minimum distance
        overhead = codeDistance * codeDistance;
        break;
        
      case 'color':
        // Color code: better threshold but higher overhead
        codeDistance = Math.ceil(Math.log(targetError / physicalErrorRate) / Math.log(physicalErrorRate * 0.5));
        if (codeDistance < 3) codeDistance = 3;
        overhead = 2 * codeDistance * codeDistance; // Higher overhead
        break;
        
      case 'concatenated':
        // Concatenated codes: exponential improvement
        const levels = Math.ceil(Math.log(targetError) / Math.log(physicalErrorRate));
        overhead = Math.pow(7, levels); // 7-qubit CSS code
        codeDistance = levels;
        break;
        
      case 'future':
        // Optimistic future schemes
        codeDistance = Math.ceil(Math.log(targetError / physicalErrorRate) / Math.log(physicalErrorRate * 0.1));
        overhead = codeDistance * 10; // Much better overhead
        break;
        
      default:
        codeDistance = 5;
        overhead = 100;
    }

    return {
      physicalQubits: requirements.logicalQubits * overhead,
      overhead: overhead,
      scheme: errorCorrectionScheme,
      codeDistance: codeDistance
    };
  }

  function calculateFinalEstimates(baseRequirements, errorCorrection, faultTolerant, distributed) {
    let estimates = {
      logicalQubits: baseRequirements.logicalQubits,
      physicalQubits: errorCorrection.physicalQubits,
      totalGates: baseRequirements.gateCount,
      circuitDepth: baseRequirements.circuitDepth,
      classicalOps: baseRequirements.classicalOps,
      errorCorrectionOverhead: errorCorrection.overhead
    };

    // Fault-tolerant computing overhead
    if (faultTolerant) {
      estimates.totalGates *= 10; // Magic state injection and syndrome extraction
      estimates.circuitDepth *= 5; // Fault-tolerant gate synthesis
      estimates.physicalQubits *= 2; // Additional ancilla qubits
    }

    // Distributed computing overhead
    if (distributed) {
      estimates.physicalQubits *= 1.5; // Communication qubits
      estimates.circuitDepth *= 2; // Communication latency
      estimates.classicalOps *= 3; // Distributed coordination
    }

    return estimates;
  }

  function calculateExecutionMetrics(estimates, hardwareType, gateTime, coherenceTime, environment) {
    // Calculate execution time
    const totalExecutionTime = estimates.circuitDepth * gateTime; // nanoseconds
    const executionTimeMs = totalExecutionTime / 1000000; // milliseconds
    const executionTimeSeconds = executionTimeMs / 1000; // seconds

    // Calculate resource utilization
    const coherenceUtilization = (totalExecutionTime / 1000) / coherenceTime; // fraction of coherence time
    
    // Calculate cost estimates (rough estimates)
    let costEstimates = {
      development: estimates.logicalQubits * 10000 + estimates.totalGates * 0.01, // Development cost
      cloudExecution: 0,
      hardwareCost: 0
    };

    if (environment === 'cloud') {
      costEstimates.cloudExecution = estimates.totalGates * 0.001; // $0.001 per gate
    } else if (environment === 'on-premise') {
      costEstimates.hardwareCost = estimates.physicalQubits * 50000; // $50k per physical qubit
    }

    // Calculate quantum advantage metrics
    const classicalComplexity = estimates.classicalOps;
    const quantumComplexity = estimates.totalGates;
    const speedupFactor = classicalComplexity / quantumComplexity;

    return {
      executionTimeMs: executionTimeMs,
      executionTimeSeconds: executionTimeSeconds,
      coherenceUtilization: coherenceUtilization,
      costEstimates: costEstimates,
      speedupFactor: speedupFactor,
      memoryEquivalent: Math.pow(2, estimates.logicalQubits) * 8 / (1024 * 1024 * 1024) // GB of classical memory
    };
  }

  function displayResults(data) {
    const { finalEstimates, executionMetrics, errorCorrectionOverhead } = data;

    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🎯 Logical Qubits</h6>
          <div class="big-number">${finalEstimates.logicalQubits.toLocaleString()}</div>
          <p class="insight-detail">Algorithm requirement</p>
        </div>
        <div class="insight-card warning">
          <h6>⚛️ Physical Qubits</h6>
          <div class="big-number">${finalEstimates.physicalQubits.toLocaleString()}</div>
          <p class="insight-detail">With error correction</p>
        </div>
        <div class="insight-card success">
          <h6>⚡ Quantum Gates</h6>
          <div class="big-number">${(finalEstimates.totalGates / 1000).toFixed(1)}K</div>
          <p class="insight-detail">Total operations</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Resource Requirements</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            
            <div>
              <h4>🎯 Quantum Resources</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Logical Qubits:</strong> ${finalEstimates.logicalQubits.toLocaleString()}</li>
                <li><strong>Physical Qubits:</strong> ${finalEstimates.physicalQubits.toLocaleString()}</li>
                <li><strong>Error Correction:</strong> ${errorCorrectionOverhead.overhead}x overhead</li>
                <li><strong>Circuit Depth:</strong> ${finalEstimates.circuitDepth.toLocaleString()}</li>
              </ul>
            </div>

            <div>
              <h4>⚡ Operation Counts</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Quantum Gates:</strong> ${finalEstimates.totalGates.toLocaleString()}</li>
                <li><strong>Classical Ops:</strong> ${finalEstimates.classicalOps.toLocaleString()}</li>
                <li><strong>Gate Density:</strong> ${(finalEstimates.totalGates / finalEstimates.logicalQubits).toFixed(0)} gates/qubit</li>
                <li><strong>Parallelization:</strong> ${(finalEstimates.totalGates / finalEstimates.circuitDepth).toFixed(1)} gates/layer</li>
              </ul>
            </div>

            <div>
              <h4>⏱️ Timing Analysis</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Execution Time:</strong> ${executionMetrics.executionTimeSeconds < 1 ? 
                    `${executionMetrics.executionTimeMs.toFixed(1)} ms` : 
                    `${executionMetrics.executionTimeSeconds.toFixed(2)} seconds`}</li>
                <li><strong>Coherence Usage:</strong> ${(executionMetrics.coherenceUtilization * 100).toFixed(1)}%</li>
                <li><strong>Speedup Factor:</strong> ${executionMetrics.speedupFactor.toFixed(1)}x</li>
                <li><strong>Memory Equivalent:</strong> ${executionMetrics.memoryEquivalent.toFixed(1)} GB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>🔧 Hardware Specifications</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">🖥️ System Requirements</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Platform:</strong> ${getHardwareName(data.hardwareType)}</li>
              <li><strong>Minimum Qubits:</strong> ${finalEstimates.physicalQubits.toLocaleString()}</li>
              <li><strong>Error Correction:</strong> ${errorCorrectionOverhead.scheme}</li>
              <li><strong>Code Distance:</strong> ${errorCorrectionOverhead.codeDistance}</li>
            </ul>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">📈 Performance Metrics</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Algorithm:</strong> ${getAlgorithmName(data.algorithmType)}</li>
              <li><strong>Problem Size:</strong> ${data.problemSize.toLocaleString()}</li>
              <li><strong>Precision:</strong> ${data.precision}</li>
              <li><strong>Classical Equivalent:</strong> ${executionMetrics.memoryEquivalent.toFixed(1)} GB RAM</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>💰 Cost Analysis</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <strong>Development Cost:</strong><br>
              <span style="font-size: 1.5rem; color: var(--accent);">$${executionMetrics.costEstimates.development.toLocaleString()}</span><br>
              <small>Algorithm development & testing</small>
            </div>
            <div>
              <strong>Cloud Execution:</strong><br>
              <span style="font-size: 1.5rem; color: var(--accent);">$${executionMetrics.costEstimates.cloudExecution.toFixed(2)}</span><br>
              <small>Per execution on quantum cloud</small>
            </div>
            <div>
              <strong>Hardware Cost:</strong><br>
              <span style="font-size: 1.5rem; color: var(--accent);">$${(executionMetrics.costEstimates.hardwareCost / 1000000).toFixed(1)}M</span><br>
              <small>On-premise quantum computer</small>
            </div>
          </div>
        </div>
      </div>

      ${getQuantumAdvantageAnalysis(data)}
      ${getImplementationRecommendations(data)}

      <div style="margin-top: 1.5rem; padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
        <strong>⚠️ Important Note:</strong> These estimates are based on current theoretical understanding and may change as quantum technology advances. 
        For critical applications, consult with quantum computing experts and conduct detailed feasibility studies.
      </div>
    `;

    result.innerHTML = html;
  }

  function getHardwareName(type) {
    const names = {
      'superconducting': 'Superconducting Qubits',
      'trapped-ion': 'Trapped Ion Qubits',
      'photonic': 'Photonic Qubits',
      'neutral-atom': 'Neutral Atom Qubits',
      'topological': 'Topological Qubits'
    };
    return names[type] || 'Unknown Hardware';
  }

  function getAlgorithmName(type) {
    const names = {
      'shors': "Shor's Factorization",
      'grovers': "Grover's Search",
      'qaoa': 'QAOA Optimization',
      'vqe': 'Variational Eigensolver',
      'simulation': 'Quantum Simulation',
      'ml': 'Quantum Machine Learning',
      'simon': "Simon's Algorithm",
      'custom': 'Custom Algorithm'
    };
    return names[type] || 'Unknown Algorithm';
  }

  function getQuantumAdvantageAnalysis(data) {
    const { executionMetrics } = data;
    
    let advantageText = '';
    if (executionMetrics.speedupFactor > 1000) {
      advantageText = 'Exponential quantum advantage expected';
    } else if (executionMetrics.speedupFactor > 10) {
      advantageText = 'Significant quantum speedup possible';
    } else if (executionMetrics.speedupFactor > 2) {
      advantageText = 'Modest quantum advantage';
    } else {
      advantageText = 'Quantum advantage unclear';
    }

    return `
      <div style="margin-top: 2rem;">
        <h3>🚀 Quantum Advantage Analysis</h3>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <div>
              <h4>📊 Speedup Analysis</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Theoretical Speedup:</strong> ${executionMetrics.speedupFactor.toFixed(1)}x</li>
                <li><strong>Assessment:</strong> ${advantageText}</li>
                <li><strong>Classical Memory:</strong> ${executionMetrics.memoryEquivalent.toFixed(1)} GB equivalent</li>
              </ul>
            </div>
            <div>
              <h4>⏰ Time Comparison</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Quantum Time:</strong> ${executionMetrics.executionTimeSeconds.toFixed(2)} seconds</li>
                <li><strong>Classical Time:</strong> ${(executionMetrics.executionTimeSeconds * executionMetrics.speedupFactor / 3600).toFixed(1)} hours (est.)</li>
                <li><strong>Advantage:</strong> ${executionMetrics.speedupFactor > 10 ? 'Significant' : 'Limited'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getImplementationRecommendations(data) {
    const { finalEstimates } = data;
    const recommendations = [];

    if (finalEstimates.physicalQubits < 100) {
      recommendations.push('🔬 <strong>Near-term feasible:</strong> Can be implemented on current/near-term quantum hardware');
    } else if (finalEstimates.physicalQubits < 10000) {
      recommendations.push('⏳ <strong>Medium-term goal:</strong> Requires next-generation quantum computers (5-10 years)');
    } else {
      recommendations.push('🔮 <strong>Long-term vision:</strong> Requires fault-tolerant quantum computers (10+ years)');
    }

    if (data.errorCorrection.scheme === 'none') {
      recommendations.push('⚠️ <strong>NISQ era:</strong> Consider noise mitigation techniques and error-aware algorithms');
    }

    if (finalEstimates.circuitDepth > 1000) {
      recommendations.push('🔄 <strong>Deep circuits:</strong> Consider variational approaches or circuit compression techniques');
    }

    recommendations.push('☁️ <strong>Development approach:</strong> Start with quantum simulators and small-scale cloud systems');
    recommendations.push('🤝 <strong>Collaboration:</strong> Partner with quantum computing providers and research institutions');

    return `
      <div style="margin-top: 2rem;">
        <h3>💡 Implementation Recommendations</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <ul style="margin: 0.5rem 0;">
            ${recommendations.map(rec => `<li style="margin: 0.5rem 0;">${rec}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
});