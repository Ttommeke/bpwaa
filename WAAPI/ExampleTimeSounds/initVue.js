var app = new Vue({
    el: '#app',
    data: function() {
        return { soundsLoaded : false };
    },
    mounted: function() {
        var that = this;

        InitSounds(function(sounds) {
            that.soundsLoaded = true;

            finishedLoading(sounds);
        });
    }
})
