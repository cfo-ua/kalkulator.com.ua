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
    };
    return row;
  }

  if (addBtn) {
    addBtn.onclick = function () {
      list.appendChild(createRow());
    };
  }

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
