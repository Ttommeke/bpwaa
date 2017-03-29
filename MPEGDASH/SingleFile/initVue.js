var sms = undefined;

var app = new Vue({
    el: '#app',
    data: function() {

        return {
            loadingMPDFile : true,
            stream : []
        };
    },
    mounted: function() {
        var options = {
            headers: {
                "Accept": "text/xml"
            }
        };

        sr.mpdParser('/MPEGDASH/mpdtest1/testSingle.mpd')
        .then(function(mpd) {
            console.log(mpd);
        	// Inspect, work with parsed object.
        });
    },
    methods: {

    }
});
