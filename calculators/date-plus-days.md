---
layout: calculator
title: "Калькулятор дати за кількістю днів"
categories: [time-date]
seo:
  title: "Скільки днів до... | Калькулятор дати онлайн — обчислити дату події"
  description: "Скільки днів до літа, Нового року, 1 вересня, зими чи іншої події? Обчисліть дату за кількістю днів або дізнайтесь, скільки днів залишилось до важливої дати. Зручно для релігійних дат, відпусток, іменин і роковин."
  keywords:
    - скільки днів
    - скільки днів до літа
    - скільки днів до нового року
    - скільки днів до 1 вересня
    - скільки днів до зими
    - скільки днів залишилося
    - калькулятор дати
    - обчислити дату через дні
    - скільки днів пройшло
    - через скільки днів
    - дата після 40 днів
    - скільки днів до 1 грудня
    - скільки днів до Миколая
    - через скільки днів буде літо
    - яка дата буде через 100 днів
    - скільки днів триває...
    - коли буде свято через скільки днів
  content: |
    <h2>Калькулятор дати за кількістю днів</h2>
    <p>Хочете дізнатися, <strong>скільки днів залишилось до літа, Нового року, 1 вересня або іншої події</strong>? Цей онлайн-калькулятор дозволяє обчислити дату події на основі кількості днів від заданої дати. Ідеально підходить для підрахунку <em>сорока днів</em>, <em>іменин</em>, <em>відпустки</em> або <em>важливих релігійних дат</em>.</p>
    <p>Ви можете дізнатися:</p>
    <ul>
      <li><strong>Скільки днів до літа</strong>, Нового року, зими, Пасхи, 1 вересня чи інших важливих дат</li>
      <li><strong>Скільки днів пройшло</strong> з певної дати</li>
      <li>Коли буде дата через 40, 100 чи будь-яку кількість днів</li>
      <li>Через скільки днів почнуться або закінчаться місячні, відпустка, канікули тощо</li>
      <li><strong>Скільки днів у місяці або в році</strong> (включно з високосним роком)</li>
    </ul>
scripts:
  - /assets/js/date-plus-days.js
faq:
  - question: Як обчислити 40 днів після смерті?
    answer: "Введіть дату смерті як початкову, а в полі кількість днів — 40. Калькулятор покаже дату сорокового дня, яка важлива для релігійних обрядів."
  - question: Чи можна обчислити дату в минулому?
    answer: "Так, введіть відʼємне значення в полі кількість днів (наприклад, -10), і калькулятор покаже дату у минулому."
  - question: Який формат дати використовується?
    answer: "Дата вводиться у форматі РРРР-ММ-ДД (наприклад, 2025-06-15)."
  - question: Для чого використовується цей калькулятор?
    answer: "Цей калькулятор зручний для обчислення річниць, сороковин, завершення відпустки, дедлайнів, або будь-якої дати після або до події."
  - question: Як дізнатися, скільки днів залишилося до літа, зими чи Нового року?
    answer: "Введіть сьогоднішню дату та вкажіть кількість днів до відповідної події або використайте калькулятор, щоб побачити результат автоматично."
---

<form id="date-shift-form" autocomplete="off">
  <label>
    Початкова дата:
    <input type="date" id="base-date" required>
  </label>
  <label>
    Кількість днів (може бути відʼємним):
    <input type="number" id="day-offset" step="1" value="40" required>
  </label>
  <button type="submit">Обчислити дату</button>
</form>
<div id="date-shift-result" class="result"></div>
