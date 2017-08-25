/*
MasterPlayer Class

This class is used to play a Period object. It will controll te playing, pausing and timing of the audio scene.
*/

/*
CONSTRUCTOR
-----------

input: Period-object

output: MasterPlayer-object that can playback the Period-object.

inner workings: The master player will be setup and ready to play back the audio.
There will also be created multiple StreamerPlayers for every Streamer in the Period,
a MetaDataStreamerPlayer for every MetaDataStreamer and an AudioObject for every MetaDataStreamer.

Furthermore will the MasterPlayer use two callback functions to connected
to the created StreamerPlayer's. One of the callback functions is called on the
event that a StreamerPlayer has no more audio to play. When this happens,
the masterPlayer will pause. The other callback is called by the StreamerPlayer
when it is back ready to play audio. The MasterPlayer will resume then.
*/
var MasterPlayer = function(period) {
    //list of all the StreamerPlayers, MetaDataStreamerPlayers and AudioObjects
    this.streamerPlayers = [];
    this.videoStreamerPlayers = [];
    this.metaDataStreamerPlayers = [];
    this.audioObjects = [];
    //Period object that needs to be played.
    this.period = period;
    //is the masterplayer playing playing
    this.playing = false;
    //is used when playing to adjust the position of the AudioObjects to the new
    //position of the metadata streamer players
    this.interval = undefined;
    //callback function that is called when the current time of the audio scene
    //is manually changed
    this.currentTimeUpdateFunction = undefined;

    //last time the play button was pressed.
    this.startPlayTime = -1;
    //total time passed before last play
    this.alreadyInTimeBuffer = 0;

    //creating the audio context, master gain and dynamic compressor.
    //dynamic compressor is there to prevent audio clipping.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 1;
    this.dynamicCompressor = this.audioContext.createDynamicsCompressor();
    this.dynamicCompressor.connect(this.masterGain);

    //was the MasterPlayer playing audio before there was a forced pause.
    this.playingBeforeFocedPause = false;
    var that = this;

    //callback methode to be executed upon no longer being able to play audio by an streamerPlayer
    var cantPlayCallback = function() {
        //remember if the player was playing when there is a forced pause to resume afterwards.
        if (that.playing) {
            that.playingBeforeFocedPause = true;
        }

        console.log("how stop how!");
        //pause the player
        that.pause();
    };

    //callback methode to be executed when an streamerPlayer finds himself back able to start playing audio again.
    var canPlayCallback = function() {
        console.log("try....");
        var everythingReady = true;

        //itterate over all the streamerplayers to find out if they are ready to play back the audio
        for (var i = 0; i < that.streamerPlayers.length; i++) {
            if (!that.streamerPlayers[i].canPlay()) {
                console.log("one is not ready...");
                everythingReady = false;
            }
        }

        for (var i = 0; i < that.videoStreamerPlayers.length; i++) {
            if (!that.videoStreamerPlayers[i].canPlay()) {
                console.log("one is not ready...");
                everythingReady = false;
            }
        }

        //if all streamerplayers are ready to play and the player was playing before a forced stop restart.
        if (everythingReady && that.playingBeforeFocedPause) {
            that.play();
            console.log("Gogogo!");

            that.playingBeforeFocedPause = false;
        }
    };

    //itterate over all the streams in the period to create StreamerPlayers.
    for (var i = 0; i < period.streams.length; i++) {
        var stream = period.streams[i];
        //create streamerplayers and add them to the array of streamerplayers
        this.streamerPlayers.push(new StreamerPlayer(stream, this.audioContext, cantPlayCallback, canPlayCallback));
    }

    //itterate over all the streams in the period to create StreamerPlayers.
    for (var i = 0; i < period.videoStreams.length; i++) {
        var stream = period.videoStreams[i];
        //create streamerplayers and add them to the array of streamerplayers
        this.videoStreamerPlayers.push(new VideoStreamerPlayer(stream, cantPlayCallback, canPlayCallback));
    }

    //itterate over all metadatastreams
    for (var j = 0; j < period.metaDataStreams.length; j++) {
        //create an AudioObject for every metadatastream
        var metaDataStreamer = period.metaDataStreams[j];
        var audioObject = this.generateAudioObjectFromMetaDataStreamer(metaDataStreamer);

        //add audioObject to the list
        this.audioObjects.push(audioObject);
        //create and add metadata streamer player to list.
        this.metaDataStreamerPlayers.push(new MetaDataStreamerPlayer(audioObject, metaDataStreamer, this.audioContext, this));
    }

    this.setCurrentTime(0);
};

/*
generateAudioObjectFromMetaDataStreamer
---------------------------------------

input: MetaDataStreamer-object
output: AudioObject-object that will receive info from that MetaDataStreamer-object

*/
MasterPlayer.prototype.generateAudioObjectFromMetaDataStreamer = function(metaDataStreamer) {

    return new AudioObject(this.streamerPlayers, metaDataStreamer.initData, this.audioContext, this.dynamicCompressor);
};

