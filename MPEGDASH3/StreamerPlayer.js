var StreamerPlayer = function(stream, audioContext, destination) {
    this.stream = stream;
    this.audioContext = audioContext;
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
    this.playing = false;

    this.source = this.audioContext.createMediaElementSource(stream.getAudioElement());
    this.pannerNode.connect(destination);
    this.source.connect(this.pannerNode);
};

StreamerPlayer.prototype.getPannerNode = function() {
    return this.pannerNode;
};

StreamerPlayer.prototype.play = function(){
    this.playing = true;
    this.stream.getAudioElement().play();
};

StreamerPlayer.prototype.pause = function(){
    this.playing = false;
    this.stream.getAudioElement().pause();
};

StreamerPlayer.prototype.isPlaying = function(){
    return this.playing;
};

StreamerPlayer.prototype.getCurrentTime = function(){
    return this.stream.getAudioElement().currentTime;
};

StreamerPlayer.prototype.getDuration = function(){
    return this.stream.getAudioElement().duration;
};

StreamerPlayer.prototype.setCurrentTime = function(newCurrentTime) {
    if (this.getDuration() > newCurrentTime) {
        this.stream.getAudioElement().currentTime = newCurrentTime;
    } else {
        this.stream.getAudioElement().currentTime = this.getDuration();
    }
};
