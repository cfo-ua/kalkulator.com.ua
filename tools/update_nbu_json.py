import requests
import json
from datetime import datetime, timedelta

# 9 tracked currencies
CODES = ["USD", "EUR", "PLN", "CNY", "TRY", "CHF", "GBP", "CAD", "JPY"]
OUTFILE = "assets/data/nbu-history.json"

today = datetime.now().strftime("%Y%m%d")
url = f"https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json&date={today}"
resp = requests.get(url)
resp.raise_for_status()
rates = resp.json()

# Filter only needed currencies, and normalize
new_records = []
for row in rates:
    if row.get("cc") in CODES:
        new_records.append({
            "Дата": row["exchangedate"],        # DD.MM.YYYY
            "Час": "00.00",
            "Код цифровий": row["r030"],
            "Код літерний": row["cc"],
            "Кількість одиниць": row["unit"],
            "Назва валюти": row["txt"],
            "Офіційний курс гривні, грн": row["rate"]
        })

# Load full history
try:
    with open(OUTFILE, "r", encoding="utf-8") as f:
        history = json.load(f)
except Exception:
    history = []

# Remove duplicates: keep only one record per (date, code), with new data taking priority
combined = {(r["Дата"], r["Код літерний"]): r for r in history}
for r in new_records:
    combined[(r["Дата"], r["Код літерний"])] = r

# Convert back to list, sort by date then code
result = list(combined.values())
result.sort(key=lambda r: (datetime.strptime(r["Дата"], "%d.%m.%Y"), r["Код літерний"]))

with open(OUTFILE, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
