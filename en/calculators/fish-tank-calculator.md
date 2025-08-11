---
layout: calculator
title: "Fish Tank Calculator"
categories: [other]
seo:
  title: "Fish Tank Calculator | Aquarium Volume, Equipment & Care Calculator"
  description: "Calculate fish tank volume, required equipment, fish capacity and maintenance costs. Suitable for 5-100 gallon tanks, betta, saltwater and freshwater aquariums."
  keywords:
    - fish tank calculator
    - aquarium calculator
    - tank volume calculator
    - 10 gallon fish tank
    - 20 gallon fish tank
    - betta fish tank
    - 5 gallon fish tank
    - 75 gallon fish tank
    - 55 gallon fish tank
    - fish tank stand
    - 30 gallon fish tank
    - 100 gallon fish tank
    - 50 gallon fish tank
    - fish tank filter
    - 40 gallon fish tank
    - small fish tank
    - saltwater fish tank
    - fish tank heater
    - 15 gallon fish tank
    - aquarium maintenance
    - fish stocking calculator
  content: |
    <h2>Fish Tank Calculator</h2>
    <p>This comprehensive <strong>fish tank calculator</strong> helps you determine all essential parameters for successful fishkeeping. Calculate tank volume, required equipment, fish capacity, and maintenance costs for your aquarium.</p>
    
    <h3>🐠 What the Calculator Determines:</h3>
    <ul>
      <li><strong>Volume & Dimensions</strong> - precise calculations in liters and gallons</li>
      <li><strong>Equipment Requirements</strong> - filter, heater, lighting, aeration</li>
      <li><strong>Fish Capacity</strong> - safe stocking density recommendations</li>
      <li><strong>Maintenance Schedule</strong> - water changes, cleaning, feeding</li>
      <li><strong>Cost Analysis</strong> - initial setup and monthly operating costs</li>
      <li><strong>Expert Recommendations</strong> - for beginners and experienced aquarists</li>
    </ul>
    
    <h3>🎯 Tank Types Supported:</h3>
    <ul>
      <li><strong>Freshwater:</strong> 5-100 gallons, tropical and coldwater</li>
      <li><strong>Saltwater:</strong> minimum 20 gallons, advanced equipment</li>
      <li><strong>Betta Tanks:</strong> minimum 5 gallons, special requirements</li>
      <li><strong>Cichlid Tanks:</strong> large tanks from 55 gallons</li>
      <li><strong>Planted Tanks:</strong> CO2 systems, specialized lighting</li>
    </ul>
    
    <h3>⚙️ Essential Equipment:</h3>
    <ul>
      <li><strong>Filter:</strong> 4-10x tank volume turnover per hour</li>
      <li><strong>Heater:</strong> 5 watts per gallon for tropical species</li>
      <li><strong>Lighting:</strong> LED 0.5-1 watt per gallon</li>
      <li><strong>Aeration:</strong> for oxygen saturation</li>
      <li><strong>Thermometer:</strong> temperature monitoring</li>
    </ul>
    
    <h3>📊 Fish Tank Size Guide:</h3>
    <ul>
      <li><strong>Nano (5-10 gal):</strong> Bettas, shrimp, small fish</li>
      <li><strong>Small (15-20 gal):</strong> Community fish, beginner setups</li>
      <li><strong>Medium (30-40 gal):</strong> Diverse communities, some cichlids</li>
      <li><strong>Large (55-75 gal):</strong> Large fish, stable ecosystems</li>
      <li><strong>Extra Large (100+ gal):</strong> Show tanks, aggressive species</li>
    </ul>
    
    <h3>💡 Beginner Tips:</h3>
    <ul>
      <li>Start with a 20+ gallon tank for stability</li>
      <li>Cycle your tank before adding fish</li>
      <li>Research fish compatibility thoroughly</li>
      <li>Never overfeed - it's the #1 mistake</li>
      <li>Regular water testing is essential</li>
      <li>Invest in quality filtration</li>
    </ul>
scripts:
  - /en/js/fish-tank-calculator.js
