document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("astrology-sign-form");
  const result = document.getElementById("astrology-sign-result");

  const signs = [
    { name: "Capricorn", start: "12-22", end: "01-19", traits: "Ambitious, disciplined, practical, goal-oriented" },
    { name: "Aquarius", start: "01-20", end: "02-18", traits: "Independent, innovative, humanitarian, intellectual" },
    { name: "Pisces", start: "02-19", end: "03-20", traits: "Intuitive, compassionate, artistic, empathetic" },
    { name: "Aries", start: "03-21", end: "04-19", traits: "Energetic, pioneering, confident, leadership-oriented" },
    { name: "Taurus", start: "04-20", end: "05-20", traits: "Practical, reliable, pleasure-seeking, stable" },
    { name: "Gemini", start: "05-21", end: "06-20", traits: "Communicative, adaptable, intellectually curious, versatile" },
    { name: "Cancer", start: "06-21", end: "07-22", traits: "Nurturing, emotional, family-oriented, intuitive" },
    { name: "Leo", start: "07-23", end: "08-22", traits: "Confident, creative, generous, attention-seeking" },
    { name: "Virgo", start: "08-23", end: "09-22", traits: "Analytical, perfectionist, service-oriented, practical" },
    { name: "Libra", start: "09-23", end: "10-22", traits: "Harmonious, diplomatic, beauty-loving, balanced" },
    { name: "Scorpio", start: "10-23", end: "11-21", traits: "Intense, transformative, mysterious, passionate" },
    { name: "Sagittarius", start: "11-22", end: "12-21", traits: "Adventurous, philosophical, freedom-loving, optimistic" },
  ];

  function getSign(date) {
    const monthDay = date.toISOString().slice(5, 10); // "MM-DD"

    for (const sign of signs) {
      if (sign.start > sign.end) {
        // sign spans across year boundary (Capricorn)
        if (monthDay >= sign.start || monthDay <= sign.end) {
          return sign;
        }
      } else {
        if (monthDay >= sign.start && monthDay <= sign.end) {
          return sign;
        }
      }
    }
    return null;
  }

  function formatDateRange(start, end) {
    const formatDate = (monthDay) => {
      const [month, day] = monthDay.split('-');
      const date = new Date(2000, parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    };

    if (start > end) {
      // spans year boundary
      return `${formatDate(start)} - ${formatDate(end)}`;
    } else {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const birthDateInput = document.getElementById("birthdate").value;

    if (!birthDateInput) {
      result.innerHTML = '<p style="color: #e74c3c;">Please enter your birth date.</p>';
      return;
    }

    const birthDate = new Date(birthDateInput);
    const today = new Date();
    
    if (isNaN(birthDate)) {
      result.innerHTML = '<p style="color: #e74c3c;">Invalid date format.</p>';
      return;
    }

    if (birthDate > today) {
      result.innerHTML = '<p style="color: #e74c3c;">Birth date cannot be in the future.</p>';
      return;
    }

    const signData = getSign(birthDate);
    if (!signData) {
      result.innerHTML = '<p style="color: #e74c3c;">Unable to determine zodiac sign.</p>';
      return;
    }

    const dateRange = formatDateRange(signData.start, signData.end);
    
    result.innerHTML = `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db;">
        <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Your Zodiac Sign: <span style="color: #3498db;">${signData.name}</span></h3>
        <p><strong>Date Range:</strong> ${dateRange}</p>
        <p><strong>Key Traits:</strong> ${signData.traits}</p>
        <p style="margin-bottom: 0; font-size: 0.9em; color: #7f8c8d;">
          <em>Astrology is for entertainment and self-reflection purposes. Your birth date determines your sun sign in Western astrology.</em>
        </p>
      </div>
    `;
  });
});