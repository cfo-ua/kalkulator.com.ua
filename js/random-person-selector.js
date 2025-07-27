document.addEventListener("DOMContentLoaded", function () {
  // Елементи
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

  // Дані
  let participants = [];
  let selectedParticipants = [];
  let history = [];

  // Завантаження збережених даних
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

  // Збереження даних
  function saveData() {
    localStorage.setItem("random-selector-participants", JSON.stringify(participants));
    localStorage.setItem("random-selector-history", JSON.stringify(history));
  }

  // Додавання учасника
  function addParticipant(name) {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    
    // Перевірка на дублікати
    if (participants.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert("Це ім'я вже є в списку!");
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

  // Видалення учасника
  function removeParticipant(id) {
    participants = participants.filter(p => p.id !== id);
    saveData();
    renderParticipants();
    updateControls();
  }

  // Відображення учасників
  function renderParticipants() {
    if (participants.length === 0) {
      participantsList.innerHTML = '<div class="empty-state">👥 Учасників поки немає. Додайте імена для початку!</div>';
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

  // Оновлення елементів управління
  function updateControls() {
    const availableCount = participants.filter(p => p.available).length;
    selectRandomBtn.disabled = availableCount === 0;
    
    // Оновлення опцій кількості вибору на основі доступних учасників
    const currentValue = parseInt(selectCountSelect.value);
    selectCountSelect.innerHTML = '';
    
    for (let i = 1; i <= Math.min(availableCount, 10); i++) {
      const option = document.createElement('option');
      option.value = i;
      if (i === 1) {
        option.textContent = '1 особу';
      } else if (i >= 2 && i <= 4) {
        option.textContent = `${i} особи`;
      } else {
        option.textContent = `${i} осіб`;
      }
      
      if (i === currentValue && i <= availableCount) {
        option.selected = true;
      }
      selectCountSelect.appendChild(option);
    }
    
    if (availableCount === 0) {
      const option = document.createElement('option');
      option.value = 1;
      option.textContent = '1 особу';
      selectCountSelect.appendChild(option);
    }
  }

  // Випадковий вибір учасників
  function selectRandom() {
    const availableParticipants = participants.filter(p => p.available);
    const selectCount = Math.min(parseInt(selectCountSelect.value), availableParticipants.length);
    
    if (availableParticipants.length === 0) return;

    // Скидання попереднього вибору
    selectedParticipants = [];
    
    // Використання алгоритму Fisher-Yates для справді випадкового вибору
    const shuffled = [...availableParticipants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Вибір необхідної кількості
    const selected = shuffled.slice(0, selectCount);
    selectedParticipants = selected.map(p => p.id);
    
    // Позначення як недоступні для наступного раунду
    selected.forEach(participant => {
      const p = participants.find(pp => pp.id === participant.id);
      if (p) p.available = false;
    });
    
    // Додавання до історії
    const timestamp = new Date().toLocaleString('uk-UA');
    history.unshift({
      timestamp,
      selected: selected.map(p => p.name),
      count: selectCount
    });
    
    // Зберігання тільки останніх 20 записів історії
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    saveData();
    renderResults(selected);
    renderParticipants();
    renderHistory();
    updateControls();
    
    // Показати елементи управління
    selectRandomBtn.style.display = 'none';
    resetSelectionBtn.style.display = 'inline-block';
  }

  // Відображення результатів
  function renderResults(selected) {
    const names = selected.map(p => p.name);
    let displayText;
    
    if (names.length === 1) {
      displayText = `🎉 ${names[0]}`;
    } else if (names.length === 2) {
      displayText = `🎉 ${names[0]} та ${names[1]}`;
    } else {
      displayText = `🎉 ${names.slice(0, -1).join(', ')} та ${names[names.length - 1]}`;
    }
    
    selectedNamesDiv.innerHTML = displayText;
    selectionResults.style.display = 'block';
  }

  // Скидання вибору
  function resetSelection() {
    selectedParticipants = [];
    
    // Зробити всіх учасників знову доступними
    participants.forEach(p => p.available = true);
    
    saveData();
    renderParticipants();
    updateControls();
    
    // Приховати результати та кнопки скидання
    selectionResults.style.display = 'none';
    selectRandomBtn.style.display = 'inline-block';
    resetSelectionBtn.style.display = 'none';
  }

  // Очищення всіх учасників
  function clearAll() {
    if (participants.length === 0) return;
    
    if (confirm("Ви впевнені, що хочете видалити всіх учасників?")) {
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

  // Відображення історії
  function renderHistory() {
    if (history.length === 0) {
      selectionHistory.style.display = 'none';
      return;
    }

    selectionHistory.style.display = 'block';
    historyList.innerHTML = history.map(item => {
      let countText;
      if (item.count === 1) {
        countText = '1 особа';
      } else if (item.count >= 2 && item.count <= 4) {
        countText = `${item.count} особи`;
      } else {
        countText = `${item.count} осіб`;
      }
      
      return `
        <div class="history-item">
          <strong>${item.timestamp}:</strong> 
          ${item.selected.join(', ')} 
          <small>(${countText})</small>
        </div>
      `;
    }).join('');
  }

  // Очищення історії
  function clearHistory() {
    if (confirm("Ви впевнені, що хочете очистити історію вибору?")) {
      history = [];
      localStorage.removeItem("random-selector-history");
      renderHistory();
    }
  }

  // Обробники подій
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

  // Зробити removeParticipant глобально доступною
  window.removeParticipant = removeParticipant;

  // Ініціалізація
  loadData();
  renderParticipants();
  renderHistory();
  updateControls();
  nameInput.focus();
});