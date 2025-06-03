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
const UAH = { code: "UAH", name: "Гривня" };

document.addEventListener("DOMContentLoaded", function () {
  // Defensive: only run if currency-form exists
  const form = document.getElementById('currency-form');
  if (!form) return;

  const amountInput = document.getElementById('currency-amount');
  const fromSelect = document.getElementById('currency-from');
  const toSelect = document.getElementById('currency-to');
  const dateInput = document.getElementById('currency-date');
  const resultBlock = document.getElementById('currency-result');
  const chartBlock = document.getElementById('currency-chart-block');
  const chartCanvas = document.getElementById('currency-chart');
  let chartInstance = null;

  // Set today's date as default and max
  if (dateInput) {
    const todayStr = (new Date()).toISOString().slice(0, 10);
    dateInput.value = todayStr;
    dateInput.max = todayStr;
  }

  // Populate currency dropdowns
  function populateCurrencies() {
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

  // Fetch NBU rates for a specific date, fallback up to 7 days prior
  async function fetchRatesWithFallback(dateStr) {
    let date = new Date(dateStr);
    for (let i = 0; i < 7; ++i) {
      const tryDateStr = date.toISOString().slice(0, 10);
      const yyyymmdd = tryDateStr.replace(/-/g, "");
      let url = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json&date=" + yyyymmdd;
      try {
        const resp = await fetch(url, {cache: "reload"});
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data) && data.length > 0) {
            return { rates: data, usedDate: tryDateStr, tried: i };
          }
        }
      } catch (e) {}
      date.setDate(date.getDate() - 1); // Go back 1 day
    }
    return { rates: [], usedDate: dateStr, tried: 7 };
  }

  // Prepare rates object for conversion
  function prepareRates(data, usedDate) {
    const filtered = {};
    // Hardcode UAH
    filtered["UAH"] = { rate: 1, date: usedDate };
    TOP_CURRENCIES.forEach(cur => {
      const found = data.find(row => row.cc === cur.code);
      if (found) {
        filtered[cur.code] = {
          rate: Number(found.rate),
          date: found.exchangedate ? found.exchangedate.split(".").reverse().join("-") : usedDate
        };
      }
    });
    return filtered;
  }

  // Conversion logic
  function convert(amount, from, to, rates) {
    if (!rates[from] || !rates[to]) return null;
    let valueOut;
    if (from === "UAH") {
      valueOut = amount / rates[to].rate;
    } else if (to === "UAH") {
      valueOut = amount * rates[from].rate;
    } else {
      const valueInUah = amount * rates[from].rate;
      valueOut = valueInUah / rates[to].rate;
    }
    return valueOut;
  }

  // Format number for UA locale
  function formatNum(val, digits=4) {
    return Number(val).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: digits });
  }

  // Main conversion handler
  async function handleConvert(e) {
    if (e) e.preventDefault();
    const amount = Number(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;
    const date = dateInput.value;
    if (!amount || amount <= 0) {
      resultBlock.innerHTML = "<span style='color:#d32f2f;'>Введіть коректну суму.</span>";
      chartBlock.style.display = "none";
      return;
    }
    resultBlock.innerHTML = "<span style='color:#888;'>Завантаження курсу...</span>";
    try {
      const { rates: data, usedDate, tried } = await fetchRatesWithFallback(date);
      if (!data || data.length === 0) {
        resultBlock.innerHTML = `<span style='color:#d32f2f;'>Курс на цю дату не був опублікований НБУ. Спробуйте іншу дату (будній день).</span>`;
        chartBlock.style.display = "none";
        return;
      }
      const rates = prepareRates(data, usedDate);
      const converted = convert(amount, from, to, rates);
      if (converted == null || isNaN(converted)) {
        resultBlock.innerHTML = `<span style='color:#d32f2f;'>Дані по валюті недоступні на цю дату.</span>`;
        chartBlock.style.display = "none";
        return;
      }
      const fromRate = rates[from];
      const toRate = rates[to];
      let infoRate = "";
      if (from === "UAH") {
        infoRate = `1 ${to} = ${formatNum(toRate.rate, 4)} грн`;
      } else if (to === "UAH") {
        infoRate = `1 ${from} = ${formatNum(fromRate.rate, 4)} грн`;
      } else {
        const cross = toRate.rate / fromRate.rate;
        infoRate = `1 ${from} = ${formatNum(cross, 6)} ${to}`;
      }
      let usedDateMsg = (tried > 0)
        ? `<br><span style="font-size:0.95em;color:#c55;">Курс знайдено на ${rates[from].date.split('-').reverse().join('.')} (найближча доступна дата)</span>`
        : "";
      resultBlock.innerHTML = `
        <b>${formatNum(amount,4)} ${from}</b> = <b>${formatNum(converted,4)} ${to}</b><br>
        <span style="font-size:1em; color:#333;">${infoRate}<br>
        Офіційний курс надається <b>НБУ</b> на ${rates[from].date.split('-').reverse().join('.')}
        ${usedDateMsg}
        <br>
        <span style="font-size:0.96em;color:#555;">Джерело: <a href="https://bank.gov.ua/" target="_blank" rel="noopener nofollow">bank.gov.ua</a></span>
        </span>
      `;
      if ((from === "UAH" && to !== "UAH") || (to === "UAH" && from !== "UAH")) {
        renderChart((from === "UAH") ? to : from, rates[from].date);
      } else {
        chartBlock.style.display = "none";
      }
    } catch (err) {
      resultBlock.innerHTML = `<span style='color:#d32f2f;'>${err.message}</span>`;
      chartBlock.style.display = "none";
    }
  }

  // Chart.js loader from CDN
  function ensureChartJs(callback) {
    if (window.Chart) return callback();
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = callback;
    document.body.appendChild(script);
  }

  // Apple-style chart rendering
  function renderChart(curCode, dateStr) {
    chartBlock.style.display = "block";
    ensureChartJs(async function () {
      const endDate = dateStr ? new Date(dateStr) : new Date();
      const labels = [];
      const data = [];
      for (let i = 29; i >= 0; --i) {
        const d = new Date(endDate);
        d.setDate(d.getDate() - i);
        labels.push(d.toISOString().slice(0, 10));
      }
      const promises = labels.map(date => fetchRatesWithFallback(date).then(r => r.rates));
      try {
        const ratesArr = await Promise.all(promises);
        ratesArr.forEach(rArr => {
          const found = rArr.find(row => row.cc === curCode);
          if (found) {
            data.push(Number(found.rate));
          } else {
            data.push(null);
          }
        });
        if (chartInstance) chartInstance.destroy();
        chartInstance = new window.Chart(chartCanvas.getContext("2d"), {
          type: 'line',
          data: {
            labels: labels.map(d => d.split('-').reverse().join('.')),
            datasets: [{
              label: '',
              data: data,
              borderColor: "#157aff",
              backgroundColor: "rgba(21,122,255,0.07)",
              borderWidth: 2,
              tension: 0.35,
              pointRadius: 0,
              pointHoverRadius: 5,
              fill: true,
              cubicInterpolationMode: 'monotone'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                backgroundColor: "#222",
                titleColor: "#fff",
                bodyColor: "#fff"
              }
            },
            layout: {
              padding: { left: 0, right: 0, top: 8, bottom: 10 }
            },
            scales: {
              x: {
                grid: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  display: false
                }
              },
              y: {
                grid: {
                  color: "#e7ecf3",
                  borderDash: [4,4],
                  drawBorder: false,
                },
                ticks: {
                  color: "#6c7a89",
                  font: { size: 11 },
                  padding: 4,
                  precision: 3,
                  callback: function(value) {
                    return value;
                  }
                }
              }
            },
            elements: {
              line: {
                borderJoinStyle: 'round',
                borderCapStyle: 'round'
              }
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
