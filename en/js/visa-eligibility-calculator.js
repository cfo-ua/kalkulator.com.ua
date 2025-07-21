document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('visa-form');
  const result = document.getElementById('visa-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const destination = document.getElementById('destination').value;
      const purpose = document.getElementById('purpose').value;
      const duration = parseInt(document.getElementById('duration').value);
      const income = document.getElementById('income').value;
      const funds = document.getElementById('funds').value;
      const employment = document.getElementById('employment').value;
      const education = document.getElementById('education').value;
      const travelHistory = document.getElementById('travel-history').value;
      const visaHistory = document.getElementById('visa-history').value;
      
      // Check home country ties
      const hasProperty = document.getElementById('property').checked;
      const hasFamily = document.getElementById('family').checked;
      const hasJob = document.getElementById('job').checked;
      const hasBusiness = document.getElementById('business').checked;
      
      // Validation
      if (!destination || !purpose || !income || !funds || !employment || !education || !travelHistory || !visaHistory) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Calculate eligibility score
      let score = 0;
      let maxScore = 100;
      let feedback = [];
      let tips = [];
      let warnings = [];
      
      // Income scoring (25 points)
      const incomeScores = {
        'under1000': 5,
        '1000-2500': 10,
        '2500-5000': 15,
        '5000-10000': 20,
        'over10000': 25
      };
      score += incomeScores[income] || 0;
      if (incomeScores[income] < 15) {
        warnings.push("💰 Low income may affect visa approval chances");
        tips.push("Consider showing additional financial support or savings");
      }
      
      // Available funds scoring (20 points)
      const fundsScores = {
        'under1000': 5,
        '1000-5000': 10,
        '5000-15000': 15,
        '15000-50000': 18,
        'over50000': 20
      };
      score += fundsScores[funds] || 0;
      
      // Purpose-specific adjustments
      const purposeMultipliers = {
        'tourism': 1.0,
        'business': 1.1,
        'family': 0.9,
        'study': 1.0,
        'work': 1.2,
        'medical': 0.8
      };
      
      // Duration impact (10 points)
      let durationScore = 10;
      if (duration > 90) {
        durationScore = 5;
        warnings.push("📅 Long stays may require additional documentation");
      } else if (duration > 30) {
        durationScore = 7;
      }
      score += durationScore;
      
      // Employment scoring (15 points)
      const employmentScores = {
        'employed': 15,
        'self-employed': 12,
        'student': 10,
        'retired': 8,
        'unemployed': 3
      };
      score += employmentScores[employment] || 0;
      if (employment === 'unemployed') {
        warnings.push("🏢 Unemployment may negatively impact application");
        tips.push("Consider finding employment or showing alternative income sources");
      }
      
      // Education scoring (5 points)
      const educationScores = {
        'high-school': 2,
        'diploma': 3,
        'bachelors': 4,
        'masters': 5,
        'phd': 5
      };
      score += educationScores[education] || 0;
      
      // Travel history scoring (15 points)
      const travelScores = {
        'none': 2,
        'limited': 8,
        'moderate': 12,
        'extensive': 15
      };
      score += travelScores[travelHistory] || 0;
      if (travelHistory === 'none') {
        warnings.push("✈️ No travel history may be viewed as high risk");
        tips.push("Consider traveling to visa-free countries first to build travel history");
      }
      
      // Visa history scoring (10 points)
      const visaScores = {
        'none': 5,
        'approved': 10,
        'mixed': 6,
        'rejected': 1
      };
      score += visaScores[visaHistory] || 0;
      if (visaHistory === 'rejected') {
        warnings.push("❌ Previous visa rejections significantly impact new applications");
        tips.push("Address the reasons for previous rejections before reapplying");
      }
      
      // Home country ties bonus (up to 8 points)
      let tiesCount = 0;
      if (hasProperty) tiesCount++;
      if (hasFamily) tiesCount++;
      if (hasJob) tiesCount++;
      if (hasBusiness) tiesCount++;
      
      score += tiesCount * 2;
      if (tiesCount < 2) {
        warnings.push("🏠 Weak home country ties may indicate overstay risk");
        tips.push("Document strong reasons to return home (job, family, property)");
      }
      
      // Country-specific adjustments
      const countryDifficulty = {
        'us': 0.9,      // Stricter requirements
        'uk': 0.95,     // Moderate difficulty
        'canada': 1.0,  // Standard
        'australia': 1.0, // Standard
        'schengen': 1.05  // Generally easier
      };
      
      score = Math.round(score * (countryMultipliers[destination] || 1.0) * (purposeMultipliers[purpose] || 1.0));
      score = Math.min(score, 100); // Cap at 100
      
      // Generate country-specific requirements
      const countryInfo = getCountryInfo(destination, purpose);
      
      // Generate result
      let eligibilityLevel = '';
      let cardClass = '';
      let recommendation = '';
      
      if (score >= 80) {
        eligibilityLevel = 'Excellent';
        cardClass = 'success';
        recommendation = 'Your profile looks strong! Prepare your documentation carefully and apply with confidence.';
      } else if (score >= 65) {
        eligibilityLevel = 'Good';
        cardClass = 'info';
        recommendation = 'You have a good chance of approval. Address any weak areas to strengthen your application.';
      } else if (score >= 50) {
        eligibilityLevel = 'Fair';
        cardClass = 'warning';
        recommendation = 'Your application may need improvements. Focus on strengthening weak areas before applying.';
      } else {
        eligibilityLevel = 'Low';
        cardClass = 'warning';
        recommendation = 'Consider improving your profile significantly before applying to increase chances of success.';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>🎯 Eligibility Score</h6>
            <div class="big-number">${score}%</div>
            <p class="insight-detail">${eligibilityLevel} Eligibility</p>
          </div>
          
          <div class="insight-card info">
            <h6>🌍 Destination</h6>
            <div class="big-number">${countryInfo.flag}</div>
            <p class="insight-detail">${countryInfo.name}</p>
          </div>
          
          <div class="insight-card info">
            <h6>📋 Visa Type</h6>
            <div class="big-number">${getPurposeEmoji(purpose)}</div>
            <p class="insight-detail">${purpose.charAt(0).toUpperCase() + purpose.slice(1)}</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>📊 Assessment Summary</h4>
          <p><strong>${recommendation}</strong></p>
        </div>`;
      
      // Add warnings if any
      if (warnings.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>⚠️ Areas of Concern</h4>
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
            <h4>💡 Improvement Tips</h4>
            <ul>`;
        tips.forEach(tip => {
          resultHTML += `<li>${tip}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add country-specific requirements
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📋 Required Documents for ${countryInfo.name}</h4>
          <ul>`;
      countryInfo.requirements.forEach(req => {
        resultHTML += `<li>${req}</li>`;
      });
      resultHTML += `</ul></div>`;
      
      // Add processing info
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>⏱️ Processing Information</h4>
          <p><strong>Typical processing time:</strong> ${countryInfo.processingTime}</p>
          <p><strong>Application fee:</strong> ${countryInfo.fee}</p>
          <p><strong>Best time to apply:</strong> ${countryInfo.timing}</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function getCountryInfo(destination, purpose) {
    const countryData = {
      'us': {
        name: 'United States',
        flag: '🇺🇸',
        processingTime: '2 weeks to 6 months',
        fee: '$160-$190 USD',
        timing: '3-6 months before travel',
        requirements: [
          'Valid passport (6 months validity)',
          'DS-160 online application form',
          'Visa interview appointment',
          'Passport-style photograph',
          'Bank statements (3-6 months)',
          'Employment letter or proof of studies',
          'Travel itinerary and hotel bookings',
          'Proof of home country ties'
        ]
      },
      'canada': {
        name: 'Canada',
        flag: '🇨🇦',
        processingTime: '2-12 weeks',
        fee: '$100-$150 CAD',
        timing: '2-4 months before travel',
        requirements: [
          'Valid passport',
          'Online application (GCKey account)',
          'Digital photograph',
          'Bank statements',
          'Letter of invitation (if applicable)',
          'Travel history documents',
          'Proof of employment or studies',
          'Travel insurance (recommended)'
        ]
      },
      'uk': {
        name: 'United Kingdom',
        flag: '🇬🇧',
        processingTime: '3-6 weeks',
        fee: '£95-£361 GBP',
        timing: '3 months before travel',
        requirements: [
          'Valid passport',
          'Online application form',
          'Biometric appointment',
          'Bank statements (6 months)',
          'Payslips or employment letter',
          'Travel itinerary',
          'Accommodation details',
          'Tuberculosis test (some countries)'
        ]
      },
      'australia': {
        name: 'Australia',
        flag: '🇦🇺',
        processingTime: '2-4 weeks',
        fee: '$145-$365 AUD',
        timing: '1-3 months before travel',
        requirements: [
          'Valid passport',
          'Online application (ImmiAccount)',
          'Passport photograph',
          'Bank statements',
          'Health insurance',
          'Character documents (if required)',
          'English language proof (some visas)',
          'Skills assessment (work visas)'
        ]
      },
      'schengen': {
        name: 'Schengen Area',
        flag: '🇪🇺',
        processingTime: '2-3 weeks',
        fee: '€80 EUR',
        timing: '1-3 months before travel',
        requirements: [
          'Valid passport (3 months validity)',
          'Visa application form',
          'Passport photographs',
          'Travel insurance (€30,000 coverage)',
          'Flight bookings',
          'Hotel reservations',
          'Bank statements (3 months)',
          'Employment certificate'
        ]
      }
    };
    
    return countryData[destination] || countryData['us'];
  }
  
  function getPurposeEmoji(purpose) {
    const emojis = {
      'tourism': '🏖️',
      'business': '💼',
      'work': '🏢',
      'study': '📚',
      'family': '👨‍👩‍👧‍👦',
      'medical': '🏥'
    };
    return emojis[purpose] || '📋';
  }
  
  // Country difficulty multipliers (used in score calculation)
  const countryMultipliers = {
    'us': 0.9,
    'uk': 0.95,
    'canada': 1.0,
    'australia': 1.0,
    'schengen': 1.05
  };
});