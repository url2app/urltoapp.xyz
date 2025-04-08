//visitors.js
function initStats() {
    getStats();
  
    async function getStats() {
      const viewSpan = document.getElementById('stats');
      if (!viewSpan) return;
  
      try {
        const response = await fetch('https://track.dpip.lol?id=urltoappweb');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
  
        const visitors = data.unique_views;
        const views = data.total_requests;
    
        viewSpan.innerText = `You are our ${visitors}th visitor !`;
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
  }