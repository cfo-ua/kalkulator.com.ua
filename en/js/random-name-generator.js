document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('nameCategory');
    const genderSelect = document.getElementById('nameGender');
    const countInput = document.getElementById('nameCount');
    const lengthSelect = document.getElementById('nameLength');
    const includeLastNameCheckbox = document.getElementById('includeLastName');
    const generateBtn = document.getElementById('generateNames');
    const quickGenerateBtn = document.getElementById('quickGenerate');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const result = document.getElementById('result');
    const generatedNames = document.getElementById('generatedNames');
    const generationInfo = document.getElementById('generationInfo');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesList = document.getElementById('favoritesList');
    
    // Name databases
    const nameDatabase = {
        english: {
            male: {
                first: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan'],
                last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']
            },
            female: {
                first: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Kimberly', 'Deborah', 'Dorothy', 'Amy', 'Angela', 'Ashley', 'Brenda', 'Emma', 'Olivia'],
                last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']
            }
        },
        ukrainian: {
            male: {
                first: ['Oleksandr', 'Dmytro', 'Maksym', 'Andriy', 'Sergiy', 'Vitaliy', 'Volodymyr', 'Ivan', 'Yuriy', 'Mykola', 'Vasyl', 'Petro', 'Bohdan', 'Roman', 'Taras', 'Nazar', 'Yaroslav', 'Denys', 'Artem', 'Pavlo', 'Stanislav', 'Valentyn', 'Oleg', 'Igor', 'Viktor', 'Anatoliy', 'Gennadiy', 'Fedir', 'Grigoriy', 'Leonid'],
                last: ['Petrenko', 'Ivanenko', 'Kovalenko', 'Bondarenko', 'Tkachenko', 'Kravchenko', 'Shevchenko', 'Poltavsky', 'Kharkivsky', 'Lvivsky', 'Kyivsky', 'Odessky', 'Dniprovskiy', 'Zaporizky', 'Cherkaskiy', 'Vinnytsky', 'Zhytomyrsky', 'Rivnenskiy', 'Khmelnitsky', 'Ternopilsky']
            },
            female: {
                first: ['Olena', 'Maria', 'Iryna', 'Natalia', 'Svitlana', 'Tetiana', 'Anna', 'Kateryna', 'Liudmyla', 'Valentyna', 'Halyna', 'Olha', 'Yulia', 'Viktoria', 'Larysa', 'Nadiya', 'Liubov', 'Oksana', 'Inna', 'Alla', 'Taisia', 'Zoya', 'Lina', 'Yana', 'Daryna', 'Sofia', 'Alina', 'Diana', 'Polina', 'Vladyslava'],
                last: ['Petrenko', 'Ivanenko', 'Kovalenko', 'Bondarenko', 'Tkachenko', 'Kravchenko', 'Shevchenko', 'Poltavska', 'Kharkivska', 'Lvivska', 'Kyivska', 'Odeska', 'Dniprovska', 'Zaporizka', 'Cherkaska', 'Vinnytska', 'Zhytomyrska', 'Rivnenska', 'Khmelnitska', 'Ternopilska']
            }
        },
        fantasy: {
            male: {
                first: ['Aelarion', 'Draco', 'Elrond', 'Faendal', 'Galadon', 'Illidan', 'Kaleban', 'Legolas', 'Merlin', 'Narzul', 'Orpheus', 'Perseus', 'Quentin', 'Raegar', 'Silvius', 'Thorvald', 'Ulrik', 'Valarin', 'Xander', 'Zephyr'],
                last: ['Starborn', 'Fireborn', 'Frostborn', 'Shadowborn', 'Lightborn', 'Darkborn', 'Moonborn', 'Sunborn', 'Windborn', 'Earthborn', 'Waterborn', 'Goldborn', 'Silverborn', 'Copperborn', 'Ironborn', 'Steelborn', 'Diamondborn', 'Rubyborn', 'Sapphireborn', 'Emeraldborn']
            },
            female: {
                first: ['Aeliana', 'Belladonna', 'Selena', 'Diana', 'Elvira', 'Faenna', 'Galadriel', 'Isabel', 'Jasmine', 'Katarina', 'Luna', 'Merlia', 'Nicole', 'Ophelia', 'Persephone', 'Queen', 'Rowena', 'Seraphina', 'Teresa', 'Ursula'],
                last: ['Starborn', 'Fireborn', 'Frostborn', 'Shadowborn', 'Lightborn', 'Darkborn', 'Moonborn', 'Sunborn', 'Windborn', 'Earthborn', 'Waterborn', 'Goldborn', 'Silverborn', 'Copperborn', 'Ironborn', 'Steelborn', 'Diamondborn', 'Rubyborn', 'Sapphireborn', 'Emeraldborn']
            }
        },
        ancient: {
            male: {
                first: ['Alexander', 'Caesar', 'Marcus', 'Gaius', 'Lucius', 'Aurelius', 'Constantine', 'Justinian', 'Trajan', 'Augustus', 'Tiberius', 'Nero', 'Hadrian', 'Antonius', 'Claudius', 'Vespasian', 'Titus', 'Domitian', 'Septimius', 'Caracalla'],
                last: ['Magnus', 'Maximus', 'Augustus', 'Caesar', 'Romanus', 'Graecus', 'Aegyptius', 'Persicus', 'Babylonicus', 'Assyrius', 'Phoenicius', 'Carthagensis', 'Celticus', 'Germanicus', 'Scythicus', 'Sarmaticus', 'Byzantinus', 'Gothicus', 'Vandalicus', 'Hunnicus']
            },
            female: {
                first: ['Cleopatra', 'Nefertiti', 'Aphrodite', 'Artemis', 'Athena', 'Hera', 'Demeter', 'Persephone', 'Hestia', 'Diana', 'Venus', 'Minerva', 'Juno', 'Ceres', 'Vesta', 'Proserpina', 'Flora', 'Aurora', 'Luna', 'Victoria'],
                last: ['Magna', 'Maxima', 'Augusta', 'Caesaria', 'Romana', 'Graeca', 'Aegyptia', 'Persica', 'Babylonica', 'Assyria', 'Phoenicia', 'Carthagensis', 'Celtica', 'Germanica', 'Scythica', 'Sarmatica', 'Byzantina', 'Gothica', 'Vandalica', 'Hunnica']
            }
        },
        international: {
            male: {
                first: ['Ahmed', 'Mohammed', 'Hiroshi', 'Rajesh', 'Carlos', 'Antonio', 'Pierre', 'Hans', 'Lars', 'Giuseppe', 'Marco', 'Pablo', 'Diego', 'Fernando', 'Rafael', 'Miguel', 'Jorge', 'Luis', 'Jose', 'Manuel'],
                last: ['Hassan', 'Yamamoto', 'Patel', 'Garcia', 'Rodriguez', 'Dubois', 'Mueller', 'Andersson', 'Rossi', 'Lopez', 'Gonzalez', 'Martinez', 'Silva', 'Santos', 'Oliveira', 'Pereira', 'Lima', 'Costa', 'Alves', 'Ferreira']
            },
            female: {
                first: ['Fatima', 'Aisha', 'Yuki', 'Priya', 'Carmen', 'Maria', 'Sophie', 'Anna', 'Ingrid', 'Giulia', 'Valentina', 'Isabella', 'Lucia', 'Elena', 'Patricia', 'Andrea', 'Claudia', 'Monica', 'Beatriz', 'Raquel'],
                last: ['Hassan', 'Yamamoto', 'Patel', 'Garcia', 'Rodriguez', 'Dubois', 'Mueller', 'Andersson', 'Rossi', 'Lopez', 'Gonzalez', 'Martinez', 'Silva', 'Santos', 'Oliveira', 'Pereira', 'Lima', 'Costa', 'Alves', 'Ferreira']
            }
        },
        creative: {
            male: {
                first: ['Iceberg', 'Blaze', 'Cosmos', 'Drax', 'Echo', 'Flex', 'Graviton', 'Hax', 'Iron', 'Jet', 'Cyber', 'Laser', 'Maximus', 'Neon', 'Ocean', 'Phoenix', 'Quantum', 'Raven', 'Storm', 'Titan'],
                last: ['Lightning', 'Whirlwind', 'Depth', 'Smoke', 'Energy', 'Heat', 'Star', 'Frost', 'Crystal', 'Ice', 'Magma', 'Night', 'Ocean', 'Flame', 'Motion', 'Power', 'Shadow', 'Hurricane', 'Torch', 'Cold']
            },
            female: {
                first: ['Aurora', 'Bloom', 'Cassiopeia', 'Delta', 'Echoa', 'Flora', 'Galaxy', 'Harmony', 'Infinity', 'Jade', 'Cyber', 'Luna', 'Melody', 'Nova', 'Orchid', 'Phoenix', 'Queen', 'Raina', 'Stella', 'Tesla'],
                last: ['Lightning', 'Whirlwind', 'Depth', 'Smoke', 'Energy', 'Heat', 'Star', 'Frost', 'Crystal', 'Ice', 'Magma', 'Night', 'Ocean', 'Flame', 'Motion', 'Power', 'Shadow', 'Hurricane', 'Torch', 'Cold']
            }
        }
    };
    
    // Load history and favorites from localStorage
    let history = JSON.parse(localStorage.getItem('randomNameHistory_en') || '[]');
    let favorites = JSON.parse(localStorage.getItem('randomNameFavorites_en') || '[]');
    
    // Event listeners
    generateBtn.addEventListener('click', generateNames);
    quickGenerateBtn.addEventListener('click', quickGenerate);
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Initialize display
    updateHistoryDisplay();
    updateFavoritesDisplay();
    
    function generateSecureRandom() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0] / (0xFFFFFFFF + 1);
    }
    
    function getRandomElement(array) {
        return array[Math.floor(generateSecureRandom() * array.length)];
    }
    
    function filterNamesByLength(names, length) {
        if (length === 'all') return names;
        
        return names.filter(name => {
            const nameLength = name.length;
            if (length === 'short') return nameLength >= 3 && nameLength <= 5;
            if (length === 'medium') return nameLength >= 6 && nameLength <= 8;
            if (length === 'long') return nameLength >= 9;
            return true;
        });
    }
    
    function getNamePool(category, gender, length) {
        let pool = [];
        
        if (category === 'all') {
            // Combine all categories
            Object.keys(nameDatabase).forEach(cat => {
                if (gender === 'all') {
                    pool = pool.concat(nameDatabase[cat].male.first);
                    pool = pool.concat(nameDatabase[cat].female.first);
                } else {
                    pool = pool.concat(nameDatabase[cat][gender].first);
                }
            });
        } else {
            if (gender === 'all') {
                pool = pool.concat(nameDatabase[category].male.first);
                pool = pool.concat(nameDatabase[category].female.first);
            } else {
                pool = nameDatabase[category][gender].first;
            }
        }
        
        return filterNamesByLength(pool, length);
    }
    
    function getLastNamePool(category) {
        let pool = [];
        
        if (category === 'all') {
            Object.keys(nameDatabase).forEach(cat => {
                pool = pool.concat(nameDatabase[cat].male.last);
                pool = pool.concat(nameDatabase[cat].female.last);
            });
        } else {
            pool = pool.concat(nameDatabase[category].male.last);
            pool = pool.concat(nameDatabase[category].female.last);
        }
        
        // Remove duplicates
        return [...new Set(pool)];
    }
    
    function generateNames() {
        const category = categorySelect.value;
        const gender = genderSelect.value;
        const count = parseInt(countInput.value);
        const length = lengthSelect.value;
        const includeLastName = includeLastNameCheckbox.checked;
        
        if (count < 1 || count > 20) {
            alert('Number of names must be between 1 and 20');
            return;
        }
        
        const firstNamePool = getNamePool(category, gender, length);
        const lastNamePool = includeLastName ? getLastNamePool(category) : [];
        
        if (firstNamePool.length === 0) {
            alert('No names found matching the selected criteria');
            return;
        }
        
        const generatedNamesList = [];
        const usedNames = new Set();
        
        for (let i = 0; i < count; i++) {
            let fullName;
            let attempts = 0;
            
            do {
                const firstName = getRandomElement(firstNamePool);
                const lastName = includeLastName ? getRandomElement(lastNamePool) : '';
                fullName = includeLastName ? `${firstName} ${lastName}` : firstName;
                attempts++;
            } while (usedNames.has(fullName) && attempts < 50);
            
            if (!usedNames.has(fullName)) {
                usedNames.add(fullName);
                generatedNamesList.push({
                    name: fullName,
                    category: category === 'all' ? 'mixed' : getCategoryName(category),
                    gender: gender === 'all' ? 'any' : getGenderName(gender)
                });
            }
        }
        
        // Add to history
        const historyEntry = {
            names: generatedNamesList,
            timestamp: new Date().toLocaleString('en-US'),
            settings: {
                category: getCategoryName(category),
                gender: getGenderName(gender),
                count: count,
                includeLastName: includeLastName
            }
        };
        
        history.unshift(historyEntry);
        if (history.length > 100) history.pop();
        
        localStorage.setItem('randomNameHistory_en', JSON.stringify(history));
        
        displayResults(generatedNamesList, historyEntry);
        updateHistoryDisplay();
    }
    
    function getCategoryName(category) {
        const names = {
            'all': 'all categories',
            'english': 'English',
            'ukrainian': 'Ukrainian',
            'fantasy': 'fantasy',
            'ancient': 'ancient',
            'international': 'international',
            'creative': 'creative'
        };
        return names[category] || category;
    }
    
    function getGenderName(gender) {
        const names = {
            'all': 'any',
            'male': 'male',
            'female': 'female'
        };
        return names[gender] || gender;
    }
    
    function quickGenerate() {
        const presets = [
            {category: 'fantasy', gender: 'all', count: 5, includeLastName: true},
            {category: 'english', gender: 'all', count: 3, includeLastName: false},
            {category: 'ancient', gender: 'all', count: 7, includeLastName: true},
            {category: 'creative', gender: 'all', count: 4, includeLastName: false}
        ];
        
        const preset = getRandomElement(presets);
        
        categorySelect.value = preset.category;
        genderSelect.value = preset.gender;
        countInput.value = preset.count;
        includeLastNameCheckbox.checked = preset.includeLastName;
        
        generateNames();
    }
    
    function displayResults(namesList, historyEntry) {
        generatedNames.innerHTML = namesList.map((nameData, index) => `
            <div class="name-card" onclick="copyName('${nameData.name}', this)">
                <div class="name-text">${nameData.name}</div>
                <div class="name-info">${nameData.category} • ${nameData.gender}</div>
                <div class="action-buttons">
                    <button class="btn-small" onclick="event.stopPropagation(); copyName('${nameData.name}', this.parentElement.parentElement)">📋 Copy</button>
                    <button class="btn-small" onclick="event.stopPropagation(); addToFavorites('${nameData.name}', '${nameData.category}', '${nameData.gender}')">⭐ Favorite</button>
                </div>
            </div>
        `).join('');
        
        generationInfo.textContent = `Generated ${namesList.length} names (${historyEntry.settings.category}, ${historyEntry.settings.gender})`;
        
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function copyName(name, cardElement) {
        navigator.clipboard.writeText(name).then(() => {
            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = 'Copied!';
            cardElement.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 2000);
        }).catch(() => {
            alert(`Name copied: ${name}`);
        });
    }
    
    function addToFavorites(name, category, gender) {
        const favorite = { name, category, gender, timestamp: new Date().toLocaleString('en-US') };
        
        // Check if already in favorites
        if (!favorites.some(fav => fav.name === name)) {
            favorites.unshift(favorite);
            if (favorites.length > 50) favorites.pop();
            localStorage.setItem('randomNameFavorites_en', JSON.stringify(favorites));
            updateFavoritesDisplay();
            alert(`"${name}" added to favorites!`);
        } else {
            alert(`"${name}" is already in favorites!`);
        }
    }
    
    function removeFromFavorites(name) {
        favorites = favorites.filter(fav => fav.name !== name);
        localStorage.setItem('randomNameFavorites_en', JSON.stringify(favorites));
        updateFavoritesDisplay();
    }
    
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }
        
        historySection.style.display = 'block';
        
        historyList.innerHTML = history.slice(0, 10).map(entry => `
            <div class="history-item">
                <div>
                    <strong>${entry.names.map(n => n.name).join(', ')}</strong>
                    <div style="font-size: 0.9rem; color: #6b7280; margin-top: 0.25rem;">
                        ${entry.settings.category} • ${entry.settings.gender} • ${entry.settings.count} names
                    </div>
                </div>
                <div style="font-size: 0.8rem; color: #9ca3af;">
                    ${entry.timestamp}
                </div>
            </div>
        `).join('');
    }
    
    function updateFavoritesDisplay() {
        if (favorites.length === 0) {
            favoritesSection.style.display = 'none';
            return;
        }
        
        favoritesSection.style.display = 'block';
        
        favoritesList.innerHTML = favorites.map(fav => `
            <div class="favorite-item">
                <div>
                    <strong>${fav.name}</strong>
                    <div style="font-size: 0.9rem; opacity: 0.9;">
                        ${fav.category} • ${fav.gender}
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="copyName('${fav.name}', this)" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">📋</button>
                    <button onclick="removeFromFavorites('${fav.name}')" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear all history and favorite names?')) {
            history = [];
            favorites = [];
            localStorage.removeItem('randomNameHistory_en');
            localStorage.removeItem('randomNameFavorites_en');
            
            updateHistoryDisplay();
            updateFavoritesDisplay();
            
            alert('History and favorite names cleared');
        }
    }
    
    // Make functions globally available
    window.copyName = copyName;
    window.addToFavorites = addToFavorites;
    window.removeFromFavorites = removeFromFavorites;
});