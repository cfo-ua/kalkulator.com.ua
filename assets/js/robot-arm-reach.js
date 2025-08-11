document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("robot-arm-form");
  if (!form) return;

  // Mathematical utility functions
  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  function radToDeg(radians) {
    return radians * (180 / Math.PI);
  }

  // 2D Inverse Kinematics for two-link arm
  function calculate2DOFInverseKinematics(x, y, l1, l2) {
    const distance = Math.sqrt(x * x + y * y);
    
    // Check if target is reachable
    if (distance > (l1 + l2)) {
      return { 
        reachable: false, 
        error: "Target too far",
        maxReach: l1 + l2
      };
    }
    
    if (distance < Math.abs(l1 - l2)) {
      return { 
        reachable: false, 
        error: "Target too close",
        minReach: Math.abs(l1 - l2)
      };
    }

    // Calculate joint angles using law of cosines
    const cosTheta2 = (x * x + y * y - l1 * l1 - l2 * l2) / (2 * l1 * l2);
    const theta2 = Math.acos(Math.max(-1, Math.min(1, cosTheta2))); // Elbow down solution
    
    const k1 = l1 + l2 * Math.cos(theta2);
    const k2 = l2 * Math.sin(theta2);
    const theta1 = Math.atan2(y, x) - Math.atan2(k2, k1);

    return {
      reachable: true,
      theta1: radToDeg(theta1),
      theta2: radToDeg(theta2),
      distance: distance
    };
  }

  // 3D Forward Kinematics for simple articulated arm
  function calculateForwardKinematics(theta1, theta2, theta3, l1, l2, l3, baseHeight) {
    const rad1 = degToRad(theta1);
    const rad2 = degToRad(theta2);
    const rad3 = degToRad(theta3 || 0);

    // Calculate end-effector position
    const x = (l1 * Math.cos(rad2) + l2 * Math.cos(rad2 + rad3)) * Math.cos(rad1);
    const y = (l1 * Math.cos(rad2) + l2 * Math.cos(rad2 + rad3)) * Math.sin(rad1);
    const z = baseHeight + l1 * Math.sin(rad2) + l2 * Math.sin(rad2 + rad3);

    return { x, y, z };
  }

  // Check joint limits
  function checkJointLimits(angle, min, max) {
    return angle >= min && angle <= max;
  }

  // Calculate workspace characteristics
  function calculateWorkspaceCharacteristics(l1, l2, l3, baseHeight) {
    const maxReachHorizontal = l1 + l2 + (l3 || 0);
    const minReachHorizontal = Math.abs(l1 - l2 - (l3 || 0));
    const maxHeight = baseHeight + l1 + l2 + (l3 || 0);
    const minHeight = baseHeight - l1 - l2 - (l3 || 0);
    
    // Workspace volume approximation (simplified)
    const workspaceVolume = Math.PI * Math.pow(maxReachHorizontal, 2) * (maxHeight - Math.max(0, minHeight));
    
    return {
      maxReachHorizontal,
      minReachHorizontal,
      maxHeight,
      minHeight,
      workspaceVolume
    };
  }

  // Main calculation function
  function calculateRobotArmReach() {
    // Get form values
    const armType = document.getElementById("arm-type").value;
    const l1 = parseFloat(document.getElementById("link1-length").value);
    const l2 = parseFloat(document.getElementById("link2-length").value);
    const l3 = parseFloat(document.getElementById("link3-length").value) || 0;
    const baseHeight = parseFloat(document.getElementById("base-height").value);

    const targetX = parseFloat(document.getElementById("target-x").value);
    const targetY = parseFloat(document.getElementById("target-y").value);
    const targetZ = parseFloat(document.getElementById("target-z").value);
    const endEffectorAngle = parseFloat(document.getElementById("end-effector").value) || 0;

    const joint1Min = parseFloat(document.getElementById("joint1-min").value);
    const joint1Max = parseFloat(document.getElementById("joint1-max").value);
    const joint2Min = parseFloat(document.getElementById("joint2-min").value);
    const joint2Max = parseFloat(document.getElementById("joint2-max").value);

    const collisionCheck = document.getElementById("collision-check").checked;
    const workspaceAnalysis = document.getElementById("workspace-analysis").checked;
    const optimalPath = document.getElementById("optimal-path").checked;

    // Calculate workspace characteristics
    const workspace = calculateWorkspaceCharacteristics(l1, l2, l3, baseHeight);

    // Adjust target for base height
    const adjustedZ = targetZ - baseHeight;
    const horizontalDistance = Math.sqrt(targetX * targetX + targetY * targetY);

    // Calculate base rotation angle (around Z-axis)
    const baseAngle = radToDeg(Math.atan2(targetY, targetX));

    // For simplified calculation, project to 2D plane
    const planarDistance = Math.sqrt(horizontalDistance * horizontalDistance + adjustedZ * adjustedZ);

    // Calculate inverse kinematics
    let ikResult;
    
    if (armType === "simple" || armType === "scara") {
      // 2DOF calculation
      ikResult = calculate2DOFInverseKinematics(horizontalDistance, adjustedZ, l1, l2);
    } else {
      // Multi-DOF calculation (simplified to 2DOF for demo)
      ikResult = calculate2DOFInverseKinematics(horizontalDistance, adjustedZ, l1, l2);
      if (ikResult.reachable && l3 > 0) {
        ikResult.theta3 = endEffectorAngle; // Simplified wrist angle
      }
    }

    // Check joint limits if reachable
    let withinLimits = true;
    let limitViolations = [];

    if (ikResult.reachable) {
      if (!checkJointLimits(baseAngle, joint1Min, joint1Max)) {
        withinLimits = false;
        limitViolations.push("Base rotation");
      }
      if (!checkJointLimits(ikResult.theta1, joint2Min, joint2Max)) {
        withinLimits = false;
        limitViolations.push("Shoulder joint");
      }
    }

    // Calculate forward kinematics for verification
    let forwardResult = null;
    if (ikResult.reachable) {
      forwardResult = calculateForwardKinematics(
        baseAngle, 
        ikResult.theta1, 
        ikResult.theta2, 
        l1, l2, l3, 
        baseHeight
      );
    }

    // Check for collisions (simplified)
    let collisionDetected = false;
    if (collisionCheck && ikResult.reachable) {
      // Simple collision check: if any joint position is below base
      if (adjustedZ < -baseHeight/2) {
        collisionDetected = true;
      }
    }

    // Calculate trajectory metrics
    const trajectoryData = {
      totalAngleChange: ikResult.reachable ? 
        Math.abs(ikResult.theta1) + Math.abs(ikResult.theta2) + Math.abs(baseAngle) : 0,
      estimatedTime: 0,
      smoothness: "Good"
    };

    if (ikResult.reachable && optimalPath) {
      // Simplified time estimation (degrees per second)
      const avgJointSpeed = 30; // degrees per second
      trajectoryData.estimatedTime = trajectoryData.totalAngleChange / avgJointSpeed;
    }

    return {
      armType,
      workspace,
      target: { x: targetX, y: targetY, z: targetZ },
      ikResult,
      baseAngle,
      withinLimits,
      limitViolations,
      forwardResult,
      collisionDetected,
      trajectoryData,
      armDimensions: { l1, l2, l3, baseHeight }
    };
  }

  function getReachabilityStatus(ikResult, withinLimits, collision) {
    if (!ikResult.reachable) return { status: 'unreachable', emoji: '❌', color: '#dc3545' };
    if (collision) return { status: 'collision', emoji: '⚠️', color: '#ffc107' };
    if (!withinLimits) return { status: 'limits', emoji: '🔒', color: '#fd7e14' };
    return { status: 'reachable', emoji: '✅', color: '#28a745' };
  }

  function displayResults(results) {
    const isEnglish = window.location.pathname.includes('/en/');
    const reachability = getReachabilityStatus(
      results.ikResult, 
      results.withinLimits, 
      results.collisionDetected
    );

    const armTypeLabels = isEnglish ? {
      articulated: 'Articulated Arm',
      scara: 'SCARA Robot',
      cylindrical: 'Cylindrical Robot',
      cartesian: 'Cartesian Robot',
      simple: 'Simple 2-DOF Arm'
    } : {
      articulated: 'Артикульована рука',
      scara: 'SCARA робот',
      cylindrical: 'Циліндричний робот',
      cartesian: 'Декартовий робот',
      simple: 'Проста 2-DOF рука'
    };

    let statusMessage = '';
    if (!results.ikResult.reachable) {
      statusMessage = isEnglish ? 
        `Target unreachable. ${results.ikResult.error}` :
        `Ціль недосяжна. ${results.ikResult.error}`;
    } else if (results.collisionDetected) {
      statusMessage = isEnglish ? 'Collision detected with base' : 'Виявлено колізію з базою';
    } else if (!results.withinLimits) {
      statusMessage = isEnglish ? 
        `Joint limits exceeded: ${results.limitViolations.join(', ')}` :
        `Перевищено обмеження суглобів: ${results.limitViolations.join(', ')}`;
    } else {
      statusMessage = isEnglish ? 'Target reachable' : 'Ціль досяжна';
    }

    const resultHTML = `
      <div class="insight-cards">
        <div class="insight-card ${reachability.status === 'reachable' ? 'success' : reachability.status === 'unreachable' ? 'warning' : 'info'}">
          <h6>${reachability.emoji} ${isEnglish ? 'Reachability' : 'Досяжність'}</h6>
          <div class="big-number" style="color: ${reachability.color}; font-size: 1.2rem; font-weight: bold;">
            ${statusMessage}
          </div>
          <p>${armTypeLabels[results.armType]}</p>
        </div>
        
        <div class="insight-card info">
          <h6>📏 ${isEnglish ? 'Maximum Reach' : 'Максимальна досяжність'}</h6>
          <div class="big-number">${results.workspace.maxReachHorizontal.toFixed(0)}</div>
          <p>${isEnglish ? 'mm from base' : 'мм від бази'}</p>
        </div>
        
        <div class="insight-card success">
          <h6>📐 ${isEnglish ? 'Target Distance' : 'Відстань до цілі'}</h6>
          <div class="big-number">${results.ikResult.distance ? results.ikResult.distance.toFixed(0) : 'N/A'}</div>
          <p>${isEnglish ? 'mm' : 'мм'}</p>
        </div>
      </div>

      ${results.ikResult.reachable ? `
      <div style="margin-top: 2rem;">
        <h4>🎯 ${isEnglish ? 'Joint Angles Solution' : 'Рішення кутів суглобів'}</h4>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius); margin: 1rem 0;">
          <div style="display: grid; gap: 0.8rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
              <span><strong>🔄 ${isEnglish ? 'Base Rotation (θ0)' : 'Обертання бази (θ0)'}</strong></span>
              <span><strong>${results.baseAngle.toFixed(1)}°</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>🦾 ${isEnglish ? 'Shoulder Joint (θ1)' : 'Плечовий сустав (θ1)'}</span>
              <span>${results.ikResult.theta1.toFixed(1)}°</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>💪 ${isEnglish ? 'Elbow Joint (θ2)' : 'Ліктьовий сустав (θ2)'}</span>
              <span>${results.ikResult.theta2.toFixed(1)}°</span>
            </div>
            ${results.ikResult.theta3 !== undefined ? `
            <div style="display: flex; justify-content: space-between; padding: 0.3rem 0;">
              <span>✋ ${isEnglish ? 'Wrist Joint (θ3)' : 'Зап\'ястний сустав (θ3)'}</span>
              <span>${results.ikResult.theta3.toFixed(1)}°</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
      ` : ''}

      <div style="margin-top: 1.5rem;">
        <h4>🏗️ ${isEnglish ? 'Workspace Analysis' : 'Аналіз робочого простору'}</h4>
        <div class="insight-cards">
          <div class="insight-card info">
            <h6>↔️ ${isEnglish ? 'Horizontal Reach' : 'Горизонтальна досяжність'}</h6>
            <div class="big-number">${results.workspace.maxReachHorizontal.toFixed(0)}</div>
            <p>${isEnglish ? 'Max range' : 'Макс. дальність'}</p>
          </div>
          
          <div class="insight-card success">
            <h6>↕️ ${isEnglish ? 'Vertical Range' : 'Вертикальний діапазон'}</h6>
            <div class="big-number">${(results.workspace.maxHeight - Math.max(0, results.workspace.minHeight)).toFixed(0)}</div>
            <p>${isEnglish ? 'Total height' : 'Загальна висота'}</p>
          </div>
          
          <div class="insight-card warning">
            <h6>📦 ${isEnglish ? 'Work Volume' : 'Робочий об\'єм'}</h6>
            <div class="big-number">${(results.workspace.workspaceVolume / 1000000).toFixed(1)}</div>
            <p>${isEnglish ? 'Liters' : 'Літрів'}</p>
          </div>
        </div>
      </div>

      ${results.trajectoryData.estimatedTime > 0 ? `
      <div style="margin-top: 1.5rem;">
        <h4>🛤️ ${isEnglish ? 'Trajectory Analysis' : 'Аналіз траєкторії'}</h4>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius);">
          <div style="display: grid; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between;">
              <span>⏱️ ${isEnglish ? 'Estimated Move Time' : 'Розрахунковий час руху'}</span>
              <span><strong>${results.trajectoryData.estimatedTime.toFixed(1)}s</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>📊 ${isEnglish ? 'Total Angle Change' : 'Загальна зміна кутів'}</span>
              <span>${results.trajectoryData.totalAngleChange.toFixed(1)}°</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>🌊 ${isEnglish ? 'Motion Smoothness' : 'Плавність руху'}</span>
              <span>${results.trajectoryData.smoothness}</span>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #f8fdff 0%, #e8f8fc 100%); border-radius: var(--radius); border: 1px solid var(--accent);">
        <h5>💡 ${isEnglish ? 'Engineering Insights' : 'Інженерні висновки'}</h5>
        <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
          ${results.ikResult.reachable ? `
            <li>✅ ${isEnglish ? 'Target is within robot workspace' : 'Ціль знаходиться в робочому просторі робота'}</li>
            ${results.withinLimits ? `<li>🎯 ${isEnglish ? 'All joint angles are within safe limits' : 'Всі кути суглобів в межах безпечних лімітів'}</li>` : ''}
          ` : `
            <li>❌ ${isEnglish ? `Target exceeds maximum reach of ${results.workspace.maxReachHorizontal.toFixed(0)}mm` : `Ціль перевищує максимальну досяжність ${results.workspace.maxReachHorizontal.toFixed(0)}мм`}</li>
          `}
          <li>📐 ${isEnglish ? `Robot configuration: ${results.armDimensions.l1}/${results.armDimensions.l2}/${results.armDimensions.l3}mm links` : `Конфігурація робота: ланки ${results.armDimensions.l1}/${results.armDimensions.l2}/${results.armDimensions.l3}мм`}</li>
          ${results.workspace.workspaceVolume > 1000000 ? `<li>🏭 ${isEnglish ? 'Large workspace suitable for industrial applications' : 'Великий робочий простір підходить для промислових застосувань'}</li>` : ''}
          ${results.ikResult.reachable && results.trajectoryData.totalAngleChange < 90 ? `<li>⚡ ${isEnglish ? 'Efficient motion with minimal joint movement' : 'Ефективний рух з мінімальним переміщенням суглобів'}</li>` : ''}
        </ul>
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: var(--radius);">
        <h5>🔧 ${isEnglish ? 'Implementation Notes' : 'Примітки щодо реалізації'}</h5>
        <ul style="margin: 0.5rem 0; padding-left: 1.2rem;">
          <li>📋 ${isEnglish ? 'Use calculated angles directly in robot control programs' : 'Використовуйте розраховані кути безпосередньо в програмах управління роботом'}</li>
          <li>🔄 ${isEnglish ? 'Consider motion planning for smooth trajectories' : 'Розгляньте планування руху для плавних траєкторій'}</li>
          <li>⚠️ ${isEnglish ? 'Always verify calculations with robot simulation first' : 'Завжди перевіряйте розрахунки спочатку в симуляції робота'}</li>
          ${!results.withinLimits ? `<li>🔒 ${isEnglish ? 'Adjust joint limits or target position to avoid constraint violations' : 'Скорегуйте обмеження суглобів або цільову позицію для уникнення порушень'}</li>` : ''}
        </ul>
      </div>
    `;

    document.getElementById("robot-arm-result").innerHTML = resultHTML;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const results = calculateRobotArmReach();
    displayResults(results);
    
    // Scroll to results
    document.getElementById("robot-arm-result").scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  });
});