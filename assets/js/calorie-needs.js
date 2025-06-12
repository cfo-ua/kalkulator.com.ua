document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('calorie-needs-form');
  const result = document.getElementById('calorie-needs-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const gender = form.gender.value;
    const age = +form.age.value;
    const height = +form.height.value;
    const weight = +form.weight.value;
    const activity = +form.activity.value;
    const goal = form.goal.value;

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

    result.innerHTML = `
      <p><strong>Рекомендовано калорій (${goalDesc}):</strong> <span style="color:#157aff;">${kcal(calories)}</span></p>
      <ul style="list-style:none;padding-left:0;">
        <li><strong>Білки:</strong> ${protein} г <span style="color:#888;">(${kcal(protein * 4)})</span></li>
        <li><strong>Жири:</strong> ${fat} г <span style="color:#888;">(${kcal(fat * 9)})</span></li>
        <li><strong>Вуглеводи:</strong> ${carb} г <span style="color:#888;">(${kcal(carb * 4)})</span></li>
      </ul>
    `;
  });
});
