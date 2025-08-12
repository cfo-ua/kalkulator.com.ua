---
layout: calculator
title: "Калькулятор наукового запису чисел"
categories: [school]
seo:
  title: "Калькулятор наукового запису чисел | Конвертер у наукову нотацію"
  description: "Перетворюйте числа між звичайним та науковим записом онлайн. Швидкий і точний конвертер наукової нотації для навчання та роботи."
  keywords:
    - науковий запис
    - наукова нотація
    - експоненціальний запис
    - конвертер чисел
    - математика
    - калькулятор
    - школа
    - степінь десяти
  content: |
    <h2>Калькулятор наукового запису чисел</h2>
    <p>Науковий запис (наукова нотація) — це спосіб запису дуже великих або дуже малих чисел у вигляді <strong>a × 10ⁿ</strong>, де 1 ≤ |a| < 10.</p>
    
    <h3>Що таке науковий запис?</h3>
    <p>Науковий запис дозволяє компактно записувати числа з багатьма нулями. Наприклад:</p>
    <ul>
      <li><strong>1,230,000</strong> = <strong>1.23 × 10⁶</strong></li>
      <li><strong>0.000456</strong> = <strong>4.56 × 10⁻⁴</strong></li>
    </ul>
    
    <h3>Як користуватися калькулятором?</h3>
    <p>Введіть число в будь-якому з полів, і калькулятор автоматично перетворить його в інший формат.</p>
scripts:
  - /assets/js/scientific-notation-converter.js
faq:
  - question: Як перетворити число у науковий запис?
    answer: "Перемістіть десяткову кому так, щоб залишилася одна цифра перед комою, а кількість переміщень стане степенем 10."
  - question: Що означає від'ємний степінь у науковому записі?
    answer: "Від'ємний степінь означає, що число менше за одиницю. Наприклад, 10⁻³ = 0.001."
  - question: Де використовується науковий запис?
    answer: "У фізиці, хімії, астрономії, інженерії для запису дуже великих (відстані у космосі) або дуже малих (розміри атомів) чисел."
  - question: Як читати науковий запис?
    answer: "1.5 × 10⁴ читається як 'одна і п'ять десятих помножити на десять у четвертому степені' і дорівнює 15,000."
---

<div class="calculator-inputs">
  <div class="input-group">
    <label for="standard-number">Звичайний запис:</label>
    <input type="text" id="standard-number" placeholder="Введіть число (наприклад, 1234567)" value="1234567">
  </div>
  
  <div class="input-group">
    <label for="mantissa">Мантиса (a):</label>
    <input type="number" id="mantissa" placeholder="1.234567" step="any" value="1.234567">
  </div>
  
  <div class="input-group">
    <label for="exponent">Степінь (n):</label>
    <input type="number" id="exponent" placeholder="6" value="6">
  </div>
</div>

<div class="convert-buttons">
  <button type="button" id="convert-to-scientific">→ Перетворити в науковий запис</button>
  <button type="button" id="convert-to-standard">← Перетворити в звичайний запис</button>
</div>

<div id="scientific-result" class="result"></div>