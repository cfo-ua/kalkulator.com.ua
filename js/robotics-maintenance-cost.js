document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('robotics-maintenance-form');
  const result = document.getElementById('maintenance-result');

  // Maintenance cost factors by robot type (% of robot cost annually)
  const robotTypeFactors = {
    articulated: { base: 0.08, complexity: 1.2 },    // 8% base, higher complexity
    delta: { base: 0.06, complexity: 0.9 },          // 6% base, simpler design
    scara: { base: 0.07, complexity: 1.0 },          // 7% base, moderate complexity
    collaborative: { base: 0.05, complexity: 0.8 },  // 5% base, newer design
    mobile: { base: 0.10, complexity: 1.4 },         // 10% base, moving parts
    welding: { base: 0.12, complexity: 1.5 }         // 12% base, harsh environment
  };

  // Environment impact multipliers
  const environmentFactors = {
    normal: 1.0,
    dusty: 1.3,
    humid: 1.2,
    extreme: 1.6
  };

  // Workload impact multipliers
  const workloadFactors = {
    light: 0.8,
    moderate: 1.0,
    heavy: 1.4
  };

  // Age-based multipliers (maintenance costs increase with age)
  function getAgeFactor(age) {
    if (age <= 2) return 0.7;
    if (age <= 5) return 1.0;
    if (age <= 8) return 1.3;
    if (age <= 12) return 1.7;
    return 2.2; // Very old robots
  }

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatPercent(percent) {
    return percent.toFixed(1) + '%';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const robotCost = parseFloat(document.getElementById('robot-cost').value);
    const robotCount = parseInt(document.getElementById('robot-count').value);
    const robotType = document.querySelector('input[name="robot-type"]:checked').value;
    const dailyHours = parseInt(document.getElementById('daily-hours').value);
    const workingDays = parseInt(document.getElementById('working-days').value);
    const environment = document.querySelector('input[name="environment"]:checked').value;
    const workload = document.querySelector('input[name="workload"]:checked').value;
    const downtimeCost = parseFloat(document.getElementById('downtime-cost').value);
    const robotAge = parseInt(document.getElementById('robot-age').value);
    const calculationYears = parseInt(document.getElementById('calculation-years').value);

    // Additional factors
    const serviceContract = document.getElementById('service-contract').checked;
    const sparePartsStock = document.getElementById('spare-parts-stock').checked;
    const staffTraining = document.getElementById('staff-training').checked;
    const preventivePlus = document.getElementById('preventive-plus').checked;

    // Calculate basic metrics
    const totalRobotValue = robotCost * robotCount;
    const annualHours = dailyHours * workingDays;
    const utilizationRate = annualHours / (24 * 365); // Utilization as fraction of year

    // Get factors
    const typeData = robotTypeFactors[robotType];
    const envFactor = environmentFactors[environment];
    const workloadFactor = workloadFactors[workload];
    const ageFactor = getAgeFactor(robotAge);
    const utilizationFactor = 0.5 + (utilizationRate * 0.8); // Base 50% + utilization impact

    // Calculate annual maintenance costs
    const baseMaintenancePct = typeData.base * envFactor * workloadFactor * ageFactor * utilizationFactor;
    const plannedMaintenance = totalRobotValue * baseMaintenancePct;
    
    // Unplanned maintenance (typically 40-60% of planned)
    const unplannedMaintenance = plannedMaintenance * 0.5 * typeData.complexity;
    
    // Software and licensing (2-3% annually)
    const softwareCosts = totalRobotValue * 0.025;

    // Training costs (one-time if selected)
    const trainingCosts = staffTraining ? (robotCount * 2000) : 0;

    // Spare parts stock (one-time if selected)
    const sparePartsCosts = sparePartsStock ? (totalRobotValue * 0.02) : 0;

    // Service contract (annual if selected)
    const serviceContractCosts = serviceContract ? (totalRobotValue * 0.03) : 0;

    // Enhanced preventive maintenance
    const preventiveEnhancement = preventivePlus ? (plannedMaintenance * 0.5) : 0;

    // Downtime calculations
    // Estimate downtime hours per year based on robot type and conditions
    let estimatedDowntimeHours = typeData.base * 40; // Base hours per year
    estimatedDowntimeHours *= envFactor * workloadFactor * ageFactor;
    estimatedDowntimeHours *= robotCount;
    
    const downtimeCosts = estimatedDowntimeHours * downtimeCost;

    // Calculate totals
    const annualPlannedCosts = plannedMaintenance + preventiveEnhancement;
    const annualUnplannedCosts = unplannedMaintenance + downtimeCosts;
    const annualRecurringCosts = annualPlannedCosts + annualUnplannedCosts + softwareCosts + serviceContractCosts;
    const oneTimeCosts = trainingCosts + sparePartsCosts;

    const totalAnnualCosts = annualRecurringCosts;
    const totalPeriodCosts = (totalAnnualCosts * calculationYears) + oneTimeCosts;

    // Calculate percentages
    const maintenancePctOfValue = (totalAnnualCosts / totalRobotValue) * 100;

    // Robot type names for display
    const robotTypeNames = {
      articulated: 'Шестивісний робот',
      delta: 'Дельта-робот',
      scara: 'SCARA робот',
      collaborative: 'Колаборативний робот',
      mobile: 'Мобільний робот (AGV)',
      welding: 'Зварювальний робот'
    };

    const environmentNames = {
      normal: 'Нормальні умови',
      dusty: 'Запилене середовище',
      humid: 'Підвищена вологість',
      extreme: 'Екстремальні умови'
    };

    const workloadNames = {
      light: 'Легке навантаження',
      moderate: 'Помірне навантаження',
      heavy: 'Важке навантаження'
    };

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card warning">
          <h6>💰 Річні витрати</h6>
          <div style="font-size: 2em; font-weight: bold; color: #f39c12;">
            ${formatCurrency(totalAnnualCosts)}
          </div>
          <small>${formatPercent(maintenancePctOfValue)} від вартості</small>
        </div>
        
        <div class="insight-card info">
          <h6>⏰ Простої</h6>
          <div style="font-size: 1.8em; font-weight: bold; color: var(--accent);">
            ${estimatedDowntimeHours.toFixed(0)} годин
          </div>
          <small>на рік для всіх роботів</small>
        </div>
        
        <div class="insight-card">
          <h6>🔧 Планове обслуговування</h6>
          <div style="font-size: 1.5em; font-weight: bold;">
            ${formatCurrency(annualPlannedCosts)}
          </div>
          <small>щорічно</small>
        </div>
        
        <div class="insight-card success">
          <h6>📊 Загальні витрати</h6>
          <div style="font-size: 1.5em; font-weight: bold; color: #28a745;">
            ${formatCurrency(totalPeriodCosts)}
          </div>
          <small>за ${calculationYears} років</small>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📊 Детальний розрахунок</h3>
        
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>🤖 Параметри обладнання</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Тип робота:</strong> ${robotTypeNames[robotType]}</li>
            <li><strong>Кількість:</strong> ${robotCount} шт.</li>
            <li><strong>Загальна вартість:</strong> ${formatCurrency(totalRobotValue)}</li>
            <li><strong>Вік обладнання:</strong> ${robotAge} років</li>
            <li><strong>Щорічна експлуатація:</strong> ${annualHours.toLocaleString()} годин (${formatPercent(utilizationRate * 100)} завантаження)</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>🏭 Умови експлуатації</h4>
          <ul style="margin: 0.5rem 0;">
            <li><strong>Середовище:</strong> ${environmentNames[environment]} (коефіцієнт ${envFactor})</li>
            <li><strong>Навантаження:</strong> ${workloadNames[workload]} (коефіцієнт ${workloadFactor})</li>
            <li><strong>Вплив віку:</strong> коефіцієнт ${ageFactor}</li>
            <li><strong>Вартість простою:</strong> ${formatCurrency(downtimeCost)}/година</li>
          </ul>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💰 Структура річних витрат</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Планове обслуговування</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(plannedMaintenance)}</td>
            </tr>
            ${preventivePlus ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Розширене профілактичне обслуговування</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(preventiveEnhancement)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Позапланові ремонти</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(unplannedMaintenance)}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;"><strong>Втрати від простоїв</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(downtimeCosts)}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Програмне забезпечення</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(softwareCosts)}</td>
            </tr>
            ${serviceContract ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Сервісний контракт</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(serviceContractCosts)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Загальні річні витрати</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totalAnnualCosts)}</td>
            </tr>
          </table>
        </div>

        ${oneTimeCosts > 0 ? `
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💵 Одноразові витрати</h4>
          <table style="width: 100%; border-collapse: collapse;">
            ${staffTraining ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Навчання персоналу</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(trainingCosts)}</td>
            </tr>` : ''}
            ${sparePartsStock ? `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">Запас запчастин</td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(sparePartsCosts)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Загальні одноразові витрати</strong></td>
              <td style="padding: 0.5rem; text-align: right;">${formatCurrency(oneTimeCosts)}</td>
            </tr>
          </table>
        </div>` : ''}

        <div style="background: ${maintenancePctOfValue <= 10 ? '#f8fff9' : maintenancePctOfValue <= 15 ? '#fff8e1' : '#fff8f8'}; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border: 2px solid ${maintenancePctOfValue <= 10 ? '#28a745' : maintenancePctOfValue <= 15 ? '#ffc107' : '#dc3545'};">
          <h4 style="color: ${maintenancePctOfValue <= 10 ? '#28a745' : maintenancePctOfValue <= 15 ? '#f39c12' : '#dc3545'};">
            ${maintenancePctOfValue <= 10 ? '✅' : maintenancePctOfValue <= 15 ? '⚠️' : '🚨'} Аналіз витрат за ${calculationYears} років
          </h4>
          <p style="font-size: 1.2em; margin: 0.5rem 0;">
            <strong>Загальні витрати: ${formatCurrency(totalPeriodCosts)}</strong>
          </p>
          <p style="margin: 0.5rem 0;">
            Річні витрати на обслуговування: <strong>${formatPercent(maintenancePctOfValue)}</strong> від вартості обладнання
          </p>
          <p style="margin: 0.5rem 0;">
            Середні місячні витрати: <strong>${formatCurrency(totalAnnualCosts / 12)}</strong>
          </p>
          ${maintenancePctOfValue <= 10 ? 
            `<p style="margin: 0.5rem 0; color: #28a745;">💡 Відмінний рівень витрат! Обладнання ефективно експлуатується.</p>` :
            maintenancePctOfValue <= 15 ?
            `<p style="margin: 0.5rem 0; color: #f39c12;">⚠️ Помірні витрати. Розгляньте можливості оптимізації.</p>` :
            `<p style="margin: 0.5rem 0; color: #dc3545;">🚨 Високі витрати! Потрібен аналіз причин та план оптимізації.</p>`
          }
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>📈 Прогноз по роках</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 2px solid var(--border); font-weight: bold;">
              <td style="padding: 0.5rem;"><strong>Рік</strong></td>
              <td style="padding: 0.5rem; text-align: right;"><strong>Річні витрати</strong></td>
              <td style="padding: 0.5rem; text-align: right;"><strong>Накопичені витрати</strong></td>
            </tr>
            ${Array.from({length: calculationYears}, (_, i) => {
              const year = i + 1;
              const yearlyMultiplier = 1 + (i * 0.03); // 3% annual increase
              const yearlyCost = totalAnnualCosts * yearlyMultiplier;
              const cumulativeCost = oneTimeCosts + (totalAnnualCosts * year * (1 + (i * 0.015)));
              return `
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 0.5rem;">Рік ${year}</td>
                <td style="padding: 0.5rem; text-align: right;">${formatCurrency(yearlyCost)}</td>
                <td style="padding: 0.5rem; text-align: right;">${formatCurrency(cumulativeCost)}</td>
              </tr>`;
            }).join('')}
          </table>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
          <h4>💡 Рекомендації</h4>
          <ul style="margin: 0.5rem 0;">
            ${estimatedDowntimeHours > 50 ? 
              '<li style="color: #dc3545;">🚨 Високий рівень простоїв. Розгляньте покращення планового обслуговування.</li>' : 
              '<li style="color: #28a745;">✅ Прийнятний рівень простоїв.</li>'
            }
            ${maintenancePctOfValue > 15 ? 
              '<li style="color: #f39c12;">⚠️ Розгляньте модернізацію або заміну застарілого обладнання.</li>' : 
              '<li style="color: #28a745;">✅ Рентабельне обслуговування.</li>'
            }
            ${!serviceContract && totalRobotValue > 100000 ? 
              '<li style="color: #007bff;">💡 Для дорогого обладнання розгляньте сервісний контракт.</li>' : ''
            }
            ${!preventivePlus && maintenancePctOfValue > 12 ? 
              '<li style="color: #007bff;">💡 Розширене профілактичне обслуговування може зменшити загальні витрати.</li>' : ''
            }
            <li>📊 Ведіть детальну статистику відмов для оптимізації графіків обслуговування.</li>
            <li>🎓 Регулярно навчайте персонал для раннього виявлення проблем.</li>
          </ul>
        </div>
      </div>
    `;
  });
});