var MonoAudioStreamPlayer = function(audioContext, monoAudioStream) {
    this.audioContext = audioContext;
    this.playingBufferIndex = -1;
    this.monoAudioStream = monoAudioStream;
}

MonoAudioStreamPlayer.prototype.play = function() {

    this.playNextBuffer();
};

MonoAudioStreamPlayer.prototype.playNextBuffer = function() {
    var that = this;

    this.playingBufferIndex++;

    var audioBuffer = this.audioContext.createBufferSource();
    audioBuffer.buffer = this.monoAudioStream.getAudioBuffer(this.playingBufferIndex);
    audioBuffer.connect(this.audioContext.destination);

    setTimeout(function() {
        if (that.playingBufferIndex + 1 < that.MonoAudioStream.getAudioBuffers().length) {
            that.playNextBuffer();
        }
    }, this.monoAudioStream.bufferDuration * 1000);

    audioBuffer.start();
};
