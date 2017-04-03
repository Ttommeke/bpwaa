var context;
var bufferLoader;
var gainNode;

function InitSound() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
}

InitSound();

sr.mpdParser('/MPEGDASH/mpdtest1/testSingle.mpd').then(function(mpd) {

    console.log(mpd);
    // Inspect, work with parsed object.
});
