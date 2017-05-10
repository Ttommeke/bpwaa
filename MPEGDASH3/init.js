var getMpdFile = function(url) {
    return sr.mpdParser(url);
};

var periodSegmentReady = function(period) {

    period.getNextSegment().then(function() {
        periodSegmentReady(period);
        //console.log(stream.sourceBuffer.mode);
    }).catch(function() {
        console.log("all streams are loaded!");
    });
};

getMpdFile("/MPEGDASH2/song/output/stream.mpd").then(function(mpd) {

    var periods = mpd.manifestInfo.periodInfos;

    var period = new Period(periods[0], function() {
        periodSegmentReady(period);

        var masterPlayer = new MasterPlayer(period);

        masterPlayer.play();
    });
});
