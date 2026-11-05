
const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");

// Song collection
const songs = [
    {
        title: "Closer",
        artist: "The Chainsmokers",
        src: "songs/Closer.mp3"
    },
    {
        title: "Despacito",
        artist: "Luis Fonsi",
        src: "songs/Despacito.mp3"
    },
    {
        title: "Shape Of You",
        artist: "Ed Sheeran",
        src: "songs/Shape Of You.mp3"
    },
    {
        title: "Waka Waka",
        artist: "Shakira",
        src: "songs/Waka Waka.mp3"
    },
    {
        title: "Perfect",
        artist: "Ed Sheeran",
        src: "songs/Perfect.mp3"
    }
];

let songIndex = 0;

// Convert seconds into minutes:seconds
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${String(secs).padStart(2, "0")}`;
}

// Load a selected song
function loadSong(index) {
    songIndex = (index + songs.length) % songs.length;

    const song = songs[songIndex];

    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    updatePlaylist();
}

// Play the current song
function playSong() {
    audio.play()
        .then(() => {
            playBtn.textContent = "⏸";
            playBtn.setAttribute("aria-label", "Pause");
        })
        .catch(error => {
            console.error("Unable to play audio:", error);
            alert("Unable to play this song. Check your internet connection.");
        });
}

// Pause the current song
function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play");
}

// Play or pause using the main button
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Play the next song
function nextSong() {
    loadSong(songIndex + 1);
    playSong();
}

// Play the previous song
function prevSong() {
    loadSong(songIndex - 1);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Update song duration when metadata loads
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

// Update progress bar as the song plays
audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTime.textContent = formatTime(audio.currentTime);
    }
});

// Seek to a selected position
progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// Control volume
volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});

// Automatically play the next song when one finishes
audio.addEventListener("ended", nextSong);

// Build the clickable playlist
function updatePlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const li = document.createElement("li");

        li.textContent = `${index + 1}. ${song.title} — ${song.artist}`;

        if (index === songIndex) {
            li.classList.add("active");
        }

        li.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlist.appendChild(li);
    });
}

// Initialize the player
audio.volume = Number(volume.value);
loadSong(songIndex);
