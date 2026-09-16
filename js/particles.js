// Romantic Particles Engine: Ambient Bokeh Hearts, Confetti, and Fireworks

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
    this.fireworks = [];
    this.fireworkParticles = [];
    this.smokeParticles = [];

    this.confettiActive = false;
    this.fireworksActive = false;

    this.initAmbient();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    });
  }

  // Draw a crisp heart shape
  drawHeart(ctx, x, y, size, color, alpha = 1, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 20, size / 20);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -10, -20, 5, 0, 20);
    ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  initAmbient() {
    this.ambientHearts = [];
    this.dustParticles = [];

    const heartCount = Math.min(Math.floor(window.innerWidth / 35), 35);
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

    const dustCount = Math.min(Math.floor(window.innerWidth / 20), 60);
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

  startConfetti(durationMs = 6000) {
    this.confettiActive = true;
    this.confettiParticles = [];
    const colors = ['#ff2a6d', '#ffd166', '#ff7597', '#ffffff', '#ff9ebb', '#e040fb'];

    const count = Math.min(Math.floor(window.innerWidth / 10), 120);
    for (let i = 0; i < count; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * -this.height * 0.8,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 2.5 + 1.5,
        speedX: (Math.random() - 0.5) * 1.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        shape: Math.random() > 0.3 ? 'rect' : 'heart',
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

  // Fireworks engine for Screen 6
  triggerFireworks(x, y, count = 5) {
    this.fireworksActive = true;
    const colors = ['#ff2a6d', '#ffd166', '#ff7597', '#ffffff', '#ff1493', '#ffc107', '#ff4081'];

    for (let f = 0; f < count; f++) {
      setTimeout(() => {
        const targetX = x !== undefined ? x + (Math.random() - 0.5) * 200 : Math.random() * (this.width - 200) + 100;
        const targetY = y !== undefined ? y + (Math.random() - 0.5) * 100 : Math.random() * (this.height * 0.5) + 100;
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Burst particles
        const particleCount = 45;
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.2;
          const speed = Math.random() * 4.5 + 2;
          this.fireworkParticles.push({
            x: targetX,
            y: targetY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: color,
            size: Math.random() * 2.5 + 1.5,
            decay: Math.random() * 0.015 + 0.01,
            trail: []
          });
        }
      }, f * 350);
    }
  }

  triggerCandleSmoke(x, y) {
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        this.smokeParticles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.5 + 1),
          size: Math.random() * 4 + 3,
          growth: Math.random() * 0.12 + 0.08,
          alpha: 0.65,
          decay: Math.random() * 0.01 + 0.008
        });
      }, i * 40);
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

    // 3. Render Confetti
    if (this.confettiParticles.length > 0) {
      for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
        const p = this.confettiParticles[i];
        p.y += p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 1.5 + p.speedX;
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

    // 4. Render Fireworks Particles
    if (this.fireworkParticles.length > 0) {
      for (let i = this.fireworkParticles.length - 1; i >= 0; i--) {
        const fp = this.fireworkParticles[i];
        fp.x += fp.vx;
        fp.y += fp.vy;
        fp.vy += 0.06; // gravity
        fp.vx *= 0.98; // air resistance
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

    // 5. Render Candle Smoke
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
