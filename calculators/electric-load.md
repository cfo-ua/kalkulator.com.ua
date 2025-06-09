---
layout: calculator
title: "Калькулятор електричної потужності"
categories: [construction]
seo:
  title: "Калькулятор електричної потужності | Будівельні калькулятори"
  description: "Розрахуйте сумарну електричну потужність для квартири або будинку."
  keywords:
    - електрика
    - потужність
    - електроприлади
    - будівництво
    - калькулятор
  content: |
    <h2>Калькулятор електричної потужності</h2>
    <p>Вкажіть назву і потужність кожного приладу. Натисніть «Додати прилад» для ще одного рядка. Кнопка «–» видаляє відповідний рядок.</p>
    <p><strong>Коефіцієнт одночасності</strong> (0.7–1) — це частка приладів, які можуть працювати одночасно. Для квартири зазвичай беруть 0.7–0.8, для офісу чи виробництва — ближче до 1. Якщо плануєте вмикати всі прилади разом — ставте 1.</p>
scripts:
  - /assets/js/electric-load.js
faq:
  - question: Як визначити потрібну потужність для дому?
    answer: "Підсумуйте потужність усіх пристроїв, врахуйте коефіцієнт одночасності (0.7–0.8)."
---

<style>
.electric-load-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 14px;
}
.electric-load-row input[type="text"], .electric-load-row input[type="number"] {
  flex: 1 1 0;
}
.remove-appliance {
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  font-size: 1.1em;
  color: #fff;
  background: #157aff;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  line-height: 1;
}
.remove-appliance:hover {
  background: #005bd1;
}
</style>

<form id="electric-load-form" autocomplete="off">
  <div id="electric-load-list">
    <div class="electric-load-row">
      <input type="text" class="electric-appliance" placeholder="Назва приладу" />
      <input type="number" class="electric-power" min="0" step="any" placeholder="Потужність, Вт" />
    </div>
  </div>
  <button type="button" id="add-appliance">Додати прилад</button>
  <label>
    Коефіцієнт одночасності (0.7–1):
    <input type="number" id="electric-simultaneous" min="0.5" max="1" step="0.01" value="0.8" required>
  </label>
  <button type="submit">Розрахувати</button>
</form>
<div id="electric-load-result" class="result"></div>
