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
        teamButtonsContainer.innerHTML = '';
        teams.forEach(team => {
            const button = document.createElement('button');
            button.className = 'team-button';
            button.innerHTML = `<img src="${team.logo}" alt="${team.name}"> ${team.name}`;
            button.addEventListener('click', () => {
                window.location.href = `team.html?team=${encodeURIComponent(team.name)}`;
            });
            teamButtonsContainer.appendChild(button);
        });
    }

    function setupTeamPage(teams) {
        const urlParams = new URLSearchParams(window.location.search);
        const teamName = urlParams.get('team');
        if (teamName) {
            const team = teams.find(t => t.name === teamName);
            if (team) {
                document.getElementById('team-name').textContent = team.name;
                document.getElementById('song-name').textContent = team.currentGoalSong.name;
                document.getElementById('artist-name').textContent = team.currentGoalSong.artist;
                document.querySelector('#youtube-video iframe').src = `https://www.youtube.com/embed/${team.currentGoalSong.youtubeID}`;
            }
        }
    }
});
