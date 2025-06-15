document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("time-input");
  const from = document.getElementById("time-from");
  const to = document.getElementById("time-to");
  const result = document.getElementById("time-result");

  const toMilliseconds = {
    day: 86400000,
    hour: 3600000,
    minute: 60000,
    second: 1000,
    millisecond: 1
  };

  function convertTime() {
    const value = parseFloat(input.value);
    if (isNaN(value)) {
      result.textContent = "Введіть коректне число.";
      return;
    }

    const fromUnit = from.value;
    const toUnit = to.value;

    const inMs = value * toMilliseconds[fromUnit];
    const finalValue = inMs / toMilliseconds[toUnit];

    result.textContent = `${value} ${from.options[from.selectedIndex].text} = ${finalValue.toFixed(4)} ${to.options[to.selectedIndex].text}`;
  }

  input.addEventListener("input", convertTime);
  from.addEventListener("change", convertTime);
  to.addEventListener("change", convertTime);
});
