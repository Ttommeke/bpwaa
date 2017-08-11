var MasterPlayer = function(period) {
    this.streamerPlayers = [];
    this.metaDataStreamerPlayers = [];
    this.audioObjects = [];
    this.period = period;
    this.playing = false;
    this.interval = undefined;
    this.currentTimeUpdateFunction = undefined;

    this.startPlayTime = -1;
    this.alreadyInTimeBuffer = 0;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 1;
    this.dynamicCompressor = this.audioContext.createDynamicsCompressor();
    this.dynamicCompressor.connect(this.masterGain);

    this.playingBeforeFocedPause = false;
    var that = this;

    var cantPlayCallback = function() {
        if (that.playing) {
            that.playingBeforeFocedPause = true;
        }

        console.log("how stop how!");
        that.pause();
    };

    var canPlayCallback = function() {
        console.log("try....");
        var everythingReady = true;
        for (var i = 0; i < that.streamerPlayers.length; i++) {
            if (!that.streamerPlayers[i].canPlay()) {
                console.log("one is not ready...");
                everythingReady = false;
            }
        }

        if (everythingReady && that.playingBeforeFocedPause) {
            that.play();
            console.log("Gogogo!");

            that.playingBeforeFocedPause = false;
        }
    };

    for (var i = 0; i < period.streams.length; i++) {
        var stream = period.streams[i];
        this.streamerPlayers.push(new StreamerPlayer(stream, this.audioContext, cantPlayCallback, canPlayCallback));
    }

    for (var j = 0; j < period.metaDataStreams.length; j++) {
        var metaDataStreamer = period.metaDataStreams[j];
        var audioObject = this.generateAudioObjectFromMetaDataStreamer(metaDataStreamer);

        this.audioObjects.push(audioObject);
        this.metaDataStreamerPlayers.push(new MetaDataStreamerPlayer(audioObject, metaDataStreamer, this.audioContext, this));
    }
};

MasterPlayer.prototype.generateAudioObjectFromMetaDataStreamer = function(metaDataStreamer) {

    return new AudioObject(this.streamerPlayers, metaDataStreamer.initData, this.audioContext, this.dynamicCompressor);
};

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

MasterPlayer.prototype.getCurrentTime = function() {
    if (this.playing) {
        return (this.alreadyInTimeBuffer + (window.performance.now() - this.startPlayTime))/1000;
    } else {
        return this.alreadyInTimeBuffer / 1000;
    }
};

MasterPlayer.prototype.setCurrentTime = function(newCurrentTime) {

    var wasPlaying = false;

    this.period.startBufferProccess();

    if (this.isPlaying()) {
        wasPlaying = true;
        this.pause();
    }

    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].setCurrentTime(newCurrentTime);
    }

    this.alreadyInTimeBuffer = newCurrentTime*1000;

    if (wasPlaying) {
        this.play();
    }
};

MasterPlayer.prototype.play = function() {
    this.playing = true;

//reset all streamerPlayers to the same point in time.
    var currentTime = this.getCurrentTime();

    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].setCurrentTime(currentTime);
    }

    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].play();
    }

    for (var j = 0; j < this.metaDataStreamerPlayers.length; j++) {
        this.metaDataStreamerPlayers[j].play();
    }

    for (var k = 0; k < this.audioObjects.length; k++) {
        this.audioObjects[k].play();
    }

    this.startPlayTime = window.performance.now();

    var that = this;

    this.interval = setInterval(function() {

        if (that.getCurrentTime() >= that.getDuration()) {
            that.stop();
        }

        if (that.currentTimeUpdateFunction != undefined ) {
            that.currentTimeUpdateFunction(that.getCurrentTime());
        }
    }, 500);
};

MasterPlayer.prototype.stop = function() {
    this.pause();
    this.setCurrentTime(0);
};

MasterPlayer.prototype.pause = function() {
    this.playing = false;

    if (this.playing) {
        this.alreadyInTimeBuffer += (window.performance.now() - this.startPlayTime);
    }

    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].pause();
    }

    for (var j = 0; j < this.metaDataStreamerPlayers.length; j++) {
        this.metaDataStreamerPlayers[j].pause();
    }

    for (var k = 0; k < this.audioObjects.length; k++) {
        this.audioObjects[k].pause();
    }

    clearInterval(this.interval);
};
