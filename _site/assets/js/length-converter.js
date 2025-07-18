document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("length-input");
  const from = document.getElementById("length-from");
  const to = document.getElementById("length-to");
  const result = document.getElementById("length-result");

  const conversionRates = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  };

  function convertLength() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.textContent = "Будь ласка, введіть числове значення.";
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const valueInMeters = value * conversionRates[fromUnit];
    const convertedValue = valueInMeters / conversionRates[toUnit];

    result.textContent = `${value} ${from.options[from.selectedIndex].text} = ${convertedValue.toFixed(4)} ${to.options[to.selectedIndex].text}`;
  }

  input.addEventListener("input", convertLength);
  from.addEventListener("change", convertLength);
  to.addEventListener("change", convertLength);
});
