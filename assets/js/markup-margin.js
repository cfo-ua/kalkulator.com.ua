document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("markup-margin-form");
  const result = document.getElementById("markup-margin-result");

  function formatNumber(value) {
    return Math.round(value).toLocaleString("uk-UA");
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

      if (known.cost && known.price) {
        const profit = price - cost;
        const margin = profit / price * 100;
        const markup = profit / cost * 100;

        result.innerHTML = `
          <ul>
            <li><strong>Маржа:</strong> ${Math.round(margin)}%</li>
            <li><strong>Націнка:</strong> ${Math.round(markup)}%</li>
            <li><strong>Прибуток:</strong> ${formatNumber(profit)}</li>
          </ul>
        `;
      } else if (known.cost && known.markup) {
        const profit = cost * markupInput / 100;
        const price = cost + profit;
        const margin = profit / price * 100;

        result.innerHTML = `
          <ul>
            <li><strong>Ціна продажу:</strong> ${formatNumber(price)}</li>
            <li><strong>Маржа:</strong> ${Math.round(margin)}%</li>
            <li><strong>Прибуток:</strong> ${formatNumber(profit)}</li>
          </ul>
        `;
      } else if (known.cost && known.margin) {
        const price = cost / (1 - marginInput / 100);
        const profit = price - cost;
        const markup = profit / cost * 100;

        result.innerHTML = `
          <ul>
            <li><strong>Ціна продажу:</strong> ${formatNumber(price)}</li>
            <li><strong>Націнка:</strong> ${Math.round(markup)}%</li>
            <li><strong>Прибуток:</strong> ${formatNumber(profit)}</li>
          </ul>
        `;
      } else if (known.price && known.margin) {
        const profit = price * marginInput / 100;
        const cost = price - profit;
        const markup = profit / cost * 100;

        result.innerHTML = `
          <ul>
            <li><strong>Собівартість:</strong> ${formatNumber(cost)}</li>
            <li><strong>Націнка:</strong> ${Math.round(markup)}%</li>
            <li><strong>Прибуток:</strong> ${formatNumber(profit)}</li>
          </ul>
        `;
      } else if (known.price && known.markup) {
        const cost = price / (1 + markupInput / 100);
        const profit = price - cost;
        const margin = profit / price * 100;

        result.innerHTML = `
          <ul>
            <li><strong>Собівартість:</strong> ${formatNumber(cost)}</li>
            <li><strong>Маржа:</strong> ${Math.round(margin)}%</li>
            <li><strong>Прибуток:</strong> ${formatNumber(profit)}</li>
          </ul>
        `;
      } else {
        result.innerHTML = `<span style="color:red">Будь ласка, введіть щонайменше два параметри для розрахунку.</span>`;
      }
    });
  }
});
