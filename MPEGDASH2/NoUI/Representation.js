var Representation = function(representation) {
    this.id = representation.id;
    this.bandwidth = representation.bandwidth;

    this.initUrl = representation.segmentInitializationInfo.url.getDomain() + representation.segmentInitializationInfo.url.getPath();
    this.segmentUrls = this.parseSegmentUrls(representation);
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
