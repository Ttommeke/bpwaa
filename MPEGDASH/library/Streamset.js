var StreamsetStatus = {
    LOADING : "LOADING",
    WAITING : "WAITING"
};

var Streamset = function(streamSet, audioContext, durationBuffer) {

    this.id = streamSet.id;
    this.audioContext = audioContext;
    this.contentType = streamSet.contentType;
    this.streams = this.parseStreams(streamSet);
    this.status = StreamsetStatus.WAITING;
    this.durationBuffer = durationBuffer;
    this.buffer = [];
    this.activeStreamIndex = 0;
};

Streamset.prototype.getBufferFromPosition = function() {

};

Streamset.prototype.getBuffersLoadedFromBufferPosiion = function() {

};

Streamset.prototype.loadNextFromBufferPosition = function(position, doneLoading) {
    var that = this;

    var buffer = undefined;
    that.status = StreamsetStatus.LOADING;

    return new Promise(function(resolve, reject) {
        var url = that.streams[that.activeStreamIndex].url;

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function() {
            that.audioContext.decodeAudioData(request.response, function(streamDecoded) {
                console.log(streamDecoded);
                that.status = StreamsetStatus.WAITING;

                resolve();
            });
        };

        request.send();
    });
};

Streamset.prototype.splitAndMergeBuffers = function(position, stream) {

};

Streamset.prototype.parseStreams = function (streamSet) {
    var allStreams = [];

    for (var i = 0; i < streamSet.streamInfos.length; i++) {
        allStreams.push( new Stream(streamSet.streamInfos[i]));
    }

    return allStreams;
};
