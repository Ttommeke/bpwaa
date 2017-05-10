var MasterPlayer = function() {
    this.streamerPlayers = [];
};

MasterPlayer.prototype.play = function() {
    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].play();
    }
};

MasterPlayer.prototype.pause = function() {
    for (var i = 0; i < this.streamerPlayers.length; i++) {
        this.streamerPlayers[i].pause();
    }
};
