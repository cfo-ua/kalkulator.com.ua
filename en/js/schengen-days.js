document.addEventListener("DOMContentLoaded", function () {
  const tripsContainer = document.getElementById("trip-rows");
  const addTripButton = document.getElementById("add-trip");
  const resultBlock = document.getElementById("schengen-result");
  const checkDateInput = document.getElementById("check-date");

  // Set default date to today
  if (!checkDateInput.value) {
    checkDateInput.value = new Date().toISOString().split('T')[0];
  }

  const createTripRow = () => {
    const row = document.createElement("div");
    row.className = "trip-row";
    row.style.cssText = `
      display: flex; 
      gap: 10px; 
      margin-bottom: 10px; 
      align-items: center; 
      padding: 10px; 
      background: #f8f9fa; 
      border-radius: 6px;
    `;
    
    row.innerHTML = `
      <label style="flex: 1;">
        Entry Date:
        <input type="date" class="date-in" style="width: 100%; margin-top: 5px;">
      </label>
      <label style="flex: 1;">
        Exit Date:
        <input type="date" class="date-out" style="width: 100%; margin-top: 5px;">
      </label>
      <button type="button" class="remove-trip" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; height: fit-content;">✕</button>
    `;
    
    const removeButton = row.querySelector(".remove-trip");
    removeButton.onclick = () => {
      row.remove();
      calculateSchengenStatus();
    };
    
    // Add change listeners to the inputs
    row.querySelector(".date-in").addEventListener("change", calculateSchengenStatus);
    row.querySelector(".date-out").addEventListener("change", calculateSchengenStatus);
    
    tripsContainer.appendChild(row);
    return row;
  };

  addTripButton.onclick = () => createTripRow();
  createTripRow(); // initialize with one row

  const parseDate = str => new Date(str + "T00:00:00");

  const getTripDays = () => {
    const trips = [];
    document.querySelectorAll(".trip-row").forEach((row, index) => {
      const inDate = row.querySelector(".date-in").value;
      const outDate = row.querySelector(".date-out").value;
      
      if (inDate && outDate) {
        const entryDate = parseDate(inDate);
        const exitDate = parseDate(outDate);
        
        if (entryDate <= exitDate) {
          trips.push({ in: entryDate, out: exitDate, index: index + 1 });
        }
      }
    });
    return trips;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateSchengenStatus = () => {
    const trips = getTripDays();
    
    if (trips.length === 0) {
      resultBlock.innerHTML = `
        <div style="background: #e9ecef; padding: 15px; border-radius: 8px; color: #495057;">
          <p>Please add at least one trip with valid entry and exit dates.</p>
        </div>
      `;
      return;
    }

    const refDate = parseDate(checkDateInput.value);
    const windowStart = new Date(refDate);
    windowStart.setDate(windowStart.getDate() - 179); // 180 days including today

    let daysInWindow = 0;
    const countedDays = new Set();
    const tripsInWindow = [];

    for (let trip of trips) {
      const from = trip.in < windowStart ? windowStart : trip.in;
      const to = trip.out > refDate ? refDate : trip.out;

      if (from <= to) {
        let tripDays = 0;
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
          const dayString = d.toDateString();
          if (!countedDays.has(dayString)) {
            countedDays.add(dayString);
            tripDays++;
          }
        }
        
        if (tripDays > 0) {
          tripsInWindow.push({
            ...trip,
            daysInWindow: tripDays,
            effectiveStart: from,
            effectiveEnd: to
          });
        }
      }
    }

    daysInWindow = countedDays.size;
    const remainingDays = Math.max(0, 90 - daysInWindow);
    const isCompliant = daysInWindow <= 90;

    let resultHTML = `
      <div style="background: ${isCompliant ? '#d4edda' : '#f8d7da'}; padding: 20px; border-radius: 8px; border-left: 4px solid ${isCompliant ? '#28a745' : '#dc3545'};">
        <h4 style="margin: 0 0 15px 0; color: ${isCompliant ? '#155724' : '#721c24'};">
          Schengen 90/180 Rule Status
        </h4>
        
        <p style="margin: 0 0 10px 0; font-size: 1.1em;">
          <strong>Days spent:</strong> ${daysInWindow} out of 90 allowed days
        </p>
        
        <p style="margin: 0 0 15px 0;">
          <strong>Period:</strong> ${formatDate(windowStart)} to ${formatDate(refDate)}
        </p>
        
        ${isCompliant ? 
          `<p style="color: #155724; font-weight: bold; margin: 0;">
            ✓ Compliant — You have ${remainingDays} days remaining
          </p>` :
          `<p style="color: #721c24; font-weight: bold; margin: 0;">
            ⚠ Warning — You have exceeded the 90-day limit by ${daysInWindow - 90} days
          </p>`
        }
      </div>
    `;

    // Add trip details if there are trips in the window
    if (tripsInWindow.length > 0) {
      resultHTML += `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px;">
          <h5 style="margin: 0 0 10px 0;">Trips Contributing to Count:</h5>
          <ul style="margin: 0; padding-left: 20px;">
      `;
      
      tripsInWindow.forEach(trip => {
        resultHTML += `
          <li style="margin-bottom: 5px;">
            Trip ${trip.index}: ${formatDate(trip.effectiveStart)} to ${formatDate(trip.effectiveEnd)} 
            (${trip.daysInWindow} days)
          </li>
        `;
      });
      
      resultHTML += `</ul></div>`;
    }

    // Add helpful advice
    if (!isCompliant) {
      resultHTML += `
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #ffc107;">
          <h5 style="margin: 0 0 10px 0; color: #856404;">Important Notice:</h5>
          <p style="margin: 0; color: #856404;">
            Overstaying in the Schengen Area can result in fines, entry bans, or deportation. 
            Contact immigration authorities or legal counsel for guidance on your situation.
          </p>
        </div>
      `;
    } else if (remainingDays <= 10) {
      resultHTML += `
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #ffc107;">
          <h5 style="margin: 0 0 10px 0; color: #856404;">Planning Reminder:</h5>
          <p style="margin: 0; color: #856404;">
            You only have ${remainingDays} days remaining. Plan your future trips carefully to avoid exceeding the limit.
          </p>
        </div>
      `;
    }

    resultBlock.innerHTML = resultHTML;
  };

  // Add event listeners
  checkDateInput.addEventListener("change", calculateSchengenStatus);

  // Style the add button
  addTripButton.style.cssText = `
    background: #007bff; 
    color: white; 
    border: none; 
    padding: 10px 20px; 
    border-radius: 6px; 
    cursor: pointer; 
    margin: 10px 0;
  `;

  // Initial calculation
  calculateSchengenStatus();
});