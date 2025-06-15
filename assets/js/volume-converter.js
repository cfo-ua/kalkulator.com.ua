document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("volume-input");
  const from = document.getElementById("volume-from");
  const to = document.getElementById("volume-to");
  const result = document.getElementById("volume-result");

  const conversionRates = {
    l: 1,
    ml: 0.001,
    m3: 1000,
    us_gal: 3.78541,
    uk_gal: 4.54609,
    qt: 0.946353,
    pt: 0.473176,
    oz: 0.0295735,
  };

  function convertVolume() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.textContent = "Будь ласка, введіть числове значення.";
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const valueInLiters = value * conversionRates[fromUnit];
    const convertedValue = valueInLiters / conversionRates[toUnit];

    result.textContent = `${value} ${from.options[from.selectedIndex].text} = ${convertedValue.toFixed(4)} ${to.options[to.selectedIndex].text}`;
  }

  input.addEventListener("input", convertVolume);
  from.addEventListener("change", convertVolume);
  to.addEventListener("change", convertVolume);
});
