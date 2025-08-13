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
            { name: "Лев", icon: "🦁", habitat: "Африканська савана", fact: "Леви живуть зграями до 30 особин і можуть розвивати швидкість до 80 км/год." },
            { name: "Тигр", icon: "🐅", habitat: "Азійські джунглі", fact: "Тигри - найбільші коти у світі, кожен має унікальний візерунок смуг." },
            { name: "Ведмідь", icon: "🐻", habitat: "Ліси та гори", fact: "Ведмеді можуть бігти зі швидкістю до 55 км/год і мають відмінну пам'ять." },
            { name: "Вовк", icon: "🐺", habitat: "Ліси та тундра", fact: "Вовки мають складну соціальну структуру та спілкуються виттям на відстані до 10 км." },
            { name: "Жираф", icon: "🦒", habitat: "Африканська савана", fact: "Жирафи - найвищі тварини на Землі, їх серце важить до 11 кг." },
            { name: "Слон", icon: "🐘", habitat: "Савана та джунглі", fact: "Слони мають найкращу пам'ять серед тварин і можуть плакати від горя." },
            { name: "Носоріг", icon: "🦏", habitat: "Савана та болота", fact: "Носороги існують на Землі понад 50 мільйонів років." },
            { name: "Зебра", icon: "🦓", habitat: "Африканська савана", fact: "Кожна зебра має унікальний візерунок смуг, як відбитки пальців у людей." },
            { name: "Гепард", icon: "🐆", habitat: "Африканська савана", fact: "Гепарди - найшвидші наземні тварини, розвивають швидкість до 120 км/год." },
            { name: "Кенгуру", icon: "🦘", habitat: "Австралійські луки", fact: "Кенгуру не можуть рухатися назад через будову задніх лап." }
        ],
        domestic: [
            { name: "Кіт", icon: "🐱", habitat: "Дім", fact: "Коти проводять 70% життя уві сні та мають 32 м'язи у вухах." },
            { name: "Собака", icon: "🐶", habitat: "Дім", fact: "Собаки розрізняють понад 1000 слів і мають нюх у 40 разів кращий за людський." },
            { name: "Хом'як", icon: "🐹", habitat: "Дім", fact: "Хом'яки можуть зберігати їжу в щічних мішках, що збільшують їх голову вдвічі." },
            { name: "Кролик", icon: "🐰", habitat: "Дім та луки", fact: "Зуби кроликів ростуть протягом усього життя, за рік - до 12 см." },
            { name: "Морська свинка", icon: "🐹", habitat: "Дім", fact: "Морські свинки спілкуються за допомогою понад 10 різних звуків." },
            { name: "Корова", icon: "🐄", habitat: "Ферма", fact: "Корови мають найкращих друзів та можуть страждати від стресу при розлуці." },
            { name: "Свиня", icon: "🐷", habitat: "Ферма", fact: "Свині розумніші за собак та можуть вивчити свої імена за тиждень." },
            { name: "Кінь", icon: "🐴", habitat: "Ферма та луки", fact: "Коні можуть спати як лежачи, так і стоячи, та запам'ятовують людські емоції." },
            { name: "Коза", icon: "🐐", habitat: "Ферма та гори", fact: "Кози мають прямокутні зіниці та можуть дивитися майже на 360 градусів." },
            { name: "Вівця", icon: "🐑", habitat: "Ферма та луки", fact: "Вівці можуть запам'ятати до 50 облич людей протягом 2 років." }
        ],
        marine: [
            { name: "Дельфін", icon: "🐬", habitat: "Океани та моря", fact: "Дельфіни мають імена - унікальний свист, який використовують для ідентифікації." },
            { name: "Акула", icon: "🦈", habitat: "Океани та моря", fact: "Акули існують на Землі понад 400 мільйонів років, пережили динозаврів." },
            { name: "Кит", icon: "🐋", habitat: "Океани", fact: "Сині кити - найбільші тварини, що коли-небудь жили на Землі." },
            { name: "Восьминіг", icon: "🐙", habitat: "Океани та моря", fact: "Восьминоги мають три серця та блакитну кров." },
            { name: "Морська зірка", icon: "⭐", habitat: "Морське дно", fact: "Морські зірки можуть відновлювати втрачені промені протягом року." },
            { name: "Краб", icon: "🦀", habitat: "Узбережжя", fact: "Краби ходять боком через будову суглобів ніг." },
            { name: "Лобстер", icon: "🦞", habitat: "Морське дно", fact: "Лобстери можливо є безсмертними - теоретично можуть жити вічно." },
            { name: "Медуза", icon: "☂️", habitat: "Океани та моря", fact: "Медузи існують понад 500 мільйонів років і складаються на 95% з води." },
            { name: "Морський коник", icon: "🐴", habitat: "Коралові рифи", fact: "Морські коники - єдині тварини, де самці вагітніють та народжують." },
            { name: "Черепаха морська", icon: "🐢", habitat: "Океани", fact: "Морські черепахи орієнтуються по магнітному полю Землі." }
        ],
        birds: [
            { name: "Орел", icon: "🦅", habitat: "Гори та ліси", fact: "Орли можуть побачити мишу з відстані 3 км та пірнати зі швидкістю 320 км/год." },
            { name: "Папуга", icon: "🦜", habitat: "Тропічні ліси", fact: "Папуги можуть жити понад 100 років та вивчити сотні слів." },
            { name: "Пінгвін", icon: "🐧", habitat: "Антарктида", fact: "Пінгвіни можуть стрибати з води на висоту до 3 метрів." },
            { name: "Фламінго", icon: "🦩", habitat: "Солоні озера", fact: "Фламінго рожеві через креветки та водорості, які вони їдять." },
            { name: "Сова", icon: "🦉", habitat: "Ліси", fact: "Сови можуть повертати голову на 270 градусів та мають асиметричні вуха." },
            { name: "Колібрі", icon: "🐦", habitat: "Тропічні ліси", fact: "Колібрі - єдині птахи, що можуть літати назад та махають крилами 80 разів за секунду." },
            { name: "Пелікан", icon: "🦆", habitat: "Узбережжя", fact: "Пелікани можуть вміщати у дзьоб до 13 літрів води." },
            { name: "Страус", icon: "🐦", habitat: "Африканська савана", fact: "Страуси - найбільші птахи у світі, можуть бігти зі швидкістю 70 км/год." },
            { name: "Журавель", icon: "🐦", habitat: "Болота та луки", fact: "Журавлі танцюють під час шлюбних ритуалів та можуть жити до 80 років." },
            { name: "Качка", icon: "🦆", habitat: "Озера та річки", fact: "Каченята вміють плавати і пірнати з першого дня життя." }
        ],
        insects: [
            { name: "Метелик", icon: "🦋", habitat: "Квіткові луки", fact: "Метелики куштують їжу ногами та бачать ультрафіолетові кольори." },
            { name: "Бджола", icon: "🐝", habitat: "Квіткові луки", fact: "Бджоли танцем показують іншим напрямок до квітів та відстань до них." },
            { name: "Мураха", icon: "🐜", habitat: "Всюди на суші", fact: "Мурахи можуть підіймати вагу у 50 разів більше власної та живуть колоніями до 20 мільйонів особин." },
            { name: "Жук", icon: "🪲", habitat: "Ліси та луки", fact: "Жуки складають 25% усіх тваринних видів на Землі." },
            { name: "Павук", icon: "🕷️", habitat: "Всюди", fact: "Павутина міцніша за сталь того ж діаметру." },
            { name: "Сверчок", icon: "🦗", habitat: "Луки та поля", fact: "Сверчки 'співають' потираючи крила та можуть стрибати у 20 разів далі власного зросту." },
            { name: "Богомол", icon: "🦗", habitat: "Сади та луки", fact: "Богомоли - єдині комахи, що можуть повертати голову на 180 градусів." },
            { name: "Стрекоза", icon: "🦋", habitat: "Біля води", fact: "Стрекози існують понад 300 мільйонів років та можуть літати в усіх напрямках." },
            { name: "Світлячок", icon: "✨", habitat: "Ліси та поля", fact: "Світлячки виробляють холодне світло з ефективністю 96%." },
            { name: "Кузнечик", icon: "🦗", habitat: "Луки та поля", fact: "Кузнечики чують вухами, розташованими на лапках." }
        ],
        reptiles: [
            { name: "Змія", icon: "🐍", habitat: "Ліси та пустелі", fact: "Змії можуть роз'єднувати щелепи та ковтати здобич у 3 рази ширшу за власну голову." },
            { name: "Ящірка", icon: "🦎", habitat: "Пустелі та ліси", fact: "Ящірки можуть відкидати хвіст для втечі від хижаків." },
            { name: "Черепаха", icon: "🐢", habitat: "Луки та болота", fact: "Черепахи можуть жити понад 200 років та орієнтуються по зіркам." },
            { name: "Крокодил", icon: "🐊", habitat: "Річки та болота", fact: "Крокодили не змінилися за 200 мільйонів років та мають найсильніший укус серед тварин." },
            { name: "Алігатор", icon: "🐊", habitat: "Болота", fact: "Алігатори можуть регенерувати зуби - за життя у них виростає до 3000 зубів." },
            { name: "Хамелеон", icon: "🦎", habitat: "Тропічні ліси", fact: "Хамелеони змінюють колір не лише для маскування, а й для спілкування." },
            { name: "Ігуана", icon: "🦎", habitat: "Тропічні ліси", fact: "Ігуани мають третє око на верхівці голови для виявлення хижаків зверху." },
            { name: "Геко", icon: "🦎", habitat: "Тропічні регіони", fact: "Геко можуть бігати по стелі завдяки мільйонам волосків на лапках." },
            { name: "Варан", icon: "🦎", habitat: "Пустелі та ліси", fact: "Варани мають роздвоєний язик, яким 'нюхають' повітря." },
            { name: "Анаконда", icon: "🐍", habitat: "Тропічні річки", fact: "Анаконди - найважчі змії у світі, можуть важити до 250 кг." }
        ]
    };
    
    // Load statistics and history from localStorage
    let stats = {
        total: parseInt(localStorage.getItem('animalStats_total_ua') || '0'),
        unique: JSON.parse(localStorage.getItem('animalStats_unique_ua') || '[]'),
        categories: JSON.parse(localStorage.getItem('animalStats_categories_ua') || '{}')
    };
    
    let history = JSON.parse(localStorage.getItem('animalHistory_ua') || '[]');
    
    updateStatsDisplay();
    updateHistoryDisplay();
    
    generateBtn.addEventListener('click', generateAnimal);
    resetStats.addEventListener('click', resetStatistics);
    clearHistory.addEventListener('click', clearHistoryData);
    
    function generateAnimal() {
        const selectedCategory = categorySelect.value;
        
        // Disable button and show loading
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="button-icon">⏳</span><span class="button-text">Шукаю тварину...</span>';
        
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
                <h4>🏠 Середовище проживання:</h4>
                <p>${randomAnimal.habitat}</p>
                <h4>💡 Цікавий факт:</h4>
                <p>${randomAnimal.fact}</p>
                <h4>📂 Категорія:</h4>
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
                timestamp: new Date().toLocaleString('uk-UA')
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
            generateBtn.innerHTML = '<span class="button-icon">🦁</span><span class="button-text">Згенерувати тварину</span>';
            
        }, 800);
    }
    
    function getCategoryDisplayName(category) {
        const displayNames = {
            wild: 'Дикі тварини',
            domestic: 'Домашні тварини',
            marine: 'Морські істоти',
            birds: 'Пташки',
            insects: 'Комахи',
            reptiles: 'Рептилії'
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
            historyList.innerHTML = '<p>Історія порожня. Згенеруйте першу тварину!</p>';
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
        localStorage.setItem('animalStats_total_ua', stats.total.toString());
        localStorage.setItem('animalStats_unique_ua', JSON.stringify(stats.unique));
        localStorage.setItem('animalStats_categories_ua', JSON.stringify(stats.categories));
        localStorage.setItem('animalHistory_ua', JSON.stringify(history));
    }
    
    function resetStatistics() {
        if (confirm('Ви впевнені, що хочете скинути всю статистику?')) {
            stats = { total: 0, unique: [], categories: {} };
            saveData();
            updateStatsDisplay();
            
            // Reset display
            animalIcon.textContent = '🐾';
            animalName.textContent = 'Натисніть кнопку для генерації!';
            animalDetails.innerHTML = '<p>Виберіть категорію та згенеруйте випадкову тварину</p>';
            animalCard.className = 'animal-card';
        }
    }
    
    function clearHistoryData() {
        if (confirm('Ви впевнені, що хочете очистити історію?')) {
            history = [];
            localStorage.setItem('animalHistory_ua', JSON.stringify(history));
            updateHistoryDisplay();
        }
    }
    
    // Auto-focus on category select
    categorySelect.focus();
});