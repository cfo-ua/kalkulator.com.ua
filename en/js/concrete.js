document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('concrete-form');
  const result = document.getElementById('concrete-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('concrete-length').value);
      const width = parseFloat(document.getElementById('concrete-width').value);
      const height = parseFloat(document.getElementById('concrete-height').value);
      if (length <= 0 || width <= 0 || height <= 0) {
        result.textContent = "Please enter all dimensions with positive values.";
        return;
      }
      const volumeCubicFeet = length * width * height;
      const volumeCubicYards = volumeCubicFeet / 27;
      const volumeCubicMeters = volumeCubicFeet * 0.0283168;
      const extraVolumeCubicYards = volumeCubicYards * 1.1; // 10% extra
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Concrete Volume Needed:</h4>
          <p><strong>${volumeCubicYards.toFixed(2)} cubic yards</strong></p>
          <p><strong>${volumeCubicMeters.toFixed(2)} cubic meters</strong></p>
          <p>${volumeCubicFeet.toFixed(1)} cubic feet</p>
        </div>
        <div class="result-recommendations">
          <h4>Ordering Recommendations:</h4>
          <p><strong>Order: ${extraVolumeCubicYards.toFixed(2)} cubic yards</strong> <em>(includes 10% extra)</em></p>
          <p>🚛 Trucks needed: ${Math.ceil(extraVolumeCubicYards / 10)} (assuming 10 yd³ trucks)</p>
        </div>
        <div class="result-tips">
          <p><em>💡 Always order 5-10% extra concrete for waste and variations</em></p>
          <p><em>📞 Call your ready-mix supplier to confirm truck capacity and delivery schedule</em></p>
        </div>
      `;
    });
  }
});