document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('iot-power-form');
  const result = document.getElementById('iot-power-result');

  // Setup range sliders
  setupRangeSlider('duty-cycle', 'duty-display', '%');
  setupRangeSlider('operating-hours', 'hours-display', '');
  setupRangeSlider('temperature', 'temp-display', '°C');

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateIoTPowerConsumption();
    });

    // Auto-fill power values when device type changes
    document.getElementById('device-type').addEventListener('change', function() {
      autoFillDeviceValues(this.value);
    });

    // Auto-fill protocol values when protocol changes
    document.getElementById('protocol').addEventListener('change', function() {
      autoFillProtocolValues(this.value);
    });
  }

  function setupRangeSlider(sliderId, displayId, suffix = '') {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (slider && display) {
      slider.addEventListener('input', function() {
        display.textContent = this.value + suffix;
      });
    }
  }

  function autoFillDeviceValues(deviceType) {
    const deviceProfiles = {
      'temperature-sensor': { active: 5, sleep: 0.01, transmission: 50 },
      'motion-sensor': { active: 20, sleep: 0.1, transmission: 30 },
      'door-sensor': { active: 10, sleep: 0.01, transmission: 20 },
      'camera': { active: 8000, sleep: 100, transmission: 10000 },
      'smart-plug': { active: 1500, sleep: 500, transmission: 100 },
      'smart-light': { active: 12000, sleep: 1000, transmission: 50 },
      'thermostat': { active: 3000, sleep: 200, transmission: 150 },
      'smoke-detector': { active: 1000, sleep: 50, transmission: 100 },
      'air-quality': { active: 2000, sleep: 10, transmission: 200 },
      'asset-tracker': { active: 500, sleep: 5, transmission: 1000 },
      'water-sensor': { active: 15, sleep: 0.05, transmission: 40 }
    };

    const profile = deviceProfiles[deviceType];
    if (profile) {
      document.getElementById('active-power').value = profile.active;
      document.getElementById('sleep-power').value = profile.sleep;
      document.getElementById('transmission-power').value = profile.transmission;
    }
  }

  function autoFillProtocolValues(protocol) {
    const protocolProfiles = {
      'wifi': { transmission: 250, duration: 2 },
      'ble': { transmission: 30, duration: 0.5 },
      'zigbee': { transmission: 40, duration: 1 },
      'lora': { transmission: 300, duration: 5 },
      'cellular': { transmission: 1000, duration: 3 },
      'thread': { transmission: 50, duration: 1 },
      'ethernet': { transmission: 100, duration: 0.1 }
    };

    const profile = protocolProfiles[protocol];
    if (profile) {
      document.getElementById('transmission-power').value = profile.transmission;
      document.getElementById('transmission-duration').value = profile.duration;
    }
  }

  function calculateIoTPowerConsumption() {
    // Get form values
    const deviceType = document.getElementById('device-type').value;
    const deviceCount = parseInt(document.getElementById('device-count').value);
    const protocol = document.getElementById('protocol').value;
    const powerSupply = document.getElementById('power-supply').value;
    const activePower = parseFloat(document.getElementById('active-power').value); // mW
    const sleepPower = parseFloat(document.getElementById('sleep-power').value); // mW
    const transmissionPower = parseFloat(document.getElementById('transmission-power').value); // mW
    const dutyCycle = parseFloat(document.getElementById('duty-cycle').value) / 100; // fraction
    const transmissionFreq = document.getElementById('transmission-frequency').value;
    const transmissionDuration = parseFloat(document.getElementById('transmission-duration').value); // seconds
    const payloadSize = parseInt(document.getElementById('payload-size').value); // bytes
    const operatingHours = parseInt(document.getElementById('operating-hours').value);
    const batteryCapacity = parseInt(document.getElementById('battery-capacity').value); // mAh
    const batteryVoltage = parseFloat(document.getElementById('battery-voltage').value); // V
    const electricityRate = parseFloat(document.getElementById('electricity-rate').value); // $/kWh
    const batteryCost = parseFloat(document.getElementById('battery-cost').value); // $
    const temperature = parseInt(document.getElementById('temperature').value); // °C
    const analysisPeriod = document.getElementById('analysis-period').value;
    const includeGateway = document.getElementById('include-gateway').checked;
    const temperatureDerating = document.getElementById('temperature-derating').checked;
    const agingEffects = document.getElementById('aging-effects').checked;
    const networkOverhead = document.getElementById('network-overhead').checked;

    // Validate required fields
    if (!deviceType || !protocol || !powerSupply || !deviceCount) {
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    // Calculate transmission frequency in transmissions per hour
    const transmissionsPerHour = getTransmissionsPerHour(transmissionFreq);
    
    // Calculate average power consumption
    const powerCalculation = calculateAveragePower(
      activePower, sleepPower, transmissionPower, dutyCycle, 
      transmissionsPerHour, transmissionDuration, operatingHours
    );

    // Apply environmental factors
    const environmentalFactors = calculateEnvironmentalFactors(
      temperature, temperatureDerating, agingEffects
    );

    // Calculate protocol overhead
    const protocolOverhead = networkOverhead ? calculateProtocolOverhead(protocol, payloadSize) : 1.0;

    // Calculate final power consumption
    const adjustedPower = powerCalculation.averagePower * environmentalFactors.powerMultiplier * protocolOverhead;

    // Calculate costs and battery life
    const costAnalysis = calculateCosts(
      adjustedPower, deviceCount, electricityRate, powerSupply, 
      batteryCapacity, batteryVoltage, batteryCost, analysisPeriod, includeGateway
    );

    // Calculate network-wide consumption
    const networkAnalysis = calculateNetworkConsumption(
      adjustedPower, deviceCount, includeGateway, protocol
    );

    // Display results
    displayResults({
      deviceType,
      deviceCount,
      protocol,
      powerSupply,
      powerCalculation,
      adjustedPower,
      environmentalFactors,
      costAnalysis,
      networkAnalysis,
      analysisPeriod,
      batteryCapacity,
      batteryVoltage,
      operatingHours,
      transmissionsPerHour,
      payloadSize
    });
  }

  function getTransmissionsPerHour(frequency) {
    const frequencies = {
      'continuous': 3600, // Every second
      'every-second': 3600,
      'every-minute': 60,
      'every-5-minutes': 12,
      'every-15-minutes': 4,
      'hourly': 1,
      'every-6-hours': 1/6,
      'daily': 1/24
    };
    return frequencies[frequency] || 1;
  }

  function calculateAveragePower(activePower, sleepPower, transmissionPower, dutyCycle, transmissionsPerHour, transmissionDuration, operatingHours) {
    // Calculate time fractions
    const operatingFraction = operatingHours / 24;
    const transmissionTimePerHour = transmissionsPerHour * transmissionDuration / 3600; // fraction of hour
    const activeTimePerHour = dutyCycle; // fraction of hour when active (not including transmission)
    const sleepTimePerHour = 1 - activeTimePerHour - transmissionTimePerHour;

    // Ensure time fractions don't exceed 1
    const normalizedSleepTime = Math.max(0, sleepTimePerHour);
    const normalizedActiveTime = Math.min(activeTimePerHour, 1 - transmissionTimePerHour);

    // Calculate average power per hour during operation
    const operatingPower = (
      normalizedActiveTime * activePower +
      transmissionTimePerHour * (activePower + transmissionPower) +
      normalizedSleepTime * sleepPower
    );

    // Apply operating hours fraction
    const averagePower24h = operatingPower * operatingFraction + sleepPower * (1 - operatingFraction);

    return {
      averagePower: averagePower24h, // mW
      operatingPower: operatingPower,
      activeFraction: normalizedActiveTime,
      transmissionFraction: transmissionTimePerHour,
      sleepFraction: normalizedSleepTime,
      breakdown: {
        activePower: normalizedActiveTime * activePower,
        transmissionPower: transmissionTimePerHour * (activePower + transmissionPower),
        sleepPower: normalizedSleepTime * sleepPower
      }
    };
  }

  function calculateEnvironmentalFactors(temperature, temperatureDerating, agingEffects) {
    let powerMultiplier = 1.0;
    let batteryCapacityMultiplier = 1.0;

    // Temperature effects on battery capacity and device power consumption
    if (temperatureDerating) {
      if (temperature < 0) {
        batteryCapacityMultiplier = 0.6; // 40% reduction in cold
        powerMultiplier = 1.1; // 10% increase in power consumption
      } else if (temperature < 10) {
        batteryCapacityMultiplier = 0.8;
        powerMultiplier = 1.05;
      } else if (temperature > 40) {
        batteryCapacityMultiplier = 0.9; // High temp also reduces capacity
        powerMultiplier = 1.05;
      } else if (temperature > 25) {
        batteryCapacityMultiplier = 0.95;
        powerMultiplier = 1.02;
      }
    }

    // Battery aging effects (over 2-5 years)
    let agingMultiplier = 1.0;
    if (agingEffects) {
      agingMultiplier = 0.8; // 20% capacity loss over lifetime
    }

    return {
      powerMultiplier,
      batteryCapacityMultiplier: batteryCapacityMultiplier * agingMultiplier,
      temperatureEffect: temperature < 20 || temperature > 30,
      agingEffect: agingEffects
    };
  }

  function calculateProtocolOverhead(protocol, payloadSize) {
    const protocolOverheads = {
      'wifi': 1.3, // TCP/IP overhead
      'ble': 1.1, // Minimal overhead
      'zigbee': 1.2, // Mesh networking
      'lora': 1.1, // Efficient protocol
      'cellular': 1.5, // Significant overhead
      'thread': 1.25, // IPv6 mesh
      'ethernet': 1.1 // Minimal overhead when wired
    };

    let baseOverhead = protocolOverheads[protocol] || 1.2;
    
    // Larger payloads have proportionally less overhead
    if (payloadSize > 100) {
      baseOverhead = baseOverhead * 0.9;
    } else if (payloadSize < 20) {
      baseOverhead = baseOverhead * 1.1;
    }

    return baseOverhead;
  }

  function calculateCosts(adjustedPower, deviceCount, electricityRate, powerSupply, batteryCapacity, batteryVoltage, batteryCost, analysisPeriod, includeGateway) {
    // Convert power to watts
    const powerPerDeviceW = adjustedPower / 1000; // Convert mW to W
    const totalPowerW = powerPerDeviceW * deviceCount;

    // Gateway power (if included)
    let gatewayPowerW = 0;
    if (includeGateway) {
      const gatewayPowers = {
        'wifi': 5, // WiFi router
        'ble': 2, // BLE hub
        'zigbee': 3, // Zigbee coordinator
        'lora': 10, // LoRa gateway
        'cellular': 15, // Cellular gateway
        'thread': 4 // Thread border router
      };
      gatewayPowerW = gatewayPowers['wifi'] || 5; // Default to WiFi router
    }

    const totalSystemPowerW = totalPowerW + gatewayPowerW;

    // Calculate energy consumption based on period
    let hours, days;
    switch (analysisPeriod) {
      case 'daily':
        hours = 24;
        days = 1;
        break;
      case 'monthly':
        hours = 24 * 30;
        days = 30;
        break;
      case 'yearly':
        hours = 24 * 365;
        days = 365;
        break;
      case 'battery-life':
        // Calculate based on battery capacity
        const batteryCapacityWh = (batteryCapacity / 1000) * batteryVoltage; // Convert mAh to Wh
        const batteryLifeHours = batteryCapacityWh / powerPerDeviceW;
        hours = batteryLifeHours;
        days = batteryLifeHours / 24;
        break;
      default:
        hours = 24 * 365;
        days = 365;
    }

    const energyConsumptionKWh = (totalSystemPowerW * hours) / 1000;
    const electricityCost = energyConsumptionKWh * electricityRate;

    // Battery replacement costs (for battery-powered devices)
    let batteryCostTotal = 0;
    let batteryLifeDays = 0;
    let batteryReplacements = 0;

    if (powerSupply.includes('battery')) {
      const batteryCapacityWh = (batteryCapacity / 1000) * batteryVoltage;
      batteryLifeDays = (batteryCapacityWh / powerPerDeviceW) / 24;
      
      if (analysisPeriod !== 'battery-life') {
        batteryReplacements = Math.floor(days / batteryLifeDays) * deviceCount;
        batteryCostTotal = batteryReplacements * batteryCost;
      }
    }

    return {
      energyConsumptionKWh,
      electricityCost,
      batteryCostTotal,
      totalOperatingCost: electricityCost + batteryCostTotal,
      powerPerDevice: powerPerDeviceW * 1000, // Back to mW for display
      totalSystemPower: totalSystemPowerW * 1000, // Back to mW for display
      gatewayPower: gatewayPowerW * 1000,
      batteryLifeDays,
      batteryReplacements,
      costPerDevice: (electricityCost + batteryCostTotal) / deviceCount,
      hours,
      days
    };
  }

  function calculateNetworkConsumption(devicePower, deviceCount, includeGateway, protocol) {
    const totalDevicePower = devicePower * deviceCount; // mW

    // Calculate data throughput
    const dataRates = {
      'wifi': 1000, // kbps typical for IoT
      'ble': 100,
      'zigbee': 250,
      'lora': 5,
      'cellular': 1000,
      'thread': 250,
      'ethernet': 10000
    };

    const networkDataRate = dataRates[protocol] || 250;

    // Calculate network efficiency (data per watt)
    const networkEfficiency = networkDataRate / (totalDevicePower / 1000); // kbps per watt

    return {
      totalDevicePower,
      networkDataRate,
      networkEfficiency,
      devicesPerGateway: getDevicesPerGateway(protocol),
      networkTopology: getNetworkTopology(protocol)
    };
  }

  function getDevicesPerGateway(protocol) {
    const capacities = {
      'wifi': 50,
      'ble': 20,
      'zigbee': 65000,
      'lora': 1000,
      'cellular': 1, // Each device connects directly
      'thread': 250,
      'ethernet': 100
    };
    return capacities[protocol] || 50;
  }

  function getNetworkTopology(protocol) {
    const topologies = {
      'wifi': 'Star (devices → router)',
      'ble': 'Star (devices → hub)',
      'zigbee': 'Mesh (self-healing network)',
      'lora': 'Star (devices → gateway)',
      'cellular': 'Direct (device → cell tower)',
      'thread': 'Mesh (IPv6 mesh network)',
      'ethernet': 'Star/Tree (wired infrastructure)'
    };
    return topologies[protocol] || 'Star network';
  }

  function displayResults(data) {
    const { powerCalculation, adjustedPower, costAnalysis, networkAnalysis } = data;

    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>⚡ Average Power</h6>
          <div class="big-number">${adjustedPower.toFixed(2)}</div>
          <p class="insight-detail">mW per device</p>
        </div>
        <div class="insight-card success">
          <h6>🔋 Battery Life</h6>
          <div class="big-number">${costAnalysis.batteryLifeDays > 365 ? 
            (costAnalysis.batteryLifeDays / 365).toFixed(1) + ' years' : 
            Math.round(costAnalysis.batteryLifeDays) + ' days'}</div>
          <p class="insight-detail">Expected lifetime</p>
        </div>
        <div class="insight-card warning">
          <h6>💰 ${getAnalysisPeriodLabel(data.analysisPeriod)} Cost</h6>
          <div class="big-number">$${costAnalysis.totalOperatingCost.toFixed(2)}</div>
          <p class="insight-detail">${data.deviceCount} device(s)</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Power Consumption Breakdown</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            
            <div>
              <h4>⚡ Power States</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Active:</strong> ${powerCalculation.breakdown.activePower.toFixed(2)} mW</li>
                <li><strong>Transmission:</strong> ${powerCalculation.breakdown.transmissionPower.toFixed(2)} mW</li>
                <li><strong>Sleep:</strong> ${powerCalculation.breakdown.sleepPower.toFixed(3)} mW</li>
                <li><strong>Total Average:</strong> ${adjustedPower.toFixed(2)} mW</li>
              </ul>
            </div>

            <div>
              <h4>⏰ Time Distribution</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Active:</strong> ${(powerCalculation.activeFraction * 100).toFixed(1)}%</li>
                <li><strong>Transmitting:</strong> ${(powerCalculation.transmissionFraction * 100).toFixed(2)}%</li>
                <li><strong>Sleeping:</strong> ${(powerCalculation.sleepFraction * 100).toFixed(1)}%</li>
                <li><strong>Operating:</strong> ${data.operatingHours} hours/day</li>
              </ul>
            </div>

            <div>
              <h4>📡 Communication</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Protocol:</strong> ${getProtocolName(data.protocol)}</li>
                <li><strong>Frequency:</strong> ${data.transmissionsPerHour} tx/hour</li>
                <li><strong>Payload:</strong> ${data.payloadSize} bytes</li>
                <li><strong>Topology:</strong> ${networkAnalysis.networkTopology}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>💰 Cost Analysis</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          
          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">⚡ Electricity Costs</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Energy Usage:</strong> ${costAnalysis.energyConsumptionKWh.toFixed(3)} kWh</li>
              <li><strong>Electricity Cost:</strong> $${costAnalysis.electricityCost.toFixed(2)}</li>
              <li><strong>Per Device:</strong> $${(costAnalysis.electricityCost / data.deviceCount).toFixed(4)}</li>
              <li><strong>System Power:</strong> ${costAnalysis.totalSystemPower.toFixed(1)} mW</li>
            </ul>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">🔋 Battery Costs</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Battery Life:</strong> ${costAnalysis.batteryLifeDays > 365 ? 
                  (costAnalysis.batteryLifeDays / 365).toFixed(1) + ' years' : 
                  Math.round(costAnalysis.batteryLifeDays) + ' days'}</li>
              <li><strong>Replacements:</strong> ${costAnalysis.batteryReplacements}</li>
              <li><strong>Battery Costs:</strong> $${costAnalysis.batteryCostTotal.toFixed(2)}</li>
              <li><strong>Capacity:</strong> ${data.batteryCapacity} mAh @ ${data.batteryVoltage}V</li>
            </ul>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
            <h4 style="margin-top: 0; color: var(--accent);">📊 Total Costs</h4>
            <ul style="margin: 0.5rem 0;">
              <li><strong>Total Operating:</strong> $${costAnalysis.totalOperatingCost.toFixed(2)}</li>
              <li><strong>Per Device:</strong> $${costAnalysis.costPerDevice.toFixed(2)}</li>
              <li><strong>Period:</strong> ${getAnalysisPeriodLabel(data.analysisPeriod)}</li>
              <li><strong>Devices:</strong> ${data.deviceCount}</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>🌐 Network Analysis</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            
            <div>
              <h4>📡 Network Capacity</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Devices per Gateway:</strong> ${networkAnalysis.devicesPerGateway}</li>
                <li><strong>Data Rate:</strong> ${networkAnalysis.networkDataRate} kbps</li>
                <li><strong>Efficiency:</strong> ${networkAnalysis.networkEfficiency.toFixed(1)} kbps/W</li>
                <li><strong>Total Power:</strong> ${networkAnalysis.totalDevicePower.toFixed(1)} mW</li>
              </ul>
            </div>

            <div>
              <h4>🔧 Infrastructure</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Gateways Needed:</strong> ${Math.ceil(data.deviceCount / networkAnalysis.devicesPerGateway)}</li>
                <li><strong>Gateway Power:</strong> ${costAnalysis.gatewayPower.toFixed(0)} mW each</li>
                <li><strong>Network Type:</strong> ${networkAnalysis.networkTopology}</li>
                <li><strong>Protocol:</strong> ${getProtocolName(data.protocol)}</li>
              </ul>
            </div>

            <div>
              <h4>🎯 Optimization</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Power per Device:</strong> ${(networkAnalysis.totalDevicePower / data.deviceCount).toFixed(2)} mW</li>
                <li><strong>Network Overhead:</strong> ${((costAnalysis.gatewayPower * Math.ceil(data.deviceCount / networkAnalysis.devicesPerGateway)) / networkAnalysis.totalDevicePower * 100).toFixed(1)}%</li>
                <li><strong>Scalability:</strong> ${networkAnalysis.devicesPerGateway > 100 ? 'Excellent' : networkAnalysis.devicesPerGateway > 50 ? 'Good' : 'Limited'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      ${getOptimizationRecommendations(data)}
      ${getBatteryLifeChart(data)}

      <div style="margin-top: 1.5rem; padding: 1rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
        <strong>⚠️ Note:</strong> Power consumption estimates are based on typical values and may vary significantly based on device configuration, 
        environmental conditions, and actual usage patterns. For critical applications, validate estimates with actual measurements and consider 
        safety margins for battery life calculations.
      </div>
    `;

    result.innerHTML = html;
  }

  function getProtocolName(protocol) {
    const names = {
      'wifi': 'WiFi 802.11n',
      'ble': 'Bluetooth Low Energy',
      'zigbee': 'Zigbee 3.0',
      'lora': 'LoRaWAN',
      'cellular': 'Cellular (LTE-M)',
      'thread': 'Thread/Matter',
      'ethernet': 'Ethernet'
    };
    return names[protocol] || protocol;
  }

  function getAnalysisPeriodLabel(period) {
    const labels = {
      'daily': 'Daily',
      'monthly': 'Monthly',
      'yearly': 'Annual',
      'battery-life': 'Battery Lifetime'
    };
    return labels[period] || 'Annual';
  }

  function getOptimizationRecommendations(data) {
    const recommendations = [];
    
    if (data.adjustedPower > 10) {
      recommendations.push('🔋 <strong>High Power Usage:</strong> Consider reducing transmission frequency or using a more efficient protocol');
    }
    
    if (data.costAnalysis.batteryLifeDays < 365) {
      recommendations.push('⚡ <strong>Short Battery Life:</strong> Optimize sleep modes or consider larger battery capacity');
    }
    
    if (data.transmissionsPerHour > 60) {
      recommendations.push('📡 <strong>Frequent Transmissions:</strong> Consider data aggregation or edge processing to reduce transmission frequency');
    }
    
    if (data.protocol === 'wifi' && data.adjustedPower < 50) {
      recommendations.push('🌐 <strong>Protocol Optimization:</strong> Consider Zigbee or BLE for lower power consumption');
    }
    
    if (data.costAnalysis.totalOperatingCost / data.deviceCount > 50) {
      recommendations.push('💰 <strong>High Operating Cost:</strong> Evaluate solar power options or more efficient devices');
    }

    recommendations.push('📊 <strong>Monitoring:</strong> Implement power monitoring to validate estimates and optimize performance');
    recommendations.push('🔧 <strong>Maintenance:</strong> Plan regular battery checks and replacements for optimal reliability');

    return `
      <div style="margin-top: 2rem;">
        <h3>💡 Optimization Recommendations</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <ul style="margin: 0.5rem 0;">
            ${recommendations.map(rec => `<li style="margin: 0.5rem 0;">${rec}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  function getBatteryLifeChart(data) {
    if (!data.powerSupply.includes('battery')) {
      return '';
    }

    const batteryLife = data.costAnalysis.batteryLifeDays;
    const powerBreakdown = data.powerCalculation.breakdown;
    
    return `
      <div style="margin-top: 2rem;">
        <h3>🔋 Battery Life Analysis</h3>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            
            <div>
              <h4>📊 Power Distribution</h4>
              <div style="margin: 1rem 0;">
                <div style="margin-bottom: 0.5rem;">Active: ${((powerBreakdown.activePower / data.adjustedPower) * 100).toFixed(1)}%</div>
                <div style="background: var(--card-bg); height: 8px; border-radius: 4px; overflow: hidden;">
                  <div style="background: #28a745; height: 100%; width: ${(powerBreakdown.activePower / data.adjustedPower) * 100}%; border-radius: 4px;"></div>
                </div>
              </div>
              <div style="margin: 1rem 0;">
                <div style="margin-bottom: 0.5rem;">Transmission: ${((powerBreakdown.transmissionPower / data.adjustedPower) * 100).toFixed(1)}%</div>
                <div style="background: var(--card-bg); height: 8px; border-radius: 4px; overflow: hidden;">
                  <div style="background: #ffc107; height: 100%; width: ${(powerBreakdown.transmissionPower / data.adjustedPower) * 100}%; border-radius: 4px;"></div>
                </div>
              </div>
              <div style="margin: 1rem 0;">
                <div style="margin-bottom: 0.5rem;">Sleep: ${((powerBreakdown.sleepPower / data.adjustedPower) * 100).toFixed(1)}%</div>
                <div style="background: var(--card-bg); height: 8px; border-radius: 4px; overflow: hidden;">
                  <div style="background: #17a2b8; height: 100%; width: ${(powerBreakdown.sleepPower / data.adjustedPower) * 100}%; border-radius: 4px;"></div>
                </div>
              </div>
            </div>

            <div>
              <h4>🕐 Lifetime Projections</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Expected Life:</strong> ${batteryLife > 365 ? (batteryLife / 365).toFixed(1) + ' years' : Math.round(batteryLife) + ' days'}</li>
                <li><strong>Daily Consumption:</strong> ${((data.batteryCapacity * data.batteryVoltage) / batteryLife).toFixed(2)} mWh</li>
                <li><strong>Efficiency:</strong> ${(data.batteryCapacity / data.adjustedPower).toFixed(0)} hours/mAh</li>
                <li><strong>Temperature Impact:</strong> ${data.environmentalFactors?.temperatureEffect ? 'Significant' : 'Minimal'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }
});