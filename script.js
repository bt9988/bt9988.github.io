// script.js

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    menuToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
    });

    // Homepage: Load teams.json and dynamically generate team buttons
    fetch('team/teams.json')
        .then(response => response.json())
        .then(data => {
            const navList = document.getElementById('nav-list');
            const teamButtonsContainer = document.querySelector('.team-buttons');

            // Update navigation menu with team links
            Object.keys(data).forEach(team => {
                const teamName = data[team].teamName;
                const teamLink = document.createElement('a');
                teamLink.href = `team/${team}.html`;
                teamLink.textContent = teamName;
                const listItem = document.createElement('li');
                listItem.appendChild(teamLink);
                navList.appendChild(listItem);

                // Create buttons for each team on homepage
               
