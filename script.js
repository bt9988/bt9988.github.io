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

        // Elements for the current goal song section
        const currentSongSection = document.querySelector('section.team-info:nth-of-type(1)');
        const teamNameWithSong = document.getElementById('team-name-with-song');
        const teamNamePlaceholder = document.getElementById('team-name-placeholder');
        const songName = document.getElementById('song-name');
        const artistName = document.getElementById('artist-name');
        const spotifyIframe = document.getElementById('spotify-iframe');
        const youtubeIframe = document.getElementById('youtube-iframe');

        // Elements for the individual goal songs section
        const individualSongsSection = document.querySelector('section.team-info:nth-of-type(3)');
        const individualSongsHeader = individualSongsSection.querySelector('h2');
        const individualSongsContainer = document.getElementById('individual-songs');

        // Set previous songs details or display a message if there are none
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

        if (team.individualGoalSongs && team.individualGoalSongs.length > 0) {
            // Hide the current goal song section
            currentSongSection.style.display = 'none';

            const songsList = document.createElement('ul'); // Create <ul> element
            team.individualGoalSongs.forEach(song => {
                const songItem = document.createElement('li'); // Create <li> for each song
                songItem.innerHTML = `<strong>${song.player}</strong> scored to <strong>${song.name}</strong> by ${song.artist}`;
                songsList.appendChild(songItem); // Append each song as <li> to <ul>
            });
            // Update the header for individual songs with team name
            individualSongsContainer.innerHTML = `<p>Individual goal songs for ${team.name}:</p>`;
            individualSongsContainer.appendChild(songsList); // Append <ul> to container
        } else if (team.individualGoalSongs) {
            // Hide the current goal song section
            currentSongSection.style.display = 'none';

            individualSongsContainer.innerHTML = `<p>The ${team.name} currently use different goal songs for each player. Learn more <a href="${team.goalSongsInfo}" target="_blank">here</a>.</p>`;
        } else {
            // Hide the individual goal songs section entirely
            individualSongsSection.style.display = 'none';

            // Set current song details
            teamNameWithSong.textContent = `${team.name} Goal Song`; // Update the H2 text
            teamNamePlaceholder.textContent = team.name;
            songName.textContent = team.currentGoalSong.name;
            artistName.textContent = team.currentGoalSong.artist;

            // Set Spotify iframe
            spotifyIframe.src = `https://open.spotify.com/embed/track/${team.currentGoalSong.spotifyID}?utm_source=generator&theme=0`;

            // Set YouTube iframe
            youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;
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
