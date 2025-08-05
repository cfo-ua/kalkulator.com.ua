---
layout: calculator
title: Shoe Size Converter
categories:
- clothing
faq:
- answer: Stand barefoot on paper against a wall, mark the longest point of your foot,
    and measure from the wall to the mark in millimeters. Do this for both feet and
    use the larger measurement.
  question: How do I measure my foot length accurately?
- answer: Mondopoint is an international sizing standard based on foot length in millimeters.
    It's more accurate because it's based on actual measurements rather than arbitrary
    number systems that vary by country.
  question: What is Mondopoint and why is it more accurate?
- answer: The US uses separate sizing scales for men and women. A US women's size
    8 is not the same as a US men's size 8. Our calculator accounts for both scales.
  question: Why are US men's and women's shoe sizes different?
- answer: This converter is designed for adult shoe sizes. Children's shoe sizing
    follows different standards and growth considerations.
  question: Can I use this converter for children's shoes?
- answer: If you're between sizes, consider the shoe type and your preference. For
    athletic shoes, choose the larger size. For dress shoes, you might prefer the
    smaller size for a snugger fit.
  question: What if I'm between two sizes?
- answer: While our converter uses international standards, brands may have slight
    variations. Always check the specific brand's size chart and customer reviews
    when possible.
  question: Do all brands follow these size standards exactly?
- answer: Our converter focuses on length. If you have particularly wide or narrow
    feet, you may need to adjust up or down by half a size, or look for brands that
    offer width options.
  question: Should I account for foot width in sizing?
- answer: Measure your feet in the late afternoon or evening when they're naturally
    at their largest due to daily swelling.
  question: When is the best time to measure my feet?
scripts:
- /en/js/shoe-size.js
seo:
  content: "<h2>Professional Shoe Size Converter</h2>\n<p>Finding the right shoe size\
    \ across different international standards can be confusing. Our <strong>shoe\
    \ size converter</strong> makes it simple by converting between EU, UK, US, and\
    \ Mondopoint sizing systems using your foot length or known size in any system.</p>\n\
    \n<h3>How to Use the Shoe Size Converter</h3>\n<ol>\n  <li><strong>Choose your\
    \ input:</strong> Select whether you know your foot length in millimeters or a\
    \ size in EU, UK, or US sizing</li>\n  <li><strong>Enter your measurement:</strong>\
    \ Input your foot length or known shoe size</li>\n  <li><strong>Get conversions:</strong>\
    \ Instantly see your size in all international sizing systems</li>\n</ol>\n\n\
    <h3>How to Measure Your Foot Length</h3>\n<ol>\n  <li>Place a blank sheet of paper\
    \ on a hard floor against a wall</li>\n  <li>Stand barefoot with your heel against\
    \ the wall</li>\n  <li>Mark the longest point of your foot (usually your big toe)</li>\n\
    \  <li>Measure the distance from the wall to the mark in millimeters</li>\n  <li>Repeat\
    \ for both feet and use the larger measurement</li>\n</ol>\n\n<h3>Understanding\
    \ Mondopoint Sizing</h3>\n<p><strong>Mondopoint</strong> is the most accurate\
    \ international sizing standard because it's based directly on foot length in\
    \ millimeters. For example, if your foot is 270mm long, your Mondopoint size is\
    \ 270. This system eliminates confusion between different national sizing standards.</p>\n\
    \n<h3>International Shoe Size Systems</h3>\n<ul>\n  <li><strong>European (EU):</strong>\
    \ Most common in Europe, based on Paris point system</li>\n  <li><strong>UK Sizing:</strong>\
    \ Traditional British sizing system, used in UK and some Commonwealth countries</li>\n\
    \  <li><strong>US Men's/Women's:</strong> Separate scales for men and women in\
    \ the United States</li>\n  <li><strong>Mondopoint:</strong> International standard\
    \ based on foot length in millimeters</li>\n</ul>\n\n<h3>Perfect for Online Shopping</h3>\n\
    <ul>\n  <li>International brands and retailers (Nike, Adidas, Amazon, etc.)</li>\n\
    \  <li>Cross-border online shoe shopping</li>\n  <li>Avoiding returns due to incorrect\
    \ sizing</li>\n  <li>Finding consistent sizing across different brands</li>\n\
    \  <li>Professional and athletic footwear purchases</li>\n</ul>\n\n<h3>Why Accurate\
    \ Shoe Sizing Matters</h3>\n<ul>\n  <li><strong>Comfort:</strong> Properly fitted\
    \ shoes prevent blisters, calluses, and foot pain</li>\n  <li><strong>Health:</strong>\
    \ Correct sizing supports proper foot alignment and posture</li>\n  <li><strong>Performance:</strong>\
    \ Athletic shoes need precise fitting for optimal performance</li>\n  <li><strong>Durability:</strong>\
    \ Proper fit extends the life of your footwear</li>\n  <li><strong>Safety:</strong>\
    \ Well-fitted work and safety shoes provide better protection</li>\n</ul>\n\n\
    <h3>Professional Tips</h3>\n<ul>\n  <li>Measure your feet in the evening when\
    \ they're naturally larger</li>\n  <li>Always measure both feet and use the larger\
    \ measurement</li>\n  <li>Consider the type of socks you'll wear with the shoes</li>\n\
    \  <li>Account for foot width if you have particularly narrow or wide feet</li>\n\
    \  <li>Check brand-specific size charts when possible</li>\n</ul>\n\n<p><strong>Important\
    \ Note:</strong> While our converter provides accurate conversions based on international\
    \ standards, shoe fit can vary between brands, styles, and shoe types. Always\
    \ check the specific brand's sizing guide and read customer reviews when shopping\
    \ online.</p>\n"
  description: Convert shoe sizes between EU, UK, US, and Mondopoint systems. Find
    your perfect shoe size by foot length measurement or convert between international
    sizing standards. Essential tool for online shoe shopping.
  keywords:
  - shoe size converter
  - shoe size calculator
  - foot length to shoe size
  - EU UK US shoe sizes
  - Mondopoint shoe size
  - international shoe sizes
  - shoe size chart converter
  - men's shoe size converter
  - women's shoe size converter
  - foot measurement calculator
  - shoe size conversion chart
  - online shoe size tool
  - shoe sizing guide
  - footwear size calculator
  - shoe fit calculator
  - size guide for shoes
  - international footwear sizes
  - shoe size finder
  - perfect shoe size calculator
  - athletic shoe size converter
  title: Shoe Size Converter  -  EU, UK, US, Mondopoint Size Calculator by Foot Length
---

<form id="shoe-size-form">
  <label>
    What measurement do you know?
    <select id="unit">
      <option value="mondopoint">Foot length (mm)</option>
      <option value="eu">EU size</option>
      <option value="uk">UK size</option>
      <option value="us_m">US size (men)</option>
      <option value="us_w">US size (women)</option>
    </select>
  </label>

  <label>
    Enter your value:
    <input type="number" id="value" required placeholder="e.g., 270 or 9.5">
  </label>

  <button type="submit">Convert Size</button>
</form>

<div id="shoe-size-result" class="result"></div>
