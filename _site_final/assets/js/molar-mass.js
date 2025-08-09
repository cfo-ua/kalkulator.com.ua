// Simple periodic table for common elements (extend as needed)
const periodic = {
  H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81, C: 12.01, N: 14.01, O: 16.00, F: 19.00, Na: 22.99, Mg: 24.31,
  Al: 26.98, Si: 28.09, P: 30.97, S: 32.07, Cl: 35.45, K: 39.10, Ca: 40.08, Fe: 55.85, Cu: 63.55, Zn: 65.38, Ag: 107.9, Au: 197.0
};
function parseFormula(formula) {
  let re = /([A-Z][a-z]?)(\d*)/g, m, mass = 0;
  while ((m = re.exec(formula)) !== null) {
    const el = m[1];
    const count = m[2] === "" ? 1 : parseInt(m[2]);
    if (!periodic[el]) return NaN;
    mass += periodic[el] * count;
  }
  return mass;
}
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('molar-mass-form');
  const result = document.getElementById('molar-mass-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = document.getElementById('molar-input').value.trim();
      if (!input) {
        result.textContent = "Введіть формулу!";
        return;
      }
      const mass = parseFormula(input);
      if (isNaN(mass)) {
        result.textContent = "Формула містить невідомі елементи.";
        return;
      }
      result.innerHTML = `<b>Молярна маса:</b> ${mass.toFixed(3)} г/моль`;
    });
  }
});
