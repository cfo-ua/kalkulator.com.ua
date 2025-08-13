document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('wordCategory');
    const countInput = document.getElementById('wordCount');
    const lengthSelect = document.getElementById('wordLength');
    const typeSelect = document.getElementById('wordType');
    const generateBtn = document.getElementById('generateWords');
    const quickGenerateBtn = document.getElementById('quickGenerate');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const result = document.getElementById('result');
    const generatedWords = document.getElementById('generatedWords');
    const generationInfo = document.getElementById('generationInfo');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesList = document.getElementById('favoritesList');
    
    // Word database with Ukrainian words
    const wordDatabase = {
        daily: {
            nouns: ['стіл', 'стілець', 'ліжко', 'подушка', 'ковдра', 'тарілка', 'чашка', 'ложка', 'виделка', 'ніж', 'холодильник', 'плита', 'духовка', 'мікрохвильовка', 'пральна', 'телевізор', 'телефон', 'комп\'ютер', 'ключі', 'сумка', 'рушник', 'мило', 'зубна', 'гребінець', 'дзеркало', 'лампа', 'вікно', 'двері', 'підлога', 'стеля'],
            verbs: ['спати', 'їсти', 'пити', 'читати', 'писати', 'дивитися', 'слухати', 'готувати', 'прибирати', 'прати', 'мити', 'чистити', 'відкривати', 'закривати', 'вмикати', 'вимикати', 'сидіти', 'стояти', 'лежати', 'ходити'],
            adjectives: ['великий', 'малий', 'високий', 'низький', 'довгий', 'короткий', 'широкий', 'вузький', 'товстий', 'тонкий', 'гарячий', 'холодний', 'теплий', 'прохолодний', 'м\'який', 'твердий', 'чистий', 'брудний', 'новий', 'старий'],
            adverbs: ['швидко', 'повільно', 'тихо', 'голосно', 'добре', 'погано', 'красиво', 'потворно', 'легко', 'важко', 'далеко', 'близько', 'рано', 'пізно', 'вчора', 'сьогодні', 'завтра', 'завжди', 'ніколи', 'іноді']
        },
        nature: {
            nouns: ['дерево', 'квітка', 'трава', 'листя', 'гілка', 'корінь', 'стовбур', 'сонце', 'місяць', 'зірка', 'хмара', 'дощ', 'сніг', 'вітер', 'грім', 'блискавка', 'райдуга', 'туман', 'роса', 'іній', 'море', 'річка', 'озеро', 'гора', 'долина', 'ліс', 'поле', 'луг', 'пустеля', 'острів'],
            verbs: ['рости', 'цвісти', 'в\'янути', 'падати', 'течи', 'віяти', 'гриміти', 'блискати', 'світити', 'гріти', 'холодити', 'замерзати', 'танути', 'випаровуватися', 'конденсуватися', 'хвилюватися', 'плескатися', 'шуміти', 'співати', 'щебетати'],
            adjectives: ['зелений', 'жовтий', 'червоний', 'синій', 'фіолетовий', 'рожевий', 'білий', 'чорний', 'сірий', 'коричневий', 'яскравий', 'тьмяний', 'прозорий', 'мутний', 'чистий', 'каламутний', 'спокійний', 'бурхливий', 'тихий', 'шумний'],
            adverbs: ['природно', 'дико', 'вільно', 'мирно', 'спокійно', 'буйно', 'ритмічно', 'хаотично', 'гармонійно', 'безладно', 'циклічно', 'сезонно', 'постійно', 'тимчасово', 'раптово', 'поступово', 'інстинктивно', 'органічно', 'екологічно', 'біологічно']
        },
        emotions: {
            nouns: ['радість', 'сум', 'гнів', 'страх', 'любов', 'ненависть', 'заздрість', 'ревнощі', 'гордість', 'сором', 'провина', 'каяття', 'надія', 'відчай', 'щастя', 'горе', 'захоплення', 'розчарування', 'подив', 'здивування', 'тривога', 'спокій', 'хвилювання', 'нервозність', 'впевненість', 'сумнів', 'довіра', 'недовіра', 'симпатія', 'антипатія'],
            verbs: ['радіти', 'сумувати', 'гніватися', 'боятися', 'любити', 'ненавидіти', 'заздрити', 'ревнувати', 'пишатися', 'соромитися', 'каятися', 'сподіватися', 'відчаювати', 'щастити', 'горювати', 'захоплюватися', 'розчаровуватися', 'дивуватися', 'здивуватися', 'тривожитися'],
            adjectives: ['радісний', 'сумний', 'гнівний', 'страшний', 'любий', 'ненависний', 'заздрісний', 'ревнивий', 'гордий', 'соромний', 'винний', 'каятливий', 'надійний', 'відчайдушний', 'щасливий', 'горісний', 'захоплений', 'розчарований', 'здивований', 'тривожний'],
            adverbs: ['радісно', 'сумно', 'гнівно', 'страшно', 'любовно', 'ненавісно', 'заздрісно', 'ревниво', 'гордо', 'соромно', 'винно', 'каятливо', 'надійно', 'відчайдушно', 'щасливо', 'горісно', 'захоплено', 'розчаровано', 'здивовано', 'тривожно']
        },
        art: {
            nouns: ['картина', 'скульптура', 'музика', 'пісня', 'танець', 'поезія', 'проза', 'роман', 'вірш', 'п\'єса', 'фільм', 'театр', 'опера', 'балет', 'концерт', 'виставка', 'галерея', 'музей', 'майстерня', 'ательє', 'пензель', 'фарба', 'полотно', 'мольберт', 'палітра', 'інструмент', 'мелодія', 'ритм', 'гармонія', 'композиція'],
            verbs: ['малювати', 'писати', 'ліпити', 'грати', 'співати', 'танцювати', 'читати', 'декламувати', 'виступати', 'творити', 'створювати', 'зображувати', 'втілювати', 'інтерпретувати', 'імпровізувати', 'репетирувати', 'вдосконалювати', 'надихати', 'захоплювати', 'вражати'],
            adjectives: ['красивий', 'потворний', 'елегантний', 'грубий', 'витончений', 'примітивний', 'складний', 'простий', 'оригінальний', 'банальний', 'творчий', 'нетворчий', 'художній', 'нехудожній', 'естетичний', 'неестетичний', 'гармонійний', 'дисгармонійний', 'ритмічний', 'аритмічний'],
            adverbs: ['красиво', 'потворно', 'елегантно', 'грубо', 'витончено', 'примітивно', 'складно', 'просто', 'оригінально', 'банально', 'творчо', 'художньо', 'естетично', 'гармонійно', 'ритмічно', 'мелодійно', 'виразно', 'емоційно', 'натхненно', 'майстерно']
        },
        science: {
            nouns: ['атом', 'молекула', 'електрон', 'протон', 'нейтрон', 'енергія', 'сила', 'швидкість', 'прискорення', 'маса', 'об\'єм', 'густина', 'температура', 'тиск', 'вологість', 'світло', 'звук', 'радіація', 'магнетизм', 'електрика', 'гравітація', 'інерція', 'тертя', 'коливання', 'хвиля', 'частота', 'амплітуда', 'резонанс', 'інтерференція', 'дифракція'],
            verbs: ['вимірювати', 'обчислювати', 'аналізувати', 'синтезувати', 'досліджувати', 'експериментувати', 'спостерігати', 'гіпотезувати', 'доводити', 'спростовувати', 'класифікувати', 'каталогізувати', 'ідентифікувати', 'порівнювати', 'контрастувати', 'моделювати', 'симулювати', 'прогнозувати', 'екстраполювати', 'інтерполювати'],
            adjectives: ['науковий', 'емпіричний', 'теоретичний', 'практичний', 'експериментальний', 'гіпотетичний', 'доведений', 'спростований', 'точний', 'наближений', 'кількісний', 'якісний', 'об\'єктивний', 'суб\'єктивний', 'достовірний', 'сумнівний', 'валідний', 'надійний', 'відтворюваний', 'фальсифікований'],
            adverbs: ['науково', 'емпірично', 'теоретично', 'практично', 'експериментально', 'гіпотетично', 'точно', 'наближено', 'кількісно', 'якісно', 'об\'єктивно', 'суб\'єктивно', 'достовірно', 'сумнівно', 'валідно', 'надійно', 'відтворювано', 'систематично', 'методично', 'логічно']
        },
        actions: {
            verbs: ['бігти', 'йти', 'стрибати', 'танцювати', 'плавати', 'літати', 'їздити', 'катати', 'кидати', 'ловити', 'тягти', 'штовхати', 'піднімати', 'опускати', 'носити', 'нести', 'брати', 'давати', 'отримувати', 'передавати', 'будувати', 'руйнувати', 'створювати', 'знищувати', 'шукати', 'знаходити', 'втрачати', 'зберігати', 'викидати', 'збирати'],
            nouns: ['біг', 'хода', 'стрибок', 'танець', 'плавання', 'політ', 'їзда', 'катання', 'кидок', 'ловіння', 'тягання', 'штовхання', 'піднімання', 'опускання', 'носіння', 'несення', 'взяття', 'давання', 'отримання', 'передавання', 'будівництво', 'руйнування', 'створення', 'знищення', 'пошук', 'знаходження', 'втрата', 'збереження', 'викидання', 'збирання'],
            adjectives: ['активний', 'пасивний', 'швидкий', 'повільний', 'енергійний', 'млявий', 'сильний', 'слабкий', 'координований', 'незграбний', 'точний', 'неточний', 'ефективний', 'неефективний', 'результативний', 'безрезультатний', 'цілеспрямований', 'хаотичний', 'планомірний', 'спонтанний'],
            adverbs: ['активно', 'пасивно', 'швидко', 'повільно', 'енергійно', 'мляво', 'сильно', 'слабко', 'координовано', 'незграбно', 'точно', 'неточно', 'ефективно', 'неефективно', 'результативно', 'цілеспрямовано', 'хаотично', 'планомірно', 'спонтанно', 'методично']
        },
        colors: {
            nouns: ['червоний', 'оранжевий', 'жовтий', 'зелений', 'блакитний', 'синій', 'фіолетовий', 'рожевий', 'коричневий', 'чорний', 'білий', 'сірий', 'бежевий', 'бірюзовий', 'малиновий', 'лимонний', 'лаймовий', 'індиго', 'маджента', 'циановий', 'алий', 'бордовий', 'темно-синій', 'світло-зелений', 'яскраво-червоний', 'блідо-жовтий', 'насичено-фіолетовий', 'перламутровий', 'металевий', 'прозорий'],
            adjectives: ['кольоровий', 'безбарвний', 'яскравий', 'тьмяний', 'насичений', 'блідий', 'темний', 'світлий', 'контрастний', 'приглушений', 'флуоресцентний', 'неоновий', 'металевий', 'матовий', 'глянцевий', 'перламутровий', 'прозорий', 'непрозорий', 'різнобарвний', 'однотонний'],
            verbs: ['фарбувати', 'розфарбовувати', 'змінювати', 'контрастувати', 'поєднувати', 'комбінувати', 'виділяти', 'підкреслювати', 'приглушувати', 'насичувати', 'освітлювати', 'затемнювати', 'відбілювати', 'тонувати', 'градуювати', 'змішувати', 'розділяти', 'гармоніювати', 'дисонувати', 'вражати'],
            adverbs: ['кольорово', 'яскраво', 'тьмяно', 'насичено', 'бліде', 'темно', 'світло', 'контрастно', 'приглушено', 'флуоресцентно', 'металево', 'матово', 'глянцево', 'перламутрово', 'прозоро', 'різнобарвно', 'однотонно', 'гармонійно', 'дисонансно', 'естетично']
        },
        food: {
            nouns: ['хліб', 'м\'ясо', 'риба', 'овочі', 'фрукти', 'молоко', 'сир', 'масло', 'яйця', 'цукор', 'сіль', 'перець', 'картопля', 'морква', 'цибуля', 'часник', 'помідор', 'огірок', 'капуста', 'яблуко', 'банан', 'апельсин', 'лимон', 'виноград', 'полуниця', 'вишня', 'слива', 'груша', 'абрикос', 'персик'],
            verbs: ['їсти', 'пити', 'готувати', 'варити', 'смажити', 'пекти', 'тушкувати', 'парити', 'мариновувати', 'солити', 'цукрити', 'приправляти', 'заправляти', 'нарізати', 'подрібнювати', 'змішувати', 'розмішувати', 'взбивати', 'місити', 'розігрівати'],
            adjectives: ['смачний', 'несмачний', 'солоний', 'солодкий', 'кислий', 'гіркий', 'гострий', 'м\'який', 'твердий', 'свіжий', 'черствий', 'гарячий', 'холодний', 'ситний', 'легкий', 'важкий', 'калорійний', 'дієтичний', 'корисний', 'шкідливий'],
            adverbs: ['смачно', 'несмачно', 'солоно', 'солодко', 'кисло', 'гірко', 'гостро', 'м\'яко', 'твердо', 'свіжо', 'черство', 'гаряче', 'холодно', 'ситно', 'легко', 'важко', 'калорійно', 'дієтично', 'корисно', 'шкідливо']
        },
        professions: {
            nouns: ['лікар', 'вчитель', 'інженер', 'програміст', 'юрист', 'економіст', 'журналіст', 'художник', 'музикант', 'актор', 'режисер', 'письменник', 'перекладач', 'архітектор', 'дизайнер', 'фотограф', 'кухар', 'офіціант', 'продавець', 'касир', 'водій', 'пілот', 'капітан', 'моряк', 'солдат', 'поліцейський', 'пожежник', 'рятувальник', 'будівельник', 'слюсар'],
            adjectives: ['професійний', 'аматорський', 'кваліфікований', 'некваліфікований', 'досвідчений', 'недосвідчений', 'талановитий', 'здібний', 'працьовитий', 'ледачий', 'відповідальний', 'безвідповідальний', 'пунктуальний', 'неточний', 'креативний', 'консервативний', 'інноваційний', 'традиційний', 'універсальний', 'спеціалізований'],
            verbs: ['працювати', 'трудитися', 'заробляти', 'навчати', 'лікувати', 'програмувати', 'проектувати', 'будувати', 'керувати', 'організовувати', 'координувати', 'контролювати', 'перевіряти', 'аналізувати', 'консультувати', 'обслуговувати', 'ремонтувати', 'виготовляти', 'продавати', 'купувати'],
            adverbs: ['професійно', 'аматорськи', 'кваліфіковано', 'досвідчено', 'талановито', 'здібно', 'працьовито', 'ледачо', 'відповідально', 'пунктуально', 'креативно', 'інноваційно', 'традиційно', 'універсально', 'ефективно', 'результативно', 'компетентно', 'експертно', 'майстерно', 'вправно']
        },
        abstract: {
            nouns: ['ідея', 'думка', 'концепція', 'поняття', 'принцип', 'теорія', 'гіпотеза', 'філософія', 'ідеологія', 'світогляд', 'переконання', 'віра', 'сумнів', 'істина', 'брехня', 'справедливість', 'несправедливість', 'свобода', 'рабство', 'рівність', 'нерівність', 'мораль', 'етика', 'естетика', 'логіка', 'інтуїція', 'розум', 'почуття', 'душа', 'дух'],
            adjectives: ['абстрактний', 'конкретний', 'теоретичний', 'практичний', 'філософський', 'науковий', 'релігійний', 'духовний', 'матеріальний', 'ідеальний', 'реальний', 'уявний', 'істинний', 'хибний', 'справедливий', 'несправедливий', 'моральний', 'аморальний', 'етичний', 'неетичний'],
            verbs: ['думати', 'міркувати', 'роздумувати', 'філософувати', 'аналізувати', 'синтезувати', 'узагальнювати', 'конкретизувати', 'абстрагувати', 'ідеалізувати', 'реалізувати', 'уявляти', 'фантазувати', 'мріяти', 'сподіватися', 'вірити', 'сумніватися', 'переконувати', 'спростовувати', 'доводити'],
            adverbs: ['абстрактно', 'конкретно', 'теоретично', 'практично', 'філософськи', 'науково', 'духовно', 'ідеально', 'реально', 'уявно', 'істинно', 'хибно', 'справедливо', 'морально', 'етично', 'логічно', 'інтуїтивно', 'раціонально', 'емоційно', 'свідомо']
        }
    };
    
    // Load history and favorites from localStorage
    let history = JSON.parse(localStorage.getItem('randomWordHistory_ua') || '[]');
    let favorites = JSON.parse(localStorage.getItem('randomWordFavorites_ua') || '[]');
    
    // Event listeners
    generateBtn.addEventListener('click', generateWords);
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
    
    function filterWordsByLength(words, length) {
        if (length === 'all') return words;
        
        return words.filter(word => {
            const wordLength = word.length;
            if (length === 'short') return wordLength >= 3 && wordLength <= 5;
            if (length === 'medium') return wordLength >= 6 && wordLength <= 8;
            if (length === 'long') return wordLength >= 9;
            return true;
        });
    }
    
    function getWordPool(category, type, length) {
        let pool = [];
        
        if (category === 'all') {
            // Combine all categories
            Object.keys(wordDatabase).forEach(cat => {
                if (type === 'all') {
                    Object.keys(wordDatabase[cat]).forEach(wordType => {
                        pool = pool.concat(wordDatabase[cat][wordType]);
                    });
                } else {
                    if (wordDatabase[cat][type]) {
                        pool = pool.concat(wordDatabase[cat][type]);
                    }
                }
            });
        } else {
            if (type === 'all') {
                Object.keys(wordDatabase[category]).forEach(wordType => {
                    pool = pool.concat(wordDatabase[category][wordType]);
                });
            } else {
                if (wordDatabase[category][type]) {
                    pool = wordDatabase[category][type];
                }
            }
        }
        
        return filterWordsByLength(pool, length);
    }
    
    function generateWords() {
        const category = categorySelect.value;
        const count = parseInt(countInput.value);
        const length = lengthSelect.value;
        const type = typeSelect.value;
        
        if (count < 1 || count > 50) {
            alert('Кількість слів повинна бути від 1 до 50');
            return;
        }
        
        const wordPool = getWordPool(category, type, length);
        
        if (wordPool.length === 0) {
            alert('Не знайдено слів за вибраними критеріями');
            return;
        }
        
        const generatedWordsList = [];
        const usedWords = new Set();
        
        for (let i = 0; i < count && i < wordPool.length; i++) {
            let word;
            let attempts = 0;
            
            do {
                word = getRandomElement(wordPool);
                attempts++;
            } while (usedWords.has(word) && attempts < 50);
            
            if (!usedWords.has(word)) {
                usedWords.add(word);
                generatedWordsList.push({
                    word: word,
                    category: category === 'all' ? 'змішана' : getCategoryName(category),
                    type: type === 'all' ? 'різні' : getTypeName(type),
                    length: word.length
                });
            }
        }
        
        // Add to history
        const historyEntry = {
            words: generatedWordsList,
            timestamp: new Date().toLocaleString('uk-UA'),
            settings: {
                category: getCategoryName(category),
                type: getTypeName(type),
                length: getLengthName(length),
                count: generatedWordsList.length
            }
        };
        
        history.unshift(historyEntry);
        if (history.length > 200) history.pop();
        
        localStorage.setItem('randomWordHistory_ua', JSON.stringify(history));
        
        displayResults(generatedWordsList, historyEntry);
        updateHistoryDisplay();
    }
    
    function getCategoryName(category) {
        const names = {
            'all': 'всі категорії',
            'daily': 'побут',
            'nature': 'природа',
            'emotions': 'емоції',
            'art': 'мистецтво',
            'science': 'наука',
            'actions': 'дії',
            'colors': 'кольори',
            'food': 'їжа',
            'professions': 'професії',
            'abstract': 'абстрактні'
        };
        return names[category] || category;
    }
    
    function getTypeName(type) {
        const names = {
            'all': 'всі типи',
            'nouns': 'іменники',
            'verbs': 'дієслова',
            'adjectives': 'прикметники',
            'adverbs': 'прислівники'
        };
        return names[type] || type;
    }
    
    function getLengthName(length) {
        const names = {
            'all': 'будь-яка',
            'short': 'короткі',
            'medium': 'середні',
            'long': 'довгі'
        };
        return names[length] || length;
    }
    
    function quickGenerate() {
        const presets = [
            {category: 'emotions', type: 'nouns', count: 8},
            {category: 'nature', type: 'all', count: 12},
            {category: 'actions', type: 'verbs', count: 15},
            {category: 'all', type: 'adjectives', count: 10}
        ];
        
        const preset = getRandomElement(presets);
        
        categorySelect.value = preset.category;
        typeSelect.value = preset.type;
        countInput.value = preset.count;
        
        generateWords();
    }
    
    function displayResults(wordsList, historyEntry) {
        generatedWords.innerHTML = wordsList.map((wordData, index) => `
            <div class="word-item" onclick="copyWord('${wordData.word}', this)">
                <div class="word-text">${wordData.word}</div>
                <div class="word-info">${wordData.category} • ${wordData.type}</div>
                <div class="word-actions">
                    <button class="word-btn" onclick="event.stopPropagation(); copyWord('${wordData.word}', this.parentElement.parentElement)">📋</button>
                    <button class="word-btn" onclick="event.stopPropagation(); addToFavorites('${wordData.word}', '${wordData.category}', '${wordData.type}')">⭐</button>
                </div>
            </div>
        `).join('');
        
        generationInfo.textContent = `Згенеровано ${wordsList.length} слів (${historyEntry.settings.category}, ${historyEntry.settings.type})`;
        
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function copyWord(word, cardElement) {
        navigator.clipboard.writeText(word).then(() => {
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
            alert(`Слово скопійовано: ${word}`);
        });
    }
    
    function addToFavorites(word, category, type) {
        const favorite = { word, category, type, timestamp: new Date().toLocaleString('uk-UA') };
        
        if (!favorites.some(fav => fav.word === word)) {
            favorites.unshift(favorite);
            if (favorites.length > 100) favorites.pop();
            localStorage.setItem('randomWordFavorites_ua', JSON.stringify(favorites));
            updateFavoritesDisplay();
            alert(`"${word}" додано в улюблені!`);
        } else {
            alert(`"${word}" вже в улюблених!`);
        }
    }
    
    function removeFromFavorites(word) {
        favorites = favorites.filter(fav => fav.word !== word);
        localStorage.setItem('randomWordFavorites_ua', JSON.stringify(favorites));
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
                    <strong>${entry.words.map(w => w.word).join(', ')}</strong>
                    <div style="font-size: 0.9rem; color: #6b7280; margin-top: 0.25rem;">
                        ${entry.settings.category} • ${entry.settings.type} • ${entry.settings.count} слів
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
            <span class="favorite-word" onclick="copyWord('${fav.word}', this)">
                ${fav.word}
                <button onclick="event.stopPropagation(); removeFromFavorites('${fav.word}')" style="background: transparent; border: none; color: white; margin-left: 0.5rem; cursor: pointer;">×</button>
            </span>
        `).join('');
    }
    
    function clearHistory() {
        if (confirm('Ви впевнені, що хочете очистити всю історію та улюблені слова?')) {
            history = [];
            favorites = [];
            localStorage.removeItem('randomWordHistory_ua');
            localStorage.removeItem('randomWordFavorites_ua');
            
            updateHistoryDisplay();
            updateFavoritesDisplay();
            
            alert('Історія та улюблені слова очищені');
        }
    }
    
    // Make functions globally available
    window.copyWord = copyWord;
    window.addToFavorites = addToFavorites;
    window.removeFromFavorites = removeFromFavorites;
});