document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("pet-age-form");
  const result = document.getElementById("pet-age-result");
  const petTypeSelect = document.getElementById("pet-type");
  const dogSizeGroup = document.getElementById("dog-size-group");

  // Show/hide dog size selector based on pet type
  petTypeSelect.addEventListener("change", function() {
    if (this.value === "dog") {
      dogSizeGroup.style.display = "block";
    } else {
      dogSizeGroup.style.display = "none";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculatePetAge();
  });

  function calculatePetAge() {
    const petType = document.getElementById("pet-type").value;
    const petAgeYears = parseFloat(document.getElementById("pet-age-years").value);
    const petAgeMonths = parseFloat(document.getElementById("pet-age-months").value) || 0;
    const dogSize = document.getElementById("dog-size").value;

    if (!petType || petAgeYears < 0) {
      result.innerHTML = '<div class="error">Please select a pet type and enter a valid age.</div>';
      return;
    }

    // Convert to total age in decimal years
    const totalAge = petAgeYears + (petAgeMonths / 12);
    
    let humanAge = 0;
    let lifeStage = "";
    let recommendations = "";

    if (petType === "dog") {
      humanAge = calculateDogAge(totalAge, dogSize);
      lifeStage = getDogLifeStage(petAgeYears, dogSize);
      recommendations = getDogRecommendations(petAgeYears, dogSize);
    } else if (petType === "cat") {
      humanAge = calculateCatAge(totalAge);
      lifeStage = getCatLifeStage(petAgeYears);
      recommendations = getCatRecommendations(petAgeYears);
    }

    displayResult(petType, totalAge, humanAge, lifeStage, recommendations, dogSize);
  }

  function calculateDogAge(age, size) {
    if (age <= 0) return 0;
    
    // First year is always 15 human years
    if (age <= 1) {
      return Math.round(15 * age);
    }
    
    // Second year adds 9 more human years
    if (age <= 2) {
      return 15 + Math.round(9 * (age - 1));
    }
    
    // After 2 years, rate depends on size
    let baseAge = 24; // 15 + 9 for first two years
    let remainingYears = age - 2;
    
    let yearlyRate;
    switch (size) {
      case "small":
        yearlyRate = 4;
        break;
      case "medium":
        yearlyRate = 5;
        break;
      case "large":
        yearlyRate = 6;
        break;
      case "giant":
        yearlyRate = 7;
        break;
      default:
        yearlyRate = 5;
    }
    
    return Math.round(baseAge + (remainingYears * yearlyRate));
  }

  function calculateCatAge(age) {
    if (age <= 0) return 0;
    
    // First year is 15 human years
    if (age <= 1) {
      return Math.round(15 * age);
    }
    
    // Second year adds 9 more human years
    if (age <= 2) {
      return 15 + Math.round(9 * (age - 1));
    }
    
    // After 2 years, each year adds 4 human years
    let baseAge = 24; // 15 + 9 for first two years
    let remainingYears = age - 2;
    
    return Math.round(baseAge + (remainingYears * 4));
  }

  function getDogLifeStage(years, size) {
    const seniorAge = getSeniorAge(size);
    
    if (years < 1) return "Puppy";
    if (years < 3) return "Young Adult";
    if (years < seniorAge) return "Adult";
    return "Senior";
  }

  function getCatLifeStage(years) {
    if (years < 1) return "Kitten";
    if (years < 3) return "Young Adult";
    if (years < 7) return "Adult";
    if (years < 11) return "Mature";
    return "Senior";
  }

  function getSeniorAge(size) {
    switch (size) {
      case "small": return 10;
      case "medium": return 8;
      case "large": return 7;
      case "giant": return 6;
      default: return 8;
    }
  }

  function getDogRecommendations(years, size) {
    const seniorAge = getSeniorAge(size);
    
    if (years < 1) {
      return "Focus on vaccinations, socialization, and basic training. Provide a safe environment for development.";
    } else if (years < 3) {
      return "Time for active training and physical exercise. Regular walks and play help develop healthy habits.";
    } else if (years < seniorAge) {
      return "Maintain regular exercise routine and balanced nutrition. Annual vet checkups help catch issues early.";
    } else {
      return "Requires special care: gentle exercise, senior dog diet, more frequent veterinary examinations.";
    }
  }

  function getCatRecommendations(years) {
    if (years < 1) {
      return "Focus on vaccinations, spaying/neutering, and home adaptation. Provide safe environment for play and exploration.";
    } else if (years < 3) {
      return "Maintain activity through play and toys. Balanced nutrition and regular vet checkups are important.";
    } else if (years < 7) {
      return "Monitor weight and dental health. Regular checkups help maintain good health.";
    } else {
      return "Requires special care: senior diet, kidney and heart function monitoring, more frequent vet visits.";
    }
  }

  function displayResult(petType, actualAge, humanAge, lifeStage, recommendations, dogSize) {
    const petEmoji = petType === "dog" ? "🐕" : "🐱";
    const petName = petType === "dog" ? "dog" : "cat";
    const sizeText = petType === "dog" ? getSizeText(dogSize) : "";
    
    const ageYears = Math.floor(actualAge);
    const ageMonths = Math.round((actualAge - ageYears) * 12);
    const ageDisplay = ageMonths > 0 ? `${ageYears} yr ${ageMonths} mo` : `${ageYears} yr`;

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>${petEmoji} Human Age Equivalent</h6>
          <div class="big-number">${humanAge} years</div>
          <p>Your ${sizeText}${petName} aged ${ageDisplay}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Life Stage</h6>
          <div class="big-number">${lifeStage}</div>
          <p>Current life phase</p>
        </div>
      </div>

      <div class="result-details">
        <h4>💡 Care Recommendations</h4>
        <div class="recommendation-box">
          <p>${recommendations}</p>
        </div>

        <div class="age-comparison">
          <h4>📊 Life Stage Comparison</h4>
          <div class="comparison-table">
            ${getAgeComparisonTable(petType, dogSize)}
          </div>
        </div>
      </div>
    `;
  }

  function getSizeText(size) {
    switch (size) {
      case "small": return "small ";
      case "medium": return "medium ";
      case "large": return "large ";
      case "giant": return "giant ";
      default: return "";
    }
  }

  function getAgeComparisonTable(petType, dogSize) {
    if (petType === "dog") {
      const seniorAge = getSeniorAge(dogSize);
      return `
        <table>
          <tr>
            <th>Dog Age</th>
            <th>Human Equivalent</th>
            <th>Life Stage</th>
          </tr>
          <tr>
            <td>1 year</td>
            <td>15 years</td>
            <td>Puppy</td>
          </tr>
          <tr>
            <td>2 years</td>
            <td>24 years</td>
            <td>Young Adult</td>
          </tr>
          <tr>
            <td>5 years</td>
            <td>${calculateDogAge(5, dogSize)} years</td>
            <td>Adult</td>
          </tr>
          <tr>
            <td>${seniorAge} years</td>
            <td>${calculateDogAge(seniorAge, dogSize)} years</td>
            <td>Senior</td>
          </tr>
        </table>
      `;
    } else {
      return `
        <table>
          <tr>
            <th>Cat Age</th>
            <th>Human Equivalent</th>
            <th>Life Stage</th>
          </tr>
          <tr>
            <td>1 year</td>
            <td>15 years</td>
            <td>Kitten</td>
          </tr>
          <tr>
            <td>2 years</td>
            <td>24 years</td>
            <td>Young Adult</td>
          </tr>
          <tr>
            <td>5 years</td>
            <td>36 years</td>
            <td>Adult</td>
          </tr>
          <tr>
            <td>10 years</td>
            <td>56 years</td>
            <td>Senior</td>
          </tr>
        </table>
      `;
    }
  }
});