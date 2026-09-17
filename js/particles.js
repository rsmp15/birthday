// Romantic Particles Engine: Ambient Bokeh Hearts, Cursor Trail, Pop-able Love Bubbles, Confetti, and Multi-Stage Fireworks

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;

    // Ambient floating hearts & dust
    this.ambientHearts = [];
    this.dustParticles = [];
    this.confettiParticles = [];
    this.fireworkRockets = [];
    this.fireworkParticles = [];
    this.smokeParticles = [];
    this.cursorParticles = [];
    this.clickBursts = [];
    this.loveBubbles = [];
    this.skyLanterns = [];

    this.confettiActive = false;
    this.fireworksActive = false;
    this.continuousFireworksInterval = null;

    this.initAmbient();
    this.initLoveBubbles();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    });

    // Cursor heart trail
    let lastMoveTime = 0;
    const addCursorTrail = (x, y) => {
      const now = performance.now();
      if (now - lastMoveTime < 24) return; // throttle to ~40fps
      lastMoveTime = now;

      const isHeart = Math.random() > 0.4;
      this.cursorParticles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 1.5 + 0.8), // float up
        size: isHeart ? Math.random() * 8 + 6 : Math.random() * 3 + 2,
        color: isHeart ? (Math.random() > 0.5 ? '#ff2a6d' : '#ff7597') : '#ffd166',
        alpha: 0.9,
        decay: Math.random() * 0.02 + 0.015,
        rotation: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        isHeart: isHeart
      });
    };

    window.addEventListener('mousemove', (e) => {
      addCursorTrail(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        addCursorTrail(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  // Draw a crisp heart shape
  drawHeart(ctx, x, y, size, color, alpha = 1, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 20, size / 20);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -10, -20, 5, 0, 20);
    ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw a 4-point golden twinkle star
  drawStar(ctx, x, y, size, color, alpha = 1, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  initAmbient() {
    this.ambientHearts = [];
    this.dustParticles = [];

    const heartCount = Math.min(Math.floor(window.innerWidth / 32), 35);
    for (let i = 0; i < heartCount; i++) {
      this.ambientHearts.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 16 + 8,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: Math.sin(Math.random() * Math.PI) * 0.3,
        rotation: (Math.random() - 0.5) * 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        color: Math.random() > 0.4 ? '#ff2a6d' : (Math.random() > 0.5 ? '#ff7597' : '#9b1d50'),
        alpha: Math.random() * 0.35 + 0.1,
        baseAlpha: Math.random() * 0.3 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulse: Math.random() * Math.PI
      });
    }

    const dustCount = Math.min(Math.floor(window.innerWidth / 18), 65);
    for (let i = 0; i < dustCount; i++) {
      this.dustParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.3 ? '#ff9ebb' : '#ffd166'
      });
    }
  }

  // Initialize pop-able floating love bubbles
  initLoveBubbles() {
    this.loveBubbles = [];
    const count = Math.min(Math.floor(window.innerWidth / 140), 9);
    for (let i = 0; i < count; i++) {
      this.loveBubbles.push(this.createBubble(true));
    }
  }

  createBubble(randomY = false) {
    return {
      x: Math.random() * (this.width - 80) + 40,
      y: randomY ? Math.random() * this.height : this.height + Math.random() * 100 + 40,
      radius: Math.random() * 16 + 22, // 22px to 38px
      speedY: Math.random() * 0.5 + 0.35,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.025 + 0.015,
      wobbleAmp: Math.random() * 1.5 + 0.5,
      heartPulse: Math.random() * Math.PI * 2,
      heartColor: Math.random() > 0.5 ? '#ff2a6d' : '#ff7597',
      popped: false
    };
  }

  // Check if a click/tap coordinates hit any floating love bubble
  checkBubblePop(x, y, onPopCallback) {
    for (let i = 0; i < this.loveBubbles.length; i++) {
      const b = this.loveBubbles[i];
      if (b.popped) continue;
      const dx = x - b.x;
      const dy = y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= b.radius + 15) {
        // Pop it!
        b.popped = true;
        this.triggerBubblePop(b.x, b.y, b.radius);
        if (onPopCallback) onPopCallback(b);

        // Respawn after 4 seconds
        setTimeout(() => {
          this.loveBubbles[i] = this.createBubble(false);
        }, 4000);
        return true;
      }
    }
    return false;
  }

  // Pop animation: burst of 16 mini-hearts & sparkly bubbles
  triggerBubblePop(x, y, radius) {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 3.5 + 1.8;
      this.clickBursts.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 5,
        color: Math.random() > 0.4 ? '#ff2a6d' : (Math.random() > 0.5 ? '#ff9ebb' : '#ffffff'),
        alpha: 1,
        decay: Math.random() * 0.025 + 0.02,
        isHeart: Math.random() > 0.35,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.1
      });
    }
  }

  // Trigger burst anywhere user clicks/taps
  triggerClickBurst(x, y) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 4.2 + 1.5;
      const isStar = Math.random() > 0.5;
      this.clickBursts.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5, // slight upward bias
        size: isStar ? Math.random() * 7 + 4 : Math.random() * 9 + 6,
        color: Math.random() > 0.4 ? '#ff2a6d' : (Math.random() > 0.5 ? '#ffd166' : '#ff7597'),
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        isHeart: !isStar,
        isStar: isStar,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.12
      });
    }
  }

  startConfetti(durationMs = 6000) {
    this.confettiActive = true;
    this.confettiParticles = [];
    const colors = ['#ff2a6d', '#ffd166', '#ff7597', '#ffffff', '#ff9ebb', '#e040fb', '#ff3366'];

    const count = Math.min(Math.floor(window.innerWidth / 8), 140);
    for (let i = 0; i < count; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * -this.height * 0.8,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 2.8 + 1.6,
        speedX: (Math.random() - 0.5) * 1.6,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        shape: Math.random() > 0.35 ? 'rect' : 'heart',
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.08 + 0.04
      });
    }

    if (durationMs > 0) {
      setTimeout(() => {
        this.confettiActive = false;
      }, durationMs);
    }
  }

  stopConfetti() {
    this.confettiActive = false;
  }

  // Multi-Stage Fireworks Engine with ascending rockets, willows & floating sky lanterns
  triggerFireworks(x, y, count = 6) {
    this.fireworksActive = true;
    const colors = [
      '#ff2a6d', '#ffd166', '#ff7597', '#ffffff', '#ff1493',
      '#ffc107', '#ff4081', '#7000ff', '#00f0ff'
    ];

    for (let f = 0; f < count; f++) {
      setTimeout(() => {
        const startX = Math.random() * (this.width - 200) + 100;
        const targetX = x !== undefined ? x + (Math.random() - 0.5) * 260 : Math.random() * (this.width - 200) + 100;
        const targetY = y !== undefined ? y + (Math.random() - 0.5) * 120 : Math.random() * (this.height * 0.45) + 80;
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Launch ascending rocket
        this.fireworkRockets.push({
          x: startX,
          y: this.height + 20,
          targetX: targetX,
          targetY: targetY,
          vx: (targetX - startX) / 32,
          vy: (targetY - (this.height + 20)) / 32,
          color: color,
          trail: []
        });

        // Launch floating sky lantern occasionally
        if (Math.random() > 0.5) {
          this.skyLanterns.push({
            x: targetX + (Math.random() - 0.5) * 150,
            y: this.height + 40,
            speedY: Math.random() * 0.6 + 0.4,
            speedX: (Math.random() - 0.5) * 0.3,
            wobble: Math.random() * Math.PI,
            alpha: 0.9,
            size: Math.random() * 12 + 16,
            color: '#ffd166'
          });
        }
      }, f * 360);
    }
  }

  // Explode rocket into multi-layered burst
  explodeRocket(rocket) {
    const burstColors = [rocket.color, '#ffd166', '#ffffff', '#ff9ebb'];
    const isWillow = Math.random() > 0.4;
    const particleCount = isWillow ? 60 : 45;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.25;
      const speed = isWillow ? (Math.random() * 5.2 + 2) : (Math.random() * 4.2 + 1.8);
      const color = burstColors[Math.floor(Math.random() * burstColors.length)];

      this.fireworkParticles.push({
        x: rocket.targetX,
        y: rocket.targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: color,
        size: Math.random() * 2.5 + 1.5,
        decay: isWillow ? (Math.random() * 0.012 + 0.007) : (Math.random() * 0.018 + 0.012),
        isWillow: isWillow,
        gravity: isWillow ? 0.075 : 0.05
      });
    }
  }

  startContinuousCelebration() {
    if (this.continuousFireworksInterval) return;
    this.triggerFireworks(window.innerWidth / 2, window.innerHeight * 0.3, 5);
    this.continuousFireworksInterval = setInterval(() => {
      this.triggerFireworks(undefined, undefined, 2);
    }, 2800);
  }

  stopContinuousCelebration() {
    if (this.continuousFireworksInterval) {
      clearInterval(this.continuousFireworksInterval);
      this.continuousFireworksInterval = null;
    }
  }

  triggerCandleSmoke(x, y) {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        this.smokeParticles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y,
          vx: (Math.random() - 0.5) * 0.9,
          vy: -(Math.random() * 1.8 + 1),
          size: Math.random() * 4 + 3,
          growth: Math.random() * 0.14 + 0.08,
          alpha: 0.7,
          decay: Math.random() * 0.01 + 0.007
        });
      }, i * 35);
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Floating Ambient Hearts
    for (const h of this.ambientHearts) {
      h.y -= h.speedY;
      h.x += Math.sin(h.pulse) * 0.3;
      h.pulse += h.pulseSpeed;
      h.rotation += h.rotSpeed;
      h.alpha = h.baseAlpha + Math.sin(h.pulse) * 0.1;

      if (h.y < -30) {
        h.y = this.height + 30;
        h.x = Math.random() * this.width;
      }

      this.drawHeart(this.ctx, h.x, h.y, h.size, h.color, h.alpha, h.rotation);
    }

    // 2. Render Ambient Dust / Bokeh Orbs
    for (const d of this.dustParticles) {
      d.y -= d.speedY;
      d.x += d.speedX;
      if (d.y < -10) {
        d.y = this.height + 10;
        d.x = Math.random() * this.width;
      }
      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = d.color;
      this.ctx.globalAlpha = d.alpha;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = d.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 3. Render Pop-able Floating Love Bubbles
    for (const b of this.loveBubbles) {
      if (b.popped) continue;
      b.y -= b.speedY;
      b.wobble += b.wobbleSpeed;
      b.x += Math.sin(b.wobble) * b.wobbleAmp;
      b.heartPulse += 0.04;

      if (b.y < -b.radius * 2) {
        b.y = this.height + b.radius * 2;
        b.x = Math.random() * (this.width - 80) + 40;
      }

      // Outer iridescent bubble sphere
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);

      // Bubble gradient
      const bubbleGrad = this.ctx.createRadialGradient(
        b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.1,
        b.x, b.y, b.radius
      );
      bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      bubbleGrad.addColorStop(0.5, 'rgba(255, 120, 180, 0.25)');
      bubbleGrad.addColorStop(0.85, 'rgba(255, 42, 109, 0.15)');
      bubbleGrad.addColorStop(1, 'rgba(255, 80, 140, 0.55)');

      this.ctx.fillStyle = bubbleGrad;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(255, 80, 140, 0.4)';
      this.ctx.fill();

      // Bubble specular highlight
      this.ctx.beginPath();
      this.ctx.ellipse(
        b.x - b.radius * 0.35, b.y - b.radius * 0.35,
        b.radius * 0.32, b.radius * 0.16,
        -Math.PI / 4, 0, Math.PI * 2
      );
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      this.ctx.fill();
      this.ctx.restore();

      // Pulsing miniature beating heart inside the bubble
      const heartScale = 0.85 + Math.sin(b.heartPulse) * 0.15;
      this.drawHeart(
        this.ctx,
        b.x,
        b.y - 1,
        (b.radius * 0.55) * heartScale,
        b.heartColor,
        0.88,
        0
      );
    }

    // 4. Render Cursor Trail
    if (this.cursorParticles.length > 0) {
      for (let i = this.cursorParticles.length - 1; i >= 0; i--) {
        const cp = this.cursorParticles[i];
        cp.x += cp.vx;
        cp.y += cp.vy;
        cp.rotation += cp.rotSpeed;
        cp.alpha -= cp.decay;

        if (cp.alpha <= 0) {
          this.cursorParticles.splice(i, 1);
          continue;
        }

        if (cp.isHeart) {
          this.drawHeart(this.ctx, cp.x, cp.y, cp.size, cp.color, cp.alpha, cp.rotation);
        } else {
          this.drawStar(this.ctx, cp.x, cp.y, cp.size, cp.color, cp.alpha, cp.rotation);
        }
      }
    }

    // 5. Render Click Bursts
    if (this.clickBursts.length > 0) {
      for (let i = this.clickBursts.length - 1; i >= 0; i--) {
        const cb = this.clickBursts[i];
        cb.x += cb.vx;
        cb.y += cb.vy;
        cb.vy += 0.04; // gravity
        cb.vx *= 0.97;
        cb.rotation += cb.rotSpeed;
        cb.alpha -= cb.decay;

        if (cb.alpha <= 0) {
          this.clickBursts.splice(i, 1);
          continue;
        }

        if (cb.isHeart) {
          this.drawHeart(this.ctx, cb.x, cb.y, cb.size, cb.color, cb.alpha, cb.rotation);
        } else if (cb.isStar) {
          this.drawStar(this.ctx, cb.x, cb.y, cb.size, cb.color, cb.alpha, cb.rotation);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(cb.x, cb.y, cb.size / 2, 0, Math.PI * 2);
          this.ctx.fillStyle = cb.color;
          this.ctx.globalAlpha = cb.alpha;
          this.ctx.fill();
        }
      }
    }

    // 6. Render Ascending Firework Rockets
    if (this.fireworkRockets.length > 0) {
      for (let i = this.fireworkRockets.length - 1; i >= 0; i--) {
        const r = this.fireworkRockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Spark trail behind rocket
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = r.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Check if reached destination
        if (r.y <= r.targetY) {
          this.explodeRocket(r);
          this.fireworkRockets.splice(i, 1);
        }
      }
    }

    // 7. Render Fireworks Particles (Chrysanthemums & Willows)
    if (this.fireworkParticles.length > 0) {
      for (let i = this.fireworkParticles.length - 1; i >= 0; i--) {
        const fp = this.fireworkParticles[i];
        fp.x += fp.vx;
        fp.y += fp.vy;
        fp.vy += fp.gravity;
        fp.vx *= 0.975;
        fp.alpha -= fp.decay;

        if (fp.alpha <= 0) {
          this.fireworkParticles.splice(i, 1);
          continue;
        }

        this.ctx.beginPath();
        this.ctx.arc(fp.x, fp.y, fp.size, 0, Math.PI * 2);
        this.ctx.fillStyle = fp.color;
        this.ctx.globalAlpha = fp.alpha;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = fp.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    }

    // 8. Render Floating Sky Lanterns
    if (this.skyLanterns.length > 0) {
      for (let i = this.skyLanterns.length - 1; i >= 0; i--) {
        const l = this.skyLanterns[i];
        l.y -= l.speedY;
        l.wobble += 0.02;
        l.x += Math.sin(l.wobble) * l.speedX;

        if (l.y < -50) {
          this.skyLanterns.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(l.x, l.y);
        this.ctx.globalAlpha = l.alpha;

        // Warm lantern glow
        const glowGrad = this.ctx.createRadialGradient(0, 0, 2, 0, 0, l.size);
        glowGrad.addColorStop(0, '#ffffff');
        glowGrad.addColorStop(0.3, '#ffd166');
        glowGrad.addColorStop(0.7, 'rgba(255, 120, 50, 0.4)');
        glowGrad.addColorStop(1, 'rgba(255, 80, 0, 0)');

        this.ctx.fillStyle = glowGrad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, l.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Lantern shape
        this.ctx.fillStyle = 'rgba(255, 200, 100, 0.85)';
        this.ctx.fillRect(-l.size * 0.28, -l.size * 0.35, l.size * 0.56, l.size * 0.7);
        this.ctx.restore();
      }
    }

    // 9. Render Confetti
    if (this.confettiParticles.length > 0) {
      for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
        const p = this.confettiParticles[i];
        p.y += p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 1.6 + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.shape === 'rect') {
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.fillStyle = p.color;
          this.ctx.globalAlpha = 0.9;
          this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          this.ctx.restore();
        } else {
          this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, 0.9, (p.rotation * Math.PI) / 180);
        }

        if (p.y > this.height + 20) {
          if (this.confettiActive) {
            p.y = -20;
            p.x = Math.random() * this.width;
          } else {
            this.confettiParticles.splice(i, 1);
          }
        }
      }
    }

    // 10. Render Candle Smoke
    if (this.smokeParticles.length > 0) {
      for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
        const sm = this.smokeParticles[i];
        sm.x += sm.vx;
        sm.y += sm.vy;
        sm.size += sm.growth;
        sm.alpha -= sm.decay;

        if (sm.alpha <= 0) {
          this.smokeParticles.splice(i, 1);
          continue;
        }

        this.ctx.beginPath();
        this.ctx.arc(sm.x, sm.y, sm.size, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = sm.alpha * 0.35;
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(this.animate);
  }
}

export default ParticleEngine;
