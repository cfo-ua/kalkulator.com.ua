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
            { name: "Pikachu", image: "⚡", types: ["electric"], rarity: "common", hp: 35, attack: 55, defense: 40, fact: "The most famous Pokemon in the world, mascot of the Pokemon franchise." },
            { name: "Charizard", image: "🔥", types: ["fire", "flying"], rarity: "starter", hp: 78, attack: 84, defense: 78, fact: "Evolution of Charmander, can fly at altitudes up to 1400 meters." },
            { name: "Blastoise", image: "🌊", types: ["water"], rarity: "starter", hp: 79, attack: 83, defense: 100, fact: "Its water cannons can pierce thick steel." },
            { name: "Venusaur", image: "🌿", types: ["grass", "poison"], rarity: "starter", hp: 80, attack: 82, defense: 83, fact: "The flower on its back releases a soothing scent." },
            { name: "Mew", image: "💫", types: ["psychic"], rarity: "mythical", hp: 100, attack: 100, defense: 100, fact: "Contains DNA of all Pokemon and can learn any move." },
            { name: "Mewtwo", image: "🧠", types: ["psychic"], rarity: "legendary", hp: 106, attack: 110, defense: 90, fact: "Genetically created as the strongest Pokemon." },
            { name: "Snorlax", image: "😴", types: ["normal"], rarity: "common", hp: 160, attack: 110, defense: 65, fact: "Sleeps 20 hours a day and weighs over 400 kg." },
            { name: "Psyduck", image: "🦆", types: ["water"], rarity: "common", hp: 50, attack: 52, defense: 48, fact: "Constantly suffers from headaches." },
            { name: "Machamp", image: "💪", types: ["fighting"], rarity: "common", hp: 90, attack: 130, defense: 80, fact: "Can deliver 1000 punches in 2 seconds." },
            { name: "Gengar", image: "👻", types: ["ghost", "poison"], rarity: "common", hp: 60, attack: 65, defense: 60, fact: "Hides in shadows and lowers temperature by 10 degrees." }
        ],
        2: [
            { name: "Lugia", image: "🌪️", types: ["psychic", "flying"], rarity: "legendary", hp: 106, attack: 90, defense: 130, fact: "Can calm stormy seas with a flap of its wings." },
            { name: "Ho-Oh", image: "🔥", types: ["fire", "flying"], rarity: "legendary", hp: 106, attack: 130, defense: 90, fact: "Its feathers shine in all colors of the rainbow." },
            { name: "Celebi", image: "🧚", types: ["psychic", "grass"], rarity: "mythical", hp: 100, attack: 100, defense: 100, fact: "Can travel through time across forests." },
            { name: "Typhlosion", image: "🔥", types: ["fire"], rarity: "starter", hp: 78, attack: 84, defense: 78, fact: "Creates blazes using intense heat." },
            { name: "Feraligatr", image: "🐊", types: ["water"], rarity: "starter", hp: 85, attack: 105, defense: 100, fact: "Its jaws are so powerful they can crush anything." },
            { name: "Meganium", image: "🌺", types: ["grass"], rarity: "starter", hp: 80, attack: 82, defense: 100, fact: "The flower's aroma soothes emotions." },
            { name: "Scizor", image: "✂️", types: ["bug", "steel"], rarity: "common", hp: 70, attack: 130, defense: 100, fact: "Its pincers are harder than diamonds." },
            { name: "Ampharos", image: "💡", types: ["electric"], rarity: "common", hp: 90, attack: 75, defense: 85, fact: "Light from its tail can be seen from space." },
            { name: "Umbreon", image: "🌙", types: ["dark"], rarity: "common", hp: 95, attack: 65, defense: 110, fact: "Eevee evolution under moonlight influence." },
            { name: "Espeon", image: "☀️", types: ["psychic"], rarity: "common", hp: 65, attack: 65, defense: 60, fact: "Eevee evolution under sunlight influence." }
        ],
        3: [
            { name: "Rayquaza", image: "🐉", types: ["dragon", "flying"], rarity: "legendary", hp: 105, attack: 150, defense: 90, fact: "Lives in the ozone layer and feeds on meteorites." },
            { name: "Kyogre", image: "🌊", types: ["water"], rarity: "legendary", hp: 100, attack: 100, defense: 90, fact: "Has the power to expand oceans with rain." },
            { name: "Groudon", image: "🌋", types: ["ground"], rarity: "legendary", hp: 100, attack: 150, defense: 140, fact: "Can expand continents with lava." },
            { name: "Jirachi", image: "⭐", types: ["steel", "psychic"], rarity: "mythical", hp: 100, attack: 100, defense: 100, fact: "Awakens only once every 1000 years and grants wishes." },
            { name: "Blaziken", image: "🔥", types: ["fire", "fighting"], rarity: "starter", hp: 80, attack: 120, defense: 70, fact: "Can jump over 30-story buildings." },
            { name: "Swampert", image: "💧", types: ["water", "ground"], rarity: "starter", hp: 100, attack: 110, defense: 90, fact: "Can predict storms by wind changes." },
            { name: "Sceptile", image: "🦎", types: ["grass"], rarity: "starter", hp: 70, attack: 85, defense: 65, fact: "Seeds on its back contain nutrients for plants." },
            { name: "Aggron", image: "🛡️", types: ["steel", "rock"], rarity: "common", hp: 70, attack: 110, defense: 180, fact: "Its armor can deflect any attack." },
            { name: "Sableye", image: "⚔️", types: ["dark", "ghost"], rarity: "common", hp: 50, attack: 90, defense: 60, fact: "Its claw-hands are sharper than any sword." },
            { name: "Mawile", image: "💖", types: ["steel", "fairy"], rarity: "common", hp: 50, attack: 85, defense: 85, fact: "Deceives foes with its cute appearance." }
        ],
        4: [
            { name: "Dialga", image: "⏰", types: ["steel", "dragon"], rarity: "legendary", hp: 100, attack: 120, defense: 120, fact: "Has power over time and can control it." },
            { name: "Palkia", image: "🌌", types: ["water", "dragon"], rarity: "legendary", hp: 90, attack: 120, defense: 100, fact: "Has power over space and can distort it." },
            { name: "Giratina", image: "👁️", types: ["ghost", "dragon"], rarity: "legendary", hp: 150, attack: 100, defense: 120, fact: "Ruler of the Distortion World." },
            { name: "Arceus", image: "🌟", types: ["normal"], rarity: "mythical", hp: 120, attack: 120, defense: 120, fact: "Created the Pokemon universe and is considered a god." },
            { name: "Infernape", image: "🔥", types: ["fire", "fighting"], rarity: "starter", hp: 76, attack: 104, defense: 71, fact: "The flame on its head never goes out." },
            { name: "Empoleon", image: "👑", types: ["water", "steel"], rarity: "starter", hp: 84, attack: 86, defense: 88, fact: "Proud as an emperor, never bows its head." },
            { name: "Torterra", image: "🌍", types: ["grass", "ground"], rarity: "starter", hp: 95, attack: 109, defense: 105, fact: "A small tree grows on its shell." },
            { name: "Garchomp", image: "🦈", types: ["dragon", "ground"], rarity: "common", hp: 108, attack: 130, defense: 95, fact: "Can fly at jet airplane speeds." },
            { name: "Lucario", image: "🥋", types: ["fighting", "steel"], rarity: "common", hp: 70, attack: 110, defense: 70, fact: "Can sense the aura of all living beings." },
            { name: "Darkrai", image: "🌑", types: ["dark"], rarity: "mythical", hp: 70, attack: 90, defense: 90, fact: "Causes nightmares to protect its life." }
        ],
        5: [
            { name: "Reshiram", image: "⚪", types: ["dragon", "fire"], rarity: "legendary", hp: 100, attack: 120, defense: 100, fact: "Pokemon of truth that can scorch the world with flames." },
            { name: "Zekrom", image: "⚫", types: ["dragon", "electric"], rarity: "legendary", hp: 100, attack: 150, defense: 120, fact: "Pokemon of ideals that can destroy the world with lightning." },
            { name: "Kyurem", image: "❄️", types: ["dragon", "ice"], rarity: "legendary", hp: 125, attack: 130, defense: 90, fact: "Remaining shell after the dragon split." },
            { name: "Serperior", image: "🐍", types: ["grass"], rarity: "starter", hp: 75, attack: 75, defense: 95, fact: "Looks down on anyone weaker than itself." },
            { name: "Emboar", image: "🔥", types: ["fire", "fighting"], rarity: "starter", hp: 110, attack: 123, defense: 65, fact: "Has a flame beard and is very fast." },
            { name: "Samurott", image: "⚔️", types: ["water"], rarity: "starter", hp: 95, attack: 100, defense: 85, fact: "Fights with swords on its legs in its own style." },
            { name: "Vikavolt", image: "⚡", types: ["bug", "electric"], rarity: "common", hp: 77, attack: 70, defense: 90, fact: "The fastest Pokemon among insects." },
            { name: "Chandelure", image: "🕯️", types: ["ghost", "fire"], rarity: "common", hp: 60, attack: 55, defense: 90, fact: "Its flames feed on life energy." },
            { name: "Haxorus", image: "🪓", types: ["dragon"], rarity: "common", hp: 76, attack: 147, defense: 90, fact: "Its tusks can slice through steel." },
            { name: "Golurk", image: "👤", types: ["ground", "ghost"], rarity: "common", hp: 89, attack: 124, defense: 80, fact: "Ancient robot created for protection." }
        ],
        6: [
            { name: "Yveltal", image: "🦅", types: ["dark", "flying"], rarity: "legendary", hp: 126, attack: 131, defense: 95, fact: "When it dies, it absorbs the life force of everything living." },
            { name: "Xerneas", image: "🦌", types: ["fairy"], rarity: "legendary", hp: 126, attack: 131, defense: 95, fact: "Can grant eternal life with its horns." },
            { name: "Zygarde", image: "🐍", types: ["dragon", "ground"], rarity: "legendary", hp: 108, attack: 100, defense: 121, fact: "Protector of ecosystem and order in nature." },
            { name: "Greninja", image: "🥷", types: ["water", "dark"], rarity: "starter", hp: 72, attack: 95, defense: 67, fact: "Moves like a ninja and creates water shurikens." },
            { name: "Delphox", image: "🔥", types: ["fire", "psychic"], rarity: "starter", hp: 75, attack: 69, defense: 72, fact: "Can predict the future by gazing into flames." },
            { name: "Chesnaught", image: "🦔", types: ["grass", "fighting"], rarity: "starter", hp: 88, attack: 107, defense: 122, fact: "Its shell can withstand a bomb explosion." },
            { name: "Talonflame", image: "🦅", types: ["fire", "flying"], rarity: "common", hp: 78, attack: 81, defense: 71, fact: "Has incredibly sharp eyesight for hunting." },
            { name: "Goodra", image: "🐲", types: ["dragon"], rarity: "common", hp: 90, attack: 100, defense: 70, fact: "The most friendly of all dragons." },
            { name: "Sylveon", image: "🎀", types: ["fairy"], rarity: "common", hp: 95, attack: 65, defense: 65, fact: "Uses ribbons to calm enemies." },
            { name: "Kangaskhan", image: "🦘", types: ["normal"], rarity: "common", hp: 105, attack: 95, defense: 80, fact: "Mega evolution allows baby to fight alongside mom." }
        ],
        7: [
            { name: "Solgaleo", image: "☀️", types: ["psychic", "steel"], rarity: "legendary", hp: 137, attack: 137, defense: 107, fact: "Embodies the sun and can absorb light." },
            { name: "Lunala", image: "🌙", types: ["psychic", "ghost"], rarity: "legendary", hp: 137, attack: 113, defense: 89, fact: "Embodies the moon and can create darkness." },
            { name: "Necrozma", image: "🔶", types: ["psychic"], rarity: "legendary", hp: 97, attack: 107, defense: 101, fact: "Absorbs light as a source of energy." },
            { name: "Decidueye", image: "🏹", types: ["grass", "ghost"], rarity: "starter", hp: 78, attack: 107, defense: 75, fact: "Can shoot feather arrows at the speed of sound." },
            { name: "Incineroar", image: "🔥", types: ["fire", "dark"], rarity: "starter", hp: 95, attack: 115, defense: 90, fact: "Loves to hit below the belt and uses dirty tricks." },
            { name: "Primarina", image: "🧜", types: ["water", "fairy"], rarity: "starter", hp: 80, attack: 74, defense: 74, fact: "Controls water balloons with its song." },
            { name: "Lycanroc", image: "🐺", types: ["rock"], rarity: "common", hp: 75, attack: 115, defense: 65, fact: "Faster than lightning and very proud." },
            { name: "Toxapex", image: "☠️", types: ["poison", "water"], rarity: "common", hp: 50, attack: 63, defense: 152, fact: "One of the most poisonous Pokemon." },
            { name: "Mimikyu", image: "👻", types: ["ghost", "fairy"], rarity: "common", hp: 55, attack: 90, defense: 80, fact: "Hides under a rag to avoid loneliness." },
            { name: "Kommo-o", image: "🐉", types: ["dragon", "fighting"], rarity: "common", hp: 75, attack: 110, defense: 125, fact: "Trains to fight the strongest opponents." }
        ],
        8: [
            { name: "Zacian", image: "⚔️", types: ["fairy", "steel"], rarity: "legendary", hp: 92, attack: 130, defense: 115, fact: "Holds metal in its teeth passed down through generations." },
            { name: "Zamazenta", image: "🛡️", types: ["fighting", "steel"], rarity: "legendary", hp: 92, attack: 130, defense: 115, fact: "Its body is harder than any metal." },
            { name: "Eternatus", image: "☠️", types: ["poison", "dragon"], rarity: "legendary", hp: 140, attack: 85, defense: 95, fact: "Arrived in a meteorite 20,000 years ago." },
            { name: "Rillaboom", image: "🥁", types: ["grass"], rarity: "starter", hp: 100, attack: 125, defense: 90, fact: "Attacks with roots that act like drumsticks." },
            { name: "Cinderace", image: "🔥", types: ["fire"], rarity: "starter", hp: 80, attack: 116, defense: 75, fact: "Can run at speeds of 120 km/h." },
            { name: "Inteleon", image: "🔫", types: ["water"], rarity: "starter", hp: 70, attack: 85, defense: 65, fact: "Can hit targets 3 km away." },
            { name: "Corviknight", image: "🖤", types: ["flying", "steel"], rarity: "common", hp: 98, attack: 87, defense: 105, fact: "The smartest among all flying Pokemon." },
            { name: "Toxtricity", image: "🎸", types: ["electric", "poison"], rarity: "common", hp: 75, attack: 98, defense: 70, fact: "Can generate electricity through toxic chemicals." },
            { name: "Hatterene", image: "🧙", types: ["psychic", "fairy"], rarity: "common", hp: 57, attack: 90, defense: 95, fact: "Can sense emotions from 10 km away." },
            { name: "Grimmsnarl", image: "👹", types: ["dark", "fairy"], rarity: "common", hp: 95, attack: 120, defense: 65, fact: "Uses its hair as hands for attacks." }
        ]
    };
    
    // Load statistics and history from localStorage
    let stats = {
        total: parseInt(localStorage.getItem('pokemonStats_total_en') || '0'),
        unique: JSON.parse(localStorage.getItem('pokemonStats_unique_en') || '[]'),
        generations: JSON.parse(localStorage.getItem('pokemonStats_generations_en') || '{}'),
        types: JSON.parse(localStorage.getItem('pokemonStats_types_en') || '{}')
    };
    
    let history = JSON.parse(localStorage.getItem('pokemonHistory_en') || '[]');
    
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
            alert('Please select at least one rarity type');
            return;
        }
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Finding Pokemon...</span>';
        
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
                alert('No Pokemon found for selected criteria');
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<span class="button-icon">⚡</span><span class="button-text">Generate Pokemon</span>';
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
                <h4>🏷️ Types:</h4>
                <p>${typeBadges}</p>
                <h4>⭐ Rarity:</h4>
                <p><span class="rarity-badge rarity-${randomPokemon.rarity}">${getRarityDisplayName(randomPokemon.rarity)}</span></p>
                <h4>📊 Stats:</h4>
                <p><strong>HP:</strong> ${randomPokemon.hp} | <strong>Attack:</strong> ${randomPokemon.attack} | <strong>Defense:</strong> ${randomPokemon.defense}</p>
                <h4>🌟 Generation:</h4>
                <p>${generation} (${getGenerationDisplayName(generation)})</p>
                <h4>💡 Interesting Fact:</h4>
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
                timestamp: new Date().toLocaleString('en-US')
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
            generateBtn.innerHTML = '<span class="button-icon">⚡</span><span class="button-text">Generate Pokemon</span>';
            
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
            fire: 'Fire',
            water: 'Water',
            grass: 'Grass',
            electric: 'Electric',
            psychic: 'Psychic',
            ice: 'Ice',
            dragon: 'Dragon',
            dark: 'Dark',
            fighting: 'Fighting',
            poison: 'Poison',
            ground: 'Ground',
            flying: 'Flying',
            bug: 'Bug',
            rock: 'Rock',
            ghost: 'Ghost',
            steel: 'Steel',
            fairy: 'Fairy',
            normal: 'Normal'
        };
        return displayNames[type] || type;
    }
    
    function getRarityDisplayName(rarity) {
        const displayNames = {
            common: 'Common',
            starter: 'Starter',
            legendary: 'Legendary',
            mythical: 'Mythical'
        };
        return displayNames[rarity] || rarity;
    }
    
    function getGenerationDisplayName(generation) {
        const displayNames = {
            1: 'Kanto',
            2: 'Johto',
            3: 'Hoenn',
            4: 'Sinnoh',
            5: 'Unova',
            6: 'Kalos',
            7: 'Alola',
            8: 'Galar'
        };
        return displayNames[generation] || `Generation ${generation}`;
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
            typeGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No data available</p>';
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
            historyList.innerHTML = '<p>History is empty. Generate your first Pokemon!</p>';
            return;
        }
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-image">${item.image}</div>
                <div class="history-details">
                    <div class="history-name">${item.name}</div>
                    <div class="history-meta">
                        <span class="rarity-badge rarity-${item.rarity}">${getRarityDisplayName(item.rarity)}</span>
                        <span>Gen ${item.generation}</span>
                        ${item.types.map(type => `<span class="type-badge type-${type}">${getTypeDisplayName(type)}</span>`).join(' ')}
                    </div>
                </div>
                <div class="history-time">${item.timestamp}</div>
            </div>
        `).join('');
    }
    
    function saveData() {
        localStorage.setItem('pokemonStats_total_en', stats.total.toString());
        localStorage.setItem('pokemonStats_unique_en', JSON.stringify(stats.unique));
        localStorage.setItem('pokemonStats_generations_en', JSON.stringify(stats.generations));
        localStorage.setItem('pokemonStats_types_en', JSON.stringify(stats.types));
        localStorage.setItem('pokemonHistory_en', JSON.stringify(history));
    }
    
    function resetStatistics() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            stats = { total: 0, unique: [], generations: {}, types: {} };
            saveData();
            updateStatsDisplay();
            updateTypeStats();
            
            // Reset display
            pokemonImage.textContent = '🔮';
            pokemonName.textContent = 'Click the button to generate!';
            pokemonDetails.innerHTML = '<p>Select generation and generate a random Pokemon</p>';
            pokemonCard.className = 'pokemon-card';
        }
    }
    
    function clearHistoryData() {
        if (confirm('Are you sure you want to clear the history?')) {
            history = [];
            localStorage.setItem('pokemonHistory_en', JSON.stringify(history));
            updateHistoryDisplay();
        }
    }
    
    // Auto-focus on generation select
    generationSelect.focus();
});