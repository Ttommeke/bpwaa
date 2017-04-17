var mpdObject = undefined;
var mpdPeriods = [];
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

sr.mpdParser('/MPEGDASH/mpdtest1/output/stream.mpd').then(function(mpd) {

    mpdObject = mpd;

    var allPeriods = [];

    for (var i = 0; i < mpd.manifestInfo.periodInfos.length; i++) {
        allPeriods.push( new Period(mpd.manifestInfo.periodInfos[i], audioContext));
    }

    mpdPeriods = allPeriods;

    for (var i = 0; i < mpdPeriods.length; i++) {
        var currentMpdPeriod = mpdPeriods[i];
        currentMpdPeriod.load();
    }
});