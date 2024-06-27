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

        // Update page title dynamically
        document.title = `${team.name} | Goal Jams | Tracking Every NHL Goal Song`;

        // Set current song details
        const teamNameWithSong = document.getElementById('team-name-with-song');
        const currentGoalSong = team.currentGoalSong;

        let currentSongsText;
        if (Array.isArray(currentGoalSong.songs)) {
            const songList = currentGoalSong.songs.map(song => `${song.name} by ${song.artist}`).join(' and ');
            currentSongsText = `The current goal songs for the NHL's ${team.name} are ${songList}.`;
        } else {
            currentSongsText = `The current goal song for the NHL's ${team.name} is ${currentGoalSong.name} by ${currentGoalSong.artist}.`;
        }

        teamNameWithSong.textContent = `${team.name} Goal Song`; // Update the H2 text
        document.getElementById('team-name-placeholder').textContent = team.name;

        if (Array.isArray(currentGoalSong.songs)) {
            document.getElementById('song-name').textContent = currentGoalSong.songs.map(song => song.name).join(' and ');
            document.getElementById('artist-name').textContent = currentGoalSong.songs.map(song => song.artist).join(' and ');
            document.getElementById('spotify-iframe').src = ''; // Clear Spotify iframe if there are multiple songs
            document.getElementById('youtube-iframe').src = ''; // Clear YouTube iframe if there are multiple songs
        } else {
            document.getElementById('song-name').textContent = currentGoalSong.name;
            document.getElementById('artist-name').textContent = currentGoalSong.artist;
            document.getElementById('spotify-iframe').src = `https://open.spotify.com/embed/track/${currentGoalSong.spotifyID}?utm_source=generator&theme=0`;
            document.getElementById('youtube-iframe').src = `https://www.youtube.com/embed/${currentGoalSong.youtubeID}`;
        }

        // Set previous songs details
        if (team.previousGoalSongs) {
            const previousSongsContainer = document.getElementById('previous-songs');
            previousSongsContainer.innerHTML = team.previousGoalSongs.map(song => {
                return `<p>The ${team.name} have previously used the following goal song(s):</p><p><strong>${song.name}</strong> by ${song.artist} (${song.years.join(', ')})</p>`;
            }).join('');
        }

        // Insert the current songs text
        document.getElementById('current-songs-text').textContent = currentSongsText;
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
});
