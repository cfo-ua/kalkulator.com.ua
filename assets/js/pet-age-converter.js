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
      result.innerHTML = '<div class="error">Будь ласка, оберіть тип тварини та введіть коректний вік.</div>';
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
    
    if (years < 1) return "Цуценя";
    if (years < 3) return "Молода собака";
    if (years < seniorAge) return "Доросла собака";
    return "Літня собака";
  }

  function getCatLifeStage(years) {
    if (years < 1) return "Кошеня";
    if (years < 3) return "Молодий кіт";
    if (years < 7) return "Дорослий кіт";
    if (years < 11) return "Зрілий кіт";
    return "Літній кіт";
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
      return "Період щеплення, соціалізації та базового навчання. Важливо забезпечити безпечне середовище для розвитку.";
    } else if (years < 3) {
      return "Час активного навчання та фізичних вправ. Регулярні прогулянки та ігри допоможуть розвинути здорові звички.";
    } else if (years < seniorAge) {
      return "Підтримуйте регулярний режим вправ та збалансоване харчування. Річні огляди у ветеринара допоможуть виявити проблеми рано.";
    } else {
      return "Потрібен особливий догляд: м'який режим вправ, спеціальна дієта для літніх собак, частіші ветеринарні огляди.";
    }
  }

  function getCatRecommendations(years) {
    if (years < 1) {
      return "Час щеплення, стерилізації та адаптації до дому. Забезпечте безпечне середовище для гри та дослідження.";
    } else if (years < 3) {
      return "Підтримуйте активність через ігри та забавки. Збалансоване харчування та регулярні огляди у ветеринара.";
    } else if (years < 7) {
      return "Контролюйте вагу та здоров'я зубів. Регулярні огляди допоможуть підтримати хороше здоров'я.";
    } else {
      return "Потрібен особливий догляд: спеціальна дієта, моніторинг функції нирок та серця, частіші ветеринарні огляди.";
    }
  }

  function displayResult(petType, actualAge, humanAge, lifeStage, recommendations, dogSize) {
    const petEmoji = petType === "dog" ? "🐕" : "🐱";
    const petName = petType === "dog" ? "собака" : "кіт";
    const sizeText = petType === "dog" ? getSizeText(dogSize) : "";
    
    const ageYears = Math.floor(actualAge);
    const ageMonths = Math.round((actualAge - ageYears) * 12);
    const ageDisplay = ageMonths > 0 ? `${ageYears} р. ${ageMonths} міс.` : `${ageYears} р.`;

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>${petEmoji} Вік у людських роках</h6>
          <div class="big-number">${humanAge} років</div>
          <p>Ваш ${sizeText}${petName} віком ${ageDisplay}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Етап життя</h6>
          <div class="big-number">${lifeStage}</div>
          <p>Поточна життєва фаза</p>
        </div>
      </div>

      <div class="result-details">
        <h4>💡 Рекомендації по догляду</h4>
        <div class="recommendation-box">
          <p>${recommendations}</p>
        </div>

        <div class="age-comparison">
          <h4>📊 Порівняння життєвих етапів</h4>
          <div class="comparison-table">
            ${getAgeComparisonTable(petType, dogSize)}
          </div>
        </div>
      </div>
    `;
  }

  function getSizeText(size) {
    switch (size) {
      case "small": return "маленька ";
      case "medium": return "середня ";
      case "large": return "велика ";
      case "giant": return "гігантська ";
      default: return "";
    }
  }

  function getAgeComparisonTable(petType, dogSize) {
    if (petType === "dog") {
      const seniorAge = getSeniorAge(dogSize);
      return `
        <table>
          <tr>
            <th>Вік ${petType === "dog" ? "собаки" : "кота"}</th>
            <th>Людський еквівалент</th>
            <th>Етап життя</th>
          </tr>
          <tr>
            <td>1 рік</td>
            <td>15 років</td>
            <td>Цуценя</td>
          </tr>
          <tr>
            <td>2 роки</td>
            <td>24 роки</td>
            <td>Молода собака</td>
          </tr>
          <tr>
            <td>5 років</td>
            <td>${calculateDogAge(5, dogSize)} років</td>
            <td>Доросла собака</td>
          </tr>
          <tr>
            <td>${seniorAge} років</td>
            <td>${calculateDogAge(seniorAge, dogSize)} років</td>
            <td>Літня собака</td>
          </tr>
        </table>
      `;
    } else {
      return `
        <table>
          <tr>
            <th>Вік кота</th>
            <th>Людський еквівалент</th>
            <th>Етап життя</th>
          </tr>
          <tr>
            <td>1 рік</td>
            <td>15 років</td>
            <td>Кошеня</td>
          </tr>
          <tr>
            <td>2 роки</td>
            <td>24 роки</td>
            <td>Молодий кіт</td>
          </tr>
          <tr>
            <td>5 років</td>
            <td>36 років</td>
            <td>Дорослий кіт</td>
          </tr>
          <tr>
            <td>10 років</td>
            <td>56 років</td>
            <td>Літній кіт</td>
          </tr>
        </table>
      `;
    }
  }
});