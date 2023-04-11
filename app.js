const clientId = 'your_spotify_client_id';
const clientSecret = 'your_spotify_client_secret';
let accessToken = '';

// Function to get the access token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    accessToken = data.access_token;
}

// Function to search for a song
async function searchSong(query) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&market=US&limit=1`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const data = await response.json();
    const track = data.tracks.items[0];
    return track;
}

// Function to set the iframe src and post a message
function setIframeSrcAndPostMessage(track) {
    const iframe = document.getElementById('spotify-iframe');
    iframe.src = `https://open.spotify.com/embed/track/${track.id}`;

    window.parent.postMessage({
        message_type: 'SONG_SELECTED',
        url: track.external_urls.spotify,
        mime: 'audio/x-spotify'
    }, '*');
}

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', async () => {
    const query = document.getElementById('search').value;
    if (query) {
        const track = await searchSong(query);
        if (track) {
            setIframeSrcAndPostMessage(track);
        } else {
            alert('No song found');
        }
    } else {
        alert('Please enter a search query');
    }
});

// Get the access token when the page loads
getAccessToken();
