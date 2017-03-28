var app = new Vue({
    el: '#app',
    data: function() {

        var delay = context.createDelay(5);
        delay.delayTime.value = 2.5;

        delay.connect(context.destination);

        return {
            delay : delay
        };
    },
    mounted: function() {
        var that = this;

        bufferLoader = new BufferLoader(
            context,
            [
                { href: '/sounds/sms.wav', name: 'sms' }
            ],
            function(sounds) {
                sms = sounds.sms;

                var smsSound = sms.createBufferSource();
                smsSound.loop = true;
                smsSound.start(0);
                smsSound.connect(context.destination);
                smsSound.connect(that.delay);
            }
        );

        bufferLoader.load();
    },
})
