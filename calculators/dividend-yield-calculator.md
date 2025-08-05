---
layout: calculator
title: "Калькулятор дивідендної дохідності"
categories: [financial]
seo:
  title: "Калькулятор дивідендної дохідності — розрахунок прибутковості акцій"
  description: "Онлайн калькулятор для розрахунку дивідендної дохідності акцій. Визначте річну дохідність, прогнозований дохід від дивідендів та ефективність інвестицій."
  keywords:
    - дивідендна дохідність
    - калькулятор дивідендів
    - дохідність акцій
    - інвестиційна дохідність
    - розрахунок дивідендів
    - прибутковість акцій
    - дивідендні акції
    - пасивний дохід
    - фондовий ринок
    - інвестиційний портфель
  content: |
    <h2>Калькулятор дивідендної дохідності онлайн</h2>
    <p>Цей калькулятор допоможе вам розрахувати <strong>дивідендну дохідність акцій</strong> та оцінити ефективність дивідендних інвестицій для створення пасивного доходу.</p>

    <h3>Що таке дивідендна дохідність?</h3>
    <p>Дивідендна дохідність — це фінансовий показник, що відображає річну дохідність від дивідендів відносно ціни акції. Розраховується за формулою:</p>
    <p><code>Дивідендна дохідність = (Дивіденд на акцію / Ціна акції) × 100%</code></p>

    <h3>Переваги дивідендного інвестування:</h3>
    <ul>
      <li>Регулярний пасивний дохід</li>
      <li>Захист від інфляції при зростанні дивідендів</li>
      <li>Стабільність порівняно з спекулятивними інвестиціями</li>
      <li>Можливість реінвестування для складного відсотка</li>
    </ul>

    <h3>Типові рівні дивідендної дохідності:</h3>
    <ul>
      <li><strong>2-4%</strong> — великі стабільні компанії (blue-chip)</li>
      <li><strong>4-6%</strong> — середні компанії зі сталими дивідендами</li>
      <li><strong>6-10%</strong> — високодохідні дивідендні акції (з вищим ризиком)</li>
      <li><strong>10%+</strong> — можливі проблеми компанії або спеціальні дивіденди</li>
    </ul>

    <p>Калькулятор також показує прогнозований дохід від інвестицій та ефект реінвестування дивідендів.</p>
scripts:
  - /assets/js/dividend-yield-calculator.js
faq:
  - question: "Що таке дивідендна дохідність?"
    answer: "Це річна дохідність від дивідендів, виражена у відсотках від поточної ціни акції. Показує, скільки відсотків річного доходу ви отримаєте з дивідендів."
  - question: "Як розрахувати дивідендну дохідність?"
    answer: "Поділіть річні дивіденди на акцію на поточну ціну акції та помножте на 100%. Наприклад: 2 грн дивіденд / 50 грн ціна × 100% = 4% дохідність."
  - question: "Яка гарна дивідендна дохідність?"
    answer: "Залежить від ринкових умов та галузі. Зазвичай 3-6% вважається прийнятним для стабільних компаній. Дуже висока дохідність (10%+) може сигналізувати про ризики."
  - question: "Чи варто реінвестувати дивіденди?"
    answer: "Реінвестування дивідендів створює ефект складного відсотка, значно збільшуючи довгострокову дохідність. Особливо ефективно для молодих інвесторів."
  - question: "Як часто виплачуються дивіденди?"
    answer: "Частота залежить від компанії: щоквартально (найчастіше), раз на півроку або щороку. Деякі компанії можуть платити щомісячно."
  - question: "Чи гарантовані дивіденди?"
    answer: "Ні, дивіденди не гарантовані. Компанія може скоротити або скасувати дивіденди при погіршенні фінансового стану."
---

<form id="dividend-form">
  <label>Ціна акції (грн)</label>
  <input type="number" id="stock-price" value="100" min="0" step="0.01" required>

  <label>Річний дивіденд на акцію (грн)</label>
  <input type="number" id="annual-dividend" value="4" min="0" step="0.01" required>

  <label>Кількість акцій</label>
  <input type="number" id="shares-count" value="100" min="1" required>

  <label>Сума інвестицій (грн)</label>
  <input type="number" id="investment-amount" value="10000" min="0" readonly>

  <label>Очікуване річне зростання дивідендів (%)</label>
  <input type="number" id="dividend-growth" value="5" min="0" max="50" step="0.1">

  <label>Реінвестування дивідендів</label>
  <select id="reinvestment">
    <option value="true" selected>Так, реінвестувати</option>
    <option value="false">Ні, отримувати готівкою</option>
  </select>

  <label>Період прогнозу (років)</label>
  <input type="number" id="forecast-years" value="10" min="1" max="50">

  <button type="submit">Розрахувати</button>
</form>

<div id="dividend-result"></div>

<!--CHART_SPLIT-->

<div id="dividend-chart-block" class="chart-card" style="margin:2.3em auto 0 auto; display:none;">
  <h3 style="margin-bottom:0.9em; text-align:center;">Прогноз дивідендного доходу</h3>
  <div class="chart-canvas-wrap">
    <canvas id="dividend-chart"></canvas>
  </div>
</div>

<script>
// Auto-calculate investment amount
document.getElementById('stock-price').addEventListener('input', updateInvestment);
document.getElementById('shares-count').addEventListener('input', updateInvestment);

function updateInvestment() {
  const price = parseFloat(document.getElementById('stock-price').value) || 0;
  const shares = parseFloat(document.getElementById('shares-count').value) || 0;
  document.getElementById('investment-amount').value = (price * shares).toFixed(2);
}

// Initialize
updateInvestment();
</script>