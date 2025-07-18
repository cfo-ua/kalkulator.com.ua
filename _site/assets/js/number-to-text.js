document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("numbertotext-form");
  const result = document.getElementById("numbertotext-result");

  // Ukrainian numbers in words (with correct gender for "гривня", "копійка", thousands)
  function numberToUkrText(n) {
    if (typeof n === "string") n = n.replace(",", ".").replace(/ /g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(n)) return "Введіть коректне число (до 2 знаків після коми)";

    // Masculine numerals
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
    // Feminine numerals (for thousands, гривня, копійка)
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
    // Forms for thousands/millions/billions [singular, few, many]
    const thousands = [
      ["", "", ""],
      ["тисяча", "тисячі", "тисяч"],
      ["мільйон", "мільйони", "мільйонів"],
      ["мільярд", "мільярди", "мільярдів"],
    ];

    // Choose correct form depending on number
    function getForm(val, forms) {
      val = Math.abs(val) % 100;
      const last = val % 10;
      if (val > 10 && val < 20) return forms[2];
      if (last > 1 && last < 5) return forms[1];
      if (last === 1) return forms[0];
      return forms[2];
    }

    // Get triad in words, gender: 0=masc, 1=fem
    function triadToWords(num, i) {
      let words = [];
      let n = parseInt(num, 10);
      if (n === 0) return "";
      let h = Math.floor(n / 100);
      let t = Math.floor((n % 100) / 10);
      let u = n % 10;
      if (arr3[h]) words.push(arr3[h]);
      // Use feminine numerals for thousands (i==1)
      const arr = i === 1 ? arrFem1 : arr1;
      if (t > 1) {
        words.push(arr2[t]);
        words.push(arr[u]);
      } else if (t === 1 || u > 0) {
        words.push(arr[n % 100]);
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

    // Гривня and копійка are feminine → use arrFem1 for numbers 1 and 2
    function grnText(n) {
      n = Number(n);
      let word =
        n % 100 > 10 && n % 100 < 20
          ? "гривень"
          : n % 10 === 1
          ? "гривня"
          : n % 10 >= 2 && n % 10 <= 4
          ? "гривні"
          : "гривень";
      // Use feminine for "one"/"two" гривня
      if (n % 100 === 1 || (n % 100 > 20 && n % 10 === 1)) {
        words[words.length - 1] = arrFem1[1];
      }
      if ((n % 100 === 2 || (n % 100 > 20 && n % 10 === 2)) && words.length > 0) {
        words[words.length - 1] = arrFem1[2];
      }
      return word;
    }
    function kopText(n) {
      n = Number(n);
      let word =
        n % 100 > 10 && n % 100 < 20
          ? "копійок"
          : n % 10 === 1
          ? "копійка"
          : n % 10 >= 2 && n % 10 <= 4
          ? "копійки"
          : "копійок";
      return word;
    }

    // Special case: 1 or 2 гривня/гривні must be одна/дві гривня/гривні, not один/два
    // Patch last word if needed (if grn is 1 or 2)
    if (grn % 10 === 1 && grn % 100 !== 11 && words.length > 0) {
      words[words.length - 1] = arrFem1[1];
    }
    if (grn % 10 === 2 && grn % 100 !== 12 && words.length > 0) {
      words[words.length - 1] = arrFem1[2];
    }

    let grnWords = grnText(grn);
    let kopWords = kop + " " + kopText(kop);

    let text =
      (words.join(" ").replace(/\s+/g, " ").trim() || "нуль") +
      " " +
      grnWords +
      (kopNum ? " " + kopWords : "");

    // Capitalize first letter
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Inline SVG icon (bigger, inline, no button)
  function createCopyIcon(textToCopy) {
    const span = document.createElement("span");
    span.title = "Скопіювати";
    span.setAttribute("tabindex", "0");
    span.setAttribute("role", "button");
    span.setAttribute("aria-label", "Скопіювати результат");
    span.style.display = "inline-block";
    span.style.verticalAlign = "middle";
    span.style.cursor = "pointer";
    span.style.marginLeft = "0.5em";
    span.style.transform = "translateY(-0.13em)";
    span.innerHTML =
      '<svg width="32" height="32" fill="none" stroke="#277cff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="2 2 20 20"><rect x="9" y="9" width="8" height="8" rx="2" fill="#e7f1ff"/><rect x="5" y="5" width="8" height="8" rx="2" stroke="#277cff" fill="none"/></svg>';

    function showCheck() {
      span.innerHTML =
        '<svg width="32" height="32" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#28c86f"/><path d="M5 10l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      setTimeout(() => {
        span.innerHTML =
          '<svg width="32" height="32" fill="none" stroke="#277cff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="2 2 20 20"><rect x="9" y="9" width="8" height="8" rx="2" fill="#e7f1ff"/><rect x="5" y="5" width="8" height="8" rx="2" stroke="#277cff" fill="none"/></svg>';
      }, 1200);
    }

    // Mouse/keyboard interaction
    span.onclick = function () {
      navigator.clipboard.writeText(textToCopy).then(showCheck, () => {});
    };
    span.onkeydown = function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        span.onclick();
      }
    };

    return span;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("input-numbertotext").value.trim();
      try {
        const txt = numberToUkrText(input);
        result.innerHTML =
          `<span class="numbertotext-text" style="font-weight:600;font-size:1.6rem;color:#277cff;display:inline;">${txt}</span>`;
        // Add copy icon right after text, inline and bigger
        const textElem = result.querySelector(".numbertotext-text");
        const icon = createCopyIcon(txt);
        textElem.after(icon);
      } catch (error) {
        result.innerHTML = `<span style="color: red">Помилка: невірне число або синтаксис.</span>`;
      }
    });
  }
});
