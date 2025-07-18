document.addEventListener("DOMContentLoaded", function () {
  const tripsContainer = document.getElementById("trip-rows");
  const addTripButton = document.getElementById("add-trip");
  const resultBlock = document.getElementById("schengen-result");
  const checkDateInput = document.getElementById("check-date");

  const createTripRow = () => {
    const row = document.createElement("div");
    row.className = "trip-row";
    row.innerHTML = `
      <input type="date" class="date-in" placeholder="Дата в’їзду">
      <input type="date" class="date-out" placeholder="Дата виїзду">
      <button type="button" class="remove-trip">✕</button>
    `;
    row.querySelector(".remove-trip").onclick = () => row.remove();
    tripsContainer.appendChild(row);
  };

  addTripButton.onclick = () => createTripRow();
  createTripRow(); // initialize with one row

  const parseDate = str => new Date(str + "T00:00:00");

  const getDaysBetween = (start, end) => {
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getTripDays = () => {
    const trips = [];
    document.querySelectorAll(".trip-row").forEach(row => {
      const inDate = row.querySelector(".date-in").value;
      const outDate = row.querySelector(".date-out").value;
      if (inDate && outDate && inDate <= outDate) {
        trips.push({ in: parseDate(inDate), out: parseDate(outDate) });
      }
    });
    return trips;
  };

  const calculateSchengenStatus = () => {
    const trips = getTripDays();
    const refDate = parseDate(checkDateInput.value);
    const windowStart = new Date(refDate);
    windowStart.setDate(windowStart.getDate() - 179);

    let daysInWindow = 0;
    const countedDays = new Set();

    for (let trip of trips) {
      const from = trip.in < windowStart ? windowStart : trip.in;
      const to = trip.out > refDate ? refDate : trip.out;

      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        countedDays.add(d.toDateString());
      }
    }

    daysInWindow = countedDays.size;

    let msg = `<p>Ви перебували в Шенгені <strong>${daysInWindow} дн.</strong> за останні 180 днів (до ${refDate.toLocaleDateString()}).</p>`;
    msg += daysInWindow > 90
      ? `<p style="color:red"><strong>Увага!</strong> Ви перевищили дозволений ліміт 90 днів.</p>`
      : `<p style="color:green">Все гаразд — ви не перевищили ліміт 90 днів.</p>`;

    resultBlock.innerHTML = msg;
  };

  tripsContainer.addEventListener("change", calculateSchengenStatus);
  checkDateInput.addEventListener("change", calculateSchengenStatus);
});
