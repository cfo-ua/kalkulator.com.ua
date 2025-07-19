---
layout: calculator
title: "Board Foot Calculator"
categories: [construction]
seo:
  title: "Board Foot Calculator | Lumber Volume & Cost Calculator for Woodworking"
  description: "Calculate board feet of lumber needed for woodworking projects. Professional lumber calculator estimates volume, costs, and material requirements for construction and carpentry."
  keywords:
    - board foot calculator
    - lumber calculator
    - board feet calculator
    - wood calculator
    - lumber volume calculator
    - woodworking calculator
    - lumber cost calculator
    - timber calculator
    - wood volume calculator
    - lumber estimator
    - board foot conversion
    - lumber measurement calculator
    - construction lumber calculator
    - hardwood calculator
    - softwood calculator
    - lumber pricing calculator
    - woodworking project calculator
    - lumber materials calculator
    - wood project calculator
    - carpentry calculator
    - building materials calculator
    - lumber quantity calculator
  content: |
    <h2>Board Foot Calculator</h2>
    <p>Calculate <strong>board feet of lumber</strong> needed for your woodworking or construction project. This professional lumber calculator determines volume, estimates costs, and helps plan material requirements.</p>

    <h3>What is a Board Foot?</h3>
    <p>A board foot is a unit of lumber volume equal to <strong>144 cubic inches</strong> - a piece of wood 1" thick × 12" wide × 12" long.</p>
    
    <h3>Board Foot Formula:</h3>
    <p><strong>Board Feet = (Thickness in inches × Width in inches × Length in feet) ÷ 12</strong></p>

    <h3>Common Lumber Sizes & Board Feet:</h3>
    <ul>
      <li><strong>1×4 × 8':</strong> 2.67 board feet</li>
      <li><strong>1×6 × 8':</strong> 4 board feet</li>
      <li><strong>2×4 × 8':</strong> 5.33 board feet</li>
      <li><strong>2×6 × 8':</strong> 8 board feet</li>
      <li><strong>2×8 × 10':</strong> 13.33 board feet</li>
      <li><strong>2×10 × 12':</strong> 20 board feet</li>
    </ul>

    <h3>Lumber Pricing by Type:</h3>
    <ul>
      <li><strong>Construction lumber:</strong> $2-6 per board foot</li>
      <li><strong>Pine/SPF:</strong> $3-7 per board foot</li>
      <li><strong>Oak hardwood:</strong> $8-15 per board foot</li>
      <li><strong>Maple hardwood:</strong> $10-18 per board foot</li>
      <li><strong>Exotic hardwood:</strong> $15-50+ per board foot</li>
    </ul>

    <h3>Nominal vs Actual Lumber Sizes:</h3>
    <ul>
      <li><strong>1×4 nominal:</strong> actually 3/4" × 3.5"</li>
      <li><strong>1×6 nominal:</strong> actually 3/4" × 5.5"</li>
      <li><strong>2×4 nominal:</strong> actually 1.5" × 3.5"</li>
      <li><strong>2×6 nominal:</strong> actually 1.5" × 5.5"</li>
      <li><strong>2×8 nominal:</strong> actually 1.5" × 7.25"</li>
    </ul>

    <h3>Hardwood vs Softwood:</h3>
    <ul>
      <li><strong>Softwood:</strong> pine, fir, cedar - construction, framing</li>
      <li><strong>Hardwood:</strong> oak, maple, cherry - furniture, flooring</li>
      <li><strong>Grading:</strong> affects price and quality significantly</li>
      <li><strong>Moisture content:</strong> kiln-dried vs air-dried pricing</li>
    </ul>

    <h3>Project Planning Tips:</h3>
    <ul>
      <li><strong>Add 10-15% waste:</strong> for cuts, defects, mistakes</li>
      <li><strong>Buy from same lot:</strong> ensures color/grain consistency</li>
      <li><strong>Consider grades:</strong> select grade for visible surfaces</li>
      <li><strong>Acclimate lumber:</strong> store in project environment</li>
    </ul>
