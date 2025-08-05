document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');
    
    calculateBtn.addEventListener('click', calculateSeriesDuration);
    
    function calculateSeriesDuration() {
        const seriesTitle = document.getElementById('seriesTitle').value.trim();
        const numSeasons = parseInt(document.getElementById('numSeasons').value);
        const episodesPerSeason = parseInt(document.getElementById('episodesPerSeason').value);
        const episodeDuration = parseInt(document.getElementById('episodeDuration').value);
        const viewingPace = parseFloat(document.getElementById('viewingPace').value);
        const breakTime = parseInt(document.getElementById('breakTime').value);
        const viewingDays = parseInt(document.getElementById('viewingDays').value);
        
        if (isNaN(numSeasons) || isNaN(episodesPerSeason) || isNaN(episodeDuration) || isNaN(viewingPace)) {
            alert('Будь ласка, заповніть всі обов\'язкові поля коректними числами');
            return;
        }
        
        const result = calculateViewingSchedule(
            seriesTitle, numSeasons, episodesPerSeason, episodeDuration, 
            viewingPace, breakTime, viewingDays
        );
        
        displayResults(result);
    }
    
    function calculateViewingSchedule(title, seasons, episodesPerSeason, episodeDuration, pace, breakTime, daysPerWeek) {
        // Basic calculations
        const totalEpisodes = seasons * episodesPerSeason;
        const totalMinutes = totalEpisodes * episodeDuration;
        const totalHours = totalMinutes / 60;
        const totalDays = Math.ceil(totalHours / 24);
        
        // Viewing time with breaks
        const episodesWithBreaks = totalEpisodes - 1; // No break after last episode
        const totalBreakTime = episodesWithBreaks * breakTime;
        const totalViewingMinutes = totalMinutes + totalBreakTime;
        const totalViewingHours = totalViewingMinutes / 60;
        
        // Schedule calculations
        const daysToComplete = Math.ceil(totalEpisodes / pace);
        const weeksToComplete = Math.ceil(daysToComplete / daysPerWeek);
        const actualDaysToComplete = Math.ceil((daysToComplete / daysPerWeek) * 7);
        
        // Daily and weekly time
        const dailyMinutes = pace * episodeDuration + ((pace - 1) * breakTime);
        const dailyHours = dailyMinutes / 60;
        const weeklyMinutes = dailyMinutes * daysPerWeek;
        const weeklyHours = weeklyMinutes / 60;
        
        // Completion date
        const today = new Date();
        const completionDate = new Date(today);
        completionDate.setDate(today.getDate() + actualDaysToComplete);
        
        // Binge watching scenarios
        const bingeScenarios = [
            {
                name: 'Марафон вихідних',
                hoursPerDay: 8,
                description: '8 годин на день у вихідні',
                days: Math.ceil(totalViewingHours / 8)
            },
            {
                name: 'Вечірній перегляд',
                hoursPerDay: 2,
                description: '2 години на день після роботи',
                days: Math.ceil(totalViewingHours / 2)
            },
            {
                name: 'Швидкий бінж',
                hoursPerDay: 12,
                description: '12 годин на день (екстрим)',
                days: Math.ceil(totalViewingHours / 12)
            }
        ];
        
        return {
            title: title || 'Серіал',
            basic: {
                totalEpisodes,
                totalSeasons: seasons,
                episodesPerSeason,
                totalHours: Math.round(totalHours * 10) / 10,
                totalViewingHours: Math.round(totalViewingHours * 10) / 10,
                totalDays: Math.round(totalDays * 10) / 10
            },
            schedule: {
                dailyHours: Math.round(dailyHours * 10) / 10,
                weeklyHours: Math.round(weeklyHours * 10) / 10,
                daysToComplete,
                weeksToComplete,
                completionDate: completionDate.toLocaleDateString('uk-UA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            },
            scenarios: bingeScenarios,
            settings: {
                pace,
                breakTime,
                daysPerWeek,
                episodeDuration
            }
        };
    }
    
    function displayResults(result) {
        const { title, basic, schedule, scenarios, settings } = result;
        
        resultSection.innerHTML = `
            <div class="series-overview">
                <h3>📺 ${title}</h3>
                <div class="series-info">
                    <div class="info-item">
                        <span class="info-number">${basic.totalSeasons}</span>
                        <div class="info-label">сезонів</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${basic.totalEpisodes}</span>
                        <div class="info-label">епізодів</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${basic.totalHours}</span>
                        <div class="info-label">годин контенту</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${basic.totalViewingHours}</span>
                        <div class="info-label">годин з перервами</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${basic.totalDays}</span>
                        <div class="info-label">днів безперервного перегляду</div>
                    </div>
                </div>
            </div>
            
            <div class="insight-cards">
                <div class="insight-card success">
                    <h6>🎯 Ваш темп</h6>
                    <div class="big-number">${settings.pace} епіз./день</div>
                    <p>${schedule.dailyHours} год на день</p>
                </div>
                
                <div class="insight-card info">
                    <h6>📅 Час завершення</h6>
                    <div class="big-number">${schedule.weeksToComplete} тижнів</div>
                    <p>${schedule.completionDate}</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>⏰ Щотижня</h6>
                    <div class="big-number">${schedule.weeklyHours} год</div>
                    <p>${(schedule.weeklyHours / 168 * 100).toFixed(1)}% від тижня</p>
                </div>
            </div>
            
            <div class="schedule-section">
                <h3>🎬 Сценарії перегляду</h3>
                <div class="schedule-grid">
                    <div class="schedule-item">
                        <h4>📊 Ваш поточний план</h4>
                        <ul>
                            <li><strong>Епізодів на день:</strong> ${settings.pace}</li>
                            <li><strong>Днів на тиждень:</strong> ${(settings.daysPerWeek === 7) ? 'Щодня' : settings.daysPerWeek + ' днів'}</li>
                            <li><strong>Час на день:</strong> ${schedule.dailyHours} годин</li>
                            <li><strong>Перерви:</strong> ${settings.breakTime} хвилин між епізодами</li>
                            <li><strong>Дата завершення:</strong> ${schedule.completionDate}</li>
                        </ul>
                    </div>
                    
                    ${scenarios.map(scenario => `
                        <div class="schedule-item">
                            <h4>⚡ ${scenario.name}</h4>
                            <ul>
                                <li><strong>Опис:</strong> ${scenario.description}</li>
                                <li><strong>Днів для завершення:</strong> ${scenario.days}</li>
                                <li><strong>Епізодів на день:</strong> ${Math.round((scenario.hoursPerDay / (settings.episodeDuration / 60)) * 10) / 10}</li>
                                <li><strong>Завершення:</strong> ${new Date(Date.now() + scenario.days * 24 * 60 * 60 * 1000).toLocaleDateString('uk-UA')}</li>
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="timeline-chart">
                    <h4>📈 Прогрес перегляду</h4>
                    <div class="timeline-bar">
                        <div class="timeline-progress" style="width: 100%;">
                            ${basic.totalEpisodes} епізодів = ${basic.totalViewingHours} годин
                        </div>
                    </div>
                    <div class="timeline-labels">
                        <span>Початок</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>Завершення</span>
                    </div>
                    
                    <div style="margin-top: 2rem;">
                        <h4>🎯 Корисні поради</h4>
                        <ul style="margin: 1rem 0; padding-left: 1.2rem;">
                            <li>Робіть перерву кожні 2-3 епізоди для збереження здоров'я очей</li>
                            <li>Плануйте перегляд так, щоб не порушувати режим сну</li>
                            <li>Ведіть щоденник переглянутого для відстеження прогресу</li>
                            <li>Обговорюйте серіал з друзями для кращого засвоєння сюжету</li>
                            <li>Робіть нотатки про улюблені моменти та цитати</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        resultSection.classList.add('show');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Auto-calculate on input change for better UX
    const inputs = ['numSeasons', 'episodesPerSeason', 'episodeDuration', 'viewingPace', 'breakTime', 'viewingDays'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', debounce(() => {
                if (resultSection.classList.contains('show')) {
                    calculateSeriesDuration();
                }
            }, 500));
        }
    });
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});