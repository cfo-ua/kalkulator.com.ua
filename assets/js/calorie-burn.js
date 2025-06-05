// Minimal MVP for calorie burn calculator (METs)
// Example activities; expand as needed
const ACTIVITIES = [
  { name: "Біг (8 км/год)", met: 8.3 },
  { name: "Біг (10 км/год)", met: 10.5 },
  { name: "Ходьба (5 км/год)", met: 3.3 },
  { name: "Їзда на велосипеді (легко)", met: 4.0 },
  { name: "Їзда на велосипеді (швидко)", met: 8.0 },
  { name: "Плавання (спокійно)", met: 5.8 },
  { name: "Плавання (інтенсивно)", met: 9.8 },
  { name: "Танці", met: 5.0 },
  { name: "Йога", met: 2.5 },
  { name: "Силові тренування", met: 6.0 },
  { name: "Прибирання", met: 3.5 }
];

document.addEventListener('DOMContentLoaded', function () {
  const sel = document.getElementById('burn-activity');
  ACTIVITIES.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.met;
    opt.textContent = a.name;
    sel.appendChild(opt);
  });

  const form = document.getElementById('calorie-burn-form');
  const result = document.getElementById('calorie-burn-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const weight = +form['burn-weight'].value;
    const min = +form['burn-min'].value;
    const met = +form['burn-activity'].value;
    if (weight < 30 || min <= 0 || met <= 0) {
      result.textContent = "Введіть коректні дані.";
      return;
    }
    const hours = min / 60;
    const calories = met * weight * hours;
    result.innerHTML = `<b>Витрачено:</b> <span style="color:#157aff;">${calories.toFixed(0)} ккал</span>`;
  });
});
