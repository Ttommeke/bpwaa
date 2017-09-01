/*
Streamer-class
--------------

This class is responsible for the process and organization of the audio data.
*/

/*
CONSTRUCTOR
-----------

input:
    shakaAdaptionSet - the shakaAdaptionSet from the shaka mpd parser
    onReadyCallBack - when al representations are ready and loaded the callback function will be called.
*/
var VideoStreamer = function( shakaAdaptionSet, onReadyCallBack) {
    var that = this;

    this.name = shakaAdaptionSet.id;

    this.mediaSource = new MediaSource();
    this.segmentToLoad = 0;
    this.representations = [];
    this.activeRepresentation = 0;

    that.videoElement = document.createElement("VIDEO");
    that.videoElement.src = URL.createObjectURL(that.mediaSource);

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

VideoStreamer.prototype.getActiveTimeRangeId = function() {
    var timeRanges = this.videoElement.buffered;
    var currenttime = this.getCurrentTime();

    for (var i = 0; i < timeRanges.length; i++) {
        if (timeRanges.start(i) <= currenttime && this.getCurrentTime() <= timeRanges.end(i)) {
            return i;
        }
    }

    return 0;
};

VideoStreamer.prototype.getTimeBuffered = function() {

    if (this.videoElement.buffered.length == 0) {
        return 0;
    }
    return this.videoElement.buffered.end(this.getActiveTimeRangeId());
};

VideoStreamer.prototype.getDuration = function() {
    return this.getVideoElement().duration;
};

/*
setCurrentTime
--------------

sets the segment to load to the correct index.
sets the position on the audio element to the givin position
*/
VideoStreamer.prototype.setCurrentTime = function(newCurrentTime) {
    this.segmentToLoad = this.representations[this.activeRepresentation].getSegmentIndexOnTime(newCurrentTime);

    //take the segment index before the current segment index to prevent problems in the playback.
    if (this.segmentToLoad > 0) {
        this.segmentToLoad = this.segmentToLoad - 1;
    }

    //check if the new date is within the duration.
    if (this.getDuration() > newCurrentTime) {
        this.getVideoElement().currentTime = newCurrentTime;
    } else {
        //if the duration is not yet set, that means it starts from the begining
        if (isNaN(this.getDuration())) {
            this.getVideoElement().currentTime = 0;
        } else {
            this.getVideoElement().currentTime = this.getDuration();
        }
    }
};

VideoStreamer.prototype.getCurrentTime = function() {
    return this.getVideoElement().currentTime;
};

VideoStreamer.prototype.addRepresentation = function(shakaRepresentation) {
    var that = this;

    return new Promise(function(resolve, reject) {
        var sourceBuffer = undefined;

        sourceBuffer = that.mediaSource.addSourceBuffer(shakaRepresentation.mimeType + '; codecs="' + shakaRepresentation.codecs + '"');

        that.representations.push(new Representation(sourceBuffer, shakaRepresentation, function() {
            resolve();
        }));
    });
};

VideoStreamer.prototype.getNextSegment = function() {
    var that = this;

    return new Promise(function(resolve, reject) {
        var activeSementIndex = that.segmentToLoad;
        that.segmentToLoad++;
        that.representations[that.activeRepresentation].getSegment(activeSementIndex).then(function() {
            
            resolve(that);
        }).catch(function(error) {
            reject(error);
        });
    });
};

VideoStreamer.prototype.getVideoElement = function () {
    return this.videoElement;
};
