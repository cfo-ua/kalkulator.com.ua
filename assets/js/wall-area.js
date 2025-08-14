document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('wall-area-form');
  const result = document.getElementById('wall-area-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const length = parseFloat(document.getElementById('wall-length').value);
      const width = parseFloat(document.getElementById('wall-width').value);
      const height = parseFloat(document.getElementById('wall-height').value);
      const doors = parseFloat(document.getElementById('wall-doors').value) || 0;
      
      if (length <= 0 || width <= 0 || height <= 0) {
        result.innerHTML = `
          <div style="background: #f8d7da; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; color: #721c24;">
            <strong>Помилка:</strong> Введіть довжину, ширину та висоту кімнати.
          </div>
        `;
        return;
      }
      
      // Calculations
      let perimeter = 2 * (length + width);
      let area = perimeter * height - doors;
      if (area < 0) area = 0;
      
      // Material calculations
      const paintCoverage = 12; // m² per liter for standard paint
      const paintNeeded = Math.ceil(area / paintCoverage);
      const paintLiters = (area / paintCoverage).toFixed(1);
      
      // Wallpaper calculations (standard roll covers ~5.3 m²)
      const wallpaperCoverage = 5.3;
      const wallpaperRolls = Math.ceil(area / wallpaperCoverage);
      
      // Tile calculations (assuming 20x20cm tiles)
      const tileSize = 0.04; // m² per tile (20cm x 20cm)
      const tilesNeeded = Math.ceil(area / tileSize);
      const tileBoxes = Math.ceil(tilesNeeded / 25); // 25 tiles per box typically
      
      result.innerHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Результати розрахунку</h3>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #28a745; margin: 15px 0; text-align: center;">
            <div style="font-size: 2.5em; font-weight: bold; color: #28a745; margin-bottom: 10px;">
              ${area.toFixed(2)} м²
            </div>
            <div style="color: #28a745; font-weight: bold; font-size: 1.2em;">Площа стін</div>
            <div style="color: #666; font-size: 0.9em; margin-top: 5px;">
              Периметр: ${perimeter.toFixed(1)} м | Висота: ${height} м
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #007bff;">🎨 Матеріали для фарбування</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.5em; font-weight: bold; color: #1976d2;">${paintLiters} л</div>
                <div style="color: #1976d2; font-weight: bold;">Фарба (1 шар)</div>
                <div style="color: #666; font-size: 0.9em;">Округліть до ${paintNeeded} л</div>
              </div>
              <div style="background: #f3e5f5; padding: 15px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.5em; font-weight: bold; color: #8e24aa;">${(paintLiters * 2).toFixed(1)} л</div>
                <div style="color: #8e24aa; font-weight: bold;">Фарба (2 шари)</div>
                <div style="color: #666; font-size: 0.9em;">Рекомендовано</div>
              </div>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #ff9800; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #ff9800;">📜 Матеріали для шпалер</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div style="background: #fff3e0; padding: 15px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.5em; font-weight: bold; color: #f57c00;">${wallpaperRolls}</div>
                <div style="color: #f57c00; font-weight: bold;">Рулонів шпалер</div>
                <div style="color: #666; font-size: 0.9em;">Стандартний рулон ~5.3 м²</div>
              </div>
              <div style="background: #fce4ec; padding: 15px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.5em; font-weight: bold; color: #c2185b;">${Math.ceil(wallpaperRolls * 1.1)}</div>
                <div style="color: #c2185b; font-weight: bold;">З запасом 10%</div>
                <div style="color: #666; font-size: 0.9em;">Рекомендовано</div>
              </div>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #795548; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #795548;">🏗️ Матеріали для плитки</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div style="background: #efebe9; padding: 15px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.5em; font-weight: bold; color: #5d4037;">${tilesNeeded}</div>
                <div style="color: #5d4037; font-weight: bold;">Плиток 20×20 см</div>
                <div style="color: #666; font-size: 0.9em;">~${tileBoxes} коробок</div>
              </div>
              <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.5em; font-weight: bold; color: #2e7d32;">${Math.ceil(tilesNeeded * 1.1)}</div>
                <div style="color: #2e7d32; font-weight: bold;">З запасом 10%</div>
                <div style="color: #666; font-size: 0.9em;">Рекомендовано</div>
              </div>
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 15px;">
            <h4 style="margin-top: 0; color: #856404;">💡 Корисні поради</h4>
            <ul style="margin: 5px 0; color: #856404; font-size: 0.9em;">
              <li><strong>Фарба:</strong> Завжди купуйте на 10-15% більше для підкрашування</li>
              <li><strong>Шпалери:</strong> Враховуйте рапорт (повторення малюнка) при розрахунку</li>
              <li><strong>Плитка:</strong> Додайте 5-10% запасу на бій та підрізку</li>
              <li><strong>Поверхня:</strong> Для нерівних стін додайте 5-10% до розрахунків</li>
            </ul>
          </div>
          
          <div style="background: #e1ecf4; padding: 15px; border-radius: 6px; margin-top: 15px;">
            <h4 style="margin-top: 0; color: #004085;">📏 Деталі розрахунку</h4>
            <p style="margin: 5px 0; color: #495057; font-size: 0.9em;">
              <strong>Формула:</strong> Площа = 2 × (довжина + ширина) × висота - площа отворів<br>
              <strong>Ваш розрахунок:</strong> 2 × (${length} + ${width}) × ${height} - ${doors} = ${area.toFixed(2)} м²
            </p>
          </div>
        </div>
      `;
    });
  }
});
