var Streamer = function(initUrl, segmentUrl, name, onReadyCallBack) {
    this.initUrl = initUrl;
    this.segmentUrl = segmentUrl;

    var that = this;

    this.mediaSource = new MediaSource();
    that.sourceBuffer = null;
    that.segmentsLoaded = null;

    that.audioElement = document.createElement("AUDIO");
    that.audioElement.src = URL.createObjectURL(that.mediaSource);

    that.mediaSource.addEventListener('sourceopen', function() {
        that.sourceBuffer = that.mediaSource.addSourceBuffer('audio/mp4');
        that.segmentsLoaded = 1;

        that.initStream().then(function() {
            onReadyCallBack(that);
        });
    });
};

Streamer.prototype.getAudioElement = function () {
    return this.audioElement;
};

Streamer.prototype.initStream = function() {
    var that = this;

    return new Promise(function(resolve, reject) {
        that.getData(that.initUrl).then(function(data) {
            that.appendBuffer(data);

            resolve();
        });
    });
};

Streamer.prototype.getNextSegment = function () {
    var that = this;

    return new Promise(function(resolve, reject) {
        var url = that.segmentUrl.replace('$Number$', that.segmentsLoaded);

        that.getData(url).then(function(data) {
            that.segmentsLoaded++;
            that.appendBuffer(data);

            resolve();
        });
    });
};

Streamer.prototype.appendBuffer = function(data) {
    if (data !== undefined) {
        this.sourceBuffer.appendBuffer(data);
    }
};

Streamer.prototype.getData = function(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.open('get', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {

            if (xhr.status == 200) {
                resolve(xhr.response);
            } else {
                reject();
            }
        };
        xhr.send();
    });
}
