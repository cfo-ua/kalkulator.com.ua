document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const categorySelect = document.getElementById('animalCategory');
    const animalCard = document.getElementById('animalCard');
    const animalIcon = document.getElementById('animalIcon');
    const animalName = document.getElementById('animalName');
    const animalDetails = document.getElementById('animalDetails');
    const totalGenerated = document.getElementById('totalGenerated');
    const uniqueAnimals = document.getElementById('uniqueAnimals');
    const favoriteCategory = document.getElementById('favoriteCategory');
    const resetStats = document.getElementById('resetStats');
    const historyList = document.getElementById('historyList');
    const clearHistory = document.getElementById('clearHistory');
    
    // Animals database
    const animalsDatabase = {
        wild: [
            { name: "Lion", icon: "🦁", habitat: "African savanna", fact: "Lions live in prides of up to 30 individuals and can reach speeds of up to 80 km/h." },
            { name: "Tiger", icon: "🐅", habitat: "Asian jungles", fact: "Tigers are the largest cats in the world, each having a unique stripe pattern." },
            { name: "Bear", icon: "🐻", habitat: "Forests and mountains", fact: "Bears can run at speeds up to 55 km/h and have excellent memory." },
            { name: "Wolf", icon: "🐺", habitat: "Forests and tundra", fact: "Wolves have complex social structures and communicate through howling across distances up to 10 km." },
            { name: "Giraffe", icon: "🦒", habitat: "African savanna", fact: "Giraffes are the tallest animals on Earth, their hearts weigh up to 11 kg." },
            { name: "Elephant", icon: "🐘", habitat: "Savanna and jungles", fact: "Elephants have the best memory among animals and can cry from grief." },
            { name: "Rhinoceros", icon: "🦏", habitat: "Savanna and swamps", fact: "Rhinoceros have existed on Earth for over 50 million years." },
            { name: "Zebra", icon: "🦓", habitat: "African savanna", fact: "Each zebra has a unique stripe pattern, like human fingerprints." },
            { name: "Cheetah", icon: "🐆", habitat: "African savanna", fact: "Cheetahs are the fastest land animals, reaching speeds up to 120 km/h." },
            { name: "Kangaroo", icon: "🦘", habitat: "Australian grasslands", fact: "Kangaroos cannot move backwards due to the structure of their hind legs." }
        ],
        domestic: [
            { name: "Cat", icon: "🐱", habitat: "Home", fact: "Cats spend 70% of their lives sleeping and have 32 muscles in their ears." },
            { name: "Dog", icon: "🐶", habitat: "Home", fact: "Dogs can distinguish over 1000 words and have a sense of smell 40 times better than humans." },
            { name: "Hamster", icon: "🐹", habitat: "Home", fact: "Hamsters can store food in their cheek pouches, doubling their head size." },
            { name: "Rabbit", icon: "🐰", habitat: "Home and meadows", fact: "Rabbit teeth grow throughout their lives, up to 12 cm per year." },
            { name: "Guinea Pig", icon: "🐹", habitat: "Home", fact: "Guinea pigs communicate using over 10 different sounds." },
            { name: "Cow", icon: "🐄", habitat: "Farm", fact: "Cows have best friends and can suffer from stress when separated." },
            { name: "Pig", icon: "🐷", habitat: "Farm", fact: "Pigs are smarter than dogs and can learn their names within a week." },
            { name: "Horse", icon: "🐴", habitat: "Farm and meadows", fact: "Horses can sleep both lying down and standing up, and remember human emotions." },
            { name: "Goat", icon: "🐐", habitat: "Farm and mountains", fact: "Goats have rectangular pupils and can see nearly 360 degrees." },
            { name: "Sheep", icon: "🐑", habitat: "Farm and meadows", fact: "Sheep can remember up to 50 human faces for 2 years." }
        ],
        marine: [
            { name: "Dolphin", icon: "🐬", habitat: "Oceans and seas", fact: "Dolphins have names - unique whistles they use for identification." },
            { name: "Shark", icon: "🦈", habitat: "Oceans and seas", fact: "Sharks have existed on Earth for over 400 million years, surviving the dinosaurs." },
            { name: "Whale", icon: "🐋", habitat: "Oceans", fact: "Blue whales are the largest animals that have ever lived on Earth." },
            { name: "Octopus", icon: "🐙", habitat: "Oceans and seas", fact: "Octopuses have three hearts and blue blood." },
            { name: "Starfish", icon: "⭐", habitat: "Ocean floor", fact: "Starfish can regenerate lost arms within a year." },
            { name: "Crab", icon: "🦀", habitat: "Coastlines", fact: "Crabs walk sideways due to the structure of their leg joints." },
            { name: "Lobster", icon: "🦞", habitat: "Ocean floor", fact: "Lobsters are possibly immortal - they could theoretically live forever." },
            { name: "Jellyfish", icon: "☂️", habitat: "Oceans and seas", fact: "Jellyfish have existed for over 500 million years and are 95% water." },
            { name: "Seahorse", icon: "🐴", habitat: "Coral reefs", fact: "Seahorses are the only animals where males get pregnant and give birth." },
            { name: "Sea Turtle", icon: "🐢", habitat: "Oceans", fact: "Sea turtles navigate using Earth's magnetic field." }
        ],
        birds: [
            { name: "Eagle", icon: "🦅", habitat: "Mountains and forests", fact: "Eagles can see a mouse from 3 km away and dive at speeds of 320 km/h." },
            { name: "Parrot", icon: "🦜", habitat: "Tropical forests", fact: "Parrots can live over 100 years and learn hundreds of words." },
            { name: "Penguin", icon: "🐧", habitat: "Antarctica", fact: "Penguins can jump out of water up to 3 meters high." },
            { name: "Flamingo", icon: "🦩", habitat: "Salt lakes", fact: "Flamingos are pink due to the shrimp and algae they eat." },
            { name: "Owl", icon: "🦉", habitat: "Forests", fact: "Owls can turn their heads 270 degrees and have asymmetrical ears." },
            { name: "Hummingbird", icon: "🐦", habitat: "Tropical forests", fact: "Hummingbirds are the only birds that can fly backwards and beat their wings 80 times per second." },
            { name: "Pelican", icon: "🦆", habitat: "Coastlines", fact: "Pelicans can hold up to 13 liters of water in their beaks." },
            { name: "Ostrich", icon: "🐦", habitat: "African savanna", fact: "Ostriches are the largest birds in the world and can run at 70 km/h." },
            { name: "Crane", icon: "🐦", habitat: "Wetlands and meadows", fact: "Cranes dance during mating rituals and can live up to 80 years." },
            { name: "Duck", icon: "🦆", habitat: "Lakes and rivers", fact: "Ducklings can swim and dive from their first day of life." }
        ],
        insects: [
            { name: "Butterfly", icon: "🦋", habitat: "Flower meadows", fact: "Butterflies taste food with their feet and can see ultraviolet colors." },
            { name: "Bee", icon: "🐝", habitat: "Flower meadows", fact: "Bees use dance to show other bees the direction and distance to flowers." },
            { name: "Ant", icon: "🐜", habitat: "Everywhere on land", fact: "Ants can lift 50 times their own weight and live in colonies of up to 20 million individuals." },
            { name: "Beetle", icon: "🪲", habitat: "Forests and meadows", fact: "Beetles make up 25% of all animal species on Earth." },
            { name: "Spider", icon: "🕷️", habitat: "Everywhere", fact: "Spider silk is stronger than steel of the same diameter." },
            { name: "Cricket", icon: "🦗", habitat: "Meadows and fields", fact: "Crickets 'sing' by rubbing their wings and can jump 20 times their body length." },
            { name: "Praying Mantis", icon: "🦗", habitat: "Gardens and meadows", fact: "Praying mantises are the only insects that can turn their heads 180 degrees." },
            { name: "Dragonfly", icon: "🦋", habitat: "Near water", fact: "Dragonflies have existed for over 300 million years and can fly in all directions." },
            { name: "Firefly", icon: "✨", habitat: "Forests and fields", fact: "Fireflies produce cold light with 96% efficiency." },
            { name: "Grasshopper", icon: "🦗", habitat: "Meadows and fields", fact: "Grasshoppers hear with ears located on their legs." }
        ],
        reptiles: [
            { name: "Snake", icon: "🐍", habitat: "Forests and deserts", fact: "Snakes can unhinge their jaws and swallow prey 3 times wider than their head." },
            { name: "Lizard", icon: "🦎", habitat: "Deserts and forests", fact: "Lizards can drop their tails to escape from predators." },
            { name: "Turtle", icon: "🐢", habitat: "Meadows and swamps", fact: "Turtles can live over 200 years and navigate by the stars." },
            { name: "Crocodile", icon: "🐊", habitat: "Rivers and swamps", fact: "Crocodiles haven't changed in 200 million years and have the strongest bite among animals." },
            { name: "Alligator", icon: "🐊", habitat: "Swamps", fact: "Alligators can regenerate teeth - they grow up to 3000 teeth in their lifetime." },
            { name: "Chameleon", icon: "🦎", habitat: "Tropical forests", fact: "Chameleons change color not only for camouflage but also for communication." },
            { name: "Iguana", icon: "🦎", habitat: "Tropical forests", fact: "Iguanas have a third eye on top of their head to detect predators from above." },
            { name: "Gecko", icon: "🦎", habitat: "Tropical regions", fact: "Geckos can run on ceilings thanks to millions of hairs on their feet." },
            { name: "Monitor Lizard", icon: "🦎", habitat: "Deserts and forests", fact: "Monitor lizards have forked tongues that they use to 'smell' the air." },
            { name: "Anaconda", icon: "🐍", habitat: "Tropical rivers", fact: "Anacondas are the heaviest snakes in the world, weighing up to 250 kg." }
        ]
    };
    
    // Load statistics and history from localStorage
    let stats = {
        total: parseInt(localStorage.getItem('animalStats_total_en') || '0'),
        unique: JSON.parse(localStorage.getItem('animalStats_unique_en') || '[]'),
        categories: JSON.parse(localStorage.getItem('animalStats_categories_en') || '{}')
    };
    
    let history = JSON.parse(localStorage.getItem('animalHistory_en') || '[]');
    
    updateStatsDisplay();
    updateHistoryDisplay();
    
    generateBtn.addEventListener('click', generateAnimal);
    resetStats.addEventListener('click', resetStatistics);
    clearHistory.addEventListener('click', clearHistoryData);
    
    function generateAnimal() {
        const selectedCategory = categorySelect.value;
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Finding animal...</span>';
        
        // Add loading animation
        animalCard.style.transform = 'scale(0.95)';
        animalIcon.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            let availableAnimals = [];
            
            if (selectedCategory === 'all') {
                // Combine all categories
                Object.values(animalsDatabase).forEach(category => {
                    availableAnimals = availableAnimals.concat(category.map(animal => ({
                        ...animal,
                        category: Object.keys(animalsDatabase).find(key => 
                            animalsDatabase[key].includes(category.find(a => a.name === animal.name))
                        )
                    })));
                });
            } else {
                availableAnimals = animalsDatabase[selectedCategory].map(animal => ({
                    ...animal,
                    category: selectedCategory
                }));
            }
            
            // Generate random animal
            const randomAnimal = availableAnimals[Math.floor(Math.random() * availableAnimals.length)];
            
            // Update display
            animalIcon.textContent = randomAnimal.icon;
            animalName.textContent = randomAnimal.name;
            animalDetails.innerHTML = `
                <h4>🏠 Habitat:</h4>
                <p>${randomAnimal.habitat}</p>
                <h4>💡 Interesting Fact:</h4>
                <p>${randomAnimal.fact}</p>
                <h4>📂 Category:</h4>
                <p>${getCategoryDisplayName(randomAnimal.category)}</p>
            `;
            
            // Update card styling based on category
            animalCard.className = `animal-card ${randomAnimal.category}`;
            
            // Update statistics
            stats.total++;
            if (!stats.unique.includes(randomAnimal.name)) {
                stats.unique.push(randomAnimal.name);
            }
            if (!stats.categories[randomAnimal.category]) {
                stats.categories[randomAnimal.category] = 0;
            }
            stats.categories[randomAnimal.category]++;
            
            // Add to history
            const historyItem = {
                ...randomAnimal,
                timestamp: new Date().toLocaleString('en-US')
            };
            history.unshift(historyItem);
            if (history.length > 50) {
                history = history.slice(0, 50); // Keep only last 50
            }
            
            saveData();
            updateStatsDisplay();
            updateHistoryDisplay();
            
            // Restore animations
            animalCard.style.transform = 'scale(1)';
            animalIcon.style.transform = 'scale(1)';
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="button-icon">🦁</span><span class="button-text">Generate Animal</span>';
            
        }, 800);
    }
    
    function getCategoryDisplayName(category) {
        const displayNames = {
            wild: 'Wild Animals',
            domestic: 'Domestic Animals',
            marine: 'Marine Creatures',
            birds: 'Birds',
            insects: 'Insects',
            reptiles: 'Reptiles'
        };
        return displayNames[category] || category;
    }
    
    function updateStatsDisplay() {
        totalGenerated.textContent = stats.total;
        uniqueAnimals.textContent = stats.unique.length;
        
        // Find favorite category
        let favCategory = '-';
        let maxCount = 0;
        for (const [category, count] of Object.entries(stats.categories)) {
            if (count > maxCount) {
                maxCount = count;
                favCategory = getCategoryDisplayName(category);
            }
        }
        favoriteCategory.textContent = favCategory;
    }
    
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historyList.innerHTML = '<p>History is empty. Generate your first animal!</p>';
            return;
        }
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-icon">${item.icon}</div>
                <div class="history-details">
                    <div class="history-name">${item.name}</div>
                    <div class="history-category">${getCategoryDisplayName(item.category)}</div>
                </div>
                <div class="history-time">${item.timestamp}</div>
            </div>
        `).join('');
    }
    
    function saveData() {
        localStorage.setItem('animalStats_total_en', stats.total.toString());
        localStorage.setItem('animalStats_unique_en', JSON.stringify(stats.unique));
        localStorage.setItem('animalStats_categories_en', JSON.stringify(stats.categories));
        localStorage.setItem('animalHistory_en', JSON.stringify(history));
    }
    
    function resetStatistics() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            stats = { total: 0, unique: [], categories: {} };
            saveData();
            updateStatsDisplay();
            
            // Reset display
            animalIcon.textContent = '🐾';
            animalName.textContent = 'Click the button to generate!';
            animalDetails.innerHTML = '<p>Select a category and generate a random animal</p>';
            animalCard.className = 'animal-card';
        }
    }
    
    function clearHistoryData() {
        if (confirm('Are you sure you want to clear the history?')) {
            history = [];
            localStorage.setItem('animalHistory_en', JSON.stringify(history));
            updateHistoryDisplay();
        }
    }
    
    // Auto-focus on category select
    categorySelect.focus();
});