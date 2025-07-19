(() => {
  const startBtn = document.getElementById('start-test');
  const downloadSpan = document.getElementById('download-speed');
  const categorySpan = document.getElementById('speed-category');

  function categorizeSpeed(mbps) {
    if (mbps < 5) return 'Low';
    if (mbps < 25) return 'Medium';
    if (mbps < 100) return 'High';
    return 'Very High';
  }

  function getSpeedDescription(mbps) {
    if (mbps < 1) return 'Very slow - basic browsing only';
    if (mbps < 5) return 'Slow - email, light browsing';
    if (mbps < 25) return 'Good - HD video, video calls';
    if (mbps < 100) return 'Fast - 4K video, multiple devices';
    return 'Very fast - heavy usage, streaming';
  }

  async function testDownload() {
    try {
      const url = '/tools/testfile-10mb.bin?cache_bust=' + Date.now();
      const start = performance.now();
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test timeout')), 30000)
      );
      
      const fetchPromise = fetch(url, {
        cache: 'no-store',
        method: 'GET'
      });
      
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const reader = response.body.getReader();
      let bytesReceived = 0;
      
      while(true) {
        const {done, value} = await reader.read();
        if(done) break;
        bytesReceived += value.length;
        
        // Stop after receiving 10MB or 20 seconds elapsed
        const elapsed = (performance.now() - start) / 1000;
        if(bytesReceived >= 10 * 1024 * 1024 || elapsed > 20) break;
      }
      
      const end = performance.now();
      const durationSec = (end - start) / 1000;
      
      // Minimum test duration to ensure accuracy
      if (durationSec < 1) {
        throw new Error('Test too short for accurate measurement');
      }
      
      const bitsLoaded = bytesReceived * 8;
      const speedMbps = bitsLoaded / durationSec / 1e6;
      
      return speedMbps;
    } catch (error) {
      console.error('Speed test error:', error);
      return null;
    }
  }

  async function runTest() {
    startBtn.disabled = true;
    startBtn.textContent = "Testing...";
    startBtn.style.background = "#6c757d";
    downloadSpan.textContent = "-";
    categorySpan.textContent = "-";

    // Show progress indicator
    let dots = 0;
    const progressInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      startBtn.textContent = "Testing" + ".".repeat(dots);
    }, 500);

    try {
      const speed = await testDownload();

      clearInterval(progressInterval);

      if (speed !== null && speed > 0) {
        downloadSpan.textContent = speed.toFixed(2) + " Mbps";
        const category = categorizeSpeed(speed);
        categorySpan.textContent = category;
        
        // Update color based on speed
        if (speed < 5) {
          categorySpan.style.color = "#dc3545"; // red
        } else if (speed < 25) {
          categorySpan.style.color = "#ffc107"; // yellow
        } else {
          categorySpan.style.color = "#28a745"; // green
        }
        
        // Show additional info
        const description = getSpeedDescription(speed);
        categorySpan.title = description;
        
      } else {
        downloadSpan.textContent = "Error";
        downloadSpan.style.color = "#dc3545";
        categorySpan.textContent = "Unable to test";
        categorySpan.style.color = "#6c757d";
      }
    } catch (error) {
      clearInterval(progressInterval);
      downloadSpan.textContent = "Error";
      downloadSpan.style.color = "#dc3545";
      categorySpan.textContent = "Test failed";
      categorySpan.style.color = "#dc3545";
    }

    startBtn.textContent = "Start Speed Test";
    startBtn.style.background = "#007bff";
    startBtn.disabled = false;
  }

  // Add helpful tips when test completes
  function showTestTips(speed) {
    if (speed && speed < 5) {
      setTimeout(() => {
        const tip = document.createElement('div');
        tip.style.cssText = `
          background: #fff3cd; 
          padding: 10px; 
          border-radius: 8px; 
          border-left: 4px solid #ffc107; 
          margin: 15px 0;
          color: #856404;
          font-size: 0.9em;
        `;
        tip.innerHTML = `
          <strong>Tip:</strong> For slow speeds, try moving closer to your Wi-Fi router, 
          closing other apps, or testing at a different time of day.
        `;
        startBtn.parentNode.insertBefore(tip, startBtn.nextSibling);
        
        setTimeout(() => tip.remove(), 10000);
      }, 1000);
    }
  }

  startBtn.addEventListener('click', async () => {
    const speed = await runTest();
    if (speed) showTestTips(speed);
  });

  // Add keyboard support
  startBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!startBtn.disabled) {
        startBtn.click();
      }
    }
  });
})();