var Representation = function(representation) {
    this.id = representation.id;
    this.mimeType = representation.mimeType;
    this.bandwidth = representation.bandwidth;
    this.isLoading = false;

    this.initUrl = representation.segmentInitializationInfo.url.getDomain() + representation.segmentInitializationInfo.url.getPath();
    this.segmentUrls = this.parseSegmentUrls(representation);

    this.initLoaded = false;
    this.initData = undefined;

    this.segmentsLoaded = 0;
    this.segments = [];
};

Representation.prototype.parseSegmentUrls = function (representation) {
    var segmentUrls = [];
    var segmentArray = representation.segmentIndex.references_;

    for (var i = 0; i < segmentArray.length; i++) {
        var subject = segmentArray[i];

        segmentUrls.push(subject.url.getDomain() + subject.url.getPath());
    }

    return segmentUrls;
};

Representation.prototype.getResponseType = function() {
    if (this.mineType == "application/json") {
        return "json";
    } else {
        return "arraybuffer";
    }
};

Representation.prototype.loadNextSegment = function() {
    var that = this;

    return new Promise(function(resolve, reject) {

        var loadNext = function() {
            that.isLoading = true;

            var request = new XMLHttpRequest();
            request.open("GET", that.segmentUrls[that.segmentsLoaded], true);
            request.responseType = that.getResponseType();

            request.onload = function() {
                that.segments[that.segmentsLoaded] = request.response;

                that.segmentsLoaded++;
                that.isLoading = false;

                resolve(that);
            };

            request.send();
        };

        if (!that.initLoaded) {
            that.loadInit().then(loadNext);
        } else if (that.segmentsLoaded >= that.segmentUrls.length) {
            reject();
        } else {
            loadNext();
        }
    });
};

Representation.prototype.loadInit = function() {
    var that = this;

    return new Promise(function(resolve, reject) {

        that.isLoading = true;

        var request = new XMLHttpRequest();
        request.open("GET", that.initUrl, true);
        request.responseType = "arraybuffer";

        request.onload = function() {
            that.initData = request.response;
            that.initLoaded = true;

            that.isLoading = false;

            resolve(that);
        };

        request.send();
    });
};

Representation.prototype.getInitdata = function() {
    return this.initData;
};

Representation.prototype.getSegment = function(number) {
    return this.segments[number];
};

Representation.prototype.getLastSegment = function() {
    return this.getSegment(this.segmentsLoaded - 1);
};
