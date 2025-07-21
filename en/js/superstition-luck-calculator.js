document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('superstition-form');
  const result = document.getElementById('superstition-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const dayType = document.getElementById('day-type').value;
      const moonPhase = document.getElementById('moon-phase').value;
      const timeOfDay = document.getElementById('time-of-day').value;
      const luckyNumber = document.getElementById('lucky-number').value;
      const dateSum = document.getElementById('date-sum').value;
      const beliefLevel = document.getElementById('belief-level').value;
      const mood = document.getElementById('mood').value;
      const luckyCharms = document.getElementById('lucky-charms').value;
      
      // Check various superstition factors
      const repeatedNumbers = document.getElementById('repeated-numbers').checked;
      const blackCat = document.getElementById('black-cat').checked;
      const ladybug = document.getElementById('ladybug').checked;
      const butterfly = document.getElementById('butterfly').checked;
      const birdWindow = document.getElementById('bird-window').checked;
      const spiderMorning = document.getElementById('spider-morning').checked;
      const robin = document.getElementById('robin').checked;
      const rainbow = document.getElementById('rainbow').checked;
      const shootingStar = document.getElementById('shooting-star').checked;
      const fourLeafClover = document.getElementById('four-leaf-clover').checked;
      const pennyHeads = document.getElementById('penny-heads').checked;
      const brokenMirror = document.getElementById('broken-mirror').checked;
      const walkedUnderLadder = document.getElementById('walked-under-ladder').checked;
      const spilledSalt = document.getElementById('spilled-salt').checked;
      const umbrellaIndoors = document.getElementById('umbrella-indoors').checked;
      const shoesOnBed = document.getElementById('shoes-on-bed').checked;
      const hatOnBed = document.getElementById('hat-on-bed').checked;
      const wishedOnStar = document.getElementById('wished-on-star').checked;
      const knockedOnWood = document.getElementById('knocked-on-wood').checked;
      const crossedFingers = document.getElementById('crossed-fingers').checked;
      const threwSalt = document.getElementById('threw-salt').checked;
      const positiveThinking = document.getElementById('positive-thinking').checked;
      const gratefulMindset = document.getElementById('grateful-mindset').checked;
      const expectingGood = document.getElementById('expecting-good').checked;
      
      // Validation
      if (!dayType || !timeOfDay || !beliefLevel || !mood || !luckyCharms) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Calculate base luck score
      let luckScore = 50; // Start with neutral
      let positiveFactors = [];
      let negativeFactors = [];
      let recommendations = [];
      let warnings = [];
      
      // Day type influences
      const dayTypeScores = {
        'friday-13th': -25,
        'friday': -5,
        'monday': -10,
        'weekend': +10,
        'holiday': +15,
        'regular': 0,
        'birthday': +20
      };
      
      const dayScore = dayTypeScores[dayType] || 0;
      luckScore += dayScore;
      
      if (dayType === 'friday-13th') {
        negativeFactors.push('😱 Friday the 13th - traditionally unlucky day');
        warnings.push('Be extra careful today - many superstitions warn about Friday the 13th');
      } else if (dayType === 'birthday') {
        positiveFactors.push('🎂 It\'s your special day - birthday luck is strong!');
      }
      
      // Moon phase influences
      const moonPhaseScores = {
        'new': +5,
        'waxing': +10,
        'full': +15,
        'waning': -5
      };
      
      if (moonPhase) {
        const moonScore = moonPhaseScores[moonPhase] || 0;
        luckScore += moonScore;
        
        if (moonPhase === 'full') {
          positiveFactors.push('🌕 Full moon energy - heightened intuition and power');
        } else if (moonPhase === 'waxing') {
          positiveFactors.push('🌒 Waxing moon - growing energy and manifestation');
        }
      }
      
      // Time of day influences
      const timeScores = {
        'early-morning': +10,
        'morning': +5,
        'afternoon': 0,
        'evening': +5,
        'night': -5,
        'late-night': -10
      };
      
      luckScore += timeScores[timeOfDay] || 0;
      
      if (timeOfDay === 'early-morning') {
        positiveFactors.push('🌅 Early morning - fresh start energy');
      }
      
      // Number influences
      if (luckyNumber) {
        const number = parseInt(luckyNumber);
        if ([7, 8, 9, 11, 21].includes(number)) {
          luckScore += 15;
          positiveFactors.push(`🔢 Your lucky number ${number} is universally considered fortunate`);
        } else if ([13, 4, 666].includes(number)) {
          luckScore -= 10;
          negativeFactors.push(`🔢 Number ${number} is considered unlucky in some cultures`);
        } else {
          luckScore += 5;
          positiveFactors.push(`🔢 Personal lucky number ${number} adds positive energy`);
        }
      }
      
      // Date sum influences
      const dateSumScores = {
        '7': +20,
        '8': +15,
        '9': +15,
        '11': +18,
        '13': -15,
        '21': +12,
        'other-lucky': +10,
        'other': 0
      };
      
      if (dateSum) {
        const dateScore = dateSumScores[dateSum] || 0;
        luckScore += dateScore;
        
        if (dateSum === '7') {
          positiveFactors.push('🎰 Date adds to 7 - the luckiest number!');
        } else if (dateSum === '13') {
          negativeFactors.push('1️⃣3️⃣ Date adds to 13 - unlucky in Western superstition');
        }
      }
      
      // Repeated numbers bonus
      if (repeatedNumbers) {
        luckScore += 12;
        positiveFactors.push('🔢 Seeing repeated numbers - angels/universe sending messages');
      }
      
      // Lucky animal encounters
      if (ladybug) {
        luckScore += 20;
        positiveFactors.push('🐞 Ladybug encounter - wishes coming true!');
      }
      
      if (butterfly) {
        luckScore += 15;
        positiveFactors.push('🦋 Butterfly sighting - transformation and renewal');
      }
      
      if (spiderMorning) {
        luckScore += 12;
        positiveFactors.push('🕷️ Morning spider - "spider at morning, shepherd\'s warning" brings luck');
      }
      
      if (robin) {
        luckScore += 10;
        positiveFactors.push('🐦 Robin sighting - spring renewal and new beginnings');
      }
      
      // Unlucky animal encounters
      if (blackCat) {
        luckScore -= 15;
        negativeFactors.push('🐈‍⬛ Black cat crossed path - traditional bad luck omen');
        recommendations.push('Counter black cat luck by saying "hello kitty" or walking backward');
      }
      
      if (birdWindow) {
        luckScore -= 12;
        negativeFactors.push('🐦 Bird hit window - considered a warning or bad omen');
      }
      
      // Lucky natural phenomena
      if (rainbow) {
        luckScore += 25;
        positiveFactors.push('🌈 Rainbow sighting - promise of good fortune ahead!');
      }
      
      if (shootingStar) {
        luckScore += 30;
        positiveFactors.push('⭐ Shooting star - extremely lucky, especially if you made a wish');
      }
      
      if (fourLeafClover) {
        luckScore += 35;
        positiveFactors.push('🍀 Four-leaf clover - one of the luckiest finds possible!');
      }
      
      if (pennyHeads) {
        luckScore += 8;
        positiveFactors.push('🪙 Found heads-up penny - "find a penny, pick it up, all day long you\'ll have good luck"');
      }
      
      // Unlucky actions
      if (brokenMirror) {
        luckScore -= 30;
        negativeFactors.push('🪞 Broken mirror - 7 years bad luck in superstition');
        recommendations.push('Bury mirror pieces under moonlight to break the curse');
      }
      
      if (walkedUnderLadder) {
        luckScore -= 15;
        negativeFactors.push('🪜 Walked under ladder - breaks the protective triangle');
        recommendations.push('Walk backward under the ladder to reverse the bad luck');
      }
      
      if (spilledSalt) {
        if (threwSalt) {
          luckScore += 5;
          positiveFactors.push('🧂 Spilled salt but threw over shoulder - crisis averted!');
        } else {
          luckScore -= 12;
          negativeFactors.push('🧂 Spilled salt without throwing over shoulder - invites bad luck');
          recommendations.push('Throw salt over your left shoulder to ward off bad spirits');
        }
      }
      
      if (umbrellaIndoors) {
        luckScore -= 10;
        negativeFactors.push('☂️ Opened umbrella indoors - brings rain and bad luck');
      }
      
      if (shoesOnBed) {
        luckScore -= 8;
        negativeFactors.push('👠 Shoes on bed - invites death or misfortune');
      }
      
      if (hatOnBed) {
        luckScore -= 6;
        negativeFactors.push('👒 Hat on bed - another bed-related bad luck superstition');
      }
      
      // Positive protective actions
      if (wishedOnStar) {
        luckScore += 10;
        positiveFactors.push('⭐ Made wish on star - connecting with cosmic luck');
      }
      
      if (knockedOnWood) {
        luckScore += 8;
        positiveFactors.push('🪵 Knocked on wood - ancient protection against jinxing');
      }
      
      if (crossedFingers) {
        luckScore += 6;
        positiveFactors.push('🤞 Crossed fingers - invoking Christian protection symbol');
      }
      
      // Belief level multiplier
      const beliefMultipliers = {
        'strong': 1.3,
        'moderate': 1.2,
        'casual': 1.0,
        'skeptical': 0.8,
        'none': 0.6
      };
      
      luckScore *= beliefMultipliers[beliefLevel] || 1.0;
      
      // Mood influences
      const moodScores = {
        'excellent': +20,
        'good': +10,
        'neutral': 0,
        'low': -10,
        'bad': -20
      };
      
      luckScore += moodScores[mood] || 0;
      
      if (mood === 'excellent' || mood === 'good') {
        positiveFactors.push('😊 Positive mood attracts positive energy and opportunities');
      } else if (mood === 'bad' || mood === 'low') {
        negativeFactors.push('😔 Negative mood may create self-fulfilling prophecy');
        recommendations.push('Try to lift your spirits - positive attitude creates positive luck');
      }
      
      // Lucky charms influence
      const charmScores = {
        'multiple': +15,
        'one-special': +10,
        'occasional': +5,
        'none': 0
      };
      
      luckScore += charmScores[luckyCharms] || 0;
      
      if (luckyCharms === 'multiple') {
        positiveFactors.push('🧿 Multiple lucky charms - maximum protection and positive energy');
      }
      
      // Positive mindset bonuses
      if (positiveThinking) {
        luckScore += 15;
        positiveFactors.push('🧠 Positive thinking - creates lucky opportunities');
      }
      
      if (gratefulMindset) {
        luckScore += 12;
        positiveFactors.push('🙏 Grateful attitude - attracts more good things');
      }
      
      if (expectingGood) {
        luckScore += 10;
        positiveFactors.push('✨ Expecting good things - optimistic outlook creates luck');
      }
      
      // Cap luck score between 0 and 100
      luckScore = Math.max(0, Math.min(100, Math.round(luckScore)));
      
      // Determine luck level and recommendations
      let luckLevel = '';
      let cardClass = '';
      let mainMessage = '';
      let luckyColor = '';
      let luckyAction = '';
      
      if (luckScore >= 85) {
        luckLevel = 'Extremely Lucky';
        cardClass = 'success';
        mainMessage = 'The stars are aligned! This is an exceptionally lucky time for you.';
        luckyColor = 'Gold or bright yellow';
        luckyAction = 'Take on important challenges, make big decisions, or start new ventures';
      } else if (luckScore >= 70) {
        luckLevel = 'Very Lucky';
        cardClass = 'success';
        mainMessage = 'You\'re having a very fortunate period with strong positive energy.';
        luckyColor = 'Green or silver';
        luckyAction = 'Perfect time for important meetings, interviews, or asking for favors';
      } else if (luckScore >= 55) {
        luckLevel = 'Moderately Lucky';
        cardClass = 'info';
        mainMessage = 'Good luck is flowing your way with generally positive energy.';
        luckyColor = 'Blue or purple';
        luckyAction = 'Great day for social activities and moderate risk-taking';
      } else if (luckScore >= 40) {
        luckLevel = 'Neutral';
        cardClass = 'info';
        mainMessage = 'Balanced energy - neither particularly lucky nor unlucky.';
        luckyColor = 'White or light blue';
        luckyAction = 'Focus on routine activities and steady progress';
      } else if (luckScore >= 25) {
        luckLevel = 'Somewhat Unlucky';
        cardClass = 'warning';
        mainMessage = 'Some challenging energy - be cautious and avoid major risks.';
        luckyColor = 'Brown or dark blue';
        luckyAction = 'Play it safe, double-check things, and avoid important decisions';
      } else {
        luckLevel = 'Very Unlucky';
        cardClass = 'warning';
        mainMessage = 'Challenging period - focus on protection and careful actions.';
        luckyColor = 'Black for protection or red for strength';
        luckyAction = 'Stay home if possible, avoid risks, carry protective charms';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🍀 Luck Score</h6>
            <div class="big-number">${luckScore}</div>
            <p class="insight-detail">${luckLevel}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🎯 Lucky Color</h6>
            <div class="big-number">🎨</div>
            <p class="insight-detail">${luckyColor}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🌟 Belief Level</h6>
            <div class="big-number">${getBeliefEmoji(beliefLevel)}</div>
            <p class="insight-detail">${beliefLevel.charAt(0).toUpperCase() + beliefLevel.slice(1)} Believer</p>
          </div>
          
          <div class="insight-card info">
            <h6>😊 Mood Impact</h6>
            <div class="big-number">${getMoodEmoji(mood)}</div>
            <p class="insight-detail">${mood.charAt(0).toUpperCase() + mood.slice(1)} Mood</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>🔮 Your Luck Assessment</h4>
          <p><strong>${mainMessage}</strong></p>
          <p><strong>Recommended Action:</strong> ${luckyAction}</p>
        </div>`;
      
      // Add positive factors
      if (positiveFactors.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>✨ Positive Luck Factors</h4>
            <ul>`;
        positiveFactors.forEach(factor => {
          resultHTML += `<li>${factor}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add negative factors
      if (negativeFactors.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⚠️ Challenging Luck Factors</h4>
            <ul>`;
        negativeFactors.forEach(factor => {
          resultHTML += `<li>${factor}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add recommendations
      if (recommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Luck Enhancement Tips</h4>
            <ul>`;
        recommendations.forEach(rec => {
          resultHTML += `<li>${rec}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add warnings
      if (warnings.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⚠️ Special Warnings</h4>
            <ul>`;
        warnings.forEach(warning => {
          resultHTML += `<li>${warning}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add general luck tips
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>🎲 Universal Luck Tips</h4>
          <ul>
            <li><strong>🌟 Stay positive:</strong> Optimism attracts opportunities</li>
            <li><strong>🔮 Carry a charm:</strong> Something that makes you feel confident</li>
            <li><strong>🍀 Look for signs:</strong> Notice small positive moments</li>
            <li><strong>🤝 Help others:</strong> Good karma creates good luck</li>
            <li><strong>📚 Learn from 'bad luck':</strong> Every setback teaches something</li>
            <li><strong>🎯 Take action:</strong> Luck favors the prepared and active</li>
          </ul>
        </div>`;
      
      // Add cultural luck traditions
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>🌍 Cultural Luck Enhancers</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>🇨🇳 Chinese</h6>
              <p>Wear red, carry jade, avoid number 4, embrace number 8</p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>🇮🇪 Irish</h6>
              <p>Carry shamrock, look for leprechauns, wear green on Friday</p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>🇮🇹 Italian</h6>
              <p>Wear cornicello horn, avoid malocchio evil eye, touch iron</p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>🇯🇵 Japanese</h6>
              <p>Keep omamori charm, bow to maneki-neko cats, clean your space</p>
            </div>
          </div>
        </div>`;
      
      // Add disclaimer
      resultHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid var(--accent);">
          <h4>😄 Remember - This is For Fun!</h4>
          <p>Superstitions are cultural traditions and entertainment. Real luck comes from preparation, hard work, positive attitude, and taking action on opportunities. Use this as a lighthearted way to explore folklore while creating your own luck through positive choices!</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function getBeliefEmoji(belief) {
    const emojis = {
      'strong': '🔮',
      'moderate': '🤔',
      'casual': '😊',
      'skeptical': '🤨',
      'none': '🧠'
    };
    return emojis[belief] || '🤷';
  }
  
  function getMoodEmoji(mood) {
    const emojis = {
      'excellent': '😁',
      'good': '😊',
      'neutral': '😐',
      'low': '😔',
      'bad': '😞'
    };
    return emojis[mood] || '😐';
  }
});