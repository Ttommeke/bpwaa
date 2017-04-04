var createStreamGetter = function(mpdUrl) {

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();

    var that =  {
        audioContext: context,
        mpdUrl: mpdUrl,
        mpdObject: undefined,
        mpdPeriods: [],
        mpdAudioUrls: [],
        initMpdFile: function() {

            return new Promise(function(resolve, reject) {
                sr.mpdParser('/MPEGDASH/mpdtest1/testSingle.mpd')
                .then(function(mpd) {

                    that.mpdObject = mpd;

                    var allPeriods = [];

                    for (var i = 0; i < mpd.manifestInfo.periodInfos.length; i++) {
                        allPeriods.push( new Period(mpd.manifestInfo.periodInfos[i], context));
                    }

                    that.mpdPeriods = allPeriods;

                    resolve(that.mpdPeriods);
                });
            });
        }
    }

    return that
};
