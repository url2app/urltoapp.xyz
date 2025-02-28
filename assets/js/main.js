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


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async function loadTrustPartners() {
        try {
            const initialDisplay = 6;
            
            const response = await fetch('assets/js/trust.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const partners = await response.json();
            
            const shuffledPartners = shuffleArray([...partners]);
            
            const trustLogosContainer = document.getElementById('trust-logos');
            
            shuffledPartners.forEach((partner, index) => {
                const logoItem = document.createElement('div');
                logoItem.classList.add('trust-logo-item');
                if (index >= initialDisplay) {
                    logoItem.style.display = 'none';
                }
                
                logoItem.innerHTML = `
                    <img src="${partner.image}" alt="${partner.name}" class="trust-logo-image">
                    <div class="trust-logo-name">${partner.name}</div>
                `;
                
                logoItem.addEventListener('click', () => {
                    window.open(partner.url, '_blank');
                });
                
                trustLogosContainer.appendChild(logoItem);
            });
            
            const expandButton = document.getElementById('expand-trust');
            expandButton.addEventListener('click', () => {
                const isExpanded = trustLogosContainer.classList.contains('expanded');
                const logoItems = trustLogosContainer.querySelectorAll('.trust-logo-item');
                
                if (!isExpanded) {
                    trustLogosContainer.classList.add('expanded');
                    logoItems.forEach(item => {
                        item.style.display = 'flex';
                    });
                    
                    expandButton.classList.add('expanded');
                    expandButton.querySelector('.expand-text').textContent = 'Show less';
                } else {
                    trustLogosContainer.classList.remove('expanded');
                    logoItems.forEach((item, index) => {
                        if (index >= initialDisplay) {
                            item.style.display = 'none';
                        }
                    });
                    
                    expandButton.classList.remove('expanded');
                    expandButton.querySelector('.expand-text').textContent = 'Show more';
                }
            });
            
        } catch (error) {
            console.error('Error loading trust partners:', error);
        }
    }

    loadTrustPartners();
});