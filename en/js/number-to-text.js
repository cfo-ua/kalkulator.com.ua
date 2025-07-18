document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("numbertotext-form");
  const input = document.getElementById("input-numbertotext");
  const result = document.getElementById("numbertotext-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    convertNumberToText();
  });

  // Also convert on input change for better UX
  input.addEventListener("input", function () {
    if (this.value.trim()) {
      convertNumberToText();
    }
  });

  function convertNumberToText() {
    const inputValue = input.value.trim().replace(/,/g, "");
    
    if (!inputValue) {
      result.innerHTML = '<p style="color: red;">Please enter a number.</p>';
      return;
    }

    // Parse the number
    const number = parseFloat(inputValue);
    
    if (isNaN(number)) {
      result.innerHTML = '<p style="color: red;">Please enter a valid number.</p>';
      return;
    }

    const textResult = numberToWords(number);
    
    result.innerHTML = `
      <div class="conversion-result">
        <div class="input-display">
          <strong>Number:</strong> ${number.toLocaleString()}
        </div>
        <div class="output-display">
          <strong>In words:</strong>
          <div class="text-result">${textResult}</div>
        </div>
        <button onclick="copyToClipboard('${textResult.replace(/'/g, "\\'")}')" class="copy-btn">Copy Result</button>
      </div>
    `;
  }

  function numberToWords(num) {
    if (num === 0) return "zero";
    
    // Handle negative numbers
    if (num < 0) {
      return "negative " + numberToWords(Math.abs(num));
    }

    // Split into integer and decimal parts
    const parts = num.toString().split(".");
    const integerPart = parseInt(parts[0]);
    const decimalPart = parts[1];

    let result = convertIntegerToWords(integerPart);
    
    if (decimalPart) {
      result += " point";
      for (let digit of decimalPart) {
        result += " " + convertIntegerToWords(parseInt(digit));
      }
    }

    return result;
  }

  function convertIntegerToWords(num) {
    if (num === 0) return "zero";

    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const scales = ["", "thousand", "million", "billion", "trillion"];

    function convertHundreds(n) {
      let result = "";
      
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " hundred";
        n %= 100;
        if (n > 0) result += " ";
      }
      
      if (n >= 20) {
        result += tens[Math.floor(n / 10)];
        n %= 10;
        if (n > 0) result += "-" + ones[n];
      } else if (n >= 10) {
        result += teens[n - 10];
      } else if (n > 0) {
        result += ones[n];
      }
      
      return result;
    }

    if (num === 0) return "";

    let result = "";
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = convertHundreds(chunk);
        if (scaleIndex > 0) {
          result = chunkWords + " " + scales[scaleIndex] + (result ? " " + result : "");
        } else {
          result = chunkWords;
        }
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result;
  }

  // Global function for copy button
  window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(function() {
      // Show success message
      const copyBtn = document.querySelector('.copy-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.style.backgroundColor = '#28a745';
      
      setTimeout(function() {
        copyBtn.textContent = originalText;
        copyBtn.style.backgroundColor = '';
      }, 2000);
    }).catch(function(err) {
      console.error('Could not copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Text copied to clipboard!');
      } catch (err) {
        alert('Unable to copy to clipboard');
      }
      document.body.removeChild(textArea);
    });
  };
});