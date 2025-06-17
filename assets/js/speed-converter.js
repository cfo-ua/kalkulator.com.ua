document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("speed-input");
  const from = document.getElementById("speed-from");
  const to = document.getElementById("speed-to");
  const result = document.getElementById("speed-result");

  const toMps = {
    kmh: 0.277778,
    ms: 1,
    mph: 0.44704,
    knot: 0.514444,
    fts: 0.3048,
  };

  function convertSpeed() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.textContent = "Введіть коректне число.";
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const inMps = value * toMps[fromUnit];
    const finalValue = inMps / toMps[toUnit];

    result.textContent = `${value} ${from.options[from.selectedIndex].text} = ${finalValue.toFixed(4)} ${to.options[to.selectedIndex].text}`;
  }

  input.addEventListener("input", convertSpeed);
  from.addEventListener("change", convertSpeed);
  to.addEventListener("change", convertSpeed);
});
