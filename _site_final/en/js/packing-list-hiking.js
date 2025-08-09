document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("packing-form");
  if (!form) return;

  // Comprehensive gear database
  const gearDatabase = {
    // Ten Essentials (always included)
    essentials: [
      { name: "Map and compass/GPS", category: "Navigation", priority: "critical" },
      { name: "Headlamp + extra batteries", category: "Navigation", priority: "critical" },
      { name: "First aid kit", category: "Safety", priority: "critical" },
      { name: "Multi-tool or knife", category: "Tools", priority: "critical" },
      { name: "Fire starter (waterproof)", category: "Safety", priority: "critical" },
      { name: "Emergency shelter/bivy", category: "Safety", priority: "critical" },
      { name: "Extra food (1 day)", category: "Food", priority: "critical" },
      { name: "Water bottles/hydration", category: "Hydration", priority: "critical" },
      { name: "Rain jacket", category: "Clothing", priority: "critical" },
      { name: "Whistle", category: "Safety", priority: "critical" }
    ],

    // Clothing system
    clothing: {
      base: [
        { name: "Moisture-wicking underwear", category: "Clothing", conditions: ["all"] },
        { name: "Hiking pants/shorts", category: "Clothing", conditions: ["all"] },
        { name: "Long-sleeve hiking shirt", category: "Clothing", conditions: ["all"] },
        { name: "Hiking socks (2-3 pairs)", category: "Clothing", conditions: ["all"] }
      ],
      insulation: [
        { name: "Insulating jacket (fleece/down)", category: "Clothing", conditions: ["cool", "cold", "freezing"] },
        { name: "Warm hat", category: "Clothing", conditions: ["cool", "cold", "freezing"] },
        { name: "Gloves", category: "Clothing", conditions: ["cold", "freezing"] },
        { name: "Neck gaiter", category: "Clothing", conditions: ["cold", "freezing"] }
      ],
      sun: [
        { name: "Sun hat", category: "Clothing", conditions: ["hot", "warm", "desert"] },
        { name: "Sunglasses", category: "Clothing", conditions: ["all"] },
        { name: "Sunscreen (SPF 30+)", category: "Personal Care", conditions: ["all"] }
      ]
    },

    // Footwear
    footwear: [
      { name: "Hiking boots/shoes", category: "Footwear", conditions: ["all"] },
      { name: "Gaiters", category: "Footwear", conditions: ["difficult", "expert", "winter"] },
      { name: "Camp shoes/sandals", category: "Footwear", duration: ["overnight", "weekend", "extended", "expedition"] }
    ],

    // Shelter and sleep system
    shelter: [
      { name: "Tent (appropriate season)", category: "Shelter", duration: ["overnight", "weekend", "extended", "expedition"] },
      { name: "Sleeping bag", category: "Shelter", duration: ["overnight", "weekend", "extended", "expedition"] },
      { name: "Sleeping pad", category: "Shelter", duration: ["overnight", "weekend", "extended", "expedition"] },
      { name: "Pillow or inflatable pillow", category: "Shelter", duration: ["overnight", "weekend", "extended", "expedition"], comfort: ["standard", "luxury"] }
    ],

    // Cooking and food
    cooking: [
      { name: "Stove and fuel", category: "Cooking", duration: ["overnight", "weekend", "extended", "expedition"] },
      { name: "Cookpot and utensils", category: "Cooking", duration: ["overnight", "weekend", "extended", "expedition"] },
      { name: "Lightweight bowl/mug", category: "Cooking", duration: ["overnight", "weekend", "extended", "expedition"] },
      { name: "Bear canister/rope", category: "Food Storage", duration: ["overnight", "weekend", "extended", "expedition"], terrain: ["mountain", "forest"] }
    ],

    // Hydration
    hydration: [
      { name: "Water purification tablets", category: "Hydration", duration: ["overnight", "weekend", "extended", "expedition"] },
      { name: "Water filter", category: "Hydration", duration: ["weekend", "extended", "expedition"] },
      { name: "Extra water bottles", category: "Hydration", terrain: ["desert"], temp: ["hot"] }
    ],

    // Personal care
    personalCare: [
      { name: "Toiletries (biodegradable)", category: "Personal Care", duration: ["overnight", "weekend", "extended", "expedition"] },
      { name: "Toilet paper and trowel", category: "Personal Care", duration: ["overnight", "weekend", "extended", "expedition"] },
      { name: "Personal medications", category: "Personal Care", conditions: ["all"] },
      { name: "Lip balm", category: "Personal Care", conditions: ["all"] }
    ],

    // Tools and accessories
    tools: [
      { name: "Duct tape", category: "Tools", duration: ["weekend", "extended", "expedition"] },
      { name: "Paracord (50ft)", category: "Tools", duration: ["weekend", "extended", "expedition"] },
      { name: "Repair kit", category: "Tools", duration: ["extended", "expedition"] }
    ],

    // Special conditions
    special: {
      photography: [
        { name: "Camera and extra batteries", category: "Electronics", special: "photography" },
        { name: "Tripod (lightweight)", category: "Electronics", special: "photography" },
        { name: "Lens cleaning kit", category: "Electronics", special: "photography" }
      ],
      fishing: [
        { name: "Fishing license", category: "Documents", special: "fishing" },
        { name: "Lightweight fishing rod", category: "Recreation", special: "fishing" },
        { name: "Tackle box (compact)", category: "Recreation", special: "fishing" }
      ],
      climbing: [
        { name: "Climbing harness", category: "Technical", special: "climbing" },
        { name: "Climbing helmet", category: "Technical", special: "climbing" },
        { name: "Dynamic rope", category: "Technical", special: "climbing" },
        { name: "Quickdraws/carabiners", category: "Technical", special: "climbing" }
      ],
      water: [
        { name: "Quick-dry towel", category: "Personal Care", special: "water" },
        { name: "Waterproof bag for electronics", category: "Safety", special: "water" }
      ],
      wildlife: [
        { name: "Bear spray", category: "Safety", special: "wildlife" },
        { name: "Food hanging kit", category: "Food Storage", special: "wildlife" }
      ],
      medical: [
        { name: "Extended first aid kit", category: "Safety", special: "medical" },
        { name: "Emergency medications", category: "Safety", special: "medical" },
        { name: "Medical alert information", category: "Documents", special: "medical" }
      ]
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const tripDuration = document.getElementById("tripDuration").value;
    const groupSize = document.getElementById("groupSize").value;
    const season = document.getElementById("season").value;
    const temperatureRange = document.getElementById("temperatureRange").value;
    const precipitation = document.getElementById("precipitation").value;
    const difficulty = document.getElementById("difficulty").value;
    const terrain = document.getElementById("terrain").value;
    const experience = document.getElementById("experience").value;
    const comfort = document.getElementById("comfort").value;

    // Special considerations
    const photography = document.getElementById("photography").checked;
    const fishing = document.getElementById("fishing").checked;
    const climbing = document.getElementById("climbing").checked;
    const water = document.getElementById("water").checked;
    const wildlife = document.getElementById("wildlife").checked;
    const medical = document.getElementById("medical").checked;

    // Generate gear list
    const packingList = generatePackingList({
      tripDuration, groupSize, season, temperatureRange, precipitation,
      difficulty, terrain, experience, comfort,
      specialNeeds: { photography, fishing, climbing, water, wildlife, medical }
    });

    // Group items by category
    const categorizedList = categorizeGear(packingList);
    
    // Calculate statistics
    const stats = calculateGearStats(categorizedList);

    // Display results
    displayPackingList(categorizedList, stats, {
      tripDuration, temperatureRange, difficulty, terrain, experience
    });

    // Show chart
    showGearChart(stats);
  });

  function generatePackingList(params) {
    let packingList = [];

    // Always include ten essentials
    packingList = packingList.concat(gearDatabase.essentials);

    // Add clothing based on conditions
    packingList = packingList.concat(gearDatabase.clothing.base);
    
    // Add insulation for cooler conditions
    if (["cool", "cold", "freezing"].includes(params.temperatureRange)) {
      packingList = packingList.concat(gearDatabase.clothing.insulation);
    }

    // Add sun protection
    packingList = packingList.concat(gearDatabase.clothing.sun);

    // Add footwear
    packingList = packingList.concat(gearDatabase.footwear.filter(item => 
      !item.duration || item.duration.includes(params.tripDuration)
    ));

    // Add shelter system for overnight trips
    if (params.tripDuration !== "day") {
      packingList = packingList.concat(gearDatabase.shelter.filter(item =>
        !item.comfort || item.comfort.includes(params.comfort)
      ));
    }

    // Add cooking gear for overnight trips
    if (params.tripDuration !== "day") {
      packingList = packingList.concat(gearDatabase.cooking);
    }

    // Add hydration gear
    packingList = packingList.concat(gearDatabase.hydration.filter(item =>
      !item.duration || item.duration.includes(params.tripDuration)
    ));

    // Add personal care items
    packingList = packingList.concat(gearDatabase.personalCare.filter(item =>
      !item.duration || item.duration.includes(params.tripDuration)
    ));

    // Add tools for longer trips
    packingList = packingList.concat(gearDatabase.tools.filter(item =>
      !item.duration || item.duration.includes(params.tripDuration)
    ));

    // Add weather-specific items
    if (["high", "certain"].includes(params.precipitation)) {
      packingList.push({ name: "Rain pants", category: "Clothing", priority: "important" });
      packingList.push({ name: "Pack cover", category: "Gear", priority: "important" });
    }

    // Add terrain-specific items
    if (params.terrain === "desert") {
      packingList.push({ name: "Extra electrolytes", category: "Hydration", priority: "important" });
      packingList.push({ name: "Lightweight shade tarp", category: "Shelter", priority: "useful" });
    }

    if (params.terrain === "winter" || params.temperatureRange === "freezing") {
      packingList.push({ name: "Microspikes/crampons", category: "Footwear", priority: "important" });
      packingList.push({ name: "Avalanche beacon", category: "Safety", priority: "critical" });
    }

    // Add special needs equipment
    Object.keys(params.specialNeeds).forEach(need => {
      if (params.specialNeeds[need] && gearDatabase.special[need]) {
        packingList = packingList.concat(gearDatabase.special[need]);
      }
    });

    // Add experience-based recommendations
    if (params.experience === "beginner") {
      packingList.push({ name: "Hiking guidebook", category: "Navigation", priority: "useful" });
      packingList.push({ name: "Emergency contact info", category: "Documents", priority: "important" });
    }

    // Filter duplicates
    const uniqueList = packingList.filter((item, index, self) =>
      index === self.findIndex(i => i.name === item.name)
    );

    return uniqueList;
  }

  function categorizeGear(gearList) {
    const categories = {};
    
    gearList.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    // Sort categories by priority
    Object.keys(categories).forEach(category => {
      categories[category].sort((a, b) => {
        const priorityOrder = { "critical": 0, "important": 1, "useful": 2 };
        return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
      });
    });

    return categories;
  }

  function calculateGearStats(categorizedList) {
    const stats = {};
    let totalItems = 0;

    Object.keys(categorizedList).forEach(category => {
      stats[category] = categorizedList[category].length;
      totalItems += categorizedList[category].length;
    });

    stats.total = totalItems;
    return stats;
  }

  function displayPackingList(categorizedList, stats, params) {
    const resultBlock = document.getElementById("packing-result");
    
    const categoryOrder = ["Navigation", "Safety", "Clothing", "Footwear", "Shelter", "Hydration", "Food", "Cooking", "Personal Care", "Tools", "Electronics", "Technical", "Recreation", "Documents", "Gear"];

    resultBlock.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>📋 Total Items</h6>
          <div class="big-number">${stats.total}</div>
          <p class="insight-detail">gear pieces</p>
        </div>
        <div class="insight-card info">
          <h6>🎯 Categories</h6>
          <div class="big-number">${Object.keys(categorizedList).length}</div>
          <p class="insight-detail">gear categories</p>
        </div>
        <div class="insight-card ${getDifficultyClass(params.difficulty)}">
          <h6>⛰️ Trip Level</h6>
          <div class="big-number">${params.difficulty.toUpperCase()}</div>
          <p class="insight-detail">${params.tripDuration} ${params.terrain}</p>
        </div>
        <div class="insight-card warning">
          <h6>🌡️ Temperature</h6>
          <div class="big-number">${params.temperatureRange.toUpperCase()}</div>
          <p class="insight-detail">${params.experience} level</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: var(--radius);">
        <h4 style="margin-top: 0;">🎒 Your Personalized Packing List</h4>
        
        ${categoryOrder.filter(cat => categorizedList[cat]).map(category => `
          <div style="margin-bottom: 2rem;">
            <h5 style="margin-bottom: 1rem; color: var(--accent); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem;">
              ${getCategoryIcon(category)} ${category} (${categorizedList[category].length} items)
            </h5>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem;">
              ${categorizedList[category].map(item => `
                <div style="display: flex; align-items: center; padding: 0.5rem; background: white; border-radius: 8px; border-left: 4px solid ${getPriorityColor(item.priority)};">
                  <input type="checkbox" style="margin-right: 0.75rem; transform: scale(1.2);">
                  <span style="font-weight: ${item.priority === 'critical' ? '600' : '400'}; color: ${item.priority === 'critical' ? '#d32f2f' : '#333'};">
                    ${item.name}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <div style="margin-top: 2rem; padding: 1.5rem; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
          <h4 style="margin-top: 0; color: #1976d2;">💡 Packing Tips for Your Trip</h4>
          ${getPackingTips(params)}
        </div>

        <div style="margin-top: 1.5rem; padding: 1.5rem; background: #fff3e0; border-radius: 8px; border: 2px solid #f57c00;">
          <h4 style="margin-top: 0; color: #f57c00;">⚠️ Safety Reminders</h4>
          <ul style="margin: 0;">
            <li><strong>Check weather forecast</strong> before departure and pack accordingly</li>
            <li><strong>Share your trip plan</strong> with someone reliable</li>
            <li><strong>Know your limits</strong> - turn back if conditions deteriorate</li>
            <li><strong>Carry emergency communication</strong> for remote areas</li>
            <li><strong>Pack extra food and water</strong> beyond your planned needs</li>
          </ul>
        </div>
      </div>
    `;
  }

  function getDifficultyClass(difficulty) {
    const classes = {
      easy: "success",
      moderate: "info", 
      difficult: "warning",
      expert: "warning"
    };
    return classes[difficulty] || "info";
  }

  function getCategoryIcon(category) {
    const icons = {
      Navigation: "🧭",
      Safety: "🚨", 
      Clothing: "👕",
      Footwear: "🥾",
      Shelter: "⛺",
      Hydration: "💧",
      Food: "🥘",
      Cooking: "🍳",
      "Personal Care": "🧴",
      Tools: "🔧",
      Electronics: "📱",
      Technical: "🧗",
      Recreation: "🎣",
      Documents: "📋",
      Gear: "🎒"
    };
    return icons[category] || "📦";
  }

  function getPriorityColor(priority) {
    const colors = {
      critical: "#f44336",
      important: "#ff9800", 
      useful: "#4caf50"
    };
    return colors[priority] || "#2196f3";
  }

  function getPackingTips(params) {
    let tips = [];
    
    if (params.tripDuration === "day") {
      tips.push("Focus on the Ten Essentials - safety over comfort for day hikes");
    } else {
      tips.push("Test all gear at home before your trip, especially shelter and cooking equipment");
    }

    if (params.temperatureRange === "cold" || params.temperatureRange === "freezing") {
      tips.push("Use the layering system: base layer + insulating layer + shell layer");
    }

    if (params.experience === "beginner") {
      tips.push("Start with shorter, easier trips to test your gear and build experience");
    }

    tips.push("Pack items in reverse order - last in, first out for frequently needed gear");
    tips.push("Keep essential items easily accessible in side pockets or top compartment");

    return `<ul style="margin: 0;">${tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`;
  }

  function showGearChart(stats) {
    const chartBlock = document.getElementById("packing-chart-block");
    chartBlock.style.display = "block";

    ensureChartJs(() => {
      const ctx = document.getElementById("packing-chart").getContext("2d");
      if (window.packingChart) window.packingChart.destroy();

      const categories = Object.keys(stats).filter(key => key !== 'total');
      const data = categories.map(cat => stats[cat]);
      const colors = categories.map((_, index) => `hsl(${index * 40}, 70%, 60%)`);

      window.packingChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: categories,
          datasets: [{
            data: data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Total Gear Items: ${stats.total}`
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          }
        }
      });
    });
  }
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