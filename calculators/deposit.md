---
layout: calculator
title: "Депозитний калькулятор"
categories: [financial]
seo:
  title: "Депозитний калькулятор — Фінанси | kalkulator.com.ua"
  description: "Розрахуйте прибуток по депозиту онлайн з урахуванням податків (ПДФО 18% + військовий збір 1,5%) в 2025 році."
  keywords: ["депозитний калькулятор", "депозит", "вклад", "фінанси", "відсотки", "онлайн калькулятор", "україна"]
  content: |
    <h2>Як працює депозитний калькулятор?</h2>
    <p>Депозитний калькулятор допомагає визначити чистий прибуток по вашому вкладу з урахуванням податків у 2025 році: ПДФО 18% та військовий збір 1,5% від нарахованих відсотків.</p>
    <h3>Формула розрахунку</h3>
    <ul>
      <li><b>S</b> — сума вкладу</li>
      <li><b>r</b> — річна ставка (% річних)</li>
      <li><b>n</b> — термін (у місяцях)</li>
      <li><b>Доход до оподаткування</b> = S × r × n / 12 / 100</li>
      <li><b>Податок</b> = Доход × 19.5% (ПДФО 18% + військовий збір 1.5%)</li>
      <li><b>Чистий прибуток</b> = Доход – Податок</li>
    </ul>
scripts:
  - /assets/js/deposit.js
faq:
  - question: Які податки враховуються?
    answer: Калькулятор враховує ПДФО 18% та військовий збір 1,5% від суми нарахованих відсотків (разом 19,5%).
  - question: Чи враховується капіталізація відсотків?
    answer: Ні, цей калькулятор розраховує прості відсотки без капіталізації. Такий розрахунок підходить для більшості строкових депозитів з виплатою відсотків у кінці строку.
  - question: Чи підходить цей калькулятор для валютних вкладів?
    answer: Калькулятор розрахований для депозитів у гривні, оскільки саме для них діють ці податкові ставки.
---

<form id="deposit-form">
  <label>
    Сума вкладу (₴)
    <input type="number" id="deposit-amount" required min="0" step="100" value="50000">
  </label>
  <label>
    Термін (місяців)
    <input type="number" id="deposit-months" required min="1" max="60" value="12">
  </label>
  <label>
    Ставка (% річних)
    <input type="number" id="deposit-rate" required min="0" step="0.01" value="15">
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
