var MasterPlayerControls = function(masterPlayer) {
    this.masterPlayer = masterPlayer;
    this.playButton = undefined;
    this.slider = undefined;
};

MasterPlayerControls.prototype.generateControlsInDiv = function (idOfDiv) {

    var that = this;

    var callback = function() {
        that.playPauseButtonCallback();
    };

    this.playButton = document.createElement("button");
    if (this.masterPlayer.isPlaying()) {
        this.playButton.textContent = "pause";
    } else {
        this.playButton.textContent = "play";
    }
    this.playButton.onclick = callback;
    document.getElementById(idOfDiv).appendChild(this.playButton);

    var sliderCallback = function(event) {
        that.sliderChangeCallback();
    };
    this.slider = document.createElement("input");
    this.slider.setAttribute("type", "range");
    this.slider.setAttribute("min", "0");
    this.slider.setAttribute("value", "0");
    this.slider.setAttribute("max", "100");
    this.slider.setAttribute("step", "0.1");
    this.slider.setAttribute("id", "sliderMasterPlayerControl");
    this.slider.onchange = sliderCallback;
    document.getElementById(idOfDiv).appendChild(this.slider);
};

MasterPlayerControls.prototype.sliderChangeCallback = function() {
    var duration = this.masterPlayer.getDuration();
    var valueOfSlider = this.slider.value;

    this.masterPlayer.setCurrentTime((valueOfSlider/100) * duration);
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
