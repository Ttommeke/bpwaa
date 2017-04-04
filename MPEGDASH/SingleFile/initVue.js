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

        var streamer = createStreamGetter('/MPEGDASH/mpdtest1/testSingle.mpd');
        streamer.initMpdFile().then(function(resp) {
            that.periods = resp;
        });

    },
    methods: {

    }
});
