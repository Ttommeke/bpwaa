
var StreamerPlayer = function(stream, audioContext, cantPlayCallback, canPlayCallback) {
    this.stream = stream;
    this.audioContext = audioContext;
    this.playing = false;

    this.source = this.audioContext.createMediaElementSource(stream.getAudioElement());
    this.channelSplitter = this.audioContext.createChannelSplitter(this.source.channelCount);

    this.source.connect(this.channelSplitter);

    var that = this;

    this.stream.getAudioElement().addEventListener("waiting", function() {
        if (!that.canPlay()) {
            cantPlayCallback();
            console.log("how wacht! ");
        }
    });

    this.stream.getAudioElement().addEventListener("canplay", function() {
        canPlayCallback();
    });
};

StreamerPlayer.prototype.canPlay = function() {
    if ( this.stream.getAudioElement().readyState >= 3) {
        return true;
    }

    return false;
};

StreamerPlayer.prototype.getSource = function() {
    return this.channelSplitter;
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
    return this.stream.getDuration();
};

StreamerPlayer.prototype.setCurrentTime = function(newCurrentTime) {
    this.stream.setCurrentTime(newCurrentTime);
};
