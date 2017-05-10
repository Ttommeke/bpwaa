var Period = function(shakaPeriod, onReadyCallBack) {
    this.streams = [];
    this.metaDataStreams = [];

    var totalStreamsToParse = shakaPeriod.streamSetInfos.length;
    var totalStreamsParsed = 0;

    for (var i = 0; i < totalStreamsToParse; i++) {
        if (shakaPeriod.streamSetInfos[i].contentType == "text") {
            this.addMetaDataStreamFromAdaptionSet(shakaPeriod.streamSetInfos[i]).then(function() {
                totalStreamsParsed++;

                if (totalStreamsParsed >= totalStreamsToParse) {
                    onReadyCallBack();
                }
            });
        } else {
            this.addStreamFromAdaptionSet(shakaPeriod.streamSetInfos[i]).then(function() {
                totalStreamsParsed++;

                if (totalStreamsParsed >= totalStreamsToParse) {
                    onReadyCallBack();
                }
            });
        }
    }
};

Period.prototype.getNextSegment = function() {
    var that = this;

    return new Promise(function(resolve, reject) {
        var totalStreams = that.streams.length + that.metaDataStreams.length;
        var streamsReady = 0;
        var rejects = 0;

        var resolveFunction = function() {
            streamsReady++;

            if (streamsReady >= totalStreams) {
                if (rejects >= totalStreams) {
                    reject();
                } else {
                    resolve();
                }
            }
        };

        for (var i = 0; i < that.streams.length; i++) {
            that.streams[i].getNextSegment().then(function() {
                resolveFunction();
            }).catch(function() {
                rejects++;
                resolveFunction();
            });
        }

        for (var i = 0; i < that.metaDataStreams.length; i++) {
            that.metaDataStreams[i].getNextSegment().then(function() {
                resolveFunction();
            }).catch(function() {
                rejects++;
                resolveFunction();
            });
        }
    });
};

Period.prototype.addStreamFromAdaptionSet = function(shakaAdaptionSet) {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.streams.push(new Streamer(shakaAdaptionSet, function() {
            resolve();
        }));
    });

};

Period.prototype.addMetaDataStreamFromAdaptionSet = function(shakaAdaptionSet) {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.metaDataStreams.push(new MetaDataStreamer(shakaAdaptionSet, function() {
            resolve();
        }));
    });

};