faq:
  - question: What size fish tank is best for beginners?
    answer: "For beginners, we recommend starting with a 20-40 gallon tank. Larger tanks are more stable and forgiving than smaller ones, making them easier to maintain."
  - question: How many fish can I keep in my tank?
    answer: "A general rule is 1 inch of fish per gallon for small fish, but this varies by species. Larger fish need more space. It's better to understock than overstock your tank."
  - question: How often should I change the water?
    answer: "Typically 25-30% weekly water changes. New tanks or tanks with problems may require more frequent changes."
  - question: Do all fish tanks need a heater?
    answer: "Tropical fish require heaters to maintain 75-78°F (24-26°C). Coldwater fish like goldfish don't need heaters in most climates."
  - question: What's easier - saltwater or freshwater?
    answer: "Freshwater tanks are much easier for beginners. Saltwater tanks are beautiful but require more knowledge, equipment, and maintenance."
  - question: How much does it cost to maintain a fish tank?
    answer: "Initial setup: $200-1000+ depending on size. Monthly costs: $15-50 for food, electricity, and chemicals."
  - question: What's the minimum tank size for a betta fish?
    answer: "Minimum 5 gallons for a single betta, though 10+ gallons is ideal. Bettas need warm water (78-80°F) and gentle filtration."
  - question: How do I calculate my tank's volume?
    answer: "Length × Width × Height (in inches) ÷ 231 = gallons. For metric: Length × Width × Height (in cm) ÷ 1000 = liters."
  - question: What's the most important equipment for a fish tank?
    answer: "Filtration is #1 priority, followed by appropriate lighting and heating (for tropical fish). A good filter is worth the investment."
  - question: How long should I wait before adding fish?
    answer: "New tanks should be cycled for 4-6 weeks before adding fish. This establishes beneficial bacteria to process fish waste."
---

<form id="fish-tank-form" autocomplete="off">
  <div class="form-group">
    <label>
      🐠 Tank Type:
      <select id="tank-type" required>
        <option value="">Select tank type...</option>
        <option value="freshwater">🌿 Freshwater (Tropical)</option>
        <option value="coldwater">❄️ Freshwater (Coldwater)</option>
        <option value="saltwater">🌊 Saltwater/Marine</option>
        <option value="betta">🔥 Betta Tank</option>
        <option value="cichlid">🏺 Cichlid Tank</option>
        <option value="planted">🌱 Planted Tank</option>
      </select>
    </label>
  </div>

  <div class="form-group">
    <label>
      📏 Tank Size:
      <select id="tank-size" required>
        <option value="">Select size...</option>
        <option value="5">5 gallons (19L) - 🔬 Nano Tank</option>
        <option value="10">10 gallons (38L) - 📦 Small</option>
        <option value="15">15 gallons (57L) - 🎒 Compact</option>
        <option value="20">20 gallons (76L) - ✅ Standard</option>
        <option value="30">30 gallons (114L) - 📏 Medium</option>
        <option value="40">40 gallons (151L) - 📐 Large</option>
        <option value="50">50 gallons (189L) - 📊 Very Large</option>
        <option value="55">55 gallons (208L) - ⭐ Popular</option>
        <option value="75">75 gallons (284L) - 🏠 Spacious</option>
        <option value="100">100 gallons (379L) - 🏢 Giant</option>
        <option value="custom">🔧 Custom Size</option>
      </select>
    </label>
  </div>

  <div id="custom-size" style="display: none;">
    <div class="form-row">
      <label>
        Length (inches):
        <input type="number" id="tank-length" min="4" max="120">
      </label>
      <label>
        Width (inches):
        <input type="number" id="tank-width" min="4" max="40">
      </label>
      <label>
        Height (inches):
        <input type="number" id="tank-height" min="4" max="40">
      </label>
    </div>
  </div>

  <div class="form-group">
    <label>
      👨‍🎓 Experience Level:
      <select id="experience-level" required>
        <option value="">Select experience...</option>
        <option value="beginner">🌱 Beginner</option>
        <option value="intermediate">🎯 Intermediate</option>
        <option value="advanced">🏆 Advanced</option>
      </select>
    </label>
  </div>

  <div class="form-group">
    <label>
      💰 Budget Range:
      <select id="budget-range" required>
        <option value="">Select budget...</option>
        <option value="low">💵 Budget (under $300)</option>
        <option value="medium">💳 Moderate ($300-800)</option>
        <option value="high">💎 Premium ($800+)</option>
      </select>
    </label>
  </div>

  <button type="submit">🐠 Calculate Tank Requirements</button>
</form>

<div id="fish-tank-result" class="result"></div>