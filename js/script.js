/* =========================================================
   BIRTHDAY WEBSITE - MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   SLIDE ORDER
   ========================================================= */

const sections = [
  "home",
  "personalVideo",
  "flowers",
  "gifts",
  "memories",
  "sukoon",
  "video",
  "universe",
  "danceIntro",
  "newVideo",
  "final"
];

let lyric6Initialized = false;
let lyric6Audio = null;


/* =========================================================
   BACKGROUND MUSIC
   ========================================================= */

const backgroundMusic = document.getElementById("backgroundMusic");

let backgroundMusicStarted = false;
let videoIsPlaying = false;


/* Start background music */
function startBackgroundMusic() {

  if (!backgroundMusic) return;

  if (backgroundMusicStarted) return;

  if (videoIsPlaying) return;

  backgroundMusic.volume = 0.20;

  backgroundMusic.play()
    .then(() => {
      backgroundMusicStarted = true;
    })
    .catch(() => {
      // Browser autoplay restriction
    });
}


/* Pause background music */
function pauseBackgroundMusic() {

  if (!backgroundMusic) return;

  backgroundMusic.pause();
}


/* Resume background music */
function resumeBackgroundMusic() {

  if (!backgroundMusic) return;

  if (!backgroundMusicStarted) return;

  if (videoIsPlaying) return;

  backgroundMusic.play().catch(() => {});
}


/*
   First user interaction starts background music.
*/
document.addEventListener(
  "pointerdown",
  startBackgroundMusic,
  { once: true }
);


/* =========================================================
   VIDEO AUDIO CONTROL
   ========================================================= */


/* When ANY video starts */
document.addEventListener(
  "play",
  function (e) {

    if (!(e.target instanceof HTMLVideoElement)) return;

    videoIsPlaying = true;

    pauseBackgroundMusic();

  },
  true
);


/* When video is paused */
document.addEventListener(
  "pause",
  function (e) {

    if (!(e.target instanceof HTMLVideoElement)) return;

    if (!e.target.ended) {

      videoIsPlaying = false;

      /* Don't resume music if we are changing slides */
      if (!document.getElementById("final")?.classList.contains("hidden")) {
        return;
      }

      resumeBackgroundMusic();

    }

  },
  true
);


/* When video finishes */
document.addEventListener(
  "ended",
  function (e) {

    if (!(e.target instanceof HTMLVideoElement)) return;

    videoIsPlaying = false;

    resumeBackgroundMusic();

  },
  true
);


/* =========================================================
   SHOW SECTION
   ========================================================= */

