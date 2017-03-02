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
        var lowPass = context.createBiquadFilter();
        lowPass.type = "lowpass";
        lowPass.frequency = 20000;
        lowPass.connect(context.destination);

        return {
            soundObj1 : createSound("sine", lowPass),
            soundObj2 : createSound("sine", lowPass),
            lowpasscontrol: {
                frequencyValue: lowPass.frequency.value,
                qValue: lowPass.Q.value,
                gainValue: lowPass.gain.value,
                lowPass: lowPass
            }
        };
    },
    computed: {
        "frequency": {
            get: function () {
                return this.lowpasscontrol.frequencyValue;
            },
            set: function (newValue) {
                this.lowpasscontrol.lowPass.frequency.value = newValue;
                this.lowpasscontrol.frequencyValue = newValue;
            }
        },
        "q": {
            get: function () {
                return this.lowpasscontrol.qValue;
            },
            set: function (newValue) {
                this.lowpasscontrol.lowPass.Q.value = newValue;
                this.lowpasscontrol.qValue = newValue;
            }
        },
        "gain": {
            get: function () {
                return this.lowpasscontrol.gainValue;
            },
            set: function (newValue) {
                this.lowpasscontrol.lowPass.gain.value = newValue;
                this.lowpasscontrol.gainValue = newValue;
            }
        }
    }
})
