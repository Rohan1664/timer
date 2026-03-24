let timer;
let totalSeconds = 8 * 60 * 60; // 8 hours
let isRunning = false;

function updateDisplay() {
  let hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  let mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  let secs = String(totalSeconds % 60).padStart(2, '0');

  const displayStr = `${hrs}:${mins}:${secs}`;
  document.getElementById("time").innerText = displayStr;

  // Broadcast state to admin panel
  localStorage.setItem('timer_state', JSON.stringify({
    isRunning: isRunning,
    totalSeconds: totalSeconds,
    display: displayStr,
    timestamp: Date.now()
  }));
}

function startTimer() {
  if (!isRunning && totalSeconds > 0) {
    isRunning = true;
    updateDisplay(); // update status immediately
    timer = setInterval(() => {
      totalSeconds--;
      updateDisplay();

      if (totalSeconds <= 0) {
        clearInterval(timer);
        isRunning = false;
        updateDisplay(); // update status and stop
        alert("⏰ Time's up!");
      }
    }, 1000);
  }
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  updateDisplay(); // broadcast new status
}

function resetTimer() {
  isRunning = false;
  clearInterval(timer);
  totalSeconds = 8 * 60 * 60; // reset to 8 hours
  updateDisplay();
}

// Listen for admin commands
window.addEventListener('storage', (e) => {
  if (e.key === 'timer_command') {
    if (!e.newValue) return;

    try {
      const cmd = JSON.parse(e.newValue);
      
      if (cmd.action === 'start') {
        startTimer();
      } else if (cmd.action === 'pause') {
        pauseTimer();
      } else if (cmd.action === 'reset') {
        resetTimer();
      } else if (cmd.action === 'set_time') {
        // Pause current timer first to safely set time
        isRunning = false;
        clearInterval(timer);
        
        totalSeconds = cmd.seconds;
        updateDisplay();
      } else if (cmd.action === 'sync') {
        // Just broadcast current state
        updateDisplay();
      }
    } catch (err) {
      console.error("Error parsing timer command", err);
    }
  }
});

// Clean up state on load to ensure it's fresh
localStorage.removeItem('timer_state');
localStorage.removeItem('timer_command');

// Initialize display on load
updateDisplay();