function initMoviePlayer(source, videoId, triggerId) {
  const video = document.getElementById(videoId);
  const trigger = document.getElementById(triggerId);
  let hlsInstance = null;
  let prepared = false;

  if (!video || !trigger || !source) {
    return;
  }

  function hideTrigger() {
    trigger.classList.add('is-hidden');
  }

  function attachSource() {
    if (prepared) {
      return Promise.resolve();
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return Promise.resolve();
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return new Promise(function (resolve) {
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });
        hlsInstance.on(Hls.Events.ERROR, function () {
          resolve();
        });
      });
    }

    video.src = source;
    return Promise.resolve();
  }

  function playVideo() {
    hideTrigger();
    attachSource().then(function () {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          trigger.classList.remove('is-hidden');
        });
      }
    });
  }

  trigger.addEventListener('click', playVideo);

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener('play', hideTrigger);

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
