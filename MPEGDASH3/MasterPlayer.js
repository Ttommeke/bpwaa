var MasterPlayer = function(period) {
    this.streamerPlayers = [];
    this.metaDataStreamerPlayers = [];
    this.period = period;
    this.playing = true;
    this.interval = undefined;
    this.currentTimeUpdateFunction = undefined;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 1;

    for (var i = 0; i < period.streams.length; i++) {
        var stream = period.streams[i];
        this.streamerPlayers.push(new StreamerPlayer(stream, this.audioContext, this.masterGain));
    }

    for (var j = 0; j < period.metaDataStreams.length; j++) {
        var metaDataStreamer = period.metaDataStreams[j];
        var streamerPlayer = this.findStreamerPlayerForMetaDataStreamer(metaDataStreamer);

        this.metaDataStreamerPlayers.push(new MetaDataStreamerPlayer(streamerPlayer, metaDataStreamer, this.audioContext));
    }
};

MasterPlayer.prototype.setMasterVolume = function(newVolume) {
    this.masterGain.gain.value = newVolume;
};

MasterPlayer.prototype.getMasterVolume = function() {
    return this.masterGain.gain.value;
};

MasterPlayer.prototype.findStreamerPlayerForMetaDataStreamer = function(metaDataStreamer) {
    for (var i = 0; i < this.streamerPlayers.length; i++) {
        if (this.streamerPlayers[i].stream.name == metaDataStreamer.name.substring( 0, metaDataStreamer.name.length - 9)) {
            return this.streamerPlayers[i];
        }
    }

    console.log("no StreamerPlayer founded for " + metaDataStreamer.name);
    return undefined;
};

MasterPlayer.prototype.isPlaying = function() {
    return this.playing;
};

MasterPlayer.prototype.getLongestPlayer = function() {

    var max = 0;
    var player = undefined;

    for (var i = 0; i < this.streamerPlayers.length; i++) {
        var current = this.streamerPlayers[i].getDuration();

        if (current > max) {
            max = current;
            player = this.streamerPlayers[i];
        }
    }

    return player;
};

MasterPlayer.prototype.getDuration = function() {

    return this.getLongestPlayer().getDuration();
};

MasterPlayer.prototype.setCurrentTime = function(newCurrentTime) {

    this.pause();

    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].setCurrentTime(newCurrentTime);
    }

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

    var that = this;

    this.interval = setInterval(function() {

        var longestPlayer = that.getLongestPlayer();

        if (that.currentTimeUpdateFunction != undefined && longestPlayer != undefined ) {
            that.currentTimeUpdateFunction(longestPlayer.getCurrentTime());
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

    clearInterval(this.interval);
};
