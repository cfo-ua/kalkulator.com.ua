document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('wave-form');
  const result = document.getElementById('wave-result');
  
  // Update velocity based on wave type selection
  const waveTypeInputs = document.querySelectorAll('input[name="wave-type"]');
  const velocityInput = document.getElementById('velocity');
  
  waveTypeInputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.value === 'sound') {
        velocityInput.value = '343';
        velocityInput.placeholder = '343';
      } else if (this.value === 'light') {
        velocityInput.value = '299792458';
        velocityInput.placeholder = '3×10⁸';
      } else {
        velocityInput.value = '';
        velocityInput.placeholder = 'Введіть швидкість';
      }
    });
  });
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get input values
      const f = parseFloat(document.getElementById('frequency').value);
      const lambda = parseFloat(document.getElementById('wavelength').value);
      const v = parseFloat(document.getElementById('velocity').value);
      const T = parseFloat(document.getElementById('period').value);
      const waveType = document.querySelector('input[name="wave-type"]:checked').value;
      
      // Count known variables
      const known = [f, lambda, v, T].filter(val => !isNaN(val));
      
      if (known.length < 2) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Недостатньо даних</h6>
            <p>Введіть принаймні 2 параметри хвилі для розрахунку</p>
          </div>
        `;
        return;
      }
      
      let results = {
        f: isNaN(f) ? null : f,
        lambda: isNaN(lambda) ? null : lambda,
        v: isNaN(v) ? null : v,
        T: isNaN(T) ? null : T,
        waveType: waveType
      };
      
      try {
        // Calculate missing parameters using wave equations
        
        // If we know frequency and wavelength, calculate velocity
        if (!isNaN(f) && !isNaN(lambda) && isNaN(v)) {
          results.v = f * lambda;
        }
        
        // If we know velocity and frequency, calculate wavelength
        if (!isNaN(v) && !isNaN(f) && isNaN(lambda)) {
          results.lambda = v / f;
        }
        
        // If we know velocity and wavelength, calculate frequency
        if (!isNaN(v) && !isNaN(lambda) && isNaN(f) && lambda !== 0) {
          results.f = v / lambda;
        }
        
        // Calculate period from frequency
        if (results.f !== null && results.f !== 0 && isNaN(T)) {
          results.T = 1 / results.f;
        }
        
        // Calculate frequency from period
        if (!isNaN(T) && T !== 0 && results.f === null) {
          results.f = 1 / T;
        }
        
        // If we have period and velocity, calculate wavelength
        if (!isNaN(T) && results.v !== null && results.lambda === null) {
          results.lambda = results.v * T;
        }
        
        // If we have period and wavelength, calculate velocity
        if (!isNaN(T) && results.lambda !== null && results.v === null && T !== 0) {
          results.v = results.lambda / T;
        }
        
        // Additional calculations for missing values
        if (results.v !== null && results.f !== null && results.lambda === null) {
          results.lambda = results.v / results.f;
        }
        
        if (results.v !== null && results.lambda !== null && results.f === null && results.lambda !== 0) {
          results.f = results.v / results.lambda;
        }
        
        if (results.f !== null && results.lambda !== null && results.v === null) {
          results.v = results.f * results.lambda;
        }
        
        // Recalculate period if we now have frequency
        if (results.f !== null && results.f !== 0 && results.T === null) {
          results.T = 1 / results.f;
        }
        
        displayResults(results);
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>❌ Помилка розрахунку</h6>
            <p>Перевірте правильність введених даних</p>
          </div>
        `;
      }
    });
  }
  
  function displayResults(results) {
    let html = '<div class="insight-cards">';
    
    // Main wave parameters
    if (results.f !== null) {
      const fFormatted = formatFrequency(results.f);
      html += `
        <div class="insight-card success">
          <h6>🎵 Частота</h6>
          <div class="big-number">${fFormatted.value}</div>
          <div>${fFormatted.unit}</div>
        </div>
      `;
    }
    
    if (results.lambda !== null) {
      const lambdaFormatted = formatLength(results.lambda);
      html += `
        <div class="insight-card info">
          <h6>📏 Довжина хвилі</h6>
          <div class="big-number">${lambdaFormatted.value}</div>
          <div>${lambdaFormatted.unit}</div>
        </div>
      `;
    }
    
    if (results.v !== null) {
      const vFormatted = formatVelocity(results.v);
      html += `
        <div class="insight-card info">
          <h6>🚀 Швидкість</h6>
          <div class="big-number">${vFormatted.value}</div>
          <div>${vFormatted.unit}</div>
        </div>
      `;
    }
    
    if (results.T !== null) {
      const TFormatted = formatTime(results.T);
      html += `
        <div class="insight-card info">
          <h6>⏱️ Період</h6>
          <div class="big-number">${TFormatted.value}</div>
          <div>${TFormatted.unit}</div>
        </div>
      `;
    }
    
    html += '</div>';
    
    // Wave type classification
    html += getWaveClassification(results);
    
    // Additional information
    html += getAdditionalInfo(results);
    
    // Formulas used
    html += `
      <h4>📐 Використані формули:</h4>
      <ul>
        <li><strong>v = fλ</strong> - основне рівняння хвилі</li>
        <li><strong>f = 1/T</strong> - зв'язок частоти та періоду</li>
        <li><strong>λ = v/f</strong> - довжина хвилі через швидкість і частоту</li>
        <li><strong>T = 1/f</strong> - період через частоту</li>
      </ul>
    `;
    
    document.getElementById('wave-result').innerHTML = html;
  }
  
  function formatFrequency(f) {
    if (f >= 1e9) {
      return { value: (f / 1e9).toFixed(2), unit: 'ГГц' };
    } else if (f >= 1e6) {
      return { value: (f / 1e6).toFixed(2), unit: 'МГц' };
    } else if (f >= 1e3) {
      return { value: (f / 1e3).toFixed(2), unit: 'кГц' };
    } else {
      return { value: f.toFixed(2), unit: 'Гц' };
    }
  }
  
  function formatLength(lambda) {
    if (lambda >= 1000) {
      return { value: (lambda / 1000).toFixed(2), unit: 'км' };
    } else if (lambda >= 1) {
      return { value: lambda.toFixed(3), unit: 'м' };
    } else if (lambda >= 0.01) {
      return { value: (lambda * 100).toFixed(2), unit: 'см' };
    } else if (lambda >= 0.001) {
      return { value: (lambda * 1000).toFixed(2), unit: 'мм' };
    } else if (lambda >= 1e-6) {
      return { value: (lambda * 1e6).toFixed(2), unit: 'мкм' };
    } else {
      return { value: (lambda * 1e9).toFixed(2), unit: 'нм' };
    }
  }
  
  function formatVelocity(v) {
    if (v >= 1e6) {
      return { value: (v / 1e6).toFixed(2), unit: 'км/с × 10³' };
    } else if (v >= 1000) {
      return { value: (v / 1000).toFixed(2), unit: 'км/с' };
    } else {
      return { value: v.toFixed(2), unit: 'м/с' };
    }
  }
  
  function formatTime(T) {
    if (T >= 3600) {
      return { value: (T / 3600).toFixed(2), unit: 'год' };
    } else if (T >= 60) {
      return { value: (T / 60).toFixed(2), unit: 'хв' };
    } else if (T >= 1) {
      return { value: T.toFixed(3), unit: 'с' };
    } else if (T >= 1e-3) {
      return { value: (T * 1e3).toFixed(2), unit: 'мс' };
    } else if (T >= 1e-6) {
      return { value: (T * 1e6).toFixed(2), unit: 'мкс' };
    } else {
      return { value: (T * 1e9).toFixed(2), unit: 'нс' };
    }
  }
  
  function getWaveClassification(results) {
    let html = '<h4>🔍 Класифікація хвилі:</h4><ul>';
    
    if (results.f !== null) {
      if (results.f < 20) {
        html += '<li>🔊 Інфразвук (< 20 Гц) - не чутний для людини</li>';
      } else if (results.f <= 20000) {
        html += '<li>🎵 Чутний звук (20 Гц - 20 кГц) - звуковий діапазон</li>';
      } else if (results.f <= 1e6) {
        html += '<li>🔬 Ультразвук (> 20 кГц) - медицина, дефектоскопія</li>';
      } else if (results.f <= 3e11) {
        html += '<li>📻 Радіохвилі (1 МГц - 300 ГГц) - телекомунікації</li>';
      } else {
        html += '<li>💡 Електромагнітні хвилі високої частоти</li>';
      }
    }
    
    if (results.waveType === 'sound') {
      html += '<li>🌬️ Звукова хвиля у повітрі при стандартних умовах</li>';
    } else if (results.waveType === 'light') {
      html += '<li>💡 Електромагнітна хвиля (світло) у вакуумі</li>';
    }
    
    html += '</ul>';
    return html;
  }
  
  function getAdditionalInfo(results) {
    let html = '<h4>💡 Додаткова інформація:</h4><ul>';
    
    if (results.waveType === 'sound' && results.f !== null) {
      if (results.f >= 261 && results.f <= 262) {
        html += '<li>🎹 Приблизно нота До середньої октави</li>';
      } else if (results.f >= 440 && results.f <= 441) {
        html += '<li>🎹 Стандартна нота Ля (камертон 440 Гц)</li>';
      }
    }
    
    if (results.lambda !== null && results.waveType === 'light') {
      if (results.lambda >= 700e-9 && results.lambda <= 800e-9) {
        html += '<li>🔴 Червоне світло (700-800 нм)</li>';
      } else if (results.lambda >= 500e-9 && results.lambda < 700e-9) {
        html += '<li>🟢 Зелене світло (500-700 нм)</li>';
      } else if (results.lambda >= 400e-9 && results.lambda < 500e-9) {
        html += '<li>🔵 Синє/фіолетове світло (400-500 нм)</li>';
      }
    }
    
    if (results.v !== null && results.waveType === 'sound') {
      const speedOfSound = 343;
      const diff = Math.abs(results.v - speedOfSound);
      if (diff < 10) {
        html += '<li>🌡️ Швидкість близька до стандартної у повітрі (20°C)</li>';
      }
    }
    
    html += '</ul>';
    return html;
  }
});