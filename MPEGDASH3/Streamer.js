var Streamer = function( shakaAdaptionSet, onReadyCallBack) {
    var that = this;

    this.name = shakaAdaptionSet.id;

    this.mediaSource = new MediaSource();
    this.segmentToLoad = 0;
    this.representations = [];
    this.activeRepresentation = 0;

    that.audioElement = document.createElement("AUDIO");
    that.audioElement.src = URL.createObjectURL(that.mediaSource);

    that.mediaSource.addEventListener('sourceopen', function() {

        var totalRepresentationsParsed = 0;
        var totalRepresentationsToParse = shakaAdaptionSet.streamInfos.length;

        for (var i = 0; i < totalRepresentationsToParse; i++) {

            that.addRepresentation(shakaAdaptionSet.streamInfos[i]).then(function() {
                totalRepresentationsParsed++;

                if (totalRepresentationsParsed >= totalRepresentationsToParse) {
                    onReadyCallBack(that);
                }
            });
        }

    });
};

Streamer.prototype.getActiveTimeRangeId = function() {
    var timeRanges = this.audioElement.buffered;
    return 0;
};

Streamer.prototype.getTimeBuffered = function() {

    if (this.audioElement.buffered.length == 0) {
        return 0;
    }
    return this.audioElement.buffered.end(this.getActiveTimeRangeId());
};

Streamer.prototype.getDuration = function() {
    return this.getAudioElement().duration;
};

Streamer.prototype.setCurrentTime = function(newCurrentTime) {
    this.segmentToLoad = this.representations[this.activeRepresentation].getSegmentIndexOnTime(newCurrentTime);

    if (this.segmentToLoad > 0) {
        this.segmentToLoad = this.segmentToLoad - 1;
    }

    if (this.getDuration() > newCurrentTime) {
        this.getAudioElement().currentTime = newCurrentTime;
    } else {
        if (isNaN(this.getDuration())) {
            this.getAudioElement().currentTime = 0;
        } else {
            this.getAudioElement().currentTime = this.getDuration();
        }
    }
};

Streamer.prototype.addRepresentation = function(shakaRepresentation) {
    var that = this;

    return new Promise(function(resolve, reject) {
        var sourceBuffer = undefined;

        if (navigator.userAgent.search("Firefox") > -1) {
            sourceBuffer = that.mediaSource.addSourceBuffer('audio/mp4');
        } else if (navigator.userAgent.search("Chrome") > -1) {
            sourceBuffer = that.mediaSource.addSourceBuffer('audio/mp4');
        }


        that.representations.push(new Representation(sourceBuffer, shakaRepresentation, function() {
            resolve();
        }));
    });
};

Streamer.prototype.getNextSegment = function() {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.representations[that.activeRepresentation].getSegment(that.segmentToLoad).then(function() {
            that.segmentToLoad++;

            resolve(that);
        }).catch(function() {
            reject();
        });
    });
};

Streamer.prototype.getAudioElement = function () {
    return this.audioElement;
};
