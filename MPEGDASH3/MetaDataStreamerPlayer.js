var MetaDataStreamerPlayer = function( streamerPlayer, metaDataStreamer, audioContext) {
    this.audioContext = audioContext;
    this.metaDataStreamer = metaDataStreamer;
    this.streamerPlayer = streamerPlayer;
    this.onUpdateCallback = function(dummyEvent) {};
    this.interval = undefined;
};

MetaDataStreamerPlayer.prototype.setOnUpdateCallback = function (callback) {
    this.onUpdateCallback = callback;
};

MetaDataStreamerPlayer.prototype.play = function () {
    var that = this;

    this.interval = setInterval(function() {
        var currentTime = that.streamerPlayer.getCurrentTime();

        var before = that.getMetaDataBefore(currentTime);

        var after = that.getMetaDataAfter(currentTime);

        var deltaT = after.moment - before.moment + 0.0000001;
        var deltaBefore = currentTime - before.moment;
        var deltaAfter = after.moment - currentTime;

        var x = (before.x * (deltaT - deltaBefore) + after.x * (deltaT - deltaAfter)) / deltaT;
        var y = (before.y * (deltaT - deltaBefore) + after.y * (deltaT - deltaAfter)) / deltaT;
        var z = (before.z * (deltaT - deltaBefore) + after.z * (deltaT - deltaAfter)) / deltaT;

        that.streamerPlayer.getPannerNode().setPosition(x,y,z);

        that.onUpdateCallback({ currentTime: currentTime, before: before, after: after, initData: that.metaDataStreamer.initData });

    }, 50);
};

MetaDataStreamerPlayer.prototype.pause = function() {
    clearInterval(this.interval);
};

MetaDataStreamerPlayer.prototype.getMetaDataBefore = function (currentTime) {
    var metaDatas = this.metaDataStreamer.metaDatas;

    for (var i = 0; i < metaDatas.length - 1; i++) {
        if (metaDatas[i].moment > currentTime) {
            return metaDatas[i-1];
        }
    }

    return this.metaDataStreamer.initData;
};

MetaDataStreamerPlayer.prototype.getMetaDataAfter = function (currentTime) {
    var metaDatas = this.metaDataStreamer.metaDatas;

    for (var i = 0; i < metaDatas.length - 1; i++) {
        if (metaDatas[i].moment > currentTime) {
            return metaDatas[i];
        }
    }

    return this.metaDataStreamer.initData;
};
