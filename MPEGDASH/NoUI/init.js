var context;
var bufferLoader;
var gainNode;

function InitSound() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
}

InitSound();

var sg = createStreamGetter("/MPEGDASH/mpdtest1/testSingle.mpd");
sg.initMpdFile();
