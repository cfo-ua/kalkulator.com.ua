---
layout: calculator
title: Power Plug & Voltage Checker
categories:
- travel
faq:
- answer: 'There are 15 main plug types (A-O). Most common: A/B (USA), C/F (Europe), G (UK), I (Australia). Each country has its own standards.'
  question: What plug types exist worldwide?
- answer: Voltage ranges from 100V to 240V. USA/Canada use 110-120V, most of Europe/Asia use 220-240V. Frequency can be 50Hz or 60Hz.
  question: What are standard voltages in different countries?
- answer: Universal adapters work for most countries but not all. Check compatibility with specific country. Some devices may need a transformer.
  question: Can I use a universal adapter?
- answer: A transformer is needed if your device doesn't support the destination country's voltage. An adapter only changes plug shape, transformer changes voltage.
  question: When do I need a voltage transformer?
- answer: Check the device label. If it says "100-240V", it's universal. If only "110V" or "220V" - you need a transformer for other voltages.
  question: How to check if my device supports different voltages?
- answer: Yes, high-power devices (hair dryers, irons, kettles) are usually not universal and may need powerful transformers or replacement.
  question: Are there specifics for high-power devices?
- answer: Yes, some countries have regional differences. For example, in Brazil different states may use different types, in Italy old buildings may have other standards.
  question: Can there be exceptions within one country?
- answer: Grounding is important for safety. Some adapters don't carry grounding. For sensitive devices (laptops, medical equipment) it's better to use grounded outlets.
  question: Is grounding important in outlets?
scripts:
- /en/js/power-plug-voltage-checker.js
seo:
  content: "<h2>Power Plug & Voltage Checker for Travel</h2>\n<p>Check <strong>plug and voltage compatibility</strong> for your devices in different countries. Our calculator helps determine needed adapters and transformers for safe travel.</p>\n\n<h3>What the calculator checks:</h3>\n<ul>\n  <li><strong>Plug Types:</strong> 15 international standards (A-O)</li>\n  <li><strong>Voltage and Frequency:</strong> Compatibility of your devices</li>\n  <li><strong>Required Adapters:</strong> Specific recommendations</li>\n  <li><strong>Safety:</strong> Warnings about incompatibility</li>\n</ul>\n\n<h3>Plug Types by Region:</h3>\n<ul>\n  <li><strong>North America:</strong> A/B (flat pins)</li>\n  <li><strong>Europe:</strong> C/F (round pins, Schuko)</li>\n  <li><strong>United Kingdom:</strong> G (three rectangular pins)</li>\n  <li><strong>Australia/New Zealand:</strong> I (three flat pins)</li>\n  <li><strong>South Africa:</strong> M (three round pins)</li>\n  <li><strong>India:</strong> C/D/M (mixed standards)</li>\n</ul>\n\n<h3>Voltage Standards:</h3>\n<ul>\n  <li><strong>110-120V, 60Hz:</strong> USA, Canada, most Central America</li>\n  <li><strong>220-240V, 50Hz:</strong> Europe, Asia, Africa, Australia</li>\n  <li><strong>100V, 50/60Hz:</strong> Japan (unique standard)</li>\n  <li><strong>Mixed:</strong> Some countries have multiple standards</li>\n</ul>\n\n<h3>Universal Devices:</h3>\n<ul>\n  <li><strong>Laptops:</strong> Usually 100-240V (need only adapter)</li>\n  <li><strong>Phone Chargers:</strong> Mostly universal</li>\n  <li><strong>Cameras:</strong> Most modern ones are universal</li>\n  <li><strong>Medical Equipment:</strong> Check individually</li>\n</ul>\n\n<h3>Need Transformer:</h3>\n<ul>\n  <li><strong>Hair Dryers:</strong> Usually single-voltage</li>\n  <li><strong>Irons:</strong> Often need transformer</li>\n  <li><strong>Electric Shavers:</strong> Older models may be single-voltage</li>\n  <li><strong>Small Appliances:</strong> Coffee makers, kettles, toasters</li>\n</ul>\n\n<h3>Tips for Safe Travel:</h3>\n<ul>\n  <li><strong>Check Labels:</strong> Always read device specifications</li>\n  <li><strong>Quality Adapters:</strong> Buy certified products</li>\n  <li><strong>Backup Options:</strong> Bring multiple adapters</li>\n  <li><strong>Local Purchase:</strong> Sometimes cheaper to buy locally</li>\n  <li><strong>Safety First:</strong> Don't risk with questionable adapters</li>\n</ul>\n\n<p>Use our <strong>power plug and voltage calculator</strong> to plan your electrical needs for travel and ensure safety of your devices!</p>\n"
  description: Check plug and voltage compatibility for travel. Determine needed adapters and transformers for your devices in different countries worldwide.
  keywords:
  - travel power plugs
  - outlet adapters
  - voltage in different countries
  - voltage transformer
  - plug types
  - electrical standards by country
  - universal adapter
  - power outlets worldwide
  - electrical compatibility
  - voltage checker
  - international plugs
  - travel adapter
  - electrical plugs
  - power grid standards
  - electrical device safety
---

