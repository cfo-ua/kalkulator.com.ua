document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("best-time-form");
  const resultDiv = document.getElementById("best-time-result");
  
  // Update range value displays
  const weatherSlider = document.getElementById("weather-priority");
  const crowdSlider = document.getElementById("crowd-priority");
  const priceSlider = document.getElementById("price-priority");
  
  weatherSlider.addEventListener("input", () => {
    document.getElementById("weather-value").textContent = weatherSlider.value;
  });
  
  crowdSlider.addEventListener("input", () => {
    document.getElementById("crowd-value").textContent = crowdSlider.value;
  });
  
  priceSlider.addEventListener("input", () => {
    document.getElementById("price-value").textContent = priceSlider.value;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculateBestTime();
  });

  const destinationSelect = document.getElementById("destination");
  destinationSelect.addEventListener("change", function() {
    if (this.value) {
      calculateBestTime();
    }
  });

  // Comprehensive destination data
  const destinationData = {
    japan: {
      name: "Японія",
      monthlyData: [
        { month: "Січень", weather: 2, crowds: 2, price: 3, temp: "5°C", rainfall: "Низькі", notes: "Холодно, сніг в горах, новорічні свята" },
        { month: "Лютий", weather: 2, crowds: 2, price: 3, temp: "6°C", rainfall: "Низькі", notes: "Холодно, сливи цвітуть, менше туристів" },
        { month: "Березень", weather: 3, crowds: 3, price: 4, temp: "10°C", rainfall: "Помірні", notes: "Весна починається, ціни зростають" },
        { month: "Квітень", weather: 5, crowds: 5, price: 5, temp: "15°C", rainfall: "Помірні", notes: "Сакура! Пік туристичного сезону" },
        { month: "Травень", weather: 5, crowds: 4, price: 4, temp: "20°C", rainfall: "Помірні", notes: "Чудова погода, зелень, Golden Week" },
        { month: "Червень", weather: 3, crowds: 3, price: 3, temp: "23°C", rainfall: "Високі", notes: "Сезон дощів починається, волого" },
        { month: "Липень", weather: 2, crowds: 4, price: 4, temp: "27°C", rainfall: "Високі", notes: "Спекотно, волого, літні канікули" },
        { month: "Серпень", weather: 2, crowds: 4, price: 4, temp: "28°C", rainfall: "Високі", notes: "Найспекотніший, фестивалі, дорого" },
        { month: "Вересень", weather: 3, crowds: 3, price: 3, temp: "24°C", rainfall: "Помірні", notes: "Осінь, тайфуни можливі" },
        { month: "Жовтень", weather: 5, crowds: 4, price: 4, temp: "18°C", rainfall: "Низькі", notes: "Осіннє листя, ідеальна погода" },
        { month: "Листопад", weather: 4, crowds: 3, price: 3, temp: "13°C", rainfall: "Низькі", notes: "Гарна погода, осінні кольори" },
        { month: "Грудень", weather: 3, crowds: 2, price: 3, temp: "8°C", rainfall: "Низькі", notes: "Холодає, зимові ілюмінації" }
      ],
      bestMonths: ["Квітень", "Травень", "Жовтень", "Листопад"],
      worstMonths: ["Липень", "Серпень"],
      highlights: ["🌸 Цвітіння сакури (квітень)", "🍁 Осіннє листя (жовтень-листопад)", "⛩️ Храми та культура", "🗻 Гора Фудзі"],
      tips: ["Бронюйте заздалегідь на сезон сакури", "Уникайте Golden Week (початок травня)", "JR Pass вигідний для міжміських поїздок"]
    },
    hawaii: {
      name: "Гаваї",
      monthlyData: [
        { month: "Січень", weather: 4, crowds: 5, price: 5, temp: "24°C", rainfall: "Помірні", notes: "Високий сезон, дорого, дощі" },
        { month: "Лютий", weather: 4, crowds: 5, price: 5, temp: "24°C", rainfall: "Помірні", notes: "Високий сезон, пік цін" },
        { month: "Березень", weather: 4, crowds: 4, price: 5, temp: "25°C", rainfall: "Помірні", notes: "Все ще високий сезон" },
        { month: "Квітень", weather: 5, crowds: 3, price: 3, temp: "26°C", rainfall: "Низькі", notes: "Чудова погода, менше натовпів" },
        { month: "Травень", weather: 5, crowds: 3, price: 3, temp: "27°C", rainfall: "Низькі", notes: "Ідеальний час, помірні ціни" },
        { month: "Червень", weather: 4, crowds: 4, price: 4, temp: "28°C", rainfall: "Низькі", notes: "Літо починається, спекотніше" },
        { month: "Липень", weather: 3, crowds: 5, price: 5, temp: "29°C", rainfall: "Низькі", notes: "Спекотно, літні канікули" },
        { month: "Серпень", weather: 3, crowds: 5, price: 5, temp: "30°C", rainfall: "Низькі", notes: "Найспекотніший, найдорожчий" },
        { month: "Вересень", weather: 4, crowds: 3, price: 3, temp: "29°C", rainfall: "Низькі", notes: "Тепло, менше туристів" },
        { month: "Жовтень", weather: 5, crowds: 3, price: 3, temp: "28°C", rainfall: "Низькі", notes: "Ідеальна погода, гарні ціни" },
        { month: "Листопад", weather: 4, crowds: 3, price: 3, temp: "26°C", rainfall: "Помірні", notes: "Приємно, менше натовпів" },
        { month: "Грудень", weather: 4, crowds: 4, price: 4, temp: "25°C", rainfall: "Помірні", notes: "Новорічні свята, ціни зростають" }
      ],
      bestMonths: ["Квітень", "Травень", "Вересень", "Жовтень"],
      worstMonths: ["Липень", "Серпень"],
      highlights: ["🏖️ Чудові пляжі", "🌋 Вулкани", "🐠 Дайвінг та снорклінг", "🏄 Серфінг"],
      tips: ["Уникайте літніх канікул для кращих цін", "Листопад-березень сезон дощів", "Кожен острів має свій мікроклімат"]
    },
    iceland: {
      name: "Ісландія",
      monthlyData: [
        { month: "Січень", weather: 2, crowds: 2, price: 3, temp: "-1°C", rainfall: "Помірні", notes: "Північне сяйво, короткі дні, холодно" },
        { month: "Лютий", weather: 2, crowds: 2, price: 3, temp: "0°C", rainfall: "Помірні", notes: "Північне сяйво, льодові печери" },
        { month: "Березень", weather: 2, crowds: 3, price: 3, temp: "2°C", rainfall: "Помірні", notes: "Північне сяйво можливе, дні довшають" },
        { month: "Квітень", weather: 3, crowds: 3, price: 3, temp: "5°C", rainfall: "Помірні", notes: "Весна, деякі дороги закриті" },
        { month: "Травень", weather: 4, crowds: 4, price: 4, temp: "9°C", rainfall: "Помірні", notes: "Люпини цвітуть, більше доступу" },
        { month: "Червень", weather: 5, crowds: 5, price: 5, temp: "12°C", rainfall: "Помірні", notes: "Білі ночі, все доступне" },
        { month: "Липень", weather: 5, crowds: 5, price: 5, temp: "14°C", rainfall: "Помірні", notes: "Найтепліше, пік туристичного сезону" },
        { month: "Серпень", weather: 5, crowds: 5, price: 5, temp: "13°C", rainfall: "Помірні", notes: "Все ще тепло, люпини, дорого" },
        { month: "Вересень", weather: 4, crowds: 3, price: 3, temp: "10°C", rainfall: "Помірні", notes: "Осінь, північне сяйво повертається" },
        { month: "Жовтень", weather: 3, crowds: 2, price: 3, temp: "6°C", rainfall: "Помірні", notes: "Північне сяйво, штормова погода" },
        { month: "Листопад", weather: 2, crowds: 2, price: 3, temp: "2°C", rainfall: "Високі", notes: "Штормові вітри, північне сяйво" },
        { month: "Грудень", weather: 2, crowds: 2, price: 3, temp: "0°C", rainfall: "Помірні", notes: "Найтемніше, північне сяйво пік" }
      ],
      bestMonths: ["Червень", "Липень", "Серпень", "Вересень"],
      worstMonths: ["Листопад", "Грудень", "Січень"],
      highlights: ["✨ Північне сяйво (вересень-березень)", "❄️ Льодові печери", "♨️ Гарячі джерела", "💎 Льодовикові лагуни"],
      tips: ["Літо для походів, зима для північного сяйва", "Завжди майте теплий одяг", "Оренда авто з 4WD рекомендована"]
    },
    "costa-rica": {
      name: "Коста Ріка",
      monthlyData: [
        { month: "Січень", weather: 5, crowds: 5, price: 5, temp: "27°C", rainfall: "Низькі", notes: "Сухий сезон, ідеальна погода, дорого" },
        { month: "Лютий", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Низькі", notes: "Найкращий час, пік туризму" },
        { month: "Березень", weather: 5, crowds: 4, price: 5, temp: "29°C", rainfall: "Низькі", notes: "Сухо, спекотно, менше натовпів" },
        { month: "Квітень", weather: 4, crowds: 4, price: 4, temp: "29°C", rainfall: "Низькі", notes: "Кінець сухого сезону, спекотно" },
        { month: "Травень", weather: 3, crowds: 2, price: 2, temp: "28°C", rainfall: "Помірні", notes: "Дощі починаються, зелений сезон" },
        { month: "Червень", weather: 3, crowds: 2, price: 2, temp: "27°C", rainfall: "Високі", notes: "Дощовий сезон, дешевше" },
        { month: "Липень", weather: 3, crowds: 2, price: 2, temp: "27°C", rainfall: "Високі", notes: "Дощі щодня, низькі ціни" },
        { month: "Серпень", weather: 3, crowds: 2, price: 2, temp: "27°C", rainfall: "Високі", notes: "Дощовий сезон продовжується" },
        { month: "Вересень", weather: 2, crowds: 1, price: 1, temp: "27°C", rainfall: "Дуже високі", notes: "Пік дощового сезону, найдешевше" },
        { month: "Жовтень", weather: 2, crowds: 1, price: 1, temp: "26°C", rainfall: "Дуже високі", notes: "Багато дощів, деякі дороги закриті" },
        { month: "Листопад", weather: 3, crowds: 2, price: 2, temp: "26°C", rainfall: "Помірні", notes: "Дощі зменшуються, зелено" },
        { month: "Грудень", weather: 4, crowds: 4, price: 4, temp: "26°C", rainfall: "Низькі", notes: "Сухий сезон починається" }
      ],
      bestMonths: ["Грудень", "Січень", "Лютий", "Березень"],
      worstMonths: ["Вересень", "Жовтень"],
      highlights: ["🦜 Біорізноманіття", "🌋 Вулкани", "🏖️ Пляжі двох океанів", "🦥 Дика природа"],
      tips: ["Сухий сезон дорогий але надійний", "Зелений сезон дешевший з ранковими дощами", "Завжди майте дощовик"]
    },
    thailand: {
      name: "Таїланд",
      monthlyData: [
        { month: "Січень", weather: 5, crowds: 5, price: 5, temp: "26°C", rainfall: "Низькі", notes: "Ідеальна погода, пік туризму" },
        { month: "Лютий", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Низькі", notes: "Найкращий час, дорого" },
        { month: "Березень", weather: 4, crowds: 4, price: 4, temp: "30°C", rainfall: "Низькі", notes: "Спекотно, менше дощів" },
        { month: "Квітень", weather: 3, crowds: 3, price: 3, temp: "32°C", rainfall: "Низькі", notes: "Дуже спекотно, Сонгкран" },
        { month: "Травень", weather: 3, crowds: 2, price: 2, temp: "31°C", rainfall: "Помірні", notes: "Спекотно, дощі починаються" },
        { month: "Червень", weather: 2, crowds: 2, price: 2, temp: "30°C", rainfall: "Високі", notes: "Дощовий сезон, волого" },
        { month: "Липень", weather: 2, crowds: 2, price: 2, temp: "29°C", rainfall: "Високі", notes: "Пік дощового сезону" },
        { month: "Серпень", weather: 2, crowds: 2, price: 2, temp: "29°C", rainfall: "Високі", notes: "Дощі, волого, дешево" },
        { month: "Вересень", weather: 2, crowds: 2, price: 2, temp: "29°C", rainfall: "Високі", notes: "Дощовий сезон продовжується" },
        { month: "Жовтень", weather: 3, crowds: 2, price: 3, temp: "29°C", rainfall: "Помірні", notes: "Дощі зменшуються" },
        { month: "Листопад", weather: 4, crowds: 3, price: 4, temp: "28°C", rainfall: "Низькі", notes: "Погода покращується" },
        { month: "Грудень", weather: 5, crowds: 4, price: 5, temp: "26°C", rainfall: "Низькі", notes: "Чудова погода, ціни зростають" }
      ],
      bestMonths: ["Листопад", "Грудень", "Січень", "Лютий"],
      worstMonths: ["Червень", "Липень", "Серпень"],
      highlights: ["🏖️ Тропічні пляжі", "🛕 Храми", "🍜 Вулична їжа", "🏝️ Острови"],
      tips: ["Північ сухіший за південь", "Дощовий сезон означає короткі зливи", "Цінуйте кондиціонер влітку"]
    },
    greece: {
      name: "Греція",
      monthlyData: [
        { month: "Січень", weather: 2, crowds: 1, price: 2, temp: "10°C", rainfall: "Високі", notes: "Холодно, дощі, багато закрито" },
        { month: "Лютий", weather: 2, crowds: 1, price: 2, temp: "11°C", rainfall: "Високі", notes: "Холодно, обмежений транспорт на острови" },
        { month: "Березень", weather: 3, crowds: 2, price: 2, temp: "14°C", rainfall: "Помірні", notes: "Весна починається" },
        { month: "Квітень", weather: 4, crowds: 3, price: 3, temp: "18°C", rainfall: "Помірні", notes: "Чудова погода, квіти цвітуть" },
        { month: "Травень", weather: 5, crowds: 4, price: 4, temp: "23°C", rainfall: "Низькі", notes: "Ідеально для огляду" },
        { month: "Червень", weather: 5, crowds: 4, price: 4, temp: "28°C", rainfall: "Низькі", notes: "Тепло, море прогрівається" },
        { month: "Липень", weather: 3, crowds: 5, price: 5, temp: "31°C", rainfall: "Низькі", notes: "Дуже спекотно, переповнено" },
        { month: "Серпень", weather: 3, crowds: 5, price: 5, temp: "31°C", rainfall: "Низькі", notes: "Найспекотніше, пік туризму" },
        { month: "Вересень", weather: 5, crowds: 4, price: 4, temp: "27°C", rainfall: "Низькі", notes: "Ідеальна погода, тепле море" },
        { month: "Жовтень", weather: 4, crowds: 3, price: 3, temp: "21°C", rainfall: "Помірні", notes: "Приємно, менше натовпів" },
        { month: "Листопад", weather: 3, crowds: 2, price: 2, temp: "16°C", rainfall: "Помірні", notes: "Прохолодно, деякі послуги закриваються" },
        { month: "Грудень", weather: 2, crowds: 1, price: 2, temp: "12°C", rainfall: "Високі", notes: "Холодно, дощі, низький сезон" }
      ],
      bestMonths: ["Травень", "Червень", "Вересень", "Жовтень"],
      worstMonths: ["Липень", "Серпень"],
      highlights: ["🏛️ Стародавні пам'ятки", "🏝️ Грецькі острови", "🫒 Середземноморська кухня", "🌊 Чисте море"],
      tips: ["Уникайте серпня для комфорту", "Острови кращі травень-жовтень", "Материкова Греція гарна навесні"]
    },
    alaska: {
      name: "Аляска",
      monthlyData: [
        { month: "Січень", weather: 1, crowds: 1, price: 2, temp: "-15°C", rainfall: "Низькі", notes: "Дуже холодно, полярна ніч" },
        { month: "Лютий", weather: 1, crowds: 1, price: 2, temp: "-12°C", rainfall: "Низькі", notes: "Холодно, північне сяйво" },
        { month: "Березень", weather: 2, crowds: 1, price: 2, temp: "-5°C", rainfall: "Низькі", notes: "Все ще холодно, дні довшають" },
        { month: "Квітень", weather: 2, crowds: 2, price: 3, temp: "2°C", rainfall: "Низькі", notes: "Весна, сніг тане" },
        { month: "Травень", weather: 3, crowds: 3, price: 4, temp: "10°C", rainfall: "Помірні", notes: "Туристичний сезон починається" },
        { month: "Червень", weather: 4, crowds: 4, price: 5, temp: "15°C", rainfall: "Помірні", notes: "Білі ночі, все доступне" },
        { month: "Липень", weather: 5, crowds: 5, price: 5, temp: "18°C", rainfall: "Помірні", notes: "Найтепліше, пік туризму" },
        { month: "Серпень", weather: 5, crowds: 5, price: 5, temp: "16°C", rainfall: "Помірні", notes: "Тепло, лосось, ягоди" },
        { month: "Вересень", weather: 4, crowds: 3, price: 4, temp: "11°C", rainfall: "Помірні", notes: "Осінні кольори, менше натовпів" },
        { month: "Жовтень", weather: 3, crowds: 2, price: 3, temp: "4°C", rainfall: "Помірні", notes: "Холодає, північне сяйво" },
        { month: "Листопад", weather: 2, crowds: 1, price: 2, temp: "-3°C", rainfall: "Низькі", notes: "Холодно, короткі дні" },
        { month: "Грудень", weather: 1, crowds: 1, price: 2, temp: "-10°C", rainfall: "Низькі", notes: "Дуже холодно, полярна ніч" }
      ],
      bestMonths: ["Червень", "Липень", "Серпень"],
      worstMonths: ["Грудень", "Січень", "Лютий"],
      highlights: ["🐻 Дика природа", "🐟 Риболовля лосося", "❄️ Льодовики", "✨ Північне сяйво"],
      tips: ["Короткий туристичний сезон травень-вересень", "Бронюйте заздалегідь на літо", "Завжди майте теплий одяг"]
    },
    italy: {
      name: "Італія",
      monthlyData: [
        { month: "Січень", weather: 2, crowds: 2, price: 2, temp: "8°C", rainfall: "Помірні", notes: "Холодно, дощі, музеї відкриті" },
        { month: "Лютий", weather: 2, crowds: 2, price: 2, temp: "10°C", rainfall: "Помірні", notes: "Все ще прохолодно, карнавал у Венеції" },
        { month: "Березень", weather: 3, crowds: 3, price: 3, temp: "14°C", rainfall: "Помірні", notes: "Весна, квіти цвітуть" },
        { month: "Квітень", weather: 4, crowds: 4, price: 4, temp: "18°C", rainfall: "Помірні", notes: "Чудова погода, Великдень" },
        { month: "Травень", weather: 5, crowds: 4, price: 4, temp: "22°C", rainfall: "Низькі", notes: "Ідеально для огляду міст" },
        { month: "Червень", weather: 5, crowds: 5, price: 5, temp: "26°C", rainfall: "Низькі", notes: "Тепло, пік туризму починається" },
        { month: "Липень", weather: 3, crowds: 5, price: 5, temp: "29°C", rainfall: "Низькі", notes: "Спекотно, переповнено, дорого" },
        { month: "Серпень", weather: 3, crowds: 5, price: 5, temp: "29°C", rainfall: "Низькі", notes: "Найспекотніше, августовські канікули" },
        { month: "Вересень", weather: 5, crowds: 4, price: 4, temp: "25°C", rainfall: "Низькі", notes: "Ідеальна погода, менше натовпів" },
        { month: "Жовтень", weather: 4, crowds: 3, price: 3, temp: "20°C", rainfall: "Помірні", notes: "Приємно, осінні кольори" },
        { month: "Листопад", weather: 3, crowds: 2, price: 2, temp: "14°C", rainfall: "Помірні", notes: "Прохолодно, дощі почастішають" },
        { month: "Грудень", weather: 2, crowds: 3, price: 3, temp: "9°C", rainfall: "Помірні", notes: "Холодно, різдвяні ринки" }
      ],
      bestMonths: ["Квітень", "Травень", "Червень", "Вересень"],
      worstMonths: ["Липень", "Серпень"],
      highlights: ["🏛️ Історичні пам'ятки", "🍕 Італійська кухня", "🎨 Мистецтво та музеї", "🌊 Узбережжя"],
      tips: ["Plечові сезони найкращі", "Південь тепліший за північ", "Багато музеїв закриті в понеділок"]
    },
    ireland: {
      name: "Ірландія",
      monthlyData: [
        { month: "Січень", weather: 2, crowds: 1, price: 2, temp: "7°C", rainfall: "Високі", notes: "Холодно, дощі, короткі дні" },
        { month: "Лютий", weather: 2, crowds: 1, price: 2, temp: "7°C", rainfall: "Високі", notes: "Все ще зима, вітряно" },
        { month: "Березень", weather: 3, crowds: 2, price: 3, temp: "9°C", rainfall: "Помірні", notes: "День Святого Патрика" },
        { month: "Квітень", weather: 3, crowds: 3, price: 3, temp: "11°C", rainfall: "Помірні", notes: "Весна, зелено" },
        { month: "Травень", weather: 4, crowds: 3, price: 3, temp: "14°C", rainfall: "Помірні", notes: "Приємно, квіти цвітуть" },
        { month: "Червень", weather: 4, crowds: 4, price: 4, temp: "17°C", rainfall: "Помірні", notes: "Тепло, довгі дні" },
        { month: "Липень", weather: 4, crowds: 5, price: 5, temp: "19°C", rainfall: "Помірні", notes: "Найтепліше, пік туризму" },
        { month: "Серпень", weather: 4, crowds: 5, price: 5, temp: "18°C", rainfall: "Помірні", notes: "Тепло, фестивалі" },
        { month: "Вересень", weather: 4, crowds: 3, price: 3, temp: "16°C", rainfall: "Помірні", notes: "Приємно, менше натовпів" },
        { month: "Жовтень", weather: 3, crowds: 2, price: 3, temp: "13°C", rainfall: "Помірні", notes: "Осінь, прохолодно" },
        { month: "Листопад", weather: 2, crowds: 1, price: 2, temp: "9°C", rainfall: "Високі", notes: "Дощі, вітер, холодно" },
        { month: "Грудень", weather: 2, crowds: 2, price: 2, temp: "7°C", rainfall: "Високі", notes: "Зима, короткі дні" }
      ],
      bestMonths: ["Травень", "Червень", "Липень", "Серпень", "Вересень"],
      worstMonths: ["Листопад", "Грудень", "Січень"],
      highlights: ["🍀 Зелені пейзажі", "🏰 Замки", "🎵 Традиційна музика", "🍺 Паби"],
      tips: ["Завжди майте дощовик", "Літо найсухіше", "Приводьте шари одягу"]
    },
    yellowstone: {
      name: "Національний парк Єллоустоун",
      monthlyData: [
        { month: "Січень", weather: 1, crowds: 1, price: 2, temp: "-10°C", rainfall: "Низькі", notes: "Сніг, більшість доріг закрито" },
        { month: "Лютий", weather: 1, crowds: 1, price: 2, temp: "-8°C", rainfall: "Низькі", notes: "Сніжні види спорту, зимові тури" },
        { month: "Березень", weather: 2, crowds: 1, price: 2, temp: "-2°C", rainfall: "Низькі", notes: "Все ще сніг, обмежений доступ" },
        { month: "Квітень", weather: 2, crowds: 2, price: 3, temp: "5°C", rainfall: "Помірні", notes: "Сніг тане, деякі дороги відкриваються" },
        { month: "Травень", weather: 3, crowds: 3, price: 4, temp: "12°C", rainfall: "Помірні", notes: "Весна, більше доріг відкрито" },
        { month: "Червень", weather: 4, crowds: 4, price: 5, temp: "18°C", rainfall: "Помірні", notes: "Всі дороги відкриті, квіти" },
        { month: "Липень", weather: 5, crowds: 5, price: 5, temp: "22°C", rainfall: "Низькі", notes: "Ідеальна погода, пік відвідування" },
        { month: "Серпень", weather: 5, crowds: 5, price: 5, temp: "21°C", rainfall: "Низькі", notes: "Тепло, переповнено" },
        { month: "Вересень", weather: 4, crowds: 3, price: 4, temp: "16°C", rainfall: "Низькі", notes: "Прохолодно, менше натовпів" },
        { month: "Жовтень", weather: 3, crowds: 2, price: 3, temp: "8°C", rainfall: "Низькі", notes: "Холодно, деякі дороги закриваються" },
        { month: "Листопад", weather: 2, crowds: 1, price: 2, temp: "0°C", rainfall: "Помірні", notes: "Сніг починається" },
        { month: "Грудень", weather: 1, crowds: 1, price: 2, temp: "-7°C", rainfall: "Низькі", notes: "Зима, більшість закрито" }
      ],
      bestMonths: ["Червень", "Липень", "Серпень", "Вересень"],
      worstMonths: ["Грудень", "Січень", "Лютий"],
      highlights: ["💧 Гейзери", "🐻 Дика природа", "🏔️ Гірські пейзажі", "♨️ Гарячі джерела"],
      tips: ["Бронюйте житло заздалегідь", "Рано вставайте для дикої природи", "Майте теплий одяг навіть влітку"]
    },
    switzerland: {
      name: "Швейцарія",
      monthlyData: [
        { month: "Січень", weather: 2, crowds: 3, price: 4, temp: "-2°C", rainfall: "Помірні", notes: "Лижний сезон, снігові Альпи" },
        { month: "Лютий", weather: 2, crowds: 3, price: 4, temp: "0°C", rainfall: "Помірні", notes: "Пік лижного сезону" },
        { month: "Березень", weather: 3, crowds: 3, price: 4, temp: "5°C", rainfall: "Помірні", notes: "Кінець лижного сезону" },
        { month: "Квітень", weather: 4, crowds: 3, price: 3, temp: "10°C", rainfall: "Помірні", notes: "Весна, квіти в долинах" },
        { month: "Травень", weather: 5, crowds: 4, price: 4, temp: "15°C", rainfall: "Помірні", notes: "Ідеально для походів" },
        { month: "Червень", weather: 5, crowds: 4, price: 5, temp: "19°C", rainfall: "Помірні", notes: "Літо, всі гори доступні" },
        { month: "Липень", weather: 5, crowds: 5, price: 5, temp: "22°C", rainfall: "Помірні", notes: "Пік літнього сезону" },
        { month: "Серпень", weather: 5, crowds: 5, price: 5, temp: "21°C", rainfall: "Помірні", notes: "Тепло, переповнено" },
        { month: "Вересень", weather: 4, crowds: 3, price: 4, temp: "17°C", rainfall: "Помірні", notes: "Осінь, менше натовпів" },
        { month: "Жовтень", weather: 3, crowds: 2, price: 3, temp: "11°C", rainfall: "Помірні", notes: "Прохолодно, осінні кольори" },
        { month: "Листопад", weather: 2, crowds: 2, price: 3, temp: "5°C", rainfall: "Високі", notes: "Дощі, холодно" },
        { month: "Грудень", weather: 2, crowds: 3, price: 4, temp: "0°C", rainfall: "Помірні", notes: "Різдвяні ринки, сніг" }
      ],
      bestMonths: ["Травень", "Червень", "Липень", "Серпень"],
      worstMonths: ["Листопад", "Грудень"],
      highlights: ["🏔️ Альпи", "🚂 Scenic поїзди", "🧀 Швейцарський сир", "⌚ Годинники"],
      tips: ["Дорога країна", "Швейцарський пропуск вигідний", "Бронюйте гірські готелі заздалегідь"]
    },
    bali: {
      name: "Балі",
      monthlyData: [
        { month: "Січень", weather: 3, crowds: 5, price: 5, temp: "28°C", rainfall: "Дуже високі", notes: "Сезон дощів, високі ціни" },
        { month: "Лютий", weather: 3, crowds: 5, price: 5, temp: "28°C", rainfall: "Дуже високі", notes: "Дощі продовжуються" },
        { month: "Березень", weather: 4, crowds: 4, price: 4, temp: "29°C", rainfall: "Високі", notes: "Дощі зменшуються" },
        { month: "Квітень", weather: 5, crowds: 3, price: 3, temp: "30°C", rainfall: "Помірні", notes: "Гарна погода, менше натовпів" },
        { month: "Травень", weather: 5, crowds: 3, price: 3, temp: "30°C", rainfall: "Низькі", notes: "Сухий сезон починається" },
        { month: "Червень", weather: 5, crowds: 4, price: 4, temp: "29°C", rainfall: "Низькі", notes: "Ідеальна погода" },
        { month: "Липень", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Низькі", notes: "Пік туризму, дорого" },
        { month: "Серпень", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Низькі", notes: "Найпопулярніший час" },
        { month: "Вересень", weather: 5, crowds: 4, price: 4, temp: "29°C", rainfall: "Низькі", notes: "Відмінна погода" },
        { month: "Жовтень", weather: 4, crowds: 3, price: 3, temp: "30°C", rainfall: "Помірні", notes: "Гарно, менше туристів" },
        { month: "Листопад", weather: 3, crowds: 3, price: 3, temp: "30°C", rainfall: "Високі", notes: "Дощі починаються" },
        { month: "Грудень", weather: 3, crowds: 4, price: 4, temp: "29°C", rainfall: "Високі", notes: "Різдвяні канікули" }
      ],
      bestMonths: ["Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень"],
      worstMonths: ["Січень", "Лютий"],
      highlights: ["🏖️ Тропічні пляжі", "🛕 Храми", "🌾 Рисові тераси", "🐒 Мавпячий ліс"],
      tips: ["Уникайте сезону дощів", "Південь дощовіший за північ", "Оренда скутера популярна"]
    },
    portugal: {
      name: "Португалія",
      monthlyData: [
        { month: "Січень", weather: 2, crowds: 2, price: 2, temp: "12°C", rainfall: "Високі", notes: "Прохолодно, дощі" },
        { month: "Лютий", weather: 3, crowds: 2, price: 2, temp: "13°C", rainfall: "Помірні", notes: "Все ще прохолодно" },
        { month: "Березень", weather: 3, crowds: 3, price: 3, temp: "16°C", rainfall: "Помірні", notes: "Весна починається" },
        { month: "Квітень", weather: 4, crowds: 3, price: 3, temp: "18°C", rainfall: "Помірні", notes: "Приємна погода" },
        { month: "Травень", weather: 5, crowds: 4, price: 4, temp: "22°C", rainfall: "Низькі", notes: "Чудова погода" },
        { month: "Червень", weather: 5, crowds: 4, price: 4, temp: "25°C", rainfall: "Низькі", notes: "Тепло, сонячно" },
        { month: "Липень", weather: 4, crowds: 5, price: 5, temp: "28°C", rainfall: "Низькі", notes: "Спекотно, переповнено" },
        { month: "Серпень", weather: 4, crowds: 5, price: 5, temp: "28°C", rainfall: "Низькі", notes: "Найспекотніше" },
        { month: "Вересень", weather: 5, crowds: 4, price: 4, temp: "26°C", rainfall: "Низькі", notes: "Ідеальна погода" },
        { month: "Жовтень", weather: 4, crowds: 3, price: 3, temp: "21°C", rainfall: "Помірні", notes: "Тепло, менше натовпів" },
        { month: "Листопад", weather: 3, crowds: 2, price: 2, temp: "16°C", rainfall: "Помірні", notes: "Прохолодніше" },
        { month: "Грудень", weather: 2, crowds: 2, price: 2, temp: "13°C", rainfall: "Високі", notes: "Зима, дощі" }
      ],
      bestMonths: ["Травень", "Червень", "Вересень", "Жовтень"],
      worstMonths: ["Грудень", "Січень"],
      highlights: ["🏖️ Алгарве пляжі", "🍷 Портвейн", "🏰 Історичні міста", "🌊 Атлантичне узбережжя"],
      tips: ["Плечові сезони найкращі", "Південь тепліший за північ", "Серфінг популярний цілий рік"]
    },
    "puerto-rico": {
      name: "Пуерто Ріко",
      monthlyData: [
        { month: "Січень", weather: 4, crowds: 4, price: 4, temp: "26°C", rainfall: "Помірні", notes: "Сухий сезон, приємно" },
        { month: "Лютий", weather: 4, crowds: 4, price: 4, temp: "26°C", rainfall: "Помірні", notes: "Гарна погода" },
        { month: "Березень", weather: 5, crowds: 4, price: 4, temp: "27°C", rainfall: "Низькі", notes: "Чудово для пляжу" },
        { month: "Квітень", weather: 5, crowds: 3, price: 3, temp: "28°C", rainfall: "Низькі", notes: "Ідеальна погода" },
        { month: "Травень", weather: 4, crowds: 3, price: 3, temp: "29°C", rainfall: "Помірні", notes: "Спекотніше, більше дощів" },
        { month: "Червень", weather: 3, crowds: 3, price: 3, temp: "30°C", rainfall: "Високі", notes: "Дощовий сезон, спекотно" },
        { month: "Липень", weather: 3, crowds: 4, price: 4, temp: "30°C", rainfall: "Високі", notes: "Спекотно, вологість" },
        { month: "Серпень", weather: 3, crowds: 4, price: 4, temp: "30°C", rainfall: "Високі", notes: "Пік сезону ураганів" },
        { month: "Вересень", weather: 2, crowds: 2, price: 2, temp: "30°C", rainfall: "Високі", notes: "Сезон ураганів" },
        { month: "Жовтень", weather: 3, crowds: 2, price: 3, temp: "29°C", rainfall: "Помірні", notes: "Дощі зменшуються" },
        { month: "Листопад", weather: 4, crowds: 3, price: 3, temp: "28°C", rainfall: "Помірні", notes: "Погода покращується" },
        { month: "Грудень", weather: 4, crowds: 4, price: 4, temp: "27°C", rainfall: "Помірні", notes: "Сухий сезон починається" }
      ],
      bestMonths: ["Січень", "Лютий", "Березень", "Квітень"],
      worstMonths: ["Серпень", "Вересень"],
      highlights: ["🏖️ Карибські пляжі", "🌺 Тропічна природа", "🏛️ Старе Сан-Хуан", "🎵 Сальса музика"],
      tips: ["Уникайте сезону ураганів", "Не потрібна віза для американців", "Дощі зазвичай короткі"]
    },
    vietnam: {
      name: "В'єтнам",
      monthlyData: [
        { month: "Січень", weather: 4, crowds: 4, price: 4, temp: "22°C", rainfall: "Низькі", notes: "Прохолодно, сухо на півночі" },
        { month: "Лютий", weather: 4, crowds: 4, price: 4, temp: "24°C", rainfall: "Низькі", notes: "Гарна погода всюди" },
        { month: "Березень", weather: 5, crowds: 4, price: 4, temp: "27°C", rainfall: "Низькі", notes: "Ідеальна погода" },
        { month: "Квітень", weather: 5, crowds: 3, price: 3, temp: "30°C", rainfall: "Низькі", notes: "Тепло, сухо" },
        { month: "Травень", weather: 4, crowds: 3, price: 3, temp: "32°C", rainfall: "Помірні", notes: "Спекотно, дощі починаються" },
        { month: "Червень", weather: 3, crowds: 2, price: 2, temp: "33°C", rainfall: "Високі", notes: "Дощовий сезон, спекотно" },
        { month: "Липень", weather: 2, crowds: 2, price: 2, temp: "33°C", rainfall: "Дуже високі", notes: "Пік дощового сезону" },
        { month: "Серпень", weather: 2, crowds: 2, price: 2, temp: "32°C", rainfall: "Дуже високі", notes: "Дощі, тайфуни можливі" },
        { month: "Вересень", weather: 3, crowds: 2, price: 2, temp: "31°C", rainfall: "Високі", notes: "Дощі зменшуються" },
        { month: "Жовтень", weather: 4, crowds: 3, price: 3, temp: "29°C", rainfall: "Помірні", notes: "Погода покращується" },
        { month: "Листопад", weather: 5, crowds: 3, price: 3, temp: "26°C", rainfall: "Низькі", notes: "Чудова погода" },
        { month: "Грудень", weather: 4, crowds: 4, price: 4, temp: "23°C", rainfall: "Низькі", notes: "Прохолодно, сухо" }
      ],
      bestMonths: ["Лютий", "Березень", "Квітень", "Листопад"],
      worstMonths: ["Липень", "Серпень"],
      highlights: ["🏞️ Бухта Халонг", "🍜 Фо та вулична їжа", "🏛️ Стародавні храми", "🌾 Рисові тераси"],
      tips: ["Північ та південь мають різні сезони", "Центр найдощовіший", "Мотобайк популярний транспорт"]
    },
    "new-zealand": {
      name: "Нова Зеландія",
      monthlyData: [
        { month: "Січень", weather: 5, crowds: 5, price: 5, temp: "22°C", rainfall: "Помірні", notes: "Літо, пік туризму" },
        { month: "Лютий", weather: 5, crowds: 5, price: 5, temp: "22°C", rainfall: "Помірні", notes: "Найтепліше, дорого" },
        { month: "Березень", weather: 4, crowds: 4, price: 4, temp: "20°C", rainfall: "Помірні", notes: "Осінь, гарна погода" },
        { month: "Квітень", weather: 3, crowds: 3, price: 3, temp: "17°C", rainfall: "Помірні", notes: "Прохолодніше, менше натовпів" },
        { month: "Травень", weather: 2, crowds: 2, price: 2, temp: "13°C", rainfall: "Високі", notes: "Зима наближається" },
        { month: "Червень", weather: 2, crowds: 2, price: 2, temp: "10°C", rainfall: "Високі", notes: "Зима, дощі" },
        { month: "Липень", weather: 2, crowds: 2, price: 2, temp: "9°C", rainfall: "Високі", notes: "Найхолодніше" },
        { month: "Серпень", weather: 2, crowds: 2, price: 2, temp: "10°C", rainfall: "Високі", notes: "Все ще зима" },
        { month: "Вересень", weather: 3, crowds: 2, price: 3, temp: "13°C", rainfall: "Помірні", notes: "Весна починається" },
        { month: "Жовтень", weather: 4, crowds: 3, price: 3, temp: "16°C", rainfall: "Помірні", notes: "Весна, квіти цвітуть" },
        { month: "Листопад", weather: 4, crowds: 3, price: 4, temp: "18°C", rainfall: "Помірні", notes: "Приємна погода" },
        { month: "Грудень", weather: 5, crowds: 4, price: 5, temp: "20°C", rainfall: "Помірні", notes: "Літо починається" }
      ],
      bestMonths: ["Грудень", "Січень", "Лютий", "Березень"],
      worstMonths: ["Червень", "Липень", "Серпень"],
      highlights: ["🏔️ Альпи", "🐑 Ферми", "🎬 Локації LOTR", "🌊 Фіорди"],
      tips: ["Пам'ятайте про південну півкулю", "Погода мінлива", "Бронюйте заздалегідь на літо"]
    },
    "glacier-np": {
      name: "Національний парк Глейшер",
      monthlyData: [
        { month: "Січень", weather: 1, crowds: 1, price: 2, temp: "-8°C", rainfall: "Низькі", notes: "Сніг, більшість закрито" },
        { month: "Лютий", weather: 1, crowds: 1, price: 2, temp: "-5°C", rainfall: "Низькі", notes: "Дуже холодно" },
        { month: "Березень", weather: 1, crowds: 1, price: 2, temp: "0°C", rainfall: "Низькі", notes: "Все ще сніг" },
        { month: "Квітень", weather: 2, crowds: 1, price: 2, temp: "5°C", rainfall: "Помірні", notes: "Сніг тане" },
        { month: "Травень", weather: 3, crowds: 2, price: 3, temp: "12°C", rainfall: "Помірні", notes: "Деякі дороги відкриваються" },
        { month: "Червень", weather: 4, crowds: 3, price: 4, temp: "17°C", rainfall: "Помірні", notes: "Більше доступу" },
        { month: "Липень", weather: 5, crowds: 5, price: 5, temp: "20°C", rainfall: "Низькі", notes: "Пік сезону, все відкрито" },
        { month: "Серпень", weather: 5, crowds: 5, price: 5, temp: "19°C", rainfall: "Низькі", notes: "Найкращий час" },
        { month: "Вересень", weather: 4, crowds: 3, price: 4, temp: "14°C", rainfall: "Низькі", notes: "Осінь, менше натовпів" },
        { month: "Жовтень", weather: 3, crowds: 2, price: 3, temp: "8°C", rainfall: "Помірні", notes: "Холодає, деякі дороги закриваються" },
        { month: "Листопад", weather: 2, crowds: 1, price: 2, temp: "2°C", rainfall: "Помірні", notes: "Сніг починається" },
        { month: "Грудень", weather: 1, crowds: 1, price: 2, temp: "-5°C", rainfall: "Низькі", notes: "Зима, більшість закрито" }
      ],
      bestMonths: ["Липень", "Серпень", "Вересень"],
      worstMonths: ["Грудень", "Січень", "Лютий"],
      highlights: ["🏔️ Льодовики", "🐻 Ведмеді грізлі", "🥾 Походи", "📸 Фотографія"],
      tips: ["Дуже короткий сезон", "Going-to-the-Sun Road ключова", "Майте теплий одяг"]
    },
    australia: {
      name: "Австралія",
      monthlyData: [
        { month: "Січень", weather: 3, crowds: 5, price: 5, temp: "26°C", rainfall: "Помірні", notes: "Літо, спекотно, дорого" },
        { month: "Лютий", weather: 3, crowds: 4, price: 5, temp: "26°C", rainfall: "Помірні", notes: "Все ще спекотно" },
        { month: "Березень", weather: 4, crowds: 4, price: 4, temp: "24°C", rainfall: "Помірні", notes: "Осінь, гарна погода" },
        { month: "Квітень", weather: 5, crowds: 3, price: 3, temp: "21°C", rainfall: "Низькі", notes: "Ідеальна погода" },
        { month: "Травень", weather: 4, crowds: 3, price: 3, temp: "17°C", rainfall: "Низькі", notes: "Прохолодніше, приємно" },
        { month: "Червень", weather: 3, crowds: 2, price: 2, temp: "14°C", rainfall: "Помірні", notes: "Зима, прохолодно" },
        { month: "Липень", weather: 3, crowds: 2, price: 2, temp: "13°C", rainfall: "Помірні", notes: "Найхолодніше" },
        { month: "Серпень", weather: 3, crowds: 2, price: 2, temp: "15°C", rainfall: "Помірні", notes: "Все ще зима" },
        { month: "Вересень", weather: 4, crowds: 3, price: 3, temp: "18°C", rainfall: "Низькі", notes: "Весна, квіти цвітуть" },
        { month: "Жовтень", weather: 5, crowds: 3, price: 3, temp: "21°C", rainfall: "Низькі", notes: "Чудова погода" },
        { month: "Листопад", weather: 4, crowds: 4, price: 4, temp: "23°C", rainfall: "Помірні", notes: "Тепліше, більше туристів" },
        { month: "Грудень", weather: 3, crowds: 5, price: 5, temp: "25°C", rainfall: "Помірні", notes: "Літо починається, дорого" }
      ],
      bestMonths: ["Квітень", "Травень", "Вересень", "Жовтень"],
      worstMonths: ["Січень", "Грудень"],
      highlights: ["🏖️ Пляжі", "🦘 Унікальна фауна", "🏛️ Сідней та Мельбурн", "🌊 Великий бар'єрний риф"],
      tips: ["Різні кліматичні зони", "Південь протилежний північ", "Бронюйте заздалегідь на канікули"]
    },
    "new-orleans": {
      name: "Новий Орлеан",
      monthlyData: [
        { month: "Січень", weather: 3, crowds: 3, price: 3, temp: "15°C", rainfall: "Помірні", notes: "Прохолодно, вологість менша" },
        { month: "Лютий", weather: 4, crowds: 5, price: 5, temp: "17°C", rainfall: "Помірні", notes: "Марді Гра, переповнено" },
        { month: "Березень", weather: 4, crowds: 4, price: 4, temp: "21°C", rainfall: "Помірні", notes: "Приємна погода, фестивалі" },
        { month: "Квітень", weather: 5, crowds: 4, price: 4, temp: "25°C", rainfall: "Помірні", notes: "Ідеальна погода, Jazz Fest" },
        { month: "Травень", weather: 4, crowds: 3, price: 3, temp: "28°C", rainfall: "Помірні", notes: "Тепло, вологість зростає" },
        { month: "Червень", weather: 2, crowds: 2, price: 2, temp: "31°C", rainfall: "Високі", notes: "Спекотно, волого, дощі" },
        { month: "Липень", weather: 2, crowds: 2, price: 2, temp: "32°C", rainfall: "Високі", notes: "Найспекотніше, задушливо" },
        { month: "Серпень", weather: 2, crowds: 2, price: 2, temp: "32°C", rainfall: "Високі", notes: "Дуже спекотно, тропічні зливи" },
        { month: "Вересень", weather: 2, crowds: 2, price: 2, temp: "30°C", rainfall: "Високі", notes: "Все ще спекотно, урагани" },
        { month: "Жовтень", weather: 4, crowds: 3, price: 3, temp: "26°C", rainfall: "Помірні", notes: "Гарна погода повертається" },
        { month: "Листопад", weather: 4, crowds: 3, price: 3, temp: "21°C", rainfall: "Низькі", notes: "Приємно, менше вологості" },
        { month: "Грудень", weather: 3, crowds: 4, price: 4, temp: "17°C", rainfall: "Помірні", notes: "Різдвяні свята, прохолодно" }
      ],
      bestMonths: ["Жовтень", "Листопад", "Грудень", "Січень", "Березень", "Квітень"],
      worstMonths: ["Червень", "Липень", "Серпень"],
      highlights: ["🎷 Джаз", "🍤 Креольська кухня", "🎭 Марді Гра", "🏛️ Французький квартал"],
      tips: ["Уникайте літа через спеку", "Фестивалі цілий рік", "Кондиціонер необхідний влітку"]
    },
    cancun: {
      name: "Канкун",
      monthlyData: [
        { month: "Січень", weather: 4, crowds: 5, price: 5, temp: "24°C", rainfall: "Низькі", notes: "Сухий сезон, високі ціни" },
        { month: "Лютий", weather: 4, crowds: 5, price: 5, temp: "25°C", rainfall: "Низькі", notes: "Пік туризму" },
        { month: "Березень", weather: 5, crowds: 5, price: 5, temp: "27°C", rainfall: "Низькі", notes: "Spring break, переповнено" },
        { month: "Квітень", weather: 5, crowds: 5, price: 5, temp: "28°C", rainfall: "Низькі", notes: "Ідеальна погода, дорого" },
        { month: "Травень", weather: 4, crowds: 3, price: 3, temp: "30°C", rainfall: "Помірні", notes: "Спекотніше, дощі починаються" },
        { month: "Червень", weather: 3, crowds: 3, price: 3, temp: "31°C", rainfall: "Високі", notes: "Дощовий сезон, спекотно" },
        { month: "Липень", weather: 3, crowds: 4, price: 4, temp: "32°C", rainfall: "Високі", notes: "Спекотно, літні канікули" },
        { month: "Серпень", weather: 3, crowds: 4, price: 4, temp: "32°C", rainfall: "Високі", notes: "Дуже спекотно, волого" },
        { month: "Вересень", weather: 2, crowds: 2, price: 2, temp: "31°C", rainfall: "Дуже високі", notes: "Пік сезону ураганів" },
        { month: "Жовтень", weather: 3, crowds: 2, price: 3, temp: "29°C", rainfall: "Високі", notes: "Дощі зменшуються" },
        { month: "Листопад", weather: 4, crowds: 3, price: 3, temp: "27°C", rainfall: "Помірні", notes: "Погода покращується" },
        { month: "Грудень", weather: 4, crowds: 4, price: 4, temp: "25°C", rainfall: "Низькі", notes: "Сухий сезон починається" }
      ],
      bestMonths: ["Листопад", "Грудень", "Січень", "Лютий"],
      worstMonths: ["Серпень", "Вересень"],
      highlights: ["🏖️ Карибські пляжі", "🏛️ Майянські руїни", "🌊 Сенотки", "🐠 Дайвінг"],
      tips: ["Уникайте сезону ураганів", "Сухий сезон дорогий", "All-inclusive популярний"]
    }
  };

  // Calculate best time based on priorities and destination
  function calculateBestTime() {
    const destination = document.getElementById("destination").value;
    const weatherPriority = parseInt(document.getElementById("weather-priority").value);
    const crowdPriority = parseInt(document.getElementById("crowd-priority").value);
    const pricePriority = parseInt(document.getElementById("price-priority").value);
    const tripType = document.getElementById("trip-type").value;

    if (!destination) {
      resultDiv.innerHTML = '<p style="color: red;">Будь ласка, оберіть напрямок.</p>';
      return;
    }

    const destData = destinationData[destination];
    if (!destData) {
      resultDiv.innerHTML = '<p style="color: red;">Дані для цього напрямку недоступні.</p>';
      return;
    }

    // Calculate score for each month
    const monthScores = destData.monthlyData.map(month => {
      // Invert crowd score (lower crowds = higher score)
      const crowdScore = 6 - month.crowds;
      // Invert price score (lower prices = higher score)  
      const priceScore = 6 - month.price;
      
      const totalScore = (month.weather * weatherPriority) + 
                        (crowdScore * crowdPriority) + 
                        (priceScore * pricePriority);
      
      return {
        ...month,
        score: totalScore,
        maxPossibleScore: (5 * weatherPriority) + (5 * crowdPriority) + (5 * pricePriority)
      };
    });

    // Sort by score
    const sortedMonths = [...monthScores].sort((a, b) => b.score - a.score);
    const bestMonths = sortedMonths.slice(0, 3);
    const worstMonths = sortedMonths.slice(-3).reverse();

    displayResults({
      destination: destData,
      bestMonths,
      worstMonths,
      allMonths: monthScores,
      priorities: { weather: weatherPriority, crowd: crowdPriority, price: pricePriority },
      tripType
    });
  }

  function displayResults(data) {
    const { destination, bestMonths, worstMonths, allMonths, priorities, tripType } = data;

    // Get season recommendations
    const seasonTips = getSeasonTips(tripType);
    
    resultDiv.innerHTML = `
      <div class="result-section">
        <h3>🌍 Найкращий час для відвідування: ${destination.name}</h3>
        
        <div class="budget-insights">
          <div class="insight-cards">
            <div class="insight-card success">
              <h6>🏆 Найкращий місяць</h6>
              <p class="big-number">${bestMonths[0].month}</p>
              <p class="insight-detail">${bestMonths[0].temp}, ${bestMonths[0].notes}</p>
            </div>
            
            <div class="insight-card info">
              <h6>🌡️ Температура</h6>
              <p class="big-number">${bestMonths[0].temp}</p>
              <p class="insight-detail">у найкращий місяць</p>
            </div>
            
            <div class="insight-card ${bestMonths[0].crowds <= 2 ? 'success' : bestMonths[0].crowds <= 4 ? 'warning' : 'info'}">
              <h6>👥 Натовпи</h6>
              <p class="big-number">${getCrowdText(bestMonths[0].crowds)}</p>
              <p class="insight-detail">рівень туристів</p>
            </div>
            
            <div class="insight-card ${bestMonths[0].price <= 2 ? 'success' : bestMonths[0].price <= 4 ? 'warning' : 'info'}">
              <h6>💰 Ціни</h6>
              <p class="big-number">${getPriceText(bestMonths[0].price)}</p>
              <p class="insight-detail">рівень витрат</p>
            </div>
          </div>
        </div>

        <div class="result-grid">
          <div class="best-months">
            <h4>🏆 Топ-3 найкращих місяці</h4>
            ${bestMonths.map((month, index) => `
              <div class="month-recommendation ${index === 0 ? 'top-choice' : ''}">
                <div class="month-header">
                  <strong>${month.month}</strong>
                  <span class="score">${Math.round((month.score / month.maxPossibleScore) * 100)}% відповідність</span>
                </div>
                <div class="month-details">
                  <div class="weather-stats">
                    <span>🌡️ ${month.temp}</span>
                    <span>☔ ${month.rainfall} опади</span>
                  </div>
                  <div class="month-indicators">
                    <span class="indicator weather">Погода: ${getStars(month.weather)}</span>
                    <span class="indicator crowds">Натовпи: ${getStars(6 - month.crowds)}</span>
                    <span class="indicator price">Ціни: ${getStars(6 - month.price)}</span>
                  </div>
                  <p class="month-notes">${month.notes}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="worst-months">
            <h4>⚠️ Місяці, яких варто уникати</h4>
            ${worstMonths.map(month => `
              <div class="month-warning">
                <strong>${month.month}</strong>: ${month.notes}
                <div class="warning-details">
                  <span>🌡️ ${month.temp}</span>
                  <span class="crowds-warning">👥 ${getCrowdText(month.crowds)}</span>
                  <span class="price-warning">💰 ${getPriceText(month.price)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="monthly-calendar">
          <h4>📅 Календар по місяцях</h4>
          <div class="calendar-grid">
            ${allMonths.map(month => `
              <div class="calendar-month ${getMonthClass(month)}">
                <div class="month-name">${month.month}</div>
                <div class="month-temp">${month.temp}</div>
                <div class="month-indicators-small">
                  <div class="indicator-bar weather" style="width: ${month.weather * 20}%"></div>
                  <div class="indicator-bar crowds" style="width: ${(6 - month.crowds) * 20}%"></div>
                  <div class="indicator-bar price" style="width: ${(6 - month.price) * 20}%"></div>
                </div>
                <div class="month-score">${Math.round((month.score / month.maxPossibleScore) * 100)}%</div>
              </div>
            `).join('')}
          </div>
          <div class="calendar-legend">
            <span><div class="legend-bar weather"></div> Погода</span>
            <span><div class="legend-bar crowds"></div> Менше натовпів</span>
            <span><div class="legend-bar price"></div> Нижчі ціни</span>
          </span>
        </div>

        <div class="destination-highlights">
          <h4>✨ Особливості ${destination.name}</h4>
          <div class="highlights-grid">
            ${destination.highlights.map(highlight => `
              <div class="highlight-item">${highlight}</div>
            `).join('')}
          </div>
        </div>

        <div class="travel-tips">
          <h4>💡 Поради для подорожі</h4>
          <ul>
            ${destination.tips.map(tip => `<li>${tip}</li>`).join('')}
            ${seasonTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>

        <div class="priority-summary">
          <h4>🎯 Ваші пріоритети</h4>
          <div class="priority-bars">
            <div class="priority-item">
              <span>Погода:</span>
              <div class="priority-bar">
                <div class="priority-fill weather" style="width: ${priorities.weather * 20}%"></div>
              </div>
              <span>${priorities.weather}/5</span>
            </div>
            <div class="priority-item">
              <span>Уникнення натовпів:</span>
              <div class="priority-bar">
                <div class="priority-fill crowds" style="width: ${priorities.crowd * 20}%"></div>
              </div>
              <span>${priorities.crowd}/5</span>
            </div>
            <div class="priority-item">
              <span>Низькі ціни:</span>
              <div class="priority-bar">
                <div class="priority-fill price" style="width: ${priorities.price * 20}%"></div>
              </div>
              <span>${priorities.price}/5</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Helper functions
  function getStars(rating) {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  function getCrowdText(crowds) {
    const levels = ['Дуже мало', 'Мало', 'Помірно', 'Багато', 'Дуже багато'];
    return levels[crowds - 1] || 'Невідомо';
  }

  function getPriceText(price) {
    const levels = ['Дуже дешево', 'Дешево', 'Помірно', 'Дорого', 'Дуже дорого'];
    return levels[price - 1] || 'Невідомо';
  }

  function getMonthClass(month) {
    const score = month.score / month.maxPossibleScore;
    if (score >= 0.8) return 'excellent';
    if (score >= 0.6) return 'good';
    if (score >= 0.4) return 'fair';
    return 'poor';
  }

  function getSeasonTips(tripType) {
    const tips = {
      general: ['Плануйте бронювання заздалегідь у високий сезон'],
      beach: ['Уникайте сезону дощів та ураганів', 'Перевіряйте температуру води'],
      adventure: ['Літо найкраще для походів', 'Перевіряйте доступність маршрутів'],
      culture: ['Музеї менш переповнені в низький сезон', 'Деякі атракціони можуть бути закриті взимку'],
      nature: ['Сухий сезон кращий для спостереження за тваринами', 'Літо ідеальне для фотографії природи'],
      winter: ['Грудень-березень найкращі для лижного спорту', 'Перевіряйте снігові умови'],
      photography: ['Золота година найкраща рано вранці', 'Плечові сезони мають найкращі світлові умови']
    };
    return tips[tripType] || tips.general;
  }
});