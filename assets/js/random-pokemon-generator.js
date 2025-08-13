document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const generationSelect = document.getElementById('pokemonGeneration');
    const rarityCheckboxes = document.querySelectorAll('.rarity-option input[type="checkbox"]');
    const pokemonCard = document.getElementById('pokemonCard');
    const pokemonImage = document.getElementById('pokemonImage');
    const pokemonName = document.getElementById('pokemonName');
    const pokemonDetails = document.getElementById('pokemonDetails');
    const totalGenerated = document.getElementById('totalGenerated');
    const uniquePokemon = document.getElementById('uniquePokemon');
    const favoriteGeneration = document.getElementById('favoriteGeneration');
    const typeGrid = document.getElementById('typeGrid');
    const resetStats = document.getElementById('resetStats');
    const historyList = document.getElementById('historyList');
    const clearHistory = document.getElementById('clearHistory');
    
    // Pokemon database
    const pokemonDatabase = {
        1: [
            { name: "Пікачу", image: "⚡", types: ["electric"], rarity: "common", hp: 35, attack: 55, defense: 40, fact: "Найвідоміший покемон у світі, маскот франшизи Pokémon." },
            { name: "Чарізард", image: "🔥", types: ["fire", "flying"], rarity: "starter", hp: 78, attack: 84, defense: 78, fact: "Еволюція Чармандера, може літати на висоті до 1400 метрів." },
            { name: "Бластойз", image: "🌊", types: ["water"], rarity: "starter", hp: 79, attack: 83, defense: 100, fact: "Його водяні гармати можуть пробити товсту сталь." },
            { name: "Венузавр", image: "🌿", types: ["grass", "poison"], rarity: "starter", hp: 80, attack: 82, defense: 83, fact: "Квітка на спині випускає заспокійливий аромат." },
            { name: "Міу", image: "💫", types: ["psychic"], rarity: "mythical", hp: 100, attack: 100, defense: 100, fact: "Містить ДНК всіх покемонів та може вивчити будь-яку атаку." },
            { name: "Міутво", image: "🧠", types: ["psychic"], rarity: "legendary", hp: 106, attack: 110, defense: 90, fact: "Створений генетично як найсильніший покемон." },
            { name: "Сноурлакс", image: "😴", types: ["normal"], rarity: "common", hp: 160, attack: 110, defense: 65, fact: "Спить 20 годин на день та важить понад 400 кг." },
            { name: "Псайдак", image: "🦆", types: ["water"], rarity: "common", hp: 50, attack: 52, defense: 48, fact: "Постійно страждає від головного болю." },
            { name: "Мачамп", image: "💪", types: ["fighting"], rarity: "common", hp: 90, attack: 130, defense: 80, fact: "Може нанести 1000 ударів за 2 секунди." },
            { name: "Генгар", image: "👻", types: ["ghost", "poison"], rarity: "common", hp: 60, attack: 65, defense: 60, fact: "Ховається в тінях та знижує температуру на 10 градусів." }
        ],
        2: [
            { name: "Лугія", image: "🌪️", types: ["psychic", "flying"], rarity: "legendary", hp: 106, attack: 90, defense: 130, fact: "Може заспокоїти бурхливі моря рухом крил." },
            { name: "Хо-Ох", image: "🔥", types: ["fire", "flying"], rarity: "legendary", hp: 106, attack: 130, defense: 90, fact: "Його пір'я сяють усіма кольорами веселки." },
            { name: "Селебі", image: "🧚", types: ["psychic", "grass"], rarity: "mythical", hp: 100, attack: 100, defense: 100, fact: "Може подорожувати в часі через ліси." },
            { name: "Тайфлозіон", image: "🔥", types: ["fire"], rarity: "starter", hp: 78, attack: 84, defense: 78, fact: "Створює спалахи за допомогою інтенсивного тепла." },
            { name: "Феррагатр", image: "🐊", types: ["water"], rarity: "starter", hp: 85, attack: 105, defense: 100, fact: "Його щелепи настільки потужні, що можуть розкрошити все." },
            { name: "Мегануйм", image: "🌺", types: ["grass"], rarity: "starter", hp: 80, attack: 82, defense: 100, fact: "Аромат його квітки заспокоює емоції." },
            { name: "Скізор", image: "✂️", types: ["bug", "steel"], rarity: "common", hp: 70, attack: 130, defense: 100, fact: "Його кліщі твердіші за алмази." },
            { name: "Амфарос", image: "💡", types: ["electric"], rarity: "common", hp: 90, attack: 75, defense: 85, fact: "Світло з хвоста видно з космосу." },
            { name: "Умбреон", image: "🌙", types: ["dark"], rarity: "common", hp: 95, attack: 65, defense: 110, fact: "Еволюція Іві під впливом місячного світла." },
            { name: "Еспеон", image: "☀️", types: ["psychic"], rarity: "common", hp: 65, attack: 65, defense: 60, fact: "Еволюція Іві під впливом сонячного світла." }
        ],
        3: [
            { name: "Рейквазьа", image: "🐉", types: ["dragon", "flying"], rarity: "legendary", hp: 105, attack: 150, defense: 90, fact: "Живе в озоновому шарі та їсть метеорити." },
            { name: "Кьогре", image: "🌊", types: ["water"], rarity: "legendary", hp: 100, attack: 100, defense: 90, fact: "Має силу розширювати океани дощами." },
            { name: "Граудон", image: "🌋", types: ["ground"], rarity: "legendary", hp: 100, attack: 150, defense: 140, fact: "Може розширювати континенти лавою." },
            { name: "Джирачі", image: "⭐", types: ["steel", "psychic"], rarity: "mythical", hp: 100, attack: 100, defense: 100, fact: "Прокидається лише раз на 1000 років та виконує бажання." },
            { name: "Блейзикен", image: "🔥", types: ["fire", "fighting"], rarity: "starter", hp: 80, attack: 120, defense: 70, fact: "Може стрибати через 30-поверхові будівлі." },
            { name: "Свампт", image: "💧", types: ["water", "ground"], rarity: "starter", hp: 100, attack: 110, defense: 90, fact: "Може передбачати бурі за змінами вітру." },
            { name: "Септайл", image: "🦎", types: ["grass"], rarity: "starter", hp: 70, attack: 85, defense: 65, fact: "Насіння на спині містить поживні речовини для рослин." },
            { name: "Агрон", image: "🛡️", types: ["steel", "rock"], rarity: "common", hp: 70, attack: 110, defense: 180, fact: "Його броня може відбити будь-яку атаку." },
            { name: "Сабльай", image: "⚔️", types: ["dark", "ghost"], rarity: "common", hp: 50, attack: 90, defense: 60, fact: "Його руки-лези гостріші за будь-який меч." },
            { name: "Міломин", image: "💖", types: ["psychic"], rarity: "common", hp: 28, attack: 25, defense: 25, fact: "Найщасливіший покемон, що дарує радість." }
        ],
        4: [
            { name: "Діалга", image: "⏰", types: ["steel", "dragon"], rarity: "legendary", hp: 100, attack: 120, defense: 120, fact: "Має владу над часом та може його контролювати." },
            { name: "Палкія", image: "🌌", types: ["water", "dragon"], rarity: "legendary", hp: 90, attack: 120, defense: 100, fact: "Має владу над простором та може його викривляти." },
            { name: "Гіратіна", image: "👁️", types: ["ghost", "dragon"], rarity: "legendary", hp: 150, attack: 100, defense: 120, fact: "Правитель Спотвореного Світу." },
            { name: "Аркеус", image: "🌟", types: ["normal"], rarity: "mythical", hp: 120, attack: 120, defense: 120, fact: "Створив всесвіт Pokémon та вважається богом." },
            { name: "Інфернейп", image: "🔥", types: ["fire", "fighting"], rarity: "starter", hp: 76, attack: 104, defense: 71, fact: "Полум'я на голові ніколи не згасає." },
            { name: "Ем'полеон", image: "👑", types: ["water", "steel"], rarity: "starter", hp: 84, attack: 86, defense: 88, fact: "Гордий як імператор, ніколи не склоняє голову." },
            { name: "Тортера", image: "🌍", types: ["grass", "ground"], rarity: "starter", hp: 95, attack: 109, defense: 105, fact: "На панцирі росте невелике дерево." },
            { name: "Гарчомп", image: "🦈", types: ["dragon", "ground"], rarity: "common", hp: 108, attack: 130, defense: 95, fact: "Може літати зі швидкістю реактивного літака." },
            { name: "Лукаріо", image: "🥋", types: ["fighting", "steel"], rarity: "common", hp: 70, attack: 110, defense: 70, fact: "Може відчувати ауру всіх живих істот." },
            { name: "Дарқрай", image: "🌑", types: ["dark"], rarity: "mythical", hp: 70, attack: 90, defense: 90, fact: "Викликає кошмари для захисту свого життя." }
        ],
        5: [
            { name: "Решірам", image: "⚪", types: ["dragon", "fire"], rarity: "legendary", hp: 100, attack: 120, defense: 100, fact: "Покемон істини, що може спалити світ полум'ям." },
            { name: "Зекром", image: "⚫", types: ["dragon", "electric"], rarity: "legendary", hp: 100, attack: 150, defense: 120, fact: "Покемон ідеалів, що може знищити світ блискавками." },
            { name: "Кьюрем", image: "❄️", types: ["dragon", "ice"], rarity: "legendary", hp: 125, attack: 130, defense: 90, fact: "Залишкова оболонка після поділу дракона." },
            { name: "Серперіор", image: "🐍", types: ["grass"], rarity: "starter", hp: 75, attack: 75, defense: 95, fact: "Дивиться зверхньо на всіх, хто слабший за нього." },
            { name: "Ембоар", image: "🔥", types: ["fire", "fighting"], rarity: "starter", hp: 110, attack: 123, defense: 65, fact: "Має бороду з полум'я та дуже швидкий." },
            { name: "Самурот", image: "⚔️", types: ["water"], rarity: "starter", hp: 95, attack: 100, defense: 85, fact: "Бореться мечами на ногах у власному стилі." },
            { name: "Вікавалт", image: "⚡", types: ["bug", "electric"], rarity: "common", hp: 77, attack: 70, defense: 60, fact: "Найшвидший покемон серед комах." },
            { name: "Чандлур", image: "🕯️", types: ["ghost", "fire"], rarity: "common", hp: 60, attack: 55, defense: 90, fact: "Його полум'я живиться життєвою енергією." },
            { name: "Хаксорус", image: "🪓", types: ["dragon"], rarity: "common", hp: 76, attack: 147, defense: 90, fact: "Його ікла можуть розрізати сталь." },
            { name: "Голурк", image: "👤", types: ["ground", "ghost"], rarity: "common", hp: 89, attack: 124, defense: 80, fact: "Стародавній робот, створений для захисту." }
        ],
        6: [
            { name: "Ів'льтал", image: "🦅", types: ["dark", "flying"], rarity: "legendary", hp: 126, attack: 131, defense: 95, fact: "Коли помирає, поглинає життєву силу всього живого." },
            { name: "Зернеас", image: "🦌", types: ["fairy"], rarity: "legendary", hp: 126, attack: 131, defense: 95, fact: "Може даровати вічне життя своїми рогами." },
            { name: "Зігард", image: "🐍", types: ["dragon", "ground"], rarity: "legendary", hp: 108, attack: 100, defense: 121, fact: "Захисник екосистеми та порядку в природі." },
            { name: "Гренінжа", image: "🥷", types: ["water", "dark"], rarity: "starter", hp: 72, attack: 95, defense: 67, fact: "Рухається як ніндзя та створює сюрікени з води." },
            { name: "Дельфокс", image: "🔥", types: ["fire", "psychic"], rarity: "starter", hp: 75, attack: 69, defense: 72, fact: "Може передбачити майбутнє, дивлячись у полум'я." },
            { name: "Честнот", image: "🦔", types: ["grass", "fighting"], rarity: "starter", hp: 88, attack: 107, defense: 122, fact: "Його панцир може витримати вибух бомби." },
            { name: "Тайлон", image: "🦅", types: ["normal", "flying"], rarity: "common", hp: 78, attack: 81, defense: 71, fact: "Має неймовірно гострий зір для полювання." },
            { name: "Гудра", image: "🐲", types: ["dragon"], rarity: "common", hp: 90, attack: 100, defense: 70, fact: "Найдружелюбніший з усіх драконів." },
            { name: "Сільвеон", image: "🎀", types: ["fairy"], rarity: "common", hp: 95, attack: 65, defense: 65, fact: "Використовує стрічки для заспокоєння ворогів." },
            { name: "Кангасхан", image: "🦘", types: ["normal"], rarity: "common", hp: 105, attack: 95, defense: 80, fact: "Мега-еволюція дозволяє малюку битися разом з мамою." }
        ],
        7: [
            { name: "Солгалео", image: "☀️", types: ["psychic", "steel"], rarity: "legendary", hp: 137, attack: 137, defense: 107, fact: "Є втіленням сонця та може поглинати світло." },
            { name: "Лунала", image: "🌙", types: ["psychic", "ghost"], rarity: "legendary", hp: 137, attack: 113, defense: 89, fact: "Є втіленням місяця та може створювати темряву." },
            { name: "Некрозма", image: "🔶", types: ["psychic"], rarity: "legendary", hp: 97, attack: 107, defense: 101, fact: "Поглинає світло як джерело енергії." },
            { name: "Дісідьюай", image: "🏹", types: ["grass", "ghost"], rarity: "starter", hp: 78, attack: 107, defense: 75, fact: "Може стріляти стрілами з перів зі швидкістю звуку." },
            { name: "Інсінерор", image: "🔥", types: ["fire", "dark"], rarity: "starter", hp: 95, attack: 115, defense: 90, fact: "Любить бити нижче пояса та використовує хитрощі." },
            { name: "Прімарина", image: "🧜", types: ["water", "fairy"], rarity: "starter", hp: 80, attack: 74, defense: 74, fact: "Контролює водяні кулі своїм співом." },
            { name: "Лікарок", image: "🐺", types: ["rock"], rarity: "common", hp: 75, attack: 115, defense: 65, fact: "Швидший за бліскавку та дуже гордий." },
            { name: "Токсапекс", image: "☠️", types: ["poison", "water"], rarity: "common", hp: 50, attack: 63, defense: 152, fact: "Один з найотруйніших покемонів." },
            { name: "Міміку", image: "👻", types: ["ghost", "fairy"], rarity: "common", hp: 55, attack: 90, defense: 80, fact: "Ховається під ганчіркою, щоб не бути самотнім." },
            { name: "Драгон", image: "🐉", types: ["dragon", "fighting"], rarity: "common", hp: 55, attack: 120, defense: 78, fact: "Тренується битися з найсильнішими противниками." }
        ],
        8: [
            { name: "Зацін", image: "⚔️", types: ["fairy", "steel"], rarity: "legendary", hp: 92, attack: 130, defense: 115, fact: "Тримає в зубах метал, який передається поколіннями." },
            { name: "Замазента", image: "🛡️", types: ["fighting", "steel"], rarity: "legendary", hp: 92, attack: 130, defense: 115, fact: "Його тіло твердіше за будь-який метал." },
            { name: "Етернатус", image: "☠️", types: ["poison", "dragon"], rarity: "legendary", hp: 140, attack: 85, defense: 95, fact: "Прибув з метеоритом 20,000 років тому." },
            { name: "Рілебум", image: "🥁", types: ["grass"], rarity: "starter", hp: 100, attack: 125, defense: 90, fact: "Атакує корінням, що діють як барабанні палички." },
            { name: "Сіндерейс", image: "🔥", types: ["fire"], rarity: "starter", hp: 80, attack: 116, defense: 75, fact: "Може бігти зі швидкістю 120 км/год." },
            { name: "Інтелеон", image: "🔫", types: ["water"], rarity: "starter", hp: 70, attack: 85, defense: 65, fact: "Може влучити в мішень на відстані 3 км." },
            { name: "Корвінайт", image: "🖤", types: ["flying", "steel"], rarity: "common", hp: 98, attack: 87, defense: 105, fact: "Найрозумніший серед всіх літаючих покемонів." },
            { name: "Токстрісіті", image: "🎸", types: ["electric", "poison"], rarity: "common", hp: 75, attack: 98, defense: 70, fact: "Може генерувати електрику через отруйні хімікати." },
            { name: "Хатерен", image: "🧙", types: ["psychic"], rarity: "common", hp: 57, attack: 90, defense: 95, fact: "Може відчувати емоції на відстані 10 км." },
            { name: "Грімснарл", image: "👹", types: ["dark", "fairy"], rarity: "common", hp: 95, attack: 120, defense: 65, fact: "Використовує волосся як руки для атак." }
        ]
    };
    
    // Load statistics and history from localStorage
    let stats = {
        total: parseInt(localStorage.getItem('pokemonStats_total_ua') || '0'),
        unique: JSON.parse(localStorage.getItem('pokemonStats_unique_ua') || '[]'),
        generations: JSON.parse(localStorage.getItem('pokemonStats_generations_ua') || '{}'),
        types: JSON.parse(localStorage.getItem('pokemonStats_types_ua') || '{}')
    };
    
    let history = JSON.parse(localStorage.getItem('pokemonHistory_ua') || '[]');
    
    updateStatsDisplay();
    updateHistoryDisplay();
    updateTypeStats();
    
    generateBtn.addEventListener('click', generatePokemon);
    resetStats.addEventListener('click', resetStatistics);
    clearHistory.addEventListener('click', clearHistoryData);
    
    function generatePokemon() {
        const selectedGeneration = generationSelect.value;
        const selectedRarities = Array.from(rarityCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        if (selectedRarities.length === 0) {
            alert('Будь ласка, оберіть принаймні один тип рідкісності');
            return;
        }
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Шукаю покемона...</span>';
        
        // Add loading animation
        pokemonCard.style.transform = 'scale(0.95)';
        pokemonImage.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            let availablePokemon = [];
            
            if (selectedGeneration === 'all') {
                // Combine all generations
                Object.values(pokemonDatabase).forEach(generation => {
                    availablePokemon = availablePokemon.concat(generation);
                });
            } else {
                availablePokemon = pokemonDatabase[selectedGeneration] || [];
            }
            
            // Filter by selected rarities
            availablePokemon = availablePokemon.filter(pokemon => 
                selectedRarities.includes(pokemon.rarity)
            );
            
            if (availablePokemon.length === 0) {
                alert('Немає покемонів для обраних критеріїв');
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<span class="button-icon">⚡</span><span class="button-text">Згенерувати покемона</span>';
                return;
            }
            
            // Generate random pokemon
            const randomPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
            const generation = selectedGeneration === 'all' ? 
                findPokemonGeneration(randomPokemon.name) : parseInt(selectedGeneration);
            
            // Update display
            pokemonImage.textContent = randomPokemon.image;
            pokemonName.textContent = randomPokemon.name;
            
            const typeBadges = randomPokemon.types.map(type => 
                `<span class="type-badge type-${type}">${getTypeDisplayName(type)}</span>`
            ).join(' ');
            
            pokemonDetails.innerHTML = `
                <h4>🏷️ Типи:</h4>
                <p>${typeBadges}</p>
                <h4>⭐ Рідкісність:</h4>
                <p><span class="rarity-badge rarity-${randomPokemon.rarity}">${getRarityDisplayName(randomPokemon.rarity)}</span></p>
                <h4>📊 Характеристики:</h4>
                <p><strong>HP:</strong> ${randomPokemon.hp} | <strong>Атака:</strong> ${randomPokemon.attack} | <strong>Захист:</strong> ${randomPokemon.defense}</p>
                <h4>🌟 Покоління:</h4>
                <p>${generation} (${getGenerationDisplayName(generation)})</p>
                <h4>💡 Цікавий факт:</h4>
                <p>${randomPokemon.fact}</p>
            `;
            
            // Update card styling based on first type
            pokemonCard.className = `pokemon-card ${randomPokemon.types[0]}`;
            
            // Update statistics
            stats.total++;
            if (!stats.unique.includes(randomPokemon.name)) {
                stats.unique.push(randomPokemon.name);
            }
            if (!stats.generations[generation]) {
                stats.generations[generation] = 0;
            }
            stats.generations[generation]++;
            
            randomPokemon.types.forEach(type => {
                if (!stats.types[type]) {
                    stats.types[type] = 0;
                }
                stats.types[type]++;
            });
            
            // Add to history
            const historyItem = {
                ...randomPokemon,
                generation: generation,
                timestamp: new Date().toLocaleString('uk-UA')
            };
            history.unshift(historyItem);
            if (history.length > 50) {
                history = history.slice(0, 50); // Keep only last 50
            }
            
            saveData();
            updateStatsDisplay();
            updateHistoryDisplay();
            updateTypeStats();
            
            // Restore animations
            pokemonCard.style.transform = 'scale(1)';
            pokemonImage.style.transform = 'scale(1)';
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="button-icon">⚡</span><span class="button-text">Згенерувати покемона</span>';
            
        }, 800);
    }
    
    function findPokemonGeneration(pokemonName) {
        for (const [gen, pokemon] of Object.entries(pokemonDatabase)) {
            if (pokemon.some(p => p.name === pokemonName)) {
                return parseInt(gen);
            }
        }
        return 1;
    }
    
    function getTypeDisplayName(type) {
        const displayNames = {
            fire: 'Вогонь',
            water: 'Вода',
            grass: 'Трава',
            electric: 'Електро',
            psychic: 'Психо',
            ice: 'Лід',
            dragon: 'Дракон',
            dark: 'Темрява',
            fighting: 'Бій',
            poison: 'Отрута',
            ground: 'Земля',
            flying: 'Літання',
            bug: 'Комаха',
            rock: 'Камінь',
            ghost: 'Привид',
            steel: 'Сталь',
            fairy: 'Фея',
            normal: 'Звичайний'
        };
        return displayNames[type] || type;
    }
    
    function getRarityDisplayName(rarity) {
        const displayNames = {
            common: 'Звичайний',
            starter: 'Стартовий',
            legendary: 'Легендарний',
            mythical: 'Міфічний'
        };
        return displayNames[rarity] || rarity;
    }
    
    function getGenerationDisplayName(generation) {
        const displayNames = {
            1: 'Канто',
            2: 'Джото',
            3: 'Хоен',
            4: 'Сіно',
            5: 'Унова',
            6: 'Калос',
            7: 'Алола',
            8: 'Галар'
        };
        return displayNames[generation] || `Покоління ${generation}`;
    }
    
    function updateStatsDisplay() {
        totalGenerated.textContent = stats.total;
        uniquePokemon.textContent = stats.unique.length;
        
        // Find favorite generation
        let favGeneration = '-';
        let maxCount = 0;
        for (const [generation, count] of Object.entries(stats.generations)) {
            if (count > maxCount) {
                maxCount = count;
                favGeneration = getGenerationDisplayName(parseInt(generation));
            }
        }
        favoriteGeneration.textContent = favGeneration;
    }
    
    function updateTypeStats() {
        if (Object.keys(stats.types).length === 0) {
            typeGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">Немає даних</p>';
            return;
        }
        
        typeGrid.innerHTML = Object.entries(stats.types)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => `
                <div class="type-stat">
                    <div class="type-stat-count">${count}</div>
                    <div>${getTypeDisplayName(type)}</div>
                </div>
            `).join('');
    }
    
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historyList.innerHTML = '<p>Історія порожня. Згенеруйте першого покемона!</p>';
            return;
        }
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-image">${item.image}</div>
                <div class="history-details">
                    <div class="history-name">${item.name}</div>
                    <div class="history-meta">
                        <span class="rarity-badge rarity-${item.rarity}">${getRarityDisplayName(item.rarity)}</span>
                        <span>Покоління ${item.generation}</span>
                        ${item.types.map(type => `<span class="type-badge type-${type}">${getTypeDisplayName(type)}</span>`).join(' ')}
                    </div>
                </div>
                <div class="history-time">${item.timestamp}</div>
            </div>
        `).join('');
    }
    
    function saveData() {
        localStorage.setItem('pokemonStats_total_ua', stats.total.toString());
        localStorage.setItem('pokemonStats_unique_ua', JSON.stringify(stats.unique));
        localStorage.setItem('pokemonStats_generations_ua', JSON.stringify(stats.generations));
        localStorage.setItem('pokemonStats_types_ua', JSON.stringify(stats.types));
        localStorage.setItem('pokemonHistory_ua', JSON.stringify(history));
    }
    
    function resetStatistics() {
        if (confirm('Ви впевнені, що хочете скинути всю статистику?')) {
            stats = { total: 0, unique: [], generations: {}, types: {} };
            saveData();
            updateStatsDisplay();
            updateTypeStats();
            
            // Reset display
            pokemonImage.textContent = '🔮';
            pokemonName.textContent = 'Натисніть кнопку для генерації!';
            pokemonDetails.innerHTML = '<p>Виберіть покоління та згенеруйте випадкового покемона</p>';
            pokemonCard.className = 'pokemon-card';
        }
    }
    
    function clearHistoryData() {
        if (confirm('Ви впевнені, що хочете очистити історію?')) {
            history = [];
            localStorage.setItem('pokemonHistory_ua', JSON.stringify(history));
            updateHistoryDisplay();
        }
    }
    
    // Auto-focus on generation select
    generationSelect.focus();
});