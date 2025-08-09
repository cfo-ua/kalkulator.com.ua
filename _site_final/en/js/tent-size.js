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
            alert('Please enter a valid number of people');
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
            category = "1-Person";
            recommendedCapacity = "1 person";
        } else if (people <= 2) {
            category = "2-Person";
            recommendedCapacity = "1-2 people";
        } else if (people <= 3) {
            category = "3-Person";
            recommendedCapacity = "2-3 people";
        } else if (people <= 4) {
            category = "4-Person";
            recommendedCapacity = "3-4 people";
        } else if (people <= 6) {
            category = "6-Person";
            recommendedCapacity = "4-6 people";
        } else {
            category = "Large Group";
            recommendedCapacity = `${people-1}-${people+1} people`;
        }
        
        // Weight category
        const weightCategory = tripMultipliers[tripType].weight;
        let weightRange;
        switch (weightCategory) {
            case 'low':
                weightRange = `${Math.round(area * 0.8)}-${Math.round(area * 1.2)} kg`;
                break;
            case 'medium':
                weightRange = `${Math.round(area * 1.2)}-${Math.round(area * 2.0)} kg`;
                break;
            case 'high':
                weightRange = `${Math.round(area * 2.0)}-${Math.round(area * 3.5)} kg`;
                break;
        }
        
        // Features based on selections
        const features = [];
        if (season === 'winter') features.push('Reinforced construction');
        if (season !== 'summer') features.push('Waterproofing 3000+ mm');
        if (tripType === 'car-camping') features.push('Gear vestibule');
        if (tripType === 'base-camp') features.push('Multiple entrances');
        if (comfort === 'luxury') features.push('Height > 180 cm');
        if (gear === 'extensive') features.push('Additional pockets');
        
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
                    <h6>🏕️ Recommended Type</h6>
                    <div class="big-number">${category}</div>
                    <p>${recommendedCapacity}</p>
                </div>
                
                <div class="insight-card info">
                    <h6>📏 Dimensions</h6>
                    <div class="big-number">${dimensions.width}×${dimensions.length} cm</div>
                    <p>Area: ${dimensions.area.toFixed(1)} m²</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>⚖️ Estimated Weight</h6>
                    <div class="big-number">${weightRange}</div>
                    <p>Depending on material</p>
                </div>
            </div>
            
            <div class="detailed-results">
                <h3>🎯 Detailed Recommendations</h3>
                
                <div class="recommendations-grid">
                    <div class="recommendation-item">
                        <h4>📐 Minimum Dimensions</h4>
                        <ul>
                            <li><strong>Width:</strong> ${dimensions.width} cm (${Math.round(dimensions.width/result.people)} cm per person)</li>
                            <li><strong>Length:</strong> ${dimensions.length} cm</li>
                            <li><strong>Area:</strong> ${dimensions.area.toFixed(1)} m²</li>
                        </ul>
                    </div>
                    
                    <div class="recommendation-item">
                        <h4>✨ Recommended Features</h4>
                        <ul>
                            ${features.map(feature => `<li>${feature}</li>`).join('')}
                            ${features.length === 0 ? '<li>Standard features</li>' : ''}
                        </ul>
                    </div>
                    
                    <div class="recommendation-item">
                        <h4>💡 Selection Tips</h4>
                        <ul>
                            <li>Check tent height (min. 100-120 cm)</li>
                            <li>Choose tent with ventilation openings</li>
                            <li>Consider color: light colors are cooler</li>
                            <li>Check quality of zippers and seams</li>
                        </ul>
                    </div>
                </div>
                
                <div class="size-comparison">
                    <h4>📊 Tent Size Comparison</h4>
                    <div class="size-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tent Type</th>
                                    <th>People</th>
                                    <th>Dimensions (cm)</th>
                                    <th>Area (m²)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="${result.people <= 1 ? 'highlighted' : ''}">
                                    <td>1-Person</td>
                                    <td>1</td>
                                    <td>210×90</td>
                                    <td>1.9</td>
                                </tr>
                                <tr class="${result.people <= 2 && result.people > 1 ? 'highlighted' : ''}">
                                    <td>2-Person</td>
                                    <td>1-2</td>
                                    <td>210×130</td>
                                    <td>2.7</td>
                                </tr>
                                <tr class="${result.people <= 3 && result.people > 2 ? 'highlighted' : ''}">
                                    <td>3-Person</td>
                                    <td>2-3</td>
                                    <td>210×180</td>
                                    <td>3.8</td>
                                </tr>
                                <tr class="${result.people <= 4 && result.people > 3 ? 'highlighted' : ''}">
                                    <td>4-Person</td>
                                    <td>3-4</td>
                                    <td>240×210</td>
                                    <td>5.0</td>
                                </tr>
                                <tr class="${result.people <= 6 && result.people > 4 ? 'highlighted' : ''}">
                                    <td>6-Person</td>
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