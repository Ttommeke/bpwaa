var MonoAudioStreamPlayer = function(audioContext, monoAudioStream) {
    this.audioContext = audioContext;
    this.monoAudioStream = monoAudioStream;
}

MonoAudioStreamPlayer.prototype.play = function() {
    var buffers = this.monoAudioStream.getAudioBuffers();
    var bufferDuration = this.monoAudioStream.bufferDuration;

    for (var i = 0; i < buffers.length; i++) {
        var audioBuffer = this.audioContext.createBufferSource();
        audioBuffer.buffer = buffers[i];
        audioBuffer.connect(this.audioContext.destination);

        audioBuffer.start(i * bufferDuration);
    }
};
