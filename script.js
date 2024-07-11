document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('teams.json');
        const teams = await response.json();

        console.log('Teams data:', teams); // Log fetched data

        if (isIndexPage()) {
            populateTeams(teams);
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

    function setupTeamPage(teams) {
        const urlParams = new URLSearchParams(window.location.search);
        const teamName = urlParams.get('team');
        if (!teamName) return;

        const team = teams.find(t => t.name === decodeURIComponent(teamName));
        if (!team) return;

        console.log('Selected team:', team); // Log selected team

        // Update document title
        document.title = `${team.name} | Goal Jams | Tracking Every NHL Goal Song`;

        // Apply team colors to the page
        document.documentElement.style.setProperty('--primary-color', team.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', team.secondaryColor);

        // Hide sections by default
        const individualGoalSongsSection = document.querySelector('.individual-goal-songs-section');
        const currentGoalSongSection = document.querySelector('.current-goal-song-section');

        // Check if team has individual goal songs
        if (team.individualGoalSongs) {
            // Show individual goal songs section and hide current goal song section
            individualGoalSongsSection.style.display = 'block';
            currentGoalSongSection.style.display = 'none';

            // Populate individual goal songs info
            const individualSongsInfo = document.getElementById('individual-songs-info');
            individualSongsInfo.innerHTML = `The NHL's <strong>${team.name}</strong> currently use individual goal songs for each player.`;

            // Embed Spotify playlist
            const individualSongsPlaylist = document.getElementById('individual-songs-playlist');
            if (team.individualGoalSongsPlaylist) {
                individualSongsPlaylist.innerHTML = `<iframe src
