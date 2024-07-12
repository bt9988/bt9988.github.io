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
        const teamName = urlParams.get('team');
        if (!teamName) return;

        const team = teams.find(t => t.name === decodeURIComponent(teamName));
        if (!team) return;

        document.title = `${team.name} | Goal Jams | Tracking Every NHL Goal Song`;
        document.documentElement.style.setProperty('--primary-color', team.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', team.secondaryColor);

        const individualGoalSongsSection = document.querySelector('.individual-goal-songs-section');
        const currentGoalSongSection = document.querySelector('.current-goal-song-section');

        if (team.individualGoalSongs) {
            individualGoalSongsSection.style.display = 'block';
            currentGoalSongSection.style.display = 'none';
            document.querySelector('.individual-goal-songs-section h2').textContent = `${team.name} Goal Songs`;

            const individualSongsInfo = document.getElementById('individual-songs-info');
            individualSongsInfo.innerHTML = `The NHL's <strong>${team.name}</strong> currently use individual goal songs for each player.`;

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

            if (team.currentGoalSongs && team.currentGoalSongs.length > 0) {
                const currentSongsText = team.currentGoalSongs.map(song => {
                    return `"${song.name}" by ${song.artist}`;
                }).join(' and ');
                document.getElementById('song-name').innerHTML = currentSongsText;
            } else if (team.currentGoalSong) {
                document.getElementById('song-name').textContent = team.currentGoalSong.name;
                document.getElementById('artist-name').textContent = team.currentGoalSong.artist;

                const inUseSince = team.currentGoalSong.inUseSince;
                if (inUseSince) {
                    document.getElementById('in-use-since').textContent = `This goal song has been in use since ${inUseSince}.`;
                } else {
                    document.getElementById('in-use-since').textContent = '';
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
            if (team.currentGoalSong && team.currentGoalSong.youtubeID) {
                youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;
            }
        }

        const previousSongsContainer = document.getElementById('previous-songs');
        if (team.previousGoalSongs && team.previousGoalSongs.length > 0) {
            const songsList = document.createElement('ul');
Here are the final versions of `teams.json`, `team.html`, and `script.js`:

### Final `teams.json` Example

Ensure you have the `inUseSince` field added to the `currentGoalSong` object for a team:

```json
[
    {
        "name": "New York Islanders",
        "logo": "path/to/islanders-logo.png",
        "primaryColor": "#00539B",
        "secondaryColor": "#F47D30",
        "currentGoalSong": {
            "name": "Crowd Chant",
            "artist": "Joe Satriani",
            "youtubeID": "videoid",
            "spotifyID": "trackid",
            "inUseSince": "2015"
        },
        "previousGoalSongs": [
            {
                "name": "Song 1",
                "artist": "Artist 1",
                "years": ["2010", "2011"]
            },
            {
                "name": "Song 2",
                "artist": "Artist 2",
                "years": ["2012", "2013"]
            }
        ]
    }
]
