document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("tv-distance-form");
  const result = document.getElementById("tv-distance-result");
  let distanceChart = null;

  // Language-specific texts
  const texts = {
    units: {
      metric: { distance: "м", small: "см" },
      imperial: { distance: "фт", small: "дюймів" }
    },
    standards: {
      "4k-optimal": "4K оптимальна",
      "thx": "THX стандарт", 
      "smpte": "SMPTE стандарт",
      "gaming": "Для ігор"
    },
    benefits: {
      "4k-optimal": "Максимальна деталізація",
      "thx": "Кінематографічний досвід",
      "smpte": "Комфортний перегляд",
      "gaming": "Швидка реакція"
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateDistance();
  });

  function calculateDistance() {
    const tvSize = parseFloat(document.getElementById("tv-size").value);
    const resolution = document.getElementById("resolution").value;
    const viewingType = document.getElementById("viewing-type").value;
    const units = document.getElementById("units").value;

    if (!tvSize || tvSize < 20 || tvSize > 150) {
      alert("Будь ласка, введіть коректний розмір телевізора (20-150 дюймів)");
      return;
    }

    // Calculate distances in inches first
    const distances = calculateDistances(tvSize, resolution, viewingType);
    
    // Convert to display units
    const convertedDistances = convertUnits(distances, units);
    
    // Display results
    displayResults(convertedDistances, units, tvSize);
    
    // Show chart
    createDistanceChart(convertedDistances, units);
    
    // Show comparison table
    createComparisonTable(convertedDistances, units);
    
    result.style.display = "block";
    result.scrollIntoView({ behavior: "smooth" });
  }

  function calculateDistances(tvSizeInches, resolution, viewingType) {
    const distances = {};
    
    // Base calculations
    switch (resolution) {
      case "4k":
        distances.recommended = tvSizeInches * 1.5;
        distances.min = tvSizeInches * 1.2;
        distances.max = tvSizeInches * 2.0;
        break;
      case "8k":
        distances.recommended = tvSizeInches * 1.2;
        distances.min = tvSizeInches * 1.0;
        distances.max = tvSizeInches * 1.5;
        break;
      case "hd":
      default:
        distances.recommended = tvSizeInches * 2.5;
        distances.min = tvSizeInches * 2.0;
        distances.max = tvSizeInches * 3.5;
        break;
    }
    
    // Standard calculations
    distances.thx = tvSizeInches * 2.5;
    distances.smpte = tvSizeInches * 3.5;
    distances.gaming = tvSizeInches * 1.2;
    
    // Adjust for viewing type
    switch (viewingType) {
      case "cinema":
        distances.recommended *= 0.9;
        break;
      case "casual":
        distances.recommended *= 1.1;
        break;
      case "gaming":
        distances.recommended = distances.gaming;
        break;
    }
    
    return distances;
  }

  function convertUnits(distances, units) {
    const converted = {};
    
    if (units === "metric") {
      // Convert inches to centimeters, then to meters for display
      for (const [key, value] of Object.entries(distances)) {
        const cm = value * 2.54;
        converted[key] = {
          value: cm,
          display: cm >= 100 ? (cm / 100).toFixed(1) : cm.toFixed(0),
          unit: cm >= 100 ? "м" : "см"
        };
      }
    } else {
      // Convert inches to feet
      for (const [key, value] of Object.entries(distances)) {
        const feet = value / 12;
        converted[key] = {
          value: value,
          display: feet >= 1 ? feet.toFixed(1) : value.toFixed(0),
          unit: feet >= 1 ? "фт" : "дюймів"
        };
      }
    }
    
    return converted;
  }

  function displayResults(distances, units, tvSize) {
    // Main recommended distance
    document.getElementById("recommended-distance").textContent = 
      `${distances.recommended.display} ${distances.recommended.unit}`;
    
    document.getElementById("recommended-range").textContent = 
      `${distances.min.display}–${distances.max.display} ${distances.min.unit}`;
    
    // THX standard
    document.getElementById("thx-distance").textContent = 
      `${distances.thx.display} ${distances.thx.unit}`;
    
    // SMPTE standard
    document.getElementById("smpte-distance").textContent = 
      `${distances.smpte.display} ${distances.smpte.unit}`;
  }

  function createDistanceChart(distances, units) {
    const ctx = document.getElementById('distanceChart').getContext('2d');
    
    if (distanceChart) {
      distanceChart.destroy();
    }
    
    const data = {
      labels: ['4K Оптимальна', 'THX', 'SMPTE', 'Для ігор'],
      datasets: [{
        label: `Відстань (${distances.recommended.unit})`,
        data: [
          parseFloat(distances.recommended.display),
          parseFloat(distances.thx.display),
          parseFloat(distances.smpte.display),
          parseFloat(distances.gaming.display)
        ],
        backgroundColor: [
          'rgba(21, 122, 255, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)'
        ],
        borderColor: [
          'rgba(21, 122, 255, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '📊 Порівняння відстаней перегляду',
            font: { size: 16 }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: `Відстань (${distances.recommended.unit})`
            }
          }
        }
      }
    };

    distanceChart = new Chart(ctx, config);
  }

  function createComparisonTable(distances, units) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    
    const standards = [
      {
        name: "4K Оптимальна",
        distance: `${distances.recommended.display} ${distances.recommended.unit}`,
        benefits: "Найкращий баланс деталізації та комфорту"
      },
      {
        name: "THX Стандарт",
        distance: `${distances.thx.display} ${distances.thx.unit}`,
        benefits: "Кінематографічний досвід, ефект занурення"
      },
      {
        name: "SMPTE Стандарт", 
        distance: `${distances.smpte.display} ${distances.smpte.unit}`,
        benefits: "Комфортний перегляд без напруження очей"
      },
      {
        name: "Для ігор",
        distance: `${distances.gaming.display} ${distances.gaming.unit}`,
        benefits: "Швидка реакція, максимальна концентрація"
      }
    ];
    
    standards.forEach(standard => {
      const row = tableBody.insertRow();
      row.innerHTML = `
        <td><strong>${standard.name}</strong></td>
        <td>${standard.distance}</td>
        <td>${standard.benefits}</td>
      `;
    });
  }

  // Auto-calculate on input change for better UX
  document.getElementById("tv-size").addEventListener("input", function() {
    if (this.value && parseFloat(this.value) >= 20) {
      setTimeout(calculateDistance, 300);
    }
  });

  document.getElementById("resolution").addEventListener("change", calculateDistance);
  document.getElementById("viewing-type").addEventListener("change", calculateDistance);
  document.getElementById("units").addEventListener("change", calculateDistance);

  // Initial calculation with default values
  calculateDistance();
});