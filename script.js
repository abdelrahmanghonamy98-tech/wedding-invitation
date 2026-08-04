// ==========================================
// 1. عداد التحميل (يعمل فوراً وبشكل مستقل)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
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
  }, 40);
});

// ==========================================
// 2. تهيئة الفايربيز الآمنة
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyC0aAxfY0SFvipGzMeONP480TKZWVey6a4",
  authDomain: "wedding-wishes-a6dd4.firebaseapp.com",
  databaseURL: "https://wedding-wishes-a6dd4-default-rtdb.firebaseio.com",
  projectId: "wedding-wishes-a6dd4",
  storageBucket: "wedding-wishes-a6dd4.firebasestorage.app",
  messagingSenderId: "817282748542",
  appId: "1:817282748542:web:7695a5d50ea86c5e12482f"
};

let database = null;
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    database = firebase.database();
  } else {
    console.warn("Firebase SDK not loaded properly");
  }
} catch (e) {
  console.error("Firebase Initialization Error:", e);
}

// ==========================================
// 3. باقي التفاعلات والدفتر
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  // --- أنميشن الورود المتطايرة ---
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

 // --- انفجار بتلات الورود واللميع الذهبي بحركة سلو موشن مفردة ---
function triggerPetalBurst() {
  let container = document.querySelector('.flowers-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'flowers-container';
    document.body.appendChild(container);
  }

  // 1. إنشاء الورد (لون موحد، مفرود بطول الشاشة وبسرعة هادئة بطيئة)
  const petalCount = 100;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal burst-petal';
    
    const size = Math.random() * 5 + 9; // حجم متناسق وصغير
    const startX = Math.random() * 100; // انتشار واسع بعرض الشاشة
    const startY = - (Math.random() * 80 + 20); // مفرود بانتشار رأسي فوق الشاشة لينزل بالتتابع
    const duration = Math.random() * 4 + 6; // حركة هادئة وبطيئة جداً (Slow Motion)

    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.3}px`;
    petal.style.left = `${startX}vw`;
    petal.style.top = `${startY}px`;
    petal.style.animationDuration = `${duration}s`;
    
    container.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000);
  }

  // 2. إنشاء اللميع الذهبي (Gold Glitter) بنزول انسيابي وبطيء
  const glitterCount = 120;
  for (let i = 0; i < glitterCount; i++) {
    const glitter = document.createElement('div');
    glitter.className = 'glitter-gold';
    
    const size = Math.random() * 5 + 3;
    const startX = Math.random() * 100;
    const startY = - (Math.random() * 100 + 10);
    const duration = Math.random() * 4 + 5.5; // سرعة هادئة متناغمة مع الورد

    glitter.style.width = `${size}px`;
    glitter.style.height = `${size}px`;
    glitter.style.left = `${startX}vw`;
    glitter.style.top = `${startY}px`;
    glitter.style.animationDuration = `${duration}s`;

    container.appendChild(glitter);
    setTimeout(() => glitter.remove(), duration * 1000);
  }
}

  // --- الألعاب النارية ---
  const fireworksBtn = document.getElementById('fireworksBtn');
  if (fireworksBtn) {
    fireworksBtn.addEventListener('click', () => {
      const colors = ['#ffd700', '#c5a059', '#ff1493', '#ffffff', '#e6c585', '#00ffff'];
      const centers = [
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.4 },
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 },
      ];

      centers.forEach(center => {
        for (let i = 0; i < 40; i++) {
          const particle = document.createElement('div');
          particle.className = 'firework-particle';
          const color = colors[Math.floor(Math.random() * colors.length)];
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * (window.innerWidth * 0.4) + 80;

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
          setTimeout(() => particle.remove(), 1600);
        }
      });
    });
  }

  // --- فتح البوابة والموسيقى ---
  const weddingMusic = document.getElementById('weddingMusic');
  function playWeddingMusic() {
    if (weddingMusic) {
      weddingMusic.volume = 0.6;
      weddingMusic.play().catch(() => {});
    }
  }

  const btnEnterGate = document.getElementById('btnEnterGate');
  if (btnEnterGate) {
    btnEnterGate.addEventListener('click', () => {
      const cinematicGate = document.getElementById('cinematicGate');
      playWeddingMusic();
      if (cinematicGate) {
        cinematicGate.classList.add('open');
        setTimeout(() => cinematicGate.classList.add('fade-out'), 1800);
      }
    });
  }

  // --- التنقل بين الأقسام ---
  const transitionGate = document.getElementById('sectionTransitionGate');
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        if (transitionGate) {
          transitionGate.classList.add('active');
          setTimeout(() => {
            const targetSection = document.querySelector(targetId);
            if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => transitionGate.classList.remove('active'), 150);
          }, 400);
        }
      }
    });
  });

  // --- العداد التنازلي ---
  const weddingDate = new Date('July 27, 2027 20:00:00').getTime();
  setInterval(() => {
    const now = new Date().getTime();
    const diff = weddingDate - now;
    if (diff > 0) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const dEl = document.getElementById('days');
      const hEl = document.getElementById('hours');
      const mEl = document.getElementById('minutes');
      const sEl = document.getElementById('seconds');

      if (dEl) dEl.textContent = d < 10 ? '0' + d : d;
      if (hEl) hEl.textContent = h < 10 ? '0' + h : h;
      if (mEl) mEl.textContent = m < 10 ? '0' + m : m;
      if (sEl) sEl.textContent = s < 10 ? '0' + s : s;
    }
  }, 1000);

  // --- دفتر التهاني مع الفايربيز ---
  const wishesForm = document.getElementById('wishesForm');
  const wishesList = document.getElementById('wishesList');

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }

  if (database && wishesList) {
    // قراءة التهاني
    database.ref('wishes').on('value', (snapshot) => {
      wishesList.innerHTML = '';
      const data = snapshot.val();
      if (data) {
        Object.keys(data).forEach((key) => {
          const wish = data[key];
          const card = document.createElement('div');
          card.className = 'card wishes-card';
          card.innerHTML = `
            <button class="delete-wish-btn" data-key="${key}" title="حذف التهنئة">🗑️</button>
            <div class="wishes-author">${escapeHTML(wish.name)}</div>
            <p>${escapeHTML(wish.message)}</p>
          `;
          wishesList.prepend(card);
        });

        document.querySelectorAll('.delete-wish-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            const pass = prompt("أدخل الرقم السري للحذف:");
            if (pass === "1234") {
              database.ref('wishes/' + key).remove();
            } else if (pass !== null) {
              alert("كلمة السر غير صحيحة!");
            }
          });
        });
      }
    });

    // إرسال تهنئة جديدة
    if (wishesForm) {
      wishesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('guestName');
        const msgInput = document.getElementById('guestMessage');

        if (nameInput && msgInput && nameInput.value.trim() && msgInput.value.trim()) {
          database.ref('wishes').push({
            name: nameInput.value.trim(),
            message: msgInput.value.trim(),
            timestamp: Date.now()
          }).then(() => {
            wishesForm.reset();
            triggerPetalBurst();
            alert('تم نشر تهنئتك بنجاح ❤️');
          }).catch(err => {
            alert('حدث خطأ في الإرسال!');
          });
        }
      });
    }
  }
// --- إظهار الصور عند التمرير (Scroll Animation) ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // إيقاف المراقبة بعد الإظهار
    }
  });
}, observerOptions);

document.querySelectorAll('.scroll-animate').forEach(el => {
  observer.observe(el);
});
});
