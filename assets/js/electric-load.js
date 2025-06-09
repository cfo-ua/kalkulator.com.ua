document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('electric-load-form');
  const addBtn = document.getElementById('add-appliance');
  const list = document.getElementById('electric-load-list');
  const result = document.getElementById('electric-load-result');

  function createRow() {
    const row = document.createElement('div');
    row.className = 'electric-load-row';
    row.innerHTML = `
      <input type="text" class="electric-appliance" placeholder="Назва приладу" />
      <input type="number" class="electric-power" min="0" step="any" placeholder="Потужність, Вт" />
      <button type="button" class="remove-appliance" title="Видалити">–</button>
    `;
    row.querySelector('.remove-appliance').onclick = function () {
      row.remove();
      // If no rows left, always leave one empty row
      if (list.querySelectorAll('.electric-load-row').length === 0) {
        list.appendChild(createBaseRow());
      }
    };
    return row;
  }

  function createBaseRow() {
    // Same as createRow but without remove button (cannot remove last row)
    const row = document.createElement('div');
    row.className = 'electric-load-row';
    row.innerHTML = `
      <input type="text" class="electric-appliance" placeholder="Назва приладу" />
      <input type="number" class="electric-power" min="0" step="any" placeholder="Потужність, Вт" />
    `;
    return row;
  }

  // Simplify structure: initial form has one row, only extra rows have remove button
  function updateRemoveButtons() {
    const rows = list.querySelectorAll('.electric-load-row');
    rows.forEach((row, idx) => {
      const btn = row.querySelector('.remove-appliance');
      if (btn) {
        btn.style.display = rows.length > 1 ? "" : "none";
      }
    });
  }

  if (addBtn) {
    addBtn.onclick = function () {
      const row = createRow();
      list.appendChild(row);
      updateRemoveButtons();
    };
  }

  // Initialize: ensure only one base row at start, no remove button
  (function initRows() {
    // Remove any remove button from the first row
    const firstRow = list.querySelector('.electric-load-row');
    if (firstRow) {
      const btn = firstRow.querySelector('.remove-appliance');
      if (btn) btn.remove();
    }
  })();

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const powers = Array.from(list.querySelectorAll('.electric-power'));
      let totalWatt = 0;
      let valid = false;
      powers.forEach(input => {
        const v = parseFloat(input.value);
        if (v > 0) {
          totalWatt += v;
          valid = true;
        }
      });
      const simult = parseFloat(document.getElementById('electric-simultaneous').value) || 1;
      if (!valid) {
        result.textContent = "Вкажіть потужність хоча б одного приладу.";
        return;
      }
      const totalKW = (totalWatt * simult) / 1000;
      result.innerHTML = `<b>Необхідна потужність:</b> ${totalKW.toFixed(2)} кВт`;
    });
  }
});
