document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("roas-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const adSpend = parseFloat(document.getElementById("adSpend").value);
    const revenue = parseFloat(document.getElementById("revenue").value);

    if (adSpend === 0) {
      document.getElementById("roas-result").innerHTML = "<p style='color:red;'>Витрати на рекламу не можуть бути нульовими.</p>";
      return;
    }

    const roas = revenue / adSpend;

    document.getElementById("roas-result").innerHTML = `
      <h3>Результат:</h3>
      <p>ROAS: <b>${roas.toFixed(2)}</b> (приблизно ${ (roas * 100).toFixed(0) }%)</p>
    `;
  });
});
