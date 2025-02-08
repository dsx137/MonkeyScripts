// ==UserScript==
// @name         Kemono/Coomer-VideoPlayer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A simple tampermonkey script allows you can watch the videos of post links in Kemono or Coomer.
// @author       dsx137
// @match        https://coomer.party/*
// @match        https://kemono.party/*
// @match        https://coomer.su/*
// @match        https://kemono.su/*
// @match        https://nekohouse.su/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     video.js_css https://cdnjs.cloudflare.com/ajax/libs/video.js/8.16.1/video-js.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/video.js/8.16.1/video.min.js
// @license      MIT
// ==/UserScript==

function createPlayer(linksrc) {
    let player = document.createElement("video");

    player.className = "video-js vjs-theme-city";
    player.style.width = "100%";
    player.style.backgroundColor = "black"
    player.setAttribute("data-setup", '{"controls":true, "autoplay":false, "preload":"auto", "height":"800px"}');
    let src = document.createElement("source");
    src.type = "video/mp4";
    src.src = linksrc;
    player.appendChild(src);

    let volumePanelHoverCounter = 0;

    player.addEventListener('keydown', function (event) {
        let step = player.duration / 50;
        let volumePanel = player.parentElement.querySelector('.vjs-volume-panel');

        let volumePanelAdjust = function () {
            volumePanelHoverCounter++;
            setTimeout(() => {
                volumePanelHoverCounter--;
                if (volumePanelHoverCounter <= 0) {
                    if (!volumePanel.matches(':hover')) {
                        volumePanel.classList.remove('vjs-hover');
                    }
                }
            }, 1000);
        }

        switch (event.code) {
            case 'ArrowLeft':
                player.currentTime = Math.max(0, player.currentTime - step);
                break;
            case 'ArrowRight':
                player.currentTime = Math.min(player.duration, player.currentTime + step);
                break;
            case 'Space':
                player.paused ? player.play() : player.pause();
                break;
            case 'ArrowUp':
                player.volume = Math.min(1, player.volume + 0.1);
                volumePanel.classList.add('vjs-hover');
                volumePanelAdjust();
                break;
            case 'ArrowDown':
                player.volume = Math.max(0, player.volume - 0.1);
                volumePanel.classList.add('vjs-hover');
                volumePanelAdjust();
                break;
            default:
                return;
        }

        event.stopPropagation();
        event.preventDefault();
    });

    return player
}

function attachPlayer() {
    var videoLinks = Array.from(document.querySelectorAll(".post__attachment-link, .scrape__attachment-link")).filter(it => !it.classList.contains('has-player'));
    if (videoLinks.length == 0) return false;
    for (let i in videoLinks) {
        let linkSrc = videoLinks[i].getAttribute("href");
        if (linkSrc.search("\.mp4|\.m4v") == -1) break;
        let player = createPlayer(linkSrc)
        videoLinks[i].parentElement.appendChild(player);
        videoLinks[i].classList.add('has-player');
        videojs(player)
    }
    return true;
}

(function () {
    'use strict';
    GM_addStyle(GM_getResourceText("video.js_css"));
    GM_addStyle(GM_getResourceText("video.js_theme_city_css"));

    window.addEventListener('load', event => {
        attachPlayer()
        let observer = new MutationObserver(function (mutations) {
            attachPlayer()
        });
        observer.observe(document.body, { childList: true, subtree: true })
    });
})();
