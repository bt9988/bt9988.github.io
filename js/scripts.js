document.addEventListener('DOMContentLoaded', () => {
  console.log("Document loaded");

  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get('team');

  if (!teamId) {
    console.error("No team ID found in URL");
    return;
  }

  fetch('data/teams.json')
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
        console.error("Team not found");
        return;
      }

      console.log("Displaying team:", team);

      document.getElementById('team-name').innerText = team.name;
      document.getElementById('song-title').innerText = `Song Title: ${team.goalSong.title}`;
      document.getElementById('song-artist').innerText = `Artist: ${team.goalSong.artist}`;

      const streamingLinks = document.getElementById('streaming-links');
      streamingLinks.innerHTML = ''; // Clear existing links
      team.goalSong.links.forEach(link => {
        const linkElement = document.createElement('a');
        lin
