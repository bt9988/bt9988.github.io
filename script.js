document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    menuToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
    });

    // Example of dynamically loading team data and updating the page
    const teamName = "Anaheim Ducks"; // Replace with dynamic fetching of team name

    // Example data (replace with actual data retrieval)
    const teamData = {
        songName: "Goal Song Name",
        artist: "Artist Name",
        youtubeLink: "https://www.youtube.com/embed/VIDEO_ID" // Replace with actual YouTube link
    };

    // Update page content with fetched data
    document.getElementById('team-name').textContent = teamName;
    document.getElementById('song-name').textContent = teamData.songName;
    document.getElementById('song-artist').textContent = teamData.artist;

    // Embed YouTube video
    const youtubeVideoContainer = document.getElementById('youtube-video');
    const youtubeEmbed = document.createElement('iframe');
    youtubeEmbed.width = "560";
    youtubeEmbed.height = "315";
    youtubeEmbed.src = teamData.youtubeLink;
    youtubeEmbed.allowFullscreen = true;
    youtubeVideoContainer.appendChild(youtubeEmbed);
});
