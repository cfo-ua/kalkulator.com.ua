document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('vat-form');
  const result = document.getElementById('vat-result');

  const format = num => Number(num).toLocaleString('en-US', { 
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });

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
      result.innerHTML = `<span style="color:red;">Please enter any two values</span>`;
      return;
    }

    const vatAmount = priceGross - priceNet;

    result.innerHTML = `
      <h3>VAT Calculation Results:</h3>
      <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; border-left: 4px solid #007bff;">
        <ul style="list-style:none;padding-left:0;margin:0;">
          <li><strong>Price without VAT:</strong> ${format(priceNet)}</li>
          <li><strong>VAT Amount:</strong> ${format(vatAmount)}</li>
          <li><strong>Price with VAT:</strong> ${format(priceGross)}</li>
          <li><strong>VAT Rate:</strong> ${vatRate.toFixed(2)}%</li>
        </ul>
      </div>
    `;
  });
});