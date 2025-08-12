document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('stoichiometry-form');
  const result = document.getElementById('stoichiometry-result');
  const equationInput = document.getElementById('st-equation');
  const substanceSelect = document.getElementById('st-substance');
  const amountTypeSelect = document.getElementById('st-amount-type');
  const amountInput = document.getElementById('st-amount');
  const molarMassInput = document.getElementById('st-molar-mass');
  const calculateBtn = document.getElementById('st-calculate');
  const clearBtn = document.getElementById('st-clear');
  
  // Common molar masses (g/mol)
  const molarMasses = {
    'H': 1, 'H2': 2, 'He': 4, 'Li': 7, 'C': 12, 'N': 14, 'N2': 28, 'O': 16, 'O2': 32,
    'F': 19, 'F2': 38, 'Ne': 20, 'Na': 23, 'Mg': 24, 'Al': 27, 'Si': 28, 'P': 31,
    'S': 32, 'Cl': 35.5, 'Cl2': 71, 'K': 39, 'Ca': 40, 'Fe': 56, 'Cu': 63.5, 'Zn': 65,
    'Br': 80, 'Br2': 160, 'I': 127, 'I2': 254,
    'H2O': 18, 'CO2': 44, 'NH3': 17, 'CH4': 16, 'C2H6': 30, 'C3H8': 44, 'C2H4': 28,
    'NaCl': 58.5, 'CaCO3': 100, 'CaO': 56, 'Na2CO3': 106, 'HCl': 36.5, 'H2SO4': 98,
    'NaOH': 40, 'Ca(OH)2': 74, 'KNO3': 101, 'AgNO3': 170, 'BaCl2': 208
  };

  let currentReaction = {
    reactants: [],
    products: [],
    coefficients: {}
  };

  // Set default equation
  equationInput.value = '2H2 + O2 → 2H2O';
  
  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      equationInput.value = this.dataset.equation;
      parseEquation();
    });
  });

  // Parse equation on input
  equationInput.addEventListener('input', parseEquation);
  
  // Auto-fill molar mass when substance is selected
  substanceSelect.addEventListener('change', function() {
    const substance = this.value;
    if (substance && molarMasses[substance]) {
      molarMassInput.value = molarMasses[substance];
    }
  });

  // Calculate button
  calculateBtn.addEventListener('click', calculateStoichiometry);
  
  // Clear button
  clearBtn.addEventListener('click', function() {
    equationInput.value = '';
    amountInput.value = '';
    molarMassInput.value = '';
    substanceSelect.innerHTML = '<option value="">Оберіть речовину</option>';
    result.innerHTML = '';
    currentReaction = { reactants: [], products: [], coefficients: {} };
  });

  function parseEquation() {
    const equation = equationInput.value.trim();
    if (!equation) return;

    try {
      // Split by arrow
      const parts = equation.split(/→|->|=/).map(part => part.trim());
      if (parts.length !== 2) {
        throw new Error('Невірний формат рівняння');
      }

      const [reactantsPart, productsPart] = parts;
      
      // Parse reactants and products
      const reactants = parseSubstances(reactantsPart);
      const products = parseSubstances(productsPart);
      
      // Store in current reaction
      currentReaction.reactants = reactants.map(r => r.substance);
      currentReaction.products = products.map(p => p.substance);
      currentReaction.coefficients = {};
      
      [...reactants, ...products].forEach(item => {
        currentReaction.coefficients[item.substance] = item.coefficient;
      });

      // Update substance dropdown
      updateSubstanceDropdown();
      
    } catch (error) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Помилка</h6>
        <div>${error.message}</div>
      </div>`;
    }
  }

  function parseSubstances(part) {
    const substances = part.split('+').map(s => s.trim());
    return substances.map(substance => {
      // Extract coefficient and substance
      const match = substance.match(/^(\d*)\s*([A-Za-z0-9()]+)$/);
      if (!match) {
        throw new Error(`Невірний формат речовини: ${substance}`);
      }
      
      const coefficient = match[1] ? parseInt(match[1]) : 1;
      const name = match[2];
      
      return { coefficient, substance: name };
    });
  }

  function updateSubstanceDropdown() {
    substanceSelect.innerHTML = '<option value="">Оберіть речовину</option>';
    
    // Add reactants
    if (currentReaction.reactants.length > 0) {
      const reactantGroup = document.createElement('optgroup');
      reactantGroup.label = 'Реагенти';
      currentReaction.reactants.forEach(substance => {
        const option = document.createElement('option');
        option.value = substance;
        option.textContent = `${substance} (коеф. ${currentReaction.coefficients[substance]})`;
        reactantGroup.appendChild(option);
      });
      substanceSelect.appendChild(reactantGroup);
    }
    
    // Add products
    if (currentReaction.products.length > 0) {
      const productGroup = document.createElement('optgroup');
      productGroup.label = 'Продукти';
      currentReaction.products.forEach(substance => {
        const option = document.createElement('option');
        option.value = substance;
        option.textContent = `${substance} (коеф. ${currentReaction.coefficients[substance]})`;
        productGroup.appendChild(option);
      });
      substanceSelect.appendChild(productGroup);
    }
  }

  function calculateStoichiometry() {
    try {
      const substance = substanceSelect.value;
      const amountType = amountTypeSelect.value;
      const amount = parseFloat(amountInput.value);
      let molarMass = parseFloat(molarMassInput.value);

      if (!substance || !amount || amount <= 0) {
        throw new Error('Заповніть всі обовʼязкові поля');
      }

      if (!molarMass && (amountType === 'mass' || amountType === 'volume')) {
        molarMass = molarMasses[substance];
        if (!molarMass) {
          throw new Error('Введіть молярну масу для обраної речовини');
        }
        molarMassInput.value = molarMass;
      }

      // Convert to moles
      let moles;
      switch (amountType) {
        case 'moles':
          moles = amount;
          break;
        case 'mass':
          moles = amount / molarMass;
          break;
        case 'volume':
          moles = amount / 22.4; // STP conditions
          break;
      }

      // Calculate for all substances
      const results = calculateAllSubstances(substance, moles);
      displayResults(substance, amount, amountType, results);

    } catch (error) {
      result.innerHTML = `<div class="insight-card warning">
        <h6>⚠️ Помилка</h6>
        <div>${error.message}</div>
      </div>`;
    }
  }

  function calculateAllSubstances(givenSubstance, givenMoles) {
    const results = {};
    const givenCoefficient = currentReaction.coefficients[givenSubstance];
    
    // Calculate for all substances in the reaction
    [...currentReaction.reactants, ...currentReaction.products].forEach(substance => {
      const coefficient = currentReaction.coefficients[substance];
      const moles = (givenMoles * coefficient) / givenCoefficient;
      const substanceMolarMass = molarMasses[substance] || 0;
      
      results[substance] = {
        moles: moles,
        mass: substanceMolarMass ? moles * substanceMolarMass : null,
        volume: moles * 22.4, // Assuming gas at STP
        coefficient: coefficient,
        molarMass: substanceMolarMass
      };
    });
    
    return results;
  }

  function displayResults(givenSubstance, givenAmount, givenType, results) {
    let resultHTML = `<h4>📊 Результати стехіометричних розрахунків</h4>`;
    
    // Display given information
    resultHTML += `<div class="insight-card success">
      <h6>📝 Задано</h6>
      <div><strong>${givenSubstance}:</strong> ${givenAmount} ${getUnitLabel(givenType)}</div>
    </div>`;

    // Results for all substances
    resultHTML += '<div class="insight-cards">';
    
    Object.entries(results).forEach(([substance, data]) => {
      const isGiven = substance === givenSubstance;
      const cardClass = isGiven ? 'success' : 'info';
      
      resultHTML += `<div class="insight-card ${cardClass}">
        <h6>${substance} ${isGiven ? '(задано)' : ''}</h6>
        <div class="substance-results">
          <div><strong>Молі:</strong> ${data.moles.toFixed(3)} моль</div>
          ${data.mass ? `<div><strong>Маса:</strong> ${data.mass.toFixed(2)} г</div>` : ''}
          <div><strong>Обʼєм (н.у.):</strong> ${data.volume.toFixed(2)} л</div>
          <div class="small-text">Коефіцієнт: ${data.coefficient}</div>
        </div>
      </div>`;
    });
    
    resultHTML += '</div>';

    // Add calculation explanation
    resultHTML += `<div class="calculation-explanation">
      <h5>🧮 Пояснення розрахунків</h5>
      <p>Базуючись на стехіометричних коефіцієнтах у рівнянні <strong>${equationInput.value}</strong>, 
      відношення між речовинами визначається їх коефіцієнтами.</p>
      
      <div class="ratio-explanation">
        <h6>📐 Співвідношення молів:</h6>
        <div class="ratio-line">
          ${Object.entries(results).map(([substance, data]) => 
            `${substance}:${data.coefficient}`
          ).join(' = ')}
        </div>
      </div>
    </div>`;

    result.innerHTML = resultHTML;
  }

  function getUnitLabel(type) {
    switch (type) {
      case 'moles': return 'моль';
      case 'mass': return 'г';
      case 'volume': return 'л';
      default: return '';
    }
  }

  // Initialize with default equation
  parseEquation();
});