document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const nameInput = document.getElementById("name-input");
  const addNameBtn = document.getElementById("add-name");
  const participantsList = document.getElementById("participants-list");
  const selectRandomBtn = document.getElementById("select-random");
  const resetSelectionBtn = document.getElementById("reset-selection");
  const clearAllBtn = document.getElementById("clear-all");
  const selectCountSelect = document.getElementById("select-count");
  const selectionResults = document.getElementById("selection-results");
  const selectedNamesDiv = document.getElementById("selected-names");
  const selectionHistory = document.getElementById("selection-history");
  const historyList = document.getElementById("history-list");
  const clearHistoryBtn = document.getElementById("clear-history");

  // Data
  let participants = [];
  let selectedParticipants = [];
  let history = [];

  // Load saved data
  function loadData() {
    const saved = localStorage.getItem("random-selector-participants");
    if (saved) {
      participants = JSON.parse(saved);
    }
    const savedHistory = localStorage.getItem("random-selector-history");
    if (savedHistory) {
      history = JSON.parse(savedHistory);
    }
  }

  // Save data
  function saveData() {
    localStorage.setItem("random-selector-participants", JSON.stringify(participants));
    localStorage.setItem("random-selector-history", JSON.stringify(history));
  }

  // Add participant
  function addParticipant(name) {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    
    // Check for duplicates
    if (participants.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert("This name is already in the list!");
      return false;
    }
    
    participants.push({
      id: Date.now() + Math.random(),
      name: trimmedName,
      available: true
    });
    
    saveData();
    renderParticipants();
    updateControls();
    return true;
  }

  // Remove participant
  function removeParticipant(id) {
    participants = participants.filter(p => p.id !== id);
    saveData();
    renderParticipants();
    updateControls();
  }

  // Render participants
  function renderParticipants() {
    if (participants.length === 0) {
      participantsList.innerHTML = '<div class="empty-state">👥 No participants yet. Add some names to get started!</div>';
      return;
    }

    participantsList.innerHTML = participants.map(participant => `
      <div class="participant-item ${selectedParticipants.includes(participant.id) ? 'selected' : ''} ${selectedParticipants.length > 0 && !selectedParticipants.includes(participant.id) ? 'not-selected' : ''}" 
           data-id="${participant.id}">
        <span>${participant.name}</span>
        <button class="remove-participant" onclick="removeParticipant(${participant.id})">×</button>
      </div>
    `).join('');
  }

  // Update controls
  function updateControls() {
    const availableCount = participants.filter(p => p.available).length;
    selectRandomBtn.disabled = availableCount === 0;
    
    // Update select count options based on available participants
    const currentValue = parseInt(selectCountSelect.value);
    selectCountSelect.innerHTML = '';
    
    for (let i = 1; i <= Math.min(availableCount, 10); i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i === 1 ? '1 person' : `${i} people`;
      if (i === currentValue && i <= availableCount) {
        option.selected = true;
      }
      selectCountSelect.appendChild(option);
    }
    
    if (availableCount === 0) {
      const option = document.createElement('option');
      option.value = 1;
      option.textContent = '1 person';
      selectCountSelect.appendChild(option);
    }
  }

  // Select random participants
  function selectRandom() {
    const availableParticipants = participants.filter(p => p.available);
    const selectCount = Math.min(parseInt(selectCountSelect.value), availableParticipants.length);
    
    if (availableParticipants.length === 0) return;

    // Reset previous selection
    selectedParticipants = [];
    
    // Use Fisher-Yates shuffle for truly random selection
    const shuffled = [...availableParticipants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Select the required number
    const selected = shuffled.slice(0, selectCount);
    selectedParticipants = selected.map(p => p.id);
    
    // Mark as unavailable for next round
    selected.forEach(participant => {
      const p = participants.find(pp => pp.id === participant.id);
      if (p) p.available = false;
    });
    
    // Add to history
    const timestamp = new Date().toLocaleString();
    history.unshift({
      timestamp,
      selected: selected.map(p => p.name),
      count: selectCount
    });
    
    // Keep only last 20 history items
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    saveData();
    renderResults(selected);
    renderParticipants();
    renderHistory();
    updateControls();
    
    // Show controls
    selectRandomBtn.style.display = 'none';
    resetSelectionBtn.style.display = 'inline-block';
  }

  // Render results
  function renderResults(selected) {
    const names = selected.map(p => p.name);
    const displayText = names.length === 1 
      ? `🎉 ${names[0]}` 
      : `🎉 ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
    
    selectedNamesDiv.innerHTML = displayText;
    selectionResults.style.display = 'block';
  }

  // Reset selection
  function resetSelection() {
    selectedParticipants = [];
    
    // Make all participants available again
    participants.forEach(p => p.available = true);
    
    saveData();
    renderParticipants();
    updateControls();
    
    // Hide results and reset buttons
    selectionResults.style.display = 'none';
    selectRandomBtn.style.display = 'inline-block';
    resetSelectionBtn.style.display = 'none';
  }

  // Clear all participants
  function clearAll() {
    if (participants.length === 0) return;
    
    if (confirm("Are you sure you want to remove all participants?")) {
      participants = [];
      selectedParticipants = [];
      saveData();
      renderParticipants();
      updateControls();
      selectionResults.style.display = 'none';
      selectRandomBtn.style.display = 'inline-block';
      resetSelectionBtn.style.display = 'none';
    }
  }

  // Render history
  function renderHistory() {
    if (history.length === 0) {
      selectionHistory.style.display = 'none';
      return;
    }

    selectionHistory.style.display = 'block';
    historyList.innerHTML = history.map(item => `
      <div class="history-item">
        <strong>${item.timestamp}:</strong> 
        ${item.selected.join(', ')} 
        <small>(${item.count} ${item.count === 1 ? 'person' : 'people'})</small>
      </div>
    `).join('');
  }

  // Clear history
  function clearHistory() {
    if (confirm("Are you sure you want to clear the selection history?")) {
      history = [];
      localStorage.removeItem("random-selector-history");
      renderHistory();
    }
  }

  // Event listeners
  addNameBtn.addEventListener("click", function() {
    if (addParticipant(nameInput.value)) {
      nameInput.value = "";
      nameInput.focus();
    }
  });

  nameInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (addParticipant(nameInput.value)) {
        nameInput.value = "";
      }
    }
  });

  selectRandomBtn.addEventListener("click", selectRandom);
  resetSelectionBtn.addEventListener("click", resetSelection);
  clearAllBtn.addEventListener("click", clearAll);
  clearHistoryBtn.addEventListener("click", clearHistory);

  // Make removeParticipant globally available
  window.removeParticipant = removeParticipant;

  // Initialize
  loadData();
  renderParticipants();
  renderHistory();
  updateControls();
  nameInput.focus();
});