<div class="calculator-form">
  <form id="power-plug-form">
    <div class="form-section">
      <h3>🏠 Your Country (From)</h3>
      
      <div class="form-group">
        <label for="home-country">📍 Home Country:</label>
        <select id="home-country" required>
          <option value="">Select Country</option>
          <option value="ukraine">🇺🇦 Ukraine</option>
          <option value="usa">🇺🇸 United States</option>
          <option value="germany">🇩🇪 Germany</option>
          <option value="uk">🇬🇧 United Kingdom</option>
          <option value="france">🇫🇷 France</option>
          <option value="poland">🇵🇱 Poland</option>
          <option value="canada">🇨🇦 Canada</option>
          <option value="australia">🇦🇺 Australia</option>
          <option value="japan">🇯🇵 Japan</option>
          <option value="china">🇨🇳 China</option>
          <option value="india">🇮🇳 India</option>
          <option value="brazil">🇧🇷 Brazil</option>
        </select>
      </div>
    </div>

    <div class="form-section">
      <h3>✈️ Destination Country</h3>
      
      <div class="form-group">
        <label for="destination-country">🎯 Where You're Going:</label>
        <select id="destination-country" required>
          <option value="">Select Country</option>
          <option value="usa">🇺🇸 United States</option>
          <option value="canada">🇨🇦 Canada</option>
          <option value="mexico">🇲🇽 Mexico</option>
          <option value="germany">🇩🇪 Germany</option>
          <option value="france">🇫🇷 France</option>
          <option value="italy">🇮🇹 Italy</option>
          <option value="spain">🇪🇸 Spain</option>
          <option value="netherlands">🇳🇱 Netherlands</option>
          <option value="poland">🇵🇱 Poland</option>
          <option value="uk">🇬🇧 United Kingdom</option>
          <option value="ireland">🇮🇪 Ireland</option>
          <option value="switzerland">🇨🇭 Switzerland</option>
          <option value="austria">🇦🇹 Austria</option>
          <option value="czech">🇨🇿 Czech Republic</option>
          <option value="norway">🇳🇴 Norway</option>
          <option value="sweden">🇸🇪 Sweden</option>
          <option value="denmark">🇩🇰 Denmark</option>
          <option value="finland">🇫🇮 Finland</option>
          <option value="russia">🇷🇺 Russia</option>
          <option value="turkey">🇹🇷 Turkey</option>
          <option value="greece">🇬🇷 Greece</option>
          <option value="portugal">🇵🇹 Portugal</option>
          <option value="australia">🇦🇺 Australia</option>
          <option value="new-zealand">🇳🇿 New Zealand</option>
          <option value="japan">🇯🇵 Japan</option>
          <option value="south-korea">🇰🇷 South Korea</option>
          <option value="china">🇨🇳 China</option>
          <option value="hong-kong">🇭🇰 Hong Kong</option>
          <option value="singapore">🇸🇬 Singapore</option>
          <option value="malaysia">🇲🇾 Malaysia</option>
          <option value="thailand">🇹🇭 Thailand</option>
          <option value="vietnam">🇻🇳 Vietnam</option>
          <option value="philippines">🇵🇭 Philippines</option>
          <option value="indonesia">🇮🇩 Indonesia</option>
          <option value="india">🇮🇳 India</option>
          <option value="uae">🇦🇪 UAE</option>
          <option value="israel">🇮🇱 Israel</option>
          <option value="saudi-arabia">🇸🇦 Saudi Arabia</option>
          <option value="south-africa">🇿🇦 South Africa</option>
          <option value="egypt">🇪🇬 Egypt</option>
          <option value="morocco">🇲🇦 Morocco</option>
          <option value="brazil">🇧🇷 Brazil</option>
          <option value="argentina">🇦🇷 Argentina</option>
          <option value="chile">🇨🇱 Chile</option>
          <option value="peru">🇵🇪 Peru</option>
          <option value="colombia">🇨🇴 Colombia</option>
        </select>
      </div>
    </div>

    <div class="form-section">
      <h3>🔌 Your Devices</h3>
      
      <div class="device-list" id="device-list">
        <div class="device-item">
          <div class="form-row">
            <div class="form-group">
              <label>📱 Device Type:</label>
              <select class="device-type">
                <option value="phone-charger">📱 Phone Charger</option>
                <option value="laptop">💻 Laptop</option>
                <option value="camera">📷 Camera</option>
                <option value="hair-dryer">🔥 Hair Dryer</option>
                <option value="hair-straightener">💇 Hair Straightener</option>
                <option value="electric-shaver">🪒 Electric Shaver</option>
                <option value="tablet">📱 Tablet</option>
                <option value="power-bank">🔋 Power Bank</option>
                <option value="gaming-console">🎮 Gaming Console</option>
                <option value="other">❓ Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>⚡ Device Voltage:</label>
              <select class="device-voltage">
                <option value="universal">🌍 Universal (100-240V)</option>
                <option value="110v">🇺🇸 110-120V</option>
                <option value="220v">🇪🇺 220-240V</option>
                <option value="unknown">❓ Don't Know</option>
              </select>
            </div>
            
            <button type="button" class="remove-device" onclick="removeDevice(this)">❌</button>
          </div>
        </div>
      </div>
      
      <button type="button" id="add-device" class="add-btn">➕ Add Device</button>
    </div>

    <button type="submit" class="calculate-btn">🔍 Check Compatibility</button>
  </form>
</div>

<div id="power-plug-result" class="result-section"></div>