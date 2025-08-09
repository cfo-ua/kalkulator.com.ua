document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('visa-checklist-form');
  const result = document.getElementById('visa-checklist-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const destinationCountry = document.getElementById('destination-country').value;
      const studyLevel = document.getElementById('study-level').value;
      const programDuration = document.getElementById('program-duration').value;
      const startDate = document.getElementById('start-date').value;
      const educationStatus = document.getElementById('education-status').value;
      const englishTest = document.getElementById('english-test').value;
      const fundingSource = document.getElementById('funding-source').value;
      const studyCosts = document.getElementById('study-costs').value;
      const passportStatus = document.getElementById('passport-status').value;
      const visaHistory = document.getElementById('visa-history').value;
      const applicationUrgency = document.getElementById('application-urgency').value;
      const preparationStatus = document.getElementById('preparation-status').value;
      
      // Check additional factors
      const haveAcceptance = document.getElementById('have-acceptance').checked;
      const needTranscripts = document.getElementById('need-transcripts').checked;
      const needCredentialEvaluation = document.getElementById('need-credential-evaluation').checked;
      const haveBankStatements = document.getElementById('have-bank-statements').checked;
      const needSponsor = document.getElementById('need-sponsor').checked;
      const scholarshipPending = document.getElementById('scholarship-pending').checked;
      const healthConditions = document.getElementById('health-conditions').checked;
      const vaccinationsNeeded = document.getElementById('vaccinations-needed').checked;
      const criminalRecord = document.getElementById('criminal-record').checked;
      const tightDeadline = document.getElementById('tight-deadline').checked;
      const preferProfessionalHelp = document.getElementById('prefer-professional-help').checked;
      
      // Validation
      if (!destinationCountry || !studyLevel || !programDuration || !startDate || !educationStatus || !englishTest || !fundingSource || !studyCosts || !passportStatus || !visaHistory || !applicationUrgency || !preparationStatus) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Generate country-specific checklist
      const countryInfo = getCountryInfo(destinationCountry);
      const checklist = generateChecklist(destinationCountry, studyLevel, educationStatus, englishTest, fundingSource, passportStatus, haveAcceptance, needTranscripts, haveBankStatements, needSponsor, healthConditions, vaccinationsNeeded, criminalRecord);
      const timeline = generateTimeline(destinationCountry, applicationUrgency, startDate, tightDeadline);
      const priorities = generatePriorities(checklist, applicationUrgency, preparationStatus);
      
      // Calculate readiness score
      let readinessScore = calculateReadinessScore(
        haveAcceptance, haveBankStatements, passportStatus, englishTest, 
        preparationStatus, needTranscripts, needCredentialEvaluation
      );
      
      // Determine readiness level
      let readinessLevel = '';
      let cardClass = '';
      let readinessMessage = '';
      
      if (readinessScore >= 80) {
        readinessLevel = 'Ready to Apply';
        cardClass = 'success';
        readinessMessage = 'You have most requirements ready and can likely apply soon!';
      } else if (readinessScore >= 60) {
        readinessLevel = 'Almost Ready';
        cardClass = 'info';
        readinessMessage = 'You\'re making good progress. Focus on remaining requirements.';
      } else if (readinessScore >= 40) {
        readinessLevel = 'In Progress';
        cardClass = 'warning';
        readinessMessage = 'You have several items to complete before applying.';
      } else {
        readinessLevel = 'Getting Started';
        cardClass = 'warning';
        readinessMessage = 'Start with priority items and allow sufficient time for preparation.';
      }
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>📊 Readiness Score</h6>
            <div class="big-number">${readinessScore}%</div>
            <p class="insight-detail">${readinessLevel}</p>
          </div>
          
          <div class="insight-card info">
            <h6>🌍 Destination</h6>
            <div class="big-number">${countryInfo.flag}</div>
            <p class="insight-detail">${countryInfo.name}</p>
          </div>
          
          <div class="insight-card info">
            <h6>📋 Total Items</h6>
            <div class="big-number">${checklist.length}</div>
            <p class="insight-detail">Checklist Items</p>
          </div>
          
          <div class="insight-card info">
            <h6>⏰ Est. Timeline</h6>
            <div class="big-number">${timeline.totalWeeks}w</div>
            <p class="insight-detail">Preparation Time</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>📊 Application Readiness Assessment</h4>
          <p><strong>${readinessMessage}</strong></p>
        </div>`;
      
      // Add country-specific information
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>${countryInfo.flag} ${countryInfo.name} Student Visa Information</h4>
          <div style="display: grid; gap: 1rem; margin-top: 1rem;">
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>📋 Visa Type</h6>
              <p><strong>${countryInfo.visaType}</strong></p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>⏱️ Processing Time</h6>
              <p><strong>${countryInfo.processingTime}</strong></p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>💰 Application Fee</h6>
              <p><strong>${countryInfo.fee}</strong></p>
            </div>
            <div style="padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h6>💵 Financial Requirement</h6>
              <p><strong>${countryInfo.financialRequirement}</strong></p>
            </div>
          </div>
        </div>`;
      
      // Add priority tasks
      if (priorities.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>🎯 Priority Tasks (Do These First)</h4>
            <ol style="margin-left: 1.5rem;">`;
        priorities.forEach(priority => {
          resultHTML += `<li style="margin: 0.5rem 0;"><strong>${priority}</strong></li>`;
        });
        resultHTML += `</ol></div>`;
      }
      
      // Add complete checklist organized by category
      const categorizedChecklist = categorizeChecklist(checklist);
      
      Object.keys(categorizedChecklist).forEach(category => {
        if (categorizedChecklist[category].length > 0) {
          resultHTML += `
            <div style="margin-top: 1.5rem;">
              <h4>${getCategoryIcon(category)} ${category}</h4>
              <ul style="margin-left: 1rem;">`;
          
          categorizedChecklist[category].forEach(item => {
            resultHTML += `<li style="margin: 0.5rem 0;">${item}</li>`;
          });
          
          resultHTML += `</ul></div>`;
        }
      });
      
      // Add timeline breakdown
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📅 Recommended Timeline</h4>
          <div style="margin-top: 1rem;">`;
      
      timeline.phases.forEach((phase, index) => {
        resultHTML += `
          <div style="margin: 1rem 0; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid var(--accent);">
            <h6>${phase.period}</h6>
            <p><strong>Focus:</strong> ${phase.focus}</p>
            <ul style="margin: 0.5rem 0;">`;
        phase.tasks.forEach(task => {
          resultHTML += `<li>${task}</li>`;
        });
        resultHTML += `</ul></div>`;
      });
      
      resultHTML += `</div></div>`;
      
      // Add tips and warnings
      const tips = generateTips(destinationCountry, visaHistory, applicationUrgency, preferProfessionalHelp);
      if (tips.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Important Tips & Reminders</h4>
            <ul>`;
        tips.forEach(tip => {
          resultHTML += `<li>${tip}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add helpful resources
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>🔗 Official Resources</h4>
          <ul>
            <li><strong>Official Government Site:</strong> ${countryInfo.officialSite}</li>
            <li><strong>University Resources:</strong> Contact your university's international student office</li>
            <li><strong>Embassy/Consulate:</strong> Find your nearest ${countryInfo.name} embassy or consulate</li>
            <li><strong>Student Forums:</strong> Join online communities for international students</li>
          </ul>
        </div>`;
      
      // Add disclaimer
      resultHTML += `
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 4px solid orange;">
          <h4>⚠️ Important Disclaimer</h4>
          <p>Visa requirements change frequently and can vary by individual circumstances. This checklist provides general guidance based on typical requirements. <strong>Always verify current requirements on official government websites before submitting your application.</strong> Consider consulting with your university's international office or a qualified immigration professional for complex cases.</p>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function getCountryInfo(country) {
    const countries = {
      'usa': {
        name: 'United States',
        flag: '🇺🇸',
        visaType: 'F-1 Student Visa',
        processingTime: '2 weeks to 6 months',
        fee: '$160 USD + SEVIS fee $350',
        financialRequirement: 'Full first year tuition + living expenses',
        officialSite: 'https://travel.state.gov/content/travel/en/us-visas/study.html'
      },
      'canada': {
        name: 'Canada',
        flag: '🇨🇦',
        visaType: 'Study Permit',
        processingTime: '4-12 weeks online',
        fee: '$150 CAD + biometrics $85',
        financialRequirement: '$10,000 CAD/year + tuition',
        officialSite: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html'
      },
      'uk': {
        name: 'United Kingdom',
        flag: '🇬🇧',
        visaType: 'Student Visa',
        processingTime: '3-6 weeks',
        fee: '£348-£475 GBP',
        financialRequirement: '£1,023/month (London) or £820/month (outside London)',
        officialSite: 'https://www.gov.uk/student-visa'
      },
      'australia': {
        name: 'Australia',
        flag: '🇦🇺',
        visaType: 'Student Visa (Subclass 500)',
        processingTime: '2-4 weeks',
        fee: '$630 AUD',
        financialRequirement: '$21,041 AUD/year + tuition',
        officialSite: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500'
      },
      'germany': {
        name: 'Germany',
        flag: '🇩🇪',
        visaType: 'Student Visa (National Visa)',
        processingTime: '4-12 weeks',
        fee: '€75 EUR',
        financialRequirement: '€10,332/year (blocked account)',
        officialSite: 'https://www.make-it-in-germany.com/en/study-training/study/path-to-studies/student-visa'
      },
      'france': {
        name: 'France',
        flag: '🇫🇷',
        visaType: 'Student Visa (VLS-TS)',
        processingTime: '2-4 weeks',
        fee: '€99 EUR',
        financialRequirement: '€615/month minimum',
        officialSite: 'https://www.campusfrance.org/en/student-visa-for-france'
      },
      'netherlands': {
        name: 'Netherlands',
        flag: '🇳🇱',
        visaType: 'Student Visa/MVV',
        processingTime: '2-5 weeks',
        fee: '€192 EUR',
        financialRequirement: '€11,500/year',
        officialSite: 'https://www.studyinholland.nl/plan-your-stay/visa-requirements'
      },
      'newzealand': {
        name: 'New Zealand',
        flag: '🇳🇿',
        visaType: 'Student Visa',
        processingTime: '20-35 days',
        fee: '$330 NZD',
        financialRequirement: '$15,000 NZD/year + tuition',
        officialSite: 'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/student-visa'
      }
    };
    
    return countries[country] || countries['usa'];
  }
  
  function generateChecklist(country, studyLevel, educationStatus, englishTest, fundingSource, passportStatus, haveAcceptance, needTranscripts, haveBankStatements, needSponsor, healthConditions, vaccinationsNeeded, criminalRecord) {
    const checklist = [];
    
    // Essential documents for all countries
    checklist.push('Valid passport with at least 18 months validity');
    checklist.push('Passport-style photographs (country-specific requirements)');
    
    if (!haveAcceptance) {
      checklist.push('University acceptance letter/offer letter');
      checklist.push('Confirmation of enrollment (CAS, I-20, etc.)');
    }
    
    if (englishTest === 'none') {
      checklist.push('English proficiency test (IELTS/TOEFL/PTE)');
    } else if (englishTest !== 'native' && englishTest !== 'waived') {
      checklist.push(`Official ${englishTest.toUpperCase()} test results`);
    }
    
    if (needTranscripts) {
      checklist.push('Official transcripts from all previous educational institutions');
      checklist.push('Degree certificates/diplomas');
    }
    
    // Financial documents
    if (!haveBankStatements) {
      checklist.push('Bank statements (typically 3-6 months)');
    }
    
    if (needSponsor) {
      checklist.push('Financial sponsorship letter');
      checklist.push('Sponsor\'s bank statements and employment proof');
    }
    
    if (fundingSource === 'scholarship') {
      checklist.push('Scholarship award letter');
    } else if (fundingSource === 'loan') {
      checklist.push('Education loan approval letter');
    }
    
    // Country-specific requirements
    if (country === 'usa') {
      checklist.push('SEVIS I-901 fee payment receipt');
      checklist.push('DS-160 online application form');
      checklist.push('Visa interview appointment');
      if (studyLevel === 'graduate' || studyLevel === 'phd') {
        checklist.push('GRE/GMAT scores (if required by university)');
      }
    } else if (country === 'canada') {
      checklist.push('Study permit application (online)');
      checklist.push('Biometrics appointment');
      checklist.push('Medical exam (if required)');
      if (studyLevel === 'language' || studyLevel === 'vocational') {
        checklist.push('Statement of purpose for studies');
      }
    } else if (country === 'uk') {
      checklist.push('CAS (Confirmation of Acceptance for Studies)');
      checklist.push('Academic Technology Approval Scheme (ATAS) certificate (if required)');
      checklist.push('Tuberculosis test results (from some countries)');
    } else if (country === 'australia') {
      checklist.push('Genuine Temporary Entrant (GTE) statement');
      checklist.push('Overseas Student Health Cover (OSHC)');
      checklist.push('English proficiency evidence');
    }
    
    // Health requirements
    if (healthConditions || vaccinationsNeeded) {
      checklist.push('Medical examination by approved panel physician');
      checklist.push('Vaccination records');
    }
    
    if (country === 'usa' || country === 'canada') {
      checklist.push('Medical exam (if required by embassy)');
    }
    
    // Additional documents
    if (criminalRecord) {
      checklist.push('Police clearance certificate');
    }
    
    checklist.push('Statement of purpose/study plan');
    checklist.push('Proof of accommodation arrangements');
    checklist.push('Return ticket or travel itinerary');
    checklist.push('Birth certificate');
    checklist.push('Marriage certificate (if applicable)');
    
    return checklist;
  }
  
  function generateTimeline(country, urgency, startDate, tightDeadline) {
    let totalWeeks = 16; // Default 4 months
    
    if (urgency === 'asap') {
      totalWeeks = 4;
    } else if (urgency === '1-month') {
      totalWeeks = 6;
    } else if (urgency === '2-3-months') {
      totalWeeks = 12;
    } else if (urgency === '6-plus-months') {
      totalWeeks = 24;
    }
    
    const phases = [];
    
    if (totalWeeks >= 16) {
      phases.push({
        period: '16-12 weeks before travel',
        focus: 'Initial preparation and university applications',
        tasks: [
          'Research universities and programs',
          'Take English proficiency tests',
          'Gather academic documents',
          'Apply to universities'
        ]
      });
      
      phases.push({
        period: '12-8 weeks before travel',
        focus: 'Document preparation and financial planning',
        tasks: [
          'Receive university acceptance',
          'Arrange financial documentation',
          'Renew passport if necessary',
          'Research visa requirements'
        ]
      });
      
      phases.push({
        period: '8-4 weeks before travel',
        focus: 'Visa application submission',
        tasks: [
          'Complete visa application forms',
          'Submit visa application',
          'Schedule biometrics/interview',
          'Medical exams if required'
        ]
      });
      
      phases.push({
        period: '4-0 weeks before travel',
        focus: 'Final preparations',
        tasks: [
          'Receive visa decision',
          'Book travel tickets',
          'Arrange accommodation',
          'Prepare for departure'
        ]
      });
    } else {
      phases.push({
        period: 'Immediate priority',
        focus: 'Urgent document gathering',
        tasks: [
          'Check passport validity',
          'Gather all required documents',
          'Complete application forms immediately'
        ]
      });
      
      phases.push({
        period: 'Submit application',
        focus: 'Quick application process',
        tasks: [
          'Submit visa application',
          'Pay all fees',
          'Schedule appointments ASAP'
        ]
      });
    }
    
    return { totalWeeks, phases };
  }
  
  function generatePriorities(checklist, urgency, preparationStatus) {
    const priorities = [];
    
    if (urgency === 'asap' || urgency === '1-month') {
      priorities.push('Check passport validity immediately - renew if expires within 18 months');
      priorities.push('Secure university acceptance letter if not already obtained');
      priorities.push('Gather financial proof documents (bank statements, sponsorship letters)');
    }
    
    priorities.push('Take English proficiency test if not completed');
    priorities.push('Collect all academic transcripts and certificates');
    priorities.push('Prepare financial documentation showing sufficient funds');
    
    if (preparationStatus === 'just-started') {
      priorities.push('Create a detailed timeline and document checklist');
      priorities.push('Research specific requirements for your destination country');
    }
    
    return priorities;
  }
  
  function calculateReadinessScore(haveAcceptance, haveBankStatements, passportStatus, englishTest, preparationStatus, needTranscripts, needCredentialEvaluation) {
    let score = 0;
    
    // Major requirements (20 points each)
    if (haveAcceptance) score += 20;
    if (haveBankStatements) score += 20;
    if (passportStatus === 'valid-long') score += 20;
    else if (passportStatus === 'valid-short') score += 15;
    else if (passportStatus === 'expires-soon') score += 5;
    
    // English test (15 points)
    if (englishTest !== 'none') score += 15;
    
    // Preparation status (15 points)
    if (preparationStatus === 'ready') score += 15;
    else if (preparationStatus === 'almost-ready') score += 12;
    else if (preparationStatus === 'gathering-docs') score += 8;
    else if (preparationStatus === 'just-started') score += 3;
    
    // Additional factors (5 points each)
    if (!needTranscripts) score += 5;
    if (!needCredentialEvaluation) score += 5;
    
    return Math.min(score, 100);
  }
  
  function categorizeChecklist(checklist) {
    const categories = {
      'Academic Documents': [],
      'Financial Proof': [],
      'Identity & Personal Documents': [],
      'Health Requirements': [],
      'Application Forms & Fees': [],
      'Additional Requirements': []
    };
    
    checklist.forEach(item => {
      const itemLower = item.toLowerCase();
      
      if (itemLower.includes('transcript') || itemLower.includes('diploma') || itemLower.includes('degree') || itemLower.includes('ielts') || itemLower.includes('toefl') || itemLower.includes('gre') || itemLower.includes('gmat') || itemLower.includes('acceptance') || itemLower.includes('cas') || itemLower.includes('i-20')) {
        categories['Academic Documents'].push(item);
      } else if (itemLower.includes('bank') || itemLower.includes('financial') || itemLower.includes('sponsor') || itemLower.includes('scholarship') || itemLower.includes('loan') || itemLower.includes('fund')) {
        categories['Financial Proof'].push(item);
      } else if (itemLower.includes('passport') || itemLower.includes('photo') || itemLower.includes('birth') || itemLower.includes('marriage') || itemLower.includes('police') || itemLower.includes('criminal')) {
        categories['Identity & Personal Documents'].push(item);
      } else if (itemLower.includes('medical') || itemLower.includes('health') || itemLower.includes('vaccination') || itemLower.includes('tuberculosis')) {
        categories['Health Requirements'].push(item);
      } else if (itemLower.includes('application') || itemLower.includes('form') || itemLower.includes('fee') || itemLower.includes('ds-160') || itemLower.includes('interview') || itemLower.includes('biometric')) {
        categories['Application Forms & Fees'].push(item);
      } else {
        categories['Additional Requirements'].push(item);
      }
    });
    
    return categories;
  }
  
  function getCategoryIcon(category) {
    const icons = {
      'Academic Documents': '📚',
      'Financial Proof': '💰',
      'Identity & Personal Documents': '🆔',
      'Health Requirements': '🏥',
      'Application Forms & Fees': '📝',
      'Additional Requirements': '📋'
    };
    return icons[category] || '📄';
  }
  
  function generateTips(country, visaHistory, urgency, preferProfessionalHelp) {
    const tips = [];
    
    tips.push('📋 Start with official government websites - requirements change frequently');
    tips.push('💰 Demonstrate strong financial ties and sufficient funds for your entire study period');
    tips.push('🎯 Show genuine intent to study and return home after completion');
    
    if (visaHistory === 'rejected-before') {
      tips.push('⚠️ Address previous rejection reasons thoroughly in your new application');
    }
    
    if (urgency === 'asap') {
      tips.push('⏰ Rush processing may be available for additional fees in some countries');
    }
    
    if (preferProfessionalHelp) {
      tips.push('👨‍💼 Consider qualified immigration consultants for complex cases');
    }
    
    tips.push('📞 Contact your university\'s international office - they have experience with student visas');
    tips.push('🔍 Double-check all information for accuracy - inconsistencies cause delays');
    tips.push('📄 Keep copies of all documents and track your application status');
    
    return tips;
  }
});