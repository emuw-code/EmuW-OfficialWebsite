document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // --- Gradient Cursor Blob (All Devices) ---
  const cursorBlob = document.createElement('div');
  cursorBlob.classList.add('cursor-blob');
  document.body.appendChild(cursorBlob);

  const moveCursor = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    gsap.to(cursorBlob, { 
      duration: 0.3, 
      x: clientX, 
      y: clientY, 
      ease: 'power2.out'
    });
  };

  document.addEventListener('mousemove', moveCursor);
  document.addEventListener('touchmove', moveCursor);

  let scrollTimeout;
  const onScroll = () => {
    cursorBlob.style.visibility = 'hidden';
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      cursorBlob.style.visibility = 'visible';
    }, 150);
  };
  document.addEventListener('scroll', onScroll);

  // --- Cursor Interactions (All Devices) ---
  const onMouseDown = () => cursorBlob.classList.add('clicked');
  const onMouseUp = () => cursorBlob.classList.remove('clicked');

  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchstart', onMouseDown);
  document.addEventListener('touchend', onMouseUp);

  // --- PC-Specific Interactive Effect ---
  if (!isTouchDevice()) {
    const interactiveElements = document.querySelectorAll('a, button, .menu-toggle');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorBlob.classList.add('interactive'));
      el.addEventListener('mouseleave', () => cursorBlob.classList.remove('interactive'));
    });
  }

  // --- Preloader Animation --- 
  const preloader = document.getElementById('preloader');
  const mainContent = document.getElementById('main-content');
  const progressBar = document.getElementById('preloader-progress-bar');
  const percentage = document.getElementById('preloader-percentage');
  const preloaderBrandMain = document.querySelector('.preloader-brand-main');
  const preloaderBrandSub = document.querySelector('.preloader-brand-sub');

  const preloaderTl = gsap.timeline({ 
    onComplete: () => {
      gsap.to(mainContent, { opacity: 1, visibility: 'visible', duration: 0.5 });
    }
  });

  preloaderTl
    .to(preloaderBrandMain, { opacity: 1, duration: 0.5, ease: 'power1.in' })
    .to(preloaderBrandSub, { opacity: 1, duration: 0.5, ease: 'power1.in' }, '-=0.2')
    .to(progressBar, { 
      width: '100%',
      duration: 1.2, 
      ease: 'power2.inOut',
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        percentage.textContent = `${progress}%`;
      }
    }, '-=0.5')
    .to(preloader.querySelector('.preloader-content'), { opacity: 0, duration: 0.3 }, '+=0.1')
    .to('.preloader-curtain.left', { x: '-100%', duration: 0.8, ease: 'power3.inOut' })
    .to('.preloader-curtain.right', { x: '100%', duration: 0.8, ease: 'power3.inOut' }, '<')
    .set(preloader, { display: 'none' });

  // --- Mobile Menu --- 
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isMenuOpen = navLinks.classList.toggle('show');
    menuToggle.classList.toggle('menu-open', isMenuOpen);
    document.body.classList.toggle('menu-open', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  });

  // --- GSAP Animations ---
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-pf', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '+=0.5');
  tl.fromTo('.brand-main', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '-=0.7');
  tl.fromTo('.brand-sub', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '-=0.7');

  // --- Elegant Character-by-character subtitle animation ---
  const subtitle = document.querySelector('.hero-subtitle');
  const text = subtitle.textContent.trim();
  subtitle.innerHTML = ''; // Clear original text

  text.split('').forEach(char => {
    const charSpan = document.createElement('span');
    charSpan.className = 'char';
    charSpan.textContent = char === ' ' ? '\u00A0' : char; // Replace space with non-breaking space
    subtitle.appendChild(charSpan);
  });

  tl.fromTo('.hero-subtitle .char', 
    { 
      opacity: 0, 
      y: 20,
      filter: 'blur(5px)'
    },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: 0.08, // Time between each character appearing
      duration: 1,
      ease: 'power3.out'
    }, '-=0.5');

  // --- Smooth Scrolling for Nav Links ---
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          if (navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            menuToggle.classList.remove('menu-open');
            document.body.style.overflow = '';
          }

          const offset = 68; 
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = targetElement.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- Album Carousel ---
  const container = document.querySelector('.album-container');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  const albumItems = Array.from(container.children);
  for (let i = albumItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [albumItems[i], albumItems[j]] = [albumItems[j], albumItems[i]];
  }
  albumItems.forEach(item => container.appendChild(item));

  if (container && prevBtn && nextBtn) {
    const albumItem = container.querySelector('.album-item');
    if (albumItem) {
      const itemWidth = albumItem.offsetWidth + parseFloat(getComputedStyle(container).gap);

      prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
      });
    }
  }

  // --- GSAP ScrollTrigger Animations ---
  gsap.registerPlugin(ScrollTrigger);

  const sections = document.querySelectorAll('.fade-in-section');
  sections.forEach(section => {
    gsap.fromTo(section, 
      { opacity: 0, y: 50 }, 
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  const albumItemsForScroll = document.querySelectorAll('.album-item');
  if (isTouchDevice()) {
    albumItemsForScroll.forEach(item => {
      gsap.fromTo(item, 
        { opacity: 0, y: 50 }, 
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  } else {
    albumItemsForScroll.forEach(item => {
      gsap.fromTo(item, 
        { opacity: 0, y: 50, rotationZ: -10 }, 
        {
          opacity: 1,
          y: 0,
          rotationZ: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // --- 3D Hover effect for album items (PC Only) ---
    const albumItemsFor3D = document.querySelectorAll('.album-item');
    albumItemsFor3D.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(item, {
          duration: 0.5,
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          duration: 0.5,
          rotationX: 0,
          rotationY: 0,
          ease: 'power2.out'
        });
      });
    });
  }

  // --- Parallax for Hero Background ---
  gsap.to('body', {
      scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: self => {
              document.documentElement.style.setProperty('--parallax-y', `${self.progress * 150}px`);
          }
      }
  });

  // --- Reveal effect for Section Titles (h2) ---
  const sectionTitles = document.querySelectorAll('section h2');
  sectionTitles.forEach(title => {
    const originalText = title.innerHTML;
    title.innerHTML = `<span class="h2-inner">${originalText}</span>`;
    const mask = document.createElement('span');
    mask.className = 'reveal-mask';
    title.appendChild(mask);

    gsap.fromTo(mask, 
      { x: '0%' },
      {
        x: '101%', 
        duration: 1.2, 
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // --- Particle.js initialization ---
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray;

  class Particle {
      constructor(x, y, directionX, directionY, size, color) {
          this.x = x;
          this.y = y;
          this.directionX = directionX;
          this.directionY = directionY;
          this.size = size;
          this.color = color;
      }
      draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
          ctx.fillStyle = 'rgba(232, 179, 143, 0.15)';
          ctx.fill();
      }
      update() {
          if (this.x > canvas.width || this.x < 0) {
              this.directionX = -this.directionX;
          }
          if (this.y > canvas.height || this.y < 0) {
              this.directionY = -this.directionY;
          }
          this.x += this.directionX;
          this.y += this.directionY;
          this.draw();
      }
  }

  function init() {
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 25000;
      for (let i = 0; i < numberOfParticles; i++) {
          let size = (Math.random() * 2) + 1;
          let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
          let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
          let directionX = (Math.random() * 0.4) - 0.2;
          let directionY = (Math.random() * 0.4) - 0.2;
          let color = 'rgba(232, 179, 143, 0.15)';
          particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
  }

  function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0,0,innerWidth, innerHeight);
      for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
      }
  }

  window.addEventListener('resize', () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      init();
  });

  init();
  animate();
});
