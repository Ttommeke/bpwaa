Vue.component('sound-playing-field-comp', {
    "template": `
        <div>
            <h3>PannerNodes positions</h3>
            <div style="width: 600px;height: 600px; position: relative; background-color:#0000FF;" id="pannerNodeArea" @click="moveSound">
                <div style="position: absolute; left:290px; top:290px; background-color:#00FF00">Me</div>
                <sound-on-playing-field-comp v-for="sound in sounds" v-bind:sound="sound" v-bind:x="sound.x" v-bind:z="sound.z"></sound-on-playing-field-comp>
            </div>
            <h4>Sound to move</h4>
            <p v-for="sound in sounds"><input type="radio" v-bind:value="sound" v-model="selectedSound" />{{sound.name}} x: {{sound.x}} z: {{sound.x}}</p>
        </div>
    `,
    "props": ["sounds"],
    "data": function() {
        return { selectedSound: undefined };
    },
    "methods": {
        "moveSound": function(event) {

            if (this.selectedSound != undefined) {
                this.selectedSound.panner.setPosition(event.layerX/10,0,event.layerY/10);
                this.selectedSound.x = event.layerX;
                this.selectedSound.z = event.layerY;

                this.$forceUpdate();
            }
        }
    }
});
