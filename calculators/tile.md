---
layout: calculator
title: "Калькулятор кількості плитки"
categories: [construction]
seo:
  title: "Калькулятор плитки | Будівельні калькулятори"
  description: "Дізнайтеся, скільки плитки потрібно для укладання підлоги чи стін. З урахуванням запасу."
  keywords:
    - плитка
    - ремонт
    - підлога
    - стіни
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор кількості плитки</h2>
    <p>Вкажіть параметри площі та плитки, а також бажаний запас, щоб отримати кількість необхідної плитки.</p>
scripts:
  - /assets/js/tile.js
faq:
  - question: На який запас плитки орієнтуватись?
    answer: "Зазвичай радять брати 5-10% запасу на обрізки та брак."
---

<form id="tile-form" autocomplete="off">
  <label>
    Площа (м²):
    <input type="number" id="tile-area" min="0" step="any" required>
  </label>
  <label>
    Довжина плитки (см):
    <input type="number" id="tile-length" min="0" step="any" required>
  </label>
  <label>
    Ширина плитки (см):
    <input type="number" id="tile-width" min="0" step="any" required>
  </label>
  <label>
    Запас (%):
    <input type="number" id="tile-waste" min="0" value="10" step="any" required>
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="tile-result" class="result"></div>
