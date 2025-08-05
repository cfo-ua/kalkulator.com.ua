document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("shift-form");
  const result = document.getElementById("shift-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const startTimeInput = document.getElementById("start-time").value;
    const lunchDuration = parseInt(document.getElementById("lunch-duration").value);
    const lunchStartInput = document.getElementById("lunch-start").value;

    if (!startTimeInput || !lunchDuration) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Будь ласка, заповніть всі обов\'язкові поля.</div>';
      return;
    }

    if (lunchDuration < 30 || lunchDuration > 120) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Тривалість обідньої перерви має бути від 30 до 120 хвилин.</div>';
      return;
    }

    // Parse start time
    const [startHour, startMinute] = startTimeInput.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0);

    // Calculate end time (8 hours + lunch break)
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 8);
    endTime.setMinutes(endTime.getMinutes() + lunchDuration);

    // Calculate lunch break times
    let lunchStart, lunchEnd;
    if (lunchStartInput) {
      const [lunchHour, lunchMinute] = lunchStartInput.split(':').map(Number);
      lunchStart = new Date();
      lunchStart.setHours(lunchHour, lunchMinute, 0, 0);
    } else {
      // Default lunch start: 4 hours after work start
      lunchStart = new Date(startTime);
      lunchStart.setHours(lunchStart.getHours() + 4);
    }
    
    lunchEnd = new Date(lunchStart);
    lunchEnd.setMinutes(lunchEnd.getMinutes() + lunchDuration);

    // Format time for display
    const formatTime = (date) => {
      return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    };

    // Calculate total time at workplace
    const totalMinutes = (endTime - startTime) / (1000 * 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    // Calculate break recommendations
    const workMinutesBeforeLunch = (lunchStart - startTime) / (1000 * 60);
    const workMinutesAfterLunch = (endTime - lunchEnd) / (1000 * 60);
    
    const breaksBeforeLunch = Math.floor(workMinutesBeforeLunch / 120); // Every 2 hours
    const breaksAfterLunch = Math.floor(workMinutesAfterLunch / 120);

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🕐 Час роботи</h6>
          <div class="big-number">${formatTime(startTime)} - ${formatTime(endTime)}</div>
          <p>Загальний час: ${totalHours}г ${remainingMinutes}хв</p>
        </div>
        
        <div class="insight-card info">
          <h6>🍽️ Обідня перерва</h6>
          <div class="big-number">${formatTime(lunchStart)} - ${formatTime(lunchEnd)}</div>
          <p>Тривалість: ${lunchDuration} хвилин</p>
        </div>
        
        <div class="insight-card warning">
          <h6>☕ Рекомендовані перерви</h6>
          <div class="big-number">${breaksBeforeLunch + breaksAfterLunch}</div>
          <p>По 10 хвилин кожні 2 години</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h4>📋 Детальний розклад дня:</h4>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="display: grid; gap: 0.5rem;">
            <div><strong>🌅 Початок роботи:</strong> ${formatTime(startTime)}</div>
            ${breaksBeforeLunch > 0 ? `<div><strong>☕ Ранкова перерва:</strong> ${formatTime(new Date(startTime.getTime() + 2 * 60 * 60 * 1000))} (10 хв)</div>` : ''}
            <div><strong>🍽️ Обідня перерва:</strong> ${formatTime(lunchStart)} - ${formatTime(lunchEnd)}</div>
            ${breaksAfterLunch > 0 ? `<div><strong>☕ Післяобідня перерва:</strong> ${formatTime(new Date(lunchEnd.getTime() + 2 * 60 * 60 * 1000))} (10 хв)</div>` : ''}
            <div><strong>🏁 Кінець роботи:</strong> ${formatTime(endTime)}</div>
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #e8f8fc 0%, #f8fdff 100%); border-radius: 8px;">
          <h5>💡 Поради для продуктивності:</h5>
          <ul style="margin: 0.5rem 0;">
            <li>🧠 Складні завдання плануйте на ранок (9:00-11:00)</li>
            <li>💧 П'ите воду кожні 30-45 хвилин</li>
            <li>🚶 Робіть короткі прогулянки під час перерв</li>
            <li>👀 Віддавайте очам відпочинок від екрана кожні 20 хвилин</li>
          </ul>
        </div>
      </div>
    `;
  });
});