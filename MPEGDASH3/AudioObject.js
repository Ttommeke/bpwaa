

var AudioObject = function(streamerPlayers, metaDataInit, audioContext, destination) {
    this.audioContext = audioContext;

    this.channelMerger = this.audioContext.createChannelMerger(metaDataInit.channels.length);
    this.connectStreamerPlayerChannels(streamerPlayers, metaDataInit);

    this.pannerNode = this.audioContext.createPanner();
    this.pannerNode.panningModel = 'HRTF';
    this.pannerNode.distanceModel = 'inverse';
    this.pannerNode.refDistance = 1;
    this.pannerNode.maxDistance = 10000;
    this.pannerNode.rolloffFactor = 1;
    this.pannerNode.coneInnerAngle = 360;
    this.pannerNode.coneOuterAngle = 0;
    this.pannerNode.coneOuterGain = 0;
    this.pannerNode.setPosition(2,0,0);

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 1;

    this.channelMerger.connect(this.pannerNode);
    this.pannerNode.connect(this.gainNode);
    this.gainNode.connect(destination);
};

AudioObject.prototype.connectStreamerPlayerChannels = function (streamerPlayers, metaDataInit) {
    var that = this;

    metaDataInit.channels.forEach(function (channel) {
        if (channel.type == "STREAM") {
            var streamerPlayer = that.findStreamerPlayerWithId(streamerPlayers, channel.id);
            var gainNode = that.audioContext.createGain();

            streamerPlayer.getSource().connect(gainNode, channel.outputChannelIndex, 0);
            gainNode.connect(that.channelMerger, 0, channel.inputChannelIndex);
        } else if (channel.type == "GENERATED") {
            var oscilatorNode = that.audioContext.createOscillator();
            var gainNode = that.audioContext.createGain();
            gainNode.gain.value = channel.volume;
            oscilatorNode.type = channel.waveType;
            oscilatorNode.frequency.value = channel.frequency;

            oscilatorNode.connect(gainNode);
            gainNode.connect(that.channelMerger, 0, channel.inputChannelIndex);
            oscilatorNode.start();
        }
    });
};

AudioObject.prototype.findStreamerPlayerWithId = function(streamerPlayers, id) {
    for (var i = 0; i < streamerPlayers.length; i++) {
        if (streamerPlayers[i].stream.name == id) {
            return streamerPlayers[i];
        }
    }

    console.log("no StreamerPlayer founded for " + id);
    return undefined;
};

AudioObject.prototype.getPannerNode = function() {
    return this.pannerNode;
};

AudioObject.prototype.setVolume = function(volume) {
    this.gainNode.gain.value = volume;
};

AudioObject.prototype.getVolume = function() {
    return this.gainNode.gain.value;
};
