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
          <label>📱 Тип пристрою:</label>
          <select class="device-type">
            <option value="phone-charger">📱 Зарядка телефону</option>
            <option value="laptop">💻 Ноутбук</option>
            <option value="camera">📷 Камера</option>
            <option value="hair-dryer">🔥 Фен для волосся</option>
            <option value="hair-straightener">💇 Праска для волосся</option>
            <option value="electric-shaver">🪒 Електробритва</option>
            <option value="tablet">📱 Планшет</option>
            <option value="power-bank">🔋 Повербанк</option>
            <option value="gaming-console">🎮 Ігрова консоль</option>
            <option value="other">❓ Інше</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>⚡ Напруга пристрою:</label>
          <select class="device-voltage">
            <option value="universal">🌍 Універсальний (100-240V)</option>
            <option value="110v">🇺🇸 110-120V</option>
            <option value="220v">🇪🇺 220-240V</option>
            <option value="unknown">❓ Не знаю</option>
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
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, оберіть країни походження та призначення.</p>';
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
      "ukraine": { name: "Україна", flag: "🇺🇦", plugTypes: ["C", "F"], voltage: "220V", frequency: "50Hz" },
      "usa": { name: "США", flag: "🇺🇸", plugTypes: ["A", "B"], voltage: "120V", frequency: "60Hz" },
      "canada": { name: "Канада", flag: "🇨🇦", plugTypes: ["A", "B"], voltage: "120V", frequency: "60Hz" },
      "mexico": { name: "Мексика", flag: "🇲🇽", plugTypes: ["A", "B"], voltage: "127V", frequency: "60Hz" },
      "germany": { name: "Німеччина", flag: "🇩🇪", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "france": { name: "Франція", flag: "🇫🇷", plugTypes: ["C", "E"], voltage: "230V", frequency: "50Hz" },
      "italy": { name: "Італія", flag: "🇮🇹", plugTypes: ["C", "F", "L"], voltage: "230V", frequency: "50Hz" },
      "spain": { name: "Іспанія", flag: "🇪🇸", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "netherlands": { name: "Нідерланди", flag: "🇳🇱", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "poland": { name: "Польща", flag: "🇵🇱", plugTypes: ["C", "E"], voltage: "230V", frequency: "50Hz" },
      "uk": { name: "Великобританія", flag: "🇬🇧", plugTypes: ["G"], voltage: "230V", frequency: "50Hz" },
      "ireland": { name: "Ірландія", flag: "🇮🇪", plugTypes: ["G"], voltage: "230V", frequency: "50Hz" },
      "switzerland": { name: "Швейцарія", flag: "🇨🇭", plugTypes: ["C", "J"], voltage: "230V", frequency: "50Hz" },
      "austria": { name: "Австрія", flag: "🇦🇹", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "czech": { name: "Чехія", flag: "🇨🇿", plugTypes: ["C", "E"], voltage: "230V", frequency: "50Hz" },
      "norway": { name: "Норвегія", flag: "🇳🇴", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "sweden": { name: "Швеція", flag: "🇸🇪", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "denmark": { name: "Данія", flag: "🇩🇰", plugTypes: ["C", "E", "F", "K"], voltage: "230V", frequency: "50Hz" },
      "finland": { name: "Фінляндія", flag: "🇫🇮", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "russia": { name: "Росія", flag: "🇷🇺", plugTypes: ["C", "F"], voltage: "220V", frequency: "50Hz" },
      "turkey": { name: "Туреччина", flag: "🇹🇷", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "greece": { name: "Греція", flag: "🇬🇷", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "portugal": { name: "Португалія", flag: "🇵🇹", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "australia": { name: "Австралія", flag: "🇦🇺", plugTypes: ["I"], voltage: "230V", frequency: "50Hz" },
      "new-zealand": { name: "Нова Зеландія", flag: "🇳🇿", plugTypes: ["I"], voltage: "230V", frequency: "50Hz" },
      "japan": { name: "Японія", flag: "🇯🇵", plugTypes: ["A", "B"], voltage: "100V", frequency: "50Hz/60Hz" },
      "south-korea": { name: "Південна Корея", flag: "🇰🇷", plugTypes: ["C", "F"], voltage: "220V", frequency: "60Hz" },
      "china": { name: "Китай", flag: "🇨🇳", plugTypes: ["A", "C", "I"], voltage: "220V", frequency: "50Hz" },
      "hong-kong": { name: "Гонконг", flag: "🇭🇰", plugTypes: ["D", "G"], voltage: "220V", frequency: "50Hz" },
      "singapore": { name: "Сінгапур", flag: "🇸🇬", plugTypes: ["C", "G", "M"], voltage: "230V", frequency: "50Hz" },
      "malaysia": { name: "Малайзія", flag: "🇲🇾", plugTypes: ["C", "G", "M"], voltage: "240V", frequency: "50Hz" },
      "thailand": { name: "Таїланд", flag: "🇹🇭", plugTypes: ["A", "B", "C", "F"], voltage: "220V", frequency: "50Hz" },
      "vietnam": { name: "В'єтнам", flag: "🇻🇳", plugTypes: ["A", "C", "D"], voltage: "220V", frequency: "50Hz" },
      "philippines": { name: "Філіппіни", flag: "🇵🇭", plugTypes: ["A", "B", "C"], voltage: "220V", frequency: "60Hz" },
      "indonesia": { name: "Індонезія", flag: "🇮🇩", plugTypes: ["C", "F"], voltage: "230V", frequency: "50Hz" },
      "india": { name: "Індія", flag: "🇮🇳", plugTypes: ["C", "D", "M"], voltage: "230V", frequency: "50Hz" },
      "uae": { name: "ОАЕ", flag: "🇦🇪", plugTypes: ["C", "D", "G"], voltage: "230V", frequency: "50Hz" },
      "israel": { name: "Ізраїль", flag: "🇮🇱", plugTypes: ["C", "H", "M"], voltage: "230V", frequency: "50Hz" },
      "saudi-arabia": { name: "Саудівська Аравія", flag: "🇸🇦", plugTypes: ["A", "B", "C", "G"], voltage: "230V", frequency: "60Hz" },
      "south-africa": { name: "Південна Африка", flag: "🇿🇦", plugTypes: ["C", "D", "M", "N"], voltage: "230V", frequency: "50Hz" },
      "egypt": { name: "Єгипет", flag: "🇪🇬", plugTypes: ["C", "F"], voltage: "220V", frequency: "50Hz" },
      "morocco": { name: "Марокко", flag: "🇲🇦", plugTypes: ["C", "E"], voltage: "220V", frequency: "50Hz" },
      "brazil": { name: "Бразилія", flag: "🇧🇷", plugTypes: ["C", "N"], voltage: "220V", frequency: "60Hz" },
      "argentina": { name: "Аргентина", flag: "🇦🇷", plugTypes: ["C", "I"], voltage: "220V", frequency: "50Hz" },
      "chile": { name: "Чилі", flag: "🇨🇱", plugTypes: ["C", "L"], voltage: "220V", frequency: "50Hz" },
      "peru": { name: "Перу", flag: "🇵🇪", plugTypes: ["A", "B", "C"], voltage: "220V", frequency: "60Hz" },
      "colombia": { name: "Колумбія", flag: "🇨🇴", plugTypes: ["A", "B"], voltage: "110V", frequency: "60Hz" }
    };

    return specs[country] || { name: "Невідома країна", flag: "❓", plugTypes: ["C"], voltage: "230V", frequency: "50Hz" };
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
      "phone-charger": "Зарядка телефону",
      "laptop": "Ноутбук",
      "camera": "Камера",
      "hair-dryer": "Фен для волосся",
      "hair-straightener": "Праска для волосся",
      "electric-shaver": "Електробритва",
      "tablet": "Планшет",
      "power-bank": "Повербанк",
      "gaming-console": "Ігрова консоль",
      "other": "Інший пристрій"
    };
    return names[type] || "Невідомий пристрій";
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
      recommendation = "Потрібен тільки адаптер штепселя";
    } else if (device.voltage === "110v") {
      const destV = parseInt(destSpecs.voltage);
      if (destV > 130) {
        needsTransformer = true;
        compatible = false;
        warning = "Потрібен трансформатор 220V→110V";
        recommendation = "Купіть трансформатор або використайте місцевий аналог";
      }
    } else if (device.voltage === "220v") {
      const destV = parseInt(destSpecs.voltage);
      if (destV < 200) {
        needsTransformer = true;
        compatible = false;
        warning = "Потрібен трансформатор 110V→220V";
        recommendation = "Купіть трансформатор або використайте місцевий аналог";
      }
    } else if (device.voltage === "unknown") {
      compatible = false;
      warning = "Перевірте етикетку пристрою";
      recommendation = "Подивіться напругу на етикетці пристрою";
    }

    // High power device warnings
    if (device.typical.safety === "caution" && needsTransformer) {
      warning += " ⚠️ Високопотужний пристрій!";
      recommendation += " Розгляньте покупку місцевого аналога.";
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

    const safetyText = compatibility.overallSafety === "safe" ? "Всі пристрої сумісні!" : 
                      compatibility.overallSafety === "caution" ? "Потрібна увага!" : "Потрібні дії!";

    resultDiv.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${safetyClass}">
          <h3>${safetyIcon} ${safetyText}</h3>
          <p><strong>Маршрут:</strong> ${homeSpecs.flag} ${homeSpecs.name} → ${destSpecs.flag} ${destSpecs.name}</p>
          <p><strong>Штепсель:</strong> ${compatibility.needsAdapter ? "Потрібен адаптер" : "Сумісний"}</p>
          <p><strong>Напруга:</strong> ${compatibility.needsTransformer ? "Може потребувати трансформатор" : "Сумісна"}</p>
        </div>
      </div>

      <div class="power-specs">
        <h4>⚡ Технічні характеристики:</h4>
        
        <div class="spec-comparison">
          <div class="spec-column">
            <h5>${homeSpecs.flag} ${homeSpecs.name}</h5>
            <p><strong>Штепселі:</strong> ${homeSpecs.plugTypes.join(", ")}</p>
            <p><strong>Напруга:</strong> ${homeSpecs.voltage}</p>
            <p><strong>Частота:</strong> ${homeSpecs.frequency}</p>
          </div>
          
          <div class="spec-column">
            <h5>${destSpecs.flag} ${destSpecs.name}</h5>
            <p><strong>Штепселі:</strong> ${destSpecs.plugTypes.join(", ")}</p>
            <p><strong>Напруга:</strong> ${destSpecs.voltage}</p>
            <p><strong>Частота:</strong> ${destSpecs.frequency}</p>
          </div>
        </div>
      </div>

      <div class="device-analysis">
        <h4>🔌 Аналіз пристроїв:</h4>
        
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
        <h4>🛍️ Що купити:</h4>
        
        <div class="shopping-list">
          ${compatibility.needsAdapter ? `
            <div class="shopping-item">
              <strong>🔌 Адаптер штепселя:</strong>
              <p>Тип: ${homeSpecs.plugTypes.join("/")} → ${destSpecs.plugTypes.join("/")}</p>
              <p>Орієнтовна ціна: 100-300 грн</p>
            </div>
          ` : ''}
          
          ${compatibility.needsTransformer ? `
            <div class="shopping-item">
              <strong>⚡ Трансформатор напруги:</strong>
              <p>Тип: ${homeSpecs.voltage} ↔ ${destSpecs.voltage}</p>
              <p>Орієнтовна ціна: 500-2000 грн (залежно від потужності)</p>
            </div>
          ` : ''}
          
          <div class="shopping-item">
            <strong>🌍 Універсальний адаптер:</strong>
            <p>Підходить для більшості країн світу</p>
            <p>Орієнтовна ціна: 300-800 грн</p>
          </div>
        </div>
      </div>

      <div class="safety-tips">
        <h4>🛡️ Поради безпеки:</h4>
        <ul>
          <li><strong>Перевіряйте етикетки:</strong> Завжди читайте специфікації на пристроях</li>
          <li><strong>Якісні адаптери:</strong> Купуйте сертифіковані продукти відомих брендів</li>
          <li><strong>Не перевантажуйте:</strong> Не підключайте кілька потужних пристроїв одночасно</li>
          <li><strong>Місцева покупка:</strong> Для довгих поїздок розгляньте покупку місцевих аналогів</li>
          <li><strong>Запасні варіанти:</strong> Беріть кілька адаптерів на випадок поломки</li>
          ${compatibility.overallSafety !== "safe" ? '<li><strong>⚠️ Особлива увага:</strong> Деякі пристрої потребують додаткових заходів!</li>' : ''}
        </ul>
      </div>
    `;
  }
});