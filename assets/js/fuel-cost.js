document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fuel-cost-form');
  const consumptionInput = document.getElementById('consumption');
  const rangeInput = document.getElementById('range');
  const priceInput = document.getElementById('pricePerLiter');
  const totalCostInput = document.getElementById('totalCost');
  const resultDiv = document.getElementById('fuel-cost-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resultDiv.textContent = '';

    // Parse inputs as floats, or NaN if empty
    const consumption = parseFloat(consumptionInput.value.replace(',', '.'));
    const range = parseFloat(rangeInput.value.replace(',', '.'));
    const price = parseFloat(priceInput.value.replace(',', '.'));
    const totalCost = parseFloat(totalCostInput.value.replace(',', '.'));

    // Count how many fields are filled (not NaN and > 0)
    const filled = [
      !isNaN(consumption) && consumption > 0,
      !isNaN(range) && range > 0,
      !isNaN(price) && price > 0,
      !isNaN(totalCost) && totalCost > 0,
    ];
    const filledCount = filled.filter(Boolean).length;

    if (filledCount !== 3) {
      resultDiv.textContent = 'Будь ласка, введіть будь-які три значення для розрахунку четвертого.';
      return;
    }

    let calcConsumption = consumption;
    let calcRange = range;
    let calcPrice = price;
    let calcTotalCost = totalCost;

    // Calculate the missing value based on which one is empty or zero
    if (!(filled[0])) {
      // Calculate consumption: (totalCost / price) * 100 / range
      if (price && range && totalCost) {
        calcConsumption = (totalCost / price) * 100 / range;
        consumptionInput.value = calcConsumption.toFixed(2);
      }
    } else if (!(filled[1])) {
      // Calculate range: (totalCost / price) * 100 / consumption
      if (price && consumption && totalCost) {
        calcRange = (totalCost / price) * 100 / consumption;
        rangeInput.value = calcRange.toFixed(2);
      }
    } else if (!(filled[2])) {
      // Calculate price: totalCost / ((consumption / 100) * range)
      if (consumption && range && totalCost) {
        calcPrice = totalCost / ((consumption / 100) * range);
        priceInput.value = calcPrice.toFixed(2);
      }
    } else if (!(filled[3])) {
      // Calculate totalCost: (consumption / 100) * range * price
      if (consumption && range && price) {
        calcTotalCost = (consumption / 100) * range * price;
        totalCostInput.value = calcTotalCost.toFixed(2);
      }
    }

    // Display the calculated result summary
    resultDiv.innerHTML = `
      <strong>Результати розрахунку:</strong><br>
      Витрата пального: ${calcConsumption.toFixed(2)} л/100 км<br>
      Пробіг: ${calcRange.toFixed(2)} км<br>
      Ціна за 1 літр: ${calcPrice.toFixed(2)}<br>
      Загальна вартість: ${calcTotalCost.toFixed(2)}
    `;
  });
});
