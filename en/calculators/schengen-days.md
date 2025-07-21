---
layout: calculator
title: "Schengen Days Calculator"
categories: [other]
permalink: /en/calculators/schengen-days/
seo:
  title: "Schengen Days Calculator — Online 90/180 Rule Checker | Travel Calculator"
  description: "Calculate how many days you've spent or can spend in the Schengen Area according to the 90/180 rule. Add trips and check your status for visa-free travel compliance."
  keywords:
    - schengen days calculator
    - 90/180 rule calculator
    - schengen visa calculator
    - schengen travel days counter
    - schengen area calculator
    - visa free travel calculator
    - europe travel calculator
    - schengen compliance checker
    - tourist visa calculator
    - schengen zone days tracker
    - 90 days schengen calculator
    - when can I travel to schengen again
    - schengen overstay calculator
    - europe visa calculator
    - schengen area travel planner
    - tourist days schengen
    - visa waiver calculator
    - schengen entry calculator
    - travel days tracker europe
    - schengen border calculator
  content: |
    <h2>Schengen Days Calculator</h2>
    <p>According to the <strong>90/180 rule</strong>, you can stay in the Schengen Area for no more than 90 days within any 180-day period. This calculator helps you check if you've exceeded the limit and when you can return.</p>
    
    <ul>
      <li>Add each trip separately, specifying entry and exit dates</li>
      <li>The calculator automatically accounts for overlapping trips and calculates the <strong>total days spent</strong></li>
      <li>Shows whether you've <strong>exceeded</strong> the allowed 90 days within the last 180 days from the specified date</li>
      <li>Perfect for tourists, business travelers, digital nomads, and EU visitors</li>
    </ul>

    <h3>What is the Schengen Area?</h3>
    <p>The Schengen Area includes 27 European countries with abolished passport controls between them:</p>
    <p><em>Austria, Belgium, Croatia, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland.</em></p>

    <h3>Understanding the 90/180 Rule</h3>
    <ul>
      <li><strong>90 days maximum:</strong> You can stay up to 90 days total</li>
      <li><strong>180-day period:</strong> The limit applies to any rolling 180-day window</li>
      <li><strong>No reset:</strong> The period doesn't reset on calendar dates — it's always rolling</li>
      <li><strong>All countries count:</strong> Time in any Schengen country counts toward the limit</li>
    </ul>

    <h3>How to Use This Calculator</h3>
    <ol>
      <li><strong>Add your trips:</strong> Enter entry and exit dates for each visit</li>
      <li><strong>Set check date:</strong> Choose the date you want to verify (today or future travel date)</li>
      <li><strong>Review results:</strong> See total days used and compliance status</li>
    </ol>

    <h3>Important Notes</h3>
    <ul>
      <li><strong>Entry and exit days count:</strong> Both arrival and departure days are included</li>
      <li><strong>Overnight stays only:</strong> Day trips (same-day entry/exit) typically don't count</li>
      <li><strong>Documentation:</strong> Keep records of all entry/exit stamps as proof</li>
      <li><strong>Overstaying consequences:</strong> Can result in fines, bans, or deportation</li>
    </ul>

    <h3>Travel Planning Tips</h3>
    <ul>
      <li>Plan trips to maximize your 90-day allowance</li>
      <li>Consider splitting long stays with trips outside Schengen</li>
      <li>Track your days to avoid accidental overstays</li>
      <li>Apply for appropriate visas if you need longer stays</li>
    </ul>
scripts:
  - /en/js/schengen-days.js
faq:
  - question: "What is the 90/180 rule for the Schengen Area?"
    answer: "This is a restriction that allows you to stay in the Schengen Area for no more than 90 days within any 180-day period, without needing a visa for short-term trips."
  - question: "Are all days counted — including entry and exit days?"
    answer: "Yes, both entry and exit days are counted as full days of stay."
  - question: "How are trips that cross the 180-day window handled?"
    answer: "The calculator analyzes each day, checking how many stay days occurred in the last 180 days from the specified date. Any days outside this window are not counted."
  - question: "Can I find out when I can travel to Schengen again?"
    answer: "Yes. After entering trips, the calculator will show when you'll regain the right to enter if your limit is already exhausted."
  - question: "Does this calculator account for visa type or country?"
    answer: "No. It only counts days of stay according to the 90/180 rule. For specific visas or regimes, check the conditions for your country or consulate."
  - question: "What if I have a long-stay visa or residence permit?"
    answer: "This calculator is for visa-free travel only. Long-stay visas and residence permits have different rules and aren't subject to the 90/180 limitation."
  - question: "Do transit stops count toward the 90 days?"
    answer: "International transit (remaining in the airport transit area) typically doesn't count. However, if you enter the country even briefly, it counts as a day."
  - question: "What happens if I overstay?"
    answer: "Overstaying can result in fines, entry bans (up to several years), deportation, and difficulties with future visa applications. Always comply with the rules."
---

<form id="schengen-form">
  <div id="trip-rows"></div>
  <button type="button" id="add-trip">Add Trip</button>
  <div style="margin-top: 1em">
    <label for="check-date">Check date (today or future):</label>
    <input type="date" id="check-date">
  </div>
</form>

<div id="schengen-result" class="result"></div>