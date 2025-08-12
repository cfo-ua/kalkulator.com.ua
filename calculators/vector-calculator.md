---
layout: calculator
title: "Калькулятор векторів"
categories: [school]
seo:
  title: "Калькулятор векторів | Додавання, віднімання, скалярний та векторний добуток"
  description: "Виконуйте операції з векторами онлайн: додавання, віднімання, скалярний добуток, векторний добуток, довжина вектора та одиничний вектор."
  keywords:
    - вектори
    - векторні операції
    - скалярний добуток
    - векторний добуток
    - довжина вектора
    - одиничний вектор
    - математика
    - геометрія
    - калькулятор
    - школа
  content: |
    <h2>Калькулятор векторів</h2>
    <p>Виконуйте всі основні операції з векторами: додавання, віднімання, скалярний та векторний добуток, обчислення довжини та одиничного вектора.</p>
    
    <h3>Основні векторні операції:</h3>
    <ul>
      <li><strong>Додавання векторів:</strong> (a₁, a₂, a₃) + (b₁, b₂, b₃) = (a₁+b₁, a₂+b₂, a₃+b₃)</li>
      <li><strong>Віднімання векторів:</strong> (a₁, a₂, a₃) - (b₁, b₂, b₃) = (a₁-b₁, a₂-b₂, a₃-b₃)</li>
      <li><strong>Скалярний добуток:</strong> a⃗ · b⃗ = a₁b₁ + a₂b₂ + a₃b₃</li>
      <li><strong>Векторний добуток:</strong> a⃗ × b⃗ = (a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁)</li>
      <li><strong>Довжина вектора:</strong> |a⃗| = √(a₁² + a₂² + a₃²)</li>
    </ul>
    
    <h3>Як користуватися?</h3>
    <p>Введіть координати векторів A та B, оберіть операцію і отримайте результат з детальними обчисленнями.</p>
scripts:
  - /assets/js/vector-calculator.js
faq:
  - question: Що таке скалярний добуток векторів?
    answer: "Скалярний добуток — це число, яке дорівнює сумі добутків відповідних координат векторів. Він показує, наскільки вектори 'співспрямовані'."
  - question: Чим відрізняється векторний добуток від скалярного?
    answer: "Скалярний добуток дає число, а векторний — новий вектор, перпендикулярний до обох початкових векторів."
  - question: Як знайти одиничний вектор?
    answer: "Одиничний вектор отримують діленням вектора на його довжину: û = a⃗/|a⃗|. Він має ту ж саму напрямок, але довжину 1."
  - question: Що означає довжина вектора?
    answer: "Довжина (модуль) вектора — це відстань від початку координат до кінця вектора, обчислюється за теоремою Піфагора."
---

<div class="calculator-inputs">
  <div class="vector-inputs">
    <div class="vector-group">
      <h4>🎯 Вектор A</h4>
      <div class="vector-coords">
        <label>x: <input type="number" id="vector-a-x" value="1" step="any"></label>
        <label>y: <input type="number" id="vector-a-y" value="2" step="any"></label>
        <label>z: <input type="number" id="vector-a-z" value="3" step="any"></label>
      </div>
    </div>
    
    <div class="vector-group">
      <h4>🎯 Вектор B</h4>
      <div class="vector-coords">
        <label>x: <input type="number" id="vector-b-x" value="4" step="any"></label>
        <label>y: <input type="number" id="vector-b-y" value="5" step="any"></label>
        <label>z: <input type="number" id="vector-b-z" value="6" step="any"></label>
      </div>
    </div>
  </div>
</div>

<div class="operation-buttons">
  <button type="button" id="vector-add">➕ A + B</button>
  <button type="button" id="vector-subtract">➖ A - B</button>
  <button type="button" id="vector-dot-product">⚫ A · B (скалярний)</button>
  <button type="button" id="vector-cross-product">❌ A × B (векторний)</button>
  <button type="button" id="vector-magnitude">📏 |A|, |B| (довжина)</button>
  <button type="button" id="vector-unit">🎯 Одиничні вектори</button>
</div>

<div id="vector-result" class="result"></div>