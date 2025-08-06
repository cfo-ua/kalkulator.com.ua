---
layout: calculator
title: "Калькулятор довірчого інтервалу"
categories: [school]
seo:
  title: "Калькулятор довірчого інтервалу онлайн — обчислити статистичну похибку"
  description: "Розрахуйте довірчий інтервал для середнього значення, пропорції та різниці. Визначте межі помилки та рівень довіри для статистичних оцінок."
  keywords:
    - довірчий інтервал
    - confidence interval
    - статистична похибка
    - рівень довіри
    - межа помилки
    - статистика
    - вибірка
    - середнє значення
    - пропорція
    - t-розподіл
  content: |
    <h2>Калькулятор довірчого інтервалу онлайн</h2>
    <p>📊 Довірчий інтервал показує діапазон значень, в якому з певною ймовірністю знаходиться істинне значення параметра популяції. Цей калькулятор допоможе розрахувати довірчі інтервали для різних статистичних параметрів.</p>

    <h3>🎯 Що таке довірчий інтервал?</h3>
    <p>Довірчий інтервал — це діапазон значень, який з певною ймовірністю (рівень довіри) містить істинне значення параметра популяції. Наприклад, 95% довірчий інтервал означає, що якби ми повторили дослідження 100 разів, то в 95 випадках істинне значення потрапило б в цей інтервал.</p>

    <h3>📈 Типи довірчих інтервалів:</h3>
    <ul>
      <li><strong>Для середнього (σ відома):</strong> Використовує z-розподіл</li>
      <li><strong>Для середнього (σ невідома):</strong> Використовує t-розподіл</li>
      <li><strong>Для пропорції:</strong> Біноміальний розподіл</li>
      <li><strong>Для різниці середніх:</strong> Порівняння двох груп</li>
    </ul>

    <h3>🔍 Рівні довіри:</h3>
    <ul>
      <li><strong>90%:</strong> α = 0.10, z = 1.645</li>
      <li><strong>95%:</strong> α = 0.05, z = 1.96 (найпоширеніший)</li>
      <li><strong>99%:</strong> α = 0.01, z = 2.576</li>
    </ul>

    <h3>💡 Застосування:</h3>
    <ul>
      <li>Опитування громадської думки</li>
      <li>Медичні дослідження</li>
      <li>Контроль якості</li>
      <li>Маркетингові дослідження</li>
      <li>Наукові експерименти</li>
    </ul>

    <p>🎓 Корисний інструмент для дослідників, аналітиків, студентів та всіх, хто працює зі статистичними оцінками.</p>
scripts:
  - /assets/js/confidence-interval-calculator.js
faq:
  - question: Як інтерпретувати 95% довірчий інтервал?
    answer: "95% довірчий інтервал означає, що якби ми повторили дослідження 100 разів з однаковими умовами, то в 95 випадках істинне значення параметра потрапило б в розрахований інтервал."
  - question: Чому ширший довірчий інтервал при вищому рівні довіри?
    answer: "Щоб бути більш впевненими, що інтервал містить істинне значення, потрібно розширити діапазон. Це компроміс між точністю та впевненістю."
  - question: Як зменшити ширину довірчого інтервалу?
    answer: "Збільшити розмір вибірки, зменшити варіабельність даних або знизити рівень довіри. Найефективніший спосіб - збільшити вибірку."
  - question: Коли використовувати t-розподіл замість z-розподілу?
    answer: "Використовуйте t-розподіл, коли стандартне відхилення популяції невідоме і розмір вибірки менший за 30, або коли дані мають нормальний розподіл."
  - question: Що робити, якщо дані не мають нормального розподілу?
    answer: "Для великих вибірок (n > 30) центральна гранична теорема дозволяє використовувати нормальний розподіл. Для малих вибірок потрібні інші методи."
  - question: Чи може довірчий інтервал включати неможливі значення?
    answer: "Так, математично розрахований інтервал може включати неможливі значення (наприклад, негативні пропорції). В таких випадках використовують логічні межі."
