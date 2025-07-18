document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("savings-goal-form");
  const resultDiv = document.getElementById("savings-goal-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const goal = parseFloat(document.getElementById("goal").value);
    const initial = parseFloat(document.getElementById("initial").value) || 0;
    const months = parseInt(document.getElementById("months").value);

    if (isNaN(goal) || isNaN(initial) || isNaN(months) || goal <= initial || months <= 0) {
      resultDiv.innerHTML = "<p>Будь ласка, перевірте введені значення. Сума цілі повинна бути більшою за початкову, а кількість місяців — додатною.</p>";
      return;
    }

    const amountToSave = (goal - initial) / months;

    resultDiv.innerHTML = `
      <h3>Результати:</h3>
      <p>Щоб досягти цілі у <strong>${goal.toLocaleString('uk-UA')} грн</strong> за <strong>${months}</strong> міс., потрібно щомісяця відкладати приблизно:</p>
      <p><strong>${amountToSave.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} грн</strong></p>
    `;
  });
});
