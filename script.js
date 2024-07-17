// Function to fetch teams data from teams.json
async function fetchTeamsData() {
    try {
        const response = await fetch('teams.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching teams data:', error);
        return [];
    }
}

// Function to populate EASTERN and WESTERN conference teams in the sidebar
function populateSidebarTeams(teams) {
    const easternTeams = teams.filter(team => team.conference === 'Eastern');
    const westernTeams = teams.filter(team => team.conference === 'Western');

    const easternSubmenu = document.getElementById('easternSubmenu');
    const westernSubmenu = document.getElementById('westernSubmenu');

    easternTeams.forEach(team => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = team.name;
        a.href = `team.html#${team.name.replace(/\s+/g, '-').toLowerCase()}`; // Example URL format
        li.appendChild(a);
        easternSubmenu.appendChild(li);
    });

    westernTeams.forEach(team => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = team.name;
        a.href = `team.html#${team.name.replace(/\s+/g, '-').toLowerCase()}`; // Example URL format
        li.appendChild(a);
        westernSubmenu.appendChild(li);
    });
}

// Function to initialize the page
async function initialize() {
    const teams = await fetchTeamsData();
    populateSidebarTeams(teams);
}

// Initialize the page
initialize();
