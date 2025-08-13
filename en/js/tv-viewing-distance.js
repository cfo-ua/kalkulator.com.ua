document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');
    
    calculateBtn.addEventListener('click', calculateViewingDistance);
    
    function calculateViewingDistance() {
        const tvSize = parseFloat(document.getElementById('tvSize').value);
        const sizeUnit = document.getElementById('sizeUnit').value;
        const resolution = document.getElementById('resolution').value;
        const viewingType = document.getElementById('viewingType').value;
        const preference = document.getElementById('preference').value;
        
        if (isNaN(tvSize) || tvSize <= 0) {
            alert('Please enter a valid TV size');
            return;
        }
        
        const result = calculateOptimalDistance(tvSize, sizeUnit, resolution, viewingType, preference);
        displayResults(result);
    }
    
    function calculateOptimalDistance(size, unit, resolution, viewingType, preference) {
        // Convert size to inches if needed
        let sizeInches = unit === 'cm' ? size / 2.54 : size;
        let sizeCm = unit === 'inches' ? size * 2.54 : size;
        
        // Base multipliers for different resolutions
        const resolutionMultipliers = {
            'hd': { min: 2.5, max: 3.5, optimal: 3.0 },
            '4k': { min: 1.5, max: 2.5, optimal: 2.0 },
            '8k': { min: 1.2, max: 2.0, optimal: 1.6 }
        };
        
        // Content type adjustments
        const contentAdjustments = {
            'movies': 0.9,    // Closer for immersive experience
            'gaming': 0.8,    // Closer for details and reaction time
            'sports': 1.0,    // Standard distance
            'news': 1.1,      // Slightly farther
            'mixed': 1.0      // Standard
        };
        
        // Preference adjustments
        const preferenceAdjustments = {
            'cinematic': 0.85,  // Closer for theater-like experience
            'moderate': 1.0,    // Standard
            'comfortable': 1.2  // Farther for comfort
        };
        
        const baseMultiplier = resolutionMultipliers[resolution];
        const contentAdjustment = contentAdjustments[viewingType];
        const preferenceAdjustment = preferenceAdjustments[preference];
        
        // Calculate distances in inches and convert to metric
        const minDistanceInches = sizeInches * baseMultiplier.min * contentAdjustment * preferenceAdjustment;
        const maxDistanceInches = sizeInches * baseMultiplier.max * contentAdjustment * preferenceAdjustment;
        const optimalDistanceInches = sizeInches * baseMultiplier.optimal * contentAdjustment * preferenceAdjustment;
        
        // Convert to centimeters and meters
        const minDistanceCm = minDistanceInches * 2.54;
        const maxDistanceCm = maxDistanceInches * 2.54;
        const optimalDistanceCm = optimalDistanceInches * 2.54;
        
        const minDistanceM = minDistanceCm / 100;
        const maxDistanceM = maxDistanceCm / 100;
        const optimalDistanceM = optimalDistanceCm / 100;
        
        const minDistanceFt = minDistanceM * 3.28084;
        const maxDistanceFt = maxDistanceM * 3.28084;
        const optimalDistanceFt = optimalDistanceM * 3.28084;
        
        // Calculate viewing angles (in degrees)
        const minAngle = 2 * Math.atan((sizeInches * 2.54) / (2 * optimalDistanceCm)) * (180 / Math.PI);
        const maxAngle = 2 * Math.atan((sizeInches * 2.54) / (2 * minDistanceCm)) * (180 / Math.PI);
        
        // Screen dimensions calculation
        const aspectRatio = 16/9; // Modern TVs
        const screenWidthCm = sizeCm * Math.cos(Math.atan(1/aspectRatio));
        const screenHeightCm = screenWidthCm / aspectRatio;
        const screenWidthIn = screenWidthCm / 2.54;
        const screenHeightIn = screenHeightCm / 2.54;
        
        return {
            input: {
                size: size,
                unit: unit,
                sizeInches: sizeInches.toFixed(1),
                sizeCm: sizeCm.toFixed(1),
                resolution: resolution,
                viewingType: viewingType,
                preference: preference
            },
            distances: {
                minM: minDistanceM.toFixed(2),
                maxM: maxDistanceM.toFixed(2),
                optimalM: optimalDistanceM.toFixed(2),
                minFt: minDistanceFt.toFixed(1),
                maxFt: maxDistanceFt.toFixed(1),
                optimalFt: optimalDistanceFt.toFixed(1),
                minCm: Math.round(minDistanceCm),
                maxCm: Math.round(maxDistanceCm),
                optimalCm: Math.round(optimalDistanceCm)
            },
            angles: {
                min: minAngle.toFixed(1),
                max: maxAngle.toFixed(1),
                optimal: ((minAngle + maxAngle) / 2).toFixed(1)
            },
            screen: {
                widthCm: screenWidthCm.toFixed(1),
                heightCm: screenHeightCm.toFixed(1),
                widthIn: screenWidthIn.toFixed(1),
                heightIn: screenHeightIn.toFixed(1),
                widthM: (screenWidthCm / 100).toFixed(2),
                heightM: (screenHeightCm / 100).toFixed(2),
                area: ((screenWidthCm * screenHeightCm) / 10000).toFixed(2),
                areaFt: ((screenWidthIn * screenHeightIn) / 144).toFixed(2)
            }
        };
    }
    
    function getResolutionName(resolution) {
        const names = {
            'hd': 'HD/Full HD',
            '4k': '4K UHD',
            '8k': '8K UHD'
        };
        return names[resolution] || resolution;
    }
    
    function getViewingTypeName(type) {
        const names = {
            'mixed': 'Mixed Content',
            'movies': 'Movies & TV Shows',
            'gaming': 'Gaming',
            'sports': 'Sports',
            'news': 'News & TV'
        };
        return names[type] || type;
    }
    
    function getPreferenceName(preference) {
        const names = {
            'moderate': 'Moderate',
            'cinematic': 'Cinematic',
            'comfortable': 'Comfortable'
        };
        return names[preference] || preference;
    }
    
    function displayResults(result) {
        const { input, distances, angles, screen } = result;
        
        resultSection.innerHTML = `
            <div class="distance-overview">
                <h3>📺 Results for ${input.size}${input.unit === 'inches' ? '"' : 'cm'} TV</h3>
                <div class="distance-info">
                    <div class="info-item">
                        <span class="info-number">${distances.optimalFt}'</span>
                        <div class="info-label">feet (optimal)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${distances.optimalM} m</span>
                        <div class="info-label">meters (optimal)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${distances.minFt}' - ${distances.maxFt}'</span>
                        <div class="info-label">range (feet)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${angles.optimal}°</span>
                        <div class="info-label">viewing angle</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${screen.widthIn}" × ${screen.heightIn}"</span>
                        <div class="info-label">screen size (inches)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${screen.areaFt}</span>
                        <div class="info-label">screen area (sq ft)</div>
                    </div>
                </div>
            </div>
            
            <div class="insight-cards">
                <div class="insight-card success">
                    <h6>🎯 Recommended Distance</h6>
                    <div class="big-number">${distances.optimalFt} ft</div>
                    <p>${distances.optimalM} m / ${distances.optimalCm} cm</p>
                </div>
                
                <div class="insight-card info">
                    <h6>📐 Acceptable Range</h6>
                    <div class="big-number">${distances.minFt} - ${distances.maxFt} ft</div>
                    <p>${distances.minM} - ${distances.maxM} meters</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>👁️ Viewing Angle</h6>
                    <div class="big-number">${angles.optimal}°</div>
                    <p>Range: ${angles.min}° - ${angles.max}°</p>
                </div>
            </div>
            
            <div class="recommendations-section">
                <h3>💡 Personalized Recommendations</h3>
                
                <div class="insight-cards">
                    <div class="insight-card info">
                        <h6>📊 Your Settings</h6>
                        <p><strong>Resolution:</strong> ${getResolutionName(input.resolution)}</p>
                        <p><strong>Content:</strong> ${getViewingTypeName(input.viewingType)}</p>
                        <p><strong>Style:</strong> ${getPreferenceName(input.preference)}</p>
                    </div>
                    
                    <div class="insight-card ${parseFloat(distances.optimalFt) <= 8 ? 'warning' : 'success'}">
                        <h6>🏠 Room Requirements</h6>
                        <p><strong>Minimum room depth:</strong> ${(parseFloat(distances.optimalFt) + 3).toFixed(1)} ft</p>
                        <p><strong>Recommended:</strong> ${(parseFloat(distances.optimalFt) + 5).toFixed(1)} ft</p>
                    </div>
                    
                    <div class="insight-card success">
                        <h6>📏 Mounting Height</h6>
                        <p><strong>Screen center:</strong> 42-48" from floor</p>
                        <p><strong>At eye level</strong> when seated</p>
                    </div>
                </div>
                
                <div class="tips-grid">
                    <div class="tip-item">
                        <h4>✅ Optimal Setup</h4>
                        <ul>
                            <li>Distance: <strong>${distances.optimalFt} feet</strong></li>
                            <li>Screen center height: <strong>42-48 inches</strong></li>
                            <li>Tilt angle: <strong>0-15° downward</strong></li>
                            <li>Lighting: dim ambient, no glare</li>
                            <li>Take breaks every 20-30 minutes</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>⚠️ Signs of Wrong Distance</h4>
                        <ul>
                            <li><strong>Too close:</strong> eye strain, headaches</li>
                            <li><strong>Too far:</strong> loss of detail, squinting</li>
                            <li><strong>Wrong height:</strong> neck and back pain</li>
                            <li><strong>Bright lighting:</strong> screen glare</li>
                            <li><strong>Long sessions:</strong> dry eyes</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🎮 Content-Specific Tips</h4>
                        <ul>
                            <li><strong>Gaming:</strong> 20% closer for better reaction</li>
                            <li><strong>Movies:</strong> cinematic distance for immersion</li>
                            <li><strong>Sports:</strong> standard distance works best</li>
                            <li><strong>Work:</strong> increase distance by 25%</li>
                            <li><strong>Children:</strong> increase distance by 30%</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🏡 Space Planning</h4>
                        <ul>
                            <li><strong>Sofa depth:</strong> ${(parseFloat(distances.optimalFt) * 0.2).toFixed(1)} - ${(parseFloat(distances.optimalFt) * 0.3).toFixed(1)} ft</li>
                            <li><strong>Coffee table:</strong> ${(parseFloat(distances.optimalFt) * 0.3).toFixed(1)} ft from sofa</li>
                            <li><strong>Walkway behind sofa:</strong> minimum 3 ft</li>
                            <li><strong>Side clearance:</strong> minimum 2 ft</li>
                            <li><strong>TV ventilation:</strong> 4-6 inches from wall</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        resultSection.classList.add('show');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Auto-calculate on input change for better UX
    const inputs = ['tvSize', 'sizeUnit', 'resolution', 'viewingType', 'preference'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', debounce(() => {
                if (resultSection.classList.contains('show')) {
                    calculateViewingDistance();
                }
            }, 300));
        }
    });
    
    // Also trigger on input for number field
    document.getElementById('tvSize').addEventListener('input', debounce(() => {
        if (resultSection.classList.contains('show')) {
            calculateViewingDistance();
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