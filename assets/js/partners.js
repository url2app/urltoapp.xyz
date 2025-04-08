//partners.js
function initTrustPartners() {
    loadTrustPartners();
  
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
        const trustLogosContainer = document.getElementById('trust-logos');
        const trustDescription = document.getElementById('trust-description');
        
        if (!trustLogosContainer || !trustDescription) return;
  
        const response = await fetch('assets/js/trust.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const partners = await response.json();
  
        const priorityGroups = {};
        partners.forEach(partner => {
          const priority = partner.priority !== undefined ? partner.priority : 999;
          if (!priorityGroups[priority]) {
            priorityGroups[priority] = [];
          }
          priorityGroups[priority].push(partner);
        });
  
        Object.keys(priorityGroups).forEach(priority => {
          priorityGroups[priority] = shuffleArray(priorityGroups[priority]);
        });
  
        const sortedPriorities = Object.keys(priorityGroups).map(Number).sort((a, b) => a - b);
  
        const finalPartners = [];
        sortedPriorities.forEach(priority => {
          finalPartners.push(...priorityGroups[priority]);
        });
  
        finalPartners.forEach((partner, index) => {
          const logoItem = document.createElement('div');
          logoItem.classList.add('trust-logo-item');
          if (index >= initialDisplay) {
            logoItem.style.display = 'none';
          }
  
          logoItem.innerHTML = `
            <img src="${partner.image}" alt="${partner.name}" class="trust-logo-image">
            <div class="trust-logo-name">${partner.name}</div>
          `;
  
          logoItem.addEventListener('mouseenter', () => {
            trustDescription.innerHTML = `
              <div class="trust-description-name">${partner.name}</div>
              <div class="trust-description-text">
                ${partner.description ? partner.description : '<span class="trust-description-empty">No description available</span>'}
              </div>
            `;
            trustDescription.classList.add('visible');
          });
  
          logoItem.addEventListener('click', () => {
            window.open(partner.url, '_blank');
          });
  
          trustLogosContainer.appendChild(logoItem);
        });
  
        document.querySelector('.trust-container').addEventListener('mouseleave', () => {
          trustDescription.classList.remove('visible');
        });
  
        const expandButton = document.getElementById('expand-trust');
        if (expandButton) {
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
        }
      } catch (error) {
        console.error('Error loading trust partners:', error);
      }
    }
  }