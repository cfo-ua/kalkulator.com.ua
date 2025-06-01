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
    replenishEnable = false,
    noReplenishFirst = false,
    prolong = 0
  }) {
    let totalInterest = 0;
    let totalReplenish = 0;
    let totalMonths = months * (prolong + 1);
    let currentPrincipal = principal;

    for (let p = 0; p <= prolong; p++) {
      for (let i = 0; i < months; i++) {
        // For the very first month, option to skip replenishment
        if (replenishEnable && (p > 0 || i > 0 || !noReplenishFirst)) {
          // Add replenishment at beginning of month
          currentPrincipal += replenish;
          totalReplenish += replenish;
        }
        // Interest for the month (on all capital)
        let monthInterest = currentPrincipal * (rate / 12 / 100);
        totalInterest += monthInterest;
        // Capitalization: add interest to principal
        currentPrincipal += monthInterest;
      }
    }
    return {
      totalInterest,
      totalReplenish,
      totalMonths,
      finalPrincipal: currentPrincipal
    };
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const rate = Number(document.getElementById('deposit-rate').value);
      const months = Number(document.getElementById('deposit-months').value);
      const principal = Number(document.getElementById('deposit-amount').value);
      const replenishEnable = document.getElementById('deposit-replenish-enable').checked;
      const replenish = replenishEnable ? Number(document.getElementById('deposit-replenish').value) : 0;
      const noReplenishFirst = document.getElementById('no-replenish-first').checked;
      const prolong = Number(document.getElementById('deposit-prolong').value);

      if (principal < 0 || months < 1 || months > 36 || rate < 0 || replenish < 0 || prolong < 0 || prolong > 5) {
        result.textContent = "Будь ласка, введіть коректні дані.";
        return;
      }

      const { totalInterest, totalReplenish, totalMonths, finalPrincipal } = calculateDeposit({
        principal,
        rate,
        months,
        replenish,
        replenishEnable,
        noReplenishFirst,
        prolong
      });

      const tax = totalInterest * 0.23; // 18% ПДФО + 5% військовий збір
      const netInterest = totalInterest - tax;
      const avgMonthlyNet = netInterest / totalMonths;

      // Output block
      result.innerHTML = `
        <div style="font-size:1.4em; font-weight:600; color:#269c26; margin-bottom:0.3em;">
          ${formatUA(netInterest)} ₴
        </div>
        <div style="font-size:1em; color:#222; margin-bottom:1.2em;">
          Середній щомісячний дохід — <b>${formatUA(avgMonthlyNet)}</b> ₴<br>
          Після сплати податку <input type="checkbox" checked disabled style="vertical-align:middle;">
        </div>
        <hr>
        <div style="text-align:left; font-size:1em;">
          <b>Розрахунок:</b><br>
          <span>Сума вкладу: <b>${formatUA(principal)} ₴</b></span><br>
          <span>Сума поповнень: <b>${formatUA(totalReplenish)} ₴</b></span><br>
          <span>Процентна ставка: <b>${rate}% на рік</b></span><br>
          <span>Проценти (дохід): <b>${formatUA(totalInterest)} ₴</b></span><br>
          <span>Податок (18% ПДФО + 5% військовий збір): <b>${formatUA(tax)} ₴</b></span><br>
          <br>
          <b>Після сплати податку:</b><br>
          <span>Проценти (дохід): <b style="color:#269c26;">${formatUA(netInterest)} ₴</b></span>
        </div>
      `;
    });

    // Enable/disable replenish input UX
    const replenishEnable = document.getElementById('deposit-replenish-enable');
    const replenishInput = document.getElementById('deposit-replenish');
    if (replenishEnable && replenishInput) {
      replenishEnable.addEventListener('change', function () {
        replenishInput.disabled = !this.checked;
        replenishInput.style.background = this.checked ? '#fff' : '#f2f2f2';
      });
      replenishInput.disabled = !replenishEnable.checked;
      replenishInput.style.background = replenishEnable.checked ? '#fff' : '#f2f2f2';
    }
  }
});
