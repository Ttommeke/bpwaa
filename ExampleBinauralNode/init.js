
var context;
var bufferLoader;
var gainNode;

function InitSound() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    //creating buffers for the audio context.
    //got this from:
    //http://ircam-rnd.github.io/binauralFIR/examples/
    //
    //This for-loop loads the binaural data and creats buffers for it.
    //
    //this HRTF-table is free of use for non commercial use.
    for (var i = 0; i < hrtfs.length; i++) {
         var buffer = context.createBuffer(2, 512, 44100);
         var bufferChannelLeft = buffer.getChannelData(0);
         var bufferChannelRight = buffer.getChannelData(1);
         for (var e = 0; e < hrtfs[i].fir_coeffs_left.length; e++) {
             bufferChannelLeft[e] = hrtfs[i].fir_coeffs_left[e];
             bufferChannelRight[e] = hrtfs[i].fir_coeffs_right[e];
         }
         hrtfs[i].buffer = buffer;
     }
}


InitSound();
