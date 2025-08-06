document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('p-value-form');
  const result = document.getElementById('p-value-result');
  const testType = document.getElementById('test-type');
  const degreesGroup = document.getElementById('degrees-freedom-group');
  const degrees2Group = document.getElementById('degrees-freedom2-group');
  
  // Show/hide degrees of freedom fields based on test type
  if (testType) {
    testType.addEventListener('change', function() {
      if (this.value === 'z-test') {
        degreesGroup.style.display = 'none';
        degrees2Group.style.display = 'none';
      } else if (this.value === 'f-test') {
        degreesGroup.style.display = 'block';
        degrees2Group.style.display = 'block';
      } else {
        degreesGroup.style.display = 'block';
        degrees2Group.style.display = 'none';
      }
    });
  }
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const testTypeValue = document.getElementById('test-type').value;
      const testStatistic = parseFloat(document.getElementById('test-statistic').value);
      const degreesOfFreedom = parseInt(document.getElementById('degrees-freedom').value);
      const degreesOfFreedom2 = parseInt(document.getElementById('degrees-freedom2').value);
      const tailType = document.getElementById('tail-type').value;
      
      // Validation
      if (isNaN(testStatistic)) {
        result.innerHTML = '<div class="error">❌ Please enter a valid test statistic value.</div>';
        return;
      }
      
      if (testTypeValue !== 'z-test' && (isNaN(degreesOfFreedom) || degreesOfFreedom < 1)) {
        result.innerHTML = '<div class="error">❌ Degrees of freedom must be a positive integer.</div>';
        return;
      }
      
      if (testTypeValue === 'f-test' && (isNaN(degreesOfFreedom2) || degreesOfFreedom2 < 1)) {
        result.innerHTML = '<div class="error">❌ Second degrees of freedom parameter must be a positive integer for F-test.</div>';
        return;
      }
      
      if (testTypeValue === 'chi-square' && testStatistic < 0) {
        result.innerHTML = '<div class="error">❌ Chi-square statistic cannot be negative.</div>';
        return;
      }
      
      if (testTypeValue === 'f-test' && testStatistic < 0) {
        result.innerHTML = '<div class="error">❌ F-statistic cannot be negative.</div>';
        return;
      }
      
      let pValue;
      let distributionName;
      
      try {
        switch (testTypeValue) {
          case 't-test':
            pValue = calculateTTestPValue(testStatistic, degreesOfFreedom, tailType);
            distributionName = `t-distribution with ${degreesOfFreedom} degrees of freedom`;
            break;
          case 'z-test':
            pValue = calculateZTestPValue(testStatistic, tailType);
            distributionName = 'standard normal distribution';
            break;
          case 'chi-square':
            pValue = calculateChiSquarePValue(testStatistic, degreesOfFreedom);
            distributionName = `χ²-distribution with ${degreesOfFreedom} degrees of freedom`;
            break;
          case 'f-test':
            pValue = calculateFTestPValue(testStatistic, degreesOfFreedom, degreesOfFreedom2, tailType);
            distributionName = `F-distribution with ${degreesOfFreedom} and ${degreesOfFreedom2} degrees of freedom`;
            break;
        }
        
        displayResults(pValue, testStatistic, distributionName, tailType, testTypeValue);
        
      } catch (error) {
        result.innerHTML = '<div class="error">❌ Calculation error. Please check your input data.</div>';
      }
    });
  }
  
  function calculateTTestPValue(t, df, tailType) {
    // Simplified t-distribution p-value calculation
    const absT = Math.abs(t);
    
    // Use approximation for t-distribution p-value
    let p;
    if (df >= 30) {
      // For large df, use normal approximation
      p = 1 - cumulativeStandardNormal(absT);
    } else {
      // Simple approximation for small df
      const x = absT / Math.sqrt(df);
      p = 0.5 * (1 - Math.min(0.999, x / (1 + x)));
    }
    
    if (tailType === 'two-tailed') {
      return 2 * p;
    } else if (tailType === 'one-tailed-upper') {
      return t > 0 ? p : 1 - p;
    } else {
      return t < 0 ? p : 1 - p;
    }
  }
  
  function calculateZTestPValue(z, tailType) {
    const absZ = Math.abs(z);
    const p = 1 - cumulativeStandardNormal(absZ);
    
    if (tailType === 'two-tailed') {
      return 2 * p;
    } else if (tailType === 'one-tailed-upper') {
      return z > 0 ? p : 1 - p;
    } else {
      return z < 0 ? p : 1 - p;
    }
  }
  
  function calculateChiSquarePValue(chiSquare, df) {
    // Simplified chi-square p-value approximation
    if (chiSquare <= 0) return 1;
    
    // Wilson-Hilferty approximation
    const h = 2 / (9 * df);
    const z = (Math.pow(chiSquare / df, 1/3) - 1 + h) / Math.sqrt(h);
    
    return 1 - cumulativeStandardNormal(z);
  }
  
  function calculateFTestPValue(f, df1, df2, tailType) {
    if (f <= 0) return 1;
    
    // Simple F-distribution approximation using t-distribution
    const t = Math.sqrt(f);
    const effectiveDf = df1 + df2 - 2;
    
    let p;
    if (effectiveDf >= 30) {
      p = 1 - cumulativeStandardNormal(t);
    } else {
      const x = t / Math.sqrt(effectiveDf);
      p = 0.5 * (1 - Math.min(0.999, x / (1 + x)));
    }
    
    if (tailType === 'two-tailed') {
      return 2 * Math.min(p, 1 - p);
    } else if (tailType === 'one-tailed-upper') {
      return p;
    } else {
      return 1 - p;
    }
  }
  
  function displayResults(pValue, testStatistic, distributionName, tailType, testType) {
    let significance = '';
    let significanceClass = '';
    let significanceEmoji = '';
    
    if (pValue < 0.001) {
      significance = 'Very strong statistical significance';
      significanceClass = 'success';
      significanceEmoji = '🔥';
    } else if (pValue < 0.01) {
      significance = 'Strong statistical significance';
      significanceClass = 'success';
      significanceEmoji = '✅';
    } else if (pValue < 0.05) {
      significance = 'Moderate statistical significance';
      significanceClass = 'warning';
      significanceEmoji = '⚠️';
    } else {
      significance = 'Not statistically significant';
      significanceClass = 'info';
      significanceEmoji = '❌';
    }
    
    const tailTypeText = {
      'two-tailed': 'Two-tailed',
      'one-tailed-upper': 'One-tailed (upper tail)',
      'one-tailed-lower': 'One-tailed (lower tail)'
    };
    
    const testTypeText = {
      't-test': 'T-test',
      'z-test': 'Z-test',
      'chi-square': 'Chi-square test',
      'f-test': 'F-test'
    };
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${significanceClass}">
          <h6>${significanceEmoji} P-value</h6>
          <div class="big-number">${formatPValue(pValue)}</div>
          <p>${significance}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📊 Test Statistic</h6>
          <div class="big-number">${testStatistic.toFixed(4)}</div>
          <p>${testTypeText[testType]}</p>
        </div>
        
        <div class="insight-card warning">
          <h6>🎯 Significance Level</h6>
          <div class="big-number">${pValue < 0.05 ? 'α < 0.05' : 'α ≥ 0.05'}</div>
          <p>Traditional threshold</p>
        </div>
      </div>
      
      <hr>
      
      <div class="calculation-details">
        <h4>📋 Calculation Details:</h4>
        <div class="details-grid">
          <div><strong>📈 Distribution:</strong> ${distributionName}</div>
          <div><strong>🔄 Test Type:</strong> ${tailTypeText[tailType]}</div>
          <div><strong>📊 Test Statistic:</strong> ${testStatistic.toFixed(6)}</div>
          <div><strong>🎯 P-value:</strong> ${formatPValue(pValue, true)}</div>
        </div>
      </div>
      
      <div class="interpretation">
        <h4>💡 Result Interpretation:</h4>
        ${getInterpretation(pValue, testType)}
      </div>
      
      <div class="recommendations">
        <h4>📝 Recommendations:</h4>
        <ul>
          <li><strong>Statistical Decision:</strong> ${pValue < 0.05 ? 'Reject the null hypothesis' : 'Fail to reject the null hypothesis'}</li>
          <li><strong>Practical Meaning:</strong> ${pValue < 0.05 ? 'Result is statistically significant' : 'Insufficient evidence for statistical significance'}</li>
          <li><strong>Next Steps:</strong> ${pValue < 0.05 ? 'Consider practical significance of the result' : 'Increase sample size or review methodology'}</li>
        </ul>
      </div>
    `;
  }
  
  function formatPValue(p, detailed = false) {
    if (detailed) {
      if (p < 0.0001) {
        return p.toExponential(3);
      }
      return p.toFixed(6);
    }
    
    if (p < 0.001) {
      return 'p < 0.001';
    } else if (p < 0.01) {
      return p.toFixed(4);
    } else {
      return p.toFixed(3);
    }
  }
  
  function getInterpretation(pValue, testType) {
    let interpretation = '<p>';
    
    if (pValue < 0.001) {
      interpretation += '🔥 <strong>Very strong evidence against the null hypothesis.</strong> The result has high statistical significance.';
    } else if (pValue < 0.01) {
      interpretation += '✅ <strong>Strong evidence against the null hypothesis.</strong> The result is statistically significant.';
    } else if (pValue < 0.05) {
      interpretation += '⚠️ <strong>Moderate evidence against the null hypothesis.</strong> The result is on the border of statistical significance.';
    } else if (pValue < 0.1) {
      interpretation += '🤔 <strong>Weak evidence against the null hypothesis.</strong> The result does not reach traditional significance level.';
    } else {
      interpretation += '❌ <strong>Insufficient evidence against the null hypothesis.</strong> The result is not statistically significant.';
    }
    
    interpretation += '</p>';
    return interpretation;
  }
  
  // Simplified mathematical helper functions
  function cumulativeStandardNormal(z) {
    // Abramowitz and Stegun approximation for standard normal CDF
    if (z < 0) return 1 - cumulativeStandardNormal(-z);
    
    const t = 1 / (1 + 0.2316419 * z);
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    
    return 1 - prob;
  }
});