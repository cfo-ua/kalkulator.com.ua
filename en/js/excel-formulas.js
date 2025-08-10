document.addEventListener("DOMContentLoaded", function () {
  const formulaCollection = document.getElementById('formula-collection');
  const searchInput = document.getElementById('formula-search');
  const categoryFilter = document.getElementById('category-filter');
  const totalFormulasSpan = document.getElementById('total-formulas');
  const filteredFormulasSpan = document.getElementById('filtered-formulas');
  const copiedFormulasSpan = document.getElementById('copied-formulas');
  
  let copiedCount = 0;
  
  // Top 50 Excel/Google Sheets formulas data
  const formulaData = {
    math: {
      title: "🔢 Mathematical Functions",
      formulas: [
        {
          name: "SUM",
          syntax: "=SUM(number1, [number2], ...)",
          description: "Adds all numbers in a range of cells",
          example: "=SUM(A1:A10)",
          exampleResult: "Sum of numbers from A1 to A10",
          usage: "Calculate total sales, expenses, scores",
          tips: "You can use multiple ranges: =SUM(A1:A5,C1:C5)",
          keywords: ["sum", "addition", "total", "aggregate"]
        },
        {
          name: "AVERAGE",
          syntax: "=AVERAGE(number1, [number2], ...)",
          description: "Calculates the arithmetic mean of numbers",
          example: "=AVERAGE(B1:B20)",
          exampleResult: "Average value from B1 to B20",
          usage: "Average grade, average salary, average price",
          tips: "Ignores text values and empty cells",
          keywords: ["average", "mean", "grade", "price"]
        },
        {
          name: "COUNT",
          syntax: "=COUNT(value1, [value2], ...)",
          description: "Counts the number of cells containing numbers",
          example: "=COUNT(A1:A100)",
          exampleResult: "Number of numeric values in range",
          usage: "Count filled records, grades, entries",
          tips: "Use COUNTA to count all non-empty cells",
          keywords: ["count", "number", "entries", "records"]
        },
        {
          name: "MAX",
          syntax: "=MAX(number1, [number2], ...)",
          description: "Finds the largest value",
          example: "=MAX(C1:C50)",
          exampleResult: "Maximum value from range",
          usage: "Highest score, maximum temperature, largest profit",
          tips: "Ignores text and logical values",
          keywords: ["maximum", "largest", "highest", "max"]
        },
        {
          name: "MIN",
          syntax: "=MIN(number1, [number2], ...)",
          description: "Finds the smallest value",
          example: "=MIN(D1:D30)",
          exampleResult: "Minimum value from range",
          usage: "Lowest score, minimum temperature, smallest expenses",
          tips: "Useful for risk analysis and minimum thresholds",
          keywords: ["minimum", "smallest", "lowest", "min"]
        },
        {
          name: "ROUND",
          syntax: "=ROUND(number, num_digits)",
          description: "Rounds a number to specified number of digits",
          example: "=ROUND(3.14159, 2)",
          exampleResult: "3.14",
          usage: "Round prices, percentages, calculation results",
          tips: "Use ROUNDUP to round up, ROUNDDOWN to round down",
          keywords: ["round", "precision", "digits", "prices"]
        }
      ]
    },
    lookup: {
      title: "🔍 Lookup Functions",
      formulas: [
        {
          name: "VLOOKUP",
          syntax: "=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
          description: "Searches for value in first column and returns value from another column",
          example: "=VLOOKUP(A2, $D$2:$F$100, 3, FALSE)",
          exampleResult: "Finds A2 in table D2:F100 and returns value from 3rd column",
          usage: "Find product price, employee salary, customer code",
          tips: "FALSE = exact match, TRUE = approximate match. Table must be sorted for TRUE",
          keywords: ["lookup", "table", "match", "database"]
        },
        {
          name: "HLOOKUP", 
          syntax: "=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])",
          description: "Searches for value in first row and returns value from another row",
          example: "=HLOOKUP(B1, $A$5:$Z$10, 3, FALSE)",
          exampleResult: "Horizontal lookup in table",
          usage: "Search data in horizontal tables, calendars",
          tips: "VLOOKUP equivalent for horizontally oriented tables",
          keywords: ["horizontal lookup", "rows", "calendar"]
        },
        {
          name: "INDEX",
          syntax: "=INDEX(array, row_num, [column_num])",
          description: "Returns value from array at specified coordinates",
          example: "=INDEX(A1:C10, 5, 2)",
          exampleResult: "Value from 5th row, 2nd column of range A1:C10",
          usage: "Flexible data lookup, combines with MATCH",
          tips: "More powerful than VLOOKUP, can search left of lookup column",
          keywords: ["index", "coordinates", "flexible lookup"]
        },
        {
          name: "MATCH",
          syntax: "=MATCH(lookup_value, lookup_array, [match_type])",
          description: "Finds position of element in array",
          example: "=MATCH(\"Apple\", A1:A20, 0)",
          exampleResult: "Position number where \"Apple\" is found",
          usage: "Determine element position, combines with INDEX",
          tips: "0 = exact match, 1 = largest ≤, -1 = smallest ≥",
          keywords: ["position", "number", "find", "match"]
        },
        {
          name: "XLOOKUP",
          syntax: "=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])",
          description: "Modern alternative to VLOOKUP with more capabilities",
          example: "=XLOOKUP(E2, A:A, B:B, \"Not found\")",
          exampleResult: "Searches E2 in column A, returns corresponding value from B",
          usage: "Universal lookup in any direction",
          tips: "Available in newer versions of Excel and Google Sheets",
          keywords: ["new lookup", "universal", "modern"]
        }
      ]
    },
    logical: {
      title: "🧮 Logical Functions",
      formulas: [
        {
          name: "IF",
          syntax: "=IF(logical_test, value_if_true, value_if_false)",
          description: "Tests condition and returns different values",
          example: "=IF(A1>100, \"High\", \"Low\")",
          exampleResult: "\"High\" if A1>100, otherwise \"Low\"",
          usage: "Data categorization, condition checking, bonus calculations",
          tips: "Can nest multiple IFs for complex conditions",
          keywords: ["condition", "if", "test", "logic"]
        },
        {
          name: "AND",
          syntax: "=AND(logical1, [logical2], ...)",
          description: "Returns TRUE if all conditions are met",
          example: "=AND(A1>0, A1<100)",
          exampleResult: "TRUE if A1 is between 0 and 100",
          usage: "Check multiple conditions simultaneously",
          tips: "Often used inside IF function",
          keywords: ["and", "all conditions", "multiple check"]
        },
        {
          name: "OR",
          syntax: "=OR(logical1, [logical2], ...)",
          description: "Returns TRUE if at least one condition is met",
          example: "=OR(A1=\"Yes\", A1=\"Y\")",
          exampleResult: "TRUE if A1 equals \"Yes\" or \"Y\"",
          usage: "Check alternative conditions",
          tips: "Useful for checking multiple variants",
          keywords: ["or", "at least one", "alternative"]
        },
        {
          name: "NOT",
          syntax: "=NOT(logical)",
          description: "Changes logical value to opposite",
          example: "=NOT(A1=\"\")",
          exampleResult: "TRUE if A1 is not empty",
          usage: "Logical value inversion",
          tips: "Often used for \"not equal\" checks",
          keywords: ["not", "opposite", "inversion"]
        },
        {
          name: "IFERROR",
          syntax: "=IFERROR(value, value_if_error)",
          description: "Catches errors and returns alternative value",
          example: "=IFERROR(A1/B1, 0)",
          exampleResult: "Division result or 0 if error (division by zero)",
          usage: "Error handling in formulas, avoid #DIV/0!",
          tips: "Makes spreadsheets more professional by hiding errors",
          keywords: ["error", "handling", "protection", "alternative"]
        },
        {
          name: "IFS",
          syntax: "=IFS(logical_test1, value1, [logical_test2, value2], ...)",
          description: "Tests multiple conditions without nested IFs",
          example: "=IFS(A1>=90, \"Excellent\", A1>=70, \"Good\", A1>=50, \"Satisfactory\")",
          exampleResult: "Grade based on score",
          usage: "Complex categorization with multiple conditions",
          tips: "Alternative to complex nested IFs",
          keywords: ["multiple conditions", "categories", "grades"]
        }
      ]
    },
    text: {
      title: "📝 Text Functions",
      formulas: [
        {
          name: "CONCATENATE",
          syntax: "=CONCATENATE(text1, [text2], ...)",
          description: "Joins multiple text strings",
          example: "=CONCATENATE(A1, \" \", B1)",
          exampleResult: "Joins first name and last name with space",
          usage: "Create full names, addresses, identifiers",
          tips: "In newer versions, you can use the & operator",
          keywords: ["join", "combine", "concatenate", "text"]
        },
        {
          name: "LEFT",
          syntax: "=LEFT(text, [num_chars])",
          description: "Extracts characters from beginning of string",
          example: "=LEFT(A1, 3)",
          exampleResult: "First 3 characters from cell A1",
          usage: "Extract code, prefix, first part of number",
          tips: "Returns 1 character by default",
          keywords: ["beginning", "left characters", "prefix", "code"]
        },
        {
          name: "RIGHT",
          syntax: "=RIGHT(text, [num_chars])",
          description: "Extracts characters from end of string",
          example: "=RIGHT(A1, 4)",
          exampleResult: "Last 4 characters from cell A1",
          usage: "Extract file extension, suffix, last part",
          tips: "Useful for working with files and numbers",
          keywords: ["end", "right characters", "suffix", "extension"]
        },
        {
          name: "MID",
          syntax: "=MID(text, start_num, num_chars)",
          description: "Extracts characters from middle of string",
          example: "=MID(A1, 3, 5)",
          exampleResult: "5 characters starting from 3rd position",
          usage: "Extract middle part of number, code",
          tips: "Position starts from 1, not 0",
          keywords: ["middle", "substring", "part", "characters"]
        },
        {
          name: "LEN",
          syntax: "=LEN(text)",
          description: "Returns number of characters in text",
          example: "=LEN(A1)",
          exampleResult: "Number of characters in A1",
          usage: "Check password length, text validation",
          tips: "Counts spaces and special characters",
          keywords: ["length", "character count", "size"]
        },
        {
          name: "TRIM",
          syntax: "=TRIM(text)",
          description: "Removes extra spaces from text",
          example: "=TRIM(A1)",
          exampleResult: "Text without extra spaces at beginning and end",
          usage: "Clean data, imported text",
          tips: "Leaves only single spaces between words",
          keywords: ["clean", "spaces", "formatting"]
        }
      ]
    },
    datetime: {
      title: "📅 Date and Time Functions",
      formulas: [
        {
          name: "TODAY",
          syntax: "=TODAY()",
          description: "Returns current date",
          example: "=TODAY()",
          exampleResult: "Current date (updates automatically)",
          usage: "Calculate age, deadlines, reporting",
          tips: "Updates automatically when file is opened",
          keywords: ["today", "current date", "date"]
        },
        {
          name: "NOW",
          syntax: "=NOW()",
          description: "Returns current date and time",
          example: "=NOW()",
          exampleResult: "Current date and time",
          usage: "Timestamps, logging, duration calculation",
          tips: "Updates when formulas are recalculated",
          keywords: ["now", "current time", "timestamp"]
        },
        {
          name: "DATE",
          syntax: "=DATE(year, month, day)",
          description: "Creates date from separate components",
          example: "=DATE(2024, 12, 25)",
          exampleResult: "12/25/2024",
          usage: "Create dates from separate fields",
          tips: "Useful when working with data where date is split into parts",
          keywords: ["create date", "components", "year month day"]
        },
        {
          name: "YEAR",
          syntax: "=YEAR(date)",
          description: "Extracts year from date",
          example: "=YEAR(A1)",
          exampleResult: "Year from date in cell A1",
          usage: "Yearly analysis, filter by periods",
          tips: "Useful for grouping data by years",
          keywords: ["year", "extract", "time analysis"]
        },
        {
          name: "MONTH",
          syntax: "=MONTH(date)",
          description: "Extracts month from date (1-12)",
          example: "=MONTH(A1)",
          exampleResult: "Month number from date in A1",
          usage: "Monthly reporting, seasonal analysis",
          tips: "Returns number from 1 to 12",
          keywords: ["month", "season", "periodicity"]
        },
        {
          name: "DAY",
          syntax: "=DAY(date)",
          description: "Extracts day from date (1-31)",
          example: "=DAY(A1)",
          exampleResult: "Day of month from date in A1",
          usage: "Daily analysis, calendar calculations",
          tips: "Useful for determining birthday, payment day",
          keywords: ["day", "calendar", "day of month"]
        }
      ]
    },
    financial: {
      title: "💰 Financial Functions",
      formulas: [
        {
          name: "PMT",
          syntax: "=PMT(rate, nper, pv, [fv], [type])",
          description: "Calculates regular payment for a loan",
          example: "=PMT(5%/12, 60, 100000)",
          exampleResult: "Monthly payment for $100,000 loan over 5 years at 5%",
          usage: "Calculate loan payments, mortgage",
          tips: "Rate should be divided by number of periods per year",
          keywords: ["payment", "loan", "mortgage", "annuity"]
        },
        {
          name: "PV",
          syntax: "=PV(rate, nper, pmt, [fv], [type])",
          description: "Calculates present value of investment",
          example: "=PV(10%/12, 60, 1000)",
          exampleResult: "Present value of annuity",
          usage: "Investment evaluation, cash flow discounting",
          tips: "Foundation function for financial analysis",
          keywords: ["present value", "discounting", "investment"]
        },
        {
          name: "FV",
          syntax: "=FV(rate, nper, pmt, [pv], [type])",
          description: "Calculates future value of investment",
          example: "=FV(8%/12, 120, 500)",
          exampleResult: "Future value of monthly $500 deposits",
          usage: "Retirement planning, savings programs",
          tips: "Shows what your contribution will be worth in the future",
          keywords: ["future value", "savings", "retirement"]
        },
        {
          name: "RATE",
          syntax: "=RATE(nper, pmt, pv, [fv], [type], [guess])",
          description: "Calculates interest rate per period",
          example: "=RATE(60, -2000, 100000)",
          exampleResult: "Interest rate for loan",
          usage: "Profitability analysis, loan comparison",
          tips: "Payments are entered as negative values",
          keywords: ["rate", "profitability", "analysis"]
        },
        {
          name: "NPV",
          syntax: "=NPV(rate, value1, [value2], ...)",
          description: "Calculates net present value",
          example: "=NPV(10%, B1:B10)",
          exampleResult: "Net present value of cash flows",
          usage: "Investment project evaluation, business planning",
          tips: "Positive NPV means profitable project",
          keywords: ["NPV", "investment project", "profitability"]
        },
        {
          name: "IRR",
          syntax: "=IRR(values, [guess])",
          description: "Calculates internal rate of return",
          example: "=IRR(A1:A10)",
          exampleResult: "Internal rate of return for project",
          usage: "Investment efficiency analysis",
          tips: "First cash flow is usually negative (investment)",
          keywords: ["IRR", "rate of return", "efficiency"]
        }
      ]
    },
    statistical: {
      title: "📊 Statistical Functions",
      formulas: [
        {
          name: "MEDIAN",
          syntax: "=MEDIAN(number1, [number2], ...)",
          description: "Finds median (middle value) of a set of numbers",
          example: "=MEDIAN(A1:A100)",
          exampleResult: "Median of values in range",
          usage: "Salary analysis, price analysis, grades without outlier influence",
          tips: "Median is less sensitive to extreme values than average",
          keywords: ["median", "middle value", "statistics"]
        },
        {
          name: "MODE",
          syntax: "=MODE(number1, [number2], ...)",
          description: "Finds most frequent value in dataset",
          example: "=MODE(B1:B50)",
          exampleResult: "Most common value",
          usage: "Analysis of most popular products, grades",
          tips: "In newer versions use MODE.SNGL",
          keywords: ["mode", "most frequent", "popular"]
        },
        {
          name: "STDEV",
          syntax: "=STDEV(number1, [number2], ...)",
          description: "Calculates standard deviation of sample",
          example: "=STDEV(C1:C200)",
          exampleResult: "Standard deviation of data",
          usage: "Variability assessment, risk, quality",
          tips: "Higher value = greater data spread",
          keywords: ["standard deviation", "variability", "risk"]
        },
        {
          name: "VAR",
          syntax: "=VAR(number1, [number2], ...)",
          description: "Calculates variance of sample",
          example: "=VAR(D1:D100)",
          exampleResult: "Variance of dataset",
          usage: "Statistical analysis, risk assessment",
          tips: "Variance = square of standard deviation",
          keywords: ["variance", "spread", "variation"]
        },
        {
          name: "PERCENTILE",
          syntax: "=PERCENTILE(array, k)",
          description: "Returns k-th percentile of values",
          example: "=PERCENTILE(A1:A1000, 0.95)",
          exampleResult: "95th percentile of values",
          usage: "Performance analysis, threshold setting",
          tips: "k must be between 0 and 1 (0.5 = median)",
          keywords: ["percentile", "ranking", "threshold"]
        },
        {
          name: "CORREL",
          syntax: "=CORREL(array1, array2)",
          description: "Calculates correlation coefficient between two datasets",
          example: "=CORREL(A1:A50, B1:B50)",
          exampleResult: "Correlation between two variables",
          usage: "Analyze relationship between indicators",
          tips: "Values from -1 to 1. Close to 0 = weak relationship",
          keywords: ["correlation", "relationship", "dependency"]
        }
      ]
    },
    utility: {
      title: "🔧 Utility Functions",
      formulas: [
        {
          name: "UNIQUE",
          syntax: "=UNIQUE(array, [by_col], [occurs_once])",
          description: "Returns unique values from array",
          example: "=UNIQUE(A1:A100)",
          exampleResult: "List of unique values without duplicates",
          usage: "Create lists without repetitions, data analysis",
          tips: "Available in newer versions of Excel and Google Sheets",
          keywords: ["unique", "duplicates", "list"]
        },
        {
          name: "FILTER",
          syntax: "=FILTER(array, include, [if_empty])",
          description: "Filters array by specified condition",
          example: "=FILTER(A1:C100, B1:B100>50)",
          exampleResult: "Rows where column B value is greater than 50",
          usage: "Dynamic data filtering, report creation",
          tips: "Result updates automatically when data changes",
          keywords: ["filter", "condition", "dynamic"]
        },
        {
          name: "SORT",
          syntax: "=SORT(array, [sort_index], [sort_order], [by_col])",
          description: "Sorts array of data",
          example: "=SORT(A1:C50, 2, -1)",
          exampleResult: "Data sorted by 2nd column descending",
          usage: "Automatic table sorting, rankings",
          tips: "1 = ascending, -1 = descending",
          keywords: ["sort", "ordering", "ranking"]
        },
        {
          name: "TRANSPOSE",
          syntax: "=TRANSPOSE(array)",
          description: "Transposes array (rows become columns)",
          example: "=TRANSPOSE(A1:E1)",
          exampleResult: "Horizontal row becomes vertical column",
          usage: "Change table orientation, data analysis",
          tips: "Useful for changing data structure",
          keywords: ["transpose", "orientation", "rotate"]
        },
        {
          name: "RANDARRAY",
          syntax: "=RANDARRAY([rows], [columns], [min], [max], [whole_number])",
          description: "Generates array of random numbers",
          example: "=RANDARRAY(10, 3, 1, 100, TRUE)",
          exampleResult: "10x3 array with random integers from 1 to 100",
          usage: "Test data, simulation, games",
          tips: "TRUE = whole numbers, FALSE = decimals",
          keywords: ["random numbers", "generator", "test data"]
        },
        {
          name: "SEQUENCE",
          syntax: "=SEQUENCE(rows, [columns], [start], [step])",
          description: "Generates sequence of numbers",
          example: "=SEQUENCE(5, 1, 10, 2)",
          exampleResult: "Sequence: 10, 12, 14, 16, 18",
          usage: "Create numbering, calendars, scales",
          tips: "Quick way to create number sequence",
          keywords: ["sequence", "numbering", "progression"]
        }
      ]
    }
  };
  
  // Calculate total formulas
  let totalFormulas = 0;
  Object.values(formulaData).forEach(category => {
    totalFormulas += category.formulas.length;
  });
  totalFormulasSpan.textContent = totalFormulas;
  
  // Copy function
  function copyFormula(formula) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(formula).then(() => {
        showCopySuccess();
      }).catch(() => {
        fallbackCopy(formula);
      });
    } else {
      fallbackCopy(formula);
    }
  }
  
  function fallbackCopy(formula) {
    const textArea = document.createElement('textarea');
    textArea.value = formula;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopySuccess();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    
    document.body.removeChild(textArea);
  }
  
  function showCopySuccess() {
    copiedCount++;
    copiedFormulasSpan.textContent = copiedCount;
    
    // Show temporary success message
    const notification = document.createElement('div');
    notification.textContent = '✅ Formula copied!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 1000;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  // Render formulas
  function renderFormulas(filterText = '', categoryFilter = '') {
    formulaCollection.innerHTML = '';
    let totalFiltered = 0;
    
    Object.entries(formulaData).forEach(([categoryKey, category]) => {
      if (categoryFilter && categoryFilter !== categoryKey) return;
      
      const filteredFormulas = category.formulas.filter(formula => {
        if (!filterText) return true;
        const searchTerm = filterText.toLowerCase();
        return (
          formula.name.toLowerCase().includes(searchTerm) ||
          formula.description.toLowerCase().includes(searchTerm) ||
          formula.usage.toLowerCase().includes(searchTerm) ||
          formula.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
          formula.tips.toLowerCase().includes(searchTerm)
        );
      });
      
      if (filteredFormulas.length === 0) return;
      
      totalFiltered += filteredFormulas.length;
      
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'formula-category';
      categoryDiv.innerHTML = `
        <h3>${category.title}</h3>
        <div class="formula-grid">
          ${filteredFormulas.map(formula => `
            <div class="formula-card">
              <div class="formula-header">
                <h4 class="formula-name">${formula.name}</h4>
                <button class="copy-btn" onclick="copyFormula('${formula.syntax}')" title="Copy formula">
                  📋 Copy
                </button>
              </div>
              <div class="formula-syntax">
                <code>${formula.syntax}</code>
              </div>
              <div class="formula-description">
                ${formula.description}
              </div>
              <div class="formula-example">
                <strong>Example:</strong> <code>${formula.example}</code>
                <div class="example-result">${formula.exampleResult}</div>
              </div>
              <div class="formula-usage">
                <strong>Usage:</strong> ${formula.usage}
              </div>
              <div class="formula-tips">
                💡 <strong>Tip:</strong> ${formula.tips}
              </div>
              <div class="formula-keywords">
                <strong>Keywords:</strong> ${formula.keywords.join(', ')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      formulaCollection.appendChild(categoryDiv);
    });
    
    filteredFormulasSpan.textContent = totalFiltered;
    
    if (formulaCollection.innerHTML === '') {
      formulaCollection.innerHTML = '<div class="no-results">😔 No formulas found for your search. Try different keywords.</div>';
      filteredFormulasSpan.textContent = 0;
    }
  }
  
  // Make copyFormula globally available
  window.copyFormula = copyFormula;
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    renderFormulas(e.target.value, categoryFilter.value);
  });
  
  categoryFilter.addEventListener('change', (e) => {
    renderFormulas(searchInput.value, e.target.value);
  });
  
  // Initial render
  renderFormulas();
  
  // Add CSS for styling
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .formula-search {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: var(--radius);
      margin-bottom: 2rem;
      border: 1px solid var(--border);
    }
    
    .search-controls {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
      align-items: end;
    }
    
    @media (max-width: 768px) {
      .search-controls {
        grid-template-columns: 1fr;
      }
    }
    
    .search-input-group input,
    .category-filter select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border);
      border-radius: 6px;
      font-size: 1rem;
      margin-top: 0.5rem;
    }
    
    .search-input-group input:focus,
    .category-filter select:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    .formula-category {
      margin-bottom: 3rem;
    }
    
    .formula-category h3 {
      color: var(--accent);
      margin-bottom: 1.5rem;
      border-bottom: 3px solid var(--accent);
      padding-bottom: 0.5rem;
      font-size: 1.4rem;
    }
    
    .formula-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }
    
    @media (max-width: 768px) {
      .formula-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .formula-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .formula-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      border-color: var(--accent);
    }
    
    .formula-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .formula-name {
      color: var(--accent);
      font-size: 1.3rem;
      font-weight: 700;
      margin: 0;
    }
    
    .copy-btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .copy-btn:hover {
      background: var(--accent-hover, #1d4ed8);
      transform: scale(1.05);
    }
    
    .formula-syntax {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1rem;
      font-family: 'Courier New', monospace;
    }
    
    .formula-syntax code {
      color: #d63384;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    .formula-description {
      color: var(--main-color);
      margin-bottom: 1rem;
      font-size: 1rem;
      line-height: 1.5;
    }
    
    .formula-example {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0 6px 6px 0;
    }
    
    .formula-example code {
      background: #bbdefb;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    
    .example-result {
      margin-top: 0.5rem;
      font-style: italic;
      color: #1976d2;
    }
    
    .formula-usage {
      background: #f3e5f5;
      border-left: 4px solid #9c27b0;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0 6px 6px 0;
    }
    
    .formula-tips {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0 6px 6px 0;
    }
    
    .formula-keywords {
      padding: 0.75rem;
      background: #f5f5f5;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #666;
    }
    
    .formula-stats {
      margin-top: 3rem;
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 2rem;
      border: 1px solid var(--border);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      text-align: center;
    }
    
    .stat-card {
      padding: 1rem;
      background: linear-gradient(135deg, var(--accent), #3b82f6);
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    .no-results {
      text-align: center;
      color: #666;
      font-size: 1.2rem;
      margin: 3rem 0;
      padding: 2rem;
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }
  `;
  document.head.appendChild(style);
});