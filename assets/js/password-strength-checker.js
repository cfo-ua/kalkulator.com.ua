document.addEventListener("DOMContentLoaded", function () {
  // Security policies definitions
  const securityPolicies = {
    basic: {
      name: "Базова",
      requirements: {
        minLength: 8,
        requireUppercase: false,
        requireLowercase: true,
        requireNumbers: false,
        requireSymbols: false,
        maxRepeating: 3
      }
    },
    corporate: {
      name: "Корпоративна",
      requirements: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        maxRepeating: 2
      }
    },
    banking: {
      name: "Банківська",
      requirements: {
        minLength: 14,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        maxRepeating: 2
      }
    },
    healthcare: {
      name: "Медична (HIPAA)",
      requirements: {
        minLength: 16,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        maxRepeating: 2
      }
    },
    government: {
      name: "Державна",
      requirements: {
        minLength: 18,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        maxRepeating: 1
      }
    }
  };

  // Common weak patterns
  const weakPatterns = [
    /(.)\1{2,}/,  // Repeated characters
    /012|123|234|345|456|567|678|789|890/,  // Sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i,  // Sequential letters
    /qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm/i,  // Keyboard patterns
    /password|admin|user|login|welcome|123456|qwerty|letmein|monkey|dragon|пароль|адмін|користувач/i  // Common passwords
  ];

  // Elements
  const passwordInput = document.getElementById("password-input");
  const togglePassword = document.getElementById("toggle-password");
  const securityPolicySelect = document.getElementById("security-policy");
  const analysisSection = document.getElementById("password-analysis");
  const strengthCard = document.getElementById("strength-card");
  const strengthScore = document.getElementById("strength-score");
  const strengthLevel = document.getElementById("strength-level");
  const strengthFill = document.getElementById("strength-fill");
  const entropyValue = document.getElementById("entropy-value");
  const crackTime = document.getElementById("crack-time");
  const policyCard = document.getElementById("policy-card");
  const policyScore = document.getElementById("policy-score");
  const policyStatus = document.getElementById("policy-status");
  const passwordBreakdown = document.getElementById("password-breakdown");
  const recommendations = document.getElementById("recommendations");
  
  // Generator elements
  const passwordLength = document.getElementById("password-length");
  const lengthDisplay = document.getElementById("length-display");
  const includeUppercase = document.getElementById("include-uppercase");
  const includeLowercase = document.getElementById("include-lowercase");
  const includeNumbers = document.getElementById("include-numbers");
  const includeSymbols = document.getElementById("include-symbols");
  const excludeAmbiguous = document.getElementById("exclude-ambiguous");
  const generateButton = document.getElementById("generate-password");
  const generatedPasswordContainer = document.getElementById("generated-password-container");
  const generatedPassword = document.getElementById("generated-password");
  const copyPasswordButton = document.getElementById("copy-password");
  const generatedAnalysis = document.getElementById("generated-analysis");

  // Event listeners
  passwordInput.addEventListener("input", analyzePassword);
  togglePassword.addEventListener("click", togglePasswordVisibility);
  securityPolicySelect.addEventListener("change", analyzePassword);
  passwordLength.addEventListener("input", updateLengthDisplay);
  generateButton.addEventListener("click", generatePassword);
  copyPasswordButton.addEventListener("click", copyPassword);

  function togglePasswordVisibility() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "👁️" : "🙈";
  }

  function updateLengthDisplay() {
    lengthDisplay.textContent = passwordLength.value;
  }

  function analyzePassword() {
    const password = passwordInput.value;
    if (!password) {
      analysisSection.style.display = "none";
      return;
    }

    analysisSection.style.display = "block";
    
    const selectedPolicy = securityPolicies[securityPolicySelect.value];
    const analysis = calculatePasswordStrength(password, selectedPolicy);
    
    displayAnalysis(analysis, password, selectedPolicy);
  }

  function calculatePasswordStrength(password, policy) {
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    // Calculate entropy
    let charsetSize = 0;
    if (hasLowercase) charsetSize += 26;
    if (hasUppercase) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSymbols) charsetSize += 32;
    
    const entropy = length * Math.log2(charsetSize || 1);
    
    // Calculate strength score (0-100)
    let score = 0;
    score += Math.min(length * 4, 50); // Length contribution (max 50 points)
    score += hasUppercase ? 10 : 0;
    score += hasLowercase ? 10 : 0;
    score += hasNumbers ? 10 : 0;
    score += hasSymbols ? 15 : 0;
    
    // Penalty for weak patterns
    for (const pattern of weakPatterns) {
      if (pattern.test(password)) {
        score -= 20;
      }
    }
    
    score = Math.max(0, Math.min(100, score));
    
    // Policy compliance
    const policyCompliance = checkPolicyCompliance(password, policy);
    
    // Crack time estimation
    const crackTimeEstimate = calculateCrackTime(entropy);
    
    return {
      score,
      entropy,
      crackTime: crackTimeEstimate,
      policyCompliance,
      characteristics: {
        length,
        hasUppercase,
        hasLowercase,
        hasNumbers,
        hasSymbols
      }
    };
  }

  function checkPolicyCompliance(password, policy) {
    const reqs = policy.requirements;
    let compliantCount = 0;
    let totalRequirements = 0;
    
    const checks = [
      { requirement: "minLength", passes: password.length >= reqs.minLength, label: `Мінімум ${reqs.minLength} символів` },
      { requirement: "requireUppercase", passes: !reqs.requireUppercase || /[A-Z]/.test(password), label: "Великі літери (A-Z)" },
      { requirement: "requireLowercase", passes: !reqs.requireLowercase || /[a-z]/.test(password), label: "Малі літери (a-z)" },
      { requirement: "requireNumbers", passes: !reqs.requireNumbers || /[0-9]/.test(password), label: "Цифри (0-9)" },
      { requirement: "requireSymbols", passes: !reqs.requireSymbols || /[^A-Za-z0-9]/.test(password), label: "Спеціальні символи" }
    ];
    
    const activeChecks = checks.filter(check => 
      check.requirement === "minLength" || reqs[check.requirement]
    );
    
    totalRequirements = activeChecks.length;
    compliantCount = activeChecks.filter(check => check.passes).length;
    
    return {
      score: Math.round((compliantCount / totalRequirements) * 100),
      passed: compliantCount === totalRequirements,
      checks: activeChecks
    };
  }

  function calculateCrackTime(entropy) {
    if (entropy < 20) return "менше години";
    if (entropy < 40) return "кілька днів";
    if (entropy < 60) return "кілька років";
    if (entropy < 80) return "кілька століть";
    return "більше тисячоліть";
  }

  function displayAnalysis(analysis, password, policy) {
    // Strength score and level
    strengthScore.textContent = Math.round(analysis.score) + "%";
    
    let strengthClass, strengthText;
    if (analysis.score < 20) {
      strengthClass = "very-weak";
      strengthText = "Дуже слабкий";
      strengthCard.className = "insight-card warning";
    } else if (analysis.score < 40) {
      strengthClass = "weak";
      strengthText = "Слабкий";
      strengthCard.className = "insight-card warning";
    } else if (analysis.score < 60) {
      strengthClass = "fair";
      strengthText = "Задовільний";
      strengthCard.className = "insight-card info";
    } else if (analysis.score < 80) {
      strengthClass = "good";
      strengthText = "Хороший";
      strengthCard.className = "insight-card success";
    } else {
      strengthClass = "strong";
      strengthText = "Надійний";
      strengthCard.className = "insight-card success";
    }
    
    strengthLevel.textContent = strengthText;
    strengthLevel.className = `strength-level ${strengthClass}`;
    strengthFill.style.width = analysis.score + "%";
    strengthFill.style.backgroundColor = getStrengthColor(analysis.score);
    
    // Entropy and crack time
    entropyValue.textContent = Math.round(analysis.entropy);
    crackTime.textContent = `Час на злом: ${analysis.crackTime}`;
    
    // Policy compliance
    policyScore.textContent = analysis.policyCompliance.score + "%";
    policyStatus.textContent = analysis.policyCompliance.passed ? "✅ Відповідає" : "❌ Не відповідає";
    policyCard.className = analysis.policyCompliance.passed ? "insight-card success" : "insight-card warning";
    
    // Detailed breakdown
    displayBreakdown(analysis, policy);
    
    // Recommendations
    displayRecommendations(analysis, password, policy);
  }

  function displayBreakdown(analysis, policy) {
    const chars = analysis.characteristics;
    passwordBreakdown.innerHTML = `
      <div class="breakdown-item">
        <span>Довжина паролю</span>
        <span class="breakdown-status ${chars.length >= policy.requirements.minLength ? 'pass' : 'fail'}">
          ${chars.length} символів
        </span>
      </div>
      <div class="breakdown-item">
        <span>Великі літери</span>
        <span class="breakdown-status ${chars.hasUppercase ? 'pass' : 'fail'}">
          ${chars.hasUppercase ? '✅' : '❌'}
        </span>
      </div>
      <div class="breakdown-item">
        <span>Малі літери</span>
        <span class="breakdown-status ${chars.hasLowercase ? 'pass' : 'fail'}">
          ${chars.hasLowercase ? '✅' : '❌'}
        </span>
      </div>
      <div class="breakdown-item">
        <span>Цифри</span>
        <span class="breakdown-status ${chars.hasNumbers ? 'pass' : 'fail'}">
          ${chars.hasNumbers ? '✅' : '❌'}
        </span>
      </div>
      <div class="breakdown-item">
        <span>Спеціальні символи</span>
        <span class="breakdown-status ${chars.hasSymbols ? 'pass' : 'fail'}">
          ${chars.hasSymbols ? '✅' : '❌'}
        </span>
      </div>
    `;
  }

  function displayRecommendations(analysis, password, policy) {
    const recommendationsList = [];
    const chars = analysis.characteristics;
    const reqs = policy.requirements;
    
    if (chars.length < reqs.minLength) {
      recommendationsList.push(`Збільште довжину до мінімум ${reqs.minLength} символів`);
    }
    
    if (reqs.requireUppercase && !chars.hasUppercase) {
      recommendationsList.push("Додайте принаймні одну велику літеру (A-Z)");
    }
    
    if (reqs.requireLowercase && !chars.hasLowercase) {
      recommendationsList.push("Додайте принаймні одну малу літеру (a-z)");
    }
    
    if (reqs.requireNumbers && !chars.hasNumbers) {
      recommendationsList.push("Додайте принаймні одну цифру (0-9)");
    }
    
    if (reqs.requireSymbols && !chars.hasSymbols) {
      recommendationsList.push("Додайте спеціальні символи (!@#$%^&*)");
    }
    
    if (analysis.score < 60) {
      recommendationsList.push("Уникайте передбачуваних послідовностей та словникових слів");
    }
    
    if (analysis.score >= 80) {
      recommendationsList.push("🎉 Відмінно! Ваш пароль має високу надійність");
    }
    
    recommendations.innerHTML = recommendationsList
      .map(rec => `<div class="recommendation-item">${rec}</div>`)
      .join('');
  }

  function getStrengthColor(score) {
    if (score < 20) return "#dc3545";
    if (score < 40) return "#fd7e14";
    if (score < 60) return "#ffc107";
    if (score < 80) return "#20c997";
    return "#28a745";
  }

  function generatePassword() {
    const length = parseInt(passwordLength.value);
    const options = {
      includeUppercase: includeUppercase.checked,
      includeLowercase: includeLowercase.checked,
      includeNumbers: includeNumbers.checked,
      includeSymbols: includeSymbols.checked,
      excludeAmbiguous: excludeAmbiguous.checked
    };
    
    const password = createPassword(length, options);
    generatedPassword.value = password;
    generatedPasswordContainer.style.display = "block";
    
    // Analyze generated password
    const selectedPolicy = securityPolicies[securityPolicySelect.value];
    const analysis = calculatePasswordStrength(password, selectedPolicy);
    
    generatedAnalysis.innerHTML = `
      <strong>Аналіз згенерованого паролю:</strong><br>
      Надійність: ${Math.round(analysis.score)}% (${getStrengthText(analysis.score)})<br>
      Ентропія: ${Math.round(analysis.entropy)} біт<br>
      Відповідність політиці: ${analysis.policyCompliance.score}%
    `;
  }

  function createPassword(length, options) {
    let charset = "";
    const ambiguous = "0O1lI";
    
    if (options.includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.includeNumbers) charset += "0123456789";
    if (options.includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguous.includes(char)).join('');
    }
    
    if (!charset) {
      charset = "abcdefghijklmnopqrstuvwxyz"; // fallback
    }
    
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  function getStrengthText(score) {
    if (score < 20) return "Дуже слабкий";
    if (score < 40) return "Слабкий";
    if (score < 60) return "Задовільний";
    if (score < 80) return "Хороший";
    return "Надійний";
  }

  function copyPassword() {
    generatedPassword.select();
    document.execCommand('copy');
    
    const originalText = copyPasswordButton.textContent;
    copyPasswordButton.textContent = "✅";
    setTimeout(() => {
      copyPasswordButton.textContent = originalText;
    }, 2000);
  }

  // Initialize
  updateLengthDisplay();
});