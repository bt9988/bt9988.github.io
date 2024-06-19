document.addEventListener('DOMContentLoaded', () => {
  console.log("Team page loaded");

  // Get teamId from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get('team');

  if (!teamId) {
    console.error("No team ID found in URL");
    return;
  }

  fetch('assets/data/teams.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Data loaded:", data);
      const team = data.teams.find(t => t.id === teamId);

      if (!team) {
        console.error("Team not found in teams.json");
        return;
      }

      console.log("Team details:", team);

      // Update DOM with team details
      const teamDetailsContainer = document.getElementById('team-details');
      teamDetailsContainer.innerHTML = `
        <h1>${team.name}</h1>
        <h2>Current Goal Song</h2>
        <p>Title: ${team.goalSong.title}</p>
        <p>Artist: ${team.goalSong.artist}</p>
        <p>YouTube: <a href="${team.goalSong.youtube}" target="_blank">${team.goalSong.youtube}</a></p>
        <h3>Listen on:</h3>
        <ul>
          ${team.goalSong.links.map(link => `<li><a href="${link.url}" target="_blank">${link.platform}</a></li>`).join('')}
        </ul>
      `;
    })
    .catch(error => {
      console.error("Error loading teams.json:", error);
    });
});

function toggleMenu() {
  const menuLinks = document.getElementById('menu-links');
  menuLinks.classList.toggle('hidden');
}
