

var StreamerPlayerControls = function(streamerPlayer, metaDataStreamerPlayer) {
    this.streamerPlayer = streamerPlayer;
    this.metaDataStreamerPlayer = metaDataStreamerPlayer;
    this.playButton = undefined;
    this.titleSpan = undefined;

    var that = this;

    var manualCallback = function(value) {
        that.manualModeChangeCallback(value);
    }

    this.metaDataStreamerPlayer.setOnManualModeChangeCallback(manualCallback);
};

StreamerPlayerControls.prototype.generateControlsInDiv = function(idOfDiv) {
    this.createTitleSpan(idOfDiv);
    this.createPlayPauseManualModeButtonInDiv(idOfDiv);
    this.createBreakLine(idOfDiv);
};

StreamerPlayerControls.prototype.manualModeChangeCallback = function(value) {
    if (value) {
        this.playButton.textContent = "disable manualmode";
    } else {
        this.playButton.textContent = "enable manualmode";
    }
};

StreamerPlayerControls.prototype.createPlayPauseManualModeButtonInDiv = function(idOfDiv) {
    var that = this;

    var callback = function() {
        that.playPauseManualModeButtonCallback();
    };
    this.playButton = document.createElement("button");
    if (this.metaDataStreamerPlayer.isInManualMode()) {
        this.playButton.textContent = "disable manualmode";
    } else {
        this.playButton.textContent = "enable manualmode";
    }

    this.playButton.onclick = callback;
    document.getElementById(idOfDiv).appendChild(this.playButton);
};

StreamerPlayerControls.prototype.playPauseManualModeButtonCallback = function() {
    if (this.metaDataStreamerPlayer.isInManualMode()) {
        this.metaDataStreamerPlayer.setManualMode(false);
    } else {
        this.metaDataStreamerPlayer.setManualMode(true);
    }
};

StreamerPlayerControls.prototype.createTitleSpan = function(idOfDiv) {
    var that = this;

    that.titleSpan = document.createElement("span");
    that.titleSpan.textContent = this.metaDataStreamerPlayer.metaDataStreamer.initData.title;
    document.getElementById(idOfDiv).appendChild(that.titleSpan);
};

StreamerPlayerControls.prototype.createBreakLine = function(idOfDiv) {
    var breakLine = document.createElement("br");
    document.getElementById(idOfDiv).appendChild(breakLine);
};
