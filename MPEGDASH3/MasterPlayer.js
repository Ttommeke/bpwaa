var MasterPlayer = function(period) {
    this.streamerPlayers = [];
    this.metaDataStreamerPlayers = [];
    this.audioObjects = [];
    this.period = period;
    this.playing = true;
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

    for (var i = 0; i < period.streams.length; i++) {
        var stream = period.streams[i];
        this.streamerPlayers.push(new StreamerPlayer(stream, this.audioContext));
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

    return (this.alreadyInTimeBuffer + (window.performance.now() - this.startPlayTime))/1000;
};

MasterPlayer.prototype.setCurrentTime = function(newCurrentTime) {

    this.pause();

    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].setCurrentTime(newCurrentTime);
    }

    this.alreadyInTimeBuffer = newCurrentTime*1000;

    this.play();
};

MasterPlayer.prototype.play = function() {
    this.playing = true;

    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].play();
    }

    for (var j = 0; j < this.metaDataStreamerPlayers.length; j++) {
        this.metaDataStreamerPlayers[j].play();
    }

    this.startPlayTime = window.performance.now();

    var that = this;

    this.interval = setInterval(function() {

        if (that.currentTimeUpdateFunction != undefined ) {
            that.currentTimeUpdateFunction(that.getCurrentTime());
        }
    }, 500);
};

MasterPlayer.prototype.pause = function() {
    this.playing = false;

    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].pause();
    }

    for (var j = 0; j < this.metaDataStreamerPlayers.length; j++) {
        this.metaDataStreamerPlayers[j].pause();
    }

    this.alreadyInTimeBuffer += (window.performance.now() - this.startPlayTime);

    clearInterval(this.interval);
};
