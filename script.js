document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. أنميشن الورود المتطايرة المستمرة في الخلفية
  // ==========================================
  function createPetals() {
    const container = document.createElement('div');
    container.className = 'flowers-container';
    document.body.appendChild(container);

    const petalCount = 25;
    
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      
      const size = Math.random() * 12 + 8;
      const startX = Math.random() * 100;
      const duration = Math.random() * 8 + 7;
      const delay = Math.random() * 10;
      
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.3}px`;
      petal.style.left = `${startX}vw`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      
      container.appendChild(petal);
    }
  }

  createPetals();

  // ==========================================
  // 1-ب. دالة انفجار بتلات الورود الكثيفة والورق اللميع (عند إرسال التهنئة)
  // ==========================================
  function triggerPetalBurst() {
    let container = document.querySelector('.flowers-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'flowers-container';
      document.body.appendChild(container);
    }

    const burstCount = 100;
    const glitterCount = 60;

    for (let i = 0; i < burstCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal burst-petal';
      
      const size = Math.random() * 16 + 12;
      const startX = Math.random() * 100;
      const duration = Math.random() * 4 + 2.5;
      const delay = Math.random() * 0.5;
      
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.4}px`;
      petal.style.left = `${startX}vw`;
      petal.style.top = `-25px`; 
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      
      container.appendChild(petal);

      setTimeout(() => {
        petal.remove();
      }, (duration + delay) * 1000);
    }

    const glitterColors = ['#ffd700', '#ff69b4', '#ffffff', '#e6c585', '#ff1493'];
    const shapes = ['50%', '2px', '0%'];

    for (let i = 0; i < glitterCount; i++) {
      const glitter = document.createElement('div');
      glitter.className = 'glitter-particle';

      const size = Math.random() * 8 + 6;
      const color = glitterColors[Math.floor(Math.random() * glitterColors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const startX = Math.random() * 100;
      const duration = Math.random() * 3.5 + 2;
      const delay = Math.random() * 0.4;

      glitter.style.width = `${size}px`;
      glitter.style.height = `${size}px`;
      glitter.style.backgroundColor = color;
      glitter.style.color = color;
      glitter.style.borderRadius = shape;
      glitter.style.left = `${startX}vw`;
      glitter.style.animationDuration = `${duration}s`;
      glitter.style.animationDelay = `${delay}s`;

      container.appendChild(glitter);

      setTimeout(() => {
        glitter.remove();
      }, (duration + delay) * 1000);
    }
  }

  // ==========================================
  // 2. إطلاق الألعاب النارية
  // ==========================================
  const fireworksBtn = document.getElementById('fireworksBtn');

  function triggerFireworks() {
    const colors = ['#ffd700', '#c5a059', '#ff1493', '#ffffff', '#e6c585', '#ff69b4', '#00ffff'];
    const totalParticles = 120;

    const centers = [
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.4 },
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 },
    ];

    centers.forEach(center => {
      for (let i = 0; i < totalParticles / centers.length; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (window.innerWidth * 0.45) + 100; 

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance + (Math.random() * 80);

        particle.style.backgroundColor = color;
        particle.style.color = color;
        particle.style.boxShadow = `0 0 15px ${color}, 0 0 25px ${color}`;
        particle.style.left = `${center.x}px`;
        particle.style.top = `${center.y}px`;
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);

        document.body.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 1600);
      }
    });
  }

  if (fireworksBtn) {
    fireworksBtn.addEventListener('click', triggerFireworks);
  }

  // ==========================================
  // 3. شاشة التحميل
  // ==========================================
  const loaderScreen = document.getElementById('loaderScreen');
  const progressFill = document.getElementById('progressFill');
  const progressNum = document.getElementById('progressNum');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += 5; 
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressNum) progressNum.textContent = progress + '%';

    if (progress >= 100) {
      clearInterval(loadInterval);
      if (loaderScreen) {
        loaderScreen.style.opacity = '0';
        setTimeout(() => { loaderScreen.style.display = 'none'; }, 500);
      }
    }
  }, 80);

  // ==========================================
  // 4. فتح البوابة السينمائية الملكية + تشغيل الموسيقى
  // ==========================================
  const weddingMusic = document.getElementById('weddingMusic');

  function playWeddingMusic() {
    if (weddingMusic) {
      weddingMusic.volume = 0.6;
      weddingMusic.play().catch(error => {
        console.log("تطلب المتصفح تفاعلاً تشغيل الصوت:", error);
      });
    }
  }

  function openMainGate() {
    const cinematicGate = document.getElementById('cinematicGate');
    
    playWeddingMusic();

    if (!cinematicGate || cinematicGate.classList.contains('open')) return;

    cinematicGate.classList.add('open');

    setTimeout(() => {
      cinematicGate.classList.add('fade-out');
    }, 1800);
  }

  const btnEnterGate = document.getElementById('btnEnterGate');
  if (btnEnterGate) {
    btnEnterGate.addEventListener('click', openMainGate);
  }

  document.addEventListener('click', function startAudioOnFirstInteraction() {
    playWeddingMusic();
    document.removeEventListener('click', startAudioOnFirstInteraction);
  }, { once: true });

  // ==========================================
  // 5. بوابة الانتقال بين الأقسام
  // ==========================================
  const transitionGate = document.getElementById('sectionTransitionGate');

  function triggerGateTransition(targetSectionId) {
    if (!transitionGate) return;

    transitionGate.classList.add('active');

    setTimeout(() => {
      const targetSection = document.querySelector(targetSectionId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }

      setTimeout(() => {
        transitionGate.classList.remove('active');
      }, 150);

    }, 400);
  }

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        openMainGate();
        triggerGateTransition(targetId);
      }
    });
  });

  // ==========================================
  // 6. أنميشن التمرير للصور
  // ==========================================
  const scrollElements = document.querySelectorAll('.scroll-animate');

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const elementBottom = el.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      const isInView = (elementTop <= windowHeight * 0.85) && (elementBottom >= 0);

      if (isInView) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  };

  window.addEventListener('scroll', handleScrollAnimation);
  handleScrollAnimation();

  // ==========================================
  // 7. العداد التنازلي (محادث ليكون 1000ms بدقة)
  // ==========================================
  const weddingDate = new Date('July 27, 2027 20:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const dEl = document.getElementById('days');
      const hEl = document.getElementById('hours');
      const mEl = document.getElementById('minutes');
      const sEl = document.getElementById('seconds');

      if (dEl) dEl.textContent = days < 10 ? '0' + days : days;
      if (hEl) hEl.textContent = hours < 10 ? '0' + hours : hours;
      if (mEl) mEl.textContent = minutes < 10 ? '0' + minutes : minutes;
      if (sEl) sEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================
  // 8. دفتر التهاني (مربوط بسيرفر سحابي لكل الأجهزة والمتصفحات)
  // ==========================================
  const wishesForm = document.getElementById('wishesForm');
  const wishesList = document.getElementById('wishesList');
  const ADMIN_PASSWORD = "1234";

  // سيرفر مجاني مخصص لحفظ التهاني عالمياً
  const API_URL = "https://api.jsonbin.io/v3/b/66b1a8d0e41b4d34e41a8e99"; 
  const MASTER_KEY = "$2a$10$w8uM.K8d4M3I.yE5J.q3.uOaE0/G3L5vKx.qG1w8/e1s1";

  let savedWishes = [];

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // 📥 جلب التهاني المسجلة من السيرفر عند فتح الصفحة
  async function fetchWishes() {
    try {
      const res = await fetch(API_URL + '/latest', {
        headers: { 'X-Master-Key': MASTER_KEY }
      });
      const data = await res.json();
      savedWishes = data.record.wishes || [];
      renderWishes();
    } catch (err) {
      console.log("استرجاع التهاني المحلية:", err);
      savedWishes = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
      renderWishes();
    }
  }

  // 📤 حفظ ومزامنة التهاني على السيرفر لكل المتصفحات
  async function syncWishesWithServer() {
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': MASTER_KEY
        },
        body: JSON.stringify({ wishes: savedWishes })
      });
    } catch (err) {
      console.error("خطأ في الاتصال بالسيرفر:", err);
    }
  }

  function renderWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = '';
    
    savedWishes.forEach((wish, index) => {
      const card = document.createElement('div');
      card.className = 'card wishes-card';
      card.innerHTML = `
        <button class="delete-wish-btn" data-index="${index}" title="حذف التهنئة">🗑️</button>
        <div class="wishes-author">${escapeHTML(wish.name)}</div>
        <p>${escapeHTML(wish.message)}</p>
      `;
      wishesList.prepend(card);
    });

    // ربط زر الحذف بحذف التهنئة
    document.querySelectorAll('.delete-wish-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-index'), 10);
        deleteWish(idx);
      });
    });
  }

  // 🗑️ حذف الرسالة بكلمة السر
  async function deleteWish(index) {
    const password = prompt("أدخل الرقم السري لحذف هذه التهنئة:");
    if (password === ADMIN_PASSWORD) {
      savedWishes.splice(index, 1);
      localStorage.setItem('wedding_wishes', JSON.stringify(savedWishes));
      renderWishes();
      await syncWishesWithServer();
      alert("تم حذف التهنئة بنجاح من المنصة.");
    } else if (password !== null) {
      alert("عذراً، الرقم السري غير صحيح!");
    }
  }

  // ✉️ عند إرسال تهنئة جديدة
  if (wishesForm) {
    wishesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('guestName');
      const msgInput = document.getElementById('guestMessage');

      if (nameInput && msgInput) {
        const name = nameInput.value.trim();
        const message = msgInput.value.trim();

        if (name && message) {
          const newWish = { name, message };
          savedWishes.push(newWish);
          
          renderWishes();
          wishesForm.reset();
          triggerPetalBurst();

          localStorage.setItem('wedding_wishes', JSON.stringify(savedWishes));
          await syncWishesWithServer();

          setTimeout(() => {
            alert('شكراً لك! تم إرسال تهنئتك وحفظها على المنصة للجميع ❤️');
          }, 300);
        }
      }
    });
  }

  // تشغيل جلب الرسائل فور التحميل
  fetchWishes();
});
