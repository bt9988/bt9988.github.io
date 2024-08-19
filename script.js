document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('teams.json');
        const teams = await response.json();

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

        const teamButtonsHTML = teams.map(team => {
            return `<button class="team-button" onclick="navigateToTeam('${encodeURIComponent(team.name)}')">
                        <img src="${team.logo}" alt="${team.name}" loading="lazy">
                        <span>${team.name}</span>
                    </button>`;
        }).join('');

        teamButtonsContainer.innerHTML = teamButtonsHTML;
    }

    function setupTeamPage(teams) {
        const urlParams = new URLSearchParams(window.location.search);
        const teamNameParam = urlParams.get('team');
        if (!teamNameParam) return;

        const teamName = decodeURIComponent(teamNameParam.replace(/-/g, ' '));
        const team = teams.find(t => t.name === teamName);
        if (!team) return;

        // Dynamic Meta Description
        const metaDescription = document.createElement('meta');
        metaDescription.name = "description";
        metaDescription.content = `Learn about the ${team.name}'s goal songs. Discover the music that energizes the ${team.name} fans during games.`;
        document.head.appendChild(metaDescription);

        // Setting the page title
        document.title = `${team.name} | Hockey Goal Songs | Tracking Every NHL Goal Song`;
        document.documentElement.style.setProperty('--primary-color', team.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', team.secondaryColor);

        const individualGoalSongsSection = document.querySelector('.individual-goal-songs-section');
        const currentGoalSongSection = document.querySelector('.current-goal-song-section');

        if (team.individualGoalSongs) {
            individualGoalSongsSection.style.display = 'block';
            currentGoalSongSection.style.display = 'none';
            document.querySelector('.individual-goal-songs-section h2').textContent = `${team.name} Goal Songs`;

            const individualSongsInfo = document.getElementById('individual-songs-info');
            individualSongsInfo.innerHTML = `The NHL's <strong>${team.name}</strong> currently use individual goal songs for each player:`;

            const individualSongsPlaylist = document.getElementById('individual-songs-playlist');
            if (team.individualGoalSongsPlaylist) {
                individualSongsPlaylist.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${team.individualGoalSongsPlaylist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
            }

            const individualSongsContainer = document.getElementById('individual-songs');
            const songsList = document.createElement('ul');
            team.individualGoalSongsDetails.forEach(song => {
                const songItem = document.createElement('li');
                songItem.innerHTML = `<strong>${song.player}</strong>: "${song.name}" by ${song.artist}`;
                songsList.appendChild(songItem);
            });
            individualSongsContainer.appendChild(songsList);
        } else {
            individualGoalSongsSection.style.display = 'none';
            currentGoalSongSection.style.display = 'block';

            document.getElementById('team-name-with-song').textContent = `${team.name} Goal Song`;
            document.getElementById('team-name-placeholder').textContent = team.name;

            if (team.currentGoalSong) {
                document.getElementById('song-name').textContent = team.currentGoalSong.name;
                document.getElementById('artist-name').textContent = team.currentGoalSong.artist;

                const inUseSince = team.currentGoalSong.inUseSince;
                if (inUseSince) {
                    document.getElementById('current-song').innerHTML = `The current goal song for the NHL's <strong>${team.name}</strong> is "<span id="song-name">${team.currentGoalSong.name}</span>" by <span id="artist-name">${team.currentGoalSong.artist}</span>. This goal song has been in use since <span id="in-use-since">${inUseSince}</span>.`;
                } else {
                    document.getElementById('current-song').innerHTML = `The current goal song for the NHL's <strong>${team.name}</strong> is "<span id="song-name">${team.currentGoalSong.name}</span>" by <span id="artist-name">${team.currentGoalSong.artist}</span>.`;
                }
            }

            const spotifyIframe = document.getElementById('spotify-iframe');
            if (team.currentGoalSong && team.currentGoalSong.spotifyID) {
                spotifyIframe.src = `https://open.spotify.com/embed/track/${team.currentGoalSong.spotifyID}?utm_source=generator&theme=0`;
                spotifyIframe.style.display = 'block';
            } else {
                spotifyIframe.style.display = 'none';
            }

            const youtubeIframe = document.getElementById('youtube-iframe');
            if (team.currentGoalSong) {
                youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;
            }
        }

        const previousSongsContainer = document.getElementById('previous-songs');
        if (team.previousGoalSongs && team.previousGoalSongs.length > 0) {
            const songsList = document.createElement('ul');
            team.previousGoalSongs.forEach(song => {
                const songItem = document.createElement('li');
                let years = song.years && song.years.length > 0 ? ` (${song.years.join(', ')})` : '';
                if (song.individualGoalSongs) {
                    songItem.innerHTML = "Individual Goal Songs";
                } else {
                    songItem.innerHTML = `"${song.name}" by ${song.artist}${years}`;
                }
                songsList.appendChild(songItem);
            });
            document.getElementById('previous-songs-header').innerHTML = `The <strong>${team.name}</strong> have previously used the following goal songs:`;
            previousSongsContainer.appendChild(songsList);
        } else {
            document.getElementById('previous-songs-header').innerHTML = `There are no previous goal songs listed for the <strong>${team.name}</strong>.`;
        }
    }

    function populateDropdown(teams) {
        const dropdownContent = document.querySelector('.dropdown-content');
        const dropdownHTML = teams.map(team => {
            return `<a href="team.html?team=${encodeURIComponent(team.name + '-Goal-Songs')}">${team.name}</a>`;
        }).join('');
        dropdownContent.innerHTML = dropdownHTML;
    }

    function navigateToTeam(teamName) {
        window.location.href = `team.html?team=${encodeURIComponent(teamName + '-Goal-Songs')}`;
    }

    window.navigateToTeam = navigateToTeam;
});
