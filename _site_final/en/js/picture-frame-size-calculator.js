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
          <h6>❌ Error</h6>
          <p>Please enter valid image dimensions.</p>
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
    const ratioText = aspectRatio > 1.4 ? "Panoramic" : 
                     aspectRatio > 1.1 ? "Landscape" : 
                     aspectRatio < 0.8 ? "Portrait" : "Square";
    
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
          <h6>📏 Total Frame Size</h6>
          <div class="big-number">${totalFrameWidth.toFixed(1)}</div>
          <p>× ${totalFrameHeight.toFixed(1)} cm</p>
        </div>
        
        <div class="insight-card">
          <h6>📐 Aspect Ratio</h6>
          <div class="big-number">${aspectRatio.toFixed(2)}</div>
          <p>${ratioText}</p>
        </div>
        
        <div class="insight-card success">
          <h6>🖼️ Image Area</h6>
          <div class="big-number">${imageArea.toFixed(0)}</div>
          <p>cm²</p>
        </div>
      </div>

      <div style="margin-top: 1.5rem;">
        <div class="insight-card">
          <h6>📋 Detailed Dimensions</h6>
          <div style="margin-top: 1rem;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; font-weight: bold;">Component</td>
                <td style="padding: 8px; font-weight: bold; text-align: center;">Width (cm)</td>
                <td style="padding: 8px; font-weight: bold; text-align: center;">Height (cm)</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">🖼️ Image</td>
                <td style="padding: 8px; text-align: center;">${imageWidth}</td>
                <td style="padding: 8px; text-align: center;">${imageHeight}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">📄 With Mat</td>
                <td style="padding: 8px; text-align: center;">${(imageWidth + totalMatWidth).toFixed(1)}</td>
                <td style="padding: 8px; text-align: center;">${(imageHeight + totalMatHeight).toFixed(1)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; font-weight: bold;">🪵 Total Frame</td>
                <td style="padding: 8px; text-align: center; font-weight: bold;">${totalFrameWidth.toFixed(1)}</td>
                <td style="padding: 8px; text-align: center; font-weight: bold;">${totalFrameHeight.toFixed(1)}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <div class="insight-card info">
          <h6>🎨 Visual Preview</h6>
          <div style="display: flex; justify-content: center; margin: 1rem 0;">
            <div style="position: relative; background: #8b4513; width: ${displayFrameWidth}px; height: ${displayFrameHeight}px; padding: ${displayFrameThickness}px; box-sizing: border-box;">
              <div style="background: #f5f5dc; width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="background: #e0e0e0; width: ${displayImageWidth}px; height: ${displayImageHeight}px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666;">
                  Image
                </div>
              </div>
            </div>
          </div>
          <p style="text-align: center; font-size: 0.9rem; color: #666;">
            Scale: ${(scale * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <div class="insight-card warning">
          <h6>🏠 Hanging Recommendations</h6>
          <ul style="margin: 0.5rem 0; padding-left: 1rem;">
            <li><strong>Minimum wall space:</strong> ${wallSpaceWidth.toFixed(1)} × ${wallSpaceHeight.toFixed(1)} cm</li>
            <li><strong>Center height:</strong> 57-60 inches (145-152cm) from floor</li>
            <li><strong>Distance from sofa:</strong> 8-10 inches (20-25cm) above backrest</li>
            <li><strong>Lighting:</strong> Avoid direct sunlight and glare</li>
          </ul>
        </div>
      </div>

      ${totalMatWidth > 0 ? `
        <div style="margin-top: 1rem;">
          <div class="insight-card">
            <h6>📐 Mat Specifications</h6>
            <div style="margin-top: 0.5rem;">
              <p><strong>⬆️ Top:</strong> ${matTop} cm</p>
              <p><strong>⬇️ Bottom:</strong> ${matBottom} cm</p>
              <p><strong>⬅️ Left/Right:</strong> ${matLeft} cm</p>
              <p><strong>📊 Mat area:</strong> ${matArea.toFixed(0)} cm²</p>
            </div>
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 1rem;">
        <div class="insight-card success">
          <h6>💡 Professional Tips</h6>
          <ul style="margin: 0.5rem 0; padding-left: 1rem;">
            <li>For ${imageWidth}×${imageHeight}cm artwork, optimal mat width is ${Math.max(3, Math.min(imageWidth, imageHeight) * 0.15).toFixed(1)}cm</li>
            <li>Frame width of ${frameWidth}cm is ${frameWidth < 1.5 ? 'suitable for lightweight pieces' : frameWidth > 4 ? 'will emphasize the frame' : 'optimal for this size'}</li>
            <li>Estimated total weight: approximately ${(frameArea * 0.02).toFixed(1)}kg (varies by material)</li>
            ${aspectRatio > 1.5 ? '<li>Panoramic format works best at eye level</li>' : ''}
            ${aspectRatio < 0.8 ? '<li>Portrait format can be hung slightly above eye level</li>' : ''}
          </ul>
        </div>
      </div>
    `;
  });

  // Calculate on page load with default values
  form.dispatchEvent(new Event('submit'));
});