scripts:
  - /en/js/board-foot.js
faq:
  - question: How do I calculate board feet for a 2×4×8?
    answer: "Board feet = (2 × 4 × 8) ÷ 12 = 5.33 board feet. Remember to use actual thickness and width, not nominal dimensions."
  - question: What's the difference between linear feet and board feet?
    answer: "Linear feet measures length only. Board feet measures volume (thickness × width × length). A 10-foot 2×4 is 10 linear feet but 6.67 board feet."
  - question: Why is hardwood lumber more expensive?
    answer: "Hardwood grows slower, requires more processing, and is graded more strictly. Premium hardwoods can cost 5-10× more than construction lumber."
  - question: Should I use nominal or actual dimensions?
    answer: "Use actual dimensions for accurate calculations. A 2×4 is actually 1.5\" × 3.5\", which affects your board foot calculation."
  - question: How much waste should I factor in?
    answer: "Add 10-15% for general projects, 20% for complex projects with many cuts, and 25% for beginner woodworkers."
  - question: Can I mix lumber from different suppliers?
    answer: "Possible but not recommended for visible surfaces. Different suppliers may have slight variations in color, grain, and moisture content."
---

<form id="board-foot-form" autocomplete="off">
  <label>
    Lumber Thickness (inches):
    <select id="lumber-thickness" required>
      <option value="0.75">3/4" (1× lumber actual)</option>
      <option value="1.0">1" (true 1 inch)</option>
      <option value="1.5">1.5" (2× lumber actual)</option>
      <option value="2.0">2" (true 2 inch)</option>
      <option value="2.5">2.5" (thick hardwood)</option>
      <option value="3.5">3.5" (4× lumber actual)</option>
    </select>
  </label>
  <label>
    Lumber Width (inches):
    <select id="lumber-width" required>
      <option value="3.5">3.5" (1×4 or 2×4 actual)</option>
      <option value="5.5">5.5" (1×6 or 2×6 actual)</option>
      <option value="7.25">7.25" (1×8 or 2×8 actual)</option>
      <option value="9.25">9.25" (1×10 or 2×10 actual)</option>
      <option value="11.25">11.25" (1×12 or 2×12 actual)</option>
      <option value="6">6" (true 6 inch hardwood)</option>
      <option value="8">8" (true 8 inch hardwood)</option>
      <option value="10">10" (true 10 inch hardwood)</option>
    </select>
  </label>
  <label>
    Lumber Length (feet):
    <input type="number" id="lumber-length" min="1" step="any" value="8" required>
  </label>
  <label>
    Number of Pieces:
    <input type="number" id="lumber-quantity" min="1" value="1" required>
  </label>
  <label>
    Lumber Type & Price:
    <select id="lumber-type" required>
      <option value="4">Construction SPF ($4/bd ft)</option>
      <option value="5">Pine lumber ($5/bd ft)</option>
      <option value="6">Cedar lumber ($6/bd ft)</option>
      <option value="12">Oak hardwood ($12/bd ft)</option>
      <option value="15">Maple hardwood ($15/bd ft)</option>
      <option value="18">Cherry hardwood ($18/bd ft)</option>
      <option value="25">Walnut hardwood ($25/bd ft)</option>
      <option value="35">Exotic hardwood ($35/bd ft)</option>
    </select>
  </label>
  <label>
    Waste Factor:
    <select id="lumber-waste" required>
      <option value="0.10">10% (experienced builder)</option>
      <option value="0.15" selected>15% (standard project)</option>
      <option value="0.20">20% (complex cuts)</option>
      <option value="0.25">25% (beginner project)</option>
    </select>
  </label>
  <button type="submit">Calculate Board Feet</button>
</form>
<div id="board-foot-result" class="result"></div>