document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("anniversary-form");
  const result = document.getElementById("anniversary-result");

  // Traditional anniversary names and gifts in English
  const anniversaryData = {
    1: { name: "Paper", traditional: "Paper items, flowers, love letters", modern: "Clock, jewelry", symbol: "📜" },
    2: { name: "Cotton", traditional: "Cotton textiles, garments", modern: "China, stationery", symbol: "🌸" },
    3: { name: "Leather", traditional: "Leather goods, wallets, bags", modern: "Crystal, glass", symbol: "👜" },
    4: { name: "Fruit/Flowers", traditional: "Fresh flowers, fruit, plants", modern: "Appliances, electronics", symbol: "🌺" },
    5: { name: "Wood", traditional: "Wooden furniture, tree planting", modern: "Silverware", symbol: "🌳" },
    6: { name: "Iron/Candy", traditional: "Iron tools, candy, sweets", modern: "Wood items", symbol: "🍬" },
    7: { name: "Wool/Copper", traditional: "Wool clothing, copper items", modern: "Desk accessories", symbol: "🐑" },
    8: { name: "Bronze/Pottery", traditional: "Bronze sculptures, pottery", modern: "Linens, lace", symbol: "🏺" },
    9: { name: "Pottery/Willow", traditional: "Pottery, willow baskets", modern: "Leather goods", symbol: "🏺" },
    10: { name: "Tin/Aluminum", traditional: "Aluminum cookware, tin items", modern: "Diamond jewelry", symbol: "🥫" },
    11: { name: "Steel", traditional: "Steel tools, jewelry", modern: "Fashion accessories", symbol: "⚔️" },
    12: { name: "Silk/Linen", traditional: "Silk scarves, linen items", modern: "Pearls", symbol: "🧵" },
    13: { name: "Lace", traditional: "Lace clothing, textiles", modern: "Furs, textiles", symbol: "🕸️" },
    14: { name: "Ivory", traditional: "Ivory items (now elephant-safe alternatives)", modern: "Gold jewelry", symbol: "🤍" },
    15: { name: "Crystal", traditional: "Crystal vases, glassware", modern: "Watches", symbol: "💎" },
    20: { name: "China", traditional: "China dinnerware, porcelain", modern: "Platinum", symbol: "🏺" },
    25: { name: "Silver", traditional: "Silver jewelry, silverware", modern: "Sterling silver", symbol: "🥈" },
    30: { name: "Pearl", traditional: "Pearl jewelry, cultured pearls", modern: "Diamond jewelry", symbol: "⚪" },
    35: { name: "Coral/Jade", traditional: "Coral jewelry, jade items", modern: "Jade accessories", symbol: "🪸" },
    40: { name: "Ruby", traditional: "Ruby jewelry, red gemstones", modern: "Ruby jewelry", symbol: "❤️" },
    45: { name: "Sapphire", traditional: "Sapphire jewelry, blue gems", modern: "Sapphire jewelry", symbol: "💙" },
    50: { name: "Gold", traditional: "Gold jewelry, golden experiences", modern: "Gold items", symbol: "🥇" },
    55: { name: "Emerald", traditional: "Emerald jewelry, green gems", modern: "Emerald accessories", symbol: "💚" },
    60: { name: "Diamond", traditional: "Diamond jewelry, precious gems", modern: "Diamond jewelry", symbol: "💎" },
    65: { name: "Blue Sapphire", traditional: "Blue sapphire jewelry", modern: "Sapphire items", symbol: "💙" },
    70: { name: "Platinum", traditional: "Platinum jewelry, luxury items", modern: "Platinum accessories", symbol: "⚪" },
    75: { name: "Diamond/Gold", traditional: "Diamonds and gold combined", modern: "Diamond jewelry", symbol: "👑" }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const weddingDateInput = document.getElementById("wedding-date").value;
    const targetDateInput = document.getElementById("target-date").value;

    if (!weddingDateInput) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Please enter your wedding date.</div>';
      return;
    }

    const weddingDate = new Date(weddingDateInput);
    const targetDate = targetDateInput ? new Date(targetDateInput) : new Date();

    if (weddingDate > targetDate) {
      result.innerHTML = '<div class="insight-card warning">⚠️ Wedding date cannot be in the future.</div>';
      return;
    }

    // Calculate difference
    let years = targetDate.getFullYear() - weddingDate.getFullYear();
    let months = targetDate.getMonth() - weddingDate.getMonth();
    let days = targetDate.getDate() - weddingDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days
    const totalDays = Math.floor((targetDate - weddingDate) / (1000 * 60 * 60 * 24));

    // Get anniversary data
    const anniversaryInfo = anniversaryData[years] || { 
      name: "Special", 
      traditional: "Precious gifts of your choice", 
      modern: "Modern luxury items", 
      symbol: "💝" 
    };

    // Find next milestone
    const milestones = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
    const nextMilestone = milestones.find(m => m > years);

    // Format year text
    const yearText = years === 1 ? "year" : "years";

    result.innerHTML = `
      <div class="insight-cards">
        <div class="insight-card success">
          <h6>${anniversaryInfo.symbol} Anniversary</h6>
          <div class="big-number">${years} ${yearText}</div>
          <p>${anniversaryInfo.name} Anniversary</p>
        </div>
        
        <div class="insight-card info">
          <h6>📅 Together</h6>
          <div class="big-number">${totalDays.toLocaleString()}</div>
          <p>${years}y ${months}m ${days}d</p>
        </div>
        
        ${nextMilestone ? `
        <div class="insight-card warning">
          <h6>🎯 Next Milestone</h6>
          <div class="big-number">${nextMilestone - years}</div>
          <p>${nextMilestone - years === 1 ? 'year' : 'years'} until ${nextMilestone}th</p>
        </div>
        ` : ''}
      </div>
      
      <div style="margin-top: 2rem;">
        <h4>🎁 Traditional Gifts for Your ${anniversaryInfo.name} Anniversary:</h4>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--accent); margin-bottom: 1rem;">
          <div style="display: grid; gap: 1rem;">
            <div><strong>🎨 Traditional:</strong> ${anniversaryInfo.traditional}</div>
            <div><strong>✨ Modern:</strong> ${anniversaryInfo.modern}</div>
          </div>
        </div>
        
        ${years >= 25 ? `
        <div style="padding: 1rem; background: linear-gradient(135deg, #fff8e1 0%, #f5f5dc 100%); border-radius: 8px; margin-bottom: 1rem;">
          <h5>🌟 Major Milestone Achievement!</h5>
          <p>Your anniversary deserves special celebration. Consider:</p>
          <ul style="margin: 0.5rem 0;">
            <li>🎉 Hosting a celebration with family and friends</li>
            <li>💒 Renewing your wedding vows</li>
            <li>✈️ Taking a special anniversary trip</li>
            <li>📸 Professional anniversary photoshoot</li>
            <li>💎 Investing in a meaningful piece of jewelry</li>
          </ul>
        </div>
        ` : ''}
        
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #e8f8fc 0%, #f8fdff 100%); border-radius: 8px;">
          <h5>💡 Creative Celebration Ideas:</h5>
          <ul style="margin: 0.5rem 0;">
            <li>🍽️ Romantic dinner at the restaurant where you first met</li>
            <li>📖 Create a scrapbook of your journey together</li>
            <li>🌍 Return to your honeymoon destination</li>
            <li>🎭 Recreate your first date experience</li>
            <li>💌 Write each other heartfelt love letters</li>
            <li>🌹 Give as many roses as years you've been together</li>
            <li>🎬 Watch your wedding video together</li>
            <li>🏠 Plant a tree or garden together as a living symbol</li>
          </ul>
        </div>
        
        ${years <= 5 ? `
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, #f8fff9 0%, #e8f8e8 100%); border-radius: 8px;">
          <h5>🌱 Building Your Foundation:</h5>
          <p>The early years are about growing together and establishing traditions. Consider gifts that:</p>
          <ul style="margin: 0.5rem 0;">
            <li>🏡 Help you build your home together</li>
            <li>📚 Create memories and keepsakes</li>
            <li>🌟 Establish anniversary traditions for years to come</li>
            <li>💝 Show thoughtfulness and personal connection</li>
          </ul>
        </div>
        ` : ''}
      </div>
    `;
  });
});