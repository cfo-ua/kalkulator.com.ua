document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("area-input");
  const from = document.getElementById("area-from");
  const to = document.getElementById("area-to");
  const result = document.getElementById("area-result");

  const conversionRates = {
    m2: 1,
    cm2: 0.0001,
    ha: 10000,
    a: 100,
    ft2: 0.092903,
    in2: 0.00064516,
    ac: 4046.86,
  };

  function convertArea() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.textContent = "Будь ласка, введіть числове значення.";
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const valueInM2 = value * conversionRates[fromUnit];
    const convertedValue = valueInM2 / conversionRates[toUnit];

    result.textContent = `${value} ${from.options[from.selectedIndex].text} = ${convertedValue.toFixed(4)} ${to.options[to.selectedIndex].text}`;
  }

  input.addEventListener("input", convertArea);
  from.addEventListener("change", convertArea);
  to.addEventListener("change", convertArea);
});
