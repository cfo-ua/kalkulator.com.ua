---
layout: calculator
title: "Депозитний калькулятор"
categories: [financial]
seo:
  title: "Депозитний калькулятор — Фінанси | kalkulator.com.ua"
  description: "Розрахуйте прибуток по депозиту онлайн з урахуванням податків (ПДФО 18% + військовий збір 5%) в 2025 році. Підтримка щомісячного поповнення, пролонгацій та складних відсотків."
  keywords: ["депозитний калькулятор", "депозит", "вклад", "фінанси", "відсотки", "онлайн калькулятор", "україна"]
  content: |
    <h2>Як працює депозитний калькулятор?</h2>
    <p>Цей калькулятор допомагає визначити чистий прибуток по вашому депозиту з урахуванням податків у 2025 році: ПДФО 18% та військовий збір 5% від нарахованих відсотків (разом 23%). Доступні опції складних відсотків (капіталізація), щомісячного поповнення та пролонгацій.</p>
    <h3>Формула розрахунку</h3>
    <ul>
      <li><b>Сума вкладу</b> — стартова сума депозиту.</li>
      <li><b>Поповнення</b> — сума, яку ви додаєте щомісяця (опційно).</li>
      <li><b>Термін</b> — кількість місяців (або пролонгацій).</li>
      <li><b>Відсотки</b> нараховуються щомісяця на суму вкладу + поповнення (з капіталізацією).</li>
      <li><b>Податок</b> — 23% від суми нарахованих відсотків (ПДФО 18% + військовий збір 5%).</li>
      <li><b>Чистий прибуток</b> = Всього відсотків – Податок.</li>
    </ul>
    <p>Див. також <b>Скріншот прикладу:</b><br>![image1](image1)</p>
scripts:
  - /assets/js/deposit.js
faq:
  - question: Які податки враховуються?
    answer: Калькулятор враховує ПДФО 18% та військовий збір 5% (разом 23%) від суми нарахованих відсотків.
  - question: Чи підтримує калькулятор поповнення і пролонгації?
    answer: Так, калькулятор дозволяє враховувати щомісячне поповнення, пропуск поповнення в перший місяць і до 5 пролонгацій депозиту.
  - question: Чи підходить для валютних вкладів?
    answer: Так, калькулятор підходить для депозитів у будь-якій валюті, адже податкові ставки однакові для всіх валют.
---

<form id="deposit-form" autocomplete="off">
  <label>
    Ставка (% річних)
    <input type="number" id="deposit-rate" required min="0" step="0.01" value="10">
  </label>
  <label>
    Термін (місяців)
    <input type="number" id="deposit-months" required min="1" max="36" value="7">
  </label>
  <label>
    Сума вкладу (₴)
    <input type="number" id="deposit-amount" required min="0" step="100" value="1000">
  </label>
  <div>
    <label>
      <input type="checkbox" id="deposit-replenish-enable" checked>
      Щомісячне поповнення
    </label>
    <input type="number" id="deposit-replenish" min="0" step="100" value="500" style="max-width:110px;">
    <label style="margin-left:10px;">
      <input type="checkbox" id="no-replenish-first">
      Без поповнення в перший місяць
    </label>
  </div>
  <label>
    Кількість пролонгацій
    <input type="number" id="deposit-prolong" min="0" max="5" value="0">
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="deposit-result" class="result"></div>

{%- comment -%}
<div class="ads">
  [Тут буде реклама]
</div>
{%- endcomment -%}

{% assign current_category = page.category | default: page.categories[0] %}
{% assign related_calcs = site.pages | where: "category", current_category | where_exp: "item", "item.url != page.url" | limit: 5 %}
{% if related_calcs.size > 0 %}
<div class="related">
  <h2>Схожі калькулятори</h2>
  <ul>
    {% for calc in related_calcs %}
    <li><a href="{{ calc.url }}">{{ calc.title }}</a></li>
    {% endfor %}
  </ul>
</div>
{% endif %}
