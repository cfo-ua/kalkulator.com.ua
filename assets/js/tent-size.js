document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');
    
    calculateBtn.addEventListener('click', calculateTentSize);
    
    function calculateTentSize() {
        const numPeople = parseInt(document.getElementById('numPeople').value);
        const tripType = document.getElementById('tripType').value;
        const season = document.getElementById('season').value;
        const comfort = document.getElementById('comfort').value;
        const gear = document.getElementById('gear').value;
        
        if (isNaN(numPeople) || numPeople < 1) {
            alert('Будь ласка, введіть коректну кількість людей');
            return;
        }
        
        const result = calculateOptimalTentSize(numPeople, tripType, season, comfort, gear);
        displayResults(result);
    }
    
    function calculateOptimalTentSize(people, tripType, season, comfort, gear) {
        // Base calculations
        let baseWidth = people * 60; // 60cm per person minimum
        let baseLength = 210; // Standard sleeping bag length
        
        // Trip type adjustments
        const tripMultipliers = {
            'backpacking': { width: 1.0, length: 1.0, weight: 'low' },
            'car-camping': { width: 1.3, length: 1.2, weight: 'medium' },
            'base-camp': { width: 1.4, length: 1.3, weight: 'high' },
            'expedition': { width: 1.2, length: 1.1, weight: 'medium' }
        };
        
        // Comfort level adjustments
        const comfortMultipliers = {
            'minimal': { width: 1.0, length: 1.0 },
            'standard': { width: 1.2, length: 1.1 },
            'spacious': { width: 1.4, length: 1.2 },
            'luxury': { width: 1.6, length: 1.3 }
        };
        
        // Season adjustments
        const seasonMultipliers = {
            'summer': { width: 1.0, length: 1.0 },
            'three-season': { width: 1.1, length: 1.05 },
            'winter': { width: 1.3, length: 1.2 }
        };
        
        // Gear adjustments
        const gearMultipliers = {
            'minimal': { width: 1.0, length: 1.0 },
            'moderate': { width: 1.1, length: 1.1 },
            'extensive': { width: 1.3, length: 1.2 }
        };
        
        // Apply multipliers
        let width = baseWidth;
        let length = baseLength;
        
        width *= tripMultipliers[tripType].width;
        length *= tripMultipliers[tripType].length;
        
        width *= comfortMultipliers[comfort].width;
        length *= comfortMultipliers[comfort].length;
        
        width *= seasonMultipliers[season].width;
        length *= seasonMultipliers[season].length;
        
        width *= gearMultipliers[gear].width;
        length *= gearMultipliers[gear].length;
        
        // Round to reasonable values
        width = Math.round(width / 10) * 10;
        length = Math.round(length / 10) * 10;
        
        // Calculate area
        const area = (width * length) / 10000; // Convert to m²
        
        // Determine tent category
        let category, recommendedCapacity;
        if (people <= 1) {
            category = "1-місний";
            recommendedCapacity = "1 особа";
        } else if (people <= 2) {
            category = "2-місний";
            recommendedCapacity = "1-2 особи";
        } else if (people <= 3) {
            category = "3-місний";
            recommendedCapacity = "2-3 особи";
        } else if (people <= 4) {
            category = "4-місний";
            recommendedCapacity = "3-4 особи";
        } else if (people <= 6) {
            category = "6-місний";
            recommendedCapacity = "4-6 осіб";
        } else {
            category = "Великий групповий";
            recommendedCapacity = `${people-1}-${people+1} осіб`;
        }
        
        // Weight category
        const weightCategory = tripMultipliers[tripType].weight;
        let weightRange;
        switch (weightCategory) {
            case 'low':
                weightRange = `${Math.round(area * 0.8)}-${Math.round(area * 1.2)} кг`;
                break;
            case 'medium':
                weightRange = `${Math.round(area * 1.2)}-${Math.round(area * 2.0)} кг`;
                break;
            case 'high':
                weightRange = `${Math.round(area * 2.0)}-${Math.round(area * 3.5)} кг`;
                break;
        }
        
        // Features based on selections
        const features = [];
        if (season === 'winter') features.push('Посилена конструкція');
        if (season !== 'summer') features.push('Водонепроникність 3000+ мм');
        if (tripType === 'car-camping') features.push('Тамбур для речей');
        if (tripType === 'base-camp') features.push('Кілька входів');
        if (comfort === 'luxury') features.push('Висота > 180 см');
        if (gear === 'extensive') features.push('Додаткові кишені');
        
        return {
            dimensions: { width, length, area },
            category,
            recommendedCapacity,
            weightRange,
            features,
            tripType,
            season,
            comfort,
            people
        };
    }
    
    function displayResults(result) {
        const { dimensions, category, recommendedCapacity, weightRange, features } = result;
        
        resultSection.innerHTML = `
            <div class="insight-cards">
                <div class="insight-card success">
                    <h6>🏕️ Рекомендований тип</h6>
                    <div class="big-number">${category}</div>
                    <p>${recommendedCapacity}</p>
                </div>
                
                <div class="insight-card info">
                    <h6>📏 Розміри</h6>
                    <div class="big-number">${dimensions.width}×${dimensions.length} см</div>
                    <p>Площа: ${dimensions.area.toFixed(1)} м²</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>⚖️ Орієнтовна вага</h6>
                    <div class="big-number">${weightRange}</div>
                    <p>Залежно від матеріалу</p>
                </div>
            </div>
            
            <div class="detailed-results">
                <h3>🎯 Детальні рекомендації</h3>
                
                <div class="recommendations-grid">
                    <div class="recommendation-item">
                        <h4>📐 Мінімальні розміри</h4>
                        <ul>
                            <li><strong>Ширина:</strong> ${dimensions.width} см (${Math.round(dimensions.width/result.people)} см на особу)</li>
                            <li><strong>Довжина:</strong> ${dimensions.length} см</li>
                            <li><strong>Площа:</strong> ${dimensions.area.toFixed(1)} м²</li>
                        </ul>
                    </div>
                    
                    <div class="recommendation-item">
                        <h4>✨ Рекомендовані характеристики</h4>
                        <ul>
                            ${features.map(feature => `<li>${feature}</li>`).join('')}
                            ${features.length === 0 ? '<li>Стандартні характеристики</li>' : ''}
                        </ul>
                    </div>
                    
                    <div class="recommendation-item">
                        <h4>💡 Поради по вибору</h4>
                        <ul>
                            <li>Перевірте висоту намету (мін. 100-120 см)</li>
                            <li>Оберіть намет з вентиляційними отворами</li>
                            <li>Враховуйте колір: світлі кольори прохолодніші</li>
                            <li>Перевірте якість блискавок та швів</li>
                        </ul>
                    </div>
                </div>
                
                <div class="size-comparison">
                    <h4>📊 Порівняння розмірів наметів</h4>
                    <div class="size-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Тип намету</th>
                                    <th>Кількість осіб</th>
                                    <th>Розміри (см)</th>
                                    <th>Площа (м²)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="${result.people <= 1 ? 'highlighted' : ''}">
                                    <td>1-місний</td>
                                    <td>1</td>
                                    <td>210×90</td>
                                    <td>1.9</td>
                                </tr>
                                <tr class="${result.people <= 2 && result.people > 1 ? 'highlighted' : ''}">
                                    <td>2-місний</td>
                                    <td>1-2</td>
                                    <td>210×130</td>
                                    <td>2.7</td>
                                </tr>
                                <tr class="${result.people <= 3 && result.people > 2 ? 'highlighted' : ''}">
                                    <td>3-місний</td>
                                    <td>2-3</td>
                                    <td>210×180</td>
                                    <td>3.8</td>
                                </tr>
                                <tr class="${result.people <= 4 && result.people > 3 ? 'highlighted' : ''}">
                                    <td>4-місний</td>
                                    <td>3-4</td>
                                    <td>240×210</td>
                                    <td>5.0</td>
                                </tr>
                                <tr class="${result.people <= 6 && result.people > 4 ? 'highlighted' : ''}">
                                    <td>6-місний</td>
                                    <td>4-6</td>
                                    <td>300×240</td>
                                    <td>7.2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        resultSection.classList.add('show');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
});