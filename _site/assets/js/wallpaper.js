document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('wallpaper-form');
  const result = document.getElementById('wallpaper-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const wallArea = parseFloat(document.getElementById('wallpaper-wall-area').value);
      const rollLength = parseFloat(document.getElementById('wallpaper-roll-length').value);
      const rollWidth = parseFloat(document.getElementById('wallpaper-roll-width').value);
      if (wallArea <= 0 || rollLength <= 0 || rollWidth <= 0) {
        result.textContent = "Введіть всі параметри.";
        return;
      }
      const rollArea = rollLength * rollWidth;
      const rolls = wallArea / rollArea;
      result.innerHTML = `<b>Потрібно рулонів шпалер:</b> ${Math.ceil(rolls)} шт.`;
    });
  }
});
