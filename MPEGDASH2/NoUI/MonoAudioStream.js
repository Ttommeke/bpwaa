var MonoAudioStream = function(audioContext, bufferDuration) {
    this.audioBuffers = [];
    this.audioBuffersFaker = [];
    this.audioContext = audioContext;
    this.bufferDuration = bufferDuration;

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
        if (totalLength < lengthBuffer - this.notYetReadyBufferFramesLoaded) {
            var buffer = this.notYetReadyBuffer.getChannelData(0);
            var newNotYetReadyBuffer = ArrayBufferHelper.concatTypedArraysFloat32(buffer.slice(0, this.notYetReadyBufferFramesLoaded), audioData.slice(0, audioData.length));

            this.notYetReadyBuffer.copyToChannel(newNotYetReadyBuffer, 0, 0);

            this.notYetReadyBufferFramesLoaded += audioData.length;
            dataParsed = audioData.length;
        } else {
            var newBuffer = ArrayBufferHelper.concatTypedArraysFloat32(this.notYetReadyBuffer, audioData.slice(0, lengthBuffer - this.notYetReadyBuffer.length));

            var audioBuffer = this.audioContext.createBuffer(1, lengthBuffer, this.audioContext.sampleRate);
            audioBuffer.copyToChannel(newBuffer,0,0);

            this.audioBuffers.push(audioBuffer);
            dataParsed += lengthBuffer - this.notYetReadyBuffer.length;
            this.notYetReadyBuffer = undefined;
        }
    }

    while (dataParsed + lengthBuffer <= totalLength) {
        var audioBuffer = this.audioContext.createBuffer(1, lengthBuffer, this.audioContext.sampleRate);
        audioBuffer.copyToChannel(audioData.slice(dataParsed, dataParsed + lengthBuffer), 0, 0);

        this.audioBuffers.push(audioBuffer);
        dataParsed += lengthBuffer;
    }

    if (dataParsed < totalLength) {
        this.notYetReadyBuffer = audioData.slice(dataParsed, totalLength);
    }

    /*if (dataParsed < totalLength) {
        this.notYetReadyBuffer = this.audioContext.createBuffer(1, lengthBuffer, this.audioContext.sampleRate);
        var buffer = this.notYetReadyBuffer.getChannelData(0);
        this.notYetReadyBuffer.copyToChannel(audioData.slice(dataParsed, totalLength), 0, 0);

        this.notYetReadyBufferFramesLoaded = totalLength - dataParsed;
    }*/


};
