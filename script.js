const songs = [
  {
    id: 1,
    name: "Song 1",
    artist: "Artist 1",
    img: "song1.jpg",
    genre: "Genre 1",
    source: "song1.mp3",
  },
  {
    id: 2,
    name: "Song 2",
    artist: "Artist 2",
    img: "song2.jpg",
    genre: "Genre 2",
    source: "song2.mp3",
  },
  {
    id: 3,
    name: "Song 3",
    artist: "Artist 3",
    img: "song3.jpg",
    genre: "Genre 3",
    source: "song3.mp3",
  },
  // Add more songs as needed
];

// toggle button
const themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");
});

// show all songs as per genre
function showSongs(genre = "") {
  const allsongsDiv = document.getElementById("all-songs-div");
  allsongsDiv.innerHTML = " ";

  const filteredSongs = genre
    ? songs.filter((song) => (song.genre = genre)) : songs;

  filteredSongs.forEach((song) => {
    const songElement = document.createElement("div");
    songElement.classList.add("song");
    songElement.innerHTML = `
    <img src="${song.img}" alt="${song.name}"
    <p>${song.name}-${song.artist}</p>`;
    songElement.addEventListener("click", () => playslist(song.id));
    allsongsDiv.appendChild(songElement);
  });
}

// display currently playing song
let currentSongIndex =0;

function renderCurrentSong(){
  const song =songs[currentSongIndex];
  const songCardDiv = document.getElementById("song-card-div");
  songCardDiv.innerHTML=`
  <img src="${song.img}" alt="${song.name}"
  <p>${song.name}-${song.artist}</p>`;

  const audioPlayer = document.getElementById("audio-Player");
  audioPlayer.src= song.source;
  audioPlayer.play();
}

function playSong(id){
  currentSongIndex=songs.findIndex(song=>song.id===id);
  renderCurrentSong();
}

// Playback Controls (Next and Previous)
document.getElementById('next-btn').addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  renderCurrentSong();
});

document.getElementById('prev-btn').addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  renderCurrentSong();
});


// Add to Playlist Functionality

const playlists=[];
//create new playlist
function addToPlayList(playListName){
  let playlist = playlists.find(p=>p.name===playListName);
  if(!playlist){
    playlist={name:playListName,songs:[]};
    playlists.push(playlist);
  }
  const currentSong=songs[currentSongIndex];
  if(!playlist.songs.find(song=>song.id===currentSong.id)){
   playlist.songs.push(currentSong)
  }
}

document.getElementById('add-to-playList-btn').addEventListener("click",()=>{
  const playListName = propmt("Enter playlist name:");
  if(playListName){
    addToPlayList(playListName);
  }
})

// Create Playlist Functionality
function createPlayList(name){
  if(!playlists.find(p=>p.name===name)){
    playlists.push({name,songs:[]});
    renderPlayLists();
  }
}

function renderPlayLists(){
  const playlistDiv = document.getElementById("playlist-div");
  playlistDiv.innerHTML="";
  playlistDiv.forEach(playlist =>{
    const playlistElement= document.createElement("div");
    playlistElement.classList.add("playlist");
    playlistElement.textContent=playlist.name;
    playlistElement.addEventListener("click",()=>renderPlaylistSongs(playlist.name));
    playlistDiv.appendChild(playlistElement);
  })
}

document.getElementById('create-playlist-btn').addEventListener("click",()=>{
  const playlistName= promt("Enter new playlist name:");
  if(playlistName){
    createPlayList(playlistName);
  }
})


// Create a function renderPlaylistSongs that displays the songs in a selected playlist.
function renderPlaylistSongs(name){
  const playlist = playlists.find(p=>p.name===name);
  const playlistSongsDiv=document.getElementById("playlist-songs-div");
  playlistSongsDiv.innerHTML="";
  if(playlist){
    playlist.songs.foreach(song=>{
      const songElement=document.createElement("div");
      songElement.classList.add("song");
      songElement.innerHTML=`
      <img src="${song.img}" alt="${song.name}">
      <p>${song.name} - ${song.artist}</p>`;
      playlistSongsDiv.appendChild(songElement);
    });
  }
}

// Search Songs and Playlists, Remove Song from Playlist
document.getElementById("search-songs-input").addEventListener("input",(e)=>{
  const searchTerm=e.target.value.toLowercase();
  showSongs("",searchTerm);
});

function showSongs(genre="",searchTerm=""){
  const allsongsDiv=document.getElementById("all-songs-div");
  allsongsDiv.innerHTML="";
  const filteredSongs=genre?songs.filter(song=>song.genre===genre):songs;
  const displayedSongs = searchTerm?filteredSongs.filter(song=>song.name.toLowerCase().includes(searchTerm)):filteredSongs;
  displayedSongs.forEach(song=>{
    const songElement=document.createElement("div");
    songElement.classList.add("song");
    songElement.innerHTML=`
    <img src="${song.img}" alt="${song.name}">
            <p>${song.name} - ${song.artist}</p>`;
    songElement.addEventListener("click",()=>playSong(song.id));
    allsongsDiv.appendChild(songElement);
  });
}

function removeFromPlaylist(playlistName,songId){
  const playlist= playlists.find(p=>p.name===playlistName);
  if(playlist){
    playlist.songs=playlist.songs.filter(song=>song.id!==songId);
    renderPlaylistSongs(playlistName);
  }
}
