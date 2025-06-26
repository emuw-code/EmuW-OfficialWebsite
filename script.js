document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  const preloaderPercentage = document.getElementById('preloader-percentage');
  const preloaderBar = document.querySelector('.preloader-bar');
  const mainContent = document.getElementById('main-content');
  let currentProgress = 0;

  const updateProgress = () => {
    if (currentProgress < 100) {
      currentProgress += Math.floor(Math.random() * 10) + 1; // Simulate loading
      if (currentProgress > 100) currentProgress = 100;
      preloaderPercentage.textContent = `${currentProgress}%`;
      preloaderBar.style.width = `${currentProgress}%`;
      setTimeout(updateProgress, Math.random() * 100 + 50); // Update every 50-150ms
    } else {
      setTimeout(() => {
        preloader.classList.add('hidden');
        preloader.addEventListener('transitionend', () => {
          preloader.remove();
          mainContent.classList.add('visible'); // メインコンテンツをフェードイン
        });
      }, 500); // Wait a bit before hiding
    }
  };

  updateProgress();

  // モバイルメニュー開閉
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
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
