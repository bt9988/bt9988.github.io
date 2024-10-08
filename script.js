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
            setupTeamPage(teams);
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
        return window.location.pathname.startsWith('/team.html') || window.location.pathname.endsWith('-goal-songs.html');
    }

    function formatTeamName(teamName) {
        return teamName.replace(/\s+/g, '-').toLowerCase();
    }

    function populateTeams(teams) {
        const teamButtonsContainer = document.querySelector('.team-buttons');
        if (!teamButtonsContainer) {
            console.error('Team buttons container not found.');
            return;
        }

        const teamButtonsHTML = teams.map(team => {
            const formattedTeamName = formatTeamName(`${team.name}-goal-songs`);

            if (team.static === "TRUE") {
                // Link to the static page
                return `<button class="team-button" onclick="window.location.href='/${formattedTeamName}.html'">
                            <img src="${team.logo}" alt="${team.name}" loading="lazy">
                            <span>${team.name}</span>
                        </button>`;
            } else {
                // Link to the dynamic team page (default if static is FALSE or missing)
                return `<button class="team-button" onclick="window.location.href='/team.html?team=${formattedTeamName}'">
                            <img src="${team.logo}" alt="${team.name}" loading="lazy">
                            <span>${team.name}</span>
                        </button>`;
            }
        }).join('');

        teamButtonsContainer.innerHTML = teamButtonsHTML;
    }

    function setupTeamPage(teams) {
        const urlParams = new URLSearchParams(window.location.search);
        const teamNameWithSuffix = urlParams.get('team');
        const teamName = teamNameWithSuffix ? teamNameWithSuffix.replace('-goal-songs', '').replace(/-/g, ' ') : window.teamName;

        if (!teamName) {
            console.error('No team name found.');
            return;
        }

        const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase());
        if (!team) {
            console.error('Team not found:', teamName);
            return;
        }

        document.title = `${team.name} Goal Songs | Hockey Goal Songs | Tracking Every NHL Goal Song`;
        document.documentElement.style.setProperty('--primary-color', team.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', team.secondaryColor);

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

        if (individualGoalSongsSection && currentGoalSongSection) {
            if (team.individualGoalSongs) {
                individualGoalSongsSection.style.display = 'block';
                currentGoalSongSection.style.display = 'none';
                const individualSongsHeading = document.querySelector('.individual-goal-songs-section h2');
                if (individualSongsHeading) {
                    individualSongsHeading.textContent = `${team.name} Goal Songs`;
                }

                const individualSongsInfo = document.getElementById('individual-songs-info');
                if (individualSongsInfo) {
                    individualSongsInfo.innerHTML = `The NHL's <strong>${team.name}</strong> currently use individual goal songs for each player:`;

                    const individualSongsPlaylist = document.getElementById('individual-songs-playlist');
                    if (individualSongsPlaylist && team.individualGoalSongsPlaylist) {
                        individualSongsPlaylist.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${team.individualGoalSongsPlaylist}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
                    } else {
                        individualSongsPlaylist.style.display = 'none';
                    }

                    const individualSongsContainer = document.getElementById('individual-songs');
                    if (individualSongsContainer) {
                        const songsList = document.createElement('ul');
                        team.individualGoalSongsDetails.forEach(song => {
                            const songItem = document.createElement('li');
                            songItem.innerHTML = `<strong>${song.player}</strong>: "${song.name}" by ${song.artist}`;
                            songsList.appendChild(songItem);
                        });
                        individualSongsContainer.appendChild(songsList);
                    }
                }
            } else {
                individualGoalSongsSection.style.display = 'none';
                currentGoalSongSection.style.display = 'block';

                const teamNameWithSong = document.getElementById('team-name-with-song');
                const teamNamePlaceholder = document.getElementById('team-name-placeholder');
                if (teamNameWithSong && teamNamePlaceholder) {
                    teamNameWithSong.textContent = `${team.name} Goal Song`;
                    teamNamePlaceholder.textContent = team.name;
                }

                if (team.currentGoalSong) {
                    const songName = document.getElementById('song-name');
                    const artistName = document.getElementById('artist-name');
                    if (songName && artistName) {
                        songName.textContent = team.currentGoalSong.name;
                        artistName.textContent = team.currentGoalSong.artist;

                        const inUseSince = team.currentGoalSong.inUseSince;
                        const currentSong = document.getElementById('current-song');
                        if (currentSong) {
                            if (inUseSince) {
                                currentSong.innerHTML = `The current goal song for the NHL's <strong>${team.name}</strong> is "<span id="song-name">${team.currentGoalSong.name}</span>" by <span id="artist-name">${team.currentGoalSong.artist}</span>. This goal song has been in use since <span id="in-use-since">${inUseSince}</span>.`;
                            } else {
                                currentSong.innerHTML = `The current goal song for the NHL's <strong>${team.name}</strong> is "<span id="song-name">${team.currentGoalSong.name}</span>" by <span id="artist-name">${team.currentGoalSong.artist}</span>.`;
                            }
                        }
                    }

                    const spotifyIframe = document.getElementById('spotify-iframe');
                    if (spotifyIframe) {
                        if (team.currentGoalSong && team.currentGoalSong.spotifyID) {
                            spotifyIframe.src = `https://open.spotify.com/embed/track/${team.currentGoalSong.spotifyID}?utm_source=generator&theme=0`;
                            spotifyIframe.style.display = 'block';
                        } else {
                            spotifyIframe.style.display = 'none';
                        }
                    }

                    const youtubeIframe = document.getElementById('youtube-iframe');
                    if (youtubeIframe && team.currentGoalSong) {
                        youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;
                    }
                }
            }

            const previousSongsContainer = document.getElementById('previous-songs');
            if (previousSongsContainer) {
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
                    const previousSongsHeader = document.getElementById('previous-songs-header');
                    if (previousSongsHeader) {
                        previousSongsHeader.textContent = `Previous Goal Songs for the ${team.name}`;
                    }
                    previousSongsContainer.appendChild(songsList);
                } else {
                    previousSongsContainer.innerHTML = `<p>No previous goal songs found for the ${team.name}.</p>`;
                }
            }
        }
    }

    function populateDropdown(teams) {
        const dropdown = document.getElementById('team-dropdown');
        if (!dropdown) {
            console.error('Team dropdown not found.');
            return;
        }

        teams.forEach(team => {
            const option = document.createElement('option');
            const formattedTeamName = formatTeamName(`${team.name}-goal-songs`);
            option.value = team.static === "TRUE" ? `/${formattedTeamName}.html` : `/team.html?team=${formattedTeamName}`;
            option.textContent = team.name;
            dropdown.appendChild(option);
        });

        dropdown.addEventListener('change', function() {
            const selectedValue = dropdown.value;
            window.location.href = selectedValue;
        });
    }
});
