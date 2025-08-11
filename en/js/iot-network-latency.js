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
    if (ms < 1000) return ms.toFixed(1) + ' ms';
    return (ms / 1000).toFixed(2) + ' sec';
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
      critical: 'Critical Application',
      interactive: 'Interactive Application',
      monitoring: 'Real-time Monitoring',
      periodic: 'Periodic Reports'
    };
    return names[appType];
  }

  function getLoadName(load) {
    const names = {
      low: 'Low Load',
      medium: 'Medium Load',
      high: 'High Load'
    };
    return names[load];
  }

  function getSignalName(signal) {
    const names = {
      excellent: 'Excellent Signal Quality',
      good: 'Good Signal Quality',
      fair: 'Fair Signal Quality',
      poor: 'Poor Signal Quality'
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
          <h6>⚡ Total Latency</h6>
          <div style="font-size: 2em; font-weight: bold; color: ${rating.color};">
            ${formatLatency(totalLatency)}
          </div>
          <small>${rating.icon} ${rating.rating.toUpperCase()}</small>
        </div>
        
        <div class="insight-card info">
          <h6>🎯 App Requirement</h6>
          <div style="font-size: 1.8em; font-weight: bold; color: var(--accent);">
            ${formatLatency(requirement)}
          </div>
          <small>maximum acceptable</small>
        </div>
        
        <div class="insight-card">
          <h6>📶 Protocol</h6>
          <div style="font-size: 1.5em; font-weight: bold;">
            ${protocolLatency[protocol].name}
          </div>
          <small>base latency: ${formatLatency(baseLatency)}</small>
        </div>
        
        <div class="insight-card success">
          <h6>🚀 Throughput</h6>
          <div style="font-size: 1.5em; font-weight: bold; color: #28a745;">
            ${throughputBps < 1000 ? throughputBps.toFixed(0) + ' bps' : 
              throughputBps < 1000000 ? (throughputBps/1000).toFixed(1) + ' kbps' :
              (throughputBps/1000000).toFixed(2) + ' Mbps'}
          </div>
          <small>${packetsPerSecond.toFixed(1)} packets/sec</small>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Detailed Latency Analysis</h3>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📡 Network Parameters</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Protocol:</strong> ${protocolLatency[protocol].name}</li>
            <li><strong>Distance:</strong> ${distance} m</li>
            <li><strong>Packet size:</strong> ${packetSize} bytes</li>
            <li><strong>Network load:</strong> ${getLoadName(load)}</li>
            <li><strong>Signal quality:</strong> ${getSignalName(signal)}</li>
            ${hops > 0 ? `<li><strong>Number of hops:</strong> ${hops}</li>` : ''}
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>⚡ Latency Breakdown</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Protocol base latency</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(baseLatency)}</td>
            </tr>
            ${distanceLatency > 0 ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Distance latency</td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(distanceLatency)}</td>
            </tr>` : ''}
            ${packetLatency > 0 ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Packet size latency</td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(packetLatency)}</td>
            </tr>` : ''}
            ${hopsLatency > 0 ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Mesh hop latency</td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(hopsLatency)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Total latency</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(totalLatency)}</td>
            </tr>
          </table>
        </div>

        <div style="background: ${rating.color}15; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border: 2px solid ${rating.color};">
          <h4 style="color: ${rating.color};">
            ${rating.icon} Assessment for "${getApplicationName(application)}"
          </h4>
          <p style="font-size: 1.2em; margin: 0.5rem 0;">
            <strong>Latency: ${formatLatency(totalLatency)}</strong> (requirement: ≤${formatLatency(requirement)})
          </p>
          ${totalLatency <= requirement ? 
            `<p style="margin: 0.5rem 0; color: #28a745;">✅ Latency meets application requirements</p>` :
            totalLatency <= requirement * 2 ?
            `<p style="margin: 0.5rem 0; color: #ffc107;">⚠️ Latency is elevated but acceptable</p>` :
            `<p style="margin: 0.5rem 0; color: #dc3545;">❌ Latency exceeds requirements - optimization needed</p>`
          }
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📈 Protocol Comparison</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Protocol</strong></td>
              <td style="padding: 0.5rem; text-align: right;"><strong>Typical Latency</strong></td>
              <td style="padding: 0.5rem; text-align: right;"><strong>Best For</strong></td>
            </tr>
            ${Object.entries(protocolLatency).map(([key, value]) => `
            <tr style="border-bottom: 1px solid var(--border); ${key === protocol ? 'background: var(--accent)20;' : ''}">
              <td style="padding: 0.5rem;">${value.name} ${key === protocol ? '← Current' : ''}</td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(value.base)}</td>
              <td style="padding: 0.5rem; text-align: right;">
                ${value.base <= 10 ? 'Critical applications' : 
                  value.base <= 100 ? 'Interactive applications' : 
                  'Monitoring & reporting'}
              </td>
            </tr>`).join('')}
          </table>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💡 Optimization Recommendations</h4>
          <ul style="margin: 0.5rem 0;">
            ${totalLatency > requirement ? 
              `<li style="color: #dc3545;">🚨 <strong>Critical:</strong> Consider protocol change or architecture redesign</li>` : 
              `<li style="color: #28a745;">✅ Current configuration is optimal</li>`
            }
            ${distance > 1000 && protocol !== 'lorawan' ? 
              '<li style="color: #f39c12;">📡 Reduce distance to base station or add repeaters</li>' : ''
            }
            ${packetSize > 200 ? 
              '<li style="color: #007bff;">📦 Consider data compression or reducing packet sizes</li>' : ''
            }
            ${load === 'high' ? 
              '<li style="color: #f39c12;">⚠️ High load - consider additional channels or QoS</li>' : ''
            }
            ${signal === 'poor' ? 
              '<li style="color: #dc3545;">📶 Improve signal quality: reposition antennas or add amplifiers</li>' : ''
            }
            ${!document.getElementById('edge-computing').checked && totalLatency > 100 ? 
              '<li style="color: #007bff;">⚡ Implement edge computing to reduce latency</li>' : ''
            }
            ${!document.getElementById('qos-enabled').checked && load !== 'low' ? 
              '<li style="color: #007bff;">🎯 Configure QoS to prioritize critical traffic</li>' : ''
            }
            <li>📊 Regularly monitor real network performance</li>
            <li>🔄 Use adaptive algorithms for dynamic optimization</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>🎯 Application Suitability</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            ${Object.entries(appRequirements).map(([key, req]) => {
              const isGood = totalLatency <= req;
              return `
              <div style="padding: 1rem; border-radius: 8px; text-align: center; background: ${isGood ? '#f8fff9' : '#fff8f8'}; border: 1px solid ${isGood ? '#28a745' : '#dc3545'};">
                <div style="font-weight: bold; margin-bottom: 0.5rem;">${getApplicationName(key)}</div>
                <div style="color: ${isGood ? '#28a745' : '#dc3545'};">
                  ${isGood ? '✅ Suitable' : '❌ Not suitable'}
                </div>
                <small>Requirement: ≤${formatLatency(req)}</small>
              </div>`;
            }).join('')}
          </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📊 Performance Insights</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Round-trip time (RTT)</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatLatency(totalLatency * 2)}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Packets per second</td>
              <td style="padding: 0.5rem; text-align: right;">${packetsPerSecond.toFixed(1)}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Effective data rate</td>
              <td style="padding: 0.5rem; text-align: right;">
                ${throughputBps < 1000 ? throughputBps.toFixed(0) + ' bps' : 
                  throughputBps < 1000000 ? (throughputBps/1000).toFixed(1) + ' kbps' :
                  (throughputBps/1000000).toFixed(2) + ' Mbps'}
              </td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Network efficiency</td>
              <td style="padding: 0.5rem; text-align: right;">
                ${totalLatency <= requirement ? 'High' : 
                  totalLatency <= requirement * 2 ? 'Medium' : 'Low'}
              </td>
            </tr>
          </table>
        </div>
      </div>
    `;
  });
});