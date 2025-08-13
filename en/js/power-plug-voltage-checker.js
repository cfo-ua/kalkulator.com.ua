document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("power-plug-form");
  const resultDiv = document.getElementById("power-plug-result");
  const addDeviceBtn = document.getElementById("add-device");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    checkPlugCompatibility();
  });

  addDeviceBtn.addEventListener("click", function () {
    addDeviceRow();
  });

  // Auto-calculate when inputs change for better UX
  const inputs = form.querySelectorAll('select');
  inputs.forEach(input => {
    input.addEventListener("change", function () {
      if (validateInputs()) {
        checkPlugCompatibility();
      }
    });
  });

  function validateInputs() {
    const homeCountry = document.getElementById("home-country").value;
    const destinationCountry = document.getElementById("destination-country").value;
    return homeCountry && destinationCountry;
  }

  function addDeviceRow() {
    const deviceList = document.getElementById("device-list");
    const newDevice = document.createElement("div");
    newDevice.className = "device-item";
    newDevice.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>📱 Device Type:</label>
          <select class="device-type">
            <option value="phone-charger">📱 Phone Charger</option>
            <option value="laptop">💻 Laptop</option>
            <option value="camera">📷 Camera</option>
            <option value="hair-dryer">🔥 Hair Dryer</option>
            <option value="hair-straightener">💇 Hair Straightener</option>
            <option value="electric-shaver">🪒 Electric Shaver</option>
            <option value="tablet">📱 Tablet</option>
            <option value="power-bank">🔋 Power Bank</option>
            <option value="gaming-console">🎮 Gaming Console</option>
            <option value="other">❓ Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>⚡ Device Voltage:</label>
          <select class="device-voltage">
            <option value="universal">🌍 Universal (100-240V)</option>
            <option value="110v">🇺🇸 110-120V</option>
            <option value="220v">🇪🇺 220-240V</option>
            <option value="unknown">❓ Don't Know</option>
          </select>
        </div>
        
        <button type="button" class="remove-device" onclick="removeDevice(this)">❌</button>
      </div>
    `;
    deviceList.appendChild(newDevice);

    // Add event listeners to new device selects
    newDevice.querySelectorAll('select').forEach(select => {
      select.addEventListener("change", function () {
        if (validateInputs()) {
          checkPlugCompatibility();
        }
      });
    });
  }

  window.removeDevice = function(button) {
    const deviceItem = button.closest('.device-item');
    const deviceList = document.getElementById("device-list");
    if (deviceList.children.length > 1) {
      deviceItem.remove();
      if (validateInputs()) {
        checkPlugCompatibility();
      }
    }
  };

  function checkPlugCompatibility() {
    const homeCountry = document.getElementById("home-country").value;
    const destinationCountry = document.getElementById("destination-country").value;

    if (!validateInputs()) {
      resultDiv.innerHTML = '<p style="color: red;">Please select home and destination countries.</p>';
      return;
    }

    const homeSpecs = getCountrySpecs(homeCountry);
    const destSpecs = getCountrySpecs(destinationCountry);
    const devices = getDevices();

    const compatibility = analyzeCompatibility(homeSpecs, destSpecs, devices);
    displayResults(compatibility, homeSpecs, destSpecs, devices);
  }

  function getCountrySpecs(country) {
    const specs = {
      "ukraine": { name: "Ukraine", flag: "🇺🇦", plugTypes: ["C", "F"], voltage: "220V", frequency: "50Hz" },
      "usa": { name: "United States", flag: "🇺🇸", plugTypes: ["A", "B"], voltage: "120V", frequency: "60Hz" },
      "canada": { name: "Canada", flag: "🇨🇦", plugTypes: ["A", "B"], voltage: "120V", frequency: "60Hz" },
      "mexico": { name: "Mexico", flag: "🇲🇽", plugTypes: ["A", "B"], voltage: "127V", frequency: "60Hz" },
      "germany": { name: "Germany", flag: "🇩🇪", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "france": { name: "France", flag: "🇫🇷", plugTypes: ["C", "E"], voltage: "230V", frequency: "50Hz" },
      "italy": { name: "Italy", flag: "🇮🇹", plugTypes: ["C", "F", "L"], voltage: "230V", frequency: "50Hz" },
      "spain": { name: "Spain", flag: "🇪🇸", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "netherlands": { name: "Netherlands", flag: "🇳🇱", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "poland": { name: "Poland", flag: "🇵🇱", plugTypes: ["C", "E"], voltage: "230V", frequency: "50Hz" },
      "uk": { name: "United Kingdom", flag: "🇬🇧", plugTypes: ["G"], voltage: "230V", frequency: "50Hz" },
      "ireland": { name: "Ireland", flag: "🇮🇪", plugTypes: ["G"], voltage: "230V", frequency: "50Hz" },
      "switzerland": { name: "Switzerland", flag: "🇨🇭", plugTypes: ["C", "J"], voltage: "230V", frequency: "50Hz" },
      "austria": { name: "Austria", flag: "🇦🇹", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "czech": { name: "Czech Republic", flag: "🇨🇿", plugTypes: ["C", "E"], voltage: "230V", frequency: "50Hz" },
      "norway": { name: "Norway", flag: "🇳🇴", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "sweden": { name: "Sweden", flag: "🇸🇪", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "denmark": { name: "Denmark", flag: "🇩🇰", plugTypes: ["C", "E", "F", "K"], voltage: "230V", frequency: "50Hz" },
      "finland": { name: "Finland", flag: "🇫🇮", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "russia": { name: "Russia", flag: "🇷🇺", plugTypes: ["C", "F"], voltage: "220V", frequency: "50Hz" },
      "turkey": { name: "Turkey", flag: "🇹🇷", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "greece": { name: "Greece", flag: "🇬🇷", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "portugal": { name: "Portugal", flag: "🇵🇹", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "australia": { name: "Australia", flag: "🇦🇺", plugTypes: ["I"], voltage: "230V", frequency: "50Hz" },
      "new-zealand": { name: "New Zealand", flag: "🇳🇿", plugTypes: ["I"], voltage: "230V", frequency: "50Hz" },
      "japan": { name: "Japan", flag: "🇯🇵", plugTypes: ["A", "B"], voltage: "100V", frequency: "50Hz/60Hz" },
      "south-korea": { name: "South Korea", flag: "🇰🇷", plugTypes: ["C", "F"], voltage: "220V", frequency: "60Hz" },
      "china": { name: "China", flag: "🇨🇳", plugTypes: ["A", "C", "I"], voltage: "220V", frequency: "50Hz" },
      "hong-kong": { name: "Hong Kong", flag: "🇭🇰", plugTypes: ["D", "G"], voltage: "220V", frequency: "50Hz" },
      "singapore": { name: "Singapore", flag: "🇸🇬", plugTypes: ["C", "G", "M"], voltage: "230V", frequency: "50Hz" },
      "malaysia": { name: "Malaysia", flag: "🇲🇾", plugTypes: ["C", "G", "M"], voltage: "240V", frequency: "50Hz" },
      "thailand": { name: "Thailand", flag: "🇹🇭", plugTypes: ["A", "B", "C", "F"], voltage: "220V", frequency: "50Hz" },
      "vietnam": { name: "Vietnam", flag: "🇻🇳", plugTypes: ["A", "C", "D"], voltage: "220V", frequency: "50Hz" },
      "philippines": { name: "Philippines", flag: "🇵🇭", plugTypes: ["A", "B", "C"], voltage: "220V", frequency: "60Hz" },
      "indonesia": { name: "Indonesia", flag: "🇮🇩", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "india": { name: "India", flag: "🇮🇳", plugTypes: ["C", "D", "M"], voltage: "230V", frequency: "50Hz" },
      "uae": { name: "UAE", flag: "🇦🇪", plugTypes: ["C", "D", "G"], voltage: "230V", frequency: "50Hz" },
      "israel": { name: "Israel", flag: "🇮🇱", plugTypes: ["C", "H", "M"], voltage: "230V", frequency: "50Hz" },
      "saudi-arabia": { name: "Saudi Arabia", flag: "🇸🇦", plugTypes: ["A", "B", "C", "G"], voltage: "230V", frequency: "60Hz" },
      "south-africa": { name: "South Africa", flag: "🇿🇦", plugTypes: ["C", "D", "M", "N"], voltage: "230V", frequency: "50Hz" },
      "egypt": { name: "Egypt", flag: "🇪🇬", plugTypes: ["C", "F"], voltage: "220V", frequency: "50Hz" },
      "morocco": { name: "Morocco", flag: "🇲🇦", plugTypes: ["C", "E"], voltage: "220V", frequency: "50Hz" },
      "brazil": { name: "Brazil", flag: "🇧🇷", plugTypes: ["C", "N"], voltage: "220V", frequency: "60Hz" },
      "argentina": { name: "Argentina", flag: "🇦🇷", plugTypes: ["C", "I"], voltage: "220V", frequency: "50Hz" },
      "chile": { name: "Chile", flag: "🇨🇱", plugTypes: ["C", "L"], voltage: "220V", frequency: "50Hz" },
      "peru": { name: "Peru", flag: "🇵🇪", plugTypes: ["A", "B", "C"], voltage: "220V", frequency: "60Hz" },
      "colombia": { name: "Colombia", flag: "🇨🇴", plugTypes: ["A", "B"], voltage: "110V", frequency: "60Hz" }
    };

    return specs[country] || { name: "Unknown Country", flag: "❓", plugTypes: ["C"], voltage: "230V", frequency: "50Hz" };
  }

  function getDevices() {
    const deviceItems = document.querySelectorAll('.device-item');
    const devices = [];

    deviceItems.forEach(item => {
      const type = item.querySelector('.device-type').value;
      const voltage = item.querySelector('.device-voltage').value;
      
      devices.push({
        type: type,
        voltage: voltage,
        name: getDeviceName(type),
        icon: getDeviceIcon(type),
        typical: getTypicalSpecs(type)
      });
    });

    return devices;
  }

  function getDeviceName(type) {
    const names = {
      "phone-charger": "Phone Charger",
      "laptop": "Laptop",
      "camera": "Camera",
      "hair-dryer": "Hair Dryer",
      "hair-straightener": "Hair Straightener",
      "electric-shaver": "Electric Shaver",
      "tablet": "Tablet",
      "power-bank": "Power Bank",
      "gaming-console": "Gaming Console",
      "other": "Other Device"
    };
    return names[type] || "Unknown Device";
  }

  function getDeviceIcon(type) {
    const icons = {
      "phone-charger": "📱",
      "laptop": "💻",
      "camera": "📷",
      "hair-dryer": "🔥",
      "hair-straightener": "💇",
      "electric-shaver": "🪒",
      "tablet": "📱",
      "power-bank": "🔋",
      "gaming-console": "🎮",
      "other": "❓"
    };
    return icons[type] || "❓";
  }

  function getTypicalSpecs(type) {
    const specs = {
      "phone-charger": { voltage: "universal", power: "5-20W", safety: "safe" },
      "laptop": { voltage: "universal", power: "45-150W", safety: "safe" },
      "camera": { voltage: "universal", power: "5-15W", safety: "safe" },
      "hair-dryer": { voltage: "single", power: "800-2000W", safety: "caution" },
      "hair-straightener": { voltage: "mixed", power: "25-60W", safety: "caution" },
      "electric-shaver": { voltage: "mixed", power: "5-15W", safety: "safe" },
      "tablet": { voltage: "universal", power: "10-30W", safety: "safe" },
      "power-bank": { voltage: "universal", power: "10-100W", safety: "safe" },
      "gaming-console": { voltage: "mixed", power: "100-220W", safety: "caution" },
      "other": { voltage: "unknown", power: "varies", safety: "check" }
    };
    return specs[type] || { voltage: "unknown", power: "varies", safety: "check" };
  }

  function analyzeCompatibility(homeSpecs, destSpecs, devices) {
    const plugCompatible = homeSpecs.plugTypes.some(homePlug => 
      destSpecs.plugTypes.includes(homePlug)
    );

    const voltageCompatible = isVoltageCompatible(homeSpecs.voltage, destSpecs.voltage);

    const deviceResults = devices.map(device => {
      return analyzeDevice(device, homeSpecs, destSpecs);
    });

    return {
      plugCompatible,
      voltageCompatible,
      needsAdapter: !plugCompatible,
      needsTransformer: !voltageCompatible,
      deviceResults,
      overallSafety: calculateOverallSafety(deviceResults)
    };
  }

  function isVoltageCompatible(homeVoltage, destVoltage) {
    const homeV = parseInt(homeVoltage);
    const destV = parseInt(destVoltage);
    
    // Allow 10% tolerance
    return Math.abs(homeV - destV) <= Math.max(homeV, destV) * 0.1;
  }

  function analyzeDevice(device, homeSpecs, destSpecs) {
    let needsTransformer = false;
    let compatible = true;
    let warning = "";
    let recommendation = "";

    if (device.voltage === "universal") {
      needsTransformer = false;
      compatible = true;
      recommendation = "Only need plug adapter";
    } else if (device.voltage === "110v") {
      const destV = parseInt(destSpecs.voltage);
      if (destV > 130) {
        needsTransformer = true;
        compatible = false;
        warning = "Need 220V→110V transformer";
        recommendation = "Buy transformer or use local equivalent";
      }
    } else if (device.voltage === "220v") {
      const destV = parseInt(destSpecs.voltage);
      if (destV < 200) {
        needsTransformer = true;
        compatible = false;
        warning = "Need 110V→220V transformer";
        recommendation = "Buy transformer or use local equivalent";
      }
    } else if (device.voltage === "unknown") {
      compatible = false;
      warning = "Check device label";
      recommendation = "Look for voltage specification on device label";
    }

    // High power device warnings
    if (device.typical.safety === "caution" && needsTransformer) {
      warning += " ⚠️ High-power device!";
      recommendation += " Consider buying local equivalent.";
    }

    return {
      device,
      needsTransformer,
      compatible,
      warning,
      recommendation
    };
  }

  function calculateOverallSafety(deviceResults) {
    const hasWarnings = deviceResults.some(result => result.warning);
    const hasIncompatible = deviceResults.some(result => !result.compatible);
    
    if (hasIncompatible) return "warning";
    if (hasWarnings) return "caution";
    return "safe";
  }

  function displayResults(compatibility, homeSpecs, destSpecs, devices) {
    const safetyClass = compatibility.overallSafety === "safe" ? "success" : 
                      compatibility.overallSafety === "caution" ? "warning" : "warning";
    
    const safetyIcon = compatibility.overallSafety === "safe" ? "✅" : 
                      compatibility.overallSafety === "caution" ? "⚠️" : "❌";

    const safetyText = compatibility.overallSafety === "safe" ? "All devices compatible!" : 
                      compatibility.overallSafety === "caution" ? "Attention needed!" : "Action required!";

    resultDiv.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${safetyClass}">
          <h3>${safetyIcon} ${safetyText}</h3>
          <p><strong>Route:</strong> ${homeSpecs.flag} ${homeSpecs.name} → ${destSpecs.flag} ${destSpecs.name}</p>
          <p><strong>Plug:</strong> ${compatibility.needsAdapter ? "Need adapter" : "Compatible"}</p>
          <p><strong>Voltage:</strong> ${compatibility.needsTransformer ? "May need transformer" : "Compatible"}</p>
        </div>
      </div>

      <div class="power-specs">
        <h4>⚡ Technical Specifications:</h4>
        
        <div class="spec-comparison">
          <div class="spec-column">
            <h5>${homeSpecs.flag} ${homeSpecs.name}</h5>
            <p><strong>Plugs:</strong> ${homeSpecs.plugTypes.join(", ")}</p>
            <p><strong>Voltage:</strong> ${homeSpecs.voltage}</p>
            <p><strong>Frequency:</strong> ${homeSpecs.frequency}</p>
          </div>
          
          <div class="spec-column">
            <h5>${destSpecs.flag} ${destSpecs.name}</h5>
            <p><strong>Plugs:</strong> ${destSpecs.plugTypes.join(", ")}</p>
            <p><strong>Voltage:</strong> ${destSpecs.voltage}</p>
            <p><strong>Frequency:</strong> ${destSpecs.frequency}</p>
          </div>
        </div>
      </div>

      <div class="device-analysis">
        <h4>🔌 Device Analysis:</h4>
        
        ${compatibility.deviceResults.map(result => `
          <div class="device-result ${result.compatible ? 'compatible' : 'incompatible'}">
            <div class="device-header">
              <span class="device-info">${result.device.icon} ${result.device.name}</span>
              <span class="device-status">${result.compatible ? '✅' : '❌'}</span>
            </div>
            
            ${result.warning ? `<div class="device-warning">⚠️ ${result.warning}</div>` : ''}
            ${result.recommendation ? `<div class="device-recommendation">💡 ${result.recommendation}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="shopping-guide">
        <h4>🛍️ What to Buy:</h4>
        
        <div class="shopping-list">
          ${compatibility.needsAdapter ? `
            <div class="shopping-item">
              <strong>🔌 Plug Adapter:</strong>
              <p>Type: ${homeSpecs.plugTypes.join("/")} → ${destSpecs.plugTypes.join("/")}</p>
              <p>Estimated price: $4-12</p>
            </div>
          ` : ''}
          
          ${compatibility.needsTransformer ? `
            <div class="shopping-item">
              <strong>⚡ Voltage Transformer:</strong>
              <p>Type: ${homeSpecs.voltage} ↔ ${destSpecs.voltage}</p>
              <p>Estimated price: $20-80 (depends on power)</p>
            </div>
          ` : ''}
          
          <div class="shopping-item">
            <strong>🌍 Universal Adapter:</strong>
            <p>Works for most countries worldwide</p>
            <p>Estimated price: $12-30</p>
          </div>
        </div>
      </div>

      <div class="safety-tips">
        <h4>🛡️ Safety Tips:</h4>
        <ul>
          <li><strong>Check Labels:</strong> Always read device specifications</li>
          <li><strong>Quality Adapters:</strong> Buy certified products from known brands</li>
          <li><strong>Don't Overload:</strong> Don't connect multiple high-power devices simultaneously</li>
          <li><strong>Local Purchase:</strong> For long trips consider buying local equivalents</li>
          <li><strong>Backup Options:</strong> Bring multiple adapters in case of failure</li>
          ${compatibility.overallSafety !== "safe" ? '<li><strong>⚠️ Special Attention:</strong> Some devices need additional measures!</li>' : ''}
        </ul>
      </div>
    `;
  }
});