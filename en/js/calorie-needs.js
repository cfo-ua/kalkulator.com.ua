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
      result.innerHTML = '<p style="color:red;">Please fill in all fields with valid values.</p>';
      return;
    }
    if (weightInput < 30 || weightInput > maxWeight) {
      result.innerHTML = `<p style="color:red;">Please enter a valid weight (30-${maxWeight} ${weightUnit}).</p>`;
      return;
    }

    // BMR formula: Mifflin-St Jeor
    const bmr = gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activity;

    let calories = tdee;
    let goalDesc = "";
    let deficitSurplus = 0;

    if (goal === "loss") {
      deficitSurplus = Math.max(300, tdee * 0.15);
      calories = tdee - deficitSurplus;
      goalDesc = "weight loss";
    } else if (goal === "gain") {
      deficitSurplus = Math.max(200, tdee * 0.10);
      calories = tdee + deficitSurplus;
      goalDesc = "muscle gain";
    } else {
      goalDesc = "weight maintenance";
    }

    // Macro recommendations based on goal
    let proteinRatio, fatRatio, carbRatio;
    if (goal === "loss") {
      proteinRatio = 0.35; fatRatio = 0.25; carbRatio = 0.40;
    } else if (goal === "gain") {
      proteinRatio = 0.30; fatRatio = 0.25; carbRatio = 0.45;
    } else {
      proteinRatio = 0.25; fatRatio = 0.30; carbRatio = 0.45;
    }

    const proteinCals = calories * proteinRatio;
    const fatCals = calories * fatRatio;
    const carbCals = calories * carbRatio;

    const proteinGrams = Math.round(proteinCals / 4);
    const fatGrams = Math.round(fatCals / 9);
    const carbGrams = Math.round(carbCals / 4);

    // Format helper
    const kcal = n => `${Math.round(n).toLocaleString("en-US")} kcal`;

    let resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Daily Calorie Needs</h3>
        
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <p><strong>Weight:</strong> ${weightInput} ${weightUnit} ${weightUnit === 'lbs' ? `(${weight.toFixed(1)} kg)` : ''}</p>
          <p><strong>BMR (Basal Metabolic Rate):</strong> <span style="color:#157aff;">${kcal(bmr)}</span></p>
          <p><strong>TDEE (Total Daily Energy Expenditure):</strong> <span style="color:#157aff;">${kcal(tdee)}</span></p>
          <p><strong>Target Calories (${goalDesc}):</strong> <span style="color:#28a745;font-size:1.2em;font-weight:bold;">${kcal(calories)}</span></p>`;

    if (goal === "loss") {
      resultHTML += `<p><strong>Daily Calorie Deficit:</strong> <span style="color:#dc3545;">${kcal(deficitSurplus)}</span></p>
      <p style="color:#6c757d;font-size:0.9em;">This should result in approximately 0.5-1 lb weight loss per week.</p>`;
    } else if (goal === "gain") {
      resultHTML += `<p><strong>Daily Calorie Surplus:</strong> <span style="color:#28a745;">${kcal(deficitSurplus)}</span></p>
      <p style="color:#6c757d;font-size:0.9em;">Combined with strength training, this supports lean muscle growth.</p>`;
    }

    resultHTML += `
        </div>

        <div style="background:white;padding:15px;border-radius:6px;">
          <h4 style="margin-top:0;">Recommended Macronutrient Breakdown</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
            <div style="text-align:center;padding:10px;background:#e3f2fd;border-radius:4px;">
              <div style="font-weight:bold;color:#1976d2;">Protein</div>
              <div style="font-size:1.1em;">${proteinGrams}g</div>
              <div style="color:#666;font-size:0.9em;">${kcal(proteinCals)}</div>
              <div style="color:#666;font-size:0.8em;">${Math.round(proteinRatio*100)}%</div>
            </div>
            <div style="text-align:center;padding:10px;background:#fff3e0;border-radius:4px;">
              <div style="font-weight:bold;color:#f57c00;">Fats</div>
              <div style="font-size:1.1em;">${fatGrams}g</div>
              <div style="color:#666;font-size:0.9em;">${kcal(fatCals)}</div>
              <div style="color:#666;font-size:0.8em;">${Math.round(fatRatio*100)}%</div>
            </div>
            <div style="text-align:center;padding:10px;background:#e8f5e8;border-radius:4px;">
              <div style="font-weight:bold;color:#388e3c;">Carbs</div>
              <div style="font-size:1.1em;">${carbGrams}g</div>
              <div style="color:#666;font-size:0.9em;">${kcal(carbCals)}</div>
              <div style="color:#666;font-size:0.8em;">${Math.round(carbRatio*100)}%</div>
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin-top:15px;">
          <h4 style="margin-top:0;color:#856404;">Important Notes</h4>
          <ul style="margin:0;color:#856404;">
            <li>These are estimates based on scientific formulas</li>
            <li>Individual metabolism can vary by ±15%</li>
            <li>Track your progress and adjust as needed</li>
            <li>Consult a healthcare professional for personalized advice</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});