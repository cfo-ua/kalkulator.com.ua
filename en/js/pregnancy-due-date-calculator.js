document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('pregnancy-form');
  const result = document.getElementById('pregnancy-result');
  const lmpSection = document.getElementById('lmp-section');
  const conceptionSection = document.getElementById('conception-section');
  const methodRadios = form['calculation-method'];

  // Handle method selection
  methodRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'lmp') {
        lmpSection.style.display = 'block';
        conceptionSection.style.display = 'none';
      } else {
        lmpSection.style.display = 'none';
        conceptionSection.style.display = 'block';
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const method = form['calculation-method'].value;
    const cycleLength = parseInt(form['cycle-length'].value);
    let baseDate;
    let dueDate;

    if (method === 'lmp') {
      const lmpValue = form['lmp-date'].value;
      if (!lmpValue) {
        result.innerHTML = '<p style="color:red;">Please enter your last menstrual period date.</p>';
        return;
      }
      baseDate = new Date(lmpValue);
      
      // Adjust for cycle length if different from 28 days
      const cycleDifference = cycleLength - 28;
      dueDate = new Date(baseDate);
      dueDate.setDate(dueDate.getDate() + 280 + cycleDifference);
    } else {
      const conceptionValue = form['conception-date'].value;
      if (!conceptionValue) {
        result.innerHTML = '<p style="color:red;">Please enter your conception/fertilization date.</p>';
        return;
      }
      baseDate = new Date(conceptionValue);
      dueDate = new Date(baseDate);
      dueDate.setDate(dueDate.getDate() + 266); // 266 days from conception
    }

    const today = new Date();
    
    // Validate dates
    if (baseDate > today) {
      result.innerHTML = '<p style="color:red;">Please enter a date in the past.</p>';
      return;
    }

    // Check if due date is reasonable (not too far in past or future)
    const timeDiff = Math.abs(dueDate - today);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      result.innerHTML = '<p style="color:red;">Please check your date - the calculated due date seems unrealistic.</p>';
      return;
    }

    // Calculate current pregnancy info
    const gestationalAge = Math.floor((today - baseDate) / (1000 * 60 * 60 * 24));
    const weeksPregnant = Math.floor(gestationalAge / 7);
    const daysExtra = gestationalAge % 7;
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    // Determine trimester
    let trimester, trimesterEmoji, trimesterWeeks;
    if (weeksPregnant <= 12) {
      trimester = 'First Trimester';
      trimesterEmoji = '🌱';
      trimesterWeeks = '1-12 weeks';
    } else if (weeksPregnant <= 27) {
      trimester = 'Second Trimester';
      trimesterEmoji = '🌿';
      trimesterWeeks = '13-27 weeks';
    } else {
      trimester = 'Third Trimester';
      trimesterEmoji = '🌳';
      trimesterWeeks = '28-40+ weeks';
    }

    // Determine pregnancy status
    let statusEmoji = '👶';
    let statusText = 'On track';
    let statusColor = '#4caf50';

    if (weeksPregnant < 37 && daysUntilDue < 0) {
      statusEmoji = '⚠️';
      statusText = 'Preterm';
      statusColor = '#ff9800';
    } else if (weeksPregnant >= 42) {
      statusEmoji = '⏰';
      statusText = 'Post-term';
      statusColor = '#ff5722';
    } else if (weeksPregnant >= 37) {
      statusEmoji = '✅';
      statusText = 'Full term';
      statusColor = '#4caf50';
    }

    // Calculate important dates
    const firstTrimesterEnd = new Date(baseDate);
    firstTrimesterEnd.setDate(firstTrimesterEnd.getDate() + (12 * 7));

    const secondTrimesterEnd = new Date(baseDate);
    secondTrimesterEnd.setDate(secondTrimesterEnd.getDate() + (27 * 7));

    const viabilityDate = new Date(baseDate);
    viabilityDate.setDate(viabilityDate.getDate() + (24 * 7));

    const fullTermDate = new Date(baseDate);
    fullTermDate.setDate(fullTermDate.getDate() + (37 * 7));

    // Format dates
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatShortDate = (date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    // Get developmental milestone for current week
    const getMilestone = (week) => {
      const milestones = {
        4: "Missed period, pregnancy test positive 🧪",
        6: "Heart begins beating 💓",
        8: "First prenatal appointment recommended 👩‍⚕️",
        10: "Major organs forming 🧠",
        12: "End of first trimester, reduced miscarriage risk 🛡️",
        16: "Gender may be visible on ultrasound 👶",
        20: "Anatomy scan, halfway point! 📊",
        24: "Viability milestone - survival possible outside womb 🎯",
        28: "Third trimester begins, rapid brain development 🧠",
        32: "Bones hardening, preparing for birth 💪",
        36: "Baby considered late preterm if born now ⏰",
        37: "Full-term pregnancy begins! 🎉",
        40: "Due date - baby is ready! 👶"
      };
      
      // Find the closest milestone
      const milestoneWeeks = Object.keys(milestones).map(Number).sort((a, b) => a - b);
      for (let i = milestoneWeeks.length - 1; i >= 0; i--) {
        if (week >= milestoneWeeks[i]) {
          return milestones[milestoneWeeks[i]];
        }
      }
      return "Early pregnancy development 🌱";
    };

    const currentMilestone = getMilestone(weeksPregnant);

    // Pregnancy progress percentage
    const progressPercentage = Math.min(100, (weeksPregnant / 40) * 100);

    result.innerHTML = `
      <div style="background: linear-gradient(135deg, #f8bbd9 0%, #f48fb1 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #e91e63;">
        <h3 style="color: #ad1457; margin-top: 0; text-align: center;">👶 Your Pregnancy Timeline</h3>
        
        <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center;">
          <p style="margin: 5px 0; color: #666;">
            <strong>Calculation Method:</strong> ${method === 'lmp' ? 'Last Menstrual Period' : 'Conception Date'}
            ${cycleLength !== 28 ? ` (${cycleLength}-day cycle)` : ''}
          </p>
        </div>

        <div class="insight-cards">
          <div class="insight-card info">
            <h6>📅 Due Date</h6>
            <div class="big-number">${formatShortDate(dueDate)}</div>
            <p>${daysUntilDue >= 0 ? `${daysUntilDue} days to go` : `${Math.abs(daysUntilDue)} days overdue`}</p>
          </div>
          
          <div class="insight-card warning">
            <h6>📊 Current Week</h6>
            <div class="big-number">${weeksPregnant}w ${daysExtra}d</div>
            <p>${weeksPregnant} weeks, ${daysExtra} days pregnant</p>
          </div>
          
          <div class="insight-card" style="border-color: ${statusColor}; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);">
            <h6>${statusEmoji} Status</h6>
            <div class="big-number" style="color: ${statusColor};">${statusText}</div>
            <p>Pregnancy status</p>
          </div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #e91e63;">
          <h4 style="color: #ad1457; margin-top: 0; text-align: center;">${trimesterEmoji} ${trimester}</h4>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: bold;">Pregnancy Progress</span>
              <span style="font-weight: bold;">${progressPercentage.toFixed(1)}%</span>
            </div>
            <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #e91e63, #ad1457); height: 100%; width: ${progressPercentage}%; border-radius: 10px; transition: width 0.3s ease;"></div>
            </div>
            <p style="margin: 8px 0 0 0; text-align: center; color: #666; font-size: 0.9rem;">
              ${trimesterWeeks} • Week ${weeksPregnant} of ~40
            </p>
          </div>

          <div style="background: #fff8e1; padding: 15px; border-radius: 8px; border-left: 4px solid #ffa726;">
            <h6 style="color: #e65100; margin-top: 0;">🎯 Current Milestone</h6>
            <p style="margin: 5px 0 0 0;">${currentMilestone}</p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #4caf50;">
          <h4 style="color: #2e7d32; margin-top: 0; text-align: center;">📅 Important Dates</h4>
          
          <div style="display: grid; gap: 12px;">
            ${weeksPregnant < 12 ? `
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🌱 End of 1st Trimester:</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(firstTrimesterEnd)}</span>
            </div>
            ` : ''}
            
            ${weeksPregnant < 27 ? `
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🌿 End of 2nd Trimester:</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(secondTrimesterEnd)}</span>
            </div>
            ` : ''}
            
            ${weeksPregnant < 24 ? `
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>🎯 Viability (24 weeks):</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(viabilityDate)}</span>
            </div>
            ` : ''}
            
            ${weeksPregnant < 37 ? `
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>✅ Full Term (37 weeks):</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(fullTermDate)}</span>
            </div>
            ` : ''}
            
            <div style="background: white; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>👶 Estimated Due Date:</strong></span>
              <span style="color: #2e7d32; font-weight: bold;">${formatShortDate(dueDate)}</span>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #2196f3;">
          <h4 style="color: #1565c0; margin-top: 0; text-align: center;">📊 Pregnancy Facts</h4>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #1565c0; margin-top: 0;">Days Pregnant</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">${gestationalAge}</div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Since ${method === 'lmp' ? 'LMP' : 'conception'}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #1565c0; margin-top: 0;">Weeks Remaining</h6>
              <div style="font-size: 1.4rem; font-weight: bold; color: #333;">${Math.max(0, 40 - weeksPregnant)}</div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Until 40 weeks</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <h6 style="color: #1565c0; margin-top: 0;">Full Term Window</h6>
              <div style="font-size: 1.2rem; font-weight: bold; color: #333;">37-42 weeks</div>
              <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #666;">Normal delivery range</p>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ff9800;">
          <h4 style="color: #e65100; margin-top: 0; text-align: center;">💡 Important Reminders</h4>
          
          <div style="display: grid; gap: 10px;">
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">📅 Due Date Accuracy:</strong> Only 4-5% of babies are born on their exact due date. Most arrive within 2 weeks.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">⚕️ Prenatal Care:</strong> Regular checkups are essential for monitoring baby's development and your health.
            </div>
            
            <div style="background: white; padding: 12px; border-radius: 6px;">
              <strong style="color: #e65100;">🎒 Birth Preparation:</strong> Start preparing your hospital bag and birth plan around week 36.
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 8px;">
          <p style="margin: 0; font-style: italic; color: #666;">
            👶 <strong>Congratulations!</strong> This calculator provides estimates based on average pregnancy length. Always consult with your healthcare provider for personalized medical advice.
          </p>
        </div>
      </div>
    `;
  });
});