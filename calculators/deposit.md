---
layout: calculator
title: "Депозитний калькулятор"
categories: [financial]
seo:
  title: "Депозитний калькулятор — Фінанси | kalkulator.com.ua"
  description: "Розрахуйте прибуток по депозиту онлайн з урахуванням податків (ПДФО 18% + військовий збір 5%) в 2025 році. Підтримка щомісячного поповнення та вибору способу виплати відсотків."
  keywords:
    - депозитний калькулятор
    - депозит
    - вклад
    - фінанси
    - відсотки
    - онлайн калькулятор
    - україна
  content: |
    <h2>Як працює депозитний калькулятор?</h2>
    <p>Цей калькулятор допомагає визначити чистий прибуток по вашому депозиту з урахуванням податків у 2025 році: ПДФО 18% та військовий збір 5% від суми відсотків (разом 23%). Ви можете врахувати щомісячне поповнення, а також обрати спосіб виплати відсотків: щомісячно чи з капіталізацією.</p>
    <h3>Формула розрахунку</h3>
    <ul>
      <li><b>Сума вкладу</b> — стартова сума депозиту.</li>
      <li><b>Поповнення</b> — сума, яку ви додаєте щомісяця (опційно).</li>
      <li><b>Термін</b> — кількість місяців.</li>
      <li><b>Відсотки</b> нараховуються щомісяця на суму вкладу + поповнення (з капіталізацією) або виплачуються окремо без капіталізації.</li>
      <li><b>Податок</b> — 23% від суми нарахованих відсотків (ПДФО 18% + військовий збір 5%).</li>
      <li><b>Чистий прибуток</b> = Всього відсотків – Податок.</li>
    </ul>
scripts:
  - /assets/js/deposit.js
faq:
  - question: "Які податки враховуються?"
    answer: "Калькулятор враховує ПДФО 18% та військовий збір 5% (разом 23%) від суми нарахованих відсотків."
  - question: "Чи підходить для валютних вкладів?"
    answer: "Так, калькулятор підходить для депозитів у будь-якій валюті, адже податкові ставки однакові для всіх валют."
  - question: "Як працюють опції \"капіталізація\" та \"щомісячна виплата\" відсотків?"
    answer: "\"Капіталізація\" означає, що відсотки щомісяця додаються до суми вкладу і надалі теж приносять дохід. \"Щомісячна виплата\" — відсотки щомісяця виплачуються окремо, без збільшення суми вкладу."
---

<form id="deposit-form" autocomplete="off">
  <label>
    Ставка (% річних)
    <input type="number" id="deposit-rate" required min="0" step="0.01" value="10">
  </label>
  <label>
    Термін (місяців)
    <input type="number" id="deposit-months" required min="1" max="36" value="12">
  </label>
  <label>
    Сума вкладу (₴)
    <input type="number" id="deposit-amount" required min="0" step="100" value="1000">
  </label>
  <div>
    <label>
      <input type="checkbox" id="deposit-replenish-enable">
      Щомісячне поповнення
    </label>
    <input type="number" id="deposit-replenish" min="0" step="100" value="0" style="max-width:110px;" disabled>
  </div>
  <fieldset style="border: none; padding: 0; margin: 1em 0 0.5em 0;">
    <legend style="font-size:1em;font-weight:600;margin-bottom:0.2em;">Спосіб виплати відсотків</legend>
    <div style="display: flex; flex-direction: column; gap: 0.3em;">
      <label style="display:flex; align-items:center; gap:0.6em;">
        <input type="radio" name="deposit-payout" value="capitalize" checked>
        Відсотки додаються до вкладу (капіталізація)
      </label>
      <label style="display:flex; align-items:center; gap:0.6em;">
        <input type="radio" name="deposit-payout" value="monthly">
        Відсотки виплачуються щомісяця
      </label>
    </div>
  </fieldset>
  <button type="submit">Розрахувати</button>
</form>
<div id="deposit-result" class="result"></div>

{%- comment -%}
<div class="ads">
  [Тут буде реклама]
</div>
{%- endcomment -%}
