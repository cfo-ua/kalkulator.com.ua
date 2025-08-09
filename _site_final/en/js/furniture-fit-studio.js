document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("furniture-fit-form");
  if (!form) return;

  // Furniture dimensions database (in feet)
  const furnitureDimensions = {
    beds: {
      twin: { length: 6.25, width: 3.25, clearance: 2.5 },
      twinxl: { length: 6.67, width: 3.25, clearance: 2.5 },
      full: { length: 6.25, width: 4.5, clearance: 2.5 },
      queen: { length: 6.67, width: 5, clearance: 3 },
      king: { length: 6.67, width: 6.33, clearance: 3 }
    },
    seating: {
      none: { length: 0, width: 0, clearance: 0 },
      chair: { length: 2.5, width: 2.5, clearance: 3 },
      loveseat: { length: 5, width: 3, clearance: 3 },
      sofa: { length: 7, width: 3.5, clearance: 3.5 }
    },
    tables: {
      coffeeSmall: { length: 4, width: 2, clearance: 2 },
      coffeeMedium: { length: 5, width: 2.5, clearance: 2 },
      diningSmall: { length: 3, width: 3, clearance: 3 },
      diningMedium: { length: 5, width: 3.5, clearance: 3.5 },
      diningBar: { length: 2, width: 4, clearance: 2.5 }
    },
    desks: {
      none: { length: 0, width: 0, clearance: 0 },
      small: { length: 4, width: 2, clearance: 4 },
      medium: { length: 5, width: 2.5, clearance: 4 },
      large: { length: 6, width: 3, clearance: 4.5 }
    },
    storage: {
      none: { length: 0, width: 0, clearance: 0 },
      nightstand: { length: 1.5, width: 1.5, clearance: 2 },
      dresserSmall: { length: 4, width: 1.5, clearance: 2.5 },
      wardrobeLarge: { length: 3, width: 2, clearance: 2.5 },
      bookshelfSmall: { length: 2.5, width: 1, clearance: 1.5 },
      bookcaseLarge: { length: 4, width: 1, clearance: 2 }
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const roomLength = parseFloat(document.getElementById("roomLength").value);
    const roomWidth = parseFloat(document.getElementById("roomWidth").value);
    const bedSize = document.getElementById("bedSize").value;
    const nightstands = parseInt(document.getElementById("nightstands").value);
    const seatingType = document.getElementById("seatingType").value;
    const coffeeTable = document.getElementById("coffeeTable").value;
    const deskSize = document.getElementById("deskSize").value;
    const officeChair = document.getElementById("officeChair").value === "yes";
    const diningTable = document.getElementById("diningTable").value;
    const diningChairs = parseInt(document.getElementById("diningChairs").value);
    const dresser = document.getElementById("dresser").value;
    const bookshelf = document.getElementById("bookshelf").value;

    const totalRoomArea = roomLength * roomWidth;

    // Calculate space needed for each furniture piece
    let furnitureArea = 0;
    let clearanceArea = 0;
    const furnitureList = [];

    // Bed area
    const bed = furnitureDimensions.beds[bedSize];
    const bedArea = bed.length * bed.width;
    const bedClearance = (bed.length + bed.clearance) * (bed.width + bed.clearance) - bedArea;
    furnitureArea += bedArea;
    clearanceArea += bedClearance;
    furnitureList.push({
      item: `${bedSize.charAt(0).toUpperCase() + bedSize.slice(1)} Bed`,
      area: bedArea,
      clearance: bedClearance
    });

    // Nightstands
    if (nightstands > 0) {
      const nightstandArea = furnitureDimensions.storage.nightstand.length * furnitureDimensions.storage.nightstand.width * nightstands;
      const nightstandClearance = ((furnitureDimensions.storage.nightstand.length + furnitureDimensions.storage.nightstand.clearance) * 
                                   (furnitureDimensions.storage.nightstand.width + furnitureDimensions.storage.nightstand.clearance) - 
                                   furnitureDimensions.storage.nightstand.length * furnitureDimensions.storage.nightstand.width) * nightstands;
      furnitureArea += nightstandArea;
      clearanceArea += nightstandClearance;
      furnitureList.push({
        item: `${nightstands} Nightstand${nightstands > 1 ? 's' : ''}`,
        area: nightstandArea,
        clearance: nightstandClearance
      });
    }

    // Seating
    if (seatingType !== 'none') {
      const seating = furnitureDimensions.seating[seatingType];
      const seatingArea = seating.length * seating.width;
      const seatingClearance = (seating.length + seating.clearance) * (seating.width + seating.clearance) - seatingArea;
      furnitureArea += seatingArea;
      clearanceArea += seatingClearance;
      furnitureList.push({
        item: seatingType.charAt(0).toUpperCase() + seatingType.slice(1),
        area: seatingArea,
        clearance: seatingClearance
      });
    }

    // Coffee table
    if (coffeeTable !== 'none') {
      const tableKey = coffeeTable === 'small' ? 'coffeeSmall' : 'coffeeMedium';
      const table = furnitureDimensions.tables[tableKey];
      const tableArea = table.length * table.width;
      const tableClearance = (table.length + table.clearance) * (table.width + table.clearance) - tableArea;
      furnitureArea += tableArea;
      clearanceArea += tableClearance;
      furnitureList.push({
        item: `${coffeeTable} Coffee Table`,
        area: tableArea,
        clearance: tableClearance
      });
    }

    // Desk
    if (deskSize !== 'none') {
      const desk = furnitureDimensions.desks[deskSize];
      const deskArea = desk.length * desk.width;
      const deskClearance = (desk.length + desk.clearance) * (desk.width + desk.clearance) - deskArea;
      furnitureArea += deskArea;
      clearanceArea += deskClearance;
      furnitureList.push({
        item: `${deskSize} Desk`,
        area: deskArea,
        clearance: deskClearance
      });

      // Add space for office chair if selected
      if (officeChair) {
        const chairArea = 4; // approximately 2x2 feet for chair
        furnitureArea += chairArea;
        furnitureList.push({
          item: "Office Chair",
          area: chairArea,
          clearance: 0
        });
      }
    }

    // Dining table
    if (diningTable !== 'none') {
      let tableKey;
      switch(diningTable) {
        case 'small': tableKey = 'diningSmall'; break;
        case 'medium': tableKey = 'diningMedium'; break;
        case 'bar': tableKey = 'diningBar'; break;
      }
      const table = furnitureDimensions.tables[tableKey];
      const tableArea = table.length * table.width;
      const tableClearance = (table.length + table.clearance) * (table.width + table.clearance) - tableArea;
      furnitureArea += tableArea;
      clearanceArea += tableClearance;
      furnitureList.push({
        item: `${diningTable} Dining Table`,
        area: tableArea,
        clearance: tableClearance
      });

      // Add dining chairs
      if (diningChairs > 0) {
        const chairArea = 2.25 * diningChairs; // approximately 1.5x1.5 feet per chair
        furnitureArea += chairArea;
        furnitureList.push({
          item: `${diningChairs} Dining Chairs`,
          area: chairArea,
          clearance: 0
        });
      }
    }

    // Storage furniture
    if (dresser !== 'none') {
      const storageKey = dresser === 'small' ? 'dresserSmall' : 'wardrobeLarge';
      const storage = furnitureDimensions.storage[storageKey];
      const storageArea = storage.length * storage.width;
      const storageClearance = (storage.length + storage.clearance) * (storage.width + storage.clearance) - storageArea;
      furnitureArea += storageArea;
      clearanceArea += storageClearance;
      furnitureList.push({
        item: dresser === 'small' ? 'Small Dresser' : 'Large Wardrobe',
        area: storageArea,
        clearance: storageClearance
      });
    }

    if (bookshelf !== 'none') {
      const shelfKey = bookshelf === 'small' ? 'bookshelfSmall' : 'bookcaseLarge';
      const shelf = furnitureDimensions.storage[shelfKey];
      const shelfArea = shelf.length * shelf.width;
      const shelfClearance = (shelf.length + shelf.clearance) * (shelf.width + shelf.clearance) - shelfArea;
      furnitureArea += shelfArea;
      clearanceArea += shelfClearance;
      furnitureList.push({
        item: bookshelf === 'small' ? 'Small Bookshelf' : 'Large Bookcase',
        area: shelfArea,
        clearance: shelfClearance
      });
    }

    // Calculate totals
    const totalFurnitureAndClearance = furnitureArea + clearanceArea;
    const remainingSpace = totalRoomArea - totalFurnitureAndClearance;
    const spaceUtilization = (totalFurnitureAndClearance / totalRoomArea) * 100;
    const furnitureUtilization = (furnitureArea / totalRoomArea) * 100;

    // Determine if furniture fits comfortably
    let fitStatus = '';
    let statusClass = '';
    if (remainingSpace >= 30) {
      fitStatus = '✅ Excellent Fit - Plenty of open space remaining';
      statusClass = 'success';
    } else if (remainingSpace >= 15) {
      fitStatus = '⚡ Good Fit - Comfortable with adequate space';
      statusClass = 'warning';
    } else if (remainingSpace >= 0) {
      fitStatus = '⚠️ Tight Fit - Minimal space, consider smaller furniture';
      statusClass = 'warning';
    } else {
      fitStatus = '❌ Too Crowded - Furniture will not fit comfortably';
      statusClass = 'error';
    }

    // Display results
    const resultBlock = document.getElementById("furniture-result");
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🏠 Total Room Area</h6>
          <div class="big-number">${totalRoomArea.toFixed(0)}</div>
          <p class="insight-detail">square feet</p>
        </div>
        <div class="insight-card ${statusClass}">
          <h6>📊 Space Utilization</h6>
          <div class="big-number">${spaceUtilization.toFixed(0)}%</div>
          <p class="insight-detail">${furnitureUtilization.toFixed(0)}% furniture + clearance</p>
        </div>
        <div class="insight-card ${remainingSpace >= 0 ? 'success' : 'warning'}">
          <h6>📦 Remaining Space</h6>
          <div class="big-number">${Math.abs(remainingSpace).toFixed(0)}</div>
          <p class="insight-detail">sq ft ${remainingSpace >= 0 ? 'available' : 'over capacity'}</p>
        </div>
        <div class="insight-card info">
          <h6>🪑 Furniture Count</h6>
          <div class="big-number">${furnitureList.length}</div>
          <p class="insight-detail">pieces planned</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">📋 Furniture Layout Analysis</h4>
        <div style="padding: 1rem; background: ${statusClass === 'success' ? '#e8f8e8' : statusClass === 'warning' ? '#fff8e1' : '#ffe8e8'}; 
                    border-radius: 8px; border: 2px solid ${statusClass === 'success' ? '#28a745' : statusClass === 'warning' ? '#ffc107' : '#dc3545'}; margin-bottom: 1.5rem;">
          <p style="margin: 0;"><strong>${fitStatus}</strong></p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div>
            <h5>📐 Space Breakdown</h5>
            <p>Furniture Area: ${furnitureArea.toFixed(1)} sq ft (${(furnitureArea/totalRoomArea*100).toFixed(0)}%)</p>
            <p>Clearance Needed: ${clearanceArea.toFixed(1)} sq ft (${(clearanceArea/totalRoomArea*100).toFixed(0)}%)</p>
            <p>Open Space: ${Math.max(0, remainingSpace).toFixed(1)} sq ft (${Math.max(0, remainingSpace/totalRoomArea*100).toFixed(0)}%)</p>
            <p>Room Dimensions: ${roomLength}' × ${roomWidth}'</p>
          </div>
          
          <div>
            <h5>🪑 Furniture List</h5>
            ${furnitureList.map(item => 
              `<p>${item.item}: ${item.area.toFixed(1)} sq ft</p>`
            ).join('')}
          </div>
        </div>
        
        ${spaceUtilization > 85 ? 
          `<div style="margin-top: 1rem; padding: 1rem; background: #fff8e1; border-radius: 8px; border: 2px solid #ffc107;">
            <p><strong>💡 Space Optimization Tips:</strong></p>
            <ul style="margin: 0.5rem 0 0 0;">
              <li>Consider multi-functional furniture (storage ottoman, desk/dining table combo)</li>
              <li>Use vertical space with tall shelving units</li>
              <li>Choose furniture with legs to create visual openness</li>
              <li>Consider folding or nesting furniture for flexibility</li>
            </ul>
          </div>` : ''
        }
        
        ${remainingSpace < 0 ? 
          `<div style="margin-top: 1rem; padding: 1rem; background: #ffe8e8; border-radius: 8px; border: 2px solid #dc3545;">
            <p><strong>⚠️ Space Issue Alert:</strong></p>
            <p>Your furniture selection exceeds available space by ${Math.abs(remainingSpace).toFixed(1)} sq ft. Consider:</p>
            <ul style="margin: 0.5rem 0 0 0;">
              <li>Choosing smaller furniture pieces</li>
              <li>Eliminating non-essential items</li>
              <li>Using wall-mounted options instead of floor furniture</li>
              <li>Selecting multi-purpose furniture</li>
            </ul>
          </div>` : ''
        }
      </div>
    `;

    // Show chart
    const chartBlock = document.getElementById("furniture-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("furniture-chart").getContext("2d");
      if (window.furnitureChart) window.furnitureChart.destroy();

      const chartData = {
        labels: ['Furniture', 'Clearance Space', 'Open Space'],
        datasets: [{
          data: [
            furnitureArea,
            clearanceArea,
            Math.max(0, remainingSpace)
          ],
          backgroundColor: [
            '#4CAF50',
            '#FFC107',
            '#2196F3'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      };

      window.furnitureChart = new Chart(ctx, {
        type: "doughnut",
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Studio Apartment Space Allocation (${totalRoomArea.toFixed(0)} sq ft total)`
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          }
        }
      });
    });
  });
});

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