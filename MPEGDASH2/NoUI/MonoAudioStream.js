var MonoAudioStream = function(audioContext, bufferDuration) {
    this.audioBuffers = [];
    this.audioContext = audioContext;
    this.bufferDuration = bufferDuration;

    this.notYetReadyBufferFramesLoaded = 0;
    this.notYetReadyBuffer = undefined;
}

MonoAudioStream.prototype.getAudioBuffers = function() {
    return this.audioBuffers;
};

MonoAudioStream.prototype.addAudioData = function(audioData) {
    var totalLength = audioData.length;
    var dataParsed = 0;
    var lengthBuffer = this.audioContext.sampleRate * this.bufferDuration;

    if (this.notYetReadyBuffer !== undefined) {
        if (audioData.length < lengthBuffer - this.notYetReadyBufferFramesLoaded) {
            var buffer = this.notYetReadyBuffer.getChannelData(0);
            buffer.set(audioData.slice(0, audioData.length), this.notYetReadyBufferFramesLoaded);

            this.notYetReadyBufferFramesLoaded += audioData.length;
            dataParsed += audioData.length;
        } else {
            var buffer = this.notYetReadyBuffer.getChannelData(0);
            buffer.set(audioData.slice(0, lengthBuffer - this.notYetReadyBufferFramesLoaded), this.notYetReadyBufferFramesLoaded);

            this.audioBuffers.push(this.notYetReadyBuffer);
            this.notYetReadyBuffer = undefined;

            this.notYetReadyBufferFramesLoaded = 0;
            dataParsed += lengthBuffer - this.notYetReadyBufferFramesLoaded;
        }
    }

    while (dataParsed + lengthBuffer < totalLength) {
        var buffer = this.audioContext.createBuffer(1, lengthBuffer, this.audioContext.sampleRate);
        buffer.copyToChannel(audioData.slice(dataParsed, dataParsed + lengthBuffer), 0, 0);

        this.audioBuffers.push(buffer);
        dataParsed += lengthBuffer;
    }

    if (dataParsed < totalLength) {
        this.notYetReadyBuffer = this.audioContext.createBuffer(1, lengthBuffer, this.audioContext.sampleRate);
        var buffer = this.notYetReadyBuffer.getChannelData(0);
        buffer.set(audioData.slice(dataParsed, totalLength - dataParsed));

        this.notYetReadyBufferFramesLoaded = totalLength - dataParsed;
    }


};
