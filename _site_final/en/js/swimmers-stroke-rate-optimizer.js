document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('swimmers-stroke-rate-optimizer-form');
  const result = document.getElementById('swimmers-stroke-rate-optimizer-result');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const stroke = form.stroke.value;
    const distance = form.distance.value;
    const timeMinutes = +(form['time-minutes'].value || 0);
    const timeSeconds = +form['time-seconds'].value;
    const poolLength = form['pool-length'].value;
    const strokeCount = +form['stroke-count'].value;
    const experience = form.experience.value;
    const ageCategory = form['age-category'].value;
    const trainingFreq = +form['training-frequency'].value;
    const goal = form.goal.value;
    const currentStrokeRate = form['current-stroke-rate'].value ? +form['current-stroke-rate'].value : null;
    const heightInput = +form.height.value;
    const heightUnit = form['height-unit'].value;
    const inches = +(form.inches?.value || 0);
    
    // Get focus areas
    const focusCheckboxes = form.querySelectorAll('input[name="focus-areas"]:checked');
    const focusAreas = Array.from(focusCheckboxes).map(cb => cb.value);

    // Validation
    if (!stroke || !distance || !timeSeconds || !poolLength || !strokeCount || 
        !experience || !ageCategory || !trainingFreq || !goal || !heightInput || 
        focusAreas.length === 0) {
      result.innerHTML = '<p style="color:red;">Please fill in all required fields and select at least one focus area.</p>';
      return;
    }

    // Convert units
    let heightCm;
    if (heightUnit === 'ft') {
      heightCm = (heightInput * 12 + inches) * 2.54;
    } else {
      heightCm = heightInput;
    }

    // Calculate total time in seconds
    const totalTimeSeconds = (timeMinutes * 60) + timeSeconds;
    
    // Calculate current swimming speed (m/s)
    let raceDistanceMeters;
    if (distance === 'open-water') {
      raceDistanceMeters = 5000; // Use 5k as reference
    } else if (distance === 'multiple') {
      raceDistanceMeters = 200; // Use 200m as default for analysis
    } else {
      raceDistanceMeters = +distance;
    }
    
    // Adjust for pool length effects on time
    let adjustedDistanceMeters = raceDistanceMeters;
    if (poolLength === '25' || poolLength === '25y') {
      // More turns in short course - typically ~2-5% faster times
      adjustedDistanceMeters = raceDistanceMeters * 1.03;
    }
    
    const currentSpeed = adjustedDistanceMeters / totalTimeSeconds; // m/s
    
    // Calculate Distance Per Stroke (DPS)
    let poolLengthMeters;
    if (poolLength === '25y') {
      poolLengthMeters = 22.86; // 25 yards in meters
    } else if (poolLength === '25') {
      poolLengthMeters = 25;
    } else if (poolLength === '50') {
      poolLengthMeters = 50;
    } else {
      poolLengthMeters = 50; // Open water reference
    }
    
    const dps = poolLengthMeters / strokeCount;
    
    // Calculate current stroke rate if not provided
    let estimatedCurrentSR;
    if (currentStrokeRate) {
      estimatedCurrentSR = currentStrokeRate;
    } else {
      // Calculate from speed and DPS: SR = (Speed / DPS) * 60
      estimatedCurrentSR = (currentSpeed / dps) * 60;
    }

    // Determine optimal stroke rate ranges based on stroke and distance
    const getOptimalSRRange = (stroke, distance, experience) => {
      const baseRanges = {
        'freestyle': {
          '50': [85, 100],
          '100': [80, 95],
          '200': [75, 88],
          '400': [72, 85],
          '800': [70, 82],
          '1500': [68, 80],
          'open-water': [72, 82]
        },
        'backstroke': {
          '50': [80, 95],
          '100': [75, 90],
          '200': [70, 85],
          '400': [68, 80],
          '800': [66, 78],
          '1500': [64, 76],
          'open-water': [68, 78]
        },
        'breaststroke': {
          '50': [55, 70],
          '100': [50, 65],
          '200': [45, 60],
          '400': [42, 58],
          '800': [40, 55],
          '1500': [38, 53],
          'open-water': [42, 55]
        },
        'butterfly': {
          '50': [60, 75],
          '100': [55, 70],
          '200': [50, 65],
          '400': [48, 62],
          '800': [45, 60],
          '1500': [42, 58],
          'open-water': [45, 58]
        },
        'individual-medley': {
          '200': [60, 80], // Varies by stroke
          '400': [58, 78],
          'multiple': [60, 80]
        }
      };
      
      let range = baseRanges[stroke][distance] || baseRanges[stroke]['200'] || [70, 85];
      
      // Adjust for experience level
      const experienceAdjustments = {
        'beginner': [-8, -5],
        'intermediate': [-5, -2],
        'advanced': [-2, 0],
        'competitive': [0, 2],
        'elite': [2, 5]
      };
      
      const adjustment = experienceAdjustments[experience] || [0, 0];
      return [range[0] + adjustment[0], range[1] + adjustment[1]];
    };

    const optimalRange = getOptimalSRRange(stroke, distance, experience);
    const targetSR = Math.round((optimalRange[0] + optimalRange[1]) / 2);

    // Calculate stroke efficiency metrics
    const strokeIndex = currentSpeed * dps;
    const strokesPerMeter = 1 / dps;
    
    // Determine focus recommendations
    let recommendations = [];
    let trainingRecommendations = [];
    
    // Analyze current stroke rate vs optimal
    if (estimatedCurrentSR < optimalRange[0] - 5) {
      recommendations.push('🔄 Increase stroke rate: Your current rate is significantly below optimal range');
      trainingRecommendations.push('Practice with tempo trainer at +2-3 SPM increments');
    } else if (estimatedCurrentSR > optimalRange[1] + 5) {
      recommendations.push('📏 Focus on stroke length: Your rate is high, work on distance per stroke');
      trainingRecommendations.push('Count strokes and work on reducing stroke count per length');
    } else {
      recommendations.push('⚖️ Fine-tune balance: You\'re in the optimal range, focus on consistency');
    }
    
    // Height-based recommendations
    if (heightCm > 185) {
      recommendations.push('🏊 Tall swimmer advantage: Your height supports longer strokes - focus on DPS');
    } else if (heightCm < 165) {
      recommendations.push('⚡ Shorter swimmer strategy: Higher stroke rates may be more efficient for you');
    }
    
    // Distance-specific recommendations
    if (distance === '50' || distance === '100') {
      recommendations.push('🏃 Sprint focus: Practice holding high stroke rates with good technique');
      trainingRecommendations.push('Sprint sets: 8x25 @ 95% stroke rate with full recovery');
    } else if (distance === '800' || distance === '1500' || distance === 'open-water') {
      recommendations.push('🎯 Distance efficiency: Prioritize sustainable stroke rate and rhythm');
      trainingRecommendations.push('Steady-state sets: 10x100 at target stroke rate');
    }
    
    // Stroke-specific recommendations
    if (stroke === 'breaststroke') {
      recommendations.push('🐸 Breaststroke timing: Focus on glide phase and kick timing');
      trainingRecommendations.push('Drill: 2-kick 1-pull to emphasize stroke timing');
    } else if (stroke === 'butterfly') {
      recommendations.push('🦋 Butterfly rhythm: Maintain 2-beat kick per stroke cycle');
      trainingRecommendations.push('Build sets: 4x50 building stroke rate each 50');
    }
    
    // Experience-based recommendations
    if (experience === 'beginner' || experience === 'intermediate') {
      recommendations.push('📚 Technique first: Master stroke mechanics before focusing on stroke rate');
      trainingRecommendations.push('Technical sets: 6x50 with perfect stroke count');
    }
    
    // Goal-specific recommendations
    if (goal === 'competition') {
      recommendations.push('🏆 Race preparation: Practice stroke rate changes during race simulation');
      trainingRecommendations.push('Race pace sets: 3x200 negative split with stroke rate progression');
    } else if (goal === 'efficiency') {
      recommendations.push('⚙️ Efficiency focus: Monitor both stroke rate and stroke count equally');
      trainingRecommendations.push('Golf sets: Swim for time + stroke count (lower total wins)');
    }

    // Generate training zones
    const generateTrainingZones = (targetSR) => {
      return {
        recovery: Math.round(targetSR * 0.7),
        aerobic: Math.round(targetSR * 0.8),
        threshold: Math.round(targetSR * 0.9),
        vo2max: Math.round(targetSR * 0.95),
        neuromuscular: targetSR
      };
    };

    const trainingZones = generateTrainingZones(targetSR);

    // Calculate potential improvement
    const currentPace = totalTimeSeconds / raceDistanceMeters; // seconds per meter
    const improvedDPS = dps * 1.05; // 5% improvement in stroke length
    const improvedSR = targetSR / 60; // convert to strokes per second
    const improvedSpeed = improvedSR * improvedDPS;
    const improvedTime = raceDistanceMeters / improvedSpeed;
    const timeImprovement = totalTimeSeconds - improvedTime;

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = (seconds % 60).toFixed(2);
      return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`;
    };

    const resultHTML = `
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
        <h3 style="color:#157aff;margin-top:0;">Your Swimming Stroke Rate Analysis</h3>
        
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Current Performance Profile</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
            <div><strong>Stroke:</strong> ${stroke.charAt(0).toUpperCase() + stroke.slice(1).replace('-', ' ')}</div>
            <div><strong>Distance:</strong> ${distance === 'multiple' ? 'Multiple' : distance === 'open-water' ? 'Open Water' : distance + 'm'}</div>
            <div><strong>Current Time:</strong> ${formatTime(totalTimeSeconds)}</div>
            <div><strong>Current Speed:</strong> ${currentSpeed.toFixed(2)} m/s</div>
            <div><strong>Stroke Count:</strong> ${strokeCount} per ${poolLengthMeters}m</div>
            <div><strong>Distance Per Stroke:</strong> ${dps.toFixed(2)}m</div>
          </div>
        </div>

        <div style="background:white;padding:20px;border-radius:6px;margin:15px 0;text-align:center;">
          <h4 style="color:#28a745;margin-top:0;">Stroke Rate Analysis</h4>
          <div style="display:flex;justify-content:center;align-items:center;gap:30px;flex-wrap:wrap;margin:20px 0;">
            <div style="text-align:center;">
              <div style="color:#666;font-size:0.9em;">Current Stroke Rate</div>
              <div style="font-size:2em;font-weight:bold;color:#666;">${Math.round(estimatedCurrentSR)}</div>
              <div style="color:#666;font-size:0.8em;">SPM</div>
            </div>
            <div style="font-size:2em;color:#ccc;">→</div>
            <div style="text-align:center;">
              <div style="color:#28a745;font-size:0.9em;">Target Stroke Rate</div>
              <div style="font-size:2em;font-weight:bold;color:#28a745;">${targetSR}</div>
              <div style="color:#28a745;font-size:0.8em;">SPM</div>
            </div>
          </div>
          <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
            <strong>Optimal Range: ${optimalRange[0]}-${optimalRange[1]} SPM</strong><br>
            <span style="color:#666;font-size:0.9em;">Based on your stroke, distance, and experience level</span>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Stroke Efficiency Metrics</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
            <div style="text-align:center;padding:15px;background:#e3f2fd;border-radius:6px;">
              <div style="font-weight:bold;color:#1976d2;">Stroke Index</div>
              <div style="font-size:1.2em;color:#1976d2;">${strokeIndex.toFixed(2)}</div>
              <div style="font-size:0.8em;color:#666;">Speed × DPS</div>
            </div>
            <div style="text-align:center;padding:15px;background:#e8f5e8;border-radius:6px;">
              <div style="font-weight:bold;color:#388e3c;">Distance Per Stroke</div>
              <div style="font-size:1.2em;color:#388e3c;">${dps.toFixed(2)}m</div>
              <div style="font-size:0.8em;color:#666;">Pool length ÷ strokes</div>
            </div>
            <div style="text-align:center;padding:15px;background:#fff3e0;border-radius:6px;">
              <div style="font-weight:bold;color:#f57c00;">Strokes Per Meter</div>
              <div style="font-size:1.2em;color:#f57c00;">${strokesPerMeter.toFixed(1)}</div>
              <div style="font-size:0.8em;color:#666;">Stroke efficiency</div>
            </div>
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Training Zone Stroke Rates</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
            <div style="text-align:center;padding:10px;background:#e8f5e8;border-radius:4px;">
              <div style="font-weight:bold;color:#155724;">Recovery</div>
              <div style="color:#155724;">${trainingZones.recovery} SPM</div>
              <div style="font-size:0.8em;color:#666;">Easy swimming</div>
            </div>
            <div style="text-align:center;padding:10px;background:#d1ecf1;border-radius:4px;">
              <div style="font-weight:bold;color:#0c5460;">Aerobic</div>
              <div style="color:#0c5460;">${trainingZones.aerobic} SPM</div>
              <div style="font-size:0.8em;color:#666;">Base training</div>
            </div>
            <div style="text-align:center;padding:10px;background:#fff3cd;border-radius:4px;">
              <div style="font-weight:bold;color:#856404;">Threshold</div>
              <div style="color:#856404;">${trainingZones.threshold} SPM</div>
              <div style="font-size:0.8em;color:#666;">Race pace</div>
            </div>
            <div style="text-align:center;padding:10px;background:#f8d7da;border-radius:4px;">
              <div style="font-weight:bold;color:#721c24;">VO2 Max</div>
              <div style="color:#721c24;">${trainingZones.vo2max} SPM</div>
              <div style="font-size:0.8em;color:#666;">High intensity</div>
            </div>
            <div style="text-align:center;padding:10px;background:#e2e3e5;border-radius:4px;">
              <div style="font-weight:bold;color:#383d41;">Max Rate</div>
              <div style="color:#383d41;">${trainingZones.neuromuscular} SPM</div>
              <div style="font-size:0.8em;color:#666;">Sprint speed</div>
            </div>
          </div>
        </div>

        ${timeImprovement > 0 ? `
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Performance Improvement Potential</h4>
          <div style="background:#d4edda;padding:15px;border-radius:6px;">
            <div style="text-align:center;">
              <div style="font-size:1.1em;color:#155724;">
                <strong>Potential Time Improvement: ${formatTime(timeImprovement)}</strong>
              </div>
              <div style="color:#666;font-size:0.9em;margin-top:5px;">
                Based on optimizing stroke rate and 5% stroke length improvement
              </div>
              <div style="margin-top:10px;color:#155724;">
                Current: ${formatTime(totalTimeSeconds)} → Target: ${formatTime(improvedTime)}
              </div>
            </div>
          </div>
        </div>
        ` : ''}

        ${recommendations.length > 0 ? `
        <div style="background:#d1ecf1;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#0c5460;">💡 Personalized Recommendations</h4>
          <ul style="margin:5px 0;color:#0c5460;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background:#d4edda;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#155724;">🏊 Training Set Recommendations</h4>
          <div style="margin:10px 0;">
            ${trainingRecommendations.length > 0 ? 
              trainingRecommendations.map(rec => `<div style="margin:8px 0;color:#155724;">• ${rec}</div>`).join('') :
              `<div style="color:#155724;">• Technical focus: 8x50 at target stroke rate with tempo trainer</div>
               <div style="color:#155724;">• Build set: 6x100 building stroke rate by 2 SPM each 100</div>
               <div style="color:#155724;">• Consistency: 5x200 maintaining ±2 SPM of target rate</div>`
            }
          </div>
        </div>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;">Stroke Rate Development Plan</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px;">
            <div>
              <strong>🎯 Week 1-2: Assessment</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Test current stroke rate at different speeds</li>
                <li>Establish baseline stroke count per length</li>
                <li>Practice with tempo trainer</li>
              </ul>
            </div>
            <div>
              <strong>📈 Week 3-4: Development</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Gradually adjust toward target stroke rate</li>
                <li>Focus on maintaining stroke length</li>
                <li>Build sets with stroke rate progression</li>
              </ul>
            </div>
            <div>
              <strong>⚖️ Week 5-6: Integration</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Practice target stroke rate in training sets</li>
                <li>Work on stroke rate consistency</li>
                <li>Race pace practice with target rate</li>
              </ul>
            </div>
            <div>
              <strong>🔧 Week 7-8: Fine-tuning</strong>
              <ul style="margin:5px 0;font-size:0.9em;">
                <li>Adjust stroke rate for different training zones</li>
                <li>Practice stroke rate changes in longer sets</li>
                <li>Competition simulation</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background:#e2e3e5;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#383d41;">🛠️ Tools for Stroke Rate Training</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;color:#383d41;font-size:0.9em;">
            <div>
              <strong>Tempo Trainers:</strong> Finis Tempo Trainer Pro, Wetronome app, or metronome
            </div>
            <div>
              <strong>Stroke Counting:</strong> Stroke count per length tracking sheet
            </div>
            <div>
              <strong>Time Tracking:</strong> Pace clock or swimming watch
            </div>
            <div>
              <strong>Video Analysis:</strong> Underwater camera for stroke analysis
            </div>
          </div>
        </div>

        <div style="background:#fff3cd;padding:15px;border-radius:6px;margin:15px 0;">
          <h4 style="margin-top:0;color:#856404;">⚠️ Important Reminders</h4>
          <ul style="margin:5px 0;color:#856404;font-size:0.9em;">
            <li>Technique quality is more important than hitting exact stroke rate numbers</li>
            <li>Individual optimal stroke rates vary based on body type and swimming ability</li>
            <li>Practice stroke rate changes gradually to avoid technique breakdown</li>
            <li>Use stroke rate as a tool, not an absolute target - feel and efficiency matter most</li>
            <li>Work with a qualified swimming coach for personalized technique development</li>
          </ul>
        </div>
      </div>
    `;

    result.innerHTML = resultHTML;
  });
});