// heroanim.js
function initHeroAnimation() {
    const heroContainer = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroContainer || !heroImage) return;
  
    heroContainer.addEventListener('mousemove', (e) => {
      const xAxis = (e.pageX - window.innerWidth / 2) / 25;
      const yAxis = (e.pageY - window.innerHeight / 2) / 25;
  
      heroImage.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
  
    heroContainer.addEventListener('mouseleave', () => {
      heroImage.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }