document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('pregnancy-form');
  const result = document.getElementById('pregnancy-result');
  const lmpSection = document.getElementById('lmp-section');
  const conceptionSection = document.getElementById('conception-section');
  const methodRadios = form['calculation-method'];

  // Handle method selection
  methodRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'lmp') {
        lmpSection.style.display = 'block';
        conceptionSection.style.display = 'none';
      } else {
        lmpSection.style.display = 'none';
        conceptionSection.style.display = 'block';
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const method = form['calculation-method'].value;
    const cycleLength = parseInt(form['cycle-length'].value);
    let baseDate;
    let dueDate;

    if (method === 'lmp') {
      const lmpValue = form['lmp-date'].value;
      if (!lmpValue) {
        result.innerHTML = '<p style="color:red;">Будь ласка, введіть дату вашої останньої менструації.</p>';
        return;
      }
      baseDate = new Date(lmpValue);
      
      // Adjust for cycle length if different from 28 days
      const cycleDifference = cycleLength - 28;
      dueDate = new Date(baseDate);
      dueDate.setDate(dueDate.getDate() + 280 + cycleDifference);
    } else {
      const conceptionValue = form['conception-date'].value;
      if (!conceptionValue) {
        result.innerHTML = '<p style="color:red;">Будь ласка, введіть дату зачаття/запліднення.</p>';
        return;
      }
      baseDate = new Date(conceptionValue);
      dueDate = new Date(baseDate);
      dueDate.setDate(dueDate.getDate() + 266); // 266 days from conception
    }

    const today = new Date();
    
    // Validate dates
    if (baseDate > today) {
      result.innerHTML = '<p style="color:red;">Будь ласка, введіть дату з минулого.</p>';
      return;
    }

    // Check if due date is reasonable (not too far in past or future)
    const timeDiff = Math.abs(dueDate - today);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      result.innerHTML = '<p style="color:red;">Будь ласка, перевірте вашу дату — розрахована дата пологів здається нереалістичною.</p>';
      return;
    }

    // Calculate current pregnancy info
    const gestationalAge = Math.floor((today - baseDate) / (1000 * 60 * 60 * 24));
    const weeksPregnant = Math.floor(gestationalAge / 7);
    const daysExtra = gestationalAge % 7;
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    // Determine trimester
    let trimester, trimesterEmoji, trimesterWeeks;
    if (weeksPregnant <= 12) {
      trimester = 'Перший триместр';
      trimesterEmoji = '🌱';
      trimesterWeeks = '1-12 тижнів';
    } else if (weeksPregnant <= 27) {
      trimester = 'Другий триместр';
      trimesterEmoji = '🌿';
      trimesterWeeks = '13-27 тижнів';
    } else {
      trimester = 'Третій триместр';
      trimesterEmoji = '🌳';
      trimesterWeeks = '28-40+ тижнів';
    }

    // Determine pregnancy status
    let statusEmoji = '👶';
    let statusText = 'У нормі';
    let statusColor = '#4caf50';

    if (weeksPregnant < 37 && daysUntilDue < 0) {
      statusEmoji = '⚠️';
      statusText = 'Передчасні';
      statusColor = '#ff9800';
    } else if (weeksPregnant >= 42) {
      statusEmoji = '⏰';
      statusText = 'Переношування';
      statusColor = '#ff5722';
    } else if (weeksPregnant >= 37) {
      statusEmoji = '✅';
      statusText = 'Доношена';
      statusColor = '#4caf50';
    }

    // Calculate important dates
    const firstTrimesterEnd = new Date(baseDate);
    firstTrimesterEnd.setDate(firstTrimesterEnd.getDate() + (12 * 7));

    const secondTrimesterEnd = new Date(baseDate);
    secondTrimesterEnd.setDate(secondTrimesterEnd.getDate() + (27 * 7));

    const viabilityDate = new Date(baseDate);
    viabilityDate.setDate(viabilityDate.getDate() + (24 * 7));

    const fullTermDate = new Date(baseDate);
    fullTermDate.setDate(fullTermDate.getDate() + (37 * 7));

    // Format dates in Ukrainian
    const formatDate = (date) => {
      const months = [
        'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
        'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
      ];
      const weekdays = [
        'неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'
      ];
      
      return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} р.`;
    };

    const formatShortDate = (date) => {
      const months = [
        'січ', 'лют', 'бер', 'кві', 'тра', 'чер',
        'лип', 'сер', 'вер', 'жов', 'лис', 'гру'
      ];
      
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    // Get developmental milestone for current week in Ukrainian
    const getMilestone = (week) => {
      const milestones = {
        4: "Затримка менструації, позитивний тест на вагітність 🧪",
        6: "Серце починає битися 💓",
        8: "Рекомендується перший пренатальний візит 👩‍⚕️",
        10: "Формуються основні органи 🧠",
        12: "Кінець першого триместру, знижений ризик викидня 🛡️",
        16: "Стать може бути видна на УЗД 👶",
        20: "УЗД анатомії, середина вагітності! 📊",
        24: "Віха життєздатності — виживання поза лоном можливе 🎯",
        28: "Починається третій триместр, швидкий розвиток мозку 🧠",
        32: "Кістки загартовуються, підготовка до народження 💪",
        36: "Дитина вважається пізньо недоношеною при народженні 🕰️",
        37: "Починається доношена вагітність! 🎉",
        40: "Дата пологів — дитина готова! 👶"
      };
      
      // Find the closest milestone
      const milestoneWeeks = Object.keys(milestones).map(Number).sort((a, b) => a - b);
      for (let i = milestoneWeeks.length - 1; i >= 0; i--) {
        if (week >= milestoneWeeks[i]) {
          return milestones[milestoneWeeks[i]];
        }
      }
      return "Ранній розвиток вагітності 🌱";
    };

    const currentMilestone = getMilestone(weeksPregnant);

    // Pregnancy progress percentage
    const progressPercentage = Math.min(100, (weeksPregnant / 40) * 100);

    // Ukrainian declensions for days and weeks
    const getDaysText = (days) => {
      if (days === 1) return `${days} день`;
      if (days >= 2 && days <= 4) return `${days} дні`;
      return `${days} днів`;
    };

    const getWeeksText = (weeks) => {
      if (weeks === 1) return `${weeks} тиждень`;
      if (weeks >= 2 && weeks <= 4) return `${weeks} тижні`;
      return `${weeks} тижнів`;
    };

    result.innerHTML = `
      <div style="background: linear-gradient(135deg, #f8bbd9 0%, #f48fb1 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #e91e63;">
        <h3 style="color: #ad1457; margin-top: 0; text-align: center;">👶 Ваш графік вагітності</h3>
        
        <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
          <p style="margin: 5px 0; color: #666;">
            <strong>Метод розрахунку:</strong> ${method === 'lmp' ? 'Остання менструація' : 'Дата зачаття'}
            ${cycleLength !== 28 ? ` (цикл ${cycleLength} днів)` : ''}
          </p>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>📅 Дата пологів</h6>
            <div class="big-number">${formatShortDate(dueDate)}</div>
            <p>${daysUntilDue >= 0 ? `${getDaysText(daysUntilDue)} до пологів` : `${getDaysText(Math.abs(daysUntilDue))} прострочено`}</p>
          </div>
          
          <div class="insight-card warning">
            <h6>📊 Поточний тиждень</h6>
            <div class="big-number">${weeksPregnant}т ${daysExtra}д</div>
            <p>${getWeeksText(weeksPregnant)}, ${getDaysText(daysExtra)} вагітності</p>
          </div>
          
          <div class="insight-card" style="border-color: ${statusColor}; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);">
            <h6>${statusEmoji} Статус</h6>
            <div class="big-number" style="color: ${statusColor};">${statusText}</div>
            <p>Статус вагітності</p>
          </div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #e91e63;">
          <h4 style="color: #ad1457; margin-top: 0; text-align: center;">${trimesterEmoji} ${trimester}</h4>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: bold;">Прогрес вагітності</span>
              <span style="font-weight: bold;">${progressPercentage.toFixed(1)}%</span>
            </div>
            <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #e91e63, #ad1457); height: 100%; width: ${progressPercentage}%; border-radius: 10px; transition: width 0.3s ease;"></div>
            </div>
            <p style="margin: 8px 0 0 0; text-align: center; color: #666; font-size: 0.9rem;">
              ${trimesterWeeks} • ${weeksPregnant} тиждень з ~40
            </p>
          </div>

          <div style="background: #fff8e1; padding: 15px; border-radius: 8px; border-left: 4px solid #ffa726;">
            <h6 style="color: #e65100; margin-top: 0;">🎯 Поточна віха</h6>
            <p style="margin: 5px 0 0 0;">${currentMilestone}</p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #4caf50;">
          <h4 style="color: #2e7d32; margin-top: 0; text-align: center;">📅 Важливі дати</h4>
          
          <div style="display: grid; gap: 12px;">
            ${weeksPregnant < 12 ? `
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🌱 Кінець 1-го триместру:</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(firstTrimesterEnd)}</span>
            </div>
            ` : ''}
            
            ${weeksPregnant < 27 ? `
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🌿 Кінець 2-го триместру:</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(secondTrimesterEnd)}</span>
            </div>
            ` : ''}
            
            ${weeksPregnant < 24 ? `
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🎯 Життєздатність (24 тижні):</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(viabilityDate)}</span>
            </div>
            ` : ''}
            
            ${weeksPregnant < 37 ? `
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>✅ Доношена (37 тижнів):</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(fullTermDate)}</span>
            </div>
            ` : ''}
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>👶 Очікувана дата пологів:</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(dueDate)}</span>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #2196f3;">
          <h4 style="color: #1565c0; margin-top: 0; text-align: center;">📊 Факти про вагітність</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #1565c0; margin-top: 0;">Днів вагітності</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">${gestationalAge}</div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Від ${method === 'lmp' ? 'ОМЦ' : 'зачаття'}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #1565c0; margin-top: 0;">Тижнів залишилось</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">${Math.max(0, 40 - weeksPregnant)}</div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">До 40 тижнів</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #1565c0; margin-top: 0;">Доношений термін</h6>
              <div style="font-size: 1.2rem; font-weight: bold; color: #333;">37-42 тижні</div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Нормальний діапазон пологів</p>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ff9800;">
          <h4 style="color: #e65100; margin-top: 0; text-align: center;">💡 Важливі нагадування</h4>
          
          <div style="display: grid; gap: 10px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">📅 Точність дати пологів:</strong> Лише 4-5% дітей народжуються в точну дату пологів. Більшість прибувають протягом 2 тижнів.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">⚕️ Пренатальний догляд:</strong> Регулярні огляди важливі для контролю розвитку дитини та вашого здоров'я.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">🎒 Підготовка до пологів:</strong> Почніть готувати сумку в пологовий будинок і план пологів близько 36 тижня.
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            👶 <strong>Вітаємо!</strong> Цей калькулятор надає оцінки на основі середньої тривалості вагітності. Завжди консультуйтеся з вашим лікарем для персональних медичних порад.
          </p>
        </div>
      </div>
    `;
  });
});