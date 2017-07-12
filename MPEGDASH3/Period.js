var OUT_OF_CONTROL_THRESHOLD = 30; //30 seconden


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

Period.prototype.startBufferProccess = function() {

    var that = this;

    var nextSegmentForAudio = function(stream) {
        if (!that.isStreamRunningOutOfControl(stream)) {
            stream.getNextSegment().then(function() {
                nextSegmentForAudio(stream);
            }).catch(function() {
                console.log("Stream done");
            });
        } else {
            console.log("Throtteling Stream");
            setTimeout(function(){ nextSegmentForAudio(stream); }, 100);
        }
    };

    var nextSegmentForMetaData = function(stream) {
        stream.getNextSegment().then(function() {
            nextSegmentForMetaData(stream);
        }).catch(function() {
            console.log("MetaDataStream done");
        });
    };

    for (var i = 0; i < this.streams.length; i++) {
        nextSegmentForAudio(this.streams[i]);
    }

    for (var i = 0; i < this.metaDataStreams.length; i++) {
        nextSegmentForMetaData(this.metaDataStreams[i]);
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

Period.prototype.isStreamRunningOutOfControl = function(stream) {
    var that = this;

    var streamThatIsBehind = that.streams[0];

    for (var i = 1; i < that.streams.length; i++) {
        if (that.streams[0].getTimeBuffered() < streamThatIsBehind.getTimeBuffered()) {
            streamThatIsBehind = that.streams[0];
        }
    }

    if (stream.getTimeBuffered() > streamThatIsBehind.getTimeBuffered() + OUT_OF_CONTROL_THRESHOLD) {
        return true;
    } else {
        return false;
    }
}

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
