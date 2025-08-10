---
layout: calculator
title: "Калькулятор відновлення від джетлагу"
categories: [health]
seo:
  title: "Калькулятор відновлення від джетлагу — Адаптація до часових поясів онлайн"
  description: "Розрахуйте час адаптації до нового часового поясу та отримайте поради щодо швидкого відновлення від джетлагу. Планування сну та режиму для подорожей."
  keywords:
    - калькулятор джетлагу
    - відновлення від джетлагу
    - адаптація часовий пояс
    - різниця часу подорож
    - розрахунок джетлагу
    - поради джетлаг
    - режим сну подорож
    - часові пояси адаптація
    - джетлаг калькулятор онлайн
    - перельоти часові пояси
    - синдром зміни часового поясу
    - планування сну подорож
    - швидке відновлення джетлаг
    - мандрівки часові пояси
    - міжнародні подорожі сон
  content: |
    <h2>Калькулятор відновлення від джетлагу</h2>
    <p>Цей <strong>калькулятор джетлагу</strong> допоможе вам розрахувати <strong>час адаптації до нового часового поясу</strong> та отримати персональні поради для швидкого відновлення після перельоту.</p>

    <h3>Що таке джетлаг?</h3>
    <p><strong>Джетлаг (синдром зміни часового поясу)</strong> — це тимчасовий розлад біологічного годинника організму, який виникає при швидкому переміщенні через кілька часових поясів. Симптоми включають:</p>
    <ul>
      <li>Порушення сну та безсоння</li>
      <li>Втома та загальна слабкість</li>
      <li>Труднощі концентрації уваги</li>
      <li>Розлади травлення</li>
      <li>Зміни настрою та дратівливість</li>
      <li>Порушення апетиту</li>
    </ul>

    <h3>Як працює калькулятор джетлагу?</h3>
    <p>Калькулятор враховує кілька ключових факторів:</p>
    <ul>
      <li><strong>Напрямок подорожі:</strong> Подорож на схід зазвичай важча для адаптації</li>
      <li><strong>Кількість часових поясів:</strong> Більша різниця = більше часу на відновлення</li>
      <li><strong>Вік подорожнього:</strong> З віком адаптація стає повільнішою</li>
      <li><strong>Час вильоту:</strong> Нічні рейси впливають на циркадні ритми</li>
      <li><strong>Тривалість подорожі:</strong> Коротші поїздки можуть не потребувати повної адаптації</li>
    </ul>

    <h3>Поради для швидкого відновлення:</h3>
    <ul>
      <li>🌅 <strong>Світлотерапія:</strong> Використовуйте яскраве світло вранці в новому часовому поясі</li>
      <li>💊 <strong>Мелатонін:</strong> Приймайте за рекомендацією лікаря для регулювання сну</li>
      <li>💧 <strong>Гідрація:</strong> Пийте багато води, уникайте алкоголю</li>
      <li>🍽️ <strong>Харчування:</strong> Їжте за місцевим розкладом, уникайте важкої їжі</li>
      <li>🏃‍♀️ <strong>Фізична активність:</strong> Легкі вправи допоможуть адаптації</li>
      <li>😴 <strong>Режим сну:</strong> Лягайте спати за місцевим часом</li>
    </ul>
scripts:
  - /assets/js/jet-lag-recovery.js
faq:
  - question: Скільки часу потрібно для повного відновлення від джетлагу?
    answer: "Загальне правило: приблизно один день на кожен часовий пояс. Наприклад, різниця в 6 годин потребує близько 6 днів для повної адаптації. Подорожі на схід зазвичай важчі."
  - question: Чи впливає напрямок подорожі на джетлаг?
    answer: "Так! Подорожі на схід зазвичай спричинюють сильніший джетлаг, ніж на захід. Це тому, що легше пізніше лягати спати (захід), ніж раніше (схід)."
  - question: Чи можна запобігти джетлагу?
    answer: "Повністю уникнути неможливо, але можна зменшити: починайте змінювати режим за 3-4 дні до подорожі, уникайте алкоголю в літаку, пийте багато води."
  - question: Коли краще приймати мелатонін?
    answer: "Мелатонін краще приймати за 30-60 хвилин до сну за місцевим часом. Обов'язково проконсультуйтеся з лікарем перед використанням."
  - question: Чи допомагає кофеїн при джетлагу?
    answer: "Кофеїн може допомогти боротися з втомою, але уникайте його вечором. Краще використовувати ранком для підтримки денної активності."
  - question: Які перельоти найважчі для адаптації?
    answer: "Найважчі - довгі перельоти на схід через 6+ часових поясів, особливо нічні рейси. Перельоти з Європи до Азії або з Америки до Європи."
  - question: Чи потрібно адаптуватися для коротких поїздок?
    answer: "Для поїздок менше 3-4 днів краще залишатися на домашньому часі, якщо це можливо. Повна адаптація не встигне відбутися."
---

