var MonoAudioStreamPlayer = function(audioContext, monoAudioStream) {
    this.audioContext = audioContext;
    this.playingBufferIndex = 0;
    this.monoAudioStream = monoAudioStream;

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.5;

    this.gainNode.connect(this.audioContext.destination);
}

MonoAudioStreamPlayer.prototype.play = function() {
    var that = this;
    var audioBuffer = this.audioContext.createBufferSource();
    audioBuffer.buffer = this.monoAudioStream.getAudioBuffer(this.playingBufferIndex);
    audioBuffer.connect(this.gainNode);
    audioBuffer.onended = function() {
        if (that.playingBufferIndex + 1 < that.monoAudioStream.getAudioBuffers().length) {
            that.playNextBuffer();
        }
    };

    this.playNextBuffer();
    this.playNextBuffer();

    audioBuffer.start(0);
};

MonoAudioStreamPlayer.prototype.combineTwoBuffers = function(buffer1, buffer2) {
    var bufferAudioData1 = buffer1.getChannelData(0);
    var bufferAudioData2 = buffer2.getChannelData(0);

    var bufferAudioData3 = ArrayBufferHelper.concatTypedArraysFloat32(bufferAudioData1, bufferAudioData2);

    var buffer3 = this.audioContext.createBuffer(1, this.audioContext.sampleRate * this.monoAudioStream.bufferDuration * 2, this.audioContext.sampleRate);
    buffer3.copyToChannel(bufferAudioData3,0,0);

    return buffer3;
};

MonoAudioStreamPlayer.prototype.playNextBuffer = function() {
    console.log("Combine buffer " + this.playingBufferIndex + " and " + (this.playingBufferIndex + 1));

    var that = this;

    var audioBuffer = this.audioContext.createBufferSource();
    audioBuffer.buffer = this.combineTwoBuffers( this.monoAudioStream.getAudioBuffer(this.playingBufferIndex), this.monoAudioStream.getAudioBuffer(this.playingBufferIndex + 1) );
    audioBuffer.connect(this.gainNode);

    audioBuffer.onended = function() {
        if (that.playingBufferIndex + 1 < that.monoAudioStream.getAudioBuffers().length) {
            that.playNextBuffer();
        }
    };

    audioBuffer.start(this.playingBufferIndex * this.monoAudioStream.bufferDuration);


    this.playingBufferIndex++;
};
