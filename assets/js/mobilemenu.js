// mobilemenu.js -- BROKEN
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;
  
    mobileMenuBtn.addEventListener('click', function () {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
  }