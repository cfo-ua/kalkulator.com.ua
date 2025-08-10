document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bac-form');
  const result = document.getElementById('bac-result');
  const drinkType = document.getElementById('drink-type');
  const customAlcoholGroup = document.getElementById('custom-alcohol-group');
  
  // Show/hide custom alcohol input
  drinkType.addEventListener('change', function() {
    if (this.value === 'custom') {
      customAlcoholGroup.style.display = 'block';
      document.getElementById('custom-alcohol').required = true;
    } else {
      customAlcoholGroup.style.display = 'none';
      document.getElementById('custom-alcohol').required = false;
    }
  });
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const weight = parseFloat(document.getElementById('weight').value);
      const gender = document.getElementById('gender').value;
      const drinkTypeValue = document.getElementById('drink-type').value;
      const customAlcohol = parseFloat(document.getElementById('custom-alcohol').value);
      const volume = parseFloat(document.getElementById('volume').value);
      const timePeriod = parseFloat(document.getElementById('time-period').value);
      const timeSince = parseFloat(document.getElementById('time-since').value);
      
      // Validation
      if (isNaN(weight) || isNaN(volume) || isNaN(timePeriod) || isNaN(timeSince)) {
        result.innerHTML = '<div class="error">❌ Будь ласка, заповніть всі поля коректними числовими значеннями.</div>';
        return;
      }
      
      if (weight < 30 || weight > 200) {
        result.innerHTML = '<div class="error">❌ Вага повинна бути від 30 до 200 кг.</div>';
        return;
      }
      
      if (volume <= 0) {
        result.innerHTML = '<div class="error">❌ Об\'єм споженого повинен бути більше нуля.</div>';
        return;
      }
      
      // Get alcohol percentage
      let alcoholPercentage;
      switch (drinkTypeValue) {
        case 'beer': alcoholPercentage = 5; break;
        case 'wine': alcoholPercentage = 12; break;
        case 'vodka': alcoholPercentage = 40; break;
        case 'whiskey': alcoholPercentage = 43; break;
        case 'cognac': alcoholPercentage = 40; break;
        case 'custom': 
          alcoholPercentage = customAlcohol;
          if (isNaN(alcoholPercentage) || alcoholPercentage < 0 || alcoholPercentage > 100) {
            result.innerHTML = '<div class="error">❌ Міцність алкоголю повинна бути від 0 до 100%.</div>';
            return;
          }
          break;
        default: alcoholPercentage = 40;
      }
      
      // Calculate using Widmark formula
      const gramsOfAlcohol = (volume * alcoholPercentage / 100) * 0.789; // density of ethanol
      const bodyWaterConstant = gender === 'male' ? 0.68 : 0.55; // r value
      const metabolismRate = 0.15; // grams per hour per kg
      
      // Peak BAC calculation
      const peakBAC = gramsOfAlcohol / (weight * bodyWaterConstant) * 1000; // in permille
      
      // Time to peak (assumption: during consumption + 30 minutes for absorption)
      const timeToPeak = timePeriod + 30;
      
      // Current BAC considering metabolism
      const totalTimeElapsed = timeSince + timeToPeak;
      const metabolizedAlcohol = (metabolismRate * weight * totalTimeElapsed) / 60; // convert to hours
      const currentGramsInSystem = Math.max(0, gramsOfAlcohol - metabolizedAlcohol);
      const currentBAC = Math.max(0, currentGramsInSystem / (weight * bodyWaterConstant) * 1000);
      
      // Time to reach safe driving limit (0.2 permille)
      const safeLimit = 0.2;
      const timeToSafeBAC = currentBAC > safeLimit ? 
        ((currentBAC - safeLimit) * weight * bodyWaterConstant / 1000) / (metabolismRate * weight / 60) : 0;
      
      // Time to completely sober (0.0 BAC)
      const timeToZeroBAC = currentBAC > 0 ? 
        (currentBAC * weight * bodyWaterConstant / 1000) / (metabolismRate * weight / 60) : 0;
      
      // Impairment level assessment
      let impairmentLevel, impairmentDescription, impairmentColor;
      if (currentBAC < 0.2) {
        impairmentLevel = "Тверезий";
        impairmentDescription = "Можна керувати транспортом";
        impairmentColor = "success";
      } else if (currentBAC < 0.5) {
        impairmentLevel = "Легке розслаблення";
        impairmentDescription = "Заборонено водіння";
        impairmentColor = "warning";
      } else if (currentBAC < 0.8) {
        impairmentLevel = "Помітне сп'яніння";
        impairmentDescription = "Погіршена координація";
        impairmentColor = "warning";
      } else if (currentBAC < 1.5) {
        impairmentLevel = "Сильне сп'яніння";
        impairmentDescription = "Значні порушення";
        impairmentColor = "error";
      } else if (currentBAC < 2.5) {
        impairmentLevel = "Важке отруєння";
        impairmentDescription = "Небезпека для життя";
        impairmentColor = "error";
      } else {
        impairmentLevel = "Критичний стан";
        impairmentDescription = "Потрібна медична допомога";
        impairmentColor = "error";
      }
      
      function formatTime(minutes) {
        if (minutes <= 0) return "0 хв";
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        if (hours > 0) {
          return mins > 0 ? `${hours} год ${mins} хв` : `${hours} год`;
        }
        return `${mins} хв`;
      }
      
      result.innerHTML = `
        <div class="insight-cards">
          <div class="insight-card ${impairmentColor}">
            <h6>🎯 Поточний BAC</h6>
            <div class="big-number">${currentBAC.toFixed(2)} ‰</div>
            <p>${(currentBAC / 10).toFixed(3)}% • ${impairmentLevel}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🚗 До безпечного водіння</h6>
            <div class="big-number">${formatTime(timeToSafeBAC)}</div>
            <p>До рівня 0,2 ‰</p>
          </div>
          
          <div class="insight-card success">
            <h6>✅ До повної тверезості</h6>
            <div class="big-number">${formatTime(timeToZeroBAC)}</div>
            <p>До рівня 0,0 ‰</p>
          </div>
        </div>
        
        <hr>
        
        <div class="impairment-status ${impairmentColor}">
          <h4>📊 Стан сп'яніння: ${impairmentLevel}</h4>
          <p><strong>${impairmentDescription}</strong></p>
          
          <div class="effects-description">
            ${currentBAC < 0.2 ? 
              "<p>🟢 Ви в межах законного ліміту для водіння в Україні.</p>" :
              currentBAC < 0.5 ?
              "<p>🟡 Легке розслаблення, незначне зниження уваги. Водіння заборонено.</p>" :
              currentBAC < 0.8 ?
              "<p>🟠 Помітне сп'яніння, погіршена координація та швидкість реакції.</p>" :
              currentBAC < 1.5 ?
              "<p>🔴 Сильне сп'яніння, значні порушення рухових функцій та мислення.</p>" :
              currentBAC < 2.5 ?
              "<p>🔴 Важке алкогольне отруєння, ризик втрати свідомості.</p>" :
              "<p>🚨 КРИТИЧНИЙ СТАН! Негайно зверніться за медичною допомогою!</p>"
            }
          </div>
        </div>
        
        <hr>
        
        <div class="calculation-details">
          <h4>📋 Деталі розрахунку:</h4>
          <div class="details-grid">
            <div><strong>🍺 Тип напою:</strong> ${drinkTypeValue === 'custom' ? `Власний (${alcoholPercentage}%)` : 
              drinkTypeValue === 'beer' ? 'Пиво (5%)' :
              drinkTypeValue === 'wine' ? 'Вино (12%)' :
              drinkTypeValue === 'vodka' ? 'Горілка (40%)' :
              drinkTypeValue === 'whiskey' ? 'Віскі (43%)' :
              'Коньяк (40%)'}</div>
            <div><strong>🥃 Об'єм:</strong> ${volume} мл</div>
            <div><strong>⚗️ Чистий спирт:</strong> ${gramsOfAlcohol.toFixed(1)} г</div>
            <div><strong>📈 Пікове BAC:</strong> ${peakBAC.toFixed(2)} ‰</div>
            <div><strong>⏱️ Час метаболізму:</strong> ${formatTime(totalTimeElapsed)}</div>
            <div><strong>🔬 Переробленого спирту:</strong> ${metabolizedAlcohol.toFixed(1)} г</div>
          </div>
        </div>
        
        <div class="safety-warnings">
          <h4>⚠️ Важливі застереження:</h4>
          <ul>
            <li><strong>Індивідуальні відмінності:</strong> Реальний BAC може значно відрізнятися</li>
            <li><strong>Не покладайтеся лише на калькулятор</strong> при прийнятті важливих рішень</li>
            <li><strong>Їжа та ліки</strong> можуть впливати на всмоктування алкоголю</li>
            <li><strong>При сумнівах</strong> - завжди використовуйте професійний алкотестер</li>
            <li><strong>Безпека понад усе:</strong> якщо вживали алкоголь - не сідайте за кермо</li>
          </ul>
        </div>
        
        <div class="legal-notice">
          <h4>⚖️ Правова інформація:</h4>
          <p><strong>В Україні:</strong> Дозволений рівень алкоголю для водіїв - до 0,2 ‰. Перевищення карається штрафом, позбавленням прав або кримінальною відповідальністю.</p>
          <p><small>Калькулятор надає приблизні розрахунки та не замінює медичну консультацію або офіційні тести на алкоголь.</small></p>
        </div>
      `;
    });
  }
});