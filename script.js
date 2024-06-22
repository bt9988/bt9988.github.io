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

        const easternConference = document.createElement('div');
        easternConference.className = 'dropdown-column';
        easternConference.innerHTML = '<h3>Eastern Conference</h3>';
        const westernConference = document.createElement('div');
        westernConference.className = 'dropdown-column';
        westernConference.innerHTML = '<h3>Western Conference</h3>';

        teams.forEach(team => {
            const teamLink = document.createElement('a');
            teamLink.href = `team.html?team=${encodeURIComponent(team.name)}`;
            teamLink.textContent = team.name;

            if (team.conference === 'Eastern') {
                easternConference.appendChild(teamLink);
            } else if (team.conference === 'Western') {
                westernConference.appendChild(teamLink);
            }
        });

        dropdownContent.appendChild(easternConference);
        dropdownContent.appendChild(westernConference);
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
