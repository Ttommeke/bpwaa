var calculateXAndZ = function(angle, distance) {
    var sin = Math.sin(-angle/180*Math.PI);
    var cos = Math.cos(angle/180*Math.PI);

    var z = cos * distance;
    var x = sin * distance;

    return {x: -x, z: -z};
}

var app = new Vue({
    el: '#app',
    data: function() {

        var binauralNode = new BinauralFIR({
            audioContext: context
        });
        binauralNode.HRTFDataset = hrtfs;
        binauralNode.connect(context.destination);

        binauralNode.setPosition(0, 0, 1);

        return {
            binauralNode: binauralNode,
            x: 0,
            z: 0
        };
    },
    mounted: function() {
        var that = this;

        bufferLoader = new BufferLoader(
            context,
            [
                { href: '../sounds/sms.wav', name: 'sms' }
            ],
            function(sounds) {
                sms = sounds.sms;

                var smsSound = sms.createBufferSource();
                smsSound.loop = true;
                smsSound.loopEnd = 1;
                smsSound.start(0);
                smsSound.connect(that.binauralNode.input);

                var startCorner = -180;

                setInterval(function(){
                    startCorner += 0.1;
                    var distance = that.binauralNode.getPosition().distance;

                    if (startCorner > 180) {
                        startCorner = -179;
                    }

                    var position = calculateXAndZ(startCorner,150);
                    that.x = 300 + Math.round(position.x);
                    that.z = 300 + Math.round(position.z);

                    that.binauralNode.setPosition(startCorner,0,distance);
                }, 10);
            }
        );

        bufferLoader.load();
    },
    methods: {
        soundMoved: function(x,z) {
            var deltaX = x/10 - 30;
            var deltaZ = z/10 - 30;

            var pythagoras = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2));

            var sin = deltaZ/pythagoras;
            var asin = Math.asin(sin)/Math.PI*180 + 90;

            if (deltaX < 0) {
                asin *= -1;
            }

            this.binauralNode.setPosition(asin,0,pythagoras);
        }
    }
})
