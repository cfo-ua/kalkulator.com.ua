document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('pet-name-form');
  const result = document.getElementById('pet-name-result');
  const activitySlider = document.getElementById('activity-level');
  const activityDisplay = document.getElementById('activity-display');

  // Update activity level display
  if (activitySlider && activityDisplay) {
    activitySlider.addEventListener('input', function() {
      const level = parseInt(this.value);
      const labels = ['1 - Very Low', '2 - Low', '3 - Below Average', '4 - Moderate-Low', '5 - Moderate', 
                     '6 - Moderate-High', '7 - Above Average', '8 - High', '9 - Very High', '10 - Extremely High'];
      activityDisplay.textContent = labels[level - 1];
    });
  }

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculatePetNames();
    });
  }

  function calculatePetNames() {
    // Get form values
    const petType = document.getElementById('pet-type').value;
    const petSize = document.getElementById('pet-size').value;
    const petGender = document.getElementById('pet-gender').value;
    const personality = document.getElementById('personality').value;
    const activityLevel = parseInt(document.getElementById('activity-level').value);
    const primaryColor = document.getElementById('primary-color').value;
    const coatType = document.getElementById('coat-type').value;
    const nameStyle = document.getElementById('name-style').value;
    const nameLength = document.getElementById('name-length').value;
    const easyPronunciation = document.getElementById('easy-pronunciation').checked;
    const familyFriendly = document.getElementById('family-friendly').checked;

    // Name databases
    const nameDatabase = {
      classic: {
        male: ['Max', 'Charlie', 'Rocky', 'Cooper', 'Duke', 'Bear', 'Tucker', 'Jack', 'Oliver', 'Leo'],
        female: ['Bella', 'Luna', 'Lucy', 'Molly', 'Daisy', 'Sadie', 'Ruby', 'Lily', 'Sophie', 'Chloe'],
        neutral: ['Bailey', 'Riley', 'Casey', 'Dakota', 'Scout', 'Marley', 'Phoenix', 'River']
      },
      unique: {
        male: ['Zephyr', 'Atlas', 'Orion', 'Phoenix', 'Kai', 'Neo', 'Axel', 'Dante', 'Titan', 'Storm'],
        female: ['Nova', 'Zara', 'Luna', 'Echo', 'Sage', 'Iris', 'Wren', 'Indie', 'Pixel', 'Quinn'],
        neutral: ['Rebel', 'Quest', 'Jazz', 'Cosmic', 'Ziggy', 'Pixel', 'Echo', 'Sage']
      },
      human: {
        male: ['James', 'William', 'Oliver', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Mason', 'Ethan', 'Daniel'],
        female: ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn'],
        neutral: ['Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Jamie', 'Avery', 'Riley']
      },
      nature: {
        male: ['Forest', 'River', 'Storm', 'Clay', 'Stone', 'Oak', 'Sage', 'Canyon', 'Ridge', 'Aspen'],
        female: ['Willow', 'Rose', 'Ivy', 'Fern', 'Daisy', 'Poppy', 'Sage', 'Autumn', 'Brook', 'Hazel'],
        neutral: ['River', 'Storm', 'Sage', 'Forest', 'Ocean', 'Sky', 'Rain', 'Brook']
      },
      food: {
        male: ['Pepper', 'Cocoa', 'Muffin', 'Biscuit', 'Peanut', 'Cookie', 'Nacho', 'Taco', 'Oreo', 'Pickle'],
        female: ['Cookie', 'Honey', 'Cinnamon', 'Peaches', 'Ginger', 'Olive', 'Cherry', 'Mocha', 'Pumpkin', 'Candy'],
        neutral: ['Cookie', 'Peanut', 'Muffin', 'Cocoa', 'Pepper', 'Pickle', 'Oreo', 'Biscuit']
      },
      strong: {
        male: ['Zeus', 'Thor', 'Titan', 'Rex', 'King', 'Chief', 'Boss', 'Tank', 'Diesel', 'Ranger'],
        female: ['Athena', 'Queen', 'Princess', 'Diva', 'Duchess', 'Majesty', 'Storm', 'Nova', 'Rebel', 'Rogue'],
        neutral: ['Storm', 'Thunder', 'Lightning', 'Blaze', 'Steel', 'Shadow', 'Hunter', 'Scout']
      },
      cute: {
        male: ['Buddy', 'Teddy', 'Milo', 'Gizmo', 'Peanut', 'Buttons', 'Cuddles', 'Snuggles', 'Pip', 'Tiny'],
        female: ['Sweetie', 'Princess', 'Angel', 'Baby', 'Cupcake', 'Buttercup', 'Rosie', 'Precious', 'Darling', 'Honey'],
        neutral: ['Sweetie', 'Baby', 'Cuddles', 'Snuggles', 'Buttons', 'Pip', 'Tiny', 'Peanut']
      },
      international: {
        male: ['Akira', 'Diego', 'Kai', 'Pierre', 'Giovanni', 'Hans', 'Carlos', 'Mikhail', 'Hiroshi', 'Abdul'],
        female: ['Bella', 'Freya', 'Sakura', 'Sofia', 'Isabella', 'Anya', 'Zara', 'Priya', 'Amelie', 'Ingrid'],
        neutral: ['Kai', 'Sasha', 'Ari', 'Rio', 'Sky', 'Blue', 'Rain', 'Storm']
      }
    };

    // Color-based names
    const colorNames = {
      black: ['Shadow', 'Midnight', 'Coal', 'Onyx', 'Raven', 'Pepper', 'Jet', 'Noir'],
      white: ['Snow', 'Pearl', 'Cloud', 'Cotton', 'Ivory', 'Angel', 'Ghost', 'Marshmallow'],
      brown: ['Cocoa', 'Bruno', 'Mocha', 'Chocolate', 'Coffee', 'Hazel', 'Autumn', 'Copper'],
      golden: ['Sunny', 'Gold', 'Honey', 'Amber', 'Butterscotch', 'Goldie', 'Marigold', 'Wheat'],
      gray: ['Silver', 'Smokey', 'Storm', 'Steel', 'Ash', 'Slate', 'Misty', 'Dusty'],
      red: ['Copper', 'Rusty', 'Ginger', 'Flame', 'Ruby', 'Cherry', 'Crimson', 'Scarlet'],
      cream: ['Cream', 'Butter', 'Vanilla', 'Champagne', 'Biscuit', 'Sandy', 'Blonde', 'Caramel'],
      multicolor: ['Patches', 'Spot', 'Marble', 'Calico', 'Rainbow', 'Mosaic', 'Speckles', 'Freckles']
    };

    // Personality-based names
    const personalityNames = {
      energetic: ['Bolt', 'Flash', 'Rocket', 'Dash', 'Turbo', 'Spark', 'Zoom', 'Peppy', 'Zippy', 'Bouncer'],
      calm: ['Zen', 'Peace', 'Serenity', 'Tranquil', 'Gentle', 'Harmony', 'Calm', 'Still', 'Quiet', 'Mellow'],
      playful: ['Jester', 'Playful', 'Fun', 'Happy', 'Jolly', 'Giggles', 'Bounce', 'Frisky', 'Sprite', 'Rascal'],
      protective: ['Guardian', 'Shield', 'Defender', 'Warrior', 'Knight', 'Sentry', 'Watch', 'Guard', 'Hero', 'Protector'],
      independent: ['Solo', 'Rebel', 'Rogue', 'Free', 'Wild', 'Lone', 'Maverick', 'Spirit', 'Indie', 'Liberty'],
      social: ['Buddy', 'Friend', 'Social', 'Party', 'Cheerful', 'Sunny', 'Happy', 'Joy', 'Merry', 'Bright'],
      intelligent: ['Einstein', 'Sherlock', 'Wise', 'Sage', 'Smart', 'Clever', 'Brain', 'Genius', 'Scholar', 'Prof'],
      cuddly: ['Cuddles', 'Snuggle', 'Hugger', 'Sweetie', 'Love', 'Honey', 'Sugar', 'Darling', 'Baby', 'Precious']
    };

    // Generate name suggestions
    let suggestions = [];
    const genderKey = petGender === 'no-preference' ? 'neutral' : petGender;
    
    // Add style-based names
    if (nameDatabase[nameStyle] && nameDatabase[nameStyle][genderKey]) {
      suggestions.push(...nameDatabase[nameStyle][genderKey].slice(0, 5));
    }
    if (nameDatabase[nameStyle] && nameDatabase[nameStyle]['neutral']) {
      suggestions.push(...nameDatabase[nameStyle]['neutral'].slice(0, 3));
    }

    // Add color-based names
    if (colorNames[primaryColor]) {
      suggestions.push(...colorNames[primaryColor].slice(0, 3));
    }

    // Add personality-based names
    if (personalityNames[personality]) {
      suggestions.push(...personalityNames[personality].slice(0, 3));
    }

    // Remove duplicates
    suggestions = [...new Set(suggestions)];
    
    // Calculate compatibility scores
    const scoredNames = suggestions.map(name => ({
      name: name,
      score: calculateCompatibilityScore(name, {
        petType, petSize, personality, activityLevel, primaryColor,
        nameStyle, nameLength, easyPronunciation, familyFriendly
      })
    }));

    // Sort by score and take top 8
    const topNames = scoredNames.sort((a, b) => b.score - a.score).slice(0, 8);

    displayResults(topNames, {
      petType, petSize, personality, activityLevel, primaryColor, nameStyle
    });
  }

  function calculateCompatibilityScore(name, criteria) {
    let score = 50; // Base score

    // Personality match (30%)
    if (criteria.personality === 'energetic' && ['Bolt', 'Flash', 'Rocket', 'Dash', 'Turbo', 'Spark', 'Zoom', 'Peppy'].includes(name)) score += 30;
    if (criteria.personality === 'calm' && ['Zen', 'Peace', 'Serenity', 'Gentle', 'Mellow'].includes(name)) score += 30;
    if (criteria.personality === 'playful' && ['Playful', 'Fun', 'Happy', 'Jolly', 'Bounce', 'Frisky'].includes(name)) score += 30;
    
    // Activity level match (20%)
    const activityBonus = Math.min(20, criteria.activityLevel * 2);
    if (['Bolt', 'Flash', 'Rocket', 'Dash', 'Turbo'].includes(name)) score += activityBonus;
    
    // Appearance match (25%)
    if (criteria.primaryColor === 'black' && ['Shadow', 'Midnight', 'Coal', 'Onyx', 'Raven'].includes(name)) score += 25;
    if (criteria.primaryColor === 'white' && ['Snow', 'Pearl', 'Cloud', 'Cotton', 'Angel'].includes(name)) score += 25;
    if (criteria.primaryColor === 'golden' && ['Sunny', 'Gold', 'Honey', 'Amber', 'Goldie'].includes(name)) score += 25;
    
    // Size appropriateness (15%)
    if (criteria.petSize === 'tiny' && ['Peanut', 'Pip', 'Tiny', 'Buttons'].includes(name)) score += 15;
    if (criteria.petSize === 'giant' && ['Titan', 'Zeus', 'Thor', 'Tank', 'Boss'].includes(name)) score += 15;
    
    // Name style consistency (10%)
    if (criteria.nameStyle === 'cute' && ['Sweetie', 'Baby', 'Cuddles', 'Precious'].includes(name)) score += 10;
    if (criteria.nameStyle === 'strong' && ['Zeus', 'Thor', 'Titan', 'Rex', 'King'].includes(name)) score += 10;

    // Ensure score doesn't exceed 100
    return Math.min(100, score);
  }

  function displayResults(names, criteria) {
    if (names.length === 0) {
      result.innerHTML = '<div class="error">Please fill in all required fields to get name suggestions.</div>';
      return;
    }

    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>🏆 Best Match</h6>
          <div class="big-number">${names[0].name}</div>
          <p class="insight-detail">${names[0].score}% compatibility</p>
        </div>
        <div class="insight-card success">
          <h6>📊 Total Suggestions</h6>
          <div class="big-number">${names.length}</div>
          <p class="insight-detail">Personalized names</p>
        </div>
        <div class="insight-card warning">
          <h6>🎯 Match Criteria</h6>
          <div class="big-number">${criteria.personality}</div>
          <p class="insight-detail">${criteria.petType} • ${criteria.petSize}</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>🌟 Top Name Suggestions</h3>
        <div class="name-suggestions" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
    `;

    names.forEach((nameData, index) => {
      const rank = index + 1;
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '⭐';
      html += `
        <div class="name-card" style="background: white; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border); text-align: center;">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${medal}</div>
          <h4 style="margin: 0 0 0.5rem 0; color: var(--accent);">${nameData.name}</h4>
          <div style="background: var(--card-bg); padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem;">
            <strong>${nameData.score}%</strong> match
          </div>
          <div style="font-size: 0.9rem; color: #666;">
            Rank #${rank}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--card-bg); border-radius: 12px;">
        <h3>💡 Why These Names Work</h3>
        <ul style="margin: 1rem 0;">
          <li><strong>Personality Match:</strong> ${getPersonalityExplanation(criteria.personality)}</li>
          <li><strong>Appearance Harmony:</strong> Names complement your ${criteria.primaryColor} ${criteria.petType}</li>
          <li><strong>Style Preference:</strong> Matches your ${criteria.nameStyle} naming style</li>
          <li><strong>Size Appropriate:</strong> Perfect for a ${criteria.petSize} pet</li>
        </ul>
        
        <h4>🎯 Next Steps:</h4>
        <ol style="margin: 1rem 0;">
          <li><strong>Test the names:</strong> Try calling each name and see which feels most natural</li>
          <li><strong>Get family input:</strong> Make sure everyone likes and can pronounce the chosen name</li>
          <li><strong>Consider nicknames:</strong> Think about potential short versions or pet names</li>
          <li><strong>Live with it:</strong> Try your favorite for a few days before making it official</li>
        </ol>
      </div>
    `;

    result.innerHTML = html;
  }

  function getPersonalityExplanation(personality) {
    const explanations = {
      energetic: 'Active, dynamic names that reflect high energy and movement',
      calm: 'Peaceful, serene names that suggest tranquility and gentleness',
      playful: 'Fun, cheerful names that capture a mischievous and joyful spirit',
      protective: 'Strong, reliable names that convey loyalty and guardianship',
      independent: 'Unique, free-spirited names for pets who march to their own beat',
      social: 'Friendly, approachable names perfect for outgoing and social pets',
      intelligent: 'Sophisticated names that reflect cleverness and quick learning',
      cuddly: 'Sweet, affectionate names that express warmth and lovability'
    };
    return explanations[personality] || 'Names selected to match your pet\'s unique character';
  }
});