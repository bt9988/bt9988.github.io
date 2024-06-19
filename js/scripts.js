document.addEventListener('DOMContentLoaded', () => {
  fetch('data/teams.json')
    .then(response => response.json())
    .then(data => {
      const teamsContainer = document.getElementById('teams-container');
      const menuLinks = document.getElementById('menu-links');

      data.teams.forEach(team => {
        const teamButton = document.createElement('div');
        teamButton.className = 'team-button';
        teamButton.innerHTML = `<img src="assets/images/team-logos/${team.logo}" alt="${team.name}">`;
        teamButton.addEventListener('click', () => {
          window.location.href = `team.html?team=${team.id}`;
        });
        teamsContainer.appendChild(teamButton);

        const teamLink = document.createElement('a');
        teamLink.href = `team.html?team=${team.id}`;
        teamLink.innerText = team.name;
        menuLinks.appendChild(teamLink);
      });
    });

  if (window.location.pathname.includes('team.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('team');

    fetch('data/teams.json')
      .then(response => response.json())
      .then(data => {
        const team = data.teams.find(t => t.id === teamId);
        if (team) {
          document.getElementById('team-name').innerText = team.name;
          document.getElementById('song-title').innerText = `Song Title: ${team.goalSong.title}`;
          document.getElementById('song-artist').innerText = `Artist: ${team.goalSong.artist}`;

          const streamingLinks = document.getElementById('streaming-links');
          team.goalSong.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.innerText = link.platform;
            linkElement.target = '_blank';
            streamingLinks.appendChild(linkElement);
          });

          const youtubeVideo = document.getElementById('youtube-video');
          youtubeVideo.innerHTML = `<iframe width="560" height="315" src="${team.goalSong.youtube}" frameborder="0" allowfullscreen></iframe>`;
        }
      });
  }
});

function toggleMenu() {
  const menuLinks = document.getElementById('menu-links');
  menuLinks.classList.toggle('hidden');
}
