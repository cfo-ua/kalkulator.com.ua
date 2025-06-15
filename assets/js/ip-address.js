document.addEventListener("DOMContentLoaded", async function () {
  const el = document.getElementById("ip-address");
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    el.textContent = data.ip;
  } catch (err) {
    el.textContent = "Неможливо визначити IP адресу.";
    console.error("IP fetch error:", err);
  }
});
