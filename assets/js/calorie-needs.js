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

    // Mifflin-St Jeor
    let bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    let tdee = bmr * activity;

    let calories = tdee;
    let goalDesc = "";
    if (goal === "loss") {
      calories = tdee - Math.max(300, tdee * 0.15);
      goalDesc = " (дефіцит для схуднення)";
    } else if (goal === "gain") {
      calories = tdee + Math.max(200, tdee * 0.10);
      goalDesc = " (надлишок для набору ваги)";
    } else {
      goalDesc = " (підтримка ваги)";
    }

    // Macro recommendations
    const protein = Math.round(weight * 1.8);
    const fat = Math.round(weight * 0.9);
    const carb = Math.round((calories - (protein * 4 + fat * 9)) / 4);

    result.innerHTML = `
      <b>Ваш BMR:</b> ${Math.round(bmr)} ккал<br>
      <b>TDEE:</b> ${Math.round(tdee)} ккал/день<br>
      <b>Рекомендовано калорій${goalDesc}:</b> <span style="color:#157aff;">${Math.round(calories)} ккал</span><br>
      <b>Білки:</b> ${protein} г (<span style="font-size:0.92em;">${protein*4} ккал</span>)<br>
      <b>Жири:</b> ${fat} г (<span style="font-size:0.92em;">${fat*9} ккал</span>)<br>
      <b>Вуглеводи:</b> ${carb} г (<span style="font-size:0.92em;">${carb*4} ккал</span>)<br>
      <small>Пояснення: білки — <b>1.8г/кг</b>, жири — <b>0.9г/кг</b>, вуглеводи — решта калорій</small>
    `;
  });
});
