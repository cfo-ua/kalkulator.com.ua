document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('iot-latency-form');
  const result = document.getElementById('latency-result');

  // Base latency for each protocol (in milliseconds)
  const protocolLatency = {
    wifi: { base: 2, name: 'Wi-Fi 6/6E' },
    '5g': { base: 5, name: '5G/LTE' },
    lorawan: { base: 1000, name: 'LoRaWAN' },
    zigbee: { base: 15, name: 'Zigbee 3.0' },
    bluetooth: { base: 25, name: 'Bluetooth LE' },
    nbiot: { base: 200, name: 'NB-IoT' }
  };

  // Load multipliers
  const loadMultipliers = {
    low: 1.0,
    medium: 1.5,
    high: 2.5
  };

  // Signal quality multipliers
  const signalMultipliers = {
    excellent: 1.0,
    good: 1.2,
    fair: 1.8,
    poor: 3.0
  };

  // Distance impact (per 100m for terrestrial, per 1000m for LoRaWAN)
  const distanceFactors = {
    wifi: 0.1,      // 0.1ms per 100m
    '5g': 0.2,      // 0.2ms per 100m
    lorawan: 10,    // 10ms per 1000m
    zigbee: 0.5,    // 0.5ms per 100m
    bluetooth: 0.05, // 0.05ms per 100m
    nbiot: 1.0      // 1ms per 100m
  };

  // Application requirements (acceptable latency in ms)
  const appRequirements = {
    critical: 1,
    interactive: 100,
    monitoring: 1000,
    periodic: 10000
  };

  function calculateLatency() {
    const protocol = document.querySelector('input[name="protocol"]:checked').value;
    const distance = parseInt(document.getElementById('distance').value);
    const packetSize = parseInt(document.getElementById('packet-size').value);
    const load = document.querySelector('input[name="load"]:checked').value;
    const signal = document.querySelector('input[name="signal"]:checked').value;
    const application = document.querySelector('input[name="application"]:checked').value;
    const hops = parseInt(document.getElementById('hops').value);
    const frequency = parseInt(document.getElementById('frequency').value);

    // Additional factors
    const edgeComputing = document.getElementById('edge-computing').checked;
    const qosEnabled = document.getElementById('qos-enabled').checked;
    const compression = document.getElementById('compression').checked;
    const interference = document.getElementById('interference').checked;

    // Calculate base latency
    let totalLatency = protocolLatency[protocol].base;

    // Add distance-based latency
    const distanceUnit = protocol === 'lorawan' ? 1000 : 100;
    totalLatency += (distance / distanceUnit) * distanceFactors[protocol];

    // Apply load multiplier
    totalLatency *= loadMultipliers[load];

    // Apply signal quality multiplier
    totalLatency *= signalMultipliers[signal];

    // Add packet size impact (larger packets take more time)
    const packetLatency = packetSize * 0.05; // 0.05ms per byte baseline
    totalLatency += packetLatency;

    // Add mesh hops (Zigbee primarily)
    if (hops > 0) {
      totalLatency += hops * 5; // 5ms per hop
    }

    // Apply frequency impact (higher frequency = more congestion)
    if (frequency > 60) {
      totalLatency *= 1 + (frequency - 60) / 600; // Congestion factor
    }

    // Apply optimizations
    if (edgeComputing) totalLatency *= 0.5;
    if (qosEnabled) totalLatency *= 0.7;
    if (compression) totalLatency *= 0.8;

    // Apply interference
    if (interference) totalLatency *= 1.5;

    return Math.max(totalLatency, 0.1); // Minimum 0.1ms
  }

  function formatLatency(ms) {
    if (ms < 1) return (ms * 1000).toFixed(0) + ' μs';
    if (ms < 1000) return ms.toFixed(1) + ' мс';
    return (ms / 1000).toFixed(2) + ' сек';
  }

  function getLatencyRating(ms, appType) {
    const requirement = appRequirements[appType];
    if (ms <= requirement) return { rating: 'excellent', color: '#28a745', icon: '✅' };
    if (ms <= requirement * 2) return { rating: 'good', color: '#ffc107', icon: '⚠️' };
    if (ms <= requirement * 5) return { rating: 'fair', color: '#fd7e14', icon: '🔶' };
    return { rating: 'poor', color: '#dc3545', icon: '❌' };
  }

  function getApplicationName(appType) {
    const names = {
      critical: 'Критичний застосунок',
      interactive: 'Інтерактивний застосунок',
      monitoring: 'Моніторинг в реальному часі',
      periodic: 'Періодичні звіти'
    };
    return names[appType];
  }

  function getLoadName(load) {
    const names = {
      low: 'Низьке навантаження',
      medium: 'Середнє навантаження',
      high: 'Високе навантаження'
    };
    return names[load];
  }

  function getSignalName(signal) {
    const names = {
      excellent: 'Відмінна якість сигналу',
      good: 'Хороша якість сигналу',
      fair: 'Задовільна якість сигналу',
      poor: 'Слабка якість сигналу'
    };
    return names[signal];
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const protocol = document.querySelector('input[name="protocol"]:checked').value;
    const distance = parseInt(document.getElementById('distance').value);
    const packetSize = parseInt(document.getElementById('packet-size').value);
    const load = document.querySelector('input[name="load"]:checked').value;
    const signal = document.querySelector('input[name="signal"]:checked').value;
    const application = document.querySelector('input[name="application"]:checked').value;
    const hops = parseInt(document.getElementById('hops').value);
    const frequency = parseInt(document.getElementById('frequency').value);

    const totalLatency = calculateLatency();
    const requirement = appRequirements[application];
    const rating = getLatencyRating(totalLatency, application);

    // Calculate component breakdown
    const baseLatency = protocolLatency[protocol].base;
    const distanceLatency = (distance / (protocol === 'lorawan' ? 1000 : 100)) * distanceFactors[protocol];
    const packetLatency = packetSize * 0.05;
    const hopsLatency = hops * 5;

    // Calculate throughput estimate
    const bitsPerPacket = packetSize * 8;
    const packetsPerSecond = frequency / 60;
    const throughputBps = bitsPerPacket * packetsPerSecond;

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${rating.rating === 'excellent' ? 'success' : rating.rating === 'poor' ? 'warning' : 'info'}">
          <h6>⚡ Загальна затримка</h6>
          <div style="font-size: 2em; font-weight: bold; color: ${rating.color};">
            ${formatLatency(totalLatency)}
          </div>
          <small>${rating.icon} ${rating.rating.toUpperCase()}</small>
        </div>
        
        <div class="insight-card info">
          <h6>🎯 Вимога застосунку</h6>
          <div style="font-size: 1.8em; font-weight: bold; color: var(--accent);">
            ${formatLatency(requirement)}
          </div>
          <small>максимально допустимо</small>
        </div>
        
        <div class="insight-card">
          <h6>📶 Протокол</h6>
          <div style="font-size: 1.5em; font-weight: bold;">
            ${protocolLatency[protocol].name}
          </div>
          <small>базова затримка: ${formatLatency(baseLatency)}</small>
        </div>
        
        <div class="insight-card success">
          <h6>🚀 Пропускна здатність</h6>
          <div style="font-size: 1.5em; font-weight: bold; color: #28a745;">
            ${throughputBps < 1000 ? throughputBps.toFixed(0) + ' біт/с' : 
              throughputBps < 1000000 ? (throughputBps/1000).toFixed(1) + ' кбіт/с' :
              (throughputBps/1000000).toFixed(2) + ' Мбіт/с'}
          </div>
          <small>${packetsPerSecond.toFixed(1)} пакетів/с</small>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Детальний аналіз затримки</h3>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📡 Параметри мережі</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Протокол:</strong> ${protocolLatency[protocol].name}</li>
            <li><strong>Відстань:</strong> ${distance} м</li>
            <li><strong>Розмір пакету:</strong> ${packetSize} байт</li>
            <li><strong>Навантаження:</strong> ${getLoadName(load)}</li>
            <li><strong>Якість сигналу:</strong> ${getSignalName(signal)}</li>
            ${hops > 0 ? `<li><strong>Кількість хопів:</strong> ${hops}</li>` : ''}
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>⚡ Розподіл затримки</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Базова затримка протоколу</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(baseLatency)}</td>
            </tr>
            ${distanceLatency > 0 ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Затримка через відстань</td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(distanceLatency)}</td>
            </tr>` : ''}
            ${packetLatency > 0 ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Затримка розміру пакету</td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(packetLatency)}</td>
            </tr>` : ''}
            ${hopsLatency > 0 ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Затримка mesh хопів</td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(hopsLatency)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Загальна затримка</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(totalLatency)}</td>
            </tr>
          </table>
        </div>

        <div style="background: ${rating.color}15; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border: 2px solid ${rating.color};">
          <h4 style="color: ${rating.color};">
            ${rating.icon} Оцінка для застосунку "${getApplicationName(application)}"
          </h4>
          <p style="font-size: 1.2em; margin: 0.5rem 0;">
            <strong>Затримка: ${formatLatency(totalLatency)}</strong> (вимога: ≤${formatLatency(requirement)})
          </p>
          ${totalLatency <= requirement ? 
            `<p style="margin: 0.5rem 0; color: #28a745;">✅ Затримка відповідає вимогам застосунку</p>` :
            totalLatency <= requirement * 2 ?
            `<p style="margin: 0.5rem 0; color: #ffc107;">⚠️ Затримка підвищена, але прийнятна</p>` :
            `<p style="margin: 0.5rem 0; color: #dc3545;">❌ Затримка перевищує вимоги - потрібна оптимізація</p>`
          }
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📈 Порівняння з іншими протоколами</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Протокол</strong></td>
              <td style="padding: 0.5rem; text-align: right;"><strong>Типова затримка</strong></td>
              <td style="padding: 0.5rem; text-align: right;"><strong>Підходить для</strong></td>
            </tr>
            ${Object.entries(protocolLatency).map(([key, value]) => `
            <tr style="border-bottom: 1px solid var(--border); ${key === protocol ? 'background: var(--accent)20;' : ''}">
              <td style="padding: 0.5rem;">${value.name} ${key === protocol ? '← Поточний' : ''}</td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(value.base)}</td>
              <td style="padding: 0.5rem; text-align: right;">
                ${value.base <= 10 ? 'Критичні застосунки' : 
                  value.base <= 100 ? 'Інтерактивні застосунки' : 
                  'Моніторинг та звіти'}
              </td>
            </tr>`).join('')}
          </table>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💡 Рекомендації з оптимізації</h4>
          <ul style="margin: 0.5rem 0;">
            ${totalLatency > requirement ? 
              `<li style="color: #dc3545;">🚨 <strong>Критично:</strong> Розгляньте зміну протоколу або архітектури</li>` : 
              `<li style="color: #28a745;">✅ Поточна конфігурація оптимальна</li>`
            }
            ${distance > 1000 && protocol !== 'lorawan' ? 
              '<li style="color: #f39c12;">📡 Зменште відстань до базової станції або додайте ретранслятори</li>' : ''
            }
            ${packetSize > 200 ? 
              '<li style="color: #007bff;">📦 Розгляньте стиснення даних або зменшення розміру пакетів</li>' : ''
            }
            ${load === 'high' ? 
              '<li style="color: #f39c12;">⚠️ Високе навантаження - розгляньте додаткові канали або QoS</li>' : ''
            }
            ${signal === 'poor' ? 
              '<li style="color: #dc3545;">📶 Покращіть якість сигналу: змініть позицію антени або додайте підсилювачі</li>' : ''
            }
            ${!document.getElementById('edge-computing').checked && totalLatency > 100 ? 
              '<li style="color: #007bff;">⚡ Впровадіть edge computing для зменшення затримки</li>' : ''
            }
            ${!document.getElementById('qos-enabled').checked && load !== 'low' ? 
              '<li style="color: #007bff;">🎯 Налаштуйте QoS для пріоритизації критичного трафіку</li>' : ''
            }
            <li>📊 Регулярно моніторьте реальну продуктивність мережі</li>
            <li>🔄 Використовуйте адаптивні алгоритми для динамічної оптимізації</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>🎯 Відповідність застосунку</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            ${Object.entries(appRequirements).map(([key, req]) => {
              const isGood = totalLatency <= req;
              return `
              <div style="padding: 1rem; border-radius: 8px; text-align: center; background: ${isGood ? '#f8fff9' : '#fff8f8'}; border: 1px solid ${isGood ? '#28a745' : '#dc3545'};">
                <div style="font-weight: bold; margin-bottom: 0.5rem;">${getApplicationName(key)}</div>
                <div style="color: ${isGood ? '#28a745' : '#dc3545'};">
                  ${isGood ? '✅ Підходить' : '❌ Не підходить'}
                </div>
                <small>Вимога: ≤${formatLatency(req)}</small>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  });
});