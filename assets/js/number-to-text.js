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
    return (
      (words.join(" ").replace(/\s+/g, " ").trim() || "нуль") +
      " " +
      grnWords +
      (kopNum ? " " + kopWords : "")
    );
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("input-numbertotext").value.trim();
      try {
        const txt = numberToUkrText(input);
        result.innerHTML = `<b>У тексті:</b> ${txt}`;
      } catch (error) {
        result.innerHTML = `<span style="color: red">Помилка: невірне число або синтаксис.</span>`;
      }
    });
  }
});