/*
setMasterVolume
---------------------------------------

input: newVolume (positive float value) the wanted value for the master volume.
output: The Master volume is adjusted to the new value.

*/
MasterPlayer.prototype.setMasterVolume = function(newVolume) {
    this.masterGain.gain.value = newVolume;
};

MasterPlayer.prototype.getMasterVolume = function() {
    return this.masterGain.gain.value;
};

MasterPlayer.prototype.isPlaying = function() {
    return this.playing;
};

MasterPlayer.prototype.getDuration = function() {

    return this.period.getDuration();
};

/*
getCurrentTime
---------------------------------------

output: The time that the audio scene is currently on. so the output in seconds of where the playback of the audio is.

*/
MasterPlayer.prototype.getCurrentTime = function() {
    //when the player is playing, check the realtimze time with the time already played
    if (this.playing) {
        //alreadyInTimeBuffer plus the time since the last time since the play button was pressed.
        return (this.alreadyInTimeBuffer + (window.performance.now() - this.startPlayTime))/1000;
    } else {
        return this.alreadyInTimeBuffer / 1000;
    }
};

/*
setCurrentTime
---------------------------------------

input: time in seconds of where the new position of the audio is.
output: the time internally is adjusted in the master player and its streamer players.

*/
MasterPlayer.prototype.setCurrentTime = function(newCurrentTime) {

    var wasPlaying = false;

    //pause the player
    if (this.isPlaying()) {
        wasPlaying = true;
        this.pause();
    }
    //adjust al the streamerPlayers to a new position.
    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].setCurrentTime(newCurrentTime);
    }
    //adjust al the videoStreamerPlayers to a new position.
    for (var i = 0; i < this.videoStreamerPlayers.length; i++) {
        this.videoStreamerPlayers[i].setCurrentTime(newCurrentTime);
    }
    //restart the buffering process of a period to make sure new data is getting ready for the new position.
    this.period.startBufferProccess();

    //change the internal clock of the player
    this.alreadyInTimeBuffer = newCurrentTime*1000;

    //if the player was playing, restart it
    if (wasPlaying) {
        this.play();
    }
};

/*
play
---------------------------------------

output: starts all the streamerplayers and audio objects back up.
Starts the interval to detect the end of the audio and call a stop and to send out currentTimeUpdate callbacks

*/
MasterPlayer.prototype.play = function() {
    this.playing = true;

    //reset all streamerPlayers to the same point in time.
    var currentTime = this.getCurrentTime();

    //set the new position of the streamerplayers to the current time to mimize the chanche of them going out of sync
    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].setCurrentTime(currentTime);
    }

    for (var i = 0; i < this.videoStreamerPlayers.length; i++) {
        this.videoStreamerPlayers[i].setCurrentTime(currentTime);
    }

    //start all streamerPlayers
    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].play();
    }

    //start all videoStreamerPlayers
    for (var i = 0; i < this.videoStreamerPlayers.length; i++) {
        this.videoStreamerPlayers[i].play();
    }

    //start all metaDataStreamerPlayers
    for (var j = 0; j < this.metaDataStreamerPlayers.length; j++) {
        this.metaDataStreamerPlayers[j].play();
    }

    //start all audioObjects
    for (var k = 0; k < this.audioObjects.length; k++) {
        this.audioObjects[k].play();
    }

    //set a new start time of when the play command was givin
    this.startPlayTime = window.performance.now();

    var that = this;

    //start interval to detect the stop and sendout updates on the callback method.
    this.interval = setInterval(function() {

        if (that.getCurrentTime() >= that.getDuration()) {
            that.stop();
        }

        if (that.currentTimeUpdateFunction != undefined ) {
            that.currentTimeUpdateFunction(that.getCurrentTime());
        }
    }, 500);
};


/*
stop
---------------------------------------

output: pause the player and resets the time to 0

*/
MasterPlayer.prototype.stop = function() {
    this.pause();
    this.setCurrentTime(0);
};


/*
pause
---------------------------------------

output: pauses the player and remembers the time that is played back.

*/
MasterPlayer.prototype.pause = function() {
    this.playing = false;

    //save the time played back.
    if (this.playing) {
        this.alreadyInTimeBuffer += (window.performance.now() - this.startPlayTime);
    }

    //pause all the streamerplayers
    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].pause();
    }

    //pause all the videoStreamerplayers
    for (var i = 0; i < this.videoStreamerPlayers.length; i++) {
        this.videoStreamerPlayers[i].pause();
    }

    //pause aal the metadatastreamerplayers
    for (var j = 0; j < this.metaDataStreamerPlayers.length; j++) {
        this.metaDataStreamerPlayers[j].pause();
    }

    //pause the audioobjects
    for (var k = 0; k < this.audioObjects.length; k++) {
        this.audioObjects[k].pause();
    }

    //stop the interval that is started by the play function
    clearInterval(this.interval);
};
