// theme.js
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
  
    if (!themeToggle || !themeIcon) return;
  
    let currentTheme = localStorage.getItem('theme');
  
    if (!currentTheme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentTheme = 'dark';
      } else {
        currentTheme = 'light';
      }
    }
  
    applyTheme(currentTheme);
  
    themeToggle.addEventListener('click', function () {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const newTheme = e.matches ? 'dark' : 'light';
      if (!localStorage.getItem('theme')) {
        applyTheme(newTheme);
      }
    });
  
    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        themeIcon.classList.remove('ri-moon-line');
        themeIcon.classList.add('ri-sun-line');
      } else {
        themeIcon.classList.remove('ri-sun-line');
        themeIcon.classList.add('ri-moon-line');
      }
    }
  }