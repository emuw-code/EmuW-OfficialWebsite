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
  const menuIcon = menuToggle.querySelector('.menu-icon');
  const closeIcon = menuToggle.querySelector('.close-icon');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    menuToggle.classList.toggle('menu-open'); // Add/remove menu-open class
    document.body.style.overflow = navLinks.classList.contains('show') ? 'hidden' : ''; // Prevent body scroll
  });

  // Smooth scroll for navigation links
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault(); // Prevent default anchor behavior only if target exists

        // Close the menu if it's open
        if (navLinks.classList.contains('show')) {
          navLinks.classList.remove('show');
          menuToggle.classList.remove('menu-open');
          document.body.style.overflow = ''; // Restore body scroll
        }

        // Scroll to the target element
        window.scrollTo({
          top: targetElement.offsetTop - 60, // Adjust for sticky nav height
          behavior: 'smooth'
        });
      }
    });
  });

  // アルバムカルーセル
  const container = document.querySelector('.album-container');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  // スクロール量は1アイテム分（＋マージン）に合わせて
  // album-item の幅と album-container の gap を考慮
  const albumItem = container.querySelector('.album-item');
  const itemWidth = albumItem.offsetWidth + parseFloat(getComputedStyle(container).gap);

  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: itemWidth, behavior: 'smooth' });
  });

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