// بداية ملف script.js
document.addEventListener('DOMContentLoaded', () => {
  const loaderScreen = document.getElementById('loaderScreen');
  const progressFill = document.getElementById('progressFill');
  const progressNum = document.getElementById('progressNum');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        if (loaderScreen) {
          loaderScreen.style.opacity = '0';
          setTimeout(() => loaderScreen.style.display = 'none', 800);
        }
      }, 300);
    }
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressNum) progressNum.textContent = `${progress}%`;
  }, 100);
});
import { 
  initFirebase, submitRSVP, submitGuestMessage, 
  fetchGuestMessages, trackVisit 
} from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Firebase & Analytics
  initFirebase();
  trackVisit();

  // 2. DOM Elements
  const loaderScreen = document.getElementById('loaderScreen');
  const progressFill = document.getElementById('progressFill');
  const progressNum = document.getElementById('progressNum');
  const cinematicGate = document.getElementById('cinematicGate');
  const btnEnterGate = document.getElementById('btnEnterGate');
  const bgAudio = document.getElementById('bgAudio');
  const btnAudioToggle = document.getElementById('btnAudioToggle');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const btnLanguage = document.getElementById('btnLanguage');

  let isAudioPlaying = false;

  // 3. Simpler Loading Screen Handler
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        loaderScreen.style.opacity = '0';
        setTimeout(() => loaderScreen.style.display = 'none', 800);
      }, 300);
    }
    progressFill.style.width = `${progress}%`;
    progressNum.textContent = `${progress}%`;
  }, 120);

  // 4. Cinematic Gate Entry & Audio Auto Fade-In
  btnEnterGate.addEventListener('click', () => {
    const leftDoor = document.querySelector('.gate-door-left');
    const rightDoor = document.querySelector('.gate-door-right');
    const gateContent = document.querySelector('.gate-content');

    gateContent.style.opacity = '0';
    leftDoor.style.transform = 'translateX(-100%)';
    rightDoor.style.transform = 'translateX(100%)';

    toggleAudio(true);

    setTimeout(() => {
      cinematicGate.style.display = 'none';
    }, 1200);
  });

  // Audio Control Helper
  function toggleAudio(play) {
    if (play) {
      bgAudio.volume = 0;
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        btnAudioToggle.classList.add('playing');
        fadeInAudio();
      }).catch(e => console.log("Audio play blocked by browser:", e));
    } else {
      fadeOutAudio(() => {
        bgAudio.pause();
        isAudioPlaying = false;
        btnAudioToggle.classList.remove('playing');
      });
    }
  }

  function fadeInAudio() {
    let vol = 0;
    const interval = setInterval(() => {
      if (vol < 0.5) {
        vol += 0.05;
        bgAudio.volume = vol;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  function fadeOutAudio(cb) {
    let vol = bgAudio.volume;
    const interval = setInterval(() => {
      if (vol > 0.05) {
        vol -= 0.05;
        bgAudio.volume = vol;
      } else {
        bgAudio.volume = 0;
        clearInterval(interval);
        if (cb) cb();
      }
    }, 50);
  }

  btnAudioToggle.addEventListener('click', () => {
    toggleAudio(!isAudioPlaying);
  });

  // 5. Countdown Timer (Target: 27 July 2027 20:00:00)
  const targetDate = new Date('2027-07-27T20:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.getElementById('countDays').textContent = days < 10 ? '0' + days : days;
      document.getElementById('countHours').textContent = hours < 10 ? '0' + hours : hours;
      document.getElementById('countMinutes').textContent = minutes < 10 ? '0' + minutes : minutes;
      document.getElementById('countSeconds').textContent = seconds < 10 ? '0' + seconds : seconds;
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 6. Intersection Observer for Scroll Animations
  const observerOptions = { threshold: 0.15 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });

  // 7. Gallery Tabs Switcher & Lightbox
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxModal.style.display = 'flex';
      lightboxImg.src = item.dataset.src;
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', () => {
    lightboxModal.style.display = 'none';
  });

  // 8. Canvas Particle & Heart Effect Engine
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 0.8 + 0.2;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.y -= this.speedY;
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(200, 169, 106, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 40; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // 9. RSVP Submission Handling
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpFeedback = document.getElementById('rsvpFeedback');

  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('btnRsvpSubmit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الإرسال...';

    const formData = {
      name: document.getElementById('rsvpName').value,
      phone: document.getElementById('rsvpPhone').value,
      guests: document.getElementById('rsvpGuests').value,
      attendance: rsvpForm.querySelector('input[name="attendance"]:checked').value,
      message: document.getElementById('rsvpMessage').value
    };

    try {
      await submitRSVP(formData);
      rsvpFeedback.classList.remove('hidden');
      rsvpFeedback.style.color = '#27ae60';
      rsvpFeedback.textContent = 'تم إرسال تأكيد الحضور بنجاح! شكراً لك.';
      rsvpForm.reset();
    } catch (err) {
      rsvpFeedback.classList.remove('hidden');
      rsvpFeedback.style.color = '#e74c3c';
      rsvpFeedback.textContent = err.message || 'حدث خطأ أثناء الإرسال.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'إرسال التأكيد';
    }
  });

  // 10. Guestbook Load & Add Message
  const guestbookForm = document.getElementById('guestbookForm');
  const messagesFeed = document.getElementById('messagesFeed');

  async function loadGuestbook() {
    try {
      const messages = await fetchGuestMessages();
      messagesFeed.innerHTML = '';
      if (messages.length === 0) {
        messagesFeed.innerHTML = '<p class="text-center">كونوا أول من يترك تهنئة للعروسين!</p>';
        return;
      }
      messages.forEach(msg => {
        const card = document.createElement('div');
        card.className = 'message-card glass-card';
        card.innerHTML = `
          <div class="msg-header">
            <span>${msg.name}</span>
          </div>
          <p class="msg-body">${msg.message}</p>
        `;
        messagesFeed.appendChild(card);
      });
    } catch (e) {
      messagesFeed.innerHTML = '<p>تعذر تحميل الرسائل.</p>';
    }
  }

  guestbookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('gbName').value;
    const message = document.getElementById('gbMessage').value;

    try {
      await submitGuestMessage({ name, message });
      guestbookForm.reset();
      loadGuestbook();
    } catch (err) {
      alert(err.message);
    }
  });

  loadGuestbook();

  // 11. Theme & Utility Buttons
  btnThemeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    btnThemeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });

  document.getElementById('btnShareWhatsapp').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("ندعوكم لحضور حفل زفاف عبدالرحمن ومايا! 💍");
    window.open(`[https://api.whatsapp.com/send?text=$](https://api.whatsapp.com/send?text=$){text}%20${url}`, '_blank');
  });

  document.getElementById('btnCopyLink').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    alert('تم نسخ رابط الدعوة!');
  });
});
