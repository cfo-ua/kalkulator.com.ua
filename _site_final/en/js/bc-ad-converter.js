document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bc-ad-form");
  const result = document.getElementById("bc-ad-result");

  // Historical periods and events in English
  const historicalPeriods = {
    getInfo: function(year, isBC) {
      if (isBC) {
        if (year >= 3000) return { period: "Bronze Age", icon: "⚔️", description: "Era of metallurgy development and early civilizations" };
        if (year >= 1200) return { period: "Late Bronze Age", icon: "🏺", description: "Flourishing of Mycenaean and Hittite civilizations" };
        if (year >= 800) return { period: "Iron Age", icon: "⚡", description: "Beginning of Iron Age, formation of Greek city-states" };
        if (year >= 500) return { period: "Classical Antiquity", icon: "🏛️", description: "Golden Age of Greece, Persian Empire" };
        if (year >= 300) return { period: "Hellenistic Period", icon: "🗿", description: "Macedonian Empire, spread of Greek culture" };
        if (year >= 100) return { period: "Late Roman Republic", icon: "🦅", description: "Expansion of Roman Republic" };
        if (year >= 1) return { period: "Early Roman Empire", icon: "👑", description: "Establishment of Roman Empire" };
      } else {
        if (year <= 476) return { period: "Roman Empire", icon: "🏛️", description: "Height and decline of Roman Empire" };
        if (year <= 1000) return { period: "Early Middle Ages", icon: "⚔️", description: "Formation of feudalism, rise of Christianity" };
        if (year <= 1300) return { period: "High Middle Ages", icon: "🏰", description: "Crusades, flourishing of medieval cities" };
        if (year <= 1500) return { period: "Late Middle Ages", icon: "📚", description: "Renaissance, Black Death, Reformation" };
        if (year <= 1800) return { period: "Early Modern Period", icon: "🚢", description: "Age of Exploration, Enlightenment" };
        if (year <= 1900) return { period: "Industrial Age", icon: "🏭", description: "Industrial Revolution, nation-building" };
        if (year <= 2000) return { period: "20th Century", icon: "🌍", description: "World Wars, technological advancement" };
        return { period: "Contemporary Era", icon: "💻", description: "Information Age, globalization" };
      }
    }
  };

  const famousEvents = {
    getEvent: function(year, isBC) {
      if (isBC) {
        if (year === 753) return "Traditional founding of Rome";
        if (year === 776) return "First Olympic Games in Greece";
        if (year === 356) return "Birth of Alexander the Great";
        if (year === 221) return "Unification of China under Qin Dynasty";
        if (year === 44) return "Assassination of Julius Caesar";
        if (year >= 800 && year <= 700) return "Formation of Greek city-states";
        if (year >= 600 && year <= 500) return "Age of great philosophers (Socrates, Plato)";
        if (year >= 300 && year <= 200) return "Hellenistic kingdoms flourish";
        if (year >= 500 && year <= 400) return "Golden Age of Athens";
      } else {
        if (year === 476) return "Fall of Western Roman Empire";
        if (year === 1066) return "Norman Conquest of England";
        if (year === 1215) return "Magna Carta signed";
        if (year === 1453) return "Fall of Constantinople";
        if (year === 1492) return "Columbus reaches the Americas";
        if (year === 1776) return "American Declaration of Independence";
        if (year === 1789) return "French Revolution begins";
        if (year === 1969) return "First moon landing";
        if (year === 1991) return "World Wide Web invented";
      }
      return null;
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const yearInput = parseInt(document.getElementById("year-input").value);
    const era = document.getElementById("era-select").value;

    if (!yearInput || yearInput < 1) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Please enter a valid year (greater than 0).</div>';
      return;
    }

    const isBC = era === "BC";
    const currentYear = new Date().getFullYear();
    
    // Calculate years ago
    let yearsAgo;
    if (isBC) {
      yearsAgo = currentYear + yearInput - 1; // -1 because there's no year 0
    } else {
      yearsAgo = currentYear - yearInput;
    }

    // Get historical info
    const periodInfo = historicalPeriods.getInfo(yearInput, isBC);
    const famousEvent = famousEvents.getEvent(yearInput, isBC);

    // Calculate century and millennium
    const century = Math.ceil(yearInput / 100);
    const millennium = Math.ceil(yearInput / 1000);

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>📅 Original Date</h6>
          <div class="big-number">${yearInput} ${era}</div>
          <p>${isBC ? 'Before Christ' : 'Anno Domini'}</p>
        </div>
        
        <div class="insight-card info">
          <h6>⏰ Years Ago</h6>
          <div class="big-number">${yearsAgo.toLocaleString()}</div>
          <p>from today</p>
        </div>
        
        <div class="insight-card warning">
          <h6>${periodInfo.icon} Historical Era</h6>
          <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">${periodInfo.period}</div>
          <p style="font-size: 0.9rem;">${periodInfo.description}</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h4>📚 Historical Context for ${yearInput} ${era}:</h4>
        
        ${famousEvent ? `
        <div style="background: linear-gradient(135deg, #fff8e1 0%, #f5f5dc 100%); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #ffc107;">
          <h5>⭐ Notable Event:</h5>
          <p style="margin: 0; font-size: 1.1rem; font-weight: 500;">${famousEvent}</p>
        </div>
        ` : ''}
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--accent); margin-bottom: 1rem;">
          <h5>🕰️ Chronological Calculations:</h5>
          <div style="display: grid; gap: 0.5rem;">
            <div><strong>Original Date:</strong> ${yearInput} ${era}</div>
            <div><strong>Years from event to today:</strong> ${yearsAgo.toLocaleString()} years</div>
            <div><strong>Century:</strong> ${century}${century === 1 ? 'st' : century === 2 ? 'nd' : century === 3 ? 'rd' : 'th'} century ${era}</div>
            <div><strong>Millennium:</strong> ${millennium}${millennium === 1 ? 'st' : millennium === 2 ? 'nd' : millennium === 3 ? 'rd' : 'th'} millennium ${era}</div>
            ${isBC ? '<div><strong>Equivalent:</strong> ' + yearInput + ' BCE (Before Common Era)</div>' : '<div><strong>Equivalent:</strong> ' + yearInput + ' CE (Common Era)</div>'}
          </div>
        </div>
        
        ${yearsAgo > 2000 ? `
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%); border-radius: 8px;">
          <h5>🏺 Ancient History Note:</h5>
          <p>This date belongs to ancient history. Events from this period are known primarily through archaeological findings, ancient chronicles, and historical research. Dating accuracy may vary for very ancient events.</p>
        </div>
        ` : ''}
        
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #e8f8fc 0%, #f8fdff 100%); border-radius: 8px;">
          <h5>💡 Interesting Chronology Facts:</h5>
          <ul style="margin: 0.5rem 0;">
            <li>📅 There is no year zero between 1 BC and 1 AD</li>
            <li>🏛️ The BC/AD system was created in the 6th century AD</li>
            <li>🌍 This is the most widely used dating system in the world</li>
            <li>📜 Ancient civilizations had their own calendar systems</li>
            <li>🔬 Archaeologists use radiocarbon dating for precise ancient dating</li>
            <li>📚 BCE/CE are secular alternatives to BC/AD with identical dating</li>
          </ul>
        </div>
        
        ${isBC && yearInput > 1000 ? `
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%); border-radius: 8px;">
          <h5>🌟 Deep Antiquity:</h5>
          <p>This date reaches back to the dawn of recorded history. Many of our understanding of this period comes from:</p>
          <ul style="margin: 0.5rem 0;">
            <li>🏺 Archaeological excavations and artifacts</li>
            <li>📜 Ancient texts and inscriptions</li>
            <li>🧬 DNA analysis and scientific dating methods</li>
            <li>🏛️ Monuments and architectural remains</li>
          </ul>
        </div>
        ` : ''}
      </div>
    `;
  });
});