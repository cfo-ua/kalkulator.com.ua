document.addEventListener("DOMContentLoaded", function () {
  const percent1 = document.getElementById('percent1');
  const number1 = document.getElementById('number1');
  const result1 = document.getElementById('result1');
  
  const part = document.getElementById('part');
  const whole = document.getElementById('whole');
  const result2 = document.getElementById('result2');
  
  const oldValue = document.getElementById('oldValue');
  const newValue = document.getElementById('newValue');
  const result3 = document.getElementById('result3');
  
  // Calculate X% of Y
  function calculatePercentOf() {
    const percent = parseFloat(percent1.value);
    const number = parseFloat(number1.value);
    
    if (isNaN(percent) || isNaN(number)) {
      result1.textContent = "Please enter valid numbers.";
      return;
    }
    
    const result = (number * percent) / 100;
    result1.innerHTML = `<strong>Result:</strong> ${percent}% of ${number} = ${result.toFixed(2)}`;
  }
  
  // Calculate what percent X is of Y
  function calculateWhatPercent() {
    const partValue = parseFloat(part.value);
    const wholeValue = parseFloat(whole.value);
    
    if (isNaN(partValue) || isNaN(wholeValue) || wholeValue === 0) {
      result2.textContent = "Please enter valid numbers (whole cannot be 0).";
      return;
    }
    
    const percent = (partValue / wholeValue) * 100;
    result2.innerHTML = `<strong>Result:</strong> ${partValue} is ${percent.toFixed(2)}% of ${wholeValue}`;
  }
  
  // Calculate percentage change
  function calculatePercentageChange() {
    const oldVal = parseFloat(oldValue.value);
    const newVal = parseFloat(newValue.value);
    
    if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) {
      result3.textContent = "Please enter valid numbers (old value cannot be 0).";
      return;
    }
    
    const change = ((newVal - oldVal) / oldVal) * 100;
    const changeType = change >= 0 ? "increase" : "decrease";
    result3.innerHTML = `<strong>Result:</strong> ${Math.abs(change).toFixed(2)}% ${changeType} (from ${oldVal} to ${newVal})`;
  }
  
  // Add event listeners
  if (percent1 && number1) {
    percent1.addEventListener('input', calculatePercentOf);
    number1.addEventListener('input', calculatePercentOf);
  }
  
  if (part && whole) {
    part.addEventListener('input', calculateWhatPercent);
    whole.addEventListener('input', calculateWhatPercent);
  }
  
  if (oldValue && newValue) {
    oldValue.addEventListener('input', calculatePercentageChange);
    newValue.addEventListener('input', calculatePercentageChange);
  }
  
  // Auto-calculate with default values on page load
  setTimeout(() => {
    if (percent1 && number1 && percent1.value && number1.value) {
      calculatePercentOf();
    }
  }, 100);
});