<form id="jetlag-form" autocomplete="off">
  <div class="form-group">
    <label>
      🌍 Ваш домашній часовий пояс:
      <select id="home-timezone" required>
        <option value="">Оберіть часовий пояс</option>
        <option value="UTC-12">UTC-12 (Міжнародна лінія дати)</option>
        <option value="UTC-11">UTC-11 (Самоа)</option>
        <option value="UTC-10">UTC-10 (Гаваї)</option>
        <option value="UTC-9">UTC-9 (Аляска)</option>
        <option value="UTC-8">UTC-8 (Тихоокеанський час США)</option>
        <option value="UTC-7">UTC-7 (Гірський час США)</option>
        <option value="UTC-6">UTC-6 (Центральний час США)</option>
        <option value="UTC-5">UTC-5 (Східний час США)</option>
        <option value="UTC-4">UTC-4 (Атлантичний час)</option>
        <option value="UTC-3">UTC-3 (Бразилія, Аргентина)</option>
        <option value="UTC-2">UTC-2 (Середньоатлантичний)</option>
        <option value="UTC-1">UTC-1 (Азорські острови)</option>
        <option value="UTC+0">UTC+0 (Лондон, Дублін)</option>
        <option value="UTC+1">UTC+1 (Берлін, Париж, Рим)</option>
        <option value="UTC+2" selected>UTC+2 (Київ, Гельсінкі, Каїр)</option>
        <option value="UTC+3">UTC+3 (Москва, Стамбул)</option>
        <option value="UTC+4">UTC+4 (Дубай, Баку)</option>
        <option value="UTC+5">UTC+5 (Пакистан, Узбекистан)</option>
        <option value="UTC+5:30">UTC+5:30 (Індія, Шрі-Ланка)</option>
        <option value="UTC+6">UTC+6 (Алмати, Бангладеш)</option>
        <option value="UTC+7">UTC+7 (Таїланд, В'єтнам)</option>
        <option value="UTC+8">UTC+8 (Китай, Сінгапур)</option>
        <option value="UTC+9">UTC+9 (Японія, Корея)</option>
        <option value="UTC+10">UTC+10 (Австралія схід)</option>
        <option value="UTC+11">UTC+11 (Соломонові острови)</option>
        <option value="UTC+12">UTC+12 (Нова Зеландія)</option>
      </select>
    </label>
  </div>

  <div class="form-group">
    <label>
      🎯 Часовий пояс пункту призначення:
      <select id="destination-timezone" required>
        <option value="">Оберіть часовий пояс</option>
        <option value="UTC-12">UTC-12 (Міжнародна лінія дати)</option>
        <option value="UTC-11">UTC-11 (Самоа)</option>
        <option value="UTC-10">UTC-10 (Гаваї)</option>
        <option value="UTC-9">UTC-9 (Аляска)</option>
        <option value="UTC-8">UTC-8 (Тихоокеанський час США)</option>
        <option value="UTC-7">UTC-7 (Гірський час США)</option>
        <option value="UTC-6">UTC-6 (Центральний час США)</option>
        <option value="UTC-5">UTC-5 (Східний час США)</option>
        <option value="UTC-4">UTC-4 (Атлантичний час)</option>
        <option value="UTC-3">UTC-3 (Бразилія, Аргентина)</option>
        <option value="UTC-2">UTC-2 (Середньоатлантичний)</option>
        <option value="UTC-1">UTC-1 (Азорські острови)</option>
        <option value="UTC+0">UTC+0 (Лондон, Дублін)</option>
        <option value="UTC+1">UTC+1 (Берлін, Париж, Рим)</option>
        <option value="UTC+2">UTC+2 (Київ, Гельсінкі, Каїр)</option>
        <option value="UTC+3">UTC+3 (Москва, Стамбул)</option>
        <option value="UTC+4">UTC+4 (Дубай, Баку)</option>
        <option value="UTC+5">UTC+5 (Пакистан, Узбекистан)</option>
        <option value="UTC+5:30">UTC+5:30 (Індія, Шрі-Ланка)</option>
        <option value="UTC+6">UTC+6 (Алмати, Бангладеш)</option>
        <option value="UTC+7">UTC+7 (Таїланд, В'єтнам)</option>
        <option value="UTC+8">UTC+8 (Китай, Сінгапур)</option>
        <option value="UTC+9">UTC+9 (Японія, Корея)</option>
        <option value="UTC+10">UTC+10 (Австралія схід)</option>
        <option value="UTC+11">UTC+11 (Соломонові острови)</option>
        <option value="UTC+12">UTC+12 (Нова Зеландія)</option>
      </select>
    </label>
  </div>

  <div class="form-group">
    <label>
      👤 Ваш вік:
      <input type="number" id="age" min="1" max="120" value="30" required>
    </label>
  </div>

  <div class="form-group">
    <label>
      ✈️ Час вильоту (за домашнім часом):
      <select id="departure-time" required>
        <option value="">Оберіть час</option>
        <option value="early-morning">Рано вранці (05:00-08:00)</option>
        <option value="morning">Вранці (08:00-12:00)</option>
        <option value="afternoon">Після обіду (12:00-17:00)</option>
        <option value="evening">Ввечері (17:00-22:00)</option>
        <option value="night">Вночі (22:00-05:00)</option>
      </select>
    </label>
  </div>

  <div class="form-group">
    <label>
      📅 Тривалість подорожі:
      <select id="trip-duration" required>
        <option value="">Оберіть тривалість</option>
        <option value="1-2">1-2 дні</option>
        <option value="3-4">3-4 дні</option>
        <option value="5-7">5-7 днів</option>
        <option value="8-14">1-2 тижні</option>
        <option value="15+">Більше 2 тижнів</option>
      </select>
    </label>
  </div>

  <button type="submit">🧮 Розрахувати план відновлення</button>
</form>

<div id="jetlag-result" class="result"></div>