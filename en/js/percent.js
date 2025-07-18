document.addEventListener("DOMContentLoaded", function () {
  // Calculate X% of Y
  document.getElementById('calc-percent-of').onclick = function() {
    const percent = parseFloat(document.getElementById('percent1').value);
    const number = parseFloat(document.getElementById('number1').value);
    const result1 = document.getElementById('result1');
    
    if (isNaN(percent) || isNaN(number)) {
      result1.textContent = "Please enter valid numbers.";
      return;
    }
    
    const result = (number * percent) / 100;
    result1.innerHTML = `<strong>Result:</strong> ${percent}% of ${number} = ${result.toFixed(2)}`;
  };
  
  // Calculate what percent X is of Y
  document.getElementById('calc-what-percent').onclick = function() {
    const partValue = parseFloat(document.getElementById('part').value);
    const wholeValue = parseFloat(document.getElementById('whole').value);
    const result2 = document.getElementById('result2');
    
    if (isNaN(partValue) || isNaN(wholeValue) || wholeValue === 0) {
      result2.textContent = "Please enter valid numbers (whole cannot be 0).";
      return;
    }
    
    const percent = (partValue / wholeValue) * 100;
    result2.innerHTML = `<strong>Result:</strong> ${partValue} is ${percent.toFixed(2)}% of ${wholeValue}`;
  };
  
  // Calculate percentage change
  document.getElementById('calc-percent-change').onclick = function() {
    const oldVal = parseFloat(document.getElementById('oldValue').value);
    const newVal = parseFloat(document.getElementById('newValue').value);
    const result3 = document.getElementById('result3');
    
    if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) {
      result3.textContent = "Please enter valid numbers (old value cannot be 0).";
      return;
    }
    
    const change = ((newVal - oldVal) / oldVal) * 100;
    const changeType = change >= 0 ? "increase" : "decrease";
    result3.innerHTML = `<strong>Result:</strong> ${Math.abs(change).toFixed(2)}% ${changeType} (from ${oldVal} to ${newVal})`;
  };
});