document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("derivative-form");
  const result = document.getElementById("derivative-result");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let input = document.getElementById("input-expression").value.trim();

      // Автоматична заміна для підтримки звичних позначень
      input = input
        .replace(/\bln\(/g, "log(")         // ln(x) → log(x)
        .replace(/\be\^/g, "exp(")          // e^x → exp(x
        .replace(/exp\(([^()]+)\)/g, "e^($1)"); // exp(...) → e^(...) (для естетики)

      try {
        const node = math.parse(input);
        const dx = math.derivative(node, "x");
        result.innerHTML = `<b>Похідна:</b> ${dx.toString()}`;
      } catch (error) {
        result.innerHTML = `<span style="color: red">Помилка: невірний вираз або синтаксис.</span>`;
      }
    });
  }
});
