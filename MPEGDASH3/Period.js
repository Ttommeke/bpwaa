var OUT_OF_CONTROL_THRESHOLD = 30; //30 seconden


var Period = function(shakaPeriod, onReadyCallBack) {
    this.streams = [];
    this.metaDataStreams = [];
    this.duration = shakaPeriod.duration;

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
                console.log(stream.name + " done with " + stream.getTimeBuffered() + " seconds in buffer.");
            });
        } else {
            //console.log("Throtteling Stream");
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

Period.prototype.isStreamRunningOutOfControl = function(stream) {
    var that = this;

    var streamThatIsBehind = that.streams[0];

    for (var i = 1; i < that.streams.length; i++) {

        //console.log(that.streams[i].getTimeBuffered(), that.streams[i].getDuration() );
        if (that.streams[i].getTimeBuffered() < that.streams[i].getDuration() && that.streams[i].getTimeBuffered() < streamThatIsBehind.getTimeBuffered()) {
            streamThatIsBehind = that.streams[i];
        }
    }

    if (stream.getTimeBuffered() > streamThatIsBehind.getTimeBuffered() + OUT_OF_CONTROL_THRESHOLD) {
        return true;
    } else {
        return false;
    }
}

Period.prototype.getDuration = function() {
    return this.duration;
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
