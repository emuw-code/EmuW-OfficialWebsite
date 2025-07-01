document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  const preloaderPercentage = document.getElementById('preloader-percentage');
  const preloaderSlider = document.getElementById('preloader-slider');
  const mainContent = document.getElementById('main-content');
  let currentProgress = 0;

  const updateProgress = () => {
    if (currentProgress < 100) {
      currentProgress += 5; // 固定値で進捗を増やす
      if (currentProgress > 100) currentProgress = 100;
      preloaderPercentage.textContent = `${currentProgress}%`;
      preloaderSlider.value = currentProgress;
      setTimeout(updateProgress, 100); // 固定の更新間隔
    } else {
      setTimeout(() => {
        preloader.classList.add('hidden');
        preloader.addEventListener('transitionend', () => {
          preloader.remove();
        });
        mainContent.classList.add('visible');
      }, 500);
    }
  };

  updateProgress();

  // モバイルメニュー開閉
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isMenuOpen = navLinks.classList.toggle('show');
    menuToggle.classList.toggle('menu-open', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
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

  // フェードイン・オン・スクロール
  const fadeInSections = document.querySelectorAll('.fade-in-section');

  const observerOptions = {
    root: null, // ビューポートをルートとする
    rootMargin: '0px',
    threshold: 0.1 // 要素の10%が見えたら発火
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 一度表示されたら監視を停止
      }
    });
  }, observerOptions);

  fadeInSections.forEach(section => {
    observer.observe(section);
  });
});