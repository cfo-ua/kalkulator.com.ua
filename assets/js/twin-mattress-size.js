document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');
    
    calculateBtn.addEventListener('click', calculateMattressSize);
    
    function calculateMattressSize() {
        const userHeight = parseFloat(document.getElementById('userHeight').value);
        const userAge = document.getElementById('userAge').value;
        const sleepStyle = document.getElementById('sleepStyle').value;
        const roomSize = document.getElementById('roomSize').value;
        const usage = document.getElementById('usage').value;
        const budget = document.getElementById('budget').value;
        
        if (isNaN(userHeight) || userHeight <= 0) {
            alert('Будь ласка, введіть коректний зріст');
            return;
        }
        
        const result = analyzeRequirements(userHeight, userAge, sleepStyle, roomSize, usage, budget);
        displayResults(result);
    }
    
    function analyzeRequirements(height, age, sleepStyle, roomSize, usage, budget) {
        // Mattress size options with scores
        const mattressSizes = [
            {
                name: 'Дитячий',
                widthCm: 80,
                lengthCm: 160,
                description: 'Для дітей до 8 років',
                priceRange: '2000-4000 грн',
                score: 0
            },
            {
                name: 'Дитячий подовжений',
                widthCm: 80,
                lengthCm: 180,
                description: 'Для дітей 6-12 років',
                priceRange: '2500-4500 грн',
                score: 0
            },
            {
                name: 'Single',
                widthCm: 90,
                lengthCm: 190,
                description: 'Європейський стандарт',
                priceRange: '3000-8000 грн',
                score: 0
            },
            {
                name: 'Single Long',
                widthCm: 90,
                lengthCm: 200,
                description: 'Подовжений європейський',
                priceRange: '3500-8500 грн',
                score: 0
            },
            {
                name: 'Twin (США)',
                widthCm: 99,
                lengthCm: 191,
                description: 'Американський стандарт',
                priceRange: '4000-9000 грн',
                score: 0
            },
            {
                name: 'Twin XL (США)',
                widthCm: 99,
                lengthCm: 203,
                description: 'Для високих людей',
                priceRange: '4500-10000 грн',
                score: 0
            }
        ];
        
        // Calculate scores for each mattress size
        mattressSizes.forEach(mattress => {
            let score = 0;
            
            // Height compatibility (most important factor)
            const requiredLength = height + 20; // Add 20cm for comfort
            if (mattress.lengthCm >= requiredLength) {
                score += 100;
                // Bonus for not being too long (efficiency)
                if (mattress.lengthCm - requiredLength <= 30) {
                    score += 20;
                }
            } else {
                score -= 50; // Heavy penalty for too short
            }
            
            // Age appropriateness
            if (age === 'child') {
                if (mattress.name.includes('Дитячий')) score += 50;
                if (mattress.widthCm <= 80) score += 30;
            } else if (age === 'preteen') {
                if (mattress.name.includes('Дитячий подовжений') || mattress.name.includes('Single')) score += 40;
                if (mattress.widthCm >= 80 && mattress.widthCm <= 90) score += 20;
            } else if (age === 'teen') {
                if (mattress.name.includes('Single') || mattress.name.includes('Twin')) score += 40;
                if (mattress.widthCm >= 90) score += 20;
            } else if (age === 'adult') {
                if (mattress.name.includes('Twin') || mattress.name.includes('Single')) score += 30;
                if (mattress.widthCm >= 90) score += 30;
            }
            
            // Sleep style considerations
            if (sleepStyle === 'calm') {
                score += 10; // Any size works for calm sleepers
            } else if (sleepStyle === 'active') {
                if (mattress.widthCm >= 90) score += 20;
                if (mattress.lengthCm >= 200) score += 15;
            } else if (sleepStyle === 'spread') {
                if (mattress.widthCm >= 99) score += 30;
                if (mattress.lengthCm >= 200) score += 20;
            }
            
            // Room size considerations
            if (roomSize === 'small') {
                if (mattress.widthCm <= 90) score += 25;
                if (mattress.name.includes('Дитячий')) score += 15;
            } else if (roomSize === 'medium') {
                if (mattress.widthCm >= 90 && mattress.widthCm <= 99) score += 20;
            } else if (roomSize === 'large') {
                if (mattress.widthCm >= 90) score += 15;
            }
            
            // Usage considerations
            if (usage === 'main') {
                if (mattress.lengthCm >= 190) score += 25;
                if (mattress.widthCm >= 90) score += 20;
            } else if (usage === 'guest') {
                if (mattress.name.includes('Single')) score += 20;
            } else if (usage === 'dorm') {
                if (mattress.name.includes('Twin XL')) score += 40;
                if (mattress.name.includes('Single Long')) score += 30;
            } else if (usage === 'child') {
                if (mattress.name.includes('Дитячий')) score += 50;
            }
            
            // Budget considerations
            const budgetRanges = {
                'economy': [0, 5000],
                'standard': [3000, 10000],
                'premium': [5000, 15000]
            };
            
            const budgetRange = budgetRanges[budget];
            const priceAvg = (parseFloat(mattress.priceRange.split('-')[0]) + parseFloat(mattress.priceRange.split('-')[1].replace(' грн', ''))) / 2;
            
            if (priceAvg >= budgetRange[0] && priceAvg <= budgetRange[1]) {
                score += 30;
            } else if (priceAvg < budgetRange[0]) {
                score += 10; // Cheaper is ok
            } else {
                score -= 20; // Too expensive
            }
            
            mattress.score = score;
        });
        
        // Sort by score
        mattressSizes.sort((a, b) => b.score - a.score);
        
        // Calculate room requirements
        const recommendedMattress = mattressSizes[0];
        const roomWidthNeeded = recommendedMattress.widthCm + 100; // Add 100cm for furniture and walkways
        const roomLengthNeeded = recommendedMattress.lengthCm + 150; // Add 150cm for furniture and walkways
        
        // Additional recommendations
        const recommendations = generateRecommendations(height, age, sleepStyle, roomSize, usage, budget, recommendedMattress);
        
        return {
            input: {
                height: height,
                age: age,
                sleepStyle: sleepStyle,
                roomSize: roomSize,
                usage: usage,
                budget: budget
            },
            recommended: recommendedMattress,
            alternatives: mattressSizes.slice(1, 4), // Top 3 alternatives
            allSizes: mattressSizes,
            room: {
                widthNeeded: roomWidthNeeded,
                lengthNeeded: roomLengthNeeded,
                areaNeeded: (roomWidthNeeded * roomLengthNeeded / 10000).toFixed(1)
            },
            recommendations: recommendations
        };
    }
    
    function generateRecommendations(height, age, sleepStyle, roomSize, usage, budget, mattress) {
        const recommendations = [];
        
        // Height-based recommendations
        if (height > 185) {
            recommendations.push("Через ваш високий зріст рекомендуємо матрац довжиною мінімум 200 см");
        } else if (height < 150) {
            recommendations.push("Для вашого зросту підійде компактний матрац, що заощадить простір");
        }
        
        // Age-based recommendations
        if (age === 'child' || age === 'preteen') {
            recommendations.push("Розгляньте матрац 'на виріст' — дитина швидко росте");
            recommendations.push("Переконайтесь, що матрац має ортопедичні властивості для правильного розвитку");
        } else if (age === 'teen') {
            recommendations.push("Twin XL популярний у студентських гуртожитках");
        }
        
        // Sleep style recommendations
        if (sleepStyle === 'active') {
            recommendations.push("Активним сплячам потрібен міцний край матраца");
        } else if (sleepStyle === 'spread') {
            recommendations.push("Розгляньте перехід на подвійний розмір, якщо дозволяє простір");
        }
        
        // Room size recommendations
        if (roomSize === 'small') {
            recommendations.push("Розгляньте ліжко з ящиками для зберігання");
        }
        
        // Budget recommendations
        if (budget === 'economy') {
            recommendations.push("Пінополіуретанові матраци — хороший бюджетний варіант");
        } else if (budget === 'premium') {
            recommendations.push("Розгляньте матраци з натуральними матеріалами");
        }
        
        return recommendations;
    }
    
    function getAgeGroupName(age) {
        const names = {
            'child': '3-8 років',
            'preteen': '9-12 років', 
            'teen': '13-17 років',
            'adult': '18+ років'
        };
        return names[age] || age;
    }
    
    function getSleepStyleName(style) {
        const names = {
            'calm': 'Спокійний',
            'active': 'Активний',
            'spread': 'Розкинутий'
        };
        return names[style] || style;
    }
    
    function getRoomSizeName(size) {
        const names = {
            'small': 'Мала кімната',
            'medium': 'Середня кімната',
            'large': 'Велика кімната'
        };
        return names[size] || size;
    }
    
    function getUsageName(usage) {
        const names = {
            'main': 'Основне ліжко',
            'guest': 'Гостьове ліжко',
            'dorm': 'Гуртожиток',
            'child': 'Дитяча кімната',
            'vacation': 'Дача/відпочинок'
        };
        return names[usage] || usage;
    }
    
    function displayResults(result) {
        const { input, recommended, alternatives, room, recommendations } = result;
        
        resultSection.innerHTML = `
            <div class="mattress-overview">
                <h3>🛏️ Рекомендація для користувача ${input.height} см</h3>
                <div class="mattress-info">
                    <div class="info-item">
                        <span class="info-number">${recommended.name}</span>
                        <div class="info-label">рекомендований розмір</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${recommended.widthCm}×${recommended.lengthCm}</span>
                        <div class="info-label">розміри (см)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${room.areaNeeded}</span>
                        <div class="info-label">площа кімнати (м²)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${recommended.priceRange}</span>
                        <div class="info-label">діапазон цін</div>
                    </div>
                </div>
            </div>
            
            <div class="insight-cards">
                <div class="insight-card success">
                    <h6>🎯 Ідеальний вибір</h6>
                    <div class="big-number">${recommended.name}</div>
                    <p>${recommended.widthCm}×${recommended.lengthCm} см</p>
                </div>
                
                <div class="insight-card info">
                    <h6>📐 Розміри кімнати</h6>
                    <div class="big-number">${room.widthNeeded}×${room.lengthNeeded}</div>
                    <p>Мінімальні розміри (см)</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>💰 Бюджет</h6>
                    <div class="big-number">${recommended.priceRange}</div>
                    <p>Орієнтовна вартість</p>
                </div>
            </div>
            
            <div class="recommendations-section">
                <h3>📊 Порівняння розмірів матраців</h3>
                
                <div class="size-comparison">
                    ${result.allSizes.map((mattress, index) => {
                        let className = 'size-option';
                        if (index === 0) className += ' recommended';
                        else if (mattress.score < 50) className += ' not-recommended';
                        
                        return `
                            <div class="${className}">
                                <h4>${mattress.name}</h4>
                                <p><strong>${mattress.widthCm}×${mattress.lengthCm} см</strong></p>
                                <p>${mattress.description}</p>
                                <p><strong>Ціна:</strong> ${mattress.priceRange}</p>
                                <p><strong>Оцінка:</strong> ${mattress.score} балів</p>
                                ${index === 0 ? '<p><em>🏆 Рекомендовано</em></p>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="insight-cards">
                    <div class="insight-card info">
                        <h6>👤 Ваш профіль</h6>
                        <p><strong>Зріст:</strong> ${input.height} см</p>
                        <p><strong>Вік:</strong> ${getAgeGroupName(input.age)}</p>
                        <p><strong>Стиль сну:</strong> ${getSleepStyleName(input.sleepStyle)}</p>
                        <p><strong>Кімната:</strong> ${getRoomSizeName(input.roomSize)}</p>
                        <p><strong>Призначення:</strong> ${getUsageName(input.usage)}</p>
                    </div>
                    
                    <div class="insight-card success">
                        <h6>✅ Чому ${recommended.name}?</h6>
                        <p>${recommended.description}</p>
                        <p><strong>Довжина:</strong> ${recommended.lengthCm - input.height} см запасу</p>
                        <p><strong>Ширина:</strong> ${recommended.widthCm} см для комфорту</p>
                    </div>
                    
                    <div class="insight-card warning">
                        <h6>🏠 Вимоги до простору</h6>
                        <p><strong>Мінімальна кімната:</strong> ${room.widthNeeded}×${room.lengthNeeded} см</p>
                        <p><strong>Площа:</strong> ${room.areaNeeded} м²</p>
                        <p><em>Включає простір для меблів</em></p>
                    </div>
                </div>
                
                <div class="tips-grid">
                    <div class="tip-item">
                        <h4>📏 Правила вибору розміру</h4>
                        <ul>
                            <li>Довжина матраца = зріст + 15-20 см</li>
                            <li>Мінімальна ширина для комфорту — 80 см</li>
                            <li>Для активних сплячів — ширше 90 см</li>
                            <li>Врахуйте "ріст на майбутнє" для дітей</li>
                            <li>Перевірте розміри ліжка перед покупкою</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🏠 Планування простору</h4>
                        <ul>
                            <li>Залиште 60-80 см з боку ліжка для проходу</li>
                            <li>Мінімум 100 см в ногах для комфорту</li>
                            <li>Врахуйте простір для шаф та столу</li>
                            <li>Розгляньте ліжко з ящиками для зберігання</li>
                            <li>Оптимальна висота матраца — 45-60 см від підлоги</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>💰 Поради з бюджету</h4>
                        <ul>
                            <li>Якісний матрац служить 8-10 років</li>
                            <li>Пінополіуретан — хороший бюджетний варіант</li>
                            <li>Пружинні матраци довговічніші за поролонові</li>
                            <li>Незалежні пружини — найкращий компроміс</li>
                            <li>Не економте на матраці для основного ліжка</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🔍 Персональні рекомендації</h4>
                        <ul>
                            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            <li>Обов'язково протестуйте матрац перед покупкою</li>
                            <li>Враховуйте жорсткість залежно від ваги та віку</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        resultSection.classList.add('show');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Auto-calculate on input change for better UX
    const inputs = ['userHeight', 'userAge', 'sleepStyle', 'roomSize', 'usage', 'budget'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', debounce(() => {
                if (resultSection.classList.contains('show')) {
                    calculateMattressSize();
                }
            }, 300));
        }
    });
    
    // Also trigger on input for height field
    document.getElementById('userHeight').addEventListener('input', debounce(() => {
        if (resultSection.classList.contains('show')) {
            calculateMattressSize();
        }
    }, 500));
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});