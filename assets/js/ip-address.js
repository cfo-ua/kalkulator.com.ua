document.addEventListener("DOMContentLoaded", async () => {
  const wrapper = document.getElementById("ip-address-wrapper");
  wrapper.innerHTML = "<p>Завантаження даних...</p>";

  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("Не вдалося отримати геодані IP");
    const d = await res.json();

    wrapper.innerHTML = `
      <ul style="list-style:none; padding:0; line-height:1.5;">
        <li><b>IP-адреса:</b> ${d.ip}</li>
        <li><b>Країна:</b> ${d.country_name} (${d.country_code})</li>
        <li><b>Регіон:</b> ${d.region}</li>
        <li><b>Місто:</b> ${d.city}</li>
        ${d.org ? `<li><b>Провайдер / Організація:</b> ${d.org}</li>` : ""}
        ${d.connection && d.connection.type ? `<li><b>Тип підключення:</b> ${d.connection.type}</li>` : ""}
      </ul>
    `;
  } catch (err) {
    console.error(err);
    wrapper.innerHTML = "<p>Не вдалося визначити IP та геолокацію.</p>";
  }
});
