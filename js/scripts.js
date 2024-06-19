document.addEventListener('DOMContentLoaded', () => {
  console.log("Document loaded");

  fetch('assets/data/teams.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Data loaded:", data);
      const teamsContainer = document.getElementById('teams-container');
      const menuLinks = document.getElementById('menu-links');

      data.teams.forEach(team => {
        console.log("Processing team:", team);
        const teamButton = document.createElement('div');
        teamButton.className = 'team-button';
        teamButton.innerHTML = `<a href="team.html?team=${team.id}"><img src="assets/images/team-logos/${team.logo}" alt="${team.name}"></a>`;
        teamsContainer.appendChild(teamButton);

        const teamLink = document.createElement('a');
        teamLink.href = `team.html?team=${team.id}`;
        teamLink.innerText = team.name;
        menuLinks.appendChild(teamLink);
      });
    })
    .catch(error => {
      console.error("Error loading teams.json:", error);
    });
});

function toggleMenu() {
  const menuLinks = document.getElementById('menu-links');
  menuLinks.classList.toggle('hidden');
}
