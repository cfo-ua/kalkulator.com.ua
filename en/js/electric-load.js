document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('electric-load-form');
  const addBtn = document.getElementById('add-appliance');
  const list = document.getElementById('electric-load-list');
  const result = document.getElementById('electric-load-result');

  function createRow() {
    const row = document.createElement('div');
    row.className = 'electric-load-row';
    row.innerHTML = `
      <button type="button" class="remove-appliance" title="Remove">–</button>
      <input type="text" class="electric-appliance" placeholder="Appliance name" />
      <input type="number" class="electric-power" min="0" step="any" placeholder="Power (watts)" />
    `;
    row.querySelector('.remove-appliance').onclick = function () {
      row.remove();
      // If no rows remain, add an empty one
      if (list.querySelectorAll('.electric-load-row').length === 0) {
        list.appendChild(createBaseRow());
      }
    };
    return row;
  }

  function createBaseRow() {
    // First row without remove button
    const row = document.createElement('div');
    row.className = 'electric-load-row';
    row.innerHTML = `
      <input type="text" class="electric-appliance" placeholder="Appliance name" />
      <input type="number" class="electric-power" min="0" step="any" placeholder="Power (watts)" />
    `;
    return row;
  }

  if (addBtn) {
    addBtn.onclick = function () {
      list.appendChild(createRow());
    };
  }

  // Initialize: remove button from first row if it exists
  (function initRows() {
    const firstRow = list.querySelector('.electric-load-row');
    if (firstRow) {
      const btn = firstRow.querySelector('.remove-appliance');
      if (btn) btn.remove();
    }
  })();

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const powers = Array.from(list.querySelectorAll('.electric-power'));
      const names = Array.from(list.querySelectorAll('.electric-appliance'));
      let totalWatts = 0;
      let validAppliances = [];
      let applianceCount = 0;
      
      powers.forEach((input, index) => {
        const power = parseFloat(input.value);
        const name = names[index].value.trim();
        if (power > 0) {
          totalWatts += power;
          validAppliances.push({ name: name || `Appliance ${index + 1}`, power: power });
          applianceCount++;
        }
      });
      
      const diversityFactor = parseFloat(document.getElementById('electric-simultaneous').value) || 1;
      
      if (applianceCount === 0) {
        result.textContent = "Please enter power consumption for at least one appliance.";
        return;
      }
      
      const demandLoad = totalWatts * diversityFactor;
      const demandKW = demandLoad / 1000;
      
      // Calculate suggested electrical service size
      let serviceSize = 100;
      if (demandLoad > 48000) serviceSize = 400;
      else if (demandLoad > 36000) serviceSize = 200;
      else if (demandLoad > 24000) serviceSize = 150;
      
      // Calculate estimated monthly cost (average $0.12/kWh, 720 hours/month)
      const monthlyKWh = demandKW * 720 * (diversityFactor * 0.3); // 30% average usage
      const monthlyCost = monthlyKWh * 0.12;
      
      // Create appliance list for display
      const applianceList = validAppliances
        .map(app => `<li>${app.name}: ${app.power.toLocaleString()} watts</li>`)
        .join('');
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Electrical Load Calculation:</h4>
          <p><strong>Connected Load:</strong> ${totalWatts.toLocaleString()} watts</p>
          <p><strong>Demand Load:</strong> ${Math.round(demandLoad).toLocaleString()} watts (${demandKW.toFixed(1)} kW)</p>
          <p><strong>Diversity Factor:</strong> ${(diversityFactor * 100).toFixed(0)}%</p>
        </div>
        <div class="result-recommendations">
          <h4>Electrical Service Recommendations:</h4>
          <p><strong>Suggested Panel Size:</strong> ${serviceSize} amp service</p>
          <p><strong>Service Capacity:</strong> ${(serviceSize * 240 / 1000).toFixed(0)} kW maximum</p>
          <p><strong>Safety Factor:</strong> ${((serviceSize * 240 - demandLoad) / 1000).toFixed(1)} kW available</p>
        </div>
        <div class="result-appliances">
          <h4>Appliances Listed (${applianceCount}):</h4>
          <ul>${applianceList}</ul>
        </div>
        <div class="result-cost">
          <h4>Estimated Operating Cost:</h4>
          <p>Monthly electricity: ~$${monthlyCost.toFixed(0)} (at $0.12/kWh)</p>
          <p>Annual electricity: ~$${(monthlyCost * 12).toFixed(0)}</p>
        </div>
        <div class="result-tips">
          <p><em>⚡ Always consult a licensed electrician for actual installations</em></p>
          <p><em>📋 Follow local electrical codes and permit requirements</em></p>
          <p><em>🔧 Consider future needs when sizing electrical service</em></p>
        </div>
      `;
    });
  }
});