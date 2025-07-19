document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('fence-form');
  const result = document.getElementById('fence-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const length = parseFloat(document.getElementById('fence-length').value);
      const height = parseFloat(document.getElementById('fence-height').value);
      const [fenceType, costPerFoot] = document.getElementById('fence-type').value.split(',');
      const spacing = parseFloat(document.getElementById('fence-spacing').value);
      const gates = parseFloat(document.getElementById('fence-gates').value);
      const gateWidth = parseFloat(document.getElementById('fence-gate-width').value);
      const terrainMultiplier = parseFloat(document.getElementById('fence-terrain').value);
      
      if (length <= 0) {
        result.textContent = "Please enter a valid fence length.";
        return;
      }
      
      // Calculate posts needed
      const postsFromSpacing = Math.floor(length / spacing) + 1; // Posts along fence line
      const cornerPosts = 2; // Start and end posts (already included above for straight fence)
      const gatePosts = gates * 2; // Each gate needs 2 posts
      const totalPosts = postsFromSpacing + gatePosts - (gates > 0 ? gates : 0); // Subtract overlap
      
      // Calculate fence sections
      const standardSections = Math.ceil(length / spacing);
      const actualFenceLength = length - (gates * gateWidth); // Subtract gate openings
      
      // Calculate materials based on fence type
      let materials = {};
      let laborComplexity = 1.0;
      
      switch(fenceType) {
        case 'wood-privacy':
          materials = {
            posts: totalPosts,
            rails: Math.ceil(actualFenceLength / 8) * 3, // 3 rails per 8ft section
            pickets: Math.ceil(actualFenceLength * 12 / 6), // 6" spacing typical
            concrete: totalPosts * 1.5, // 1.5 bags per post
            screws: Math.ceil(actualFenceLength / 8) * 2 // 2 lbs per section
          };
          laborComplexity = 1.2;
          break;
        case 'wood-picket':
          materials = {
            posts: totalPosts,
            rails: Math.ceil(actualFenceLength / 8) * 2, // 2 rails per section
            pickets: Math.ceil(actualFenceLength * 12 / 4), // 4" spacing typical
            concrete: totalPosts * 1.5,
            screws: Math.ceil(actualFenceLength / 8) * 1.5
          };
          laborComplexity = 1.1;
          break;
        case 'vinyl':
          materials = {
            posts: totalPosts,
            panels: Math.ceil(actualFenceLength / 8),
            concrete: totalPosts * 1.5,
            brackets: Math.ceil(actualFenceLength / 8) * 2
          };
          laborComplexity = 1.0;
          break;
        case 'chain-link':
          materials = {
            posts: totalPosts,
            fabric: Math.ceil(actualFenceLength), // Linear feet
            rails: Math.ceil(actualFenceLength / 10), // Top rail every 10ft
            concrete: totalPosts * 1,
            ties: Math.ceil(actualFenceLength * 8) // 8 ties per linear foot
          };
          laborComplexity = 0.9;
          break;
        case 'aluminum':
        case 'steel':
          materials = {
            posts: totalPosts,
            panels: Math.ceil(actualFenceLength / 6), // 6ft panels typical
            concrete: totalPosts * 1.5,
            brackets: Math.ceil(actualFenceLength / 6) * 4
          };
          laborComplexity = 1.1;
          break;
      }
      
      // Calculate costs
      const materialCost = actualFenceLength * parseFloat(costPerFoot);
      const gateCost = gates * gateWidth * parseFloat(costPerFoot) * 1.5; // Gates cost 50% more
      const hardwareCost = gates * 150; // Gate hardware
      const adjustedCost = (materialCost + gateCost + hardwareCost) * terrainMultiplier;
      
      // Calculate labor estimate
      const laborHours = (length / 20) * height * laborComplexity * terrainMultiplier; // ~20 ft per hour base
      const laborCost = laborHours * 75; // $75/hour average
      
      // Calculate hole digging
      const holeDepth = (height / 3) + 0.5; // 1/3 height + 6 inches
      const totalDigging = totalPosts * holeDepth;
      
      // Post size recommendations
      let postSize = '';
      switch(fenceType) {
        case 'wood-privacy':
        case 'wood-picket':
          postSize = '4×4 pressure-treated posts';
          break;
        case 'vinyl':
          postSize = '4×4 vinyl or aluminum posts';
          break;
        case 'chain-link':
          postSize = '2-3/8" galvanized steel posts';
          break;
        case 'aluminum':
        case 'steel':
          postSize = '3×3" aluminum/steel posts';
          break;
      }
      
      result.innerHTML = `
        <div class="result-section">
          <h4>Fence Specifications:</h4>
          <p>Total fence length: ${length} linear feet</p>
          <p>Fence height: ${height} feet</p>
          <p>Fence type: ${fenceType.replace('-', ' ')}</p>
          <p>Post spacing: ${spacing} feet on center</p>
          <p>Actual fence length: ${actualFenceLength} ft (minus ${gates} gates)</p>
        </div>
        
        <div class="result-posts">
          <h4>Posts & Foundation:</h4>
          <p><strong>${totalPosts} ${postSize}</strong></p>
          <p>- ${postsFromSpacing} line posts</p>
          ${gatePosts > 0 ? `<p>- ${gatePosts} gate posts</p>` : ''}
          <p><strong>Post holes: ${totalPosts} holes, ${holeDepth.toFixed(1)}' deep</strong></p>
          <p>Concrete needed: ${materials.concrete || 0} bags (50 lb fast-set)</p>
          <p>Total digging: ${totalDigging.toFixed(1)} cubic feet</p>
        </div>
        
        <div class="result-materials">
          <h4>Fence Materials:</h4>
          ${fenceType.includes('wood') ? `
          <p><strong>Rails:</strong> ${materials.rails || 0} pieces (2×4 × 8')</p>
          <p><strong>Pickets:</strong> ${materials.pickets || 0} pieces</p>
          <p><strong>Screws:</strong> ${materials.screws || 0} lbs galvanized</p>
          ` : ''}
          ${fenceType === 'vinyl' ? `
          <p><strong>Panels:</strong> ${materials.panels || 0} vinyl panels</p>
          <p><strong>Brackets:</strong> ${materials.brackets || 0} mounting brackets</p>
          ` : ''}
          ${fenceType === 'chain-link' ? `
          <p><strong>Fabric:</strong> ${materials.fabric || 0} linear feet</p>
          <p><strong>Top rail:</strong> ${materials.rails || 0} pieces</p>
          <p><strong>Ties:</strong> ${materials.ties || 0} chain link ties</p>
          ` : ''}
          ${(fenceType === 'aluminum' || fenceType === 'steel') ? `
          <p><strong>Panels:</strong> ${materials.panels || 0} metal panels</p>
          <p><strong>Brackets:</strong> ${materials.brackets || 0} mounting brackets</p>
          ` : ''}
        </div>
        
        ${gates > 0 ? `
        <div class="result-gates">
          <h4>Gate Materials:</h4>
          <p><strong>${gates} gates</strong> (${gateWidth}' wide each)</p>
          <p>Gate frames: ${gates} complete gate sets</p>
          <p>Hinges: ${gates * 2} heavy-duty hinges</p>
          <p>Latches: ${gates} gate latches</p>
          <p>Hardware cost: $${hardwareCost}</p>
        </div>
        ` : ''}
        
        <div class="result-costs">
          <h4>Cost Breakdown:</h4>
          <p>Fence materials: $${materialCost.toFixed(0)}</p>
          ${gates > 0 ? `<p>Gate materials: $${gateCost.toFixed(0)}</p>` : ''}
          ${gates > 0 ? `<p>Gate hardware: $${hardwareCost}</p>` : ''}
          ${terrainMultiplier > 1 ? `<p>Terrain adjustment: ${((terrainMultiplier - 1) * 100).toFixed(0)}%</p>` : ''}
          <p><strong>Total materials: $${adjustedCost.toFixed(0)}</strong></p>
          <p>Professional labor: $${laborCost.toFixed(0)}</p>
          <p><strong>Total project cost: $${(adjustedCost + laborCost).toFixed(0)}</strong></p>
        </div>
        
        <div class="result-installation">
          <h4>Installation Timeline:</h4>
          <p>Estimated labor: ${laborHours.toFixed(1)} hours</p>
          <p>DIY timeline: ${Math.ceil(laborHours / 8)} days (8 hrs/day)</p>
          <p>Professional: ${Math.ceil(laborHours / 16)} days (2-person crew)</p>
          <p>Post setting: allow 24-48 hours cure time</p>
        </div>
        
        <div class="result-tools">
          <h4>Tools Required:</h4>
          <p>🕳️ Post hole digger or auger</p>
          <p>📏 Level and measuring tape</p>
          <p>🔨 Drill and impact driver</p>
          <p>⚡ Circular saw or miter saw</p>
          <p>🧤 Safety equipment (gloves, glasses)</p>
          <p>📐 String line and stakes</p>
        </div>
        
        <div class="result-permits">
          <h4>Before You Start:</h4>
          <p>📞 Call 811 for utility marking (required)</p>
          <p>📋 Check local fence permits and codes</p>
          <p>📏 Verify property lines and setbacks</p>
          <p>🤝 Discuss with neighbors (shared fence lines)</p>
          <p>🌦️ Check weather forecast (avoid wet conditions)</p>
        </div>
        
        <div class="result-tips">
          <h4>Money-Saving Tips:</h4>
          <p>💰 DIY installation saves 50% on labor</p>
          <p>📦 Buy materials in bulk for discounts</p>
          <p>⏰ Shop off-season for better prices</p>
          <p>🔧 Rent specialized tools vs buying</p>
          <p>👥 Get multiple contractor quotes</p>
        </div>
      `;
    });
  }
});