document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("visa-photo-form");
  const resultDiv = document.getElementById("visa-photo-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    showPhotoRequirements();
  });

  // Auto-calculate when inputs change for better UX
  const inputs = form.querySelectorAll('select, input');
  inputs.forEach(input => {
    input.addEventListener("change", function () {
      if (validateInputs()) {
        showPhotoRequirements();
      }
    });
  });

  function validateInputs() {
    const country = document.getElementById("destination-country").value;
    const visaType = document.getElementById("visa-type").value;
    return country && visaType;
  }

  function showPhotoRequirements() {
    const country = document.getElementById("destination-country").value;
    const visaType = document.getElementById("visa-type").value;
    const photoFormat = document.getElementById("photo-format").value;
    const quantity = parseInt(document.getElementById("photo-quantity").value) || 2;

    if (!validateInputs()) {
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, оберіть країну та тип візи.</p>';
      return;
    }

    const requirements = getPhotoRequirements(country, visaType);
    displayPhotoRequirements(requirements, photoFormat, quantity);
  }

  function getPhotoRequirements(country, visaType) {
    const requirements = {
      "usa": {
        name: "США",
        flag: "🇺🇸",
        dimensions: "51 x 51 мм (2 x 2 дюйма)",
        aspectRatio: "1:1 (квадрат)",
        background: "Білий",
        faceSize: "25-35 мм (50-69% фото)",
        headPosition: "По центру",
        eyeLevel: "28-35 мм від низу",
        expression: "Нейтральний",
        glasses: "Заборонені",
        headwear: "Тільки з релігійних причин",
        digitalSpecs: {
          format: "JPEG",
          minSize: "600 x 600 пікселів",
          maxFileSize: "240 KB",
          dpi: "Мінімум 300 DPI"
        },
        quantity: visaType === "student" ? 2 : 1,
        validity: "6 місяців",
        specialNotes: "Строгі вимоги до розміру голови та позиціонування"
      },
      "schengen": {
        name: "Шенгенська зона",
        flag: "🇪🇺",
        dimensions: "35 x 45 мм",
        aspectRatio: "7:9",
        background: "Світлий одноколірний (переважно білий)",
        faceSize: "32-36 мм (70-80% фото)",
        headPosition: "По центру, прямо",
        eyeLevel: "Між 28-35 мм від низу",
        expression: "Нейтральний, рот закритий",
        glasses: "Без відблисків, кращі без них",
        headwear: "Заборонено (винятки з релігійних причин)",
        digitalSpecs: {
          format: "JPEG або TIFF",
          minSize: "413 x 531 пікселів",
          maxFileSize: "10 MB",
          dpi: "Мінімум 300 DPI"
        },
        quantity: 2,
        validity: "6 місяців",
        specialNotes: "Стандарт ICAO для біометричних фото"
      },
      "uk": {
        name: "Великобританія",
        flag: "🇬🇧",
        dimensions: "45 x 35 мм",
        aspectRatio: "9:7 (горизонтальна)",
        background: "Світло-сірий або кремовий",
        faceSize: "29-34 мм (70-80% фото)",
        headPosition: "По центру",
        eyeLevel: "Між 21-28 мм від низу",
        expression: "Нейтральний",
        glasses: "Заборонені",
        headwear: "Тільки з релігійних причин",
        digitalSpecs: {
          format: "JPEG",
          minSize: "531 x 413 пікселів",
          maxFileSize: "10 MB",
          dpi: "Мінімум 300 DPI"
        },
        quantity: 2,
        validity: "1 місяць",
        specialNotes: "Унікальний горизонтальний формат"
      },
      "canada": {
        name: "Канада",
        flag: "🇨🇦",
        dimensions: "35 x 45 мм",
        aspectRatio: "7:9",
        background: "Білий або світло-сірий",
        faceSize: "31-36 мм (70-80% фото)",
        headPosition: "По центру",
        eyeLevel: "Між 28-35 мм від низу",
        expression: "Нейтральний",
        glasses: "Без відблисків",
        headwear: "З релігійних причин",
        digitalSpecs: {
          format: "JPEG",
          minSize: "420 x 540 пікселів",
          maxFileSize: "4 MB",
          dpi: "Мінімум 600 DPI"
        },
        quantity: visaType === "work" ? 3 : 2,
        validity: "6 місяців",
        specialNotes: "Підпис фотографа може бути потрібним"
      },
      "australia": {
        name: "Австралія",
        flag: "🇦🇺",
        dimensions: "35 x 45 мм",
        aspectRatio: "7:9",
        background: "Білий або світло-сірий",
        faceSize: "32-36 мм (70-80% фото)",
        headPosition: "По центру",
        eyeLevel: "Між 28-35 мм від низу",
        expression: "Нейтральний",
        glasses: "Без відблисків",
        headwear: "З релігійних причин",
        digitalSpecs: {
          format: "JPEG",
          minSize: "900 x 1200 пікселів",
          maxFileSize: "2 MB",
          dpi: "Мінімум 600 DPI"
        },
        quantity: 2,
        validity: "6 місяців",
        specialNotes: "Високі вимоги до якості та роздільної здатності"
      },
      "china": {
        name: "Китай",
        flag: "🇨🇳",
        dimensions: "33 x 48 мм",
        aspectRatio: "11:16",
        background: "Білий",
        faceSize: "28-33 мм (70-80% фото)",
        headPosition: "По центру",
        eyeLevel: "Між 26-33 мм від низу",
        expression: "Нейтральний",
        glasses: "Без відблисків",
        headwear: "Заборонено",
        digitalSpecs: {
          format: "JPEG",
          minSize: "390 x 567 пікселів",
          maxFileSize: "1 MB",
          dpi: "Мінімум 300 DPI"
        },
        quantity: 2,
        validity: "6 місяців",
        specialNotes: "Унікальний розмір, притаманний Китаю"
      }
    };

    // Default requirements for countries not specifically listed
    const defaultRequirements = {
      name: "Стандартні міжнародні",
      flag: "🌍",
      dimensions: "35 x 45 мм",
      aspectRatio: "7:9",
      background: "Білий або світло-сірий",
      faceSize: "32-36 мм (70-80% фото)",
      headPosition: "По центру",
      eyeLevel: "Між 28-35 мм від низу",
      expression: "Нейтральний",
      glasses: "Без відблисків",
      headwear: "З релігійних причин",
      digitalSpecs: {
        format: "JPEG",
        minSize: "413 x 531 пікселів",
        maxFileSize: "10 MB",
        dpi: "Мінімум 300 DPI"
      },
      quantity: 2,
      validity: "6 місяців",
      specialNotes: "Стандартні міжнародні вимоги"
    };

    return requirements[country] || defaultRequirements;
  }

  function displayPhotoRequirements(req, format, quantity) {
    const formatInfo = getFormatSpecificInfo(format, req);
    
    resultDiv.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h3>${req.flag} ${req.name}</h3>
          <p><strong>Розмір:</strong> ${req.dimensions}</p>
          <p><strong>Кількість:</strong> ${Math.max(quantity, req.quantity)} фото</p>
          <p><strong>Формат:</strong> ${req.aspectRatio}</p>
        </div>
      </div>

      <div class="detailed-requirements">
        <h4>📐 Точні розміри та позиціонування:</h4>
        
        <div class="size-specs">
          <div class="spec-item">
            <strong>📏 Розміри фото:</strong> ${req.dimensions}
            <br><small>Співвідношення сторін: ${req.aspectRatio}</small>
          </div>
          
          <div class="spec-item">
            <strong>👤 Розмір обличчя:</strong> ${req.faceSize}
            <br><small>Від підборіддя до верху голови</small>
          </div>
          
          <div class="spec-item">
            <strong>👀 Позиція очей:</strong> ${req.eyeLevel}
            <br><small>Відстань від нижнього краю фото</small>
          </div>
        </div>

        <h4>🎨 Вимоги до якості та оформлення:</h4>
        
        <div class="quality-requirements">
          <div class="quality-item">
            <strong>🎭 Фон:</strong> ${req.background}
          </div>
          
          <div class="quality-item">
            <strong>📍 Позиція голови:</strong> ${req.headPosition}
          </div>
          
          <div class="quality-item">
            <strong>😐 Вираз обличчя:</strong> ${req.expression}
          </div>
          
          <div class="quality-item">
            <strong>👓 Окуляри:</strong> ${req.glasses}
          </div>
          
          <div class="quality-item">
            <strong>👒 Головний убір:</strong> ${req.headwear}
          </div>
          
          <div class="quality-item">
            <strong>📅 Свіжість фото:</strong> Не старше ${req.validity}
          </div>
        </div>

        ${formatInfo}

        <div class="special-notes">
          <h4>⚠️ Особливі вимоги:</h4>
          <p>${req.specialNotes}</p>
        </div>

        <div class="photo-tips">
          <h4>💡 Поради для ідеального фото:</h4>
          <ul>
            <li><strong>Освітлення:</strong> Рівномірне, без тіней на обличчі та фоні</li>
            <li><strong>Одяг:</strong> Контрастний до фону, уникайте білого кольору</li>
            <li><strong>Макіяж:</strong> Природний, не яскравий</li>
            <li><strong>Зачіска:</strong> Не закривайте обличчя, особливо очі</li>
            <li><strong>Позиція:</strong> Дивіться прямо в камеру, тримайтесь прямо</li>
            <li><strong>Якість:</strong> Чітке зображення без розмиття</li>
          </ul>
        </div>

        <div class="cost-estimate">
          <h4>💰 Орієнтовна вартість:</h4>
          <ul>
            <li><strong>Фотостудія:</strong> 200-500 грн за комплект</li>
            <li><strong>Експрес-фото:</strong> 100-300 грн за комплект</li>
            <li><strong>Самостійно:</strong> Безкоштовно (потрібна якісна камера)</li>
          </ul>
        </div>
      </div>
    `;
  }

  function getFormatSpecificInfo(format, req) {
    if (format === "digital" || format === "both") {
      return `
        <div class="digital-specs">
          <h4>💻 Цифрові специфікації:</h4>
          <div class="digital-item">
            <strong>📄 Формат файлу:</strong> ${req.digitalSpecs.format}
          </div>
          
          <div class="digital-item">
            <strong>📐 Мінімальний розмір:</strong> ${req.digitalSpecs.minSize}
          </div>
          
          <div class="digital-item">
            <strong>💾 Максимальний розмір файлу:</strong> ${req.digitalSpecs.maxFileSize}
          </div>
          
          <div class="digital-item">
            <strong>🔍 Роздільна здатність:</strong> ${req.digitalSpecs.dpi}
          </div>
        </div>
      `;
    } else if (format === "print") {
      return `
        <div class="print-specs">
          <h4>🖨️ Вимоги до друку:</h4>
          <ul>
            <li><strong>Папір:</strong> Матовий або глянцевий фотопапір</li>
            <li><strong>Якість друку:</strong> Фотографічна якість, без пікселізації</li>
            <li><strong>Обрізка:</strong> Точно за розмірами без білих країв</li>
            <li><strong>Кольоровість:</strong> Повнокольорове зображення</li>
          </ul>
        </div>
      `;
    }
    return "";
  }
});