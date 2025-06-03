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
      <li>Джерело курсу — офіційні відкриті дані. Для банківських та готівкових операцій використовуйте курс свого банку.</li>
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
    answer: "Курси беруться з відкритих офіційних джерел. Ми не є банком і не здійснюємо фінансових операцій."
---

<form id="currency-form" autocomplete="off">
  <label>
    Сума
    <input type="number" id="currency-amount" min="0" step="any" value="1000" required>
  </label>
  <div style="display:flex; gap:1em; align-items:end;">
    <label>
      З
      <select id="currency-from" required></select>
    </label>
    <span style="font-size:1.4em; margin-bottom:0.3em;">→</span>
    <label>
      В
      <select id="currency-to" required></select>
    </label>
  </div>
  <label>
    Дата курсу
    <input type="date" id="currency-date" max="{{ 'now' | date: '%Y-%m-%d' }}">
  </label>
  <button type="submit">Конвертувати</button>
</form>
<div id="currency-result" class="result" style="margin-top:1.5em;"></div>

<div id="currency-chart-block" style="margin-top:2em; display:none;">
  <h3 style="margin-bottom:0.7em;">Графік зміни курсу</h3>
  <canvas id="currency-chart" width="100%" height="320"></canvas>
</div>
