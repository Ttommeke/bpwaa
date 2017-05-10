var getMpdFile = function(url) {
    return sr.mpdParser(url);
};

//getMpdFile("/MPEGDASH2/song/output/stream.mpd");
var initUrl = "/MPEGDASH2/song/output/audio/und/am/init.mp4";
var representationUrl = "/MPEGDASH2/song/output/audio/und/am/seg-$Number$.m4s";


var streamReady = function(stream) {

    stream.getNextSegment().then(function() {
        streamReady(stream);
        //console.log(stream.sourceBuffer.mode);
    });
};

var metaDataStreamReady = function(stream) {

    stream.getNextSegment().then(function() {
        metaDataStreamReady(stream);
    });
};

getMpdFile("/MPEGDASH2/song/output/stream.mpd").then(function(mpd) {
    console.log(mpd);
});

var metaDataStreamer = new MetaDataStreamer( "/MPEGDASH2/song/output/metadata/am/init.json", "/MPEGDASH2/song/output/metadata/am/seg-$Number$.json", "metaFirst", metaDataStreamReady);
var masterPlayer = new MasterPlayer();

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var streamPlayer = null;
var streamy = new Streamer(initUrl, representationUrl, "first", function(stream) {
    streamPlayer = new StreamerPlayer(stream, audioContext, audioContext.destination);
    streamPlayer.getPannerNode().setPosition(0,0,1);
    streamPlayer.play();

    var metaDataStreamerPlayer = new MetaDataStreamerPlayer(streamPlayer, metaDataStreamer, audioContext, function(callbackEvent){});
    metaDataStreamerPlayer.play();

    masterPlayer.streamerPlayers.push(streamPlayer);
    masterPlayer.streamerPlayers.push(metaDataStreamerPlayer);
    masterPlayer.play();

    streamReady(stream);
});
