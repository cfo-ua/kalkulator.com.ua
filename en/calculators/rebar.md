---
layout: calculator
title: "Rebar Calculator"
categories: [construction]
seo:
  title: "Rebar Calculator | Concrete Reinforcement Steel Calculator"
  description: "Calculate rebar needed for concrete slabs, footings, and walls. Professional reinforcement calculator estimates quantity, spacing, and costs for construction projects."
  keywords:
    - rebar calculator
    - reinforcement calculator
    - concrete rebar calculator
    - rebar quantity calculator
    - rebar spacing calculator
    - concrete reinforcement calculator
    - steel reinforcement calculator
    - rebar weight calculator
    - rebar cost calculator
    - foundation rebar calculator
    - slab rebar calculator
    - footing rebar calculator
    - concrete steel calculator
    - rebar mesh calculator
    - rebar layout calculator
    - construction rebar calculator
    - rebar estimator
    - reinforcement steel calculator
    - rebar material calculator
    - concrete strength calculator
    - rebar grid calculator
    - building rebar calculator
  content: |
    <h2>Rebar Calculator</h2>
    <p>Calculate the exact amount of <strong>rebar (reinforcement steel)</strong> needed for concrete slabs, footings, walls, and foundations. This professional rebar calculator estimates quantity, spacing, lengths, and costs.</p>

    <h3>Common Rebar Sizes & Applications:</h3>
    <ul>
      <li><strong>#3 (3/8"):</strong> residential slabs, light construction</li>
      <li><strong>#4 (1/2"):</strong> driveways, sidewalks, small foundations</li>
      <li><strong>#5 (5/8"):</strong> house foundations, retaining walls</li>
      <li><strong>#6 (3/4"):</strong> heavy foundations, commercial construction</li>
      <li><strong>#7 (7/8"):</strong> large foundations, structural beams</li>
      <li><strong>#8 (1"):</strong> commercial/industrial applications</li>
    </ul>

    <h3>Rebar Spacing Guidelines:</h3>
    <ul>
      <li><strong>Residential slabs:</strong> #4 @ 18" on center both ways</li>
      <li><strong>Driveways:</strong> #4 @ 12" on center both ways</li>
      <li><strong>Footings:</strong> #4 or #5 @ 12" spacing</li>
      <li><strong>Retaining walls:</strong> #5 @ 12" vertical, #4 @ 18" horizontal</li>
    </ul>

    <h3>Concrete Cover Requirements:</h3>
    <ul>
      <li><strong>Slabs on ground:</strong> 3" clear cover</li>
      <li><strong>Footings:</strong> 3" clear cover (bottom and sides)</li>
      <li><strong>Walls:</strong> 2" cover exterior, 3/4" cover interior</li>
      <li><strong>Beams/columns:</strong> 1.5" minimum cover</li>
    </ul>

    <h3>Rebar Lengths & Costs:</h3>
    <ul>
      <li><strong>Standard lengths:</strong> 20', 40', 60' (20' most common)</li>
      <li><strong>#3 rebar:</strong> $8-12 per 20' stick</li>
      <li><strong>#4 rebar:</strong> $12-18 per 20' stick</li>
      <li><strong>#5 rebar:</strong> $18-25 per 20' stick</li>
      <li><strong>#6 rebar:</strong> $25-35 per 20' stick</li>
    </ul>

    <h3>Rebar Accessories:</h3>
    <ul>
      <li><strong>Rebar ties:</strong> wire ties to connect intersections</li>
      <li><strong>Chairs/supports:</strong> maintain proper spacing from ground</li>
      <li><strong>Couplers:</strong> connect rebar pieces end-to-end</li>
      <li><strong>Bending tools:</strong> create hooks and bends</li>
    </ul>
scripts:
  - /en/js/rebar.js
faq:
  - question: How much rebar do I need for a 10x10 concrete slab?
    answer: "For a 10×10 slab with #4 rebar at 18\" spacing: approximately 13 pieces of 20' rebar (11 each direction plus extras for cuts/waste)."
  - question: What size rebar for residential foundation?
    answer: "#4 or #5 rebar is standard for residential foundations. Use #4 for lighter loads, #5 for heavier loads or challenging soil conditions."
  - question: How do I calculate rebar spacing?
    answer: "Divide slab dimension by desired spacing, add 1. For 10' slab with 18\" spacing: (120\" ÷ 18\") + 1 = 7.7, so use 8 pieces."
  - question: Do I need rebar in a 4-inch concrete slab?
    answer: "Not always required by code, but recommended for durability. Rebar prevents cracking and increases load capacity significantly."
  - question: How much does rebar add to concrete cost?
    answer: "Rebar typically adds 15-25% to concrete material costs but greatly improves strength and longevity of the structure."
  - question: Can I bend rebar myself?
    answer: "Yes, smaller sizes (#3-#5) can be bent with manual tools. Larger sizes require hydraulic benders or professional fabrication."
---

<form id="rebar-form" autocomplete="off">
  <label>
    Slab Length (ft):
    <input type="number" id="rebar-length" min="0" step="any" required>
  </label>
  <label>
    Slab Width (ft):
    <input type="number" id="rebar-width" min="0" step="any" required>
  </label>
  <label>
    Rebar Size:
    <select id="rebar-size" required>
      <option value="3,0.375,10">#3 (3/8") - $10/stick</option>
      <option value="4,0.5,15" selected>#4 (1/2") - $15/stick</option>
      <option value="5,0.625,22">#5 (5/8") - $22/stick</option>
      <option value="6,0.75,30">#6 (3/4") - $30/stick</option>
      <option value="7,0.875,40">#7 (7/8") - $40/stick</option>
    </select>
  </label>
  <label>
    Rebar Spacing (inches):
    <select id="rebar-spacing" required>
      <option value="12">12" on center (heavy duty)</option>
      <option value="16">16" on center (standard)</option>
      <option value="18" selected>18" on center (residential)</option>
      <option value="24">24" on center (light duty)</option>
    </select>
  </label>
  <label>
    Project Type:
    <select id="rebar-project" required>
      <option value="slab">Concrete slab (grid pattern)</option>
      <option value="footing">Footing (parallel bars)</option>
      <option value="wall">Wall (vertical and horizontal)</option>
      <option value="driveway">Driveway (reinforced grid)</option>
    </select>
  </label>
  <button type="submit">Calculate Rebar</button>
</form>
<div id="rebar-result" class="result"></div>