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
    this.initMagneticButtons();
    this.initCardTilt();
    this.initInteractiveBalloons();
    this.initScreen1();
    this.initScreen2();
    this.initScreen3();
    this.initScreen4();
    this.initScreen5();
    this.initModals();
    this.updateScreen(1);
  }

  // Bind top nav, step indicators, and global click bursts / bubble pop
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

    // Global click/tap listener: check love bubble pop or trigger sparkle burst
    window.addEventListener('click', (e) => {
      // Check if clicked a love bubble
      const popped = this.particles.checkBubblePop(e.clientX, e.clientY, (b) => {
        this.sound.playBubblePopSound();
      });
      if (popped) return;

      // If clicked background / non-interactive element, trigger romantic sparkle burst
      const isInteractive = e.target.closest('button, input, a, .mode-tab-btn, .action-card-btn, .polaroid-card-item, .balloon-left, .balloon-right, .balloon-screen2-left, .balloon-screen2-right, .envelope-decoration, .quill-decoration, .cake-container');
      if (!isInteractive) {
        this.particles.triggerClickBurst(e.clientX, e.clientY);
        this.sound.playSparkleBurstSound();
      }
    });
  }

  // Magnetic pull effect on buttons + click ripple
  initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .mode-tab-btn, .action-card-btn, .music-toggle');
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.18;
        const deltaY = (e.clientY - centerY) * 0.18;
        btn.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });

      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        const diameter = Math.max(rect.width, rect.height) * 1.5;
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // 3D Perspective Mouse Tilt Physics on Cards
  initCardTilt() {
    const cards = document.querySelectorAll('.card-tilt-target');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = -((y - centerY) / centerY) * 7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  // Interactive Pop-able Metallic Balloons
  initInteractiveBalloons() {
    const balloonIds = ['balloonS2Left', 'balloonS2Right', 'balloonS5Left', 'balloonS5Right'];
    balloonIds.forEach(id => {
      const b = document.getElementById(id);
      if (!b) return;

      b.addEventListener('click', (e) => {
        e.stopPropagation();
        this.sound.playBalloonPopSound();
        const rect = b.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Trigger confetti and heart burst at balloon location
        this.particles.triggerClickBurst(centerX, centerY);
        this.particles.triggerBubblePop(centerX, centerY, 30);

        b.classList.add('balloon-popped');

        // Respawn after 4 seconds
        setTimeout(() => {
          b.classList.remove('balloon-popped');
        }, 4000);
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

    if (step === 5) {
      if (this.candleBlown) {
        this.particles.startContinuousCelebration();
      }
    } else {
      this.particles.stopContinuousCelebration();
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

    // Padlock hover heartbeat pulse
    if (padlock) {
      padlock.addEventListener('mouseenter', () => {
        padlock.style.animation = 'padlockHeartbeat 1.4s infinite ease-in-out';
      });
      padlock.addEventListener('mouseleave', () => {
        if (!padlock.classList.contains('unlocking')) {
          padlock.style.animation = '';
        }
      });
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
        if (padlock) {
          padlock.classList.add('unlocking');
          const rect = padlock.getBoundingClientRect();
          this.particles.triggerClickBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
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
        card.className = 'polaroid-card-item card-tilt-target';
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
    const envelope = document.getElementById('envelopeDecor');
    const quill = document.getElementById('quillDecor');
    const letterCard = document.getElementById('letterCard');

    // Clicking envelope re-triggers unfolding animation with paper sound
    if (envelope && letterCard) {
      envelope.addEventListener('click', () => {
        this.sound.playPaperUnfoldSound();
        const rect = envelope.getBoundingClientRect();
        this.particles.triggerClickBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

        letterCard.style.animation = 'none';
        void letterCard.offsetWidth; // trigger reflow
        letterCard.style.animation = 'letterUnfold3D 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      });
    }

    // Quill interactive motion on letter hover
    if (quill && letterCard) {
      letterCard.addEventListener('mousemove', (e) => {
        const rect = letterCard.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        quill.style.transform = `rotate(${(relX - 0.5) * 20}deg) scale(1.08)`;
      });
      letterCard.addEventListener('mouseleave', () => {
        quill.style.transform = '';
      });
    }

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

      // Trigger spectacular multi-stage fireworks and continuous celebration
      setTimeout(() => {
        this.particles.triggerFireworks(window.innerWidth / 2, window.innerHeight * 0.35, 8);
        this.particles.startContinuousCelebration();
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
            this.particles.stopContinuousCelebration();
            const flame = document.getElementById('candleFlame');
            if (flame) flame.classList.remove('blown-out');
            const hint = document.getElementById('candleHint');
            if (hint) hint.textContent = 'Tap candle to make a wish & blow it out! 🕯️✨';
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
