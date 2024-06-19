document.addEventListener('DOMContentLoaded', () => {
  console.log("Document loaded");

  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get('team');
  console.log("Team ID from URL:", teamId);

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
      console.log("Streaming links element:", streamingLinks);

      streamingLinks.innerHTML = ''; // Clear existing links
      team.goalSong.links.forEach(link => {
        console.log("Adding link:", link);
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.innerText = link.platform;
        linkElement.target = '_blank';
        streamingLinks.appendChild(linkElement);
      });

      const youtubeVideo = document.getElementById('youtube-video');
      youtubeVideo.innerHTML = `<iframe width="560" height="315" src="${team.goalSong.youtube}" frameborder="0" allowfullscreen></iframe>`;
    })
    .catch(error => {
      console.error("Error loading teams.json:", error);
    });
});

function toggleMenu() {
  const menuLinks = document.getElementById('menu-links');
  menuLinks.classList.toggle('hidden');
}
