document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bath-vs-shower-form');
  const result = document.getElementById('bath-vs-shower-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const coldWaterRate = +form['cold-water-rate'].value;
    const hotWaterRate = +form['hot-water-rate'].value;
    const hotColdRatio = +form['hot-cold-ratio'].value / 100;
    const bathVolumeType = form['bath-volume'].value;
    const customBathVolume = +form['custom-bath-volume'].value;
    const bathFillLevel = +form['bath-fill-level'].value;
    const showerHeadType = +form['shower-head-type'].value;
    const showerDuration = +form['shower-duration'].value;
    const showerStyle = +form['shower-style'].value;
    const bathFrequency = +form['bath-frequency'].value;
    const showerFrequency = +form['shower-frequency'].value;
    const householdSize = +form['household-size'].value;
    const season = +form['season'].value;
    const heaterType = +form['heater-type'].value;

    // Validation
    if (!coldWaterRate || !hotWaterRate || !hotColdRatio || !bathVolumeType || 
        !bathFillLevel || !showerHeadType || !showerDuration || !showerStyle || 
        bathFrequency < 0 || !showerFrequency || !householdSize || !season || !heaterType) {
      result.innerHTML = '<p style="color:red;">Please fill in all required fields.</p>';
      return;
    }

    // Determine bath volume
    let bathVolume;
    if (bathVolumeType === 'custom') {
      if (!customBathVolume || customBathVolume < 80) {
        result.innerHTML = '<p style="color:red;">Please enter a valid bathtub volume (minimum 80 liters).</p>';
        return;
      }
      bathVolume = customBathVolume;
    } else {
      bathVolume = +bathVolumeType;
    }

    // Calculate actual water usage per session
    const bathWaterUsage = bathVolume * bathFillLevel; // liters per bath
    const showerWaterUsage = showerHeadType * showerDuration * showerStyle; // liters per shower

    // Calculate weekly usage per person
    const weeklyBathWater = bathWaterUsage * bathFrequency;
    const weeklyShowerWater = showerWaterUsage * showerFrequency;
    const totalWeeklyWater = weeklyBathWater + weeklyShowerWater;

    // Calculate monthly and yearly usage for household
    const monthlyHouseholdWater = (totalWeeklyWater * 4.33 * householdSize) / 1000; // cubic meters
    const yearlyHouseholdWater = monthlyHouseholdWater * 12;

    // Calculate water costs (considering hot/cold water ratio and seasonal adjustments)
    const coldWaterRatio = 1 - hotColdRatio;
    const adjustedHotRatio = hotColdRatio * season * heaterType;
    
    const costPerCubicMeter = (coldWaterRatio * coldWaterRate) + (adjustedHotRatio * hotWaterRate);
    
    // Monthly and yearly costs
    const monthlyCost = monthlyHouseholdWater * costPerCubicMeter;
    const yearlyCost = monthlyCost * 12;

    // Calculate alternative scenarios
    // Scenario 1: All baths (if currently taking some showers)
    const allBathsWeeklyWater = bathWaterUsage * (bathFrequency + showerFrequency);
    const allBathsMonthlyCost = ((allBathsWeeklyWater * 4.33 * householdSize) / 1000) * costPerCubicMeter;
    
    // Scenario 2: All showers (if currently taking some baths)
    const allShowersWeeklyWater = showerWaterUsage * (bathFrequency + showerFrequency);
    const allShowersMonthlyCost = ((allShowersWeeklyWater * 4.33 * householdSize) / 1000) * costPerCubicMeter;

    // Scenario 3: Optimized (short showers, occasional baths)
    const optimizedShowerWater = showerHeadType * 6 * 0.6; // 6-minute efficient shower
    const optimizedWeeklyWater = (optimizedShowerWater * (showerFrequency + bathFrequency - 1)) + (bathWaterUsage * 1); // mostly showers + 1 weekly bath
    const optimizedMonthlyCost = ((optimizedWeeklyWater * 4.33 * householdSize) / 1000) * costPerCubicMeter;

    // Calculate savings
    const bathVsShowerSavings = allBathsMonthlyCost - allShowersMonthlyCost;
    const currentVsOptimized = monthlyCost - optimizedMonthlyCost;

    // Environmental impact calculations
    const co2PerCubicMeter = 0.5; // kg CO2 per cubic meter (heating energy)
    const monthlyCO2 = monthlyHouseholdWater * co2PerCubicMeter * adjustedHotRatio;
    const yearlyCO2 = monthlyCO2 * 12;

    // Calculate time spent
    const weeklyBathTime = bathFrequency * 25; // assume 25 minutes per bath
    const weeklyShowerTime = showerFrequency * showerDuration;
    const totalWeeklyTime = weeklyBathTime + weeklyShowerTime;

    // Format helper functions
    const formatMoney = (amount) => `$${amount.toFixed(0)}`;
    const formatWater = (liters) => {
      if (liters >= 1000) {
        return `${(liters/1000).toFixed(1)} m³`;
      }
      return `${Math.round(liters)} L`;
    };
    const formatPercent = (ratio) => `${Math.round(ratio * 100)}%`;

    // Generate recommendations
    let recommendations = [];
    if (showerDuration > 10) {
      recommendations.push("💡 Reduce shower time to 8 minutes for significant savings");
    }
    if (showerHeadType > 15) {
      recommendations.push("🚿 Consider installing an efficient showerhead (6-9 L/min)");
    }
    if (bathFrequency > 3) {
      recommendations.push("🛁 Reduce bath frequency to 2-3 times per week");
    }
    if (hotColdRatio > 0.7) {
      recommendations.push("🌡️ Lower water temperature - 60-70% hot water is sufficient");
    }
    if (showerStyle > 1.0) {
      recommendations.push("💧 Turn off water while soaping to save 30-40%");
    }

    // Generate warnings
    let warnings = [];
    if (yearlyCost > 3000) {
      warnings.push("⚠️ High water costs: consider major habit changes");
    }
    if (monthlyHouseholdWater > 20) {
      warnings.push("⚠️ High water consumption: check for leaks");
    }
    if (bathFrequency > 5) {
      warnings.push("⚠️ Very frequent bathing may dry out skin");
    }

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Water Consumption Analysis: Bath vs Shower</h3>
        
        <div class="insight-card">
          <h4 style="margin-top:0;color:#157aff;">📊 Current Consumption</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin-bottom:20px;">
            <div style="text-align:center;background:#e3f2fd;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#1976d2;">
                ${formatWater(monthlyHouseholdWater * 1000)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Monthly consumption</p>
            </div>
            <div style="text-align:center;background:#e8f5e8;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#388e3c;">
                ${formatMoney(monthlyCost)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Monthly cost</p>
            </div>
            <div style="text-align:center;background:#fff3e0;padding:15px;border-radius:8px;">
              <div style="font-size:1.5em;font-weight:bold;color:#f57c00;">
                ${formatMoney(yearlyCost)}
              </div>
              <p style="margin:5px 0;font-size:0.9em;color:#666;">Annual cost</p>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">🔄 Option Comparison</h4>
          <div style="background:white;padding:15px;border-radius:6px;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8f9fa;">
                  <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Option</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Water/month</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Cost/month</th>
                  <th style="padding:10px;text-align:center;border-bottom:2px solid #dee2e6;">Savings</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;"><strong>Current consumption</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatWater(monthlyHouseholdWater * 1000)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatMoney(monthlyCost)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">—</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Only baths</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatWater(((allBathsWeeklyWater * 4.33 * householdSize)))}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatMoney(allBathsMonthlyCost)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;color:${allBathsMonthlyCost > monthlyCost ? 'red' : 'green'};">
                    ${allBathsMonthlyCost > monthlyCost ? '+' : ''}${formatMoney(allBathsMonthlyCost - monthlyCost)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;">Only showers</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatWater(((allShowersWeeklyWater * 4.33 * householdSize)))}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;">${formatMoney(allShowersMonthlyCost)}</td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;color:${allShowersMonthlyCost > monthlyCost ? 'red' : 'green'};">
                    ${allShowersMonthlyCost > monthlyCost ? '+' : ''}${formatMoney(allShowersMonthlyCost - monthlyCost)}
                  </td>
                </tr>
                <tr style="background:#e8f5e8;">
                  <td style="padding:10px;border-bottom:1px solid #dee2e6;"><strong>Optimized option</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatWater(((optimizedWeeklyWater * 4.33 * householdSize)))}</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;"><strong>${formatMoney(optimizedMonthlyCost)}</strong></td>
                  <td style="padding:10px;text-align:center;border-bottom:1px solid #dee2e6;color:green;"><strong>${formatMoney(currentVsOptimized)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#fd7e14;">💰 Potential Savings</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="background:#fff3cd;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#856404;margin-bottom:8px;">Monthly savings</div>
              <div style="font-size:1.4em;font-weight:bold;color:#856404;">${formatMoney(currentVsOptimized)}</div>
              <div style="color:#856404;font-size:0.9em;">with optimization</div>
            </div>
            <div style="background:#d1ecf1;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#0c5460;margin-bottom:8px;">Annual savings</div>
              <div style="font-size:1.4em;font-weight:bold;color:#0c5460;">${formatMoney(currentVsOptimized * 12)}</div>
              <div style="color:#0c5460;font-size:0.9em;">with optimization</div>
            </div>
            <div style="background:#f8d7da;padding:15px;border-radius:6px;text-align:center;">
              <div style="font-weight:bold;color:#721c24;margin-bottom:8px;">Shower vs Bath</div>
              <div style="font-size:1.4em;font-weight:bold;color:#721c24;">
                ${bathVsShowerSavings > 0 ? formatMoney(bathVsShowerSavings) : '$0'}
              </div>
              <div style="color:#721c24;font-size:0.9em;">
                ${bathVsShowerSavings > 0 ? 'shower savings' : 'bath cheaper'}
              </div>
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#6f42c1;">📈 Detailed Statistics</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;">
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Per session:</strong><br>
              🛁 Bath: ${formatWater(bathWaterUsage)}<br>
              🚿 Shower: ${formatWater(showerWaterUsage)}
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Weekly (1 person):</strong><br>
              🛁 Baths: ${formatWater(weeklyBathWater)}<br>
              🚿 Showers: ${formatWater(weeklyShowerWater)}
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Weekly time:</strong><br>
              🛁 Baths: ${weeklyBathTime} min<br>
              🚿 Showers: ${weeklyShowerTime} min<br>
              <strong>Total: ${totalWeeklyTime} min</strong>
            </div>
            <div style="background:#f8f9fa;padding:15px;border-radius:6px;">
              <strong>Water composition:</strong><br>
              🔥 Hot: ${formatPercent(hotColdRatio)}<br>
              ❄️ Cold: ${formatPercent(coldWaterRatio)}<br>
              💵 Avg price: $${costPerCubicMeter.toFixed(1)}/m³
            </div>
          </div>
        </div>

        <div class="insight-card">
          <h4 style="margin-top:0;color:#17a2b8;">🌱 Environmental Impact</h4>
          <div style="background:#d1ecf1;padding:15px;border-radius:6px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;">
              <div style="text-align:center;">
                <div style="font-size:1.2em;font-weight:bold;color:#0c5460;">${monthlyCO2.toFixed(1)} kg</div>
                <div style="color:#0c5460;font-size:0.9em;">CO₂ per month</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:1.2em;font-weight:bold;color:#0c5460;">${yearlyCO2.toFixed(0)} kg</div>
                <div style="color:#0c5460;font-size:0.9em;">CO₂ per year</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:1.2em;font-weight:bold;color:#0c5460;">${(yearlyHouseholdWater).toFixed(1)} m³</div>
                <div style="color:#0c5460;font-size:0.9em;">Water per year</div>
              </div>
            </div>
            <p style="color:#0c5460;margin-top:10px;font-size:0.9em;">
              💡 Optimizing water consumption will reduce your carbon footprint by ${(monthlyCO2 * 0.3).toFixed(1)} kg CO₂ per month
            </p>
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="insight-card">
          <h4 style="margin-top:0;color:#28a745;">💡 Savings Recommendations</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;">
            <ul style="margin:0;color:#155724;">
              ${recommendations.map(rec => `<li style="margin:8px 0;">${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
        ` : ''}

        ${warnings.length > 0 ? `
        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #ffc107;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Warnings</h4>
          <ul style="margin:0;color:#856404;">
            ${warnings.map(warning => `<li style="margin:5px 0;">${warning}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">📋 Action Plan for Savings</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div style="color:#383d41;">
              <strong>🚀 Quick actions (today):</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Reduce shower time to 6-8 minutes</li>
                <li>Turn off water while soaping</li>
                <li>Lower temperature by 2-3°C</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>🔧 Technical improvements:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Install efficient showerhead</li>
                <li>Check and fix leaks</li>
                <li>Consider thermostatic mixer</li>
              </ul>
            </div>
            <div style="color:#383d41;">
              <strong>🏠 Habit changes:</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Baths for relaxation (1-2 times/week)</li>
                <li>Showers for daily hygiene</li>
                <li>Teach family efficient habits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});