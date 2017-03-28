
var context;
var bufferLoader;
var gainNode;

function InitSound() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
}


InitSound();