function showSection(id) {

  /* Hide all sections */

  sections.forEach(function (sectionId) {

    const section = document.getElementById(sectionId);

    if (section) {

      section.classList.toggle(
        "hidden",
        sectionId !== id
      );

    }

  });
/* Stop all videos when changing slides */
document.querySelectorAll("video").forEach(function (video) {
  video.pause();
  video.currentTime = 0;
});

videoIsPlaying = false;
/* Stop background music on final slide */
if (id === "final") {
  pauseBackgroundMusic();
}

  /* Get special audio elements */

  const sukoonAudio =
    document.getElementById("sukoonAudio");

  const currentLyricAudio =
    document.getElementById("lyric6Audio");


  /* Stop Sukoon song when leaving Sukoon */

  if (id !== "sukoon" && sukoonAudio) {

    sukoonAudio.pause();

    sukoonAudio.currentTime = 0;

  }


  /* Stop Hona Tha Pyaar when leaving it */

  if (id !== "universe" && currentLyricAudio) {

    currentLyricAudio.pause();

    currentLyricAudio.currentTime = 0;

  }


  /* =====================================================
     PERSONAL VIDEO
     ===================================================== */

  if (id === "personalVideo") {

    const personalVideoContinue =
      document.getElementById("personalVideoContinue");

    if (personalVideoContinue) {

      personalVideoContinue.onclick = function () {

        showSection("flowers");

      };

    }

  }


  /* =====================================================
     SUKOON
     ===================================================== */

  if (id === "sukoon") {

    /* Stop background music */

    pauseBackgroundMusic();


    /* Stop Hona Tha Pyaar */

    if (currentLyricAudio) {

      currentLyricAudio.pause();

      currentLyricAudio.currentTime = 0;

    }


    /* Start Sukoon song */

    if (sukoonAudio) {

  sukoonAudio.volume = 0.2;
  sukoonAudio.currentTime = 0;

  sukoonAudio.play().catch(() => {});

}


    /* Initialize Sukoon 3D */

    if (
      typeof window.initSukoon3D === "function"
    ) {

      window.initSukoon3D();

    }


    /* Sukoon continue button */

    const continueBtn =
      document.getElementById("sukoonContinue");

    if (continueBtn) {

      continueBtn.onclick = function () {

        showSection("video");

      };

    }

  }


  /* =====================================================
     BIRTHDAY VIDEO
     ===================================================== */

  if (id === "video") {

    /* Stop Sukoon */

    if (sukoonAudio) {

      sukoonAudio.pause();

      sukoonAudio.currentTime = 0;

    }


    /* Stop Hona Tha Pyaar */

    if (lyric6Audio) {

      lyric6Audio.pause();

      lyric6Audio.currentTime = 0;

    }


    /* Reload birthday video */

   const birthdayVideo =
  document.getElementById("birthdayVideo");

if (birthdayVideo) {

  /* Stop previous playback */
  birthdayVideo.pause();

  /* Start from beginning */
  birthdayVideo.currentTime = 0;

  /* Do NOT call birthdayVideo.load() here */
}

    /* Background music resumes until video starts */

    resumeBackgroundMusic();

  }


  /* =====================================================
     HONA THA PYAAR
     ===================================================== */

  if (id === "universe") {

    /* Stop background music */

    pauseBackgroundMusic();


    /* Stop Sukoon */

    if (sukoonAudio) {

      sukoonAudio.pause();

      sukoonAudio.currentTime = 0;

    }


    /* Initialize Hona Tha Pyaar */

    if (
      !lyric6Initialized &&
      typeof window.initLyric6 === "function"
    ) {

      const initialized = window.initLyric6();

      lyric6Initialized = initialized === true;

    }


    /* Get Hona Tha Pyaar audio */

    const audio =
      lyric6Audio ||
      document.getElementById("lyric6Audio");


    if (audio) {

      lyric6Audio = audio;

      /* Start from beginning */
      audio.volume = 0.2;
      audio.currentTime = 0;

      audio.play().catch(() => {});

    }

  }


  /* =====================================================
     ORDINARY SLIDES
     ===================================================== */

  if (
    id !== "sukoon" &&
    id !== "universe"
  ) {

    resumeBackgroundMusic();

  }


  /* =====================================================
     HOME
     ===================================================== */

  if (id === "home") {

    resumeBackgroundMusic();

  }


  /* =====================================================
     FLOWERS
     ===================================================== */

  if (id === "flowers") {

    // Background music continues

  }


  /* =====================================================
     GIFTS
     ===================================================== */

  if (id === "gifts") {

    // Background music continues

  }


  /* =====================================================
     MEMORIES
     ===================================================== */

  if (id === "memories") {

    // Background music continues

  }


  /* =====================================================
     FINAL
     ===================================================== */

  if (id === "final") {

     pauseBackgroundMusic();

  }

}


/* Make showSection globally available */

window.showSection = showSection;


/* =========================================================
   FLOWER PICKING
   ========================================================= */

function flowerPick(el) {

  if (!el) return;

  el.classList.add("picked");

}

window.flowerPick = flowerPick;


/* =========================================================
   PHOTO POPUP
   ========================================================= */

function photoPop(el) {

  if (!el) return;

  el.classList.toggle("photo-pop");

}

window.photoPop = photoPop;


/* =========================================================
   GIFT REVEAL
   ========================================================= */

