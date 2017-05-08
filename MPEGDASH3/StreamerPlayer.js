var StreamerPlayer = function(stream) {
    this.stream = stream;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    this.source = this.audioContext.createMediaElementSource(stream.getAudioElement());
    var stereopanner = this.audioContext.createStereoPanner();
    stereopanner.pan.value = -0.5;
    stereopanner.connect(this.audioContext.destination);
    this.source.connect(stereopanner);
};

StreamerPlayer.prototype.play = function(){

    this.stream.getAudioElement().play();
}
