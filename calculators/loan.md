---
layout: calculator
title: "Кредитний калькулятор"
category: financial
seo:
  title: "Кредитний калькулятор — Фінанси | kalkulator.com.ua"
  description: "Розрахуйте щомісячний платіж по кредиту онлайн. Зручно для банків та швидких розрахунків."
  keywords: ["кредитний калькулятор", "кредит", "фінанси", "банк", "онлайн калькулятор", "україна"]
  content: |
    <h2>Як працює кредитний калькулятор?</h2>
    <p>Наш кредитний калькулятор дозволяє швидко розрахувати щомісячний платіж та загальну суму виплат по кредиту. Враховуйте, що фактична процентна ставка може відрізнятись залежно від банку.</p>
    <h3>Формула розрахунку</h3>
    <p>Ми використовуємо класичну формулу ануїтетного платежу:</p>
    <pre>Платіж = S × (r / (1 – (1 + r)<sup>-n</sup>))</pre>
    <ul>
      <li><b>S</b> — сума кредиту</li>
      <li><b>r</b> — місячна ставка (річна/12/100)</li>
      <li><b>n</b> — кількість місяців</li>
    </ul>
scripts:
  - /assets/js/loan.js
faq:
  - question: Чи враховує калькулятор комісії банку?
    answer: Ні, калькулятор враховує лише основні параметри кредиту. Для точного розрахунку звертайтесь до банку.
  - question: Чи можна розрахувати дострокове погашення?
    answer: Ця версія калькулятора не враховує дострокові виплати, але ми плануємо додати цю функцію пізніше.
---

<form id="loan-form">
  <label>
    Сума кредиту (₴)
    <input type="number" id="amount" required min="0" step="100" value="10000">
  </label>
  <label>
    Термін (місяців)
    <input type="number" id="months" required min="1" max="360" value="12">
  </label>
  <label>
    Ставка (% річних)
    <input type="number" id="rate" required min="0" step="0.01" value="18">
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="loan-result" class="result"></div>

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
