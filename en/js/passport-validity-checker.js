document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("passport-validity-form");
  const resultDiv = document.getElementById("passport-validity-result");

  // Set default dates
  setDefaultDates();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    checkPassportValidity();
  });

  // Auto-calculate when inputs change for better UX
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener("change", function () {
      if (validateInputs()) {
        checkPassportValidity();
      }
    });
  });

  function setDefaultDates() {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const returnDate = new Date(nextMonth);
    returnDate.setDate(returnDate.getDate() + 7);
    
    // Set passport expiry to 2 years from now as default
    const passportExpiry = new Date(today);
    passportExpiry.setFullYear(passportExpiry.getFullYear() + 2);
    
    // Set passport issue to 5 years ago as default
    const passportIssue = new Date(today);
    passportIssue.setFullYear(passportIssue.getFullYear() - 5);

    document.getElementById("departure-date").value = nextMonth.toISOString().split('T')[0];
    document.getElementById("return-date").value = returnDate.toISOString().split('T')[0];
    document.getElementById("passport-expiry-date").value = passportExpiry.toISOString().split('T')[0];
    document.getElementById("passport-issue-date").value = passportIssue.toISOString().split('T')[0];
  }

  function validateInputs() {
    const passportIssue = new Date(document.getElementById("passport-issue-date").value);
    const passportExpiry = new Date(document.getElementById("passport-expiry-date").value);
    const departure = new Date(document.getElementById("departure-date").value);
    const returnDate = new Date(document.getElementById("return-date").value);
    const blankPages = parseInt(document.getElementById("blank-pages").value);
    const region = document.getElementById("destination-region").value;

    return passportIssue && passportExpiry && departure && returnDate && 
           !isNaN(blankPages) && region && 
           passportExpiry > passportIssue && 
           returnDate >= departure;
  }

  function checkPassportValidity() {
    // Get inputs
    const passportIssue = new Date(document.getElementById("passport-issue-date").value);
    const passportExpiry = new Date(document.getElementById("passport-expiry-date").value);
    const departure = new Date(document.getElementById("departure-date").value);
    const returnDate = new Date(document.getElementById("return-date").value);
    const blankPages = parseInt(document.getElementById("blank-pages").value) || 0;
    const region = document.getElementById("destination-region").value;
    const countriesVisiting = parseInt(document.getElementById("countries-visiting").value) || 1;

    if (!validateInputs()) {
      resultDiv.innerHTML = '<p style="color: red;">Please fill in all fields correctly.</p>';
      return;
    }

    // Calculate requirements based on region
    const requirements = getRegionRequirements(region);
    
    // Calculate time differences
    const tripDuration = Math.ceil((returnDate - departure) / (1000 * 60 * 60 * 24));
    const monthsUntilExpiry = (passportExpiry - returnDate) / (1000 * 60 * 60 * 24 * 30.44);
    const daysUntilExpiry = Math.ceil((passportExpiry - returnDate) / (1000 * 60 * 60 * 24));
    
    // Check validity conditions
    const checks = {
      validityRule: monthsUntilExpiry >= requirements.monthsRequired,
      blankPages: blankPages >= (requirements.pagesRequired + (countriesVisiting - 1) * 2),
      notExpiredDuringTrip: passportExpiry > returnDate,
      futureTravel: departure > new Date()
    };

    // Calculate recommended pages (2 per country + 2 extra)
    const recommendedPages = Math.max(requirements.pagesRequired, countriesVisiting * 2 + 2);

    displayResults({
      checks,
      requirements,
      monthsUntilExpiry,
      daysUntilExpiry,
      tripDuration,
      blankPages,
      countriesVisiting,
      recommendedPages,
      region,
      passportExpiry,
      returnDate
    });
  }

  function getRegionRequirements(region) {
    const requirements = {
      "eu": { monthsRequired: 3, pagesRequired: 2, name: "European Union" },
      "usa": { monthsRequired: 6, pagesRequired: 2, name: "United States" },
      "canada": { monthsRequired: 6, pagesRequired: 2, name: "Canada" },
      "australia": { monthsRequired: 6, pagesRequired: 2, name: "Australia/New Zealand" },
      "uk": { monthsRequired: 6, pagesRequired: 2, name: "United Kingdom" },
      "schengen": { monthsRequired: 3, pagesRequired: 2, name: "Schengen Area" },
      "asia": { monthsRequired: 6, pagesRequired: 3, name: "Asia" },
      "africa": { monthsRequired: 6, pagesRequired: 4, name: "Africa" },
      "south-america": { monthsRequired: 6, pagesRequired: 2, name: "South America" },
      "middle-east": { monthsRequired: 6, pagesRequired: 3, name: "Middle East" },
      "other": { monthsRequired: 6, pagesRequired: 2, name: "Other Region" }
    };
    
    return requirements[region] || requirements["other"];
  }

  function displayResults(data) {
    const { checks, requirements, monthsUntilExpiry, daysUntilExpiry, tripDuration, 
            blankPages, countriesVisiting, recommendedPages, region, passportExpiry, returnDate } = data;

    const allChecksPassed = Object.values(checks).every(check => check);
    const urgentRenewal = monthsUntilExpiry < 6;
    const criticalIssues = !checks.validityRule || !checks.blankPages || !checks.notExpiredDuringTrip;

    let resultClass = allChecksPassed ? 'success' : (criticalIssues ? 'warning' : 'info');
    let statusIcon = allChecksPassed ? '✅' : (criticalIssues ? '⚠️' : 'ℹ️');
    let statusText = allChecksPassed ? 'Passport Ready for Travel!' : 
                     criticalIssues ? 'Action Required Before Travel!' : 'Travel Recommendations';

    resultDiv.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card ${resultClass}">
          <h3>${statusIcon} ${statusText}</h3>
          <p><strong>Destination:</strong> ${requirements.name}</p>
          <p><strong>Trip Duration:</strong> ${tripDuration} days</p>
          <p><strong>Valid for:</strong> ${daysUntilExpiry} days after return</p>
        </div>
      </div>

      <div class="detailed-results">
        <h4>📋 Detailed Check:</h4>
        
        <div class="check-item ${checks.futureTravel ? 'pass' : 'fail'}">
          ${checks.futureTravel ? '✅' : '❌'} <strong>Departure Date:</strong> 
          ${checks.futureTravel ? 'Valid (in the future)' : 'Error - date is in the past!'}
        </div>

        <div class="check-item ${checks.notExpiredDuringTrip ? 'pass' : 'fail'}">
          ${checks.notExpiredDuringTrip ? '✅' : '❌'} <strong>Valid During Trip:</strong> 
          ${checks.notExpiredDuringTrip ? 'Passport will not expire' : `Passport expires on ${passportExpiry.toLocaleDateString('en-US')}!`}
        </div>

        <div class="check-item ${checks.validityRule ? 'pass' : 'fail'}">
          ${checks.validityRule ? '✅' : '❌'} <strong>${requirements.monthsRequired}-Month Rule:</strong> 
          ${checks.validityRule ? 
            `Compliant (${monthsUntilExpiry.toFixed(1)} months buffer)` : 
            `Non-compliant! Need ${requirements.monthsRequired} months, have ${monthsUntilExpiry.toFixed(1)}`}
        </div>

        <div class="check-item ${checks.blankPages ? 'pass' : 'fail'}">
          ${checks.blankPages ? '✅' : '❌'} <strong>Blank Pages:</strong> 
          ${checks.blankPages ? 
            `Sufficient (${blankPages} pages)` : 
            `Insufficient! Need ${recommendedPages}, have ${blankPages}`}
        </div>

        ${!allChecksPassed ? `
          <div class="recommendations">
            <h4>🚨 Required Actions:</h4>
            <ul>
              ${!checks.futureTravel ? '<li>Check your departure date</li>' : ''}
              ${!checks.notExpiredDuringTrip ? '<li><strong>URGENT:</strong> Renew passport - expires during trip!</li>' : ''}
              ${!checks.validityRule ? `<li><strong>IMPORTANT:</strong> Renew passport - doesn't meet ${requirements.monthsRequired}-month rule</li>` : ''}
              ${!checks.blankPages ? `<li>Renew passport - insufficient blank pages (need ${recommendedPages})</li>` : ''}
            </ul>
          </div>
        ` : ''}

        <div class="travel-tips">
          <h4>💡 Helpful Tips:</h4>
          <ul>
            <li><strong>Passport Renewal:</strong> Usually takes 2-6 weeks</li>
            <li><strong>Expedited:</strong> Possible renewal in 1-2 weeks for extra fee</li>
            <li><strong>Additional Pages:</strong> Some countries allow adding pages</li>
            <li><strong>Always Verify:</strong> Current requirements on embassy websites</li>
            ${urgentRenewal ? '<li><strong>⚠️ Warning:</strong> Recommend renewing passport soon!</li>' : ''}
          </ul>
        </div>

        <div class="region-specific">
          <h4>🌍 "${requirements.name}" Specifics:</h4>
          <ul>
            <li><strong>Minimum Validity:</strong> ${requirements.monthsRequired} months</li>
            <li><strong>Minimum Blank Pages:</strong> ${requirements.pagesRequired}</li>
            <li><strong>Recommended for ${countriesVisiting} countries:</strong> ${recommendedPages} pages</li>
          </ul>
        </div>
      </div>
    `;
  }
});