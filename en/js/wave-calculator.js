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
        velocityInput.placeholder = 'Enter velocity';
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
            <h6>⚠️ Insufficient Data</h6>
            <p>Enter at least 2 wave parameters for calculation</p>
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
            <h6>❌ Calculation Error</h6>
            <p>Please check the entered data for validity</p>
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
          <h6>🎵 Frequency</h6>
          <div class="big-number">${fFormatted.value}</div>
          <div>${fFormatted.unit}</div>
        </div>
      `;
    }
    
    if (results.lambda !== null) {
      const lambdaFormatted = formatLength(results.lambda);
      html += `
        <div class="insight-card info">
          <h6>📏 Wavelength</h6>
          <div class="big-number">${lambdaFormatted.value}</div>
          <div>${lambdaFormatted.unit}</div>
        </div>
      `;
    }
    
    if (results.v !== null) {
      const vFormatted = formatVelocity(results.v);
      html += `
        <div class="insight-card info">
          <h6>🚀 Velocity</h6>
          <div class="big-number">${vFormatted.value}</div>
          <div>${vFormatted.unit}</div>
        </div>
      `;
    }
    
    if (results.T !== null) {
      const TFormatted = formatTime(results.T);
      html += `
        <div class="insight-card info">
          <h6>⏱️ Period</h6>
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
      <h4>📐 Formulas Used:</h4>
      <ul>
        <li><strong>v = fλ</strong> - fundamental wave equation</li>
        <li><strong>f = 1/T</strong> - frequency-period relationship</li>
        <li><strong>λ = v/f</strong> - wavelength from velocity and frequency</li>
        <li><strong>T = 1/f</strong> - period from frequency</li>
      </ul>
    `;
    
    document.getElementById('wave-result').innerHTML = html;
  }
  
  function formatFrequency(f) {
    if (f >= 1e9) {
      return { value: (f / 1e9).toFixed(2), unit: 'GHz' };
    } else if (f >= 1e6) {
      return { value: (f / 1e6).toFixed(2), unit: 'MHz' };
    } else if (f >= 1e3) {
      return { value: (f / 1e3).toFixed(2), unit: 'kHz' };
    } else {
      return { value: f.toFixed(2), unit: 'Hz' };
    }
  }
  
  function formatLength(lambda) {
    if (lambda >= 1000) {
      return { value: (lambda / 1000).toFixed(2), unit: 'km' };
    } else if (lambda >= 1) {
      return { value: lambda.toFixed(3), unit: 'm' };
    } else if (lambda >= 0.01) {
      return { value: (lambda * 100).toFixed(2), unit: 'cm' };
    } else if (lambda >= 0.001) {
      return { value: (lambda * 1000).toFixed(2), unit: 'mm' };
    } else if (lambda >= 1e-6) {
      return { value: (lambda * 1e6).toFixed(2), unit: 'μm' };
    } else {
      return { value: (lambda * 1e9).toFixed(2), unit: 'nm' };
    }
  }
  
  function formatVelocity(v) {
    if (v >= 1e6) {
      return { value: (v / 1e6).toFixed(2), unit: 'km/s × 10³' };
    } else if (v >= 1000) {
      return { value: (v / 1000).toFixed(2), unit: 'km/s' };
    } else {
      return { value: v.toFixed(2), unit: 'm/s' };
    }
  }
  
  function formatTime(T) {
    if (T >= 3600) {
      return { value: (T / 3600).toFixed(2), unit: 'h' };
    } else if (T >= 60) {
      return { value: (T / 60).toFixed(2), unit: 'min' };
    } else if (T >= 1) {
      return { value: T.toFixed(3), unit: 's' };
    } else if (T >= 1e-3) {
      return { value: (T * 1e3).toFixed(2), unit: 'ms' };
    } else if (T >= 1e-6) {
      return { value: (T * 1e6).toFixed(2), unit: 'μs' };
    } else {
      return { value: (T * 1e9).toFixed(2), unit: 'ns' };
    }
  }
  
  function getWaveClassification(results) {
    let html = '<h4>🔍 Wave Classification:</h4><ul>';
    
    if (results.f !== null) {
      if (results.f < 20) {
        html += '<li>🔊 Infrasound (< 20 Hz) - below human hearing</li>';
      } else if (results.f <= 20000) {
        html += '<li>🎵 Audible sound (20 Hz - 20 kHz) - human hearing range</li>';
      } else if (results.f <= 1e6) {
        html += '<li>🔬 Ultrasound (> 20 kHz) - medical, NDT applications</li>';
      } else if (results.f <= 3e11) {
        html += '<li>📻 Radio waves (1 MHz - 300 GHz) - telecommunications</li>';
      } else {
        html += '<li>💡 High-frequency electromagnetic waves</li>';
      }
    }
    
    if (results.waveType === 'sound') {
      html += '<li>🌬️ Sound wave in air at standard conditions</li>';
    } else if (results.waveType === 'light') {
      html += '<li>💡 Electromagnetic wave (light) in vacuum</li>';
    }
    
    html += '</ul>';
    return html;
  }
  
  function getAdditionalInfo(results) {
    let html = '<h4>💡 Additional Information:</h4><ul>';
    
    if (results.waveType === 'sound' && results.f !== null) {
      if (results.f >= 261 && results.f <= 262) {
        html += '<li>🎹 Approximately middle C note</li>';
      } else if (results.f >= 440 && results.f <= 441) {
        html += '<li>🎹 Standard A note (440 Hz tuning fork)</li>';
      }
    }
    
    if (results.lambda !== null && results.waveType === 'light') {
      if (results.lambda >= 700e-9 && results.lambda <= 800e-9) {
        html += '<li>🔴 Red light (700-800 nm)</li>';
      } else if (results.lambda >= 500e-9 && results.lambda < 700e-9) {
        html += '<li>🟢 Green light (500-700 nm)</li>';
      } else if (results.lambda >= 400e-9 && results.lambda < 500e-9) {
        html += '<li>🔵 Blue/violet light (400-500 nm)</li>';
      }
    }
    
    if (results.v !== null && results.waveType === 'sound') {
      const speedOfSound = 343;
      const diff = Math.abs(results.v - speedOfSound);
      if (diff < 10) {
        html += '<li>🌡️ Velocity close to standard in air (20°C)</li>';
      }
    }
    
    html += '</ul>';
    return html;
  }
});