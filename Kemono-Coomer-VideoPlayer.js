// ==UserScript==
// @name         Kemono/Coomer-VideoPlayer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  take a video player under the link
// @author       You
// @match        https://coomer.party/*
// @match        https://kemono.party/*
// @match        https://coomer.su/*
// @match        https://kemono.su/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     css https://vjs.zencdn.net/7.10.2/video-js.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/video.js/7.1.0/video.js
// @license      MIT
// ==/UserScript==

function kemonoVideoPlayer() {
    var video_links = document.getElementsByClassName("post__attachment-link");
    for (var i in video_links) {
        if(i == "length") break;
        var linksrc = video_links[i].getAttribute("href");
        if (linksrc.search("\.mp4|\.m4v") == -1) break;
        var player = document.createElement("video");
        player.controls = true;
        player.preload = "auto";
        player.className = "video-js vjs-default-skin";

        player.style.width = "100%";
        player.height = 800;
        player.setAttribute("data-setup", "{}");

        var src = document.createElement("source");
        src.type = "video/mp4";
        src.src = linksrc;
        player.appendChild(src);

        var div = document.createElement("div");
        div.appendChild(player);

        video_links[i].parentElement.appendChild(div);
        videojs(player);
    }
}

(function () {
    'use strict';
    GM_addStyle(GM_getResourceText("css"));
    kemonoVideoPlayer();
})();
