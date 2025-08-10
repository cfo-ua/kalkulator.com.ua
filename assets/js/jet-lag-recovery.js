document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("jetlag-form");
  const result = document.getElementById("jetlag-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const homeTimezone = document.getElementById("home-timezone").value;
    const destTimezone = document.getElementById("destination-timezone").value;
    const age = parseInt(document.getElementById("age").value);
    const departureTime = document.getElementById("departure-time").value;
    const tripDuration = document.getElementById("trip-duration").value;

    if (!homeTimezone || !destTimezone || !age || !departureTime || !tripDuration) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Помилка</h6>
        <p>Будь ласка, заповніть всі поля форми.</p>
      </div>`;
      return;
    }

    // Parse timezone offsets
    const homeOffset = parseTimezone(homeTimezone);
    const destOffset = parseTimezone(destTimezone);
    const timeDifference = Math.abs(destOffset - homeOffset);

    if (timeDifference === 0) {
      result.innerHTML = `<div class="insight-card info">
        <h6>ℹ️ Немає різниці</h6>
        <p>Ви подорожуєте в межах того ж часового поясу. Джетлаг вам не загрожує!</p>
      </div>`;
      return;
    }

    // Determine direction
    const direction = destOffset > homeOffset ? "east" : "west";
    const directionText = direction === "east" ? "на схід" : "на захід";

    // Calculate recovery time
    let baseRecoveryDays = Math.round(timeDifference * 0.8);
    
    // Age adjustment
    if (age > 50) baseRecoveryDays += 1;
    if (age > 65) baseRecoveryDays += 1;
    
    // Direction adjustment (eastward is harder)
    if (direction === "east") baseRecoveryDays += 1;
    
    // Departure time adjustment
    const departureAdjustments = {
      "night": 1,
      "early-morning": 0.5,
      "morning": 0,
      "afternoon": 0,
      "evening": 0.5
    };
    baseRecoveryDays += (departureAdjustments[departureTime] || 0);

    const recoveryDays = Math.max(1, Math.round(baseRecoveryDays));

    // Generate recommendations
    const recommendations = generateRecommendations(direction, timeDifference, age, tripDuration);
    
    // Severity assessment
    let severity, severityClass, severityIcon;
    if (timeDifference <= 2) {
      severity = "Легкий";
      severityClass = "success";
      severityIcon = "😊";
    } else if (timeDifference <= 6) {
      severity = "Помірний";
      severityClass = "warning";
      severityIcon = "😐";
    } else {
      severity = "Важкий";
      severityClass = "warning";
      severityIcon = "😵";
    }

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${severityClass}">
          <h6>${severityIcon} Рівень джетлагу</h6>
          <div class="big-number">${severity}</div>
          <p>${timeDifference} годин різниці</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Час відновлення</h6>
          <div class="big-number">${recoveryDays}</div>
          <p>${recoveryDays === 1 ? 'день' : recoveryDays < 5 ? 'дні' : 'днів'}</p>
        </div>
        
        <div class="insight-card info">
          <h6>🧭 Напрямок подорожі</h6>
          <div class="big-number">${directionText}</div>
          <p>${direction === "east" ? "Важче для адаптації" : "Легше для адаптації"}</p>
        </div>
      </div>

      <div class="insight-card">
        <h6>💡 Персональні рекомендації</h6>
        ${recommendations}
      </div>

      <div class="insight-card">
        <h6>📋 План адаптації по днях</h6>
        ${generateDailyPlan(recoveryDays, direction, timeDifference)}
      </div>

      <div class="insight-card info">
        <h6>⚡ Швидкі поради</h6>
        <ul style="text-align: left; margin: 1rem 0;">
          <li>🌅 Використовуйте яскраве світло вранці</li>
          <li>💊 Розгляньте прийом мелатоніну (консультація з лікарем)</li>
          <li>💧 Пийте багато води, уникайте алкоголю</li>
          <li>🏃‍♀️ Займайтеся легкими фізичними вправами</li>
          <li>🍽️ Їжте за місцевим розкладом</li>
          <li>😴 Дотримуйтесь нового режиму сну з першого дня</li>
        </ul>
      </div>
    `;
  });

  function parseTimezone(timezone) {
    const match = timezone.match(/UTC([+-]?\d+(?:\:\d+)?)/);
    if (!match) return 0;
    
    const timeStr = match[1];
    if (timeStr.includes(':')) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours + (minutes / 60) * (hours >= 0 ? 1 : -1);
    }
    return parseInt(timeStr);
  }

  function generateRecommendations(direction, timeDifference, age, tripDuration) {
    let recommendations = "<ul style='text-align: left; margin: 1rem 0;'>";

    // Pre-flight recommendations
    recommendations += "<li><strong>За 3-4 дні до подорожі:</strong> ";
    if (direction === "east") {
      recommendations += "Починайте лягати спати на 15-30 хвилин раніше щодня.";
    } else {
      recommendations += "Починайте лягати спати на 15-30 хвилин пізніше щодня.";
    }
    recommendations += "</li>";

    // During flight
    recommendations += "<li><strong>Під час польоту:</strong> Переведіть годинник на час призначення, пийте воду кожну годину, уникайте алкоголю та кофеїну за 6 годин до планованого сну.</li>";

    // Light therapy
    if (direction === "east") {
      recommendations += "<li><strong>Світлотерапія:</strong> Уникайте яскравого світла ввечері перед сном за новим часом. Використовуйте яскраве світло вранці.</li>";
    } else {
      recommendations += "<li><strong>Світлотерапія:</strong> Використовуйте яскраве світло ввечері в новому часовому поясі, уникайте раннього ранкового світла.</li>";
    }

    // Age-specific advice
    if (age > 50) {
      recommendations += "<li><strong>З віком:</strong> Будьте терплячі - адаптація може зайняти більше часу. Розгляньте можливість прийому мелатоніну.</li>";
    }

    // Trip duration advice
    if (tripDuration === "1-2" || tripDuration === "3-4") {
      recommendations += "<li><strong>Коротка поїздка:</strong> Якщо поїздка менше 4 днів, розгляньте можливість залишитися на домашньому часі для сну.</li>";
    }

    recommendations += "</ul>";
    return recommendations;
  }

  function generateDailyPlan(recoveryDays, direction, timeDifference) {
    let plan = "<div style='text-align: left;'>";
    
    for (let day = 1; day <= Math.min(recoveryDays, 7); day++) {
      const recoveryPercent = Math.round((day / recoveryDays) * 100);
      const adjustedPercent = Math.min(recoveryPercent, 100);
      
      plan += `<div style="margin-bottom: 1rem; padding: 0.5rem; border-left: 3px solid var(--accent); background: #f8f9fa;">`;
      plan += `<strong>День ${day}:</strong> `;
      
      if (day === 1) {
        plan += "Прибуття. Намагайтеся не спати до місцевого вечора. Легкий сніданок, активність на свіжому повітрі.";
      } else if (day <= 3) {
        plan += `Адаптація ${adjustedPercent}%. ${direction === "east" ? "Уникайте денного сну" : "Короткий денний сон (20-30 хв) можливий"}. Регулярні прийоми їжі.`;
      } else if (day <= recoveryDays) {
        plan += `Відновлення ${adjustedPercent}%. Енергія повертається. Підтримуйте постійний режим сну.`;
      } else {
        plan += "Повна адаптація! Ви маєте відчувати себе нормально в новому часовому поясі.";
      }
      
      plan += `</div>`;
    }
    
    if (recoveryDays > 7) {
      plan += `<p><em>Повне відновлення очікується до дня ${recoveryDays}.</em></p>`;
    }
    
    plan += "</div>";
    return plan;
  }
});