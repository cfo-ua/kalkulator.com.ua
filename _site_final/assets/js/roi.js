document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("roi-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const investment = parseFloat(document.getElementById("investment").value);
    const profit = parseFloat(document.getElementById("profit").value);

    if (investment === 0) {
      document.getElementById("roi-result").innerHTML = "<p style='color:red;'>Інвестиції не можуть бути нульовими.</p>";
      return;
    }

    const roi = ((profit - investment) / investment) * 100;

    document.getElementById("roi-result").innerHTML = `
      <h3>Результат:</h3>
      <p>Повернення інвестицій (ROI): <b>${roi.toFixed(2)}%</b></p>
    `;
  });
});
