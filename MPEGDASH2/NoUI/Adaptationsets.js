var Adaptationset = function(adaptationset, audioContext) {
    console.log(adaptationset);
    this.id = adaptationset.id;
    this.contentType = adaptationset.contentType;
    this.representations = this.parseRepresentations(adaptationset);
    this.activeRepresentation = 0;
    this.channels = [];

    this.audioContext = audioContext;
};

Adaptationset.prototype.parseRepresentations = function(adaptationset) {
    var allRepresentations = [];

    for (var i = 0; i < adaptationset.streamInfos.length; i++) {
        allRepresentations.push(new Representation(adaptationset.streamInfos[i]));
    }

    return allRepresentations;
};

Adaptationset.prototype.loadNext = function() {
    var that = this;

    return new Promise(function(resolve, reject) {
        var activeRep = that.representations[that.activeRepresentation];
        activeRep.loadNextSegment().then(function(representationReady) {
            var typedArray = ArrayBufferHelper.concatTypedArrays(representationReady.getInitdata(), representationReady.getLastSegment());

            return that.parseAudioData(typedArray);
        }).then(function() {
            resolve(that);
        }).catch(function() {
            reject();
        });
    });
};

Adaptationset.prototype.parseAudioData = function(audioData) {
    var that = this;

    return new Promise(function(resolve, reject) {
        that.audioContext.decodeAudioData(audioData, function(streamDecoded) {
            for (var i = 0; i < streamDecoded.numberOfChannels; i++) {
                var channelData = streamDecoded.getChannelData(i);

                var monoAudioStream = that.channels[i];

                if (monoAudioStream == undefined) {
                    monoAudioStream = new MonoAudioStream(that.audioContext, 0.5);
                    that.channels[i] = monoAudioStream;
                }

                monoAudioStream.addAudioData(channelData);
            }

            resolve();
        });
    });
};

Adaptationset.prototype.getChannels = function() {
    return this.channels;
};
