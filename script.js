/* =========================================
   NAAT PLAYLIST
========================================= */

const naats = [

  {
    title: "Aaqa Ka Milad Aaya",
    artist: "Owais Raza Qadri",
    src: "audio/Aaqa_Ka_Milad_Aaya.mp3"
  },

  {
    title: "Gali Gali Saj Gayi 3",
    artist: "Hafiz Tahir Qadri",
    src: "audio/Gali_Gali_Saj_Gayi_3.mp3"
  },

  {
    title: "Mehfil",
    artist: "Sayyed Abdul Wasi Qadri",
    src: "audio/Mehfil.mp3"
  },

  {
    title: "Pukaro Ya Rasoolallah",
    artist: "Owais Raza Qadri",
    src: "audio/Pukaro_Ya_Rasoolallah.mp3"
  },

  {
    title: "Purnoor Hai Zamana",
    artist: "Sayyed Abdul Wasi Qadri",
    src: "audio/Purnoor_Hai_Zamana.mp3"
  }

];


/* =========================================
   ELEMENTS
========================================= */

const audio =
  document.getElementById("audio");

const player =
  document.getElementById("player");

const playBtn =
  document.getElementById("playBtn");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");

const loopBtn =
  document.getElementById("loopBtn");

const progress =
  document.getElementById("progress");

const currentTime =
  document.getElementById("currentTime");

const duration =
  document.getElementById("duration");

const naatTitle =
  document.getElementById("naatTitle");

const naatArtist =
  document.getElementById("naatArtist");

const desktopVideo =
  document.getElementById("desktopVideo");

const mobileVideo =
  document.getElementById("mobileVideo");


/* =========================================
   STATE
========================================= */

let currentNaat = 0;


/* =========================================
   TIME
========================================= */

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const secondsPart =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  return `${minutes}:${secondsPart}`;
}


/* =========================================
   PLAY BUTTON
========================================= */

function updatePlayButton() {

  const playing =
    !audio.paused;

  playBtn.classList.toggle(
    "playing",
    playing
  );

  player.classList.toggle(
    "playing",
    playing
  );

  playBtn.setAttribute(
    "aria-label",
    playing ? "Pause" : "Play"
  );
}


/* =========================================
   LOAD NAAT
========================================= */

function loadNaat(
  index,
  autoplay = false
) {

  if (!naats.length) {
    return;
  }

  if (index < 0) {
    index = naats.length - 1;
  }

  if (index >= naats.length) {
    index = 0;
  }

  currentNaat = index;

  const naat =
    naats[currentNaat];

  naatTitle.textContent =
    naat.title;

  naatArtist.textContent =
    naat.artist;

  audio.src =
    naat.src;

  audio.load();

  progress.value = 0;

  currentTime.textContent =
    "0:00";

  duration.textContent =
    "0:00";

  updateProgress();


  if (autoplay) {

    audio.play().catch(error => {

      console.log(
        "Audio play waiting:",
        error
      );

    });

  }

  updatePlayButton();
}


/* =========================================
   PLAY / PAUSE
========================================= */

playBtn.addEventListener(
  "click",
  () => {

    if (audio.paused) {

      audio.play().catch(error => {

        console.error(
          "Audio error:",
          error
        );

      });

    } else {

      audio.pause();

    }

  }
);


/* =========================================
   AUDIO EVENTS
========================================= */

audio.addEventListener(
  "play",
  updatePlayButton
);

audio.addEventListener(
  "pause",
  updatePlayButton
);


/* =========================================
   PREVIOUS
========================================= */

prevBtn.addEventListener(
  "click",
  () => {

    loadNaat(
      currentNaat - 1,
      true
    );

  }
);


/* =========================================
   NEXT
========================================= */

nextBtn.addEventListener(
  "click",
  () => {

    loadNaat(
      currentNaat + 1,
      true
    );

  }
);


/* =========================================
   LOOP
========================================= */

loopBtn.addEventListener(
  "click",
  () => {

    audio.loop =
      !audio.loop;

    loopBtn.classList.toggle(
      "active",
      audio.loop
    );

  }
);


/* =========================================
   AUTO NEXT
========================================= */

audio.addEventListener(
  "ended",
  () => {

    if (audio.loop) {
      return;
    }

    loadNaat(
      currentNaat + 1,
      true
    );

  }
);


/* =========================================
   METADATA
========================================= */

audio.addEventListener(
  "loadedmetadata",
  () => {

    duration.textContent =
      formatTime(
        audio.duration
      );

  }
);


/* =========================================
   PROGRESS
========================================= */

audio.addEventListener(
  "timeupdate",
  () => {

    if (!Number.isFinite(audio.duration)) {
      return;
    }

    progress.value =
      (
        audio.currentTime /
        audio.duration
      ) * 100;

    currentTime.textContent =
      formatTime(
        audio.currentTime
      );

    updateProgress();

  }
);


/* =========================================
   SEEK
========================================= */

progress.addEventListener(
  "input",
  () => {

    if (!Number.isFinite(audio.duration)) {
      return;
    }

    audio.currentTime =
      (
        progress.value / 100
      ) * audio.duration;

    updateProgress();

  }
);


/* =========================================
   PROGRESS DESIGN
========================================= */

function updateProgress() {

  const value =
    Number(progress.value) || 0;

  progress.style.background =
    `linear-gradient(
      to right,
      rgba(255,255,255,.95) 0%,
      rgba(255,255,255,.95) ${value}%,
      rgba(255,255,255,.25) ${value}%,
      rgba(255,255,255,.25) 100%
    )`;
}


/* =========================================
   BACKGROUND VIDEO
========================================= */

function prepareVideo(video) {

  if (!video) {
    return;
  }

  video.muted = true;

  video.defaultMuted = true;

  video.playsInline = true;

  video.setAttribute(
    "muted",
    ""
  );

  video.setAttribute(
    "playsinline",
    ""
  );

  video.setAttribute(
    "webkit-playsinline",
    ""
  );

}


/* =========================================
   PLAY BACKGROUND
========================================= */

function playBackground(video) {

  if (!video) {
    return;
  }

  prepareVideo(video);

  video.play().catch(() => {});

}


/* =========================================
   BACKGROUND SWITCH
========================================= */

function updateBackground() {

  const mobile =
    window.matchMedia(
      "(max-width: 700px)"
    ).matches;


  if (mobile) {

    desktopVideo.pause();

    mobileVideo.style.display =
      "block";

    desktopVideo.style.display =
      "none";

    playBackground(
      mobileVideo
    );

  } else {

    mobileVideo.pause();

    mobileVideo.style.display =
      "none";

    desktopVideo.style.display =
      "block";

    playBackground(
      desktopVideo
    );

  }

}


/* =========================================
   BACKGROUND INIT
========================================= */

prepareVideo(
  desktopVideo
);

prepareVideo(
  mobileVideo
);

updateBackground();


/* =========================================
   MOBILE AUTOPLAY FALLBACK
========================================= */

document.addEventListener(
  "touchstart",
  () => {

    updateBackground();

  },
  {
    once: true,
    passive: true
  }
);


document.addEventListener(
  "click",
  () => {

    updateBackground();

  },
  {
    once: true
  }
);


/* =========================================
   RESIZE
========================================= */

window.addEventListener(
  "resize",
  updateBackground
);


/* =========================================
   START
========================================= */

loadNaat(
  0,
  false
);

updatePlayButton();

updateProgress();
