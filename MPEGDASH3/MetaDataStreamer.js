/*
MetaDataStreamer-class
----------------------

This class organizes the metadata and fetches them
*/

/*
CONSTRUCTOR
-----------

input:
    shakaAdaptionSet - the adaptionset provided by the shaka mpd parser.
    onReadyCallBack - callback function that is called when the initial metadata is fetched and the MetaDataStreamer is ready to fetch more meta data.
output:
    MetaDataStreamer-object
*/

var MetaDataStreamer = function(shakaAdaptionSet, onReadyCallBack) {
    var metaDatas = [];
    this.initUrl = shakaAdaptionSet.streamInfos[0].segmentInitializationInfo.url.getDomain() + shakaAdaptionSet.streamInfos[0].segmentInitializationInfo.url.getPath();
    this.initData = undefined;
    this.name = shakaAdaptionSet.id;
    this.metaDatas = [];
    this.segments = shakaAdaptionSet.streamInfos[0].segmentIndex.references_;

    this.segmentsLoaded = 1;

    var that = this;

    //fetch initial meta data and cll the callback function
    this.initStream().then(function() {
        onReadyCallBack(that);
    });
};

MetaDataStreamer.prototype.appendMetaData = function(newMetaData) {
    this.metaDatas = this.metaDatas.concat(newMetaData);
};

MetaDataStreamer.prototype.initStream = function() {
    var that = this;

    //create promise that will resolve when the inital meta data is fetched
    return new Promise(function(resolve, reject) {
        that.getData(that.initUrl).then(function(data) {
            that.initData = data;

            resolve();
        });
    });
};

MetaDataStreamer.prototype.getNextSegment = function () {
    var that = this;

    //return a pomise that will resolve upon fetching an adding the meta data segment to the list of meta data's
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
