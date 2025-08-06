document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('confidence-interval-form');
  const result = document.getElementById('confidence-interval-result');
  const intervalType = document.getElementById('interval-type');
  const confidenceLevel = document.getElementById('confidence-level');
  const customConfidenceGroup = document.getElementById('custom-confidence-group');
  
  // Input groups
  const meanInputs = document.querySelector('.mean-inputs');
  const proportionInputs = document.querySelector('.proportion-inputs');
  const differenceInputs = document.querySelector('.difference-inputs');
  const knownStdGroup = document.getElementById('known-std-group');
  const sampleStdGroup = document.getElementById('sample-std-group');
  
  // Show/hide input fields based on interval type
  if (intervalType) {
    intervalType.addEventListener('change', function() {
      // Hide all input groups first
      meanInputs.style.display = 'none';
      proportionInputs.style.display = 'none';
      differenceInputs.style.display = 'none';
      knownStdGroup.style.display = 'none';
      sampleStdGroup.style.display = 'none';
      
      switch (this.value) {
        case 'mean-known':
          meanInputs.style.display = 'block';
          knownStdGroup.style.display = 'block';
          break;
        case 'mean-unknown':
          meanInputs.style.display = 'block';
          sampleStdGroup.style.display = 'block';
          break;
        case 'proportion':
          proportionInputs.style.display = 'block';
          break;
        case 'difference-means':
          differenceInputs.style.display = 'block';
          break;
      }
    });
    
    // Trigger initial change
    intervalType.dispatchEvent(new Event('change'));
  }
  
  // Show/hide custom confidence level
  if (confidenceLevel) {
    confidenceLevel.addEventListener('change', function() {
      if (this.value === 'custom') {
        customConfidenceGroup.style.display = 'block';
      } else {
        customConfidenceGroup.style.display = 'none';
      }
    });
  }
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const intervalTypeValue = intervalType.value;
      let confidenceLevelValue;
      
      if (confidenceLevel.value === 'custom') {
        confidenceLevelValue = parseFloat(document.getElementById('custom-confidence').value);
      } else {
        confidenceLevelValue = parseFloat(confidenceLevel.value);
      }
      
      // Validation
      if (isNaN(confidenceLevelValue) || confidenceLevelValue <= 0 || confidenceLevelValue >= 100) {
        result.innerHTML = '<div class="error">❌ Рівень довіри повинен бути між 0 та 100%.</div>';
        return;
      }
      
      let calculationResult;
      
      try {
        switch (intervalTypeValue) {
          case 'mean-known':
            calculationResult = calculateMeanKnownStd(confidenceLevelValue);
            break;
          case 'mean-unknown':
            calculationResult = calculateMeanUnknownStd(confidenceLevelValue);
            break;
          case 'proportion':
            calculationResult = calculateProportion(confidenceLevelValue);
            break;
          case 'difference-means':
            calculationResult = calculateDifferenceMeans(confidenceLevelValue);
            break;
        }
        
        if (calculationResult.error) {
          result.innerHTML = `<div class="error">❌ ${calculationResult.error}</div>`;
          return;
        }
        
        displayResults(calculationResult, confidenceLevelValue, intervalTypeValue);
        
      } catch (error) {
        result.innerHTML = '<div class="error">❌ Помилка в обчисленнях. Перевірте введені дані.</div>';
      }
    });
  }
  
  function calculateMeanKnownStd(confidenceLevel) {
    const sampleMean = parseFloat(document.getElementById('sample-mean').value);
    const sampleSize = parseInt(document.getElementById('sample-size').value);
    const populationStd = parseFloat(document.getElementById('population-std').value);
    
    if (isNaN(sampleMean) || isNaN(sampleSize) || isNaN(populationStd)) {
      return { error: 'Будь ласка, введіть всі необхідні значення.' };
    }
    
    if (sampleSize <= 0) {
      return { error: 'Розмір вибірки повинен бути більше нуля.' };
    }
    
    if (populationStd <= 0) {
      return { error: 'Стандартне відхилення повинно бути більше нуля.' };
    }
    
    const alpha = (100 - confidenceLevel) / 100;
    const zScore = getZScore(alpha / 2);
    const standardError = populationStd / Math.sqrt(sampleSize);
    const marginOfError = zScore * standardError;
    
    return {
      estimate: sampleMean,
      marginOfError: marginOfError,
      lowerBound: sampleMean - marginOfError,
      upperBound: sampleMean + marginOfError,
      standardError: standardError,
      criticalValue: zScore,
      distributionType: 'Normal (Z)',
      parameter: 'Середнє значення (μ)'
    };
  }
  
  function calculateMeanUnknownStd(confidenceLevel) {
    const sampleMean = parseFloat(document.getElementById('sample-mean').value);
    const sampleSize = parseInt(document.getElementById('sample-size').value);
    const sampleStd = parseFloat(document.getElementById('sample-std').value);
    
    if (isNaN(sampleMean) || isNaN(sampleSize) || isNaN(sampleStd)) {
      return { error: 'Будь ласка, введіть всі необхідні значення.' };
    }
    
    if (sampleSize <= 1) {
      return { error: 'Розмір вибірки повинен бути більше одиниці.' };
    }
    
    if (sampleStd <= 0) {
      return { error: 'Стандартне відхилення повинно бути більше нуля.' };
    }
    
    const alpha = (100 - confidenceLevel) / 100;
    const degreesOfFreedom = sampleSize - 1;
    const tScore = getTScore(alpha / 2, degreesOfFreedom);
    const standardError = sampleStd / Math.sqrt(sampleSize);
    const marginOfError = tScore * standardError;
    
    return {
      estimate: sampleMean,
      marginOfError: marginOfError,
      lowerBound: sampleMean - marginOfError,
      upperBound: sampleMean + marginOfError,
      standardError: standardError,
      criticalValue: tScore,
      distributionType: `t (df = ${degreesOfFreedom})`,
      parameter: 'Середнє значення (μ)',
      degreesOfFreedom: degreesOfFreedom
    };
  }
  
  function calculateProportion(confidenceLevel) {
    const successes = parseInt(document.getElementById('successes').value);
    const totalSize = parseInt(document.getElementById('total-size').value);
    
    if (isNaN(successes) || isNaN(totalSize)) {
      return { error: 'Будь ласка, введіть всі необхідні значення.' };
    }
    
    if (successes < 0 || successes > totalSize) {
      return { error: 'Кількість успіхів не може бути від\'ємною або більшою за загальний розмір.' };
    }
    
    if (totalSize <= 0) {
      return { error: 'Розмір вибірки повинен бути більше нуля.' };
    }
    
    const proportion = successes / totalSize;
    const alpha = (100 - confidenceLevel) / 100;
    const zScore = getZScore(alpha / 2);
    
    // Check normal approximation conditions
    const npq = totalSize * proportion * (1 - proportion);
    if (npq < 5) {
      return { error: 'Умови нормального наближення не виконані (np(1-p) < 5). Потрібні інші методи.' };
    }
    
    const standardError = Math.sqrt(proportion * (1 - proportion) / totalSize);
    const marginOfError = zScore * standardError;
    
    let lowerBound = proportion - marginOfError;
    let upperBound = proportion + marginOfError;
    
    // Apply logical bounds for proportions
    lowerBound = Math.max(0, lowerBound);
    upperBound = Math.min(1, upperBound);
    
    return {
      estimate: proportion,
      marginOfError: marginOfError,
      lowerBound: lowerBound,
      upperBound: upperBound,
      standardError: standardError,
      criticalValue: zScore,
      distributionType: 'Normal (Z)',
      parameter: 'Пропорція (p)',
      successes: successes,
      totalSize: totalSize
    };
  }
  
  function calculateDifferenceMeans(confidenceLevel) {
    const mean1 = parseFloat(document.getElementById('mean1').value);
    const std1 = parseFloat(document.getElementById('std1').value);
    const size1 = parseInt(document.getElementById('size1').value);
    const mean2 = parseFloat(document.getElementById('mean2').value);
    const std2 = parseFloat(document.getElementById('std2').value);
    const size2 = parseInt(document.getElementById('size2').value);
    
    if (isNaN(mean1) || isNaN(std1) || isNaN(size1) || isNaN(mean2) || isNaN(std2) || isNaN(size2)) {
      return { error: 'Будь ласка, введіть всі необхідні значення.' };
    }
    
    if (size1 <= 0 || size2 <= 0) {
      return { error: 'Розміри вибірок повинні бути більше нуля.' };
    }
    
    if (std1 <= 0 || std2 <= 0) {
      return { error: 'Стандартні відхилення повинні бути більше нуля.' };
    }
    
    const difference = mean1 - mean2;
    const alpha = (100 - confidenceLevel) / 100;
    
    // Welch's t-test approximation
    const se1 = std1 * std1 / size1;
    const se2 = std2 * std2 / size2;
    const standardError = Math.sqrt(se1 + se2);
    
    // Welch-Satterthwaite degrees of freedom
    const degreesOfFreedom = Math.floor((se1 + se2) ** 2 / (se1 ** 2 / (size1 - 1) + se2 ** 2 / (size2 - 1)));
    
    const tScore = getTScore(alpha / 2, degreesOfFreedom);
    const marginOfError = tScore * standardError;
    
    return {
      estimate: difference,
      marginOfError: marginOfError,
      lowerBound: difference - marginOfError,
      upperBound: difference + marginOfError,
      standardError: standardError,
      criticalValue: tScore,
      distributionType: `t (df ≈ ${degreesOfFreedom})`,
      parameter: 'Різниця середніх (μ₁ - μ₂)',
      degreesOfFreedom: degreesOfFreedom,
      mean1: mean1,
      mean2: mean2
    };
  }
  
  function displayResults(calc, confidenceLevel, intervalType) {
    let intervalInterpretation = '';
    let parameterSymbol = '';
    
    switch (intervalType) {
      case 'mean-known':
      case 'mean-unknown':
        intervalInterpretation = `З ${confidenceLevel}% впевненістю, істинне середнє значення популяції знаходиться між ${calc.lowerBound.toFixed(4)} та ${calc.upperBound.toFixed(4)}.`;
        parameterSymbol = 'μ';
        break;
      case 'proportion':
        intervalInterpretation = `З ${confidenceLevel}% впевненістю, істинна пропорція популяції знаходиться між ${(calc.lowerBound * 100).toFixed(2)}% та ${(calc.upperBound * 100).toFixed(2)}%.`;
        parameterSymbol = 'p';
        break;
      case 'difference-means':
        intervalInterpretation = `З ${confidenceLevel}% впевненістю, істинна різниця між середніми значеннями знаходиться між ${calc.lowerBound.toFixed(4)} та ${calc.upperBound.toFixed(4)}.`;
        parameterSymbol = 'μ₁ - μ₂';
        break;
    }
    
    let estimateDisplay = calc.estimate;
    let boundsDisplay = `[${calc.lowerBound.toFixed(4)}, ${calc.upperBound.toFixed(4)}]`;
    
    if (intervalType === 'proportion') {
      estimateDisplay = `${(calc.estimate * 100).toFixed(2)}%`;
      boundsDisplay = `[${(calc.lowerBound * 100).toFixed(2)}%, ${(calc.upperBound * 100).toFixed(2)}%]`;
    }
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🎯 Оцінка</h6>
          <div class="big-number">${estimateDisplay}</div>
          <p>${calc.parameter}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📊 Довірчий інтервал</h6>
          <div class="big-number">${boundsDisplay}</div>
          <p>${confidenceLevel}% рівень довіри</p>
        </div>
        
        <div class="insight-card warning">
          <h6>📏 Похибка</h6>
          <div class="big-number">±${calc.marginOfError.toFixed(4)}</div>
          <p>Межа помилки</p>
        </div>
      </div>
      
      <hr>
      
      <div class="calculation-details">
        <h4>📋 Деталі обчислення:</h4>
        <div class="details-grid">
          <div><strong>📈 Розподіл:</strong> ${calc.distributionType}</div>
          <div><strong>🔢 Критичне значення:</strong> ${calc.criticalValue.toFixed(4)}</div>
          <div><strong>📐 Стандартна помилка:</strong> ${calc.standardError.toFixed(6)}</div>
          <div><strong>🎯 Рівень довіри:</strong> ${confidenceLevel}%</div>
        </div>
      </div>
      
      <div class="interpretation">
        <h4>💡 Інтерпретація:</h4>
        <p>${intervalInterpretation}</p>
        ${getAdditionalInterpretation(calc, intervalType)}
      </div>
      
      ${getMethodology(intervalType, calc)}
      
      <div class="assumptions">
        <h4>⚠️ Припущення та обмеження:</h4>
        ${getAssumptions(intervalType)}
      </div>
    `;
  }
  
  function getAdditionalInterpretation(calc, intervalType) {
    let additional = '';
    
    if (intervalType === 'difference-means') {
      if (calc.lowerBound > 0) {
        additional = `<p><strong>Висновок:</strong> 🔼 Середнє значення групи 1 статистично значуще вище, ніж групи 2.</p>`;
      } else if (calc.upperBound < 0) {
        additional = `<p><strong>Висновок:</strong> 🔽 Середнє значення групи 1 статистично значуще нижче, ніж групи 2.</p>`;
      } else {
        additional = `<p><strong>Висновок:</strong> ⚖️ Немає статистично значущої різниці між групами (інтервал включає нуль).</p>`;
      }
    }
    
    return additional;
  }
  
  function getMethodology(intervalType, calc) {
    let methodology = '<div class="methodology"><h4>🔬 Методологія:</h4><ul>';
    
    switch (intervalType) {
      case 'mean-known':
        methodology += `
          <li>Використано z-розподіл (стандартне відхилення популяції відоме)</li>
          <li>Формула: x̄ ± z<sub>α/2</sub> × (σ/√n)</li>
          <li>Стандартна помилка: ${calc.standardError.toFixed(6)}</li>
        `;
        break;
      case 'mean-unknown':
        methodology += `
          <li>Використано t-розподіл зі ${calc.degreesOfFreedom} ступенями свободи</li>
          <li>Формула: x̄ ± t<sub>α/2,df</sub> × (s/√n)</li>
          <li>Стандартна помилка: ${calc.standardError.toFixed(6)}</li>
        `;
        break;
      case 'proportion':
        methodology += `
          <li>Використано нормальне наближення до біноміального розподілу</li>
          <li>Формула: p̂ ± z<sub>α/2</sub> × √(p̂(1-p̂)/n)</li>
          <li>Оцінка пропорції: ${calc.successes}/${calc.totalSize} = ${calc.estimate.toFixed(4)}</li>
        `;
        break;
      case 'difference-means':
        methodology += `
          <li>Використано t-тест Велча для незалежних вибірок</li>
          <li>Формула: (x̄₁ - x̄₂) ± t<sub>α/2,df</sub> × SE<sub>diff</sub></li>
          <li>Ступені свободи розраховані за формулою Велча-Саттертвейта</li>
        `;
        break;
    }
    
    methodology += '</ul></div>';
    return methodology;
  }
  
  function getAssumptions(intervalType) {
    let assumptions = '<ul>';
    
    switch (intervalType) {
      case 'mean-known':
        assumptions += `
          <li>Вибірка взята випадково з популяції</li>
          <li>Популяція має нормальний розподіл або n ≥ 30</li>
          <li>Стандартне відхилення популяції відоме</li>
          <li>Спостереження незалежні</li>
        `;
        break;
      case 'mean-unknown':
        assumptions += `
          <li>Вибірка взята випадково з популяції</li>
          <li>Популяція має нормальний розподіл (особливо важливо для малих n)</li>
          <li>Спостереження незалежні</li>
          <li>Для великих вибірок (n ≥ 30) припущення менш критичні</li>
        `;
        break;
      case 'proportion':
        assumptions += `
          <li>Вибірка взята випадково</li>
          <li>np ≥ 5 та n(1-p) ≥ 5 (умова нормального наближення)</li>
          <li>Спостереження незалежні</li>
          <li>Розмір популяції принаймні в 10 разів більший за вибірку</li>
        `;
        break;
      case 'difference-means':
        assumptions += `
          <li>Обидві вибірки взяті випадково</li>
          <li>Групи незалежні</li>
          <li>Дані в кожній групі мають нормальний розподіл</li>
          <li>Не потрібна рівність дисперсій (тест Велча)</li>
        `;
        break;
    }
    
    assumptions += '</ul>';
    return assumptions;
  }
  
  // Helper functions for critical values
  function getZScore(alpha) {
    // Common z-scores for confidence intervals
    const zTable = {
      0.005: 2.576,  // 99%
      0.01: 2.326,   // 98%
      0.025: 1.96,   // 95%
      0.05: 1.645,   // 90%
      0.1: 1.282     // 80%
    };
    
    if (zTable[alpha]) {
      return zTable[alpha];
    }
    
    // Approximation for other values using inverse normal
    return approximateInverseNormal(1 - alpha);
  }
  
  function getTScore(alpha, df) {
    // Simplified t-distribution critical values
    // For large df, approaches z-distribution
    if (df >= 120) {
      return getZScore(alpha);
    }
    
    // Approximate t-values using a simple formula
    const z = getZScore(alpha);
    const correction = (z * z * z + z) / (4 * df);
    return z + correction;
  }
  
  function approximateInverseNormal(p) {
    // Beasley-Springer-Moro algorithm approximation
    if (p <= 0 || p >= 1) {
      throw new Error('Invalid probability');
    }
    
    if (p < 0.5) {
      return -approximateInverseNormal(1 - p);
    }
    
    const t = Math.sqrt(-2 * Math.log(1 - p));
    const c0 = 2.515517;
    const c1 = 0.802853;
    const c2 = 0.010328;
    const d1 = 1.432788;
    const d2 = 0.189269;
    const d3 = 0.001308;
    
    return t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
  }
});