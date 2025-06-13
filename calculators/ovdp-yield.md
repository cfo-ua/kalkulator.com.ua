---
layout: calculator
title: "Калькулятор прибутковості ОВДП"
categories: [financial]
seo:
  title: "ОВДП калькулятор: розрахунок прибутковості та річної дохідності | kalkulator.com.ua"
  description: "Розрахуйте загальний прибуток та річну дохідність від інвестицій в ОВДП. Враховується ціна купівлі, купони, дата погашення."
  keywords: ["ОВДП", "калькулятор ОВДП", "дохідність ОВДП", "державні облігації", "прибуток ОВДП", "інвестиції", "фінанси", "облігації"]
scripts:
  - /assets/js/ovdp-yield.js
faq:
  - question: "Що таке ОВДП?"
    answer: "ОВДП — облігації внутрішньої державної позики, які випускає уряд України для залучення коштів."
  - question: "Які параметри враховуються в розрахунку?"
    answer: "Ціна купівлі, купонні виплати, дата погашення та поточна дата."
  - question: "Чи оподатковується прибуток з ОВДП?"
    answer: "Ні, прибуток з ОВДП не оподатковується для фізичних осіб. Це вигідна інвестиція з гарантованим доходом від держави."
  - question: "Чому варто інвестувати в ОВДП?"
    answer: "Інвестуючи в ОВДП, ви не лише отримуєте дохід, але й підтримуєте економіку та Збройні Сили України."
---

<form id="ovdp-form" autocomplete="off">
  <label>Поточна ціна ОВДП (грн):
    <input type="number" id="price" min="0" step="0.01" required>
  </label>
  <label>Дата наступної виплати:
    <input type="date" id="nextDate" required>
  </label>
  <label>Сума наступного купону (грн):
    <input type="number" id="nextCoupon" min="0" step="0.01" required>
  </label>
  <label>Дата погашення:
    <input type="date" id="finalDate" required>
  </label>
  <label>Сума фінальної виплати (тіло + купон):
    <input type="number" id="finalAmount" min="0" step="0.01" required>
  </label>
  <button type="submit">Розрахувати</button>
</form>

<div id="ovdp-result" class="result"></div>
