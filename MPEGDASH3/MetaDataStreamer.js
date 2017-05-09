var MetaDataStreamer = function(initUrl, segmentUrl, name, onReadyCallBack) {
    var metaDatas = [];
    this.initUrl = initUrl;
    this.initData = undefined;
    this.metaDatas = [];
    this.segmentUrl = segmentUrl;

    this.segmentsLoaded = 1;

    var that = this;

    this.initStream().then(function() {
        onReadyCallBack(that);
    });
};

MetaDataStreamer.prototype.appendMetaData = function(newMetaData) {
    this.metaDatas = this.metaDatas.concat(newMetaData);
};

MetaDataStreamer.prototype.initStream = function() {
    var that = this;

    return new Promise(function(resolve, reject) {
        that.getData(that.initUrl).then(function(data) {
            that.initData = data;

            resolve();
        });
    });
};

MetaDataStreamer.prototype.getNextSegment = function () {
    var that = this;

    return new Promise(function(resolve, reject) {
        var url = that.segmentUrl.replace('$Number$', that.segmentsLoaded);

        that.getData(url).then(function(data) {
            that.segmentsLoaded++;
            that.appendMetaData(data);

            resolve();
        });
    });
};

MetaDataStreamer.prototype.getData = function(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.open('get', url);
        xhr.responseType = 'json';
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
