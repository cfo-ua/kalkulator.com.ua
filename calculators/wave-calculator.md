---
layout: calculator
title: "Калькулятор хвиль - частота, довжина хвилі, швидкість"
categories: [school]
seo:
  title: "Калькулятор хвиль онлайн - частота, довжина хвилі, швидкість поширення | Фізика"
  description: "Розрахуйте параметри хвиль: частоту, довжину хвилі, швидкість поширення, період. Калькулятор для задач з хвильової фізики та акустики."
  keywords:
    - калькулятор хвиль
    - частота хвилі
    - довжина хвилі
    - швидкість хвилі
    - період коливань
    - хвильова фізика
    - звукові хвилі
    - електромагнітні хвилі
    - резонанс
    - акустика
  content: |
    <h2>🌊 Калькулятор хвильових явищ</h2>
    <p>Хвилі - це коливання, що поширюються у просторі та часі. Цей калькулятор допомагає розрахувати основні параметри різних типів хвиль.</p>
    
    <h3>📐 Основні формули:</h3>
    <ul>
      <li><strong>Швидкість хвилі:</strong> v = fλ = λ/T</li>
      <li><strong>Зв'язок частоти та періоду:</strong> f = 1/T</li>
      <li><strong>Довжина хвилі:</strong> λ = v/f = vT</li>
      <li><strong>Частота:</strong> f = v/λ = 1/T</li>
    </ul>
    
    <h3>🔊 Типи хвиль:</h3>
    <ul>
      <li><strong>Звукові хвилі:</strong> v ≈ 343 м/с (у повітрі при 20°C)</li>
      <li><strong>Світлові хвилі:</strong> c = 3×10⁸ м/с (у вакуумі)</li>
      <li><strong>Радіохвилі:</strong> v ≈ c (електромагнітні хвилі)</li>
      <li><strong>Хвилі на воді:</strong> залежить від глибини та інших факторів</li>
    </ul>
    
    <h3>🎯 Застосування:</h3>
    <ul>
      <li>Акустика та музичні інструменти</li>
      <li>Радіо та телекомунікації</li>
      <li>Медична діагностика (УЗД)</li>
      <li>Сейсмологія та геофізика</li>
      <li>Оптика та спектроскопія</li>
    </ul>
    
    <h3>🎵 Частотні діапазони:</h3>
    <ul>
      <li><strong>Інфразвук:</strong> < 20 Гц</li>
      <li><strong>Чутний звук:</strong> 20 Гц - 20 кГц</li>
      <li><strong>Ультразвук:</strong> > 20 кГц</li>
      <li><strong>Радіохвилі:</strong> 3 кГц - 300 ГГц</li>
    </ul>
scripts:
  - /assets/js/wave-calculator.js
faq:
  - question: Що таке довжина хвилі?
    answer: "Довжина хвилі (λ) - це відстань між двома сусідніми точками хвилі, що коливаються в однаковій фазі. Вимірюється в метрах."
  - question: Чим відрізняється частота від періоду?
    answer: "Частота (f) показує кількість коливань за секунду (Гц), а період (T) - час одного повного коливання (с). Вони обернено пропорційні: f = 1/T."
  - question: Від чого залежить швидкість звуку?
    answer: "Швидкість звуку залежить від середовища поширення, температури, тиску та вологості. У повітрі при 20°C вона становить близько 343 м/с."
  - question: Що таке резонанс?
    answer: "Резонанс виникає, коли частота зовнішньої сили збігається з власною частотою коливальної системи, що призводить до значного збільшення амплітуди коливань."
---

<form id="wave-form" autocomplete="off">
  <div class="input-grid">
    <label>
      Частота (f, Гц):
      <input type="number" id="frequency" step="0.01" placeholder="440">
    </label>
    <label>
      Довжина хвилі (λ, м):
      <input type="number" id="wavelength" step="0.001" placeholder="0.78">
    </label>
    <label>
      Швидкість (v, м/с):
      <input type="number" id="velocity" step="0.1" placeholder="343">
    </label>
    <label>
      Період (T, с):
      <input type="number" id="period" step="0.0001">
    </label>
  </div>
  
  <div style="margin: 1rem 0;">
    <label style="display: block; margin-bottom: 0.5rem;">Тип хвилі:</label>
    <label>
      <input type="radio" name="wave-type" value="sound" checked> Звукова хвиля (v = 343 м/с)
    </label>
    <label style="margin-left: 1rem;">
      <input type="radio" name="wave-type" value="light"> Світлова хвиля (c = 3×10⁸ м/с)
    </label>
    <label style="margin-left: 1rem;">
      <input type="radio" name="wave-type" value="custom"> Інша хвиля
    </label>
  </div>
  
  <button type="submit">🌊 Розрахувати параметри хвилі</button>
</form>

<div id="wave-result" class="result"></div>