Vue.component('show-sound-location-comp', {
    "template": `
        <div>
            <h3>Position sound</h3>
            <div style="width: 600px;height: 600px; position: relative; background-color:#0000FF;" id="pannerNodeArea">
                <div ref="soundDiv" v-bind:style="soundDivStyle">Sound</div>
                <div ref="me" v-bind:style="meStyle">Me</div>
            </div>
        </div>
    `,
    "props": ["x","z"],
    "data" : function() {
        return {
            mex: 300,
            mey: 300
        };
    },
    computed: {
        "soundDivStyle": function() {
            return "background-color:#FF0000; position: absolute; left: " + (this.x-20) + "px; top: " + (this.z-10) + "px;"
        },
        "meStyle": function() {
            return "background-color:#00FF00; position: absolute; left: " + (this.mex-10) + "px; top: " + (this.mey-10) + "px;"
        }
    }
});
