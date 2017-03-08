Vue.component('sound-panner-comp', {
    "template": `
        <div>
            <h3>PannerNode</h3>
            <div style="width: 300px;height: 300px; position: relative; background-color:#0000FF;" id="pannerNodeArea" @click="moveSound">
                <div ref="soundDiv" v-bind:style="soundDivStyle">Sound</div>
                <div ref="me" v-bind:style="meStyle">Me</div>
            </div>
        </div>
    `,
    "props": [],
    "data" : function() {
        return {
            soundx: 100,
            soundy: 150,
            mex: 150,
            mey: 150
        };
    },
    "methods": {
        "moveSound": function(event) {
            this.soundx = event.layerX;
            this.soundy = event.layerY;

            this.$emit("soundmoved", this.soundx, this.soundy);
        }
    },
    computed: {
        "soundDivStyle": function() {
            return "background-color:#FF0000; position: absolute; left: " + this.soundx + "px; top: " + this.soundy + "px;"
        },
        "meStyle": function() {
            return "background-color:#00FF00; position: absolute; left: " + this.mex + "px; top: " + this.mey + "px;"
        }
    }
});
