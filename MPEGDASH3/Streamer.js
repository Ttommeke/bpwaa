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

/*
setCurrentTime
--------------

sets the segment to load to the correct index.
sets the position on the audio element to the givin position
*/
Streamer.prototype.setCurrentTime = function(newCurrentTime) {
    this.segmentToLoad = this.representations[this.activeRepresentation].getSegmentIndexOnTime(newCurrentTime);

    //take the segment index before the current segment index to prevent problems in the playback.
    if (this.segmentToLoad > 0) {
        this.segmentToLoad = this.segmentToLoad - 1;
    }

    //check if the new date is within the duration.
    if (this.getDuration() > newCurrentTime) {
        this.getAudioElement().currentTime = newCurrentTime;
    } else {
        //if the duration is not yet set, that means it starts from the begining
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

        sourceBuffer = that.mediaSource.addSourceBuffer(shakaRepresentation.mimeType + '; codecs="' + shakaRepresentation.codecs + '"');

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
        }).catch(function(error) {
            reject(error);
        });
    });
};

Streamer.prototype.getAudioElement = function () {
    return this.audioElement;
};