---
<form id="confidence-interval-form" autocomplete="off">
  <div class="form-group">
    <label>
      📊 Тип інтервалу:
      <select id="interval-type" required>
        <option value="mean-known">Середнє (σ відома)</option>
        <option value="mean-unknown">Середнє (σ невідома)</option>
        <option value="proportion">Пропорція</option>
        <option value="difference-means">Різниця середніх</option>
      </select>
    </label>
  </div>
  
  <div class="form-group">
    <label>
      🎯 Рівень довіри (%):
      <select id="confidence-level" required>
        <option value="90">90%</option>
        <option value="95" selected>95%</option>
        <option value="99">99%</option>
        <option value="custom">Інший рівень</option>
      </select>
    </label>
  </div>
  
  <div class="form-group" id="custom-confidence-group" style="display: none;">
    <label>
      🔢 Власний рівень довіри (%):
      <input type="number" id="custom-confidence" placeholder="95" step="0.1" min="50" max="99.9">
    </label>
  </div>
  
  <!-- For mean calculations -->
  <div class="mean-inputs">
    <div class="form-group">
      <label>
        📏 Середнє значення вибірки:
        <input type="number" id="sample-mean" placeholder="50" value="50" step="0.001" required>
      </label>
    </div>
    
    <div class="form-group">
      <label>
        📊 Розмір вибірки (n):
        <input type="number" id="sample-size" placeholder="30" value="30" step="1" min="1" required>
      </label>
    </div>
    
    <div class="form-group" id="known-std-group">
      <label>
        📐 Стандартне відхилення популяції (σ):
        <input type="number" id="population-std" placeholder="10" value="10" step="0.001" min="0">
      </label>
    </div>
    
    <div class="form-group" id="sample-std-group" style="display: none;">
      <label>
        📐 Стандартне відхилення вибірки (s):
        <input type="number" id="sample-std" placeholder="10" value="10" step="0.001" min="0">
      </label>
    </div>
  </div>
  
  <!-- For proportion calculations -->
  <div class="proportion-inputs" style="display: none;">
    <div class="form-group">
      <label>
        ✅ Кількість успіхів:
        <input type="number" id="successes" placeholder="15" value="15" step="1" min="0">
      </label>
    </div>
    
    <div class="form-group">
      <label>
        📊 Загальний розмір вибірки:
        <input type="number" id="total-size" placeholder="50" value="50" step="1" min="1">
      </label>
    </div>
  </div>
  
  <!-- For difference of means -->
  <div class="difference-inputs" style="display: none;">
    <div class="form-group">
      <label>
        📏 Середнє групи 1:
        <input type="number" id="mean1" placeholder="52" value="52" step="0.001">
      </label>
    </div>
    
    <div class="form-group">
      <label>
        📐 Стандартне відхилення групи 1:
        <input type="number" id="std1" placeholder="8" value="8" step="0.001" min="0">
      </label>
    </div>
    
    <div class="form-group">
      <label>
        👥 Розмір вибірки 1:
        <input type="number" id="size1" placeholder="25" value="25" step="1" min="1">
      </label>
    </div>
    
    <div class="form-group">
      <label>
        📏 Середнє групи 2:
        <input type="number" id="mean2" placeholder="48" value="48" step="0.001">
      </label>
    </div>
    
    <div class="form-group">
      <label>
        📐 Стандартне відхилення групи 2:
        <input type="number" id="std2" placeholder="9" value="9" step="0.001" min="0">
      </label>
    </div>
    
    <div class="form-group">
      <label>
        👥 Розмір вибірки 2:
        <input type="number" id="size2" placeholder="30" value="30" step="1" min="1">
      </label>
    </div>
  </div>
  
  <button type="submit">📈 Розрахувати довірчий інтервал</button>
</form>

<div id="confidence-interval-result" class="result"></div>