document.getElementById("parking-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const buildingType = document.getElementById("building-type").value;
  const totalArea = parseFloat(document.getElementById("total-area").value) || 0;
  const usableArea = parseFloat(document.getElementById("usable-area").value) || totalArea;
  const locationType = document.getElementById("location-type").value;
  const carOwnership = parseFloat(document.getElementById("car-ownership").value) || 300;
  const transitAccess = document.getElementById("transit-access").value;

  if (!buildingType) {
    alert("Please select a building type");
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
    office: "office building",
    retail: "retail facility",
    residential: "residential building", 
    restaurant: "restaurant/cafe",
    hotel: "hotel",
    medical: "medical facility",
    education: "educational facility",
    warehouse: "warehouse/manufacturing"
  };

  const locationNames = {
    "city-center": "city center",
    "residential": "residential area",
    "suburban": "suburban",
    "industrial": "industrial zone"
  };

  const transitNames = {
    "excellent": "excellent",
    "good": "good", 
    "limited": "limited",
    "none": "none"
  };

  document.getElementById("parking-result").innerHTML = `
    <div class="insight-card success">
      <h6>🚗 Recommended Number of Parking Spaces</h6>
      <div style="font-size: 2.2em; font-weight: bold; color: #28a745; margin: 0.5em 0;">
        ${recommendedSpaces} spaces
      </div>
      <p style="margin: 0; color: #666;">
        ${spacesPerHundred} spaces per 100 m² of usable area
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
      <div class="insight-card">
        <h6>📊 Minimum</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #007bff;">
          ${minSpaces} spaces
        </div>
        <small>Building code minimum</small>
      </div>
      
      <div class="insight-card warning">
        <h6>🎯 Optimal</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #856404;">
          ${recommendedSpaces} spaces
        </div>
        <small>Recommended</small>
      </div>
      
      <div class="insight-card">
        <h6>📈 Maximum</h6>
        <div style="font-size: 1.5em; font-weight: bold; color: #6c757d;">
          ${maxSpaces} spaces
        </div>
        <small>With buffer</small>
      </div>
    </div>

    <div class="insight-card info">
      <h6>📋 Calculation Details</h6>
      <div style="text-align: left; margin-top: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9em;">
          <div><strong>Building type:</strong></div>
          <div>${buildingNames[buildingType]}</div>
          
          <div><strong>Usable area:</strong></div>
          <div>${usableArea.toLocaleString()} m²</div>
          
          <div><strong>Location:</strong></div>
          <div>${locationNames[locationType]}</div>
          
          <div><strong>Car ownership:</strong></div>
          <div>${carOwnership} cars/1000 residents</div>
          
          <div><strong>Public transit:</strong></div>
          <div>${transitNames[transitAccess]}</div>
          
          <div><strong>Base ratio:</strong></div>
          <div>${baseRatio} spaces/100m²</div>
          
          <div><strong>Adjusted ratio:</strong></div>
          <div>${adjustedRatio.toFixed(2)} spaces/100m²</div>
        </div>
      </div>
    </div>

    <div class="insight-card">
      <h6>💡 Recommendations</h6>
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
    recommendations.push("Consider multi-level parking to optimize land use");
  }

  if (locationType === "city-center") {
    recommendations.push("City center locations may qualify for reduced parking requirements");
  }

  if (transitAccess === "none") {
    recommendations.push("With no public transit, consider adding 20-30% more spaces");
  }

  if (buildingType === "retail") {
    recommendations.push("For retail, parking accessibility is crucial — place close to entrances");
  }

  if (buildingType === "office") {
    recommendations.push("For offices, consider work schedules and shared parking opportunities");
  }

  if (buildingType === "residential") {
    recommendations.push("For residential, add guest parking (10-15% of total spaces)");
  }

  recommendations.push("Include accessible parking spaces (5% of total)");
  recommendations.push("Consider electric vehicle charging stations for future needs");

  return recommendations.map(rec => `<li>${rec}</li>`).join("");
}