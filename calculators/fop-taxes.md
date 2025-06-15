---
layout: calculator
title: "Калькулятор податків ФОП"
categories: [salary-taxes]
seo:
  title: "Калькулятор податків ФОП — Розрахунок ЄП, ЄСВ та зборів | kalkulator.com.ua"
  description: "Розрахуйте податки для ФОП 1, 2 або 3 групи: єдиний податок, ЄСВ, військовий збір. Онлайн калькулятор для підприємців."
  keywords:
    - ФОП податки
    - калькулятор ФОП
    - ФОП 1 група
    - ФОП 2 група
    - ФОП 3 група
    - ЄСВ
    - військовий збір
    - єдиний податок
  content: |
    <h2>Калькулятор податків ФОП</h2>
    <p>Виберіть групу ФОП та вкажіть дохід, щоб розрахувати розмір єдиного податку, ЄСВ та військового збору. Актуальні ставки на {{ 'now' | date: '%Y' }} рік.</p>
scripts:
  - /assets/js/fop-taxes.js
faq:
  - question: Які податки сплачують ФОП?
    answer: "Залежно від групи — це може бути єдиний податок, єдиний соціальний внесок (ЄСВ) та військовий збір."
  - question: Чим відрізняються групи ФОП?
    answer: "Групи різняться за дозволеним видом діяльності, доходом, найманими працівниками та ставками податків."
  - question: Чи потрібно ФОП сплачувати ПДВ?
    answer: "ФОП 1 і 2 груп не можуть бути платниками ПДВ, а 3 група — за бажанням."
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
