/* Global styles */
body {
    font-family: 'Roboto', sans-serif;
    line-height: 1.6;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
    color: #333; /* Main text color */
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

header {
    background-color: #333;
    color: #fff;
    padding: 10px 0;
}

header .header-content {
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 0 20px; /* Adjusted padding for better alignment */
}

header .logo {
    max-height: 65px;
}

header nav {
    display: flex;
    align-items: center;
}

header .nav-link {
    color: #fff;
    text-decoration: none;
    margin-left: 22px;
    margin-right: 22px; /* Added margin to increase space between Home and Teams */
}

header .dropdown {
    position: relative;
    display: inline-block;
}

header .dropbtn {
    background-color: #333;
    color: white;
    padding: 10px;
    font-size: 16px;
    border: none;
    cursor: pointer;
}

header .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

header .dropdown-content a {
    color: black;
    padding: 5px 5px;
    font-size: 11px;
    text-decoration: none;
    display: block;
}

header .dropdown-content a:hover {
    background-color: #f1f1f1;
}

header .dropdown-content.show {
    display: block;
}

.container {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px;
}

.main-content {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    flex: 1; /* Ensure the main content area grows to fill the available space */
}

.description {
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    text-align: center;
}

.team-info {
    margin-top: 20px;
}

.team-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
}

.team-button {
    background-color: #fff;
    color: #333;
    border: 1px solid #ddd;
    padding: 10px;
    margin: 7px;
    cursor: pointer;
    font-size: 1rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Center content vertically */
    width: 110px; /* Adjust the size as needed */
    height: 110px; /* Adjust the size as needed */
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.team-button:hover {
    background-color: #f0f0f0; /* Light grey background on hover */
    color: #888; /* Lighter grey for text color */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.team-button img {
    width: 30px; /* Adjust size of team logo */
    height: 30px;
    margin-bottom: 0px;
    border-radius: 0%;
}

.team-button span {
    margin-top: 10px;
    font-size: 0.9rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bold; /* Make the team name bold */
}

footer {
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 10px 0;
    margin-top: 20px; /* Provide space between team-info section and footer */
    height: 50px; /* Ensure consistent footer height */
}

footer p {
    margin: 0;
    font-size: 0.8rem;
    font-family: 'Roboto', sans-serif;
}

/* Responsive adjustments */
@media (max-width: 480px) {
    header .logo {
        max-height: 40px; /* Adjust as needed for smaller screens */
    }

    .description {
        font-size: 1rem;
    }

    .team-button {
        padding: 10px;
        margin: 5px;
    }

    header .dropdown-content {
        position: fixed;
        top: 50px; /* Adjust to match the height of your header */
        left: 0;
        width: 100%;
        height: calc(100vh - 50px); /* Full height minus the header */
        background-color: #fff;
        overflow-y: auto;
        box-shadow: none;
        display: none;
        z-index: 1000;
    }

    header .dropdown-content a {
        padding: 15px;
        font-size: 18px;
        border-bottom: 1px solid #ddd;
    }

    header .dropdown-content.show {
        display: block;
    }
}

/* Larger YouTube video */
#youtube-video {
    margin-top: 20px;
}

#youtube-iframe {
    width: 100%; /* Full width */
    height: 350px; /* Adjust height as needed */
}
