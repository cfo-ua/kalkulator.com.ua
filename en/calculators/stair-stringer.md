---
layout: calculator
title: "Stair Stringer Calculator"
categories: [construction]
seo:
  title: "Stair Stringer Calculator | Stair Framing & Layout Calculator"
  description: "Calculate stair stringer dimensions, cuts, and layout for deck stairs and interior staircases. Professional stair framing calculator for builders and DIY projects."
  keywords:
    - stair stringer calculator
    - stair framing calculator
    - stair layout calculator
    - deck stair calculator
    - stringer cutting calculator
    - stair construction calculator
    - stair riser calculator
    - stair tread calculator
    - building stairs calculator
    - stair carpentry calculator
    - wooden stairs calculator
    - stair dimensions calculator
    - stair building calculator
    - stair design calculator
    - outdoor stair calculator
    - interior stair calculator
    - stair planning calculator
    - stringer layout calculator
    - stair materials calculator
    - DIY stair calculator
    - stair code calculator
    - staircase calculator
  content: |
    <h2>Stair Stringer Calculator</h2>
    <p>Calculate precise <strong>stair stringer dimensions</strong> and layout for building safe, code-compliant stairs. This professional stringer calculator provides cutting measurements, angles, and material requirements.</p>

    <h3>Stair Stringer Basics:</h3>
    <ul>
      <li><strong>Stringers:</strong> structural supports that carry stair loads</li>
      <li><strong>Typical spacing:</strong> 16" on center, maximum 24"</li>
      <li><strong>Material:</strong> 2×12 lumber for spans up to 14 feet</li>
      <li><strong>Number needed:</strong> 3 stringers for stairs up to 36" wide</li>
    </ul>

    <h3>Building Code Requirements:</h3>
    <ul>
      <li><strong>Riser height:</strong> 4" minimum, 7.75" maximum</li>
      <li><strong>Tread depth:</strong> 10" minimum (residential)</li>
      <li><strong>Variation:</strong> ±3/8" between risers and treads</li>
      <li><strong>Headroom:</strong> 6'8" minimum clear height</li>
    </ul>

    <h3>Stringer Layout Process:</h3>
    <ol>
      <li><strong>Calculate:</strong> total rise and run</li>
      <li><strong>Determine:</strong> number of risers and treads</li>
      <li><strong>Mark:</strong> stringer board with square</li>
      <li><strong>Cut:</strong> with circular saw and jigsaw</li>
    </ol>

    <h3>Common Stringer Lumber:</h3>
    <ul>
      <li><strong>2×10:</strong> spans up to 12 feet</li>
      <li><strong>2×12:</strong> spans up to 14 feet (most common)</li>
      <li><strong>2×14:</strong> spans over 14 feet (special order)</li>
      <li><strong>LVL/Engineered:</strong> longer spans, higher loads</li>
    </ul>

    <h3>Tools Required:</h3>
    <ul>
      <li><strong>Framing square:</strong> for layout marking</li>
      <li><strong>Circular saw:</strong> main cuts</li>
      <li><strong>Jigsaw:</strong> plunge cuts and curves</li>
      <li><strong>Level:</strong> checking alignment</li>
    </ul>
scripts:
  - /en/js/stair-stringer.js
faq:
  - question: How many stringers do I need for 36-inch stairs?
    answer: "3 stringers for stairs up to 36\" wide. Add one stringer for every additional 16\" of width. Use 16\" spacing for maximum support."
  - question: What size lumber for stair stringers?
    answer: "2×12 lumber is standard for most residential applications up to 14 feet. Use 2×10 for shorter spans or 2×14 for longer spans."
  - question: How do I cut stair stringers?
    answer: "Mark with framing square, cut with circular saw for straight cuts, finish inside corners with jigsaw. Use first stringer as template for others."
  - question: What's the maximum stringer span?
    answer: "2×12 stringers can span up to 14 feet. For longer spans, use engineered lumber or add a beam support underneath."
  - question: How do I attach stringers to deck or floor?
    answer: "Use joist hangers at the top, concrete anchors or bolts at the bottom. Follow local building codes for connection requirements."
  - question: Can I notch stringers for treads?
    answer: "Yes, but maintain minimum 5\" of material below the tread cut. Deeper cuts weaken the stringer and may violate building codes."
---

<form id="stair-stringer-form" autocomplete="off">
  <label>
    Total Rise (inches):
    <input type="number" id="stringer-total-rise" min="0" required>
    <small>Vertical distance from bottom to top</small>
  </label>
  <label>
    Total Run (inches):
    <input type="number" id="stringer-total-run" min="0" required>
    <small>Horizontal distance available</small>
  </label>
  <label>
    Stair Width (inches):
    <input type="number" id="stringer-width" min="24" max="120" value="36" required>
    <small>Width of staircase</small>
  </label>
  <label>
    Lumber Size:
    <select id="stringer-lumber" required>
      <option value="2x10,9.25">2×10 (9.25" actual depth)</option>
      <option value="2x12,11.25" selected>2×12 (11.25" actual depth)</option>
      <option value="2x14,13.25">2×14 (13.25" actual depth)</option>
    </select>
  </label>
  <button type="submit">Calculate Stringers</button>
</form>
<div id="stair-stringer-result" class="result"></div>