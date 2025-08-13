document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("best-time-form");
  const resultDiv = document.getElementById("best-time-result");
  
  // Update range value displays
  const weatherSlider = document.getElementById("weather-priority");
  const crowdSlider = document.getElementById("crowd-priority");
  const priceSlider = document.getElementById("price-priority");
  
  weatherSlider.addEventListener("input", () => {
    document.getElementById("weather-value").textContent = weatherSlider.value;
  });
  
  crowdSlider.addEventListener("input", () => {
    document.getElementById("crowd-value").textContent = crowdSlider.value;
  });
  
  priceSlider.addEventListener("input", () => {
    document.getElementById("price-value").textContent = priceSlider.value;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateBestTime();
  });

  const destinationSelect = document.getElementById("destination");
  destinationSelect.addEventListener("change", function() {
    if (this.value) {
      calculateBestTime();
    }
  });

  // Comprehensive destination data
  const destinationData = {
    japan: {
      name: "Japan",
      monthlyData: [
        { month: "January", weather: 2, crowds: 2, price: 3, temp: "5°C", rainfall: "Low", notes: "Cold, snow in mountains, New Year holidays" },
        { month: "February", weather: 2, crowds: 2, price: 3, temp: "6°C", rainfall: "Low", notes: "Cold, plum blossoms, fewer tourists" },
        { month: "March", weather: 3, crowds: 3, price: 4, temp: "10°C", rainfall: "Moderate", notes: "Spring begins, prices rising" },
        { month: "April", weather: 5, crowds: 5, price: 5, temp: "15°C", rainfall: "Moderate", notes: "Cherry blossoms! Peak tourist season" },
        { month: "May", weather: 5, crowds: 4, price: 4, temp: "20°C", rainfall: "Moderate", notes: "Perfect weather, greenery, Golden Week" },
        { month: "June", weather: 3, crowds: 3, price: 3, temp: "23°C", rainfall: "High", notes: "Rainy season begins, humid" },
        { month: "July", weather: 2, crowds: 4, price: 4, temp: "27°C", rainfall: "High", notes: "Hot, humid, summer holidays" },
        { month: "August", weather: 2, crowds: 4, price: 4, temp: "28°C", rainfall: "High", notes: "Hottest, festivals, expensive" },
        { month: "September", weather: 3, crowds: 3, price: 3, temp: "24°C", rainfall: "Moderate", notes: "Autumn, typhoons possible" },
        { month: "October", weather: 5, crowds: 4, price: 4, temp: "18°C", rainfall: "Low", notes: "Fall foliage, perfect weather" },
        { month: "November", weather: 4, crowds: 3, price: 3, temp: "13°C", rainfall: "Low", notes: "Great weather, autumn colors" },
        { month: "December", weather: 3, crowds: 2, price: 3, temp: "8°C", rainfall: "Low", notes: "Getting cold, winter illuminations" }
      ],
      bestMonths: ["April", "May", "October", "November"],
      worstMonths: ["July", "August"],
      highlights: ["🌸 Cherry blossom season (April)", "🍁 Fall foliage (Oct-Nov)", "⛩️ Temples and culture", "🗻 Mount Fuji"],
      tips: ["Book early for cherry blossom season", "Avoid Golden Week (early May)", "JR Pass worthwhile for intercity travel"]
    },
    hawaii: {
      name: "Hawaii",
      monthlyData: [
        { month: "January", weather: 4, crowds: 5, price: 5, temp: "24°C", rainfall: "Moderate", notes: "High season, expensive, rains" },
        { month: "February", weather: 4, crowds: 5, price: 5, temp: "24°C", rainfall: "Moderate", notes: "High season, peak prices" },
        { month: "March", weather: 4, crowds: 4, price: 5, temp: "25°C", rainfall: "Moderate", notes: "Still high season" },
        { month: "April", weather: 5, crowds: 3, price: 3, temp: "26°C", rainfall: "Low", notes: "Perfect weather, fewer crowds" },
        { month: "May", weather: 5, crowds: 3, price: 3, temp: "27°C", rainfall: "Low", notes: "Ideal time, moderate prices" },
        { month: "June", weather: 4, crowds: 4, price: 4, temp: "28°C", rainfall: "Low", notes: "Summer begins, getting hotter" },
        { month: "July", weather: 3, crowds: 5, price: 5, temp: "29°C", rainfall: "Low", notes: "Hot, summer vacation crowds" },
        { month: "August", weather: 3, crowds: 5, price: 5, temp: "30°C", rainfall: "Low", notes: "Hottest, most expensive" },
        { month: "September", weather: 4, crowds: 3, price: 3, temp: "29°C", rainfall: "Low", notes: "Warm, fewer tourists" },
        { month: "October", weather: 5, crowds: 3, price: 3, temp: "28°C", rainfall: "Low", notes: "Perfect weather, good prices" },
        { month: "November", weather: 4, crowds: 3, price: 3, temp: "26°C", rainfall: "Moderate", notes: "Pleasant, fewer crowds" },
        { month: "December", weather: 4, crowds: 4, price: 4, temp: "25°C", rainfall: "Moderate", notes: "Holiday season, prices rising" }
      ],
      bestMonths: ["April", "May", "September", "October"],
      worstMonths: ["July", "August"],
      highlights: ["🏖️ Beautiful beaches", "🌋 Volcanoes", "🐠 Diving and snorkeling", "🏄 Surfing"],
      tips: ["Avoid summer vacation for better prices", "Nov-Mar is rainy season", "Each island has different microclimates"]
    },
    iceland: {
      name: "Iceland",
      monthlyData: [
        { month: "January", weather: 2, crowds: 2, price: 3, temp: "-1°C", rainfall: "Moderate", notes: "Northern lights, short days, cold" },
        { month: "February", weather: 2, crowds: 2, price: 3, temp: "0°C", rainfall: "Moderate", notes: "Northern lights, ice caves" },
        { month: "March", weather: 2, crowds: 3, price: 3, temp: "2°C", rainfall: "Moderate", notes: "Northern lights possible, days getting longer" },
        { month: "April", weather: 3, crowds: 3, price: 3, temp: "5°C", rainfall: "Moderate", notes: "Spring, some roads closed" },
        { month: "May", weather: 4, crowds: 4, price: 4, temp: "9°C", rainfall: "Moderate", notes: "Lupins blooming, more access" },
        { month: "June", weather: 5, crowds: 5, price: 5, temp: "12°C", rainfall: "Moderate", notes: "White nights, everything accessible" },
        { month: "July", weather: 5, crowds: 5, price: 5, temp: "14°C", rainfall: "Moderate", notes: "Warmest, peak tourist season" },
        { month: "August", weather: 5, crowds: 5, price: 5, temp: "13°C", rainfall: "Moderate", notes: "Still warm, lupins, expensive" },
        { month: "September", weather: 4, crowds: 3, price: 3, temp: "10°C", rainfall: "Moderate", notes: "Autumn, northern lights return" },
        { month: "October", weather: 3, crowds: 2, price: 3, temp: "6°C", rainfall: "Moderate", notes: "Northern lights, stormy weather" },
        { month: "November", weather: 2, crowds: 2, price: 3, temp: "2°C", rainfall: "High", notes: "Storm winds, northern lights" },
        { month: "December", weather: 2, crowds: 2, price: 3, temp: "0°C", rainfall: "Moderate", notes: "Darkest, northern lights peak" }
      ],
      bestMonths: ["June", "July", "August", "September"],
      worstMonths: ["November", "December", "January"],
      highlights: ["✨ Northern lights (Sep-Mar)", "❄️ Ice caves", "♨️ Hot springs", "💎 Glacier lagoons"],
      tips: ["Summer for hiking, winter for northern lights", "Always pack warm clothes", "4WD rental car recommended"]
    },
    "costa-rica": {
      name: "Costa Rica",
      monthlyData: [
        { month: "January", weather: 5, crowds: 5, price: 5, temp: "27°C", rainfall: "Low", notes: "Dry season, perfect weather, expensive" },
        { month: "February", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Low", notes: "Best time, peak tourism" },
        { month: "March", weather: 5, crowds: 4, price: 5, temp: "29°C", rainfall: "Low", notes: "Dry, hot, fewer crowds" },
        { month: "April", weather: 4, crowds: 4, price: 4, temp: "29°C", rainfall: "Low", notes: "End of dry season, hot" },
        { month: "May", weather: 3, crowds: 2, price: 2, temp: "28°C", rainfall: "Moderate", notes: "Rains begin, green season" },
        { month: "June", weather: 3, crowds: 2, price: 2, temp: "27°C", rainfall: "High", notes: "Rainy season, cheaper" },
        { month: "July", weather: 3, crowds: 2, price: 2, temp: "27°C", rainfall: "High", notes: "Daily rains, low prices" },
        { month: "August", weather: 3, crowds: 2, price: 2, temp: "27°C", rainfall: "High", notes: "Rainy season continues" },
        { month: "September", weather: 2, crowds: 1, price: 1, temp: "27°C", rainfall: "Very High", notes: "Peak rainy season, cheapest" },
        { month: "October", weather: 2, crowds: 1, price: 1, temp: "26°C", rainfall: "Very High", notes: "Lots of rain, some roads closed" },
        { month: "November", weather: 3, crowds: 2, price: 2, temp: "26°C", rainfall: "Moderate", notes: "Rains decreasing, green" },
        { month: "December", weather: 4, crowds: 4, price: 4, temp: "26°C", rainfall: "Low", notes: "Dry season begins" }
      ],
      bestMonths: ["December", "January", "February", "March"],
      worstMonths: ["September", "October"],
      highlights: ["🦜 Biodiversity", "🌋 Volcanoes", "🏖️ Two ocean coastlines", "🦥 Wildlife"],
      tips: ["Dry season expensive but reliable", "Green season cheaper with morning rains", "Always carry rain gear"]
    },
    thailand: {
      name: "Thailand",
      monthlyData: [
        { month: "January", weather: 5, crowds: 5, price: 5, temp: "26°C", rainfall: "Low", notes: "Perfect weather, peak tourism" },
        { month: "February", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Low", notes: "Best time, expensive" },
        { month: "March", weather: 4, crowds: 4, price: 4, temp: "30°C", rainfall: "Low", notes: "Hot, less rain" },
        { month: "April", weather: 3, crowds: 3, price: 3, temp: "32°C", rainfall: "Low", notes: "Very hot, Songkran festival" },
        { month: "May", weather: 3, crowds: 2, price: 2, temp: "31°C", rainfall: "Moderate", notes: "Hot, rains begin" },
        { month: "June", weather: 2, crowds: 2, price: 2, temp: "30°C", rainfall: "High", notes: "Rainy season, humid" },
        { month: "July", weather: 2, crowds: 2, price: 2, temp: "29°C", rainfall: "High", notes: "Peak rainy season" },
        { month: "August", weather: 2, crowds: 2, price: 2, temp: "29°C", rainfall: "High", notes: "Rains, humid, cheap" },
        { month: "September", weather: 2, crowds: 2, price: 2, temp: "29°C", rainfall: "High", notes: "Rainy season continues" },
        { month: "October", weather: 3, crowds: 2, price: 3, temp: "29°C", rainfall: "Moderate", notes: "Rains decreasing" },
        { month: "November", weather: 4, crowds: 3, price: 4, temp: "28°C", rainfall: "Low", notes: "Weather improving" },
        { month: "December", weather: 5, crowds: 4, price: 5, temp: "26°C", rainfall: "Low", notes: "Great weather, prices rising" }
      ],
      bestMonths: ["November", "December", "January", "February"],
      worstMonths: ["June", "July", "August"],
      highlights: ["🏖️ Tropical beaches", "🛕 Temples", "🍜 Street food", "🏝️ Islands"],
      tips: ["North drier than south", "Rainy season means short showers", "Appreciate air conditioning in summer"]
    },
    greece: {
      name: "Greece",
      monthlyData: [
        { month: "January", weather: 2, crowds: 1, price: 2, temp: "10°C", rainfall: "High", notes: "Cold, rain, many things closed" },
        { month: "February", weather: 2, crowds: 1, price: 2, temp: "11°C", rainfall: "High", notes: "Cold, limited island transport" },
        { month: "March", weather: 3, crowds: 2, price: 2, temp: "14°C", rainfall: "Moderate", notes: "Spring begins" },
        { month: "April", weather: 4, crowds: 3, price: 3, temp: "18°C", rainfall: "Moderate", notes: "Great weather, flowers blooming" },
        { month: "May", weather: 5, crowds: 4, price: 4, temp: "23°C", rainfall: "Low", notes: "Perfect for sightseeing" },
        { month: "June", weather: 5, crowds: 4, price: 4, temp: "28°C", rainfall: "Low", notes: "Warm, sea warming up" },
        { month: "July", weather: 3, crowds: 5, price: 5, temp: "31°C", rainfall: "Low", notes: "Very hot, overcrowded" },
        { month: "August", weather: 3, crowds: 5, price: 5, temp: "31°C", rainfall: "Low", notes: "Hottest, peak tourism" },
        { month: "September", weather: 5, crowds: 4, price: 4, temp: "27°C", rainfall: "Low", notes: "Perfect weather, warm sea" },
        { month: "October", weather: 4, crowds: 3, price: 3, temp: "21°C", rainfall: "Moderate", notes: "Pleasant, fewer crowds" },
        { month: "November", weather: 3, crowds: 2, price: 2, temp: "16°C", rainfall: "Moderate", notes: "Cool, some services closing" },
        { month: "December", weather: 2, crowds: 1, price: 2, temp: "12°C", rainfall: "High", notes: "Cold, rain, low season" }
      ],
      bestMonths: ["May", "June", "September", "October"],
      worstMonths: ["July", "August"],
      highlights: ["🏛️ Ancient sites", "🏝️ Greek islands", "🫒 Mediterranean cuisine", "🌊 Clear seas"],
      tips: ["Avoid August for comfort", "Islands best May-October", "Mainland Greece nice in spring"]
    },
    alaska: {
      name: "Alaska",
      monthlyData: [
        { month: "January", weather: 1, crowds: 1, price: 2, temp: "-15°C", rainfall: "Low", notes: "Very cold, polar night" },
        { month: "February", weather: 1, crowds: 1, price: 2, temp: "-12°C", rainfall: "Low", notes: "Cold, northern lights" },
        { month: "March", weather: 2, crowds: 1, price: 2, temp: "-5°C", rainfall: "Low", notes: "Still cold, days getting longer" },
        { month: "April", weather: 2, crowds: 2, price: 3, temp: "2°C", rainfall: "Low", notes: "Spring, snow melting" },
        { month: "May", weather: 3, crowds: 3, price: 4, temp: "10°C", rainfall: "Moderate", notes: "Tourist season begins" },
        { month: "June", weather: 4, crowds: 4, price: 5, temp: "15°C", rainfall: "Moderate", notes: "White nights, everything accessible" },
        { month: "July", weather: 5, crowds: 5, price: 5, temp: "18°C", rainfall: "Moderate", notes: "Warmest, peak tourism" },
        { month: "August", weather: 5, crowds: 5, price: 5, temp: "16°C", rainfall: "Moderate", notes: "Warm, salmon, berries" },
        { month: "September", weather: 4, crowds: 3, price: 4, temp: "11°C", rainfall: "Moderate", notes: "Fall colors, fewer crowds" },
        { month: "October", weather: 3, crowds: 2, price: 3, temp: "4°C", rainfall: "Moderate", notes: "Getting cold, northern lights" },
        { month: "November", weather: 2, crowds: 1, price: 2, temp: "-3°C", rainfall: "Low", notes: "Cold, short days" },
        { month: "December", weather: 1, crowds: 1, price: 2, temp: "-10°C", rainfall: "Low", notes: "Very cold, polar night" }
      ],
      bestMonths: ["June", "July", "August"],
      worstMonths: ["December", "January", "February"],
      highlights: ["🐻 Wildlife", "🐟 Salmon fishing", "❄️ Glaciers", "✨ Northern lights"],
      tips: ["Short tourist season May-September", "Book early for summer", "Always pack warm clothes"]
    },
    italy: {
      name: "Italy",
      monthlyData: [
        { month: "January", weather: 2, crowds: 2, price: 2, temp: "8°C", rainfall: "Moderate", notes: "Cold, rain, museums open" },
        { month: "February", weather: 2, crowds: 2, price: 2, temp: "10°C", rainfall: "Moderate", notes: "Still cool, Venice carnival" },
        { month: "March", weather: 3, crowds: 3, price: 3, temp: "14°C", rainfall: "Moderate", notes: "Spring, flowers blooming" },
        { month: "April", weather: 4, crowds: 4, price: 4, temp: "18°C", rainfall: "Moderate", notes: "Great weather, Easter" },
        { month: "May", weather: 5, crowds: 4, price: 4, temp: "22°C", rainfall: "Low", notes: "Perfect for city touring" },
        { month: "June", weather: 5, crowds: 5, price: 5, temp: "26°C", rainfall: "Low", notes: "Warm, peak tourism begins" },
        { month: "July", weather: 3, crowds: 5, price: 5, temp: "29°C", rainfall: "Low", notes: "Hot, overcrowded, expensive" },
        { month: "August", weather: 3, crowds: 5, price: 5, temp: "29°C", rainfall: "Low", notes: "Hottest, August holidays" },
        { month: "September", weather: 5, crowds: 4, price: 4, temp: "25°C", rainfall: "Low", notes: "Perfect weather, fewer crowds" },
        { month: "October", weather: 4, crowds: 3, price: 3, temp: "20°C", rainfall: "Moderate", notes: "Pleasant, fall colors" },
        { month: "November", weather: 3, crowds: 2, price: 2, temp: "14°C", rainfall: "Moderate", notes: "Cool, rains increasing" },
        { month: "December", weather: 2, crowds: 3, price: 3, temp: "9°C", rainfall: "Moderate", notes: "Cold, Christmas markets" }
      ],
      bestMonths: ["April", "May", "June", "September"],
      worstMonths: ["July", "August"],
      highlights: ["🏛️ Historic sites", "🍕 Italian cuisine", "🎨 Art and museums", "🌊 Coastlines"],
      tips: ["Shoulder seasons are best", "South warmer than north", "Many museums closed Mondays"]
    },
    ireland: {
      name: "Ireland",
      monthlyData: [
        { month: "January", weather: 2, crowds: 1, price: 2, temp: "7°C", rainfall: "High", notes: "Cold, rain, short days" },
        { month: "February", weather: 2, crowds: 1, price: 2, temp: "7°C", rainfall: "High", notes: "Still winter, windy" },
        { month: "March", weather: 3, crowds: 2, price: 3, temp: "9°C", rainfall: "Moderate", notes: "St. Patrick's Day" },
        { month: "April", weather: 3, crowds: 3, price: 3, temp: "11°C", rainfall: "Moderate", notes: "Spring, green" },
        { month: "May", weather: 4, crowds: 3, price: 3, temp: "14°C", rainfall: "Moderate", notes: "Pleasant, flowers blooming" },
        { month: "June", weather: 4, crowds: 4, price: 4, temp: "17°C", rainfall: "Moderate", notes: "Warm, long days" },
        { month: "July", weather: 4, crowds: 5, price: 5, temp: "19°C", rainfall: "Moderate", notes: "Warmest, peak tourism" },
        { month: "August", weather: 4, crowds: 5, price: 5, temp: "18°C", rainfall: "Moderate", notes: "Warm, festivals" },
        { month: "September", weather: 4, crowds: 3, price: 3, temp: "16°C", rainfall: "Moderate", notes: "Pleasant, fewer crowds" },
        { month: "October", weather: 3, crowds: 2, price: 3, temp: "13°C", rainfall: "Moderate", notes: "Autumn, cool" },
        { month: "November", weather: 2, crowds: 1, price: 2, temp: "9°C", rainfall: "High", notes: "Rain, wind, cold" },
        { month: "December", weather: 2, crowds: 2, price: 2, temp: "7°C", rainfall: "High", notes: "Winter, short days" }
      ],
      bestMonths: ["May", "June", "July", "August", "September"],
      worstMonths: ["November", "December", "January"],
      highlights: ["🍀 Green landscapes", "🏰 Castles", "🎵 Traditional music", "🍺 Pubs"],
      tips: ["Always pack rain gear", "Summer is driest", "Bring layers"]
    },
    yellowstone: {
      name: "Yellowstone National Park",
      monthlyData: [
        { month: "January", weather: 1, crowds: 1, price: 2, temp: "-10°C", rainfall: "Low", notes: "Snow, most roads closed" },
        { month: "February", weather: 1, crowds: 1, price: 2, temp: "-8°C", rainfall: "Low", notes: "Snow sports, winter tours" },
        { month: "March", weather: 2, crowds: 1, price: 2, temp: "-2°C", rainfall: "Low", notes: "Still snow, limited access" },
        { month: "April", weather: 2, crowds: 2, price: 3, temp: "5°C", rainfall: "Moderate", notes: "Snow melting, some roads open" },
        { month: "May", weather: 3, crowds: 3, price: 4, temp: "12°C", rainfall: "Moderate", notes: "Spring, more roads open" },
        { month: "June", weather: 4, crowds: 4, price: 5, temp: "18°C", rainfall: "Moderate", notes: "All roads open, wildflowers" },
        { month: "July", weather: 5, crowds: 5, price: 5, temp: "22°C", rainfall: "Low", notes: "Perfect weather, peak visitation" },
        { month: "August", weather: 5, crowds: 5, price: 5, temp: "21°C", rainfall: "Low", notes: "Warm, overcrowded" },
        { month: "September", weather: 4, crowds: 3, price: 4, temp: "16°C", rainfall: "Low", notes: "Cool, fewer crowds" },
        { month: "October", weather: 3, crowds: 2, price: 3, temp: "8°C", rainfall: "Low", notes: "Cold, some roads close" },
        { month: "November", weather: 2, crowds: 1, price: 2, temp: "0°C", rainfall: "Moderate", notes: "Snow begins" },
        { month: "December", weather: 1, crowds: 1, price: 2, temp: "-7°C", rainfall: "Low", notes: "Winter, most closed" }
      ],
      bestMonths: ["June", "July", "August", "September"],
      worstMonths: ["December", "January", "February"],
      highlights: ["💧 Geysers", "🐻 Wildlife", "🏔️ Mountain scenery", "♨️ Hot springs"],
      tips: ["Book accommodation early", "Early morning best for wildlife", "Pack warm clothes even in summer"]
    },
    switzerland: {
      name: "Switzerland",
      monthlyData: [
        { month: "January", weather: 2, crowds: 3, price: 4, temp: "-2°C", rainfall: "Moderate", notes: "Ski season, snowy Alps" },
        { month: "February", weather: 2, crowds: 3, price: 4, temp: "0°C", rainfall: "Moderate", notes: "Peak ski season" },
        { month: "March", weather: 3, crowds: 3, price: 4, temp: "5°C", rainfall: "Moderate", notes: "End of ski season" },
        { month: "April", weather: 4, crowds: 3, price: 3, temp: "10°C", rainfall: "Moderate", notes: "Spring, flowers in valleys" },
        { month: "May", weather: 5, crowds: 4, price: 4, temp: "15°C", rainfall: "Moderate", notes: "Perfect for hiking" },
        { month: "June", weather: 5, crowds: 4, price: 5, temp: "19°C", rainfall: "Moderate", notes: "Summer, all mountains accessible" },
        { month: "July", weather: 5, crowds: 5, price: 5, temp: "22°C", rainfall: "Moderate", notes: "Peak summer season" },
        { month: "August", weather: 5, crowds: 5, price: 5, temp: "21°C", rainfall: "Moderate", notes: "Warm, overcrowded" },
        { month: "September", weather: 4, crowds: 3, price: 4, temp: "17°C", rainfall: "Moderate", notes: "Autumn, fewer crowds" },
        { month: "October", weather: 3, crowds: 2, price: 3, temp: "11°C", rainfall: "Moderate", notes: "Cool, fall colors" },
        { month: "November", weather: 2, crowds: 2, price: 3, temp: "5°C", rainfall: "High", notes: "Rain, cold" },
        { month: "December", weather: 2, crowds: 3, price: 4, temp: "0°C", rainfall: "Moderate", notes: "Christmas markets, snow" }
      ],
      bestMonths: ["May", "June", "July", "August"],
      worstMonths: ["November", "December"],
      highlights: ["🏔️ The Alps", "🚂 Scenic trains", "🧀 Swiss cheese", "⌚ Watches"],
      tips: ["Expensive country", "Swiss Pass worthwhile", "Book mountain hotels early"]
    },
    bali: {
      name: "Bali",
      monthlyData: [
        { month: "January", weather: 3, crowds: 5, price: 5, temp: "28°C", rainfall: "Very High", notes: "Rainy season, high prices" },
        { month: "February", weather: 3, crowds: 5, price: 5, temp: "28°C", rainfall: "Very High", notes: "Rains continue" },
        { month: "March", weather: 4, crowds: 4, price: 4, temp: "29°C", rainfall: "High", notes: "Rains decreasing" },
        { month: "April", weather: 5, crowds: 3, price: 3, temp: "30°C", rainfall: "Moderate", notes: "Great weather, fewer crowds" },
        { month: "May", weather: 5, crowds: 3, price: 3, temp: "30°C", rainfall: "Low", notes: "Dry season begins" },
        { month: "June", weather: 5, crowds: 4, price: 4, temp: "29°C", rainfall: "Low", notes: "Perfect weather" },
        { month: "July", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Low", notes: "Peak tourism, expensive" },
        { month: "August", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Low", notes: "Most popular time" },
        { month: "September", weather: 5, crowds: 4, price: 4, temp: "29°C", rainfall: "Low", notes: "Excellent weather" },
        { month: "October", weather: 4, crowds: 3, price: 3, temp: "30°C", rainfall: "Moderate", notes: "Good, fewer tourists" },
        { month: "November", weather: 3, crowds: 3, price: 3, temp: "30°C", rainfall: "High", notes: "Rains begin" },
        { month: "December", weather: 3, crowds: 4, price: 4, temp: "29°C", rainfall: "High", notes: "Holiday season" }
      ],
      bestMonths: ["April", "May", "June", "July", "August", "September"],
      worstMonths: ["January", "February"],
      highlights: ["🏖️ Tropical beaches", "🛕 Temples", "🌾 Rice terraces", "🐒 Monkey forest"],
      tips: ["Avoid rainy season", "South rainier than north", "Scooter rental popular"]
    },
    portugal: {
      name: "Portugal",
      monthlyData: [
        { month: "January", weather: 2, crowds: 2, price: 2, temp: "12°C", rainfall: "High", notes: "Cool, rainy" },
        { month: "February", weather: 3, crowds: 2, price: 2, temp: "13°C", rainfall: "Moderate", notes: "Still cool" },
        { month: "March", weather: 3, crowds: 3, price: 3, temp: "16°C", rainfall: "Moderate", notes: "Spring begins" },
        { month: "April", weather: 4, crowds: 3, price: 3, temp: "18°C", rainfall: "Moderate", notes: "Pleasant weather" },
        { month: "May", weather: 5, crowds: 4, price: 4, temp: "22°C", rainfall: "Low", notes: "Great weather" },
        { month: "June", weather: 5, crowds: 4, price: 4, temp: "25°C", rainfall: "Low", notes: "Warm, sunny" },
        { month: "July", weather: 4, crowds: 5, price: 5, temp: "28°C", rainfall: "Low", notes: "Hot, overcrowded" },
        { month: "August", weather: 4, crowds: 5, price: 5, temp: "28°C", rainfall: "Low", notes: "Hottest" },
        { month: "September", weather: 5, crowds: 4, price: 4, temp: "26°C", rainfall: "Low", notes: "Perfect weather" },
        { month: "October", weather: 4, crowds: 3, price: 3, temp: "21°C", rainfall: "Moderate", notes: "Warm, fewer crowds" },
        { month: "November", weather: 3, crowds: 2, price: 2, temp: "16°C", rainfall: "Moderate", notes: "Cooler" },
        { month: "December", weather: 2, crowds: 2, price: 2, temp: "13°C", rainfall: "High", notes: "Winter, rain" }
      ],
      bestMonths: ["May", "June", "September", "October"],
      worstMonths: ["December", "January"],
      highlights: ["🏖️ Algarve beaches", "🍷 Port wine", "🏰 Historic cities", "🌊 Atlantic coast"],
      tips: ["Shoulder seasons best", "South warmer than north", "Surfing popular year-round"]
    },
    "puerto-rico": {
      name: "Puerto Rico",
      monthlyData: [
        { month: "January", weather: 4, crowds: 4, price: 4, temp: "26°C", rainfall: "Moderate", notes: "Dry season, pleasant" },
        { month: "February", weather: 4, crowds: 4, price: 4, temp: "26°C", rainfall: "Moderate", notes: "Good weather" },
        { month: "March", weather: 5, crowds: 4, price: 4, temp: "27°C", rainfall: "Low", notes: "Great for beach" },
        { month: "April", weather: 5, crowds: 3, price: 3, temp: "28°C", rainfall: "Low", notes: "Perfect weather" },
        { month: "May", weather: 4, crowds: 3, price: 3, temp: "29°C", rainfall: "Moderate", notes: "Hotter, more rain" },
        { month: "June", weather: 3, crowds: 3, price: 3, temp: "30°C", rainfall: "High", notes: "Rainy season, hot" },
        { month: "July", weather: 3, crowds: 4, price: 4, temp: "30°C", rainfall: "High", notes: "Hot, humid" },
        { month: "August", weather: 3, crowds: 4, price: 4, temp: "30°C", rainfall: "High", notes: "Peak hurricane season" },
        { month: "September", weather: 2, crowds: 2, price: 2, temp: "30°C", rainfall: "High", notes: "Hurricane season" },
        { month: "October", weather: 3, crowds: 2, price: 3, temp: "29°C", rainfall: "Moderate", notes: "Rains decreasing" },
        { month: "November", weather: 4, crowds: 3, price: 3, temp: "28°C", rainfall: "Moderate", notes: "Weather improving" },
        { month: "December", weather: 4, crowds: 4, price: 4, temp: "27°C", rainfall: "Moderate", notes: "Dry season begins" }
      ],
      bestMonths: ["January", "February", "March", "April"],
      worstMonths: ["August", "September"],
      highlights: ["🏖️ Caribbean beaches", "🌺 Tropical nature", "🏛️ Old San Juan", "🎵 Salsa music"],
      tips: ["Avoid hurricane season", "No visa needed for Americans", "Rains usually short"]
    },
    vietnam: {
      name: "Vietnam",
      monthlyData: [
        { month: "January", weather: 4, crowds: 4, price: 4, temp: "22°C", rainfall: "Low", notes: "Cool, dry in north" },
        { month: "February", weather: 4, crowds: 4, price: 4, temp: "24°C", rainfall: "Low", notes: "Good weather everywhere" },
        { month: "March", weather: 5, crowds: 4, price: 4, temp: "27°C", rainfall: "Low", notes: "Perfect weather" },
        { month: "April", weather: 5, crowds: 3, price: 3, temp: "30°C", rainfall: "Low", notes: "Warm, dry" },
        { month: "May", weather: 4, crowds: 3, price: 3, temp: "32°C", rainfall: "Moderate", notes: "Hot, rains begin" },
        { month: "June", weather: 3, crowds: 2, price: 2, temp: "33°C", rainfall: "High", notes: "Rainy season, hot" },
        { month: "July", weather: 2, crowds: 2, price: 2, temp: "33°C", rainfall: "Very High", notes: "Peak rainy season" },
        { month: "August", weather: 2, crowds: 2, price: 2, temp: "32°C", rainfall: "Very High", notes: "Rains, typhoons possible" },
        { month: "September", weather: 3, crowds: 2, price: 2, temp: "31°C", rainfall: "High", notes: "Rains decreasing" },
        { month: "October", weather: 4, crowds: 3, price: 3, temp: "29°C", rainfall: "Moderate", notes: "Weather improving" },
        { month: "November", weather: 5, crowds: 3, price: 3, temp: "26°C", rainfall: "Low", notes: "Great weather" },
        { month: "December", weather: 4, crowds: 4, price: 4, temp: "23°C", rainfall: "Low", notes: "Cool, dry" }
      ],
      bestMonths: ["February", "March", "April", "November"],
      worstMonths: ["July", "August"],
      highlights: ["🏞️ Halong Bay", "🍜 Pho and street food", "🏛️ Ancient temples", "🌾 Rice terraces"],
      tips: ["North and south have different seasons", "Central region rainiest", "Motorbike popular transport"]
    },
    "new-zealand": {
      name: "New Zealand",
      monthlyData: [
        { month: "January", weather: 5, crowds: 5, price: 5, temp: "22°C", rainfall: "Moderate", notes: "Summer, peak tourism" },
        { month: "February", weather: 5, crowds: 5, price: 5, temp: "22°C", rainfall: "Moderate", notes: "Warmest, expensive" },
        { month: "March", weather: 4, crowds: 4, price: 4, temp: "20°C", rainfall: "Moderate", notes: "Autumn, good weather" },
        { month: "April", weather: 3, crowds: 3, price: 3, temp: "17°C", rainfall: "Moderate", notes: "Cooler, fewer crowds" },
        { month: "May", weather: 2, crowds: 2, price: 2, temp: "13°C", rainfall: "High", notes: "Winter approaching" },
        { month: "June", weather: 2, crowds: 2, price: 2, temp: "10°C", rainfall: "High", notes: "Winter, rain" },
        { month: "July", weather: 2, crowds: 2, price: 2, temp: "9°C", rainfall: "High", notes: "Coldest" },
        { month: "August", weather: 2, crowds: 2, price: 2, temp: "10°C", rainfall: "High", notes: "Still winter" },
        { month: "September", weather: 3, crowds: 2, price: 3, temp: "13°C", rainfall: "Moderate", notes: "Spring begins" },
        { month: "October", weather: 4, crowds: 3, price: 3, temp: "16°C", rainfall: "Moderate", notes: "Spring, flowers blooming" },
        { month: "November", weather: 4, crowds: 3, price: 4, temp: "18°C", rainfall: "Moderate", notes: "Pleasant weather" },
        { month: "December", weather: 5, crowds: 4, price: 5, temp: "20°C", rainfall: "Moderate", notes: "Summer begins" }
      ],
      bestMonths: ["December", "January", "February", "March"],
      worstMonths: ["June", "July", "August"],
      highlights: ["🏔️ Alps", "🐑 Farms", "🎬 LOTR locations", "🌊 Fiords"],
      tips: ["Remember southern hemisphere", "Weather changeable", "Book early for summer"]
    },
    "glacier-np": {
      name: "Glacier National Park",
      monthlyData: [
        { month: "January", weather: 1, crowds: 1, price: 2, temp: "-8°C", rainfall: "Low", notes: "Snow, most closed" },
        { month: "February", weather: 1, crowds: 1, price: 2, temp: "-5°C", rainfall: "Low", notes: "Very cold" },
        { month: "March", weather: 1, crowds: 1, price: 2, temp: "0°C", rainfall: "Low", notes: "Still snow" },
        { month: "April", weather: 2, crowds: 1, price: 2, temp: "5°C", rainfall: "Moderate", notes: "Snow melting" },
        { month: "May", weather: 3, crowds: 2, price: 3, temp: "12°C", rainfall: "Moderate", notes: "Some roads open" },
        { month: "June", weather: 4, crowds: 3, price: 4, temp: "17°C", rainfall: "Moderate", notes: "More access" },
        { month: "July", weather: 5, crowds: 5, price: 5, temp: "20°C", rainfall: "Low", notes: "Peak season, everything open" },
        { month: "August", weather: 5, crowds: 5, price: 5, temp: "19°C", rainfall: "Low", notes: "Best time" },
        { month: "September", weather: 4, crowds: 3, price: 4, temp: "14°C", rainfall: "Low", notes: "Autumn, fewer crowds" },
        { month: "October", weather: 3, crowds: 2, price: 3, temp: "8°C", rainfall: "Moderate", notes: "Getting cold, some roads close" },
        { month: "November", weather: 2, crowds: 1, price: 2, temp: "2°C", rainfall: "Moderate", notes: "Snow begins" },
        { month: "December", weather: 1, crowds: 1, price: 2, temp: "-5°C", rainfall: "Low", notes: "Winter, most closed" }
      ],
      bestMonths: ["July", "August", "September"],
      worstMonths: ["December", "January", "February"],
      highlights: ["🏔️ Glaciers", "🐻 Grizzly bears", "🥾 Hiking", "📸 Photography"],
      tips: ["Very short season", "Going-to-the-Sun Road key", "Pack warm clothes"]
    },
    australia: {
      name: "Australia",
      monthlyData: [
        { month: "January", weather: 3, crowds: 5, price: 5, temp: "26°C", rainfall: "Moderate", notes: "Summer, hot, expensive" },
        { month: "February", weather: 3, crowds: 4, price: 5, temp: "26°C", rainfall: "Moderate", notes: "Still hot" },
        { month: "March", weather: 4, crowds: 4, price: 4, temp: "24°C", rainfall: "Moderate", notes: "Autumn, good weather" },
        { month: "April", weather: 5, crowds: 3, price: 3, temp: "21°C", rainfall: "Low", notes: "Perfect weather" },
        { month: "May", weather: 4, crowds: 3, price: 3, temp: "17°C", rainfall: "Low", notes: "Cooler, pleasant" },
        { month: "June", weather: 3, crowds: 2, price: 2, temp: "14°C", rainfall: "Moderate", notes: "Winter, cool" },
        { month: "July", weather: 3, crowds: 2, price: 2, temp: "13°C", rainfall: "Moderate", notes: "Coldest" },
        { month: "August", weather: 3, crowds: 2, price: 2, temp: "15°C", rainfall: "Moderate", notes: "Still winter" },
        { month: "September", weather: 4, crowds: 3, price: 3, temp: "18°C", rainfall: "Low", notes: "Spring, flowers blooming" },
        { month: "October", weather: 5, crowds: 3, price: 3, temp: "21°C", rainfall: "Low", notes: "Great weather" },
        { month: "November", weather: 4, crowds: 4, price: 4, temp: "23°C", rainfall: "Moderate", notes: "Warmer, more tourists" },
        { month: "December", weather: 3, crowds: 5, price: 5, temp: "25°C", rainfall: "Moderate", notes: "Summer begins, expensive" }
      ],
      bestMonths: ["April", "May", "September", "October"],
      worstMonths: ["January", "December"],
      highlights: ["🏖️ Beaches", "🦘 Unique wildlife", "🏛️ Sydney and Melbourne", "🌊 Great Barrier Reef"],
      tips: ["Different climate zones", "South opposite to north", "Book early for holidays"]
    },
    "new-orleans": {
      name: "New Orleans",
      monthlyData: [
        { month: "January", weather: 3, crowds: 3, price: 3, temp: "15°C", rainfall: "Moderate", notes: "Cool, less humidity" },
        { month: "February", weather: 4, crowds: 5, price: 5, temp: "17°C", rainfall: "Moderate", notes: "Mardi Gras, overcrowded" },
        { month: "March", weather: 4, crowds: 4, price: 4, temp: "21°C", rainfall: "Moderate", notes: "Pleasant weather, festivals" },
        { month: "April", weather: 5, crowds: 4, price: 4, temp: "25°C", rainfall: "Moderate", notes: "Perfect weather, Jazz Fest" },
        { month: "May", weather: 4, crowds: 3, price: 3, temp: "28°C", rainfall: "Moderate", notes: "Warm, humidity rising" },
        { month: "June", weather: 2, crowds: 2, price: 2, temp: "31°C", rainfall: "High", notes: "Hot, humid, rain" },
        { month: "July", weather: 2, crowds: 2, price: 2, temp: "32°C", rainfall: "High", notes: "Hottest, oppressive" },
        { month: "August", weather: 2, crowds: 2, price: 2, temp: "32°C", rainfall: "High", notes: "Very hot, tropical storms" },
        { month: "September", weather: 2, crowds: 2, price: 2, temp: "30°C", rainfall: "High", notes: "Still hot, hurricanes" },
        { month: "October", weather: 4, crowds: 3, price: 3, temp: "26°C", rainfall: "Moderate", notes: "Good weather returns" },
        { month: "November", weather: 4, crowds: 3, price: 3, temp: "21°C", rainfall: "Low", notes: "Pleasant, less humidity" },
        { month: "December", weather: 3, crowds: 4, price: 4, temp: "17°C", rainfall: "Moderate", notes: "Holiday season, cool" }
      ],
      bestMonths: ["October", "November", "December", "January", "March", "April"],
      worstMonths: ["June", "July", "August"],
      highlights: ["🎷 Jazz", "🍤 Creole cuisine", "🎭 Mardi Gras", "🏛️ French Quarter"],
      tips: ["Avoid summer heat", "Festivals year-round", "AC essential in summer"]
    },
    cancun: {
      name: "Cancun",
      monthlyData: [
        { month: "January", weather: 4, crowds: 5, price: 5, temp: "24°C", rainfall: "Low", notes: "Dry season, high prices" },
        { month: "February", weather: 4, crowds: 5, price: 5, temp: "25°C", rainfall: "Low", notes: "Peak tourism" },
        { month: "March", weather: 5, crowds: 5, price: 5, temp: "27°C", rainfall: "Low", notes: "Spring break, overcrowded" },
        { month: "April", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Low", notes: "Perfect weather, expensive" },
        { month: "May", weather: 4, crowds: 3, price: 3, temp: "30°C", rainfall: "Moderate", notes: "Hotter, rains begin" },
        { month: "June", weather: 3, crowds: 3, price: 3, temp: "31°C", rainfall: "High", notes: "Rainy season, hot" },
        { month: "July", weather: 3, crowds: 4, price: 4, temp: "32°C", rainfall: "High", notes: "Hot, summer vacation" },
        { month: "August", weather: 3, crowds: 4, price: 4, temp: "32°C", rainfall: "High", notes: "Very hot, humid" },
        { month: "September", weather: 2, crowds: 2, price: 2, temp: "31°C", rainfall: "Very High", notes: "Peak hurricane season" },
        { month: "October", weather: 3, crowds: 2, price: 3, temp: "29°C", rainfall: "High", notes: "Rains decreasing" },
        { month: "November", weather: 4, crowds: 3, price: 3, temp: "27°C", rainfall: "Moderate", notes: "Weather improving" },
        { month: "December", weather: 4, crowds: 4, price: 4, temp: "25°C", rainfall: "Low", notes: "Dry season begins" }
      ],
      bestMonths: ["November", "December", "January", "February"],
      worstMonths: ["August", "September"],
      highlights: ["🏖️ Caribbean beaches", "🏛️ Mayan ruins", "🌊 Cenotes", "🐠 Diving"],
      tips: ["Avoid hurricane season", "Dry season expensive", "All-inclusive popular"]
    }
  };

  // Calculate best time based on priorities and destination
  function calculateBestTime() {
    const destination = document.getElementById("destination").value;
    const weatherPriority = parseInt(document.getElementById("weather-priority").value);
    const crowdPriority = parseInt(document.getElementById("crowd-priority").value);
    const pricePriority = parseInt(document.getElementById("price-priority").value);
    const tripType = document.getElementById("trip-type").value;

    if (!destination) {
      resultDiv.innerHTML = '<p style="color: red;">Please select a destination.</p>';
      return;
    }

    const destData = destinationData[destination];
    if (!destData) {
      resultDiv.innerHTML = '<p style="color: red;">Data for this destination is not available.</p>';
      return;
    }

    // Calculate score for each month
    const monthScores = destData.monthlyData.map(month => {
      // Invert crowd score (lower crowds = higher score)
      const crowdScore = 6 - month.crowds;
      // Invert price score (lower prices = higher score)  
      const priceScore = 6 - month.price;
      
      const totalScore = (month.weather * weatherPriority) + 
                        (crowdScore * crowdPriority) + 
                        (priceScore * pricePriority);
      
      return {
        ...month,
        score: totalScore,
        maxPossibleScore: (5 * weatherPriority) + (5 * crowdPriority) + (5 * pricePriority)
      };
    });

    // Sort by score
    const sortedMonths = [...monthScores].sort((a, b) => b.score - a.score);
    const bestMonths = sortedMonths.slice(0, 3);
    const worstMonths = sortedMonths.slice(-3).reverse();

    displayResults({
      destination: destData,
      bestMonths,
      worstMonths,
      allMonths: monthScores,
      priorities: { weather: weatherPriority, crowd: crowdPriority, price: pricePriority },
      tripType
    });
  }

  function displayResults(data) {
    const { destination, bestMonths, worstMonths, allMonths, priorities, tripType } = data;

    // Get season recommendations
    const seasonTips = getSeasonTips(tripType);
    
    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🌍 Best Time to Visit: ${destination.name}</h3>
        
        <div class="budget-insights">
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>🏆 Best Month</h6>
              <p class="big-number">${bestMonths[0].month}</p>
              <p class="insight-detail">${bestMonths[0].temp}, ${bestMonths[0].notes}</p>
            </div>
            
            <div class="insight-card info">
              <h6>🌡️ Temperature</h6>
              <p class="big-number">${bestMonths[0].temp}</p>
              <p class="insight-detail">in best month</p>
            </div>
            
            <div class="insight-card ${bestMonths[0].crowds <= 2 ? 'success' : bestMonths[0].crowds <= 4 ? 'warning' : 'info'}">
              <h6>👥 Crowds</h6>
              <p class="big-number">${getCrowdText(bestMonths[0].crowds)}</p>
              <p class="insight-detail">tourist level</p>
            </div>
            
            <div class="insight-card ${bestMonths[0].price <= 2 ? 'success' : bestMonths[0].price <= 4 ? 'warning' : 'info'}">
              <h6>💰 Prices</h6>
              <p class="big-number">${getPriceText(bestMonths[0].price)}</p>
              <p class="insight-detail">cost level</p>
            </div>
          </div>
        </div>

        <div class="result-grid">
          <div class="best-months">
            <h4>🏆 Top 3 Best Months</h4>
            ${bestMonths.map((month, index) => `
              <div class="month-recommendation ${index === 0 ? 'top-choice' : ''}">
                <div class="month-header">
                  <strong>${month.month}</strong>
                  <span class="score">${Math.round((month.score / month.maxPossibleScore) * 100)}% match</span>
                </div>
                <div class="month-details">
                  <div class="weather-stats">
                    <span>🌡️ ${month.temp}</span>
                    <span>☔ ${month.rainfall} rainfall</span>
                  </div>
                  <div class="month-indicators">
                    <span class="indicator weather">Weather: ${getStars(month.weather)}</span>
                    <span class="indicator crowds">Crowds: ${getStars(6 - month.crowds)}</span>
                    <span class="indicator price">Prices: ${getStars(6 - month.price)}</span>
                  </div>
                  <p class="month-notes">${month.notes}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="worst-months">
            <h4>⚠️ Months to Avoid</h4>
            ${worstMonths.map(month => `
              <div class="month-warning">
                <strong>${month.month}</strong>: ${month.notes}
                <div class="warning-details">
                  <span>🌡️ ${month.temp}</span>
                  <span class="crowds-warning">👥 ${getCrowdText(month.crowds)}</span>
                  <span class="price-warning">💰 ${getPriceText(month.price)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="monthly-calendar">
          <h4>📅 Monthly Calendar</h4>
          <div class="calendar-grid">
            ${allMonths.map(month => `
              <div class="calendar-month ${getMonthClass(month)}">
                <div class="month-name">${month.month}</div>
                <div class="month-temp">${month.temp}</div>
                <div class="month-indicators-small">
                  <div class="indicator-bar weather" style="width: ${month.weather * 20}%"></div>
                  <div class="indicator-bar crowds" style="width: ${(6 - month.crowds) * 20}%"></div>
                  <div class="indicator-bar price" style="width: ${(6 - month.price) * 20}%"></div>
                </div>
                <div class="month-score">${Math.round((month.score / month.maxPossibleScore) * 100)}%</div>
              </div>
            `).join('')}
          </div>
          <div class="calendar-legend">
            <span><div class="legend-bar weather"></div> Weather</span>
            <span><div class="legend-bar crowds"></div> Fewer crowds</span>
            <span><div class="legend-bar price"></div> Lower prices</span>
          </div>
        </div>

        <div class="destination-highlights">
          <h4>✨ ${destination.name} Highlights</h4>
          <div class="highlights-grid">
            ${destination.highlights.map(highlight => `
              <div class="highlight-item">${highlight}</div>
            `).join('')}
          </div>
        </div>

        <div class="travel-tips">
          <h4>💡 Travel Tips</h4>
          <ul>
            ${destination.tips.map(tip => `<li>${tip}</li>`).join('')}
            ${seasonTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>

        <div class="priority-summary">
          <h4>🎯 Your Priorities</h4>
          <div class="priority-bars">
            <div class="priority-item">
              <span>Weather:</span>
              <div class="priority-bar">
                <div class="priority-fill weather" style="width: ${priorities.weather * 20}%"></div>
              </div>
              <span>${priorities.weather}/5</span>
            </div>
            <div class="priority-item">
              <span>Avoiding crowds:</span>
              <div class="priority-bar">
                <div class="priority-fill crowds" style="width: ${priorities.crowd * 20}%"></div>
              </div>
              <span>${priorities.crowd}/5</span>
            </div>
            <div class="priority-item">
              <span>Low prices:</span>
              <div class="priority-bar">
                <div class="priority-fill price" style="width: ${priorities.price * 20}%"></div>
              </div>
              <span>${priorities.price}/5</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Helper functions
  function getStars(rating) {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  function getCrowdText(crowds) {
    const levels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
    return levels[crowds - 1] || 'Unknown';
  }

  function getPriceText(price) {
    const levels = ['Very Cheap', 'Cheap', 'Moderate', 'Expensive', 'Very Expensive'];
    return levels[price - 1] || 'Unknown';
  }

  function getMonthClass(month) {
    const score = month.score / month.maxPossibleScore;
    if (score >= 0.8) return 'excellent';
    if (score >= 0.6) return 'good';
    if (score >= 0.4) return 'fair';
    return 'poor';
  }

  function getSeasonTips(tripType) {
    const tips = {
      general: ['Plan bookings early in high season'],
      beach: ['Avoid rainy and hurricane seasons', 'Check water temperatures'],
      adventure: ['Summer best for hiking', 'Check trail accessibility'],
      culture: ['Museums less crowded in low season', 'Some attractions may close in winter'],
      nature: ['Dry season better for wildlife viewing', 'Summer ideal for nature photography'],
      winter: ['December-March best for skiing', 'Check snow conditions'],
      photography: ['Golden hour best early morning', 'Shoulder seasons have best lighting']
    };
    return tips[tripType] || tips.general;
  }
});