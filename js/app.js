// Main Application Controller
import { config } from './config.js';
import ParticleEngine from './particles.js';
import { SoundManager } from './audio.js';
import { mountInfiniteMenu } from '../src/mountInfiniteMenu.jsx';

class BirthdayApp {
  constructor() {
    this.config = config;
    this.currentScreen = 1;
    this.totalScreens = 5;
    this.particles = new ParticleEngine('particlesCanvas');
    this.sound = new SoundManager(config);
    this.candleBlown = false;

    this.init();
  }

  init() {
    this.bindGlobalEvents();
    this.initScreen1();
    this.initScreen2();
    this.initScreen3();
    this.initScreen4();
    this.initScreen5();
    this.initModals();
    this.updateScreen(1);
  }

  // Bind top nav and step indicators
  bindGlobalEvents() {
    const musicBtn = document.getElementById('musicToggle');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        this.sound.toggleMusic();
      });
    }

    // Step dots navigation
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetScreen = parseInt(dot.getAttribute('data-step'));
        if (targetScreen) {
          this.sound.playClickSound();
          this.updateScreen(targetScreen);
        }
      });
    });
  }

  updateScreen(step) {
    this.currentScreen = step;

    // Update screen visibility
    for (let i = 1; i <= this.totalScreens; i++) {
      const screenEl = document.getElementById(`screen${i}`);
      if (screenEl) {
        if (i === step) {
          screenEl.classList.add('active');
        } else {
          screenEl.classList.remove('active');
        }
      }
    }

    // Update step dots
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach(dot => {
      const s = parseInt(dot.getAttribute('data-step'));
      if (s === step) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Special screen triggers
    if (step === 2) {
      this.particles.startConfetti(6000);
    } else {
      this.particles.stopConfetti();
    }

    if (step === 3) {
      // Trigger resize so WebGL canvas fits container dimensions
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }

    if (step === 5 && this.candleBlown) {
      this.particles.triggerFireworks();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // Screen 1: Lock Screen
  // ==========================================
  initScreen1() {
    const passInput = document.getElementById('passcodeInput');
    const eyeToggle = document.getElementById('eyeToggle');
    const unlockBtn = document.getElementById('unlockBtn');
    const lockCard = document.getElementById('lockCard');
    const padlock = document.getElementById('padlockIcon');
    const passHint = document.getElementById('passcodeHint');

    if (passHint && this.config.passcodeHint) {
      passHint.textContent = this.config.passcodeHint;
    }

    if (eyeToggle && passInput) {
      eyeToggle.addEventListener('click', () => {
        if (passInput.type === 'password') {
          passInput.type = 'text';
          eyeToggle.textContent = '🙈';
        } else {
          passInput.type = 'password';
          eyeToggle.textContent = '👁';
        }
      });
    }

    const tryUnlock = () => {
      const entered = passInput ? passInput.value.trim() : '';
      const validPasscodes = [this.config.passcode, '22', '2208', '22/08', 'thraveen'];

      // Allow if matches or if empty with gentle unlock
      if (validPasscodes.includes(entered.toLowerCase()) || entered === '') {
        if (padlock) padlock.classList.add('unlocking');
        this.sound.playUnlockSound();

        if (this.config.music.autoplayOnUnlock) {
          setTimeout(() => {
            this.sound.playMusic();
          }, 300);
        }

        setTimeout(() => {
          this.updateScreen(2);
        }, 650);
      } else {
        // Shake error
        if (lockCard) {
          lockCard.classList.remove('shake');
          void lockCard.offsetWidth; // trigger reflow
          lockCard.classList.add('shake');
        }
        if (passHint) {
          passHint.style.color = '#ff4b82';
          passHint.textContent = 'Incorrect passcode! ' + this.config.passcodeHint;
        }
      }
    };

    if (unlockBtn) {
      unlockBtn.addEventListener('click', tryUnlock);
    }
    if (passInput) {
      passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') tryUnlock();
      });
    }
  }

  // ==========================================
  // Screen 2: Birthday Greeting
  // ==========================================
  initScreen2() {
    const unfoldBtn = document.getElementById('unfoldLoveBtn');
    if (unfoldBtn) {
      unfoldBtn.addEventListener('click', () => {
        this.sound.playClickSound();
        this.updateScreen(3);
      });
    }
  }

  // ==========================================
  // Screen 3: 3D InfiniteMenu + Polaroid Gallery
  // ==========================================
  initScreen3() {
    const toLetterBtn = document.getElementById('toLetterBtn');
    const view3dBtn = document.getElementById('view3dBtn');
    const viewPolaroidBtn = document.getElementById('viewPolaroidBtn');
    const infiniteSection = document.getElementById('infiniteMenuSection');
    const polaroidGallery = document.getElementById('polaroidGallery');

    // 1. Mount 3D InfiniteMenu from React Bits
    if (this.config.memories && this.config.memories.length > 0) {
      const menuItems = this.config.memories.map(mem => ({
        image: mem.image,
        title: mem.caption,
        description: mem.note.length > 60 ? mem.note.substring(0, 58) + '...' : mem.note,
        fullPhoto: mem.fullPhoto,
        date: mem.date,
        note: mem.note,
        caption: mem.caption,
        link: '#'
      }));

      mountInfiniteMenu('infiniteMenuContainer', menuItems, (item) => {
        this.sound.playClickSound();
        this.openLightbox(item);
      });
    }

    // 2. Render Polaroid Cards as alternate view
    if (polaroidGallery && this.config.memories) {
      polaroidGallery.innerHTML = '';
      this.config.memories.forEach((mem) => {
        const card = document.createElement('div');
        card.className = 'polaroid-card-item';
        card.style.transform = `rotate(${mem.rotation || 0}deg)`;
        card.setAttribute('title', `Click to view: ${mem.caption}`);

        card.innerHTML = `
          <div class="polaroid-wrapper">
            <img src="${mem.image}" alt="${mem.caption}" class="polaroid-img" loading="lazy" />
          </div>
        `;

        card.addEventListener('click', () => {
          this.sound.playClickSound();
          this.openLightbox(mem);
        });

        polaroidGallery.appendChild(card);
      });
    }

    // 3. Tab buttons to toggle between 3D Sphere and Polaroids
    if (view3dBtn && viewPolaroidBtn) {
      view3dBtn.addEventListener('click', () => {
        this.sound.playClickSound();
        view3dBtn.classList.add('active');
        viewPolaroidBtn.classList.remove('active');
        if (infiniteSection) infiniteSection.style.display = 'block';
        if (polaroidGallery) polaroidGallery.style.display = 'none';
        window.dispatchEvent(new Event('resize'));
      });

      viewPolaroidBtn.addEventListener('click', () => {
        this.sound.playClickSound();
        viewPolaroidBtn.classList.add('active');
        view3dBtn.classList.remove('active');
        if (infiniteSection) infiniteSection.style.display = 'none';
        if (polaroidGallery) polaroidGallery.style.display = 'flex';
      });
    }

    // 4. Button to open letter (Screen 4)
    if (toLetterBtn) {
      toLetterBtn.addEventListener('click', () => {
        this.sound.playClickSound();
        this.updateScreen(4);
      });
    }
  }

  openLightbox(memory) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const date = document.getElementById('lightboxDate');
    const note = document.getElementById('lightboxNote');

    if (img) img.src = memory.fullPhoto || memory.image;
    if (caption) caption.textContent = memory.caption || memory.title;
    if (date) date.textContent = memory.date || 'Sweet Memory';
    if (note) note.textContent = memory.note || memory.description || '';

    if (modal) modal.classList.add('active');
  }

  // ==========================================
  // Screen 4: Love Letter
  // ==========================================
  initScreen4() {
    const toScreen5Btn = document.getElementById('toScreen5Btn');
    if (toScreen5Btn) {
      toScreen5Btn.addEventListener('click', () => {
        this.sound.playClickSound();
        this.updateScreen(5);
      });
    }
  }

  // ==========================================
  // Screen 5: Grand Finale Cake & Fireworks
  // ==========================================
  initScreen5() {
    const cakeContainer = document.getElementById('cakeContainer');
    const candleFlame = document.getElementById('candleFlame');
    const candleHint = document.getElementById('candleHint');

    const blowCandle = () => {
      if (this.candleBlown) return;
      this.candleBlown = true;

      if (candleFlame) candleFlame.classList.add('blown-out');
      if (candleHint) {
        candleHint.textContent = '✨ Wish Made! Forever Yours ❤️';
        candleHint.style.color = '#ff9ebb';
      }

      // Coordinates of the candle
      const rect = candleFlame ? candleFlame.getBoundingClientRect() : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const centerX = rect.left + 8;
      const centerY = rect.top + 10;

      // Candle smoke effect
      this.particles.triggerCandleSmoke(centerX, centerY);

      // Audio effects
      this.sound.playCandleBlowSound();
      setTimeout(() => {
        this.sound.playFireworksSound();
      }, 400);

      // Trigger spectacular fireworks
      setTimeout(() => {
        this.particles.triggerFireworks(window.innerWidth / 2, window.innerHeight * 0.35, 7);
      }, 300);
    };

    if (cakeContainer) {
      cakeContainer.addEventListener('click', blowCandle);
    }
  }

  // ==========================================
  // Finale Modals (Story, Love, Forever, Always)
  // ==========================================
  initModals() {
    const modal = document.getElementById('infoModal');
    const titleEl = document.getElementById('infoModalTitle');
    const bodyEl = document.getElementById('infoModalBody');

    const openInfo = (title, htmlContent) => {
      this.sound.playClickSound();
      if (titleEl) titleEl.innerHTML = title;
      if (bodyEl) bodyEl.innerHTML = htmlContent;
      if (modal) modal.classList.add('active');
    };

    // Story
    const btnStory = document.getElementById('btnStory');
    if (btnStory) {
      btnStory.addEventListener('click', () => {
        const storyData = this.config.finale.modals.story;
        let html = '<div class="timeline">';
        storyData.items.forEach(item => {
          html += `
            <div class="timeline-item">
              <div class="timeline-date">${item.date}</div>
              <div class="timeline-heading">${item.title}</div>
              <div class="timeline-desc">${item.desc}</div>
            </div>
          `;
        });
        html += '</div>';
        openInfo(storyData.title, html);
      });
    }

    // Love
    const btnLove = document.getElementById('btnLove');
    if (btnLove) {
      btnLove.addEventListener('click', () => {
        const loveData = this.config.finale.modals.love;
        let html = '<div class="reasons-list">';
        loveData.reasons.forEach(reason => {
          html += `
            <div class="reason-item">
              <span class="heart-bullet">💖</span>
              <span>${reason}</span>
            </div>
          `;
        });
        html += '</div>';
        openInfo(loveData.title, html);
      });
    }

    // Forever
    const btnForever = document.getElementById('btnForever');
    if (btnForever) {
      btnForever.addEventListener('click', () => {
        const foreverData = this.config.finale.modals.forever;
        const html = `
          <div style="text-align: center; padding: 10px 0;">
            <div style="font-size: 3rem; margin-bottom: 12px; filter: drop-shadow(0 0 10px #ff2a6d);">♾️</div>
            <p style="font-size: 1.05rem; line-height: 1.7; color: #ffe6ef;">${foreverData.content}</p>
          </div>
        `;
        openInfo(foreverData.title, html);
      });
    }

    // Always
    const btnAlways = document.getElementById('btnAlways');
    if (btnAlways) {
      btnAlways.addEventListener('click', () => {
        const alwaysData = this.config.finale.modals.always;
        const html = `
          <div style="text-align: center; padding: 10px 0;">
            <div style="font-size: 2.8rem; margin-bottom: 12px; filter: drop-shadow(0 0 10px #ffd166);">✨</div>
            <p style="font-size: 1.05rem; line-height: 1.7; color: #ffe6ef; margin-bottom: 20px;">${alwaysData.content}</p>
            <button id="replayJourneyBtn" class="btn-primary" style="margin: 0 auto; max-width: 220px;">Replay Our Journey 💫</button>
          </div>
        `;
        openInfo(alwaysData.title, html);

        const replayBtn = document.getElementById('replayJourneyBtn');
        if (replayBtn) {
          replayBtn.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
            this.candleBlown = false;
            const flame = document.getElementById('candleFlame');
            if (flame) flame.classList.remove('blown-out');
            const hint = document.getElementById('candleHint');
            if (hint) hint.textContent = 'Tap the candle to make a wish & blow it out! 🕯️✨';
            this.updateScreen(1);
          });
        }
      });
    }

    // Close buttons
    const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target === btn || e.target.classList.contains('modal-close-btn')) {
          document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
      });
    });
  }
}

// Start app once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new BirthdayApp();
});
