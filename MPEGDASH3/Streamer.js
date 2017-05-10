var Streamer = function(initUrl, segmentUrl, name, onReadyCallBack) {
    var that = this;

    this.mediaSource = new MediaSource();
    this.segmentsLoaded = 0;
    this.representations = [];
    this.activeRepresentation = 0;

    that.audioElement = document.createElement("AUDIO");
    that.audioElement.src = URL.createObjectURL(that.mediaSource);

    that.mediaSource.addEventListener('sourceopen', function() {
        that.addRepresentation(initUrl, segmentUrl, 100, function() {
            onReadyCallBack(that);
        });
    });
};

Streamer.prototype.addRepresentation = function(initUrl, segmentUrl, bandwidth, callback) {
    var sourceBuffer = this.mediaSource.addSourceBuffer('audio/mp4');

    this.representations.push(new Representation(sourceBuffer, initUrl, segmentUrl, bandwidth, callback));
};

Streamer.prototype.getNextSegment = function() {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.representations[that.activeRepresentation].getSegment(that.segmentsLoaded + 1).then(function() {
            that.segmentsLoaded++;

            resolve(that);
        });
    });
};

Streamer.prototype.getAudioElement = function () {
    return this.audioElement;
};
