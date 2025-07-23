document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("numerology-form");
  const result = document.getElementById("numerology-result");
  const monthSelect = document.getElementById("birthMonth");
  const daySelect = document.getElementById("birthDay");
  const yearInput = document.getElementById("birthYear");

  // Populate day dropdown
  function populateDays() {
    daySelect.innerHTML = '<option value="">Day</option>';
    for (let i = 1; i <= 31; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }
  }

  // Update days based on selected month
  function updateDays() {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearInput.value) || new Date().getFullYear();
    
    if (month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      daySelect.innerHTML = '<option value="">Day</option>';
      
      for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
      }
    } else {
      populateDays();
    }
  }

  // Life path number data
  const lifePathData = {
    1: {
      title: "The Leader",
      traits: "Independent, pioneering, ambitious, original, confident",
      strengths: "Natural leadership abilities, innovation, determination, self-reliance, courage to take initiative",
      challenges: "Can be overly aggressive, impatient, self-centered, or domineering. May struggle with teamwork",
      lifeTheme: "To develop independence and leadership while learning to work with others",
      careers: "Entrepreneur, executive, inventor, politician, artist, architect, military leader",
      relationships: "Attracts people who appreciate strength and independence. Best with partners who can handle a strong personality",
      spiritualPath: "Learning to balance personal achievement with service to others, developing humility while maintaining confidence",
      compatibility: "Works well with 2, 8, and 9. Challenges with 1 and 8 (power struggles)"
    },
    2: {
      title: "The Diplomat",
      traits: "Cooperative, sensitive, diplomatic, patient, supportive",
      strengths: "Excellent mediator, team player, intuitive, gentle, peacemaker, detail-oriented",
      challenges: "Can be oversensitive, indecisive, dependent on others, or overly emotional. May lack confidence",
      lifeTheme: "To develop cooperation and harmony while maintaining personal identity",
      careers: "Counselor, diplomat, teacher, musician, artist, accountant, nurse, social worker",
      relationships: "Thrives in partnerships, deeply loyal, seeks harmony. Best with understanding and supportive partners",
      spiritualPath: "Learning to serve others while honoring your own needs, developing inner strength through gentleness",
      compatibility: "Natural harmony with 1, 6, and 8. Challenges with 5 and 7 (different paces)"
    },
    3: {
      title: "The Creative",
      traits: "Artistic, expressive, optimistic, inspiring, entertaining",
      strengths: "Creative genius, excellent communicator, uplifting, imaginative, charismatic, versatile",
      challenges: "Can be scattered, superficial, moody, or overly critical. May struggle with focus and discipline",
      lifeTheme: "To express creativity and inspire others while developing emotional depth",
      careers: "Artist, writer, performer, teacher, designer, photographer, comedian, salesperson",
      relationships: "Brings joy and creativity to relationships, needs appreciation for their uniqueness",
      spiritualPath: "Using creative gifts to uplift humanity, learning to express authentic emotions beyond surface happiness",
      compatibility: "Harmonious with 1, 5, and 6. Challenges with 4 and 8 (different approaches to life)"
    },
    4: {
      title: "The Builder",
      traits: "Practical, stable, hardworking, reliable, methodical",
      strengths: "Excellent organizer, dependable, persevering, systematic, honest, loyal",
      challenges: "Can be rigid, stubborn, overly serious, or narrow-minded. May resist change",
      lifeTheme: "To build solid foundations while remaining open to growth and change",
      careers: "Engineer, architect, accountant, manager, farmer, banker, scientist, contractor",
      relationships: "Provides stability and security, loyal partner, values long-term commitment",
      spiritualPath: "Learning that true security comes from within, building bridges between material and spiritual worlds",
      compatibility: "Strong with 2, 6, and 8. Challenges with 3 and 5 (different life approaches)"
    },
    5: {
      title: "The Freedom Seeker",
      traits: "Adventurous, curious, versatile, progressive, freedom-loving",
      strengths: "Quick-thinking, adaptable, magnetic personality, innovative, travel-loving, versatile",
      challenges: "Can be restless, irresponsible, scattered, or addictive. May struggle with commitment",
      lifeTheme: "To experience freedom and variety while learning responsibility and focus",
      careers: "Travel guide, journalist, pilot, marketing, sales, detective, entertainer, entrepreneur",
      relationships: "Needs freedom and variety, exciting partner, may struggle with routine or possessiveness",
      spiritualPath: "Finding freedom through discipline, using experiences to gain wisdom and help others grow",
      compatibility: "Exciting with 1, 3, and 7. Challenges with 2 and 4 (different needs for stability)"
    },
    6: {
      title: "The Nurturer",
      traits: "Caring, responsible, family-oriented, healing, protective",
      strengths: "Natural healer, compassionate, responsible, artistic, home-loving, community-minded",
      challenges: "Can be overprotective, martyrish, interfering, or overly responsible for others",
      lifeTheme: "To nurture and heal while maintaining healthy boundaries",
      careers: "Doctor, nurse, teacher, counselor, veterinarian, chef, interior designer, social worker",
      relationships: "Devoted family person, nurturing partner, creates warm and loving home environment",
      spiritualPath: "Learning unconditional love while avoiding codependency, healing others through your own wholeness",
      compatibility: "Natural fit with 2, 3, and 9. Challenges with 1 and 5 (different priorities)"
    },
    7: {
      title: "The Seeker",
      traits: "Spiritual, analytical, introspective, mysterious, wise",
      strengths: "Deep thinker, intuitive, spiritual, researcher, perfectionist, independent",
      challenges: "Can be aloof, overly critical, pessimistic, or isolated. May struggle with emotions",
      lifeTheme: "To seek truth and wisdom while staying connected to the world",
      careers: "Researcher, scientist, philosopher, teacher, analyst, investigator, writer, mystic",
      relationships: "Needs understanding partner, values mental connection, requires alone time",
      spiritualPath: "Bridging spiritual and material worlds, sharing wisdom gained through inner exploration",
      compatibility: "Deep connection with 5 and 9. Challenges with 2 and 6 (different emotional needs)"
    },
    8: {
      title: "The Achiever",
      traits: "Ambitious, material success, authoritative, efficient, powerful",
      strengths: "Natural executive, goal-oriented, excellent judge of character, persistent, practical",
      challenges: "Can be materialistic, workaholic, domineering, or impatient. May neglect relationships",
      lifeTheme: "To achieve material success while maintaining spiritual values and relationships",
      careers: "Business executive, banker, real estate, lawyer, judge, surgeon, contractor, politician",
      relationships: "Provides security and status, needs respect, may prioritize career over relationships",
      spiritualPath: "Learning that true power comes from service, using material success to benefit humanity",
      compatibility: "Powerful combination with 2, 4, and 6. Challenges with 1 and 8 (power conflicts)"
    },
    9: {
      title: "The Humanitarian",
      traits: "Compassionate, generous, wise, artistic, universal love",
      strengths: "Humanitarian, generous, artistic, wise, tolerant, broad perspective",
      challenges: "Can be emotionally distant, impractical, moody, or overly idealistic",
      lifeTheme: "To serve humanity and share wisdom while taking care of personal needs",
      careers: "Teacher, healer, artist, philanthropist, counselor, humanitarian worker, spiritual leader",
      relationships: "Loving and generous, may put humanity before personal relationships",
      spiritualPath: "Embodying unconditional love, completing the cycle of human experience and wisdom",
      compatibility: "Universal love with 6 and 7. Challenges with 1 and 5 (different focal points)"
    },
    11: {
      title: "The Master Intuitive",
      traits: "Spiritual insight, inspiration, psychic abilities, high sensitivity",
      strengths: "Intuitive, inspirational, spiritual teacher, visionary, psychic abilities, highly creative",
      challenges: "Overly sensitive, nervous, impractical, or scattered. May struggle with grounding energy",
      lifeTheme: "To inspire and illuminate others while learning to ground spiritual insights",
      careers: "Spiritual teacher, artist, counselor, healer, inventor, musician, writer, psychic",
      relationships: "Needs understanding partner who supports their spiritual path, highly romantic",
      spiritualPath: "Channeling divine inspiration to help humanity evolve, bridging heaven and earth",
      compatibility: "Soul connection with 2, 6, and other master numbers. Needs patient, grounding partners"
    },
    22: {
      title: "The Master Builder",
      traits: "Practical visionary, large-scale impact, material mastery with spiritual purpose",
      strengths: "Builds dreams into reality, practical visionary, natural leader, systematic, high achievement",
      challenges: "Enormous pressure, may become overwhelmed, workaholic tendencies, high expectations",
      lifeTheme: "To build something of lasting value that serves humanity",
      careers: "Architect, urban planner, international business, politician, large organization leader, inventor",
      relationships: "Needs supportive partner who understands their mission, may prioritize work",
      spiritualPath: "Manifesting spiritual visions in the material world, leaving a lasting positive legacy",
      compatibility: "Powerful with 4, 8, and other master numbers. Needs grounding and understanding partners"
    },
    33: {
      title: "The Master Teacher",
      traits: "Spiritual guidance, healing, teaching, compassionate service",
      strengths: "Master teacher, healer, compassionate leader, spiritual guidance, unconditional love",
      challenges: "Extreme sensitivity, may sacrifice too much, overwhelming responsibility for others",
      lifeTheme: "To teach and heal through example of unconditional love",
      careers: "Spiritual teacher, healer, counselor, humanitarian leader, artist, guide, therapist",
      relationships: "Loves unconditionally, may attract people needing healing, requires understanding partner",
      spiritualPath: "Embodying Christ-like consciousness, teaching through love and example",
      compatibility: "Harmonious with 6, 9, and other master numbers. Needs emotionally mature partners"
    }
  };

  // Calculate life path number
  function calculateLifePath(month, day, year) {
    // Add all digits
    let sum = 0;
    
    // Add month digits
    while (month > 0) {
      sum += month % 10;
      month = Math.floor(month / 10);
    }
    
    // Add day digits
    while (day > 0) {
      sum += day % 10;
      day = Math.floor(day / 10);
    }
    
    // Add year digits
    while (year > 0) {
      sum += year % 10;
      year = Math.floor(year / 10);
    }
    
    // Reduce to single digit or master number
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      let newSum = 0;
      while (sum > 0) {
        newSum += sum % 10;
        sum = Math.floor(sum / 10);
      }
      sum = newSum;
    }
    
    return sum;
  }

  monthSelect.addEventListener("change", updateDays);
  yearInput.addEventListener("input", updateDays);

  // Initialize days
  populateDays();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const month = parseInt(monthSelect.value);
    const day = parseInt(daySelect.value);
    const year = parseInt(yearInput.value);

    if (!month || !day || !year) {
      result.innerHTML = '<p style="color: #e74c3c;">Please enter your complete birth date.</p>';
      return;
    }

    if (year < 1900 || year > 2030) {
      result.innerHTML = '<p style="color: #e74c3c;">Please enter a valid birth year.</p>';
      return;
    }

    // Validate date
    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
      result.innerHTML = '<p style="color: #e74c3c;">Please enter a valid date.</p>';
      return;
    }

    const lifePathNumber = calculateLifePath(month, day, year);
    const data = lifePathData[lifePathNumber];

    const birthDateString = new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    result.innerHTML = `
      <div style="background: linear-gradient(135deg, #8B5FBF 0%, #6A4C93 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; font-size: 1.8em;">Your Life Path Number</h3>
        <div style="font-size: 3em; font-weight: bold; margin-bottom: 10px;">${lifePathNumber}</div>
        <div style="font-size: 1.4em; margin-bottom: 10px;">${data.title}</div>
        <p style="margin: 0; opacity: 0.9;">Born: ${birthDateString}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
          <h4 style="margin: 0 0 10px 0; color: #28a745;">Core Traits</h4>
          <p style="margin: 0; line-height: 1.6;">${data.traits}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff;">
          <h4 style="margin: 0 0 10px 0; color: #007bff;">Life Theme</h4>
          <p style="margin: 0; line-height: 1.6;">${data.lifeTheme}</p>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #2c3e50;">Strengths</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${data.strengths}</p>
      </div>

      <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #856404;">Life Challenges</h4>
        <p style="margin: 0; line-height: 1.6; color: #6c757d;">${data.challenges}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff;">
          <h4 style="margin: 0 0 10px 0; color: #007bff;">Career Paths</h4>
          <p style="margin: 0; line-height: 1.6; font-size: 0.95em;">${data.careers}</p>
        </div>
        
        <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; border-left: 4px solid #6f42c1;">
          <h4 style="margin: 0 0 10px 0; color: #6f42c1;">Compatibility</h4>
          <p style="margin: 0; line-height: 1.6; font-size: 0.95em;">${data.compatibility}</p>
        </div>
      </div>

      <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #155724;">Relationships</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${data.relationships}</p>
      </div>

      <div style="background: #f8f0ff; padding: 20px; border-radius: 10px; border-left: 4px solid #8B5FBF; margin-bottom: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #6A4C93;">Spiritual Path</h4>
        <p style="margin: 0; line-height: 1.6; color: #495057;">${data.spiritualPath}</p>
      </div>

      <div style="background: #e1ecf4; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          <em>Your life path number provides insights into your natural tendencies and life purpose. Remember that you have free will to grow beyond any limitations and express the highest qualities of your number. Use this guidance for self-understanding and personal development.</em>
        </p>
      </div>
    `;
  });
});