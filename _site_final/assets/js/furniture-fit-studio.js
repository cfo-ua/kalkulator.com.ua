document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("furniture-fit-form");
  if (!form) return;

  // Furniture dimensions database (in meters)
  const furnitureDimensions = {
    beds: {
      twin: { length: 1.9, width: 0.9, clearance: 0.75 },
      twinxl: { length: 2.0, width: 0.9, clearance: 0.75 },
      full: { length: 1.9, width: 1.4, clearance: 0.75 },
      queen: { length: 2.0, width: 1.6, clearance: 0.9 },
      king: { length: 2.0, width: 1.8, clearance: 0.9 }
    },
    seating: {
      none: { length: 0, width: 0, clearance: 0 },
      chair: { length: 0.75, width: 0.75, clearance: 0.9 },
      loveseat: { length: 1.5, width: 0.9, clearance: 0.9 },
      sofa: { length: 2.1, width: 1.0, clearance: 1.0 }
    },
    tables: {
      coffeeSmall: { length: 1.2, width: 0.6, clearance: 0.6 },
      coffeeMedium: { length: 1.5, width: 0.75, clearance: 0.6 },
      diningSmall: { length: 0.9, width: 0.9, clearance: 0.9 },
      diningMedium: { length: 1.5, width: 1.05, clearance: 1.0 },
      diningBar: { length: 0.6, width: 1.2, clearance: 0.75 }
    },
    desks: {
      none: { length: 0, width: 0, clearance: 0 },
      small: { length: 1.2, width: 0.6, clearance: 1.2 },
      medium: { length: 1.5, width: 0.75, clearance: 1.2 },
      large: { length: 1.8, width: 0.9, clearance: 1.35 }
    },
    storage: {
      none: { length: 0, width: 0, clearance: 0 },
      nightstand: { length: 0.45, width: 0.45, clearance: 0.6 },
      dresserSmall: { length: 1.2, width: 0.45, clearance: 0.75 },
      wardrobeLarge: { length: 0.9, width: 0.6, clearance: 0.75 },
      bookshelfSmall: { length: 0.75, width: 0.3, clearance: 0.45 },
      bookcaseLarge: { length: 1.2, width: 0.3, clearance: 0.6 }
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
    
    const bedSizeNames = {
      twin: 'Односпальне',
      twinxl: 'Односпальне XL', 
      full: 'Напівторне',
      queen: 'Подвійне',
      king: 'Євро'
    };
    
    furnitureList.push({
      item: `${bedSizeNames[bedSize]} ліжко`,
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
        item: `${nightstands} тумбочк${nightstands > 1 ? 'и' : 'а'}`,
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
      
      const seatingNames = {
        chair: 'Крісло',
        loveseat: 'Диванчик',
        sofa: 'Диван'
      };
      
      furnitureList.push({
        item: seatingNames[seatingType],
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
        item: `${coffeeTable === 'small' ? 'Малий' : 'Середній'} журнальний столик`,
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
      
      const deskSizeNames = {
        small: 'Малий',
        medium: 'Середній',
        large: 'Великий'
      };
      
      furnitureList.push({
        item: `${deskSizeNames[deskSize]} стіл`,
        area: deskArea,
        clearance: deskClearance
      });

      // Add space for office chair if selected
      if (officeChair) {
        const chairArea = 0.36; // approximately 0.6x0.6 meters for chair
        furnitureArea += chairArea;
        furnitureList.push({
          item: "Офісне крісло",
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
      
      const diningTableNames = {
        small: 'Малий',
        medium: 'Середній', 
        bar: 'Барний'
      };
      
      furnitureList.push({
        item: `${diningTableNames[diningTable]} обідній стіл`,
        area: tableArea,
        clearance: tableClearance
      });

      // Add dining chairs
      if (diningChairs > 0) {
        const chairArea = 0.2025 * diningChairs; // approximately 0.45x0.45 meters per chair
        furnitureArea += chairArea;
        furnitureList.push({
          item: `${diningChairs} обідні стільці`,
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
        item: dresser === 'small' ? 'Малий комод' : 'Велика шафа',
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
        item: bookshelf === 'small' ? 'Мала полиця' : 'Велика книжкова шафа',
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
    if (remainingSpace >= 3) {
      fitStatus = '✅ Відмінне розміщення - Залишається багато вільного простору';
      statusClass = 'success';
    } else if (remainingSpace >= 1.5) {
      fitStatus = '⚡ Хороше розміщення - Комфортно з достатнім простором';
      statusClass = 'warning';
    } else if (remainingSpace >= 0) {
      fitStatus = '⚠️ Тісне розміщення - Мінімум простору, розгляньте менші меблі';
      statusClass = 'warning';
    } else {
      fitStatus = '❌ Занадто тісно - Меблі не поміщаються комфортно';
      statusClass = 'error';
    }

    // Display results
    const resultBlock = document.getElementById("furniture-result");
    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🏠 Загальна площа кімнати</h6>
          <div class="big-number">${totalRoomArea.toFixed(1).replace('.', ',')}</div>
          <p class="insight-detail">кв. метрів</p>
        </div>
        <div class="insight-card ${statusClass}">
          <h6>📊 Використання простору</h6>
          <div class="big-number">${spaceUtilization.toFixed(0)}%</div>
          <p class="insight-detail">${furnitureUtilization.toFixed(0)}% меблі + прохід</p>
        </div>
        <div class="insight-card ${remainingSpace >= 0 ? 'success' : 'warning'}">
          <h6>📦 Залишковий простір</h6>
          <div class="big-number">${Math.abs(remainingSpace).toFixed(1).replace('.', ',')}</div>
          <p class="insight-detail">кв.м ${remainingSpace >= 0 ? 'доступно' : 'перевищення'}</p>
        </div>
        <div class="insight-card info">
          <h6>🪑 Кількість меблів</h6>
          <div class="big-number">${furnitureList.length}</div>
          <p class="insight-detail">предметів заплановано</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">📋 Аналіз планування меблів</h4>
        <div style="padding: 1rem; background: ${statusClass === 'success' ? '#e8f8e8' : statusClass === 'warning' ? '#fff8e1' : '#ffe8e8'}; 
                    border-radius: 8px; border: 2px solid ${statusClass === 'success' ? '#28a745' : statusClass === 'warning' ? '#ffc107' : '#dc3545'}; margin-bottom: 1.5rem;">
          <p style="margin: 0;"><strong>${fitStatus}</strong></p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div>
            <h5>📐 Розподіл простору</h5>
            <p>Площа меблів: ${furnitureArea.toFixed(1).replace('.', ',')} кв.м (${(furnitureArea/totalRoomArea*100).toFixed(0)}%)</p>
            <p>Необхідний прохід: ${clearanceArea.toFixed(1).replace('.', ',')} кв.м (${(clearanceArea/totalRoomArea*100).toFixed(0)}%)</p>
            <p>Вільний простір: ${Math.max(0, remainingSpace).toFixed(1).replace('.', ',')} кв.м (${Math.max(0, remainingSpace/totalRoomArea*100).toFixed(0)}%)</p>
            <p>Розміри кімнати: ${roomLength.toString().replace('.', ',')}м × ${roomWidth.toString().replace('.', ',')}м</p>
          </div>
          
          <div>
            <h5>🪑 Список меблів</h5>
            ${furnitureList.map(item => 
              `<p>${item.item}: ${item.area.toFixed(1).replace('.', ',')} кв.м</p>`
            ).join('')}
          </div>
        </div>
        
        ${spaceUtilization > 85 ? 
          `<div style="margin-top: 1rem; padding: 1rem; background: #fff8e1; border-radius: 8px; border: 2px solid #ffc107;">
            <p><strong>💡 Поради з оптимізації простору:</strong></p>
            <ul style="margin: 0.5rem 0 0 0;">
              <li>Розгляньте багатофункціональні меблі (пуф зі зберіганням, комбо стіл/обідній стіл)</li>
              <li>Використовуйте вертикальний простір з високими стелажами</li>
              <li>Виберіть меблі на ніжках для створення візуальної відкритості</li>
              <li>Розгляньте складні або вкладені меблі для гнучкості</li>
            </ul>
          </div>` : ''
        }
        
        ${remainingSpace < 0 ? 
          `<div style="margin-top: 1rem; padding: 1rem; background: #ffe8e8; border-radius: 8px; border: 2px solid #dc3545;">
            <p><strong>⚠️ Попередження про простір:</strong></p>
            <p>Ваш вибір меблів перевищує доступний простір на ${Math.abs(remainingSpace).toFixed(1).replace('.', ',')} кв.м. Розгляньте:</p>
            <ul style="margin: 0.5rem 0 0 0;">
              <li>Вибір менших предметів меблів</li>
              <li>Видалення несуттєвих предметів</li>
              <li>Використання настінних варіантів замість підлогових меблів</li>
              <li>Вибір багатоцільових меблів</li>
            </ul>
          </div>` : ''
        }
        
        <div style="margin-top: 1rem; padding: 1rem; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196F3;">
          <strong>🇺🇦 Українські особливості:</strong><br>
          • Враховано стандартні розміри меблів українських виробників<br>
          • Адаптовано для типових українських квартир-студій<br>
          • Розміри вказані в метричній системі<br>
          • Враховано особливості планування в українських будівлях
        </div>
      </div>
    `;

    // Show chart
    const chartBlock = document.getElementById("furniture-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("furniture-chart").getContext("2d");
      if (window.furnitureChart) window.furnitureChart.destroy();

      const chartData = {
        labels: ['Меблі', 'Простір для проходу', 'Вільний простір'],
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
              text: `Розподіл простору квартири-студії (${totalRoomArea.toFixed(1).replace('.', ',')} кв.м загалом)`
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