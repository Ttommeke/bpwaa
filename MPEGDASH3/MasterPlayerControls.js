var MasterPlayerControls = function(masterPlayer) {
    this.masterPlayer = masterPlayer;
    this.playButton = undefined;
    this.slider = undefined;
};

MasterPlayerControls.prototype.generateControlsInDiv = function (idOfDiv) {

    var that = this;

    var callback = function() {
        that.playPauseButtonCallback();
    }

    this.playButton = document.createElement("button");
    if (this.masterPlayer.isPlaying()) {
        this.playButton.textContent = "pause";
    } else {
        this.playButton.textContent = "play";
    }
    this.playButton.onclick = callback;
    document.getElementById(idOfDiv).appendChild(this.playButton);

    this.slider = document.createElement("input");
    this.slider.setAttribute("type", "range");
    this.slider.setAttribute("min", "0");
    this.slider.setAttribute("max", "100");
    this.slider.setAttribute("step", "0.1");
    this.slider.setAttribute("id", "sliderMasterPlayerControl");
    document.getElementById(idOfDiv).appendChild(this.slider);
};

MasterPlayerControls.prototype.playPauseButtonCallback = function() {

    if (this.masterPlayer.isPlaying()) {
        this.masterPlayer.pause();
        this.playButton.textContent = "play";
    } else {
        this.masterPlayer.play();
        this.playButton.textContent = "pause";
    }
};
