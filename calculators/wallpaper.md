---
layout: calculator
title: "Калькулятор шпалер"
categories: [construction]
seo:
  title: "Калькулятор шпалер | Будівельні калькулятори"
  description: "Дізнайтеся, скільки рулонів шпалер потрібно для обклеювання стін у кімнаті. Укажіть площу стін та розміри рулону — і калькулятор сам усе порахує."
  keywords:
    - шпалери
    - рулон шпалер
    - ремонт
    - кімната
    - будівництво
    - кількість рулонів
    - довжина шпалер
    - ширина шпалер
    - стіни
    - стеля
    - калькулятор
  content: |
    <h2>Калькулятор шпалер</h2>
    <p>Введіть загальну площу стін та параметри рулону — калькулятор визначить, скільки рулонів шпалер вам потрібно.</p>
scripts:
  - /assets/js/wallpaper.js
faq:
  - question: Як розрахувати кількість рулонів шпалер?
    answer: "Поділіть площу стін на площу одного рулону: рулони = площа стін / (довжина × ширина рулону)."
  - question: Який стандартний розмір рулону шпалер?
    answer: "Часто — 10 м довжини × 0.53 м ширини. Але краще перевіряти на упаковці."
  - question: Чи потрібно враховувати запас?
    answer: "Так, радимо додати 5–10% на підрізання та стики між смугами."
  - question: Можна приклад?
    answer: "Наприклад: площа стін = 30 м², рулон 10×0.53 м → площа рулону ≈ 5.3 м² → 30 / 5.3 ≈ 5.66 → потрібно 6 рулонів."
---

<form id="wallpaper-form" autocomplete="off">
  <label>
    Площа стін (м²):
    <input type="number" id="wallpaper-wall-area" min="0" step="any" required>
  </label>
  <label>
    Довжина рулону (м):
    <input type="number" id="wallpaper-roll-length" min="0" step="any" required>
  </label>
  <label>
    Ширина рулону (м):
    <input type="number" id="wallpaper-roll-width" min="0" step="any" required>
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="wallpaper-result" class="result"></div>
