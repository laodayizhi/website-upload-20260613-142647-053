(function () {
    function setup(container) {
        var video = container.querySelector('video');
        var overlay = container.querySelector('.player-overlay');
        var streamUrl = container.getAttribute('data-stream');
        var hls = null;
        var ready = false;

        if (!video || !overlay || !streamUrl) {
            return;
        }

        function start() {
            overlay.classList.add('is-hidden');

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                if (!video.getAttribute('src')) {
                    video.setAttribute('src', streamUrl);
                }
                video.play();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                if (!ready) {
                    hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        ready = true;
                        video.play();
                    });
                } else {
                    video.play();
                }
                return;
            }

            if (!video.getAttribute('src')) {
                video.setAttribute('src', streamUrl);
            }
            video.play();
        }

        overlay.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setup);
})();
