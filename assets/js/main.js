// main.js
document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
  initHeroAnimation();
  initMobileMenu();
  initStats();
  initTrustPartners();
  initFooterStats();
  
  const demoIframe = document.querySelector('.demo-result-iframe');
  if (demoIframe) {
    demoIframe.addEventListener('load', function () {
      this.classList.add('loaded');
    });
  }

  createCustomCookies({
    'hey': 'heya! Thanks for checking UrlToApp !',
    'IBegYou': 'PLEASSEEEE star https://github.com/url2app/urltoapp',
    'info': 'you arent visiting this site via u2a.'
  });

});