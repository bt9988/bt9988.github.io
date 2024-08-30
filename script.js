document.addEventListener("DOMContentLoaded", function() {
    insertHeader();
    insertFooter();

    fetch('teams.json')
        .then(response => response.json())
        .then(data => {
            setupTeamPage(data);
            addBackButton();
            addSlidingNavigation(data); // Include the sliding navigation
        });
});

// Function to insert the header
function insertHeader() {
    const headerContainer = document.getElementById('header-container');
    headerContainer.innerHTML = `
        <div class="header-content">
            <a href="/index.html"><img class="logo" src="images/hockey-goal-songs-logo.png" alt="Hockey Goal Songs Logo"></a>
            <nav class="header-nav">
                <a class="nav-link" href="/index.html">Home</a>
                <a class="nav-link" href="/about.html">About</a>
                <a class="nav-link" href="/contact.html">Contact</a>
            </nav>
        </div>
    `;
}

// Function to insert the footer
function insertFooter() {
    const footerContainer = document.getElementById('footer-container');
    footerContainer.innerHTML = `
        <footer>
            <p>&copy; ${new Date().getFullYear()} Hockey Goal Songs. All rights reserved.</p>
        </footer>
    `;
}

function setupTeamPage(teams) {
    const urlParams = new URLSearchParams(window.location.search);
    const teamNameWithSuffix = urlParams.get('team');
    const teamName = teamNameWithSuffix.replace('-Goal-Songs', '').replace(/-/g, ' ');
    if (!teamName) return;

    const team = teams.find(t => t.name === teamName);
    if (!team) return;

    document.title = `${team.name} Goal Songs | Hockey Goal Songs | Tracking Every NHL Goal Song`;
    document.documentElement.style.setProperty('--primary-color', team.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', team.secondaryColor);

    // Insert team logo
    const teamLogoContainer = document.querySelector('.team-logo-container');
    const teamLogoHTML = `<img src="${team.logo}" alt="${team.name} Logo">`;
    teamLogoContainer.innerHTML = teamLogoHTML;

    // Update team name in Goal Song header
    const teamNameWithSong = document.getElementById('team-name-with-song');
    teamNameWithSong.innerHTML = `Current Goal Song for ${team.name}`;

    // Update the current goal song section
    const songName = document.getElementById('song-name');
    const artistName = document.getElementById('artist-name');
    const inUseSince = document.getElementById('in-use-since');
    songName.textContent = team.currentGoalSong.songName;
    artistName.textContent = team.currentGoalSong.artistName;
    inUseSince.textContent = team.currentGoalSong.inUseSince ? `In use since ${team.currentGoalSong.inUseSince}.` : '';

    // Update the YouTube iframe
    const youtubeIframe = document.getElementById('youtube-iframe');
    youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeVideoId}`;

    // Update the Spotify iframe
    const spotifyIframe = document.getElementById('spotify-iframe');
    spotifyIframe.src = `https://open.spotify.com/embed/track/${team.currentGoalSong.spotifyTrackId}`;

    // Populate individual goal songs
    const individualSongsInfo = document.getElementById('individual-songs-info');
    const individualSongs = document.getElementById('individual-songs');
    const individualSongsPlaylist = document.getElementById('individual-songs-playlist');
    if (team.individualGoalSongs && team.individualGoalSongs.length > 0) {
        individualSongsInfo.innerHTML = `<p>The following players have their own goal songs for the ${team.name}:</p>`;
        team.individualGoalSongs.forEach(player => {
            const playerSection = document.createElement('div');
            playerSection.innerHTML = `
                <h3>${player.name}</h3>
                <p>Song: "${player.songName}" by ${player.artistName}</p>
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/${player.youtubeVideoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
            individualSongs.appendChild(playerSection);
        });

        // Embed the Spotify playlist for individual goal songs
        if (team.individualGoalSongsPlaylistId) {
            const playlistIframe = document.createElement('iframe');
            playlistIframe.src = `https://open.spotify.com/embed/playlist/${team.individualGoalSongsPlaylistId}`;
            playlistIframe.width = "100%";
            playlistIframe.height = "380";
            playlistIframe.frameborder = "0";
            playlistIframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
            individualSongsPlaylist.appendChild(playlistIframe);
        }
    } else {
        individualSongsInfo.innerHTML = `<p>No individual goal songs are listed for the ${team.name}.</p>`;
    }

    // Populate previous goal songs
    const previousSongs = document.getElementById('previous-songs');
    if (team.previousGoalSongs && team.previousGoalSongs.length > 0) {
        const previousSongsList = team.previousGoalSongs.map(song => `<li>${song.songName} by ${song.artistName} (${song.yearsUsed})</li>`).join('');
        previousSongs.innerHTML = `<ul>${previousSongsList}</ul>`;
    } else {
        previousSongs.innerHTML = `<p>No previous goal songs are listed for the ${team.name}.</p>`;
    }
}

// Function to add a back button
function addBackButton() {
    const headerContainer = document.getElementById('header-container');
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.style.marginLeft = '20px';
    backButton.style.marginTop = '10px';
    backButton.onclick = () => history.back();
    headerContainer.insertBefore(backButton, headerContainer.firstChild);
}

// Function to add sliding navigation
function addSlidingNavigation(teams) {
    const slidingNav = document.createElement('div');
    slidingNav.id = 'sliding-nav';
    slidingNav.innerHTML = `
        <span class="close-btn">&times;</span>
        <ul>
            ${teams.map(team => `<li><a href="team.html?team=${team.name.replace(/\s+/g, '-')}-Goal-Songs">${team.name}</a></li>`).join('')}
        </ul>
    `;
    document.body.appendChild(slidingNav);

    const trigger = document.createElement('span');
    trigger.id = 'sliding-nav-trigger';
    trigger.textContent = '☰';
    document.body.appendChild(trigger);

    const closeBtn = slidingNav.querySelector('.close-btn');
    trigger.onclick = () => slidingNav.classList.add('open');
    closeBtn.onclick = () => slidingNav.classList.remove('open');
}
