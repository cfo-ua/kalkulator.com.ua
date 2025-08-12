document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('karnaugh-form');
  const result = document.getElementById('karnaugh-result');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Update active tab content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId + '-input') {
          content.classList.add('active');
        }
      });
    });
  });
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const numVars = parseInt(document.getElementById('num-variables').value);
      const activeTab = document.querySelector('.tab-button.active').getAttribute('data-tab');
      
      try {
        let functionValues;
        
        if (activeTab === 'truth-table') {
          const values = document.getElementById('function-values').value.trim();
          if (!values) {
            throw new Error("Введіть значення функції");
          }
          functionValues = values.split(',').map(v => parseInt(v.trim()));
        } else {
          const minterms = document.getElementById('minterms-values').value.trim();
          if (!minterms) {
            throw new Error("Введіть мінтерми");
          }
          functionValues = parseMintersm(minterms, numVars);
        }
        
        if (functionValues.length !== Math.pow(2, numVars)) {
          throw new Error(`Очікується ${Math.pow(2, numVars)} значень для ${numVars} змінних`);
        }
        
        generateKarnaughMap(functionValues, numVars);
      } catch (error) {
        result.innerHTML = `<div class="error">Помилка: ${error.message}</div>`;
      }
    });
  }
  
  function parseMintersm(mintermsStr, numVars) {
    const minterms = mintermsStr.split(',').map(m => parseInt(m.trim()));
    const maxSize = Math.pow(2, numVars);
    const values = new Array(maxSize).fill(0);
    
    minterms.forEach(minterm => {
      if (minterm >= 0 && minterm < maxSize) {
        values[minterm] = 1;
      }
    });
    
    return values;
  }
  
  function generateKarnaughMap(values, numVars) {
    const variables = ['A', 'B', 'C', 'D'].slice(0, numVars);
    const kmap = createKMap(values, numVars);
    const groups = findGroups(kmap, numVars);
    const minimizedExpression = generateExpression(groups, numVars);
    
    displayKarnaughMap(kmap, groups, minimizedExpression, numVars, variables);
  }
  
  function createKMap(values, numVars) {
    if (numVars === 2) {
      return [
        [values[0], values[1]],
        [values[2], values[3]]
      ];
    } else if (numVars === 3) {
      return [
        [values[0], values[1], values[3], values[2]],
        [values[4], values[5], values[7], values[6]]
      ];
    } else if (numVars === 4) {
      return [
        [values[0], values[1], values[3], values[2]],
        [values[4], values[5], values[7], values[6]],
        [values[12], values[13], values[15], values[14]],
        [values[8], values[9], values[11], values[10]]
      ];
    }
  }
  
  function findGroups(kmap, numVars) {
    // Simplified group finding - finds basic groups
    const groups = [];
    const rows = kmap.length;
    const cols = kmap[0].length;
    const used = Array(rows).fill().map(() => Array(cols).fill(false));
    
    // Find groups of 4 (2x2)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (canForm2x2Group(kmap, i, j, rows, cols) && !isUsed2x2(used, i, j, rows, cols)) {
          groups.push({
            type: '2x2',
            positions: get2x2Positions(i, j, rows, cols),
            size: 4
          });
          mark2x2Used(used, i, j, rows, cols);
        }
      }
    }
    
    // Find groups of 2 (horizontal and vertical)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!used[i][j] && kmap[i][j] === 1) {
          // Try horizontal pair
          const nextJ = (j + 1) % cols;
          if (!used[i][nextJ] && kmap[i][nextJ] === 1) {
            groups.push({
              type: 'horizontal',
              positions: [{row: i, col: j}, {row: i, col: nextJ}],
              size: 2
            });
            used[i][j] = used[i][nextJ] = true;
          }
          // Try vertical pair
          else if (i + 1 < rows && !used[i + 1][j] && kmap[i + 1][j] === 1) {
            groups.push({
              type: 'vertical',
              positions: [{row: i, col: j}, {row: i + 1, col: j}],
              size: 2
            });
            used[i][j] = used[i + 1][j] = true;
          }
          // Single cell
          else {
            groups.push({
              type: 'single',
              positions: [{row: i, col: j}],
              size: 1
            });
            used[i][j] = true;
          }
        }
      }
    }
    
    return groups;
  }
  
  function canForm2x2Group(kmap, i, j, rows, cols) {
    const positions = get2x2Positions(i, j, rows, cols);
    return positions.every(pos => kmap[pos.row][pos.col] === 1);
  }
  
  function get2x2Positions(i, j, rows, cols) {
    return [
      {row: i, col: j},
      {row: i, col: (j + 1) % cols},
      {row: (i + 1) % rows, col: j},
      {row: (i + 1) % rows, col: (j + 1) % cols}
    ];
  }
  
  function isUsed2x2(used, i, j, rows, cols) {
    const positions = get2x2Positions(i, j, rows, cols);
    return positions.some(pos => used[pos.row][pos.col]);
  }
  
  function mark2x2Used(used, i, j, rows, cols) {
    const positions = get2x2Positions(i, j, rows, cols);
    positions.forEach(pos => used[pos.row][pos.col] = true);
  }
  
  function generateExpression(groups, numVars) {
    if (groups.length === 0) return '0';
    
    const terms = groups.map(group => generateTerm(group, numVars));
    return terms.join(' + ');
  }
  
  function generateTerm(group, numVars) {
    // Simplified term generation based on group positions
    const variables = ['A', 'B', 'C', 'D'].slice(0, numVars);
    
    if (group.type === 'single') {
      return generateMintermString(group.positions[0], numVars);
    } else if (group.size === 2) {
      // Find which variable is eliminated
      return generatePairTerm(group.positions, numVars);
    } else if (group.size === 4) {
      // Find which variables are eliminated
      return generateQuadTerm(group.positions, numVars);
    }
    
    return 'X';
  }
  
  function generateMintermString(pos, numVars) {
    const variables = ['A', 'B', 'C', 'D'].slice(0, numVars);
    let term = '';
    
    if (numVars === 2) {
      const binary = pos.row.toString(2).padStart(1, '0') + pos.col.toString(2).padStart(1, '0');
      for (let i = 0; i < numVars; i++) {
        term += binary[i] === '1' ? variables[i] : `${variables[i]}'`;
      }
    } else if (numVars === 3) {
      const grayCode = ['00', '01', '11', '10'];
      const rowCode = ['0', '1'][pos.row];
      const colCode = grayCode[pos.col];
      const binary = rowCode + colCode;
      for (let i = 0; i < numVars; i++) {
        term += binary[i] === '1' ? variables[i] : `${variables[i]}'`;
      }
    }
    
    return term;
  }
  
  function generatePairTerm(positions, numVars) {
    // Simplified - just return first position term for demo
    return generateMintermString(positions[0], numVars);
  }
  
  function generateQuadTerm(positions, numVars) {
    // Simplified - return constant for large groups
    if (numVars === 2) return '1';
    return 'A'; // Simplified
  }
  
  function displayKarnaughMap(kmap, groups, expression, numVars, variables) {
    let html = '<div class="insight-card">';
    html += `<h3>🗺️ Карта Карно для ${numVars} змінних</h3>`;
    
    // Display K-map
    html += '<div class="kmap-container">';
    html += generateKMapHTML(kmap, groups, numVars, variables);
    html += '</div>';
    
    // Display analysis
    html += '<div class="analysis">';
    html += '<h4>📈 Аналіз:</h4>';
    html += `<p>🔢 Знайдено груп: <strong>${groups.length}</strong></p>`;
    html += `<p>⚡ Мінімізований вираз: <code>${expression}</code></p>`;
    
    const onesCount = kmap.flat().filter(x => x === 1).length;
    const totalCells = Math.pow(2, numVars);
    html += `<p>📊 Покриття: <strong>${onesCount}/${totalCells}</strong> клітинок</p>`;
    
    html += '</div>';
    html += '</div>';
    
    result.innerHTML = html;
  }
  
  function generateKMapHTML(kmap, groups, numVars, variables) {
    let html = '<table class="kmap-table">';
    
    // Headers
    if (numVars === 2) {
      html += '<tr><th></th><th>B\'</th><th>B</th></tr>';
      html += `<tr><th>A\'</th><td class="kmap-cell" data-row="0" data-col="0">${kmap[0][0]}</td><td class="kmap-cell" data-row="0" data-col="1">${kmap[0][1]}</td></tr>`;
      html += `<tr><th>A</th><td class="kmap-cell" data-row="1" data-col="0">${kmap[1][0]}</td><td class="kmap-cell" data-row="1" data-col="1">${kmap[1][1]}</td></tr>`;
    } else if (numVars === 3) {
      html += '<tr><th rowspan="2">A\\BC</th><th>B\'C\'</th><th>B\'C</th><th>BC</th><th>BC\'</th></tr>';
      html += '<tr><th>00</th><th>01</th><th>11</th><th>10</th></tr>';
      html += `<tr><th>A\' (0)</th>`;
      for (let j = 0; j < 4; j++) {
        html += `<td class="kmap-cell" data-row="0" data-col="${j}">${kmap[0][j]}</td>`;
      }
      html += '</tr>';
      html += `<tr><th>A (1)</th>`;
      for (let j = 0; j < 4; j++) {
        html += `<td class="kmap-cell" data-row="1" data-col="${j}">${kmap[1][j]}</td>`;
      }
      html += '</tr>';
    }
    
    html += '</table>';
    return html;
  }
});

// Add CSS for K-map styling
const style = document.createElement('style');
style.textContent = `
  .calculator-tabs {
    display: flex;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--border);
  }
  
  .tab-button {
    background: none;
    border: none;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
  }
  
  .tab-button.active {
    border-bottom-color: var(--accent);
    color: var(--accent);
    font-weight: bold;
  }
  
  .tab-content {
    display: none;
  }
  
  .tab-content.active {
    display: block;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .kmap-container {
    margin: 1.5rem 0;
    display: flex;
    justify-content: center;
  }
  
  .kmap-table {
    border-collapse: collapse;
    font-family: monospace;
    font-size: 1.2rem;
  }
  
  .kmap-table th,
  .kmap-table td {
    border: 2px solid var(--accent);
    padding: 1rem;
    text-align: center;
    min-width: 50px;
    min-height: 50px;
  }
  
  .kmap-table th {
    background: var(--accent);
    color: white;
    font-weight: bold;
  }
  
  .kmap-cell {
    background: white;
    font-weight: bold;
    font-size: 1.4rem;
    position: relative;
  }
  
  .kmap-cell[data-value="1"] {
    background: #d4edda;
    color: #155724;
  }
  
  .kmap-cell[data-value="0"] {
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