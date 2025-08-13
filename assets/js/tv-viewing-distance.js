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
            alert('Будь ласка, введіть коректний розмір телевізора');
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
        
        // Calculate viewing angles (in degrees)
        const minAngle = 2 * Math.atan((sizeInches * 2.54) / (2 * optimalDistanceCm)) * (180 / Math.PI);
        const maxAngle = 2 * Math.atan((sizeInches * 2.54) / (2 * minDistanceCm)) * (180 / Math.PI);
        
        // Screen dimensions calculation
        const aspectRatio = 16/9; // Modern TVs
        const screenWidthCm = sizeCm * Math.cos(Math.atan(1/aspectRatio));
        const screenHeightCm = screenWidthCm / aspectRatio;
        
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
                minCm: Math.round(minDistanceCm),
                maxCm: Math.round(maxDistanceCm),
                optimalCm: Math.round(optimalDistanceCm),
                minFt: Math.round(minDistanceM * 3.28),
                maxFt: Math.round(maxDistanceM * 3.28),
                optimalFt: Math.round(optimalDistanceM * 3.28)
            },
            angles: {
                min: minAngle.toFixed(1),
                max: maxAngle.toFixed(1),
                optimal: ((minAngle + maxAngle) / 2).toFixed(1)
            },
            screen: {
                widthCm: screenWidthCm.toFixed(1),
                heightCm: screenHeightCm.toFixed(1),
                widthM: (screenWidthCm / 100).toFixed(2),
                heightM: (screenHeightCm / 100).toFixed(2),
                area: ((screenWidthCm * screenHeightCm) / 10000).toFixed(2)
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
            'mixed': 'Змішаний контент',
            'movies': 'Фільми та серіали',
            'gaming': 'Ігри',
            'sports': 'Спорт',
            'news': 'Новини та ТБ'
        };
        return names[type] || type;
    }
    
    function getPreferenceName(preference) {
        const names = {
            'moderate': 'Помірна',
            'cinematic': 'Кінематографічна',
            'comfortable': 'Комфортна'
        };
        return names[preference] || preference;
    }
    
    function displayResults(result) {
        const { input, distances, angles, screen } = result;
        
        resultSection.innerHTML = `
            <div class="distance-overview">
                <h3>📺 Результати для телевізора ${input.size} ${input.unit === 'inches' ? 'дюймів' : 'см'}</h3>
                <div class="distance-info">
                    <div class="info-item">
                        <span class="info-number">${distances.optimalM}</span>
                        <div class="info-label">метри (оптимум)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${distances.minM} - ${distances.maxM}</span>
                        <div class="info-label">діапазон (м)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${angles.optimal}°</span>
                        <div class="info-label">кут огляду</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${screen.widthM} × ${screen.heightM}</span>
                        <div class="info-label">розміри екрана (м)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${screen.area}</span>
                        <div class="info-label">площа екрана (м²)</div>
                    </div>
                </div>
            </div>
            
            <div class="insight-cards">
                <div class="insight-card success">
                    <h6>🎯 Рекомендована відстань</h6>
                    <div class="big-number">${distances.optimalM} м</div>
                    <p>${distances.optimalCm} см / ${distances.optimalFt} футів</p>
                </div>
                
                <div class="insight-card info">
                    <h6>📐 Допустимий діапазон</h6>
                    <div class="big-number">${distances.minM} - ${distances.maxM} м</div>
                    <p>Від ${distances.minCm} до ${distances.maxCm} см</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>👁️ Кут огляду</h6>
                    <div class="big-number">${angles.optimal}°</div>
                    <p>Діапазон: ${angles.min}° - ${angles.max}°</p>
                </div>
            </div>
            
            <div class="recommendations-section">
                <h3>💡 Персональні рекомендації</h3>
                
                <div class="insight-cards">
                    <div class="insight-card info">
                        <h6>📊 Ваші налаштування</h6>
                        <p><strong>Роздільність:</strong> ${getResolutionName(input.resolution)}</p>
                        <p><strong>Контент:</strong> ${getViewingTypeName(input.viewingType)}</p>
                        <p><strong>Стиль:</strong> ${getPreferenceName(input.preference)}</p>
                    </div>
                    
                    <div class="insight-card ${distances.optimalM <= 2.5 ? 'warning' : 'success'}">
                        <h6>🏠 Придатність для кімнати</h6>
                        <p><strong>Мінімальна довжина кімнати:</strong> ${(parseFloat(distances.optimalM) + 1).toFixed(1)} м</p>
                        <p><strong>Рекомендована:</strong> ${(parseFloat(distances.optimalM) + 1.5).toFixed(1)} м</p>
                    </div>
                    
                    <div class="insight-card success">
                        <h6>📏 Висота розміщення</h6>
                        <p><strong>Центр екрана:</strong> 100-120 см від підлоги</p>
                        <p><strong>На рівні очей</strong> при сидінні</p>
                    </div>
                </div>
                
                <div class="tips-grid">
                    <div class="tip-item">
                        <h4>✅ Оптимальні умови</h4>
                        <ul>
                            <li>Відстань: <strong>${distances.optimalM} м</strong></li>
                            <li>Висота центру екрана: <strong>100-120 см</strong></li>
                            <li>Кут нахилу: <strong>0-15° вниз</strong></li>
                            <li>Освітлення: приглушене, без бликів</li>
                            <li>Перерви кожні 20-30 хвилин</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>⚠️ Ознаки неправильної відстані</h4>
                        <ul>
                            <li><strong>Занадто близько:</strong> втома очей, головний біль</li>
                            <li><strong>Занадто далеко:</strong> втрата деталей, напруження</li>
                            <li><strong>Неправильна висота:</strong> біль у шиї та спині</li>
                            <li><strong>Яскраве освітлення:</strong> блики на екрані</li>
                            <li><strong>Довгий перегляд:</strong> сухість очей</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🎮 Спеціальні рекомендації</h4>
                        <ul>
                            <li><strong>Ігри:</strong> на 20% ближче для кращої реакції</li>
                            <li><strong>Фільми:</strong> кінематографічна відстань</li>
                            <li><strong>Спорт:</strong> стандартна відстань</li>
                            <li><strong>Робота:</strong> збільшіть відстань на 25%</li>
                            <li><strong>Діти:</strong> збільшіть відстань на 30%</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🏡 Планування простору</h4>
                        <ul>
                            <li><strong>Розмір дивана:</strong> ${(parseFloat(distances.optimalM) * 0.6).toFixed(1)} - ${(parseFloat(distances.optimalM) * 0.8).toFixed(1)} м</li>
                            <li><strong>Кавовий столик:</strong> ${(parseFloat(distances.optimalM) * 0.3).toFixed(1)} м від дивана</li>
                            <li><strong>Прохід за диваном:</strong> мінімум 0.9 м</li>
                            <li><strong>Бічні проходи:</strong> мінімум 0.6 м</li>
                            <li><strong>Вентиляція ТВ:</strong> 10-15 см від стіни</li>
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