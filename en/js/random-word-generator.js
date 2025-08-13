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
    
    // Word database with English words
    const wordDatabase = {
        daily: {
            nouns: ['table', 'chair', 'bed', 'pillow', 'blanket', 'plate', 'cup', 'spoon', 'fork', 'knife', 'refrigerator', 'stove', 'oven', 'microwave', 'washing machine', 'television', 'phone', 'computer', 'keys', 'bag', 'towel', 'soap', 'toothbrush', 'comb', 'mirror', 'lamp', 'window', 'door', 'floor', 'ceiling'],
            verbs: ['sleep', 'eat', 'drink', 'read', 'write', 'watch', 'listen', 'cook', 'clean', 'wash', 'brush', 'comb', 'open', 'close', 'turn on', 'turn off', 'sit', 'stand', 'lie', 'walk'],
            adjectives: ['big', 'small', 'tall', 'short', 'long', 'brief', 'wide', 'narrow', 'thick', 'thin', 'hot', 'cold', 'warm', 'cool', 'soft', 'hard', 'clean', 'dirty', 'new', 'old'],
            adverbs: ['quickly', 'slowly', 'quietly', 'loudly', 'well', 'badly', 'beautifully', 'ugly', 'easily', 'hardly', 'far', 'near', 'early', 'late', 'yesterday', 'today', 'tomorrow', 'always', 'never', 'sometimes']
        },
        nature: {
            nouns: ['tree', 'flower', 'grass', 'leaf', 'branch', 'root', 'trunk', 'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'thunder', 'lightning', 'rainbow', 'fog', 'dew', 'frost', 'sea', 'river', 'lake', 'mountain', 'valley', 'forest', 'field', 'meadow', 'desert', 'island'],
            verbs: ['grow', 'bloom', 'wither', 'fall', 'flow', 'blow', 'thunder', 'flash', 'shine', 'warm', 'cool', 'freeze', 'melt', 'evaporate', 'condense', 'wave', 'splash', 'rustle', 'sing', 'chirp'],
            adjectives: ['green', 'yellow', 'red', 'blue', 'purple', 'pink', 'white', 'black', 'gray', 'brown', 'bright', 'dim', 'transparent', 'murky', 'clear', 'turbid', 'calm', 'stormy', 'quiet', 'noisy'],
            adverbs: ['naturally', 'wildly', 'freely', 'peacefully', 'calmly', 'violently', 'rhythmically', 'chaotically', 'harmoniously', 'randomly', 'cyclically', 'seasonally', 'constantly', 'temporarily', 'suddenly', 'gradually', 'instinctively', 'organically', 'ecologically', 'biologically']
        },
        emotions: {
            nouns: ['joy', 'sadness', 'anger', 'fear', 'love', 'hate', 'envy', 'jealousy', 'pride', 'shame', 'guilt', 'regret', 'hope', 'despair', 'happiness', 'grief', 'excitement', 'disappointment', 'surprise', 'amazement', 'anxiety', 'peace', 'worry', 'nervousness', 'confidence', 'doubt', 'trust', 'distrust', 'sympathy', 'antipathy'],
            verbs: ['rejoice', 'grieve', 'anger', 'fear', 'love', 'hate', 'envy', 'feel jealous', 'pride', 'shame', 'regret', 'hope', 'despair', 'delight', 'mourn', 'excite', 'disappoint', 'surprise', 'amaze', 'worry'],
            adjectives: ['joyful', 'sad', 'angry', 'fearful', 'loving', 'hateful', 'envious', 'jealous', 'proud', 'ashamed', 'guilty', 'regretful', 'hopeful', 'desperate', 'happy', 'grieving', 'excited', 'disappointed', 'surprised', 'anxious'],
            adverbs: ['joyfully', 'sadly', 'angrily', 'fearfully', 'lovingly', 'hatefully', 'enviously', 'jealously', 'proudly', 'shamefully', 'guiltily', 'regretfully', 'hopefully', 'desperately', 'happily', 'grievingly', 'excitedly', 'disappointedly', 'surprisingly', 'anxiously']
        },
        art: {
            nouns: ['painting', 'sculpture', 'music', 'song', 'dance', 'poetry', 'prose', 'novel', 'poem', 'play', 'film', 'theater', 'opera', 'ballet', 'concert', 'exhibition', 'gallery', 'museum', 'studio', 'atelier', 'brush', 'paint', 'canvas', 'easel', 'palette', 'instrument', 'melody', 'rhythm', 'harmony', 'composition'],
            verbs: ['paint', 'write', 'sculpt', 'play', 'sing', 'dance', 'read', 'recite', 'perform', 'create', 'make', 'depict', 'embody', 'interpret', 'improvise', 'rehearse', 'perfect', 'inspire', 'fascinate', 'impress'],
            adjectives: ['beautiful', 'ugly', 'elegant', 'crude', 'refined', 'primitive', 'complex', 'simple', 'original', 'banal', 'creative', 'uncreative', 'artistic', 'unartistic', 'aesthetic', 'unaesthetic', 'harmonious', 'disharmonious', 'rhythmic', 'arrhythmic'],
            adverbs: ['beautifully', 'ugly', 'elegantly', 'crudely', 'refinedly', 'primitively', 'complexly', 'simply', 'originally', 'banally', 'creatively', 'artistically', 'aesthetically', 'harmoniously', 'rhythmically', 'melodiously', 'expressively', 'emotionally', 'inspiredly', 'masterfully']
        },
        science: {
            nouns: ['atom', 'molecule', 'electron', 'proton', 'neutron', 'energy', 'force', 'speed', 'acceleration', 'mass', 'volume', 'density', 'temperature', 'pressure', 'humidity', 'light', 'sound', 'radiation', 'magnetism', 'electricity', 'gravity', 'inertia', 'friction', 'oscillation', 'wave', 'frequency', 'amplitude', 'resonance', 'interference', 'diffraction'],
            verbs: ['measure', 'calculate', 'analyze', 'synthesize', 'research', 'experiment', 'observe', 'hypothesize', 'prove', 'disprove', 'classify', 'catalog', 'identify', 'compare', 'contrast', 'model', 'simulate', 'predict', 'extrapolate', 'interpolate'],
            adjectives: ['scientific', 'empirical', 'theoretical', 'practical', 'experimental', 'hypothetical', 'proven', 'disproven', 'accurate', 'approximate', 'quantitative', 'qualitative', 'objective', 'subjective', 'reliable', 'doubtful', 'valid', 'reliable', 'reproducible', 'falsified'],
            adverbs: ['scientifically', 'empirically', 'theoretically', 'practically', 'experimentally', 'hypothetically', 'accurately', 'approximately', 'quantitatively', 'qualitatively', 'objectively', 'subjectively', 'reliably', 'doubtfully', 'validly', 'reproducibly', 'systematically', 'methodically', 'logically', 'rationally']
        },
        actions: {
            verbs: ['run', 'walk', 'jump', 'dance', 'swim', 'fly', 'drive', 'ride', 'throw', 'catch', 'pull', 'push', 'lift', 'lower', 'carry', 'bring', 'take', 'give', 'receive', 'transmit', 'build', 'destroy', 'create', 'eliminate', 'search', 'find', 'lose', 'save', 'throw away', 'collect'],
            nouns: ['running', 'walking', 'jumping', 'dancing', 'swimming', 'flying', 'driving', 'riding', 'throwing', 'catching', 'pulling', 'pushing', 'lifting', 'lowering', 'carrying', 'bringing', 'taking', 'giving', 'receiving', 'transmitting', 'building', 'destroying', 'creating', 'eliminating', 'searching', 'finding', 'losing', 'saving', 'throwing', 'collecting'],
            adjectives: ['active', 'passive', 'fast', 'slow', 'energetic', 'sluggish', 'strong', 'weak', 'coordinated', 'clumsy', 'accurate', 'inaccurate', 'effective', 'ineffective', 'productive', 'unproductive', 'purposeful', 'chaotic', 'planned', 'spontaneous'],
            adverbs: ['actively', 'passively', 'quickly', 'slowly', 'energetically', 'sluggishly', 'strongly', 'weakly', 'coordinatedly', 'clumsily', 'accurately', 'inaccurately', 'effectively', 'ineffectively', 'productively', 'purposefully', 'chaotically', 'plannedly', 'spontaneously', 'methodically']
        },
        colors: {
            nouns: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white', 'gray', 'beige', 'turquoise', 'crimson', 'lemon', 'lime', 'indigo', 'magenta', 'cyan', 'scarlet', 'burgundy', 'navy', 'light green', 'bright red', 'pale yellow', 'deep purple', 'pearl', 'metallic', 'transparent'],
            adjectives: ['colorful', 'colorless', 'bright', 'dim', 'saturated', 'pale', 'dark', 'light', 'contrasting', 'muted', 'fluorescent', 'neon', 'metallic', 'matte', 'glossy', 'pearlescent', 'transparent', 'opaque', 'multicolored', 'monochrome'],
            verbs: ['color', 'discolor', 'change', 'contrast', 'combine', 'match', 'highlight', 'emphasize', 'mute', 'saturate', 'lighten', 'darken', 'bleach', 'tint', 'shade', 'mix', 'separate', 'harmonize', 'clash', 'impress'],
            adverbs: ['colorfully', 'brightly', 'dimly', 'saturatedly', 'palely', 'darkly', 'lightly', 'contrastingly', 'mutely', 'fluorescently', 'metallically', 'mattely', 'glossily', 'pearlescently', 'transparently', 'multicoloredly', 'monochromatically', 'harmoniously', 'clashingly', 'aesthetically']
        },
        food: {
            nouns: ['bread', 'meat', 'fish', 'vegetables', 'fruits', 'milk', 'cheese', 'butter', 'eggs', 'sugar', 'salt', 'pepper', 'potato', 'carrot', 'onion', 'garlic', 'tomato', 'cucumber', 'cabbage', 'apple', 'banana', 'orange', 'lemon', 'grapes', 'strawberry', 'cherry', 'plum', 'pear', 'apricot', 'peach'],
            verbs: ['eat', 'drink', 'cook', 'boil', 'fry', 'bake', 'stew', 'steam', 'marinate', 'salt', 'sweeten', 'season', 'dress', 'cut', 'chop', 'mix', 'stir', 'whip', 'knead', 'heat'],
            adjectives: ['tasty', 'tasteless', 'salty', 'sweet', 'sour', 'bitter', 'spicy', 'soft', 'hard', 'fresh', 'stale', 'hot', 'cold', 'filling', 'light', 'heavy', 'caloric', 'dietary', 'healthy', 'unhealthy'],
            adverbs: ['tastily', 'tastelessly', 'saltily', 'sweetly', 'sourly', 'bitterly', 'spicily', 'softly', 'hardly', 'freshly', 'stalely', 'hotly', 'coldly', 'fillingly', 'lightly', 'heavily', 'calorically', 'dietarily', 'healthily', 'unhealthily']
        },
        professions: {
            nouns: ['doctor', 'teacher', 'engineer', 'programmer', 'lawyer', 'economist', 'journalist', 'artist', 'musician', 'actor', 'director', 'writer', 'translator', 'architect', 'designer', 'photographer', 'chef', 'waiter', 'seller', 'cashier', 'driver', 'pilot', 'captain', 'sailor', 'soldier', 'police officer', 'firefighter', 'rescuer', 'builder', 'mechanic'],
            adjectives: ['professional', 'amateur', 'qualified', 'unqualified', 'experienced', 'inexperienced', 'talented', 'gifted', 'hardworking', 'lazy', 'responsible', 'irresponsible', 'punctual', 'unpunctual', 'creative', 'conservative', 'innovative', 'traditional', 'universal', 'specialized'],
            verbs: ['work', 'labor', 'earn', 'teach', 'treat', 'program', 'design', 'build', 'manage', 'organize', 'coordinate', 'control', 'check', 'analyze', 'consult', 'serve', 'repair', 'manufacture', 'sell', 'buy'],
            adverbs: ['professionally', 'amateurishly', 'qualifiedly', 'experiencedly', 'talentedly', 'giftedly', 'hardworkingly', 'lazily', 'responsibly', 'punctually', 'creatively', 'innovatively', 'traditionally', 'universally', 'effectively', 'productively', 'competently', 'expertly', 'masterfully', 'skillfully']
        },
        abstract: {
            nouns: ['idea', 'thought', 'concept', 'notion', 'principle', 'theory', 'hypothesis', 'philosophy', 'ideology', 'worldview', 'belief', 'faith', 'doubt', 'truth', 'lie', 'justice', 'injustice', 'freedom', 'slavery', 'equality', 'inequality', 'morality', 'ethics', 'aesthetics', 'logic', 'intuition', 'reason', 'feeling', 'soul', 'spirit'],
            adjectives: ['abstract', 'concrete', 'theoretical', 'practical', 'philosophical', 'scientific', 'religious', 'spiritual', 'material', 'ideal', 'real', 'imaginary', 'true', 'false', 'just', 'unjust', 'moral', 'immoral', 'ethical', 'unethical'],
            verbs: ['think', 'reason', 'ponder', 'philosophize', 'analyze', 'synthesize', 'generalize', 'specify', 'abstract', 'idealize', 'realize', 'imagine', 'fantasize', 'dream', 'hope', 'believe', 'doubt', 'convince', 'refute', 'prove'],
            adverbs: ['abstractly', 'concretely', 'theoretically', 'practically', 'philosophically', 'scientifically', 'spiritually', 'ideally', 'really', 'imaginarily', 'truly', 'falsely', 'justly', 'morally', 'ethically', 'logically', 'intuitively', 'rationally', 'emotionally', 'consciously']
        }
    };
    
    // Load history and favorites from localStorage
    let history = JSON.parse(localStorage.getItem('randomWordHistory_en') || '[]');
    let favorites = JSON.parse(localStorage.getItem('randomWordFavorites_en') || '[]');
    
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
            alert('Number of words must be between 1 and 50');
            return;
        }
        
        const wordPool = getWordPool(category, type, length);
        
        if (wordPool.length === 0) {
            alert('No words found matching the selected criteria');
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
                    category: category === 'all' ? 'mixed' : getCategoryName(category),
                    type: type === 'all' ? 'various' : getTypeName(type),
                    length: word.length
                });
            }
        }
        
        // Add to history
        const historyEntry = {
            words: generatedWordsList,
            timestamp: new Date().toLocaleString('en-US'),
            settings: {
                category: getCategoryName(category),
                type: getTypeName(type),
                length: getLengthName(length),
                count: generatedWordsList.length
            }
        };
        
        history.unshift(historyEntry);
        if (history.length > 200) history.pop();
        
        localStorage.setItem('randomWordHistory_en', JSON.stringify(history));
        
        displayResults(generatedWordsList, historyEntry);
        updateHistoryDisplay();
    }
    
    function getCategoryName(category) {
        const names = {
            'all': 'all categories',
            'daily': 'daily life',
            'nature': 'nature',
            'emotions': 'emotions',
            'art': 'art',
            'science': 'science',
            'actions': 'actions',
            'colors': 'colors',
            'food': 'food',
            'professions': 'professions',
            'abstract': 'abstract'
        };
        return names[category] || category;
    }
    
    function getTypeName(type) {
        const names = {
            'all': 'all types',
            'nouns': 'nouns',
            'verbs': 'verbs',
            'adjectives': 'adjectives',
            'adverbs': 'adverbs'
        };
        return names[type] || type;
    }
    
    function getLengthName(length) {
        const names = {
            'all': 'any',
            'short': 'short',
            'medium': 'medium',
            'long': 'long'
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
        
        generationInfo.textContent = `Generated ${wordsList.length} words (${historyEntry.settings.category}, ${historyEntry.settings.type})`;
        
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function copyWord(word, cardElement) {
        navigator.clipboard.writeText(word).then(() => {
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
            alert(`Word copied: ${word}`);
        });
    }
    
    function addToFavorites(word, category, type) {
        const favorite = { word, category, type, timestamp: new Date().toLocaleString('en-US') };
        
        if (!favorites.some(fav => fav.word === word)) {
            favorites.unshift(favorite);
            if (favorites.length > 100) favorites.pop();
            localStorage.setItem('randomWordFavorites_en', JSON.stringify(favorites));
            updateFavoritesDisplay();
            alert(`"${word}" added to favorites!`);
        } else {
            alert(`"${word}" is already in favorites!`);
        }
    }
    
    function removeFromFavorites(word) {
        favorites = favorites.filter(fav => fav.word !== word);
        localStorage.setItem('randomWordFavorites_en', JSON.stringify(favorites));
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
                        ${entry.settings.category} • ${entry.settings.type} • ${entry.settings.count} words
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
        if (confirm('Are you sure you want to clear all history and favorite words?')) {
            history = [];
            favorites = [];
            localStorage.removeItem('randomWordHistory_en');
            localStorage.removeItem('randomWordFavorites_en');
            
            updateHistoryDisplay();
            updateFavoritesDisplay();
            
            alert('History and favorite words cleared');
        }
    }
    
    // Make functions globally available
    window.copyWord = copyWord;
    window.addToFavorites = addToFavorites;
    window.removeFromFavorites = removeFromFavorites;
});