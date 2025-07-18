document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('vat-form');
  const result = document.getElementById('vat-result');

  const format = num => Number(num).toLocaleString('uk-UA', { maximumFractionDigits: 2 });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const net = parseFloat(form['price-net'].value);
    const gross = parseFloat(form['price-gross'].value);
    const rate = parseFloat(form['vat-rate'].value);

    let priceNet = net;
    let priceGross = gross;
    let vatRate = rate;

    // Case 1: net + rate -> gross
    if (!isNaN(priceNet) && !isNaN(vatRate)) {
      priceGross = priceNet * (1 + vatRate / 100);
    }
    // Case 2: gross + rate -> net
    else if (!isNaN(priceGross) && !isNaN(vatRate)) {
      priceNet = priceGross / (1 + vatRate / 100);
    }
    // Case 3: gross + net -> rate
    else if (!isNaN(priceGross) && !isNaN(priceNet)) {
      vatRate = ((priceGross / priceNet) - 1) * 100;
    } else {
      result.innerHTML = `<span style="color:red;">Будь ласка, введіть будь-які два значення</span>`;
      return;
    }

    const vatAmount = priceGross - priceNet;

    result.innerHTML = `
      <ul style="list-style:none;padding-left:0;">
        <li><strong>Ціна без ПДВ:</strong> ${format(priceNet)} грн</li>
        <li><strong>Сума ПДВ:</strong> ${format(vatAmount)} грн</li>
        <li><strong>Ціна з ПДВ:</strong> ${format(priceGross)} грн</li>
        <li><strong>Ставка ПДВ:</strong> ${format(vatRate)}%</li>
      </ul>
    `;
  });
});
