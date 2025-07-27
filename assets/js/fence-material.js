document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('fence-form');
  const result = document.getElementById('fence-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('fence-length').value);
      const height = parseFloat(document.getElementById('fence-height').value);
      const [fenceType, costPerMeter] = document.getElementById('fence-type').value.split(',');
      const spacing = parseFloat(document.getElementById('fence-spacing').value);
      const gates = parseFloat(document.getElementById('fence-gates').value);
      const gateWidth = parseFloat(document.getElementById('fence-gate-width').value);
      const terrainMultiplier = parseFloat(document.getElementById('fence-terrain').value);
      
      if (length <= 0) {
        result.textContent = "Будь ласка, введіть правильну довжину паркану.";
        return;
      }
      
      // Calculate posts needed
      const postsFromSpacing = Math.floor(length / spacing) + 1; // Posts along fence line
      const gatePosts = gates * 2; // Each gate needs 2 posts
      const totalPosts = postsFromSpacing + gatePosts - (gates > 0 ? gates : 0); // Subtract overlap
      
      // Calculate fence sections
      const actualFenceLength = length - (gates * gateWidth); // Subtract gate openings
      
      // Calculate materials based on fence type
      let materials = {};
      let laborComplexity = 1.0;
      
      switch(fenceType) {
        case 'wood-solid':
          materials = {
            posts: totalPosts,
            rails: Math.ceil(actualFenceLength / 2.5) * 3, // 3 лаги на секцію 2,5м
            boards: Math.ceil(actualFenceLength * 10), // 10 дощок на метр
            concrete: totalPosts * 1.5, // 1.5 мішки на стовп
            screws: Math.ceil(actualFenceLength / 2.5) * 1 // 1 кг на секцію
          };
          laborComplexity = 1.2;
          break;
        case 'wood-picket':
          materials = {
            posts: totalPosts,
            rails: Math.ceil(actualFenceLength / 2.5) * 2, // 2 лаги на секцію
            pickets: Math.ceil(actualFenceLength * 8), // 8 штахетів на метр
            concrete: totalPosts * 1.5,
            screws: Math.ceil(actualFenceLength / 2.5) * 0.7
          };
          laborComplexity = 1.1;
          break;
        case 'profnastil':
          materials = {
            posts: totalPosts,
            rails: Math.ceil(actualFenceLength / 2.5) * 2, // 2 лаги на секцію
            sheets: Math.ceil(actualFenceLength / 1.2), // листи 1,2м ширини
            concrete: totalPosts * 1.5,
            screws: Math.ceil(actualFenceLength / 1.2) * 15 // 15 саморізів на лист
          };
          laborComplexity = 1.0;
          break;
        case 'chain-link':
          materials = {
            posts: totalPosts,
            fabric: Math.ceil(actualFenceLength), // Погонні метри
            rails: Math.ceil(actualFenceLength / 3), // Верхня лага кожні 3м
            concrete: totalPosts * 1,
            ties: Math.ceil(actualFenceLength * 15) // 15 хомутів на метр
          };
          laborComplexity = 0.9;
          break;
        case 'euro-shtaket':
          materials = {
            posts: totalPosts,
            rails: Math.ceil(actualFenceLength / 2.5) * 2, // 2 лаги на секцію
            pickets: Math.ceil(actualFenceLength * 10), // 10 штахетів на метр
            concrete: totalPosts * 1.5,
            screws: Math.ceil(actualFenceLength / 2.5) * 0.8
          };
          laborComplexity = 1.1;
          break;
        case 'metal-forged':
          materials = {
            posts: totalPosts,
            panels: Math.ceil(actualFenceLength / 2), // секції 2м
            concrete: totalPosts * 1.5,
            brackets: Math.ceil(actualFenceLength / 2) * 4
          };
          laborComplexity = 1.3;
          break;
      }
      
      // Calculate costs
      const materialCost = actualFenceLength * parseFloat(costPerMeter);
      const gateCost = gates * gateWidth * parseFloat(costPerMeter) * 1.8; // Gates cost 80% more
      const hardwareCost = gates * 3000; // Gate hardware in UAH
      const adjustedCost = (materialCost + gateCost + hardwareCost) * terrainMultiplier;
      
      // Calculate labor estimate
      const laborHours = (length / 6) * height * laborComplexity * terrainMultiplier; // ~6 м на годину базово
      const laborCost = laborHours * 400; // 400 грн/година в середньому
      
      // Calculate hole digging
      const holeDepth = (height / 3) + 0.2; // 1/3 висоти + 20 см
      const totalDigging = totalPosts * holeDepth;
      
      // Post size recommendations
      let postSize = '';
      switch(fenceType) {
        case 'wood-solid':
        case 'wood-picket':
          postSize = 'Дерев\'яні стовпи 100×100 мм';
          break;
        case 'profnastil':
        case 'euro-shtaket':
          postSize = 'Профільна труба 60×60 мм';
          break;
        case 'chain-link':
          postSize = 'Оцинковані стовпи 60×40 мм';
          break;
        case 'metal-forged':
          postSize = 'Профільна труба 80×80 мм';
          break;
      }
      
      // Fence type names in Ukrainian
      const fenceTypeNames = {
        'wood-solid': 'Дерев\'яний суцільний',
        'wood-picket': 'Дерев\'яний штахетник',
        'profnastil': 'Профнастил',
        'chain-link': 'Сітка-рабиця',
        'euro-shtaket': 'Евроштахетник',
        'metal-forged': 'Металевий кований'
      };
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Специфікації паркану:</h4>
          <p>Загальна довжина паркану: ${length} п.м</p>
          <p>Висота паркану: ${height} м</p>
          <p>Тип паркану: ${fenceTypeNames[fenceType]}</p>
          <p>Відстань між стовпами: ${spacing} м</p>
          <p>Фактична довжина паркану: ${actualFenceLength} м (мінус ${gates} воріт)</p>
        </div>
        
        <div class="result-posts">
          <h4>Стовпи та фундамент:</h4>
          <p><strong>${totalPosts} ${postSize}</strong></p>
          <p>- ${postsFromSpacing} лінійних стовпів</p>
          ${gatePosts > 0 ? `<p>- ${gatePosts} воротних стовпів</p>` : ''}
          <p><strong>Ями для стовпів: ${totalPosts} ям, ${holeDepth.toFixed(1)} м глибини</strong></p>
          <p>Потрібно бетону: ${materials.concrete || 0} мішків (25 кг швидкотвердіючий)</p>
          <p>Загальне копання: ${totalDigging.toFixed(1)} куб.м</p>
        </div>
        
        <div class="result-materials">
          <h4>Матеріали для паркану:</h4>
          ${fenceType.includes('wood') ? `
          <p><strong>Лаги:</strong> ${materials.rails || 0} штук (40×20 мм × 3 м)</p>
          <p><strong>Дошки/штахети:</strong> ${materials.boards || materials.pickets || 0} штук</p>
          <p><strong>Саморізи:</strong> ${materials.screws || 0} кг оцинковані</p>
          ` : ''}
          ${fenceType === 'profnastil' ? `
          <p><strong>Листи профнастилу:</strong> ${materials.sheets || 0} листів</p>
          <p><strong>Лаги:</strong> ${materials.rails || 0} штук (40×20 мм)</p>
          <p><strong>Саморізи:</strong> ${materials.screws || 0} штук</p>
          ` : ''}
          ${fenceType === 'chain-link' ? `
          <p><strong>Сітка-рабиця:</strong> ${materials.fabric || 0} п.м</p>
          <p><strong>Верхня лага:</strong> ${materials.rails || 0} штук</p>
          <p><strong>Хомути:</strong> ${materials.ties || 0} штук</p>
          ` : ''}
          ${fenceType === 'euro-shtaket' ? `
          <p><strong>Евроштахетник:</strong> ${materials.pickets || 0} штук</p>
          <p><strong>Лаги:</strong> ${materials.rails || 0} штук (40×20 мм)</p>
          <p><strong>Саморізи:</strong> ${materials.screws || 0} кг</p>
          ` : ''}
          ${fenceType === 'metal-forged' ? `
          <p><strong>Металеві секції:</strong> ${materials.panels || 0} секцій</p>
          <p><strong>Кронштейни:</strong> ${materials.brackets || 0} штук</p>
          ` : ''}
        </div>
        
        ${gates > 0 ? `
        <div class="result-gates">
          <h4>Матеріали для воріт:</h4>
          <p><strong>${gates} ворота</strong> (${gateWidth} м ширини кожні)</p>
          <p>Каркаси воріт: ${gates} комплектів</p>
          <p>Петлі: ${gates * 3} посилених петель</p>
          <p>Замки/засуви: ${gates} комплектів</p>
          <p>Вартість фурнітури: ${hardwareCost} грн</p>
        </div>
        ` : ''}
        
        <div class="result-costs">
          <h4>Розподіл вартості:</h4>
          <p>Матеріали паркану: ${materialCost.toFixed(0)} грн</p>
          ${gates > 0 ? `<p>Матеріали воріт: ${gateCost.toFixed(0)} грн</p>` : ''}
          ${gates > 0 ? `<p>Фурнітура воріт: ${hardwareCost} грн</p>` : ''}
          ${terrainMultiplier > 1 ? `<p>Корекція рельєфу: ${((terrainMultiplier - 1) * 100).toFixed(0)}%</p>` : ''}
          <p><strong>Загальна вартість матеріалів: ${adjustedCost.toFixed(0)} грн</strong></p>
          <p>Професійна робота: ${laborCost.toFixed(0)} грн</p>
          <p><strong>Загальна вартість проекту: ${(adjustedCost + laborCost).toFixed(0)} грн</strong></p>
        </div>
        
        <div class="result-installation">
          <h4>Графік монтажу:</h4>
          <p>Оцінка робочого часу: ${laborHours.toFixed(1)} годин</p>
          <p>Самостійний монтаж: ${Math.ceil(laborHours / 8)} днів (8 год/день)</p>
          <p>Професійна бригада: ${Math.ceil(laborHours / 16)} днів (2 особи)</p>
          <p>Застигання стовпів: 24-48 годин</p>
        </div>
        
        <div class="result-tools">
          <h4>Необхідні інструменти:</h4>
          <p>🕳️ Лопата або бур для ям</p>
          <p>📏 Рівень та рулетка</p>
          <p>🔨 Дриль та шуруповерт</p>
          <p>⚡ Циркулярна або торцева пила</p>
          <p>🧤 Захисне обладнання (рукавички, окуляри)</p>
          <p>📐 Шнур та кілки для розмітки</p>
        </div>
        
        <div class="result-permits">
          <h4>Перед початком робіт:</h4>
          <p>📞 Дзвоніть до служб для позначення комунікацій</p>
          <p>📋 Перевірте місцеві дозволи та норми для парканів</p>
          <p>📏 Підтвердіть межі ділянки та відступи</p>
          <p>🤝 Обговоріть з сусідами (спільні лінії парканів)</p>
          <p>🌦️ Перевірте прогноз погоди (уникайте вологих умов)</p>
        </div>
        
        <div class="result-tips">
          <h4>Поради для економії:</h4>
          <p>💰 Самостійний монтаж економить 50% на роботі</p>
          <p>📦 Купуйте матеріали оптом для знижок</p>
          <p>⏰ Купуйте в несезон для кращих цін</p>
          <p>🔧 Орендуйте спеціалізовані інструменти</p>
          <p>👥 Отримайте кілька цінових пропозицій</p>
        </div>
        
        <div class="result-quality-tips">
          <h4>Поради щодо якості:</h4>
          <p>🌡️ Обробляйте дерев'яні елементи антисептиком</p>
          <p>🔩 Використовуйте оцинковані кріплення</p>
          <p>📐 Перевіряйте вертикальність стовпів</p>
          <p>💧 Забезпечте дренаж у ямах стовпів</p>
          <p>🎨 Загрунтуйте металеві елементи перед фарбуванням</p>
        </div>
      `;
    });
  }
});