document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    let currentTheme = localStorage.getItem('theme');
    
    if (!currentTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light';
        }
    }
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('ri-moon-line');
        themeIcon.classList.add('ri-sun-line');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('ri-sun-line');
        themeIcon.classList.add('ri-moon-line');
    }
    
    themeToggle.addEventListener('click', function() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('ri-sun-line');
            themeIcon.classList.add('ri-moon-line');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('ri-moon-line');
            themeIcon.classList.add('ri-sun-line');
        }
    });
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newTheme = e.matches ? 'dark' : 'light';
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', newTheme);
            if (newTheme === 'dark') {
                themeIcon.classList.remove('ri-moon-line');
                themeIcon.classList.add('ri-sun-line');
            } else {
                themeIcon.classList.remove('ri-sun-line');
                themeIcon.classList.add('ri-moon-line');
            }
        }
    });
    
    const heroContainer = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    heroContainer.addEventListener('mousemove', (e) => {
        const xAxis = (e.pageX - window.innerWidth / 2) / 25; 
        const yAxis = (e.pageY - window.innerHeight / 2) / 25;
        
        heroImage.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    heroContainer.addEventListener('mouseleave', () => {
        heroImage.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
});