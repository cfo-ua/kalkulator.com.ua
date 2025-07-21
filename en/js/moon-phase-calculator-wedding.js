document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('moon-phase-form');
  const result = document.getElementById('moon-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const weddingDate = document.getElementById('wedding-date').value;
      const preferredSeason = document.getElementById('preferred-season').value;
      const specificMonth = document.getElementById('specific-month').value;
      const weddingYear = parseInt(document.getElementById('wedding-year').value);
      const preferredPhase = document.getElementById('preferred-phase').value;
      const ceremonyTiming = document.getElementById('ceremony-timing').value;
      const venueType = document.getElementById('venue-type').value;
      const location = document.getElementById('location').value;
      const weddingStyle = document.getElementById('wedding-style').value;
      const guestCount = document.getElementById('guest-count').value;
      const importanceLevel = document.getElementById('importance-level').value;
      
      // Check additional factors
      const photographyImportant = document.getElementById('photography-important').checked;
      const tidalConsiderations = document.getElementById('tidal-considerations').checked;
      const culturalTraditions = document.getElementById('cultural-traditions').checked;
      const astrologicalSignificance = document.getElementById('astrological-significance').checked;
      
      // Validation
      if (!weddingYear || !preferredPhase || !ceremonyTiming || !venueType || !location || !weddingStyle || !guestCount || !importanceLevel) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Generate moon phase recommendations
      let recommendations = [];
      let tips = [];
      let warnings = [];
      
      // If specific date provided, calculate its moon phase
      if (weddingDate) {
        const datePhase = calculateMoonPhase(new Date(weddingDate));
        const phaseMatch = checkPhaseMatch(datePhase.phase, preferredPhase);
        
        recommendations.push({
          date: weddingDate,
          phase: datePhase.phase,
          phaseName: datePhase.name,
          emoji: datePhase.emoji,
          match: phaseMatch,
          description: datePhase.description
        });
      } else {
        // Generate recommendations based on preferences
        recommendations = generateMonthlyRecommendations(weddingYear, preferredSeason, specificMonth, preferredPhase);
      }
      
      // Generate venue-specific advice
      const venueAdvice = getVenueAdvice(venueType, preferredPhase, ceremonyTiming);
      
      // Generate timing recommendations
      const timingAdvice = getTimingAdvice(ceremonyTiming, preferredPhase, photographyImportant);
      
      // Generate style-specific recommendations
      const styleRecommendations = getStyleRecommendations(weddingStyle, preferredPhase, guestCount);
      
      // Add photography considerations
      if (photographyImportant) {
        if (preferredPhase === 'full') {
          tips.push("📸 Full moon provides excellent natural lighting for evening photography");
          tips.push("Schedule couple photos during 'blue hour' just after sunset");
        } else if (preferredPhase === 'new') {
          tips.push("🕯️ New moon weddings need extra lighting - consider candles, string lights");
          tips.push("Focus on intimate, close-up photography rather than landscape shots");
        }
      }
      
      // Add tidal considerations
      if (tidalConsiderations) {
        if (preferredPhase === 'full' || preferredPhase === 'new') {
          warnings.push("🌊 Full and new moons create spring tides (highest/lowest) - check tide schedules");
          tips.push("Plan ceremony timing 2-3 hours before/after high tide for safety");
        }
      }
      
      // Add cultural considerations
      if (culturalTraditions) {
        tips.push("🏮 Research your cultural traditions - some favor waxing moons for prosperity");
        tips.push("Consider lunar calendar dates important to your families");
      }
      
      // Determine overall recommendation quality
      let overallRating = '';
      let cardClass = '';
      let mainRecommendation = '';
      
      if (recommendations.length > 0 && recommendations[0].match >= 90) {
        overallRating = 'Perfect Match';
        cardClass = 'success';
        mainRecommendation = 'Your date aligns beautifully with your moon phase preferences!';
      } else if (recommendations.length > 0 && recommendations[0].match >= 70) {
        overallRating = 'Good Match';
        cardClass = 'info';
        mainRecommendation = 'Your timing works well with lunar cycles.';
      } else if (recommendations.length > 0 && recommendations[0].match >= 50) {
        overallRating = 'Moderate Match';
        cardClass = 'warning';
        mainRecommendation = 'Consider adjusting your date for better lunar alignment.';
      } else {
        overallRating = 'Consider Alternatives';
        cardClass = 'warning';
        mainRecommendation = 'Explore different dates for better moon phase alignment.';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🌙 Moon Alignment</h6>
            <div class="big-number">${overallRating}</div>
            <p class="insight-detail">${recommendations.length > 0 ? recommendations[0].match : 'N/A'}% Match</p>
          </div>
          
          <div class="insight-card info">
            <h6>🎯 Preferred Phase</h6>
            <div class="big-number">${getPhaseEmoji(preferredPhase)}</div>
            <p class="insight-detail">${getPhaseFullName(preferredPhase)}</p>
          </div>
          
          <div class="insight-card info">
            <h6>📅 Wedding Year</h6>
            <div class="big-number">${weddingYear}</div>
            <p class="insight-detail">${getSeasonFromPreference(preferredSeason)}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🏖️ Venue Style</h6>
            <div class="big-number">${getVenueEmoji(venueType)}</div>
            <p class="insight-detail">${venueType.charAt(0).toUpperCase() + venueType.slice(1)}</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>🌙 Moon Phase Assessment</h4>
          <p><strong>${mainRecommendation}</strong></p>
        </div>`;
      
      // Add date recommendations
      if (recommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>📅 Recommended Dates</h4>`;
        
        recommendations.slice(0, 6).forEach((rec, index) => {
          const matchClass = rec.match >= 80 ? 'success' : rec.match >= 60 ? 'info' : 'warning';
          resultHTML += `
            <div class="insight-card ${matchClass}" style="margin: 1rem 0;">
              <h6>${rec.emoji} ${formatDate(rec.date)} - ${rec.phaseName}</h6>
              <p><strong>Match Score:</strong> ${rec.match}%</p>
              <p>${rec.description}</p>
            </div>`;
        });
        
        resultHTML += `</div>`;
      }
      
      // Add venue-specific advice
      if (venueAdvice.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>🏖️ Venue-Specific Advice</h4>
            <ul>`;
        venueAdvice.forEach(advice => {
          resultHTML += `<li>${advice}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add timing recommendations
      if (timingAdvice.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⏰ Timing Recommendations</h4>
            <ul>`;
        timingAdvice.forEach(advice => {
          resultHTML += `<li>${advice}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add style recommendations
      if (styleRecommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💫 Style & Atmosphere Tips</h4>
            <ul>`;
        styleRecommendations.forEach(rec => {
          resultHTML += `<li>${rec}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add warnings if any
      if (warnings.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⚠️ Important Considerations</h4>
            <ul>`;
        warnings.forEach(warning => {
          resultHTML += `<li>${warning}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add tips if any
      if (tips.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Planning Tips</h4>
            <ul>`;
        tips.forEach(tip => {
          resultHTML += `<li>${tip}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add moon phase meanings
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>🌙 Moon Phase Meanings for Weddings</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>🌕 Full Moon</h6>
              <p>Peak romance, maximum illumination, heightened emotions, fertility symbolism</p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>🌑 New Moon</h6>
              <p>New beginnings, fresh starts, intimate settings, manifestation energy</p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>🌔 Waxing Moon</h6>
              <p>Growth, building energy, expanding love, promising future</p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>🌖 Waning Moon</h6>
              <p>Gratitude, wisdom, mature love, releasing the past</p>
            </div>
          </div>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function calculateMoonPhase(date) {
    // Simplified moon phase calculation (approximation)
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Calculate days since known new moon (Jan 6, 2000)
    const knownNewMoon = new Date(2000, 0, 6);
    const daysSince = Math.floor((date - knownNewMoon) / (1000 * 60 * 60 * 24));
    
    // Lunar cycle is approximately 29.5305882 days
    const lunarCycle = 29.5305882;
    const phase = (daysSince % lunarCycle) / lunarCycle;
    
    // Determine phase name and emoji
    if (phase < 0.03 || phase > 0.97) {
      return { phase: 'new', name: 'New Moon', emoji: '🌑', description: 'Perfect for new beginnings and intimate ceremonies' };
    } else if (phase < 0.22) {
      return { phase: 'waxing-crescent', name: 'Waxing Crescent', emoji: '🌒', description: 'Growing energy and building anticipation' };
    } else if (phase < 0.28) {
      return { phase: 'first-quarter', name: 'First Quarter', emoji: '🌓', description: 'Taking action and making decisions together' };
    } else if (phase < 0.47) {
      return { phase: 'waxing-gibbous', name: 'Waxing Gibbous', emoji: '🌔', description: 'Refinement and patience as love reaches completion' };
    } else if (phase < 0.53) {
      return { phase: 'full', name: 'Full Moon', emoji: '🌕', description: 'Peak romance and maximum illumination for your special day' };
    } else if (phase < 0.72) {
      return { phase: 'waning-gibbous', name: 'Waning Gibbous', emoji: '🌖', description: 'Gratitude and sharing the abundance of your love' };
    } else if (phase < 0.78) {
      return { phase: 'third-quarter', name: 'Third Quarter', emoji: '🌗', description: 'Release and forgiveness, focusing on your future together' };
    } else {
      return { phase: 'waning-crescent', name: 'Waning Crescent', emoji: '🌘', description: 'Reflection and spiritual connection' };
    }
  }
  
  function checkPhaseMatch(actualPhase, preferredPhase) {
    if (preferredPhase === 'any') return 85;
    
    const phaseGroups = {
      'full': ['full'],
      'new': ['new'],
      'waxing': ['waxing-crescent', 'first-quarter', 'waxing-gibbous'],
      'waning': ['waning-gibbous', 'third-quarter', 'waning-crescent']
    };
    
    if (phaseGroups[preferredPhase] && phaseGroups[preferredPhase].includes(actualPhase)) {
      return actualPhase === preferredPhase ? 100 : 85;
    }
    
    return 40;
  }
  
  function generateMonthlyRecommendations(year, season, specificMonth, preferredPhase) {
    const recommendations = [];
    let monthsToCheck = [];
    
    if (specificMonth) {
      monthsToCheck = [parseInt(specificMonth)];
    } else if (season === 'spring') {
      monthsToCheck = [3, 4, 5];
    } else if (season === 'summer') {
      monthsToCheck = [6, 7, 8];
    } else if (season === 'fall') {
      monthsToCheck = [9, 10, 11];
    } else if (season === 'winter') {
      monthsToCheck = [12, 1, 2];
    } else {
      monthsToCheck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
    
    monthsToCheck.forEach(month => {
      // Check multiple dates in each month
      for (let day = 1; day <= 28; day += 7) {
        const testDate = new Date(year, month - 1, day);
        const phaseInfo = calculateMoonPhase(testDate);
        const match = checkPhaseMatch(phaseInfo.phase, preferredPhase);
        
        if (match >= 60) { // Only include good matches
          recommendations.push({
            date: testDate.toISOString().split('T')[0],
            phase: phaseInfo.phase,
            phaseName: phaseInfo.name,
            emoji: phaseInfo.emoji,
            match: match,
            description: phaseInfo.description
          });
        }
      }
    });
    
    // Sort by match score and return top recommendations
    return recommendations.sort((a, b) => b.match - a.match).slice(0, 12);
  }
  
  function getVenueAdvice(venueType, preferredPhase, ceremonyTiming) {
    const advice = [];
    
    if (venueType === 'beach' || venueType === 'outdoor') {
      if (preferredPhase === 'full') {
        advice.push("🌕 Full moon provides natural lighting for evening outdoor ceremonies");
        advice.push("🌊 Consider moon rise time for dramatic backdrop photos");
      }
      advice.push("🌤️ Have backup plans for weather changes during lunar events");
    }
    
    if (venueType === 'beach') {
      advice.push("🌊 Check tide charts - full/new moons create stronger tides");
      advice.push("📍 Plan ceremony location based on high tide timing");
    }
    
    if (venueType === 'mountain' || venueType === 'desert') {
      advice.push("🌙 Clear skies in these locations offer spectacular moon viewing");
      advice.push("🌡️ Prepare for temperature drops after sunset");
    }
    
    if (venueType === 'indoor') {
      advice.push("🪟 Consider venues with large windows or skylights to view the moon");
      advice.push("✨ Use moon phase as inspiration for lighting and decor themes");
    }
    
    return advice;
  }
  
  function getTimingAdvice(ceremonyTiming, preferredPhase, photographyImportant) {
    const advice = [];
    
    if (ceremonyTiming === 'evening' || ceremonyTiming === 'night') {
      if (preferredPhase === 'full') {
        advice.push("🌅 Full moon rises around sunset - perfect timing for evening ceremonies");
        advice.push("📸 Schedule couple photos during 'golden hour' before moon becomes visible");
      } else if (preferredPhase === 'new') {
        advice.push("🕯️ New moon creates intimate atmosphere but requires additional lighting");
        advice.push("⭐ Stars will be more visible during new moon ceremonies");
      }
    }
    
    if (ceremonyTiming === 'morning' || ceremonyTiming === 'afternoon') {
      advice.push("🌙 Moon may be visible during daytime, especially during quarter phases");
      advice.push("☀️ Daytime ceremonies allow focus on sun lighting with moon symbolism");
    }
    
    if (photographyImportant) {
      advice.push("📷 Coordinate with photographer about moon rise/set times");
      advice.push("🌅 Consider 'blue hour' timing for magical lighting combinations");
    }
    
    return advice;
  }
  
  function getStyleRecommendations(weddingStyle, preferredPhase, guestCount) {
    const recommendations = [];
    
    if (weddingStyle === 'romantic') {
      if (preferredPhase === 'full') {
        recommendations.push("💫 Full moon enhances romantic ambiance naturally");
        recommendations.push("🌹 Use moon-inspired colors: silver, pearl, soft whites");
      }
    }
    
    if (weddingStyle === 'intimate') {
      if (preferredPhase === 'new') {
        recommendations.push("🕯️ New moon perfect for intimate gatherings with candle lighting");
        recommendations.push("✨ Focus on close personal moments rather than grand gestures");
      }
    }
    
    if (weddingStyle === 'grand') {
      if (preferredPhase === 'full') {
        recommendations.push("🎭 Full moon provides dramatic natural backdrop for grand celebrations");
        recommendations.push("🌟 Plan grand entrance timed with moon visibility");
      }
    }
    
    if (guestCount === 'intimate' && preferredPhase === 'new') {
      recommendations.push("👨‍👩‍👧‍👦 Small gatherings suit new moon's intimate energy perfectly");
    }
    
    if (guestCount === 'large' && preferredPhase === 'full') {
      recommendations.push("🎉 Full moon energy matches celebration energy of large gatherings");
    }
    
    return recommendations;
  }
  
  function getPhaseEmoji(phase) {
    const emojis = {
      'full': '🌕',
      'new': '🌑',
      'waxing': '🌔',
      'waning': '🌖',
      'any': '🌙'
    };
    return emojis[phase] || '🌙';
  }
  
  function getPhaseFullName(phase) {
    const names = {
      'full': 'Full Moon',
      'new': 'New Moon',
      'waxing': 'Waxing Moon',
      'waning': 'Waning Moon',
      'any': 'Any Phase'
    };
    return names[phase] || 'Moon Phase';
  }
  
  function getSeasonFromPreference(season) {
    const seasons = {
      'spring': 'Spring Wedding',
      'summer': 'Summer Wedding',
      'fall': 'Fall Wedding',
      'winter': 'Winter Wedding',
      'specific': 'Specific Month',
      '': 'Flexible Season'
    };
    return seasons[season] || 'Any Season';
  }
  
  function getVenueEmoji(venue) {
    const emojis = {
      'outdoor': '🌳',
      'beach': '🏖️',
      'indoor': '🏛️',
      'mountain': '⛰️',
      'desert': '🏜️',
      'city': '🏙️'
    };
    return emojis[venue] || '🏛️';
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
});