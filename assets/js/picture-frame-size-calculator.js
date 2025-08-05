document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("frame-form");
  const result = document.getElementById("frame-result");
  const matStyleSelect = document.getElementById("mat-style");
  const customMatControls = document.getElementById("custom-mat-controls");

  // Show/hide custom mat controls
  matStyleSelect.addEventListener("change", function() {
    if (this.value === "custom") {
      customMatControls.style.display = "block";
      document.getElementById("mat-top").value = document.getElementById("mat-width").value;
      document.getElementById("mat-bottom").value = parseFloat(document.getElementById("mat-width").value) + 1;
    } else {
      customMatControls.style.display = "none";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const imageWidth = parseFloat(document.getElementById("image-width").value);
    const imageHeight = parseFloat(document.getElementById("image-height").value);
    const frameWidth = parseFloat(document.getElementById("frame-width").value);
    const matStyle = document.getElementById("mat-style").value;
    
    let matTop, matBottom, matLeft, matRight;
    
    if (matStyle === "custom") {
      matTop = parseFloat(document.getElementById("mat-top").value) || 0;
      matBottom = parseFloat(document.getElementById("mat-bottom").value) || 0;
      matLeft = matRight = parseFloat(document.getElementById("mat-width").value) || 0;
    } else {
      const baseMatWidth = parseFloat(document.getElementById("mat-width").value) || 0;
      matLeft = matRight = matTop = baseMatWidth;
      matBottom = matStyle === "bottom-heavy" ? baseMatWidth + 1 : baseMatWidth;
    }

    if (isNaN(imageWidth) || isNaN(imageHeight) || imageWidth <= 0 || imageHeight <= 0) {
      result.innerHTML = `
        <div class="insight-card warning">
          <h6>❌ Помилка</h6>
          <p>Будь ласка, введіть коректні розміри зображення.</p>
        </div>
      `;
      return;
    }

    // Calculate total dimensions
    const totalMatWidth = matLeft + matRight;
    const totalMatHeight = matTop + matBottom;
    const totalFrameWidth = imageWidth + totalMatWidth + (frameWidth * 2);
    const totalFrameHeight = imageHeight + totalMatHeight + (frameWidth * 2);
    
    // Calculate areas
    const imageArea = imageWidth * imageHeight;
    const frameArea = totalFrameWidth * totalFrameHeight;
    const matArea = (imageWidth + totalMatWidth) * (imageHeight + totalMatHeight) - imageArea;
    
    // Calculate aspect ratio
    const aspectRatio = imageWidth / imageHeight;
    const ratioText = aspectRatio > 1.4 ? "Панорамний" : 
                     aspectRatio > 1.1 ? "Альбомний" : 
                     aspectRatio < 0.8 ? "Портретний" : "Квадратний";
    
    // Wall space recommendation (add 20% around frame)
    const wallSpaceWidth = totalFrameWidth * 1.2;
    const wallSpaceHeight = totalFrameHeight * 1.2;

    // Generate visual representation
    const maxDisplaySize = 200;
    const scale = Math.min(maxDisplaySize / totalFrameWidth, maxDisplaySize / totalFrameHeight);
    const displayFrameWidth = totalFrameWidth * scale;
    const displayFrameHeight = totalFrameHeight * scale;
    const displayImageWidth = imageWidth * scale;
    const displayImageHeight = imageHeight * scale;
    const displayMatLeft = matLeft * scale;
    const displayMatTop = matTop * scale;
    const displayFrameThickness = frameWidth * scale;

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>📏 Загальний розмір рамки</h6>
          <div class="big-number">${totalFrameWidth.toFixed(1)}</div>
          <p>× ${totalFrameHeight.toFixed(1)} см</p>
        </div>
        
        <div class="insight-card">
          <h6>📐 Співвідношення сторін</h6>
          <div class="big-number">${aspectRatio.toFixed(2)}</div>
          <p>${ratioText}</p>
        </div>
        
        <div class="insight-card success">
          <h6>🖼️ Площа зображення</h6>
          <div class="big-number">${imageArea.toFixed(0)}</div>
          <p>см²</p>
        </div>
      </div>

      <div style="margin-top: 1.5rem;">
        <div class="insight-card">
          <h6>📋 Детальні розміри</h6>
          <div style="margin-top: 1rem;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; font-weight: bold;">Елемент</td>
                <td style="padding: 8px; font-weight: bold; text-align: center;">Ширина (см)</td>
                <td style="padding: 8px; font-weight: bold; text-align: center;">Висота (см)</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">🖼️ Зображення</td>
                <td style="padding: 8px; text-align: center;">${imageWidth}</td>
                <td style="padding: 8px; text-align: center;">${imageHeight}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">📄 З паспарту</td>
                <td style="padding: 8px; text-align: center;">${(imageWidth + totalMatWidth).toFixed(1)}</td>
                <td style="padding: 8px; text-align: center;">${(imageHeight + totalMatHeight).toFixed(1)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; font-weight: bold;">🪵 Загальний розмір</td>
                <td style="padding: 8px; text-align: center; font-weight: bold;">${totalFrameWidth.toFixed(1)}</td>
                <td style="padding: 8px; text-align: center; font-weight: bold;">${totalFrameHeight.toFixed(1)}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <div class="insight-card info">
          <h6>🎨 Візуальне представлення</h6>
          <div style="display: flex; justify-content: center; margin: 1rem 0;">
            <div style="position: relative; background: #8b4513; width: ${displayFrameWidth}px; height: ${displayFrameHeight}px; padding: ${displayFrameThickness}px; box-sizing: border-box;">
              <div style="background: #f5f5dc; width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="background: #e0e0e0; width: ${displayImageWidth}px; height: ${displayImageHeight}px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666;">
                  Зображення
                </div>
              </div>
            </div>
          </div>
          <p style="text-align: center; font-size: 0.9rem; color: #666;">
            Масштаб: ${(scale * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <div class="insight-card warning">
          <h6>🏠 Рекомендації для розміщення</h6>
          <ul style="margin: 0.5rem 0; padding-left: 1rem;">
            <li><strong>Мінімальний простір стіни:</strong> ${wallSpaceWidth.toFixed(1)} × ${wallSpaceHeight.toFixed(1)} см</li>
            <li><strong>Висота центру:</strong> 150-165 см від підлоги</li>
            <li><strong>Відстань від дивана:</strong> 20-25 см над спинкою</li>
            <li><strong>Освітлення:</strong> уникайте прямих сонячних променів</li>
          </ul>
        </div>
      </div>

      ${totalMatWidth > 0 ? `
        <div style="margin-top: 1rem;">
          <div class="insight-card">
            <h6>📐 Розміри паспарту</h6>
            <div style="margin-top: 0.5rem;">
              <p><strong>⬆️ Зверху:</strong> ${matTop} см</p>
              <p><strong>⬇️ Знизу:</strong> ${matBottom} см</p>
              <p><strong>⬅️ Зліва/справа:</strong> ${matLeft} см</p>
              <p><strong>📊 Площа паспарту:</strong> ${matArea.toFixed(0)} см²</p>
            </div>
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 1rem;">
        <div class="insight-card success">
          <h6>💡 Професійні поради</h6>
          <ul style="margin: 0.5rem 0; padding-left: 1rem;">
            <li>Для картин розміром ${imageWidth}×${imageHeight} см оптимальна ширина паспарту: ${Math.max(3, Math.min(imageWidth, imageHeight) * 0.15).toFixed(1)} см</li>
            <li>Ширина рамки ${frameWidth} см ${frameWidth < 1.5 ? 'підходить для легких зображень' : frameWidth > 4 ? 'створить акцент на рамці' : 'оптимальна для цього розміру'}</li>
            <li>Загальна вага рамки: приблизно ${(frameArea * 0.02).toFixed(1)} кг (залежить від матеріалу)</li>
            ${aspectRatio > 1.5 ? '<li>Панорамний формат краще сприймається на рівні очей</li>' : ''}
            ${aspectRatio < 0.8 ? '<li>Портретний формат можна розмістити трохи вище рівня очей</li>' : ''}
          </ul>
        </div>
      </div>
    `;
  });

  // Calculate on page load with default values
  form.dispatchEvent(new Event('submit'));
});