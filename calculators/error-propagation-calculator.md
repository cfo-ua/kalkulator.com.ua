---
layout: calculator
title: "Калькулятор поширення похибок"
categories: [school]
seo:
  title: "Калькулятор поширення похибок онлайн | Невизначеність вимірювань | Школа"
  description: "Обчислюйте поширення похибок у наукових вимірюваннях онлайн. Підтримка лінійних, квадратичних комбінацій, добутків, часток та складних функцій з автоматичним розрахунком невизначеності."
  keywords:
    - поширення похибок
    - невизначеність вимірювань
    - наукові розрахунки
    - статистика
    - похибка вимірювання
    - експериментальна фізика
    - лабораторна робота
    - школа
    - метрологія
  content: |
    <h2>Калькулятор поширення похибок</h2>
    <p>Розрахуйте невизначеність результату коли є похибки у вхідних даних. Калькулятор автоматично застосовує правила поширення похибок для різних математичних операцій.</p>
    
    <h3>Що таке поширення похибок?</h3>
    <p>Поширення похибок - це метод розрахунку невизначеності результату на основі невизначеностей вхідних величин. Це ключовий інструмент у наукових вимірюваннях та експериментах.</p>
    
    <h3>Підтримувані операції:</h3>
    <ul>
      <li><strong>Додавання/Віднімання:</strong> δ(A±B) = √(δA² + δB²)</li>
      <li><strong>Множення/Ділення:</strong> δ(A×B)/|A×B| = √((δA/A)² + (δB/B)²)</li>
      <li><strong>Степенева функція:</strong> δ(A^n)/|A^n| = |n| × δA/|A|</li>
      <li><strong>Квадратний корінь:</strong> δ(√A) = δA/(2√A)</li>
      <li><strong>Логарифм:</strong> δ(ln A) = δA/A</li>
      <li><strong>Експонента:</strong> δ(e^A) = |e^A| × δA</li>
    </ul>
    
    <h3>Застосування:</h3>
    <ul>
      <li>Фізичні експерименти</li>
      <li>Хімічний аналіз</li>
      <li>Інженерні розрахунки</li>
      <li>Наукові дослідження</li>
      <li>Лабораторні роботи</li>
    </ul>
scripts:
  - /assets/js/error-propagation-calculator.js
faq:
  - question: Що таке невизначеність вимірювання?
    answer: "Невизначеність - це параметр, який характеризує діапазон значень, в якому може знаходитися істинне значення вимірюваної величини."
  - question: Як правильно записувати результат з похибкою?
    answer: "Результат записується у форматі: значення ± похибка, наприклад: 9.81 ± 0.02 м/с². Похибка зазвичай округлюється до 1-2 значущих цифр."
  - question: Що таке відносна похибка?
    answer: "Відносна похибка - це відношення абсолютної похибки до значення величини, виражене у відсотках: (δA/A) × 100%."
  - question: Коли використовувати лінійне поширення похибок?
    answer: "Лінійне поширення використовується для складних функцій через часткові похідні. Для простих операцій є спеціальні формули."
---

<div class="calculator-tabs">
  <button class="tab-button active" data-tab="basic">Базові операції</button>
  <button class="tab-button" data-tab="functions">Функції</button>
  <button class="tab-button" data-tab="linear">Лінійна комбінація</button>
</div>

<form id="error-propagation-form" autocomplete="off">
  <div id="basic-operations" class="tab-content active">
    <h4>🔢 Базові арифметичні операції</h4>
    <div class="operation-group">
      <label>
        Операція:
        <select id="basic-operation" required>
          <option value="add">Додавання (A + B)</option>
          <option value="subtract">Віднімання (A - B)</option>
          <option value="multiply">Множення (A × B)</option>
          <option value="divide">Ділення (A ÷ B)</option>
          <option value="power">Степінь (A^n)</option>
        </select>
      </label>
    </div>
    
    <div class="input-row">
      <label>
        Значення A:
        <input type="number" id="value-a" step="any" value="10" required>
      </label>
      <label>
        Похибка δA:
        <input type="number" id="error-a" step="any" value="0.1" min="0" required>
      </label>
    </div>
    
    <div id="second-value-group">
      <div class="input-row">
        <label>
          Значення B:
          <input type="number" id="value-b" step="any" value="5">
        </label>
        <label>
          Похибка δB:
          <input type="number" id="error-b" step="any" value="0.05" min="0">
        </label>
      </div>
    </div>
    
    <div id="power-group" style="display: none;">
      <label>
        Степінь n:
        <input type="number" id="power-n" step="any" value="2">
      </label>
    </div>
  </div>
  
  <div id="function-operations" class="tab-content">
    <h4>📐 Математичні функції</h4>
    <div class="operation-group">
      <label>
        Функція:
        <select id="function-operation" required>
          <option value="sqrt">Квадратний корінь √A</option>
          <option value="ln">Натуральний логарифм ln(A)</option>
          <option value="log10">Десятковий логарифм log₁₀(A)</option>
          <option value="exp">Експонента e^A</option>
          <option value="sin">Синус sin(A)</option>
          <option value="cos">Косинус cos(A)</option>
          <option value="tan">Тангенс tan(A)</option>
        </select>
      </label>
    </div>
    
    <div class="input-row">
      <label>
        Значення A:
        <input type="number" id="func-value-a" step="any" value="4" required>
      </label>
      <label>
        Похибка δA:
        <input type="number" id="func-error-a" step="any" value="0.1" min="0" required>
      </label>
    </div>
  </div>
  
  <div id="linear-combination" class="tab-content">
    <h4>📊 Лінійна комбінація: z = c₁x₁ + c₂x₂ + c₃x₃</h4>
    <div id="linear-terms">
      <div class="linear-term">
        <div class="input-row">
          <label>
            Коефіцієнт c₁:
            <input type="number" id="coeff-1" step="any" value="1" required>
          </label>
          <label>
            Значення x₁:
            <input type="number" id="linear-value-1" step="any" value="10" required>
          </label>
          <label>
            Похибка δx₁:
            <input type="number" id="linear-error-1" step="any" value="0.1" min="0" required>
          </label>
        </div>
      </div>
      
      <div class="linear-term">
        <div class="input-row">
          <label>
            Коефіцієнт c₂:
            <input type="number" id="coeff-2" step="any" value="2">
          </label>
          <label>
            Значення x₂:
            <input type="number" id="linear-value-2" step="any" value="5">
          </label>
          <label>
            Похибка δx₂:
            <input type="number" id="linear-error-2" step="any" value="0.05" min="0">
          </label>
        </div>
      </div>
      
      <div class="linear-term">
        <div class="input-row">
          <label>
            Коефіцієнт c₃:
            <input type="number" id="coeff-3" step="any" value="0">
          </label>
          <label>
            Значення x₃:
            <input type="number" id="linear-value-3" step="any" value="0">
          </label>
          <label>
            Похибка δx₃:
            <input type="number" id="linear-error-3" step="any" value="0" min="0">
          </label>
        </div>
      </div>
    </div>
  </div>
  
  <button type="submit">Розрахувати похибку</button>
</form>

<div id="error-propagation-result" class="result"></div>