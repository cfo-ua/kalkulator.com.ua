document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("numbertotext-form");
  const result = document.getElementById("numbertotext-result");

  // Ukrainian numbers in words
  function numberToUkrText(n) {
    if (typeof n === "string") n = n.replace(",", ".").replace(/ /g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(n)) return "Введіть коректне число (до 2 знаків після коми)";
    const arr1 = [
      "",
      "один",
      "два",
      "три",
      "чотири",
      "п’ять",
      "шість",
      "сім",
      "вісім",
      "дев’ять",
      "десять",
      "одинадцять",
      "дванадцять",
      "тринадцять",
      "чотирнадцять",
      "п’ятнадцять",
      "шістнадцять",
      "сімнадцять",
      "вісімнадцять",
      "дев’ятнадцять",
    ];
    const arr2 = [
      "",
      "",
      "двадцять",
      "тридцять",
      "сорок",
      "п’ятдесят",
      "шістдесят",
      "сімдесят",
      "вісімдесят",
      "дев’яносто",
    ];
    const arr3 = [
      "",
      "сто",
      "двісті",
      "триста",
      "чотириста",
      "п’ятсот",
      "шістсот",
      "сімсот",
      "вісімсот",
      "дев’ятсот",
    ];
    const thousands = [
      ["", "", ""],
      ["тисяча", "тисячі", "тисяч"],
      ["мільйон", "мільйони", "мільйонів"],
      ["мільярд", "мільярди", "мільярдів"],
    ];
    const arrFem1 = [
      "",
      "одна",
      "дві",
      "три",
      "чотири",
      "п’ять",
      "шість",
      "сім",
      "вісім",
      "дев’ять",
      "десять",
      "одинадцять",
      "дванадцять",
      "тринадцять",
      "чотирнадцять",
      "п’ятнадцять",
      "шістнадцять",
      "сімнадцять",
      "вісімнадцять",
      "дев’ятнадцять",
    ];

    function getForm(val, forms) {
      val = Math.abs(val) % 100;
      const last = val % 10;
      if (val > 10 && val < 20) return forms[2];
      if (last > 1 && last < 5) return forms[1];
      if (last === 1) return forms[0];
      return forms[2];
    }

    function triadToWords(num, i) {
      let words = [];
      let n = parseInt(num, 10);
      if (n === 0) return "";
      let h = Math.floor(n / 100);
      let t = Math.floor((n % 100) / 10);
      let u = n % 10;
      if (arr3[h]) words.push(arr3[h]);
      if (t > 1) {
        words.push(arr2[t]);
        words.push((i === 1 ? arrFem1 : arr1)[u]);
      } else if (t === 1 || u > 0) {
        words.push((i === 1 ? arrFem1 : arr1)[n % 100]);
      }
      if (i > 0) words.push(getForm(n, thousands[i]));
      return words.filter(Boolean).join(" ");
    }

    let [intPart, fracPart = ""] = n.toString().split(".");
    intPart = intPart.padStart(12, "0");
    let triads = [
      intPart.slice(0, 3),
      intPart.slice(3, 6),
      intPart.slice(6, 9),
      intPart.slice(9, 12),
    ];
    let words = [];
    triads.forEach((num, i) => {
      let w = triadToWords(num, 3 - i);
      if (w) words.push(w);
    });
    let grn = parseInt(intPart, 10);
    let kop = fracPart.padEnd(2, "0").slice(0, 2);
    let kopNum = parseInt(kop, 10);
    let kopWords = kop + " " + getForm(kop, ["копійка", "копійки", "копійок"]);
    let grnWords = getForm(grn, ["гривня", "гривні", "гривень"]);
    let text =
      (words.join(" ").replace(/\s+/g, " ").trim() || "нуль") +
      " " +
      grnWords +
      (kopNum ? " " + kopWords : "");
    // Capitalize first letter
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Copy to clipboard functionality
  function createCopyButton(textToCopy) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.title = "Скопіювати";
    btn.className = "copy-btn";
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="vertical-align:middle" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" fill="#377dff"/><rect x="3" y="3" width="13" height="13" rx="2" fill="none" stroke="#377dff" stroke-width="2"/></svg>';
    btn.onclick = function () {
      navigator.clipboard.writeText(textToCopy).then(
        function () {
          btn.innerHTML = "✓";
          setTimeout(() => {
            btn.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="vertical-align:middle" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" fill="#377dff"/><rect x="3" y="3" width="13" height="13" rx="2" fill="none" stroke="#377dff" stroke-width="2"/></svg>';
          }, 1200);
        },
        function () {
          btn.innerHTML = "!";
        }
      );
    };
    return btn;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("input-numbertotext").value.trim();
      try {
        const txt = numberToUkrText(input);
        result.innerHTML =
          `<span class="numbertotext-text" style="font-weight:600;font-size:1.6rem;color:#277cff">${txt}</span>`;
        // Add copy button
        const textElem = result.querySelector(".numbertotext-text");
        const btn = createCopyButton(txt);
        btn.style.marginLeft = "0.5em";
        textElem.after(btn);
      } catch (error) {
        result.innerHTML = `<span style="color: red">Помилка: невірне число або синтаксис.</span>`;
      }
    });
  }
});
