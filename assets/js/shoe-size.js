document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shoe-size-form');
  const inputType = document.getElementById('inputType');
  const inputField = document.getElementById('inputField');
  const resultDiv = document.getElementById('shoe-size-result');

  let currentInput;

  inputType.addEventListener('change', () => {
    resultDiv.innerHTML = '';
    inputField.innerHTML = '';

    if (!inputType.value) return;

    currentInput = document.createElement('input');
    currentInput.type = 'number';
    currentInput.id = 'value';
    currentInput.placeholder = 'Наприклад, 260';
    currentInput.required = true;

    const label = document.createElement('label');
    label.for = 'value';

    switch (inputType.value) {
      case 'mondo':
        label.textContent = 'Довжина стопи (мм)';
        break;
      case 'EU':
        label.textContent = 'Розмір EU';
        currentInput.step = '0.5';
        break;
      case 'UK':
        label.textContent = 'Розмір UK';
        currentInput.step = '0.5';
        break;
      case 'USM':
        label.textContent = 'Розмір US (чоловічий)';
        currentInput.step = '0.5';
        break;
      case 'USF':
        label.textContent = 'Розмір US (жіночий)';
        currentInput.step = '0.5';
        break;
    }

    inputField.appendChild(label);
    inputField.appendChild(currentInput);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = parseFloat(currentInput.value);
    if (isNaN(val) || val <= 0) {
      resultDiv.textContent = 'Будь ласка, введіть коректне значення.';
      return;
    }

    let mondo;
    switch (inputType.value) {
      case 'mondo':
        mondo = val;
        break;
      case 'EU':
        mondo = (val * 2/3 + 2) * 10;
        break;
      case 'UK':
        mondo = ((val + 22) / 3) * 25.4;
        break;
      case 'USM':
        mondo = ((val + 22) / 3) * 25.4;
        break;
      case 'USF':
        mondo = ((val + 21) / 3) * 25.4;
        break;
    }

    const EU = mondo / 10 * 2/3 - 2;
    const UK = mondo / 25.4 * 3 - 22;
    const USM = mondo / 25.4 * 3 - 22;
    const USF = mondo / 25.4 * 3 - 21;

    resultDiv.innerHTML = `
      <strong>Результати:</strong><br>
      Довжина стопи (Mondopoint): ${mondo.toFixed(0)} мм<br>
      Розмір EU: ${EU.toFixed(1)}<br>
      UK: ${UK.toFixed(1)}<br>
      US (чоловічий): ${USM.toFixed(1)}<br>
      US (жіночий): ${USF.toFixed(1)}
    `;
  });
});
