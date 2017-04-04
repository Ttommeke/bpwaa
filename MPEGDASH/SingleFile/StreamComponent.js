Vue.component('stream-comp', {
    "template": `
        <div>
            <h5>Stream bandwidth: {{stream.streamObj.bandwidth}} url: {{this.stream.url}}</h5>
        </div>
    `,
    "props": ["stream"],
    "data" : function() {

        return {
            buffer : undefined
        };
    },
    "methods" : {
        "download": function() {
        }
    }
});
