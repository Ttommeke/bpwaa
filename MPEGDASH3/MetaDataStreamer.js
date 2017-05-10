var MetaDataStreamer = function(shakaAdaptionSet, onReadyCallBack) {
    var metaDatas = [];
    this.initUrl = shakaAdaptionSet.streamInfos[0].segmentInitializationInfo.url.getDomain() + shakaAdaptionSet.streamInfos[0].segmentInitializationInfo.url.getPath();
    this.initData = undefined;
    this.name = shakaAdaptionSet.id;
    this.metaDatas = [];
    this.segments = shakaAdaptionSet.streamInfos[0].segmentIndex.references_;

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
        if (that.segments.length > that.segmentsLoaded-1) {
            var segment = that.segments[that.segmentsLoaded-1];
            var url = segment.url.getDomain() + segment.url.getPath();

            that.getData(url).then(function(data) {
                that.segmentsLoaded++;
                that.appendMetaData(data);

                resolve();
            }).catch(function() {
                reject();
            });
        } else {
            reject();
        }

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
