var Status = {
    STOPPED: "STOPPED",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED"
};

var Period = function(period, audioContext) {
    this.audioContext = audioContext;
    this.streamsets = this.parseStreamsets(period);
    this.status = Status.STOPPED;
    this.duration = period.duration;

    this.timePast = 0;
    this.startTime = 0;

    var that = this;

    this.updateInterval = setInterval(function() {
        if (that.status == Status.PLAYING) {
            that.timePast = that.audioContext.currentTime - that.startTime;

            if (that.timePast >= that.duration) {
                that.stop();
            }
        }
    }, 10);

    console.log(period);
};

Period.prototype.setTime = function (timepast) {
    this.timePast = timepast;
    this.startTime = this.audioContext.currentTime - timepast;

    for (var i = 0; i < this.streamsets.length; i++) {
        this.streamsets[i].setTime(timepast, this.duration);
    }
};

Period.prototype.parseStreamsets = function (period) {
    var allStreamSets = [];

    for (var i = 0; i < period.streamSetInfos.length; i++) {
        allStreamSets.push(new Streamset(period.streamSetInfos[i],this.audioContext));
    }

    return allStreamSets;
};


Period.prototype.loadStreams = function () {
    var notReadyStreams = this.witchStreamsArentReady();
    var that = this;

    return new Promise(function(resolve, reject) {
        var amountReady = 0;
        var amountTotal = notReadyStreams.length;

        for (var i = 0; i < notReadyStreams.length; i++) {
            var subjectStreamset = notReadyStreams[i];

            subjectStreamset.loadBuffer().then(function() {
                amountReady++;

                if (amountReady == amountTotal) {
                    resolve();
                }
            });
        }

        if (amountReady == amountTotal) {
            resolve();
        }
    });
};

Period.prototype.stop = function() {
    var that = this;

    for (var i = 0; i < that.streamsets.length; i++) {
        var subjectStreamset = that.streamsets[i];

        subjectStreamset.stop();
    }

    this.status = Status.STOPPED;
};

Period.prototype.playOrPause = function() {
    if (this.status == Status.STOPPED) {
        this.play();
        this.status = Status.PLAYING;
    } else if (this.status == Status.PLAYING) {
        this.audioContext.suspend();
        this.status = Status.PAUSED;
    } else if (this.status == Status.PAUSED) {
        this.audioContext.resume();
        this.status = Status.PLAYING;
    }

};

Period.prototype.play = function () {
    var that = this;

    that.loadStreams().then(function() {
        that.startTime = that.audioContext.currentTime;
        that.audioContext.resume();

        this.status = Status.PLAYING;
        for (var i = 0; i < that.streamsets.length; i++) {
            var subjectStreamset = that.streamsets[i];

            subjectStreamset.play();
        }
    });
};

Period.prototype.witchStreamsArentReady = function () {
    var notReady = [];

    for (var i = 0; i < this.streamsets.length; i++) {
        if (!this.streamsets[i].isReadyToPlay()) {
            notReady.push(this.streamsets[i]);
        }
    }

    return notReady;
};
