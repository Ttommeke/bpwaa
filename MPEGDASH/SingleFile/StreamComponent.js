Vue.component('stream-comp', {
    "template": `
        <div>
            <h5>Stream bandwidth: {{stream.bandwidth}} url: {{stream.mediaUrl}}</h5><button @click="download">download</button>
        </div>
    `,
    "props": ["stream"],
    "data" : function() {
        console.log(this.stream);

        return {
            buffer : undefined
        };
    },
    "methods" : {
        "download": function() {
            var that = this;

            console.log("try downloading...");

            this.stream.fetchSegmentInitialization_().then(function(resp) {
                that.stream.getSegmentInitializationData().then(function(resp2) {
                    console.log("succes!");
                    console.log(resp2);
                });
                console.log();
                console.log("succes!");
                console.log(resp);
            }, function(error) {
                console.log("fail");
                console.log(error);
            });
        }
    }
});
