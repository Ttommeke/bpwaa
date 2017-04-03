Vue.component('streamset-comp', {
    "template": `
        <div>
            <h4>Streamset {{streamset.id}} of type: {{streamset.contentType}}</h4> <button @click="download">Play and download</button>
            <stream-comp v-bind:stream="stream" v-for="stream in streamset.streamInfos" :key="stream.bandwidth"></stream-comp>
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
            /*Vue.http.get(this.streamset).then(function(resp) {
                console.log(resp);
            });*/
            console.log(this.streamset);
            console.log(this.streamset.id);
        },
        "play":  function() {

        }
    }
});
