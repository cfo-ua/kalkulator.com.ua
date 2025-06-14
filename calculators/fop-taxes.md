---
layout: calculator
title: "Калькулятор податків ФОП"
categories: [salary-taxes]
seo:
  title: "Калькулятор податків ФОП — Розрахунок ЄП, ЄСВ та зборів | kalkulator.com.ua"
  description: "Розрахуйте щомісячні та щоквартальні податки ФОП онлайн: єдиний податок, ЄСВ, військовий збір для 1, 2 та 3 груп. Актуальні ставки на 2025 рік."
  keywords:
    - ФОП податки
    - калькулятор ФОП
    - податки ФОП 2025
    - ФОП 1 група
    - ФОП 2 група
    - ФОП 3 група
    - ЄСВ 2025
    - військовий збір
    - єдиний податок
    - як розрахувати податки ФОП
    - ФОП калькулятор 2025
  content: |
    <h2>Калькулятор податків ФОП 2025</h2>
    <p>Онлайн калькулятор дозволяє швидко розрахувати податки для ФОП 1, 2 або 3 групи: єдиний податок, ЄСВ (єдиний соціальний внесок) та військовий збір. Введіть свій щомісячний дохід та оберіть групу, щоб дізнатися, скільки потрібно сплатити до бюджету.</p>

    <p>Розрахунок базується на актуальних ставках на <strong>2025 рік</strong>:</p>
    <ul>
      <li><strong>ЄСВ:</strong> 22% від мінімальної зарплати (8000 грн)</li>
      <li><strong>1 група:</strong> ЄП до 10% прожиткового мінімуму, військовий збір 10% мінімальної з/п</li>
      <li><strong>2 група:</strong> ЄП до 20% мінімальної з/п, військовий збір 10% мінімальної з/п</li>
      <li><strong>3 група:</strong> ЄП 5% або 3% (з ПДВ), військовий збір 1% від доходу</li>
    </ul>

    <p>Цей інструмент допоможе підприємцям швидко зорієнтуватись у щомісячних та щоквартальних платежах, уникнути помилок у звітності та планувати витрати.</p>
scripts:
  - /assets/js/fop-taxes.js
faq:
  - question: Як розраховується єдиний податок для ФОП 1, 2, 3 групи?
    answer: "Ставки залежать від групи. Для 1 і 2 групи — фіксовані суми, залежно від мінімальної зарплати чи прожиткового мінімуму. Для 3 групи — 3% або 5% від доходу залежно від того, чи ви є платником ПДВ."
  - question: Який ЄСВ у 2025 році?
    answer: "Єдиний соціальний внесок становить 22% від мінімальної зарплати, яка у 2025 році складає 8000 грн. Сума ЄСВ для ФОП без працівників — 1760 грн на місяць."
  - question: Чи потрібно ФОП 1 і 2 групи сплачувати військовий збір?
    answer: "Так, у 2025 році військовий збір для ФОП 1 і 2 груп становить 10% від мінімальної зарплати на місяць — 800 грн."
  - question: Як сплачуються податки для ФОП 3 групи?
    answer: "ФОП 3 групи сплачує податки щоквартально: 3% або 5% від доходу (єдиний податок), 1% — військовий збір, 22% від мінімальної зарплати — ЄСВ."
  - question: Чи можу я бути на 3 групі ФОП без ПДВ?
    answer: "Так. Якщо ви не є платником ПДВ, ставка єдиного податку становить 5%. Якщо ви реєструєтесь платником ПДВ — 3%."
  - question: Де знайти актуальну мінімальну зарплату та ставки податків?
    answer: "Ви можете переглянути актуальні дані на офіційному сайті ДПС України або скористатись нашим калькулятором — ставки вже вбудовані для 2025 року."
---

<form id="fop-form" autocomplete="off">
  <label for="group">Оберіть групу ФОП:</label>
  <select id="group" required>
    <option value="1">1 група</option>
    <option value="2">2 група</option>
    <option value="3">3 група (5% без ПДВ)</option>
    <option value="3-vat">3 група (3% з ПДВ)</option>
  </select>

  <label for="income">Місячний дохід (грн):</label>
  <input type="number" id="income" min="0" required>

  <button type="submit">Розрахувати податки</button>
</form>

<div id="fop-result" class="result" style="margin-top:1em;"></div>
