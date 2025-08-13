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
      resultDiv.innerHTML = '<p style="color: red;">Please select country and visa type.</p>';
      return;
    }

    const requirements = getPhotoRequirements(country, visaType);
    displayPhotoRequirements(requirements, photoFormat, quantity);
  }

  function getPhotoRequirements(country, visaType) {
    const requirements = {
      "usa": {
        name: "United States",
        flag: "🇺🇸",
        dimensions: "51 x 51 mm (2 x 2 inches)",
        aspectRatio: "1:1 (square)",
        background: "White",
        faceSize: "25-35 mm (50-69% of photo)",
        headPosition: "Centered",
        eyeLevel: "28-35 mm from bottom",
        expression: "Neutral",
        glasses: "Prohibited",
        headwear: "Only for religious reasons",
        digitalSpecs: {
          format: "JPEG",
          minSize: "600 x 600 pixels",
          maxFileSize: "240 KB",
          dpi: "Minimum 300 DPI"
        },
        quantity: visaType === "student" ? 2 : 1,
        validity: "6 months",
        specialNotes: "Strict requirements for head size and positioning"
      },
      "schengen": {
        name: "Schengen Area",
        flag: "🇪🇺",
        dimensions: "35 x 45 mm",
        aspectRatio: "7:9",
        background: "Light solid color (preferably white)",
        faceSize: "32-36 mm (70-80% of photo)",
        headPosition: "Centered, straight",
        eyeLevel: "Between 28-35 mm from bottom",
        expression: "Neutral, mouth closed",
        glasses: "Without glare, better without",
        headwear: "Prohibited (religious exceptions)",
        digitalSpecs: {
          format: "JPEG or TIFF",
          minSize: "413 x 531 pixels",
          maxFileSize: "10 MB",
          dpi: "Minimum 300 DPI"
        },
        quantity: 2,
        validity: "6 months",
        specialNotes: "ICAO standard for biometric photos"
      },
      "uk": {
        name: "United Kingdom",
        flag: "🇬🇧",
        dimensions: "45 x 35 mm",
        aspectRatio: "9:7 (landscape)",
        background: "Light gray or cream",
        faceSize: "29-34 mm (70-80% of photo)",
        headPosition: "Centered",
        eyeLevel: "Between 21-28 mm from bottom",
        expression: "Neutral",
        glasses: "Prohibited",
        headwear: "Only for religious reasons",
        digitalSpecs: {
          format: "JPEG",
          minSize: "531 x 413 pixels",
          maxFileSize: "10 MB",
          dpi: "Minimum 300 DPI"
        },
        quantity: 2,
        validity: "1 month",
        specialNotes: "Unique landscape format"
      },
      "canada": {
        name: "Canada",
        flag: "🇨🇦",
        dimensions: "35 x 45 mm",
        aspectRatio: "7:9",
        background: "White or light gray",
        faceSize: "31-36 mm (70-80% of photo)",
        headPosition: "Centered",
        eyeLevel: "Between 28-35 mm from bottom",
        expression: "Neutral",
        glasses: "Without glare",
        headwear: "For religious reasons",
        digitalSpecs: {
          format: "JPEG",
          minSize: "420 x 540 pixels",
          maxFileSize: "4 MB",
          dpi: "Minimum 600 DPI"
        },
        quantity: visaType === "work" ? 3 : 2,
        validity: "6 months",
        specialNotes: "Photographer's signature may be required"
      },
      "australia": {
        name: "Australia",
        flag: "🇦🇺",
        dimensions: "35 x 45 mm",
        aspectRatio: "7:9",
        background: "White or light gray",
        faceSize: "32-36 mm (70-80% of photo)",
        headPosition: "Centered",
        eyeLevel: "Between 28-35 mm from bottom",
        expression: "Neutral",
        glasses: "Without glare",
        headwear: "For religious reasons",
        digitalSpecs: {
          format: "JPEG",
          minSize: "900 x 1200 pixels",
          maxFileSize: "2 MB",
          dpi: "Minimum 600 DPI"
        },
        quantity: 2,
        validity: "6 months",
        specialNotes: "High quality and resolution requirements"
      },
      "china": {
        name: "China",
        flag: "🇨🇳",
        dimensions: "33 x 48 mm",
        aspectRatio: "11:16",
        background: "White",
        faceSize: "28-33 mm (70-80% of photo)",
        headPosition: "Centered",
        eyeLevel: "Between 26-33 mm from bottom",
        expression: "Neutral",
        glasses: "Without glare",
        headwear: "Prohibited",
        digitalSpecs: {
          format: "JPEG",
          minSize: "390 x 567 pixels",
          maxFileSize: "1 MB",
          dpi: "Minimum 300 DPI"
        },
        quantity: 2,
        validity: "6 months",
        specialNotes: "Unique size specific to China"
      }
    };

    // Default requirements for countries not specifically listed
    const defaultRequirements = {
      name: "Standard International",
      flag: "🌍",
      dimensions: "35 x 45 mm",
      aspectRatio: "7:9",
      background: "White or light gray",
      faceSize: "32-36 mm (70-80% of photo)",
      headPosition: "Centered",
      eyeLevel: "Between 28-35 mm from bottom",
      expression: "Neutral",
      glasses: "Without glare",
      headwear: "For religious reasons",
      digitalSpecs: {
        format: "JPEG",
        minSize: "413 x 531 pixels",
        maxFileSize: "10 MB",
        dpi: "Minimum 300 DPI"
      },
      quantity: 2,
      validity: "6 months",
      specialNotes: "Standard international requirements"
    };

    return requirements[country] || defaultRequirements;
  }

  function displayPhotoRequirements(req, format, quantity) {
    const formatInfo = getFormatSpecificInfo(format, req);
    
    resultDiv.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h3>${req.flag} ${req.name}</h3>
          <p><strong>Size:</strong> ${req.dimensions}</p>
          <p><strong>Quantity:</strong> ${Math.max(quantity, req.quantity)} photos</p>
          <p><strong>Format:</strong> ${req.aspectRatio}</p>
        </div>
      </div>

      <div class="detailed-requirements">
        <h4>📐 Exact Dimensions and Positioning:</h4>
        
        <div class="size-specs">
          <div class="spec-item">
            <strong>📏 Photo Size:</strong> ${req.dimensions}
            <br><small>Aspect ratio: ${req.aspectRatio}</small>
          </div>
          
          <div class="spec-item">
            <strong>👤 Face Size:</strong> ${req.faceSize}
            <br><small>From chin to top of head</small>
          </div>
          
          <div class="spec-item">
            <strong>👀 Eye Position:</strong> ${req.eyeLevel}
            <br><small>Distance from bottom edge of photo</small>
          </div>
        </div>

        <h4>🎨 Quality and Style Requirements:</h4>
        
        <div class="quality-requirements">
          <div class="quality-item">
            <strong>🎭 Background:</strong> ${req.background}
          </div>
          
          <div class="quality-item">
            <strong>📍 Head Position:</strong> ${req.headPosition}
          </div>
          
          <div class="quality-item">
            <strong>😐 Facial Expression:</strong> ${req.expression}
          </div>
          
          <div class="quality-item">
            <strong>👓 Glasses:</strong> ${req.glasses}
          </div>
          
          <div class="quality-item">
            <strong>👒 Headwear:</strong> ${req.headwear}
          </div>
          
          <div class="quality-item">
            <strong>📅 Photo Age:</strong> Not older than ${req.validity}
          </div>
        </div>

        ${formatInfo}

        <div class="special-notes">
          <h4>⚠️ Special Requirements:</h4>
          <p>${req.specialNotes}</p>
        </div>

        <div class="photo-tips">
          <h4>💡 Tips for Perfect Photos:</h4>
          <ul>
            <li><strong>Lighting:</strong> Even lighting without shadows on face or background</li>
            <li><strong>Clothing:</strong> Contrast with background, avoid white color</li>
            <li><strong>Makeup:</strong> Natural, not bright</li>
            <li><strong>Hairstyle:</strong> Don't cover face, especially eyes</li>
            <li><strong>Position:</strong> Look directly at camera, keep straight posture</li>
            <li><strong>Quality:</strong> Sharp image without blur</li>
          </ul>
        </div>

        <div class="cost-estimate">
          <h4>💰 Estimated Costs:</h4>
          <ul>
            <li><strong>Photo Studio:</strong> $8-20 per set</li>
            <li><strong>Express Photo:</strong> $4-12 per set</li>
            <li><strong>DIY:</strong> Free (requires quality camera)</li>
          </ul>
        </div>
      </div>
    `;
  }

  function getFormatSpecificInfo(format, req) {
    if (format === "digital" || format === "both") {
      return `
        <div class="digital-specs">
          <h4>💻 Digital Specifications:</h4>
          <div class="digital-item">
            <strong>📄 File Format:</strong> ${req.digitalSpecs.format}
          </div>
          
          <div class="digital-item">
            <strong>📐 Minimum Size:</strong> ${req.digitalSpecs.minSize}
          </div>
          
          <div class="digital-item">
            <strong>💾 Maximum File Size:</strong> ${req.digitalSpecs.maxFileSize}
          </div>
          
          <div class="digital-item">
            <strong>🔍 Resolution:</strong> ${req.digitalSpecs.dpi}
          </div>
        </div>
      `;
    } else if (format === "print") {
      return `
        <div class="print-specs">
          <h4>🖨️ Print Requirements:</h4>
          <ul>
            <li><strong>Paper:</strong> Matte or glossy photo paper</li>
            <li><strong>Print Quality:</strong> Photo quality, no pixelation</li>
            <li><strong>Cutting:</strong> Exact dimensions without white borders</li>
            <li><strong>Color:</strong> Full color image</li>
          </ul>
        </div>
      `;
    }
    return "";
  }
});