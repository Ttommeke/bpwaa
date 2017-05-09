var MetaDataStreamerPlayer = function(streamer, streamerPlayer, metaDataStreamer, audioContext) {
    this.audioContext = audioContext;
    this.metaDataStreamer = metaDataStreamer;
    this.streamerPlayer = streamerPlayer;
    this.streamer = streamer;
};

MetaDataStreamerPlayer.prototype.play = function () {
    var that = this;

    setInterval(function() {
        var currentTime = that.streamer.getAudioElement().currentTime;

        var before = that.getMetaDataBefore(currentTime);

        var after = that.getMetaDataAfter(currentTime);

        var deltaT = after.moment - before.moment;
        var deltaBefore = currentTime - before.moment;
        var deltaAfter = after.moment - currentTime;

        var x = (before.x * (deltaT - deltaBefore) + after.x * (deltaT - deltaAfter)) / deltaT;
        var y = (before.y * (deltaT - deltaBefore) + after.y * (deltaT - deltaAfter)) / deltaT;
        var z = (before.z * (deltaT - deltaBefore) + after.z * (deltaT - deltaAfter)) / deltaT;

        console.log(x,y,z);

        that.streamerPlayer.getPannerNode().setPosition(x,y,z);

    }, 50);
};

MetaDataStreamerPlayer.prototype.getMetaDataBefore = function (currentTime) {
    var metaDatas = metaDataStreamer.metaDatas;

    for (var i = 0; i < metaDatas.length - 1; i++) {
        if (metaDatas[i].moment > currentTime) {
            return metaDatas[i-1];
        }
    }

    return this.MetaDataStreamer.initData;
};

MetaDataStreamerPlayer.prototype.getMetaDataAfter = function (currentTime) {
    var metaDatas = metaDataStreamer.metaDatas;

    for (var i = 0; i < metaDatas.length - 1; i++) {
        if (metaDatas[i].moment > currentTime) {
            return metaDatas[i];
        }
    }

    return this.MetaDataStreamer.initData;
};
