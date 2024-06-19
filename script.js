document.addEventListener("DOMContentLoaded", function() {
    fetch('teams.json')
        .then(response => response.json())
        .then(data => {
            const teamList = document.getElementById('teamList');
            data.forEach(team => {
                const teamCard = document.createElement('div');
                teamCard.classList.add('team-card');
                
                const teamLogo = document.createElement('img');
                teamLogo.src = team.logo;
                teamLogo.alt = `${team.name} Logo`;
                
                const teamName = document.createElement('h3');
                teamName.textContent = team.name;
                
                const teamSong = document.createElement('p');
                teamSong.textContent = `Goal Song: ${team.goalSong}`;
                
                teamCard.appendChild(teamLogo);
                teamCard.appendChild(teamName);
                teamCard.appendChild(teamSong);
                
                teamList.appendChild(teamCard);
            });
        })
        .catch(error => {
            console.error('Error fetching the teams data:', error);
        });
});
