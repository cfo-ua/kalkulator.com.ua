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
            alert('Please fill all required fields with valid numbers');
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
                name: 'Weekend Marathon',
                hoursPerDay: 8,
                description: '8 hours per day on weekends',
                days: Math.ceil(totalViewingHours / 8)
            },
            {
                name: 'Evening Viewing',
                hoursPerDay: 2,
                description: '2 hours per day after work',
                days: Math.ceil(totalViewingHours / 2)
            },
            {
                name: 'Speed Binge',
                hoursPerDay: 12,
                description: '12 hours per day (extreme)',
                days: Math.ceil(totalViewingHours / 12)
            }
        ];
        
        return {
            title: title || 'TV Series',
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
                completionDate: completionDate.toLocaleDateString('en-US', {
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
                        <div class="info-label">seasons</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${basic.totalEpisodes}</span>
                        <div class="info-label">episodes</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${basic.totalHours}</span>
                        <div class="info-label">hours of content</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${basic.totalViewingHours}</span>
                        <div class="info-label">hours with breaks</div>
                    </div>
                    <div class="info-item">
                        <span class="info-number">${basic.totalDays}</span>
                        <div class="info-label">days of continuous viewing</div>
                    </div>
                </div>
            </div>
            
            <div class="insight-cards">
                <div class="insight-card success">
                    <h6>🎯 Your Pace</h6>
                    <div class="big-number">${settings.pace} ep/day</div>
                    <p>${schedule.dailyHours} hrs per day</p>
                </div>
                
                <div class="insight-card info">
                    <h6>📅 Completion Time</h6>
                    <div class="big-number">${schedule.weeksToComplete} weeks</div>
                    <p>${schedule.completionDate}</p>
                </div>
                
                <div class="insight-card warning">
                    <h6>⏰ Weekly</h6>
                    <div class="big-number">${schedule.weeklyHours} hrs</div>
                    <p>${(schedule.weeklyHours / 168 * 100).toFixed(1)}% of the week</p>
                </div>
            </div>
            
            <div class="schedule-section">
                <h3>🎬 Viewing Scenarios</h3>
                <div class="schedule-grid">
                    <div class="schedule-item">
                        <h4>📊 Your Current Plan</h4>
                        <ul>
                            <li><strong>Episodes per day:</strong> ${settings.pace}</li>
                            <li><strong>Days per week:</strong> ${(settings.daysPerWeek === 7) ? 'Daily' : settings.daysPerWeek + ' days'}</li>
                            <li><strong>Time per day:</strong> ${schedule.dailyHours} hours</li>
                            <li><strong>Breaks:</strong> ${settings.breakTime} minutes between episodes</li>
                            <li><strong>Completion date:</strong> ${schedule.completionDate}</li>
                        </ul>
                    </div>
                    
                    ${scenarios.map(scenario => `
                        <div class="schedule-item">
                            <h4>⚡ ${scenario.name}</h4>
                            <ul>
                                <li><strong>Description:</strong> ${scenario.description}</li>
                                <li><strong>Days to complete:</strong> ${scenario.days}</li>
                                <li><strong>Episodes per day:</strong> ${Math.round((scenario.hoursPerDay / (settings.episodeDuration / 60)) * 10) / 10}</li>
                                <li><strong>Completion:</strong> ${new Date(Date.now() + scenario.days * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')}</li>
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="timeline-chart">
                    <h4>📈 Viewing Progress</h4>
                    <div class="timeline-bar">
                        <div class="timeline-progress" style="width: 100%;">
                            ${basic.totalEpisodes} episodes = ${basic.totalViewingHours} hours
                        </div>
                    </div>
                    <div class="timeline-labels">
                        <span>Start</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>Finish</span>
                    </div>
                    
                    <div style="margin-top: 2rem;">
                        <h4>🎯 Helpful Tips</h4>
                        <ul style="margin: 1rem 0; padding-left: 1.2rem;">
                            <li>Take breaks every 2-3 episodes to preserve eye health</li>
                            <li>Plan viewing so it doesn't disrupt sleep schedule</li>
                            <li>Keep a viewing diary to track progress</li>
                            <li>Discuss series with friends for better plot understanding</li>
                            <li>Take notes about favorite moments and quotes</li>
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