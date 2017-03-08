var app = new Vue({
    el: '#app',
    data: function() {
        var panner = context.createPanner();
        panner.connect(context.destination);
        panner.maxDistance = 150;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;

        var oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.connect(panner);
        oscillator.start(0);

        context.listener.setPosition(150,0,150);
        panner.setPosition(100,0,200);

        console.log(context.listener.speedOfSound);

        return {
            panner: panner,
        };
    },
    methods: {
        soundMoved: function(x,z) {
            this.panner.setPosition(x,0,z);
        }
    }
})
