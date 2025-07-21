document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('onlyfans-form');
  const result = document.getElementById('onlyfans-result');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const subscribers = parseInt(form.subscribers.value);
    const subscriptionPrice = parseFloat(form['subscription-price'].value);
    const tipsPerSubscriber = parseFloat(form['tips-per-subscriber'].value) || 0;
    const ppvCount = parseInt(form['ppv-count'].value) || 0;
    const ppvPrice = parseFloat(form['ppv-price'].value) || 0;
    const ppvRate = parseFloat(form['ppv-rate'].value) || 0;
    const customCount = parseInt(form['custom-count'].value) || 0;
    const customPrice = parseFloat(form['custom-price'].value) || 0;
    const churnRate = parseFloat(form['churn-rate'].value) || 15;

    // Validation
    if (!subscribers || subscribers <= 0 || !subscriptionPrice || subscriptionPrice < 4.99) {
      result.innerHTML = '<p style="color:red;">Please enter valid subscriber count and subscription price (minimum $4.99).</p>';
      return;
    }

    if (churnRate < 5 || churnRate > 50) {
      result.innerHTML = '<p style="color:red;">Churn rate should be between 5% and 50%.</p>';
      return;
    }

    if (ppvRate > 100) {
      result.innerHTML = '<p style="color:red;">PPV purchase rate cannot exceed 100%.</p>';
      return;
    }

    // Calculate monthly revenue streams
    const subscriptionRevenue = subscribers * subscriptionPrice;
    const tipsRevenue = subscribers * tipsPerSubscriber;
    const ppvRevenue = ppvCount * ppvPrice * (subscribers * (ppvRate / 100));
    const customRevenue = customCount * customPrice;

    const grossMonthlyRevenue = subscriptionRevenue + tipsRevenue + ppvRevenue + customRevenue;

    // OnlyFans takes 20% fee
    const platformFee = grossMonthlyRevenue * 0.20;
    const netMonthlyRevenue = grossMonthlyRevenue * 0.80;

    // Calculate yearly projections
    const grossYearlyRevenue = grossMonthlyRevenue * 12;
    const netYearlyRevenue = netMonthlyRevenue * 12;

    // Tax considerations (rough estimate)
    const estimatedTaxRate = 0.28; // Federal + state + SE taxes
    const afterTaxMonthly = netMonthlyRevenue * (1 - estimatedTaxRate);
    const afterTaxYearly = afterTaxMonthly * 12;

    // Subscriber growth/retention calculations
    const monthlyLoss = subscribers * (churnRate / 100);
    const retentionRate = 100 - churnRate;
    const avgSubscriberLifetime = 1 / (churnRate / 100); // months

    // Revenue per subscriber metrics
    const revenuePerSubscriber = grossMonthlyRevenue / subscribers;
    const netRevenuePerSubscriber = netMonthlyRevenue / subscribers;

    // Growth projections (assuming steady state)
    const sixMonthProjection = netMonthlyRevenue * 6;
    const oneYearProjection = netYearlyRevenue;

    // Format currency
    const formatCurrency = (amount) => '$' + Math.round(amount).toLocaleString('en-US');
    const formatCurrencyDetailed = (amount) => '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Determine performance tier
    let tierEmoji = '🚀';
    let tierText = 'Excellent';
    let tierColor = '#4caf50';
    
    if (netMonthlyRevenue < 500) {
      tierEmoji = '🌱';
      tierText = 'Getting Started';
      tierColor = '#ff9800';
    } else if (netMonthlyRevenue < 2000) {
      tierEmoji = '📈';
      tierText = 'Growing';
      tierColor = '#2196f3';
    } else if (netMonthlyRevenue < 5000) {
      tierEmoji = '⭐';
      tierText = 'Top Performer';
      tierColor = '#9c27b0';
    }

    // Revenue breakdown percentages
    const subPercentage = (subscriptionRevenue / grossMonthlyRevenue * 100).toFixed(1);
    const tipsPercentage = (tipsRevenue / grossMonthlyRevenue * 100).toFixed(1);
    const ppvPercentage = (ppvRevenue / grossMonthlyRevenue * 100).toFixed(1);
    const customPercentage = (customRevenue / grossMonthlyRevenue * 100).toFixed(1);

    result.innerHTML = `
      <div style="background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #e91e63;">
        <h3 style="color: #ad1457; margin-top: 0; text-align: center;">${tierEmoji} OnlyFans Earnings Projection</h3>
        
        <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
          <p style="margin: 5px 0; color: #666;">
            <strong>Performance Tier:</strong> <span style="color: ${tierColor}; font-weight: bold;">${tierText}</span> 
            with ${subscribers.toLocaleString()} subscribers
          </p>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>💰 Monthly Net Income</h6>
            <div class="big-number">${formatCurrency(netMonthlyRevenue)}</div>
            <p>After 20% platform fee</p>
          </div>
          
          <div class="insight-card warning">
            <h6>📊 Monthly Gross Revenue</h6>
            <div class="big-number">${formatCurrency(grossMonthlyRevenue)}</div>
            <p>Before platform fees</p>
          </div>
          
          <div class="insight-card success">
            <h6>📅 Yearly Net Income</h6>
            <div class="big-number">${formatCurrency(netYearlyRevenue)}</div>
            <p>12-month projection</p>
          </div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #e91e63;">
          <h4 style="color: #ad1457; margin-top: 0; text-align: center;">💼 Revenue Breakdown</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px;">
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-weight: bold; color: #ad1457;">Subscriptions</div>
              <div style="font-size: 1.3rem; color: #333; margin: 5px 0;">${formatCurrency(subscriptionRevenue)}</div>
              <div style="font-size: 0.9rem; color: #666;">${subPercentage}% of total</div>
            </div>
            
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-weight: bold; color: #ad1457;">Tips</div>
              <div style="font-size: 1.3rem; color: #333; margin: 5px 0;">${formatCurrency(tipsRevenue)}</div>
              <div style="font-size: 0.9rem; color: #666;">${tipsPercentage}% of total</div>
            </div>
            
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-weight: bold; color: #ad1457;">PPV Messages</div>
              <div style="font-size: 1.3rem; color: #333; margin: 5px 0;">${formatCurrency(ppvRevenue)}</div>
              <div style="font-size: 0.9rem; color: #666;">${ppvPercentage}% of total</div>
            </div>
            
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-weight: bold; color: #ad1457;">Custom Content</div>
              <div style="font-size: 1.3rem; color: #333; margin: 5px 0;">${formatCurrency(customRevenue)}</div>
              <div style="font-size: 0.9rem; color: #666;">${customPercentage}% of total</div>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ff9800;">
          <h4 style="color: #e65100; margin-top: 0; text-align: center;">🏦 Financial Summary</h4>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #e65100; margin-top: 0;">Platform Fees</h6>
              <p style="margin: 5px 0;"><strong>OnlyFans Fee (20%):</strong> ${formatCurrency(platformFee)}/month</p>
              <p style="margin: 5px 0;"><strong>Annual Fees:</strong> ${formatCurrency(platformFee * 12)}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h6 style="color: #e65100; margin-top: 0;">Tax Considerations</h6>
              <p style="margin: 5px 0;"><strong>Est. Tax (28%):</strong> ${formatCurrency(netMonthlyRevenue * estimatedTaxRate)}/month</p>
              <p style="margin: 5px 0;"><strong>After-Tax Income:</strong> ${formatCurrency(afterTaxMonthly)}/month</p>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #4caf50;">
          <h4 style="color: #2e7d32; margin-top: 0; text-align: center;">📈 Business Metrics</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #2e7d32; margin-top: 0;">Revenue Per Sub</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">${formatCurrencyDetailed(revenuePerSubscriber)}</div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Monthly gross</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #2e7d32; margin-top: 0;">Retention Rate</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">${retentionRate.toFixed(1)}%</div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Monthly retention</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #2e7d32; margin-top: 0;">Avg Lifetime</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">${avgSubscriberLifetime.toFixed(1)} months</div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Per subscriber</p>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #9c27b0;">
          <h4 style="color: #6a1b9a; margin-top: 0; text-align: center;">🎯 Growth Projections</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; text-align: center;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #6a1b9a;">3 Months</div>
              <div style="font-size: 1.2rem; color: #333;">${formatCurrency(netMonthlyRevenue * 3)}</div>
              <div style="font-size: 0.8rem; color: #666;">Total net income</div>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #6a1b9a;">6 Months</div>
              <div style="font-size: 1.2rem; color: #333;">${formatCurrency(sixMonthProjection)}</div>
              <div style="font-size: 0.8rem; color: #666;">Total net income</div>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #6a1b9a;">1 Year</div>
              <div style="font-size: 1.2rem; color: #333;">${formatCurrency(oneYearProjection)}</div>
              <div style="font-size: 0.8rem; color: #666;">Total net income</div>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #f44336;">
          <h4 style="color: #c62828; margin-top: 0; text-align: center;">⚠️ Important Considerations</h4>
          
          <div style="display: grid; gap: 10px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #c62828;">📊 Market Reality:</strong> Most creators earn under $500/month. Success requires consistency, quality content, and effective marketing.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #c62828;">💰 Tax Planning:</strong> Set aside 25-30% of earnings for taxes. Consider quarterly payments and business deductions.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #c62828;">📱 Platform Risk:</strong> Policy changes, account issues, or competition can significantly impact earnings.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #c62828;">🔄 Sustainability:</strong> Building and maintaining subscriber base requires ongoing effort and content creation.
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            💡 <strong>Remember:</strong> These are projections based on your inputs. Actual results vary significantly based on content quality, marketing, consistency, and market factors.
          </p>
        </div>
      </div>
    `;
  });
});