document.addEventListener(
  "click",
  function (e) {

    if (
      !e.target ||
      e.target.id !== "openGiftBtn"
    ) {

      return;

    }


    const stage =
      document.getElementById("giftStage");

    const button =
      document.getElementById("openGiftBtn");

    const surprises =
      document.getElementById("giftSurprises");

    const bottom =
      document.getElementById("giftBottom");


    if (!stage || !button) return;


    /* Prevent opening twice */

    if (
      stage.classList.contains("opened")
    ) {

      return;

    }


    /* Open gift */

    stage.classList.add("opened");


    button.textContent =
      "A few things for you... ❤️";


    /* Show surprise notes */

    setTimeout(function () {

      if (surprises) {

        surprises.classList.add("show");

      }

    }, 1000);


    /* Show continue button */

    setTimeout(function () {

      if (bottom) {

        bottom.classList.add("show");

      }

    }, 1250);

  }
);


/* =========================================================
   HONA THA PYAAR / LYRIC 6
   ========================================================= */

window.initLyric6 = function () {

  /*
     Prevent duplicate initialization
  */

  if (
    lyric6Audio &&
    lyric6Audio.dataset.lyric6Ready === "true"
  ) {

    return true;

  }


  /* Get elements */

  const host =
    document.getElementById("lyric6Pages");

  const dots =
    document.getElementById("lyric6Dots");

  const audio =
    document.getElementById("lyric6Audio");

  const play =
    document.getElementById("lyric6Play");

  const seek =
    document.getElementById("lyric6Seek");

  const timeEl =
    document.getElementById("lyric6Time");

  const eq =
    document.getElementById("lyric6Eq");

  const next =
    document.getElementById("lyric6Next");

  const fx =
    document.getElementById("lyric6Fx");


  /*
     If anything is missing,
     do not initialize.
  */

  if (
    !host ||
    !dots ||
    !audio ||
    !play ||
    !seek ||
    !timeEl ||
    !eq ||
    !next ||
    !fx
  ) {

    console.warn(
      "Hona Tha Pyaar: required element missing."
    );

    return false;

  }


  /* Store globally */

  lyric6Audio = audio;

  audio.dataset.lyric6Ready = "true";


  /* =====================================================
     LYRIC PAGES
     ===================================================== */

  const PAGES = [

    {
      t: 0,
      img: 1,
      text: "Tere dil ke shehar mein"
    },

    {
      t: 4.7,
      img: 2,
      text: "Ghar mera ho gaya ho gaya"
    },

    {
      t: 8.7,
      img: 3,
      text: "Sapna dekha jo tumne"
    },

    {
      t: 12.8,
      img: 4,
      text: "Woh mera ho gaya ho gaya"
    },

    {
      t: 17.1,
      img: 5,
      text: "Doobe toh yun"
    },

    {
      t: 21.3,
      img: 6,
      text: "Jaise ho paar"
    },

    {
      t: 27,
      img: 7,
      text: "Hona tha pyaar",
      chorus: true
    },

    {
      t: 31,
      img: 8,
      text: "hua mere yaar",
      chorus: true
    }

  ];


  let current = -1;

  let rafId = null;

  let heartTimer = null;


  /* Clear existing content */

  host.innerHTML = "";

  dots.innerHTML = "";

  fx.innerHTML = "";


  /* =====================================================
     CREATE PAGES
     ===================================================== */

  PAGES.forEach(function (p, i) {

    const page =
      document.createElement("div");

    page.className =
      "lyric6-page" +
      (p.chorus ? " chorus-page" : "");


    /* Image wrapper */

    const wrap =
      document.createElement("div");

    wrap.className =
      "lyric6-image-wrap";


    /* Image */

    const img =
      document.createElement("img");

    img.className =
      "lyric6-image";

    img.src =
      "images/scene" + p.img + ".png";

    img.alt =
      "Our memory " + p.img;

    img.loading =
      i === 0 ? "eager" : "lazy";


    wrap.appendChild(img);


    /* Lyric text */

    const lyric =
      document.createElement("div");

    lyric.className =
      "lyric6-lyric";

    lyric.textContent =
      p.text;


    /* Add */

    page.appendChild(wrap);

    page.appendChild(lyric);

    host.appendChild(page);


    /* =================================================
       DOT
       ================================================= */

    const dot =
      document.createElement("button");

    dot.type = "button";

    dot.className =
      "lyric6-dot";

    dot.setAttribute(
      "aria-label",
      "Go to lyric " + (i + 1)
    );


    dot.onclick = function () {

      audio.currentTime =
        PAGES[i].t;

      updateLyric(
        audio.currentTime
      );

    };


    dots.appendChild(dot);

  });


  /* Get created elements */

  const pages =
    [...host.querySelectorAll(
      ".lyric6-page"
    )];

  const dotEls =
    [...dots.querySelectorAll(
      ".lyric6-dot"
    )];


  /* =====================================================
     FORMAT TIME
     ===================================================== */

  function fmt(sec) {

    sec =
      Math.max(
        0,
        Math.floor(sec || 0)
      );

    return (
      Math.floor(sec / 60) +
      ":" +
      String(sec % 60)
        .padStart(2, "0")
    );

  }


  /* =====================================================
     FIND CURRENT PAGE
     ===================================================== */

  function pageForTime(t) {

    let i = 0;

    for (
      let n = 0;
      n < PAGES.length;
      n++
    ) {

      if (
        t >= PAGES[n].t
      ) {

        i = n;

      } else {

        break;

      }

    }

    return i;

  }


  /* =====================================================
     ACTIVATE PAGE
     ===================================================== */

  function activate(i) {

    pages.forEach(
      function (p, n) {

        p.classList.toggle(
          "active",
          n === i
        );

      }
    );


    dotEls.forEach(
      function (d, n) {

        d.classList.toggle(
          "active",
          n === i
        );

      }
    );


    current = i;

  }


  /* =====================================================
     UPDATE LYRIC
     ===================================================== */

  function updateLyric(t) {

    const i =
      pageForTime(t);


    if (i !== current) {

      activate(i);

    }


    /* Continue button */

    next.classList.toggle(
      "show",
      t >= 36
    );


    /* Seek */

    seek.value =
      String(
        Math.round(
          (Math.min(t, 36) / 36) *
          1000
        )
      );


    /* Time */

    timeEl.textContent =
      fmt(Math.min(t, 36)) +
      " / 0:36";

  }


  /* =====================================================
     FLOATING HEART
     ===================================================== */

  function spawnHeart() {

    const h =
      document.createElement("span");


    h.className =
      "lyric6-heart";


    h.textContent =
      Math.random() > 0.5
        ? "♥"
        : "♡";


    h.style.left =
      (15 + Math.random() * 70) +
      "%";


    h.style.setProperty(
      "--drift",
      ((Math.random() * 120) - 60) +
      "px"
    );


    h.style.animationDuration =
      (3 + Math.random() * 2) +
      "s";


    fx.appendChild(h);


    setTimeout(
      function () {

        h.remove();

      },
      5500
    );

  }


  /* =====================================================
     START HEARTS
     ===================================================== */

  function startHearts() {

    if (heartTimer) return;


    heartTimer =
      setInterval(
        function () {

          if (
            !audio.paused &&
            audio.currentTime >= 27
          ) {

            spawnHeart();

          }

        },
        650
      );

  }


  /* =====================================================
     STOP HEARTS
     ===================================================== */

  function stopHearts() {

    if (heartTimer) {

      clearInterval(
        heartTimer
      );

      heartTimer = null;

    }

  }


  /* =====================================================
     ANIMATION LOOP
     ===================================================== */

  function loop() {

    updateLyric(
      audio.currentTime
    );


    if (
      !audio.paused &&
      !audio.ended
    ) {

      rafId =
        requestAnimationFrame(
          loop
        );

    } else {

      rafId = null;

    }

  }


  function startLoop() {

    if (rafId === null) {

      rafId =
        requestAnimationFrame(
          loop
        );

    }

  }


  /* =====================================================
     RESET PLAYER UI
     ===================================================== */

  function resetUI() {

    play.classList.remove(
      "playing"
    );

    eq.classList.remove(
      "playing"
    );


    play.textContent =
      "♥";


    play.setAttribute(
      "aria-label",
      "Play song"
    );


    stopHearts();

  }


  /* =====================================================
     PLAY / PAUSE
     ===================================================== */

  play.onclick =
    function () {

      if (audio.paused) {

        /* Stop background */

        pauseBackgroundMusic();


        /* Restart after 36 seconds */

        if (
          audio.currentTime >= 36
        ) {

          audio.currentTime = 0;

        }


        audio.play()
          .catch(() => {});


      } else {

        audio.pause();

      }

    };


  /* =====================================================
     AUDIO PLAY
     ===================================================== */

  audio.addEventListener(
    "play",
    function () {

      pauseBackgroundMusic();


      play.classList.add(
        "playing"
      );


      eq.classList.add(
        "playing"
      );


      play.textContent =
        "❚❚";


      play.setAttribute(
        "aria-label",
        "Pause song"
      );


      startHearts();

      startLoop();

    }
  );


  /* =====================================================
     AUDIO PAUSE
     ===================================================== */

  audio.addEventListener(
    "pause",
    function () {

      resetUI();

    }
  );


  /* =====================================================
     TIME UPDATE
     ===================================================== */

  audio.addEventListener(
    "timeupdate",
    function () {

      if (
        audio.currentTime >= 36
      ) {

        audio.pause();

        audio.currentTime = 36;

        updateLyric(36);

        return;

      }


      updateLyric(
        audio.currentTime
      );

    }
  );


  /* =====================================================
     LOADED METADATA
     ===================================================== */

  audio.addEventListener(
    "loadedmetadata",
    function () {

      updateLyric(
        audio.currentTime
      );

    }
  );


  /* =====================================================
     AUDIO ENDED
     ===================================================== */

  audio.addEventListener(
    "ended",
    function () {

      audio.currentTime = 36;

      updateLyric(36);

      resetUI();

    }
  );


  /* =====================================================
     SEEK BAR
     ===================================================== */

  seek.addEventListener(
    "input",
    function () {

      audio.currentTime =
        (Number(seek.value) / 1000) *
        36;


      updateLyric(
        audio.currentTime
      );

    }
  );


  /* =====================================================
     NEXT BUTTON
     ===================================================== */

  next.onclick =
    function () {

      audio.pause();

      audio.currentTime = 0;

      stopHearts();


      if (
        typeof window.showSection ===
        "function"
      ) {

        window.showSection(
          "danceIntro"
        );

      }

    };


  /* =====================================================
     INITIAL STATE
     ===================================================== */

  activate(0);

  updateLyric(0);


  return true;

};


