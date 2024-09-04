document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Load the header and footer
        await loadHTML('header-container', 'header.html');
        await loadHTML('footer-container', 'footer.html');

        const response = await fetch('teams.json');
        const teams = await response.json();

        if (isIndexPage()) {
            populateTeams(teams);
        } else if (isTeamPage()) {
            if (window.teamName) {
                setupTeamPage(teams);
            }
        }
        populateDropdown(teams);
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    function loadHTML(elementId, filePath) {
        return fetch(filePath)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => console.error('Error loading file:', error));
    }

    function isIndexPage() {
        return window.location.pathname === '/index.html' || window.location.pathname === '/';
    }

    function isTeamPage() {
        return window.location.pathname.includes('-goal-songs.html');
    }

    function formatTeamName(teamName) {
        return teamName.replace(/\s+/g, '-');
    }

    function populateTeams(teams) {
        const teamButtonsContainer = document.querySelector('.team-buttons');
        if (!teamButtonsContainer) return;

        const teamButtonsHTML = teams.map(team => {
            const formattedTeamName = formatTeamName(`${team.name}-Goal-Songs`);
            return `<button class="team-button" onclick="navigateToTeam('${formattedTeamName}')">
                        <img src="${team.logo}" alt="${team.name}" loading="lazy">
                        <span>${team.name}</span>
                    </button>`;
        }).join('');

        teamButtonsContainer.innerHTML = teamButtonsHTML;
    }

    function setupTeamPage(teams) {
        const urlParams = new URLSearchParams(window.location.search);
        const teamNameWithSuffix = urlParams.get('team');
        const teamName = teamNameWithSuffix ? teamNameWithSuffix.replace('-Goal-Songs', '').replace(/-/g, ' ') : '';

        console.log('Team Name:', teamName); // Add logging

        if (!teamName) return;

        const team = teams.find(t => t.name === teamName);
        if (!team) {
            console.error(`Team not found: ${teamName}`); // Log if team is not found
            return;
        }

        document.title = `${team.name} Goal Songs | Hockey Goal Songs | Tracking Every NHL Goal Song`;
        document.documentElement.style.setProperty('--primary-color', team.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', team.secondaryColor);

        // Update meta description
        const metaDescription = `Discover the current goal song that ignites the arena when the ${team.name} score at Hockey Goal Songs. Watch YouTube videos, listen through an embedded Spotify player, and explore information on previously used goal songs.`;
        let metaDescriptionTag = document.querySelector('meta[name="description"]');
        if (!metaDescriptionTag) {
            metaDescriptionTag = document.createElement('meta');
            metaDescriptionTag.name = 'description';
            document.head.appendChild(metaDescriptionTag);
        }
        metaDescriptionTag.content = metaDescription;

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
            if (team.currentGoalSong && team.currentGoalSong.youtubeURL) {
                youtubeIframe.src = team.currentGoalSong.youtubeURL;
                youtubeIframe.style.display = 'block';
            } else {
                youtubeIframe.style.display = 'none';
            }
        }
    }

    function populateDropdown(teams) {
        const dropdown = document.querySelector('.team-dropdown');
        if (!dropdown) return;

        const optionsHTML = teams.map(team => {
            const formattedTeamName = formatTeamName(`${team.name}-Goal-Songs`);
            return `<option value="${formattedTeamName}">${team.name}</option>`;
        }).join('');

        dropdown.innerHTML = optionsHTML;
    }

    window.navigateToTeam = function(team) {
        window.location.href = `/team.html?team=${team}`;
    };
});
