

var GeneratedAudioObjectChannel = function(channelInfo, audioContext) {
    this.maxVolume = channelInfo.volume;
    this.oscilatorNode = audioContext.createOscillator();
    this.gainNode = audioContext.createGain();

    this.oscilatorNode.type = channelInfo.waveType;
    this.oscilatorNode.frequency.value = channelInfo.frequency;
    this.oscilatorNode.connect(this.gainNode);
    this.oscilatorNode.start();
};

GeneratedAudioObjectChannel.prototype.getEndNode = function() {
    return this.gainNode;
};

GeneratedAudioObjectChannel.prototype.pause = function() {
    this.gainNode.gain.value = 0;
};

GeneratedAudioObjectChannel.prototype.play = function() {
    this.gainNode.gain.value = this.maxVolume;
};
