---
layout: calculator
title: "Калькулятор кількості плитки"
categories: [construction]
seo:
  title: "Калькулятор плитки | Будівельні калькулятори"
  description: "Розрахуйте, скільки плитки потрібно для підлоги чи стін з урахуванням площі, розміру плитки та запасу на обрізки чи брак."
  keywords:
    - плитка
    - калькулятор плитки
    - плитка на підлогу
    - плитка на стіну
    - ремонт
    - будівництво
    - розрахунок плитки
    - скільки плитки потрібно
  content: |
    <h2>Калькулятор кількості плитки</h2>
    <p>Вкажіть параметри площі та плитки, а також бажаний запас, щоб отримати кількість необхідної плитки.</p>
scripts:
  - /assets/js/tile.js
faq:
  - question: На який запас плитки орієнтуватись?
    answer: "Зазвичай радять брати 5-10% запасу на обрізки та брак."
  - question: Як розраховується кількість плитки?
    answer: "Загальна площа ділиться на площу однієї плитки, після чого додається відсоток запасу."
  - question: Чи враховує калькулятор міжплиткові шви?
    answer: "Ні, міжплиткові шви не враховуються. Для точності радимо додавати ще 1-2% вручну."
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
