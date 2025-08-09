document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("startup-cost-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Одноразові витрати
    const legalCosts = parseFloat(document.getElementById("legalCosts").value) || 0;
    const techInfrastructure = parseFloat(document.getElementById("techInfrastructure").value) || 0;
    const officeSetup = parseFloat(document.getElementById("officeSetup").value) || 0;
    const initialMarketing = parseFloat(document.getElementById("initialMarketing").value) || 0;
    const professionalServices = parseFloat(document.getElementById("professionalServices").value) || 0;

    // Щомісячні витрати
    const monthlyPersonnel = parseFloat(document.getElementById("monthlyPersonnel").value) || 0;
    const monthlyTechnology = parseFloat(document.getElementById("monthlyTechnology").value) || 0;
    const monthlyOffice = parseFloat(document.getElementById("monthlyOffice").value) || 0;
    const monthlyMarketing = parseFloat(document.getElementById("monthlyMarketing").value) || 0;
    const monthlyAdmin = parseFloat(document.getElementById("monthlyAdmin").value) || 0;

    // Параметри планування
    const runwayMonths = parseInt(document.getElementById("runwayMonths").value) || 18;
    const contingencyPercent = parseFloat(document.getElementById("contingencyPercent").value) || 15;

    // Розрахунки
    const totalOneTimeCosts = legalCosts + techInfrastructure + officeSetup + initialMarketing + professionalServices;
    const monthlyOperatingCosts = monthlyPersonnel + monthlyTechnology + monthlyOffice + monthlyMarketing + monthlyAdmin;
    const totalOperatingCosts = monthlyOperatingCosts * runwayMonths;
    const subtotalCosts = totalOneTimeCosts + totalOperatingCosts;
    const contingencyAmount = subtotalCosts * (contingencyPercent / 100);
    const totalFundingNeeded = subtotalCosts + contingencyAmount;
    const burnRate = monthlyOperatingCosts;
    const actualRunway = totalFundingNeeded / monthlyOperatingCosts;

    // Відсотки за категоріями
    const personnelPercent = ((monthlyPersonnel * runwayMonths) / subtotalCosts * 100).toFixed(1);
    const technologyPercent = (((techInfrastructure + monthlyTechnology * runwayMonths) / subtotalCosts) * 100).toFixed(1);
    const marketingPercent = (((initialMarketing + monthlyMarketing * runwayMonths) / subtotalCosts) * 100).toFixed(1);

    // Форматування для відображення
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    const formatNumber = (number, decimals = 1) => {
      return new Intl.NumberFormat('uk-UA', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(number);
    };

    // Результати з insight-card дизайном
    document.getElementById("startup-cost-result").innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>💰 Загальне фінансування</h6>
          <div class="big-number">${formatCurrency(totalFundingNeeded)}</div>
          <p>Потрібно для запуску</p>
        </div>
        
        <div class="insight-card info">
          <h6>🔥 Щомісячний burn rate</h6>
          <div class="big-number">${formatCurrency(burnRate)}</div>
          <p>Операційні витрати</p>
        </div>
        
        <div class="insight-card warning">
          <h6>⏱️ Фактичний runway</h6>
          <div class="big-number">${formatNumber(actualRunway, 1)}</div>
          <p>місяців</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h4>📊 Детальна розбивка витрат</h4>
        
        <div class="insight-cards">
          <div class="insight-card">
            <h6>🏗️ Одноразові витрати</h6>
            <div class="result-value">${formatCurrency(totalOneTimeCosts)}</div>
            <small>
              • Юридичне оформлення: ${formatCurrency(legalCosts)}<br>
              • Технологічна інфраструктура: ${formatCurrency(techInfrastructure)}<br>
              • Облаштування офісу: ${formatCurrency(officeSetup)}<br>
              • Початковий маркетинг: ${formatCurrency(initialMarketing)}<br>
              • Професійні послуги: ${formatCurrency(professionalServices)}
            </small>
          </div>
          
          <div class="insight-card">
            <h6>🔄 Операційні витрати</h6>
            <div class="result-value">${formatCurrency(totalOperatingCosts)}</div>
            <small>
              • Персонал: ${formatCurrency(monthlyPersonnel * runwayMonths)} (${personnelPercent}%)<br>
              • Технології: ${formatCurrency(monthlyTechnology * runwayMonths)}<br>
              • Офіс: ${formatCurrency(monthlyOffice * runwayMonths)}<br>
              • Маркетинг: ${formatCurrency(monthlyMarketing * runwayMonths)}<br>
              • Адміністрування: ${formatCurrency(monthlyAdmin * runwayMonths)}
            </small>
          </div>
          
          <div class="insight-card warning">
            <h6>🛡️ Буфер на непередбачені витрати</h6>
            <div class="result-value">${formatCurrency(contingencyAmount)}</div>
            <small>${contingencyPercent}% від загальних витрат</small>
          </div>
        </div>

        <div style="margin-top: 1.5rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid var(--accent);">
          <h5>💡 Рекомендації для оптимізації:</h5>
          <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
            ${personnelPercent > 75 ? '<li>🔍 Розгляньте зменшення витрат на персонал або поетапне наймання</li>' : ''}
            ${monthlyMarketing < monthlyPersonnel * 0.1 ? '<li>📈 Можливо варто збільшити бюджет на маркетинг для швидшого зростання</li>' : ''}
            ${runwayMonths < 12 ? '<li>⚠️ Runway менше 12 місяців може бути ризикованим - розгляньте збільшення фінансування</li>' : ''}
            ${contingencyPercent < 10 ? '<li>🛡️ Розгляньте збільшення буферу до 15-20% для більшої безпеки</li>' : ''}
            <li>💰 Почніть пошук інвестицій коли залишиться 9-12 місяців runway</li>
            <li>📊 Відстежуйте фактичні витрати vs прогнозовані щомісячно</li>
          </ul>
        </div>
      </div>
    `;

    // Показати блок з графіком
    const chartBlock = document.getElementById("startup-cost-chart-block");
    if (chartBlock) {
      chartBlock.style.display = "block";
      createCashFlowChart(runwayMonths, monthlyOperatingCosts, totalOneTimeCosts);
    }
  });

  function createCashFlowChart(months, monthlyBurn, initialCosts) {
    const canvas = document.getElementById("startup-cost-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    // Очистити попередній графік
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Налаштування canvas - responsive height from container
    const width = canvas.offsetWidth;
    const container = canvas.parentElement;
    const height = container ? container.offsetHeight - 40 : Math.min(340, Math.max(168, width * 0.4));
    canvas.width = width;
    canvas.height = height;
    
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Дані для графіку
    const data = [];
    let cumulativeCash = initialCosts + (monthlyBurn * months);
    
    for (let i = 0; i <= months; i++) {
      data.push({
        month: i,
        cash: cumulativeCash - (monthlyBurn * i)
      });
    }
    
    const maxCash = Math.max(...data.map(d => d.cash));
    const minCash = Math.min(...data.map(d => d.cash));
    
    // Функції для перетворення координат
    const xScale = (month) => padding + (month / months) * chartWidth;
    const yScale = (cash) => padding + (1 - (cash - minCash) / (maxCash - minCash)) * chartHeight;
    
    // Малювання сітки
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    
    // Вертикальні лінії
    for (let i = 0; i <= months; i += 3) {
      ctx.beginPath();
      ctx.moveTo(xScale(i), padding);
      ctx.lineTo(xScale(i), height - padding);
      ctx.stroke();
    }
    
    // Горизонтальні лінії
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Малювання лінії cash flow
    ctx.strokeStyle = '#157aff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = xScale(point.month);
      const y = yScale(point.cash);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Область під лінією
    ctx.fillStyle = 'rgba(21, 122, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(0));
    data.forEach(point => {
      ctx.lineTo(xScale(point.month), yScale(point.cash));
    });
    ctx.lineTo(xScale(months), yScale(0));
    ctx.closePath();
    ctx.fill();
    
    // Підписи осей
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Підписи місяців
    for (let i = 0; i <= months; i += 3) {
      ctx.fillText(`${i}м`, xScale(i), height - 20);
    }
    
    // Підписи грошових сум
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const cash = minCash + (i / 5) * (maxCash - minCash);
      const formattedCash = (cash / 1000000).toFixed(1) + 'М';
      ctx.fillText(formattedCash, padding - 10, padding + (5 - i) / 5 * chartHeight + 5);
    }
    
    // Заголовки осей
    ctx.textAlign = 'center';
    ctx.fillText('Місяці', width / 2, height - 5);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Залишок коштів (грн)', 0, 0);
    ctx.restore();
  }
});