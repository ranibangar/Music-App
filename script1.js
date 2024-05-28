// Song data
const songs = [
    { id: 1, name: "Song One", artist: "Artist A", img: "img1.jpg", genre: "Pop", source: "song1.mp3" },
    { id: 2, name: "Song Two", artist: "Artist B", img: "img2.jpg", genre: "Rock", source: "song2.mp3" },
    { id: 4, name: "Song three", artist: "Artist c", img: "img3.jpg", genre: "HipHop", source: "song3.mp3" },
    { id: 4, name: "Song four", artist: "Artist d", img: "img4.jpg", genre: "Joy", source: "song4.mp3" },
    // Add more songs as needed
];

// Playlists data
const playlists = [];

// Variables to track the current song
let currentSongIndex = 0;

// Function to toggle theme
function toggleTheme() {
    const body = document.body;
    body.setAttribute('data-theme', body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

// Event listener for the theme toggle button
document.getElementById('toggle-theme-btn').addEventListener('click', toggleTheme);

// Function to render the list of songs based on the selected genre or search term
function showSongs(genre = "", searchTerm = "") {
    const allSongsDiv = document.getElementById('songs-list');
    allSongsDiv.innerHTML = ""; // Clear existing songs
    const filteredSongs = genre ? songs.filter(song => song.genre === genre) : songs;
    const displayedSongs = searchTerm ? filteredSongs.filter(song => song.name.toLowerCase().includes(searchTerm.toLowerCase())) : filteredSongs;
    displayedSongs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.classList.add('song');
        songElement.innerHTML = `
            <img src="${song.img}" alt="${song.name}">
            <p>${song.name} - ${song.artist}</p>
        `;
        songElement.addEventListener('click', () => playSong(song.id));
        allSongsDiv.appendChild(songElement);
    });
}

// Function to render the currently playing song
function renderCurrentSong() {
    const song = songs[currentSongIndex];
    const songCardDiv = document.getElementById('song-card-div');
    songCardDiv.innerHTML = `
        <img src="${song.img}" alt="${song.name}">
        <p>${song.name} - ${song.artist}</p>
        <button id="prev-btn">Previous</button>
        <button id="next-btn">Next</button>
        <button id="add-to-playlist-btn">Add to Playlist</button>
    `;
    document.getElementById('prev-btn').addEventListener('click', playPreviousSong);
    document.getElementById('next-btn').addEventListener('click', playNextSong);
    document.getElementById('add-to-playlist-btn').addEventListener('click', addToPlaylistPrompt);
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = song.source;
    audioPlayer.play();
}

// Function to play a song by its ID
function playSong(id) {
    currentSongIndex = songs.findIndex(song => song.id === id);
    renderCurrentSong();
}

// Function to play the next song
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    renderCurrentSong();
}

// Function to play the previous song
function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    renderCurrentSong();
}

// Function to add the current song to a selected playlist
function addToPlaylist(playlistName) {
    let playlist = playlists.find(p => p.name === playlistName);
    if (!playlist) {
        playlist = { name: playlistName, songs: [] };
        playlists.push(playlist);
    }
    const currentSong = songs[currentSongIndex];
    if (!playlist.songs.find(song => song.id === currentSong.id)) {
        playlist.songs.push(currentSong);
    }
    renderPlaylists();
}

// Function to prompt the user for a playlist name and add the current song to that playlist
function addToPlaylistPrompt() {
    const playlistName = prompt("Enter playlist name:");
    if (playlistName) {
        addToPlaylist(playlistName);
    }
}

// Function to create a new playlist
function createPlaylist(name) {
    if (!playlists.find(p => p.name === name)) {
        playlists.push({ name, songs: [] });
        renderPlaylists();
    }
}

// Function to render the playlists
function renderPlaylists() {
    const playlistDiv = document.getElementById('playlist-div');
    playlistDiv.innerHTML = "";
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('playlist');
        playlistElement.textContent = playlist.name;
        playlistElement.addEventListener('click', () => renderPlaylistSongs(playlist.name));
        playlistDiv.appendChild(playlistElement);
    });
}

// Function to render the songs in a selected playlist
function renderPlaylistSongs(name) {
    const playlist = playlists.find(p => p.name === name);
    const playlistSongsDiv = document.getElementById('playlist-songs-div');
    playlistSongsDiv.innerHTML = "";
    if (playlist) {
        playlist.songs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.classList.add('song');
            songElement.innerHTML = `
                <img src="${song.img}" alt="${song.name}">
                <p>${song.name} - ${song.artist}</p>
                <button class="remove-btn">Remove</button>
            `;
            songElement.querySelector('.remove-btn').addEventListener('click', () => removeFromPlaylist(playlist.name, song.id));
            playlistSongsDiv.appendChild(songElement);
        });
    }
}

// Function to remove a song from a playlist
function removeFromPlaylist(playlistName, songId) {
    const playlist = playlists.find(p => p.name === playlistName);
    if (playlist) {
        playlist.songs = playlist.songs.filter(song => song.id !== songId);
        renderPlaylistSongs(playlistName);
    }
}

// Event listener for the create playlist button
document.getElementById('create-playlist-btn').addEventListener('click', () => {
    const playlistName = prompt("Enter new playlist name:");
    if (playlistName) {
        createPlaylist(playlistName);
    }
});

// Event listener for the search input
document.getElementById('search-songs-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    showSongs("", searchTerm);
});

// Initial rendering of all songs and playlists
showSongs();
renderPlaylists();
