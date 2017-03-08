Vue.component('sound-location-comp', {
    "template": `
        <div>
            <h3>PannerNode</h3>
            <div style="width: 600px;height: 600px; position: relative; background-color:#0000FF;" id="pannerNodeArea" @click="moveSound">
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
            mex: 300,
            mey: 300
        };
    },
    "methods": {
        "moveSound": function(event) {
            this.soundx = event.layerX;
            this.soundy = event.layerY;

            this.$emit("soundmoved", this.soundx, this.soundy);
        },
        "moveMe": function(event) {
            this.mex = event.layerX;
            this.mey = event.layerY;

            this.$emit("memoved", this.mex, this.mey);
        }
    },
    computed: {
        "soundDivStyle": function() {
            return "background-color:#FF0000; position: absolute; left: " + (this.soundx-20) + "px; top: " + (this.soundy-10) + "px;"
        },
        "meStyle": function() {
            return "background-color:#00FF00; position: absolute; left: " + (this.mex-10) + "px; top: " + (this.mey-10) + "px;"
        }
    }
});
