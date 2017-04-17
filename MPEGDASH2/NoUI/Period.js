var Period = function(period, audioContext) {
    console.log(period);
    this.duration = period.duration;
    this.start = period.start;
    this.id = period.id;

    this.audioContext = audioContext;
    this.adaptationsets = this.parseAdaptationsets(period);
};

Period.prototype.parseAdaptationsets = function (period) {
    var Adaptationsets = [];

    for (var i = 0; i < period.streamSetInfos.length; i++) {
        Adaptationsets.push(new Adaptationset(period.streamSetInfos[i], this.audioContext));
    }

    return Adaptationsets;
};

Period.prototype.load = function() {
    for (var i = 0; i < this.adaptationsets.length; i++) {
        this.adaptationsets[i].load();
    }
};
