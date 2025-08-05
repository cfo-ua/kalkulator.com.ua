document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("expiry-form");
  const result = document.getElementById("expiry-result");
  
  // Set default production date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("production-date").value = today;

  // Storage tips for different product types
  const storageTips = {
    dairy: "🥛 Зберігайте в холодильнику при температурі +2-6°C. Не залишайте при кімнатній температурі більше 2 годин.",
    meat: "🥩 Зберігайте в найхолоднішій частині холодильника при 0-4°C. Використовуйте або заморозьте якомога швидше.",
    vegetables: "🥕 Більшість овочів зберігайте в холодильнику, фрукти — при кімнатній температурі до дозрівання.",
    bakery: "🍞 Зберігайте в сухому місці при кімнатній температурі, хліб можна заморозити для тривалого зберігання.",
    canned: "🥫 Зберігайте в прохолодному, сухому місці, уникайте прямих сонячних променів.",
    frozen: "❄️ Тримайте в морозильній камері при -18°C або нижче, уникайте повторного заморожування."
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const productionDate = new Date(document.getElementById("production-date").value);
    const shelfLifeDays = parseInt(document.getElementById("shelf-life").value);
    const productType = document.getElementById("product-type").value;

    if (isNaN(productionDate) || isNaN(shelfLifeDays) || shelfLifeDays < 1) {
      result.innerHTML = `
        <div class="insight-card warning">
          <h6>❌ Помилка</h6>
          <p>Будь ласка, введіть коректні дати та термін зберігання.</p>
        </div>
      `;
      return;
    }

    // Calculate expiry date
    const expiryDate = new Date(productionDate);
    expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);
    
    // Calculate days remaining
    const today = new Date();
    const timeDiff = expiryDate - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // Determine status and color
    let status, statusClass, statusIcon, statusText;
    if (daysRemaining > 3) {
      status = "fresh";
      statusClass = "success";
      statusIcon = "✅";
      statusText = "Продукт свіжий";
    } else if (daysRemaining > 0) {
      status = "warning";
      statusClass = "warning";
      statusIcon = "⚠️";
      statusText = "Увага! Термін закінчується";
    } else {
      status = "expired";
      statusClass = "warning";
      statusIcon = "❌";
      statusText = "Термін придатності сплив";
    }

    // Format dates for display
    const productionDateStr = productionDate.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const expiryDateStr = expiryDate.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get storage tip if product type is selected
    const storageTip = productType ? storageTips[productType] : "";

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${statusClass}">
          <h6>${statusIcon} Статус свіжості</h6>
          <div class="big-number">${Math.abs(daysRemaining)}</div>
          <p>${daysRemaining >= 0 ? 'днів залишилось' : 'днів протерміновано'}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Дата спливу</h6>
          <div class="big-number">${expiryDate.getDate()}</div>
          <p>${expiryDateStr}</p>
        </div>
        
        <div class="insight-card">
          <h6>⏱️ Термін зберігання</h6>
          <div class="big-number">${shelfLifeDays}</div>
          <p>${shelfLifeDays === 1 ? 'день' : shelfLifeDays < 5 ? 'дні' : 'днів'}</p>
        </div>
      </div>

      <div style="margin-top: 1.5rem;">
        <div class="insight-card ${statusClass}">
          <h6>${statusIcon} ${statusText}</h6>
          <div style="margin-top: 1rem;">
            <p><strong>📅 Дата виробництва:</strong> ${productionDateStr}</p>
            <p><strong>⏰ Термін дії до:</strong> ${expiryDateStr}</p>
            ${daysRemaining >= 0 
              ? `<p><strong>⏳ Залишилось:</strong> ${daysRemaining} ${daysRemaining === 1 ? 'день' : daysRemaining < 5 ? 'дні' : 'днів'}</p>`
              : `<p><strong>⚠️ Протерміновано:</strong> ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'день' : Math.abs(daysRemaining) < 5 ? 'дні' : 'днів'} тому</p>`
            }
          </div>
        </div>
      </div>

      ${storageTip ? `
        <div style="margin-top: 1rem;">
          <div class="insight-card info">
            <h6>💡 Поради щодо зберігання</h6>
            <p>${storageTip}</p>
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 1rem;">
        <div class="insight-card">
          <h6>🔔 Рекомендації</h6>
          <ul style="margin: 0.5rem 0; padding-left: 1rem;">
            ${daysRemaining > 0 
              ? `<li>Плануйте використання продукту протягом ${daysRemaining} ${daysRemaining === 1 ? 'дня' : daysRemaining < 5 ? 'днів' : 'днів'}</li>`
              : '<li style="color: #dc3545;">Не рекомендується споживати протермінований продукт</li>'
            }
            <li>Завжди перевіряйте зовнішній вигляд, запах та консистенцію</li>
            <li>Дотримуйтесь умов зберігання, вказаних на упаковці</li>
            ${daysRemaining <= 3 && daysRemaining > 0 
              ? '<li>Розгляньте можливість заморожування (якщо продукт підходить для цього)</li>'
              : ''
            }
          </ul>
        </div>
      </div>
    `;
  });

  // Calculate on page load with default values
  if (document.getElementById("production-date").value && document.getElementById("shelf-life").value) {
    form.dispatchEvent(new Event('submit'));
  }
});