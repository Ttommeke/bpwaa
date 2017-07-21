var MetaDataStreamerPlayer = function( audioObject, metaDataStreamer, audioContext, masterPlayer) {
    this.audioContext = audioContext;
    this.metaDataStreamer = metaDataStreamer;
    this.audioObject = audioObject;
    this.onUpdateCallback = function(dummyEvent) {};
    this.interval = undefined;
    this.manualModeChangeCallback = undefined;
    this.masterPlayer = masterPlayer;

    this.manualMode = false;
};

MetaDataStreamerPlayer.prototype.isInManualMode = function() {
    return this.manualMode;
};

MetaDataStreamerPlayer.prototype.setOnUpdateCallback = function (callback) {
    this.onUpdateCallback = callback;
};

MetaDataStreamerPlayer.prototype.setOnManualModeChangeCallback = function (callback) {
    this.manualModeChangeCallback = callback;
};

MetaDataStreamerPlayer.prototype.setManualMode = function(value) {
    if (this.manualModeChangeCallback != undefined) {
        this.manualModeChangeCallback(value);
    }
    this.manualMode = value;
};

MetaDataStreamerPlayer.prototype.manualMove = function(position) {
    if (this.manualMode) {
        this.audioObject.getPannerNode().setPosition(position.x,position.y,position.z);
    }
};

MetaDataStreamerPlayer.prototype.play = function () {
    var that = this;

    this.interval = setInterval(function() {
        if (!that.manualMode) {
            var currentTime = that.masterPlayer.getCurrentTime();

            var before = that.getMetaDataBefore(currentTime);

            var after = that.getMetaDataAfter(currentTime);

            var deltaT = after.moment - before.moment + 0.0000001;
            var deltaBefore = currentTime - before.moment;
            var deltaAfter = after.moment - currentTime;

            var x = (before.x * (deltaT - deltaBefore) + after.x * (deltaT - deltaAfter)) / deltaT;
            var y = (before.y * (deltaT - deltaBefore) + after.y * (deltaT - deltaAfter)) / deltaT;
            var z = (before.z * (deltaT - deltaBefore) + after.z * (deltaT - deltaAfter)) / deltaT;

            that.audioObject.getPannerNode().setPosition(x,y,z);

            that.onUpdateCallback({ currentTime: currentTime, before: before, after: after, initData: that.metaDataStreamer.initData });
        }

    }, 50);
};

MetaDataStreamerPlayer.prototype.pause = function() {
    clearInterval(this.interval);
};

MetaDataStreamerPlayer.prototype.getMetaDataBefore = function (currentTime) {
    var metaDatas = this.metaDataStreamer.metaDatas;

    for (var i = 0; i < metaDatas.length - 1; i++) {
        if (metaDatas[i].moment > currentTime) {
            if ( metaDatas[i-1] == undefined) {
                console.log("meta data undefined", metaDatas, i-1, currentTime);
            }
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
