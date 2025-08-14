document.addEventListener("DOMContentLoaded", function () {
  const calculateBtn = document.getElementById("calculate-compatibility");
  const result = document.getElementById("compatibility-result");

  // Zodiac sign data with detailed compatibility information
  const zodiacSigns = [
    { name: "Capricorn", element: "earth", modality: "cardinal", ruler: "Saturn", dates: "Dec 22 - Jan 19" },
    { name: "Aquarius", element: "air", modality: "fixed", ruler: "Uranus", dates: "Jan 20 - Feb 18" },
    { name: "Pisces", element: "water", modality: "mutable", ruler: "Neptune", dates: "Feb 19 - Mar 20" },
    { name: "Aries", element: "fire", modality: "cardinal", ruler: "Mars", dates: "Mar 21 - Apr 19" },
    { name: "Taurus", element: "earth", modality: "fixed", ruler: "Venus", dates: "Apr 20 - May 20" },
    { name: "Gemini", element: "air", modality: "mutable", ruler: "Mercury", dates: "May 21 - Jun 20" },
    { name: "Cancer", element: "water", modality: "cardinal", ruler: "Moon", dates: "Jun 21 - Jul 22" },
    { name: "Leo", element: "fire", modality: "fixed", ruler: "Sun", dates: "Jul 23 - Aug 22" },
    { name: "Virgo", element: "earth", modality: "mutable", ruler: "Mercury", dates: "Aug 23 - Sep 22" },
    { name: "Libra", element: "air", modality: "cardinal", ruler: "Venus", dates: "Sep 23 - Oct 22" },
    { name: "Scorpio", element: "water", modality: "fixed", ruler: "Pluto", dates: "Oct 23 - Nov 21" },
    { name: "Sagittarius", element: "fire", modality: "mutable", ruler: "Jupiter", dates: "Nov 22 - Dec 21" }
  ];

  // Compatibility matrix based on traditional astrology
  const compatibilityMatrix = {
    "Aries": { "Aries": 75, "Taurus": 45, "Gemini": 85, "Cancer": 50, "Leo": 95, "Virgo": 40, "Libra": 80, "Scorpio": 60, "Sagittarius": 90, "Capricorn": 35, "Aquarius": 85, "Pisces": 55 },
    "Taurus": { "Aries": 45, "Taurus": 70, "Gemini": 40, "Cancer": 85, "Leo": 60, "Virgo": 90, "Libra": 75, "Scorpio": 80, "Sagittarius": 35, "Capricorn": 95, "Aquarius": 30, "Pisces": 85 },
    "Gemini": { "Aries": 85, "Taurus": 40, "Gemini": 65, "Cancer": 45, "Leo": 80, "Virgo": 55, "Libra": 95, "Scorpio": 50, "Sagittarius": 85, "Capricorn": 40, "Aquarius": 90, "Pisces": 50 },
    "Cancer": { "Aries": 50, "Taurus": 85, "Gemini": 45, "Cancer": 75, "Leo": 70, "Virgo": 80, "Libra": 60, "Scorpio": 95, "Sagittarius": 40, "Capricorn": 85, "Aquarius": 35, "Pisces": 90 },
    "Leo": { "Aries": 95, "Taurus": 60, "Gemini": 80, "Cancer": 70, "Leo": 80, "Virgo": 50, "Libra": 85, "Scorpio": 65, "Sagittarius": 95, "Capricorn": 45, "Aquarius": 80, "Pisces": 60 },
    "Virgo": { "Aries": 40, "Taurus": 90, "Gemini": 55, "Cancer": 80, "Leo": 50, "Virgo": 70, "Libra": 65, "Scorpio": 85, "Sagittarius": 45, "Capricorn": 90, "Aquarius": 40, "Pisces": 75 },
    "Libra": { "Aries": 80, "Taurus": 75, "Gemini": 95, "Cancer": 60, "Leo": 85, "Virgo": 65, "Libra": 75, "Scorpio": 70, "Sagittarius": 80, "Capricorn": 55, "Aquarius": 85, "Pisces": 70 },
    "Scorpio": { "Aries": 60, "Taurus": 80, "Gemini": 50, "Cancer": 95, "Leo": 65, "Virgo": 85, "Libra": 70, "Scorpio": 85, "Sagittarius": 55, "Capricorn": 80, "Aquarius": 50, "Pisces": 95 },
    "Sagittarius": { "Aries": 90, "Taurus": 35, "Gemini": 85, "Cancer": 40, "Leo": 95, "Virgo": 45, "Libra": 80, "Scorpio": 55, "Sagittarius": 75, "Capricorn": 50, "Aquarius": 90, "Pisces": 60 },
    "Capricorn": { "Aries": 35, "Taurus": 95, "Gemini": 40, "Cancer": 85, "Leo": 45, "Virgo": 90, "Libra": 55, "Scorpio": 80, "Sagittarius": 50, "Capricorn": 80, "Aquarius": 45, "Pisces": 75 },
    "Aquarius": { "Aries": 85, "Taurus": 30, "Gemini": 90, "Cancer": 35, "Leo": 80, "Virgo": 40, "Libra": 85, "Scorpio": 50, "Sagittarius": 90, "Capricorn": 45, "Aquarius": 70, "Pisces": 55 },
    "Pisces": { "Aries": 55, "Taurus": 85, "Gemini": 50, "Cancer": 90, "Leo": 60, "Virgo": 75, "Libra": 70, "Scorpio": 95, "Sagittarius": 60, "Capricorn": 75, "Aquarius": 55, "Pisces": 80 }
  };

  // Detailed sign descriptions for compatibility analysis
  const signDescriptions = {
    "Aries": { traits: "Dynamic, independent, pioneering, confident", approach: "Direct action and leadership", communication: "Frank and enthusiastic", love: "Passionate and adventurous" },
    "Taurus": { traits: "Stable, practical, sensual, loyal", approach: "Steady and methodical", communication: "Calm and reliable", love: "Devoted and affectionate" },
    "Gemini": { traits: "Curious, adaptable, communicative, witty", approach: "Intellectual and versatile", communication: "Engaging and articulate", love: "Playful and mentally stimulating" },
    "Cancer": { traits: "Nurturing, emotional, protective, intuitive", approach: "Caring and supportive", communication: "Empathetic and heartfelt", love: "Deep and emotionally connected" },
    "Leo": { traits: "Confident, generous, creative, dramatic", approach: "Bold and expressive", communication: "Warm and inspiring", love: "Romantic and grand gestures" },
    "Virgo": { traits: "Analytical, helpful, perfectionist, practical", approach: "Detailed and organized", communication: "Thoughtful and precise", love: "Caring through acts of service" },
    "Libra": { traits: "Harmonious, diplomatic, artistic, social", approach: "Balanced and fair", communication: "Charming and persuasive", love: "Romantic and partnership-focused" },
    "Scorpio": { traits: "Intense, passionate, mysterious, transformative", approach: "Deep and investigative", communication: "Profound and honest", love: "Intense and all-consuming" },
    "Sagittarius": { traits: "Adventurous, optimistic, philosophical, free", approach: "Exploratory and expansive", communication: "Honest and enthusiastic", love: "Fun and freedom-loving" },
    "Capricorn": { traits: "Ambitious, disciplined, responsible, traditional", approach: "Goal-oriented and structured", communication: "Serious and reliable", love: "Committed and long-term focused" },
    "Aquarius": { traits: "Independent, innovative, humanitarian, unique", approach: "Unconventional and progressive", communication: "Intellectual and detached", love: "Friendship-based and free-spirited" },
    "Pisces": { traits: "Compassionate, artistic, intuitive, dreamy", approach: "Intuitive and flowing", communication: "Emotional and empathetic", love: "Romantic and spiritually connected" }
  };

  function getZodiacSign(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthDay = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[0]; // Capricorn
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[1]; // Aquarius
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns[2]; // Pisces
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[3]; // Aries
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[4]; // Taurus
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[5]; // Gemini
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[6]; // Cancer
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[7]; // Leo
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[8]; // Virgo
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[9]; // Libra
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[10]; // Scorpio
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[11]; // Sagittarius
  }

  function calculateCompatibility(sign1, sign2, time1, time2) {
    let baseScore = compatibilityMatrix[sign1.name][sign2.name];
    let bonuses = 0;

    // Element compatibility bonus
    if (sign1.element === sign2.element) {
      bonuses += 10; // Same element
    } else if (
      (sign1.element === "fire" && sign2.element === "air") ||
      (sign1.element === "air" && sign2.element === "fire") ||
      (sign1.element === "earth" && sign2.element === "water") ||
      (sign1.element === "water" && sign2.element === "earth")
    ) {
      bonuses += 8; // Complementary elements
    }

    // Modality harmony
    if (sign1.modality === sign2.modality) {
      bonuses += 5;
    }

    // Venus/Mars ruler bonus (love compatibility)
    if ((sign1.ruler === "Venus" || sign2.ruler === "Venus") && 
        (sign1.ruler === "Mars" || sign2.ruler === "Mars")) {
      bonuses += 12;
    }

    // Time-based adjustments (if provided)
    if (time1 && time2) {
      if (time1 === time2) bonuses += 5; // Similar energy cycles
    }

    return Math.min(100, baseScore + bonuses);
  }

  function getCompatibilityInsights(sign1, sign2, score) {
    const desc1 = signDescriptions[sign1.name];
    const desc2 = signDescriptions[sign2.name];
    
    let strengths = "";
    let challenges = "";
    let advice = "";

    // Generate insights based on elements and scores
    if (score >= 80) {
      strengths = `Your ${sign1.element} and ${sign2.element} energies create natural harmony. You both appreciate ${sign1.name}'s ${desc1.approach.toLowerCase()} and ${sign2.name}'s ${desc2.approach.toLowerCase()}.`;
      challenges = "Your main challenge is maintaining individual growth while supporting each other's goals.";
      advice = "Celebrate your natural connection and continue building on your strong foundation of mutual understanding.";
    } else if (score >= 60) {
      strengths = `${sign1.name}'s ${desc1.traits.split(',')[0].toLowerCase()} nature complements ${sign2.name}'s ${desc2.traits.split(',')[0].toLowerCase()} approach to life.`;
      challenges = "You may need to work on understanding each other's different communication styles and life approaches.";
      advice = "Focus on appreciating your differences as opportunities for growth and learning from each other.";
    } else {
      strengths = `Despite differences, ${sign1.name} and ${sign2.name} can offer each other unique perspectives and growth opportunities.`;
      challenges = "Significant differences in values, communication styles, and life approaches may require patience and compromise.";
      advice = "Success requires open communication, mutual respect, and willingness to adapt to each other's needs.";
    }

    return { strengths, challenges, advice };
  }

  function getScoreColor(score) {
    if (score >= 80) return "#28a745";
    if (score >= 60) return "#ffc107";
    return "#dc3545";
  }

  function getScoreDescription(score) {
    if (score >= 90) return "Exceptional cosmic harmony";
    if (score >= 80) return "Very compatible";
    if (score >= 70) return "Good compatibility";
    if (score >= 60) return "Moderate compatibility";
    if (score >= 50) return "Challenging but workable";
    return "Major differences to navigate";
  }

  calculateBtn.addEventListener("click", function () {
    const person1Name = document.getElementById("person1Name").value || "Person 1";
    const person1Date = document.getElementById("person1Date").value;
    const person1Time = document.getElementById("person1Time").value;
    
    const person2Name = document.getElementById("person2Name").value || "Person 2";
    const person2Date = document.getElementById("person2Date").value;
    const person2Time = document.getElementById("person2Time").value;

    if (!person1Date || !person2Date) {
      result.innerHTML = '<p style="color: #e74c3c;">Please enter both birth dates.</p>';
      return;
    }

    const date1 = new Date(person1Date);
    const date2 = new Date(person2Date);
    const today = new Date();

    if (date1 > today || date2 > today) {
      result.innerHTML = '<p style="color: #e74c3c;">Birth dates cannot be in the future.</p>';
      return;
    }

    const sign1 = getZodiacSign(date1);
    const sign2 = getZodiacSign(date2);
    const compatibilityScore = calculateCompatibility(sign1, sign2, person1Time, person2Time);
    const insights = getCompatibilityInsights(sign1, sign2, compatibilityScore);
    const scoreColor = getScoreColor(compatibilityScore);
    const scoreDescription = getScoreDescription(compatibilityScore);

    result.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 20px 0; font-size: 1.8em;">Compatibility Analysis</h3>
        <div style="font-size: 1.2em; margin-bottom: 15px;">${person1Name} & ${person2Name}</div>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px; color: ${scoreColor};">${compatibilityScore}%</div>
        <div style="font-size: 1.3em; opacity: 0.9;">${scoreDescription}</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; text-align: center;">
          <h4 style="margin: 0 0 15px 0; color: #007bff;">${person1Name}</h4>
          <div style="font-size: 1.4em; font-weight: bold; margin-bottom: 10px;">${sign1.name}</div>
          <p style="margin: 5px 0; color: #6c757d;">${sign1.dates}</p>
          <p style="margin: 5px 0;"><strong>Element:</strong> ${sign1.element.charAt(0).toUpperCase() + sign1.element.slice(1)}</p>
          <p style="margin: 5px 0;"><strong>Modality:</strong> ${sign1.modality.charAt(0).toUpperCase() + sign1.modality.slice(1)}</p>
          <p style="margin: 10px 0 0 0; font-size: 0.9em; line-height: 1.4;">${signDescriptions[sign1.name].traits}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #e91e63; text-align: center;">
          <h4 style="margin: 0 0 15px 0; color: #e91e63;">${person2Name}</h4>
          <div style="font-size: 1.4em; font-weight: bold; margin-bottom: 10px;">${sign2.name}</div>
          <p style="margin: 5px 0; color: #6c757d;">${sign2.dates}</p>
          <p style="margin: 5px 0;"><strong>Element:</strong> ${sign2.element.charAt(0).toUpperCase() + sign2.element.slice(1)}</p>
          <p style="margin: 5px 0;"><strong>Modality:</strong> ${sign2.modality.charAt(0).toUpperCase() + sign2.modality.slice(1)}</p>
          <p style="margin: 10px 0 0 0; font-size: 0.9em; line-height: 1.4;">${signDescriptions[sign2.name].traits}</p>
        </div>
      </div>

      <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">Relationship Strengths</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.strengths}</p>
      </div>

      <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">Potential Challenges</h4>
        <p style="margin: 0; line-height: 1.6; color: #6c757d;">${insights.challenges}</p>
      </div>

      <div style="background: #e1ecf4; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #004085;">Compatibility Advice</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${insights.advice}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #6f42c1;">
          <h5 style="margin: 0 0 10px 0; color: #6f42c1;">${person1Name}'s Communication</h5>
          <p style="margin: 0; font-size: 0.9em; line-height: 1.4;">${signDescriptions[sign1.name].communication}</p>
        </div>
        
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #6f42c1;">
          <h5 style="margin: 0 0 10px 0; color: #6f42c1;">${person2Name}'s Communication</h5>
          <p style="margin: 0; font-size: 0.9em; line-height: 1.4;">${signDescriptions[sign2.name].communication}</p>
        </div>
      </div>

      <div style="background: #ffeaa7; padding: 15px; border-radius: 8px; border-left: 4px solid #fdcb6e;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>Compatibility is just one aspect of relationships. Love, communication, mutual respect, and shared values are equally important for relationship success. Use these insights to better understand and appreciate each other's unique qualities.</em>
        </p>
      </div>
    `;
  });
});