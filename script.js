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

  // Preloader
  const preloader = document.getElementById('preloader');
  const mainContent = document.getElementById('main-content');

  // Remove preloader after a delay
  setTimeout(() => {
    preloader.classList.add('hidden');
    preloader.addEventListener('transitionend', () => {
      preloader.remove();
    });
    mainContent.classList.add('visible');
  }, 2000); // Display preloader for 2 seconds

  // モバイルメニュー開閉
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isMenuOpen = navLinks.classList.toggle('show');
    menuToggle.classList.toggle('menu-open', isMenuOpen);
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
});
