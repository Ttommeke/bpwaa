/*
VideoStreamerPlayer-class
--------------

This class is responsible for playing a video
*/

/*
CONSTRUCTOR
-----------

input:
    stream - Streamer-object that has to be played!
    contPlayCallback - called when the audio playback is running out of audio data.
    canPlayCallback - called when the audio is back ready to be played
*/
var VideoStreamerPlayer = function(stream, cantPlayCallback, canPlayCallback) {
    this.stream = stream;
    this.playing = false;

    var that = this;

    //connecting the out of data event to the cantPlayCallback
    this.stream.getVideoElement().addEventListener("waiting", function() {
        if (!that.canPlay()) {
            cantPlayCallback();
            console.log("how wacht! ");
        }
    });

    //connecting the canplay event to the canPlayCallback
    this.stream.getVideoElement().addEventListener("canplay", function() {
        canPlayCallback();

        var lengthBufferd = that.stream.getTimeBuffered() - that.stream.getCurrentTime();
        console.log(lengthBufferd);
        console.log(that.stream.getVideoElement().readyState);
    });
};

VideoStreamerPlayer.prototype.canPlay = function() {

    var lengthBufferd = this.stream.getTimeBuffered() - this.stream.getCurrentTime();

    if (  lengthBufferd >= 0) {
        return true;
    }

    return false;
};

VideoStreamerPlayer.prototype.play = function(){
    this.playing = true;

    if (navigator.userAgent.search("Chrome") > -1) {
        this.stream.getVideoElement().play().catch(function() {
            //console.log("play error...");
        });
    } else {
        try {
            this.stream.getVideoElement().play();
        } catch (e) {

        }
    }
};

VideoStreamerPlayer.prototype.pause = function(){
    this.playing = false;
    this.stream.getVideoElement().pause();
};

VideoStreamerPlayer.prototype.isPlaying = function(){
    return this.playing;
};

VideoStreamerPlayer.prototype.getCurrentTime = function(){
    return this.stream.getVideoElement().currentTime;
};

VideoStreamerPlayer.prototype.getDuration = function(){
    return this.stream.getDuration();
};

VideoStreamerPlayer.prototype.setCurrentTime = function(newCurrentTime) {
    this.stream.setCurrentTime(newCurrentTime);
};
