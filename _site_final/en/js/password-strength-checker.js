document.addEventListener("DOMContentLoaded", function () {
  // Security policies definitions
  const securityPolicies = {
    general: {
      name: "General Web",
      requirements: {
        minLength: 8,
        requireUppercase: false,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
        maxRepeating: 3
      }
    },
    enterprise: {
      name: "Enterprise Standard",
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
      name: "Banking/Financial",
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
      name: "Healthcare (HIPAA)",
      requirements: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        maxRepeating: 2
      }
    },
    government: {
      name: "Government",
      requirements: {
        minLength: 16,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        maxRepeating: 1
      }
    },
    tech: {
      name: "Tech Industry",
      requirements: {
        minLength: 14,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        maxRepeating: 2
      }
    }
  };

  // Common weak patterns
  const weakPatterns = [
    /(.)\1{2,}/,  // Repeated characters
    /012|123|234|345|456|567|678|789|890/,  // Sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i,  // Sequential letters
    /qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm/i,  // Keyboard patterns
    /password|admin|user|login|welcome|123456|qwerty|letmein|monkey|dragon/i  // Common passwords
  ];

  // Elements
  const checkerTab = document.getElementById("checker-tab");
  const generatorTab = document.getElementById("generator-tab");
  const passwordChecker = document.getElementById("password-checker");
  const passwordGenerator = document.getElementById("password-generator");
  const passwordInput = document.getElementById("password-input");
  const toggleVisibility = document.getElementById("toggle-visibility");
  const strengthResults = document.getElementById("strength-results");
  const lengthSlider = document.getElementById("password-length-slider");
  const lengthDisplay = document.getElementById("length-display");
  const generateBtn = document.getElementById("generate-password");
  const generatedPasswordsDiv = document.getElementById("generated-passwords");

  // Tab switching
  checkerTab.addEventListener("click", () => switchTab("checker"));
  generatorTab.addEventListener("click", () => switchTab("generator"));

  function switchTab(tab) {
    if (tab === "checker") {
      checkerTab.classList.add("active");
      generatorTab.classList.remove("active");
      passwordChecker.style.display = "block";
      passwordGenerator.style.display = "none";
    } else {
      generatorTab.classList.add("active");
      checkerTab.classList.remove("active");
      passwordGenerator.style.display = "block";
      passwordChecker.style.display = "none";
    }
  }

  // Password visibility toggle
  toggleVisibility.addEventListener("click", function() {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    this.textContent = type === "password" ? "👁️" : "🙈";
  });

  // Password analysis
  passwordInput.addEventListener("input", function() {
    const password = this.value;
    if (password.length === 0) {
      strengthResults.style.display = "none";
      return;
    }
    
    analyzePassword(password);
    strengthResults.style.display = "block";
  });

  function analyzePassword(password) {
    const analysis = {
      length: password.length,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSymbols: /[^a-zA-Z0-9]/.test(password),
      lowercaseCount: (password.match(/[a-z]/g) || []).length,
      uppercaseCount: (password.match(/[A-Z]/g) || []).length,
      numbersCount: (password.match(/[0-9]/g) || []).length,
      symbolsCount: (password.match(/[^a-zA-Z0-9]/g) || []).length
    };

    // Calculate entropy
    let charSpace = 0;
    if (analysis.hasLowercase) charSpace += 26;
    if (analysis.hasUppercase) charSpace += 26;
    if (analysis.hasNumbers) charSpace += 10;
    if (analysis.hasSymbols) charSpace += 32;
    
    const entropy = password.length * Math.log2(charSpace || 1);
    
    // Calculate crack time (simplified estimation)
    const crackTime = calculateCrackTime(password, entropy);
    
    // Calculate overall strength score
    const strengthScore = calculateStrengthScore(password, analysis, entropy);
    
    // Update display
    updateStrengthDisplay(strengthScore, analysis, entropy, crackTime);
    updateCharacterAnalysis(analysis);
    updatePolicyCompliance(password, analysis);
    updateSuggestions(password, analysis, strengthScore);
  }

  function calculateStrengthScore(password, analysis, entropy) {
    let score = 0;
    
    // Length scoring (0-40 points)
    score += Math.min(40, password.length * 2);
    
    // Character diversity (0-20 points)
    let diversity = 0;
    if (analysis.hasLowercase) diversity++;
    if (analysis.hasUppercase) diversity++;
    if (analysis.hasNumbers) diversity++;
    if (analysis.hasSymbols) diversity++;
    score += diversity * 5;
    
    // Entropy bonus (0-20 points)
    score += Math.min(20, entropy / 4);
    
    // Pattern penalties
    weakPatterns.forEach(pattern => {
      if (pattern.test(password)) {
        score -= 10;
      }
    });
    
    // Common password penalty
    if (isCommonPassword(password)) {
      score -= 30;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  function calculateCrackTime(password, entropy) {
    // Simplified brute force calculation
    const combinations = Math.pow(2, entropy);
    const guessesPerSecond = 1000000; // 1M guesses per second
    const secondsToCrack = combinations / (2 * guessesPerSecond);
    
    if (secondsToCrack < 1) return "Instantly";
    if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`;
    if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000000) return `${Math.round(secondsToCrack / 31536000)} years`;
    return "Centuries";
  }

  function isCommonPassword(password) {
    const commonPasswords = [
      "password", "123456", "password123", "admin", "qwerty", "letmein",
      "welcome", "monkey", "1234567890", "abc123", "password1", "123456789"
    ];
    return commonPasswords.includes(password.toLowerCase());
  }

  function updateStrengthDisplay(score, analysis, entropy, crackTime) {
    document.getElementById("strength-score").textContent = `${Math.round(score)}%`;
    document.getElementById("password-length").textContent = `${analysis.length} characters`;
    document.getElementById("crack-time").textContent = crackTime;

    // Update entropy display
    const entropyDisplay = document.getElementById("entropy-display");
    const entropyLevel = document.getElementById("entropy-level");
    
    entropyDisplay.textContent = `${Math.round(entropy)} bits`;
    
    let entropyClass, entropyText;
    if (entropy >= 80) {
      entropyClass = "excellent";
      entropyText = "🟢 Excellent Entropy";
    } else if (entropy >= 60) {
      entropyClass = "high";
      entropyText = "🔵 High Entropy";
    } else if (entropy >= 40) {
      entropyClass = "medium";
      entropyText = "🟡 Medium Entropy";
    } else {
      entropyClass = "low";
      entropyText = "🔴 Low Entropy";
    }
    
    entropyLevel.textContent = entropyText;
    entropyLevel.className = `entropy-level ${entropyClass}`;

    const strengthCard = document.getElementById("strength-card");
    const strengthLevel = document.getElementById("strength-level");
    
    let level, className;
    if (score >= 80) {
      level = "🟢 Very Strong";
      className = "very-strong";
    } else if (score >= 60) {
      level = "🔵 Strong";
      className = "strong";
    } else if (score >= 40) {
      level = "🟡 Fair";
      className = "fair";
    } else if (score >= 20) {
      level = "🟠 Weak";
      className = "weak";
    } else {
      level = "🔴 Very Weak";
      className = "very-weak";
    }
    
    strengthLevel.textContent = level;
    strengthLevel.className = `strength-level ${className}`;
    strengthCard.className = `insight-card ${className}`;
  }

  function updateCharacterAnalysis(analysis) {
    const charTypes = [
      { id: "lowercase", count: analysis.lowercaseCount, present: analysis.hasLowercase },
      { id: "uppercase", count: analysis.uppercaseCount, present: analysis.hasUppercase },
      { id: "numbers", count: analysis.numbersCount, present: analysis.hasNumbers },
      { id: "symbols", count: analysis.symbolsCount, present: analysis.hasSymbols }
    ];

    charTypes.forEach(type => {
      const element = document.querySelector(`[data-type="${type.id}"]`);
      const countElement = document.getElementById(`${type.id}-count`);
      
      element.className = `char-type ${type.present ? 'present' : 'absent'}`;
      countElement.textContent = type.count;
    });
  }

  function updatePolicyCompliance(password, analysis) {
    const policyResults = document.getElementById("policy-results");
    
    const resultsHTML = Object.keys(securityPolicies).map(policyKey => {
      const policy = securityPolicies[policyKey];
      const compliance = checkPolicyCompliance(password, analysis, policy.requirements);
      
      return `
        <div class="policy-item ${compliance.passes ? 'pass' : 'fail'}">
          <div class="policy-name">${policy.name}</div>
          <div class="policy-status">
            <span class="policy-icon">${compliance.passes ? '✅' : '❌'}</span>
            <span>${compliance.passes ? 'Compliant' : 'Non-compliant'}</span>
          </div>
        </div>
      `;
    }).join('');
    
    policyResults.innerHTML = resultsHTML;
  }

  function checkPolicyCompliance(password, analysis, requirements) {
    const checks = [
      password.length >= requirements.minLength,
      !requirements.requireUppercase || analysis.hasUppercase,
      !requirements.requireLowercase || analysis.hasLowercase,
      !requirements.requireNumbers || analysis.hasNumbers,
      !requirements.requireSymbols || analysis.hasSymbols,
      !hasExcessiveRepeating(password, requirements.maxRepeating)
    ];
    
    return {
      passes: checks.every(check => check),
      failedChecks: checks.filter(check => !check).length
    };
  }

  function hasExcessiveRepeating(password, maxRepeating) {
    const pattern = new RegExp(`(.)\\1{${maxRepeating},}`);
    return pattern.test(password);
  }

  function updateSuggestions(password, analysis, score) {
    const suggestions = [];
    
    // Calculate entropy for suggestions
    let charSpace = 0;
    if (analysis.hasLowercase) charSpace += 26;
    if (analysis.hasUppercase) charSpace += 26;
    if (analysis.hasNumbers) charSpace += 10;
    if (analysis.hasSymbols) charSpace += 32;
    const entropy = password.length * Math.log2(charSpace || 1);
    
    // Entropy-based suggestions
    if (entropy < 40) {
      suggestions.push({
        type: "critical",
        text: `Low password entropy (${Math.round(entropy)} bits). Increase to 60+ bits for strong security by adding length and character diversity.`
      });
    } else if (entropy < 60) {
      suggestions.push({
        type: "important",
        text: `Moderate entropy (${Math.round(entropy)} bits). Aim for 60+ bits for better protection against attacks.`
      });
    }
    
    if (password.length < 12) {
      suggestions.push({
        type: "critical",
        text: "Increase password length to at least 12 characters. Each additional character exponentially increases entropy."
      });
    }
    
    if (!analysis.hasUppercase) {
      suggestions.push({
        type: "important",
        text: "Add uppercase letters (A-Z) to increase character diversity and entropy."
      });
    }
    
    if (!analysis.hasLowercase) {
      suggestions.push({
        type: "important",
        text: "Add lowercase letters (a-z) to increase character diversity and entropy."
      });
    }
    
    if (!analysis.hasNumbers) {
      suggestions.push({
        type: "important",
        text: "Add numbers (0-9) to strengthen your password and increase entropy."
      });
    }
    
    if (!analysis.hasSymbols) {
      suggestions.push({
        type: "important",
        text: "Add special symbols (!@#$%^&*) for maximum security and entropy."
      });
    }
    
    if (isCommonPassword(password)) {
      suggestions.push({
        type: "critical",
        text: "Avoid common passwords. Use a unique combination to maximize entropy and unpredictability."
      });
    }
    
    weakPatterns.forEach(pattern => {
      if (pattern.test(password)) {
        suggestions.push({
          type: "important",
          text: "Avoid predictable patterns. They reduce entropy and make passwords easier to crack."
        });
      }
    });
    
    if (suggestions.length === 0) {
      suggestions.push({
        type: "helpful",
        text: `Excellent! Your password has ${Math.round(entropy)} bits of entropy and meets security best practices.`
      });
    }
    
    const suggestionsHTML = suggestions.map(suggestion => `
      <div class="suggestion-item ${suggestion.type}">
        ${suggestion.text}
      </div>
    `).join('');
    
    document.getElementById("suggestions-list").innerHTML = suggestionsHTML;
  }

  // Password Generator
  lengthSlider.addEventListener("input", function() {
    lengthDisplay.textContent = this.value;
  });

  generateBtn.addEventListener("click", generatePasswords);

  function generatePasswords() {
    const length = parseInt(lengthSlider.value);
    const includeLowercase = document.getElementById("include-lowercase").checked;
    const includeUppercase = document.getElementById("include-uppercase").checked;
    const includeNumbers = document.getElementById("include-numbers").checked;
    const includeSymbols = document.getElementById("include-symbols").checked;
    const excludeAmbiguous = document.getElementById("exclude-ambiguous").checked;
    const targetPolicy = document.getElementById("target-policy").value;

    // Build character set
    let charset = "";
    if (includeLowercase) charset += excludeAmbiguous ? "abcdefghijkmnopqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += excludeAmbiguous ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += excludeAmbiguous ? "23456789" : "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
      alert("Please select at least one character type!");
      return;
    }

    // Generate multiple password options
    const passwords = [];
    for (let i = 0; i < 5; i++) {
      let password = "";
      for (let j = 0; j < length; j++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      
      // Ensure generated password meets target policy if specified
      const policy = securityPolicies[targetPolicy];
      if (policy && !meetsMinimumRequirements(password, policy.requirements)) {
        // Regenerate if doesn't meet requirements
        i--;
        continue;
      }
      
      passwords.push(password);
    }

    displayGeneratedPasswords(passwords);
  }

  function meetsMinimumRequirements(password, requirements) {
    const analysis = {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSymbols: /[^a-zA-Z0-9]/.test(password)
    };

    return password.length >= requirements.minLength &&
           (!requirements.requireUppercase || analysis.hasUppercase) &&
           (!requirements.requireLowercase || analysis.hasLowercase) &&
           (!requirements.requireNumbers || analysis.hasNumbers) &&
           (!requirements.requireSymbols || analysis.hasSymbols);
  }

  function displayGeneratedPasswords(passwords) {
    const passwordOptionsHTML = passwords.map((password, index) => `
      <div class="password-option">
        <div class="password-text">${password}</div>
        <button class="copy-button" onclick="copyPassword('${password}', this)">📋 Copy</button>
      </div>
    `).join('');

    document.getElementById("password-options").innerHTML = passwordOptionsHTML;
    generatedPasswordsDiv.style.display = "block";
  }

  // Make copyPassword function globally available
  window.copyPassword = function(password, button) {
    navigator.clipboard.writeText(password).then(() => {
      const originalText = button.textContent;
      button.textContent = "✅ Copied!";
      button.classList.add("copied");
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("copied");
      }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      
      button.textContent = "✅ Copied!";
      button.classList.add("copied");
      setTimeout(() => {
        button.textContent = "📋 Copy";
        button.classList.remove("copied");
      }, 2000);
    });
  };

  // Initialize
  switchTab("checker");
});