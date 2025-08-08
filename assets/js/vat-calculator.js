// Function to convert numbers to Ukrainian words
function numberToWords(num) {
  if (num === 0) return "нуль";
  
  const ones = ["", "один", "два", "три", "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять"];
  const teens = ["десять", "одинадцять", "дванадцять", "тринадцять", "чотирнадцять", "п'ятнадцять", "шістнадцять", "сімнадцять", "вісімнадцять", "дев'ятнадцять"];
  const tens = ["", "", "двадцять", "тридцять", "сорок", "п'ятдесят", "шістдесят", "сімдесят", "вісімдесят", "дев'яносто"];
  const hundreds = ["", "сто", "двісті", "триста", "чотириста", "п'ятсот", "шістсот", "сімсот", "вісімсот", "дев'ятсот"];
  const thousands = ["", "тисяча", "тисячі", "тисяч"];
  const millions = ["", "мільйон", "мільйони", "мільйонів"];
  
  function convertHundreds(n) {
    let result = "";
    
    if (n >= 100) {
      result += hundreds[Math.floor(n / 100)] + " ";
      n %= 100;
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + " ";
      return result.trim();
    }
    
    if (n > 0) {
      result += ones[n] + " ";
    }
    
    return result.trim();
  }
  
  function getPlural(n, forms) {
    if (n % 100 >= 11 && n % 100 <= 14) return forms[2];
    if (n % 10 === 1) return forms[0];
    if (n % 10 >= 2 && n % 10 <= 4) return forms[1];
    return forms[2];
  }
  
  let result = "";
  const integerPart = Math.floor(num);
  const fractionalPart = Math.round((num - integerPart) * 100);
  
  if (integerPart >= 1000000) {
    const millions_count = Math.floor(integerPart / 1000000);
    result += convertHundreds(millions_count) + " " + getPlural(millions_count, millions) + " ";
  }
  
  if (integerPart >= 1000) {
    const thousands_count = Math.floor((integerPart % 1000000) / 1000);
    if (thousands_count > 0) {
      result += convertHundreds(thousands_count) + " " + getPlural(thousands_count, thousands) + " ";
    }
  }
  
  const remainder = integerPart % 1000;
  if (remainder > 0) {
    result += convertHundreds(remainder) + " ";
  }
  
  result += "гривень";
  
  if (fractionalPart > 0) {
    result += " " + convertHundreds(fractionalPart) + " копійок";
  }
  
  return result.trim();
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('vat-form');
  const result = document.getElementById('vat-result');
  const vatRateInput = document.getElementById('vat-rate');
  const amountInput = document.getElementById('amount');
  const addVatButton = document.getElementById('add-vat');
  const extractVatButton = document.getElementById('extract-vat');
  const rateButtons = document.querySelectorAll('.rate-btn');

  const format = num => Number(num).toLocaleString('uk-UA', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  // Handle rate preset buttons
  rateButtons.forEach(button => {
    button.addEventListener('click', function() {
      const rate = this.dataset.rate;
      vatRateInput.value = rate;
      
      // Update active state
      rateButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Recalculate if amount is present
      if (amountInput.value) {
        if (addVatButton.classList.contains('active')) {
          calculateAddVat();
        } else if (extractVatButton.classList.contains('active')) {
          calculateExtractVat();
        }
      }
    });
  });

  // Set default active rate button
  document.querySelector('[data-rate="20"]').classList.add('active');

  function calculateAddVat() {
    const amount = parseFloat(amountInput.value);
    const rate = parseFloat(vatRateInput.value);
    
    if (isNaN(amount) || isNaN(rate)) {
      result.innerHTML = `<span style="color:red;">Будь ласка, введіть суму та ставку ПДВ</span>`;
      return;
    }

    const vatAmount = amount * (rate / 100);
    const totalAmount = amount + vatAmount;

    displayResult(amount, vatAmount, totalAmount, rate, 'add');
  }

  function calculateExtractVat() {
    const totalAmount = parseFloat(amountInput.value);
    const rate = parseFloat(vatRateInput.value);
    
    if (isNaN(totalAmount) || isNaN(rate)) {
      result.innerHTML = `<span style="color:red;">Будь ласка, введіть суму та ставку ПДВ</span>`;
      return;
    }

    const amount = totalAmount / (1 + rate / 100);
    const vatAmount = totalAmount - amount;

    displayResult(amount, vatAmount, totalAmount, rate, 'extract');
  }

  function displayResult(netAmount, vatAmount, grossAmount, rate, operation) {
    const operationText = operation === 'add' ? 'Нарахування ПДВ' : 'Виділення ПДВ';
    
    result.innerHTML = `
      <h3>Результат розрахунку ПДВ:</h3>
      <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #007bff; margin-bottom: 1rem;">
        <div style="display: grid; gap: 0.5rem;">
          <div><strong>Операція:</strong> ${operationText}</div>
          <div><strong>Ставка ПДВ:</strong> ${format(rate)}%</div>
          <hr style="margin: 1rem 0; border: none; border-top: 1px solid #dee2e6;">
          <div><strong>Сума без ПДВ:</strong> ${format(netAmount)} грн</div>
          <div><strong>Сума ПДВ:</strong> ${format(vatAmount)} грн</div>
          <div style="font-size: 1.1em; color: #007bff;"><strong>Сума з ПДВ:</strong> ${format(grossAmount)} грн</div>
        </div>
      </div>
      
      <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px; border-left: 4px solid #28a745;">
        <h4 style="margin-top: 0; color: #155724;">Сума прописом:</h4>
        <div style="font-style: italic; color: #155724;">
          <div><strong>Без ПДВ:</strong> ${numberToWords(netAmount)}</div>
          <div><strong>ПДВ:</strong> ${numberToWords(vatAmount)}</div>
          <div><strong>З ПДВ:</strong> ${numberToWords(grossAmount)}</div>
        </div>
      </div>
    `;
  }

  // Add VAT button handler
  addVatButton.addEventListener('click', function() {
    extractVatButton.classList.remove('active');
    this.classList.add('active');
    calculateAddVat();
  });

  // Extract VAT button handler
  extractVatButton.addEventListener('click', function() {
    addVatButton.classList.remove('active');
    this.classList.add('active');
    calculateExtractVat();
  });

  // Auto-calculate on input change if operation is selected
  amountInput.addEventListener('input', function() {
    if (addVatButton.classList.contains('active')) {
      calculateAddVat();
    } else if (extractVatButton.classList.contains('active')) {
      calculateExtractVat();
    }
  });

  vatRateInput.addEventListener('input', function() {
    // Update active rate button
    rateButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.rate === this.value) {
        btn.classList.add('active');
      }
    });
    
    // Recalculate if operation is selected
    if (addVatButton.classList.contains('active')) {
      calculateAddVat();
    } else if (extractVatButton.classList.contains('active')) {
      calculateExtractVat();
    }
  });

  // Prevent form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
  });
});