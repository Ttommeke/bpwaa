var sms;

var app = new Vue({
    el: '#app',
    data: function() {
        var splitter = context.createChannelSplitter();
        var delayNode = context.createDelay(1);
        var merger = context.createChannelMerger();

        splitter.connect(delayNode,0);
        splitter.connect(merger,1,1);
        delayNode.connect(merger,0,0);
        merger.connect(context.destination);

        return {
            splitter : splitter,
            soundObj1 : undefined,
            delaycontrol: {
                delayValue: delayNode.delayTime.value,
                delayNode: delayNode
            }
        };
    },
    computed: {
        "delay": {
            get: function () {
                return this.delaycontrol.delayValue;
            },
            set: function (newValue) {
                this.delaycontrol.delayNode.delayTime.value = newValue;
                this.delaycontrol.delayValue = newValue;
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

                that.addSMSSoundLoop();
            }
        );

        bufferLoader.load();
    },
    methods: {
        addSMSSoundLoop : function() {
            var smsSound = sms.createBufferSource();
            smsSound.loop = true;
            var gainNode = context.createGain();
            smsSound.connect(gainNode);
            gainNode.connect(this.splitter);

            smsSound.start(0);

            this.soundObj1 = { "source": smsSound, "gainnode": gainNode, name: "SMS sound", sampleSound: true };
        }
    }
})
