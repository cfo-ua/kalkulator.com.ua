---
layout: calculator
title: "Калькулятор ПДВ (VAT)"
categories: [business]
seo:
  title: "Калькулятор ПДВ — Розрахувати ціну з/без податку | kalkulator.com.ua"
  description: "Обчисліть ціну з ПДВ, без ПДВ або сам ПДВ. Просто введіть будь-які два значення — ставка, ціна з ПДВ, ціна без ПДВ — і калькулятор визначить третє."
  keywords: ["калькулятор ПДВ", "розрахунок ПДВ", "ціна з ПДВ", "ціна без ПДВ", "пдв в україні", "податок на додану вартість", "VAT calculator"]
  content: |
    <h2>Калькулятор ПДВ</h2>
    <p>Введіть будь-які <strong>два значення</strong> — калькулятор автоматично визначить третє. Ви можете розрахувати:</p>
    <ul>
      <li>Ціну <strong>з ПДВ</strong>, знаючи ставку та ціну без ПДВ</li>
      <li>Ціну <strong>без ПДВ</strong>, знаючи ставку та ціну з ПДВ</li>
      <li><strong>Ставку ПДВ</strong>, якщо відомі обидві ціни</li>
    </ul>
scripts:
  - /assets/js/vat-calculator.js
faq:
  - question: "Яка стандартна ставка ПДВ в Україні?"
    answer: "Зазвичай 20%. Для деяких товарів та послуг можуть діяти пільгові ставки — 7% або 0%."
  - question: "Як розрахувати ПДВ з ціни з ПДВ?"
    answer: "Сума ПДВ = Ціна з ПДВ - (Ціна з ПДВ / (1 + ставка / 100))"
  - question: "Як розрахувати ціну з ПДВ?"
    answer: "Ціна з ПДВ = Ціна без ПДВ × (1 + ставка / 100)"
---

<form id="vat-form" autocomplete="off" style="max-width:420px;">
  <label>Ціна без ПДВ:
    <input type="number" id="price-net" min="0" step="0.01" placeholder="напр. 1000">
  </label>
  <label>Ціна з ПДВ:
    <input type="number" id="price-gross" min="0" step="0.01" placeholder="напр. 1200">
  </label>
  <label>Ставка ПДВ (%):
    <input type="number" id="vat-rate" min="0" step="0.1" placeholder="напр. 20">
  </label>
  <button type="submit">Розрахувати</button>
</form>

<div id="vat-result" class="result" style="min-height:2.3em;margin-top:1.5em;"></div>
