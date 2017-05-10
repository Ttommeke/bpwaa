var Representation = function(sourceBuffer, initUrl, segmentUrl, bandwidth, callbackWhenReady) {
    this.initUrl = initUrl;
    this.segmentUrl = segmentUrl;
    this.bandwidth = bandwidth;

    this.sourceBuffer = sourceBuffer;

    this.initStream().then(function() {
        callbackWhenReady();
    });
};

Representation.prototype.initStream = function() {
    var that = this;

    return new Promise(function(resolve, reject) {
        that.getData(that.initUrl).then(function(data) {
            that.appendBuffer(data);

            resolve();
        });
    });
};

Representation.prototype.getSegment = function(index) {
    var that = this;

    return new Promise(function(resolve, reject) {
        var url = that.segmentUrl.replace('$Number$', index);

        that.getData(url).then(function(data) {
            that.segmentsLoaded++;
            that.appendBuffer(data);

            resolve();
        });
    });
};

Representation.prototype.appendBuffer = function(data) {
    if (data !== undefined) {
        this.sourceBuffer.appendBuffer(data);
    }
};

Representation.prototype.getData = function(url) {
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
