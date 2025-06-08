document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('bricks-form');
  const result = document.getElementById('bricks-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const area = parseFloat(document.getElementById('bricks-area').value);
      const type = document.getElementById('bricks-type').value;
      const joint = parseFloat(document.getElementById('bricks-joint').value) || 0;
      if (area <= 0) {
        result.textContent = "Введіть площу стіни.";
        return;
      }
      // Dimensions in mm
      let brickDim = { "250x120x65": [250, 65], "250x120x88": [250, 88], "250x120x140": [250, 140]};
      let [length, height] = brickDim[type];
      // Include mortar joint
      let brickArea = ((length + joint) / 1000) * ((height + joint) / 1000);
      let bricks = area / brickArea;
      result.innerHTML = `<b>Потрібно цегли:</b> ${Math.ceil(bricks)} шт.`;
    });
  }
});
