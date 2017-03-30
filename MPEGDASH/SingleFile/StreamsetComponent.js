Vue.component('streamset-comp', {
    "template": `
        <div>
            <h4>Streamset {{name}} of type: {{streamset.contentType}}</h4> <button @click="download">Play and download</button>
        </div>
    `,
    "props": ["streamset", "name"],
    "data" : function() {
        return {
            buffer : undefined
        };
    },
    "methods" : {
        "download": function() {
            Vue.http.get(this.streamset).then(function(resp) {
                console.log(resp);
            });
        },
        "play":  function() {

        }
    }
});
