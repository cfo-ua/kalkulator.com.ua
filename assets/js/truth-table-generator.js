document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('truth-table-form');
  const result = document.getElementById('truth-table-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const expression = document.getElementById('logic-expression').value.trim();
      
      if (!expression) {
        result.innerHTML = '<div class="error">Будь ласка, введіть логічний вираз.</div>';
        return;
      }
      
      try {
        generateTruthTable(expression);
      } catch (error) {
        result.innerHTML = `<div class="error">Помилка в виразі: ${error.message}</div>`;
      }
    });
  }
  
  function generateTruthTable(expression) {
    // Extract variables from expression
    const variables = getVariables(expression);
    if (variables.length === 0) {
      throw new Error("Не знайдено змінних у виразі");
    }
    if (variables.length > 4) {
      throw new Error("Занадто багато змінних (максимум 4: A, B, C, D)");
    }
    
    // Generate all combinations
    const numRows = Math.pow(2, variables.length);
    const combinations = [];
    
    for (let i = 0; i < numRows; i++) {
      const combination = {};
      for (let j = 0; j < variables.length; j++) {
        combination[variables[j]] = Boolean((i >> (variables.length - 1 - j)) & 1);
      }
      combinations.push(combination);
    }
    
    // Evaluate expression for each combination
    const results = combinations.map(combo => {
      const resultValue = evaluateExpression(expression, combo);
      return { ...combo, result: resultValue };
    });
    
    // Display table
    displayTruthTable(variables, results, expression);
  }
  
  function getVariables(expression) {
    const matches = expression.match(/[A-D]/g);
    if (!matches) return [];
    return [...new Set(matches)].sort();
  }
  
  function evaluateExpression(expression, values) {
    // Normalize expression
    let expr = expression.toUpperCase();
    
    // Replace NAND and NOR
    expr = expr.replace(/NAND/g, 'NAND_OP');
    expr = expr.replace(/NOR/g, 'NOR_OP');
    
    // Replace variables with values
    Object.keys(values).forEach(variable => {
      const value = values[variable];
      expr = expr.replace(new RegExp(variable, 'g'), value ? 'true' : 'false');
    });
    
    // Replace logical operators with JavaScript equivalents
    expr = expr.replace(/&/g, '&&');
    expr = expr.replace(/\|/g, '||');
    expr = expr.replace(/!/g, '!');
    expr = expr.replace(/\^/g, '!=='); // XOR as not equal
    
    // Handle NAND and NOR
    expr = expr.replace(/NAND_OP/g, '!(&&)');
    expr = expr.replace(/NOR_OP/g, '!(||)');
    
    // Clean up NAND/NOR expressions
    expr = expr.replace(/!\(\&\&\)/g, 'NAND_FUNC');
    expr = expr.replace(/!\(\|\|\)/g, 'NOR_FUNC');
    
    // For NAND and NOR, we need special handling
    if (expr.includes('NAND_FUNC') || expr.includes('NOR_FUNC')) {
      return evaluateWithSpecialOps(expression, values);
    }
    
    try {
      return Function('return ' + expr)();
    } catch (error) {
      throw new Error("Некоректний вираз");
    }
  }
  
  function evaluateWithSpecialOps(expression, values) {
    // Simple parser for NAND/NOR operations
    let expr = expression.toUpperCase();
    
    // Replace variables
    Object.keys(values).forEach(variable => {
      const value = values[variable] ? 1 : 0;
      expr = expr.replace(new RegExp(variable, 'g'), value);
    });
    
    // Handle basic operations first
    expr = expr.replace(/(\d+)\s*&\s*(\d+)/g, (match, a, b) => {
      return (parseInt(a) && parseInt(b)) ? 1 : 0;
    });
    
    expr = expr.replace(/(\d+)\s*\|\s*(\d+)/g, (match, a, b) => {
      return (parseInt(a) || parseInt(b)) ? 1 : 0;
    });
    
    expr = expr.replace(/!(\d+)/g, (match, a) => {
      return parseInt(a) ? 0 : 1;
    });
    
    expr = expr.replace(/(\d+)\s*\^\s*(\d+)/g, (match, a, b) => {
      return (parseInt(a) !== parseInt(b)) ? 1 : 0;
    });
    
    return Boolean(parseInt(expr));
  }
  
  function displayTruthTable(variables, results, expression) {
    let html = '<div class="insight-card">';
    html += `<h3>📊 Таблиця істинності для: <code>${expression}</code></h3>`;
    
    html += '<table class="truth-table">';
    html += '<thead><tr>';
    
    // Variable headers
    variables.forEach(variable => {
      html += `<th>${variable}</th>`;
    });
    html += `<th class="result-column">${expression}</th>`;
    html += '</tr></thead>';
    
    html += '<tbody>';
    results.forEach(row => {
      html += '<tr>';
      variables.forEach(variable => {
        const value = row[variable];
        html += `<td class="${value ? 'true' : 'false'}">${value ? '1' : '0'}</td>`;
      });
      html += `<td class="result-column ${row.result ? 'true' : 'false'}">${row.result ? '1' : '0'}</td>`;
      html += '</tr>';
    });
    html += '</tbody></table>';
    
    // Add analysis
    const trueCount = results.filter(r => r.result).length;
    const totalCount = results.length;
    const percentage = ((trueCount / totalCount) * 100).toFixed(1);
    
    html += '<div class="analysis">';
    html += '<h4>📈 Аналіз:</h4>';
    html += `<p>🟢 Істинних значень: <strong>${trueCount} з ${totalCount}</strong> (${percentage}%)</p>`;
    html += `<p>🔴 Хибних значень: <strong>${totalCount - trueCount} з ${totalCount}</strong> (${(100 - percentage).toFixed(1)}%)</p>`;
    
    if (trueCount === totalCount) {
      html += '<p>✅ Це <strong>тавтологія</strong> - вираз завжди істинний!</p>';
    } else if (trueCount === 0) {
      html += '<p>❌ Це <strong>суперечність</strong> - вираз завжди хибний!</p>';
    } else {
      html += '<p>🔀 Це <strong>контингентний</strong> вираз - залежить від значень змінних.</p>';
    }
    html += '</div>';
    
    html += '</div>';
    
    result.innerHTML = html;
  }
});

// Add CSS for truth table styling
const style = document.createElement('style');
style.textContent = `
  .truth-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-family: monospace;
    font-size: 1.1rem;
  }
  
  .truth-table th,
  .truth-table td {
    border: 1px solid var(--border);
    padding: 0.75rem;
    text-align: center;
    font-weight: bold;
  }
  
  .truth-table th {
    background: var(--accent);
    color: white;
    font-size: 1.2rem;
  }
  
  .truth-table .result-column {
    background: var(--card-bg);
    font-weight: bold;
  }
  
  .truth-table .true {
    background: #d4edda;
    color: #155724;
  }
  
  .truth-table .false {
    background: #f8d7da;
    color: #721c24;
  }
  
  .analysis {
    margin-top: 1.5rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
  }
  
  .analysis h4 {
    margin: 0 0 1rem 0;
    color: var(--accent);
  }
  
  .analysis p {
    margin: 0.5rem 0;
  }
  
  .error {
    color: #721c24;
    background: #f8d7da;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #f5c6cb;
  }
`;
document.head.appendChild(style);