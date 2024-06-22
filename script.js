document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('teams.json');
        const teams = await response.json();
        
        populateTeams(teams);
        setupTeamPage(teams);
        populateDropdown(teams);
    } catch (error) {
        console.error('Error fetching team data:', error);
    }

    function populateTeams(teams) {
        const teamButtonsContainer = document.querySelector('.team-buttons');
        if (!teamButtonsContainer) return;

        teamButtonsContainer.innerHTML = teams.map(team => {
            return `<button class="team-button" onclick="navigateToTeam('${team.name}')">
                        <img src="${team.logo}" alt="${team.name}">
                        <span>${team.name}</span>
                    </button>`;
        }).join('');
    }

    function setupTeamPage(teams) {
        const urlParams = new URLSearchParams(window.location.search);
        const teamName = urlParams.get('team');
        if (!teamName) return;

        const team = teams.find(t => t.name === teamName);
        if (!team) return;

        // Update page title dynamically
        document.title = `${team.name} | Goal Jams | Tracking Every NHL Goal Song`;

        document.getElementById('team-name').textContent = team.name;
        document.getElementById('team-name-placeholder').textContent = team.name;
        document.getElementById('song-name').textContent = team.currentGoalSong.name;
        document.getElementById('artist-name').textContent = team.currentGoalSong.artist;
        document.getElementById('youtube-iframe').src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;
    }

function populateDropdown(teams) {
    const dropdownContent = document.querySelector('.dropdown-content');
    if (!dropdownContent) return;

    // Separate teams into Eastern and Western conferences
    const easternTeams = teams.filter(team => team.conference === 'Eastern');
    const westernTeams = teams.filter(team => team.conference === 'Western');

    // Create HTML structure for dropdown content
    const dropdownHTML = `
        <div class="conference-column">
            <div class="conference-header">Eastern Conference</div>
            ${easternTeams.map(team => `<a href="team.html?team=${encodeURIComponent(team.name)}">${team.name}</a>`).join('')}
        </div>
        <div class="conference-column">
            <div class="conference-header">Western Conference</div>
            ${westernTeams.map(team => `<a href="team.html?team=${encodeURIComponent(team.name)}">${team.name}</a>`).join('')}
        </div>
    `;

    // Update dropdown content with the constructed HTML
    dropdownContent.innerHTML = dropdownHTML;
}


    // Function to navigate to team page with the team name as query parameter
    window.navigateToTeam = function(teamName) {
        window.location.href = `team.html?team=${encodeURIComponent(teamName)}`;
    };

    const dropbtn = document.querySelector('.dropbtn');
    const dropdown = document.querySelector('.dropdown');

    dropbtn.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', function() {
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    });
});
