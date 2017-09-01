


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

		ODV.initViewer(videoElement, "3DVideo", 50, 640, 480, true, function(lon,lat) {
            var lonRad = (lon/180)*Math.PI;
            var latRad = (lat/180)*Math.PI;

            var lengthOfNose = -5;
            var lengthOnXZ = lengthOfNose * Math.cos(latRad);
            var noseOrientation = {
                x: lengthOnXZ * Math.sin(lonRad),
                y: lengthOfNose * Math.sin(latRad),
                z: lengthOnXZ * Math.cos(lonRad)
            };

            var lengthToHeadOnXZ = lengthOfNose * Math.cos(latRad + Math.PI/2);
            var lengthToHeadOnY = lengthOfNose * Math.sin(latRad + Math.PI/2);

            var headOrientation = {
                x: lengthToHeadOnXZ * Math.sin(lonRad),
                y: lengthToHeadOnY,
                z: lengthToHeadOnXZ * Math.cos(lonRad)
            };

            masterPlayer.audioContext.listener.setOrientation(
                noseOrientation.x,
                noseOrientation.y,
                noseOrientation.z,

                headOrientation.x,
                headOrientation.y,
                headOrientation.z
            );
        });
    });
});
