var Streamer = function( shakaAdaptionSet, onReadyCallBack) {
    var that = this;

    this.name = shakaAdaptionSet.id;

    this.mediaSource = new MediaSource();
    this.segmentsLoaded = 0;
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

Streamer.prototype.addRepresentation = function(shakaRepresentation) {
    var that = this;

    return new Promise(function(resolve, reject) {
        var sourceBuffer = that.mediaSource.addSourceBuffer('audio/mp4');

        that.representations.push(new Representation(sourceBuffer, shakaRepresentation, function() {
            resolve();
        }));
    });
};

Streamer.prototype.getNextSegment = function() {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.representations[that.activeRepresentation].getSegment(that.segmentsLoaded + 1).then(function() {
            that.segmentsLoaded++;

            resolve(that);
        }).catch(function() {
            reject();
        });
    });
};

Streamer.prototype.getAudioElement = function () {
    return this.audioElement;
};
