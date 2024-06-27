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
    teamNameWithSong.textContent = `${team.name} Goal Song`; // Update the H2 text

    document.getElementById('team-name-placeholder').textContent = team.name;
    document.getElementById('song-name').textContent = team.currentGoalSong.name;
    document.getElementById('artist-name').textContent = team.currentGoalSong.artist;

    // Set Spotify iframe
    const spotifyIframe = document.getElementById('spotify-iframe');
    spotifyIframe.src = `https://open.spotify.com/embed/track/${team.currentGoalSong.spotifyID}?utm_source=generator&theme=0`;

    // Set YouTube iframe
    const youtubeIframe = document.getElementById('youtube-iframe');
    youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;

    // Set previous songs details or display a message if there are none
    const previousSongsContainer = document.getElementById('previous-songs');
    if (team.previousGoalSongs && team.previousGoalSongs.length > 0) {
        const songsList = document.createElement('ul'); // Create <ul> element
        team.previousGoalSongs.forEach(song => {
            const songItem = document.createElement('li'); // Create <li> for each song
            songItem.innerHTML = `<strong>${song.name}</strong> by ${song.artist} (${song.years.join(', ')})`;
            songsList.appendChild(songItem); // Append each song as <li> to <ul>
        });
        previousSongsContainer.appendChild(songsList); // Append <ul> to container
    } else {
        previousSongsContainer.innerHTML = `<p>There are no previous goal songs listed for ${team.name}.</p>`;
    }
}
