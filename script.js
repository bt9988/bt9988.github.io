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

        document.title = `${team.name} | Hockey Goal Songs | Tracking Every NHL Goal Song`;
        document.documentElement.style.setProperty('--
