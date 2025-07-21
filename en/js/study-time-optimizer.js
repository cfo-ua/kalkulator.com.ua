document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('study-optimizer-form');
  const result = document.getElementById('study-result');
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      // Get form values
      const examType = document.getElementById('exam-type').value;
      const timeline = document.getElementById('timeline').value;
      const scoreGoal = document.getElementById('score-goal').value;
      const background = document.getElementById('background').value;
      const baselineTest = document.getElementById('baseline-test').value;
      const prepExperience = document.getElementById('prep-experience').value;
      const commitments = document.getElementById('commitments').value;
      const weekdayHours = parseInt(document.getElementById('weekday-hours').value);
      const weekendHours = parseInt(document.getElementById('weekend-hours').value);
      const studyMethod = document.getElementById('study-method').value;
      const learningStyle = document.getElementById('learning-style').value;
      const motivation = document.getElementById('motivation').value;
      const consistency = document.getElementById('consistency').value;
      
      // Check additional factors
      const emphasizePracticeTests = document.getElementById('practice-tests').checked;
      const needContentReview = document.getElementById('content-review').checked;
      const hasTestAnxiety = document.getElementById('test-anxiety').checked;
      const hasStudyPartner = document.getElementById('study-partner').checked;
      const needsAccountability = document.getElementById('external-accountability').checked;
      
      // Validation
      if (!examType || !timeline || !scoreGoal || !background || !baselineTest || !prepExperience || !commitments || !weekdayHours || !weekendHours || !studyMethod || !learningStyle || !motivation || !consistency) {
        result.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        return;
      }
      
      // Base study hour requirements by exam
      const examHours = {
        'mcat': 400,
        'lsat': 200,
        'gre': 150,
        'gmat': 175,
        'usmle-step1': 500,
        'usmle-step2': 400,
        'pcat': 200,
        'dat': 275,
        'gre-subject': 125
      };
      
      // Timeline to weeks conversion
      const timelineWeeks = {
        '2-months': 8,
        '3-months': 12,
        '4-months': 16,
        '5-months': 20,
        '6-months': 24,
        'flexible': 28
      };
      
      // Calculate base hours needed
      let baseHours = examHours[examType] || 200;
      
      // Adjust for background
      const backgroundMultipliers = {
        'strong': 0.8,
        'moderate': 1.0,
        'weak': 1.3,
        'career-change': 1.5
      };
      baseHours *= backgroundMultipliers[background] || 1.0;
      
      // Adjust for score goal
      const goalMultipliers = {
        'minimum': 0.8,
        'average': 1.0,
        'competitive': 1.2,
        'top-tier': 1.5
      };
      baseHours *= goalMultipliers[scoreGoal] || 1.0;
      
      // Adjust for baseline performance
      const baselineMultipliers = {
        'no': 1.1,
        'below-average': 1.2,
        'average': 1.0,
        'above-average': 0.9
      };
      baseHours *= baselineMultipliers[baselineTest] || 1.0;
      
      // Adjust for prep experience
      const experienceMultipliers = {
        'none': 1.1,
        'some': 1.0,
        'experienced': 0.9,
        'retaker': 0.8
      };
      baseHours *= experienceMultipliers[prepExperience] || 1.0;
      
      // Calculate available hours per week
      let weeklyHours = (weekdayHours * 5) + (weekendHours * 2);
      
      // Adjust for commitments
      const commitmentMultipliers = {
        'student-light': 1.0,
        'student-heavy': 0.8,
        'working-part': 0.9,
        'working-full': 0.7,
        'gap-year': 1.2
      };
      weeklyHours *= commitmentMultipliers[commitments] || 1.0;
      
      // Adjust for motivation
      const motivationMultipliers = {
        'low': 0.7,
        'moderate': 0.9,
        'high': 1.0,
        'extremely-high': 1.1
      };
      weeklyHours *= motivationMultipliers[motivation] || 1.0;
      
      // Calculate timeline feasibility
      const totalWeeks = timelineWeeks[timeline] || 16;
      const totalAvailableHours = weeklyHours * totalWeeks;
      const feasibilityRatio = totalAvailableHours / baseHours;
      
      // Generate recommendations and warnings
      let recommendations = [];
      let warnings = [];
      let tips = [];
      
      // Feasibility assessment
      let feasibilityLevel = '';
      let cardClass = '';
      let timelineRecommendation = '';
      
      if (feasibilityRatio >= 1.3) {
        feasibilityLevel = 'Excellent';
        cardClass = 'success';
        timelineRecommendation = 'Your timeline allows for thorough preparation with buffer time.';
        recommendations.push("Consider adding extra practice tests and review sessions");
      } else if (feasibilityRatio >= 1.0) {
        feasibilityLevel = 'Good';
        cardClass = 'info';
        timelineRecommendation = 'Your timeline is appropriate for your goals.';
        recommendations.push("Stick to your schedule consistently");
      } else if (feasibilityRatio >= 0.8) {
        feasibilityLevel = 'Tight';
        cardClass = 'warning';
        timelineRecommendation = 'Timeline is tight but manageable with focused effort.';
        warnings.push("⏰ Limited buffer time - stay consistent with schedule");
        tips.push("Focus on high-yield topics and practice questions");
      } else {
        feasibilityLevel = 'Challenging';
        cardClass = 'warning';
        timelineRecommendation = 'Timeline may be too aggressive for your target score.';
        warnings.push("⚠️ Very tight timeline - consider extending test date");
        tips.push("Consider postponing test date or lowering score expectations");
      }
      
      // Generate study plan phases
      const phases = generateStudyPhases(totalWeeks, examType, needContentReview, emphasizePracticeTests);
      
      // Study method recommendations
      if (studyMethod === 'self-study' && background === 'weak') {
        tips.push("Consider supplementing self-study with tutoring for weak areas");
      }
      
      if (hasTestAnxiety) {
        tips.push("Practice timed tests regularly to reduce test anxiety");
        recommendations.push("Take practice tests under real exam conditions");
      }
      
      if (needsAccountability) {
        tips.push("Set up weekly progress check-ins with study partner or mentor");
      }
      
      // Generate daily schedule recommendations
      const dailySchedule = generateDailySchedule(weekdayHours, weekendHours, learningStyle, consistency);
      
      // Calculate exam-specific insights
      const examInsights = getExamInsights(examType);
      
      // Build result HTML
      let resultHTML = `
        <div class="insight-cards">
          <div class="insight-card ${cardClass}">
            <h6>⏰ Timeline Assessment</h6>
            <div class="big-number">${feasibilityLevel}</div>
            <p class="insight-detail">${Math.round(feasibilityRatio * 100)}% Feasibility</p>
          </div>
          
          <div class="insight-card info">
            <h6>📚 Total Study Hours</h6>
            <div class="big-number">${Math.round(baseHours)}</div>
            <p class="insight-detail">Recommended Hours</p>
          </div>
          
          <div class="insight-card info">
            <h6>📅 Weekly Hours</h6>
            <div class="big-number">${Math.round(weeklyHours)}</div>
            <p class="insight-detail">Available per Week</p>
          </div>
          
          <div class="insight-card info">
            <h6>🎯 Exam Focus</h6>
            <div class="big-number">${examInsights.emoji}</div>
            <p class="insight-detail">${examInsights.name}</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h4>📊 Timeline Assessment</h4>
          <p><strong>${timelineRecommendation}</strong></p>
        </div>`;
      
      // Add study phases
      if (phases.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>📅 Recommended Study Phases</h4>`;
        
        phases.forEach((phase, index) => {
          resultHTML += `
            <div style="margin: 1rem 0; padding: 1rem; background: var(--card-bg); border-radius: 8px;">
              <h5>${phase.name} (Weeks ${phase.weeks})</h5>
              <p><strong>Focus:</strong> ${phase.focus}</p>
              <p><strong>Time allocation:</strong> ${phase.allocation}</p>
              <p><strong>Key activities:</strong> ${phase.activities}</p>
            </div>`;
        });
        
        resultHTML += `</div>`;
      }
      
      // Add daily schedule
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📝 Daily Schedule Recommendations</h4>`;
      
      dailySchedule.forEach(day => {
        resultHTML += `
          <div style="margin: 0.5rem 0; padding: 0.5rem; background: var(--card-bg); border-radius: 4px;">
            <strong>${day.day}:</strong> ${day.schedule}
          </div>`;
      });
      
      resultHTML += `</div>`;
      
      // Add exam-specific tips
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>🎯 ${examInsights.name} Specific Tips</h4>
          <ul>`;
      examInsights.tips.forEach(tip => {
        resultHTML += `<li>${tip}</li>`;
      });
      resultHTML += `</ul></div>`;
      
      // Add general recommendations
      if (recommendations.length > 0) {
        resultHTML += `
          <div style="margin-top: 1.5rem;">
            <h4>💡 Study Recommendations</h4>
            <ul>`;
        recommendations.forEach(rec => {
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
            <h4>💡 Optimization Tips</h4>
            <ul>`;
        tips.forEach(tip => {
          resultHTML += `<li>${tip}</li>`;
        });
        resultHTML += `</ul></div>`;
      }
      
      // Add progress tracking
      resultHTML += `
        <div style="margin-top: 1.5rem;">
          <h4>📊 Progress Tracking Milestones</h4>
          <ul>
            <li><strong>Week 2:</strong> Complete baseline assessment and finalize study materials</li>
            <li><strong>Week ${Math.round(totalWeeks * 0.25)}:</strong> First practice test and weak area identification</li>
            <li><strong>Week ${Math.round(totalWeeks * 0.5)}:</strong> Mid-point practice test and strategy adjustment</li>
            <li><strong>Week ${Math.round(totalWeeks * 0.75)}:</strong> Final content review and intensive practice phase</li>
            <li><strong>Final Week:</strong> Light review, practice test timing, mental preparation</li>
          </ul>
        </div>`;
      
      result.innerHTML = resultHTML;
    });
  }
  
  function generateStudyPhases(totalWeeks, examType, needContentReview, emphasizePracticeTests) {
    const phases = [];
    
    if (totalWeeks >= 16) {
      // Long timeline (4+ months)
      phases.push({
        name: "Phase 1: Foundation Building",
        weeks: "1-4",
        focus: "Content review and concept mastery",
        allocation: "70% content review, 20% practice, 10% assessment",
        activities: "Read prep books, watch lectures, create study notes, basic practice questions"
      });
      
      phases.push({
        name: "Phase 2: Active Learning",
        weeks: "5-10",
        focus: "Practice questions and application",
        allocation: "40% content review, 50% practice, 10% assessment",
        activities: "Topic-specific practice, flashcards, timed sections, identify weak areas"
      });
      
      phases.push({
        name: "Phase 3: Test Preparation",
        weeks: "11-14",
        focus: "Full-length practice tests",
        allocation: "20% content review, 60% practice, 20% assessment",
        activities: "Weekly full-length tests, detailed review, timing practice"
      });
      
      phases.push({
        name: "Phase 4: Final Review",
        weeks: "15-16",
        focus: "Polish and confidence building",
        allocation: "30% review, 50% practice, 20% mental prep",
        activities: "Review weak areas, light practice, test day preparation"
      });
    } else if (totalWeeks >= 12) {
      // Medium timeline (3-4 months)
      phases.push({
        name: "Phase 1: Rapid Content Review",
        weeks: "1-3",
        focus: "Essential content mastery",
        allocation: "60% content review, 30% practice, 10% assessment",
        activities: "Focused content review, basic practice questions"
      });
      
      phases.push({
        name: "Phase 2: Intensive Practice",
        weeks: "4-9",
        focus: "Practice and application",
        allocation: "30% content review, 60% practice, 10% assessment",
        activities: "Heavy practice question work, full-length tests every 2 weeks"
      });
      
      phases.push({
        name: "Phase 3: Final Preparation",
        weeks: "10-12",
        focus: "Test readiness",
        allocation: "20% review, 60% practice, 20% test prep",
        activities: "Weekly practice tests, weak area review, test strategy"
      });
    } else {
      // Short timeline (2-3 months)
      phases.push({
        name: "Phase 1: Targeted Review",
        weeks: "1-2",
        focus: "High-yield content only",
        allocation: "50% content review, 40% practice, 10% assessment",
        activities: "Focus on highest-yield topics, skip low-yield content"
      });
      
      phases.push({
        name: "Phase 2: Practice Intensive",
        weeks: "3-6",
        focus: "Maximum practice exposure",
        allocation: "20% content review, 70% practice, 10% assessment",
        activities: "Daily practice questions, frequent timed tests"
      });
      
      phases.push({
        name: "Phase 3: Test Ready",
        weeks: "7-8",
        focus: "Final polish",
        allocation: "10% review, 70% practice, 20% test prep",
        activities: "Practice tests, timing, confidence building"
      });
    }
    
    return phases;
  }
  
  function generateDailySchedule(weekdayHours, weekendHours, learningStyle, consistency) {
    const schedule = [];
    
    if (consistency === 'daily') {
      schedule.push({
        day: "Monday-Friday",
        schedule: `${weekdayHours} hours: 60% practice questions, 30% content review, 10% flashcard review`
      });
      schedule.push({
        day: "Saturday",
        schedule: `${weekendHours} hours: Full practice test or intensive content review`
      });
      schedule.push({
        day: "Sunday",
        schedule: `${weekendHours} hours: Review practice test, weak area focus, light review`
      });
    } else if (consistency === 'weekdays') {
      schedule.push({
        day: "Monday-Friday",
        schedule: `${weekdayHours} hours: Mixed content review and practice`
      });
      schedule.push({
        day: "Saturday-Sunday",
        schedule: `Light review only or rest days`
      });
    } else if (consistency === 'intensive') {
      schedule.push({
        day: "Monday-Friday",
        schedule: `${weekdayHours} hours: Light review and maintenance practice`
      });
      schedule.push({
        day: "Saturday-Sunday",
        schedule: `${weekendHours} hours each day: Intensive study sessions, full practice tests`
      });
    }
    
    return schedule;
  }
  
  function getExamInsights(examType) {
    const insights = {
      'mcat': {
        name: 'MCAT',
        emoji: '🩺',
        tips: [
          'Focus heavily on practice passages - 70% of study time should be passage-based',
          'Master biochemistry and psychology - highest yield subjects',
          'Take practice tests every 2 weeks to track progress',
          'Review every wrong answer thoroughly, not just correct answers',
          'Practice test timing is crucial - 1.5 minutes per question average'
        ]
      },
      'lsat': {
        name: 'LSAT',
        emoji: '⚖️',
        tips: [
          'Logic Games are learnable - master common game types',
          'Reading Comprehension requires active reading strategies',
          'Logical Reasoning is 50% of your score - prioritize this section',
          'Take practice tests under strict timing conditions',
          'Review argument patterns and common logical fallacies'
        ]
      },
      'gre': {
        name: 'GRE',
        emoji: '🎓',
        tips: [
          'Vocabulary is crucial for verbal - study 10-15 words daily',
          'Math concepts are high school level but require speed',
          'AWA essays need structured approach and practice',
          'Focus on test-taking strategies and time management',
          'PowerPrep practice tests most closely mirror actual exam'
        ]
      },
      'gmat': {
        name: 'GMAT',
        emoji: '💼',
        tips: [
          'Data Sufficiency is unique - practice this question type heavily',
          'Integrated Reasoning section requires specific strategies',
          'Sentence Correction follows strict grammar rules',
          'Computer adaptive format means early questions matter more',
          'Official Guide problems are essential practice material'
        ]
      },
      'usmle-step1': {
        name: 'USMLE Step 1',
        emoji: '🏥',
        tips: [
          'First Aid is essential but not sufficient alone',
          'UWorld questions are the gold standard for practice',
          'Anki flashcards for spaced repetition of facts',
          'Focus on high-yield topics and common diseases',
          'Practice test-taking stamina - exam is 8 hours long'
        ]
      },
      'usmle-step2': {
        name: 'USMLE Step 2 CK',
        emoji: '🏥',
        tips: [
          'Clinical decision-making is key - think like a resident',
          'Master common presentations and differential diagnoses',
          'UWorld and practice cases are essential',
          'Know guidelines for common conditions',
          'Time management crucial - average 1.5 minutes per question'
        ]
      }
    };
    
    return insights[examType] || {
      name: 'Professional Exam',
      emoji: '📚',
      tips: [
        'Focus on practice questions over passive reading',
        'Take regular practice tests to track progress',
        'Review mistakes thoroughly',
        'Maintain consistent daily study schedule',
        'Balance content review with application practice'
      ]
    };
  }
});