document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('sines-form');
  const result = document.getElementById('sines-result');
  
  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  }
  
  function validateTriangle(a, b, c, A, B, C) {
    // Check triangle inequality
    if (a && b && c) {
      if (a + b <= c || a + c <= b || b + c <= a) {
        return "Невірні сторони: не виконується нерівність трикутника";
      }
    }
    
    // Check angle sum
    let angleSum = 0;
    let angleCount = 0;
    if (A) { angleSum += A; angleCount++; }
    if (B) { angleSum += B; angleCount++; }
    if (C) { angleSum += C; angleCount++; }
    
    if (angleCount >= 2 && Math.abs(angleSum + (C || B || A) - 180) > 0.01) {
      if (angleCount === 3 && Math.abs(angleSum - 180) > 0.01) {
        return "Сума кутів має дорівнювати 180°";
      }
    }
    
    return null;
  }
  
  function solveTriangle(sideA, sideB, sideC, angleA, angleB, angleC) {
    let a = sideA, b = sideB, c = sideC;
    let A = angleA, B = angleB, C = angleC;
    
    // Convert angles to radians for calculations
    if (A) A = toRadians(angleA);
    if (B) B = toRadians(angleB);
    if (C) C = toRadians(angleC);
    
    // Count known parameters
    let knownSides = (a ? 1 : 0) + (b ? 1 : 0) + (c ? 1 : 0);
    let knownAngles = (A ? 1 : 0) + (B ? 1 : 0) + (C ? 1 : 0);
    
    if (knownSides + knownAngles < 3) {
      throw new Error("Потрібно знати мінімум 3 параметри");
    }
    
    if (knownSides === 0) {
      throw new Error("Потрібна хоча б одна сторона");
    }
    
    // Complete angles if two are known
    if (knownAngles === 2) {
      if (!A) A = Math.PI - B - C;
      else if (!B) B = Math.PI - A - C;
      else if (!C) C = Math.PI - A - B;
      knownAngles = 3;
    }
    
    // Case 1: ASA or AAS - we have two angles and one side
    if (knownAngles === 2 && knownSides === 1) {
      // Complete the third angle
      if (!A) A = Math.PI - B - C;
      else if (!B) B = Math.PI - A - C;
      else if (!C) C = Math.PI - A - B;
      
      // Use law of sines to find missing sides
      if (a && !b && !c) {
        b = a * Math.sin(B) / Math.sin(A);
        c = a * Math.sin(C) / Math.sin(A);
      } else if (b && !a && !c) {
        a = b * Math.sin(A) / Math.sin(B);
        c = b * Math.sin(C) / Math.sin(B);
      } else if (c && !a && !b) {
        a = c * Math.sin(A) / Math.sin(C);
        b = c * Math.sin(B) / Math.sin(C);
      }
    }
    
    // Case 2: SSA - two sides and one angle (potentially ambiguous)
    else if (knownSides === 2 && knownAngles === 1) {
      let solutions = [];
      
      if (a && b && A) {
        let sinB = b * Math.sin(A) / a;
        if (sinB > 1) {
          throw new Error("Розв'язку не існує: sinB > 1");
        }
        
        let B1 = Math.asin(sinB);
        let B2 = Math.PI - B1;
        
        // Check both potential solutions
        [B1, B2].forEach(B_temp => {
          if (B_temp > 0 && B_temp < Math.PI) {
            let C_temp = Math.PI - A - B_temp;
            if (C_temp > 0) {
              let c_temp = a * Math.sin(C_temp) / Math.sin(A);
              solutions.push({
                a: a, b: b, c: c_temp,
                A: A, B: B_temp, C: C_temp
              });
            }
          }
        });
        
        if (solutions.length === 0) {
          throw new Error("Розв'язку не існує");
        }
        
        // Return first solution, note if ambiguous
        let sol = solutions[0];
        return {
          a: sol.a, b: sol.b, c: sol.c,
          A: toDegrees(sol.A), B: toDegrees(sol.B), C: toDegrees(sol.C),
          ambiguous: solutions.length > 1,
          solutions: solutions.map(s => ({
            a: s.a, b: s.b, c: s.c,
            A: toDegrees(s.A), B: toDegrees(s.B), C: toDegrees(s.C)
          }))
        };
      }
      
      // Similar logic for other SSA cases...
      if (a && c && A) {
        let sinC = c * Math.sin(A) / a;
        if (sinC > 1) throw new Error("Розв'язку не існує");
        
        C = Math.asin(sinC);
        B = Math.PI - A - C;
        b = a * Math.sin(B) / Math.sin(A);
      } else if (b && c && B) {
        let sinC = c * Math.sin(B) / b;
        if (sinC > 1) throw new Error("Розв'язку не існує");
        
        C = Math.asin(sinC);
        A = Math.PI - B - C;
        a = b * Math.sin(A) / Math.sin(B);
      }
    }
    
    // Case 3: SAS or SSS - use law of cosines first, then law of sines
    else if (knownSides === 3 || (knownSides === 2 && knownAngles === 1)) {
      if (a && b && c) {
        // SSS - find all angles using law of cosines
        A = Math.acos((b*b + c*c - a*a) / (2*b*c));
        B = Math.acos((a*a + c*c - b*b) / (2*a*c));
        C = Math.PI - A - B;
      }
    }
    
    // Complete any missing angles using angle sum
    if (!A && B && C) A = Math.PI - B - C;
    if (!B && A && C) B = Math.PI - A - C;
    if (!C && A && B) C = Math.PI - A - B;
    
    // Calculate remaining sides using law of sines
    if (A && B && C) {
      if (a && !b) b = a * Math.sin(B) / Math.sin(A);
      if (a && !c) c = a * Math.sin(C) / Math.sin(A);
      if (b && !a) a = b * Math.sin(A) / Math.sin(B);
      if (b && !c) c = b * Math.sin(C) / Math.sin(B);
      if (c && !a) a = c * Math.sin(A) / Math.sin(C);
      if (c && !b) b = c * Math.sin(B) / Math.sin(C);
    }
    
    return {
      a: a, b: b, c: c,
      A: toDegrees(A), B: toDegrees(B), C: toDegrees(C),
      ambiguous: false
    };
  }
  
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const sideA = parseFloat(document.getElementById('side-a').value) || null;
      const sideB = parseFloat(document.getElementById('side-b').value) || null;
      const sideC = parseFloat(document.getElementById('side-c').value) || null;
      const angleA = parseFloat(document.getElementById('angle-a').value) || null;
      const angleB = parseFloat(document.getElementById('angle-b').value) || null;
      const angleC = parseFloat(document.getElementById('angle-c').value) || null;
      
      try {
        // Validate input
        const validationError = validateTriangle(sideA, sideB, sideC, angleA, angleB, angleC);
        if (validationError) {
          throw new Error(validationError);
        }
        
        // Solve triangle
        const solution = solveTriangle(sideA, sideB, sideC, angleA, angleB, angleC);
        
        // Calculate additional properties
        const area = 0.5 * solution.a * solution.b * Math.sin(toRadians(solution.C));
        const perimeter = solution.a + solution.b + solution.c;
        const circumradius = solution.a / (2 * Math.sin(toRadians(solution.A)));
        
        let resultHTML = `
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>📏 Сторони трикутника</h6>
              <div class="result-value">a = ${solution.a.toFixed(3)}</div>
              <div class="result-value">b = ${solution.b.toFixed(3)}</div>
              <div class="result-value">c = ${solution.c.toFixed(3)}</div>
            </div>
            
            <div class="insight-card info">
              <h6>📐 Кути трикутника</h6>
              <div class="result-value">∠A = ${solution.A.toFixed(2)}°</div>
              <div class="result-value">∠B = ${solution.B.toFixed(2)}°</div>
              <div class="result-value">∠C = ${solution.C.toFixed(2)}°</div>
            </div>
            
            <div class="insight-card warning">
              <h6>📊 Додаткові властивості</h6>
              <div class="result-value">Площа = ${area.toFixed(3)}</div>
              <div class="result-value">Периметр = ${perimeter.toFixed(3)}</div>
              <div class="result-value">Радіус = ${circumradius.toFixed(3)}</div>
            </div>
          </div>
        `;
        
        if (solution.ambiguous) {
          resultHTML += `
            <div class="insight-card warning">
              <h6>⚠️ Неоднозначний випадок</h6>
              <p>Існує два можливі розв'язки для цього трикутника!</p>
            </div>
          `;
        }
        
        result.innerHTML = resultHTML;
        
      } catch (error) {
        result.innerHTML = `
          <div class="insight-card warning">
            <h6>⚠️ Помилка</h6>
            <p>${error.message}</p>
          </div>
        `;
      }
    });
  }
});