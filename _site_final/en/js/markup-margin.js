document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("markup-margin-form");
  const result = document.getElementById("markup-margin-result");

  function formatCurrency(value) {
    return Math.round(value).toLocaleString("en-US", {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatPercent(value) {
    return Math.round(value * 100) / 100; // Round to 2 decimal places
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let cost = parseFloat(document.getElementById("cost").value);
      let price = parseFloat(document.getElementById("price").value);
      let marginInput = parseFloat(document.getElementById("margin").value);
      let markupInput = parseFloat(document.getElementById("markup").value);

      let known = {
        cost: !isNaN(cost),
        price: !isNaN(price),
        margin: !isNaN(marginInput),
        markup: !isNaN(markupInput),
      };

      // Count how many fields are filled
      let filledFields = Object.values(known).filter(Boolean).length;

      if (filledFields < 2) {
        result.innerHTML = `<span style="color:red">Please enter at least two parameters for calculation.</span>`;
        return;
      }

      if (known.cost && known.price) {
        const profit = price - cost;
        const margin = profit / price * 100;
        const markup = profit / cost * 100;

        result.innerHTML = `
          <h3>Calculation Results:</h3>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li><strong>Margin:</strong> ${formatPercent(margin)}%</li>
              <li><strong>Markup:</strong> ${formatPercent(markup)}%</li>
              <li><strong>Profit:</strong> ${formatCurrency(profit)}</li>
            </ul>
          </div>
        `;
      } else if (known.cost && known.markup) {
        const profit = cost * markupInput / 100;
        const price = cost + profit;
        const margin = profit / price * 100;

        result.innerHTML = `
          <h3>Calculation Results:</h3>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li><strong>Selling Price:</strong> ${formatCurrency(price)}</li>
              <li><strong>Margin:</strong> ${formatPercent(margin)}%</li>
              <li><strong>Profit:</strong> ${formatCurrency(profit)}</li>
            </ul>
          </div>
        `;
      } else if (known.cost && known.margin) {
        const price = cost / (1 - marginInput / 100);
        const profit = price - cost;
        const markup = profit / cost * 100;

        result.innerHTML = `
          <h3>Calculation Results:</h3>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li><strong>Selling Price:</strong> ${formatCurrency(price)}</li>
              <li><strong>Markup:</strong> ${formatPercent(markup)}%</li>
              <li><strong>Profit:</strong> ${formatCurrency(profit)}</li>
            </ul>
          </div>
        `;
      } else if (known.price && known.margin) {
        const profit = price * marginInput / 100;
        const cost = price - profit;
        const markup = profit / cost * 100;

        result.innerHTML = `
          <h3>Calculation Results:</h3>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li><strong>Cost Price:</strong> ${formatCurrency(cost)}</li>
              <li><strong>Markup:</strong> ${formatPercent(markup)}%</li>
              <li><strong>Profit:</strong> ${formatCurrency(profit)}</li>
            </ul>
          </div>
        `;
      } else if (known.price && known.markup) {
        const cost = price / (1 + markupInput / 100);
        const profit = price - cost;
        const margin = profit / price * 100;

        result.innerHTML = `
          <h3>Calculation Results:</h3>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li><strong>Cost Price:</strong> ${formatCurrency(cost)}</li>
              <li><strong>Margin:</strong> ${formatPercent(margin)}%</li>
              <li><strong>Profit:</strong> ${formatCurrency(profit)}</li>
            </ul>
          </div>
        `;
      } else {
        result.innerHTML = `<span style="color:red">Please enter a valid combination of two parameters for calculation.</span>`;
      }
    });
  }
});