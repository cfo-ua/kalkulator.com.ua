import requests
import json
from datetime import datetime
import os

# --- SETTINGS ---
CODES = ["USD", "EUR", "PLN", "CNY", "TRY", "CHF", "GBP", "CAD", "JPY"]
OUTFILE = "assets/data/nbu-history.json"

# Fetch latest rates from NBU
url = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json"
resp = requests.get(url)
resp.raise_for_status()
rates = resp.json()

# Prepare new records from API response, always using 'exchangedate' from API
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

# Load existing history (if exists)
if os.path.exists(OUTFILE):
    with open(OUTFILE, "r", encoding="utf-8") as f:
        try:
            history = json.load(f)
        except Exception:
            history = []
else:
    history = []

# Merge new records, deduplicate by (date, currency), always keep the newest
combined = {(r["Дата"], r["Код літерний"]): r for r in history}
for r in new_records:
    combined[(r["Дата"], r["Код літерний"])] = r

# Convert back to list and sort by date then currency
def parse_date(d):
    # DD.MM.YYYY
    return datetime.strptime(d, "%d.%m.%Y")
result = list(combined.values())
result.sort(key=lambda r: (parse_date(r["Дата"]), r["Код літерний"]))

# Save updated history
with open(OUTFILE, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
