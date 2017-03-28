var sms = undefined;

var app = new Vue({
    el: '#app',
    data: function() {
        var masterGain = context.createGain();
        masterGain.connect(context.destination);

        return {
            soundObjects: [],
            gaincontrol: {
                gainValue: masterGain.gain.value,
                masterGain: masterGain
            }
        };
    },
    computed: {
        "gain": {
            get: function () {
                return this.gaincontrol.gainValue;
            },
            set: function (newValue) {
                this.gaincontrol.masterGain.gain.value = newValue;
                this.gaincontrol.gainValue = newValue;
            }
        }
    },
    mounted: function() {
        var that = this;

        var soundTypes = [];

        for (var i = 0; i < soundTypes.length; i++) {
            this.addSound(soundTypes[i]);
        }

        bufferLoader = new BufferLoader(
            context,
            [
                { href: '/sounds/sms.wav', name: 'sms' }
            ],
            function(sounds) {
                sms = sounds.sms;
            }
        );

        bufferLoader.load();
    },
    methods: {
        deleteSound : function(soundObject) {
            var index = this.soundObjects.indexOf(soundObject);

            soundObject.gainnode.disconnect();
            soundObject.source.disconnect();

            this.soundObjects.splice(index,1);
        },
        addSound : function(type) {
            var oscillator = context.createOscillator();
            oscillator.type = type;
            var gainNode = context.createGain();

            oscillator.connect(gainNode);
            this.soundObjects.push({ "source": oscillator, "gainnode": gainNode, name: "Sound " + type, sampleSound: false });
            gainNode.connect(this.gaincontrol.masterGain);

            oscillator.start(0);
        },
        addSMSSoundLoop : function() {
            var smsSound = sms.createBufferSource();
            smsSound.loop = true;
            var gainNode = context.createGain();
            smsSound.connect(gainNode);
            gainNode.connect(this.gaincontrol.masterGain);

            smsSound.start(0);

            this.soundObjects.push({ "source": smsSound, "gainnode": gainNode, name: "SMS sound", sampleSound: true });
        }
    }
})
