document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("shift-form");
  const result = document.getElementById("shift-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const startTimeInput = document.getElementById("start-time").value;
    const lunchDuration = parseInt(document.getElementById("lunch-duration").value);
    const lunchStartInput = document.getElementById("lunch-start").value;

    if (!startTimeInput || !lunchDuration) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Please fill in all required fields.</div>';
      return;
    }

    if (lunchDuration < 30 || lunchDuration > 120) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Lunch break duration must be between 30 and 120 minutes.</div>';
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
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
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

    const totalBreaks = breaksBeforeLunch + breaksAfterLunch;

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>🕐 Work Schedule</h6>
          <div class="big-number">${formatTime(startTime)} - ${formatTime(endTime)}</div>
          <p>Total time: ${totalHours}h ${remainingMinutes}m</p>
        </div>
        
        <div class="insight-card info">
          <h6>🍽️ Lunch Break</h6>
          <div class="big-number">${formatTime(lunchStart)} - ${formatTime(lunchEnd)}</div>
          <p>Duration: ${lunchDuration} minutes</p>
        </div>
        
        <div class="insight-card warning">
          <h6>☕ Recommended Breaks</h6>
          <div class="big-number">${totalBreaks}</div>
          <p>10 minutes every 2 hours</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h4>📋 Detailed Daily Schedule:</h4>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="display: grid; gap: 0.5rem;">
            <div><strong>🌅 Work Start:</strong> ${formatTime(startTime)}</div>
            ${breaksBeforeLunch > 0 ? `<div><strong>☕ Morning Break:</strong> ${formatTime(new Date(startTime.getTime() + 2 * 60 * 60 * 1000))} (10 min)</div>` : ''}
            <div><strong>🍽️ Lunch Break:</strong> ${formatTime(lunchStart)} - ${formatTime(lunchEnd)}</div>
            ${breaksAfterLunch > 0 ? `<div><strong>☕ Afternoon Break:</strong> ${formatTime(new Date(lunchEnd.getTime() + 2 * 60 * 60 * 1000))} (10 min)</div>` : ''}
            <div><strong>🏁 Work End:</strong> ${formatTime(endTime)}</div>
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #e8f8fc 0%, #f8fdff 100%); border-radius: 8px;">
          <h5>💡 Productivity Tips:</h5>
          <ul style="margin: 0.5rem 0;">
            <li>🧠 Schedule complex tasks in the morning (9:00-11:00 AM)</li>
            <li>💧 Drink water every 30-45 minutes</li>
            <li>🚶 Take short walks during breaks</li>
            <li>👀 Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds</li>
            <li>🎯 Plan your most important work during peak energy hours</li>
          </ul>
        </div>
      </div>
    `;
  });
});