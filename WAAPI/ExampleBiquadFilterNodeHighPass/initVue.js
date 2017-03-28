var createSound = function(type, toConnectTo) {
    var oscillator = context.createOscillator();
    oscillator.type = type;
    var gainNode = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(toConnectTo);

    var toReturn = { "source": oscillator, "gainnode": gainNode, name: "Sound " + type, sampleSound: false };

    oscillator.start(0);
    return toReturn;
};

var app = new Vue({
    el: '#app',
    data: function() {
        var highPass = context.createBiquadFilter();
        highPass.type = "highpass";
        highPass.frequency = 20000;
        highPass.connect(context.destination);

        return {
            soundObj1 : createSound("sine", highPass),
            soundObj2 : createSound("sine", highPass),
            highpasscontrol: {
                frequencyValue: highPass.frequency.value,
                qValue: highPass.Q.value,
                gainValue: highPass.gain.value,
                highPass: highPass
            }
        };
    },
    computed: {
        "frequency": {
            get: function () {
                return this.highpasscontrol.frequencyValue;
            },
            set: function (newValue) {
                this.highpasscontrol.highPass.frequency.value = newValue;
                this.highpasscontrol.frequencyValue = newValue;
            }
        },
        "q": {
            get: function () {
                return this.highpasscontrol.qValue;
            },
            set: function (newValue) {
                this.highpasscontrol.highPass.Q.value = newValue;
                this.highpasscontrol.qValue = newValue;
            }
        },
        "gain": {
            get: function () {
                return this.highpasscontrol.gainValue;
            },
            set: function (newValue) {
                this.highpasscontrol.highPass.gain.value = newValue;
                this.highpasscontrol.gainValue = newValue;
            }
        }
    }
})
