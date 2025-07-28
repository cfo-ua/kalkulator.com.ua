document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("text-input");
  const clearButton = document.getElementById("clear-text");
  
  // Result elements
  const lettersCount = document.getElementById("letters-count");
  const charsTotalCount = document.getElementById("chars-total");
  const charsNoSpacesCount = document.getElementById("chars-no-spaces");
  const wordsCount = document.getElementById("words-count");
  const sentencesCount = document.getElementById("sentences-count");
  const paragraphsCount = document.getElementById("paragraphs-count");
  const avgWordsPerSentence = document.getElementById("avg-words-sentence");
  const avgSentencesPerParagraph = document.getElementById("avg-sentences-paragraph");

  function analyzeText() {
    const text = textInput.value;
    
    if (!text.trim()) {
      // Reset all counts to 0 if text is empty
      lettersCount.textContent = "0";
      charsTotalCount.textContent = "0";
      charsNoSpacesCount.textContent = "0";
      wordsCount.textContent = "0";
      sentencesCount.textContent = "0";
      paragraphsCount.textContent = "0";
      avgWordsPerSentence.textContent = "0";
      avgSentencesPerParagraph.textContent = "0";
      return;
    }

    // Count letters only (alphabetic characters including Ukrainian Cyrillic)
    const letters = text.match(/[a-zA-ZА-Яа-яЁёІіЇїЄєʼ]/g) || [];
    const lettersTotal = letters.length;

    // Count total characters
    const charsTotal = text.length;

    // Count characters without spaces
    const charsNoSpaces = text.replace(/\s/g, '').length;

    // Count words (split by whitespace and filter out empty strings)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordsTotal = words.length;

    // Count sentences (split by . ! ? and filter out empty strings)
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentencesTotal = sentences.length;

    // Count paragraphs (split by line breaks and filter out empty strings)
    const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
    const paragraphsTotal = paragraphs.length;

    // Calculate averages
    const avgWords = sentencesTotal > 0 ? (wordsTotal / sentencesTotal).toFixed(1) : "0";
    const avgSentences = paragraphsTotal > 0 ? (sentencesTotal / paragraphsTotal).toFixed(1) : "0";

    // Update display with Ukrainian number formatting
    lettersCount.textContent = lettersTotal.toLocaleString('uk-UA');
    charsTotalCount.textContent = charsTotal.toLocaleString('uk-UA');
    charsNoSpacesCount.textContent = charsNoSpaces.toLocaleString('uk-UA');
    wordsCount.textContent = wordsTotal.toLocaleString('uk-UA');
    sentencesCount.textContent = sentencesTotal.toLocaleString('uk-UA');
    paragraphsCount.textContent = paragraphsTotal.toLocaleString('uk-UA');
    avgWordsPerSentence.textContent = avgWords.replace('.', ','); // Ukrainian decimal separator
    avgSentencesPerParagraph.textContent = avgSentences.replace('.', ','); // Ukrainian decimal separator
  }

  // Clear text function
  function clearText() {
    textInput.value = "";
    analyzeText();
    textInput.focus();
  }

  // Event listeners
  textInput.addEventListener("input", analyzeText);
  textInput.addEventListener("paste", function() {
    // Small delay to allow paste to complete
    setTimeout(analyzeText, 10);
  });
  clearButton.addEventListener("click", clearText);

  // Initial analysis (in case there's pre-filled text)
  analyzeText();
});