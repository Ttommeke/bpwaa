var sms = undefined;

var app = new Vue({
    el: '#app',
    data: function() {

        return {
            loadingMPDFile : true,
            periods : []
        };
    },
    mounted: function() {
        var that = this;

        sr.mpdParser('/MPEGDASH/mpdtest1/testSingle.mpd')
        .then(function(mpd) {

            console.log(mpd);
            that.periods = mpd.manifestInfo.periodInfos;
        	// Inspect, work with parsed object.
        });
    },
    methods: {

    }
});
