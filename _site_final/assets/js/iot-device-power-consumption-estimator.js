document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("iot-power-form");
  if (!form) return;

  // Device presets
  const devicePresets = {
    "temperature-sensor": { active: 10, sleep: 0.02, transmission: 30, voltage: 3.3 },
    "motion-sensor": { active: 5, sleep: 0.01, transmission: 25, voltage: 3.3 },
    "door-sensor": { active: 3, sleep: 0.005, transmission: 20, voltage: 3 },
    "smart-plug": { active: 200, sleep: 150, transmission: 250, voltage: 5 },
    "security-camera": { active: 2000, sleep: 500, transmission: 2500, voltage: 5 },
    "smart-thermostat": { active: 100, sleep: 5, transmission: 150, voltage: 3.3 },
    "gps-tracker": { active: 150, sleep: 0.1, transmission: 300, voltage: 3.7 },
    "smoke-detector": { active: 20, sleep: 0.01, transmission: 50, voltage: 9 }
  };

  // Protocol power modifiers
  const protocolModifiers = {
    "wifi": { multiplier: 1.5, description: "WiFi - висока швидкість, високе споживання" },
    "bluetooth-le": { multiplier: 0.3, description: "Bluetooth LE - низьке споживання" },
    "zigbee": { multiplier: 0.2, description: "Zigbee - дуже низьке споживання" },
    "lorawan": { multiplier: 0.1, description: "LoRaWAN - ультранизьке споживання" },
    "nb-iot": { multiplier: 0.8, description: "NB-IoT - помірне споживання" },
    "thread": { multiplier: 0.25, description: "Thread - низьке споживання" }
  };

  // Battery presets
  const batteryPresets = {
    "aa-alkaline": { capacity: 2500, voltage: 1.5, chemistry: "Алкалінова" },
    "aaa-alkaline": { capacity: 1200, voltage: 1.5, chemistry: "Алкалінова" },
    "cr2032": { capacity: 220, voltage: 3, chemistry: "Літієва" },
    "cr123a": { capacity: 1550, voltage: 3, chemistry: "Літієва" },
    "lipo-small": { capacity: 500, voltage: 3.7, chemistry: "LiPo" },
    "lipo-medium": { capacity: 2000, voltage: 3.7, chemistry: "LiPo" },
    "lipo-large": { capacity: 5000, voltage: 3.7, chemistry: "LiPo" }
  };

  // Elements
  const deviceType = document.getElementById("device-type");
  const communicationProtocol = document.getElementById("communication-protocol");
  const activePower = document.getElementById("active-power");
  const sleepPower = document.getElementById("sleep-power");
  const transmissionPower = document.getElementById("transmission-power");
  const operatingVoltage = document.getElementById("operating-voltage");
  const activeTime = document.getElementById("active-time");
  const transmissionFrequency = document.getElementById("transmission-frequency");
  const transmissionDuration = document.getElementById("transmission-duration");
  const batteryType = document.getElementById("battery-type");
  const batteryCapacity = document.getElementById("battery-capacity");
  const batteryVoltage = document.getElementById("battery-voltage");
  const electricityRate = document.getElementById("electricity-rate");

  // Event listeners
  deviceType.addEventListener("change", updateDevicePreset);
  batteryType.addEventListener("change", updateBatteryPreset);
  form.addEventListener("submit", calculatePowerConsumption);

  function updateDevicePreset() {
    const selectedDevice = deviceType.value;
    if (devicePresets[selectedDevice]) {
      const preset = devicePresets[selectedDevice];
      activePower.value = preset.active;
      sleepPower.value = preset.sleep;
      transmissionPower.value = preset.transmission;
      operatingVoltage.value = preset.voltage;
    }
  }

  function updateBatteryPreset() {
    const selectedBattery = batteryType.value;
    if (batteryPresets[selectedBattery]) {
      const preset = batteryPresets[selectedBattery];
      batteryCapacity.value = preset.capacity;
      batteryVoltage.value = preset.voltage;
    }
  }

  function calculatePowerConsumption(e) {
    e.preventDefault();

    // Get form values
    const device = deviceType.value;
    const protocol = communicationProtocol.value;
    const activeCurrent = parseFloat(activePower.value);
    const sleepCurrent = parseFloat(sleepPower.value);
    const transmissionCurrent = parseFloat(transmissionPower.value);
    const voltage = parseFloat(operatingVoltage.value);
    const activeMinutesPerHour = parseFloat(activeTime.value);
    const transmissionsPerHour = parseFloat(transmissionFrequency.value);
    const transmissionSeconds = parseFloat(transmissionDuration.value);
    const capacity = parseFloat(batteryCapacity.value);
    const batteryVolt = parseFloat(batteryVoltage.value);
    const rate = parseFloat(electricityRate.value);

    // Apply protocol modifier
    const protocolMultiplier = protocolModifiers[protocol].multiplier;
    const adjustedTransmissionCurrent = transmissionCurrent * protocolMultiplier;

    // Calculate power consumption per hour
    const activeMinutes = activeMinutesPerHour;
    const sleepMinutes = 60 - activeMinutes;
    const transmissionMinutes = (transmissionsPerHour * transmissionSeconds) / 60;

    // Current consumption breakdown (mA)
    const hourlyActiveCurrent = (activeCurrent * activeMinutes) / 60;
    const hourlySleepCurrent = (sleepCurrent * sleepMinutes) / 60;
    const hourlyTransmissionCurrent = (adjustedTransmissionCurrent * transmissionMinutes) / 60;
    
    const totalHourlyCurrent = hourlyActiveCurrent + hourlySleepCurrent + hourlyTransmissionCurrent;

    // Power consumption (mW)
    const activePowerW = (activeCurrent / 1000) * voltage;
    const sleepPowerW = (sleepCurrent / 1000) * voltage;
    const transmissionPowerW = (adjustedTransmissionCurrent / 1000) * voltage;
    const averagePowerW = (totalHourlyCurrent / 1000) * voltage;

    // Daily and yearly consumption
    const dailyConsumptionWh = averagePowerW * 24;
    const yearlyConsumptionKWh = (dailyConsumptionWh * 365) / 1000;

    // Battery life calculation
    const effectiveCapacity = capacity * 0.8; // 80% usable capacity
    const batteryLifeHours = effectiveCapacity / totalHourlyCurrent;
    const batteryLifeDays = batteryLifeHours / 24;
    const batteryLifeYears = batteryLifeDays / 365;

    // Cost calculations
    const dailyCost = (dailyConsumptionWh / 1000) * rate;
    const yearlyCost = yearlyConsumptionKWh * rate;

    // Energy efficiency rating
    let efficiencyRating, efficiencyClass;
    if (averagePowerW < 0.001) {
      efficiencyRating = "Відмінно";
      efficiencyClass = "success";
    } else if (averagePowerW < 0.01) {
      efficiencyRating = "Дуже добре";
      efficiencyClass = "success";
    } else if (averagePowerW < 0.1) {
      efficiencyRating = "Добре";
      efficiencyClass = "info";
    } else if (averagePowerW < 1) {
      efficiencyRating = "Задовільно";
      efficiencyClass = "warning";
    } else {
      efficiencyRating = "Потребує оптимізації";
      efficiencyClass = "warning";
    }

    // Display results
    const resultContainer = document.getElementById("iot-power-result");
    resultContainer.innerHTML = `
      <h3>⚡ Аналіз споживання енергії IoT пристрою</h3>
      
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🔋 Середнє споживання</h6>
          <div class="big-number">${averagePowerW.toFixed(3)}</div>
          <p>Вт (${(totalHourlyCurrent).toFixed(2)} мА)<br>
          Протокол: ${protocolModifiers[protocol].description}</p>
        </div>
        
        <div class="insight-card ${batteryLifeYears >= 2 ? 'success' : batteryLifeYears >= 1 ? 'info' : 'warning'}">
          <h6>⏱️ Час роботи батареї</h6>
          <div class="big-number">${
            batteryLifeYears >= 2 ? 
            `${batteryLifeYears.toFixed(1)} років` :
            batteryLifeDays >= 30 ?
            `${(batteryLifeYears * 12).toFixed(1)} міс.` :
            `${batteryLifeDays.toFixed(0)} днів`
          }</div>
          <p>Батарея: ${batteryPresets[batteryType.value]?.chemistry || 'Власна'} ${capacity} мАг<br>
          Ефективна ємність: ${effectiveCapacity.toFixed(0)} мАг</p>
        </div>
        
        <div class="insight-card ${efficiencyClass}">
          <h6>📊 Енергоефективність</h6>
          <div class="big-number">${efficiencyRating}</div>
          <p>Річне споживання: ${yearlyConsumptionKWh.toFixed(3)} кВт⋅год<br>
          Денне споживання: ${dailyConsumptionWh.toFixed(2)} Вт⋅год</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>📈 Детальний аналіз споживання</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">
          <div>
            <strong>⚡ Споживання по режимах:</strong><br>
            Активний режим: ${activePowerW.toFixed(3)} Вт (${activeMinutesPerHour} хв/год)<br>
            Режим сну: ${sleepPowerW.toFixed(3)} Вт (${sleepMinutes.toFixed(1)} хв/год)<br>
            Передача даних: ${transmissionPowerW.toFixed(3)} Вт (${transmissionMinutes.toFixed(2)} хв/год)<br><br>
            
            <strong>📡 Параметри зв'язку:</strong><br>
            Протокол: ${protocolModifiers[protocol].description}<br>
            Частота передачі: ${transmissionsPerHour} разів/год<br>
            Тривалість передачі: ${transmissionSeconds} сек<br>
            Коефіцієнт протоколу: ${protocolMultiplier}x
          </div>
          
          <div>
            <strong>💰 Економічний аналіз:</strong><br>
            Денна вартість: ${dailyCost.toFixed(4)} грн<br>
            Місячна вартість: ${(dailyCost * 30).toFixed(2)} грн<br>
            Річна вартість: ${yearlyCost.toFixed(2)} грн<br>
            Тариф: ${rate} грн/кВт⋅год<br><br>
            
            <strong>🔋 Аналіз батареї:</strong><br>
            Тип: ${batteryPresets[batteryType.value]?.chemistry || 'Власна'}<br>
            Номінальна ємність: ${capacity} мАг<br>
            Напруга: ${batteryVolt} В<br>
            Енергія батареї: ${((capacity * batteryVolt) / 1000).toFixed(2)} Вт⋅год
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px;">
          <strong>⏰ Прогноз заміни батареї:</strong><br>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
            <div style="text-align: center; padding: 0.75rem; background: #e3f2fd; border-radius: 6px;">
              <strong>Тижні</strong><br>
              ${(batteryLifeDays / 7).toFixed(1)}
            </div>
            <div style="text-align: center; padding: 0.75rem; background: #e8f5e8; border-radius: 6px;">
              <strong>Місяці</strong><br>
              ${(batteryLifeDays / 30).toFixed(1)}
            </div>
            <div style="text-align: center; padding: 0.75rem; background: #fff3e0; border-radius: 6px;">
              <strong>Роки</strong><br>
              ${batteryLifeYears.toFixed(2)}
            </div>
            <div style="text-align: center; padding: 0.75rem; background: #fce4ec; border-radius: 6px;">
              <strong>Годин</strong><br>
              ${batteryLifeHours.toFixed(0)}
            </div>
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: ${
          batteryLifeYears >= 2 ? '#d4edda' : 
          batteryLifeYears >= 1 ? '#fff3cd' : '#f8d7da'
        }; border-radius: 8px; border-left: 4px solid ${
          batteryLifeYears >= 2 ? '#28a745' : 
          batteryLifeYears >= 1 ? '#ffc107' : '#dc3545'
        };">
          <strong>💡 Рекомендації для оптимізації:</strong><br>
          ${
            batteryLifeYears >= 2 ?
            '🎉 Відмінна енергоефективність! Ваш пристрій оптимально налаштований для тривалої автономної роботи.' :
            batteryLifeYears >= 1 ?
            '✅ Хороша енергоефективність. Розгляньте зменшення частоти передачі або використання більш ефективного протоколу.' :
            '⚠️ Потрібна оптимізація енергоспоживання. Рекомендації: зменшіть частоту передачі, використайте більш енергоефективний протокол (LoRaWAN/Zigbee), збільште час у режимі сну.'
          }<br><br>
          
          <strong>🔧 Поради для покращення:</strong><br>
          • ${activeMinutesPerHour > 10 ? 'Зменшіть час активної роботи до 5-10 хвилин на годину' : 'Час активної роботи оптимальний'}<br>
          • ${transmissionsPerHour > 20 ? 'Розгляньте зменшення частоти передачі до 1-12 разів на годину' : 'Частота передачі прийнятна'}<br>
          • ${protocol === 'wifi' ? 'WiFi споживає багато енергії - розгляньте LoRaWAN або Zigbee для датчиків' : 'Протокол зв\'язку енергоефективний'}<br>
          • ${averagePowerW > 0.1 ? 'Високе споживання - перевірте налаштування живлення пристрою' : 'Споживання енергії в нормі'}
        </div>
      </div>
    `;
  }

  // Initialize with default preset
  updateDevicePreset();
  updateBatteryPreset();
});