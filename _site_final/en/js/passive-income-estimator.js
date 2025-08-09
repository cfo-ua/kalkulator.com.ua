document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("passive-income-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const rentalIncome = parseFloat(document.getElementById("rentalIncome").value) || 0;
    const rentalGrowth = parseFloat(document.getElementById("rentalGrowth").value) / 100 || 0;
    const dividendIncome = parseFloat(document.getElementById("dividendIncome").value) || 0;
    const dividendGrowth = parseFloat(document.getElementById("dividendGrowth").value) / 100 || 0;
    const businessIncome = parseFloat(document.getElementById("businessIncome").value) || 0;
    const businessGrowth = parseFloat(document.getElementById("businessGrowth").value) / 100 || 0;
    const digitalIncome = parseFloat(document.getElementById("digitalIncome").value) || 0;
    const digitalGrowth = parseFloat(document.getElementById("digitalGrowth").value) / 100 || 0;
    const monthlyExpenses = parseFloat(document.getElementById("monthlyExpenses").value);
    const years = parseInt(document.getElementById("yearProjection").value);

    // Calculate current total monthly income
    const currentMonthlyIncome = rentalIncome + dividendIncome + businessIncome + digitalIncome;
    const currentAnnualIncome = currentMonthlyIncome * 12;

    // Calculate future income with growth
    const futureRental = rentalIncome * Math.pow(1 + rentalGrowth, years);
    const futureDividend = dividendIncome * Math.pow(1 + dividendGrowth, years);
    const futureBusiness = businessIncome * Math.pow(1 + businessGrowth, years);
    const futureDigital = digitalIncome * Math.pow(1 + digitalGrowth, years);
    
    const futureMonthlyIncome = futureRental + futureDividend + futureBusiness + futureDigital;
    const futureAnnualIncome = futureMonthlyIncome * 12;

    // Calculate coverage ratio
    const currentCoverage = (currentMonthlyIncome / monthlyExpenses) * 100;
    const futureCoverage = (futureMonthlyIncome / monthlyExpenses) * 100;

    // Calculate cumulative income over projection period
    let cumulativeIncome = 0;
    for (let year = 1; year <= years; year++) {
      const yearlyRental = rentalIncome * Math.pow(1 + rentalGrowth, year) * 12;
      const yearlyDividend = dividendIncome * Math.pow(1 + dividendGrowth, year) * 12;
      const yearlyBusiness = businessIncome * Math.pow(1 + businessGrowth, year) * 12;
      const yearlyDigital = digitalIncome * Math.pow(1 + digitalGrowth, year) * 12;
      cumulativeIncome += yearlyRental + yearlyDividend + yearlyBusiness + yearlyDigital;
    }

    // Determine financial independence status
    let independenceStatus = "";
    let statusClass = "";
    if (currentCoverage >= 100) {
      independenceStatus = "🎉 You've achieved financial independence!";
      statusClass = "success";
    } else if (futureCoverage >= 100) {
      independenceStatus = `🎯 You'll achieve financial independence in ${years} years!`;
      statusClass = "info";
    } else {
      independenceStatus = "📈 Keep building - you're on the right track!";
      statusClass = "warning";
    }

    // Display results
    const resultBlock = document.getElementById("passive-income-result");
    resultBlock.innerHTML = `
      <h3>💰 Your Passive Income Analysis</h3>
      
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>📊 Current Monthly Income</h6>
          <div class="big-number">$${Math.round(currentMonthlyIncome).toLocaleString()}</div>
          <p>Covers ${Math.round(currentCoverage)}% of expenses<br>
          Annual: $${Math.round(currentAnnualIncome).toLocaleString()}</p>
        </div>
        
        <div class="insight-card ${statusClass}">
          <h6>🚀 Future Monthly Income (${years}Y)</h6>
          <div class="big-number">$${Math.round(futureMonthlyIncome).toLocaleString()}</div>
          <p>Covers ${Math.round(futureCoverage)}% of expenses<br>
          Annual: $${Math.round(futureAnnualIncome).toLocaleString()}</p>
        </div>
        
        <div class="insight-card success">
          <h6>💎 Total Projected Income</h6>
          <div class="big-number">$${Math.round(cumulativeIncome).toLocaleString()}</div>
          <p>Cumulative over ${years} years<br>
          Average/year: $${Math.round(cumulativeIncome/years).toLocaleString()}</p>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
        <h4>${independenceStatus}</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
            <strong>🏠 Real Estate</strong><br>
            Current: $${Math.round(rentalIncome).toLocaleString()}/mo<br>
            Future: $${Math.round(futureRental).toLocaleString()}/mo<br>
            <small style="color: #28a745;">+${(rentalGrowth * 100).toFixed(1)}% annually</small>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
            <strong>📈 Investments</strong><br>
            Current: $${Math.round(dividendIncome).toLocaleString()}/mo<br>
            Future: $${Math.round(futureDividend).toLocaleString()}/mo<br>
            <small style="color: #28a745;">+${(dividendGrowth * 100).toFixed(1)}% annually</small>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
            <strong>💼 Business</strong><br>
            Current: $${Math.round(businessIncome).toLocaleString()}/mo<br>
            Future: $${Math.round(futureBusiness).toLocaleString()}/mo<br>
            <small style="color: #28a745;">+${(businessGrowth * 100).toFixed(1)}% annually</small>
          </div>
          
          <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
            <strong>💡 Digital/Royalties</strong><br>
            Current: $${Math.round(digitalIncome).toLocaleString()}/mo<br>
            Future: $${Math.round(futureDigital).toLocaleString()}/mo<br>
            <small style="color: #28a745;">+${(digitalGrowth * 100).toFixed(1)}% annually</small>
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
          <strong>💡 Next Steps:</strong><br>
          ${currentCoverage < 100 ? 
            `• Focus on increasing your highest-growth streams<br>
             • Consider reducing expenses to reach independence sooner<br>
             • Reinvest profits to accelerate growth<br>
             • Diversify into new income streams when possible` :
            `• Congratulations on achieving financial independence!<br>
             • Continue growing your passive income for security<br>
             • Consider helping others achieve the same goal<br>
             • Enjoy the freedom you've created!`
          }
        </div>
      </div>
    `;
  });
});