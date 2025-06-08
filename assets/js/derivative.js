document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('derivative-form');
  const result = document.getElementById('derivative-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const coefs = [5, 4, 3, 2, 1, 0].map(i =>
        parseFloat(document.getElementById('d' + i).value)
      );
      let derivative = [];
      for (let i = 0; i < coefs.length - 1; ++i) {
        if (coefs[i] !== 0) {
          const newCoef = coefs[i] * (5 - i);
          const power = 5 - i - 1;
          derivative.push(
            `${(newCoef >= 0 && derivative.length > 0 ? '+' : '')}${newCoef !== 1 || power === 0 ? newCoef : ''}${power === 0 ? '' : 'x'}${power > 1 ? '^' + power : ''}`
          );
        }
      }
      result.innerHTML =
        derivative.length === 0 ?
        "Похідна: 0" :
        `<b>Похідна:</b> ${derivative.join(' ')}`;
    });
  }
});
