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
        result.innerHTML = '<div class="error">❌ Будь ласка, введіть коректне значення тестової статистики.</div>';
        return;
      }
      
      if (testTypeValue !== 'z-test' && (isNaN(degreesOfFreedom) || degreesOfFreedom < 1)) {
        result.innerHTML = '<div class="error">❌ Ступені свободи повинні бути додатним цілим числом.</div>';
        return;
      }
      
      if (testTypeValue === 'f-test' && (isNaN(degreesOfFreedom2) || degreesOfFreedom2 < 1)) {
        result.innerHTML = '<div class="error">❌ Другий параметр ступенів свободи повинен бути додатним цілим числом для F-тесту.</div>';
        return;
      }
      
      if (testTypeValue === 'chi-square' && testStatistic < 0) {
        result.innerHTML = '<div class="error">❌ Хі-квадрат статистика не може бути від\'ємною.</div>';
        return;
      }
      
      if (testTypeValue === 'f-test' && testStatistic < 0) {
        result.innerHTML = '<div class="error">❌ F-статистика не може бути від\'ємною.</div>';
        return;
      }
      
      let pValue;
      let distributionName;
      
      try {
        switch (testTypeValue) {
          case 't-test':
            pValue = calculateTTestPValue(testStatistic, degreesOfFreedom, tailType);
            distributionName = `t-розподіл з ${degreesOfFreedom} ступенями свободи`;
            break;
          case 'z-test':
            pValue = calculateZTestPValue(testStatistic, tailType);
            distributionName = 'стандартний нормальний розподіл';
            break;
          case 'chi-square':
            pValue = calculateChiSquarePValue(testStatistic, degreesOfFreedom);
            distributionName = `χ²-розподіл з ${degreesOfFreedom} ступенями свободи`;
            break;
          case 'f-test':
            pValue = calculateFTestPValue(testStatistic, degreesOfFreedom, degreesOfFreedom2, tailType);
            distributionName = `F-розподіл з ${degreesOfFreedom} та ${degreesOfFreedom2} ступенями свободи`;
            break;
        }
        
        displayResults(pValue, testStatistic, distributionName, tailType, testTypeValue);
        
      } catch (error) {
        result.innerHTML = '<div class="error">❌ Помилка в обчисленнях. Перевірте введені дані.</div>';
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
      significance = 'Дуже сильна статистична значущість';
      significanceClass = 'success';
      significanceEmoji = '🔥';
    } else if (pValue < 0.01) {
      significance = 'Сильна статистична значущість';
      significanceClass = 'success';
      significanceEmoji = '✅';
    } else if (pValue < 0.05) {
      significance = 'Помірна статистична значущість';
      significanceClass = 'warning';
      significanceEmoji = '⚠️';
    } else {
      significance = 'Статистично незначущий результат';
      significanceClass = 'info';
      significanceEmoji = '❌';
    }
    
    const tailTypeText = {
      'two-tailed': 'Двосторонній',
      'one-tailed-upper': 'Односторонній (верхня сторона)',
      'one-tailed-lower': 'Односторонній (нижня сторона)'
    };
    
    const testTypeText = {
      't-test': 'T-тест',
      'z-test': 'Z-тест',
      'chi-square': 'Хі-квадрат тест',
      'f-test': 'F-тест'
    };
    
    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${significanceClass}">
          <h6>${significanceEmoji} P-значення</h6>
          <div class="big-number">${formatPValue(pValue)}</div>
          <p>${significance}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📊 Тестова статистика</h6>
          <div class="big-number">${testStatistic.toFixed(4)}</div>
          <p>${testTypeText[testType]}</p>
        </div>
        
        <div class="insight-card warning">
          <h6>🎯 Рівень значущості</h6>
          <div class="big-number">${pValue < 0.05 ? 'α < 0.05' : 'α ≥ 0.05'}</div>
          <p>Традиційний поріг</p>
        </div>
      </div>
      
      <hr>
      
      <div class="calculation-details">
        <h4>📋 Деталі обчислення:</h4>
        <div class="details-grid">
          <div><strong>📈 Розподіл:</strong> ${distributionName}</div>
          <div><strong>🔄 Тип тесту:</strong> ${tailTypeText[tailType]}</div>
          <div><strong>📊 Тестова статистика:</strong> ${testStatistic.toFixed(6)}</div>
          <div><strong>🎯 P-значення:</strong> ${formatPValue(pValue, true)}</div>
        </div>
      </div>
      
      <div class="interpretation">
        <h4>💡 Інтерпретація результату:</h4>
        ${getInterpretation(pValue, testType)}
      </div>
      
      <div class="recommendations">
        <h4>📝 Рекомендації:</h4>
        <ul>
          <li><strong>Статистичне рішення:</strong> ${pValue < 0.05 ? 'Відхилити нульову гіпотезу' : 'Не відхиляти нульову гіпотезу'}</li>
          <li><strong>Практичне значення:</strong> ${pValue < 0.05 ? 'Результат статистично значущий' : 'Недостатньо доказів для статистичної значущості'}</li>
          <li><strong>Подальші дії:</strong> ${pValue < 0.05 ? 'Розглянути практичну значущість результату' : 'Збільшити розмір вибірки або переглянути методологію'}</li>
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
      interpretation += '🔥 <strong>Дуже сильні докази проти нульової гіпотези.</strong> Результат має високу статистичну значущість.';
    } else if (pValue < 0.01) {
      interpretation += '✅ <strong>Сильні докази проти нульової гіпотези.</strong> Результат статистично значущий.';
    } else if (pValue < 0.05) {
      interpretation += '⚠️ <strong>Помірні докази проти нульової гіпотези.</strong> Результат на межі статистичної значущості.';
    } else if (pValue < 0.1) {
      interpretation += '🤔 <strong>Слабкі докази проти нульової гіпотези.</strong> Результат не досягає традиційного рівня значущості.';
    } else {
      interpretation += '❌ <strong>Недостатньо доказів проти нульової гіпотези.</strong> Результат статистично незначущий.';
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