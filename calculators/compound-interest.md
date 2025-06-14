---
layout: calculator
title: "Калькулятор складних відсотків"
categories: [financial, investment]
seo:
  title: "Калькулятор складних відсотків — Онлайн розрахунок прибутку"
  description: "Розрахуйте прибуток від інвестицій зі складними відсотками: сума, термін, ставка, капіталізація. Графік зростання вашого капіталу."
  keywords:
    - складні відсотки
    - калькулятор інвестицій
    - капіталізація
    - депозитний калькулятор
    - фінансовий розрахунок
    - online калькулятор
  content: |
    <h2>Калькулятор складних відсотків</h2>
    <p>Онлайн калькулятор допоможе розрахувати прибуток від інвестицій з урахуванням складних відсотків. Вкажіть початкову суму, річну ставку, термін інвестування, частоту капіталізації, а також регулярні внески — результат та графік зростання з'являться нижче.</p>
    <ul>
      <li>Підходить для депозитів, інвестицій, облігацій та накопичень.</li>
      <li>Графік покаже, як зростає капітал з часом.</li>
      <li>Підтримка регулярних внесків і капіталізації: щомісячно, щоквартально тощо.</li>
    </ul>
scripts:
  - /assets/js/compound-interest.js
faq:
  - question: "Що таке складні відсотки?"
    answer: |
      Складні відсотки — це коли відсотки нараховуються не лише на початкову суму, а й на вже накопичені відсотки. Завдяки цьому прибуток зростає швидше.
  - question: "Як працює калькулятор складних відсотків?"
    answer: |
      Ви вводите початкову суму, річну ставку, тривалість, частоту капіталізації та параметри регулярних внесків. Калькулятор розраховує загальний прибуток і побудує графік зростання капіталу.
  - question: "Що таке капіталізація?"
    answer: |
      Капіталізація — це процес додавання отриманих відсотків до основної суми інвестиції. Наприклад, при щомісячній капіталізації відсотки додаються кожен місяць.
  - question: "Чи можна врахувати регулярні внески?"
    answer: |
      Так, калькулятор дозволяє враховувати фіксовані внески з певною частотою (щомісяця, раз на квартал тощо).

<!-- Калькулятор -->
<form id="compound-form">
  <label>Початкова сума</label>
  <input type="number" id="initial" value="10000" min="0" step="any" required>

  <label>Річна відсоткова ставка (%)</label>
  <input type="number" id="rate" value="12" min="0" step="any" required>

  <label>Термін (років)</label>
  <input type="number" id="years" value="5" min="0" step="any" required>

  <label>Капіталізація</label>
  <select id="compound-frequency">
    <option value="1">Раз на рік</option>
    <option value="2">Раз на півроку</option>
    <option value="4">Раз на квартал</option>
    <option value="12" selected>Щомісячно</option>
  </select>

  <label>Регулярний внесок</label>
  <input type="number" id="contribution" value="0" min="0" step="any">

  <label>Частота внеску</label>
  <select id="contribution-frequency">
    <option value="1">Раз на рік</option>
    <option value="2">Раз на півроку</option>
    <option value="4">Раз на квартал</option>
    <option value="12" selected>Щомісячно</option>
  </select>

  <button type="submit">Розрахувати</button>
</form>

<div id="compound-result"></div>

<!-- CHART -->
<div id="compound-chart-block" class="chart-card" style="display:none;">
  <h3>Графік зростання капіталу</h3>
  <div class="chart-canvas-wrap">
    <canvas id="compound-chart"></canvas>
  </div>
</div>
