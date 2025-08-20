// ===== BACKGROUND EFFECTS JS =====
// Script universal para luciérnagas y destellos en todas las páginas
// Versión: 1.0

(function () {
  'use strict';    

  class BackgroundEffects {
    constructor() {
      this.firefliesContainer = null;
      this.sparklesContainer = null;
      this.isInitialized = false;
      this.intervalIds = [];
      
      // Configuración adaptable según el dispositivo
      this.config = {
        fireflies: {
          count: this.getOptimalCount('fireflies'),
          minDuration: 6,
          maxDuration: 12,
          colors: ['#00ffff', '#00ffcc', '#33ddff', '#66ffdd']
        },
        sparkles: {
          count: this.getOptimalCount('sparkles'),
          duration: 3,
          colors: ['#ff00ff', '#ff66ff', '#cc00cc', '#ff33cc']
        }
      };
      
      this.init();
    }

    // ===============================
    // Métodos de la clase
    // ===============================

    getOptimalCount(type) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const area = width * height;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      
      if (type === 'fireflies') {
        if (isMobile) return Math.max(4, Math.floor(area / 120000));
        if (isTablet) return Math.max(8, Math.floor(area / 80000));
        return Math.max(12, Math.floor(area / 60000));
      }
      
      if (type === 'sparkles') {
        if (isMobile) return Math.max(3, Math.floor(area / 150000));
        if (isTablet) return Math.max(6, Math.floor(area / 100000));
        return Math.max(8, Math.floor(area / 80000));
      }
      
      return 8;
    }

    init() {
      if (this.isInitialized) return;
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      try {
        this.createContainers();
        this.createFireflies();
        this.createSparkles();
        this.setupEventListeners();
        this.setupAutomaticGeneration();
        this.isInitialized = true;
        
        console.log('🎆 Efectos de fondo activados exitosamente');
      } catch (error) {
        console.warn('⚠️ Error al inicializar efectos de fondo:', error);
      }
    }

    createContainers() {
      this.firefliesContainer = document.getElementById('fireflies');
      if (!this.firefliesContainer) {
        this.firefliesContainer = document.createElement('div');
        this.firefliesContainer.id = 'fireflies';
        this.firefliesContainer.className = 'fireflies';
        document.body.appendChild(this.firefliesContainer);
      }
      
      this.sparklesContainer = document.getElementById('sparkles');
      if (!this.sparklesContainer) {
        this.sparklesContainer = document.createElement('div');
        this.sparklesContainer.id = 'sparkles';
        this.sparklesContainer.className = 'sparkles';
        document.body.appendChild(this.sparklesContainer);
      }
    }

    createFireflies() {
      if (!this.firefliesContainer) return;
      this.firefliesContainer.innerHTML = '';
      
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < this.config.fireflies.count; i++) {
        const firefly = this.createFireflyElement(i);
        fragment.appendChild(firefly);
      }
      this.firefliesContainer.appendChild(fragment);
    }

    createFireflyElement(index) {
      const firefly = document.createElement('div');
      firefly.className = 'firefly';
      firefly.setAttribute('data-index', index);
      
      const leftPosition = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = this.config.fireflies.minDuration + 
                      Math.random() * (this.config.fireflies.maxDuration - this.config.fireflies.minDuration);
      const colorIndex = Math.floor(Math.random() * this.config.fireflies.colors.length);
      const color = this.config.fireflies.colors[colorIndex];
      
      Object.assign(firefly.style, {
        left: leftPosition + '%',
        animationDelay: delay + 's',
        animationDuration: duration + 's',
        background: color,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`
      });
      
      if (Math.random() > 0.8) {
        const size = 3 + Math.random() * 4;
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';
      }
      
      return firefly;
    }

    createSparkles() {
      if (!this.sparklesContainer) return;
      this.sparklesContainer.innerHTML = '';
      
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < this.config.sparkles.count; i++) {
        const sparkle = this.createSparkleElement(i);
        fragment.appendChild(sparkle);
      }
      this.sparklesContainer.appendChild(fragment);
    }

    createSparkleElement(index) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.setAttribute('data-index', index);
      
      const leftPosition = Math.random() * 100;
      const topPosition = Math.random() * 100;
      const delay = Math.random() * this.config.sparkles.duration;
      const colorIndex = Math.floor(Math.random() * this.config.sparkles.colors.length);
      const color = this.config.sparkles.colors[colorIndex];
      
      Object.assign(sparkle.style, {
        left: leftPosition + '%',
        top: topPosition + '%',
        animationDelay: delay + 's',
        background: color
      });
      
      if (Math.random() > 0.7) {
        const size = 4 + Math.random() * 6;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
      }
      
      return sparkle;
    }

    setupEventListeners() {
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => this.handleResize(), 250);
      });
      
      document.addEventListener('visibilitychange', () => {
        this.handleVisibilityChange();
      });
      
      document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    setupAutomaticGeneration() {
      const fireflyInterval = setInterval(() => {
        if (!document.hidden && Math.random() > 0.7) {
          this.addRandomFirefly();
        }
      }, 10000);
      this.intervalIds.push(fireflyInterval);
      
      const sparkleInterval = setInterval(() => {
        if (!document.hidden && Math.random() > 0.8) {
          this.addRandomSparkle();
        }
      }, 15000);
      this.intervalIds.push(sparkleInterval);
      
      const cleanupInterval = setInterval(() => {
        this.cleanupExcessParticles();
      }, 30000);
      this.intervalIds.push(cleanupInterval);
    }

    handleResize() {
      const newFirefliesCount = this.getOptimalCount('fireflies');
      const newSparklesCount = this.getOptimalCount('sparkles');
      
      if (newFirefliesCount !== this.config.fireflies.count || 
          newSparklesCount !== this.config.sparkles.count) {
        
        this.config.fireflies.count = newFirefliesCount;
        this.config.sparkles.count = newSparklesCount;
        
        this.createFireflies();
        this.createSparkles();
      }
    }

    handleVisibilityChange() {
      if (document.hidden) {
        this.pauseEffects();
      } else {
        this.resumeEffects();
      }
    }

    handleKeyDown(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        this.toggle();
        console.log('🎆 Efectos alternados');
      }
      
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        this.createFireflies();
        this.createSparkles();
        console.log('🎆 Efectos recreados');
      }
      
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.debugEffects();
      }
    }

    pauseEffects() {
      const allParticles = document.querySelectorAll('.firefly, .sparkle');
      allParticles.forEach(p => p.style.animationPlayState = 'paused');
    }

    resumeEffects() {
      const allParticles = document.querySelectorAll('.firefly, .sparkle');
      allParticles.forEach(p => p.style.animationPlayState = 'running');
    }

    addRandomFirefly() {
      if (!this.firefliesContainer) return;
      
      const firefly = this.createFireflyElement(-1);
      firefly.style.animationDelay = '0s';
      firefly.style.animationDuration = (6 + Math.random() * 6) + 's';
      firefly.classList.add('temporary');
      
      this.firefliesContainer.appendChild(firefly);
      
      setTimeout(() => {
        if (firefly.parentNode) {
          firefly.parentNode.removeChild(firefly);
        }
      }, 12000);
    }

    addRandomSparkle() {
      if (!this.sparklesContainer) return;
      
      const sparkle = this.createSparkleElement(-1);
      sparkle.style.animationDelay = '0s';
      sparkle.classList.add('temporary');
      
      this.sparklesContainer.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 5000);
    }

    cleanupExcessParticles() {
      const maxFireflies = this.config.fireflies.count * 2;
      const maxSparkles = this.config.sparkles.count * 2;
      
      const fireflies = this.firefliesContainer.querySelectorAll('.firefly');
      if (fireflies.length > maxFireflies) {
        for (let i = 0; i < fireflies.length - maxFireflies; i++) {
          fireflies[i].remove();
        }
      }
      
      const sparkles = this.sparklesContainer.querySelectorAll('.sparkle');
      if (sparkles.length > maxSparkles) {
        for (let i = 0; i < sparkles.length - maxSparkles; i++) {
          sparkles[i].remove();
        }
      }
    }

    toggle() {
      if (this.isInitialized) {
        this.firefliesContainer.classList.toggle('hidden');
        this.sparklesContainer.classList.toggle('hidden');
      }
    }

    debugEffects() {
      console.log('🔥 Debug Efectos:', {
        fireflies: this.firefliesContainer?.children.length,
        sparkles: this.sparklesContainer?.children.length,
        config: this.config
      });
    }
  }

  // ===============================
  // Inicialización global
  // ===============================
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.backgroundEffects) {
      window.backgroundEffects = new BackgroundEffects();
    }
  });

})(); 
            
             