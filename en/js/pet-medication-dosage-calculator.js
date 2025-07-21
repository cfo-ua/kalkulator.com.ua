document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('pet-medication-form');
  const result = document.getElementById('pet-medication-result');
  const categorySelect = document.getElementById('medication-category');
  const medicationSelect = document.getElementById('specific-medication');

  // Medication database with dosing information
  const medicationDatabase = {
    'pain-inflammation': {
      'carprofen': { name: 'Carprofen (Rimadyl)', dose: '2-4 mg/kg', frequency: 'twice daily', notes: 'Give with food. Monitor for GI upset.' },
      'meloxicam': { name: 'Meloxicam (Metacam)', dose: '0.1-0.2 mg/kg', frequency: 'once daily', notes: 'Cats: lower dose. Give with food.' },
      'gabapentin': { name: 'Gabapentin', dose: '5-10 mg/kg', frequency: '2-3 times daily', notes: 'Can cause sedation initially.' },
      'tramadol': { name: 'Tramadol', dose: '2-5 mg/kg', frequency: '2-3 times daily', notes: 'Can be combined with other pain meds.' },
      'firocoxib': { name: 'Firocoxib (Previcox)', dose: '5 mg/kg', frequency: 'once daily', notes: 'Dogs only. Give with food.' }
    },
    'antibiotics': {
      'amoxicillin': { name: 'Amoxicillin', dose: '10-20 mg/kg', frequency: 'twice daily', notes: 'Can be given with or without food.' },
      'cephalexin': { name: 'Cephalexin', dose: '15-25 mg/kg', frequency: 'twice daily', notes: 'Give with food to reduce nausea.' },
      'enrofloxacin': { name: 'Enrofloxacin (Baytril)', dose: '5-10 mg/kg', frequency: 'once daily', notes: 'Not for young growing animals.' },
      'doxycycline': { name: 'Doxycycline', dose: '5-10 mg/kg', frequency: 'twice daily', notes: 'Give with food. Avoid dairy.' },
      'clindamycin': { name: 'Clindamycin', dose: '5-10 mg/kg', frequency: 'twice daily', notes: 'Can cause diarrhea. Monitor closely.' }
    },
    'parasite': {
      'ivermectin': { name: 'Ivermectin (Heartgard)', dose: '6 mcg/kg', frequency: 'monthly', notes: 'Heartworm prevention. Avoid in MDR1 mutant breeds.' },
      'fluralaner': { name: 'Fluralaner (Bravecto)', dose: '25-56 mg/kg', frequency: 'every 12 weeks', notes: 'Flea and tick prevention.' },
      'fenbendazole': { name: 'Fenbendazole', dose: '50 mg/kg', frequency: 'daily for 3 days', notes: 'Deworming. Give with food.' },
      'metronidazole': { name: 'Metronidazole', dose: '10-25 mg/kg', frequency: 'twice daily', notes: 'For Giardia and other protozoans.' },
      'pyrantel': { name: 'Pyrantel Pamoate', dose: '5-10 mg/kg', frequency: 'as directed', notes: 'Safe for puppies and kittens over 2 weeks.' }
    },
    'supplements': {
      'glucosamine': { name: 'Glucosamine', dose: '20-30 mg/kg', frequency: 'daily', notes: 'Joint support. Effects take 4-6 weeks.' },
      'fish-oil': { name: 'Fish Oil (Omega-3)', dose: '75-100 mg/kg', frequency: 'daily', notes: 'For skin, coat, and joint health.' },
      'probiotics': { name: 'Probiotics', dose: 'per label', frequency: 'daily', notes: 'Give 2 hours before/after antibiotics.' },
      'vitamin-e': { name: 'Vitamin E', dose: '5-10 IU/kg', frequency: 'daily', notes: 'Antioxidant support.' },
      'coq10': { name: 'CoQ10', dose: '1-3 mg/kg', frequency: 'daily', notes: 'Heart and energy support.' }
    },
    'otc': {
      'benadryl': { name: 'Benadryl (Diphenhydramine)', dose: '1-2 mg/kg', frequency: '2-3 times daily', notes: 'For allergies. Can cause drowsiness.' },
      'pepto-bismol': { name: 'Pepto-Bismol', dose: 'consult vet', frequency: 'as directed', notes: 'Dogs only. Never give to cats.' },
      'hydrogen-peroxide': { name: 'Hydrogen Peroxide (3%)', dose: '1-2 tsp per 10 lbs', frequency: 'once to induce vomiting', notes: 'Only if instructed by vet for recent ingestion.' }
    }
  };

  // Update medication options when category changes
  if (categorySelect && medicationSelect) {
    categorySelect.addEventListener('change', function() {
      const category = this.value;
      medicationSelect.innerHTML = '<option value="">Choose medication...</option>';
      
      if (category && medicationDatabase[category]) {
        Object.keys(medicationDatabase[category]).forEach(key => {
          const option = document.createElement('option');
          option.value = key;
          option.textContent = medicationDatabase[category][key].name;
          medicationSelect.appendChild(option);
        });
      }
    });
  }

  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateMedicationDosage();
    });
  }

  function calculateMedicationDosage() {
    // Get form values
    const petType = document.getElementById('pet-type').value;
    const petWeight = parseFloat(document.getElementById('pet-weight').value);
    const weightUnit = document.getElementById('weight-unit').value;
    const ageCategory = document.getElementById('age-category').value;
    const healthStatus = document.getElementById('health-status').value;
    const medicationCategory = document.getElementById('medication-category').value;
    const specificMedication = document.getElementById('specific-medication').value;
    const medicationStrength = document.getElementById('medication-strength').value;
    const veterinaryPrescribed = document.getElementById('veterinary-prescribed').checked;
    const firstTimeUse = document.getElementById('first-time-use').checked;
    const currentMedications = document.getElementById('current-medications').value;
    const allergies = document.getElementById('allergies').value;
    const specialConditions = document.getElementById('special-conditions').value;

    // Validate required fields
    if (!petType || !petWeight || !ageCategory || !healthStatus || !medicationCategory || !specificMedication) {
      result.innerHTML = '<div class="error">Please fill in all required fields.</div>';
      return;
    }

    // Convert weight to kg
    const weightKg = weightUnit === 'lbs' ? petWeight / 2.205 : petWeight;
    const weightLbs = weightUnit === 'kg' ? petWeight * 2.205 : petWeight;

    // Get medication info
    const medicationInfo = medicationDatabase[medicationCategory][specificMedication];
    if (!medicationInfo) {
      result.innerHTML = '<div class="error">Selected medication not found in database.</div>';
      return;
    }

    // Calculate dosage
    const dosageCalculation = calculateDosage(medicationInfo, weightKg, petType, ageCategory, healthStatus);
    
    // Safety checks
    const safetyWarnings = performSafetyChecks(petType, specificMedication, ageCategory, healthStatus, currentMedications, allergies, veterinaryPrescribed);

    // Display results
    displayResults({
      petType,
      weightKg,
      weightLbs,
      medicationInfo,
      dosageCalculation,
      safetyWarnings,
      veterinaryPrescribed,
      firstTimeUse,
      specialConditions,
      medicationStrength
    });
  }

  function calculateDosage(medicationInfo, weightKg, petType, ageCategory, healthStatus) {
    let dosage = medicationInfo.dose;
    let adjustmentFactor = 1.0;
    let notes = [medicationInfo.notes];

    // Parse dosage range (e.g., "2-4 mg/kg")
    const doseMatch = dosage.match(/(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?\s*(mg|mcg|IU)\/kg/);
    if (!doseMatch) {
      return {
        lowDose: 'Consult vet',
        highDose: 'Consult vet',
        unit: '',
        frequency: medicationInfo.frequency,
        notes: notes,
        adjustmentFactor: 1
      };
    }

    const lowDose = parseFloat(doseMatch[1]);
    const highDose = doseMatch[2] ? parseFloat(doseMatch[2]) : lowDose;
    const unit = doseMatch[3];

    // Age adjustments
    if (ageCategory === 'puppy-kitten') {
      if (['enrofloxacin', 'doxycycline'].includes(medicationInfo.name.toLowerCase())) {
        notes.push('⚠️ Use with caution in young animals - may affect developing cartilage/teeth');
        adjustmentFactor *= 0.5;
      }
    } else if (ageCategory === 'senior') {
      if (healthStatus === 'kidney' || healthStatus === 'liver') {
        adjustmentFactor *= 0.75;
        notes.push('⚠️ Reduced dose recommended for senior pets with organ dysfunction');
      }
    }

    // Health status adjustments
    if (healthStatus === 'kidney') {
      if (['carprofen', 'meloxicam', 'enrofloxacin'].some(med => medicationInfo.name.toLowerCase().includes(med))) {
        adjustmentFactor *= 0.5;
        notes.push('⚠️ Significant dose reduction needed for kidney disease');
      }
    } else if (healthStatus === 'liver') {
      if (['carprofen', 'tramadol'].some(med => medicationInfo.name.toLowerCase().includes(med))) {
        adjustmentFactor *= 0.5;
        notes.push('⚠️ Dose reduction recommended for liver disease');
      }
    }

    // Species-specific adjustments
    if (petType === 'cat') {
      if (medicationInfo.name.toLowerCase().includes('meloxicam')) {
        adjustmentFactor *= 0.5;
        notes.push('🐱 Cats require lower doses than dogs');
      }
      if (medicationInfo.name.toLowerCase().includes('acetaminophen')) {
        return {
          lowDose: 'TOXIC',
          highDose: 'NEVER GIVE',
          unit: '',
          frequency: '',
          notes: ['🚫 DANGER: Acetaminophen is TOXIC to cats!'],
          adjustmentFactor: 0
        };
      }
    }

    const calculatedLowDose = (lowDose * weightKg * adjustmentFactor).toFixed(2);
    const calculatedHighDose = (highDose * weightKg * adjustmentFactor).toFixed(2);

    return {
      lowDose: calculatedLowDose,
      highDose: calculatedHighDose,
      unit: unit,
      frequency: medicationInfo.frequency,
      notes: notes,
      adjustmentFactor: adjustmentFactor
    };
  }

  function performSafetyChecks(petType, medication, ageCategory, healthStatus, currentMedications, allergies, veterinaryPrescribed) {
    const warnings = [];

    // Critical safety warnings
    if (!veterinaryPrescribed) {
      warnings.push({
        level: 'danger',
        message: '🚨 IMPORTANT: This medication should only be given under veterinary supervision.'
      });
    }

    // Species-specific warnings
    if (petType === 'cat') {
      const catToxicMeds = ['acetaminophen', 'ibuprofen', 'aspirin'];
      if (catToxicMeds.some(med => medication.toLowerCase().includes(med))) {
        warnings.push({
          level: 'danger',
          message: '🚫 DANGER: This medication is TOXIC to cats and can be fatal!'
        });
      }
    }

    // Age warnings
    if (ageCategory === 'puppy-kitten') {
      if (['enrofloxacin', 'doxycycline'].includes(medication)) {
        warnings.push({
          level: 'warning',
          message: '⚠️ This medication can affect developing cartilage/teeth in young animals.'
        });
      }
    }

    // Health condition warnings
    if (healthStatus === 'kidney') {
      const nephrotoxicMeds = ['carprofen', 'meloxicam', 'enrofloxacin'];
      if (nephrotoxicMeds.includes(medication)) {
        warnings.push({
          level: 'warning',
          message: '⚠️ This medication can worsen kidney disease. Requires careful monitoring.'
        });
      }
    }

    // Drug interaction warnings
    if (currentMedications && currentMedications.trim()) {
      warnings.push({
        level: 'info',
        message: '💊 You reported other medications. Check with your vet for potential interactions.'
      });
    }

    // Allergy warnings
    if (allergies && allergies.trim()) {
      warnings.push({
        level: 'warning',
        message: '🔍 You reported known allergies. Ensure this medication is safe for your pet.'
      });
    }

    return warnings;
  }

  function displayResults(data) {
    if (data.safetyWarnings.some(w => w.level === 'danger')) {
      let html = `
        <div style="background: #f8d7da; border: 2px solid #dc3545; border-radius: 12px; padding: 2rem; margin-bottom: 2rem;">
          <h3 style="color: #721c24; margin-top: 0;">🚨 CRITICAL SAFETY WARNING</h3>
      `;
      
      data.safetyWarnings.filter(w => w.level === 'danger').forEach(warning => {
        html += `<p style="color: #721c24; font-weight: bold; margin: 1rem 0;">${warning.message}</p>`;
      });
      
      html += `
          <p style="color: #721c24; margin-bottom: 0;">
            <strong>DO NOT PROCEED</strong> without immediate veterinary consultation. 
            Contact your veterinarian or pet poison control hotline.
          </p>
        </div>
      `;
      
      result.innerHTML = html;
      return;
    }

    let html = `
      <div class="insight-cards">
        <div class="insight-card info">
          <h6>💊 Dosage Range</h6>
          <div class="big-number">${data.dosageCalculation.lowDose}${data.dosageCalculation.highDose !== data.dosageCalculation.lowDose ? `-${data.dosageCalculation.highDose}` : ''}</div>
          <p class="insight-detail">${data.dosageCalculation.unit} ${data.dosageCalculation.frequency}</p>
        </div>
        <div class="insight-card success">
          <h6>⚖️ Pet Weight</h6>
          <div class="big-number">${data.weightLbs.toFixed(1)}</div>
          <p class="insight-detail">lbs (${data.weightKg.toFixed(1)} kg)</p>
        </div>
        <div class="insight-card warning">
          <h6>🎯 Medication</h6>
          <div class="big-number" style="font-size: 1.2rem;">${data.medicationInfo.name.split(' ')[0]}</div>
          <p class="insight-detail">${data.petType} dosing</p>
        </div>
      </div>

      <div style="margin-top: 2rem;">
        <h3>📋 Detailed Dosing Information</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            
            <div>
              <h4>💊 Medication Details</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Name:</strong> ${data.medicationInfo.name}</li>
                <li><strong>Dosage:</strong> ${data.dosageCalculation.lowDose}${data.dosageCalculation.highDose !== data.dosageCalculation.lowDose ? `-${data.dosageCalculation.highDose}` : ''} ${data.dosageCalculation.unit}</li>
                <li><strong>Frequency:</strong> ${data.dosageCalculation.frequency}</li>
                ${data.medicationStrength ? `<li><strong>Your medication:</strong> ${data.medicationStrength}</li>` : ''}
              </ul>
            </div>

            <div>
              <h4>🐾 Pet Information</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>Type:</strong> ${data.petType.charAt(0).toUpperCase() + data.petType.slice(1)}</li>
                <li><strong>Weight:</strong> ${data.weightLbs.toFixed(1)} lbs (${data.weightKg.toFixed(1)} kg)</li>
                <li><strong>Adjustment factor:</strong> ${data.dosageCalculation.adjustmentFactor}x</li>
              </ul>
            </div>

            <div>
              <h4>⏰ Administration</h4>
              <ul style="margin: 0.5rem 0;">
                <li><strong>How often:</strong> ${data.dosageCalculation.frequency}</li>
                <li><strong>Duration:</strong> As prescribed by vet</li>
                <li><strong>With food:</strong> ${data.dosageCalculation.notes.some(n => n.includes('food')) ? 'Recommended' : 'Check label'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    // Safety warnings section
    if (data.safetyWarnings.length > 0) {
      html += `
        <div style="margin-top: 2rem;">
          <h3>⚠️ Safety Warnings & Considerations</h3>
      `;
      
      data.safetyWarnings.forEach(warning => {
        const bgColor = warning.level === 'danger' ? '#f8d7da' : 
                       warning.level === 'warning' ? '#fff3cd' : '#d1ecf1';
        const borderColor = warning.level === 'danger' ? '#dc3545' : 
                           warning.level === 'warning' ? '#ffc107' : '#bee5eb';
        const textColor = warning.level === 'danger' ? '#721c24' : 
                         warning.level === 'warning' ? '#856404' : '#0c5460';
        
        html += `
          <div style="background: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 1rem; margin: 1rem 0; border-radius: 6px;">
            <p style="margin: 0; color: ${textColor}; font-weight: 500;">${warning.message}</p>
          </div>
        `;
      });
      
      html += '</div>';
    }

    // Dosing notes
    if (data.dosageCalculation.notes.length > 0) {
      html += `
        <div style="margin-top: 2rem;">
          <h3>📝 Important Notes</h3>
          <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
            <ul style="margin: 0;">
      `;
      
      data.dosageCalculation.notes.forEach(note => {
        html += `<li style="margin: 0.5rem 0;">${note}</li>`;
      });
      
      html += `
            </ul>
          </div>
        </div>
      `;
    }

    // Practical administration guide
    html += `
      <div style="margin-top: 2rem;">
        <h3>💡 Administration Guide</h3>
        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            
            <div>
              <h4>📏 Accurate Dosing</h4>
              <ul style="margin: 0.5rem 0;">
                <li>Use dosing syringe for liquids</li>
                <li>Use pill cutter for tablets if needed</li>
                <li>Measure carefully - don't estimate</li>
                <li>Check medication concentration</li>
              </ul>
            </div>

            <div>
              <h4>⏰ Timing & Frequency</h4>
              <ul style="margin: 0.5rem 0;">
                <li>Give at same times daily</li>
                <li>Set reminders if needed</li>
                <li>Complete full course of antibiotics</li>
                <li>Don't skip doses</li>
              </ul>
            </div>

            <div>
              <h4>👀 Monitoring</h4>
              <ul style="margin: 0.5rem 0;">
                <li>Watch for side effects</li>
                <li>Monitor appetite and behavior</li>
                <li>Note any unusual symptoms</li>
                <li>Keep vet contact info handy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #e3f2fd; border-radius: 12px; border-left: 4px solid #2196f3;">
        <h4 style="margin-top: 0; color: #1565c0;">🩺 Veterinary Consultation Required</h4>
        <p style="margin: 0.5rem 0; color: #1565c0;">
          This calculator provides educational estimates only. Always consult your veterinarian before giving any medication to your pet. 
          Dosages may need to be adjusted based on your pet's specific condition, other medications, and response to treatment.
        </p>
        <p style="margin: 0.5rem 0 0 0; color: #1565c0; font-weight: 500;">
          Emergency contacts: Your veterinarian • Pet Poison Helpline: (855) 764-7661 • ASPCA Poison Control: (888) 426-4435
        </p>
      </div>
    `;

    result.innerHTML = html;
  }
});