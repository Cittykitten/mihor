// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global animations setup
gsap.defaults({ ease: "power2.inOut" });

// Audio elements
const audioElements = {
  thunder: new Audio('assets/audio/thunder.mp3'),
  whisper: new Audio('assets/audio/whisper.mp3'),
  heartbeat: new Audio('assets/audio/heartbeat.mp3')
};

// Set audio properties
audioElements.whisper.loop = true;
audioElements.heartbeat.loop = true;
audioElements.heartbeat.volume = 0.3;

// Play thunder on load
window.addEventListener('load', () => {
  setTimeout(() => {
    audioElements.thunder.play().catch(e => console.log("Audio play prevented:", e));
  }, 1000);
});

// Intro Animations
const introAnimations = () => {
  // Main title animation
  gsap.from('#main-title', {
    opacity: 0,
    y: 50,
    duration: 2,
    ease: "power4.inOut"
  });

  // Title flicker
  const flicker = gsap.timeline({ repeat: 3 });
  flicker.to('#main-title', {
    opacity: 0.3,
    duration: 0.1,
  }).to('#main-title', {
    opacity: 1,
    duration: 0.1,
  });

  // Blood drips
  gsap.from('.blood-drip', {
    y: -100,
    opacity: 0,
    height: 0,
    stagger: 0.2,
    delay: 2,
    duration: 1.5,
    onComplete: triggerJumpScare
  });

  // Subtitle
  gsap.from('#subtitle', {
    opacity: 0,
    scale: 0.8,
    delay: 3,
    duration: 1.5
  });
};

// Chapter Animations
const setupChapterAnimations = () => {
  // Chapter 1
  ScrollTrigger.create({
    trigger: "#chapter1",
    start: "top center",
    end: "bottom center",
    onEnter: () => {
      audioElements.whisper.play().catch(e => console.log(e));
      if (Math.random() > 0.7) triggerJumpScare();
    },
    onLeave: () => audioElements.whisper.pause(),
    onEnterBack: () => audioElements.whisper.play().catch(e => console.log(e)),
    onLeaveBack: () => audioElements.whisper.pause()
  });

  // Animate chapter content
  gsap.utils.toArray('.chapter-text p').forEach((p, i) => {
    gsap.from(p, {
      opacity: 0,
      y: 20,
      duration: 1,
      scrollTrigger: {
        trigger: p,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
};

// Choices Animations
const setupChoicesAnimations = () => {
  gsap.from('.choice-btn', {
    opacity: 0,
    y: 50,
    stagger: 0.3,
    duration: 1,
    scrollTrigger: {
      trigger: "#choices",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  // Choice buttons event listeners
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const choice = this.id.split('-')[1];
      handleChoice(choice);
    });
  });
};

// Ending Animations
const setupEndingAnimations = () => {
  // Pulsing skull
  gsap.to("#skull-icon", {
    scale: 1.2,
    opacity: 0.8,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Animate ending text
  gsap.from('.ending-text p', {
    opacity: 0,
    y: 20,
    stagger: 0.3,
    duration: 1,
    scrollTrigger: {
      trigger: "#ending",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
};

// Ghost Follower
const setupGhostFollower = () => {
  const ghost = document.getElementById('ghost');
  const pos = { x: 0, y: 0 };
  const mouse = { x: 0, y: 0 };
  const delay = 20;

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX - 50;
    mouse.y = e.clientY - 50;
  });

  const followMouse = () => {
    pos.x += (mouse.x - pos.x) / delay;
    pos.y += (mouse.y - pos.y) / delay;
    
    gsap.set(ghost, {
      x: pos.x,
      y: pos.y,
      opacity: ghost.style.opacity === '0' ? 0 : 0.7
    });

    requestAnimationFrame(followMouse);
  };

  followMouse();

  // Random fade in/out
  setInterval(() => {
    gsap.to(ghost, {
      opacity: Math.random() > 0.5 ? 0.7 : 0.3,
      duration: 2,
      ease: "sine.inOut"
    });
  }, 3000);
};

// Jump Scare
function triggerJumpScare() {
  gsap.to("#jumpscare-overlay", {
    opacity: 1,
    scale: 1.1,
    duration: 0.1,
    onComplete: () => {
      gsap.to("#jumpscare-overlay", {
        opacity: 0,
        duration: 0.3,
        delay: 0.2
      });
    }
  });
}

// Choice Handler
function handleChoice(choice) {
  const outcomeText = document.querySelector('.outcome-message');
  const outcomeContainer = document.getElementById('outcome-text');
  
  // Disable buttons
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
  });

  // Animate selected button
  gsap.to(`#choice-${choice}`, {
    scale: 1.1,
    backgroundColor: 'rgba(139, 0, 0, 0.5)',
    color: 'white',
    duration: 0.3
  });

  // Start heartbeat
  audioElements.heartbeat.play().catch(e => console.log(e));
  document.body.classList.add('heartbeat');

  // Random jump scare
  if (Math.random() > 0.5) {
    setTimeout(triggerJumpScare, 1000);
  }

  // Show outcome
  setTimeout(() => {
    outcomeContainer.classList.remove('hidden');
    outcomeText.textContent = choice === 'enter' 
      ? "The door creaks open to reveal endless darkness..." 
      : "Your footsteps echo as you flee into the unknown...";
    
    // Continue to next chapter
    setTimeout(() => {
      window.scrollTo({
        top: document.getElementById('chapter2').offsetTop,
        behavior: 'smooth'
      });
    }, 3000);
  }, 2000);
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
  introAnimations();
  setupChapterAnimations();
  setupChoicesAnimations();
  setupEndingAnimations();
  setTimeout(setupGhostFollower, 5000); // Show ghost after 5 seconds
});