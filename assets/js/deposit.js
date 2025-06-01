document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('deposit-form');
  const result = document.getElementById('deposit-result');

  function formatUA(val) {
    return val.toLocaleString('uk-UA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  function calculateDeposit({
    principal,
    rate,
    months,
    replenish = 0,
    capitalize = true
  }) {
    let totalInterest = 0;
    let totalReplenish = 0;
    let currentPrincipal = principal;

    if (capitalize) {
      // Compound interest with monthly replenishment
      for (let i = 0; i < months; i++) {
        if (replenish > 0 && i > 0) {
          currentPrincipal += replenish;
          totalReplenish += replenish;
        }
        let monthInterest = currentPrincipal * (rate / 12 / 100);
        totalInterest += monthInterest;
        currentPrincipal += monthInterest;
      }
    } else {
      // No capitalization: payout interest each month, replenishment increases base
      for (let i = 0; i < months; i++) {
        if (replenish > 0 && i > 0) {
          currentPrincipal += replenish;
          totalReplenish += replenish;
        }
        let monthInterest = currentPrincipal * (rate / 12 / 100);
        totalInterest += monthInterest;
        // principal does NOT increase from interest
      }
    }
    return {
      totalInterest,
      totalReplenish,
      finalPrincipal: currentPrincipal
    };
  }

  if (form) {
    // Replenish checkbox enables/disables input
    const replenishEnable = document.getElementById('deposit-replenish-enable');
    const replenishInput = document.getElementById('deposit-replenish');
    replenishEnable.addEventListener('change', function () {
      replenishInput.disabled = !this.checked;
      if (!this.checked) replenishInput.value = 0;
      replenishInput.style.background = this.checked ? '#fff' : '#f2f2f2';
    });
    replenishInput.disabled = !replenishEnable.checked;
    replenishInput.style.background = replenishEnable.checked ? '#fff' : '#f2f2f2';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const rate = Number(document.getElementById('deposit-rate').value);
      const months = Number(document.getElementById('deposit-months').value);
      const principal = Number(document.getElementById('deposit-amount').value);
      const replenishEnableChecked = replenishEnable.checked;
      const replenish = replenishEnableChecked ? Number(replenishInput.value) : 0;

      const payoutType = form.querySelector('input[name="deposit-payout"]:checked').value;
      const capitalize = payoutType === 'capitalize';

      if (principal < 0 || months < 1 || months > 36 || rate < 0 || replenish < 0) {
        result.textContent = "Будь ласка, введіть коректні дані.";
        return;
      }

      const { totalInterest, totalReplenish, finalPrincipal } = calculateDeposit({
        principal,
        rate,
        months,
        replenish,
        capitalize
      });

      const tax = totalInterest * 0.23; // 18% ПДФО + 5% військовий збір
      const netInterest = totalInterest - tax;

      // Effective APR for display (in case of capitalization)
      let effectiveRate = "";
      if (capitalize) {
        effectiveRate = ((finalPrincipal - principal - totalReplenish) / (principal + totalReplenish) * 12 / months * 100);
        // For short term deposits, this can be misleading if replenishments are big, so for clarity:
        effectiveRate = isNaN(effectiveRate) ? "" : (effectiveRate.toFixed(2) + "% на рік");
      } else {
        effectiveRate = (rate.toFixed(2) + "% на рік");
      }

      // Output block (blue, as on your screenshot)
      result.innerHTML = `
        <div style="text-align:left; font-size:1.08em; color:#157aff; font-weight:600;">
          <span style="font-size:1.08em; font-weight:700; color:#157aff; display:block; margin-bottom:0.7em;">Розрахунок:</span>
          <span>Сума вкладу: <b>${formatUA(principal)} ₴</b></span><br>
          <span>Сума поповнень: <b>${formatUA(totalReplenish)} ₴</b></span><br>
          <span>Процентна ставка: <b>${effectiveRate}</b></span><br>
          <span>Проценти (дохід): <b>${formatUA(totalInterest)} ₴</b></span><br>
          <span>Податок (18% ПДФО + 5% військовий збір): <b>${formatUA(tax)} ₴</b></span><br>
          <br>
          <b>Після сплати податку:</b><br>
          <span>Проценти (дохід): <b>${formatUA(netInterest)} ₴</b></span>
        </div>
      `;
    });
  }
});
