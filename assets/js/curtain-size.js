document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');
    
    calculateBtn.addEventListener('click', calculateCurtainSize);
    
    function calculateCurtainSize() {
        const windowWidth = parseFloat(document.getElementById('windowWidth').value);
        const windowHeight = parseFloat(document.getElementById('windowHeight').value);
        const curtainType = document.getElementById('curtainType').value;
        const curtainLength = document.getElementById('curtainLength').value;
        const fullnessCoeff = document.getElementById('fullnessCoeff').value;
        const fabricWidth = document.getElementById('fabricWidth').value;
        
        if (isNaN(windowWidth) || isNaN(windowHeight) || windowWidth <= 0 || windowHeight <= 0) {
            alert('Будь ласка, введіть коректні розміри вікна');
            return;
        }
        
        const result = calculateDimensions(windowWidth, windowHeight, curtainType, curtainLength, fullnessCoeff, fabricWidth);
        displayResults(result);
    }
    
    function calculateDimensions(width, height, type, lengthType, coeffType, fabricWidthType) {
        // Get fullness coefficient
        let coefficient;
        if (coeffType === 'custom') {
            coefficient = parseFloat(document.getElementById('customCoeff').value) || 2.0;
        } else {
            coefficient = parseFloat(coeffType);
        }
        
        // Get fabric width
        let fabricWidthCm;
        if (fabricWidthType === 'custom') {
            fabricWidthCm = parseFloat(document.getElementById('customFabricWidth').value) || 150;
        } else {
            fabricWidthCm = parseFloat(fabricWidthType);
        }
        
        // Calculate curtain length
        let curtainHeightCm;
        if (lengthType === 'custom') {
            curtainHeightCm = parseFloat(document.getElementById('customLength').value) || height;
        } else {
            const lengthAdjustments = {
                'sill': -15,      // До підвіконня
                'below-sill': 20, // Нижче підвіконня
                'floor': -2,      // До підлоги
                'puddle': 10      // З шлейфом
            };
            curtainHeightCm = height + (lengthAdjustments[lengthType] || 0);
        }
        
        // Calculate curtain width (finished width)
        const curtainWidthCm = width * coefficient;
        
        // Add seam allowances
        const hemAllowanceTop = 15;    // Підгін зверху
        const hemAllowanceBottom = 15; // Підгін знизу
        const sideSeamAllowance = 10;  // По 5 см з кожного боку
        
        // Total fabric needed
        const totalFabricHeight = curtainHeightCm + hemAllowanceTop + hemAllowanceBottom;
        const totalFabricWidth = curtainWidthCm + sideSeamAllowance;
        
        // Calculate number of fabric panels needed
        const panelsNeeded = Math.ceil(totalFabricWidth / fabricWidthCm);
        const totalFabricLength = totalFabricHeight * panelsNeeded;
        
        // Calculate fabric in meters
        const fabricMeters = totalFabricLength / 100;
        
        // Cost estimation (average price per meter)
        const averagePricePerMeter = 300; // грн
        const estimatedCost = fabricMeters * averagePricePerMeter;
        
        // Curtain type characteristics
        const curtainTypes = {
            'classic': { name: 'Класичні штори', defaultCoeff: 2.0 },
            'roman': { name: 'Римські штори', defaultCoeff: 1.1 },
            'japanese': { name: 'Японські панелі', defaultCoeff: 1.0 },
            'austrian': { name: 'Австрійські штори', defaultCoeff: 2.5 },
            'french': { name: 'Французькі штори', defaultCoeff: 2.5 },
            'cafe': { name: 'Кафе штори', defaultCoeff: 1.5 }
        };
        
        const lengthTypes = {
            'sill': 'До підвіконня',
            'below-sill': 'Нижче підвіконня', 
            'floor': 'До підлоги',
            'puddle': 'З шлейфом',
            'custom': 'Індивідуальна'
        };
        
        return {
            input: {
                windowWidth: width,
                windowHeight: height,
                curtainType: type,
                curtainTypeName: curtainTypes[type]?.name || type,
                lengthType: lengthType,
                lengthTypeName: lengthTypes[lengthType] || lengthType,
                coefficient: coefficient,
                fabricWidth: fabricWidthCm
            },
            dimensions: {
                curtainWidth: Math.round(curtainWidthCm),
                curtainHeight: Math.round(curtainHeightCm),
                totalFabricWidth: Math.round(totalFabricWidth),
                totalFabricHeight: Math.round(totalFabricHeight),
                fabricMeters: fabricMeters.toFixed(2),
                panelsNeeded: panelsNeeded
            },
            costs: {
                estimatedCost: Math.round(estimatedCost),
                pricePerMeter: averagePricePerMeter
            },
            allowances: {
                top: hemAllowanceTop,
                bottom: hemAllowanceBottom,
                sides: sideSeamAllowance
            }
        };
    }
    
    function displayResults(result) {
        const { input, dimensions, costs, allowances } = result;
        
        resultSection.innerHTML = `
            <div class="curtain-overview">
                <h3>🪟 Розрахунок штор ${input.windowWidth}×${input.windowHeight} см</h3>
                <div class="curtain-info">
                    <div class="info-item">
                        <span class="info-number">${dimensions.curtainWidth}</span>
                        <div class="info-label">ширина штор (см)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${dimensions.curtainHeight}</span>
                        <div class="info-label">довжина штор (см)</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${dimensions.fabricMeters}</span>
                        <div class="info-label">метрів тканини</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${dimensions.panelsNeeded}</span>
                        <div class="info-label">полотен</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${costs.estimatedCost}</span>
                        <div class="info-label">орієнтовна вартість (грн)</div>
                    </div>
                </div>
            </div>
            
            <div class="insight-cards">
                <div class="insight-card success">
                    <h6>📐 Готові розміри штор</h6>
                    <div class="big-number">${dimensions.curtainWidth} × ${dimensions.curtainHeight}</div>
                    <p>Ширина × Довжина (см)</p>
                </div>
                
                <div class="insight-card info">
                    <h6>🧵 Розміри для крою</h6>
                    <div class="big-number">${dimensions.totalFabricWidth} × ${dimensions.totalFabricHeight}</div>
                    <p>З припусками на шви (см)</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>🛒 Тканина до покупки</h6>
                    <div class="big-number">${dimensions.fabricMeters} м</div>
                    <p>При ширині ${input.fabricWidth} см</p>
                </div>
            </div>
            
            <div class="measurements-section">
                <h3>📋 Детальні розрахунки</h3>
                
                <div class="insight-cards">
                    <div class="insight-card info">
                        <h6>⚙️ Параметри розрахунку</h6>
                        <p><strong>Тип штор:</strong> ${input.curtainTypeName}</p>
                        <p><strong>Довжина:</strong> ${input.lengthTypeName}</p>
                        <p><strong>Коефіцієнт складок:</strong> ${input.coefficient}</p>
                        <p><strong>Ширина тканини:</strong> ${input.fabricWidth} см</p>
                    </div>
                    
                    <div class="insight-card success">
                        <h6>✂️ Припуски на обробку</h6>
                        <p><strong>Зверху:</strong> ${allowances.top} см (підгін)</p>
                        <p><strong>Знизу:</strong> ${allowances.bottom} см (підгін)</p>
                        <p><strong>По боках:</strong> ${allowances.sides} см (шви)</p>
                    </div>
                    
                    <div class="insight-card warning">
                        <h6>💰 Орієнтовна вартість</h6>
                        <p><strong>Тканина:</strong> ${costs.estimatedCost} грн</p>
                        <p><strong>Ціна за метр:</strong> ${costs.pricePerMeter} грн</p>
                        <p><em>Плюс аксесуари та робота</em></p>
                    </div>
                </div>
                
                <div class="tips-grid">
                    <div class="tip-item">
                        <h4>📏 Як правильно виміряти</h4>
                        <ul>
                            <li>Вимірюйте ширину <strong>карниза</strong>, а не вікна</li>
                            <li>Висоту від <strong>карниза</strong> до потрібної довжини</li>
                            <li>Враховуйте тип кріплення штор до карниза</li>
                            <li>Додайте 20-40 см до ширини вікна для карниза</li>
                            <li>Вішайте карниз на 10-20 см вище вікна</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>✂️ Поради з крою</h4>
                        <ul>
                            <li>Враховуйте напрямок малюнка на тканині</li>
                            <li>Додайте 5-10% тканини про запас</li>
                            <li>Робіть розкрій після прання тканини</li>
                            <li>Використовуйте гострі ножиці для рівного крою</li>
                            <li>Позначте центр штор для симетрії</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🪡 Обробка швів</h4>
                        <ul>
                            <li><strong>Верхній підгін:</strong> 2 рази по 7.5 см або стрічка</li>
                            <li><strong>Нижній підгін:</strong> 2 рази по 7.5 см</li>
                            <li><strong>Бокові шви:</strong> 2 рази по 2.5 см</li>
                            <li><strong>Кріплення:</strong> люверси, петлі або стрічка</li>
                            <li><strong>Прасування:</strong> обов'язково після кожного шва</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🎨 Дизайнерські поради</h4>
                        <ul>
                            <li><strong>Візуальне збільшення:</strong> штори від стелі до підлоги</li>
                            <li><strong>Широке вікно:</strong> зменшіть коефіцієнт складок</li>
                            <li><strong>Вузьке вікно:</strong> збільшіть ширину карниза</li>
                            <li><strong>Низька стеля:</strong> вертикальний рисунок</li>
                            <li><strong>Темна кімната:</strong> світлі тканини</li>
                        </ul>
                    </div>
                </div>
                
                <div class="tip-item" style="margin-top: 2rem; text-align: center; background: linear-gradient(135deg, #f8fdff 0%, #e8f8fc 100%); border-color: var(--accent);">
                    <h4>💡 Формула розрахунку</h4>
                    <p><strong>Ширина штор = Ширина карниза × Коефіцієнт складок</strong></p>
                    <p><strong>Висота крою = Довжина штор + Припуски зверху та знизу</strong></p>
                    <p><strong>Кількість тканини = Висота крою × Кількість полотен</strong></p>
                </div>
            </div>
        `;
        
        resultSection.classList.add('show');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Auto-calculate on input change for better UX
    const inputs = ['windowWidth', 'windowHeight', 'curtainType', 'curtainLength', 'fullnessCoeff', 'fabricWidth'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', debounce(() => {
                if (resultSection.classList.contains('show')) {
                    calculateCurtainSize();
                }
            }, 300));
        }
    });
    
    // Also trigger on input for number fields
    ['windowWidth', 'windowHeight', 'customLength', 'customCoeff', 'customFabricWidth'].forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', debounce(() => {
                if (resultSection.classList.contains('show')) {
                    calculateCurtainSize();
                }
            }, 500));
        }
    });
    
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