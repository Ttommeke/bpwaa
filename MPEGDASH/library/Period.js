var PeriodStatus = {
    STOPPED: "STOPPED",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED"
};

var Period = function(period, audioContext) {
    this.audioContext = audioContext;
    this.streamsets = this.parseStreamsets(period);
    this.status = PeriodStatus.STOPPED;
    this.duration = period.duration;
    this.currentPosition = 0;

    this.timePast = 0;
    this.startTime = 0;
};

Period.prototype.parseStreamsets = function (period) {
    var allStreamSets = [];

    for (var i = 0; i < period.streamSetInfos.length; i++) {
        allStreamSets.push(new Streamset(period.streamSetInfos[i],this.audioContext));
    }

    return allStreamSets;
};

Period.prototype.startLoadingStreamSets = function() {
    for (var i = 0; i < this.streamsets.length; i++ ) {
        this.streamsets[i].loadNextFromBufferPosition(0);
    }
};
