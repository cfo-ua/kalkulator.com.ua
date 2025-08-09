document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ring-size-form");
  const result = document.getElementById("ring-size-result");
  const inputTypeRadios = document.querySelectorAll('input[name="input-type"]');
  
  // Show/hide input sections based on selected type
  inputTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      document.querySelectorAll('.input-section').forEach(section => {
        section.style.display = 'none';
      });
      document.getElementById(this.value + '-input').style.display = 'block';
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputType = document.querySelector('input[name="input-type"]:checked').value;
    let diameter = null;

    if (inputType === 'circumference') {
      const circumference = parseFloat(document.getElementById("circumference").value);
      if (isNaN(circumference) || circumference <= 0) {
        result.innerHTML = "<p>Please enter a valid finger circumference.</p>";
        return;
      }
      diameter = circumference / Math.PI;
    } else if (inputType === 'diameter') {
      diameter = parseFloat(document.getElementById("diameter").value);
      if (isNaN(diameter) || diameter <= 0) {
        result.innerHTML = "<p>Please enter a valid finger diameter.</p>";
        return;
      }
    } else if (inputType === 'size') {
      const system = document.getElementById("size-system").value;
      const knownSize = document.getElementById("known-size").value.trim();
      if (!knownSize) {
        result.innerHTML = "<p>Please enter a known ring size.</p>";
        return;
      }
      diameter = convertKnownSizeToDiameter(system, knownSize);
      if (!diameter) {
        result.innerHTML = "<p>Could not recognize the entered size. Please check your input.</p>";
        return;
      }
    }

    // Calculate all ring sizes
    const ringSize = calculateRingSize(diameter);

    if (ringSize) {
      const circumference = diameter * Math.PI;
      
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>💍 Ring Diameter</h6>
            <div class="big-number">${diameter.toFixed(1)} mm</div>
            <p>Inner diameter</p>
          </div>
          
          <div class="insight-card info">
            <h6>📏 Finger Circumference</h6>
            <div class="big-number">${circumference.toFixed(1)} mm</div>
            <p>Around your finger</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h3>🌍 International Ring Sizes</h3>
          
          <table style="width: 100%; margin-bottom: 1.5rem; border-collapse: collapse;">
            <tr>
              <th style="padding: 12px; border: 1px solid var(--border); background: var(--card-bg);">System</th>
              <th style="padding: 12px; border: 1px solid var(--border); background: var(--card-bg);">Size</th>
              <th style="padding: 12px; border: 1px solid var(--border); background: var(--card-bg);">Description</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid var(--border);"><strong>🇺🇸 US American</strong></td>
              <td style="padding: 12px; border: 1px solid var(--border); font-size: 1.2em; color: var(--accent);"><strong>${ringSize.us}</strong></td>
              <td style="padding: 12px; border: 1px solid var(--border);">Numerical sizing</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid var(--border);"><strong>🇪🇺 European (EU)</strong></td>
              <td style="padding: 12px; border: 1px solid var(--border); font-size: 1.2em; color: var(--accent);"><strong>${ringSize.eu}</strong></td>
              <td style="padding: 12px; border: 1px solid var(--border);">Diameter in millimeters</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid var(--border);"><strong>🇬🇧 UK British</strong></td>
              <td style="padding: 12px; border: 1px solid var(--border); font-size: 1.2em; color: var(--accent);"><strong>${ringSize.uk}</strong></td>
              <td style="padding: 12px; border: 1px solid var(--border);">Letter designation</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid var(--border);"><strong>🇯🇵 Japanese (JP)</strong></td>
              <td style="padding: 12px; border: 1px solid var(--border); font-size: 1.2em; color: var(--accent);"><strong>${ringSize.jp}</strong></td>
              <td style="padding: 12px; border: 1px solid var(--border);">Double digit numbers</td>
            </tr>
          </table>
          
          <div style="background: #f0f8ff; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid var(--accent);">
            <h4>💡 Ring Sizing Recommendations:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>📏 Thin Rings (up to 4mm)</h5>
                <p><strong>Size: ${ringSize.us} (US)</strong></p>
                <p>Exact fit for your finger</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>📏 Wide Rings (4mm+)</h5>
                <p><strong>Size: ${getWideRingSize(ringSize.us)} (US)</strong></p>
                <p>Size up 0.5-1 for comfort</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>💒 Wedding Bands</h5>
                <p><strong>Size: ${getWeddingRingSize(ringSize.us)} (US)</strong></p>
                <p>Slightly larger for daily wear</p>
              </div>
            </div>
          </div>
          
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem;">
            <h4>📐 Your Measurements:</h4>
            <ul style="list-style: none; padding: 0;">
              <li>🔸 Finger Diameter: <strong>${diameter.toFixed(1)} mm</strong></li>
              <li>🔸 Finger Circumference: <strong>${circumference.toFixed(1)} mm</strong></li>
              <li>🔸 US Ring Size: <strong>${ringSize.us}</strong></li>
              <li>🔸 European Size: <strong>${ringSize.eu}</strong></li>
            </ul>
          </div>
          
          <div style="background: #fff8e1; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid #ffc107;">
            <h4>⚠️ Important Reminders:</h4>
            <ul>
              <li><strong>Measurement Time:</strong> Best measured in the evening at room temperature</li>
              <li><strong>Ring Width:</strong> Wide rings need larger sizes for comfortable wear</li>
              <li><strong>Knuckle Test:</strong> Ring must pass over knuckle but fit snugly at base</li>
              <li><strong>Professional Help:</strong> Consult a jeweler for expensive or custom rings</li>
              <li><strong>Resizing Options:</strong> Most rings can be adjusted by a professional jeweler</li>
              <li><strong>Lifestyle Factors:</strong> Consider daily activities and potential finger size changes</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      result.innerHTML = `
        <div class="insight-card warning">
          <h6>⚠️ Non-Standard Size</h6>
          <p>The entered measurements fall outside standard ring size ranges. We recommend:</p>
          <ul style="text-align: left; margin-top: 1rem;">
            <li>Double-checking your measurements</li>
            <li>Consulting with a jeweler for custom sizing</li>
            <li>Considering adjustable ring designs</li>
            <li>Professional finger measurement services</li>
          </ul>
        </div>
      `;
    }
  });

  function calculateRingSize(diameter) {
    // Ring size chart - diameter in mm to various sizing systems
    const sizeChart = [
      { diameter: 13.3, ua: "13.3", eu: "13.3", us: "3", uk: "F", jp: "4" },
      { diameter: 13.7, ua: "13.7", eu: "13.7", us: "3.5", uk: "G", jp: "5" },
      { diameter: 14.1, ua: "14.1", eu: "14.1", us: "4", uk: "H", jp: "6" },
      { diameter: 14.5, ua: "14.5", eu: "14.5", us: "4.5", uk: "I", jp: "7" },
      { diameter: 14.9, ua: "14.9", eu: "14.9", us: "5", uk: "J", jp: "8" },
      { diameter: 15.3, ua: "15.3", eu: "15.3", us: "5.5", uk: "K", jp: "9" },
      { diameter: 15.7, ua: "15.7", eu: "15.7", us: "6", uk: "L", jp: "10" },
      { diameter: 16.1, ua: "16.1", eu: "16.1", us: "6.5", uk: "M", jp: "11" },
      { diameter: 16.5, ua: "16.5", eu: "16.5", us: "7", uk: "N", jp: "12" },
      { diameter: 16.9, ua: "16.9", eu: "16.9", us: "7.5", uk: "O", jp: "13" },
      { diameter: 17.3, ua: "17.3", eu: "17.3", us: "8", uk: "P", jp: "14" },
      { diameter: 17.7, ua: "17.7", eu: "17.7", us: "8.5", uk: "Q", jp: "15" },
      { diameter: 18.1, ua: "18.1", eu: "18.1", us: "9", uk: "R", jp: "16" },
      { diameter: 18.5, ua: "18.5", eu: "18.5", us: "9.5", uk: "S", jp: "17" },
      { diameter: 18.9, ua: "18.9", eu: "18.9", us: "10", uk: "T", jp: "18" },
      { diameter: 19.3, ua: "19.3", eu: "19.3", us: "10.5", uk: "U", jp: "19" },
      { diameter: 19.7, ua: "19.7", eu: "19.7", us: "11", uk: "V", jp: "20" },
      { diameter: 20.1, ua: "20.1", eu: "20.1", us: "11.5", uk: "W", jp: "21" },
      { diameter: 20.5, ua: "20.5", eu: "20.5", us: "12", uk: "X", jp: "22" },
      { diameter: 20.9, ua: "20.9", eu: "20.9", us: "12.5", uk: "Y", jp: "23" },
      { diameter: 21.3, ua: "21.3", eu: "21.3", us: "13", uk: "Z", jp: "24" }
    ];

    // Find closest match
    let closestSize = null;
    let smallestDiff = Infinity;

    for (const size of sizeChart) {
      const diff = Math.abs(diameter - size.diameter);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestSize = size;
      }
    }

    // Return null if too far from any standard size
    if (smallestDiff > 1.0) {
      return null;
    }

    return closestSize;
  }

  function convertKnownSizeToDiameter(system, sizeStr) {
    const sizeChart = [
      { diameter: 13.3, ua: "13.3", eu: "13.3", us: "3", uk: "F", jp: "4" },
      { diameter: 13.7, ua: "13.7", eu: "13.7", us: "3.5", uk: "G", jp: "5" },
      { diameter: 14.1, ua: "14.1", eu: "14.1", us: "4", uk: "H", jp: "6" },
      { diameter: 14.5, ua: "14.5", eu: "14.5", us: "4.5", uk: "I", jp: "7" },
      { diameter: 14.9, ua: "14.9", eu: "14.9", us: "5", uk: "J", jp: "8" },
      { diameter: 15.3, ua: "15.3", eu: "15.3", us: "5.5", uk: "K", jp: "9" },
      { diameter: 15.7, ua: "15.7", eu: "15.7", us: "6", uk: "L", jp: "10" },
      { diameter: 16.1, ua: "16.1", eu: "16.1", us: "6.5", uk: "M", jp: "11" },
      { diameter: 16.5, ua: "16.5", eu: "16.5", us: "7", uk: "N", jp: "12" },
      { diameter: 16.9, ua: "16.9", eu: "16.9", us: "7.5", uk: "O", jp: "13" },
      { diameter: 17.3, ua: "17.3", eu: "17.3", us: "8", uk: "P", jp: "14" },
      { diameter: 17.7, ua: "17.7", eu: "17.7", us: "8.5", uk: "Q", jp: "15" },
      { diameter: 18.1, ua: "18.1", eu: "18.1", us: "9", uk: "R", jp: "16" },
      { diameter: 18.5, ua: "18.5", eu: "18.5", us: "9.5", uk: "S", jp: "17" },
      { diameter: 18.9, ua: "18.9", eu: "18.9", us: "10", uk: "T", jp: "18" },
      { diameter: 19.3, ua: "19.3", eu: "19.3", us: "10.5", uk: "U", jp: "19" },
      { diameter: 19.7, ua: "19.7", eu: "19.7", us: "11", uk: "V", jp: "20" },
      { diameter: 20.1, ua: "20.1", eu: "20.1", us: "11.5", uk: "W", jp: "21" },
      { diameter: 20.5, ua: "20.5", eu: "20.5", us: "12", uk: "X", jp: "22" },
      { diameter: 20.9, ua: "20.9", eu: "20.9", us: "12.5", uk: "Y", jp: "23" },
      { diameter: 21.3, ua: "21.3", eu: "21.3", us: "13", uk: "Z", jp: "24" }
    ];

    // Normalize the input for matching
    const normalizedSize = sizeStr.toUpperCase().trim();

    for (const size of sizeChart) {
      if (size[system] === sizeStr || size[system] === normalizedSize) {
        return size.diameter;
      }
    }

    return null;
  }

  function getWideRingSize(baseSize) {
    const numSize = parseFloat(baseSize);
    const wideSize = numSize + 0.5;
    return wideSize.toFixed(1);
  }

  function getWeddingRingSize(baseSize) {
    const numSize = parseFloat(baseSize);
    const weddingSize = numSize + 0.25;
    return weddingSize.toFixed(1);
  }
});