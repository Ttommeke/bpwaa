/*
MasterPlayerControls-class
-----------------

Connects to an MasterPlayer-object en generates on screen controls for it.
*/


/*
CONSTRUCTOR
-----------

input:
    masterPlayer - player to be controlled
output: a MasterPlayerControls-object.

*/

var MasterPlayerControls = function(masterPlayer) {
    this.masterPlayer = masterPlayer;
    this.playButton = undefined;
    this.slider = undefined;
    this.volumeSlider = undefined;
    this.timeSpan = undefined;

    var that = this;
};

/*
generateControlsInDiv
-----------

input:
    idOfDiv - id of div where the controls should be generated in.
output: controls will be generated in the div wif the id: idOfDiv

*/
MasterPlayerControls.prototype.generateControlsInDiv = function (idOfDiv) {

    var metaDataStreamerPlayers = this.masterPlayer.metaDataStreamerPlayers;

    //generate for every audioObject a controller
    for (var i = 0; i < metaDataStreamerPlayers.length; i++) {
        this.createSingleAudioControl(idOfDiv, metaDataStreamerPlayers[i].audioObject, metaDataStreamerPlayers[i]);
    }

    this.createPlayPauseButtonInDiv(idOfDiv);
    this.createTimeSliderInDiv(idOfDiv);
    this.createVolumeSliderInDiv(idOfDiv);

    var that = this;

    //add calllback function to the masterplayer for when the current time changes.
    this.masterPlayer.currentTimeUpdateFunction = function(currentTime) {
        var duration = that.masterPlayer.getDuration();

        that.timeSpan.textContent = Math.round(currentTime) + "/" + Math.round(duration) + " ";
        that.slider.value = (currentTime / duration) * that.slider.max;
    };
};


/*
createSingleAudioControl
-----------

output: create audio control of 1 single audio metadata stream.

*/
MasterPlayerControls.prototype.createSingleAudioControl = function(idOfDiv, audioObject, metaDataStreamerPlayer) {
    var audioControl = new StreamerPlayerControls(audioObject, metaDataStreamerPlayer);

    audioControl.generateControlsInDiv(idOfDiv);
};


/*
createPlayPauseButtonInDiv
-----------

output: create a play button in th div

*/
MasterPlayerControls.prototype.createPlayPauseButtonInDiv = function(idOfDiv) {
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
};


/*
createTimeSliderInDiv
-----------

output: create time slider in the div

*/
MasterPlayerControls.prototype.createTimeSliderInDiv = function(idOfDiv) {
    var that = this;

    var sliderCallback = function(event) {
        that.sliderChangeCallback();
    };
    this.slider = document.createElement("input");
    this.slider.setAttribute("type", "range");
    this.slider.setAttribute("min", "0");
    this.slider.setAttribute("value", "0");
    this.slider.setAttribute("max", "100");
    this.slider.setAttribute("step", "0.1");
    this.slider.setAttribute("style", "width: 200px;");
    this.slider.onchange = sliderCallback;
    document.getElementById(idOfDiv).appendChild(this.slider);

    that.timeSpan = document.createElement("span");
    that.timeSpan.textContent = "0/1 ";
    document.getElementById(idOfDiv).appendChild(that.timeSpan);
};


/*
createVolumeSliderInDiv
-----------

output: create an audio volume slider in div

*/
MasterPlayerControls.prototype.createVolumeSliderInDiv = function(idOfDiv) {

    var that = this;

    var volumeSpan = document.createElement("span");
    volumeSpan.textContent = "volume:";
    document.getElementById(idOfDiv).appendChild(volumeSpan);

    var volumeSliderCallback = function(event) {
        that.volumeSliderChangeCallback();
    };
    this.volumeSlider = document.createElement("input");
    this.volumeSlider.setAttribute("type", "range");
    this.volumeSlider.setAttribute("min", "0");
    this.volumeSlider.setAttribute("value", this.masterPlayer.getMasterVolume());
    this.volumeSlider.setAttribute("max", "1");
    this.volumeSlider.setAttribute("step", "0.01");
    this.volumeSlider.onchange = volumeSliderCallback;
    document.getElementById(idOfDiv).appendChild(this.volumeSlider);
};

/*
sliderChangeCallback
-----------

output: when the slider is adjusted adjust the current time of the master player

*/
MasterPlayerControls.prototype.sliderChangeCallback = function() {
    var duration = this.masterPlayer.getDuration();
    var valueOfSlider = this.slider.value;
    this.slider.blur();

    this.masterPlayer.setCurrentTime((valueOfSlider/100) * duration);
};

/*
volumeSliderChangeCallback
-----------

output: when the volume slider is adjusted adjust the volume of the master player

*/
MasterPlayerControls.prototype.volumeSliderChangeCallback = function() {
    var valueOfSlider = this.volumeSlider.value;
    this.volumeSlider.blur();

    this.masterPlayer.setMasterVolume(valueOfSlider);
};


/*
playPauseButtonCallback
-----------

output: when the play pause button is pressed, play/pause the master player

*/
MasterPlayerControls.prototype.playPauseButtonCallback = function() {

    if (this.masterPlayer.isPlaying()) {
        this.masterPlayer.pause();
        this.playButton.textContent = "play";
    } else {
        this.masterPlayer.play();
        this.playButton.textContent = "pause";
    }
};
