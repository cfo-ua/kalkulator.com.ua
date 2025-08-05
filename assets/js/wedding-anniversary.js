document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("anniversary-form");
  const result = document.getElementById("anniversary-result");

  // Traditional anniversary names and gifts in Ukrainian
  const anniversaryData = {
    1: { name: "Ситцева", traditional: "Квіти, тканини, паперові листівки", modern: "Годинник, ювелірні прикраси", symbol: "💐" },
    2: { name: "Паперова", traditional: "Книги, фотоальбоми, листівки", modern: "Бавовняний текстиль, постільна білизна", symbol: "📚" },
    3: { name: "Шкіряна", traditional: "Шкіряні вироби, гаманці, сумки", modern: "Кришталь, скло", symbol: "👜" },
    4: { name: "Льняна", traditional: "Лляні речі, фрукти, квіти", modern: "Побутова техніка", symbol: "🌸" },
    5: { name: "Дерев'яна", traditional: "Дерев'яні меблі, посадка дерева", modern: "Срібло", symbol: "🌳" },
    6: { name: "Чугунна", traditional: "Чугунний посуд, інструменти", modern: "Дерево", symbol: "🍳" },
    7: { name: "Мідна", traditional: "Мідні вироби, пенні", modern: "Вовна", symbol: "🔶" },
    8: { name: "Бронзова", traditional: "Бронзові статуетки, посуд", modern: "Текстиль, постіль", symbol: "🥉" },
    9: { name: "Фаянсова", traditional: "Кераміка, гончарство", modern: "Шкіра", symbol: "🏺" },
    10: { name: "Рожева/Олов'яна", traditional: "Олов'яні вироби, троянди", modern: "Діаманти", symbol: "🌹" },
    11: { name: "Сталева", traditional: "Сталеві вироби, інструменти", modern: "Мода, аксесуари", symbol: "⚔️" },
    12: { name: "Нікелева", traditional: "Нікелеві прикраси", modern: "Перли", symbol: "🔘" },
    13: { name: "Мереживна", traditional: "Мереживо, текстиль", modern: "Хутро", symbol: "🕸️" },
    14: { name: "Агатова", traditional: "Агат, напівдорогоцінні камені", modern: "Золото", symbol: "💎" },
    15: { name: "Скляна", traditional: "Скляний посуд, кришталь", modern: "Годинники", symbol: "🥂" },
    20: { name: "Порцелянова", traditional: "Порцеляна, фарфор", modern: "Платина", symbol: "🏺" },
    25: { name: "Срібна", traditional: "Срібні прикраси, посуд", modern: "Срібло", symbol: "🥈" },
    30: { name: "Перлова", traditional: "Перли, перлинні прикраси", modern: "Діаманти", symbol: "⚪" },
    35: { name: "Полотняна", traditional: "Лляне полотно, текстиль", modern: "Нефрит", symbol: "🧵" },
    40: { name: "Рубінова", traditional: "Рубіни, червоні камені", modern: "Рубіни", symbol: "❤️" },
    45: { name: "Сапфірова", traditional: "Сапфіри, сині камені", modern: "Сапфіри", symbol: "💙" },
    50: { name: "Золота", traditional: "Золоті прикраси, монети", modern: "Золото", symbol: "🥇" },
    55: { name: "Смарагдова", traditional: "Смарагди, зелені камені", modern: "Смарагди", symbol: "💚" },
    60: { name: "Діамантова", traditional: "Діаманти, дорогоцінні камені", modern: "Діаманти", symbol: "💎" },
    65: { name: "Залізна", traditional: "Залізні вироби", modern: "Залізо", symbol: "⚫" },
    70: { name: "Благодатна", traditional: "Дорогоцінні подарунки", modern: "Платина", symbol: "✨" },
    75: { name: "Корончата", traditional: "Корони, діадеми", modern: "Діаманти", symbol: "👑" }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const weddingDateInput = document.getElementById("wedding-date").value;
    const targetDateInput = document.getElementById("target-date").value;

    if (!weddingDateInput) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Будь ласка, введіть дату весілля.</div>';
      return;
    }

    const weddingDate = new Date(weddingDateInput);
    const targetDate = targetDateInput ? new Date(targetDateInput) : new Date();

    if (weddingDate > targetDate) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Дата весілля не може бути в майбутньому.</div>';
      return;
    }

    // Calculate difference
    let years = targetDate.getFullYear() - weddingDate.getFullYear();
    let months = targetDate.getMonth() - weddingDate.getMonth();
    let days = targetDate.getDate() - weddingDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days
    const totalDays = Math.floor((targetDate - weddingDate) / (1000 * 60 * 60 * 24));

    // Get anniversary data
    const anniversaryInfo = anniversaryData[years] || { 
      name: "Особлива", 
      traditional: "Дорогоцінні подарунки за вашим вибором", 
      modern: "Сучасні подарунки", 
      symbol: "💝" 
    };

    // Find next milestone
    const milestones = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
    const nextMilestone = milestones.find(m => m > years);

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>${anniversaryInfo.symbol} Річниця</h6>
          <div class="big-number">${years} ${years === 1 ? 'рік' : years < 5 ? 'роки' : 'років'}</div>
          <p>${anniversaryInfo.name} річниця</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Разом</h6>
          <div class="big-number">${totalDays}</div>
          <p>${years}р ${months}м ${days}д</p>
        </div>
        
        ${nextMilestone ? `
        <div class="insight-card warning">
          <h6>🎯 Наступна віха</h6>
          <div class="big-number">${nextMilestone - years}</div>
          <p>років до ${nextMilestone}-річчя</p>
        </div>
        ` : ''}
      </div>
      
      <div style="margin-top: 2rem;">
        <h4>🎁 Традиційні подарунки для ${anniversaryInfo.name.toLowerCase()} річниці:</h4>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--accent); margin-bottom: 1rem;">
          <div style="display: grid; gap: 1rem;">
            <div><strong>🎨 Традиційні:</strong> ${anniversaryInfo.traditional}</div>
            <div><strong>✨ Сучасні:</strong> ${anniversaryInfo.modern}</div>
          </div>
        </div>
        
        ${years >= 25 ? `
        <div style="padding: 1rem; background: linear-gradient(135deg, #fff8e1 0%, #f5f5dc 100%); border-radius: 8px; margin-bottom: 1rem;">
          <h5>🌟 Особлива віха!</h5>
          <p>Ваша річниця заслуговує на особливе святкування. Розгляньте можливість:</p>
          <ul style="margin: 0.5rem 0;">
            <li>🎉 Урочистого банкету з родиною та друзями</li>
            <li>💒 Поновлення весільних обітниць</li>
            <li>✈️ Особливої подорожі</li>
            <li>📸 Професійної фотосесії</li>
          </ul>
        </div>
        ` : ''}
        
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #e8f8fc 0%, #f8fdff 100%); border-radius: 8px;">
          <h5>💡 Ідеї для святкування:</h5>
          <ul style="margin: 0.5rem 0;">
            <li>🍽️ Романтична вечеря в ресторані першого побачення</li>
            <li>📖 Створіть альбом спогадів про ваше життя разом</li>
            <li>🌍 Відвідайте місце медового місяця</li>
            <li>🎭 Відтворіть ваше перше побачення</li>
            <li>💌 Напишіть один одному листи любові</li>
            <li>🌹 Подаруйте стільки троянд, скільки років разом</li>
          </ul>
        </div>
      </div>
    `;
  });
});