//u2astats.js
function initFooterStats() {
    fetchStats();

    function fetchStats() {
        fetch('api/v1/getstats')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                    return;
                }

                document.getElementById('footer-version').textContent = `Version: ${data.version}`;
                document.getElementById('footer-downloads').textContent = `Downloads: ${data.downloads}`;
                document.getElementById('footer-issues').textContent = `Issues: ${data.issues}`;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
}