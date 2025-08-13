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
            alert('Please enter valid window dimensions');
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
        let fabricWidthInches;
        if (fabricWidthType === 'custom') {
            fabricWidthInches = parseFloat(document.getElementById('customFabricWidth').value) || 54;
        } else {
            fabricWidthInches = parseFloat(fabricWidthType);
        }
        
        // Calculate curtain length
        let curtainHeightInches;
        if (lengthType === 'custom') {
            curtainHeightInches = parseFloat(document.getElementById('customLength').value) || height;
        } else {
            const lengthAdjustments = {
                'sill': -6,      // To window sill
                'below-sill': 8, // Below sill
                'floor': -1,     // Floor length
                'puddle': 4      // Puddle style
            };
            curtainHeightInches = height + (lengthAdjustments[lengthType] || 0);
        }
        
        // Calculate curtain width (finished width)
        const curtainWidthInches = width * coefficient;
        
        // Add seam allowances (in inches)
        const hemAllowanceTop = 6;      // Top hem allowance
        const hemAllowanceBottom = 6;   // Bottom hem allowance
        const sideSeamAllowance = 4;    // Side seam allowance (2" each side)
        
        // Total fabric needed
        const totalFabricHeight = curtainHeightInches + hemAllowanceTop + hemAllowanceBottom;
        const totalFabricWidth = curtainWidthInches + sideSeamAllowance;
        
        // Calculate number of fabric panels needed
        const panelsNeeded = Math.ceil(totalFabricWidth / fabricWidthInches);
        const totalFabricYardage = (totalFabricHeight * panelsNeeded) / 36; // Convert to yards
        
        // Convert to metric for international users
        const curtainWidthCm = Math.round(curtainWidthInches * 2.54);
        const curtainHeightCm = Math.round(curtainHeightInches * 2.54);
        const fabricMeters = (totalFabricYardage * 0.9144).toFixed(2);
        
        // Cost estimation (average price per yard)
        const averagePricePerYard = 15; // USD
        const estimatedCost = Math.round(totalFabricYardage * averagePricePerYard);
        
        // Curtain type characteristics
        const curtainTypes = {
            'classic': { name: 'Classic Curtains', defaultCoeff: 2.0 },
            'roman': { name: 'Roman Shades', defaultCoeff: 1.1 },
            'japanese': { name: 'Japanese Panels', defaultCoeff: 1.0 },
            'austrian': { name: 'Austrian Curtains', defaultCoeff: 2.5 },
            'french': { name: 'French Curtains', defaultCoeff: 2.5 },
            'cafe': { name: 'Cafe Curtains', defaultCoeff: 1.5 }
        };
        
        const lengthTypes = {
            'sill': 'To Window Sill',
            'below-sill': 'Below Window Sill', 
            'floor': 'Floor Length',
            'puddle': 'Puddle Style',
            'custom': 'Custom Length'
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
                fabricWidth: fabricWidthInches
            },
            dimensions: {
                curtainWidth: Math.round(curtainWidthInches),
                curtainHeight: Math.round(curtainHeightInches),
                curtainWidthCm: curtainWidthCm,
                curtainHeightCm: curtainHeightCm,
                totalFabricWidth: Math.round(totalFabricWidth),
                totalFabricHeight: Math.round(totalFabricHeight),
                fabricYards: totalFabricYardage.toFixed(2),
                fabricMeters: fabricMeters,
                panelsNeeded: panelsNeeded
            },
            costs: {
                estimatedCost: estimatedCost,
                pricePerYard: averagePricePerYard
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
                <h3>🪟 Curtain Calculation for ${input.windowWidth}"×${input.windowHeight}" Window</h3>
                <div class="curtain-info">
                    <div class="info-item">
                        <span class="info-number">${dimensions.curtainWidth}"</span>
                        <div class="info-label">curtain width</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${dimensions.curtainHeight}"</span>
                        <div class="info-label">curtain length</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${dimensions.fabricYards}</span>
                        <div class="info-label">yards of fabric</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${dimensions.panelsNeeded}</span>
                        <div class="info-label">fabric panels</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">$${costs.estimatedCost}</span>
                        <div class="info-label">estimated cost</div>
                    </div>
                </div>
            </div>
            
            <div class="insight-cards">
                <div class="insight-card success">
                    <h6>📐 Finished Curtain Size</h6>
                    <div class="big-number">${dimensions.curtainWidth}" × ${dimensions.curtainHeight}"</div>
                    <p>Width × Length (inches)</p>
                </div>
                
                <div class="insight-card info">
                    <h6>✂️ Cut Dimensions</h6>
                    <div class="big-number">${dimensions.totalFabricWidth}" × ${dimensions.totalFabricHeight}"</div>
                    <p>Including seam allowances</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>🛒 Fabric to Purchase</h6>
                    <div class="big-number">${dimensions.fabricYards} yds</div>
                    <p>At ${input.fabricWidth}" width</p>
                </div>
            </div>
            
            <div class="measurements-section">
                <h3>📋 Detailed Calculations</h3>
                
                <div class="insight-cards">
                    <div class="insight-card info">
                        <h6>⚙️ Calculation Parameters</h6>
                        <p><strong>Curtain Type:</strong> ${input.curtainTypeName}</p>
                        <p><strong>Length Style:</strong> ${input.lengthTypeName}</p>
                        <p><strong>Fullness Ratio:</strong> ${input.coefficient}x</p>
                        <p><strong>Fabric Width:</strong> ${input.fabricWidth}"</p>
                    </div>
                    
                    <div class="insight-card success">
                        <h6>✂️ Seam Allowances</h6>
                        <p><strong>Top Hem:</strong> ${allowances.top}" (header/rod pocket)</p>
                        <p><strong>Bottom Hem:</strong> ${allowances.bottom}" (double fold)</p>
                        <p><strong>Side Seams:</strong> ${allowances.sides}" total (2" each side)</p>
                    </div>
                    
                    <div class="insight-card warning">
                        <h6>💰 Cost Breakdown</h6>
                        <p><strong>Fabric:</strong> $${costs.estimatedCost}</p>
                        <p><strong>Price per yard:</strong> $${costs.pricePerYard}</p>
                        <p><strong>Metric:</strong> ${dimensions.fabricMeters} meters</p>
                        <p><em>Plus hardware and labor</em></p>
                    </div>
                </div>
                
                <div class="tips-grid">
                    <div class="tip-item">
                        <h4>📏 Measuring Guidelines</h4>
                        <ul>
                            <li>Measure <strong>rod width</strong>, not window width</li>
                            <li>Height from <strong>rod</strong> to desired length</li>
                            <li>Account for curtain mounting hardware</li>
                            <li>Add 8-16" to window width for rod extension</li>
                            <li>Mount rod 4-8" above window frame</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>✂️ Cutting Tips</h4>
                        <ul>
                            <li>Consider fabric pattern direction and matching</li>
                            <li>Add 5-10% extra fabric for safety margin</li>
                            <li>Pre-wash fabric before cutting</li>
                            <li>Use sharp fabric scissors for clean cuts</li>
                            <li>Mark curtain center for symmetrical hanging</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🪡 Sewing Instructions</h4>
                        <ul>
                            <li><strong>Top hem:</strong> 3" double fold or header tape</li>
                            <li><strong>Bottom hem:</strong> 3" double fold for weight</li>
                            <li><strong>Side seams:</strong> 1" double fold</li>
                            <li><strong>Hardware:</strong> grommets, tabs, or rod pocket</li>
                            <li><strong>Pressing:</strong> Iron after each seam</li>
                        </ul>
                    </div>
                    
                    <div class="tip-item">
                        <h4>🎨 Design Considerations</h4>
                        <ul>
                            <li><strong>Ceiling mount:</strong> Makes windows appear taller</li>
                            <li><strong>Wide windows:</strong> Reduce fullness ratio</li>
                            <li><strong>Narrow windows:</strong> Extend rod width</li>
                            <li><strong>Low ceilings:</strong> Use vertical patterns</li>
                            <li><strong>Dark rooms:</strong> Choose light-colored fabrics</li>
                        </ul>
                    </div>
                </div>
                
                <div class="tip-item" style="margin-top: 2rem; text-align: center; background: linear-gradient(135deg, #f8fdff 0%, #e8f8fc 100%); border-color: var(--accent);">
                    <h4>💡 Calculation Formula</h4>
                    <p><strong>Curtain Width = Rod Width × Fullness Ratio</strong></p>
                    <p><strong>Cut Height = Curtain Length + Top & Bottom Hems</strong></p>
                    <p><strong>Total Fabric = Cut Height × Number of Panels</strong></p>
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