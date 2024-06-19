document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    menuToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
    });

    // Example of dynamically loading team pages
    const teamButtons = document.querySelectorAll('.team-button');

    teamButtons.forEach(button => {
        button.addEventListener('click', function() {
            const teamName = button.getAttribute('data-team');
            window.location.href = `team/${teamName}.html`; // Replace with actual link structure
        });
    });
});
