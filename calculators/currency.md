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
    - CZK
    - SEK
    - CAD
    - AUD
    - JPY
    - гривня
    - Україна
  content: |
    <h2>Калькулятор валют онлайн</h2>
    <p>Швидко переведіть гривню, долар, євро, злотий, фунт, єну та інші популярні валюти онлайн. Калькулятор розраховує суму автоматично та показує графік зміни курсу за останній місяць.</p>
    <ul>
      <li>Оберіть валюту, суму та дату — калькулятор покаже результат і динаміку курсу.</li>
      <li>Підтримуються: USD, EUR, PLN, GBP, CHF, CAD, AUD, CZK, SEK, JPY.</li>
      <li><b>Офіційний курс надається Національним банком України (НБУ).</b></li>
      <li>Для банківських чи готівкових операцій використовуйте курс свого банку.</li>
    </ul>
    <p><small>Дані оновлюються щодня, графік показує курси за останній місяць.</small></p>
scripts:
  - /assets/js/currency.js
faq:
  - question: "Які валюти підтримує калькулятор?"
    answer: "Ви можете конвертувати гривню, долар США, євро, злотий, фунт стерлінгів, франк, долар Канади, Австралії, чеську та шведську крони, японську єну."
  - question: "Чому курс може відрізнятися від банківського чи готівкового?"
    answer: "Офіційний курс використовується для розрахунків у державних органах, але банки та обмінники можуть встановлювати свої курси."
  - question: "Чи можна побачити історію курсу?"
    answer: "Так, для основних валют доступний графік зміни курсу за останні 30 днів."
  - question: "Звідки беруться курси?"
    answer: "<b>Курси надає офіційно Національний банк України (НБУ).</b> Ми не є банком і не здійснюємо фінансових операцій."
---

<form id="currency-form" autocomplete="off" style="max-width:420px;margin:0 auto;display:flex;flex-direction:column;gap:1em;">
  <div style="display:flex;flex-direction:column;gap:0.4em;">
    <label for="currency-amount">Сума</label>
    <input type="number" id="currency-amount" min="0" step="any" value="1000" required style="width:100%;padding:0.7em 1em;font-size:1.14em;border-radius:9px;border:1.5px solid #e0e0e0;">
  </div>
  <div style="display:flex;gap:0.6em;align-items:end;">
    <div style="flex:1;">
      <label for="currency-from">З</label>
      <select id="currency-from" required style="width:100%;padding:0.6em 0.8em;border-radius:8px;font-size:1em;border:1.5px solid #e0e0e0;"></select>
    </div>
    <span style="font-size:1.5em;">→</span>
    <div style="flex:1;">
      <label for="currency-to">В</label>
      <select id="currency-to" required style="width:100%;padding:0.6em 0.8em;border-radius:8px;font-size:1em;border:1.5px solid #e0e0e0;"></select>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:0.3em;">
    <label for="currency-date">Дата курсу</label>
    <input type="date" id="currency-date" required style="padding:0.45em 0.7em;font-size:1em;border-radius:8px;border:1.5px solid #e0e0e0;">
  </div>
  <button type="submit" style="margin-top:0.4em;width:100%;padding:0.8em;font-size:1.11em;border-radius:10px;background:#157aff;color:#fff;font-weight:600;border:none;box-shadow:0 2px 8px 0 rgba(60,60,60,0.07);transition:background 0.15s;">Конвертувати</button>
</form>

<div id="currency-result" class="result" style="margin-top:1.1em;min-height:2.2em;"></div>

<div id="currency-chart-block" style="margin-top:2em; display:none; max-width:480px;margin-left:auto;margin-right:auto;">
  <h3 style="margin-bottom:0.7em;text-align:center;">Графік зміни курсу</h3>
  <canvas id="currency-chart" width="100%" height="320"></canvas>
</div>
