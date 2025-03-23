// static/introduction.js
document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const animations = [
    "fade",          // 页面1
    "slide-up",      // 页面2
    "slide-down",    // 页面3
    "flip",          // 页面4
    "cube",          // 页面5
    "window",        // 页面6
    "fade"           // 页面7
  ];
  
  let currentIndex = 0;
  let isAnimating = false;

  // 初始化页面
  function init() {
    pages.forEach((page, index) => {
      page.style.transform = `translateY(${index * 100}%)`;
      page.setAttribute('data-animation', animations[index]);
    });
    pages[0].classList.add('active');
  }

  function handleScroll(e) {
    if (isAnimating) return;
    
    const delta = Math.sign(e.deltaY);
    const direction = delta > 0 ? 1 : -1;
    const newIndex = currentIndex + direction;

    if (newIndex < 0 || newIndex >= pages.length) return;
    
    isAnimating = true;
    performTransition(currentIndex, newIndex, direction);
    currentIndex = newIndex;
  }

  function performTransition(oldIndex, newIndex, direction) {
    const oldPage = pages[oldIndex];
    const newPage = pages[newIndex];

    // 设置入场动画
    newPage.classList.add('active');
    newPage.style.transform = `translateY(${direction * -100}%)`;
    
    // 触发动画
    requestAnimationFrame(() => {
      newPage.style.transform = 'translateY(0)';
      oldPage.style.transform = `translateY(${direction * 100}%)`;
    });

    // 清理动画状态
    setTimeout(() => {
      oldPage.classList.remove('active');
      oldPage.style.transform = '';
      isAnimating = false;
    }, 1000);
  }

  init();
  window.addEventListener('wheel', handleScroll, { passive: true });
});
