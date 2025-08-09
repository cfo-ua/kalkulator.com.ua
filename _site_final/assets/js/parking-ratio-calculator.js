document.getElementById("parking-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const buildingType = document.getElementById("building-type").value;
  const totalArea = parseFloat(document.getElementById("total-area").value) || 0;
  const usableArea = parseFloat(document.getElementById("usable-area").value) || totalArea;
  const locationType = document.getElementById("location-type").value;
  const carOwnership = parseFloat(document.getElementById("car-ownership").value) || 300;
  const transitAccess = document.getElementById("transit-access").value;

  if (!buildingType) {
    alert("Оберіть тип будівлі");
    return;
  }

  // Base parking ratios per 100 m² of usable area
  const baseRatios = {
    office: 4.5,           // 4.5 spaces per 100 m²
    retail: 20,            // 20 spaces per 100 m²
    residential: 1.5,      // 1.5 spaces per 100 m² (roughly 1-2 per apartment)
    restaurant: 12,        // 12 spaces per 100 m²
    hotel: 1.2,           // 1.2 spaces per 100 m² (1 per 2-3 rooms)
    medical: 8,           // 8 spaces per 100 m²
    education: 2,         // 2 spaces per 100 m²
    warehouse: 1          // 1 space per 100 m²
  };

  let baseRatio = baseRatios[buildingType];
  
  // Location multipliers
  const locationMultipliers = {
    "city-center": 0.6,
    "residential": 0.8,
    "suburban": 1.0,
    "industrial": 1.1
  };

  // Car ownership adjustment (base is 300 cars per 1000 people)
  const carOwnershipMultiplier = carOwnership / 300;

  // Transit access multipliers
  const transitMultipliers = {
    "excellent": 0.7,
    "good": 0.85,
    "limited": 1.0,
    "none": 1.2
  };

  // Calculate adjusted ratio
  let adjustedRatio = baseRatio * 
                     locationMultipliers[locationType] * 
                     carOwnershipMultiplier * 
                     transitMultipliers[transitAccess];

  // Calculate required parking spaces
  const requiredSpaces = Math.ceil((usableArea / 100) * adjustedRatio);
  const minSpaces = Math.ceil(requiredSpaces * 0.8); // 20% buffer down
  const recommendedSpaces = requiredSpaces;
  const maxSpaces = Math.ceil(requiredSpaces * 1.3); // 30% buffer up

  // Calculate spaces per area for display
  const spacesPerHundred = (requiredSpaces / (usableArea / 100)).toFixed(1);

  // Building type names for display
  const buildingNames = {
    office: "офісна будівля",
    retail: "торговельний заклад",
    residential: "житлова будівля", 
    restaurant: "ресторан/кафе",
    hotel: "готель",
    medical: "медичний заклад",
    education: "навчальний заклад",
    warehouse: "склад/виробництво"
  };

  const locationNames = {
    "city-center": "центр міста",
    "residential": "житловий район",
    "suburban": "передмістя",
    "industrial": "промислова зона"
  };

  const transitNames = {
    "excellent": "відмінна",
    "good": "хороша", 
    "limited": "обмежена",
    "none": "відсутня"
  };

  document.getElementById("parking-result").innerHTML = `
    <div class="insight-card success">
      <h6>🚗 Рекомендована кількість паркомісць</h6>
      <div style="font-size: 2.2em; font-weight: bold; color: #28a745; margin: 0.5em 0;">
        ${recommendedSpaces} місць
      </div>
      <p style="margin: 0; color: #666;">
        ${spacesPerHundred} місць на 100 м² корисної площі
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
      <div class="insight-card">
        <h6>📊 Мінімум</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #007bff;">
          ${minSpaces} місць
        </div>
        <small>За нормами ДБН</small>
      </div>
      
      <div class="insight-card warning">
        <h6>🎯 Оптимум</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #856404;">
          ${recommendedSpaces} місць
        </div>
        <small>Рекомендовано</small>
      </div>
      
      <div class="insight-card">
        <h6>📈 Максимум</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #6c757d;">
          ${maxSpaces} місць
        </div>
        <small>З резервом</small>
      </div>
    </div>

    <div class="insight-card info">
      <h6>📋 Деталі розрахунку</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9em;">
          <div><strong>Тип будівлі:</strong></div>
          <div>${buildingNames[buildingType]}</div>
          
          <div><strong>Корисна площа:</strong></div>
          <div>${usableArea.toLocaleString()} м²</div>
          
          <div><strong>Розташування:</strong></div>
          <div>${locationNames[locationType]}</div>
          
          <div><strong>Автомобілізація:</strong></div>
          <div>${carOwnership} авто/1000 жителів</div>
          
          <div><strong>Громадський транспорт:</strong></div>
          <div>${transitNames[transitAccess]}</div>
          
          <div><strong>Базовий коефіцієнт:</strong></div>
          <div>${baseRatio} місць/100м²</div>
          
          <div><strong>Скоригований коефіцієнт:</strong></div>
          <div>${adjustedRatio.toFixed(2)} місць/100м²</div>
        </div>
      </div>
    </div>

    <div class="insight-card">
      <h6>💡 Рекомендації</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <ul style="margin: 0; padding-left: 1.5rem;">
          ${getRecommendations(buildingType, locationType, transitAccess, requiredSpaces)}
        </ul>
      </div>
    </div>
  `;
});

function getRecommendations(buildingType, locationType, transitAccess, spaces) {
  let recommendations = [];

  if (spaces > 100) {
    recommendations.push("Розгляньте багаторівневу парковку для оптимізації використання території");
  }

  if (locationType === "city-center") {
    recommendations.push("У центрі міста можливе зменшення норм за рахунок громадського транспорту");
  }

  if (transitAccess === "none") {
    recommendations.push("При відсутності громадського транспорту врахуйте додаткові 20-30% місць");
  }

  if (buildingType === "retail") {
    recommendations.push("Для торгівлі важлива доступність парковки — розташовуйте її біля входу");
  }

  if (buildingType === "office") {
    recommendations.push("Для офісів врахуйте робочий графік і можливість спільного використання");
  }

  if (buildingType === "residential") {
    recommendations.push("Для житла додайте гостьові місця (10-15% від загальної кількості)");
  }

  recommendations.push("Передбачте місця для людей з інвалідністю (5% від загальної кількості)");
  recommendations.push("Розгляньте можливість встановлення зарядних станцій для електромобілів");

  return recommendations.map(rec => `<li>${rec}</li>`).join("");
}