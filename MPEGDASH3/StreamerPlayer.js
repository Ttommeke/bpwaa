/*
StreamerPlayer-class
--------------

This class is responsible for playing an audio
*/

/*
CONSTRUCTOR
-----------

input:
    stream - Streamer-object that has to be played!
    audioContext - audioContext used to play the audio within
    contPlayCallback - called when the audio playback is running out of audio data.
    canPlayCallback - called when the audio is back ready to be played
*/
var StreamerPlayer = function(stream, audioContext, cantPlayCallback, canPlayCallback) {
    this.stream = stream;
    this.audioContext = audioContext;
    this.playing = false;

    this.source = this.audioContext.createMediaElementSource(stream.getAudioElement());
    this.channelSplitter = this.audioContext.createChannelSplitter(this.source.channelCount);

    this.source.connect(this.channelSplitter);

    var that = this;

    //connecting the out of data event to the cantPlayCallback
    this.stream.getAudioElement().addEventListener("waiting", function() {
        if (!that.canPlay()) {
            cantPlayCallback();
            console.log("how wacht! ");
        }
    });

    //connecting the canplay event to the canPlayCallback
    this.stream.getAudioElement().addEventListener("canplay", function() {
        canPlayCallback();
    });
};

StreamerPlayer.prototype.canPlay = function() {
    var lengthBufferd = this.stream.getTimeBuffered() - this.stream.getCurrentTime();

    if ( lengthBufferd >= 0) {
        return true;
    }

    return false;
};

StreamerPlayer.prototype.getSource = function() {
    return this.channelSplitter;
};

StreamerPlayer.prototype.play = function(){
    this.playing = true;

    if (navigator.userAgent.search("Chrome") > -1) {
        this.stream.getAudioElement().play().catch(function() {
            //console.log("play error...");
        });
    } else {
        try {
            this.stream.getAudioElement().play();
        } catch (e) {

        }
    }

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
