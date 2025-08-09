document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('room-area-form');
  const result = document.getElementById('room-area-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('room-length').value);
      const width = parseFloat(document.getElementById('room-width').value);
      if (length <= 0 || width <= 0) {
        result.textContent = "Please enter positive values for length and width.";
        return;
      }
      const area = length * width;
      const areaSquareMeters = area * 0.092903; // Convert sq ft to sq m
      result.innerHTML = `
        <div class="result-section">
          <p><strong>Room Area:</strong> ${area.toFixed(2)} sq ft</p>
          <p><strong>Room Area:</strong> ${areaSquareMeters.toFixed(2)} m²</p>
        </div>
        <div class="result-tips">
          <p><em>💡 Add 5-10% extra material for cuts and waste</em></p>
          <p><em>📏 For flooring: ${(area * 1.1).toFixed(0)} sq ft recommended</em></p>
        </div>
      `;
    });
  }
});