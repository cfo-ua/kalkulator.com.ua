(() => {
  const startBtn = document.getElementById('start-test');
  const downloadSpan = document.getElementById('download-speed');
  const categorySpan = document.getElementById('speed-category');

  function categorizeSpeed(mbps) {
    if (mbps < 5) return 'низька';
    if (mbps < 25) return 'середня';
    return 'висока';
  }

  async function testDownload() {
    try {
      const url = '/tools/testfile-10mb.bin';
      const start = performance.now();
      const response = await fetch(url, {cache: 'no-cache'});
      const reader = response.body.getReader();
      let bytesReceived = 0;
      while(true) {
        const {done, value} = await reader.read();
        if(done) break;
        bytesReceived += value.length;
        if(bytesReceived >= 10 * 1024 * 1024) break; // stop after 10MB
      }
      const end = performance.now();
      const durationSec = (end - start) / 1000;
      const bitsLoaded = bytesReceived * 8;
      const speedMbps = bitsLoaded / durationSec / 1e6;
      return speedMbps;
    } catch {
      return null;
    }
  }

  async function runTest() {
    startBtn.disabled = true;
    startBtn.textContent = "Тестування...";
    downloadSpan.textContent = "-";
    categorySpan.textContent = "-";

    const speed = await testDownload();

    if (speed !== null) {
      downloadSpan.textContent = speed.toFixed(2) + " Мбіт/с";
      categorySpan.textContent = categorizeSpeed(speed);
    } else {
      downloadSpan.textContent = "Помилка";
      categorySpan.textContent = "Невідомо";
    }

    startBtn.textContent = "Почати тест швидкості";
    startBtn.disabled = false;
  }

  startBtn.addEventListener('click', runTest);
})();
