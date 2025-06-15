(() => {
  const salaryInput = document.getElementById("salary-input");
  const resultBlock = document.getElementById("salary-result");
  const calculateBtn = document.getElementById("calculate-salary");

  const PIT_RATE = 0.18;
  const MILITARY_TAX_RATE = 0.05;
  const ERU_RATE = 0.22;

  function format(amount) {
    return amount.toFixed(2) + " грн";
  }

  function calculateFromGross(gross) {
    const pit = gross * PIT_RATE;
    const military = gross * MILITARY_TAX_RATE;
    const net = gross - pit - military;
    const eru = gross * ERU_RATE;
    return { gross, pit, military, eru, net };
  }

  function calculateFromNet(net) {
    const gross = net / (1 - PIT_RATE - MILITARY_TAX_RATE);
    const pit = gross * PIT_RATE;
    const military = gross * MILITARY_TAX_RATE;
    const eru = gross * ERU_RATE;
    return { gross, pit, military, eru, net };
  }

  function renderResult(data) {
    resultBlock.innerHTML = `
      <p><strong>Нарахована зарплата (брутто):</strong> ${format(data.gross)}</p>
      <p>ПДФО (18%): ${format(data.pit)}</p>
      <p>Військовий збір (5%): ${format(data.military)}</p>
      <p><strong>Сума до виплати (нетто):</strong> ${format(data.net)}</p>
      <p>ЄСВ (22%, сплачує роботодавець): ${format(data.eru)}</p>
    `;
  }

  calculateBtn.addEventListener("click", () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const value = parseFloat(salaryInput.value);
    if (isNaN(value) || value <= 0) {
      resultBlock.innerHTML = "<p>Введіть коректну суму.</p>";
      return;
    }

    const data = mode === "gross" ? calculateFromGross(value) : calculateFromNet(value);
    renderResult(data);
  });
})();
