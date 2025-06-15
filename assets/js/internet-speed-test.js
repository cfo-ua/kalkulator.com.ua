(() => {
  const startBtn = document.getElementById('start-test');
  const downloadSpan = document.getElementById('download-speed');
  const uploadSpan = document.getElementById('upload-speed');
  const pingSpan = document.getElementById('ping');

  // Test files URLs (inhouse files for download and upload tests)
  const downloadTestUrl = "/tools/testfile-10mb.bin";    // 10MB file for download test
  const uploadTestUrl = "/tools/upload-echo";            // your own upload echo server endpoint

  // Helper: fetch with timing for ping
  async function testPing() {
    const testUrl = "/tools/ping-204"; // lightweight endpoint returning 204 No Content
    const start = performance.now();
    try {
      await fetch(testUrl, { method: 'HEAD', cache: 'no-cache' });
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
      const response = await fetch(downloadTestUrl, { cache: 'no-cache' });
      const reader = response.body.getReader();
      let bytesReceived = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytesReceived += value.length;
        // Stop after full file (10MB)
        if (bytesReceived >= 10 * 1024 * 1024) break;
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
      const response = await fetch(uploadTestUrl, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        cache: 'no-cache'
      });
      if (!response.ok) throw new Error('Upload failed');
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

    pingSpan.textContent = ping !== null ? ping + " мс" : "Помилка";
    downloadSpan.textContent = download !== null ? download + " Мбіт/с" : "Помилка";
    uploadSpan.textContent = upload !== null ? upload + " Мбіт/с" : "Помилка";

    startBtn.textContent = "Почати тест швидкості";
    startBtn.disabled = false;
  }

  startBtn.addEventListener('click', runTest);
})();
