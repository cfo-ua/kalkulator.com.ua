// Top-10 allowed currencies (no RUB, BYR)
const TOP_CURRENCIES = [
  { code: "USD", name: "Долар США" },
  { code: "EUR", name: "Євро" },
  { code: "PLN", name: "Польський злотий" },
  { code: "GBP", name: "Фунт стерлінгів" },
  { code: "CHF", name: "Швейцарський франк" },
  { code: "CAD", name: "Канадський долар" },
  { code: "AUD", name: "Австралійський долар" },
  { code: "CZK", name: "Чеська крона" },
  { code: "SEK", name: "Шведська крона" },
  { code: "JPY", name: "Японська єна" }
];
// Always include UAH
const UAH = { code: "UAH", name: "Гривня" };

let rates = {}; // { "USD": {rate: Number, units: Number, date: "YYYY-MM-DD"}, ... }

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('currency-form');
  const amountInput = document.getElementById('currency-amount');
  const fromSelect = document.getElementById('currency-from');
  const toSelect = document.getElementById('currency-to');
  const dateInput = document.getElementById('currency-date');
  const resultBlock = document.getElementById('currency-result');
  const chartBlock = document.getElementById('currency-chart-block');
  const chartCanvas = document.getElementById('currency-chart');
  let chartInstance = null;

  // Set default date to today
  if (dateInput) {
    const today = new Date().toISOString().slice(0, 10);
    dateInput.value = today;
    dateInput.max = today;
  }

  // Populate currency dropdowns
  function populateCurrencies() {
    // Always list UAH first, then others
    const all = [UAH, ...TOP_CURRENCIES];
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";
    all.forEach(cur => {
      const opt1 = document.createElement("option");
      opt1.value = cur.code;
      opt1.textContent = `${cur.name} (${cur.code})`;
      fromSelect.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = cur.code;
      opt2.textContent = `${cur.name} (${cur.code})`;
      toSelect.appendChild(opt2);
    });
    fromSelect.value = "UAH";
    toSelect.value = "USD";
  }

  // Fetch NBU rates for given date (YYYY-MM-DD), returns Promise<rates>
  async function fetchRates(dateStr) {
    // NBU expects YYYYMMDD
    let url = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json";
    if (dateStr) {
      const yyyymmdd = dateStr.replace(/-/g, "");
      url += `&date=${yyyymmdd}`;
    }
    const resp = await fetch(url, {cache: "reload"});
    if (!resp.ok) throw new Error("Не вдалося отримати курс НБУ.");
    const data = await resp.json();
    // Filter only top-10 and UAH (UAH will be set to 1)
    const filtered = {};
    filtered["UAH"] = { rate: 1, units: 1, date: dateStr || new Date().toISOString().slice(0, 10) };
    TOP_CURRENCIES.forEach(cur => {
      const found = data.find(row => row.CurrencyCodeL === cur.code);
      if (found) {
        filtered[cur.code] = {
          rate: Number(found.rate || found.Amount),
          units: Number(found.units || found.Units),
          date: found.StartDate ? found.StartDate.split(".").reverse().join("-") : (dateStr || new Date().toISOString().slice(0, 10))
        };
      }
    });
    return filtered;
  }

  // Perform conversion from 'from' to 'to' currency
  function convert(amount, from, to, rates) {
    if (!rates[from] || !rates[to]) return null;
    // Convert 'from' to UAH, then UAH to 'to'
    // amount_in_UAH = amount * (rate[from] / units[from]) if from !== UAH
    // amount_in_to = amount_in_UAH / (rate[to] / units[to])
    let valueInUah, valueOut;
    if (from === "UAH") {
      valueOut = amount / (rates[to].rate / rates[to].units);
    } else if (to === "UAH") {
      valueOut = amount * (rates[from].rate / rates[from].units);
    } else {
      valueInUah = amount * (rates[from].rate / rates[from].units);
      valueOut = valueInUah / (rates[to].rate / rates[to].units);
    }
    return valueOut;
  }

  // Format number for UA locale
  function formatNum(val, digits=4) {
    return Number(val).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: digits });
  }

  // Handle conversion UI
  async function handleConvert(e) {
    if (e) e.preventDefault();
    const amount = Number(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;
    const date = dateInput.value;
    if (!amount || amount <= 0) {
      resultBlock.innerHTML = "<span style='color:#d32f2f;'>Введіть коректну суму.</span>";
      return;
    }
    resultBlock.innerHTML = "Завантаження курсу...";
    try {
      rates = await fetchRates(date);
      const converted = convert(amount, from, to, rates);
      if (converted == null) throw new Error("Дані по валюті недоступні.");
      const fromRate = rates[from];
      const toRate = rates[to];
      let infoRate = "";
      if (from === "UAH") {
        infoRate = `1 ${to} = ${formatNum(toRate.rate / toRate.units, 4)} грн`;
      } else if (to === "UAH") {
        infoRate = `1 ${from} = ${formatNum(fromRate.rate / fromRate.units, 4)} грн`;
      } else {
        // Cross-rate via UAH
        const cross = (toRate.rate / toRate.units) / (fromRate.rate / fromRate.units);
        infoRate = `1 ${from} = ${formatNum(cross, 6)} ${to}`;
      }
      resultBlock.innerHTML = `
        <b>${formatNum(amount,4)} ${from}</b> = <b>${formatNum(converted,4)} ${to}</b><br>
        <span style="font-size:1em; color:#333;">${infoRate} <br> Офіційний курс НБУ на ${date.split('-').reverse().join('.')}</span>
      `;
      // Show chart if UAH <-> [top-10] (not for cross conversions)
      if ((from === "UAH" && to !== "UAH") || (to === "UAH" && from !== "UAH")) {
        renderChart((from === "UAH") ? to : from, date);
      } else {
        chartBlock.style.display = "none";
      }
    } catch (err) {
      resultBlock.innerHTML = `<span style='color:#d32f2f;'>${err.message}</span>`;
      chartBlock.style.display = "none";
    }
  }

  // Chart.js loader (from CDN)
  function ensureChartJs(callback) {
    if (window.Chart) return callback();
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = callback;
    document.body.appendChild(script);
  }

  // Render chart for last 30 days for selected currency
  function renderChart(curCode, dateStr) {
    chartBlock.style.display = "block";
    ensureChartJs(async function () {
      // Prepare array of last 30 days, up to selected date
      const endDate = dateStr ? new Date(dateStr) : new Date();
      const labels = [];
      const data = [];
      for (let i = 29; i >= 0; --i) {
        const d = new Date(endDate);
        d.setDate(d.getDate() - i);
        labels.push(d.toISOString().slice(0, 10));
      }
      // Fetch all rates in parallel (max 30 requests)
      const promises = labels.map(date => fetchRates(date));
      try {
        const ratesArr = await Promise.all(promises);
        ratesArr.forEach(r => {
          if (r[curCode]) {
            data.push(r[curCode].rate / r[curCode].units);
          } else {
            data.push(null);
          }
        });
        // Draw chart
        if (chartInstance) chartInstance.destroy();
        chartInstance = new window.Chart(chartCanvas.getContext("2d"), {
          type: 'line',
          data: {
            labels: labels.map(d => d.split('-').reverse().join('.')),
            datasets: [{
              label: `Курс ${curCode}/UAH`,
              data: data,
              borderColor: "#157aff",
              backgroundColor: "rgba(21,122,255,0.07)",
              tension: 0.1,
              pointRadius: 2
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { title: { display: false }},
              y: { title: { display: true, text: `UAH за 1 ${curCode}` } }
            }
          }
        });
      } catch (e) {
        chartBlock.style.display = "none";
      }
    });
  }

  // Event listeners
  form.addEventListener('submit', handleConvert);
  fromSelect.addEventListener('change', handleConvert);
  toSelect.addEventListener('change', handleConvert);
  dateInput.addEventListener('change', handleConvert);
  amountInput.addEventListener('keyup', function(e) {
    if (e.key === "Enter") handleConvert();
  });

  // Initialization
  populateCurrencies();
  handleConvert();

});
