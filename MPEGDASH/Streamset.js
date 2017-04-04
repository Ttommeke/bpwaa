var Streamset = function(streamSet, audioContext) {
    this.id = streamSet.id;
    this.audioContext = audioContext;
    this.contentType = streamSet.contentType;
    this.streams = this.parseStreams(streamSet);
    this.activeStreamIndex = 0;
    this.active = true;
    this.loaded = false;
    this.buffer = undefined;
    this.audioBuffer = undefined;
};

Streamset.prototype.parseStreams = function (streamSet) {
    var allStreams = [];

    for (var i = 0; i < streamSet.streamInfos.length; i++) {
        allStreams.push( new Stream(streamSet.streamInfos[i]));
    }

    return allStreams;
};

Streamset.prototype.isReadyToPlay = function () {
    if (this.active && !this.loaded) {
        return false;
    }

    return true;
};

Streamset.prototype.setTime = function(timePast, totaltime) {
    var frameCount = this.audioContext.sampleRate * totaltime;
    var channels = 2;
    var newAudioBuffer = this.audioContext.createBuffer(channels, frameCount, this.audioContext.sampleRate);

    var startPosition = Math.round(frameCount * timePast / totaltime);

    for (var channel = 0; channel < channels; channel++) {
        var anotherArray = new Float32Array(frameCount);
        this.buffer.copyFromChannel(anotherArray,channel);
        anotherArray.slice(0,startPosition);


        newAudioBuffer.copyToChannel(anotherArray, channel);
    }

    this.audioBuffer.disconnect();

    this.audioBuffer = this.audioContext.createBufferSource();
    this.audioBuffer.buffer = newAudioBuffer;
    this.audioBuffer.connect(this.audioContext.destination);

    this.audioBuffer.start();
};

Streamset.prototype.play = function() {
    if (this.active && this.loaded) {
        this.audioBuffer = this.audioContext.createBufferSource();
        this.audioBuffer.buffer = this.buffer;

        this.audioBuffer.connect(this.audioContext.destination);
        //this.audioBuffer.noteOnGrain(2);
        this.audioBuffer.start();
    }
};

Streamset.prototype.stop = function() {
    if (this.audioBuffer != undefined) {

        this.audioBuffer.stop();
        this.audioBuffer.disconnect(this.audioContext.destination);
    }
};

Streamset.prototype.loadBuffer = function () {
    var that = this;

    return new Promise(function(resolve, reject) {
        if (that.active && !that.loaded && that.streams.length > 0 && that.activeStreamIndex < that.streams.length && that.activeStreamIndex >= 0) {
            var url = that.streams[that.activeStreamIndex].url;

            var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";

                request.onload = function() {
                    that.audioContext.decodeAudioData(request.response, function(streamDecoded) {
                        that.buffer = streamDecoded;
                        that.loaded = true;

                        resolve();
                    });
                };

                request.send();
        }
    });
};
