document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("passport-validity-form");
  const resultDiv = document.getElementById("passport-validity-result");

  // Set default dates
  setDefaultDates();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    checkPassportValidity();
  });

  // Auto-calculate when inputs change for better UX
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener("change", function () {
      if (validateInputs()) {
        checkPassportValidity();
      }
    });
  });

  function setDefaultDates() {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const returnDate = new Date(nextMonth);
    returnDate.setDate(returnDate.getDate() + 7);
    
    // Set passport expiry to 2 years from now as default
    const passportExpiry = new Date(today);
    passportExpiry.setFullYear(passportExpiry.getFullYear() + 2);
    
    // Set passport issue to 5 years ago as default
    const passportIssue = new Date(today);
    passportIssue.setFullYear(passportIssue.getFullYear() - 5);

    document.getElementById("departure-date").value = nextMonth.toISOString().split('T')[0];
    document.getElementById("return-date").value = returnDate.toISOString().split('T')[0];
    document.getElementById("passport-expiry-date").value = passportExpiry.toISOString().split('T')[0];
    document.getElementById("passport-issue-date").value = passportIssue.toISOString().split('T')[0];
  }

  function validateInputs() {
    const passportIssue = new Date(document.getElementById("passport-issue-date").value);
    const passportExpiry = new Date(document.getElementById("passport-expiry-date").value);
    const departure = new Date(document.getElementById("departure-date").value);
    const returnDate = new Date(document.getElementById("return-date").value);
    const blankPages = parseInt(document.getElementById("blank-pages").value);
    const region = document.getElementById("destination-region").value;

    return passportIssue && passportExpiry && departure && returnDate && 
           !isNaN(blankPages) && region && 
           passportExpiry > passportIssue && 
           returnDate >= departure;
  }

  function checkPassportValidity() {
    // Get inputs
    const passportIssue = new Date(document.getElementById("passport-issue-date").value);
    const passportExpiry = new Date(document.getElementById("passport-expiry-date").value);
    const departure = new Date(document.getElementById("departure-date").value);
    const returnDate = new Date(document.getElementById("return-date").value);
    const blankPages = parseInt(document.getElementById("blank-pages").value) || 0;
    const region = document.getElementById("destination-region").value;
    const countriesVisiting = parseInt(document.getElementById("countries-visiting").value) || 1;

    if (!validateInputs()) {
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, заповніть всі поля коректно.</p>';
      return;
    }

    // Calculate requirements based on region
    const requirements = getRegionRequirements(region);
    
    // Calculate time differences
    const tripDuration = Math.ceil((returnDate - departure) / (1000 * 60 * 60 * 24));
    const monthsUntilExpiry = (passportExpiry - returnDate) / (1000 * 60 * 60 * 24 * 30.44);
    const daysUntilExpiry = Math.ceil((passportExpiry - returnDate) / (1000 * 60 * 60 * 24));
    
    // Check validity conditions
    const checks = {
      validityRule: monthsUntilExpiry >= requirements.monthsRequired,
      blankPages: blankPages >= (requirements.pagesRequired + (countriesVisiting - 1) * 2),
      notExpiredDuringTrip: passportExpiry > returnDate,
      futureTravel: departure > new Date()
    };

    // Calculate recommended pages (2 per country + 2 extra)
    const recommendedPages = Math.max(requirements.pagesRequired, countriesVisiting * 2 + 2);

    displayResults({
      checks,
      requirements,
      monthsUntilExpiry,
      daysUntilExpiry,
      tripDuration,
      blankPages,
      countriesVisiting,
      recommendedPages,
      region,
      passportExpiry,
      returnDate
    });
  }

  function getRegionRequirements(region) {
    const requirements = {
      "eu": { monthsRequired: 3, pagesRequired: 2, name: "Європейський Союз" },
      "usa": { monthsRequired: 6, pagesRequired: 2, name: "США" },
      "canada": { monthsRequired: 6, pagesRequired: 2, name: "Канада" },
      "australia": { monthsRequired: 6, pagesRequired: 2, name: "Австралія/Нова Зеландія" },
      "uk": { monthsRequired: 6, pagesRequired: 2, name: "Великобританія" },
      "schengen": { monthsRequired: 3, pagesRequired: 2, name: "Шенгенська зона" },
      "asia": { monthsRequired: 6, pagesRequired: 3, name: "Азія" },
      "africa": { monthsRequired: 6, pagesRequired: 4, name: "Африка" },
      "south-america": { monthsRequired: 6, pagesRequired: 2, name: "Південна Америка" },
      "middle-east": { monthsRequired: 6, pagesRequired: 3, name: "Близький Схід" },
      "other": { monthsRequired: 6, pagesRequired: 2, name: "Інший регіон" }
    };
    
    return requirements[region] || requirements["other"];
  }

  function displayResults(data) {
    const { checks, requirements, monthsUntilExpiry, daysUntilExpiry, tripDuration, 
            blankPages, countriesVisiting, recommendedPages, region, passportExpiry, returnDate } = data;

    const allChecksPassed = Object.values(checks).every(check => check);
    const urgentRenewal = monthsUntilExpiry < 6;
    const criticalIssues = !checks.validityRule || !checks.blankPages || !checks.notExpiredDuringTrip;

    let resultClass = allChecksPassed ? 'success' : (criticalIssues ? 'warning' : 'info');
    let statusIcon = allChecksPassed ? '✅' : (criticalIssues ? '⚠️' : 'ℹ️');
    let statusText = allChecksPassed ? 'Паспорт готовий до подорожі!' : 
                     criticalIssues ? 'Потрібні дії перед подорожжю!' : 'Рекомендації для подорожі';

    resultDiv.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${resultClass}">
          <h3>${statusIcon} ${statusText}</h3>
          <p><strong>Напрямок:</strong> ${requirements.name}</p>
          <p><strong>Тривалість поїздки:</strong> ${tripDuration} днів</p>
          <p><strong>Дійсність до:</strong> ${daysUntilExpiry} днів після повернення</p>
        </div>
      </div>

      <div class="detailed-results">
        <h4>📋 Детальна перевірка:</h4>
        
        <div class="check-item ${checks.futureTravel ? 'pass' : 'fail'}">
          ${checks.futureTravel ? '✅' : '❌'} <strong>Дата відправлення:</strong> 
          ${checks.futureTravel ? 'Дійсна (у майбутньому)' : 'Помилка - дата в минулому!'}
        </div>

        <div class="check-item ${checks.notExpiredDuringTrip ? 'pass' : 'fail'}">
          ${checks.notExpiredDuringTrip ? '✅' : '❌'} <strong>Дійсність під час поїздки:</strong> 
          ${checks.notExpiredDuringTrip ? 'Паспорт не закінчиться' : `Паспорт закінчується ${passportExpiry.toLocaleDateString('uk-UA')}!`}
        </div>

        <div class="check-item ${checks.validityRule ? 'pass' : 'fail'}">
          ${checks.validityRule ? '✅' : '❌'} <strong>Правило ${requirements.monthsRequired} місяців:</strong> 
          ${checks.validityRule ? 
            `Відповідає (${monthsUntilExpiry.toFixed(1)} місяців запасу)` : 
            `Не відповідає! Потрібно ${requirements.monthsRequired} місяців, є ${monthsUntilExpiry.toFixed(1)}`}
        </div>

        <div class="check-item ${checks.blankPages ? 'pass' : 'fail'}">
          ${checks.blankPages ? '✅' : '❌'} <strong>Порожні сторінки:</strong> 
          ${checks.blankPages ? 
            `Достатньо (${blankPages} сторінок)` : 
            `Недостатньо! Потрібно ${recommendedPages}, є ${blankPages}`}
        </div>

        ${!allChecksPassed ? `
          <div class="recommendations">
            <h4>🚨 Необхідні дії:</h4>
            <ul>
              ${!checks.futureTravel ? '<li>Перевірте дату відправлення</li>' : ''}
              ${!checks.notExpiredDuringTrip ? '<li><strong>ТЕРМІНОВО:</strong> Оновіть паспорт - закінчується під час поїздки!</li>' : ''}
              ${!checks.validityRule ? `<li><strong>ВАЖЛИВО:</strong> Оновіть паспорт - не відповідає правилу ${requirements.monthsRequired} місяців</li>` : ''}
              ${!checks.blankPages ? `<li>Оновіть паспорт - недостатньо порожніх сторінок (потрібно ${recommendedPages})</li>` : ''}
            </ul>
          </div>
        ` : ''}

        <div class="travel-tips">
          <h4>💡 Корисні поради:</h4>
          <ul>
            <li><strong>Оновлення паспорта:</strong> Зазвичай займає 2-6 тижнів</li>
            <li><strong>Терміново:</strong> Можливе оновлення за 1-2 тижні за доплату</li>
            <li><strong>Додаткові сторінки:</strong> У деяких країнах можна додати сторінки</li>
            <li><strong>Завжди перевіряйте:</strong> Актуальні вимоги на сайті посольства</li>
            ${urgentRenewal ? '<li><strong>⚠️ Увага:</strong> Рекомендується оновити паспорт найближчим часом!</li>' : ''}
          </ul>
        </div>

        <div class="region-specific">
          <h4>🌍 Особливості регіону "${requirements.name}":</h4>
          <ul>
            <li><strong>Мінімальна дійсність:</strong> ${requirements.monthsRequired} місяців</li>
            <li><strong>Мінімум порожніх сторінок:</strong> ${requirements.pagesRequired}</li>
            <li><strong>Рекомендовано для ${countriesVisiting} країн:</strong> ${recommendedPages} сторінок</li>
          </ul>
        </div>
      </div>
    `;
  }
});