document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('teams.json');
        const teams = await response.json();

        console.log('Teams data:', teams); // Log fetched data

        if (isIndexPage()) {
            populateTeams(teams);
            setupTeamColumns(teams);
        } else if (isTeamPage()) {
            setupTeamPage(teams);
        }
        populateDropdown(teams);
    } catch (error) {
        console.error('Error fetching team data:', error);
    }

    function isIndexPage() {
        return window.location.pathname === '/index.html' || window.location.pathname === '/';
    }

    function isTeamPage() {
        return window.location.pathname.startsWith('/team.html');
    }

    function populateTeams(teams) {
        const teamButtonsContainer = document.querySelector('.team-buttons');
        if (!teamButtonsContainer) return;

        teamButtonsContainer.innerHTML = teams.map(team => {
            return `<button class="team-button" onclick="navigateToTeam('${encodeURIComponent(team.name)}')">
                        <img src="${team.logo}" alt="${team.name}">
                        <span>${team.name}</span>
                    </button>`;
        }).join('');
    }

    function setupTeamColumns(teams) {
        const teamColumnsContainer = document.getElementById('team-columns');
        if (!teamColumnsContainer) return;

        const westernTeams = teams.filter(team => team.conference === 'Western');
        const easternTeams = teams.filter(team => team.conference === 'Eastern');

        const westernColumn = createTeamColumn(westernTeams);
        const easternColumn = createTeamColumn(easternTeams);

        teamColumnsContainer.innerHTML = `
            <div class="team-column">${westernColumn}</div>
            <div class="team-column">${easternColumn}</div>
        `;
    }

    function createTeamColumn(teams) {
        return teams.map(team => {
            return `<button class="team-button" onclick="navigateToTeam('${encodeURIComponent(team.name)}')">
                        <img src="${team.logo}" alt="${team.name}">
                        <span>${team.name}</span>
                    </button>`;
        }).join('');
    }

    function setupTeamPage(teams) {
        const urlParams = new URLSearchParams(window.location.search);
        const teamName = urlParams.get('team');
        if (!teamName) return;

        const team = teams.find(t => t.name === decodeURIComponent(teamName));
        if (!team) return;

        console.log('Selected team:', team); // Log selected team

        // Update page title dynamically
        document.title = `${team.name} | Goal Jams | Tracking Every NHL Goal Song`;

        // Set current song details
        document.getElementById('team-name').textContent = team.name;
        document.getElementById('team-name-placeholder').textContent = team.name;
        document.getElementById('song-name').textContent = team.currentGoalSong.name;
        document.getElementById('artist-name').textContent = team.currentGoalSong.artist;

        const youtubeIframe = document.getElementById('youtube-iframe');
        youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;

        // Set previous songs details
        if (team.previousGoalSongs) {
            const previousSongsContainer = document.getElementById('previous-songs');
            previousSongsContainer.innerHTML = team.previousGoalSongs.map(song => {
                return `<p><strong>${song.name}</strong> by ${song.artist} (${song.years.join(', ')})</p>`;
            }).join('');
        }
    }

    function populateDropdown(teams) {
        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.innerHTML = teams.map(team => {
            return `<a href="team.html?team=${encodeURIComponent(team.name)}">${team.name}</a>`;
        }).join('');
    }

    function navigateToTeam(teamName) {
        window.location.href = `team.html?team=${encodeURIComponent(teamName)}`;
    }

    // Ensure navigateToTeam is available globally
    window.navigateToTeam = navigateToTeam;

    // Toggle dropdown for TEAMS button
    function toggleTeamsDropdown() {
        const dropdown = document.getElementById('teams-dropdown');
        dropdown.classList.toggle('show');
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            const dropdowns = document.getElementsByClassName('dropdown-content');
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
});
