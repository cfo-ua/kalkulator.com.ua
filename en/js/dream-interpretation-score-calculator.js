document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('dream-form');
  const result = document.getElementById('dream-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const dreamType = document.getElementById('dream-type').value;
      const dreamFrequency = document.getElementById('dream-frequency').value;
      const dreamTiming = document.getElementById('dream-timing').value;
      const dreamEmotion = document.getElementById('dream-emotion').value;
      const emotionalIntensity = parseInt(document.getElementById('emotional-intensity').value);
      const dreamVividness = document.getElementById('dream-vividness').value;
      const stressLevel = document.getElementById('stress-level').value;
      const lifeEvents = document.getElementById('life-events').value;
      const lifeRelevance = document.getElementById('life-relevance').value;
      
      // Check dream characteristics
      const isLucidDream = document.getElementById('lucid-dream').checked;
      const wokeUpSuddenly = document.getElementById('woke-up-suddenly').checked;
      const rememberedImmediately = document.getElementById('remembered-immediately').checked;
      
      // Check people in dream
      const familyMembers = document.getElementById('family-members').checked;
      const strangers = document.getElementById('strangers').checked;
      const deceasedPeople = document.getElementById('deceased-people').checked;
      const children = document.getElementById('children').checked;
      const celebrities = document.getElementById('celebrities').checked;
      const exPartners = document.getElementById('ex-partners').checked;
      
      // Check environment
      const darkEnvironment = document.getElementById('dark-environment').checked;
      const brightEnvironment = document.getElementById('bright-environment').checked;
      const indoorSetting = document.getElementById('indoor-setting').checked;
      const outdoorSetting = document.getElementById('outdoor-setting').checked;
      const familiarPlaces = document.getElementById('familiar-places').checked;
      const unknownPlaces = document.getElementById('unknown-places').checked;
      
      // Check activities
      const violenceConflict = document.getElementById('violence-conflict').checked;
      const romanceIntimacy = document.getElementById('romance-intimacy').checked;
      const communication = document.getElementById('communication').checked;
      const physicalActivity = document.getElementById('physical-activity').checked;
      const transformation = document.getElementById('transformation').checked;
      const lossSearching = document.getElementById('loss-searching').checked;
      
      // Check life context
      const processingTrauma = document.getElementById('processing-trauma').checked;
      const majorDecision = document.getElementById('major-decision').checked;
      const personalGrowth = document.getElementById('personal-growth').checked;
      
      // Validation
      if (!dreamType || !dreamFrequency || !dreamTiming || !dreamEmotion || !emotionalIntensity || !dreamVividness || !stressLevel || !lifeEvents || !lifeRelevance) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Calculate scores
      let psychologicalSignificance = 0;
      let symbolicRichness = 0;
      let emotionalIntensityScore = 0;
      let lifeRelevanceScore = 0;
      let urgencyLevel = 0;
      
      // Calculate Psychological Significance (0-100)
      const dreamTypeScores = {
        'house': 85, 'water': 80, 'flying': 75, 'chase': 90, 'falling': 85,
        'people': 70, 'animals': 75, 'death': 95, 'test': 70, 'vehicle': 65,
        'work': 60, 'nature': 55, 'nightmare': 90, 'romantic': 70, 'other': 60
      };
      psychologicalSignificance += dreamTypeScores[dreamType] || 60;
      
      // Frequency bonus/penalty
      const frequencyMultipliers = {
        'first-time': 1.0,
        'occasional': 0.9,
        'regular': 1.1,
        'frequent': 1.2,
        'recurring': 1.4
      };
      psychologicalSignificance *= frequencyMultipliers[dreamFrequency] || 1.0;
      
      // Lucid dream adjustment
      if (isLucidDream) {
        psychologicalSignificance *= 1.2;
      }
      
      // Cap at 100
      psychologicalSignificance = Math.min(psychologicalSignificance, 100);
      
      // Calculate Symbolic Richness (0-100)
      let symbolCount = 0;
      
      // People symbols
      if (familyMembers) symbolCount += 15;
      if (strangers) symbolCount += 10;
      if (deceasedPeople) symbolCount += 25;
      if (children) symbolCount += 20;
      if (celebrities) symbolCount += 15;
      if (exPartners) symbolCount += 20;
      
      // Environment symbols
      if (darkEnvironment) symbolCount += 15;
      if (brightEnvironment) symbolCount += 10;
      if (unknownPlaces) symbolCount += 15;
      if (familiarPlaces) symbolCount += 10;
      
      // Activity symbols
      if (violenceConflict) symbolCount += 20;
      if (romanceIntimacy) symbolCount += 15;
      if (transformation) symbolCount += 25;
      if (lossSearching) symbolCount += 20;
      if (communication) symbolCount += 10;
      if (physicalActivity) symbolCount += 10;
      
      symbolicRichness = Math.min(symbolCount, 100);
      
      // Vividness bonus
      const vividnessMultipliers = {
        'vague': 0.7,
        'moderate': 1.0,
        'vivid': 1.2,
        'extremely-vivid': 1.4
      };
      symbolicRichness *= vividnessMultipliers[dreamVividness] || 1.0;
      symbolicRichness = Math.min(symbolicRichness, 100);
      
      // Calculate Emotional Intensity Score (0-100)
      emotionalIntensityScore = emotionalIntensity * 10;
      
      // Emotion type multipliers
      const emotionMultipliers = {
        'positive': 0.8,
        'neutral': 0.6,
        'anxious': 1.1,
        'fearful': 1.3,
        'sad': 1.2,
        'angry': 1.2,
        'confused': 1.1,
        'mixed': 1.3
      };
      emotionalIntensityScore *= emotionMultipliers[dreamEmotion] || 1.0;
      
      if (wokeUpSuddenly) {
        emotionalIntensityScore *= 1.2;
      }
      
      emotionalIntensityScore = Math.min(emotionalIntensityScore, 100);
      
      // Calculate Life Relevance Score (0-100)
      const relevanceScores = {
        'very-relevant': 100,
        'somewhat-relevant': 70,
        'unclear': 40,
        'not-relevant': 20
      };
      lifeRelevanceScore = relevanceScores[lifeRelevance] || 50;
      
      // Stress level impact
      const stressMultipliers = {
        'low': 0.8,
        'moderate': 1.0,
        'high': 1.2,
        'extreme': 1.4
      };
      lifeRelevanceScore *= stressMultipliers[stressLevel] || 1.0;
      
      // Life events impact
      const eventMultipliers = {
        'none': 0.9,
        'relationship': 1.2,
        'work': 1.1,
        'family': 1.3,
        'health': 1.3,
        'financial': 1.2,
        'moving': 1.1,
        'education': 1.1,
        'multiple': 1.4
      };
      lifeRelevanceScore *= eventMultipliers[lifeEvents] || 1.0;
      
      lifeRelevanceScore = Math.min(lifeRelevanceScore, 100);
      
      // Calculate Urgency Level (0-100)
      urgencyLevel = (psychologicalSignificance + emotionalIntensityScore + lifeRelevanceScore) / 3;
      
      // Special urgency factors
      if (dreamFrequency === 'recurring') urgencyLevel *= 1.3;
      if (deceasedPeople) urgencyLevel *= 1.2;
      if (violenceConflict && emotionalIntensity >= 7) urgencyLevel *= 1.2;
      if (processingTrauma) urgencyLevel *= 1.3;
      if (majorDecision) urgencyLevel *= 1.2;
      
      urgencyLevel = Math.min(urgencyLevel, 100);
      
      // Round all scores
      psychologicalSignificance = Math.round(psychologicalSignificance);
      symbolicRichness = Math.round(symbolicRichness);
      emotionalIntensityScore = Math.round(emotionalIntensityScore);
      lifeRelevanceScore = Math.round(lifeRelevanceScore);
      urgencyLevel = Math.round(urgencyLevel);
      
      // Calculate overall score
      const overallScore = Math.round(
        (psychologicalSignificance * 0.25) +
        (symbolicRichness * 0.2) +
        (emotionalIntensityScore * 0.2) +
        (lifeRelevanceScore * 0.25) +
        (urgencyLevel * 0.1)
      );
      
      // Generate interpretations
      const dreamTypeInfo = getDreamTypeInterpretation(dreamType);
      const emotionAnalysis = getEmotionAnalysis(dreamEmotion, emotionalIntensity);
      const symbolAnalysis = getSymbolAnalysis(familyMembers, strangers, deceasedPeople, children, celebrities, exPartners, transformation, lossSearching, violenceConflict);
      const recommendations = getRecommendations(overallScore, dreamFrequency, stressLevel, processingTrauma, majorDecision);
      
      // Determine overall interpretation level
      let interpretationLevel = '';
      let cardClass = '';
      let mainMessage = '';
      
      if (overallScore >= 80) {
        interpretationLevel = 'Highly Significant';
        cardClass = 'warning';
        mainMessage = 'This dream appears to carry important psychological significance and deserves careful attention.';
      } else if (overallScore >= 65) {
        interpretationLevel = 'Moderately Significant';
        cardClass = 'info';
        mainMessage = 'This dream contains meaningful elements that may provide insights into your current state.';
      } else if (overallScore >= 45) {
        interpretationLevel = 'Some Significance';
        cardClass = 'info';
        mainMessage = 'This dream has some notable elements but may be more routine processing.';
      } else {
        interpretationLevel = 'Low Significance';
        cardClass = 'success';
        mainMessage = 'This appears to be a routine dream, possibly just brain maintenance during sleep.';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🔮 Overall Score</h6>
            <div class="big-number">${overallScore}</div>
            <p class="insight-detail">${interpretationLevel}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🧠 Psychological</h6>
            <div class="big-number">${psychologicalSignificance}</div>
            <p class="insight-detail">Significance</p>
          </div>
          
          <div class="insight-card info">
            <h6>🔮 Symbolic</h6>
            <div class="big-number">${symbolicRichness}</div>
            <p class="insight-detail">Richness</p>
          </div>
          
          <div class="insight-card info">
            <h6>💭 Emotional</h6>
            <div class="big-number">${emotionalIntensityScore}</div>
            <p class="insight-detail">Intensity</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>🔍 Dream Analysis Summary</h4>
          <p><strong>${mainMessage}</strong></p>
        </div>`;
      
      // Add dream type interpretation
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>${dreamTypeInfo.emoji} ${dreamTypeInfo.name} Interpretation</h4>
          <p><strong>General Meaning:</strong> ${dreamTypeInfo.generalMeaning}</p>
          <p><strong>Psychological Significance:</strong> ${dreamTypeInfo.psychologicalMeaning}</p>
          <p><strong>Possible Messages:</strong> ${dreamTypeInfo.possibleMessages}</p>
        </div>`;
      
      // Add emotional analysis
      if (emotionAnalysis) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💭 Emotional Analysis</h4>
            <p><strong>Primary Emotion:</strong> ${emotionAnalysis.description}</p>
            <p><strong>Intensity Level:</strong> ${emotionAnalysis.intensityDescription}</p>
            <p><strong>Possible Meaning:</strong> ${emotionAnalysis.meaning}</p>
          </div>`;
      }
      
      // Add symbol analysis
      if (symbolAnalysis.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>🔮 Key Symbols Detected</h4>
            <ul>`;
        symbolAnalysis.forEach(symbol => {
          resultHTML += `<li><strong>${symbol.symbol}:</strong> ${symbol.meaning}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add detailed scores breakdown
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📊 Detailed Score Breakdown</h4>
          <div style="display: grid; gap: 1rem; margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>🎯 Life Relevance</span>
              <span><strong>${lifeRelevanceScore}/100</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
              <span>⚡ Urgency Level</span>
              <span><strong>${urgencyLevel}/100</strong></span>
            </div>
          </div>
        </div>`;
      
      // Add recommendations
      if (recommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Recommendations & Next Steps</h4>
            <ul>`;
        recommendations.forEach(rec => {
          resultHTML += `<li>${rec}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add general dream tips
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📝 General Dream Analysis Tips</h4>
          <ul>
            <li><strong>Keep a dream journal:</strong> Record dreams immediately upon waking</li>
            <li><strong>Look for patterns:</strong> Notice recurring themes, people, or emotions</li>
            <li><strong>Consider your life context:</strong> How might current events influence your dreams?</li>
            <li><strong>Trust your instincts:</strong> Your personal associations are most important</li>
            <li><strong>Don't over-analyze:</strong> Sometimes dreams are just random brain activity</li>
          </ul>
        </div>`;
      
      // Add disclaimer
      resultHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid var(--accent);">
          <h4>⚠️ Important Note</h4>
          <p>Dream interpretation is highly subjective and personal. This analysis is based on common psychological theories and symbol meanings, but your own associations and life context are most important. If dreams are causing significant distress or affecting your daily life, consider speaking with a mental health professional.</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function getDreamTypeInterpretation(dreamType) {
    const interpretations = {
      'house': {
        name: 'House/Home Dreams',
        emoji: '🏠',
        generalMeaning: 'Houses often represent the self, your psyche, or your current life situation.',
        psychologicalMeaning: 'Different rooms may represent different aspects of your personality or life areas.',
        possibleMessages: 'Changes needed in your life, self-exploration, family dynamics, or personal boundaries.'
      },
      'water': {
        name: 'Water Dreams',
        emoji: '🌊',
        generalMeaning: 'Water typically symbolizes emotions, the unconscious mind, and spiritual cleansing.',
        psychologicalMeaning: 'The state of water (calm, turbulent, deep) reflects your emotional state.',
        possibleMessages: 'Emotional processing, need for cleansing, spiritual growth, or subconscious exploration.'
      },
      'flying': {
        name: 'Flying Dreams',
        emoji: '✈️',
        generalMeaning: 'Flying represents freedom, transcendence, and release from limitations.',
        psychologicalMeaning: 'Often indicates desire for independence or escape from current constraints.',
        possibleMessages: 'Need for more freedom, spiritual growth, overcoming obstacles, or rising above problems.'
      },
      'chase': {
        name: 'Chase Dreams',
        emoji: '🏃',
        generalMeaning: 'Being chased usually represents avoidance of something in your waking life.',
        psychologicalMeaning: 'The pursuer often represents aspects of yourself or situations you\'re avoiding.',
        possibleMessages: 'Face avoided issues, confront fears, or address unresolved conflicts.'
      },
      'falling': {
        name: 'Falling Dreams',
        emoji: '😱',
        generalMeaning: 'Falling represents loss of control, insecurity, or fear of failure.',
        psychologicalMeaning: 'Often occurs during periods of stress or major life transitions.',
        possibleMessages: 'Need for more stability, addressing insecurities, or accepting lack of control.'
      },
      'death': {
        name: 'Death Dreams',
        emoji: '💀',
        generalMeaning: 'Death rarely represents literal death; usually symbolizes transformation or endings.',
        psychologicalMeaning: 'Indicates major life transitions, letting go of old patterns, or personal transformation.',
        possibleMessages: 'Embrace change, release the past, or prepare for new life phases.'
      },
      'nightmare': {
        name: 'Nightmares',
        emoji: '😨',
        generalMeaning: 'Nightmares process fears, trauma, or high stress levels.',
        psychologicalMeaning: 'Help you confront and process difficult emotions or experiences.',
        possibleMessages: 'Address underlying fears, seek support for trauma, or manage stress levels.'
      }
    };
    
    return interpretations[dreamType] || {
      name: 'Mixed Dreams',
      emoji: '🔮',
      generalMeaning: 'Complex dreams with multiple themes often reflect complex life situations.',
      psychologicalMeaning: 'May indicate processing multiple issues simultaneously.',
      possibleMessages: 'Take time to analyze different dream elements separately.'
    };
  }
  
  function getEmotionAnalysis(emotion, intensity) {
    const emotions = {
      'positive': {
        description: 'Positive emotions (joy, peace, excitement)',
        intensityDescription: `Intensity ${intensity}/10 - ${intensity >= 7 ? 'Strong positive feelings' : 'Mild to moderate positive feelings'}`,
        meaning: 'May reflect satisfaction with life, successful processing of experiences, or optimistic outlook.'
      },
      'anxious': {
        description: 'Anxiety and worry',
        intensityDescription: `Intensity ${intensity}/10 - ${intensity >= 7 ? 'High anxiety levels' : 'Manageable anxiety'}`,
        meaning: 'Likely reflects current life stresses, concerns about the future, or unresolved worries.'
      },
      'fearful': {
        description: 'Fear and terror',
        intensityDescription: `Intensity ${intensity}/10 - ${intensity >= 7 ? 'Intense fear response' : 'Moderate fear levels'}`,
        meaning: 'May indicate deep-seated fears, trauma processing, or feeling threatened in some area of life.'
      },
      'sad': {
        description: 'Sadness and melancholy',
        intensityDescription: `Intensity ${intensity}/10 - ${intensity >= 7 ? 'Deep sadness' : 'Mild to moderate sadness'}`,
        meaning: 'Could reflect grief, loss, disappointment, or depression that needs attention.'
      },
      'angry': {
        description: 'Anger and frustration',
        intensityDescription: `Intensity ${intensity}/10 - ${intensity >= 7 ? 'Intense anger' : 'Manageable frustration'}`,
        meaning: 'May represent suppressed anger, injustice feelings, or frustration with current circumstances.'
      },
      'confused': {
        description: 'Confusion and disorientation',
        intensityDescription: `Intensity ${intensity}/10 - ${intensity >= 7 ? 'High confusion levels' : 'Some uncertainty'}`,
        meaning: 'Reflects uncertainty in life, difficulty making decisions, or feeling lost in current situations.'
      }
    };
    
    return emotions[emotion];
  }
  
  function getSymbolAnalysis(familyMembers, strangers, deceasedPeople, children, celebrities, exPartners, transformation, lossSearching, violenceConflict) {
    const symbols = [];
    
    if (familyMembers) {
      symbols.push({
        symbol: '👨‍👩‍👧‍👦 Family Members',
        meaning: 'Represent family dynamics, your roots, support systems, or unresolved family issues'
      });
    }
    
    if (strangers) {
      symbols.push({
        symbol: '👤 Unknown People',
        meaning: 'Often represent unknown aspects of yourself or new possibilities entering your life'
      });
    }
    
    if (deceasedPeople) {
      symbols.push({
        symbol: '👻 Deceased People',
        meaning: 'May represent grief processing, messages from your unconscious, or qualities they embodied'
      });
    }
    
    if (children) {
      symbols.push({
        symbol: '👶 Children/Babies',
        meaning: 'Symbolize new beginnings, innocence, creativity, or your inner child needing attention'
      });
    }
    
    if (celebrities) {
      symbols.push({
        symbol: '⭐ Celebrities',
        meaning: 'Represent qualities you admire, desire for recognition, or aspects of fame/success'
      });
    }
    
    if (exPartners) {
      symbols.push({
        symbol: '💔 Ex-Partners',
        meaning: 'May indicate unresolved feelings, relationship patterns, or aspects of past relationships affecting present'
      });
    }
    
    if (transformation) {
      symbols.push({
        symbol: '🦋 Transformation',
        meaning: 'Powerful symbol of personal growth, major life changes, or spiritual evolution'
      });
    }
    
    if (lossSearching) {
      symbols.push({
        symbol: '🔍 Lost/Searching',
        meaning: 'Represents feeling lost in life, searching for purpose, or missing something important'
      });
    }
    
    if (violenceConflict) {
      symbols.push({
        symbol: '⚔️ Violence/Conflict',
        meaning: 'May represent inner conflict, suppressed aggression, or external conflicts needing resolution'
      });
    }
    
    return symbols;
  }
  
  function getRecommendations(overallScore, dreamFrequency, stressLevel, processingTrauma, majorDecision) {
    const recommendations = [];
    
    if (overallScore >= 80) {
      recommendations.push('📝 This dream deserves detailed journaling and reflection');
      recommendations.push('🤔 Consider what major life areas this dream might be addressing');
      recommendations.push('💬 Discuss this dream with a trusted friend or counselor');
    }
    
    if (dreamFrequency === 'recurring') {
      recommendations.push('🔄 Pay special attention to recurring dreams - they often indicate unresolved issues');
      recommendations.push('📊 Track patterns in your recurring dreams for deeper insights');
    }
    
    if (stressLevel === 'high' || stressLevel === 'extreme') {
      recommendations.push('😰 Your high stress levels may be influencing your dreams');
      recommendations.push('🧘 Consider stress management techniques like meditation or exercise');
    }
    
    if (processingTrauma) {
      recommendations.push('🏥 Consider professional support for trauma processing');
      recommendations.push('🛡️ Practice self-care and emotional safety while processing difficult dreams');
    }
    
    if (majorDecision) {
      recommendations.push('⚖️ Your dreams may be helping you process your major decision');
      recommendations.push('💭 Pay attention to dream emotions and outcomes for decision insights');
    }
    
    // General recommendations based on score
    if (overallScore < 45) {
      recommendations.push('😴 This appears to be routine dream processing - no urgent action needed');
    }
    
    recommendations.push('📚 Continue learning about dream interpretation to deepen your understanding');
    
    return recommendations;
  }
});