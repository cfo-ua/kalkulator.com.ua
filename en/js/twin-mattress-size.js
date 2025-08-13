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
            alert('Please enter a valid height');
            return;
        }
        
        const result = analyzeRequirements(userHeight, userAge, sleepStyle, roomSize, usage, budget);
        displayResults(result);
    }
    
    function analyzeRequirements(height, age, sleepStyle, roomSize, usage, budget) {
        // Mattress size options with scores
        const mattressSizes = [
            {
                name: 'Youth',
                widthIn: 31,
                lengthIn: 63,
                widthCm: 80,
                lengthCm: 160,
                description: 'For children under 8 years',
                priceRange: '$100-$250',
                score: 0
            },
            {
                name: 'Youth Extended',
                widthIn: 31,
                lengthIn: 71,
                widthCm: 80,
                lengthCm: 180,
                description: 'For children 6-12 years',
                priceRange: '$150-$300',
                score: 0
            },
            {
                name: 'Single',
                widthIn: 35,
                lengthIn: 75,
                widthCm: 90,
                lengthCm: 190,
                description: 'European standard',
                priceRange: '$200-$500',
                score: 0
            },
            {
                name: 'Single Long',
                widthIn: 35,
                lengthIn: 79,
                widthCm: 90,
                lengthCm: 200,
                description: 'Extended European',
                priceRange: '$250-$550',
                score: 0
            },
            {
                name: 'Twin',
                widthIn: 39,
                lengthIn: 75,
                widthCm: 99,
                lengthCm: 191,
                description: 'US standard single',
                priceRange: '$250-$600',
                score: 0
            },
            {
                name: 'Twin XL',
                widthIn: 39,
                lengthIn: 80,
                widthCm: 99,
                lengthCm: 203,
                description: 'For tall people and dorms',
                priceRange: '$300-$700',
                score: 0
            }
        ];
        
        // Calculate scores for each mattress size
        mattressSizes.forEach(mattress => {
            let score = 0;
            
            // Height compatibility (most important factor)
            const requiredLength = height + 8; // Add 8 inches for comfort
            if (mattress.lengthIn >= requiredLength) {
                score += 100;
                // Bonus for not being too long (efficiency)
                if (mattress.lengthIn - requiredLength <= 12) {
                    score += 20;
                }
            } else {
                score -= 50; // Heavy penalty for too short
            }
            
            // Age appropriateness
            if (age === 'child') {
                if (mattress.name.includes('Youth')) score += 50;
                if (mattress.widthIn <= 31) score += 30;
            } else if (age === 'preteen') {
                if (mattress.name.includes('Youth Extended') || mattress.name.includes('Single')) score += 40;
                if (mattress.widthIn >= 31 && mattress.widthIn <= 35) score += 20;
            } else if (age === 'teen') {
                if (mattress.name.includes('Single') || mattress.name.includes('Twin')) score += 40;
                if (mattress.widthIn >= 35) score += 20;
            } else if (age === 'adult') {
                if (mattress.name.includes('Twin') || mattress.name.includes('Single')) score += 30;
                if (mattress.widthIn >= 35) score += 30;
            }
            
            // Sleep style considerations
            if (sleepStyle === 'calm') {
                score += 10; // Any size works for calm sleepers
            } else if (sleepStyle === 'active') {
                if (mattress.widthIn >= 35) score += 20;
                if (mattress.lengthIn >= 79) score += 15;
            } else if (sleepStyle === 'spread') {
                if (mattress.widthIn >= 39) score += 30;
                if (mattress.lengthIn >= 79) score += 20;
            }
            
            // Room size considerations
            if (roomSize === 'small') {
                if (mattress.widthIn <= 35) score += 25;
                if (mattress.name.includes('Youth')) score += 15;
            } else if (roomSize === 'medium') {
                if (mattress.widthIn >= 35 && mattress.widthIn <= 39) score += 20;
            } else if (roomSize === 'large') {
                if (mattress.widthIn >= 35) score += 15;
            }
            
            // Usage considerations
            if (usage === 'main') {
                if (mattress.lengthIn >= 75) score += 25;
                if (mattress.widthIn >= 35) score += 20;
            } else if (usage === 'guest') {
                if (mattress.name.includes('Single') || mattress.name === 'Twin') score += 20;
            } else if (usage === 'dorm') {
                if (mattress.name === 'Twin XL') score += 40;
                if (mattress.name.includes('Single Long')) score += 30;
            } else if (usage === 'child') {
                if (mattress.name.includes('Youth')) score += 50;
            }
            
            // Budget considerations
            const budgetRanges = {
                'economy': [0, 300],
                'standard': [200, 600],
                'premium': [400, 1000]
            };
            
            const budgetRange = budgetRanges[budget];
            const priceAvg = (parseFloat(mattress.priceRange.split('-')[0].replace('$', '')) + parseFloat(mattress.priceRange.split('-')[1].replace('$', ''))) / 2;
            
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
        const roomWidthNeeded = recommendedMattress.widthIn + 40; // Add 40 inches for furniture and walkways
        const roomLengthNeeded = recommendedMattress.lengthIn + 60; // Add 60 inches for furniture and walkways
        
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
                areaNeeded: Math.round(roomWidthNeeded * roomLengthNeeded / 144) // Square feet
            },
            recommendations: recommendations
        };
    }
    
    function generateRecommendations(height, age, sleepStyle, roomSize, usage, budget, mattress) {
        const recommendations = [];
        
        // Height-based recommendations
        if (height > 72) { // 6 feet
            recommendations.push("Due to your height, we recommend a mattress at least 79 inches long");
        } else if (height < 60) { // 5 feet
            recommendations.push("Your height allows for more compact mattress options that save space");
        }
        
        // Age-based recommendations
        if (age === 'child' || age === 'preteen') {
            recommendations.push("Consider a 'grow-into' mattress as children grow quickly");
            recommendations.push("Ensure the mattress has proper orthopedic support for healthy development");
        } else if (age === 'teen') {
            recommendations.push("Twin XL is popular in college dorms");
        }
        
        // Sleep style recommendations
        if (sleepStyle === 'active') {
            recommendations.push("Active sleepers benefit from reinforced edge support");
        } else if (sleepStyle === 'spread') {
            recommendations.push("Consider upgrading to a full size if space allows");
        }
        
        // Room size recommendations
        if (roomSize === 'small') {
            recommendations.push("Consider a bed with built-in storage to maximize space");
        }
        
        // Budget recommendations
        if (budget === 'economy') {
            recommendations.push("Memory foam mattresses offer good value for budget-conscious buyers");
        } else if (budget === 'premium') {
            recommendations.push("Consider natural materials like latex or organic cotton");
        }
        
        return recommendations;
    }
    
    function getAgeGroupName(age) {
        const names = {
            'child': '3-8 years',
            'preteen': '9-12 years', 
            'teen': '13-17 years',
            'adult': '18+ years'
        };
        return names[age] || age;
    }
    
    function getSleepStyleName(style) {
        const names = {
            'calm': 'Calm sleeper',
            'active': 'Active sleeper',
            'spread': 'Spread out sleeper'
        };
        return names[style] || style;
    }
    
    function getRoomSizeName(size) {
        const names = {
            'small': 'Small room',
            'medium': 'Medium room',
            'large': 'Large room'
        };
        return names[size] || size;
    }
    
    function getUsageName(usage) {
        const names = {
            'main': 'Primary bed',
            'guest': 'Guest room',
            'dorm': 'College dorm',
            'child': "Children's room",
            'vacation': 'Vacation/cabin'
        };
        return names[usage] || usage;
    }
    
    function displayResults(result) {
        const { input, recommended, alternatives, room, recommendations } = result;
        
        const heightFeet = Math.floor(input.height / 12);
        const heightInches = input.height % 12;
        
        resultSection.innerHTML = `
            <div class="mattress-overview">
                <h3>🛏️ Recommendation for ${heightFeet}'${heightInches}" User</h3>
                <div class="mattress-info">
                    <div class="info-item">
                        <span class="info-number">${recommended.name}</span>
                        <div class="info-label">recommended size</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${recommended.widthIn}"×${recommended.lengthIn}"</span>
                        <div class="info-label">dimensions (inches)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${room.areaNeeded}</span>
                        <div class="info-label">sq ft room needed</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${recommended.priceRange}</span>
                        <div class="info-label">price range</div>
                    </div>
                </div>
            </div>
            
            <div class="insight-cards">
                <div class="insight-card success">
                    <h6>🎯 Perfect Match</h6>
                    <div class="big-number">${recommended.name}</div>
                    <p>${recommended.widthIn}"×${recommended.lengthIn}" (${recommended.widthCm}×${recommended.lengthCm} cm)</p>
                </div>
                
                <div class="insight-card info">
                    <h6>📐 Room Requirements</h6>
                    <div class="big-number">${roomWidthNeeded}"×${roomLengthNeeded}"</div>
                    <p>Minimum room dimensions</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>💰 Budget</h6>
                    <div class="big-number">${recommended.priceRange}</div>
                    <p>Estimated cost range</p>
                </div>
            </div>
            
            <div class="recommendations-section">
                <h3>📊 Mattress Size Comparison</h3>
                
                <div class="size-comparison">
                    ${result.allSizes.map((mattress, index) => {
                        let className = 'size-option';
                        if (index === 0) className += ' recommended';
                        else if (mattress.score < 50) className += ' not-recommended';
                        
                        return `
                            <div class="${className}">
                                <h4>${mattress.name}</h4>
                                <p><strong>${mattress.widthIn}"×${mattress.lengthIn}" (${mattress.widthCm}×${mattress.lengthCm} cm)</strong></p>
                                <p>${mattress.description}</p>
                                <p><strong>Price:</strong> ${mattress.priceRange}</p>
                                <p><strong>Score:</strong> ${mattress.score} points</p>
                                ${index === 0 ? '<p><em>🏆 Recommended</em></p>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="insight-cards">
                    <div class="insight-card info">
                        <h6>👤 Your Profile</h6>
                        <p><strong>Height:</strong> ${heightFeet}'${heightInches}" (${input.height}")</p>
                        <p><strong>Age:</strong> ${getAgeGroupName(input.age)}</p>
                        <p><strong>Sleep Style:</strong> ${getSleepStyleName(input.sleepStyle)}</p>
                        <p><strong>Room:</strong> ${getRoomSizeName(input.roomSize)}</p>
                        <p><strong>Use:</strong> ${getUsageName(input.usage)}</p>
                    </div>
                    
                    <div class="insight-card success">
                        <h6>✅ Why ${recommended.name}?</h6>
                        <p>${recommended.description}</p>
                        <p><strong>Length:</strong> ${recommended.lengthIn - input.height}" clearance</p>
                        <p><strong>Width:</strong> ${recommended.widthIn}" for comfort</p>
                    </div>
                    
                    <div class="insight-card warning">
                        <h6>🏠 Space Requirements</h6>
                        <p><strong>Minimum room:</strong> ${room.widthNeeded}"×${room.lengthNeeded}"</p>
                        <p><strong>Area:</strong> ${room.areaNeeded} sq ft</p>
                        <p><em>Includes space for furniture</em></p>
                    </div>
                </div>
                
                <div class="tips-grid">
                    <div class="tip-item">
                        <h4>📏 Sizing Guidelines</h4>
                        <ul>
                            <li>Mattress length = height + 6-8 inches</li>
                            <li>Minimum width for comfort — 31 inches</li>
                            <li>Active sleepers need 35+ inches width</li>
                            <li>Consider "grow room" for children</li>
                            <li>Check bed frame dimensions before buying</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🏠 Space Planning</h4>
                        <ul>
                            <li>Leave 24-30" on side of bed for walkway</li>
                            <li>Minimum 36" at foot of bed</li>
                            <li>Account for dressers and desks</li>
                            <li>Consider storage beds for small rooms</li>
                            <li>Optimal mattress height: 18-24" from floor</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>💰 Budget Considerations</h4>
                        <ul>
                            <li>Quality mattresses last 8-10 years</li>
                            <li>Memory foam offers good value for money</li>
                            <li>Innerspring mattresses are most durable</li>
                            <li>Hybrid mattresses provide best of both</li>
                            <li>Don't compromise on primary bed quality</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🔍 Personal Recommendations</h4>
                        <ul>
                            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            <li>Always test mattresses before purchasing</li>
                            <li>Consider firmness based on weight and age</li>
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