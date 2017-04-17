var Adaptationset = function(adaptationset, audioContext) {
    console.log(adaptationset);
    this.id = adaptationset.id;
    this.contentType = adaptationset.contentType;
    this.representations = this.parseRepresentations(adaptationset);
    this.activeStreamIndex = 0;
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

Adaptationset.prototype.loadInit = function() {

};

Adaptationset.prototype.load = function() {
    var that = this;

    if (that.representations.length > that.activeStreamIndex) {

        var url = that.representations[that.activeStreamIndex].url;

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function() {
            that.audioContext.decodeAudioData(request.response, function(streamDecoded) {
                for (var i = 0; i < streamDecoded.numberOfChannels; i++) {
                    var channelData = streamDecoded.getChannelData(i);

                    var monoAudioStream = that.channels[i];

                    if (monoAudioStream == undefined) {
                        monoAudioStream = new MonoAudioStream(that.audioContext, 0.5);
                    }

                    monoAudioStream.addAudioData(channelData);
                    var monoAudioStreamPlayer = new MonoAudioStreamPlayer(that.audioContext, monoAudioStream);

                    monoAudioStreamPlayer.play();
                }
            });
        };

        request.send();
    }
};
