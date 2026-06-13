(function () {
  function attachSource(video, source) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  window.initializeMoviePlayer = function (videoId, source) {
    var video = document.getElementById(videoId);

    if (!video) {
      return;
    }

    var shell = video.closest("[data-player]");
    var button = shell ? shell.querySelector("[data-play-button]") : null;
    var attached = false;

    function hideButton() {
      if (button) {
        button.classList.add("is-hidden");
      }
    }

    function start() {
      if (!attached) {
        attachSource(video, source);
        attached = true;
      }

      hideButton();
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (!attached) {
        start();
      }
    });

    video.addEventListener("play", hideButton);
  };
})();
