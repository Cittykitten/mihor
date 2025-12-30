// Main entry point - additional functionality can be added here
console.log("Whispers from the Code - HTML Version");

// Mobile detection for touch events
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  document.body.classList.add('mobile');
  // Add mobile-specific event listeners if needed
}

// Heartbeat effect
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes heartbeat {
      0% { box-shadow: 0 0 10px 0 rgba(139, 0, 0, 0); }
      50% { box-shadow: 0 0 20px 10px rgba(139, 0, 0, 0.3); }
      100% { box-shadow: 0 0 10px 0 rgba(139, 0, 0, 0); }
    }
    .heartbeat {
      animation: heartbeat 1s infinite;
    }
  `;
  document.head.appendChild(style);

});