/* =========================================================
   INITIAL STATE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    if (
      document.getElementById("home")
    ) {

      showSection("home");

    }

  }
);
/* =========================================================
   BIRTHDAY VIDEO - STABLE PLAYBACK
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const birthdayVideo =
    document.getElementById("birthdayVideo");

  if (!birthdayVideo) return;


  /* -----------------------------------------
     VIDEO STARTS
     ----------------------------------------- */

  birthdayVideo.addEventListener("play", function () {

    videoIsPlaying = true;

    pauseBackgroundMusic();

  });


  /* -----------------------------------------
     VIDEO ACTUALLY PLAYING
     ----------------------------------------- */

  birthdayVideo.addEventListener("playing", function () {

    videoIsPlaying = true;

    pauseBackgroundMusic();

  });


  /* -----------------------------------------
     VIDEO PAUSED BY USER
     ----------------------------------------- */

  birthdayVideo.addEventListener("pause", function () {

    if (!birthdayVideo.ended) {

      videoIsPlaying = false;

      resumeBackgroundMusic();

    }

  });


  /* -----------------------------------------
     VIDEO FINISHED
     ----------------------------------------- */

  birthdayVideo.addEventListener("ended", function () {

    videoIsPlaying = false;

    resumeBackgroundMusic();

  });


  /* -----------------------------------------
     BUFFERING
     ----------------------------------------- */

  birthdayVideo.addEventListener("waiting", function () {

    console.log("Video buffering...");

    pauseBackgroundMusic();

  });


  /* -----------------------------------------
     BUFFERING RECOVERED
     ----------------------------------------- */

  birthdayVideo.addEventListener("canplay", function () {

    console.log("Video can continue playing.");

  });


  /* -----------------------------------------
     VIDEO STALLED
     ----------------------------------------- */

  birthdayVideo.addEventListener("stalled", function () {

    console.log("Video network stalled.");

  });


  /* -----------------------------------------
     VIDEO ERROR
     ----------------------------------------- */

  birthdayVideo.addEventListener("error", function () {

    console.error(
      "Video error:",
      birthdayVideo.error
    );

  });

});
