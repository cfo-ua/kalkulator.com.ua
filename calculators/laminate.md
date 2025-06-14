---
layout: calculator
title: "Калькулятор ламінату"
categories: [construction]
seo:
  title: "Калькулятор ламінату | Скільки упаковок потрібно?"
  description: "Швидко розрахуйте, скільки упаковок ламінату потрібно для укладання підлоги з урахуванням запасу."
  keywords:
    - калькулятор ламінату
    - скільки ламінату потрібно
    - ремонт підлоги
    - розрахунок ламінату
    - упаковка ламінату
    - будівельні калькулятори
  content: |
    <h2>Калькулятор ламінату</h2>
    <p>Цей калькулятор допоможе вам точно визначити, скільки <strong>упаковок ламінату</strong> потрібно для укладання підлоги у приміщенні.</p>
    <p><b>Ви можете ввести:</b></p>
    <ul>
      <li>Площу кімнати (в м²)</li>
      <li>Скільки м² покриває одна упаковка</li>
      <li>Бажаний запас у відсотках (рекомендується 5–10%)</li>
    </ul>
    <p>Результат буде округлений в більший бік, адже ламінат продається упаковками.</p>
scripts:
  - /assets/js/laminate.js
faq:
  - question: Як правильно розрахувати кількість упаковок ламінату?
    answer: "Необхідну площу множать на коефіцієнт запасу, а потім ділять на площу однієї упаковки. Наприклад: (20 × 1.07) / 2.4 = 8.91 → 9 упаковок."
  - question: Скільки запасу потрібно на обрізки?
    answer: "Рекомендується додати 5–10% для компенсації відходів при обрізанні та підгонці."
  - question: Що буде, якщо не враховувати запас?
    answer: "Може не вистачити матеріалу, особливо в приміщеннях складної форми або при укладці під кутом."
---

<form id="laminate-form" autocomplete="off">
  <label>
    Площа кімнати (м²):
    <input type="number" id="laminate-area" min="0" step="any" required>
  </label>
  <label>
    Площа однієї упаковки ламінату (м²):
    <input type="number" id="laminate-pack" min="0" step="any" required>
  </label>
  <label>
    Запас (%):
    <input type="number" id="laminate-waste" min="0" step="any" value="7">
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="laminate-result" class="result"></div>
