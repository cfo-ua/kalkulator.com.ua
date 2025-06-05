const TOP_CURRENCIES = [
  { code: "USD", name: "Долар США", color: "#3db7cc" },
  { code: "EUR", name: "Євро", color: "#23b378" },
  { code: "GBP", name: "Фунт стерлінгів", color: "#39b3a9" },
  { code: "CHF", name: "Швейцарський франк", color: "#237d6b" },
  { code: "CAD", name: "Канадський долар", color: "#4261a3" },
  { code: "PLN", name: "Польський злотий", color: "#eb4848" },
  { code: "TRY", name: "Турецька ліра", color: "#6a4aa0" },
  { code: "CNY", name: "Китайський юань", color: "#353f93" },
  { code: "JPY", name: "Японська єна", color: "#7162a7" }
];
const UAH = { code: "UAH", name: "Гривня" };

let nbuHistory = null;
async function loadNBURates() {
  if (nbuHistory) return nbuHistory;
  const resp = await fetch('/assets/data/nbu-history.json');
  nbuHistory = await resp.json();
  return nbuHistory;
}

// Get all rates for a given date in 'YYYY-MM-DD', fallback up to 7 days back
async function fetchRatesWithFallback(dateStr) {
  const history = await loadNBURates();
  let date = new Date(dateStr);
  for (let i = 0; i < 7; ++i) {
    const tryDate = date.toISOString().slice(0, 10).split('-').reverse().join('.');
    const data = history.filter(r => r["Дата"] === tryDate);
    if (data && data.length > 0) {
      return {
        rates: data.map(row => ({
          cc: row["Код літерний"],
          rate: row["Офіційний курс гривні, грн"] / (row["Кількість одиниць"] || 1),
          exchangedate: row["Дата"]
        })),
        usedDate: date.toISOString().slice(0, 10),
        tried: i
      }
    }
    date.setDate(date.getDate() - 1);
  }
  return { rates: [], usedDate: dateStr, tried: 7 };
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('currency-form');
  if (!form) return;

  const amountInput = document.getElementById('currency-amount');
  const fromSelect = document.getElementById('currency-from');
  const toSelect = document.getElementById('currency-to');
  const dateInput = document.getElementById('currency-date');
  const resultBlock = document.getElementById('currency-result');
  const chartBlock = document.getElementById('currency-chart-block');
  const chartCanvas = document.getElementById('currency-chart');
  const chartRangeQuick = document.getElementById('chart-range-quick');
  let chartInstance = null;
  let currentChartRange = 30; // default
  let allDates = null; // for "the whole time"

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

  // Prepare rates object for conversion
  function prepareRates(data, usedDate) {
    const filtered = {};
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

  function formatNum(val, digits=2) {
    // Always round to 2
    return Number(val).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async function handleConvert(e) {
    if (e) e.preventDefault();
    const amount = Number(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;
    const date = dateInput.value;
    resultBlock.innerHTML = "";
    if (!amount || amount <= 0) {
      resultBlock.innerHTML = "<span style='color:#d32f2f;'>Введіть коректну суму.</span>";
      chartBlock.style.display = "none";
      if(chartRangeQuick) chartRangeQuick.style.display = "none";
      return;
    }
    resultBlock.innerHTML = "<span style='color:#888;'>Завантаження курсу...</span>";
    try {
      const { rates: data, usedDate, tried } = await fetchRatesWithFallback(date);
      if (!data || data.length === 0) {
        resultBlock.innerHTML = `<span style='color:#d32f2f;'>Курс на цю дату не був опублікований НБУ. Спробуйте іншу дату (будній день).</span>`;
        chartBlock.style.display = "none";
        if(chartRangeQuick) chartRangeQuick.style.display = "none";
        return;
      }
      const rates = prepareRates(data, usedDate);
      const converted = convert(amount, from, to, rates);
      if (converted == null || isNaN(converted)) {
        resultBlock.innerHTML = `<span style='color:#d32f2f;'>Дані по валюті недоступні на цю дату.</span>`;
        chartBlock.style.display = "none";
        if(chartRangeQuick) chartRangeQuick.style.display = "none";
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
        <b>${formatNum(amount,2)} ${from}</b> <span style="color:#c3c3c3;font-size:1.2em;">⟶</span> <b>${formatNum(converted,2)} ${to}</b><br>
        <span style="font-size:1em; color:#333;">${infoRate}<br>
        Офіційний курс надається <b>НБУ</b> на ${rates[from].date.split('-').reverse().join('.')}
        ${usedDateMsg}
        <br>
        <span style="font-size:0.96em;color:#555;">Джерело: <a href="https://bank.gov.ua/" target="_blank" rel="noopener nofollow">bank.gov.ua</a></span>
        </span>
      `;
      if ((from === "UAH" && to !== "UAH") || (to === "UAH" && from !== "UAH")) {
        if(chartRangeQuick) {
          chartRangeQuick.style.display = "block";
          setActiveRangeBtn(currentChartRange);
        }
        renderChart((from === "UAH") ? to : from, rates[from].date, currentChartRange);
      } else {
        chartBlock.style.display = "none";
        if(chartRangeQuick) chartRangeQuick.style.display = "none";
      }
    } catch (err) {
      resultBlock.innerHTML = `<span style='color:#d32f2f;'>${err.message}</span>`;
      chartBlock.style.display = "none";
      if(chartRangeQuick) chartRangeQuick.style.display = "none";
    }
  }

  function ensureChartJs(callback) {
    if (window.Chart) return callback();
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = callback;
    document.body.appendChild(script);
  }

  // Find all unique dates in the JSON (for "the whole time" chart)
  async function getAllDates() {
    if (allDates) return allDates;
    const history = await loadNBURates();
    const set = new Set();
    history.forEach(r => set.add(r["Дата"]));
    // Sort: dd.mm.yyyy to yyyy-mm-dd and sort
    const arr = Array.from(set).map(d => d.split('.').reverse().join('-'));
    arr.sort();
    allDates = arr;
    return allDates;
  }

  function getCurrencyMeta(code) {
    return TOP_CURRENCIES.find(c => c.code === code) || { name: code, color: "#444" };
  }

  // Chart rendering, now supports "all time" and 5y range with downsampling
  function renderChart(curCode, endDateStr, rangeDays = 30) {
    chartBlock.style.display = "block";
    ensureChartJs(async function () {
      let labels = [];
      let data = [];
      let history;
      let hasAnyData = false;

      // "the whole time" mode: rangeDays = -1
      if (rangeDays === -1) {
        labels = await getAllDates();
        history = await loadNBURates();

        // Downsampling: max N points for performance
        const MAX_POINTS = 400;
        let step = 1;
        if (labels.length > MAX_POINTS) {
          step = Math.ceil(labels.length / MAX_POINTS);
        }
        let downLabels = [];
        let downData = [];
        for (let i = 0; i < labels.length; i += step) {
          const dateStr = labels[i];
          const dateUA = dateStr.split("-").reverse().join(".");
          const rec = history.find(r => r["Дата"] === dateUA && r["Код літерний"] === curCode);
          downLabels.push(dateStr);
          if (rec && rec["Офіційний курс гривні, грн"]) {
            const rate = rec["Офіційний курс гривні, грн"] / (rec["Кількість одиниць"] || 1);
            downData.push(rate);
            hasAnyData = true;
          } else {
            downData.push(null);
          }
        }
        labels = downLabels;
        data = downData;
      } else {
        let endDate = endDateStr ? new Date(endDateStr) : new Date();
        let startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - (rangeDays - 1));
        if (startDate > endDate) startDate = endDate;
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          labels.push(d.toISOString().slice(0, 10));
        }
        history = await loadNBURates();
        data = [];
        labels.forEach(dateStr => {
          // Convert YYYY-MM-DD to DD.MM.YYYY for lookup
          const dateUA = dateStr.split("-").reverse().join(".");
          const rec = history.find(r => r["Дата"] === dateUA && r["Код літерний"] === curCode);
          if (rec && rec["Офіційний курс гривні, грн"]) {
            const rate = rec["Офіційний курс гривні, грн"] / (rec["Кількість одиниць"] || 1);
            data.push(rate);
            hasAnyData = true;
          } else {
            data.push(null);
          }
        });
      }

      if (!hasAnyData) {
        chartBlock.style.display = "none";
        if(chartRangeQuick) chartRangeQuick.style.display = "none";
        resultBlock.innerHTML = `<span style='color:#d32f2f;'>Курс на цей період недоступний (дані НБУ відсутні). Спробуйте інший діапазон або дату.</span>`;
        return;
      }
      if (chartInstance) chartInstance.destroy();
      const meta = getCurrencyMeta(curCode);
      chartInstance = new window.Chart(chartCanvas.getContext("2d"), {
        type: 'line',
        data: {
          labels: labels.map(d => d.split('-').reverse().join('.')),
          datasets: [{
            label: '',
            data: data,
            borderColor: meta.color,
            backgroundColor: meta.color + "10",
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
              bodyColor: "#fff",
              callbacks: {
                title: (items) => `Дата: ${items[0].label}`,
                label: (items) => items.raw ? `Курс: ${items.formattedValue} UAH` : 'Немає даних'
              }
            }
          },
          layout: {
            padding: { left: 0, right: 0, top: 8, bottom: 10 }
          },
          scales: {
            x: {
              grid: { display: false, drawBorder: false },
              ticks: {
                display: true,
                autoSkip: true,
                maxTicksLimit: Math.min(10, labels.length),
                font: { size: 11 },
                color: "#5476a3"
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
                callback: function(value) { return value; }
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
    });
  }

  // Add 'the whole time' button and quick range UX
  function setActiveRangeBtn(days) {
    if(!chartRangeQuick) return;
    currentChartRange = days;
    chartRangeQuick.querySelectorAll('.chart-range-btn').forEach(btn => {
      btn.classList.toggle('active', String(btn.dataset.range) === String(days));
    });
  }
  if(chartRangeQuick) {
    chartRangeQuick.addEventListener('click', function(e) {
      const btn = e.target.closest('.chart-range-btn');
      if (!btn) return;
      const days = Number(btn.dataset.range);
      if (days !== currentChartRange) {
        setActiveRangeBtn(days);
        currentChartRange = days;
        resultBlock.innerHTML = ""; // Clear error before render
        const from = fromSelect.value;
        const to = toSelect.value;
        const date = dateInput.value;
        const curCode = (from === "UAH") ? to : from;
        renderChart(curCode, date, days);
      }
    });
  }

  // Initialization
  populateCurrencies();
  handleConvert();

  // Event listeners
  form.addEventListener('submit', handleConvert);
  fromSelect.addEventListener('change', handleConvert);
  toSelect.addEventListener('change', handleConvert);
  dateInput.addEventListener('change', handleConvert);
  amountInput.addEventListener('keyup', function(e) {
    if (e.key === "Enter") handleConvert();
  });
});
