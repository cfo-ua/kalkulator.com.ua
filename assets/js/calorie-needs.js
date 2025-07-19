document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('calorie-needs-form');
  const result = document.getElementById('calorie-needs-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const gender = form.gender.value;
    const age = +form.age.value;
    const height = +form.height.value;
    const weightInput = +form.weight.value;
    const weightUnit = form['weight-unit'].value;
    const activity = +form.activity.value;
    const goal = form.goal.value;

    // Convert weight to kg if necessary
    const weight = weightUnit === 'lbs' ? weightInput * 0.453592 : weightInput;

    // Validation
    const maxWeight = weightUnit === 'lbs' ? 700 : 300;
    if (!gender || age <= 0 || height <= 0 || weightInput <= 0 || !activity) {
      result.innerHTML = '<p style="color:red;">Будь ласка, заповніть всі поля коректними значеннями.</p>';
      return;
    }
    if (weightInput < 30 || weightInput > maxWeight) {
      result.innerHTML = `<p style="color:red;">Будь ласка, введіть коректну вагу (30-${maxWeight} ${weightUnit === 'lbs' ? 'фунтів' : 'кг'}).</p>`;
      return;
    }

    // BMR formula: Mifflin-St Jeor
    const bmr = gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activity;

    let calories = tdee;
    let goalDesc = "";
    if (goal === "loss") {
      calories = tdee - Math.max(300, tdee * 0.15);
      goalDesc = "схуднення";
    } else if (goal === "gain") {
      calories = tdee + Math.max(200, tdee * 0.10);
      goalDesc = "набір ваги";
    } else {
      goalDesc = "підтримка ваги";
    }

    // Macro recommendations
    const protein = Math.round(weight * 1.8);
    const fat = Math.round(weight * 0.9);
    const carb = Math.round((calories - (protein * 4 + fat * 9)) / 4);

    // Format helper
    const kcal = n => `${Math.round(n).toLocaleString("uk-UA")} ккал`;

    const weightDisplay = weightUnit === 'lbs' ? `${weightInput} фунтів (${weight.toFixed(1)} кг)` : `${weightInput} кг`;
    result.innerHTML = `
      <p><strong>Вага:</strong> ${weightDisplay}</p>
      <p><strong>Рекомендовано калорій (${goalDesc}):</strong> <span style="color:#157aff;">${kcal(calories)}</span></p>
      <ul style="list-style:none;padding-left:0;">
        <li><strong>Білки:</strong> ${protein} г <span style="color:#888;">(${kcal(protein * 4)})</span></li>
        <li><strong>Жири:</strong> ${fat} г <span style="color:#888;">(${kcal(fat * 9)})</span></li>
        <li><strong>Вуглеводи:</strong> ${carb} г <span style="color:#888;">(${kcal(carb * 4)})</span></li>
      </ul>
    `;
  });
});
