document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("timezone-form");
  if (!form) return;

  let timezoneCounter = 1;

  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("meetingDate").value = today;

  // Add timezone functionality
  window.addTimezone = function() {
    if (timezoneCounter >= 6) {
      alert("Maximum 6 time zones allowed");
      return;
    }

    const timezoneInputs = document.getElementById("timezone-inputs");
    const newInput = document.createElement("div");
    newInput.className = "timezone-input";
    newInput.style.cssText = "display: grid; grid-template-columns: 2fr 1fr auto; gap: 1rem; align-items: end; margin-bottom: 1rem;";
    
    newInput.innerHTML = `
      <div>
        <label for="location-${timezoneCounter}">Location Name</label>
        <input type="text" id="location-${timezoneCounter}" value="Location ${timezoneCounter + 1}" required>
      </div>
      <div>
        <label for="timezone-${timezoneCounter}">Time Zone</label>
        <select id="timezone-${timezoneCounter}" required>
          <option value="America/New_York">New York (EST/EDT)</option>
          <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
          <option value="Europe/London">London (GMT/BST)</option>
          <option value="Europe/Berlin">Berlin (CET/CEST)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
          <option value="Asia/Singapore">Singapore (SGT)</option>
          <option value="Asia/Bangkok">Bangkok (ICT)</option>
          <option value="Asia/Bali">Bali (WITA)</option>
          <option value="America/Mexico_City">Mexico City (CST/CDT)</option>
          <option value="America/Buenos_Aires">Buenos Aires (ART)</option>
          <option value="Europe/Lisbon">Lisbon (WET/WEST)</option>
          <option value="Australia/Sydney">Sydney (AEDT/AEST)</option>
          <option value="UTC">UTC</option>
        </select>
      </div>
      <button type="button" onclick="removeTimezone(${timezoneCounter})" style="background: #dc3545; color: white; border: none; padding: 0.5rem; border-radius: 4px;">✕</button>
    `;
    
    timezoneInputs.appendChild(newInput);
    timezoneCounter++;
  };

  window.removeTimezone = function(index) {
    const inputElement = document.querySelector(`#location-${index}`).closest('.timezone-input');
    if (inputElement && document.querySelectorAll('.timezone-input').length > 1) {
      inputElement.remove();
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const meetingDate = document.getElementById("meetingDate").value;
    const meetingTime = document.getElementById("meetingTime").value;
    const referenceTimezone = document.getElementById("referenceTimezone").value;

    // Collect all timezone inputs
    const timezones = [];
    const timezoneInputs = document.querySelectorAll('.timezone-input');
    
    timezoneInputs.forEach((input, index) => {
      const locationInput = input.querySelector(`input[id^="location-"]`);
      const timezoneSelect = input.querySelector(`select[id^="timezone-"]`);
      
      if (locationInput && timezoneSelect) {
        timezones.push({
          location: locationInput.value,
          timezone: timezoneSelect.value
        });
      }
    });

    if (timezones.length === 0) {
      alert("Please add at least one time zone");
      return;
    }

    // Create reference date time
    const referenceDateTime = new Date(`${meetingDate}T${meetingTime}:00`);
    
    // Convert times for each timezone
    const timeConversions = timezones.map(tz => {
      try {
        const localTime = new Date(referenceDateTime.toLocaleString("en-US", {timeZone: referenceTimezone}));
        const targetTime = new Date(localTime.toLocaleString("en-US", {timeZone: tz.timezone}));
        
        // Calculate offset difference
        const referenceOffset = getRawOffset(referenceTimezone, referenceDateTime);
        const targetOffset = getRawOffset(tz.timezone, referenceDateTime);
        const offsetDiff = targetOffset - referenceOffset;
        
        const convertedTime = new Date(referenceDateTime.getTime() + (offsetDiff * 60000));
        
        return {
          location: tz.location,
          timezone: tz.timezone,
          time: convertedTime,
          timeString: convertedTime.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit'
          }),
          dateString: convertedTime.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          isNextDay: convertedTime.getDate() !== referenceDateTime.getDate(),
          businessHours: isBusinessHours(convertedTime)
        };
      } catch (error) {
        console.error(`Error converting time for ${tz.location}:`, error);
        return null;
      }
    }).filter(Boolean);

    // Find optimal meeting window (business hours overlap)
    const businessHoursOverlap = findBusinessHoursOverlap(timeConversions);

    // Display results
    const resultBlock = document.getElementById("timezone-result");
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🕐 Reference Time</h6>
          <div class="big-number">${meetingTime}</div>
          <p class="insight-detail">${referenceTimezone.split('/').pop()}</p>
        </div>
        <div class="insight-card ${businessHoursOverlap.count > 0 ? 'success' : 'warning'}">
          <h6>💼 Business Hours</h6>
          <div class="big-number">${businessHoursOverlap.count}</div>
          <p class="insight-detail">locations in work hours</p>
        </div>
        <div class="insight-card info">
          <h6>🌍 Time Zones</h6>
          <div class="big-number">${timezones.length}</div>
          <p class="insight-detail">locations tracked</p>
        </div>
        <div class="insight-card ${getTimeDiversityClass(timeConversions)}">
          <h6>📅 Date Spread</h6>
          <div class="big-number">${getDateSpread(timeConversions)}</div>
          <p class="insight-detail">different dates</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">🕰️ Time Zone Conversions</h4>
        <div class="timeline-header" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 1rem; padding: 1rem; background: var(--accent); color: white; border-radius: 8px; margin-bottom: 1rem; font-weight: bold;">
          <span>Location</span>
          <span>Local Time</span>
          <span>Date</span>
          <span>Status</span>
        </div>
        ${timeConversions.map(conversion => `
          <div class="timeline-row" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border); align-items: center;">
            <span style="font-weight: 600;">${conversion.location}</span>
            <span style="font-size: 1.1rem; font-weight: 600;">${conversion.timeString}</span>
            <span style="color: ${conversion.isNextDay ? '#f57c00' : '#4caf50'};">${conversion.dateString}</span>
            <span style="padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; background: ${conversion.businessHours ? '#e8f8e8' : '#fff3e0'}; color: ${conversion.businessHours ? '#2e7d32' : '#f57c00'};">
              ${conversion.businessHours ? '💼 Work Hours' : conversion.isLateNight(conversion.time) ? '🌙 Late Night' : '🌅 Early Hours'}
            </span>
          </div>
        `).join('')}
      </div>
      
      ${businessHoursOverlap.count > 0 ? `
        <div style="margin-top: 2rem; padding: 1.5rem; background: #e8f8e8; border-radius: var(--radius); border: 2px solid #28a745;">
          <h4 style="margin-top: 0;">✅ Optimal Meeting Time</h4>
          <p><strong>${businessHoursOverlap.count} out of ${timezones.length} locations</strong> are in business hours (9 AM - 6 PM local time).</p>
          <p>This is ${businessHoursOverlap.count === timezones.length ? 'perfect' : businessHoursOverlap.count >= timezones.length * 0.7 ? 'good' : 'acceptable'} for global team coordination.</p>
        </div>
      ` : `
        <div style="margin-top: 2rem; padding: 1.5rem; background: #fff8e1; border-radius: var(--radius); border: 2px solid #ffc107;">
          <h4 style="margin-top: 0;">⚠️ Challenging Meeting Time</h4>
          <p>No locations are in standard business hours. Consider:</p>
          <ul style="margin-bottom: 0;">
            <li>Rotating meeting times to share inconvenience</li>
            <li>Using asynchronous communication</li>
            <li>Recording meetings for those outside work hours</li>
          </ul>
        </div>
      `}
      
      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">💡 Remote Work Tips</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <div>
            <h6>🤝 Meeting Etiquette</h6>
            <p style="font-size: 0.9rem; margin: 0;">Always specify time zones, use 24-hour format, and send calendar invites with local times for all participants.</p>
          </div>
          <div>
            <h6>⏰ Scheduling Strategy</h6>
            <p style="font-size: 0.9rem; margin: 0;">Rotate meeting times weekly or monthly to fairly distribute early/late meetings among team members.</p>
          </div>
          <div>
            <h6>📝 Async Alternatives</h6>
            <p style="font-size: 0.9rem; margin: 0;">Use recorded updates, shared documents, and threaded discussions for non-urgent communication.</p>
          </div>
        </div>
      </div>
    `;

    // Show chart for business hours visualization
    showBusinessHoursChart(timeConversions);
  });

  function getRawOffset(timezone, date) {
    const utc1 = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    const utc2 = new Date(utc1.toLocaleString("en-US", {timeZone: timezone}));
    return (utc2.getTime() - utc1.getTime()) / 60000;
  }

  function isBusinessHours(time) {
    const hour = time.getHours();
    return hour >= 9 && hour < 18; // 9 AM to 6 PM
  }

  function findBusinessHoursOverlap(conversions) {
    const inBusinessHours = conversions.filter(c => c.businessHours);
    return {
      count: inBusinessHours.length,
      locations: inBusinessHours.map(c => c.location)
    };
  }

  function getDateSpread(conversions) {
    const dates = new Set(conversions.map(c => c.time.toDateString()));
    return dates.size;
  }

  function getTimeDiversityClass(conversions) {
    const spread = getDateSpread(conversions);
    return spread === 1 ? 'success' : spread === 2 ? 'warning' : 'info';
  }

  function showBusinessHoursChart(conversions) {
    const chartBlock = document.getElementById("timezone-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("timezone-chart").getContext("2d");
      if (window.timezoneChart) window.timezoneChart.destroy();

      // Create 24-hour timeline data
      const hours = Array.from({length: 24}, (_, i) => i);
      const datasets = conversions.map((conversion, index) => {
        const data = hours.map(hour => {
          const adjustedHour = (hour + conversion.time.getHours()) % 24;
          return adjustedHour >= 9 && adjustedHour < 18 ? 1 : 0;
        });
        
        return {
          label: conversion.location,
          data: data,
          backgroundColor: `hsla(${index * 60}, 70%, 60%, 0.6)`,
          borderColor: `hsla(${index * 60}, 70%, 50%, 1)`,
          borderWidth: 2
        };
      });

      window.timezoneChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: hours.map(h => `${h.toString().padStart(2, '0')}:00`),
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Business Hours Overlap (9 AM - 6 PM local time)"
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 1,
              ticks: {
                callback: function(value) {
                  return value === 1 ? 'Work Hours' : 'Off Hours';
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Hours (UTC Reference)'
              }
            }
          }
        }
      });
    });
  }
});

// Add method to check if it's late night
Date.prototype.isLateNight = function() {
  const hour = this.getHours();
  return hour >= 22 || hour < 6;
};

// Ensure Chart.js is loaded
function ensureChartJs(callback) {
  if (typeof Chart !== 'undefined') {
    callback();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
}