document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("weight-input");
  const from = document.getElementById("weight-from");
  const to = document.getElementById("weight-to");
  const result = document.getElementById("weight-result");

  const conversionRates = {
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    t: 1000,
    lb: 0.45359237,
    oz: 0.0283495,
  };

  function convertWeight() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.textContent = "Будь ласка, введіть числове значення.";
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const valueInKg = value * conversionRates[fromUnit];
    const convertedValue = valueInKg / conversionRates[toUnit];

    result.textContent = `${value} ${from.options[from.selectedIndex].text} = ${convertedValue.toFixed(4)} ${to.options[to.selectedIndex].text}`;
  }

  input.addEventListener("input", convertWeight);
  from.addEventListener("change", convertWeight);
  to.addEventListener("change", convertWeight);
});
