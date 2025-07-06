document.addEventListener('DOMContentLoaded', () => {
  // Create and append cursor blob element
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

  const onMouseDown = () => cursorBlob.classList.add('clicked');
  const onMouseUp = () => cursorBlob.classList.remove('clicked');

  // Event listeners for cursor movement and interaction
  document.addEventListener('mousemove', moveCursor);
  document.addEventListener('touchmove', moveCursor);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchstart', onMouseDown);
  document.addEventListener('touchend', onMouseUp);

  // Hide cursor on scroll, show after scroll ends
  let scrollTimeout;
  const onScroll = () => {
    cursorBlob.style.visibility = 'hidden';
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      cursorBlob.style.visibility = 'visible';
    }, 150);
  };

  document.addEventListener('scroll', onScroll);

  // --- Preloader Animation --- 
  const preloader = document.getElementById('preloader');
  const mainContent = document.getElementById('main-content');
  const progressBar = document.getElementById('preloader-progress-bar');
  const percentage = document.getElementById('preloader-percentage');
  const preloaderBrandMain = document.querySelector('.preloader-brand-main');
  const preloaderBrandSub = document.querySelector('.preloader-brand-sub');

  const preloaderTl = gsap.timeline({ 
    onComplete: () => {
      // Ensure main content is visible after preloader is done
      gsap.to(mainContent, { opacity: 1, visibility: 'visible', duration: 0.5 });
    }
  });

  preloaderTl
    .to(preloaderBrandMain, { opacity: 1, duration: 0.5, ease: 'power1.in' })
    .to(preloaderBrandSub, { opacity: 1, duration: 0.5, ease: 'power1.in' }, '-=0.2')
    .to(progressBar, { 
      width: '100%',
      duration: 1.2, // Shorten progress bar animation
      ease: 'power2.inOut',
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        percentage.textContent = `${progress}%`;
      }
    }, '-=0.5')
    .to(preloader.querySelector('.preloader-content'), { opacity: 0, duration: 0.3 }, '+=0.1') // Shorten fade out
    .to('.preloader-curtain.left', { x: '-100%', duration: 0.8, ease: 'power3.inOut' }) // Shorten curtain animation
    .to('.preloader-curtain.right', { x: '100%', duration: 0.8, ease: 'power3.inOut' }, '<') // Shorten curtain animation
    .set(preloader, { display: 'none' });

  // --- End of Preloader Animation ---

  // モバイルメニュー開閉
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isMenuOpen = navLinks.classList.toggle('show');
    menuToggle.classList.toggle('menu-open', isMenuOpen);
    document.body.classList.toggle('menu-open', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  });

  // GSAP Animations
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-pf', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '+=0.5');
  tl.fromTo('.brand-main', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '-=0.7');
  tl.fromTo('.brand-sub', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '-=0.7');

  // Text animation for hero-subtitle
  const subtitle = document.querySelector('.hero-subtitle');
  const chars = subtitle.textContent.split('');
  subtitle.innerHTML = '';
  chars.forEach(char => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.display = 'inline-block'; // Ensure proper spacing
    span.textContent = char;
    subtitle.appendChild(span);
  });

  tl.to('.hero-subtitle .char', {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.5');

  // Glowing animation for subtitle
  tl.to('.hero-subtitle', {
    textShadow: '0 0 10px rgba(248, 233, 221, 0.5), 0 0 20px rgba(232, 179, 143, 0.3)',
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  // Smooth scroll for navigation links
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      // Only prevent default for internal links
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          // Close the menu if it's open
          if (navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            menuToggle.classList.remove('menu-open');
            document.body.style.overflow = ''; // Restore body scroll
          }

          // Scroll to the target element
          const offset = 68; // Navbar height
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

  // アルバムカルーセル
  const container = document.querySelector('.album-container');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  // Randomize album order
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

  // GSAP ScrollTrigger Animations
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
          start: 'top 80%', // Trigger animation when the top of the section is 80% from the top of the viewport
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Enhanced scroll animations for album items based on device type
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const albumItemsForScroll = document.querySelectorAll('.album-item');

  if (isTouchDevice()) {
    // Mobile: Simpler, more performant animation
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
    // Desktop: Richer rotation animation
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
  }

  // Particle.js initialization - Elegant version
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray;

  // get mouse position
  const mouse = {
      x: null,
      y: null,
      radius: (canvas.height/120) * (canvas.width/120) // smaller radius
  }

  window.addEventListener('mousemove', 
      function(event) {
          mouse.x = event.x;
          mouse.y = event.y;
      }
  );

  // create particle
  class Particle {
      constructor(x, y, directionX, directionY, size, color) {
          this.x = x;
          this.y = y;
          this.directionX = directionX;
          this.directionY = directionY;
          this.size = size;
          this.color = color;
      }
      // method to draw individual particle
      draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
          ctx.fillStyle = 'rgba(232, 179, 143, 0.15)'; // more transparent
          ctx.fill();
      }
      // check particle position, check mouse position, move the particle, draw the particle
      update() {
          if (this.x > canvas.width || this.x < 0) {
              this.directionX = -this.directionX;
          }
          if (this.y > canvas.height || this.y < 0) {
              this.directionY = -this.directionY;
          }

          // move particle
          this.x += this.directionX;
          this.y += this.directionY;
          // draw particle
          this.draw();
      }
  }

  // create particle array
  function init() {
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 25000; // fewer particles
      for (let i = 0; i < numberOfParticles; i++) {
          let size = (Math.random() * 2) + 1; // smaller size
          let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
          let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
          let directionX = (Math.random() * 0.4) - 0.2; // slower movement
          let directionY = (Math.random() * 0.4) - 0.2; // slower movement
          let color = 'rgba(232, 179, 143, 0.15)';

          particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
  }

  // animation loop
  function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0,0,innerWidth, innerHeight);

      for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
      }
  }

  // resize event
  window.addEventListener('resize', 
      function(){
          canvas.width = innerWidth;
          canvas.height = innerHeight;
          mouse.radius = ((canvas.height/120) * (canvas.height/120));
          init();
      }
  );

  // mouse out event
  window.addEventListener('mouseout', 
      function(){
          mouse.x = undefined;
          mouse.y = undefined;
      }
  )

  init();
  animate();
});
