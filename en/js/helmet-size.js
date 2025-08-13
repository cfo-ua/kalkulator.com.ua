document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("helmet-size-form");
  const result = document.getElementById("helmet-size-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const headCircumference = parseFloat(document.getElementById("head-circumference").value);
    const headLength = parseFloat(document.getElementById("head-length").value);
    const headWidth = parseFloat(document.getElementById("head-width").value);

    if ([headCircumference, headLength, headWidth].some(val => isNaN(val) || val <= 0)) {
      result.innerHTML = "<p>Please enter valid measurements for all fields.</p>";
      return;
    }

    // Basic validation
    if (headCircumference < 50 || headCircumference > 70) {
      result.innerHTML = "<p>Head circumference should be between 50 and 70 cm.</p>";
      return;
    }

    if (headLength < 15 || headLength > 25) {
      result.innerHTML = "<p>Head length should be between 15 and 25 cm.</p>";
      return;
    }

    if (headWidth < 12 || headWidth > 20) {
      result.innerHTML = "<p>Head width should be between 12 and 20 cm.</p>";
      return;
    }

    // Calculate helmet size
    const helmetSize = calculateHelmetSize(headCircumference, headLength, headWidth);

    if (helmetSize) {
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card success">
            <h6>🪖 Your Helmet Size</h6>
            <div class="big-number">${helmetSize.eu} cm</div>
            <p>European Size</p>
          </div>
          
          <div class="insight-card info">
            <h6>🌍 International Size</h6>
            <div class="big-number">${helmetSize.us}</div>
            <p>US/International</p>
          </div>
          
          <div class="insight-card info">
            <h6>🇬🇧 UK Hat Size</h6>
            <div class="big-number">${helmetSize.uk}</div>
            <p>British Standard</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h3>📊 Complete Size Chart</h3>
          
          <table style="width: 100%; margin-bottom: 1.5rem; border-collapse: collapse;">
            <tr>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">EU (cm)</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">US</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">UK</th>
              <th style="padding: 8px; border: 1px solid var(--border); background: var(--card-bg);">Head Circumference</th>
            </tr>
            <tr style="background: #fff8e1;">
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${helmetSize.eu}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${helmetSize.us}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);"><strong>${helmetSize.uk}</strong></td>
              <td style="padding: 8px; border: 1px solid var(--border);">${helmetSize.circumferenceRange}</td>
            </tr>
          </table>
          
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem;">
            <h4>📏 Your Measurements:</h4>
            <ul style="list-style: none; padding: 0;">
              <li>🔸 Head Circumference: <strong>${headCircumference} cm</strong></li>
              <li>🔸 Head Length: <strong>${headLength} cm</strong></li>
              <li>🔸 Head Width: <strong>${headWidth} cm</strong></li>
            </ul>
          </div>
          
          <div style="background: #f0f8ff; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid var(--accent);">
            <h4>🎯 Sizing by Helmet Type:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>🚴 Bike Helmet</h5>
                <p><strong>Size: ${helmetSize.eu} cm</strong></p>
                <p>Snug fit for safety</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>🏍️ Motorcycle Helmet</h5>
                <p><strong>Size: ${getMotorcycleHelmetSize(helmetSize.eu)}</strong></p>
                <p>Account for comfort padding</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>👷 Construction Hard Hat</h5>
                <p><strong>Size: ${getConstructionHelmetSize(helmetSize.eu)}</strong></p>
                <p>Comfort for extended wear</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5>⛷️ Sports Helmet</h5>
                <p><strong>Size: ${helmetSize.eu} cm</strong></p>
                <p>Tight fit for protection</p>
              </div>
            </div>
          </div>
          
          <div style="background: #f8fdff; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid var(--accent);">
            <h4>🛡️ Safety & Fit Guidelines:</h4>
            <ul>
              <li><strong>Proper Fit:</strong> Helmet should be snug but not cause pressure points</li>
              <li><strong>Stability:</strong> No shifting when you move your head around</li>
              <li><strong>Comfort:</strong> Skin should not wrinkle under the straps</li>
              <li><strong>Hair:</strong> Consider your hairstyle and hair thickness</li>
              <li><strong>Try Before Buying:</strong> Always try on helmets when possible</li>
              <li><strong>Certifications:</strong> Check for safety standards (CE, DOT, SNELL, CPSC)</li>
            </ul>
          </div>
          
          <div style="background: #fff5f5; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border-left: 4px solid #dc3545;">
            <h4>⚠️ Important Safety Notes:</h4>
            <ul>
              <li>Replace helmets immediately after any impact, even without visible damage</li>
              <li>Helmet lifespan is typically 3-5 years due to material degradation</li>
              <li>Different brands may have slight sizing variations</li>
              <li>Motorcycle helmets require mandatory try-on for safety</li>
              <li>Children's helmets need separate sizing and safety considerations</li>
              <li>UV exposure and extreme temperatures can affect helmet integrity</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      result.innerHTML = `
        <div class="insight-card warning">
          <h6>⚠️ Custom Sizing Needed</h6>
          <p>Your measurements fall outside standard helmet sizing ranges. We recommend:</p>
          <ul style="text-align: left; margin-top: 1rem;">
            <li>Contacting specialized helmet manufacturers</li>
            <li>Looking into custom-made helmet options</li>
            <li>Double-checking your measurements</li>
            <li>Consulting with a professional fitter</li>
            <li>Visiting a specialty safety equipment store</li>
          </ul>
        </div>
      `;
    }
  });

  function calculateHelmetSize(headCircumference, headLength, headWidth) {
    // Helmet sizing chart based on head circumference (primary measurement)
    const sizeChart = [
      { 
        eu: "52", us: "XS", uk: "6½", 
        circumferenceMin: 50.0, circumferenceMax: 52.5,
        circumferenceRange: "50-52.5 cm"
      },
      { 
        eu: "53", us: "XS", uk: "6⅝", 
        circumferenceMin: 52.5, circumferenceMax: 53.5,
        circumferenceRange: "52.5-53.5 cm"
      },
      { 
        eu: "54", us: "S", uk: "6¾", 
        circumferenceMin: 53.5, circumferenceMax: 54.5,
        circumferenceRange: "53.5-54.5 cm"
      },
      { 
        eu: "55", us: "S", uk: "6⅞", 
        circumferenceMin: 54.5, circumferenceMax: 55.5,
        circumferenceRange: "54.5-55.5 cm"
      },
      { 
        eu: "56", us: "M", uk: "7", 
        circumferenceMin: 55.5, circumferenceMax: 56.5,
        circumferenceRange: "55.5-56.5 cm"
      },
      { 
        eu: "57", us: "M", uk: "7⅛", 
        circumferenceMin: 56.5, circumferenceMax: 57.5,
        circumferenceRange: "56.5-57.5 cm"
      },
      { 
        eu: "58", us: "L", uk: "7¼", 
        circumferenceMin: 57.5, circumferenceMax: 58.5,
        circumferenceRange: "57.5-58.5 cm"
      },
      { 
        eu: "59", us: "L", uk: "7⅜", 
        circumferenceMin: 58.5, circumferenceMax: 59.5,
        circumferenceRange: "58.5-59.5 cm"
      },
      { 
        eu: "60", us: "XL", uk: "7½", 
        circumferenceMin: 59.5, circumferenceMax: 60.5,
        circumferenceRange: "59.5-60.5 cm"
      },
      { 
        eu: "61", us: "XL", uk: "7⅝", 
        circumferenceMin: 60.5, circumferenceMax: 61.5,
        circumferenceRange: "60.5-61.5 cm"
      },
      { 
        eu: "62", us: "XXL", uk: "7¾", 
        circumferenceMin: 61.5, circumferenceMax: 63.0,
        circumferenceRange: "61.5-63 cm"
      },
      { 
        eu: "63", us: "XXL", uk: "7⅞", 
        circumferenceMin: 63.0, circumferenceMax: 65.0,
        circumferenceRange: "63-65 cm"
      }
    ];

    // Find best match based on head circumference (primary measurement for helmets)
    for (const size of sizeChart) {
      if (headCircumference >= size.circumferenceMin && headCircumference <= size.circumferenceMax) {
        return size;
      }
    }

    // If no exact match, find closest by circumference
    let closestSize = null;
    let smallestDiff = Infinity;

    for (const size of sizeChart) {
      const midCircumference = (size.circumferenceMin + size.circumferenceMax) / 2;
      const diff = Math.abs(headCircumference - midCircumference);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestSize = size;
      }
    }

    return closestSize;
  }

  function getMotorcycleHelmetSize(euSize) {
    // Motorcycle helmets often run slightly smaller due to comfort padding
    const numSize = parseFloat(euSize);
    const motorcycleSize = Math.max(52, numSize - 0.5);
    return motorcycleSize.toString() + " cm (may run -0.5 cm)";
  }

  function getConstructionHelmetSize(euSize) {
    // Construction helmets can be slightly larger for comfort during long wear
    const numSize = parseFloat(euSize);
    const constructionSize = numSize + 0.5;
    return constructionSize.toString() + " cm (may run +0.5 cm)";
  }
});