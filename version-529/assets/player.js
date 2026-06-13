import { H as Hls } from "./video-player-dru42stk.js";

function initializePlayer(video) {
    var source = video.dataset.videoSrc;
    var frame = video.closest(".video-frame");
    var playButton = frame ? frame.querySelector(".video-play-button") : null;
    var hlsInstance = null;

    function attachSource() {
        if (!source || video.dataset.sourceAttached === "true") {
            return;
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.ERROR, function (_event, data) {
                if (data && data.fatal && hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else {
            video.src = source;
        }

        video.dataset.sourceAttached = "true";
    }

    function playVideo() {
        attachSource();
        var request = video.play();
        if (request && typeof request.catch === "function") {
            request.catch(function () {
                video.controls = true;
            });
        }
    }

    if (playButton) {
        playButton.addEventListener("click", playVideo);
    }

    video.addEventListener("play", function () {
        if (frame) {
            frame.classList.add("is-playing");
        }
    });

    video.addEventListener("pause", function () {
        if (frame) {
            frame.classList.remove("is-playing");
        }
    });

    video.addEventListener("loadedmetadata", function () {
        video.controls = true;
    });

    video.addEventListener("emptied", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}

document.querySelectorAll(".movie-video").forEach(initializePlayer);
