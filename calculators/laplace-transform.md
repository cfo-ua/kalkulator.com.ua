---
layout: calculator
title: "Калькулятор перетворення Лапласа"
categories: [school]
seo:
  title: "Калькулятор перетворення Лапласа | Математичні калькулятори"
  description: "Обчисліть перетворення Лапласа основних функцій онлайн. Знайдіть образи елементарних функцій за таблицею перетворень Лапласа."
  keywords:
    - перетворення Лапласа
    - образ функції
    - математичний аналіз
    - диференціальні рівняння
    - калькулятор Лапласа
    - операційне числення
    - вищая математика
    - інженерна математика
  content: |
    <h2>Калькулятор перетворення Лапласа 📊</h2>
    <p>Знайдіть <strong>перетворення Лапласа</strong> для основних елементарних функцій. Калькулятор використовує стандартну таблицю образів для швидкого обчислення.</p>
    
    <h3>🔍 Що таке перетворення Лапласа?</h3>
    <p>Перетворення Лапласа — це інтегральне перетворення, яке переводить функцію часу f(t) в функцію комплексної змінної F(s). Широко використовується для розв'язування диференціальних рівнянь та аналізу систем.</p>
    
    <h3>📐 Основна формула</h3>
    <p><strong>L{f(t)} = F(s) = ∫[0→∞] f(t)·e^(-st) dt</strong></p>
    
    <h3>⚡ Підтримувані функції:</h3>
    <ul>
      <li><strong>Константа:</strong> L{c} = c/s</li>
      <li><strong>Степенева:</strong> L{t^n} = n!/s^(n+1)</li>
      <li><strong>Експоненційна:</strong> L{e^(at)} = 1/(s-a)</li>
      <li><strong>Синус:</strong> L{sin(at)} = a/(s²+a²)</li>
      <li><strong>Косинус:</strong> L{cos(at)} = s/(s²+a²)</li>
      <li><strong>Гіперболічні функції</strong></li>
    </ul>
scripts:
  - /assets/js/laplace-transform.js
faq:
  - question: Що таке перетворення Лапласа?
    answer: "Це інтегральне перетворення, яке переводить функцію часу в функцію комплексної змінної s. Використовується для спрощення розв'язування диференціальних рівнянь."
  - question: Для чого потрібне перетворення Лапласа?
    answer: "Головне застосування — розв'язування лінійних диференціальних рівнянь, аналіз електричних кіл, систем автоматичного керування та обробка сигналів."
  - question: Як знайти оригінал за образом?
    answer: "Використовується зворотне перетворення Лапласа або таблиці відповідностей образів та оригіналів."
  - question: Що означає параметр s?
    answer: "s — це комплексна змінна s = σ + jω, де σ — дійсна частина, ω — уявна частина (частота)."
---

<div class="form-section">
  <label for="function-type">🎯 Оберіть тип функції:</label>
  <select id="function-type">
    <option value="constant">Константа: c</option>
    <option value="power">Степенева: t^n</option>
    <option value="exponential">Експоненційна: e^(at)</option>
    <option value="sin">Синус: sin(at)</option>
    <option value="cos">Косинус: cos(at)</option>
    <option value="sinh">Гіперболічний синус: sinh(at)</option>
    <option value="cosh">Гіперболічний косинус: cosh(at)</option>
    <option value="t_exp">t·e^(at)</option>
    <option value="t_sin">t·sin(at)</option>
    <option value="t_cos">t·cos(at)</option>
  </select>
</div>

<form id="laplace-form" autocomplete="off">
  <div id="parameter-inputs">
    <label>
      📊 Параметр:
      <input type="number" id="param-a" value="1" step="0.1" required>
    </label>
  </div>
  <button type="submit">🔄 Обчислити перетворення</button>
</form>

<div id="laplace-result" class="result"></div>