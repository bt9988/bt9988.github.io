document.addEventListener("DOMContentLoaded", function() {
    fetch('teams.json')
        .then(response => response.json())
        .then(data => {
            populateTeams(data);
            setupTeamPage(data);
        })
        .catch(error => console.error('Error fetching team data:', error));

    function populateTeams(teams) {
        const teamButtonsContainer = document.querySelector('.team-buttons');
        if (!teamButtonsContainer) return;

        teamButtonsContainer.innerHTML = '';
        teams.forEach(team => {
            const button = document.createElement('button');
            button.className = 'team-button';
            button.innerHTML = `<img src="${team.logo}" alt="${team.name}"><span>${team.name}</span>`;
            button.addEventListener('click', () => {
                window.location.href = `team.html?team=${encodeURIComponent(team.name)}`;
            });
            teamButtonsContainer.appendChild(button);
        });
    }

    function setupTeamPage(teams) {
        const urlParams = new URLSearchParams(window.location.search);
        const teamName = urlParams.get('team');
        if (!teamName) return;

        const team = teams.find(t => t.name === teamName);
        if (!team) return;

        const teamNameElement = document.getElementById('team-name');
        const songNameElement = document.getElementById('song-name');
        const artistNameElement = document.getElementById('artist-name');
        const youtubeIframe = document.querySelector('#youtube-video iframe');
        const dynamicParagraph = document.getElementById('dynamic-paragraph');

        if (teamNameElement) teamNameElement.textContent = team.name;
        if (songNameElement) songNameElement.textContent = team.currentGoalSong.name;
        if (artistNameElement) artistNameElement.textContent = team.currentGoalSong.artist;
        if (youtubeIframe) youtubeIframe.src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;

   
    }
});
