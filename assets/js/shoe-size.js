document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shoe-size-form');
  const inputs = {
    mondo: document.getElementById('mondo'),
    EU: document.getElementById('sizeEU'),
    UK: document.getElementById('sizeUK'),
    USM: document.getElementById('sizeUS_M'),
    USF: document.getElementById('sizeUS_F')
  };
  const resultDiv = document.getElementById('shoe-size-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resultDiv.textContent = '';

    const v = {};
    for (let key in inputs) {
      const val = parseFloat(inputs[key].value);
      if (!isNaN(val) && val > 0) v[key] = val;
    }
    const filled = Object.keys(v).length;
    if (filled < 1) {
      resultDiv.textContent = 'Введіть довжину Мондопойнт або будь‑який розмір (EU/UK/US).';
      return;
    }

    let mondo = v.mondo;
    if (!mondo) {
      // derive from EU, UK or US
      if (v.EU) mondo = (v.EU * 2/3 + 2) * 10;
      else if (v.UKM) mondo = ((v.UK + 22) / 3) * 25.4;
      else if (v.USM) mondo = ((v.USM + 22) / 3) * 25.4;
      else if (v.USF) mondo = ((v.USF + 21) / 3) * 25.4;
    }

    const EU = mondo / 10 * 2/3 - 2;
    const UK = mondo / 25.4 * 3 - 22;
    const USM = mondo / 25.4 * 3 - 22;
    const USF = mondo / 25.4 * 3 - 21;

    resultDiv.innerHTML = `
      <strong>Результати:</strong><br>
      Mondopoint (мм): ${mondo.toFixed(0)}<br>
      EU: ${EU.toFixed(1)}<br>
      UK: ${UK.toFixed(1)}<br>
      US (чоловічий): ${USM.toFixed(1)}<br>
      US (жіночий): ${USF.toFixed(1)}
    `;
  });
});
