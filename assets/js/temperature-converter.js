document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("temp-input");
  const from = document.getElementById("temp-from");
  const to = document.getElementById("temp-to");
  const result = document.getElementById("temp-result");

  function convertTemperature() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.textContent = "Будь ласка, введіть числове значення.";
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;
    let celsius;

    // Конвертуємо спочатку до °C
    switch (fromUnit) {
      case "C":
        celsius = value;
        break;
      case "F":
        celsius = (value - 32) * 5 / 9;
        break;
      case "K":
        celsius = value - 273.15;
        break;
    }

    let converted;
    switch (toUnit) {
      case "C":
        converted = celsius;
        break;
      case "F":
        converted = (celsius * 9 / 5) + 32;
        break;
      case "K":
        converted = celsius + 273.15;
        break;
    }

    const fromLabel = from.options[from.selectedIndex].text;
    const toLabel = to.options[to.selectedIndex].text;
    result.textContent = `${value} ${fromLabel} = ${converted.toFixed(2)} ${toLabel}`;
  }

  input.addEventListener("input", convertTemperature);
  from.addEventListener("change", convertTemperature);
  to.addEventListener("change", convertTemperature);
});
