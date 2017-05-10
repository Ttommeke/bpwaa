var MasterPlayer = function(period) {
    this.streamerPlayers = [];
    this.metaDataStreamerPlayers = [];
    this.period = period;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    for (var i = 0; i < period.streams.length; i++) {
        var stream = period.streams[i];
        this.streamerPlayers.push(new StreamerPlayer(stream, this.audioContext, this.audioContext.destination));
    }

    for (var j = 0; j < period.metaDataStreams.length; j++) {
        var metaDataStreamer = period.metaDataStreams[j];
        var streamerPlayer = this.findStreamerPlayerForMetaDataStreamer(metaDataStreamer);

        this.metaDataStreamerPlayers.push(new MetaDataStreamerPlayer(streamerPlayer, metaDataStreamer, this.audioContext));
    }
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

MasterPlayer.prototype.play = function() {
    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].play();
    }

    for (var j = 0; j < this.metaDataStreamerPlayers.length; j++) {
        this.metaDataStreamerPlayers[j].play();
    }
};

MasterPlayer.prototype.pause = function() {
    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].pause();
    }

    for (var j = 0; j < this.metaDataStreamerPlayers.length; j++) {
        this.metaDataStreamerPlayers[j].pause();
    }
};
