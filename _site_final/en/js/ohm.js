document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('ohm-form');
  const result = document.getElementById('ohm-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const U = parseFloat(document.getElementById('ohm-u').value);
      const I = parseFloat(document.getElementById('ohm-i').value);
      const R = parseFloat(document.getElementById('ohm-r').value);
      let filled = [!isNaN(U), !isNaN(I), !isNaN(R)].filter(Boolean).length;
      if (filled !== 2) {
        result.textContent = "Please enter exactly two parameters.";
        return;
      }
      if (isNaN(U)) {
        result.innerHTML = `<b>Voltage (U):</b> ${(I * R).toFixed(4)} V`;
      } else if (isNaN(I)) {
        if (R === 0) {
          result.textContent = "Resistance cannot be zero when calculating current.";
          return;
        }
        result.innerHTML = `<b>Current (I):</b> ${(U / R).toFixed(4)} A`;
      } else if (isNaN(R)) {
        if (I === 0) {
          result.textContent = "Current cannot be zero when calculating resistance.";
          return;
        }
        result.innerHTML = `<b>Resistance (R):</b> ${(U / I).toFixed(4)} Ω`;
      }
    });
  }
});