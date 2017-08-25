


/**********************************
************** Audio **************
**********************************/

var getMpdFile = function(url) {
    return sr.mpdParser(url);
};

getMpdFile("/MPEGDASH3/VideoDemo/output/stream.mpd").then(function(mpd) {

    var periods = mpd.manifestInfo.periodInfos;


    var period = new Period(periods[0], function() {

        masterPlayer = new MasterPlayer(period);
		masterPlayerControls = new MasterPlayerControls(masterPlayer);

		masterPlayerControls.generateControlsInDiv("forControls");

		var videoElement = masterPlayer.videoStreamerPlayers[0].stream.getVideoElement();
		ODV.initViewer(videoElement, "3DVideo", 50, 640, 480, true);
    });
});
