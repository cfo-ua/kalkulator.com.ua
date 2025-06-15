(() => {
  const startBtn = document.getElementById('start-test');
  const downloadSpan = document.getElementById('download-speed');
  const uploadSpan = document.getElementById('upload-speed');
  const pingSpan = document.getElementById('ping');

  // Test files URLs (public CDN files for quick download/upload test)
  const downloadTestUrl = "https://speed.hetzner.de/100MB.bin"; // 100MB file for download test
  const uploadTestUrl = "https://httpbin.org/post"; // public echo server for upload

  // Helper: fetch with timing for ping
  async function testPing() {
    const testUrl = "https://www.google.com/generate_204"; // fast no-content URL
    const start = performance.now();
    try {
      await fetch(testUrl, {method: 'HEAD', cache: 'no-cache'});
      const end = performance.now();
      return Math.round(end - start);
    } catch {
      return null;
    }
  }

  // Download speed test (approximate)
  async function testDownload() {
    try {
      const start = performance.now();
      const response = await fetch(downloadTestUrl, {cache: 'no-cache'});
      const reader = response.body.getReader();
      let bytesReceived = 0;
      while(true) {
        const {done, value} = await reader.read();
        if(done) break;
        bytesReceived += value.length;
        // Stop after ~10MB for test speed balance
        if(bytesReceived >= 10 * 1024 * 1024) break;
      }
      const end = performance.now();
      const durationSec = (end - start) / 1000;
      const bitsLoaded = bytesReceived * 8;
      const speedMbps = (bitsLoaded / durationSec / 1e6).toFixed(2);
      return speedMbps;
    } catch {
      return null;
    }
  }

  // Upload speed test (approximate)
  async function testUpload() {
    try {
      const size = 5 * 1024 * 1024; // 5MB payload
      const data = new Uint8Array(size);
      crypto.getRandomValues(data);
      const start = performance.now();
      await fetch(uploadTestUrl, {
        method: 'POST',
        body: data,
        cache: 'no-cache'
      });
      const end = performance.now();
      const durationSec = (end - start) / 1000;
      const bitsSent = size * 8;
      const speedMbps = (bitsSent / durationSec / 1e6).toFixed(2);
      return speedMbps;
    } catch {
      return null;
    }
  }

  async function runTest() {
    startBtn.disabled = true;
    startBtn.textContent = "Тестування...";
    downloadSpan.textContent = "-";
    uploadSpan.textContent = "-";
    pingSpan.textContent = "-";

    const ping = await testPing();
    const download = await testDownload();
    const upload = await testUpload();

    pingSpan.textContent = ping !== null ? ping : "Помилка";
    downloadSpan.textContent = download !== null ? download : "Помилка";
    uploadSpan.textContent = upload !== null ? upload : "Помилка";

    startBtn.textContent = "Почати тест швидкості";
    startBtn.disabled = false;
  }

  startBtn.addEventListener('click', runTest);
})();
