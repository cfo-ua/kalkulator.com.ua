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
        <h6>⚠️ Error</h6>
        <p>Please fill in all form fields.</p>
      </div>`;
      return;
    }

    // Parse timezone offsets
    const homeOffset = parseTimezone(homeTimezone);
    const destOffset = parseTimezone(destTimezone);
    const timeDifference = Math.abs(destOffset - homeOffset);

    if (timeDifference === 0) {
      result.innerHTML = `<div class="insight-card info">
        <h6>ℹ️ No Time Difference</h6>
        <p>You're traveling within the same time zone. No jet lag to worry about!</p>
      </div>`;
      return;
    }

    // Determine direction
    const direction = destOffset > homeOffset ? "east" : "west";
    const directionText = direction === "east" ? "eastward" : "westward";

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
      severity = "Mild";
      severityClass = "success";
      severityIcon = "😊";
    } else if (timeDifference <= 6) {
      severity = "Moderate";
      severityClass = "warning";
      severityIcon = "😐";
    } else {
      severity = "Severe";
      severityClass = "warning";
      severityIcon = "😵";
    }

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${severityClass}">
          <h6>${severityIcon} Jet Lag Severity</h6>
          <div class="big-number">${severity}</div>
          <p>${timeDifference} hours difference</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Recovery Time</h6>
          <div class="big-number">${recoveryDays}</div>
          <p>${recoveryDays === 1 ? 'day' : 'days'}</p>
        </div>
        
        <div class="insight-card info">
          <h6>🧭 Travel Direction</h6>
          <div class="big-number">${directionText}</div>
          <p>${direction === "east" ? "Harder to adapt" : "Easier to adapt"}</p>
        </div>
      </div>

      <div class="insight-card">
        <h6>💡 Personalized Recommendations</h6>
        ${recommendations}
      </div>

      <div class="insight-card">
        <h6>📋 Daily Adaptation Plan</h6>
        ${generateDailyPlan(recoveryDays, direction, timeDifference)}
      </div>

      <div class="insight-card info">
        <h6>⚡ Quick Tips</h6>
        <ul style="text-align: left; margin: 1rem 0;">
          <li>🌅 Use bright light exposure in the morning</li>
          <li>💊 Consider melatonin supplementation (consult doctor)</li>
          <li>💧 Stay hydrated, avoid alcohol and excessive caffeine</li>
          <li>🏃‍♀️ Engage in light physical exercise</li>
          <li>🍽️ Eat according to local meal times</li>
          <li>😴 Maintain new sleep schedule from day one</li>
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
    recommendations += "<li><strong>3-4 days before travel:</strong> ";
    if (direction === "east") {
      recommendations += "Start going to bed 15-30 minutes earlier each day.";
    } else {
      recommendations += "Start going to bed 15-30 minutes later each day.";
    }
    recommendations += "</li>";

    // During flight
    recommendations += "<li><strong>During flight:</strong> Set your watch to destination time, drink water every hour, avoid alcohol and caffeine 6 hours before planned sleep.</li>";

    // Light therapy
    if (direction === "east") {
      recommendations += "<li><strong>Light therapy:</strong> Avoid bright light in the evening before bedtime in new time zone. Use bright light in the morning.</li>";
    } else {
      recommendations += "<li><strong>Light therapy:</strong> Use bright light in the evening in new time zone, avoid early morning light.</li>";
    }

    // Age-specific advice
    if (age > 50) {
      recommendations += "<li><strong>Age consideration:</strong> Be patient - adaptation may take longer. Consider melatonin supplementation with doctor's approval.</li>";
    }

    // Trip duration advice
    if (tripDuration === "1-2" || tripDuration === "3-4") {
      recommendations += "<li><strong>Short trip:</strong> If traveling for less than 4 days, consider staying on home time for sleep if possible.</li>";
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
      plan += `<strong>Day ${day}:</strong> `;
      
      if (day === 1) {
        plan += "Arrival day. Try to stay awake until local evening. Light breakfast, outdoor activity for natural light exposure.";
      } else if (day <= 3) {
        plan += `${adjustedPercent}% adaptation. ${direction === "east" ? "Avoid afternoon naps" : "Short power nap (20-30 min) acceptable"}. Regular meal times important.`;
      } else if (day <= recoveryDays) {
        plan += `${adjustedPercent}% recovery. Energy levels returning. Maintain consistent sleep schedule.`;
      } else {
        plan += "Full adaptation achieved! You should feel normal in the new time zone.";
      }
      
      plan += `</div>`;
    }
    
    if (recoveryDays > 7) {
      plan += `<p><em>Full recovery expected by day ${recoveryDays}.</em></p>`;
    }
    
    plan += "</div>";
    return plan;
  }
});