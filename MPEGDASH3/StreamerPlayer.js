
var StreamerPlayer = function(stream, audioContext) {
    this.stream = stream;
    this.audioContext = audioContext;
    this.playing = false;

    this.source = this.audioContext.createMediaElementSource(stream.getAudioElement());
    this.channelSplitter = this.audioContext.createChannelSplitter(this.source.channelCount);

    this.source.connect(this.channelSplitter);
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
    return this.stream.getAudioElement().duration;
};

StreamerPlayer.prototype.setCurrentTime = function(newCurrentTime) {
    if (this.stream.getAudioElement().loop) {
        this.stream.getAudioElement().currentTime = newCurrentTime % this.getDuration();
    } else {
        if (this.getDuration() > newCurrentTime) {
            this.stream.getAudioElement().currentTime = newCurrentTime;
        } else {
            this.stream.getAudioElement().currentTime = this.getDuration();
        }
    }
};
