Vue.component('sound-on-playing-field-comp', {
    "template": `
        <div v-bind:style="soundStyle"><img style="width: 20px; height:20px;" src="/images/cancel.svg" />{{sound.name}}</div>
    `,
    "props": ["sound","x","z"],
    "data" : function() {
        return {

        };
    },
    "computed": {
        "soundStyle" : function() {
            return " position: absolute; left: " + (this.x-10) + "px; top: " + (this.z-10) + "px;"
        }
    }
});
