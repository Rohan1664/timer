// Function to send command to the main timer display
function sendCommand(action) {
  const payload = {
    action: action,
    timestamp: Date.now() // Ensure the event fires even for identical consecutive commands
  };
  localStorage.setItem('timer_command', JSON.stringify(payload));
}

// Function to handle custom time setting
function setCustomTime() {
  const hrs = parseInt(document.getElementById('input-hrs').value) || 0;
  const mins = parseInt(document.getElementById('input-mins').value) || 0;
  const secs = parseInt(document.getElementById('input-secs').value) || 0;

  const totalSeconds = (hrs * 3600) + (mins * 60) + secs;

  const payload = {
    action: 'set_time',
    seconds: totalSeconds,
    timestamp: Date.now()
  };
  localStorage.setItem('timer_command', JSON.stringify(payload));
}

// Listen for state updates from the main timer display
window.addEventListener('storage', (e) => {
  if (e.key === 'timer_state') {
    if (!e.newValue) return;
    
    try {
      const state = JSON.parse(e.newValue);
      
      // Update display time
      if (state.display) {
        document.getElementById('time-display').innerText = state.display;
      }
      
      // Update running status
      const statusEl = document.getElementById('status-display');
      if (state.isRunning) {
        statusEl.innerText = "Status: Running";
        statusEl.style.color = "#4ade80"; // green
      } else {
        statusEl.innerText = "Status: Stopped";
        statusEl.style.color = "#ef4444"; // red
      }
    } catch (err) {
      console.error("Error parsing timer state", err);
    }
  }
});

// Trigger a request to sync state on load
sendCommand('sync');
