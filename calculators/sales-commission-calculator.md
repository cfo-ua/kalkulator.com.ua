---
layout: calculator
title: "Калькулятор комісії продажів"
categories: [financial]
seo:
  title: "Калькулятор комісії продажів — розрахунок винагороди для менеджерів"
  description: "Онлайн калькулятор для розрахунку комісійної винагороди продавців. Різні моделі комісій: фіксована, прогресивна, ступінчата та комбінована."
  keywords:
    - комісія продажів
    - калькулятор комісії
    - винагорода продавця
    - комісійна схема
    - розрахунок комісії
    - відсоток продажів
    - зарплата менеджера
    - мотивація продажів
    - система оплати продажів
    - комісійна винагорода
  content: |
    <h2>Калькулятор комісії продажів онлайн</h2>
    <p>Цей калькулятор допоможе вам розрахувати <strong>комісійну винагороду</strong> для продавців та менеджерів з продажу за різними схемами нарахування комісії.</p>

    <h3>Типи комісійних схем:</h3>
    <ul>
      <li><strong>Фіксована комісія</strong> — постійний відсоток з усіх продажів</li>
      <li><strong>Прогресивна комісія</strong> — відсоток зростає при досягненні цілей</li>
      <li><strong>Ступінчата комісія</strong> — різні відсотки для різних рівнів продажів</li>
      <li><strong>Комбінована схема</strong> — фіксована зарплата + комісія</li>
    </ul>

    <h3>Переваги комісійної системи:</h3>
    <ul>
      <li>Мотивує співробітників до збільшення продажів</li>
      <li>Прив'язує винагороду до результатів</li>
      <li>Допомагає контролювати витрати на зарплату</li>
      <li>Стимулює досягнення планових показників</li>
    </ul>

    <p>Калькулятор враховує базову зарплату, відсоток комісії, обсяг продажів та додаткові бонуси для точного розрахунку загальної винагороди.</p>
scripts:
  - /assets/js/sales-commission-calculator.js
faq:
  - question: "Що таке комісія з продажів?"
    answer: "Це винагорода, що виплачується продавцю у відсотках від суми укладених угод або кількості проданих товарів/послуг."
  - question: "Які бувають види комісійних схем?"
    answer: "Фіксована (постійний відсоток), прогресивна (зростаючий відсоток), ступінчата (різні відсотки для різних обсягів), комбінована (оклад + комісія)."
  - question: "Як обрати оптимальний відсоток комісії?"
    answer: "Залежить від галузі, маржинальності продукту, складності продажів. Типові діапазони: 1-3% для великих угод, 5-15% для роздрібних продажів."
  - question: "Чи повинна бути мінімальна зарплата?"
    answer: "Рекомендується поєднувати фіксовану частину (50-70%) з комісійною для стабільності доходу співробітника."
  - question: "Як мотивувати досягнення планів?"
    answer: "Використовуйте прогресивну шкалу — вищі відсотки за перевиконання плану, бонуси за досягнення ключових показників."
  - question: "Як розраховується комісія з повернень?"
    answer: "Зазвичай комісія вираховується з зарплати при поверненні товару або скасуванні угоди, особливо якщо це відбулося з вини продавця."
---

<form id="commission-form">
  <label>Схема комісії</label>
  <select id="commission-type" required>
    <option value="fixed">Фіксована комісія</option>
    <option value="progressive">Прогресивна комісія</option>
    <option value="tiered">Ступінчата комісія</option>
    <option value="combined" selected>Оклад + комісія</option>
  </select>

  <label>Обсяг продажів (грн)</label>
  <input type="number" id="sales-amount" value="100000" min="0" required>

  <div id="fixed-commission" class="commission-section">
    <label>Відсоток комісії (%)</label>
    <input type="number" id="commission-rate" value="5" min="0" max="100" step="0.1">
  </div>

  <div id="combined-commission" class="commission-section">
    <label>Базова зарплата (грн)</label>
    <input type="number" id="base-salary" value="15000" min="0">
    
    <label>Відсоток комісії (%)</label>
    <input type="number" id="commission-rate-combined" value="3" min="0" max="100" step="0.1">
  </div>

  <div id="progressive-commission" class="commission-section" style="display: none;">
    <label>План продажів (грн)</label>
    <input type="number" id="sales-target" value="80000" min="0">
    
    <label>Комісія до плану (%)</label>
    <input type="number" id="rate-below-target" value="2" min="0" max="100" step="0.1">
    
    <label>Комісія понад план (%)</label>
    <input type="number" id="rate-above-target" value="7" min="0" max="100" step="0.1">
  </div>

  <div id="tiered-commission" class="commission-section" style="display: none;">
    <label>1-й рівень: до (грн)</label>
    <input type="number" id="tier1-limit" value="50000" min="0">
    <label>Комісія 1-го рівня (%)</label>
    <input type="number" id="tier1-rate" value="2" min="0" max="100" step="0.1">
    
    <label>2-й рівень: до (грн)</label>
    <input type="number" id="tier2-limit" value="100000" min="0">
    <label>Комісія 2-го рівня (%)</label>
    <input type="number" id="tier2-rate" value="4" min="0" max="100" step="0.1">
    
    <label>3-й рівень: понад (грн)</label>
    <label>Комісія 3-го рівня (%)</label>
    <input type="number" id="tier3-rate" value="6" min="0" max="100" step="0.1">
  </div>

  <label>Додаткові бонуси (грн)</label>
  <input type="number" id="bonus" value="0" min="0">

  <button type="submit">Розрахувати</button>
</form>

<div id="commission-result"></div>

<script>
// Show/hide commission sections based on selected type
document.getElementById('commission-type').addEventListener('change', function() {
  const sections = document.querySelectorAll('.commission-section');
  sections.forEach(section => section.style.display = 'none');
  
  const selectedType = this.value;
  if (selectedType === 'fixed') {
    document.getElementById('fixed-commission').style.display = 'block';
  } else if (selectedType === 'combined') {
    document.getElementById('combined-commission').style.display = 'block';
  } else if (selectedType === 'progressive') {
    document.getElementById('progressive-commission').style.display = 'block';
  } else if (selectedType === 'tiered') {
    document.getElementById('tiered-commission').style.display = 'block';
  }
});
</script>