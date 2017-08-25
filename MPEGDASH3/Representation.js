
/*
Representation-class
--------------------

This class represents a stream of audio data and is responsible for the downloading and adding the audio data to the sourceBuffer
*/

/*
CONSTRUCTOR
-----------

input:
    sourceBuffer - sourceBuffer to store the audio information in
    shakaRepresentation - is the representation of the shakaparser
    callbackWhenReady - is called when the initial data of the stream is loaded.
*/
var Representation = function(sourceBuffer, shakaRepresentation, callbackWhenReady) {
    this.initUrl = shakaRepresentation.segmentInitializationInfo.url.getDomain() + shakaRepresentation.segmentInitializationInfo.url.getPath();
    this.segments = shakaRepresentation.segmentIndex.references_;
    this.bandwidth = shakaRepresentation.bandwidth;
    this.duration = shakaRepresentation.duration;

    this.sourceBuffer = sourceBuffer;

    this.waitForNextSegment = undefined;
    this.waitForNextSegmentResolve = undefined;


    //get the initial data and call the callback function.
    this.initStream().then(function() {
        callbackWhenReady();
    });
};

Representation.prototype.initStream = function() {
    var that = this;

    //return a promise that is resolved when the initial data is downloaded and parsed.
    return new Promise(function(resolve, reject) {
        that.getData(that.initUrl).then(function(data) {
            that.appendBuffer(data).then(function() {
                resolve();
            });
        });
    });
};

Representation.prototype.getDuration = function() {
    return this.duration;
};


/*
getSegmentIndexOnTime
---------------------

returns the index of the segment in the segmentsList that corresponds to the time givin to the function.
*/
Representation.prototype.getSegmentIndexOnTime = function(time) {
    var that = this;
    var index = 0;


    for (var i = 0; i < this.segments.length; i++) {
        if (time >= this.segments[i].startTime && time < this.segments[i].endTime) {
            index = i;
            break;
        }
    }

    return index;
};

Representation.prototype.getSegment = function(index) {
    var that = this;

    var fetchFunction = function(resolve, reject) {
        that.waitForNextSegment = new Promise(function(resolve,reject) {
            that.waitForNextSegmentResolve = resolve;
        });
        if (that.segments.length >= index) {
            var segment = that.segments[index];
            var url = segment.url.getDomain() + segment.url.getPath();

            that.getData(url).then(function(data) {

                return that.appendBuffer(data);
            }).then(function() {
                that.waitForNextSegmentResolve();
                that.waitForNextSegment = undefined;
                resolve();
            }).catch(function(error) {
                that.waitForNextSegmentResolve();
                that.waitForNextSegment = undefined;
                reject(error);
            });
        } else {
            reject();
        }
    };

    //returns a promise that is resolved upon downloading the audio and adding it to the sourceBuffer
    return new Promise(function(resolve, reject) {
        if (that.waitForNextSegment == undefined) {
            fetchFunction(resolve,reject);
        } else {
            that.waitForNextSegment.then(function() {
                fetchFunction(resolve,reject);
            });
        }
    });
};

Representation.prototype.appendBuffer = function(data) {

    var that = this;

    return new Promise(function(resolve,reject) {
        if (data !== undefined) {
            that.sourceBuffer.appendBuffer(data);
            that.sourceBuffer.addEventListener('updateend', function() {
                resolve();
            }, false);
        } else {
            reject();
        }
    });
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
