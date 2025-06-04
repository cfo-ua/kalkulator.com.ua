---
layout: calculator
title: "Калькулятор валют онлайн"
categories: [financial, conversion]
seo:
  title: "Калькулятор валют онлайн — Конвертер, графік курсу, актуальні розрахунки | kalkulator.com.ua"
  description: "Калькулятор валют для України: швидка конвертація гривні, долара, євро, злотого, фунта та інших валют. Оперативний розрахунок, історія і графік курсу, офіційні джерела."
  keywords:
    - калькулятор валют
    - конвертер валют
    - курс валют
    - обмін валют онлайн
    - USD
    - EUR
    - PLN
    - GBP
    - CHF
    - CAD
    - JPY
    - CNY
    - TRY
    - гривня
    - Україна
  content: |
    <h2>Калькулятор валют онлайн</h2>
    <p>Швидко переведіть гривню, долар, євро, злотий, фунт, єну, юань, франк, лиру, канадський долар онлайн. Калькулятор розраховує суму автоматично та показує графік зміни курсу.</p>
    <ul>
      <li>Оберіть валюту, суму та дату — калькулятор покаже результат і динаміку курсу.</li>
      <li>Підтримуються: злотий (PLN), євро (EUR), долар США (USD), юань (CNY), турецька ліра (TRY), швейцарський франк (CHF), фунт (GBP), канадський долар (CAD), єна (JPY).</li>
      <li><b>Офіційний курс надається Національним банком України (НБУ).</b></li>
      <li>Для банківських чи готівкових операцій використовуйте курс свого банку.</li>
    </ul>
    <p><small>Дані оновлюються щодня, графік показує курси за обраний період.</small></p>
scripts:
  - /assets/js/currency.js
faq:
  - question: "Скільки коштує долар зараз? Який курс долара на сьогодні?"
    answer: |
      Офіційний курс долара до гривні встановлює Національний банк України (НБУ) щодня та оновлюється о 00:00. Актуальний курс ви бачите вище у калькуляторі — просто виберіть «долар США» та вкажіть потрібну дату. Для готівкових операцій курс може відрізнятися в обмінниках чи банках.
  - question: "По чому долар? По скільки долар сьогодні?"
    answer: |
      Вартість долара залежить від офіційного курсу НБУ та ринкових умов. Калькулятор автоматично показує поточний курс. Для обміну валют рекомендуємо перевіряти курси у своєму банку або обміннику.
  - question: "Курс євро на сьогодні? Євро в гривні?"
    answer: |
      Курс євро до гривні вказано у калькуляторі згідно з офіційними даними НБУ. Виберіть «євро» — і ви побачите актуальний курс, а також динаміку за останній місяць чи інший період.
  - question: "Як перевести євро або долар у гривні?"
    answer: |
      Введіть суму, оберіть валюту «долар США» або «євро», та дивіться результат у гривнях. Калькулятор враховує офіційний курс на обрану дату.
  - question: "Чому гривня падає або зміцнюється?"
    answer: |
      Курс гривні залежить від багатьох факторів: економічна ситуація, інфляція, дії НБУ, попит і пропозиція на валюту, міжнародні події. Зміни курсу — це відображення балансу на валютному ринку.
  - question: "Чому росте євро чи долар?"
    answer: |
      Зростання курсу євро або долара може бути зумовлене змінами на світових ринках, попитом на валюту в Україні, макроекономічними даними, політичними подіями чи рішеннями центральних банків.
  - question: "Чому долар називають баксом?"
    answer: |
      Слово «бакс» походить від англійського "buck" — первісно це була одиниця виміру (шкура оленя) в американській торгівлі. Згодом слово стало популярним сленговим позначенням долара.
  - question: "Які валюти підтримує калькулятор?"
    answer: |
      Ви можете конвертувати гривню (UAH), польський злотий (PLN), євро (EUR), долар США (USD), китайський юань (CNY), турецьку ліру (TRY), швейцарський франк (CHF), британський фунт (GBP), канадський долар (CAD), японську єну (JPY).
  - question: "Чому курс може відрізнятися від банківського чи готівкового?"
    answer: |
      Офіційний курс НБУ використовується для розрахунків у державних органах, контрактних операціях та бухгалтерії. Банки та обмінники можуть встановлювати свої курси з урахуванням попиту, пропозиції та комісій.
  - question: "Чи можна побачити історію курсу валют?"
    answer: |
      Так, для основних валют доступний графік зміни курсу за будь-який період з 2000 року. Просто виберіть валюту та діапазон дат.
  - question: "Звідки беруться курси валют?"
    answer: |
      Дані отримуються напряму з офіційного API Національного банку України (bank.gov.ua). Курси оновлюються автоматично.
---

<!-- Calculator UI: vertical selects, compact layout -->
<form id="currency-form" autocomplete="off" style="max-width:440px;margin:0 auto;">
  <label for="currency-amount" style="display:block;margin-bottom:0.5em;">Сума</label>
  <input type="number" id="currency-amount" min="0" step="any" value="1000" required style="width:100%;padding:0.7em 1em;font-size:1.18em;border-radius:9px;border:1.5px solid #e0e0e0;margin-bottom:1.1em;">

  <div style="display:flex;flex-direction:column;gap:0.4em;margin-bottom:1.2em;">
    <div>
      <label for="currency-from" style="display:block;margin-bottom:0.25em;">З</label>
      <select id="currency-from" required style="width:100%;padding:0.6em 0.8em;border-radius:8px;font-size:1em;border:1.5px solid #e0e0e0;"></select>
    </div>
    <div>
      <label for="currency-to" style="display:block;margin-bottom:0.25em;">В</label>
      <select id="currency-to" required style="width:100%;padding:0.6em 0.8em;border-radius:8px;font-size:1em;border:1.5px solid #e0e0e0;"></select>
    </div>
  </div>

  <label for="currency-date" style="display:block;margin-bottom:0.4em;">Дата курсу</label>
  <input type="date" id="currency-date" style="padding:0.45em 0.7em;font-size:1em;border-radius:8px;border:1.5px solid #e0e0e0;margin-bottom:1.2em;width:100%;">

  <button type="submit" style="margin-top:0.6em;width:100%;padding:0.8em;font-size:1.11em;border-radius:10px;background:#157aff;color:#fff;font-weight:600;border:none;box-shadow:0 2px 8px 0 rgba(60,60,60,0.07);">Конвертувати</button>
</form>
<div id="currency-result" class="result" style="margin-top:1.4em;min-height:2.2em;"></div>

<!--CHART_SPLIT-->

<!-- Quick range buttons for chart -->
<div id="chart-range-quick" style="text-align:center;margin:1.3em auto 0.7em auto;max-width:900px;display:none;">
  <button type="button" data-range="30" class="chart-range-btn active">30 днів</button>
  <button type="button" data-range="90" class="chart-range-btn">3 місяці</button>
  <button type="button" data-range="180" class="chart-range-btn">6 місяців</button>
  <button type="button" data-range="365" class="chart-range-btn">1 рік</button>
  <button type="button" data-range="-1" class="chart-range-btn">Весь час</button>
</div>

<!-- CHART: outside of calculator-block, fullscreen and mobile friendly -->
<div id="currency-chart-block" class="chart-card" style="margin:2.3em auto 0 auto; display:none;">
  <h3 style="margin-bottom:0.9em;text-align:center;">Графік зміни курсу</h3>
  <div class="chart-canvas-wrap">
    <canvas id="currency-chart"></canvas>
  </div>
</div>
