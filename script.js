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

        // Display the team logo
        const teamLogoContainer = document.getElementById('team-logo-container');
        if (teamLogoContainer) {
            teamLogoContainer.innerHTML = `<img src="${team.logo}" alt="${team.name} Logo" class="team-logo">`;
        }

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
            individualSongsInfo.innerHTML = `The ${team.name} currently use individual goal songs for each player.`;

            // Embed Spotify playlist
            const individualSongsPlaylist = document.getElementById('individual-songs-playlist');
            if (team.individualGoalSongsPlaylist) {
                individualSongsPlaylist.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${team.individualGoalSongsPlaylist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
            }

            // Populate individual goal songs details
            const individualSongsContainer = document.getElementById('individual-songs');
            const songsList = document.createElement('ul'); // Create <ul> element
            team.individualGoalSongsDetails.forEach(song => {
                const songItem = document.createElement('li'); // Create <li> for each song
                songItem.innerHTML = `<strong>${song.player}</strong> scored to <strong>${song.name}</strong> by ${song.artist}`;
                songsList.appendChild(songItem); // Append each song as <li> to <ul>
            });
            individualSongsContainer.appendChild(songsList); // Append <ul> to container
        } else {
            // Show current goal song section and hide individual goal songs section
            individualGoalSongsSection.style.display = 'none';
            currentGoalSongSection.style.display = 'block';

            // Populate current goal song details
            document.getElementById('team-name-with-song').textContent = `${team.name} Goal Song`;
            document.getElementById('team-name-placeholder').textContent = team.name;
            document.getElementById('song-name').textContent = team.currentGoalSong.name;
            document.getElementById('artist-name').textContent = team.currentGoalSong.artist;

            // Set Spotify iframe
            const spotifyIframe = document.getElementById('spotify-iframe');
            spotifyIframe.src = `https://open.spotify.com/embed/track/${team.currentGoalSong.spotifyID}?utm_source=generator&theme=0`;

            // Set YouTube iframe
            const youtubeIframe = document.getElementById('youtube-iframe');
            youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;
        }

        // Populate previous songs details or display a message if there are none
        const previousSongsContainer = document.getElementById('previous-songs');
        if (team.previousGoalSongs && team.previousGoalSongs.length > 0) {
            const songsList = document.createElement('ul'); // Create <ul> element
            team.previousGoalSongs.forEach(song => {
                const songItem = document.createElement('li'); // Create <li> for each song
                songItem.innerHTML = `<strong>${song.name}</strong> by ${song.artist} (${song.years.join(', ')})`;
                songsList.appendChild(songItem); // Append each song as <li> to <ul>
            });
            // Update the header for previous songs with team name
            previousSongsContainer.innerHTML = `<p>The ${team.name} have previously used the following tracks for their goal songs:</p>`;
            previousSongsContainer.appendChild(songsList); // Append <ul> to container
        } else {
            previousSongsContainer.innerHTML = `<p>There are no previous goal songs listed for ${team.name}.</p>`;
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
});
