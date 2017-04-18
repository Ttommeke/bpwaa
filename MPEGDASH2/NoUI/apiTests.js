window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

var request = new XMLHttpRequest();
request.open("GET", "/MPEGDASH/mpdtest1/output/audio/und/mp4a/init.mp4", true);
request.responseType = "arraybuffer";


function concatTypedArrays(a, b) { // a, b TypedArray of same type

    var tmp = new Uint8Array(a.byteLength + b.byteLength);
    tmp.set(new Uint8Array(a), 0);
    tmp.set(new Uint8Array(b), a.byteLength);
    return tmp.buffer;
}


request.onload = function() {

    var initMP4 = request.response;

    var request2 = new XMLHttpRequest();
    request2.open("GET", "/MPEGDASH/mpdtest1/output/audio/und/mp4a/seg-2.m4s", true);
    request2.responseType = "arraybuffer";

    request2.onload = function() {
        var partMP4 = request2.response;

        console.log(initMP4);

        audioContext.decodeAudioData(concatTypedArrays(initMP4, partMP4), function(streamDecoded) {
            for (var i = 0; i < streamDecoded.numberOfChannels; i++) {
                var channelData = streamDecoded.getChannelData(i);

                var monoAudioStream = new MonoAudioStream(audioContext, 0.5);

                monoAudioStream.addAudioData(channelData);
                var monoAudioStreamPlayer = new MonoAudioStreamPlayer(audioContext, monoAudioStream);

                monoAudioStreamPlayer.play();
            }
        });
    };

    request2.send();

};

request.send();
