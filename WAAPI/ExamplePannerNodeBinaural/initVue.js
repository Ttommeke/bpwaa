var app = new Vue({
    el: '#app',
    data: function() {
        var panner = context.createPanner();
        panner.connect(context.destination);
        panner.panningModel = 'HRTF';
        panner.maxDistance = 150;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;

        var oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.connect(panner);
        oscillator.start(0);

        context.listener.setPosition(30,0,30);
        panner.setPosition(10,0,15);

        return {
            panner: panner,
        };
    },
    methods: {
        soundMoved: function(x,z) {
            this.panner.setPosition(x/10,0,z/10);
        }
    }
})
