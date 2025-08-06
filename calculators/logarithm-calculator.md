---
layout: calculator
title: "Калькулятор логарифмів"
categories: [school]
seo:
  title: "Калькулятор логарифмів онлайн — обчислити натуральний, десятковий логарифм"
  description: "Розрахуйте логарифми онлайн: натуральний (ln), десятковий (lg), з довільною основою. Калькулятор підтримує дійсні числа та показує покрокове рішення."
  keywords:
    - калькулятор логарифмів
    - логарифм онлайн
    - натуральний логарифм
    - десятковий логарифм
    - ln калькулятор
    - lg калькулятор
    - log calculator
    - математика
    - шкільна математика
    - алгебра
    - обчислити логарифм
    - логарифм з основою
  content: |
    <h2>Калькулятор логарифмів онлайн</h2>
    <p>Логарифм — це степінь, в яку потрібно піднести основу, щоб отримати дане число. Наш калькулятор дозволяє обчислювати різні типи логарифмів швидко та точно.</p>

    <h3>Типи логарифмів:</h3>
    <ul>
      <li><strong>Натуральний логарифм (ln):</strong> основа e ≈ 2.718</li>
      <li><strong>Десятковий логарифм (lg або log₁₀):</strong> основа 10</li>
      <li><strong>Двійковий логарифм (log₂):</strong> основа 2</li>
      <li><strong>Логарифм з довільною основою:</strong> будь-яке число > 0 і ≠ 1</li>
    </ul>

    <h3>Де використовуються логарифми:</h3>
    <ul>
      <li><strong>Математика:</strong> розв'язання рівнянь, нерівностей</li>
      <li><strong>Фізика:</strong> децибели, pH, магнітуда землетрусів</li>
      <li><strong>Економіка:</strong> складні відсотки, зростання</li>
      <li><strong>Інформатика:</strong> складність алгоритмів</li>
      <li><strong>Хімія:</strong> кислотність розчинів (pH)</li>
    </ul>

    <h3>Властивості логарифмів:</h3>
    <ul>
      <li>log<sub>a</sub>(xy) = log<sub>a</sub>(x) + log<sub>a</sub>(y)</li>
      <li>log<sub>a</sub>(x/y) = log<sub>a</sub>(x) - log<sub>a</sub>(y)</li>
      <li>log<sub>a</sub>(x<sup>n</sup>) = n × log<sub>a</sub>(x)</li>
      <li>log<sub>a</sub>(a) = 1</li>
      <li>log<sub>a</sub>(1) = 0</li>
    </ul>

    <p>Калькулятор корисний для студентів, учнів, інженерів та всіх, хто працює з експоненціальними функціями.</p>
scripts:
  - /assets/js/logarithm-calculator.js
faq:
  - question: Що таке натуральний логарифм?
    answer: "Натуральний логарифм (ln) — це логарифм з основою e ≈ 2.718281828. Він широко використовується в математиці та природничих науках."
  - question: Чим відрізняється lg від ln?
    answer: "lg (або log₁₀) — десятковий логарифм з основою 10, ln — натуральний логарифм з основою e. lg(100) = 2, ln(e) = 1."
  - question: Чи можна обчислити логарифм від'ємного числа?
    answer: "У дійсних числах логарифм від'ємного числа не визначений. Логарифм існує тільки для додатних чисел."
  - question: Що означає log₂(8) = 3?
    answer: "Це означає, що 2³ = 8. Логарифм показує, в яку степінь треба піднести основу (2), щоб отримати число (8)."
  - question: Як перевести логарифм з однієї основи в іншу?
    answer: "Використовуйте формулу зміни основи: log<sub>a</sub>(x) = ln(x) / ln(a) або log<sub>a</sub>(x) = log₁₀(x) / log₁₀(a)."
  - question: Для чого потрібен логарифм у реальному житті?
    answer: "Логарифми використовуються для вимірювання гучності звуку (децибели), кислотності (pH), магнітуди землетрусів, у фінансових розрахунках та IT."
---
<form id="logarithm-form" autocomplete="off">
  <div class="input-group">
    <label>
      Тип логарифму:
      <select id="log-type" required>
        <option value="natural">Натуральний (ln)</option>
        <option value="decimal">Десятковий (lg)</option>
        <option value="binary">Двійковий (log₂)</option>
        <option value="custom">З довільною основою</option>
      </select>
    </label>
  </div>

  <div id="base-group" class="input-group" style="display: none;">
    <label>
      Основа логарифму:
      <input type="number" id="log-base" placeholder="Наприклад: 5" min="0.001" step="any">
    </label>
  </div>

  <div class="input-group">
    <label>
      Число (аргумент):
      <input type="number" id="log-number" placeholder="Наприклад: 100" min="0.001" step="any" required>
    </label>
  </div>

  <button type="submit">Обчислити логарифм</button>
</form>

<div id="logarithm-result" class="result"></div>