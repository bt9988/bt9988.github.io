document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('teams.json');
        const teams = await response.json();

        console.log('Teams data:', teams); // Log fetched data

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
});

// Define navigateToTeam globally
function navigateToTeam(teamName) {
    window.location.href = `team.html?team=${encodeURIComponent(teamName)}`;
}

document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('teams.json');
        const teams = await response.json();

        console.log('Teams data:', teams); // Log fetched data

        populateTeams(teams);
        populateDropdown(teams);
    } catch (error) {
        console.error('Error fetching team data:', error);
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

    function populateDropdown(teams) {
        const dropdownContent = document.querySelector('.dropdown-content');
        if (!dropdownContent) return;

        dropdownContent.innerHTML = teams.map(team => {
            return `<a href="team.html?team=${encodeURIComponent(team.name)}">${team.name}</a>`;
        }).join('');
    }
});

