Vue.component('streamset-comp', {
    "template": `
        <div>
            <h4>Streamset {{streamset.id}} of type: {{streamset.contentType}}</h4><input type="checkbox" v-model="streamset.active"><label>Playing: {{streamset.active}}</label>
            <br/>Streams:
            <ul>
                <stream-comp v-bind:stream="stream" v-for="stream in streamset.streams" :key="stream.bandwidth"></stream-comp>
            </ul>
        </div>
    `,
    "props": ["streamset"],
    "data" : function() {
        return {
            buffer : undefined
        };
    },
    "methods" : {
        "download": function() {
            var that = this;

            that.streamset.fetchStream().then(function(stream) {
                context.decodeAudioData(stream, function(streamDecoded) {
                    var source = context.createBufferSource();
                    source.buffer = streamDecoded;

                    source.connect(context.destination);

                    source.start();
                });
            });
        }
    }
});
