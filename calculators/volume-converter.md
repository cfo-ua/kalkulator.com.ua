---
layout: calculator
title: "Конвертер об’єму (ємності) онлайн"
categories: [conversion]
seo:
  title: "Конвертер об’єму — літри, м³, галони, мілілітри | Онлайн калькулятор ємності"
  description: "Конвертуйте об’єм рідин та речовин онлайн: літри, мілілітри, кубічні метри, галони, унції, кварти. Зручно для кухні, будівництва, хімії, навчання."
  keywords:
    - конвертер об’єму
    - калькулятор об’єму
    - перевести літри в мілілітри
    - м³ в літри
    - галони в літри
    - онлайн конвертація ємності
    - ємність в унціях
    - кухонний калькулятор об’єму
    - переклад об’єму
    - калькулятор рідин
  content: |
    <h2>Конвертер об’єму / ємності</h2>
    <p>Швидко конвертуйте об’єм рідин, сипучих або твердих речовин онлайн. Просто введіть значення, оберіть одиниці — і результат з’явиться миттєво.</p>
    <ul>
      <li>Підтримуються: <b>літри, м³, мл, галони (US/UK), пінти, кварти, унції</b>.</li>
      <li>Зручно для приготування їжі, будівництва, науки, лабораторій або навчання.</li>
      <li>Працює безкоштовно на телефоні, планшеті чи комп’ютері.</li>
    </ul>
scripts:
  - /assets/js/volume-converter.js
faq:
  - question: "Які одиниці об’єму можна конвертувати?"
    answer: "Калькулятор підтримує літри, мілілітри, кубічні метри (м³), галони (США/Британія), кварти, пінти та унції."
  - question: "Чим відрізняються галони US і UK?"
    answer: "1 галон US ≈ 3.785 літра, а UK (імперський) ≈ 4.546 літра. У калькуляторі обидві опції позначені окремо."
  - question: "Чи можна користуватись калькулятором для кулінарії?"
    answer: "Так! Кухарі часто використовують його для перетворення об’єму інгредієнтів у літрах, мл, унціях або пінтах."
  - question: "Це безкоштовно?"
    answer: "Так, калькулятор об’єму — повністю безкоштовний і працює без реєстрації."
  - question: "Чи доступно з телефону?"
    answer: "Так, інтерфейс адаптовано для мобільних пристроїв."
---

<form id="volume-converter-form" class="converter-form">
  <input type="number" id="volume-input" placeholder="Введіть об’єм" required>
  <select id="volume-from">
    <option value="l" selected>літри (л)</option>
    <option value="ml">міллілітри (мл)</option>
    <option value="m3">метри кубічні (м³)</option>
    <option value="us_gal">галони США (US gal)</option>
    <option value="uk_gal">галони Британські (UK gal)</option>
    <option value="qt">кварти (qt)</option>
    <option value="pt">пінти (pt)</option>
    <option value="oz">унції (fl oz)</option>
  </select>
  <span>в</span>
  <select id="volume-to">
    <option value="l">літри (л)</option>
    <option value="ml">міллілітри (мл)</option>
    <option value="m3">метри кубічні (м³)</option>
    <option value="us_gal">галони США (US gal)</option>
    <option value="uk_gal">галони Британські (UK gal)</option>
    <option value="qt">кварти (qt)</option>
    <option value="pt">пінти (pt)</option>
    <option value="oz">унції (fl oz)</option>
  </select>
  <div id="volume-result" class="result"></div>
</form>
