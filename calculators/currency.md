---
layout: calculator
title: "Калькулятор валют онлайн"
categories: [financial, conversion]
seo:
  title: "Онлайн конвертер валют — курс гривні, долара, євро"
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
  <label for="currency-amount">Сума</label>
  <input type="number" id="currency-amount" min="0" step="any" value="1000" required>

  <div style="display:flex;flex-direction:column;gap:0.4em;margin-bottom:1.2em;">
    <div style="position:relative;">
      <label for="currency-from" style="display:flex;align-items:center;gap:0.36em;">
        З <span aria-label="стрілка" style="font-size:1.35em;color:#3db7cc;line-height:1;vertical-align:middle;">➡️</span>
      </label>
      <select id="currency-from" required class="apple-select"></select>
    </div>
    <div style="position:relative;">
      <label for="currency-to" style="display:flex;align-items:center;gap:0.36em;">
        В <span aria-label="стрілка" style="font-size:1.25em;color:#23b378;line-height:1;vertical-align:middle;">⬅️</span>
      </label>
      <select id="currency-to" required class="apple-select"></select>
    </div>
  </div>

  <label for="currency-date">Дата курсу</label>
  <input type="date" id="currency-date">

  <button type="submit">Конвертувати</button>
</form>
<div id="currency-result" class="result" style="margin-top:1.4em;min-height:2.2em;"></div>

<!--CHART_SPLIT-->

<!-- Quick range buttons for chart -->
<div id="chart-range-quick" style="text-align:center;margin:1.3em auto 0.7em auto;max-width:900px;display:none;">
  <button type="button" data-range="30" class="chart-range-btn active">30 днів</button>
  <button type="button" data-range="90" class="chart-range-btn">3 місяці</button>
  <button type="button" data-range="180" class="chart-range-btn">6 місяців</button>
  <button type="button" data-range="365" class="chart-range-btn">1 рік</button>
  <button type="button" data-range="1825" class="chart-range-btn">5 років</button>
  <button type="button" data-range="-1" class="chart-range-btn">Весь час</button>
</div>

<!-- CHART: outside of calculator-block, fullscreen and mobile friendly -->
<div id="currency-chart-block" class="chart-card" style="margin:2.3em auto 0 auto; display:none;">
  <h3 style="margin-bottom:0.9em;text-align:center;">Графік зміни курсу</h3>
  <div class="chart-canvas-wrap">
    <canvas id="currency-chart"></canvas>
  </div>
</div>
