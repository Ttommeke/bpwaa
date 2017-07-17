var Representation = function(sourceBuffer, shakaRepresentation, callbackWhenReady) {
    this.initUrl = shakaRepresentation.segmentInitializationInfo.url.getDomain() + shakaRepresentation.segmentInitializationInfo.url.getPath();
    this.segments = shakaRepresentation.segmentIndex.references_;
    this.bandwidth = shakaRepresentation.bandwidth;
    this.duration = shakaRepresentation.duration;

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

Representation.prototype.getDuration = function() {
    return this.duration;
};

Representation.prototype.getSegment = function(index) {
    var that = this;

    return new Promise(function(resolve, reject) {
        if (that.segments.length > index) {
            var segment = that.segments[index-1];
            var url = segment.url.getDomain() + segment.url.getPath();

            that.getData(url).then(function(data) {
                that.appendBuffer(data);

                resolve();
            }).catch(function() {
                reject();
            });
        } else {
            reject();
        }
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
