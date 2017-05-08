var getMpdFile = function(url) {
    return sr.mpdParser(url);
};

//getMpdFile("/MPEGDASH2/song/output/stream.mpd");
var initUrl = "/MPEGDASH2/song/output/audio/und/am/init.mp4";
var representationUrl = "/MPEGDASH2/song/output/audio/und/am/seg-$Number$.m4s";


var streamReady = function(stream) {

    stream.getNextSegment().then(function() {
        streamReady(stream);
    });
};

var streamPlayer = null;
var streamy = new Streamer(initUrl, representationUrl, "first", function(stream) {
    streamPlayer = new StreamerPlayer(stream);
    streamPlayer.play();

    streamReady(stream);
});
