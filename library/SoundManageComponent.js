Vue.component('sound-comp', {
    "template": `
        <div>
            <h3>{{soundobject.name}}</h3><button @click="deleteMe">delete</button>
            <p>
                Volume (currently: <input type="number" v-model="gain" />) <input class="inputSlider" type="range" min="0" max="2" v-model="gain" step="0.01" /><br />
                Frequency (currently: <input type="number" v-model="frequency" />) <input class="inputSlider" type="range" min="0" max="20000" v-model="frequency" step="1" /><br />
                Detune (currently: <input type="number" v-model="detune" />) <input class="inputSlider" type="range" min="-5000" max="5000" v-model="detune" step="1" />
            </p>
        </div>
    `,
    "props": ["soundobject"],
    "data" : function() {
        return { gainValue : this.soundobject.gainnode.gain.value, frequencyValue : this.soundobject.source.frequency.value, detuneValue : this.soundobject.source.detune.value };
    },
    "methods": {
        "deleteMe": function() {
            this.$emit("deleteme", this.soundobject);
        }
    },
    computed: {
        "frequency": {
            get: function () {
                return this.frequencyValue;
            },
            set: function (newValue) {
                this.soundobject.source.frequency.value = newValue;
                this.frequencyValue = newValue;
            }
        },
        "gain": {
            get: function () {
                return this.gainValue;
            },
            set: function (newValue) {
                this.soundobject.gainnode.gain.value = newValue;
                this.gainValue = newValue;
            }
        },
        "detune": {
            get: function () {
                return this.detuneValue;
            },
            set: function (newValue) {
                this.soundobject.source.detune.value = newValue;
                this.detuneValue = newValue;
            }
        },
    }
});
