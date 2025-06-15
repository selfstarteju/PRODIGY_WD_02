class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapTimes = [];
        this.lapStartTime = 0;

        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startStopBtn = document.getElementById('startStopBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapList = document.getElementById('lapList');
        this.lapSection = document.getElementById('lapSection');
        this.bestLap = document.getElementById('bestLap');
        this.worstLap = document.getElementById('worstLap');
        this.avgLap = document.getElementById('avgLap');
    }

    addEventListeners() {
        this.startStopBtn.addEventListener('click', () => this.toggleStopwatch());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    toggleStopwatch() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        this.startTime = Date.now() - this.elapsedTime;
        this.lapStartTime = this.startTime;
        this.timerInterval = setInterval(() => this.updateDisplay(), 10);
        this.isRunning = true;

        this.startStopBtn.textContent = 'Stop';
        this.startStopBtn.classList.add('stop');
        this.lapBtn.disabled = false;
        this.resetBtn.disabled = false;
    }

    stop() {
        clearInterval(this.timerInterval);
        this.isRunning = false;

        this.startStopBtn.textContent = 'Start';
        this.startStopBtn.classList.remove('stop');
        this.lapBtn.disabled = true;
    }

    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.lapTimes = [];

        this.updateDisplay();
        this.clearLaps();

        this.startStopBtn.textContent = 'Start';
        this.startStopBtn.classList.remove('stop');
        this.lapBtn.disabled = true;
        this.resetBtn.disabled = true;
    }

    updateDisplay() {
        this.elapsedTime = Date.now() - this.startTime;
        this.timeDisplay.textContent = this.formatTime(this.elapsedTime);
    }

    recordLap() {
        const currentTime = Date.now();
        const lapTime = currentTime - this.lapStartTime;
        const totalTime = currentTime - (this.startTime - this.elapsedTime + this.lapTimes.reduce((sum, lap) => sum + lap.time, 0));

        const lap = {
            number: this.lapTimes.length + 1,
            time: lapTime,
            totalTime: this.elapsedTime
        };

        this.lapTimes.push(lap);
        this.lapStartTime = currentTime;
        this.displayLap(lap);
        this.updateLapStats();
    }

    displayLap(lap) {
        if (this.lapList.querySelector('.no-laps')) {
            this.lapList.innerHTML = '';
        }

        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        
        const lapDiff = this.calculateLapDifference(lap);
        
        lapItem.innerHTML = `
            <div class="lap-number">Lap ${lap.number}</div>
            <div class="lap-time">${this.formatTime(lap.time)}</div>
            <div class="lap-diff">${lapDiff}</div>
        `;

        this.lapList.insertBefore(lapItem, this.lapList.firstChild);
        this.highlightBestWorstLaps();
    }

    calculateLapDifference(currentLap) {
        if (this.lapTimes.length === 1) return '';
        
        const avgTime = this.lapTimes.reduce((sum, lap) => sum + lap.time, 0) / this.lapTimes.length;
        const diff = currentLap.time - avgTime;
        
        if (Math.abs(diff) < 10) return '';
        
        const sign = diff > 0 ? '+' : '';
        return `${sign}${this.formatTime(Math.abs(diff))}`;
    }

    highlightBestWorstLaps() {
        if (this.lapTimes.length < 2) return;

        const lapItems = this.lapList.querySelectorAll('.lap-item');
        lapItems.forEach(item => {
            item.classList.remove('best', 'worst');
        });

        const times = this.lapTimes.map(lap => lap.time);
        const bestTime = Math.min(...times);
        const worstTime = Math.max(...times);

        if (bestTime !== worstTime) {
            lapItems.forEach((item, index) => {
                const lapIndex = this.lapTimes.length - 1 - index;
                const lapTime = this.lapTimes[lapIndex].time;
                
                if (lapTime === bestTime) {
                    item.classList.add('best');
                } else if (lapTime === worstTime) {
                    item.classList.add('worst');
                }
            });
        }
    }

    updateLapStats() {
        if (this.lapTimes.length === 0) {
            this.bestLap.textContent = '--:--:--.--';
            this.worstLap.textContent = '--:--:--.--';
            this.avgLap.textContent = '--:--:--.--';
            return;
        }

        const times = this.lapTimes.map(lap => lap.time);
        const bestTime = Math.min(...times);
        const worstTime = Math.max(...times);
        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;

        this.bestLap.textContent = this.formatTime(bestTime);
        this.worstLap.textContent = this.formatTime(worstTime);
        this.avgLap.textContent = this.formatTime(avgTime);
    }

    clearLaps() {
        this.lapList.innerHTML = '<div class="no-laps">No lap times recorded</div>';
        this.updateLapStats();
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
});