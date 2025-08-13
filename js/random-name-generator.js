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
        ukrainian: {
            male: {
                first: ['Олександр', 'Дмитро', 'Максим', 'Андрій', 'Сергій', 'Віталій', 'Володимир', 'Іван', 'Юрій', 'Микола', 'Василь', 'Петро', 'Богдан', 'Роман', 'Тарас', 'Назар', 'Ярослав', 'Денис', 'Артем', 'Павло', 'Станіслав', 'Валентин', 'Олег', 'Ігор', 'Віктор', 'Анатолій', 'Геннадій', 'Федір', 'Григорій', 'Леонід'],
                last: ['Петренко', 'Іваненко', 'Коваленко', 'Бондаренко', 'Ткаченко', 'Кравченко', 'Шевченко', 'Полтавський', 'Харківський', 'Львівський', 'Київський', 'Одеський', 'Дніпровський', 'Запорізький', 'Черкаський', 'Вінницький', 'Житомирський', 'Рівненський', 'Хмельницький', 'Тернопільський']
            },
            female: {
                first: ['Олена', 'Марія', 'Ірина', 'Наталія', 'Світлана', 'Тетяна', 'Анна', 'Катерина', 'Людмила', 'Валентина', 'Галина', 'Ольга', 'Юлія', 'Вікторія', 'Лариса', 'Надія', 'Любов', 'Оксана', 'Інна', 'Алла', 'Таїса', 'Зоя', 'Ліна', 'Яна', 'Дарина', 'Софія', 'Аліна', 'Діана', 'Поліна', 'Владислава'],
                last: ['Петренко', 'Іваненко', 'Коваленко', 'Бондаренко', 'Ткаченко', 'Кравченко', 'Шевченко', 'Полтавська', 'Харківська', 'Львівська', 'Київська', 'Одеська', 'Дніпровська', 'Запорізька', 'Черкаська', 'Вінницька', 'Житомирська', 'Рівненська', 'Хмельницька', 'Тернопільська']
            }
        },
        english: {
            male: {
                first: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan'],
                last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']
            },
            female: {
                first: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen'],
                last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']
            }
        },
        fantasy: {
            male: {
                first: ['Аеларіон', 'Дракон', 'Елронд', 'Фаендаль', 'Галадон', 'Іллідан', 'Калібан', 'Леголас', 'Мерлін', 'Нарзул', 'Орфей', 'Персей', 'Квентін', 'Раегар', 'Сільвіус', 'Торвальд', 'Ульрік', 'Валарін', 'Ксандер', 'Зефір'],
                last: ['Зоряний', 'Вогняний', 'Крижаний', 'Тіньовий', 'Світлий', 'Темний', 'Місячний', 'Сонячний', 'Вітряний', 'Земляний', 'Водяний', 'Золотий', 'Срібний', 'Мідний', 'Залізний', 'Сталевий', 'Алмазний', 'Рубіновий', 'Сапфіровий', 'Смарагдовий']
            },
            female: {
                first: ['Аеліана', 'Белладонна', 'Селена', 'Діана', 'Ельвіра', 'Фаенна', 'Галадрієль', 'Ісабель', 'Жасмін', 'Катаріна', 'Луна', 'Мерлія', 'Ніколь', 'Офелія', 'Персефона', 'Квін', 'Ровена', 'Серафіна', 'Тереза', 'Урсула'],
                last: ['Зоряна', 'Вогняна', 'Крижана', 'Тіньова', 'Світла', 'Темна', 'Місячна', 'Сонячна', 'Вітряна', 'Земляна', 'Водяна', 'Золота', 'Срібна', 'Мідна', 'Залізна', 'Сталева', 'Алмазна', 'Рубінова', 'Сапфірова', 'Смарагдова']
            }
        },
        ancient: {
            male: {
                first: ['Олександр', 'Цезар', 'Марк', 'Гай', 'Луцій', 'Авреліус', 'Константин', 'Юстиніан', 'Траян', 'Август', 'Тиберій', 'Нерон', 'Адріан', 'Антоній', 'Клавдій', 'Веспасіан', 'Тит', 'Доміціан', 'Септимій', 'Каракалла'],
                last: ['Македонський', 'Великий', 'Августський', 'Цезарський', 'Римський', 'Грецький', 'Єгипетський', 'Перський', 'Вавилонський', 'Ассирійський', 'Фінікійський', 'Карфагенський', 'Кельтський', 'Германський', 'Скіфський', 'Сарматський', 'Візантійський', 'Готський', 'Вандальський', 'Гунський']
            },
            female: {
                first: ['Клеопатра', 'Нефертіті', 'Афродіта', 'Артеміда', 'Афіна', 'Гера', 'Деметра', 'Персефона', 'Гестія', 'Діана', 'Венера', 'Мінерва', 'Юнона', 'Церера', 'Веста', 'Прозерпіна', 'Флора', 'Аврора', 'Луна', 'Віктория'],
                last: ['Македонська', 'Велика', 'Августська', 'Цезарська', 'Римська', 'Грецька', 'Єгипетська', 'Перська', 'Вавилонська', 'Ассирійська', 'Фінікійська', 'Карфагенська', 'Кельтська', 'Германська', 'Скіфська', 'Сарматська', 'Візантійська', 'Готська', 'Вандальська', 'Гунська']
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
                first: ['Айсберг', 'Блейз', 'Космос', 'Дракс', 'Ехо', 'Флекс', 'Гравітон', 'Хакс', 'Айрон', 'Джет', 'Кібер', 'Лазер', 'Максімус', 'Неон', 'Океан', 'Фенікс', 'Квантум', 'Рейвен', 'Сторм', 'Титан'],
                last: ['Блискавка', 'Вихор', 'Глибина', 'Дим', 'Енергія', 'Жар', 'Зір', 'Іній', 'Кристал', 'Лід', 'Магма', 'Ніч', 'Океан', 'Полум\'я', 'Рух', 'Сила', 'Тінь', 'Ураган', 'Факел', 'Холод']
            },
            female: {
                first: ['Авора', 'Блума', 'Кассіопея', 'Дельта', 'Ехоа', 'Флора', 'Галаксі', 'Хармонія', 'Інфінеті', 'Джейд', 'Кібер', 'Луна', 'Мелодія', 'Нова', 'Орхідея', 'Фенікс', 'Квін', 'Райна', 'Стелла', 'Тесла'],
                last: ['Блискавка', 'Вихор', 'Глибина', 'Дим', 'Енергія', 'Жар', 'Зір', 'Іній', 'Кристал', 'Лід', 'Магма', 'Ніч', 'Океан', 'Полум\'я', 'Рух', 'Сила', 'Тінь', 'Ураган', 'Факел', 'Холод']
            }
        }
    };
    
    // Load history and favorites from localStorage
    let history = JSON.parse(localStorage.getItem('randomNameHistory_ua') || '[]');
    let favorites = JSON.parse(localStorage.getItem('randomNameFavorites_ua') || '[]');
    
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
            alert('Кількість імен повинна бути від 1 до 20');
            return;
        }
        
        const firstNamePool = getNamePool(category, gender, length);
        const lastNamePool = includeLastName ? getLastNamePool(category) : [];
        
        if (firstNamePool.length === 0) {
            alert('Не знайдено імен за вибраними критеріями');
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
                    category: category === 'all' ? 'змішана' : getCategoryName(category),
                    gender: gender === 'all' ? 'будь-яка' : getGenderName(gender)
                });
            }
        }
        
        // Add to history
        const historyEntry = {
            names: generatedNamesList,
            timestamp: new Date().toLocaleString('uk-UA'),
            settings: {
                category: getCategoryName(category),
                gender: getGenderName(gender),
                count: count,
                includeLastName: includeLastName
            }
        };
        
        history.unshift(historyEntry);
        if (history.length > 100) history.pop();
        
        localStorage.setItem('randomNameHistory_ua', JSON.stringify(history));
        
        displayResults(generatedNamesList, historyEntry);
        updateHistoryDisplay();
    }
    
    function getCategoryName(category) {
        const names = {
            'all': 'всі категорії',
            'ukrainian': 'українські',
            'english': 'англійські',
            'fantasy': 'фентезі',
            'ancient': 'давні',
            'international': 'міжнародні',
            'creative': 'креативні'
        };
        return names[category] || category;
    }
    
    function getGenderName(gender) {
        const names = {
            'all': 'будь-яка',
            'male': 'чоловічі',
            'female': 'жіночі'
        };
        return names[gender] || gender;
    }
    
    function quickGenerate() {
        const presets = [
            {category: 'fantasy', gender: 'all', count: 5, includeLastName: true},
            {category: 'ukrainian', gender: 'all', count: 3, includeLastName: false},
            {category: 'english', gender: 'all', count: 7, includeLastName: true},
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
                    <button class="btn-small" onclick="event.stopPropagation(); copyName('${nameData.name}', this.parentElement.parentElement)">📋 Копіювати</button>
                    <button class="btn-small" onclick="event.stopPropagation(); addToFavorites('${nameData.name}', '${nameData.category}', '${nameData.gender}')">⭐ В улюблені</button>
                </div>
            </div>
        `).join('');
        
        generationInfo.textContent = `Згенеровано ${namesList.length} імен (${historyEntry.settings.category}, ${historyEntry.settings.gender})`;
        
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function copyName(name, cardElement) {
        navigator.clipboard.writeText(name).then(() => {
            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = 'Скопійовано!';
            cardElement.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 2000);
        }).catch(() => {
            alert(`Ім'я скопійовано: ${name}`);
        });
    }
    
    function addToFavorites(name, category, gender) {
        const favorite = { name, category, gender, timestamp: new Date().toLocaleString('uk-UA') };
        
        // Check if already in favorites
        if (!favorites.some(fav => fav.name === name)) {
            favorites.unshift(favorite);
            if (favorites.length > 50) favorites.pop();
            localStorage.setItem('randomNameFavorites_ua', JSON.stringify(favorites));
            updateFavoritesDisplay();
            alert(`"${name}" додано в улюблені!`);
        } else {
            alert(`"${name}" вже в улюблених!`);
        }
    }
    
    function removeFromFavorites(name) {
        favorites = favorites.filter(fav => fav.name !== name);
        localStorage.setItem('randomNameFavorites_ua', JSON.stringify(favorites));
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
                        ${entry.settings.category} • ${entry.settings.gender} • ${entry.settings.count} імен
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
        if (confirm('Ви впевнені, що хочете очистити всю історію та улюблені імена?')) {
            history = [];
            favorites = [];
            localStorage.removeItem('randomNameHistory_ua');
            localStorage.removeItem('randomNameFavorites_ua');
            
            updateHistoryDisplay();
            updateFavoritesDisplay();
            
            alert('Історія та улюблені імена очищені');
        }
    }
    
    // Make functions globally available
    window.copyName = copyName;
    window.addToFavorites = addToFavorites;
    window.removeFromFavorites = removeFromFavorites;
});