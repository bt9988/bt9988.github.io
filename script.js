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

            // Set header for individual goal songs
            document.querySelector('.individual-goal-songs-section h2').textContent = `${team.name} Goal Songs`;

            // Populate individual goal songs info
            const individualSongsInfo = document.getElementById('individual-songs-info');
            individualSongsInfo.innerHTML = `The NHL's <strong>${team.name}</strong> currently use individual goal songs for each player.`;

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
                songItem.innerHTML = `<strong>${song.player}</strong>: "${song.name}" by ${song.artist}`;
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

            // Handle multiple current goal songs
            if (team.currentGoalSongs && team.currentGoalSongs.length > 0) {
                const currentSongsText = team.currentGoalSongs.map(song => {
                    return `"${song.name}" by ${song.artist}`;
                }).join(' and ');
                document.getElementById('song-name').innerHTML = currentSongsText;
            } else if (team.currentGoalSong) {
                document.getElementById('song-name').textContent = team.currentGoalSong.name;
                document.getElementById('artist-name').textContent = team.currentGoalSong.artist;
            }

            // Set Spotify iframe
            const spotifyIframe = document.getElementById('spotify-iframe');
            if (team.currentGoalSong && team.currentGoalSong.spotifyID) {
                spotifyIframe.src = `https://open.spotify.com/embed/track/${team.currentGoalSong.spotifyID}?utm_source=generator&theme=0`;
                spotifyIframe.style.display = 'block';
            } else {
                spotifyIframe.style.display = 'none';
            }

            // Set YouTube iframe
            const youtubeIframe = document.getElementById('youtube-iframe');
            if (team.currentGoalSong) {
                youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;
            }
        }

        // Populate previous songs details or display a message if there are none
        const previousSongsContainer = document.getElementById('previous-songs');
        if (team.previousGoalSongs && team.previousGoalSongs.length > 0) {
            const songsList = document.createElement('ul'); // Create <ul> element
            team.previousGoalSongs.forEach(song => {
                const songItem = document.createElement('li'); // Create <li> for each song
                let years = song.years && song.years.length > 0 ? ` (${song.years.join(', ')})` : '';
                songItem.innerHTML = `"${song.name}" by ${song.artist}${years}`;
                songsList.appendChild(songItem); // Append each song as <li> to <ul>
            });
            // Update the header for previous songs with team name
            document.getElementById('previous-songs-header').innerHTML = `The <strong>${team.name}</strong> have previously used the following goal songs:`;
            previousSongsContainer.appendChild(songsList); // Append <ul> to container
        } else {
            document.getElementById('previous-songs-header').innerHTML = `There are no previous goal songs listed for <strong>${team.name}</strong>.`;
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
