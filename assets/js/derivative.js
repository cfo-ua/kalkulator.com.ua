document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("derivative-form");
  const result = document.getElementById("derivative-result");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("input-expression").value;

      try {
        const expr = math.parse(input);
        const derivative = math.derivative(expr, 'x').toString();
        result.innerHTML = `<b>Похідна:</b> ${derivative}`;
      } catch (error) {
        result.innerHTML = `<span style="color: red">Помилка: невірний вираз або синтаксис.</span>`;
      }
    });
  }
});
