var AdaptationsetMetadata = function(adaptationset) {
    console.log(adaptationset);
    this.id = adaptationset.id;
    this.contentType = adaptationset.contentType;
    this.representations = this.parseRepresentations(adaptationset);
    this.activeRepresentation = 0;

    this.metaData = [];
};

AdaptationsetMetadata.prototype.parseRepresentations = function(adaptationset) {
    var allRepresentations = [];

    for (var i = 0; i < adaptationset.streamInfos.length; i++) {
        allRepresentations.push(new Representation(adaptationset.streamInfos[i]));
    }

    return allRepresentations;
};

AdaptationsetMetadata.prototype.loadNext = function() {
    var that = this;

    return new Promise(function(resolve, reject) {
        var activeRep = that.representations[that.activeRepresentation];
        activeRep.loadNextSegment().then(function(representationReady) {
            that.metaData = representationReady.getLastSegment();

            resolve(that);
        }).catch(function() {
            reject();
        });
    });
};

AdaptationsetMetadata.prototype.getMetaData = function() {
    return this.metaData;
};
